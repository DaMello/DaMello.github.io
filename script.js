const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
const qs = (s, r = document) => r.querySelector(s);
const qsa = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function initIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function initLanguage() {
  const button = qs('#languageToggle');
  if (!button) return;
  let lang = localStorage.getItem('dm-lang') || 'en';
  const apply = () => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    qsa('[data-en][data-pt]').forEach(el => {
      el.textContent = el.dataset[lang];
    });
    button.textContent = lang === 'en' ? 'PT' : 'EN';
    button.setAttribute('aria-label', lang === 'en' ? 'Mudar para português' : 'Switch to English');
    localStorage.setItem('dm-lang', lang);
  };
  button.addEventListener('click', () => {
    lang = lang === 'en' ? 'pt' : 'en';
    apply();
  });
  apply();
}

function initHeaderAndProgress() {
  const header = qs('.site-header');
  const progress = qs('.page-progress span');
  let previous = window.scrollY;
  const update = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? y / max : 0;
    if (progress) progress.style.transform = `scaleX(${p})`;
    if (header) {
      header.classList.toggle('is-scrolled', y > 18);
      if (y > 520 && y > previous + 8) header.classList.add('is-hidden');
      if (y < previous - 5 || y < 120) header.classList.remove('is-hidden');
    }
    previous = y;
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update, { passive: true });
  update();
}

function initCursor() {
  const cursor = qs('.cursor-orbit');
  if (!cursor || !finePointer || reduceMotion) return;
  document.body.classList.add('cursor-ready');
  let tx = innerWidth / 2, ty = innerHeight / 2, x = tx, y = ty;
  addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  const loop = () => {
    x += (tx - x) * .24;
    y += (ty - y) * .24;
    cursor.style.transform = `translate(${x - 13}px, ${y - 13}px)`;
    requestAnimationFrame(loop);
  };
  loop();
  qsa('a,button,.case-chapter,.product-list article,.service-list article').forEach(el => {
    el.addEventListener('pointerenter', () => cursor.classList.add('is-active'));
    el.addEventListener('pointerleave', () => cursor.classList.remove('is-active'));
  });
}

function initCanvas() {
  const canvas = qs('#ambient');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1, points = [];
  const pointer = { x: -9999, y: -9999 };
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 1.4);
    w = innerWidth; h = innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(clamp((w * h) / 18000, 38, 92));
    points = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - .5) * .06,
      vy: (Math.random() - .5) * .06,
      r: .35 + Math.random() * 1.05,
      alpha: .12 + Math.random() * .34,
      blue: i % 11 === 0
    }));
  };
  addEventListener('resize', resize, { passive: true });
  if (finePointer) addEventListener('pointermove', e => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });
  resize();
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    for (const p of points) {
      if (!reduceMotion) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
        const dx = p.x - pointer.x, dy = p.y - pointer.y, dist = Math.hypot(dx, dy);
        if (dist < 120 && dist > 1) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * .12;
          p.y += (dy / dist) * force * .12;
        }
      }
      ctx.beginPath();
      ctx.fillStyle = p.blue ? `rgba(72,151,255,${p.alpha})` : `rgba(220,229,242,${p.alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  };
  draw();
}

function initSkillRibbon() {
  const track = qs('#skillTrack');
  if (!track || reduceMotion) return;
  let x = 0;
  let speed = -.35;
  let target = -.35;
  let previousY = scrollY;
  let half = 0;
  const measure = () => { half = track.scrollWidth / 2; };
  measure();
  addEventListener('resize', measure, { passive: true });
  addEventListener('scroll', () => {
    const dy = scrollY - previousY;
    previousY = scrollY;
    target = clamp(-.35 - dy * .12, -8, 7);
  }, { passive: true });
  const tick = () => {
    speed += (target - speed) * .08;
    target += (-.35 - target) * .025;
    x += speed;
    if (half) {
      while (x <= -half) x += half;
      while (x > 0) x -= half;
    }
    track.style.transform = `translate3d(${x}px,0,0)`;
    requestAnimationFrame(tick);
  };
  tick();
}

function initIntroStory() {
  if (reduceMotion || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const section = qs('.intro-story');
  const surface = qs('#identitySurface');
  const content = qs('#surfaceContent');
  const mark = qs('.surface-mark');
  const hero = qs('.hero-copy');
  const ribbon = qs('.skill-ribbon');
  const cue = qs('.scroll-cue');
  if (!section || !surface || !content) return;

  const persistent = document.createElement('a');
  persistent.href = '#top';
  persistent.className = 'persistent-dm';
  persistent.textContent = 'DM';
  persistent.setAttribute('aria-label', 'Back to top');
  Object.assign(persistent.style, {
    position: 'fixed', right: '22px', top: '84px', width: '58px', height: '58px',
    border: '1px solid rgba(255,255,255,.1)', borderRadius: '18px',
    background: 'rgba(10,12,17,.76)', backdropFilter: 'blur(16px)', zIndex: '70',
    display: 'grid', placeItems: 'center', fontFamily: 'PersonaFont,Inter,sans-serif',
    fontSize: '12px', opacity: '0', transform: 'translateY(-8px) scale(.94)',
    transition: 'opacity .35s, transform .45s cubic-bezier(.22,1,.36,1)', pointerEvents: 'none'
  });
  document.body.appendChild(persistent);

  const mm = gsap.matchMedia();
  mm.add('(min-width: 761px)', () => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: .75 }
    });
    tl.to(hero, { y: -90, opacity: 0, ease: 'none', duration: .18 }, .06)
      .to(ribbon, { y: 34, opacity: 0, ease: 'none', duration: .14 }, .12)
      .to(cue, { opacity: 0, ease: 'none', duration: .08 }, .08)
      .to(surface, { left: '50%', top: '50%', width: '86vw', height: '76vh', borderRadius: 42, ease: 'power3.inOut', duration: .34 }, .12)
      .to(mark, { opacity: 0, scale: .8, ease: 'none', duration: .08 }, .24)
      .to(content, { opacity: 1, ease: 'power2.out', duration: .16 }, .32)
      .to({}, { duration: .23 })
      .to(content, { opacity: 0, ease: 'power2.in', duration: .1 }, .72)
      .to(surface, { left: 'calc(100% - 58px)', top: 113, width: 58, height: 58, borderRadius: 18, ease: 'power3.inOut', duration: .18 }, .77)
      .to(mark, { opacity: 1, scale: 1, fontSize: 11, ease: 'power2.out', duration: .08 }, .88);
  });
  mm.add('(max-width: 760px)', () => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: .65 }
    });
    tl.to(hero, { y: -60, opacity: 0, ease: 'none', duration: .18 }, .06)
      .to(ribbon, { y: 24, opacity: 0, ease: 'none', duration: .14 }, .12)
      .to(surface, { left: '50%', top: '52%', width: '92vw', height: '79vh', borderRadius: 30, ease: 'power3.inOut', duration: .34 }, .12)
      .to(mark, { opacity: 0, duration: .06 }, .25)
      .to(content, { opacity: 1, duration: .16 }, .32)
      .to({}, { duration: .22 })
      .to(content, { opacity: 0, duration: .1 }, .72)
      .to(surface, { left: 'calc(100% - 46px)', top: 86, width: 54, height: 54, borderRadius: 17, ease: 'power3.inOut', duration: .18 }, .77)
      .to(mark, { opacity: 1, fontSize: 10, duration: .08 }, .88);
  });

  ScrollTrigger.create({
    trigger: section,
    start: '72% top',
    end: 'bottom top',
    onToggle: self => {
      persistent.style.opacity = self.isActive ? '1' : '0';
      persistent.style.transform = self.isActive ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(.94)';
      persistent.style.pointerEvents = self.isActive ? 'auto' : 'none';
    }
  });
  ScrollTrigger.create({
    trigger: '#contact',
    start: 'top 70%',
    onEnter: () => { persistent.style.opacity = '0'; persistent.style.pointerEvents = 'none'; },
    onLeaveBack: () => { persistent.style.opacity = '1'; persistent.style.pointerEvents = 'auto'; }
  });
}

function initManifesto() {
  const lines = qsa('[data-manifesto]');
  const section = qs('.manifesto');
  if (!lines.length || !section) return;
  if (reduceMotion || !window.ScrollTrigger) {
    lines.forEach(l => l.classList.add('is-active'));
    return;
  }
  ScrollTrigger.create({
    trigger: section,
    start: 'top 55%',
    end: 'bottom 45%',
    onUpdate: self => {
      const idx = clamp(Math.floor(self.progress * lines.length), 0, lines.length - 1);
      lines.forEach((line, i) => line.classList.toggle('is-active', i <= idx));
    }
  });
}

function initMotionStory() {
  const story = qs('.motion-story');
  const scenes = qsa('.motion-scene');
  const number = qs('#motionNumber');
  const bar = qs('#motionBar');
  if (!story || !scenes.length) return;
  const setScene = idx => {
    scenes.forEach((scene, i) => scene.classList.toggle('is-active', i === idx));
    if (number) number.textContent = String(idx + 1).padStart(2, '0');
    if (bar) bar.style.transform = `scaleX(${(idx + 1) / scenes.length})`;
  };
  setScene(0);
  if (!reduceMotion && window.ScrollTrigger) {
    ScrollTrigger.create({
      trigger: story,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: self => setScene(clamp(Math.floor(self.progress * scenes.length), 0, scenes.length - 1))
    });
  }

  const resizeDemo = qs('#resizeDemo');
  qs('#resizeToggle')?.addEventListener('click', () => resizeDemo?.classList.toggle('is-mobile'));

  const tabs = qs('#travelTabs');
  if (tabs) {
    const pill = qs('.travel-pill', tabs);
    const buttons = qsa('button', tabs);
    buttons.forEach((button, index) => button.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('is-selected'));
      button.classList.add('is-selected');
      if (pill) pill.style.transform = `translateX(${index * 100}%)`;
      const state = qs('#activeState');
      if (state) state.textContent = button.textContent;
    }));
  }

  const falloff = qs('#falloffGroup');
  if (falloff && finePointer) {
    const items = qsa('button', falloff);
    items.forEach((item, index) => {
      item.addEventListener('pointerenter', () => {
        items.forEach((node, i) => {
          const d = Math.abs(i - index);
          const scale = d === 0 ? 1.22 : d === 1 ? 1.1 : d === 2 ? 1.035 : 1;
          const y = d === 0 ? -12 : d === 1 ? -6 : d === 2 ? -2 : 0;
          node.style.transform = `translateY(${y}px) scale(${scale})`;
          node.style.opacity = d > 2 ? '.58' : '1';
          node.style.background = d === 0 ? 'rgba(8,118,255,.18)' : 'rgba(255,255,255,.055)';
        });
      });
    });
    falloff.addEventListener('pointerleave', () => qsa('button', falloff).forEach(node => {
      node.style.transform = '';
      node.style.opacity = '';
      node.style.background = '';
    }));
  }

  const toastStack = qs('#toastStack');
  let toastCount = 0;
  const messages = [
    ['Component published', 'Responsive pass completed'],
    ['Motion refined', 'State transition updated'],
    ['QA complete', 'No blocking issues found'],
    ['Build ready', 'Latest changes are available']
  ];
  const renderToasts = () => {
    const nodes = qsa('.toast', toastStack);
    nodes.forEach((node, i) => {
      const depth = nodes.length - 1 - i;
      node.style.transform = `translateY(${depth * -16}px) scale(${1 - depth * .035})`;
      node.style.opacity = String(Math.max(.22, 1 - depth * .2));
      node.style.zIndex = String(i + 1);
    });
  };
  const addToast = () => {
    if (!toastStack) return;
    toastCount++;
    const [title, sub] = messages[(toastCount - 1) % messages.length];
    const node = document.createElement('div');
    node.className = 'toast';
    node.innerHTML = `<i></i><div><strong>${title}</strong><span>${sub}</span></div>`;
    toastStack.appendChild(node);
    while (toastStack.children.length > 4) toastStack.removeChild(toastStack.firstElementChild);
    renderToasts();
  };
  addToast(); addToast(); addToast();
  qs('#addToast')?.addEventListener('click', addToast);

  const morph = qs('#morphControl');
  const morphToggle = qs('#morphToggle');
  morphToggle?.addEventListener('click', () => {
    const open = !morph?.classList.contains('is-open');
    morph?.classList.toggle('is-open', open);
    morphToggle.setAttribute('aria-expanded', String(open));
  });
}

function initSectionMotion() {
  if (reduceMotion || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  qsa('.case-chapter').forEach((chapter, index) => {
    gsap.from(chapter, {
      y: 46,
      opacity: 0,
      duration: .9,
      ease: 'power3.out',
      scrollTrigger: { trigger: chapter, start: 'top 82%', once: true }
    });
    const visual = qs('.case-visual', chapter);
    if (visual) gsap.fromTo(visual, { scale: .96 }, {
      scale: 1,
      ease: 'none',
      scrollTrigger: { trigger: chapter, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });
  qsa('.market-row > i > b').forEach(bar => {
    const amount = parseFloat(getComputedStyle(bar).getPropertyValue('--bar')) || .2;
    gsap.to(bar, {
      scaleX: amount,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: bar, start: 'top 88%', once: true }
    });
  });
  qsa('.service-list article,.product-list article,.why-list span').forEach(el => {
    gsap.from(el, {
      y: 22,
      opacity: 0,
      duration: .65,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 91%', once: true }
    });
  });
}

function initSmoothAnchors() {
  qsa('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = qs(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
}

addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initIcons();
  initHeaderAndProgress();
  initCursor();
  initCanvas();
  initSkillRibbon();
  initIntroStory();
  initManifesto();
  initMotionStory();
  initSectionMotion();
  initSmoothAnchors();
});
