# Mechitas Mechonas — Frontend E-Commerce

Plataforma e-commerce para **Mechitas Mechonas**, pyme chilena de accesorios artesanales para el cabello de niñas, mujeres y mascotas.

## Stack Tecnológico

| Tecnología | Versión |
|-----------|---------|
| React.js | 18.3 |
| Tailwind CSS | 3.4 |
| Vite | 5.x |
| Node.js | 18+ |

## Inicio Rápido

```bash
# Instalar dependencias
npm install

# Levantar servidor de desarrollo
npm run dev

# Build de producción
npm run build
```

El servidor local corre en `http://localhost:5173/`

## Estructura del Proyecto

```
src/
├── App.jsx                  # Componente raíz (estado global: carrito, vistas, filtros)
├── main.jsx                 # Punto de entrada React
├── index.css                # Tailwind + tokens de diseño
├── components/
│   ├── Navbar.jsx           # Barra de navegación fija + logo + acceso al carrito
│   ├── Hero.jsx             # Sección principal con slogan y CTAs
│   ├── ProductCatalog.jsx   # Grilla de productos + barra de búsqueda + filtros
│   ├── ProductCard.jsx      # Tarjeta individual de producto
│   ├── CartOffcanvas.jsx    # Panel lateral del carrito (offcanvas derecho)
│   ├── Checkout.jsx         # Flujo de pago en 2 pasos
│   └── Footer.jsx           # Pie de página con enlaces de contacto
└── data/
    └── products.js          # Catálogo de productos (datos estáticos)
public/
    └── image_11cb63.png     # Logo oficial de la marca
```

## Flujo de Usuario

```
Inicio (Hero) → Catálogo (buscar/filtrar) → Agregar al Carrito → Ir a Pagar → Checkout
```

### Checkout (2 pasos)

1. **Datos del Cliente**: Nombre, RUT, Dirección, Comuna
2. **Resumen y Pago**: Detalle de la orden + botón "Pagar con Webpay"

## Filtros del Catálogo

- **Todos**: Muestra todos los productos
- **Niñas / Mujeres**: Accesorios para el cabello (`category: "pelo"`)
- **Mascotas**: Accesorios para mascotas (`category: "pet"`)
- **Búsqueda por texto**: Filtra por nombre del producto en tiempo real

## Reglas de Diseño

- **Cero emojis** y **cero íconos gráficos** en toda la interfaz
- Todos los botones y CTAs usan **texto descriptivo** (ej: "Agregar", "Ir a Pagar", "Cerrar")
- Enfoque **Mobile First** con diseño responsivo completo
- Envíos se mencionan sin mostrar tarifas ni cálculos

## Paleta de Colores (Tailwind)

| Token | Color | Uso |
|-------|-------|-----|
| `teal` | `#5DBFB0` | Primario, CTAs principales |
| `rose-berry` | `#9b4f60` | Acentos, precios pelo |
| `ink` | `#1a2e2b` | Textos, navbar, botones oscuros |
| `sand` | `#fdf8f2` | Fondo general |
| `gold` | `#f5c842` | Acentos mascotas |
| `dust` | `#ddd0d3` | Bordes, separadores |

## Tipografías

- **Playfair Display** — Títulos y headings
- **Quicksand** — Cuerpo de texto y UI
- **Sacramento** — Detalles decorativos (script)

## Redes Sociales

- Instagram: https://www.instagram.com/mechitas_mechonas/
- TikTok: https://www.tiktok.com/@mechitas_mechonas
