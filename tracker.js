// tracker.js - Sistema de personajes
console.log('tracker.js cargado');

class CharacterManager {
  constructor() {
    console.log('CharacterManager constructor');
    this.characters = this.loadCharacters();
  }

  loadCharacters() {
    try {
      const chars = JSON.parse(localStorage.getItem('muCharacters') || '[]');
      // Limpiar personajes con datos incompletos
      return chars.filter(function(c) {
        return c.name && c.level && c.className;
      }).map(function(c) {
        // Asegurar que todos los campos existan
        if (!c.expPerSec) c.expPerSec = 0;
        if (!c.progress) c.progress = 0;
        if (!c.lastUpdated) c.lastUpdated = new Date().toISOString();
        if (!c.createdAt) c.createdAt = new Date().toISOString();
        if (!c.id) c.id = Date.now();
        return c;
      });
    } catch (e) {
      console.error('Error cargando personajes:', e);
      return [];
    }
  }

  saveCharacters() {
    localStorage.setItem('muCharacters', JSON.stringify(this.characters));
    this.render();
  }

  addCharacter(name, level, progress, className, expPerSec) {
    console.log('addCharacter llamado:', name, level, progress, className, expPerSec);
    const char = {
      id: Date.now(),
      name: name,
      level: parseInt(level),
      progress: parseInt(progress),
      className: className,
      expPerSec: parseInt(expPerSec),
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    this.characters.push(char);
    this.saveCharacters();
    return char;
  }

  editCharacter(id) {
    const char = this.characters.find(function(c) { return c.id === id; });
    if (!char) return;

    const modalHTML = 
      '<div style="text-align:center; margin-bottom:20px">' +
      '<div style="width:48px; height:48px; margin:0 auto 12px; background:linear-gradient(135deg, var(--brand-1), var(--brand-2)); border-radius:14px; display:flex; align-items:center; justify-content:center; box-shadow:0 6px 20px rgba(124,77,255,.3)">' +
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
      '</div>' +
      '<h3 style="margin:0 0 6px; font-size:20px; font-weight:800">Editar Personaje</h3>' +
      '<p style="color:var(--muted); font-size:13px; margin:0">Actualiza los datos de <strong>' + char.name + '</strong></p>' +
      '</div>' +
      '<form id="editCharForm" style="display:flex; flex-direction:column; gap:14px">' +
      
      '<div>' +
      '<label style="display:block; margin-bottom:6px; font-size:12px; font-weight:700; color:var(--txt); text-transform:uppercase; letter-spacing:.3px; opacity:.8">Nombre</label>' +
      '<input type="text" id="editName" class="input" placeholder="Nombre" value="' + char.name + '" required style="width:100%; padding:11px 13px; font-size:14px; border-radius:10px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1)">' +
      '</div>' +
      
      '<div style="display:grid; grid-template-columns:1fr 1fr; gap:12px">' +
      '<div>' +
      '<label style="display:block; margin-bottom:6px; font-size:12px; font-weight:700; color:var(--txt); text-transform:uppercase; letter-spacing:.3px; opacity:.8">Nivel</label>' +
      '<input type="number" id="editLevel" class="input" placeholder="Nivel" min="1" max="1700" value="' + char.level + '" required style="width:100%; padding:11px 13px; font-size:14px; border-radius:10px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1)">' +
      '</div>' +
      '<div>' +
      '<label style="display:block; margin-bottom:6px; font-size:12px; font-weight:700; color:var(--txt); text-transform:uppercase; letter-spacing:.3px; opacity:.8">Progreso %</label>' +
      '<input type="number" id="editProgress" class="input" placeholder="%" min="0" max="100" value="' + char.progress + '" required style="width:100%; padding:11px 13px; font-size:14px; border-radius:10px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1)">' +
      '</div>' +
      '</div>' +
      
      '<div>' +
      '<label style="display:block; margin-bottom:6px; font-size:12px; font-weight:700; color:var(--txt); text-transform:uppercase; letter-spacing:.3px; opacity:.8">EXP por segundo</label>' +
      '<input type="number" id="editExp" class="input" placeholder="EXP/s" min="1" value="' + char.expPerSec + '" required style="width:100%; padding:11px 13px; font-size:14px; border-radius:10px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1)">' +
      '</div>' +
      
      '<div>' +
      '<label style="display:block; margin-bottom:6px; font-size:12px; font-weight:700; color:var(--txt); text-transform:uppercase; letter-spacing:.3px; opacity:.8">Clase</label>' +
      '<select id="editClass" class="input" required style="width:100%; padding:11px 13px; font-size:14px; border-radius:10px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); cursor:pointer">' +
      '<option value="">Clase</option>' +
      '<option>Blade Master</option>' +
      '<option>Grand Master</option>' +
      '<option>High Elf</option>' +
      '<option>Duel Master</option>' +
      '<option>Lord Emperor</option>' +
      '<option>Dimension Master</option>' +
      '<option>Fist Master</option>' +
      '<option>Mirage Lancer</option>' +
      '<option>Rune Spell Master</option>' +
      '<option>Royal Slayer</option>' +
      '</select>' +
      '</div>' +
      
      '<div style="display:grid; grid-template-columns:1fr auto; gap:10px; margin-top:6px">' +
      '<button type="submit" class="btn" style="padding:13px; font-size:14px; font-weight:800; border-radius:10px; background:linear-gradient(135deg, var(--brand-1), var(--brand-2)); box-shadow:0 6px 20px rgba(124,77,255,.3)">Guardar</button>' +
      '<button type="button" onclick="closeModal()" class="btn btn-secondary" style="padding:13px 20px; font-size:14px; font-weight:700; border-radius:10px">Cancelar</button>' +
      '</div>' +
      '</form>';

    showModal(modalHTML);
    document.getElementById('editClass').value = char.className;

    const self = this;
    document.getElementById('editCharForm').onsubmit = function(e) {
      e.preventDefault();
      char.name = document.getElementById('editName').value;
      char.level = parseInt(document.getElementById('editLevel').value);
      char.progress = parseInt(document.getElementById('editProgress').value);
      char.expPerSec = parseInt(document.getElementById('editExp').value);
      char.className = document.getElementById('editClass').value;
      char.lastUpdated = new Date().toISOString();
      self.saveCharacters();
      closeModal();
      showToast('Personaje actualizado');
    };
  }

  deleteCharacter(id) {
    if (confirm('¿Estás seguro de eliminar este personaje?')) {
      this.characters = this.characters.filter(function(c) { return c.id !== id; });
      this.saveCharacters();
    }
  }

  useCharacter(id) {
    const char = this.characters.find(function(c) { return c.id === id; });
    if (!char) return;

    const nivelTab = document.getElementById('tabNivel');
    const isNivelActive = nivelTab && nivelTab.classList.contains('is-active');

    if (isNivelActive) {
      document.getElementById('nivelActual').value = char.level;
      document.getElementById('progNivel').value = char.progress;
      document.getElementById('expNivel').value = char.expPerSec;
    } else {
      document.getElementById('level').value = char.level;
      document.getElementById('progreso').value = char.progress;
      document.getElementById('exp').value = char.expPerSec;
    }

    showToast('Datos de ' + char.name + ' cargados');
  }

  render() {
    const container = document.getElementById('characterList');
    if (!container) return;

    if (this.characters.length === 0) {
      container.innerHTML = '<div style="text-align:center; padding:32px 20px; color:var(--muted)"><p style="margin:0; font-size:14px">No hay personajes guardados</p><p style="margin:4px 0 0; font-size:13px; opacity:.7">Agrega tus personajes para acceder rápidamente</p></div>';
      return;
    }

    container.innerHTML = this.characters.map(function(char) {
      // Validar que el personaje tenga todos los campos necesarios
      if (!char.expPerSec) char.expPerSec = 0;
      if (!char.progress) char.progress = 0;
      if (!char.lastUpdated) char.lastUpdated = new Date().toISOString();
      
      const lastUpdate = new Date(char.lastUpdated).toLocaleDateString('es', { day: 'numeric', month: 'short' });
      return '<div class="panel" style="padding:16px"><div style="margin-bottom:12px"><div style="display:flex; align-items:center; gap:8px; margin-bottom:6px"><strong style="font-size:16px">' + char.name + '</strong><span style="padding:2px 8px; background:rgba(124,77,255,.15); border:1px solid rgba(124,77,255,.3); border-radius:4px; font-size:11px; font-weight:600; color:#a78bfa">' + char.className + '</span></div><div style="color:var(--muted); font-size:13px">Nivel <strong>' + char.level + '</strong> (' + char.progress + '%) • EXP/s: <strong>' + char.expPerSec.toLocaleString() + '</strong></div><div style="color:var(--muted); font-size:11px; margin-top:4px; opacity:.6">Actualizado: ' + lastUpdate + '</div></div><div style="display:flex; gap:8px"><button onclick="characterManager.useCharacter(' + char.id + ')" class="btn" style="flex:1; padding:8px 12px; font-size:13px; background:linear-gradient(90deg, var(--brand-1), var(--brand-2)); font-weight:700">Usar</button><button onclick="characterManager.editCharacter(' + char.id + ')" class="btn" style="padding:8px 12px; font-size:13px; background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.15); color:var(--txt); font-weight:700; transition:all .2s">Editar</button><button onclick="characterManager.deleteCharacter(' + char.id + ')" class="btn btn-secondary" style="padding:8px 12px; font-size:13px; font-weight:600">Eliminar</button></div></div>';
    }).join('');
  }
}

const characterManager = new CharacterManager();
console.log('characterManager creado:', characterManager);

function shareCalculation(calcData) {
  if (!calcData) {
    showModal('<p style="text-align:center; padding:20px">No hay cálculo para compartir.</p>');
    return;
  }
  const shareData = { type: calcData.type, from: calcData.from, progress: calcData.progress, to: calcData.to, exp: calcData.exp, dias: calcData.dias || 0, horas: calcData.horas || 0, minutos: calcData.minutos || 0, time: calcData.time };
  const encoded = btoa(JSON.stringify(shareData));
  const shareUrl = window.location.origin + window.location.pathname + '?calc=' + encoded;
  navigator.clipboard.writeText(shareUrl).then(function() {
    showModal('<h3 style="margin:0 0 16px">¡Link copiado!</h3><p style="color:var(--muted); margin-bottom:16px">Comparte este link:</p><input type="text" value="' + shareUrl + '" readonly onclick="this.select()" class="input" style="margin-bottom:16px">');
  }).catch(function() {
    showModal('<h3 style="margin:0 0 16px">Compartir Cálculo</h3><p style="color:var(--muted); margin-bottom:16px">Copia este link:</p><input type="text" value="' + shareUrl + '" readonly onclick="this.select()" class="input">');
  });
}

function loadSharedCalculation() {
  const urlParams = new URLSearchParams(window.location.search);
  const calcParam = urlParams.get('calc');
  if (calcParam) {
    try {
      const data = JSON.parse(atob(calcParam));
      if (data.type === 'nivel') {
        const tab = document.getElementById('tabNivel');
        if (tab) tab.click();
        setTimeout(function() {
          document.getElementById('nivelActual').value = data.from;
          document.getElementById('nivelObjetivo').value = data.to;
          document.getElementById('progNivel').value = data.progress || 0;
          document.getElementById('expNivel').value = data.exp || '';
          showModal('<h3 style="margin:0 0 16px">📊 Cálculo Compartido Cargado</h3><p style="color:var(--muted); margin-bottom:16px">Los campos han sido llenados. Haz clic en "Calcular".</p><button onclick="closeModal()" class="btn" style="width:100%; padding:12px">Entendido</button>');
        }, 100);
      } else {
        const tab = document.getElementById('tabTiempo');
        if (tab) tab.click();
        setTimeout(function() {
          document.getElementById('level').value = data.from;
          document.getElementById('progreso').value = data.progress || 0;
          document.getElementById('exp').value = data.exp || '';
          document.getElementById('dias').value = data.dias || 0;
          document.getElementById('horas').value = data.horas || 0;
          document.getElementById('minutos').value = data.minutos || 0;
          showModal('<h3 style="margin:0 0 16px">📊 Cálculo Compartido Cargado</h3><p style="color:var(--muted); margin-bottom:16px">Los campos han sido llenados. Haz clic en "Calcular".</p><button onclick="closeModal()" class="btn" style="width:100%; padding:12px">Entendido</button>');
        }, 100);
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (e) {
      console.error('Error al cargar cálculo compartido:', e);
    }
  }
}

function showModal(content) {
  console.log('showModal llamado');
  let modal = document.getElementById('customModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'customModal';
    modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,.85); display:flex; align-items:center; justify-content:center; z-index:9999; padding:20px; backdrop-filter:blur(12px); animation:fadeIn .25s; overflow-y:auto;';
    document.body.appendChild(modal);
  }
  modal.innerHTML = '<div class="panel" style="max-width:460px; width:100%; padding:24px; max-height:90vh; overflow-y:auto; animation:slideDown .35s; border-radius:16px; box-shadow:0 24px 60px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.08); margin:auto">' + content + '</div>';
  modal.onclick = function(e) { if (e.target === modal) closeModal(); };
}

function closeModal() {
  const modal = document.getElementById('customModal');
  if (modal) {
    modal.style.animation = 'fadeOut .2s';
    setTimeout(function() { modal.remove(); }, 200);
  }
}

function showToast(message, duration) {
  duration = duration || 3000;
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed; bottom:24px; right:24px; background:linear-gradient(135deg, var(--brand-1), var(--brand-2)); color:#fff; padding:12px 20px; border-radius:8px; box-shadow:0 8px 24px rgba(0,0,0,.3); font-size:14px; font-weight:600; z-index:10000; animation:slideUp .3s;';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(function() {
    toast.style.animation = 'fadeOut .3s';
    setTimeout(function() { toast.remove(); }, 300);
  }, duration);
}

console.log('Esperando DOMContentLoaded...');
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded disparado');
  
  // Limpiar localStorage si hay problemas
  try {
    characterManager.render();
  } catch (e) {
    console.error('Error al renderizar personajes:', e);
    console.log('Limpiando localStorage...');
    localStorage.removeItem('muCharacters');
    location.reload();
  }
  
  loadSharedCalculation();

  const addCharBtn = document.getElementById('addCharacter');
  console.log('Botón addCharacter encontrado:', addCharBtn);
  
  if (addCharBtn) {
    console.log('Agregando event listener al botón');
    addCharBtn.addEventListener('click', function() {
      console.log('¡Botón clickeado!');
      
      const modalHTML = 
        '<div style="text-align:center; margin-bottom:20px">' +
        '<div style="width:48px; height:48px; margin:0 auto 12px; background:linear-gradient(135deg, var(--brand-1), var(--brand-2)); border-radius:14px; display:flex; align-items:center; justify-content:center; box-shadow:0 6px 20px rgba(124,77,255,.3)">' +
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/></svg>' +
        '</div>' +
        '<h3 style="margin:0 0 6px; font-size:20px; font-weight:800">Agregar Personaje</h3>' +
        '<p style="color:var(--muted); font-size:13px; margin:0">Guarda los datos de tu personaje</p>' +
        '</div>' +
        '<form id="addCharForm" style="display:flex; flex-direction:column; gap:14px">' +
        
        '<div>' +
        '<label style="display:block; margin-bottom:6px; font-size:12px; font-weight:700; color:var(--txt); text-transform:uppercase; letter-spacing:.3px; opacity:.8">Nombre</label>' +
        '<input type="text" id="charName" class="input" placeholder="Ej: MiPersonaje" required style="width:100%; padding:11px 13px; font-size:14px; border-radius:10px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1)">' +
        '</div>' +
        
        '<div style="display:grid; grid-template-columns:1fr 1fr; gap:12px">' +
        '<div>' +
        '<label style="display:block; margin-bottom:6px; font-size:12px; font-weight:700; color:var(--txt); text-transform:uppercase; letter-spacing:.3px; opacity:.8">Nivel</label>' +
        '<input type="number" id="charLevel" class="input" placeholder="1-1700" min="1" max="1700" required style="width:100%; padding:11px 13px; font-size:14px; border-radius:10px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1)">' +
        '</div>' +
        '<div>' +
        '<label style="display:block; margin-bottom:6px; font-size:12px; font-weight:700; color:var(--txt); text-transform:uppercase; letter-spacing:.3px; opacity:.8">Progreso %</label>' +
        '<input type="number" id="charProgress" class="input" placeholder="0-100" min="0" max="100" value="0" required style="width:100%; padding:11px 13px; font-size:14px; border-radius:10px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1)">' +
        '</div>' +
        '</div>' +
        
        '<div>' +
        '<label style="display:block; margin-bottom:6px; font-size:12px; font-weight:700; color:var(--txt); text-transform:uppercase; letter-spacing:.3px; opacity:.8">EXP por segundo</label>' +
        '<input type="number" id="charExp" class="input" placeholder="Ej: 1000000" min="1" required style="width:100%; padding:11px 13px; font-size:14px; border-radius:10px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1)">' +
        '</div>' +
        
        '<div>' +
        '<label style="display:block; margin-bottom:6px; font-size:12px; font-weight:700; color:var(--txt); text-transform:uppercase; letter-spacing:.3px; opacity:.8">Clase</label>' +
        '<select id="charClass" class="input" required style="width:100%; padding:11px 13px; font-size:14px; border-radius:10px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); cursor:pointer">' +
        '<option value="">Selecciona una clase</option>' +
        '<option>Blade Master</option>' +
        '<option>Grand Master</option>' +
        '<option>High Elf</option>' +
        '<option>Duel Master</option>' +
        '<option>Lord Emperor</option>' +
        '<option>Dimension Master</option>' +
        '<option>Fist Master</option>' +
        '<option>Mirage Lancer</option>' +
        '<option>Rune Spell Master</option>' +
        '<option>Royal Slayer</option>' +
        '</select>' +
        '</div>' +
        
        '<div style="display:grid; grid-template-columns:1fr auto; gap:10px; margin-top:6px">' +
        '<button type="submit" class="btn" style="padding:13px; font-size:14px; font-weight:800; border-radius:10px; background:linear-gradient(135deg, var(--brand-1), var(--brand-2)); box-shadow:0 6px 20px rgba(124,77,255,.3)">Agregar</button>' +
        '<button type="button" onclick="closeModal()" class="btn btn-secondary" style="padding:13px 20px; font-size:14px; font-weight:700; border-radius:10px">Cancelar</button>' +
        '</div>' +
        '</form>';

      showModal(modalHTML);

      document.getElementById('addCharForm').onsubmit = function(e) {
        console.log('Formulario enviado');
        e.preventDefault();
        characterManager.addCharacter(
          document.getElementById('charName').value,
          document.getElementById('charLevel').value,
          document.getElementById('charProgress').value,
          document.getElementById('charClass').value,
          document.getElementById('charExp').value
        );
        closeModal();
        showToast('Personaje agregado');
      };
    });
  } else {
    console.error('¡Botón addCharacter NO encontrado!');
  }
  
  console.log('Inicialización completa');
});
