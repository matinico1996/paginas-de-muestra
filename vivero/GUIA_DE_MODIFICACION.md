# 🌿 Guía de Uso y Modificación — Plantilla Vivero (con Mercado Pago)

Esta carpeta contiene todo lo necesario para entregar una tienda online botánica con carrito de compras y pasarela de Mercado Pago.

---

## 📁 Archivos Disponibles en esta Carpeta

1. **`plantilla-completa.html` (TODO EN UNO — ¡Ideal para copiar y pegar!):**
   - Tiene **todo el código en un solo archivo**: HTML5 + estilos CSS dentro de `<style>` + lógica del carrito y Mercado Pago en `<script>`.
   - **Copiá y pegá todo el contenido directamente en cualquier editor de código (VS Code, Sublime, Notepad++, etc.)**.
   - Funciona sin depender de subcarpetas externas.

2. **`index.html` + `css/styles.css` + `js/mercadopago.js` (Estructura Modular):**
   - Estructura tradicional organizada en carpetas.

---

## 🛠️ ¿Qué modificar para un nuevo cliente?

1. **Nombre y Marca:**
   - Buscá `Verde Vida Vivero` y poné el nombre del vivero o florería.
2. **Productos del Catálogo:**
   - Buscá la sección `#productos`. Cada producto tiene este formato:
     ```html
     <div class="product-card" data-category="interior">
       <h3>Monstera Deliciosa</h3>
       <p class="product-price">$8.500</p>
       <button onclick="agregarAlCarrito(1, 'Monstera Deliciosa', 8500)">Agregar</button>
     </div>
     ```
   - Podés cambiar el nombre, precio, categoría y la función del botón con el nuevo precio.
3. **Activar Mercado Pago Real:**
   - En la sección de JavaScript al final, buscá:
     ```javascript
     const MP_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
     ```
   - Reemplazá `'YOUR_PUBLIC_KEY'` por la clave pública que el cliente obtiene en [Mercado Pago Developers](https://www.mercadopago.com.ar/developers).
   - Por defecto está activado el **Modo Demostración interactivo**, que si alguien hace clic en "Pagar con Mercado Pago", le explica qué pasos faltan para conectar el servidor.
4. **Contacto y WhatsApp:**
   - Modificá el enlace flotante de WhatsApp y la dirección en el pie de página.
