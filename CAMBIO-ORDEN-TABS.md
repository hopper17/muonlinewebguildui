# Cambio de Orden en las Tabs de la Calculadora

## 📋 Cambio Solicitado

Intercambiar el orden de las calculadoras para que:
- **"Por Nivel"** sea la Tab 1 (primera, por defecto)
- **"Por Tiempo"** sea la Tab 2 (segunda)

## ✅ Cambios Implementados

### 1. Orden de las Tabs en el HTML

**Antes:**
```html
<button id="tabTiempo" class="is-active">1 — Por Tiempo</button>
<button id="tabNivel">2 — Por Nivel</button>
```

**Después:**
```html
<button id="tabNivel" class="is-active">1 — Por Nivel</button>
<button id="tabTiempo">2 — Por Tiempo</button>
```

### 2. Orden de los Paneles

**Antes:**
```html
<!-- Panel 1: Por Tiempo -->
<div id="panelTiempo">...</div>

<!-- Panel 2: Por Nivel -->
<div id="panelNivel" hidden>...</div>
```

**Después:**
```html
<!-- Panel 1: Por Nivel -->
<div id="panelNivel">...</div>

<!-- Panel 2: Por Tiempo -->
<div id="panelTiempo" hidden>...</div>
```

### 3. JavaScript - Tab por Defecto

**Antes:**
```javascript
show('tiempo'); // Mostraba "Por Tiempo" al cargar
```

**Después:**
```javascript
show('nivel'); // Muestra "Por Nivel" al cargar
```

### 4. Atributos ARIA Actualizados

**Tab Nivel:**
- `class="tab-btn is-active"` ✅
- `aria-selected="true"` ✅
- `aria-controls="panelNivel"` ✅

**Tab Tiempo:**
- `class="tab-btn"` (sin is-active)
- `aria-selected="false"` ✅
- `aria-controls="panelTiempo"` ✅

## 🎯 Resultado

### Al Cargar la Página:
1. ✅ Tab "1 — Por Nivel" está activa (resaltada)
2. ✅ Panel de "Por Nivel" está visible
3. ✅ Tab "2 — Por Tiempo" está inactiva
4. ✅ Panel de "Por Tiempo" está oculto

### Navegación:
- Click en "1 — Por Nivel" → Muestra calculadora por nivel
- Click en "2 — Por Tiempo" → Muestra calculadora por tiempo

## 📊 Lógica de Cada Calculadora

### Calculadora Por Nivel (Tab 1)
**Inputs:**
- Nivel actual (1-1699)
- Nivel objetivo (2-1700)
- % de progreso actual
- EXP por segundo

**Output:**
- Tiempo necesario (días, horas, minutos, segundos)
- Gráfico de progresión con tiempo

**Uso típico:**
"Quiero llegar del nivel 1678 al 1700, ¿cuánto tiempo necesito?"

### Calculadora Por Tiempo (Tab 2)
**Inputs:**
- Nivel actual (1-1700)
- % de progreso actual
- EXP por segundo
- Tiempo disponible (días, horas, minutos)

**Output:**
- Nivel final alcanzado
- % de progreso en ese nivel
- Gráfico de progresión

**Uso típico:**
"Tengo 12 días para farmear, ¿a qué nivel llegaré?"

## 🎨 Ventajas del Nuevo Orden

1. **Más intuitivo**: La mayoría de usuarios quiere saber "¿cuánto tiempo necesito para X nivel?"
2. **Objetivo claro**: Empezar con un objetivo (nivel) es más natural
3. **Planificación**: Permite planificar mejor las sesiones de farmeo
4. **Flujo lógico**: Objetivo → Tiempo necesario (más común que Tiempo → Nivel alcanzado)

## 🔧 Archivos Modificados

- ✅ `calculadora.html` - Orden de tabs y paneles
- ✅ `calculadora.html` - JavaScript de inicialización

## ✅ Verificación

Para verificar que funciona correctamente:

1. Abre la calculadora
2. Verifica que "1 — Por Nivel" esté activa
3. Verifica que el formulario de nivel esté visible
4. Click en "2 — Por Tiempo"
5. Verifica que cambia al formulario de tiempo
6. Click en "1 — Por Nivel"
7. Verifica que vuelve al formulario de nivel

Todo debe funcionar correctamente con el nuevo orden.
