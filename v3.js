(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
  const ready = fn => document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', fn, { once:true })
    : fn();

  function seeded(seed){
    let s = seed >>> 0;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }

  function buildStars(){
    document.querySelectorAll('.v3-starfield,.hero-star-cluster').forEach(el => el.remove());
    const random = seeded(422010);
    const field = document.createElement('div');
    field.className = 'v3-starfield';
    field.setAttribute('aria-hidden','true');
    for(let i=0;i<108;i++){
      const star = document.createElement('i');
      star.className = 'v3-star';
      const size = .65 + random()*1.75;
      star.style.left = `${random()*100}%`;
      star.style.top = `${random()*100}%`;
      star.style.setProperty('--s',`${size.toFixed(2)}px`);
      star.style.setProperty('--a',(.18 + random()*.62).toFixed(2));
      star.style.setProperty('--d',`${(2.5 + random()*5).toFixed(2)}s`);
      star.style.setProperty('--delay',`${(-random()*5).toFixed(2)}s`);
      field.appendChild(star);
    }
    document.body.prepend(field);

    const intro = document.querySelector('.intro-sticky');
    if(!intro) return;
    const cluster = document.createElement('div');
    cluster.className = 'hero-star-cluster';
    cluster.setAttribute('aria-hidden','true');
    for(let i=0;i<48;i++){
      const star = document.createElement('i');
      star.className = 'v3-star';
      const size = .9 + random()*2.3;
      star.style.left = `${50 + random()*45}%`;
      star.style.top = `${5 + random()*55}%`;
      star.style.setProperty('--s',`${size.toFixed(2)}px`);
      star.style.setProperty('--a',(.32 + random()*.55).toFixed(2));
      star.style.setProperty('--d',`${(2.1 + random()*4).toFixed(2)}s`);
      star.style.setProperty('--delay',`${(-random()*4).toFixed(2)}s`);
      cluster.appendChild(star);
    }
    intro.prepend(cluster);
  }

  function renameVisibleBrand(){
    const brand = document.querySelector('.brand b');
    if(brand) brand.textContent = 'Davi Mello';
    const footer = document.querySelector('footer span:first-child');
    if(footer) footer.textContent = 'Davi Mello · 2026';
    document.querySelector('.contact-mark')?.remove();
  }

  function rebuildAbout(){
    const intro = document.querySelector('.intro-sticky');
    const section = document.querySelector('.intro-story');
    const surface = document.querySelector('#identitySurface');
    const mark = surface?.querySelector('.surface-mark');
    const content = surface?.querySelector('.surface-content');
    if(!intro || !section || !surface || !mark || !content) return;

    mark.innerHTML = '<span class="moon-disc" aria-hidden="true"><i></i></span>';
    mark.setAttribute('aria-label','Moon');
    surface.classList.add('moon-only');

    content.innerHTML = `
      <div class="surface-copy">
        <span class="section-kicker">01 / ABOUT</span>
        <h2 data-en="I design, build and polish digital products from interface to interaction." data-pt="Eu desenho, construo e refino produtos digitais da interface à interação.">I design, build and polish digital products from interface to interaction.</h2>
        <p data-en="My work connects frontend engineering, product design, motion, responsive systems and QA in one workflow. AI speeds up iteration; product direction and taste stay human." data-pt="Meu trabalho conecta engenharia frontend, product design, motion, sistemas responsivos e QA em um único fluxo. IA acelera a iteração; direção de produto e gosto continuam humanos.">My work connects frontend engineering, product design, motion, responsive systems and QA in one workflow. AI speeds up iteration; product direction and taste stay human.</p>
      </div>
      <div class="capability-grid">
        <article><span>01</span><div><h3>Frontend Engineering</h3><p>React, JavaScript, responsive systems, integration, debugging and performance.</p></div></article>
        <article><span>02</span><div><h3>Product & UI</h3><p>Product design, UI/UX, flows, design systems and prototyping.</p></div></article>
        <article><span>03</span><div><h3>Creative Development</h3><p>GSAP, ScrollTrigger, micro-interactions, canvas and scrollytelling.</p></div></article>
        <article><span>04</span><div><h3>AI-native Workflow</h3><p>Codex, ChatGPT, Claude Code, research, debugging and rapid iteration.</p></div></article>
      </div>`;

    const lockup = document.createElement('div');
    lockup.className = 'name-orbit-lockup';
    lockup.setAttribute('aria-hidden','true');
    lockup.innerHTML = '<span>Davi</span><i></i><span>Mello</span>';
    intro.appendChild(lockup);

    const label = document.createElement('div');
    label.className = 'about-stage-label';
    label.textContent = 'ABOUT';
    surface.appendChild(label);

    if(!window.ScrollTrigger || reduceMotion){
      surface.classList.remove('moon-only');
      return;
    }

    const fade = (p,a,b,c,d) => {
      if(p<=a || p>=d) return 0;
      if(p<b) return (p-a)/(b-a);
      if(p<=c) return 1;
      return 1-(p-c)/(d-c);
    };

    ScrollTrigger.create({
      trigger:section,
      start:'top top',
      end:'bottom bottom',
      onUpdate:self => {
        const p = self.progress;
        lockup.style.opacity = String(clamp(fade(p,.17,.21,.27,.34),0,1));
        label.style.opacity = String(clamp(fade(p,.27,.30,.33,.39),0,1));
        const panelPhase = p >= .245 && p <= .83;
        surface.classList.toggle('moon-only',!panelPhase);
        surface.classList.toggle('about-label-phase',p >= .27 && p <= .39);
      }
    });
  }

  function replaceMotionScenes(){
    const scenes = [...document.querySelectorAll('.motion-scene')];
    if(scenes.length < 6) return;

    scenes[2].innerHTML = `
      <div class="scene-copy"><span>03 / DEPTH</span><h3>A card should react like an object.</h3><p>Pointer position drives perspective and glare together. The content is intentionally a fictional payment card.</p></div>
      <div class="demo-panel">
        <div class="t-tilt" id="v4Tilt">
          <div class="t-tilt-card">
            <div class="credit-top"><strong>ORBIT</strong><span>DEBIT · DEMO</span></div>
            <div class="credit-chip"></div>
            <div class="credit-number">4824 ·••• ·••• 7392</div>
            <div class="credit-bottom"><div><small>CARDHOLDER</small><b>ALEX MORGAN</b></div><div><small>EXPIRES</small><b>09 / 30</b></div><div class="credit-orb"></div></div>
            <div class="t-tilt-glare"></div>
          </div>
        </div>
        <span class="demo-hint">MOVE YOUR CURSOR</span>
      </div>`;

    scenes[3].innerHTML = `
      <div class="scene-copy"><span>04 / CONFIRMATION</span><h3>One clear success signal.</h3><p>The check uses the supplied fade, rotation, blur, vertical bob and stroke-draw transition in parallel — without an extra container animation.</p></div>
      <div class="demo-panel">
        <div class="success-demo">
          <span class="t-success-check" id="v4Success" data-state="out" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none"><path d="M10 25L19 34L38 14" stroke="#f3f7ff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
          <div class="success-caption"><strong>Changes saved</strong><span>Your latest update is ready.</span></div>
        </div>
        <button class="demo-button" id="v4ReplaySuccess" type="button">Replay</button>
      </div>`;

    scenes[4].innerHTML = `
      <div class="scene-copy"><span>05 / DISCLOSURE</span><h3>Reveal detail without leaving context.</h3><p>An accordion expands in place, keeps its heading visible and collapses back into the same geometry.</p></div>
      <div class="demo-panel">
        <div class="acc-demo" id="v4Accordion">
          <div class="t-acc" data-open="true"><button class="t-acc-head" type="button" aria-expanded="true"><span>Project scope</span><span class="t-acc-chevron"><svg viewBox="0 0 16 16"><path d="M4 6.5L8 10.5L12 6.5"/></svg></span></button><div class="t-acc-panel"><div class="t-acc-panel-inner"><p>Responsive interface, custom motion, deployment and a focused QA pass.</p></div></div></div>
          <div class="t-acc" data-open="false"><button class="t-acc-head" type="button" aria-expanded="false"><span>Delivery</span><span class="t-acc-chevron"><svg viewBox="0 0 16 16"><path d="M4 6.5L8 10.5L12 6.5"/></svg></span></button><div class="t-acc-panel"><div class="t-acc-panel-inner"><p>Milestones are agreed before build work starts, so scope and timing stay visible.</p></div></div></div>
          <div class="t-acc" data-open="false"><button class="t-acc-head" type="button" aria-expanded="false"><span>Changes</span><span class="t-acc-chevron"><svg viewBox="0 0 16 16"><path d="M4 6.5L8 10.5L12 6.5"/></svg></span></button><div class="t-acc-panel"><div class="t-acc-panel-inner"><p>Anything outside the agreed scope is discussed before it changes the quote or timeline.</p></div></div></div>
        </div>
      </div>`;
  }

  function initTilt(){
    const root = document.querySelector('#v4Tilt');
    const card = root?.querySelector('.t-tilt-card');
    if(!root || !card || reduceMotion) return;
    const update = e => {
      const r = root.getBoundingClientRect();
      const px = clamp((e.clientX-r.left)/r.width,0,1);
      const py = clamp((e.clientY-r.top)/r.height,0,1);
      card.style.setProperty('--tilt-rx',`${((.5-py)*10).toFixed(2)}deg`);
      card.style.setProperty('--tilt-ry',`${((px-.5)*12).toFixed(2)}deg`);
      card.style.setProperty('--tilt-gx',`${(px*100).toFixed(1)}%`);
      card.style.setProperty('--tilt-gy',`${(py*100).toFixed(1)}%`);
      root.classList.add('is-hover');
      card.classList.add('is-tilting');
    };
    const reset = () => {
      card.style.setProperty('--tilt-rx','0deg');
      card.style.setProperty('--tilt-ry','0deg');
      root.classList.remove('is-hover');
      card.classList.remove('is-tilting');
    };
    root.addEventListener('pointermove',update);
    root.addEventListener('pointerleave',reset);
    if(!finePointer){ root.addEventListener('pointerup',reset); root.addEventListener('pointercancel',reset); }
  }

  function initSuccess(){
    const check = document.querySelector('#v4Success');
    const path = check?.querySelector('path');
    const replay = document.querySelector('#v4ReplaySuccess');
    if(!check || !path) return;
    const length = path.getTotalLength();
    path.style.setProperty('--path-length',String(length));
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);
    const play = () => {
      check.dataset.state = 'out';
      path.style.strokeDashoffset = String(length);
      void check.offsetWidth;
      check.dataset.state = 'in';
    };
    replay?.addEventListener('click',play);
    setTimeout(play,220);
  }

  function initAccordion(rootSelector='#v4Accordion'){
    const root = document.querySelector(rootSelector);
    if(!root) return;
    root.querySelectorAll('.t-acc').forEach(item => {
      const btn = item.querySelector('.t-acc-head');
      btn?.addEventListener('click',() => {
        const open = item.dataset.open === 'true';
        item.dataset.open = String(!open);
        btn.setAttribute('aria-expanded',String(!open));
      });
    });
  }

  function rebuildWork(){
    const section = document.querySelector('.work-section');
    if(!section) return;
    const intro = section.querySelector('.section-intro');
    const old = section.querySelector('.case-chapters,.work-system-grid');
    if(intro) intro.innerHTML = `
      <span class="section-kicker">04 / WHAT I DO</span>
      <h2 data-en="From idea to shipped interface." data-pt="Da ideia à interface publicada.">From idea to shipped interface.</h2>
      <p data-en="Three parts of the same workflow — not three separate cards." data-pt="Três partes do mesmo fluxo — não três cards separados.">Three parts of the same workflow — not three separate cards.</p>`;
    if(old){
      old.className = 'work-unified unified-surface section-shell';
      old.innerHTML = `
        <article class="unified-row"><span class="row-index">01</span><div><h3>What I build</h3><p>Landing experiences, business websites and product interfaces with custom interaction.</p></div><span class="row-meta">LANDING · WEB · PRODUCT</span></article>
        <article class="unified-row"><span class="row-index">02</span><div><h3>What you get</h3><p>Visual direction, responsive front-end, motion, deployment-ready implementation and polish in the same loop.</p></div><span class="row-meta">DESIGN · CODE · MOTION</span></article>
        <article class="unified-row"><span class="row-index">03</span><div><h3>How I work</h3><p>Scope and direction first, build and iteration second, QA and launch before handoff.</p></div><span class="row-meta">SCOPE → BUILD → QA</span></article>`;
    }
  }

  function rebuildPricing(){
    const shell = document.querySelector('.pricing-section .section-shell');
    if(!shell) return;
    shell.innerHTML = `
      <div class="pricing-v3">
        <div class="pricing-intro">
          <span class="section-kicker">07 / SERVICES + PRICING</span>
          <h2 data-en="A lower launch entry point — without splitting the craft." data-pt="Uma entrada de lançamento menor — sem dividir o cuidado.">A lower launch entry point — without splitting the craft.</h2>
          <p data-en="I combine visual direction, front-end and motion in one workflow. The comparison below is intentionally illustrative, not a like-for-like market measurement; your final quote depends on scope." data-pt="Eu combino direção visual, front-end e motion em um único fluxo. A comparação abaixo é propositalmente ilustrativa, não uma medição direta do mercado; o orçamento final depende do escopo.">I combine visual direction, front-end and motion in one workflow. The comparison below is intentionally illustrative, not a like-for-like market measurement; your final quote depends on scope.</p>
        </div>

        <section class="price-chart-shell unified-surface" aria-label="Illustrative price positioning">
          <div class="chart-head"><div><small>LAUNCH POSITIONING</small><h3>Designed to be the value option.</h3></div><p>Visual positioning only. Different providers, scopes and pricing models are not directly comparable.</p></div>
          <div class="price-bars">
            <div class="price-bar" style="--h:55%"><span class="bar"></span><label>Independent</label></div>
            <div class="price-bar" style="--h:86%"><span class="bar"></span><label>Agency</label></div>
            <div class="price-bar" style="--h:68%"><span class="bar"></span><label>Multi-specialist</label></div>
            <div class="price-bar me" style="--h:34%"><span class="best-chip">BEST VALUE</span><span class="bar"><span>ME</span></span><label>Davi Mello</label></div>
          </div>
        </section>

        <div class="service-list">
          <article><div><span>01</span><h3>Landing Experience</h3></div><p>One focused responsive page with custom visual direction, motion, deployment and performance attention.</p><strong>from US$149</strong><a href="mailto:davimello.persona@gmail.com?subject=Landing%20Experience">Start project ↗</a></article>
          <article><div><span>02</span><h3>Business Website</h3></div><p>A polished multi-page presence with responsive design, motion and the core launch setup.</p><strong>from US$399</strong><a href="mailto:davimello.persona@gmail.com?subject=Business%20Website">Start project ↗</a></article>
          <article><div><span>03</span><h3>Custom Product Front-end</h3></div><p>Product UI, complex responsive states, custom interactions or implementation around an existing design system.</p><strong>Custom</strong><a href="mailto:davimello.persona@gmail.com?subject=Custom%20Product%20Front-end">Discuss scope ↗</a></article>
        </div>
        <p class="service-note">Launch prices are starting points. Final quotes depend on scope, integrations, content and interaction complexity.</p>
      </div>`;
  }

  function rebuildTransparency(){
    const section = document.querySelector('.why-section');
    if(!section) return;
    section.id = 'transparency';
    section.innerHTML = `
      <div class="section-shell">
        <div class="section-intro compact"><span class="section-kicker">08 / TRANSPARENCY</span><h2 data-en="Know what happens before the build starts." data-pt="Saiba o que acontece antes do build começar.">Know what happens before the build starts.</h2></div>
        <div class="transparency-shell" id="transparencyAcc">
          <div class="t-acc" data-open="true"><button class="t-acc-head" type="button" aria-expanded="true"><span>Scope & quote</span><span class="t-acc-chevron"><svg viewBox="0 0 16 16"><path d="M4 6.5L8 10.5L12 6.5"/></svg></span></button><div class="t-acc-panel"><div class="t-acc-panel-inner"><p>We define what is being built before implementation. Anything outside that scope gets discussed before it changes price or timing.</p></div></div></div>
          <div class="t-acc" data-open="false"><button class="t-acc-head" type="button" aria-expanded="false"><span>Revisions</span><span class="t-acc-chevron"><svg viewBox="0 0 16 16"><path d="M4 6.5L8 10.5L12 6.5"/></svg></span></button><div class="t-acc-panel"><div class="t-acc-panel-inner"><p>Feedback is expected. Large direction changes are separated from normal polishing so there are no surprise additions.</p></div></div></div>
          <div class="t-acc" data-open="false"><button class="t-acc-head" type="button" aria-expanded="false"><span>QA & delivery</span><span class="t-acc-chevron"><svg viewBox="0 0 16 16"><path d="M4 6.5L8 10.5L12 6.5"/></svg></span></button><div class="t-acc-panel"><div class="t-acc-panel-inner"><p>Responsive behaviour, core interactions and obvious blockers are checked before handoff or deployment.</p></div></div></div>
          <div class="t-acc" data-open="false"><button class="t-acc-head" type="button" aria-expanded="false"><span>Ownership</span><span class="t-acc-chevron"><svg viewBox="0 0 16 16"><path d="M4 6.5L8 10.5L12 6.5"/></svg></span></button><div class="t-acc-panel"><div class="t-acc-panel-inner"><p>Project-specific ownership and handoff details are agreed in the scope so both sides know what is delivered.</p></div></div></div>
        </div>
      </div>`;
  }

  function rebuildContact(){
    const inner = document.querySelector('.contact-section .contact-inner');
    if(!inner) return;
    inner.innerHTML = `
      <div class="contact-copy-v4"><span class="section-kicker">09 / CONTACT</span><h2>Let's build something worth remembering.</h2><p>Open to remote frontend opportunities, freelance projects and product work.</p></div>
      <div class="contact-links-v4">
        <a class="contact-link-row" href="mailto:davimello.persona@gmail.com"><span>01</span><strong>davimello.persona@gmail.com</strong><i>↗</i></a>
        <a class="contact-link-row" href="https://github.com/DaMello" target="_blank" rel="noopener"><span>02</span><strong>GitHub</strong><i>↗</i></a>
      </div>`;
  }

  function applyStoredLanguage(){
    const lang = localStorage.getItem('dm-lang') || 'en';
    document.querySelectorAll('[data-en][data-pt]').forEach(el => { el.textContent = el.dataset[lang] || el.textContent; });
  }

  function refreshIcons(){ if(window.lucide) window.lucide.createIcons(); }

  ready(() => {
    document.body.classList.remove('space-v3');
    document.body.classList.add('space-v4');
    buildStars();
    renameVisibleBrand();
    rebuildAbout();
    replaceMotionScenes();
    rebuildWork();
    rebuildPricing();
    rebuildTransparency();
    rebuildContact();
    initTilt();
    initSuccess();
    initAccordion('#v4Accordion');
    initAccordion('#transparencyAcc');
    applyStoredLanguage();
    refreshIcons();
    if(window.ScrollTrigger) setTimeout(() => ScrollTrigger.refresh(),80);
  });
})();
