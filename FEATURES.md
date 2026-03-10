# Nuevas Características Implementadas

## 🎨 Modo Oscuro / Claro

### Descripción
Sistema completo de temas con toggle animado que permite cambiar entre modo oscuro y claro.

### Características
- ✅ Toggle animado con iconos de sol/luna
- ✅ Persistencia en localStorage
- ✅ Transiciones suaves entre temas
- ✅ Colores optimizados para ambos modos
- ✅ Sincronización entre todas las páginas

### Uso
1. Click en el botón de toggle en el header
2. El tema se guarda automáticamente
3. Al recargar la página, se mantiene tu preferencia

### Colores del Tema

**Modo Oscuro (Default):**
```css
--bg: #0b0f1a          /* Fondo principal */
--txt: #e6f1ff         /* Texto */
--muted: #94a3b8       /* Texto secundario */
--panel: #121a2a       /* Paneles */
```

**Modo Claro:**
```css
--bg: #f8f9fa          /* Fondo principal */
--txt: #212529         /* Texto */
--muted: #6c757d       /* Texto secundario */
--panel: #ffffff       /* Paneles */
```

### Implementación Técnica
```javascript
// Cargar tema guardado
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

// Toggle
themeToggle.addEventListener('click', () => {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});
```

---

## 📊 Gráficos Visuales Interactivos

### Descripción
Visualización gráfica de la progresión de niveles usando Chart.js con animaciones y tooltips interactivos.

### Características
- ✅ Gráfico de línea animado
- ✅ Tooltips informativos con nivel y porcentaje
- ✅ Adaptación automática al tema (oscuro/claro)
- ✅ Responsive y optimizado para móviles
- ✅ Puntos intermedios calculados automáticamente
- ✅ Colores del gradiente de la marca

### Tipos de Gráficos

#### 1. Gráfico por Tiempo
Muestra la progresión desde tu nivel actual hasta el nivel que alcanzarás en el tiempo especificado.

**Ejemplo:**
- Nivel 100 (50%) → Nivel 150 (75%) en 5 días
- El gráfico muestra la curva de progresión

#### 2. Gráfico por Nivel
Muestra la progresión desde tu nivel actual hasta el nivel objetivo.

**Ejemplo:**
- Nivel 400 (0%) → Nivel 500 (0%)
- El gráfico muestra todos los niveles intermedios

### Configuración del Gráfico

```javascript
{
  type: 'line',
  data: {
    labels: ['Nivel 100 (50%)', 'Nivel 110', ..., 'Nivel 150 (75%)'],
    datasets: [{
      borderColor: 'rgba(26, 209, 255, 1)',      // Cian
      backgroundColor: 'rgba(26, 209, 255, 0.1)', // Cian transparente
      pointBackgroundColor: 'rgba(124, 77, 255, 1)', // Violeta
      tension: 0.4,  // Curva suave
      fill: true     // Relleno bajo la línea
    }]
  }
}
```

### Tooltips Personalizados
```javascript
callbacks: {
  label: function(context) {
    const value = context.parsed.y;
    const level = Math.floor(value);
    const progress = ((value - level) * 100).toFixed(1);
    return `Nivel ${level} (${progress}%)`;
  }
}
```

### Adaptación al Tema
El gráfico detecta automáticamente el tema actual y ajusta:
- Color de fondo del tooltip
- Color del texto
- Color de las líneas de la cuadrícula
- Color de los ejes

```javascript
const theme = document.documentElement.getAttribute('data-theme') || 'dark';
const isDark = theme === 'dark';

tooltip: {
  backgroundColor: isDark ? 'rgba(18, 26, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
  titleColor: isDark ? '#e6f1ff' : '#212529',
  bodyColor: isDark ? '#94a3b8' : '#6c757d'
}
```

### Performance
- Máximo 20 puntos en el gráfico para mantener rendimiento
- Destrucción del gráfico anterior antes de crear uno nuevo
- Canvas con aspect ratio 2:1 para mejor visualización
- Lazy loading del gráfico (solo se muestra después del cálculo)

---

## 🎯 Casos de Uso

### Caso 1: Planificar Sesión de Farmeo
1. Ingresa tu nivel actual y progreso
2. Ingresa tu EXP/segundo
3. Ingresa cuánto tiempo vas a farmear
4. Ve el gráfico de progresión esperada
5. Decide si vale la pena la sesión

### Caso 2: Calcular Tiempo para Objetivo
1. Ingresa tu nivel actual
2. Ingresa tu nivel objetivo
3. Ingresa tu EXP/segundo
4. Ve el tiempo necesario y el gráfico
5. Planifica tus sesiones de juego

### Caso 3: Comparar Diferentes Rates
1. Calcula con una rate de EXP
2. Guarda el resultado en el historial
3. Calcula con otra rate
4. Compara los gráficos y tiempos

---

## 🔧 Dependencias

### Chart.js v4.4.1
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
```

**Por qué Chart.js:**
- Librería ligera y rápida
- Excelente documentación
- Responsive por defecto
- Animaciones suaves
- Altamente personalizable
- Soporte para temas

---

## 📱 Responsive Design

### Desktop
- Gráfico con aspect ratio 2:1
- Tooltips completos
- Animaciones suaves

### Tablet
- Gráfico adaptado al ancho
- Labels rotados 45°
- Touch-friendly

### Mobile
- Gráfico optimizado
- Labels simplificados
- Gestos táctiles

---

## 🎨 Personalización

### Cambiar Colores del Gráfico
```javascript
// En calculadora.js, función updateProgressChart
borderColor: 'rgba(26, 209, 255, 1)',      // Color de la línea
backgroundColor: 'rgba(26, 209, 255, 0.1)', // Relleno
pointBackgroundColor: 'rgba(124, 77, 255, 1)', // Puntos
```

### Cambiar Número de Puntos
```javascript
// Máximo de puntos en el gráfico
const steps = Math.min(levelDiff + 1, 20); // Cambiar 20 por el número deseado
```

### Cambiar Aspect Ratio
```javascript
options: {
  aspectRatio: 2, // Cambiar a 1.5, 2.5, etc.
}
```

---

## 🐛 Troubleshooting

### El gráfico no se muestra
1. Verifica que Chart.js esté cargado
2. Abre la consola y busca errores
3. Verifica que el canvas exista en el DOM

### El gráfico no se actualiza al cambiar tema
1. El gráfico se destruye y recrea en cada cálculo
2. El tema se detecta automáticamente
3. Si persiste, recarga la página

### El gráfico se ve cortado en móvil
1. Verifica que el contenedor tenga padding
2. Ajusta el aspect ratio
3. Reduce el número de puntos

---

## 🚀 Futuras Mejoras

### Posibles Adiciones
- [ ] Gráfico de barras para comparar múltiples cálculos
- [ ] Exportar gráfico como imagen
- [ ] Zoom y pan en el gráfico
- [ ] Animaciones más elaboradas
- [ ] Gráfico de EXP/hora histórico
- [ ] Comparador de spots de farmeo
- [ ] Predicción de tiempo para resets

### Optimizaciones
- [ ] Cachear gráficos anteriores
- [ ] Lazy load de Chart.js
- [ ] WebWorker para cálculos pesados
- [ ] Virtualización para muchos puntos

---

## 📊 Estadísticas de Uso

Para trackear el uso de las nuevas características, puedes agregar:

```javascript
// Trackear cambios de tema
localStorage.setItem('themeChanges', 
  parseInt(localStorage.getItem('themeChanges') || '0') + 1
);

// Trackear visualizaciones de gráficos
localStorage.setItem('chartViews',
  parseInt(localStorage.getItem('chartViews') || '0') + 1
);
```

---

## 💡 Tips de Uso

1. **Usa el modo claro durante el día** para reducir fatiga visual
2. **Usa el modo oscuro de noche** para mejor confort
3. **Pasa el mouse sobre los puntos del gráfico** para ver detalles
4. **Compara múltiples cálculos** usando el historial
5. **Toma screenshots del gráfico** para compartir con tu guild

---

¡Disfruta de las nuevas características! 🎉
