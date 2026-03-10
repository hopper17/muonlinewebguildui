# Changelog - Correcciones de la Calculadora

## [Corrección] - 2025-03-10

### Bugs Corregidos

#### 1. Gráfico Mostrando Niveles que Bajan
**Problema:** El gráfico de progresión mostraba niveles que bajaban (ej: 1688 → 1687), lo cual es matemáticamente incorrecto ya que la experiencia siempre aumenta.

**Causa:** El algoritmo original dividía el rango de niveles linealmente, causando problemas de redondeo:
```javascript
// INCORRECTO
const levelAtPoint = fromLevel + (toLevel - fromLevel) * progress;
```

**Solución:** Cambiar a progresión basada en EXP:
```javascript
// CORRECTO - garantiza monotonía
const expAtPoint = currentTotal + (totalExpNeeded * progress);
const levelAtPoint = levelByTotalExp(expAtPoint);
```

**Por qué funciona:**
- EXP aumenta linealmente → garantiza que expAtPoint siempre crece
- Level es función monotónica de EXP → a mayor EXP, mayor o igual nivel
- Resultado: Level(EXP(t)) es siempre creciente o constante ✓

**Archivos modificados:**
- `calculadora.js` - Funciones `updateProgressChart()` y `updateProgressChartNivel()`

**Verificación:**
- Ver `test-graph-fix.html` para tests automatizados
- Ver `GRAPH-FIX-VERIFICATION.md` para explicación matemática detallada

---

#### 2. Calculadora por Tiempo - Cálculo Incorrecto
**Problema:** La calculadora estaba usando `window.totalTo(level)` que devuelve la EXP acumulada hasta COMPLETAR ese nivel, causando cálculos incorrectos.

**Archivos modificados:**
- `calculadora.js`

**Cambios realizados:**
```javascript
// ANTES (INCORRECTO)
const currentTotal = window.totalTo(level) + (window.need(level) * BigInt(progreso) / 100n);

// DESPUÉS (CORRECTO)
const totalAtStart = (level > 1) ? window.totalTo(level - 1) : 0n;
const progressInLevel = (window.need(level) * BigInt(progreso)) / 100n;
const currentTotal = totalAtStart + progressInLevel;
```

**Explicación:**
- `window.totalTo(n)` devuelve la EXP acumulada necesaria para COMPLETAR el nivel n
- Para calcular la EXP actual del jugador, necesitamos:
  1. EXP al INICIO del nivel actual: `totalTo(level - 1)`
  2. Más el progreso dentro del nivel: `need(level) * progreso / 100`

**Ejemplo:**
- Nivel 10 con 50% de progreso
- ANTES: totalTo(10) + 50% de need(10) ❌ (suma EXP de más)
- AHORA: totalTo(9) + 50% de need(10) ✅ (correcto)

#### 2. Función levelByTotalExp - Búsqueda Incorrecta
**Problema:** La búsqueda binaria comparaba con `totalTo(mid)` en lugar de `totalTo(mid-1)`.

**Cambios realizados:**
```javascript
// ANTES
const t = window.totalTo(mid);
if (t <= expTotal){...}

// DESPUÉS
const totalAtStart = (mid > 1) ? window.totalTo(mid - 1) : 0n;
if (totalAtStart <= expTotal){...}
```

**Explicación:**
- Necesitamos encontrar el nivel N donde: `totalTo(N-1) <= expTotal < totalTo(N)`
- Esto significa que el jugador está EN el nivel N, no que lo completó

#### 3. Calculadora por Nivel - No guardaba en historial
**Problema:** La función `calcularNivel()` en `calculadora.html` no llamaba a `saveToHistory()`.

**Archivos modificados:**
- `calculadora.html`

**Cambios realizados:**
```javascript
// Agregado al final de calcularNivel()
if(typeof saveToHistory === 'function'){
  saveToHistory({
    type: 'nivel',
    from: nivelA,
    progress: prog,
    to: nivelB,
    time: `${d}d ${h}h ${m}m ${s}s`,
    date: new Date().toLocaleString()
  });
}
```

### Verificación

Para verificar que los cambios funcionan correctamente:

1. **Test de Consistencia:**
   - Calcula de nivel A a nivel B con X EXP/s → obtienes T tiempo
   - Calcula nivel A con X EXP/s durante T tiempo → deberías llegar a nivel B

2. **Test de Historial:**
   - Realiza un cálculo por tiempo → debe aparecer en historial
   - Realiza un cálculo por nivel → debe aparecer en historial
   - Recarga la página → ambos deben persistir

3. **Test de Precisión:**
   - Los cálculos ahora coinciden con la calculadora por nivel (que ya funcionaba correctamente)

### Archivos Afectados
- ✅ `calculadora.js` - Corregida función `calcular()` y `levelByTotalExp()`
- ✅ `calculadora.html` - Agregado guardado en historial para `calcularNivel()`
- ✅ `test-calculadora.md` - Documentación de pruebas
- ✅ `CHANGELOG.md` - Este archivo

### Notas Técnicas

**Concepto clave:** La diferencia entre "EXP para completar un nivel" vs "EXP al inicio de un nivel"

```
Nivel 1: need(1) = 100 EXP
Nivel 2: need(2) = 200 EXP
Nivel 3: need(3) = 300 EXP

totalTo(1) = 100      → EXP para COMPLETAR nivel 1
totalTo(2) = 300      → EXP para COMPLETAR nivel 2 (100 + 200)
totalTo(3) = 600      → EXP para COMPLETAR nivel 3 (100 + 200 + 300)

Si un jugador está en nivel 2 con 50%:
- EXP al inicio de nivel 2 = totalTo(1) = 100
- Progreso en nivel 2 = 50% de need(2) = 50% de 200 = 100
- EXP total actual = 100 + 100 = 200
```

### Estado
✅ Ambos bugs corregidos y verificados
✅ Calculadora por tiempo ahora funciona correctamente
✅ Calculadora por nivel guarda en historial
✅ Ambas calculadoras son consistentes entre sí
