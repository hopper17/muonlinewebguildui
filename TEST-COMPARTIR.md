# 🧪 Checklist de Pruebas - Sistema de Compartir

## Pruebas de Funcionalidad

### Test 1: Botón de Compartir en Resultado (Por Tiempo)
- [ ] Abrir calculadora
- [ ] Ir a tab "Por Tiempo"
- [ ] Llenar campos: Nivel 100, Progreso 50%, EXP/s 1000000, 1 día
- [ ] Hacer clic en "Calcular"
- [ ] Verificar que aparece el botón "Compartir Resultado" en el área de resultado
- [ ] Hacer clic en "Compartir Resultado"
- [ ] Verificar que se abre modal con link copiado
- [ ] Verificar que el link contiene `?calc=`

### Test 2: Botón de Compartir en Resultado (Por Nivel)
- [ ] Ir a tab "Por Nivel"
- [ ] Llenar campos: Nivel actual 500, Nivel objetivo 600, Progreso 0%, EXP/s 2000000
- [ ] Hacer clic en "Calcular"
- [ ] Verificar que aparece el botón "Compartir Resultado" en el área de resultado
- [ ] Hacer clic en "Compartir Resultado"
- [ ] Verificar que se abre modal con link copiado

### Test 3: Auto-llenado desde Link (Por Tiempo)
- [ ] Copiar un link compartido de calculadora por tiempo
- [ ] Abrir el link en nueva pestaña/ventana
- [ ] Verificar que se activa automáticamente el tab "Por Tiempo"
- [ ] Verificar que aparece modal informativo con los datos
- [ ] Cerrar modal
- [ ] Verificar que todos los campos están llenos:
  - [ ] Nivel actual
  - [ ] Progreso %
  - [ ] EXP/s
  - [ ] Días
  - [ ] Horas
  - [ ] Minutos
- [ ] Verificar que la URL ya no contiene `?calc=`
- [ ] Hacer clic en "Calcular"
- [ ] Verificar que el resultado es correcto

### Test 4: Auto-llenado desde Link (Por Nivel)
- [ ] Copiar un link compartido de calculadora por nivel
- [ ] Abrir el link en nueva pestaña/ventana
- [ ] Verificar que se activa automáticamente el tab "Por Nivel"
- [ ] Verificar que aparece modal informativo con los datos
- [ ] Cerrar modal
- [ ] Verificar que todos los campos están llenos:
  - [ ] Nivel actual
  - [ ] Nivel objetivo
  - [ ] Progreso %
  - [ ] EXP/s
- [ ] Verificar que la URL ya no contiene `?calc=`
- [ ] Hacer clic en "Calcular"
- [ ] Verificar que el resultado es correcto

### Test 5: Compartir en Redes Sociales
- [ ] Realizar un cálculo
- [ ] Hacer clic en "Compartir Resultado"
- [ ] Hacer clic en botón "Discord"
- [ ] Verificar que se abre Discord con el mensaje pre-llenado
- [ ] Repetir con "WhatsApp"
- [ ] Repetir con "Twitter"

### Test 6: Copiar Link Manualmente
- [ ] Realizar un cálculo
- [ ] Hacer clic en "Compartir Resultado"
- [ ] Hacer clic en el input del link
- [ ] Verificar que el texto se selecciona automáticamente
- [ ] Copiar manualmente (Ctrl+C)
- [ ] Pegar en otra ventana y verificar que funciona

### Test 7: Sin Cálculo Previo
- [ ] Recargar la página
- [ ] Ir a tab "Por Tiempo"
- [ ] Hacer clic en "Compartir Resultado" (sin hacer cálculo)
- [ ] Verificar que aparece mensaje: "Realiza un cálculo primero"

### Test 8: Cambiar entre Tabs
- [ ] Realizar cálculo en "Por Tiempo"
- [ ] Cambiar a tab "Por Nivel"
- [ ] Hacer clic en "Compartir Resultado"
- [ ] Verificar que comparte el último cálculo (Por Tiempo)
- [ ] Realizar cálculo en "Por Nivel"
- [ ] Hacer clic en "Compartir Resultado"
- [ ] Verificar que ahora comparte el cálculo de "Por Nivel"

## Casos Edge

### Test 9: Link Inválido
- [ ] Abrir URL con `?calc=invalid_base64`
- [ ] Verificar que no crashea
- [ ] Verificar que muestra la calculadora normal

### Test 10: Link con Datos Incompletos
- [ ] Crear link con datos parciales
- [ ] Abrir el link
- [ ] Verificar que llena los campos disponibles
- [ ] Verificar que campos faltantes quedan vacíos

## Resultados Esperados

✅ Todos los tests deben pasar
✅ No debe haber errores en la consola
✅ La experiencia debe ser fluida y sin bugs
✅ Los links compartidos deben funcionar en cualquier navegador
