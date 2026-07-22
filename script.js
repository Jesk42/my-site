/* ---------------- Sidebar Navigation ---------------- */
const sideBtns = document.querySelectorAll('.side-btn');
const indicator = document.querySelector('.side-indicator');
const tabs = document.querySelectorAll('.tab');

function moveIndicator(btn){
  if(!btn) return;
  indicator.style.height = btn.offsetHeight + 'px';
  indicator.style.transform = `translateY(${btn.offsetTop}px)`;
}

function activateTab(name){
  const targetBtn = document.querySelector(`.side-btn[data-tab="${name}"]`);
  if(!targetBtn) return;

  sideBtns.forEach(b => b.classList.remove('active'));
  targetBtn.classList.add('active');
  moveIndicator(targetBtn);

  tabs.forEach(t => t.classList.remove('active'));
  const targetTab = document.getElementById(name);
  targetTab.classList.add('active');

  targetTab.querySelectorAll('.reveal-panel').forEach(el => {
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
  });
}

sideBtns.forEach(btn => {
  btn.addEventListener('click', () => activateTab(btn.dataset.tab));
});

window.addEventListener('resize', () => {
  moveIndicator(document.querySelector('.side-btn.active'));
});

window.addEventListener('load', () => {
  moveIndicator(document.querySelector('.side-btn.active'));
});

/* ---------------- Easter egg ---------------- */
const brandBtn = document.getElementById('brandBtn');
const eggOverlay = document.getElementById('eggOverlay');
const eggClose = document.getElementById('eggClose');

function openEgg(){
  eggOverlay.classList.add('open');
}
function closeEgg(){
  eggOverlay.classList.remove('open');
}

brandBtn.addEventListener('click', openEgg);
eggClose.addEventListener('click', closeEgg);
eggOverlay.addEventListener('click', (e) => {
  if(e.target === eggOverlay) closeEgg();
});
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') closeEgg();
});

/* ---------------- Background music (autoplay) ---------------- */
const bgMusic = document.getElementById('bgMusic');
bgMusic.volume = 0.5;

function tryPlayMusic(){
  const playPromise = bgMusic.play();
  if(playPromise !== undefined){
    playPromise.catch(() => {
      // browser blocked autoplay — start on first user interaction
      const resume = () => {
        bgMusic.play().catch(() => {});
        window.removeEventListener('click', resume);
        window.removeEventListener('keydown', resume);
        window.removeEventListener('touchstart', resume);
      };
      window.addEventListener('click', resume, { once:true });
      window.addEventListener('keydown', resume, { once:true });
      window.addEventListener('touchstart', resume, { once:true });
    });
  }
}
tryPlayMusic();

/* ---------------- Diagonal falling stars background ---------------- */
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let width, height, stars = [];

const STAR_COUNT = 140;

function resize(){
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

function makeStar(randomStart = true){
  const speed = 0.6 + Math.random() * 1.6;
  let x, y;

  if(randomStart){
    x = Math.random() * width;
    y = Math.random() * height;
  } else {
    if(Math.random() < 0.5){
      x = Math.random() * width;
      y = -20 - Math.random() * 40;
    } else {
      x = -20 - Math.random() * 40;
      y = Math.random() * height;
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
