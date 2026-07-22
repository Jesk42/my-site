/* ---------------- Navigation ---------------- */
const navBtns = document.querySelectorAll('.nav-btn');
const indicator = document.querySelector('.nav-indicator');
const tabs = document.querySelectorAll('.tab');

function moveIndicator(btn){
  if(!btn) return;
  indicator.style.width = btn.offsetWidth + 'px';
  indicator.style.transform = `translateX(${btn.offsetLeft - 6}px)`;
}

function activateTab(name){
  const targetBtn = document.querySelector(`.nav-btn[data-tab="${name}"]`);
  if(!targetBtn) return;

  navBtns.forEach(b => b.classList.remove('active'));
  targetBtn.classList.add('active');
  moveIndicator(targetBtn);

  tabs.forEach(t => t.classList.remove('active'));
  const targetTab = document.getElementById(name);
  targetTab.classList.add('active');

  // retrigger reveal animations inside the tab
  targetTab.querySelectorAll('.reveal-panel').forEach(el => {
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
  });
}

navBtns.forEach(btn => {
  btn.addEventListener('click', () => activateTab(btn.dataset.tab));
});

document.querySelectorAll('[data-goto]').forEach(el => {
  el.addEventListener('click', () => activateTab(el.dataset.goto));
});

window.addEventListener('resize', () => {
  moveIndicator(document.querySelector('.nav-btn.active'));
});

window.addEventListener('load', () => {
  moveIndicator(document.querySelector('.nav-btn.active'));
});

/* ---------------- Music player ---------------- */
const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const equalizer = document.getElementById('equalizer');

playBtn.addEventListener('click', () => {
  audio.play().catch(() => {});
  equalizer.classList.add('playing');
});

pauseBtn.addEventListener('click', () => {
  audio.pause();
  equalizer.classList.remove('playing');
});

audio.addEventListener('pause', () => equalizer.classList.remove('playing'));
audio.addEventListener('play', () => equalizer.classList.add('playing'));

/* ---------------- Diagonal falling stars background ---------------- */
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let width, height, stars = [];

const STAR_COUNT = 140;
const ANGLE = Math.atan2(1, 1); // top-left -> bottom-right diagonal

function resize(){
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

function makeStar(randomStart = true){
  const speed = 0.6 + Math.random() * 1.6;
  let x, y;

  if(randomStart){
    // scatter evenly across the whole screen on first load
    x = Math.random() * width;
    y = Math.random() * height;
  } else {
    // respawn along the top edge OR the left edge (chosen randomly),
    // spread across the full width/height so it doesn't bunch in the corner
    if(Math.random() < 0.5){
      x = Math.random() * width;   // anywhere along the top
      y = -20 - Math.random() * 40;
    } else {
      x = -20 - Math.random() * 40;
      y = Math.random() * height;  // anywhere along the left side
    }
  }

  return {
    x, y,
    r: 1 + Math.random() * 2.2,
    speed,
    twinkle: Math.random() * Math.PI * 2,
    hue: Math.random() > 0.5 ? '184,108,255' : '216,170,255'
  };
}

function initStars(){
  stars = Array.from({length: STAR_COUNT}, () => makeStar(true));
}

function step(){
  ctx.clearRect(0, 0, width, height);

  for(const s of stars){
    s.x += s.speed;
    s.y += s.speed;
    s.twinkle += 0.03;

    if(s.x > width + 20 || s.y > height + 20){
      Object.assign(s, makeStar(false));
    }

    const alpha = 0.5 + Math.sin(s.twinkle) * 0.4;
    const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
    glow.addColorStop(0, `rgba(${s.hue},${alpha})`);
    glow.addColorStop(1, 'rgba(184,108,255,0)');

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(255,255,255,${Math.min(alpha + 0.3, 1)})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(step);
}

resize();
initStars();
requestAnimationFrame(step);

window.addEventListener('resize', () => {
  resize();
  initStars();
});
