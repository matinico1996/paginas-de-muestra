# 🥩 Guía de Uso y Modificación — Plantilla Restaurante

Esta carpeta contiene todo lo necesario para entregar un menú digital y sitio de reservas gastronómico a un cliente.

---

## 📁 Archivos Disponibles en esta Carpeta

1. **`plantilla-completa.html` (TODO EN UNO — ¡Ideal para copiar y pegar!):**
   - Tiene **todo el código en un solo archivo**: HTML5 + estilos CSS dentro de `<style>`.
   - **Copiá y pegá todo el contenido directamente en cualquier editor de código (VS Code, Sublime, Notepad++, etc.)**.
   - Funciona sin depender de subcarpetas externas.

2. **`index.html` + `css/styles.css` (Estructura Modular):**
   - Estructura tradicional con HTML y CSS separados.

---

## 🛠️ ¿Qué modificar para un nuevo cliente?

1. **Nombre del Restaurante:**
   - Buscá `La Parrilla de Don Julio` y reemplazalo por la marca de tu cliente.
2. **Platos y Precios de la Carta:**
   - Buscá la sección `#carta`.
   - Cada plato está dentro de un contenedor `.menu-item` con su título, descripción y precio:
     ```html
     <div class="menu-item-header">
       <span class="menu-item-name">Empanadas Criollas</span>
       <span class="menu-item-price">$4.500</span>
     </div>
     <p class="menu-item-desc">Carne cortada a cuchillo...</p>
     ```
   - Podés duplicar o eliminar platos según el menú real del cliente.
3. **Especialidades de la Casa:**
   - Sección `#especialidades`: platos destacados con tarjeta grande.
4. **Formulario de Reservas:**
   - Sección `#reservas`: podés vincularlo a un backend o redirigir a WhatsApp al enviar.
5. **Horarios y Ubicación:**
   - Sección `#contacto` para modificar la dirección, teléfonos y horarios semanales.
