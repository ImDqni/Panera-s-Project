# Panera’s · Comparación del código

La versión refactorizada incluye las cinco páginas y una hoja de estilos con formato Prettier. El diff adjunto muestra todas las líneas añadidas y eliminadas frente a los archivos originales. Las fotos y los logotipos del ZIP provienen del repositorio indicado en el README.

## 1. Carruseles

El desplazamiento manual conserva las 41 fichas del catálogo y los seis destacados únicos de inicio. Eliminé las animaciones, los tiempos específicos por categoría, la ficha clonada y los contenedores de imagen que solo servían para aplicar efectos. Cada carrusel puede recibir foco para desplazarse con las flechas. Las categorías y los enlaces al catálogo mantienen sus destinos.

**Antes**

```css
.carrusel-contenedor { width: 100%; overflow: hidden; position: relative; padding: var(--spacing-xs) 0; }
.carrusel-track { display: flex; gap: var(--spacing-md); width: max-content; animation: carruselDeslizar 40s linear infinite; }
@keyframes carruselDeslizar { from { transform: translateX(0) rotate(.001deg); } to { transform: translateX(-50%) rotate(.001deg); } }
```

**Después**

```css
.carrusel-hero,
.carrusel-productos {
  display: flex;
  gap: var(--spacing-sm);
  overflow-x: auto;
  padding-bottom: var(--spacing-xs);
}
```

## 2. Menú y encabezados

La casilla ya existente sigue controlando el menú móvil. La etiqueta «Menú» permite abrirlo con clic o toque y la casilla recibe foco con Tab y responde a Espacio. Eliminé la capa superpuesta, el panel lateral animado y las tres barras decorativas. El título de cada página se convirtió en su único `h1` y la navegación identifica el enlace actual con `aria-current`.

**Antes**

```html
<input type="checkbox" id="menu-toggle" class="header__checkbox">
      <label for="menu-toggle" class="header__toggle" aria-label="Abrir menú">
        <span class="toggle__bar"></span>
        <span class="toggle__bar"></span>
        <span class="toggle__bar"></span>
      </label>
      <label for="menu-toggle" class="nav__overlay" aria-hidden="true"></label>

      <nav class="header__nav">
```

**Después**

```html
<input
          type="checkbox"
          id="menu-toggle"
          class="header__checkbox"
          aria-controls="menu-principal"
        />
        <label for="menu-toggle" class="header__toggle">Menú</label>

        <nav id="menu-principal" class="header__nav" aria-label="Principal">
```

## 3. Estilos del formulario y hojas duplicadas

Eliminé este bloque completo porque ninguna de las cinco páginas contiene un formulario. Los puntos de corte de `responsive.css` que siguen siendo necesarios están al final de `css/styles.css`. Eliminé `style.css` porque solo importaba hojas que las páginas ya cargaban directamente.

**Código del formulario eliminado**

```css
/* Formularios */
.form-card { background: linear-gradient(165deg, var(--color-primary-light) 0%, var(--color-primary-dark) 70%); border-radius: var(--border-radius-xl); padding: var(--spacing-xl); border: 1px solid rgba(var(--rgb-accent), .2); box-shadow: var(--shadow-lg); max-width: 720px; margin: 0 auto; }
.form-group { margin-bottom: var(--spacing-sm); display: flex; flex-direction: column; gap: 4px; text-align: left; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md); }
.form-label { font-size: .85rem; font-weight: 500; color: var(--color-text-primary); }
.form-input, .form-select, .form-textarea { width: 100%; padding: 10px 14px; border-radius: var(--border-radius-md); background-color: var(--color-primary-dark); border: 1px solid rgba(var(--rgb-accent), .25); color: var(--color-text-primary); font-family: var(--font-primary); font-size: .875rem; }
.form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--color-accent); outline: none; }
.form-textarea { min-height: 100px; resize: vertical; }
.form-submit-container { margin-top: var(--spacing-md); text-align: center; }
```

**Importador eliminado**

```css
@import url("css/styles.css");
@import url("css/responsive.css");
```

## 4. Mapa y estilos en línea

El mapa conserva las coordenadas y el enlace externo. El iframe tiene un título descriptivo, y su ancho, borde y separación están en CSS. Las tres llamadas a la acción de inicio comparten una regla para su alineación.

**Antes**

```html
<iframe src="https://maps.google.com/maps?q=10.061189,-69.374690&z=17&hl=es&output=embed" width="100%" height="250" style="border:0; border-radius: 8px;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
```

**Después**

```html
<iframe
                  src="https://maps.google.com/maps?q=10.061189,-69.374690&z=17&hl=es&output=embed"
                  title="Ubicación de Panera’s en Google Maps"
                  height="250"
                  allowfullscreen
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                >
```


```css
.map-container iframe {
  display: block;
  width: 100%;
  border: 0;
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-xs);
}
```

## 5. Limpieza visual

Sustituí degradados, sombras y desplazamientos al pasar el cursor por fondos sólidos, bordes y estados de foco. Conservé el azul marino, el acento cálido y las etiquetas de catálogo que comunican un atributo del producto. Ajusté las columnas y la cuadrícula de servicios para pantallas estrechas.

Los archivos entregados contienen HTML y CSS. El mapa y las fuentes son recursos externos del sitio original.
