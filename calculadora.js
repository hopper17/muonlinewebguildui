// calculadora.js — SIN imports

(function(){
  const $ = (id)=> document.getElementById(id);

  function clamp(n, min, max){
    if(n==null || isNaN(n)) return null;
    return Math.min(Math.max(n, min), max);
  }

  // Búsqueda binaria: último nivel cuyo TOTAL <= exp
  function levelByTotalExp(expTotal){
    let lo = 1, hi = 1700, ans = 1;
    while(lo <= hi){
      const mid = (lo + hi) >> 1;
      const t = window.totalTo(mid); // BigInt
      if (t <= expTotal){
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

  const totalSeconds = (dias||0)*86400 + (horas||0)*3600 + (minutos||0)*60;
  const expBudgetN   = BigInt(Math.max(0, exp)) * BigInt(totalSeconds);

  const currentTotal = window.totalTo(level) + (window.need(level) * BigInt(progreso) / 100n);
  const finalTotal   = currentTotal + expBudgetN;

  const nivelFinal   = levelByTotalExp(finalTotal);

  let porcentajeFinal = 100;
  if (nivelFinal < 1700) {
    const expDentroNivel   = finalTotal - window.totalTo(nivelFinal);
    const expNivelCompleto = window.need(nivelFinal);
    const pctx100 = expNivelCompleto > 0n ? (expDentroNivel * 10000n) / expNivelCompleto : 0n;
    porcentajeFinal = Number(pctx100) / 100;
  }

  $('resultado').textContent = `Vas a llegar al level ${nivelFinal} (${porcentajeFinal.toFixed(2)}%)`;
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
