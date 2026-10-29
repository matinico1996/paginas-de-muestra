/**
 * ============================================================
 * VERDE VIDA VIVERO — Integración con Mercado Pago
 * ============================================================
 *
 * GUÍA DE CONFIGURACIÓN / SETUP
 * ──────────────────────────────
 *
 * 1. CREAR UNA CUENTA EN MERCADO PAGO DEVELOPERS:
 *    → https://www.mercadopago.com.ar/developers
 *    → Registrate o iniciá sesión con tu cuenta de Mercado Pago.
 *
 * 2. OBTENER TUS CREDENCIALES:
 *    → Andá a "Tus integraciones" → Crear aplicación
 *    → Copiá tu PUBLIC_KEY y tu ACCESS_TOKEN
 *    → Reemplazá 'YOUR_PUBLIC_KEY' en este archivo por tu Public Key real.
 *
 * 3. CONFIGURAR EL BACKEND:
 *    → Necesitás un servidor (Node.js, Python, PHP, etc.) que reciba
 *      los datos del carrito y cree una "preferencia de pago" usando
 *      el SDK de Mercado Pago del lado del servidor.
 *    → Endpoint recomendado: POST /create_preference
 *    → El backend debe usar el ACCESS_TOKEN (nunca lo expongas en el frontend).
 *    → Documentación: https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/landing
 *
 * 4. ACTUALIZAR LA URL DEL BACKEND:
 *    → Cambiá la constante BACKEND_URL por la URL de tu servidor.
 *    → Ejemplo: 'https://tu-servidor.com/create_preference'
 *
 * 5. FLUJO DE PAGO:
 *    → El cliente agrega productos al carrito.
 *    → Al hacer clic en "Pagar con Mercado Pago", se envían los items
 *      al backend, que crea una preferencia y devuelve un init_point.
 *    → Se redirige al cliente a Mercado Pago para completar el pago.
 *    → Mercado Pago redirige de vuelta a tu sitio con el resultado.
 *
 * ============================================================
 */

// ==================== CONFIGURACIÓN ====================

/**
 * IMPORTANTE: Reemplazá 'YOUR_PUBLIC_KEY' con tu Public Key real de Mercado Pago.
 * La encontrás en: https://www.mercadopago.com.ar/developers/panel/app
 */
const MP_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

/**
 * URL de tu backend que crea la preferencia de pago.
 * Cambiá esta URL por la de tu servidor real.
 */
const BACKEND_URL = '/create_preference';

// ==================== ESTADO DEL CARRITO ====================

let cart = [];

// Intentar recuperar carrito guardado en localStorage
try {
    const savedCart = localStorage.getItem('verdeVidaCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
} catch (e) {
    console.warn('No se pudo recuperar el carrito guardado:', e);
}

// ==================== ELEMENTOS DEL DOM ====================

const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartFooter = document.getElementById('cartFooter');
const cartCount = document.getElementById('cartCount');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartShipping = document.getElementById('cartShipping');
const cartTotal = document.getElementById('cartTotal');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const productsGrid = document.getElementById('productsGrid');
const scrollTopBtn = document.getElementById('scrollTop');
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const contactForm = document.getElementById('contactForm');

// ==================== EMOJIS POR PRODUCTO ====================

const productEmojis = {
    1: '🌿', 2: '🌴', 3: '🍃', 4: '🌱',
    5: '🌺', 6: '🌹', 7: '🌻', 8: '🌳',
    9: '🪴', 10: '🌵', 11: '💚', 12: '🌸',
    13: '🌿', 14: '🌺', 15: '🌵'
};

// ==================== INICIALIZACIÓN ====================

document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    updateCartUI();
    initScrollEffects();
    initFilterButtons();
    initIntersectionObserver();
});

// ==================== EVENT LISTENERS ====================

function initEventListeners() {
    // Abrir/cerrar carrito
    cartBtn.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Botones de agregar al carrito
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', handleAddToCart);
    });

    // Vaciar carrito
    clearCartBtn.addEventListener('click', clearCart);

    // Pagar con Mercado Pago
    checkoutBtn.addEventListener('click', handleCheckout);

    // Hamburger menu
    hamburger.addEventListener('click', toggleMobileMenu);

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Formulario de contacto
    contactForm.addEventListener('submit', handleContactForm);

    // Scroll to top
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Cerrar carrito con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCart();
    });
}

// ==================== CARRITO: AGREGAR PRODUCTO ====================

function handleAddToCart(e) {
    const btn = e.currentTarget;
    const id = parseInt(btn.dataset.id);
    const name = btn.dataset.name;
    const price = parseInt(btn.dataset.price);

    addToCart(id, name, price);

    // Animación del botón
    btn.style.transform = 'scale(0.9)';
    setTimeout(() => { btn.style.transform = ''; }, 150);
}

function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id,
            name,
            price,
            quantity: 1,
            emoji: productEmojis[id] || '🌿'
        });
    }

    saveCart();
    updateCartUI();
    showToast(`"${name}" agregado al carrito`);
    animateCartBadge();
}

// ==================== CARRITO: ELIMINAR PRODUCTO ====================

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

// ==================== CARRITO: ACTUALIZAR CANTIDAD ====================

function updateQuantity(id, delta) {
    const item = cart.find(item => item.id === id);
    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        removeFromCart(id);
        return;
    }

    saveCart();
    updateCartUI();
}

// ==================== CARRITO: VACIAR ====================

function clearCart() {
    if (cart.length === 0) return;

    // Confirmar antes de vaciar
    if (confirm('¿Estás seguro de que querés vaciar el carrito?')) {
        cart = [];
        saveCart();
        updateCartUI();
        showToast('Carrito vaciado');
    }
}

// ==================== CARRITO: GUARDAR EN LOCALSTORAGE ====================

function saveCart() {
    try {
        localStorage.setItem('verdeVidaCart', JSON.stringify(cart));
    } catch (e) {
        console.warn('No se pudo guardar el carrito:', e);
    }
}

// ==================== CARRITO: ACTUALIZAR UI ====================

function updateCartUI() {
    // Actualizar badge del contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Mostrar/ocultar elementos según si hay items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-basket"></i>
                <p>Tu carrito está vacío</p>
                <span>¡Agregá plantas para comenzar!</span>
            </div>
        `;
        cartFooter.style.display = 'none';
        return;
    }

    // Renderizar items
    cartFooter.style.display = 'flex';
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">${item.emoji}</div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toLocaleString('es-AR')}</div>
                <div class="cart-item-actions">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)" aria-label="Reducir cantidad">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="cart-item-qty">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)" aria-label="Aumentar cantidad">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})" aria-label="Eliminar">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Calcular totales
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const envioGratis = subtotal >= 15000;
    const envio = envioGratis ? 0 : 2500;
    const total = subtotal + envio;

    cartSubtotal.textContent = `$${subtotal.toLocaleString('es-AR')}`;
    cartShipping.textContent = envioGratis ? '¡Gratis!' : `$${envio.toLocaleString('es-AR')}`;
    cartShipping.style.color = envioGratis ? '#4caf50' : '';
    cartTotal.textContent = `$${total.toLocaleString('es-AR')}`;
}

// ==================== CARRITO: ABRIR/CERRAR ====================

function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ==================== ANIMACIÓN BADGE DEL CARRITO ====================

function animateCartBadge() {
    cartCount.classList.add('bump');
    setTimeout(() => cartCount.classList.remove('bump'), 300);
}

// ==================== MERCADO PAGO: CHECKOUT ====================

/**
 * Función principal de checkout.
 * Cuando se configure el backend real, esta función enviará los datos
 * del carrito al servidor para crear una preferencia de pago.
 */
async function handleCheckout() {
    if (cart.length === 0) {
        showToast('Tu carrito está vacío');
        return;
    }

    // Verificar si el backend está configurado
    if (BACKEND_URL === '/create_preference' && MP_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        // Modo demo: mostrar información de configuración
        showCheckoutDemo();
        return;
    }

    try {
        // Crear la preferencia de pago en el backend
        const preference = await createPreference();

        if (preference && preference.id) {
            // Inicializar Mercado Pago y redirigir al checkout
            redirectToCheckout(preference.id);
        }
    } catch (error) {
        console.error('Error en el checkout:', error);
        showToast('Error al procesar el pago. Intentá de nuevo.');
    }
}

/**
 * Crea una preferencia de pago enviando los items del carrito al backend.
 *
 * El backend debe:
 * 1. Recibir los items del carrito (POST JSON).
 * 2. Crear una preferencia usando el SDK de Mercado Pago con el ACCESS_TOKEN.
 * 3. Devolver el objeto de preferencia con el "id" y/o "init_point".
 *
 * Ejemplo de body que se envía:
 * {
 *   "items": [
 *     { "title": "Potus Dorado", "quantity": 2, "unit_price": 4500, "currency_id": "ARS" },
 *     { "title": "Monstera Deliciosa", "quantity": 1, "unit_price": 9200, "currency_id": "ARS" }
 *   ],
 *   "payer": { ... }  // Opcional: datos del comprador
 * }
 */
async function createPreference() {
    // Preparar los items en el formato que espera Mercado Pago
    const items = cart.map(item => ({
        title: item.name,
        description: `Planta - ${item.name} | Verde Vida Vivero`,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: 'ARS'
    }));

    // Agregar costo de envío si corresponde
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (subtotal < 15000) {
        items.push({
            title: 'Costo de envío',
            description: 'Envío estándar - Verde Vida Vivero',
            quantity: 1,
            unit_price: 2500,
            currency_id: 'ARS'
        });
    }

    // Enviar al backend
    const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            items: items,
            // URLs de retorno (configurar con tu dominio)
            back_urls: {
                success: window.location.origin + '/pago-exitoso',
                failure: window.location.origin + '/pago-fallido',
                pending: window.location.origin + '/pago-pendiente'
            },
            auto_return: 'approved',
            // Información adicional
            external_reference: `VVV-${Date.now()}`,
            notification_url: window.location.origin + '/webhook/mercadopago'
        })
    });

    if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
    }

    return await response.json();
}

/**
 * Inicializa el SDK de Mercado Pago y redirige al checkout.
 * Requiere que el SDK esté cargado: <script src="https://sdk.mercadopago.com/js/v2"></script>
 */
function redirectToCheckout(preferenceId) {
    // Verificar que el SDK de Mercado Pago esté cargado
    if (typeof MercadoPago === 'undefined') {
        console.error('El SDK de Mercado Pago no está cargado.');
        showToast('Error: SDK de Mercado Pago no disponible.');
        return;
    }

    // Inicializar Mercado Pago con la Public Key
    const mp = new MercadoPago(MP_PUBLIC_KEY, {
        locale: 'es-AR'
    });

    // Crear el checkout y redirigir
    mp.checkout({
        preference: {
            id: preferenceId
        },
        autoOpen: true  // Abrir automáticamente el checkout de Mercado Pago
    });
}

/**
 * Modo demo: muestra un alert explicativo cuando no hay backend configurado.
 * Esto permite probar el flujo del carrito sin necesidad de un servidor real.
 */
function showCheckoutDemo() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const envioGratis = subtotal >= 15000;
    const envio = envioGratis ? 0 : 2500;
    const total = subtotal + envio;

    const itemsList = cart.map(item =>
        `  • ${item.name} × ${item.quantity} = $${(item.price * item.quantity).toLocaleString('es-AR')}`
    ).join('\n');

    const mensaje = `
🛒 RESUMEN DEL PEDIDO — Verde Vida Vivero
${'═'.repeat(45)}

${itemsList}
${!envioGratis ? `  • Envío estándar = $${envio.toLocaleString('es-AR')}` : '  • Envío: ¡GRATIS! 🎉'}

${'─'.repeat(45)}
💰 TOTAL: $${total.toLocaleString('es-AR')}
${'═'.repeat(45)}

⚙️ PASOS PARA ACTIVAR MERCADO PAGO:

1. Obtené tus credenciales en:
   mercadopago.com.ar/developers

2. Reemplazá 'YOUR_PUBLIC_KEY' en js/mercadopago.js

3. Configurá un backend con el endpoint
   POST /create_preference

4. Actualizá BACKEND_URL con la URL de tu servidor

📖 Documentación completa:
   mercadopago.com.ar/developers/es/docs
    `.trim();

    alert(mensaje);
}

// ==================== INICIALIZAR MERCADO PAGO ====================

/**
 * Inicializa el SDK de Mercado Pago.
 * Llamar esta función cuando la página cargue si querés
 * usar el Checkout Pro embebido (Brick).
 */
function initMercadoPago() {
    if (MP_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        console.info(
            '%c🌿 Verde Vida Vivero — Mercado Pago',
            'color: #2d6a3e; font-size: 14px; font-weight: bold;',
            '\n\nPara activar los pagos, configurá tu PUBLIC_KEY en js/mercadopago.js',
            '\nMás info: https://www.mercadopago.com.ar/developers/es/docs'
        );
        return null;
    }

    if (typeof MercadoPago === 'undefined') {
        console.warn('SDK de Mercado Pago no cargado. Verificá el script en el HTML.');
        return null;
    }

    return new MercadoPago(MP_PUBLIC_KEY, { locale: 'es-AR' });
}

// Intentar inicializar al cargar
initMercadoPago();

// ==================== NOTIFICACIÓN TOAST ====================

function showToast(message) {
    // Remover toast anterior si existe
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(toast);

    // Mostrar con animación
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Ocultar después de 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ==================== MENÚ MÓVIL ====================

function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// ==================== EFECTOS DE SCROLL ====================

function initScrollEffects() {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Navbar scrolled
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Botón scroll top
        if (scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }

        // Resaltar nav activo según sección
        updateActiveNavLink();
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ==================== FILTRO DE PRODUCTOS ====================

function initFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Actualizar botón activo
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filtrar productos con animación
            productCards.forEach(card => {
                const category = card.dataset.category;

                if (filter === 'todas' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// ==================== INTERSECTION OBSERVER (Animaciones al scroll) ====================

function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar las secciones para animarlas al entrar en el viewport
    document.querySelectorAll('.benefit-card, .care-card, .offer-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// ==================== FORMULARIO DE CONTACTO ====================

function handleContactForm(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // En un sitio real, acá enviarías los datos al servidor
    console.log('Datos del formulario:', data);

    showToast('¡Mensaje enviado! Te responderemos pronto 🌿');
    e.target.reset();
}

// ==================== SMOOTH SCROLL PARA LINKS INTERNOS ====================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Altura del navbar
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});
