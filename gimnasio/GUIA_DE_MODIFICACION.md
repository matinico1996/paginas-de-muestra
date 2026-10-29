# 🏋️ Guía de Uso y Modificación — Plantilla Gimnasio

Esta carpeta contiene todo lo necesario para entregar un sitio web profesional de gimnasio o centro de fitness a un cliente.

---

## 📁 Archivos Disponibles en esta Carpeta

1. **`plantilla-completa.html` (TODO EN UNO — ¡Ideal para copiar y pegar!):**
   - Tiene **todo el código en un solo archivo**: la estructura HTML5 y los estilos CSS incluidos dentro de la etiqueta `<style>`.
   - **Podés copiar todo el contenido de este archivo y pegarlo directamente en cualquier editor de código (VS Code, Sublime Text, Notepad++, etc.)**.
   - Funciona sin depender de subcarpetas externas. Si le hacés doble clic, abre y funciona perfecto en cualquier navegador.

2. **`index.html` + `css/styles.css` (Estructura Modular):**
   - Para proyectos donde prefieras tener el archivo HTML y la hoja de estilos CSS separados.

---

## 🛠️ ¿Qué modificar para un nuevo cliente?

Abrí `plantilla-completa.html` (o `index.html`) en tu editor de código y buscá estas secciones:

1. **Nombre y Logo del Gimnasio:**
   - Buscá `POWER FITNESS` y reemplazalo por el nombre del gimnasio de tu cliente.
2. **Planes y Precios:**
   - Buscá la sección `#planes` (alrededor de la línea donde dice `Nuestros Planes`).
   - Podés cambiar los montos (`$15.000`, `$25.000`, etc.) y las características de cada plan.
3. **Horarios de Clases:**
   - Buscá la tabla `#horarios` para cambiar los nombres de las clases (Spinning, Yoga, CrossFit, etc.) y los días.
4. **Datos de Contacto:**
   - Buscá la sección `#contacto` y modificá la dirección, el teléfono de WhatsApp y el email.
5. **Colores de la Marca (Opcional):**
   - En la sección `<style>`, en las primeras líneas dentro de `:root`, podés cambiar:
     - `--rojo: #e63946;` (color principal de botones y detalles)
     - `--negro: #0a0a0a;` (color de fondo)
