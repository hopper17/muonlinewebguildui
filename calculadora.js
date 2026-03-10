// calculadora.js — SIN imports

(function(){
  const $ = (id)=> document.getElementById(id);

  function clamp(n, min, max){
    if(n==null || isNaN(n)) return null;
    return Math.min(Math.max(n, min), max);
  }

  // Búsqueda binaria: último nivel cuyo TOTAL acumulado al INICIO <= exp
  function levelByTotalExp(expTotal){
    let lo = 1, hi = 1700, ans = 1;
    while(lo <= hi){
      const mid = (lo + hi) >> 1;
      // totalTo(mid-1) = EXP acumulada al INICIO del nivel mid
      const totalAtStart = (mid > 1) ? window.totalTo(mid - 1) : 0n;
      if (totalAtStart <= expTotal){
        ans = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return ans;
  }

  async function bootstrap(){
    const btn = $('btn');
    const form = $('form');

    // Espera a que la data esté lista
    try{
      await window.expDataReady;
      btn.disabled = false;
    }catch{
      $('estado').textContent = 'No se pudieron cargar los datos de experiencia.';
      btn.disabled = true;
      return;
    }

function calcular(e){
  e.preventDefault();

  const level    = clamp(parseInt($('level').value, 10), 1, 1700);
  const progreso = clamp(parseInt($('progreso').value, 10), 0, 100);
  const exp      = parseInt($('exp').value, 10);

  const dias     = $('dias').value ? clamp(parseInt($('dias').value, 10), 0, 30) : 0;
  const horas    = $('horas').value ? clamp(parseInt($('horas').value, 10), 0, 23) : 0;
  const minutos  = $('minutos').value ? clamp(parseInt($('minutos').value, 10), 0, 60) : 0;

  if(level===null || progreso===null || isNaN(exp)){
    $('estado').textContent = 'Completa los campos obligatorios.';
    return;
  }
  $('estado').textContent = '';

  // Calcular tiempo total en segundos
  const totalSeconds = (dias||0)*86400 + (horas||0)*3600 + (minutos||0)*60;
  
  // Calcular EXP total que se ganará en ese tiempo
  const expBudgetN   = BigInt(Math.max(0, exp)) * BigInt(totalSeconds);

  // CORRECCIÓN: Calcular EXP acumulada actual
  // totalTo(level-1) = EXP acumulada al INICIO del nivel actual
  // Ejemplo: Si estás en nivel 10, totalTo(9) = toda la EXP necesaria para llegar a nivel 10
  const totalAtStart = (level > 1) ? window.totalTo(level - 1) : 0n;
  
  // Progreso dentro del nivel actual (% del nivel)
  const progressInLevel = (window.need(level) * BigInt(progreso)) / 100n;
  
  // EXP total actual = EXP al inicio del nivel + progreso dentro del nivel
  const currentTotal = totalAtStart + progressInLevel;
  
  // EXP total final = EXP actual + EXP que ganarás
  const finalTotal   = currentTotal + expBudgetN;

  // Encontrar en qué nivel estarás con esa EXP total
  const nivelFinal   = levelByTotalExp(finalTotal);

  // Calcular el % de progreso en el nivel final
  let porcentajeFinal = 100;
  if (nivelFinal < 1700) {
    const totalAtFinalStart = (nivelFinal > 1) ? window.totalTo(nivelFinal - 1) : 0n;
    const expDentroNivel   = finalTotal - totalAtFinalStart;
    const expNivelCompleto = window.need(nivelFinal);
    const pctx100 = expNivelCompleto > 0n ? (expDentroNivel * 10000n) / expNivelCompleto : 0n;
    porcentajeFinal = Number(pctx100) / 100;
  }

  // Mostrar resultado
  const resultadoDiv = $('resultado');
  const resultadoLevel = $('resultadoLevel');
  
  if(resultadoLevel){
    resultadoLevel.textContent = `Nivel ${nivelFinal}`;
  }
  
  // Agregar información adicional
  const infoDiv = document.getElementById('resultadoInfo');
  if(infoDiv){
    infoDiv.innerHTML = `
      <div style="color:var(--muted); font-size:14px; margin-top:8px">
        Progreso: <strong style="color:var(--txt)">${porcentajeFinal.toFixed(2)}%</strong> del nivel ${nivelFinal}
      </div>
      <div style="color:var(--muted); font-size:14px; margin-top:4px">
        Desde nivel <strong>${level}</strong> (${progreso}%) en <strong>${dias}d ${horas}h ${minutos}m</strong>
      </div>
      <button id="shareCalcTiempo" class="btn" style="padding:10px 18px; font-size:14px; background:linear-gradient(135deg, var(--brand-1), var(--brand-2)); border:0; margin-top:16px; display:inline-flex; align-items:center; gap:8px; cursor:pointer; border-radius:10px; font-weight:700; box-shadow:0 6px 20px rgba(26,209,255,.25)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/>
        </svg>
        Compartir Resultado
      </button>
    `;
    
    // Agregar event listener al botón de compartir
    setTimeout(function() {
      const shareBtn = document.getElementById('shareCalcTiempo');
      if (shareBtn) {
        shareBtn.onclick = function() {
          if (window.lastCalculationData) {
            shareCalculation(window.lastCalculationData);
          }
        };
      }
    }, 100);
  }
  
  // Mostrar el contenedor de resultado
  if(resultadoDiv){
    resultadoDiv.style.display = 'block';
  }
  
  // Actualizar barra de progreso
  const progressFill = document.getElementById('progressFill');
  const progressPercent = document.getElementById('progressPercent');
  if(progressFill && progressPercent){
    setTimeout(()=>{
      progressFill.style.width = porcentajeFinal + '%';
      progressPercent.textContent = porcentajeFinal.toFixed(2) + '%';
    }, 100);
  }
  
  // Guardar en historial
  saveToHistory({
    type: 'tiempo',
    from: level,
    progress: progreso,
    to: nivelFinal,
    time: `${dias}d ${horas}h ${minutos}m`,
    date: new Date().toLocaleString()
  });
  
  // Guardar datos para compartir
  window.lastCalculationData = {
    type: 'tiempo',
    from: level,
    progress: progreso,
    to: nivelFinal,
    exp: exp,
    dias: dias,
    horas: horas,
    minutos: minutos,
    time: `${dias}d ${horas}h ${minutos}m`
  };
  
  // Actualizar gráfico
  updateProgressChart(level, progreso, nivelFinal, porcentajeFinal, {
    dias, horas, minutos
  });
  
  return nivelFinal;
}

document.getElementById('form').addEventListener('submit', calcular);

// engancha el submit del formulario "por tiempo"
document.getElementById('form').addEventListener('submit', calcular);

  }

  // iniciar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();


// Sistema de historial con localStorage
function saveToHistory(data){
  try{
    let history = JSON.parse(localStorage.getItem('calcHistory') || '[]');
    history.unshift(data);
    if(history.length > 10) history = history.slice(0, 10);
    localStorage.setItem('calcHistory', JSON.stringify(history));
    renderHistory();
  }catch(e){
    console.error('Error guardando historial:', e);
  }
}

function renderHistory(){
  const list = document.getElementById('historyList');
  if(!list) return;
  
  try{
    const history = JSON.parse(localStorage.getItem('calcHistory') || '[]');
    if(history.length === 0){
      list.innerHTML = '<p style="text-align:center; opacity:.6">No hay cálculos recientes</p>';
      return;
    }
    
    list.innerHTML = history.map((item, i) => `
      <div class="panel" style="padding:12px; margin-bottom:8px; font-size:13px">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px">
          <strong>${item.type === 'tiempo' ? 'Por Tiempo' : 'Por Nivel'}</strong>
          <span style="opacity:.6">${item.date}</span>
        </div>
        <div>Nivel ${item.from} → ${item.to} ${item.time ? `(${item.time})` : ''}</div>
      </div>
    `).join('');
  }catch(e){
    console.error('Error renderizando historial:', e);
  }
}

// Limpiar historial
const clearBtn = document.getElementById('clearHistory');
if(clearBtn){
  clearBtn.addEventListener('click', ()=>{
    localStorage.removeItem('calcHistory');
    renderHistory();
  });
}

// Renderizar al cargar
renderHistory();


// Variable global para el gráfico
let progressChart = null;

// Función para crear/actualizar el gráfico de progresión
function updateProgressChart(fromLevel, fromProgress, toLevel, toProgress, timeData){
  const chartContainer = document.getElementById('chartContainer');
  const canvas = document.getElementById('progressChart');
  
  if(!canvas) return;
  
  // Mostrar contenedor
  chartContainer.style.display = 'block';
  
  // Calcular EXP total necesaria y tiempo total
  const totalAtStart = (fromLevel > 1) ? window.totalTo(fromLevel - 1) : 0n;
  const progressInLevel = (window.need(fromLevel) * BigInt(fromProgress)) / 100n;
  const currentTotal = totalAtStart + progressInLevel;
  
  const totalAtFinalStart = (toLevel > 1) ? window.totalTo(toLevel - 1) : 0n;
  const progressInFinalLevel = (window.need(toLevel) * BigInt(Math.floor(toProgress))) / 100n;
  const finalTotal = totalAtFinalStart + progressInFinalLevel;
  
  const totalExpNeeded = finalTotal - currentTotal;
  const totalSeconds = (timeData.dias || 0) * 86400 + (timeData.horas || 0) * 3600 + (timeData.minutos || 0) * 60;
  
  // Calcular puntos intermedios con tiempo - CORREGIDO para progresión lineal
  const points = [];
  const labels = [];
  const steps = Math.min(20, Math.max(5, Math.floor((toLevel - fromLevel) / 2))); // Ajustar número de puntos
  
  for(let i = 0; i <= steps; i++){
    const progress = i / steps;
    
    // Calcular EXP en este punto
    const expAtPoint = currentTotal + (totalExpNeeded * BigInt(Math.floor(progress * 1000))) / 1000n;
    
    // Encontrar nivel correspondiente a esta EXP
    let levelAtPoint = fromLevel;
    let expForLevel = totalAtStart + progressInLevel;
    
    // Buscar el nivel correcto
    while(levelAtPoint < toLevel && expForLevel < expAtPoint){
      levelAtPoint++;
      const levelStart = (levelAtPoint > 1) ? window.totalTo(levelAtPoint - 1) : 0n;
      expForLevel = levelStart + window.need(levelAtPoint);
    }
    
    // Calcular progreso dentro del nivel
    const levelStart = (levelAtPoint > 1) ? window.totalTo(levelAtPoint - 1) : 0n;
    const expInLevel = expAtPoint - levelStart;
    const needForLevel = window.need(levelAtPoint);
    const progressInCurrentLevel = needForLevel > 0n ? Number((expInLevel * 10000n) / needForLevel) / 100 : 0;
    
    // Calcular tiempo acumulado para este punto
    const timeElapsed = Math.floor(totalSeconds * progress);
    const d = Math.floor(timeElapsed / 86400);
    const h = Math.floor((timeElapsed % 86400) / 3600);
    const m = Math.floor((timeElapsed % 3600) / 60);
    
    points.push({
      x: i,
      y: levelAtPoint + (progressInCurrentLevel / 100),
      time: timeElapsed,
      timeStr: d > 0 ? `${d}d ${h}h ${m}m` : h > 0 ? `${h}h ${m}m` : `${m}m`
    });
    
    // Labels con tiempo
    if(i === 0){
      labels.push(`Inicio\n0h`);
    } else if(i === steps){
      const td = Math.floor(totalSeconds / 86400);
      const th = Math.floor((totalSeconds % 86400) / 3600);
      const tm = Math.floor((totalSeconds % 3600) / 60);
      labels.push(`Nivel ${toLevel}\n${td > 0 ? `${td}d ${th}h` : th > 0 ? `${th}h ${tm}m` : `${tm}m`}`);
    } else {
      labels.push(`${points[i].timeStr}`);
    }
  }
  
  // Obtener tema actual
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  const isDark = theme === 'dark';
  
  // Destruir gráfico anterior si existe
  if(progressChart){
    progressChart.destroy();
  }
  
  // Crear nuevo gráfico
  const ctx = canvas.getContext('2d');
  progressChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Nivel',
        data: points.map(p => p.y),
        borderColor: 'rgba(26, 209, 255, 1)',
        backgroundColor: 'rgba(26, 209, 255, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: 'rgba(124, 77, 255, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: isDark ? 'rgba(18, 26, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          titleColor: isDark ? '#e6f1ff' : '#212529',
          bodyColor: isDark ? '#94a3b8' : '#6c757d',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            title: function(context) {
              return 'Tiempo: ' + points[context[0].dataIndex].timeStr;
            },
            label: function(context) {
              const value = context.parsed.y;
              const level = Math.floor(value);
              const progress = ((value - level) * 100).toFixed(1);
              return `Nivel ${level} (${progress}%)`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            color: isDark ? '#94a3b8' : '#6c757d',
            callback: function(value) {
              return 'Lvl ' + Math.floor(value);
            }
          },
          grid: {
            color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Tiempo Transcurrido',
            color: isDark ? '#94a3b8' : '#6c757d',
            font: {
              size: 12,
              weight: 'bold'
            }
          },
          ticks: {
            color: isDark ? '#94a3b8' : '#6c757d',
            maxRotation: 45,
            minRotation: 45,
            font: {
              size: 10
            }
          },
          grid: {
            color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
          }
        }
      }
    }
  });
}


// Variable global para el gráfico de nivel
let progressChartNivel = null;

// Función para crear/actualizar el gráfico de la calculadora por nivel
function updateProgressChartNivel(fromLevel, fromProgress, toLevel, toProgress, timeData){
  const chartContainer = document.getElementById('chartContainerNivel');
  const canvas = document.getElementById('progressChartNivel');
  
  if(!canvas) return;
  
  // Mostrar contenedor
  chartContainer.style.display = 'block';
  
  // Calcular tiempo total en segundos
  const totalSeconds = (timeData.d || 0) * 86400 + (timeData.h || 0) * 3600 + (timeData.m || 0) * 60 + (timeData.s || 0);
  
  // Calcular EXP total necesaria
  const totalAtStart = (fromLevel > 1) ? window.totalTo(fromLevel - 1) : 0n;
  const progressInLevel = (window.need(fromLevel) * BigInt(fromProgress)) / 100n;
  const currentTotal = totalAtStart + progressInLevel;
  
  const totalAtFinalStart = (toLevel > 1) ? window.totalTo(toLevel - 1) : 0n;
  const finalTotal = totalAtFinalStart; // Hasta el inicio del nivel objetivo
  
  const totalExpNeeded = finalTotal - currentTotal;
  
  // Calcular puntos intermedios - CORREGIDO para progresión lineal
  const points = [];
  const labels = [];
  const steps = Math.min(20, Math.max(5, Math.floor((toLevel - fromLevel) / 2)));
  
  for(let i = 0; i <= steps; i++){
    const progress = i / steps;
    
    // Calcular EXP en este punto
    const expAtPoint = currentTotal + (totalExpNeeded * BigInt(Math.floor(progress * 1000))) / 1000n;
    
    // Encontrar nivel correspondiente a esta EXP
    let levelAtPoint = fromLevel;
    let expForLevel = totalAtStart + progressInLevel;
    
    // Buscar el nivel correcto
    while(levelAtPoint < toLevel && expForLevel < expAtPoint){
      levelAtPoint++;
      const levelStart = (levelAtPoint > 1) ? window.totalTo(levelAtPoint - 1) : 0n;
      expForLevel = levelStart + window.need(levelAtPoint);
    }
    
    // Calcular progreso dentro del nivel
    const levelStart = (levelAtPoint > 1) ? window.totalTo(levelAtPoint - 1) : 0n;
    const expInLevel = expAtPoint - levelStart;
    const needForLevel = window.need(levelAtPoint);
    const progressInCurrentLevel = needForLevel > 0n ? Number((expInLevel * 10000n) / needForLevel) / 100 : 0;
    
    // Calcular tiempo acumulado para este punto
    const timeElapsed = Math.floor(totalSeconds * progress);
    const d = Math.floor(timeElapsed / 86400);
    const h = Math.floor((timeElapsed % 86400) / 3600);
    const m = Math.floor((timeElapsed % 3600) / 60);
    
    points.push({
      x: i,
      y: levelAtPoint + (progressInCurrentLevel / 100),
      time: timeElapsed,
      timeStr: d > 0 ? `${d}d ${h}h ${m}m` : h > 0 ? `${h}h ${m}m` : `${m}m`
    });
    
    // Labels con tiempo
    if(i === 0){
      labels.push(`Inicio\n0h`);
    } else if(i === steps){
      const td = Math.floor(totalSeconds / 86400);
      const th = Math.floor((totalSeconds % 86400) / 3600);
      const tm = Math.floor((totalSeconds % 3600) / 60);
      labels.push(`Nivel ${toLevel}\n${td > 0 ? `${td}d ${th}h` : th > 0 ? `${th}h ${tm}m` : `${tm}m`}`);
    } else {
      labels.push(`${points[i].timeStr}`);
    }
  }
  
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  const isDark = theme === 'dark';
  
  if(progressChartNivel){
    progressChartNivel.destroy();
  }
  
  const ctx = canvas.getContext('2d');
  progressChartNivel = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Nivel',
        data: points.map(p => p.y),
        borderColor: 'rgba(124, 77, 255, 1)',
        backgroundColor: 'rgba(124, 77, 255, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: 'rgba(26, 209, 255, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: isDark ? 'rgba(18, 26, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          titleColor: isDark ? '#e6f1ff' : '#212529',
          bodyColor: isDark ? '#94a3b8' : '#6c757d',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            title: function(context) {
              return 'Tiempo: ' + points[context[0].dataIndex].timeStr;
            },
            label: function(context) {
              const value = context.parsed.y;
              const level = Math.floor(value);
              const progress = ((value - level) * 100).toFixed(1);
              return `Nivel ${level} (${progress}%)`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            color: isDark ? '#94a3b8' : '#6c757d',
            callback: function(value) {
              return 'Lvl ' + Math.floor(value);
            }
          },
          grid: {
            color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Tiempo Transcurrido',
            color: isDark ? '#94a3b8' : '#6c757d',
            font: {
              size: 12,
              weight: 'bold'
            }
          },
          ticks: {
            color: isDark ? '#94a3b8' : '#6c757d',
            maxRotation: 45,
            minRotation: 45,
            font: {
              size: 10
            }
          },
          grid: {
            color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
          }
        }
      }
    }
  });
}

// Exponer funciones globalmente para que calculadora.html pueda usarlas
window.updateProgressChartNivel = updateProgressChartNivel;
