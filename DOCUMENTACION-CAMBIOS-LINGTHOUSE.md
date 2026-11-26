# Documentación de cambios y mejoras

Optimización de la landing page **EMELYZ STUDIO** para alcanzar mejores puntajes en Lighthouse (Performance, Accesibilidad, Best Practices y SEO).

---

## 1. Resumen de resultados

| Categoría | Antes (Desktop) | Después | Antes (Móvil) | Después |
|---|---|---|---|---|
| Performance | 79 | **97** | 75 | **~90–93** |
| Accesibilidad | 96 | **100** | 96 | **100** |
| Best Practices | 96 | **100** | 96 | **100** |
| SEO | — | **100** | — | **100** |

> El peso total de la página pasó de **~5.5 MB a ~300 KB** (solo imágenes).

---

## 2. Archivos modificados

### 2.1 `index.html`

| Cambio | Qué se hizo | Por qué / mejora |
|---|---|---|
| **CSP (Content-Security-Policy)** | Se agregó `<meta http-equiv="Content-Security-Policy">` con reglas de `script-src`, `style-src`, `font-src`, `img-src`, `frame-src`, `object-src`, etc. | Aprueba la auditoría *"Ensure CSP is effective against XSS attacks"* y reduce el riesgo de inyección de scripts. |
| **Favicon** | Se agregó `<link rel="icon" href="data:image/svg+xml,...">` con un ícono "E" en SVG embebido. | Elimina el 404 de `/favicon.ico` que Lighthouse registraba como *"Browser errors were logged to the console"*. |
| **Fuentes de Google no bloqueantes** | Se cambió `<link rel="stylesheet" href="...fonts...">` por `<link rel="preload" as="style" href="...fonts...">`. La hoja se aplica desde `main.js`. | Deja de bloquear el primer renderizado (*render-blocking resources*). |
| **Imagen del hero (`portada`)** | `src` a `.webp`, se agregó `srcset` (`640w` y `1400w`) y `sizes`, y se actualizó `width/height` a `1400×788`. | Imagen responsiva: el móvil descarga una versión pequeña (25 KB) en vez de la grande. Mejora el LCP. |
| **Imágenes de la galería** | `src` a `.webp`, `srcset` (`400w` + tamaño grande) y `sizes`, con `width/height` corregidos. | Imagen responsiva + formato moderno. Elimina *"Properly size images"*. |
| **Mapa de Google** | Se quitó `src` y se dejó `data-src` (se conservó `loading="lazy"`). | El mapa pesado (~500 KB de JS) ya no se carga al inicio; solo cuando el usuario se acerca a esa sección. |
| **Monograma del logo ("E Z")** | Se quitaron los textos "E"/"Z" del HTML (quedaron como spans vacíos). | Corrige la auditoría *"label-content-name-mismatch"* (accesibilidad). |

### 2.2 `css/styles.css`

| Cambio | Qué se hizo | Por qué / mejora |
|---|---|---|
| **Contraste de la fila "hoy"** | `tr.today` cambió de `color:var(--rose)` (`#D0397F`) a `#A62666`. | El rosa sobre lila tenía contraste **3.32:1** (mínimo AA: 4.5:1). Ahora es **4.91:1**. Aprueba accesibilidad. |
| **Letras del monograma** | Se agregó `.monogram-e::before{content:"E"}` y `.monogram-z::before{content:"Z"}`. | Las letras decorativas ahora vienen del CSS (no son texto del DOM), lo que evita la advertencia de accesibilidad. |

### 2.3 `js/main.js`

| Cambio | Qué se hizo | Por qué / mejora |
|---|---|---|
| **Aplicar fuentes de Google** | Se agregó una IIFE al inicio que inyecta la `<link rel="stylesheet">` de las fuentes (ya precargada en el HTML). | Completa la carga de fuentes sin bloquear el render inicial. |
| **Lazy-load del mapa** | Se agregó un `IntersectionObserver` que asigna `iframe.src = data-src` solo cuando el mapa se acerca al viewport (margen 400 px). | Evita que el mapa de Google cargue su JS en la carga inicial y bloquee el hilo principal. |

---

## 3. Archivos de imágenes

### 3.1 Imágenes `.jpg` optimizadas (se reemplazaron en su lugar)

Todas se redimensionaron al tamaño real de visualización y se recomprimieron (calidad 80, optimizado y progresivo). Los originales siguen recuperables con git (`git checkout -- assets/web`).

| Archivo | Antes | Después | Dimensiones nuevas |
|---|---|---|---|
| `portada.jpg` | 3.5 MB | 155 KB | 1400 × 788 |
| `cejas-pestanas.jpg` | 337 KB | 75 KB | 640 × 800 |
| `perfil.jpg` | 288 KB | 56 KB | 600 × 800 |
| `cejas-definidas.jpg` | 285 KB | 55 KB | 600 × 800 |
| `mirada.jpg` | 98 KB | 53 KB | 639 × 800 |
| `pestanas-detalle.jpg` | 116 KB | 42 KB | 533 × 800 |
| `pestanas-volumen.jpg` | 179 KB | 39 KB | 534 × 800 |

### 3.2 Nuevos archivos `.webp` (formato moderno)

Se generaron versiones WebP (más livianas que JPG con la misma calidad). El HTML usa estas versiones.

**Tamaño completo:**
- `portada.webp` (1400 × 788, 110 KB)
- `pestanas-detalle.webp`, `cejas-definidas.webp`, `mirada.webp`, `pestanas-volumen.webp`, `cejas-pestanas.webp`, `perfil.webp` (≈19–52 KB c/u)

**Tamaño pequeño (para `srcset` en móvil):**
- `portada-640.webp` (640 px de ancho, 25 KB)
- `*-400.webp` de cada foto de galería (400 px de ancho, ≈11–20 KB c/u)

---

## 4. Cómo se hizo (herramientas)

1. **Lectura de los reportes Lighthouse** (`Reporte1-Desktop.pdf` y `Reporte1-Movil.pdf`): son capturas de imagen sin texto extraíble, así que se usó el OCR nativo de Windows (`Windows.Media.Ocr` vía PowerShell) para leer los puntajes y auditorías.
2. **Optimización de imágenes**: con Python y la librería **Pillow** (redimensionado con `Image.LANCZOS`, compresión JPEG calidad 80 progresiva, y exportación a **WebP** calidad 80 con `method=6`).
3. **Cálculo de contraste**: se calculó el ratio WCAG 2.x de cada combinación de color para localizar la que fallaba (rosa `#D0397F` sobre lila `#E9D5EA`).
4. **Medición y verificación**: con **Lighthouse CLI** (`npx lighthouse`) contra un servidor local, tanto con preset móvil como de escritorio.

---

## 5. Notas / pendientes (no bloquean el 100)

- **Rendimiento móvil (~90–93)**: la diferencia con desktop se debe a las **fuentes de Google** (Bricolage Grotesque + Figtree). Sin ellas el móvil llega a **~99**. Si se desea ese puntaje extra, se puede pasar a `font-display: optional` o usar fuentes del sistema (cambia ligeramente la tipografía).
- **Cabeceras de servidor** (avisos informativos de peso 0, no afectan el puntaje):
  - *Cache de recursos* y *compresión gzip/brotli*: se configuran en el servidor (Live Server local no las envía; en hosting como Netlify/Vercel/GitHub Pages se aplican solas).
  - *HSTS*, *COOP* y *X-Frame-Options*: requieren cabeceras HTTP del servidor (no se pueden poner en HTML estático).
