/* ═══════════════════════════════════════════════════════════
   KLANG DEINER SEELE – Interactive Experience
   Particles · Sound Waves · Cursor · Scroll Animations
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════
   PARTICLES
══════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  const COLORS = [
    'rgba(201,169,110,',
    'rgba(240,215,148,',
    'rgba(160,123,201,',
    'rgba(123,109,141,',
  ];

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = randomBetween(0, W);
      this.y  = init ? randomBetween(0, H) : H + 10;
      this.r  = randomBetween(0.4, 2.2);
      this.vx = randomBetween(-0.25, 0.25);
      this.vy = randomBetween(-0.6, -0.15);
      this.alpha = randomBetween(0.1, 0.55);
      this.da  = randomBetween(-0.003, 0.003);
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.twinkle = Math.random() > 0.6;
      this.phase = randomBetween(0, Math.PI * 2);
      this.freq  = randomBetween(0.005, 0.02);
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.phase += this.freq;
      if (this.twinkle) this.alpha = 0.15 + 0.35 * (0.5 + 0.5 * Math.sin(this.phase));
      if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  function initAll() {
    resize();
    particles = Array.from({ length: 120 }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); });
  initAll();
  loop();
})();


/* ══════════════════════════════════════════
   ANIMATED SOUND WAVES (Hero)
══════════════════════════════════════════ */
(function initSoundWaves() {
  const wave1 = document.getElementById('wave1');
  const wave2 = document.getElementById('wave2');
  const wave3 = document.getElementById('wave3');
  if (!wave1) return;

  const W = 1200, H = 180, cx = W / 2, cy = H / 2;
  let t = 0;

  function buildPath(t, amp, freq, phase, points) {
    let d = `M 0 ${cy}`;
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * W;
      const nx = (x - cx) / (W / 2);
      const envelope = Math.max(0, 1 - Math.abs(nx) * 1.2);
      const y = cy + Math.sin(i * freq + t + phase) * amp * envelope
                    + Math.sin(i * freq * 2.3 + t * 1.4 + phase) * amp * 0.4 * envelope
                    + Math.sin(i * freq * 0.7 + t * 0.8 + phase) * amp * 0.2 * envelope;
      d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
    }
    return d;
  }

  function animate() {
    t += 0.018;
    wave1.setAttribute('d', buildPath(t,       32, 0.045, 0,       80));
    wave2.setAttribute('d', buildPath(t * 0.9, 22, 0.065, Math.PI * 0.5, 60));
    wave3.setAttribute('d', buildPath(t * 1.1, 14, 0.08,  Math.PI,       50));
    requestAnimationFrame(animate);
  }
  animate();
})();


/* ══════════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════════ */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursorTrail');
  if (!cursor || window.innerWidth <= 768) return;

  let mx = -100, my = -100;
  let tx = -100, ty = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animTrail() {
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(animTrail);
  }
  animTrail();

  const hoverEls = document.querySelectorAll('a, button, .service-card, .testi-card, .step, input, select, textarea');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
})();


/* ══════════════════════════════════════════
   NAVBAR – Scroll Behavior
══════════════════════════════════════════ */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 60) {
      nav.classList.add('scrolled');
      nav.style.transform = y > lastY && y > 200 ? 'translateY(-100%)' : 'translateY(0)';
    } else {
      nav.classList.remove('scrolled');
      nav.style.transform = 'translateY(0)';
    }
    lastY = y;
  }, { passive: true });

  // Mobile toggle
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      const isOpen = links.classList.contains('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // Active link highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === id);
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => observer.observe(s));
})();


/* ══════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => obs.observe(el));
})();


/* ══════════════════════════════════════════
   HERO TITLE – Letter Stagger
══════════════════════════════════════════ */
(function initHeroStagger() {
  // Hero words already animate via CSS; add small entrance sparkle on load
  const title = document.querySelector('.hero-title');
  if (!title) return;
  title.style.opacity = '1';

  // Staggered number count-up for hero-meta
  const metaNums = document.querySelectorAll('.meta-num');
  const targets = [10, 500];
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const raw = el.textContent.trim();
      if (raw === '∞') return;
      const target = parseInt(raw);
      if (isNaN(target)) return;
      let start = 0;
      const duration = 1400;
      const step = timestamp => {
        if (!start) start = timestamp;
        const p = Math.min((timestamp - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * target) + (raw.includes('+') ? '+' : '');
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.8 });
  metaNums.forEach(n => obs.observe(n));
})();


/* ══════════════════════════════════════════
   SERVICE CARDS – Tilt Effect
══════════════════════════════════════════ */
(function initCardTilt() {
  if (window.innerWidth <= 768) return;
  document.querySelectorAll('.service-card, .testi-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-6px) perspective(600px) rotateX(${(-dy * 4).toFixed(2)}deg) rotateY(${(dx * 4).toFixed(2)}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ══════════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════════ */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<span>Nachricht gesendet ✓</span>';
    btn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3500);
  });

  // Floating label effect
  form.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('focus', () => {
      el.parentElement.classList.add('focused');
    });
    el.addEventListener('blur', () => {
      el.parentElement.classList.remove('focused');
    });
  });
})();


/* ══════════════════════════════════════════
   PARALLAX (subtle, hero orbs)
══════════════════════════════════════════ */
(function initParallax() {
  if (window.innerWidth <= 768) return;
  const orbs = document.querySelectorAll('.orb');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    orbs[0] && (orbs[0].style.transform = `translateY(${y * 0.12}px)`);
    orbs[1] && (orbs[1].style.transform = `translateY(${-y * 0.08}px)`);
  }, { passive: true });

  document.addEventListener('mousemove', e => {
    const nx = (e.clientX / window.innerWidth  - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    orbs[0] && (orbs[0].style.transform = `translate(${nx * 18}px, ${ny * 14}px)`);
    orbs[2] && (orbs[2].style.transform = `translate(calc(-50% + ${-nx * 12}px), calc(-50% + ${-ny * 10}px)) scale(1)`);
  });
})();


/* ══════════════════════════════════════════
   SMOOTH ANCHOR SCROLLING
══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = document.getElementById('navbar')?.offsetHeight || 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ══════════════════════════════════════════
   RIPPLE EFFECT on Buttons
══════════════════════════════════════════ */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const r = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    r.style.cssText = `
      position:absolute; width:${size}px; height:${size}px;
      border-radius:50%;
      background:rgba(255,255,255,0.25);
      transform:scale(0);
      animation:rippleAnim 0.6s ease-out forwards;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top  - size/2}px;
      pointer-events:none;
    `;
    this.style.position = 'relative';
    this.appendChild(r);
    setTimeout(() => r.remove(), 700);
  });
});

// Inject ripple keyframes
const style = document.createElement('style');
style.textContent = `
@keyframes rippleAnim {
  to { transform: scale(2.5); opacity: 0; }
}
.nav-link.active { color: var(--gold) !important; }
.nav-link.active::after { width: 20px; }
`;
document.head.appendChild(style);


/* ══════════════════════════════════════════
   MAGNETIC BUTTONS (subtle)
══════════════════════════════════════════ */
(function initMagneticBtns() {
  if (window.innerWidth <= 768) return;
  document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();


/* ══════════════════════════════════════════
   STAGGER CHILDREN on Service Grid
══════════════════════════════════════════ */
(function staggerGrid() {
  document.querySelectorAll('.services-grid .service-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
  });
})();
