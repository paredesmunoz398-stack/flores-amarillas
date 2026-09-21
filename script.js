const pantallaInicio = document.getElementById('pantalla-inicio');
const pantallaJuego = document.getElementById('pantalla-juego');
const pantallaFinal = document.getElementById('pantalla-final');
const btnIniciar = document.getElementById('btn-iniciar');
const btnSalir = document.getElementById('btn-salir');
const btnVolver = document.getElementById('btn-volver');
const modalDespedida = document.getElementById('modal-despedida');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');
const btnCancelarModal = document.getElementById('btn-cancelar-modal');

const puntosTexto = document.getElementById('puntos');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const msgFlotante = document.getElementById('mensaje-flotante');
const musica = document.getElementById('musica');
const btnMusica = document.getElementById('btn-musica');
const iconoAudioOn = document.getElementById('icono-audio-on');
const iconoAudioOff = document.getElementById('icono-audio-off');

const portadaCanvas = document.getElementById('portadaCanvas');
const pCtx = portadaCanvas.getContext('2d');
const miniFlorHud = document.getElementById('miniFlorHud');
const hCtx = miniFlorHud.getContext('2d');

const ramoCanvas = document.getElementById('ramoCanvas');
const rCtx = ramoCanvas.getContext('2d');


const uCanvas = document.getElementById('universoCanvas');
const uCtx = uCanvas.getContext('2d');

let dpr = window.devicePixelRatio || 1;

let estrellas = [];
let polvoCosmico = [];

function initUniverso() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  uCanvas.width = w * dpr;
  uCanvas.height = h * dpr;
  uCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  estrellas = [];
  const colores = ['#ffffff', '#ffd166', '#a2d2ff', '#ffe5b4', '#ffcbf2', '#fff'];
  for (let i = 0; i < 140; i++) {
    estrellas.push({
      x: Math.random() * w,
      y: Math.random() * h,
      radio: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.85 + 0.15,
      velAlpha: 0.008 + Math.random() * 0.02,
      color: colores[Math.floor(Math.random() * colores.length)]
    });
  }

  polvoCosmico = [];
  for (let i = 0; i < 35; i++) {
    polvoCosmico.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -0.15 - Math.random() * 0.35,
      radio: Math.random() * 2 + 0.8,
      alpha: Math.random() * 0.6 + 0.2
    });
  }
}
window.addEventListener('resize', initUniverso);
initUniverso();

function animarUniverso() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  
  uCtx.fillStyle = '#000000';
  uCtx.fillRect(0, 0, w, h);

  const gradNeb1 = uCtx.createRadialGradient(w * 0.25, h * 0.3, 10, w * 0.25, h * 0.3, w * 0.55);
  gradNeb1.addColorStop(0, 'rgba(120, 40, 180, 0.18)');
  gradNeb1.addColorStop(1, 'transparent');
  uCtx.fillStyle = gradNeb1;
  uCtx.fillRect(0, 0, w, h);

  const gradNeb2 = uCtx.createRadialGradient(w * 0.8, h * 0.7, 10, w * 0.8, h * 0.7, w * 0.5);
  gradNeb2.addColorStop(0, 'rgba(255, 190, 11, 0.12)');
  gradNeb2.addColorStop(1, 'transparent');
  uCtx.fillStyle = gradNeb2;
  uCtx.fillRect(0, 0, w, h);

  estrellas.forEach(e => {
    e.alpha += e.velAlpha;
    if (e.alpha > 1 || e.alpha < 0.15) {
      e.velAlpha = -e.velAlpha;
    }
    uCtx.save();
    uCtx.globalAlpha = Math.max(0, Math.min(1, e.alpha));
    uCtx.beginPath();
    uCtx.arc(e.x, e.y, e.radio, 0, Math.PI * 2);
    uCtx.fillStyle = e.color;
    uCtx.shadowBlur = 8;
    uCtx.shadowColor = e.color;
    uCtx.fill();
    uCtx.restore();
  });

  polvoCosmico.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.y < 0) {
      p.y = h;
      p.x = Math.random() * w;
    }
    uCtx.save();
    uCtx.globalAlpha = p.alpha;
    uCtx.beginPath();
    uCtx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
    uCtx.fillStyle = '#ffd166';
    uCtx.shadowBlur = 8;
    uCtx.shadowColor = '#ffd166';
    uCtx.fill();
    uCtx.restore();
  });

  requestAnimationFrame(animarUniverso);
}
animarUniverso();

let musicaActiva = false;
function alternarMusica() {
  if (musica.paused) {
    musica.volume = 0.75;
    musica.play().then(() => {
      musicaActiva = true;
      iconoAudioOn.classList.remove('hidden');
      iconoAudioOff.classList.add('hidden');
    }).catch(e => console.log("Esperando interacción para audio", e));
  } else {
    musica.pause();
    musicaActiva = false;
    iconoAudioOn.classList.add('hidden');
    iconoAudioOff.classList.remove('hidden');
  }
}
btnMusica.addEventListener('click', alternarMusica);

function dibujarGirasol(ctx, radio, bloom = 1) {
  const r = radio * bloom;
  const totalPetalos = 14;
  for (let i = 0; i < totalPetalos; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI * 2) / totalPetalos);
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.8, r * 0.28, r * 0.6, 0, 0, Math.PI * 2);
    const grad = ctx.createLinearGradient(0, 0, 0, -r * 1.4);
    grad.addColorStop(0, '#e59819');
    grad.addColorStop(0.5, '#ffd166');
    grad.addColorStop(1, '#fffae0');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }
  for (let i = 0; i < totalPetalos; i++) {
    ctx.save();
    ctx.rotate(((i + 0.5) * Math.PI * 2) / totalPetalos);
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.72, r * 0.24, r * 0.52, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#ffea79';
    ctx.fill();
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.44, 0, Math.PI * 2);
  const gradCentro = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.44);
  gradCentro.addColorStop(0, '#542c0e');
  gradCentro.addColorStop(0.7, '#381c08');
  gradCentro.addColorStop(1, '#1f0d03');
  ctx.fillStyle = gradCentro;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, r * 0.32, 0, Math.PI * 2);
  ctx.strokeStyle = '#8c5324';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([2, 3]);
  ctx.stroke();
  ctx.setLineDash([]);
}

function dibujarTulipan(ctx, radio, bloom = 1) {
  const r = radio * bloom;
  ctx.beginPath();
  ctx.ellipse(0, -r * 0.45, r * 0.4, r * 0.75, 0, 0, Math.PI * 2);
  const gradA = ctx.createLinearGradient(0, 0, 0, -r * 1.2);
  gradA.addColorStop(0, '#e76f51');
  gradA.addColorStop(0.6, '#f4a261');
  gradA.addColorStop(1, '#ffd166');
  ctx.fillStyle = gradA;
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(-r * 0.32, -r * 0.35, r * 0.36, r * 0.7, -0.32, 0, Math.PI * 2);
  ctx.fillStyle = '#ffd166';
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(r * 0.32, -r * 0.35, r * 0.36, r * 0.7, 0.32, 0, Math.PI * 2);
  ctx.fillStyle = '#ffe082';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, r * 0.35, r * 0.22, 0, Math.PI);
  ctx.fillStyle = '#2d6a4f';
  ctx.fill();
}

function dibujarMargarita(ctx, radio, bloom = 1) {
  const r = radio * bloom;
  const totalPetalos = 10;
  for (let i = 0; i < totalPetalos; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI * 2) / totalPetalos);
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.72, r * 0.22, r * 0.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#fffdf0';
    ctx.strokeStyle = '#ffeaa7';
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2);
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.4);
  grad.addColorStop(0, '#f4a261');
  grad.addColorStop(1, '#e76f51');
  ctx.fillStyle = grad;
  ctx.fill();
}

function dibujarRosaDorada(ctx, radio, bloom = 1) {
  const r = radio * bloom;
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.2, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 215, 0, 0.25)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, r * 0.95, 0, Math.PI * 2);
  ctx.fillStyle = '#d4942a';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, -r * 0.1, r * 0.75, 0, Math.PI * 2);
  ctx.fillStyle = '#f3ba4b';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(r * 0.12, 0, r * 0.52, 0, Math.PI * 2);
  ctx.fillStyle = '#ffd166';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, r * 0.3, 0, Math.PI * 2);
  ctx.fillStyle = '#fff4cc';
  ctx.fill();
}

function dibujarFlorCanvas(ctx, x, y, radio, rotacion, tipo, bloom = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotacion);

  if (tipo === 'tulipan') {
    dibujarTulipan(ctx, radio, bloom);
  } else if (tipo === 'margarita') {
    dibujarMargarita(ctx, radio, bloom);
  } else if (tipo === 'rosa') {
    dibujarRosaDorada(ctx, radio, bloom);
  } else {
    dibujarGirasol(ctx, radio, bloom);
  }

  ctx.restore();
}

let portadaAngulo = 0;
function animarPortada() {
  pCtx.clearRect(0, 0, 100, 100);
  pCtx.save();
  pCtx.translate(50, 50);
  pCtx.rotate(portadaAngulo);
  dibujarGirasol(pCtx, 28, 1);
  pCtx.restore();

  hCtx.clearRect(0, 0, 28, 28);
  hCtx.save();
  hCtx.translate(14, 14);
  dibujarGirasol(hCtx, 9, 1);
  hCtx.restore();

  portadaAngulo += 0.01;
  requestAnimationFrame(animarPortada);
}
animarPortada();

function dibujarCanasta(ctx, x, y, w, h) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + 5, y);
  ctx.lineTo(x + w - 5, y);
  ctx.lineTo(x + w - 16, y + h);
  ctx.lineTo(x + 16, y + h);
  ctx.closePath();
  ctx.fillStyle = '#7a5130';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#dfb15b';
  ctx.stroke();

  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x - 3, y - 5, w + 6, 10, 5);
  } else {
    ctx.rect(x - 3, y - 5, w + 6, 10);
  }
  ctx.fillStyle = '#dfb15b';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x + w / 2, y, w / 2 - 6, Math.PI, 0);
  ctx.strokeStyle = 'rgba(223, 177, 91, 0.85)';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
}

let puntos = 0;
const META_FLORES = 15;
let juegoActivo = false;
let animacionId;
let flores = [];
let particulas = [];
let yaCompletoUnaVez = false;

const jugador = {
  ancho: 110,
  alto: 48,
  x: window.innerWidth / 2 - 55,
  y: window.innerHeight - 100
};

function resizeCanvas() {
  dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  
  const esMovil = width < 768;
  jugador.ancho = esMovil ? Math.max(88, width * 0.24) : 125;
  jugador.alto = jugador.ancho * 0.42;
  jugador.y = height - (esMovil ? Math.max(90, height * 0.12) : 110);
  jugador.x = Math.max(10, Math.min(width - jugador.ancho - 10, jugador.x));
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const frases = {
  4: "Iluminas todo a tu alrededor ✨",
  8: "Un detalle que florece contigo 💛",
  12: "Tu ramo está casi completo 🌻"
};

function moverCanasta(clientX) {
  const rect = canvas.getBoundingClientRect();
  const touchX = clientX - rect.left;
  const screenWidth = window.innerWidth;
  jugador.x = Math.max(10, Math.min(screenWidth - jugador.ancho - 10, touchX - jugador.ancho / 2));
}

canvas.addEventListener('touchstart', (e) => {
  if (!juegoActivo) return;
  e.preventDefault();
  moverCanasta(e.touches[0].clientX);
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
  if (!juegoActivo) return;
  e.preventDefault();
  moverCanasta(e.touches[0].clientX);
}, { passive: false });

canvas.addEventListener('mousemove', (e) => {
  if (!juegoActivo) return;
  moverCanasta(e.clientX);
});

function crearParticulas(x, y, esEspecial = false) {
  const cantidad = esEspecial ? 22 : 14;
  for (let i = 0; i < cantidad; i++) {
    particulas.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * (esEspecial ? 7 : 5),
      vy: (Math.random() - 0.5) * (esEspecial ? 7 : 5),
      radio: Math.random() * (esEspecial ? 4 : 2.6) + 1.2,
      alpha: 1,
      color: esEspecial ? '#fff3b0' : '#ffd166'
    });
  }
}

function crearFlor() {
  const screenWidth = window.innerWidth;
  const esMovil = screenWidth < 768;
  const radioBase = esMovil ? 26 : 34;

  const rand = Math.random();
  let tipoElegido = 'girasol';
  let valor = 1;

  if (rand < 0.35) {
    tipoElegido = 'girasol';
  } else if (rand < 0.65) {
    tipoElegido = 'tulipan';
  } else if (rand < 0.90) {
    tipoElegido = 'margarita';
  } else {
    tipoElegido = 'rosa';
    valor = 2;
  }

  flores.push({
    x: Math.random() * (screenWidth - radioBase * 2 - 30) + radioBase + 15,
    y: -40,
    radio: radioBase,
    rotacion: Math.random() * Math.PI,
    velocidadRot: (Math.random() - 0.5) * 0.04,
    velocidad: (tipoElegido === 'rosa' ? 4.2 : 3.4) + Math.random() * 1.2,
    tipo: tipoElegido,
    valor: valor
  });
}

function mostrarMensaje(texto) {
  msgFlotante.innerText = texto;
  msgFlotante.classList.remove('hidden');
  setTimeout(() => msgFlotante.classList.add('hidden'), 2400);
}

let frames = 0;
function gameLoop() {
  if (!juegoActivo) return;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  ctx.clearRect(0, 0, screenWidth, screenHeight);
  dibujarCanasta(ctx, jugador.x, jugador.y, jugador.ancho, jugador.alto);

  frames++;
  if (frames % 38 === 0) {
    crearFlor();
  }

  for (let i = flores.length - 1; i >= 0; i--) {
    const flor = flores[i];
    flor.y += flor.velocidad;
    flor.rotacion += flor.velocidadRot;

    dibujarFlorCanvas(ctx, flor.x, flor.y, flor.radio, flor.rotacion, flor.tipo);

    if (
      flor.y + flor.radio >= jugador.y &&
      flor.y - flor.radio <= jugador.y + jugador.alto &&
      flor.x + flor.radio >= jugador.x &&
      flor.x - flor.radio <= jugador.x + jugador.ancho
    ) {
      puntos += flor.valor;
      puntosTexto.innerText = puntos;
      crearParticulas(flor.x, flor.y, flor.tipo === 'rosa');

      if (frases[puntos] || (puntos >= 4 && !frases[puntos] && puntos % 5 === 0)) {
        if (frases[puntos]) mostrarMensaje(frases[puntos]);
      }

      flores.splice(i, 1);

      if (puntos >= META_FLORES) {
        ganarJuego();
        return;
      }
      continue;
    }

    if (flor.y > screenHeight + 50) {
      flores.splice(i, 1);
    }
  }

  for (let i = particulas.length - 1; i >= 0; i--) {
    const p = particulas[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.025;
    if (p.alpha <= 0) {
      particulas.splice(i, 1);
      continue;
    }
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
    ctx.fillStyle = p.color || '#ffd166';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#e5b85a';
    ctx.fill();
    ctx.restore();
  }

  animacionId = requestAnimationFrame(gameLoop);
}

btnIniciar.addEventListener('click', () => {
  musica.volume = 0.75;
  musica.play().then(() => {
    musicaActiva = true;
    iconoAudioOn.classList.remove('hidden');
    iconoAudioOff.classList.add('hidden');
  }).catch(e => console.log("Audio interact", e));
  
  pantallaInicio.classList.remove('activa');
  pantallaJuego.classList.add('activa');
  resizeCanvas();
  puntos = 0;
  puntosTexto.innerText = puntos;
  flores = [];
  particulas = [];
  juegoActivo = true;
  gameLoop();
});

btnVolver.addEventListener('click', () => {
  cancelAnimationFrame(animRamoId);
  yaCompletoUnaVez = true;
  
  pantallaFinal.classList.remove('activa');
  pantallaInicio.classList.add('activa');
  
  btnSalir.classList.remove('hidden');
  btnIniciar.querySelector('span').innerText = 'Jugar de nuevo 🌻';
});

btnSalir.addEventListener('click', () => {
  modalDespedida.classList.remove('hidden');
});

btnCancelarModal.addEventListener('click', () => {
  modalDespedida.classList.add('hidden');
});

btnCerrarModal.addEventListener('click', () => {
  // Pausar y apagar música
  musica.pause();
  musica.currentTime = 0;
  
  // Intentar cerrar la pestaña
  window.close();
  
  // Si el navegador no permite window.close(), mostrar pantalla de despedida final
  document.body.innerHTML = `
    <div style="height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#000000; color:#ffd166; font-family:'Montserrat',sans-serif; text-align:center; padding:25px; box-sizing:border-box;">
      <div style="font-size:55px; margin-bottom:18px;">🌻</div>
      <h1 style="font-family:'Cormorant Garamond',serif; font-size:34px; margin-bottom:10px; color:#ffd166;">¡Hasta pronto!</h1>
      <p style="color:#e5dccf; font-size:14px; max-width:320px; line-height:1.6; margin-bottom:20px;">
        Ya puedes cerrar esta pestaña. Gracias por recibir estas flores amarillas 💛
      </p>
      <button onclick="location.reload()" style="background:rgba(255,209,102,0.15); border:1px solid #ffd166; color:#ffd166; padding:10px 24px; border-radius:30px; font-size:12px; cursor:pointer; font-weight:600;">
        Volver a abrir
      </button>
    </div>
  `;
});

let ramoFlores = [];
let ramoPolen = [];
let tiempoRamo = 0;
let animRamoId;

function iniciarRamoGenerativo() {
  const box = document.querySelector('.ramo-generativo-box');
  const w = box.clientWidth;
  const h = box.clientHeight;

  ramoCanvas.width = w * dpr;
  ramoCanvas.height = h * dpr;
  rCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const cx = w / 2;
  const cy = h * 0.44;

  ramoFlores = [
    { x: cx, y: cy - 48, radio: 32, tipo: 'girasol', delay: 0.1, bloom: 0, angulo: 0, swayAmp: 0.03, swayFreq: 1.2 },
    { x: cx - 45, y: cy - 35, radio: 26, tipo: 'margarita', delay: 0.25, bloom: 0, angulo: -0.2, swayAmp: 0.04, swayFreq: 1.5 },
    { x: cx + 45, y: cy - 35, radio: 28, tipo: 'rosa', delay: 0.35, bloom: 0, angulo: 0.2, swayAmp: 0.04, swayFreq: 1.4 },
    { x: cx - 68, y: cy + 5, radio: 28, tipo: 'tulipan', delay: 0.45, bloom: 0, angulo: -0.4, swayAmp: 0.05, swayFreq: 1.3 },
    { x: cx + 68, y: cy + 5, radio: 28, tipo: 'tulipan', delay: 0.55, bloom: 0, angulo: 0.4, swayAmp: 0.05, swayFreq: 1.3 },
    { x: cx - 35, y: cy + 12, radio: 25, tipo: 'margarita', delay: 0.65, bloom: 0, angulo: -0.15, swayAmp: 0.03, swayFreq: 1.6 },
    { x: cx + 35, y: cy + 12, radio: 27, tipo: 'rosa', delay: 0.75, bloom: 0, angulo: 0.15, swayAmp: 0.03, swayFreq: 1.5 },
    { x: cx, y: cy + 22, radio: 38, tipo: 'girasol', delay: 0.85, bloom: 0, angulo: 0, swayAmp: 0.02, swayFreq: 1.1 }
  ];

  ramoPolen = [];
  for (let i = 0; i < 24; i++) {
    ramoPolen.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.3 - Math.random() * 0.4,
      radio: Math.random() * 2 + 1,
      alpha: Math.random() * 0.7 + 0.3
    });
  }

  tiempoRamo = 0;
  cancelAnimationFrame(animRamoId);
  bucleRamo();
}

function bucleRamo() {
  const w = ramoCanvas.width / dpr;
  const h = ramoCanvas.height / dpr;
  const cx = w / 2;
  const cy = h * 0.44;

  rCtx.clearRect(0, 0, w, h);
  tiempoRamo += 0.02;

  rCtx.save();
  const hojasFondo = [
    { x: cx - 75, y: cy - 25, rx: 18, ry: 10, rot: -0.7 },
    { x: cx + 75, y: cy - 25, rx: 18, ry: 10, rot: 0.7 },
    { x: cx - 35, y: cy - 70, rx: 20, ry: 11, rot: -0.3 },
    { x: cx + 35, y: cy - 70, rx: 20, ry: 11, rot: 0.3 },
    { x: cx, y: cy - 80, rx: 22, ry: 11, rot: 0 }
  ];
  hojasFondo.forEach(hoja => {
    rCtx.save();
    rCtx.translate(hoja.x, hoja.y);
    rCtx.rotate(hoja.rot);
    rCtx.beginPath();
    rCtx.ellipse(0, 0, hoja.rx, hoja.ry, 0, 0, Math.PI * 2);
    rCtx.fillStyle = '#2d6a4f';
    rCtx.fill();
    rCtx.restore();
  });
  rCtx.restore();

  rCtx.save();
  rCtx.beginPath();
  rCtx.moveTo(cx - 95, cy + 40);
  rCtx.lineTo(cx + 95, cy + 40);
  rCtx.lineTo(cx + 35, cy + 145);
  rCtx.lineTo(cx - 35, cy + 145);
  rCtx.closePath();
  const kraftGrad = rCtx.createLinearGradient(cx - 95, cy, cx + 95, cy + 145);
  kraftGrad.addColorStop(0, '#c89665');
  kraftGrad.addColorStop(1, '#8c5828');
  rCtx.fillStyle = kraftGrad;
  rCtx.fill();
  rCtx.restore();

  ramoFlores.forEach(flor => {
    if (tiempoRamo > flor.delay) {
      flor.bloom = Math.min(1, flor.bloom + 0.04);
    }
    const sway = Math.sin(tiempoRamo * flor.swayFreq) * flor.swayAmp;
    dibujarFlorCanvas(rCtx, flor.x, flor.y, flor.radio, flor.angulo + sway, flor.tipo, flor.bloom);
  });

  rCtx.save();
  rCtx.beginPath();
  rCtx.moveTo(cx - 85, cy + 45);
  rCtx.lineTo(cx + 35, cy + 130);
  rCtx.lineTo(cx - 25, cy + 148);
  rCtx.lineTo(cx - 95, cy + 70);
  rCtx.closePath();
  rCtx.fillStyle = '#d4a373';
  rCtx.fill();

  rCtx.beginPath();
  rCtx.moveTo(cx + 85, cy + 45);
  rCtx.lineTo(cx - 35, cy + 130);
  rCtx.lineTo(cx + 25, cy + 148);
  rCtx.lineTo(cx + 95, cy + 70);
  rCtx.closePath();
  rCtx.fillStyle = '#bc8a5f';
  rCtx.fill();

  const cintaGrad = rCtx.createLinearGradient(cx - 30, cy + 95, cx + 30, cy + 125);
  cintaGrad.addColorStop(0, '#ffe8a1');
  cintaGrad.addColorStop(0.5, '#d4a337');
  cintaGrad.addColorStop(1, '#996e13');

  rCtx.beginPath();
  rCtx.ellipse(cx - 18, cy + 110, 16, 9, -0.4, 0, Math.PI * 2);
  rCtx.ellipse(cx + 18, cy + 110, 16, 9, 0.4, 0, Math.PI * 2);
  rCtx.fillStyle = cintaGrad;
  rCtx.fill();

  rCtx.beginPath();
  rCtx.arc(cx, cy + 110, 7.5, 0, Math.PI * 2);
  rCtx.fillStyle = '#f4a261';
  rCtx.fill();
  rCtx.restore();

  ramoPolen.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.y < 0) {
      p.y = h;
      p.x = Math.random() * w;
    }
    rCtx.save();
    rCtx.globalAlpha = p.alpha;
    rCtx.beginPath();
    rCtx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
    rCtx.fillStyle = '#ffd166';
    rCtx.shadowBlur = 8;
    rCtx.shadowColor = '#e5b85a';
    rCtx.fill();
    rCtx.restore();
  });

  animRamoId = requestAnimationFrame(bucleRamo);
}

function interactuarRamo(clientX, clientY) {
  const rect = ramoCanvas.getBoundingClientRect();
  const clickX = clientX - rect.left;
  const clickY = clientY - rect.top;

  ramoFlores.forEach(flor => {
    const dist = Math.hypot(clickX - flor.x, clickY - flor.y);
    if (dist < flor.radio + 15) {
      flor.bloom = 1.3;
      flor.angulo += (Math.random() - 0.5) * 0.5;
      for (let i = 0; i < 15; i++) {
        ramoPolen.push({
          x: flor.x,
          y: flor.y,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          radio: Math.random() * 3 + 1,
          alpha: 1
        });
      }
    }
  });
}

ramoCanvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  interactuarRamo(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: false });

ramoCanvas.addEventListener('mousedown', (e) => {
  interactuarRamo(e.clientX, e.clientY);
});

function ganarJuego() {
  juegoActivo = false;
  cancelAnimationFrame(animacionId);
  pantallaJuego.classList.remove('activa');
  pantallaFinal.classList.add('activa');
  iniciarRamoGenerativo();
}