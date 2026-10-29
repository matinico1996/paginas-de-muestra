/* ============================================================
   URBAN STYLE - Sistema de Carrito y Mercado Pago
   ============================================================
   
   *** GUÍA DE CONFIGURACIÓN / README ***
   
   Este archivo contiene el sistema completo de carrito de compras
   y la integración con Mercado Pago para la tienda URBAN STYLE.
   
   PASOS PARA CONFIGURAR MERCADO PAGO:
   
   1. Crear una cuenta en https://www.mercadopago.com.ar/developers
   
   2. Obtener tus credenciales:
      - PUBLIC_KEY: Se usa en el frontend (este archivo)
      - ACCESS_TOKEN: Se usa SOLO en el backend (nunca exponerlo aquí)
   
   3. Reemplazar 'YOUR_PUBLIC_KEY' en la línea de inicialización
      con tu Public Key real de Mercado Pago.
   
   4. Configurar un backend (Node.js, Python, PHP, etc.) que tenga
      un endpoint POST '/create_preference' que:
      - Reciba los items del carrito
      - Use el ACCESS_TOKEN para crear una preferencia de pago
      - Devuelva el ID de la preferencia o la URL de checkout
   
   5. Actualizar la variable BACKEND_URL con la URL de tu servidor.
   
   EJEMPLO de endpoint en Node.js (Express):
   
   const mercadopago = require('mercadopago');
   mercadopago.configure({ access_token: 'TU_ACCESS_TOKEN' });
   
   app.post('/create_preference', async (req, res) => {
     const { items } = req.body;
     const preference = {
       items: items.map(item => ({
         title: item.name,
         unit_price: item.price,
         quantity: item.quantity,
         currency_id: 'ARS'
       })),
       back_urls: {
         success: 'https://tutienda.com/success',
         failure: 'https://tutienda.com/failure',
         pending: 'https://tutienda.com/pending'
       },
       auto_return: 'approved'
     };
     const response = await mercadopago.preferences.create(preference);
     res.json({ id: response.body.id, init_point: response.body.init_point });
   });
   
   ============================================================ */

// ============================================================
// CONFIGURACIÓN - Modificar estos valores con tus datos reales
// ============================================================

// Tu Public Key de Mercado Pago (reemplazar con la real)
const MP_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

// URL de tu backend donde se crea la preferencia de pago
// Ejemplo: 'https://mi-backend.com/create_preference'
const BACKEND_URL = '/create_preference';

// ============================================================
// CATÁLOGO DE PRODUCTOS
// ============================================================

const PRODUCTOS = [
  // --- MUJER ---
  {
    id: 1,
    nombre: 'Remera Oversize Premium',
    descripcion: 'Algodón pima 100%. Corte relajado y moderno.',
    precio: 18500,
    categoria: 'mujer',
    icono: 'fa-solid fa-shirt',
    colorBg: 'linear-gradient(135deg, #B76E79, #d4a0a7)',
    badge: 'new'
  },
  {
    id: 2,
    nombre: 'Jean Mom Fit Negro',
    descripcion: 'Tiro alto, corte mom. Denim premium stretch.',
    precio: 35900,
    categoria: 'mujer',
    icono: 'fa-solid fa-person-dress',
    colorBg: 'linear-gradient(135deg, #2d2d2d, #4a4a4a)',
    badge: null
  },
  {
    id: 3,
    nombre: 'Vestido Midi Elegante',
    descripcion: 'Corte A-line. Perfecto para toda ocasión.',
    precio: 42000,
    categoria: 'mujer',
    icono: 'fa-solid fa-person-dress',
    colorBg: 'linear-gradient(135deg, #8f545d, #B76E79)',
    badge: 'new'
  },
  {
    id: 4,
    nombre: 'Campera Eco-Leather',
    descripcion: 'Cuero ecológico premium. Forro interior suave.',
    precio: 67500,
    categoria: 'mujer',
    icono: 'fa-solid fa-vest',
    colorBg: 'linear-gradient(135deg, #1a1a1a, #3d3d3d)',
    badge: null
  },
  // --- HOMBRE ---
  {
    id: 5,
    nombre: 'Remera Essential Logo',
    descripcion: 'Jersey de algodón. Estampa exclusiva URBAN.',
    precio: 15900,
    categoria: 'hombre',
    icono: 'fa-solid fa-shirt',
    colorBg: 'linear-gradient(135deg, #3d3d3d, #5a5a5a)',
    badge: null
  },
  {
    id: 6,
    nombre: 'Pantalón Cargo Relaxed',
    descripcion: 'Gabardina resistente. Múltiples bolsillos.',
    precio: 32500,
    categoria: 'hombre',
    icono: 'fa-solid fa-person',
    colorBg: 'linear-gradient(135deg, #4a5a3a, #6b7a5a)',
    badge: 'new'
  },
  {
    id: 7,
    nombre: 'Camisa Lino Natural',
    descripcion: 'Lino puro. Ideal para verano y media estación.',
    precio: 28900,
    categoria: 'hombre',
    icono: 'fa-solid fa-shirt',
    colorBg: 'linear-gradient(135deg, #c4a882, #e0cbb0)',
    badge: null
  },
  {
    id: 8,
    nombre: 'Campera Puffer Urbana',
    descripcion: 'Relleno térmico. Capucha desmontable.',
    precio: 72000,
    categoria: 'hombre',
    icono: 'fa-solid fa-vest',
    colorBg: 'linear-gradient(135deg, #0a0a0a, #2d2d2d)',
    badge: null
  },
  // --- ACCESORIOS ---
  {
    id: 9,
    nombre: 'Gorra Snapback Urban',
    descripcion: 'Bordado 3D. Ajuste regulable snapback.',
    precio: 12500,
    categoria: 'accesorios',
    icono: 'fa-solid fa-hat-cowboy',
    colorBg: 'linear-gradient(135deg, #1a1a1a, #333)',
    badge: null
  },
  {
    id: 10,
    nombre: 'Mochila Roll-Top',
    descripcion: 'Tela impermeable. Compartimento notebook 15".',
    precio: 45000,
    categoria: 'accesorios',
    icono: 'fa-solid fa-bag-shopping',
    colorBg: 'linear-gradient(135deg, #2d2d2d, #555)',
    badge: 'new'
  },
  {
    id: 11,
    nombre: 'Cinturón Cuero Genuino',
    descripcion: 'Cuero curtido vegetal. Hebilla metálica.',
    precio: 16900,
    categoria: 'accesorios',
    icono: 'fa-solid fa-ring',
    colorBg: 'linear-gradient(135deg, #5a3a2a, #8a6a5a)',
    badge: null
  },
  {
    id: 12,
    nombre: 'Bufanda Lana Merino',
    descripcion: 'Lana merino extra suave. Tejido artesanal.',
    precio: 19500,
    categoria: 'accesorios',
    icono: 'fa-solid fa-scarf',
    colorBg: 'linear-gradient(135deg, #B76E79, #8f545d)',
    badge: null
  }
];

// Productos en oferta (con descuento)
const OFERTAS = [
  {
    id: 101,
    nombre: 'Hoodie Urban Classic',
    descripcion: 'Algodón fleece. Capucha con cordón ajustable.',
    precioOriginal: 38000,
    precioOferta: 26600,
    descuento: 30,
    categoria: 'hombre',
    icono: 'fa-solid fa-shirt',
    colorBg: 'linear-gradient(135deg, #2d2d2d, #4a4a4a)'
  },
  {
    id: 102,
    nombre: 'Falda Plisada Midi',
    descripcion: 'Tela satinada. Cintura elástica. Caída fluida.',
    precioOriginal: 29000,
    precioOferta: 17400,
    descuento: 40,
    categoria: 'mujer',
    icono: 'fa-solid fa-person-dress',
    colorBg: 'linear-gradient(135deg, #B76E79, #d4a0a7)'
  },
  {
    id: 103,
    nombre: 'Riñonera Street Pack',
    descripcion: 'Nylon resistente. Cierre premium YKK.',
    precioOriginal: 22000,
    precioOferta: 15400,
    descuento: 30,
    categoria: 'accesorios',
    icono: 'fa-solid fa-bag-shopping',
    colorBg: 'linear-gradient(135deg, #1a1a1a, #3d3d3d)'
  }
];

// ============================================================
// ESTADO DEL CARRITO
// ============================================================

let carrito = [];

// Intentar cargar carrito guardado en localStorage
function cargarCarritoGuardado() {
  try {
    const guardado = localStorage.getItem('urbanstyle_carrito');
    if (guardado) {
      carrito = JSON.parse(guardado);
    }
  } catch (e) {
    console.warn('No se pudo cargar el carrito guardado:', e);
    carrito = [];
  }
}

// Guardar carrito en localStorage
function guardarCarrito() {
  try {
    localStorage.setItem('urbanstyle_carrito', JSON.stringify(carrito));
  } catch (e) {
    console.warn('No se pudo guardar el carrito:', e);
  }
}

// ============================================================
// RENDERIZADO DE PRODUCTOS
// ============================================================

function renderizarProductos() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  grid.innerHTML = PRODUCTOS.map(prod => `
    <div class="product-card" data-categoria="${prod.categoria}" data-id="${prod.id}">
      ${prod.badge ? `<span class="product-badge ${prod.badge}">${prod.badge === 'new' ? 'Nuevo' : prod.badge}</span>` : ''}
      <div class="product-image" style="background: ${prod.colorBg}">
        <i class="${prod.icono}"></i>
        <div class="product-image-overlay">
          <button class="quick-view-btn">Vista Rápida</button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category">${prod.categoria}</div>
        <h3 class="product-name">${prod.nombre}</h3>
        <p class="product-description">${prod.descripcion}</p>
        <div class="product-price">
          <span class="current-price">$${prod.precio.toLocaleString('es-AR')}</span>
        </div>
        <div class="size-selector">
          <label>Talle:</label>
          ${['S', 'M', 'L', 'XL'].map((t, i) => `
            <button class="size-btn ${i === 1 ? 'selected' : ''}" data-size="${t}" onclick="seleccionarTalle(this)">${t}</button>
          `).join('')}
        </div>
        <button class="add-to-cart-btn" onclick="agregarAlCarrito(${prod.id})">
          <i class="fa-solid fa-cart-plus"></i> Agregar al Carrito
        </button>
      </div>
    </div>
  `).join('');
}

function renderizarOfertas() {
  const grid = document.getElementById('ofertas-grid');
  if (!grid) return;

  grid.innerHTML = OFERTAS.map(prod => `
    <div class="oferta-card" data-id="${prod.id}">
      <div class="oferta-image" style="background: ${prod.colorBg}">
        <i class="${prod.icono}"></i>
        <div class="oferta-discount-badge">-${prod.descuento}%</div>
      </div>
      <div class="oferta-info">
        <div class="product-category">${prod.categoria}</div>
        <h3 class="product-name">${prod.nombre}</h3>
        <p class="product-description">${prod.descripcion}</p>
        <div class="oferta-prices">
          <span class="sale-price">$${prod.precioOferta.toLocaleString('es-AR')}</span>
          <span class="old-price">$${prod.precioOriginal.toLocaleString('es-AR')}</span>
        </div>
        <div class="size-selector">
          <label>Talle:</label>
          ${['S', 'M', 'L', 'XL'].map((t, i) => `
            <button class="size-btn ${i === 1 ? 'selected' : ''}" data-size="${t}" onclick="seleccionarTalle(this)">${t}</button>
          `).join('')}
        </div>
        <button class="oferta-add-btn" onclick="agregarOfertaAlCarrito(${prod.id})">
          <i class="fa-solid fa-cart-plus"></i> Agregar al Carrito
        </button>
      </div>
    </div>
  `).join('');
}

// ============================================================
// SELECCIÓN DE TALLE
// ============================================================

function seleccionarTalle(btn) {
  // Deseleccionar hermanos
  const hermanos = btn.parentElement.querySelectorAll('.size-btn');
  hermanos.forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

// Obtener el talle seleccionado de una card
function obtenerTalleSeleccionado(cardElement) {
  const selected = cardElement.querySelector('.size-btn.selected');
  return selected ? selected.dataset.size : 'M';
}

// ============================================================
// GESTIÓN DEL CARRITO
// ============================================================

function agregarAlCarrito(productoId) {
  const producto = PRODUCTOS.find(p => p.id === productoId);
  if (!producto) return;

  const card = document.querySelector(`.product-card[data-id="${productoId}"]`);
  const talle = obtenerTalleSeleccionado(card);

  // Buscar si ya existe con el mismo id y talle
  const existente = carrito.find(item => item.id === productoId && item.talle === talle);

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      talle: talle,
      cantidad: 1,
      icono: producto.icono,
      colorBg: producto.colorBg
    });
  }

  guardarCarrito();
  actualizarCarritoUI();
  mostrarToast(`"${producto.nombre}" (Talle ${talle}) agregado al carrito`);

  // Efecto visual en el botón
  const btn = card.querySelector('.add-to-cart-btn');
  btn.classList.add('added');
  btn.innerHTML = '<i class="fa-solid fa-check"></i> Agregado';
  setTimeout(() => {
    btn.classList.remove('added');
    btn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Agregar al Carrito';
  }, 1500);
}

function agregarOfertaAlCarrito(productoId) {
  const producto = OFERTAS.find(p => p.id === productoId);
  if (!producto) return;

  const card = document.querySelector(`.oferta-card[data-id="${productoId}"]`);
  const talle = obtenerTalleSeleccionado(card);

  const existente = carrito.find(item => item.id === productoId && item.talle === talle);

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precioOferta,
      talle: talle,
      cantidad: 1,
      icono: producto.icono,
      colorBg: producto.colorBg
    });
  }

  guardarCarrito();
  actualizarCarritoUI();
  mostrarToast(`"${producto.nombre}" (Talle ${talle}) agregado al carrito`);
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  actualizarCarritoUI();
}

function cambiarCantidad(index, delta) {
  carrito[index].cantidad += delta;
  if (carrito[index].cantidad <= 0) {
    eliminarDelCarrito(index);
    return;
  }
  guardarCarrito();
  actualizarCarritoUI();
}

function vaciarCarrito() {
  if (carrito.length === 0) return;
  
  if (confirm('¿Estás seguro/a de que querés vaciar el carrito?')) {
    carrito = [];
    guardarCarrito();
    actualizarCarritoUI();
    mostrarToast('Carrito vaciado');
  }
}

function calcularSubtotal() {
  return carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
}

function calcularCantidadTotal() {
  return carrito.reduce((sum, item) => sum + item.cantidad, 0);
}

// ============================================================
// ACTUALIZACIÓN DE LA UI DEL CARRITO
// ============================================================

function actualizarCarritoUI() {
  actualizarBadge();
  renderizarItemsCarrito();
  actualizarTotales();
}

function actualizarBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;

  const total = calcularCantidadTotal();
  badge.textContent = total;
  badge.classList.toggle('hidden', total === 0);
  
  if (total > 0) {
    badge.style.animation = 'none';
    badge.offsetHeight; // reflow
    badge.style.animation = 'badgePop 0.3s ease';
  }
}

function renderizarItemsCarrito() {
  const container = document.getElementById('cart-items');
  if (!container) return;

  if (carrito.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <i class="fa-solid fa-bag-shopping"></i>
        <p>Tu carrito está vacío</p>
        <p style="font-size: 0.8rem; margin-top: 8px;">¡Explorá nuestra colección!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = carrito.map((item, index) => `
    <div class="cart-item">
      <div class="cart-item-image" style="background: ${item.colorBg}">
        <i class="${item.icono}"></i>
      </div>
      <div class="cart-item-details">
        <h4>${item.nombre}</h4>
        <div class="cart-item-size">Talle: ${item.talle}</div>
        <div class="cart-item-qty">
          <button onclick="cambiarCantidad(${index}, -1)">−</button>
          <span>${item.cantidad}</span>
          <button onclick="cambiarCantidad(${index}, 1)">+</button>
        </div>
      </div>
      <div class="cart-item-price">
        <span>$${(item.precio * item.cantidad).toLocaleString('es-AR')}</span>
        <button class="cart-item-remove" onclick="eliminarDelCarrito(${index})" title="Eliminar">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function actualizarTotales() {
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  
  const subtotal = calcularSubtotal();
  
  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString('es-AR')}`;
  if (totalEl) totalEl.textContent = `$${subtotal.toLocaleString('es-AR')}`;
}

// ============================================================
// CARRITO SIDEBAR (abrir/cerrar)
// ============================================================

function abrirCarrito() {
  document.getElementById('cart-sidebar')?.classList.add('active');
  document.getElementById('cart-overlay')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function cerrarCarrito() {
  document.getElementById('cart-sidebar')?.classList.remove('active');
  document.getElementById('cart-overlay')?.classList.remove('active');
  document.body.style.overflow = '';
}

// ============================================================
// FILTRO DE CATEGORÍAS
// ============================================================

function filtrarProductos(categoria) {
  // Actualizar botones activos
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.categoria === categoria) btn.classList.add('active');
  });

  // Filtrar tarjetas
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    if (categoria === 'todos' || card.dataset.categoria === categoria) {
      card.classList.remove('hidden');
      card.style.animation = 'none';
      card.offsetHeight; // reflow
      card.style.animation = 'fadeInUp 0.5s ease forwards';
    } else {
      card.classList.add('hidden');
    }
  });
}

// ============================================================
// NOTIFICACIÓN TOAST
// ============================================================

function mostrarToast(mensaje) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  const toastMsg = toast.querySelector('p');
  if (toastMsg) toastMsg.textContent = mensaje;
  
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ============================================================
// MERCADO PAGO - INTEGRACIÓN
// ============================================================

/**
 * Inicializa el SDK de Mercado Pago.
 * Reemplazá 'YOUR_PUBLIC_KEY' con tu clave pública real.
 */
function inicializarMercadoPago() {
  // Verificar si el SDK de Mercado Pago está cargado
  if (typeof MercadoPago === 'undefined') {
    console.warn(
      'El SDK de Mercado Pago no está cargado. ' +
      'Asegurate de incluir el script en tu HTML: ' +
      '<script src="https://sdk.mercadopago.com/js/v2"></script>'
    );
    return null;
  }

  try {
    const mp = new MercadoPago(MP_PUBLIC_KEY, {
      locale: 'es-AR'
    });
    console.log('✅ Mercado Pago inicializado correctamente');
    return mp;
  } catch (error) {
    console.error('❌ Error al inicializar Mercado Pago:', error);
    return null;
  }
}

/**
 * Crea una preferencia de pago en el backend y redirige al checkout.
 * 
 * Esta función envía los items del carrito al backend,
 * que debe crear la preferencia usando el ACCESS_TOKEN
 * y devolver el ID de la preferencia.
 */
async function crearPreferencia() {
  // Validar que hay items en el carrito
  if (carrito.length === 0) {
    mostrarToast('El carrito está vacío');
    return;
  }

  // Preparar los items para enviar al backend
  const items = carrito.map(item => ({
    title: `${item.nombre} - Talle ${item.talle}`,
    name: item.nombre,
    size: item.talle,
    unit_price: item.precio,
    quantity: item.cantidad,
    currency_id: 'ARS'
  }));

  const datosCompra = {
    items: items,
    total: calcularSubtotal(),
    // Podés agregar datos del comprador acá
    payer: {
      // email: 'comprador@email.com'
    }
  };

  try {
    // Enviar al backend para crear la preferencia
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosCompra)
    });

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const data = await response.json();

    // El backend debería devolver el ID de la preferencia
    if (data.id) {
      // Opción 1: Redirigir al checkout de Mercado Pago
      if (data.init_point) {
        window.location.href = data.init_point;
      }
      
      // Opción 2: Usar el Checkout Pro integrado (botón de pago)
      // const mp = inicializarMercadoPago();
      // if (mp) {
      //   mp.checkout({
      //     preference: { id: data.id },
      //     autoOpen: true
      //   });
      // }
    }

  } catch (error) {
    console.error('Error al crear la preferencia de pago:', error);
    
    // Si no hay backend configurado, mostrar flujo simulado
    mostrarCheckoutSimulado();
  }
}

/**
 * Flujo simulado cuando no hay backend configurado.
 * Muestra un resumen de la compra y los pasos de integración.
 */
function mostrarCheckoutSimulado() {
  const totalItems = calcularCantidadTotal();
  const subtotal = calcularSubtotal();
  
  let resumenItems = carrito.map(item => 
    `  • ${item.nombre} (Talle ${item.talle}) x${item.cantidad} = $${(item.precio * item.cantidad).toLocaleString('es-AR')}`
  ).join('\n');

  const mensaje = `
🛒 RESUMEN DE TU COMPRA - URBAN STYLE
${'═'.repeat(45)}

${resumenItems}

${'─'.repeat(45)}
📦 Total de productos: ${totalItems}
💰 TOTAL: $${subtotal.toLocaleString('es-AR')}
${'═'.repeat(45)}

⚙️ INTEGRACIÓN CON MERCADO PAGO
${'─'.repeat(45)}
Para activar pagos reales, seguí estos pasos:

1. Registrate en mercadopago.com.ar/developers
2. Obtené tus credenciales (Public Key y Access Token)
3. Configurá un backend con el endpoint /create_preference
4. Reemplazá 'YOUR_PUBLIC_KEY' en mercadopago.js
5. Actualizá BACKEND_URL con la URL de tu servidor

📖 Consultá la documentación completa en:
   https://www.mercadopago.com.ar/developers/es/docs

¡Tu tienda estará lista para recibir pagos! 🎉
  `.trim();

  alert(mensaje);
}

/**
 * Función principal que se ejecuta al hacer clic en "Pagar con Mercado Pago"
 */
function procesarPago() {
  if (carrito.length === 0) {
    mostrarToast('Agregá productos al carrito para continuar');
    return;
  }
  
  // Si la PUBLIC_KEY no fue configurada, mostrar flujo simulado
  if (MP_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
    console.info(
      '💡 Mercado Pago no está configurado. ' +
      'Mostrando flujo simulado. ' +
      'Reemplazá YOUR_PUBLIC_KEY con tu clave real.'
    );
    mostrarCheckoutSimulado();
    return;
  }

  // Si está configurado, intentar crear la preferencia real
  crearPreferencia();
}

// ============================================================
// NAVEGACIÓN Y UI GENERAL
// ============================================================

function inicializarNavegacion() {
  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Botón scroll to top
    const scrollBtn = document.querySelector('.scroll-top');
    if (window.scrollY > 400) {
      scrollBtn?.classList.add('visible');
    } else {
      scrollBtn?.classList.remove('visible');
    }
  });

  // Menú hamburguesa
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  menuToggle?.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks?.classList.toggle('active');
  });

  // Cerrar menú al hacer clic en un link
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle?.classList.remove('active');
      navLinks?.classList.remove('active');
    });
  });

  // Abrir/cerrar carrito
  document.getElementById('cart-icon')?.addEventListener('click', abrirCarrito);
  document.getElementById('cart-close')?.addEventListener('click', cerrarCarrito);
  document.getElementById('cart-overlay')?.addEventListener('click', cerrarCarrito);

  // Botón vaciar carrito
  document.getElementById('btn-clear-cart')?.addEventListener('click', vaciarCarrito);

  // Botón pagar
  document.getElementById('btn-checkout')?.addEventListener('click', procesarPago);

  // Scroll to top
  document.querySelector('.scroll-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Filtros de categoría
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filtrarProductos(btn.dataset.categoria);
    });
  });

  // Newsletter form
  document.getElementById('newsletter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    if (input && input.value) {
      mostrarToast('¡Gracias por suscribirte! 💌');
      input.value = '';
    }
  });

  // Cerrar carrito con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarCarrito();
  });
}

// ============================================================
// INICIALIZACIÓN
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  // Cargar carrito guardado
  cargarCarritoGuardado();
  
  // Renderizar productos
  renderizarProductos();
  renderizarOfertas();
  
  // Actualizar UI del carrito
  actualizarCarritoUI();
  
  // Inicializar navegación y eventos
  inicializarNavegacion();
  
  console.log('🏬 URBAN STYLE - Tienda cargada correctamente');
  console.log('🛒 Items en carrito:', carrito.length);
});
