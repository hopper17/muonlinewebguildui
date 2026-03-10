# Guild ADICCION - MU Online

Sitio web oficial de la guild ADICCION en MU Online. Una plataforma completa para nuestra comunidad de jugadores.

## 🎮 Características

### Página Principal
- **Hero Section** con presentación de la guild
- **Sistema de Clases** interactivo con información detallada
- **Miembros Destacados** con perfiles de los líderes
- **Estadísticas y Logros** de la guild
- **Formulario de Reclutamiento** con validación en tiempo real
- **Integración con Discord** y redes sociales

### Calculadora de Experiencia
- **Cálculo por Tiempo**: Determina qué nivel alcanzarás en X tiempo
- **Cálculo por Nivel**: Calcula cuánto tiempo necesitas para llegar a un nivel objetivo
- **Historial de Cálculos**: Guarda tus últimos 10 cálculos en localStorage
- **Barra de Progreso Visual**: Visualiza tu avance de forma gráfica
- **Gráficos Interactivos**: Charts animados con Chart.js mostrando tu progresión
- **Modo Oscuro/Claro**: Toggle para cambiar entre temas
- **Soporte para niveles 1-1700**: Incluye todas las fórmulas de experiencia

### Características Técnicas
- ✅ **Responsive Design**: Funciona perfectamente en móviles, tablets y desktop
- ✅ **PWA Ready**: Instalable como aplicación
- ✅ **Service Worker**: Funciona offline
- ✅ **SEO Optimizado**: Meta tags, Open Graph, JSON-LD
- ✅ **Animaciones Suaves**: Scroll animations y transiciones
- ✅ **Accesibilidad**: ARIA labels y navegación por teclado
- ✅ **Performance**: Lazy loading y optimizaciones
- ✅ **Modo Oscuro/Claro**: Toggle de tema con persistencia en localStorage
- ✅ **Gráficos Interactivos**: Visualización de datos con Chart.js

## 📁 Estructura del Proyecto

```
.
├── index.html              # Página principal
├── calculadora.html        # Calculadora de experiencia
├── privacy.html           # Política de privacidad
├── terms.html             # Términos de servicio
├── styles.css             # Estilos globales
├── calculadora.js         # Lógica de la calculadora
├── data_exp.js            # Datos de experiencia
├── exp_formulas.js        # Fórmulas de cálculo
├── manifest.json          # Configuración PWA
├── sw.js                  # Service Worker
├── sitemap.xml            # Mapa del sitio
├── robots.txt             # Configuración para bots
└── assets/                # Imágenes y recursos
    └── logoguild.png
```

## 🚀 Instalación y Uso

### Desarrollo Local
1. Clona el repositorio
2. Abre `index.html` en tu navegador
3. No requiere build ni dependencias

### Despliegue
El sitio es estático y puede desplegarse en:
- Vercel (recomendado)
- Netlify
- GitHub Pages
- Cualquier hosting estático

## 🎨 Personalización

### Colores (CSS Variables)
```css
--bg: #0b0f1a;           /* Fondo principal */
--brand-1: #1ad1ff;      /* Color primario (cian) */
--brand-2: #7c4dff;      /* Color secundario (violeta) */
--brand-3: #00ffa5;      /* Color de acento (verde) */
```

### Modificar Datos de la Guild
- **Miembros destacados**: Edita la sección `#miembros` en `index.html`
- **Estadísticas**: Modifica los números en la sección de logros
- **Requisitos**: Actualiza la lista en `#reclutamiento`

### Configurar Discord y Redes
Actualiza los enlaces en la sección de comunidad:
```html
<a href="TU_LINK_DISCORD">Unirse al Discord</a>
```

## 📊 SEO y Analytics

### Meta Tags Incluidos
- Open Graph para redes sociales
- Twitter Cards
- JSON-LD para datos estructurados
- Sitemap.xml para indexación

### Agregar Google Analytics
Añade antes del cierre de `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=TU_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'TU_ID');
</script>
```

## 🔧 Mantenimiento

### Actualizar Tablas de Experiencia
Si el servidor cambia las rates, edita los arrays en `data_exp.js`:
- `R`: Niveles 1-400
- `U`: Niveles 401-1700

### Agregar Nuevas Clases
Edita el array `classes` en `index.html`:
```javascript
{ 
  name: 'Nueva Clase', 
  role: 'Rol / Tipo', 
  tips: 'Recomendaciones', 
  desc: 'Descripción' 
}
```

## 📱 PWA (Progressive Web App)

El sitio puede instalarse como aplicación:
1. Visita el sitio en Chrome/Edge
2. Click en el ícono de instalación en la barra de direcciones
3. La app se instalará en tu dispositivo

## 🐛 Solución de Problemas

### La calculadora no funciona
- Verifica que `data_exp.js` esté cargado
- Revisa la consola del navegador para errores
- Asegúrate de que los valores estén en el rango correcto

### El menú móvil no se abre
- Verifica que el JavaScript esté cargado
- Comprueba que los IDs coincidan: `openMobile`, `closeMobile`, `mobileMenu`

### Service Worker no se registra
- Debe servirse desde HTTPS (o localhost)
- Verifica la ruta del archivo `sw.js`

## 📄 Licencia

© 2025 Guild ADICCION. Desarrollado por Hopper.

## 🤝 Contribuciones

Para sugerencias o mejoras, contacta al administrador de la guild.

## 📞 Contacto

- Discord: [Servidor de ADICCION]
- Email: humberto.m.17.2@icloud.com

---

**¡Únete a ADICCION y conquista el mundo de MU Online!** ⚔️
