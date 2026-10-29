# 👗 Guía de Uso y Modificación — Plantilla Casa de Ropa (con Mercado Pago)

Esta carpeta contiene todo lo necesario para entregar una tienda online de indumentaria y moda con selector de talles, carrito y Mercado Pago.

---

## 📁 Archivos Disponibles en esta Carpeta

1. **`plantilla-completa.html` (TODO EN UNO — ¡Ideal para copiar y pegar!):**
   - Tiene **todo el código en un solo archivo**: HTML5 + estilos CSS dentro de `<style>` + selector de talles, carrito y Mercado Pago en `<script>`.
   - **Copiá y pegá todo el contenido directamente en cualquier editor de código (VS Code, Sublime, Notepad++, etc.)**.
   - Funciona sin depender de subcarpetas externas.

2. **`index.html` + `css/styles.css` + `js/mercadopago.js` (Estructura Modular):**
   - Estructura tradicional con carpetas separadas.

---

## 🛠️ ¿Qué modificar para un nuevo cliente?

1. **Nombre de la Tienda de Ropa:**
   - Buscá `URBAN STYLE` y reemplazalo por la marca de tu cliente.
2. **Prendas y Talles:**
   - Buscá la sección `#catalogo`.
   - Cada tarjeta tiene su selector de talles interactivo (S, M, L, XL) y el botón que agrega la prenda seleccionada con su talle al carrito.
3. **Sección de Ofertas:**
   - Buscá `#ofertas` para ajustar los porcentajes de descuento y precios tachados.
4. **Tabla Guía de Talles:**
   - Sección `#guia-talles` con medidas de pecho, cintura y cadera editables.
5. **Activar Mercado Pago Real:**
   - En el JavaScript al final del archivo, buscá:
     ```javascript
     const MP_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
     ```
   - Reemplazá por la clave pública de Mercado Pago del cliente.
6. **Datos de Contacto:**
   - Modificá la dirección del local, el WhatsApp y las redes sociales en el pie de página.
