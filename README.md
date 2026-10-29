# 🌐 Colección de Plantillas Web Profesionales (HTML5 + CSS3 + JS)

Colección de 4 sitios web modernos, 100% responsivos y listos para producción, diseñados para ser copiados, personalizados y entregados a clientes en minutos.

Incluye un portal central (`index.html`) para previsualizar y navegar por todas las plantillas.

---

## 📁 Estructura del Proyecto

```text
paginas de muestra/
│
├── index.html                   # Portal principal con catálogo de plantillas
├── css/
│   └── main.css                 # Estilos del portal principal
│
├── gimnasio/                    # 🏋️ PLANTILLA 1: Landing Page Gimnasio
│   ├── index.html
│   └── css/styles.css
│
├── restaurante/                 # 🥩 PLANTILLA 2: Menú & Carta Restaurante
│   ├── index.html
│   └── css/styles.css
│
├── vivero/                      # 🌿 PLANTILLA 3: E-Commerce Vivero (+ Mercado Pago)
│   ├── index.html
│   ├── css/styles.css
│   └── js/mercadopago.js
│
└── ropa/                        # 👗 PLANTILLA 4: E-Commerce Moda (+ Mercado Pago)
    ├── index.html
    ├── css/styles.css
    └── js/mercadopago.js
```

---

## 🚀 Las 4 Plantillas en Detalle

### 1. 🏋️ Gimnasio (`/gimnasio/`)
- **Enfoque:** Landing page de alta conversión para gimnasios, centros de fitness o entrenadores personales.
- **Características:**
  - Hero impactante con gradientes oscuros/rojos y llamadas a la acción (CTA).
  - Sección "Nosotros" con estadísticas animadas (+2.500 miembros, 15 entrenadores, etc.).
  - 3 tarjetas de planes de precios (Básico, Full y Premium).
  - Grilla semanal de horarios y actividades (CrossFit, Spinning, Boxeo, Yoga).
  - Tarjetas de entrenadores con enlaces a redes sociales.
  - Formulario de contacto y pie de página con información y ubicación.
  - Diseño responsive adaptable a móviles y tablets.

### 2. 🥩 Restaurante (`/restaurante/`)
- **Enfoque:** Menú y carta digital gastronómica con sistema de reservas para restaurantes, parrillas o bares.
- **Características:**
  - Diseño elegante con paleta oscura y detalles dorados.
  - Carta organizada por categorías (Entradas, Carnes a la Parrilla, Pastas, Postres, Bebidas) con precios en pesos argentinos ($).
  - Filtro interactivo de platos por categoría.
  - Especialidades destacadas de la casa.
  - Formulario completo para reservas de mesa (fecha, hora, comensales, ocasión).
  - Horarios de apertura y sección de ubicación.

### 3. 🌿 Vivero (`/vivero/`) — Con Mercado Pago 💳
- **Enfoque:** Tienda online completa para viveros, florerías o productos de jardinería.
- **Características:**
  - Catálogo interactivo con 12+ productos (Plantas de interior, exterior, cactus y suculentas).
  - Filtros dinámicos por tipo de planta.
  - Carrito de compras desplegable (Sidebar) en tiempo real con contador en el navbar.
  - Gestión de cantidades, subtotal y total.
  - **Integración con SDK de Mercado Pago** (`mercadopago.js`).
  - Modo demostración interactivo con guía de pasos para conectar credenciales reales.
  - Sección de tips y cuidados botánicos (riego, luz, sustrato, poda).

### 4. 👗 Tienda de Ropa (`/ropa/`) — Con Mercado Pago 💳
- **Enfoque:** Tienda de moda urbana y accesorios de indumentaria.
- **Características:**
  - Estética minimalista premium en negro, blanco y acentos en oro rosa (*Rose Gold*).
  - Catálogo con selector de talles interactivo (S, M, L, XL).
  - Categorías para Mujer, Hombre y Accesorios.
  - Banner de ofertas con precios rebajados y badges de descuento.
  - Tabla guía de talles con medidas corporales.
  - Carrito de compras con persistencia del talle elegido por prenda.
  - **Integración con SDK de Mercado Pago** (`mercadopago.js`).
  - Formulario de suscripción a Newsletter e integración visual de feed de Instagram.

---

## 💳 Configuración de Mercado Pago

Tanto en `/vivero/js/mercadopago.js` como en `/ropa/js/mercadopago.js`, el sistema viene preparado con:

1. **SDK Oficial de Mercado Pago** ya incluido vía CDN en el HTML (`https://sdk.mercadopago.com/js/v2`).
2. **Modo Demo Activo:** Si el cliente prueba el botón "Pagar con Mercado Pago" sin haber configurado un backend, el sistema le mostrará un modal con las instrucciones detalladas paso a paso.
3. **Paso a Producción con Credenciales Reales:**
   - Registrarse en [Mercado Pago Developers](https://www.mercadopago.com.ar/developers).
   - Obtener tu **Public Key** y tu **Access Token**.
   - Colocar tu `PUBLIC_KEY` en la variable `MP_PUBLIC_KEY` dentro de `js/mercadopago.js`.
   - Conectar el endpoint `/create_preference` a un pequeño servidor backend (Node.js, Express, PHP, Python) que reciba el carrito y genere la preferencia de pago de Mercado Pago.

---

## 🛠️ Cómo Usar y Personalizar para un Cliente

Cada carpeta (`/gimnasio/`, `/restaurante/`, `/vivero/`, `/ropa/`) es **completamente independiente**:

1. **Copiar la carpeta elegida:** Copiá únicamente la carpeta del cliente (por ejemplo `/ropa/`) a una nueva carpeta de trabajo.
2. **Modificar textos e imágenes:** Editá el `index.html` cambiando nombres, teléfonos, enlaces de redes sociales y textos promocionales.
3. **Ajustar colores:** En `css/styles.css` podés cambiar las variables `:root` (colores principales, fuentes) para adaptar la marca visual del cliente.
4. **Publicar:** Subí los archivos al hosting del cliente (Vercel, Netlify, cPanel, Hostinger o GitHub Pages).

---

## 🐙 Cómo Subir este Proyecto a tu GitHub

Seguí estos simples pasos desde tu terminal (PowerShell o Git Bash):

```bash
# 1. Inicializar git en la carpeta
git init

# 2. Agregar todos los archivos
git add .

# 3. Crear el primer commit
git commit -m "feat: Plantillas web listas para clientes (Gimnasio, Restaurante, Vivero y Ropa)"

# 4. Crear el repositorio en tu cuenta de GitHub (ejemplo: paginas-de-muestra)
# 5. Vincular el repositorio remoto (reemplazá TU_USUARIO por tu usuario de GitHub):
git branch -M main
git remote add origin https://github.com/TU_USUARIO/paginas-de-muestra.git

# 6. Subir los cambios a GitHub
git push -u origin main
```

Si activás **GitHub Pages** en la configuración de tu repositorio (`Settings` > `Pages` > Rama `main`), tendrás tu portal online funcionando gratis para compartirlo con clientes potenciales.
