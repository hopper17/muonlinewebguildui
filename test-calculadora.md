# Tests de la Calculadora

## Problema Identificado y Solucionado

### Bug 1: Calculadora por Tiempo
**Problema:** El cálculo estaba usando `window.totalTo(level)` que devuelve la EXP acumulada HASTA COMPLETAR ese nivel, no al inicio.

**Ejemplo del error:**
- Si estás en nivel 10 con 50% de progreso
- `window.totalTo(10)` = EXP total para COMPLETAR nivel 10
- Pero necesitamos: EXP al INICIO de nivel 10 + 50% del nivel 10

**Solución:**
```javascript
// ANTES (INCORRECTO):
const currentTotal = window.totalTo(level) + (window.need(level) * BigInt(progreso) / 100n);

// DESPUÉS (CORRECTO):
const totalAtStart = (level > 1) ? window.totalTo(level - 1) : 0n;
const progressInLevel = (window.need(level) * BigInt(progreso)) / 100n;
const currentTotal = totalAtStart + progressInLevel;
```

### Bug 2: Calculadora por Nivel no guardaba en historial
**Problema:** La función `calcularNivel` no llamaba a `saveToHistory()`

**Solución:** Agregado el guardado en historial al final de la función:
```javascript
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

## Casos de Prueba

### Test 1: Calculadora por Tiempo
**Input:**
- Nivel actual: 100
- Progreso: 0%
- EXP/segundo: 1,000,000
- Tiempo: 1 hora (3600 segundos)

**Cálculo esperado:**
- EXP actual = totalTo(99) + 0% de need(100)
- EXP ganada = 1,000,000 * 3,600 = 3,600,000,000
- EXP final = EXP actual + 3,600,000,000
- Nivel final = buscar nivel con esa EXP

### Test 2: Calculadora por Nivel
**Input:**
- Nivel actual: 400
- Progreso: 50%
- Nivel objetivo: 500
- EXP/segundo: 5,000,000

**Cálculo esperado:**
- EXP actual = totalTo(399) + 50% de need(400)
- EXP objetivo = totalTo(499)
- EXP necesaria = EXP objetivo - EXP actual
- Tiempo = EXP necesaria / 5,000,000 segundos

### Test 3: Verificar Historial
**Pasos:**
1. Hacer un cálculo por tiempo
2. Hacer un cálculo por nivel
3. Verificar que ambos aparezcan en el historial
4. Verificar que se guarden en localStorage
5. Recargar la página y verificar que persistan

## Verificación Manual

Para verificar que funciona correctamente:

1. **Calculadora por Tiempo:**
   - Ingresa: Nivel 1, 0%, 1000 EXP/s, 1 hora
   - Debería dar: Nivel 1 con X% (pequeño avance)
   - Verifica que aparezca en el historial

2. **Calculadora por Nivel:**
   - Ingresa: Nivel 1, 0%, Nivel 10, 1000 EXP/s
   - Debería calcular el tiempo necesario
   - Verifica que aparezca en el historial

3. **Consistencia:**
   - Si calculas "de nivel 1 a 10 con X EXP/s" obtienes T tiempo
   - Entonces "nivel 1 con X EXP/s durante T tiempo" debería dar nivel 10

## Fórmulas Utilizadas

### EXP Acumulada
```
totalTo(n) = suma de need(1) + need(2) + ... + need(n)
```

### EXP al inicio de un nivel
```
totalAtStart(level) = totalTo(level - 1)
```

### EXP actual del jugador
```
currentTotal = totalAtStart(level) + (need(level) * progreso / 100)
```

### Nivel por EXP total
Búsqueda binaria para encontrar el nivel N donde:
```
totalAtStart(N) <= expTotal < totalAtStart(N+1)
```
