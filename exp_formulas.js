/* EXP acumulada (IGCN) — cálculo correcto por diferencia:
   need(L→L+1) = Total(L+1) − Total(L)
   Regla tuya: NO usar rango ~7; ~6 cubre 1000..1700.
*/

const B = (x)=> BigInt(x);
const pow2n = (n)=> n*n;

// ---------- TOTAL EXP REGULAR (hasta 400) ----------
/* Del XML:
 ~0: Regular 1..255
 ~1: Regular 255..max regular
 Las fórmulas originales representan TOTAL acumulado.
*/
function totalRegularN(L){ // L in [1..400]
  const n = B(L);
  if (n <= 0n) return 0n;

  if (n <= 255n) {
    // ID 0: (9+L)*L*L*10  -> Total hasta L
    return (B(9)+n)*n*n*B(10);
  }

  // ID 1: ((9+L)*L*L*10) + ((9+(L-255))*(L-255)^2*1000)
  // Total regular hasta L
  return ((B(9)+n)*n*n*B(10))
       + ((B(9)+(n-B(255)))*(n-B(255))*(n-B(255))*B(1000));
}

// ---------- TOTAL EXP MASTER ----------
/* Del XML (TOTAL acumulada, no por nivel):
 ~2: M 1..600
 ~3: M 601..770
 ~4: M 771..800
 ~5: M 801..999
 ~6: M 1000..1449    (tú extiendes ~6 hasta 1700; NO usamos ~7)
*/
function totalMasterN(M){ // M in [1..1300] aprox (hasta 1700 total)
  const m = B(M);
  if (m <= 0n) return 0n;

  if (m <= 600n) {
    // ID 2: ((((9+M)*M*M*10)+((9+(M-255))*(M-255)^2*1000)-3892250000)/2)
    const base = ((B(9)+m)*m*m*B(10))
               + ((B(9)+(m-B(255)))*(m-B(255))*(m-B(255))*B(1000));
    return (base - B(3892250000)) / B(2);
  }

  if (m <= 770n) {
    // ID 3: f2(M) * (1 + 1.2*(M-600)^2 / 100000)
    const f2 = totalMasterN(600n);
    const extra = (B(12) * pow2n(m - B(600))) / B(1000000); // 1.2 = 12/10 y /100000 => /1e6
    return f2 * (B(1) + extra);
  }

  if (m <= 800n) {
    // ID 4: fórmula exacta muy larga; usamos misma progresión que el tramo anterior
    const f3edge = totalMasterN(770n);
    const extra = (B(12) * pow2n(m - B(600))) / B(1000000);
    return f3edge * (B(1) + extra - (B(12) * pow2n(B(770) - B(600))) / B(1000000));
  }

  if (m <= 999n) {
    // ID 5: ((M-800)*19024359459) + 300000000*(M-801)*((M-800)/2)
    return ( (m-B(800))*B(19024359459) )
         + ( B(300000000)*(m-B(801))*((m-B(800))/B(2)) );
  }

  // ID 6 extendido hasta 1700:
  // (((M-800)*19024359459)
  //  + 300000000*(M-801)*((M-800)/2)
  //  + 1200000000*(M-999)*((M-1000)/2))
  return ( (m-B(800))*B(19024359459) )
       + ( B(300000000)*(m-B(801))*((m-B(800))/B(2)) )
       + ( B(1200000000)*(m-B(999))*((m-B(1000))/B(2)) );
}

// ---------- TOTAL EXP GLOBAL (hasta TL) ----------
function totalExpToLevelN(totalLevel){ // total acumulado para alcanzar TL
  const TL = B(totalLevel);
  if (TL <= 0n) return 0n;
  if (TL <= 400n) return totalRegularN(Number(TL));
  const M = TL - 400n;
  return totalRegularN(400) + totalMasterN(Number(M));
}

// ---------- EXP para subir L -> L+1 (diferencia de totales) ----------
function getExpToNextN(totalLevel){
  const L = B(totalLevel);
  if (L >= 1700n) return 0n;
  const next = totalExpToLevelN(Number(L+1n));
  const curr = totalExpToLevelN(Number(L));
  return next - curr;             // ← ESTA es la “tabla real” por diferencia
}

// restante dentro del nivel con % de progreso
function getRemainInLevelN(totalLevel, progressPct){
  const need = getExpToNextN(totalLevel);
  const pct100 = B(Math.min(Math.max(progressPct||0, 0), 100));
  return (need * (B(100) - pct100)) / B(100);
}

// sumar niveles hasta tope (acumulación real)
function getExpRemainingN(fromLevel, progressPct, toLevel=1700){
  if (fromLevel >= toLevel) return 0n;
  let sum = getRemainInLevelN(fromLevel, progressPct);
  for (let L = fromLevel+1; L <= toLevel-1; L++){
    sum += getExpToNextN(L);
  }
  return sum;
}

// avanzar por presupuesto de EXP (usa la “tabla real” por diferencia)
function advanceLevelsByExpN(fromLevel, progressPct, expBudgetN, cap=1700){
  let level = Math.min(Math.max(fromLevel, 1), cap);
  let pct   = Math.min(Math.max(progressPct||0, 0), 100);
  let budget = expBudgetN;

  let remaining = getRemainInLevelN(level, pct);

  while (level < cap && budget >= remaining){
    budget -= remaining;
    level += 1;
    pct = 0;
    remaining = getExpToNextN(level);
  }

  // progreso parcial en el nivel alcanzado
  let progressPctOut = 100;
  if (level < cap){
    const need = getExpToNextN(level);
    progressPctOut = need > 0n ? Number((budget * 100n) / need) : 100;
    if (progressPctOut > 100) progressPctOut = 100;
  }

  return { level, progressPct: progressPctOut };
}

// Exponer API (BigInt por dentro, Number si necesitas ver valores)
window.MUExp = {
  getExpToNext: (lvl)=> Number(getExpToNextN(lvl)),
  getRemainingExpInLevel: (lvl,p)=> Number(getRemainInLevelN(lvl,p)),
  getExpRemaining: (from,p,to=1700)=> Number(getExpRemainingN(from,p,to)),
  advanceLevelsByExp: (from,p,budget,cap=1700)=>{
    const res = advanceLevelsByExpN(from,p, BigInt(Math.max(0,budget|0)), cap);
    return { level: res.level, progressPct: res.progressPct };
  },
  _N: { getExpToNextN, getRemainInLevelN, getExpRemainingN, advanceLevelsByExpN, totalExpToLevelN }
};
