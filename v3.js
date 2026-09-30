(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  const ready = fn => {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
    else fn();
  };

  function seeded(seed){
    let s = seed >>> 0;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function buildStars(){
    if (document.querySelector('.v3-starfield')) return;
    const random = seeded(2210410);
    const field = document.createElement('div');
    field.className = 'v3-starfield';
    field.setAttribute('aria-hidden','true');
    for(let i=0;i<72;i++){
      const star = document.createElement('i');
      star.className = 'v3-star';
      const size = .7 + random() * 1.8;
      const alpha = .28 + random() * .58;
      star.style.left = `${random()*100}%`;
      star.style.top = `${random()*100}%`;
      star.style.setProperty('--s', `${size.toFixed(2)}px`);
      star.style.setProperty('--a', alpha.toFixed(2));
      star.style.setProperty('--d', `${(2.4 + random()*4.8).toFixed(2)}s`);
      star.style.setProperty('--delay', `${(-random()*5).toFixed(2)}s`);
      field.appendChild(star);
    }
    document.body.prepend(field);

    const intro = document.querySelector('.intro-sticky');
    if(intro && !intro.querySelector('.hero-star-cluster')){
      const cluster = document.createElement('div');
      cluster.className = 'hero-star-cluster';
      cluster.setAttribute('aria-hidden','true');
      for(let i=0;i<32;i++){
        const star = document.createElement('i');
        star.className = 'v3-star';
        const size = .9 + random() * 2.5;
        star.style.left = `${60 + random()*34}%`;
        star.style.top = `${8 + random()*46}%`;
        star.style.setProperty('--s', `${size.toFixed(2)}px`);
        star.style.setProperty('--a', (.42 + random()*.48).toFixed(2));
        star.style.setProperty('--d', `${(2.1 + random()*3.8).toFixed(2)}s`);
        star.style.setProperty('--delay', `${(-random()*4).toFixed(2)}s`);
        cluster.appendChild(star);
      }
      intro.prepend(cluster);
    }
  }

  function installMoon(){
    const mark = document.querySelector('.surface-mark');
    if(!mark) return;
    mark.innerHTML = '<span class="moon-disc" aria-hidden="true"><i></i><i></i><i></i></span>';
    mark.setAttribute('aria-label','Moon');
  }

  function renameVisibleBrand(){
    const brand = document.querySelector('.brand b');
    if(brand) brand.textContent = 'Davi Mello';
    const footer = document.querySelector('footer span:first-child');
    if(footer) footer.textContent = 'Davi Mello · 2026';
    document.querySelector('.contact-mark')?.remove();
  }

  function replaceMotionScenes(){
    const scenes = [...document.querySelectorAll('.motion-scene')];
    if(scenes.length < 6) return;

    scenes[2].innerHTML = `
      <div class="scene-copy"><span>03 / DEPTH</span><h3>Depth should follow intent.</h3><p>Pointer position changes perspective and light together, so the surface feels physical without becoming distracting.</p></div>
      <div class="demo-panel">
        <div class="t-tilt" id="v3Tilt">
          <div class="t-tilt-card">
            <small>INTERACTIVE SURFACE</small>
            <div class="t-tilt-orbit"></div>
            <h4>Davi Mello</h4>
            <p>Frontend engineering · product design · motion systems</p>
            <div class="t-tilt-glare"></div>
          </div>
        </div>
        <span class="demo-hint">MOVE YOUR CURSOR</span>
      </div>`;

    scenes[3].innerHTML = `
      <div class="scene-copy"><span>04 / CONFIRMATION</span><h3>Success should feel unmistakable.</h3><p>A concise draw, blur release and vertical settle confirm completion without stealing attention from the task.</p></div>
      <div class="demo-panel">
        <div class="success-demo">
          <div class="success-orb">
            <span class="t-success-check" id="v3Success" data-state="out" aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none"><path d="M11 25.5L19.5 34L37 15.5" stroke="#d9ffe8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
          </div>
          <div class="success-caption"><strong>Deploy complete</strong><span>Latest version is live</span></div>
        </div>
        <button class="demo-button" id="v3ReplaySuccess" type="button">Replay</button>
      </div>`;

    const morph = scenes[4].querySelector('.t-morph');
    const menu = morph?.querySelector('.t-morph-menu');
    if(menu && !menu.querySelector('.t-morph-close')){
      const close = document.createElement('button');
      close.className = 't-morph-close';
      close.type = 'button';
      close.setAttribute('aria-label','Close menu');
      close.innerHTML = '<i data-lucide="x"></i>';
      menu.prepend(close);
    }
  }

  function initTilt(){
    const root = document.querySelector('#v3Tilt');
    const card = root?.querySelector('.t-tilt-card');
    if(!root || !card || reduceMotion) return;
    const update = e => {
      const rect = root.getBoundingClientRect();
      const px = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const py = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      const rx = (0.5 - py) * 10;
      const ry = (px - 0.5) * 12;
      card.style.setProperty('--tilt-rx', `${rx.toFixed(2)}deg`);
      card.style.setProperty('--tilt-ry', `${ry.toFixed(2)}deg`);
      card.style.setProperty('--tilt-gx', `${(px*100).toFixed(1)}%`);
      card.style.setProperty('--tilt-gy', `${(py*100).toFixed(1)}%`);
      root.classList.add('is-hover');
      card.classList.add('is-tilting');
    };
    const reset = () => {
      card.style.setProperty('--tilt-rx','0deg');
      card.style.setProperty('--tilt-ry','0deg');
      root.classList.remove('is-hover');
      card.classList.remove('is-tilting');
    };
    root.addEventListener('pointermove', update);
    root.addEventListener('pointerleave', reset);
    if(!finePointer){
      root.addEventListener('pointerup', reset);
      root.addEventListener('pointercancel', reset);
    }
  }

  function initSuccess(){
    const check = document.querySelector('#v3Success');
    const replay = document.querySelector('#v3ReplaySuccess');
    if(!check) return;
    const play = () => {
      check.dataset.state = 'out';
      void check.offsetWidth;
      check.dataset.state = 'in';
    };
    replay?.addEventListener('click', play);
    setTimeout(play, 180);
  }

  function addMorphClose(){
    const root = document.querySelector('#polishMorph');
    const toggle = document.querySelector('#polishMorphToggle');
    const close = root?.querySelector('.t-morph-close');
    if(!root || !toggle || !close) return;
    close.addEventListener('click', () => {
      root.dataset.open = 'false';
      toggle.setAttribute('aria-expanded','false');
    });
  }

  function rebuildWorkSection(){
    const section = document.querySelector('.work-section');
    if(!section) return;
    const intro = section.querySelector('.section-intro');
    const chapters = section.querySelector('.case-chapters');
    if(intro){
      intro.innerHTML = `
        <span class="section-kicker">04 / WHAT I DO</span>
        <h2 data-en="From idea to shipped interface." data-pt="Da ideia à interface publicada.">From idea to shipped interface.</h2>
        <p data-en="Instead of three vague demo categories, here is the practical version: what I build, what you get and how I work." data-pt="Em vez de três categorias vagas de demo, aqui está a versão prática: o que eu construo, o que você recebe e como eu trabalho.">Instead of three vague demo categories, here is the practical version: what I build, what you get and how I work.</p>`;
    }
    if(chapters){
      chapters.className = 'work-system-grid section-shell';
      chapters.innerHTML = `
        <article class="work-system-card"><span class="work-index">01</span><h3 data-en="What I build" data-pt="O que eu construo">What I build</h3><p data-en="Landing experiences, business websites and product interfaces with custom interaction instead of template-first output." data-pt="Landings, sites empresariais e interfaces de produto com interação customizada em vez de resultado baseado em template.">Landing experiences, business websites and product interfaces with custom interaction instead of template-first output.</p><ul><li>Landing experiences</li><li>Business websites</li><li>Product front-end</li></ul></article>
        <article class="work-system-card"><span class="work-index">02</span><h3 data-en="What you get" data-pt="O que você recebe">What you get</h3><p data-en="One workflow connecting visual direction, responsive implementation and motion so the final build stays coherent." data-pt="Um único fluxo conectando direção visual, implementação responsiva e motion para manter a entrega final coerente.">One workflow connecting visual direction, responsive implementation and motion so the final build stays coherent.</p><ul><li>Responsive system</li><li>Motion & interaction</li><li>Deployment-ready build</li></ul></article>
        <article class="work-system-card"><span class="work-index">03</span><h3 data-en="How I work" data-pt="Como eu trabalho">How I work</h3><p data-en="Scope first, implementation second, polish and QA before launch. Changes are discussed before they become cost or timeline surprises." data-pt="Escopo primeiro, implementação depois, refinamento e QA antes do lançamento. Mudanças são discutidas antes de virarem surpresa de custo ou prazo.">Scope first, implementation second, polish and QA before launch. Changes are discussed before they become cost or timeline surprises.</p><ul><li>Scope & direction</li><li>Build & iterate</li><li>QA & launch</li></ul></article>`;
    }
  }

  function rebuildPricing(){
    const shell = document.querySelector('.pricing-section .section-shell');
    if(!shell) return;
    shell.innerHTML = `
      <div class="pricing-v3">
        <div class="pricing-intro">
          <span class="section-kicker">07 / SERVICES + PRICING</span>
          <h2 data-en="High-touch work. Lower launch entry point." data-pt="Trabalho de alto cuidado. Entrada de lançamento mais baixa.">High-touch work. Lower launch entry point.</h2>
          <p data-en="The value is the overlap: design, front-end, motion and responsive thinking can happen in the same workflow. Launch pricing keeps the entry point lower while I grow the client portfolio." data-pt="O valor está na sobreposição: design, front-end, motion e pensamento responsivo podem acontecer no mesmo fluxo. O preço de lançamento mantém a entrada mais baixa enquanto amplio meu portfólio de clientes.">The value is the overlap: design, front-end, motion and responsive thinking can happen in the same workflow. Launch pricing keeps the entry point lower while I grow the client portfolio.</p>
        </div>

        <div class="value-map-layout">
          <article class="value-copy-card"><small>VALUE POSITIONING</small><h3 data-en="Fewer handoffs. More craft per dollar." data-pt="Menos repasses. Mais cuidado por dólar.">Fewer handoffs. More craft per dollar.</h3><p data-en="For small-to-medium custom web projects, combining design and implementation in one workflow can reduce coordination overhead without stripping away motion, responsive polish or QA." data-pt="Para projetos web customizados pequenos e médios, combinar design e implementação em um fluxo pode reduzir o custo de coordenação sem cortar motion, refinamento responsivo ou QA.">For small-to-medium custom web projects, combining design and implementation in one workflow can reduce coordination overhead without stripping away motion, responsive polish or QA.</p><strong>BEST VALUE · LAUNCH POSITIONING</strong></article>

          <article class="value-map-card"><small>ILLUSTRATIVE VALUE MAP</small><div class="value-map"><span class="best-value-badge">BEST VALUE</span><div class="value-point davi"><i></i><span>Davi Mello · project-based</span></div><div class="value-point freelancer"><i></i><span>Independent designer</span></div><div class="value-point agency"><i></i><span>Web design company</span></div></div><div class="map-note"><span>Illustrative positioning, not like-for-like scope.</span><span><a href="https://www.upwork.com/hire/web-designers/cost/" target="_blank" rel="noopener">Upwork</a> · <a href="https://clutch.co/web-designers/pricing" target="_blank" rel="noopener">Clutch</a></span></div></article>
        </div>

        <div class="service-list">
          <article><div><span>01</span><h3>Landing Experience</h3></div><p data-en="A focused responsive landing with custom visual direction, motion, deployment and performance attention." data-pt="Uma landing responsiva focada, com direção visual customizada, motion, deploy e atenção à performance.">A focused responsive landing with custom visual direction, motion, deployment and performance attention.</p><strong>from US$149</strong><a href="mailto:davimello.persona@gmail.com?subject=Landing%20Experience">Start project <i data-lucide="arrow-up-right"></i></a></article>
          <article><div><span>02</span><h3>Business Website</h3></div><p data-en="A polished multi-page presence with responsive design, motion and the core launch setup." data-pt="Uma presença multi-página polida com design responsivo, motion e a configuração essencial de lançamento.">A polished multi-page presence with responsive design, motion and the core launch setup.</p><strong>from US$399</strong><a href="mailto:davimello.persona@gmail.com?subject=Business%20Website">Start project <i data-lucide="arrow-up-right"></i></a></article>
          <article class="custom-service"><div><span>03</span><h3>Custom Product Front-end</h3></div><p data-en="Product UI, complex responsive states, custom interactions or implementation around an existing design system." data-pt="UI de produto, estados responsivos complexos, interações customizadas ou implementação em torno de um design system existente.">Product UI, complex responsive states, custom interactions or implementation around an existing design system.</p><strong>Custom</strong><a href="mailto:davimello.persona@gmail.com?subject=Custom%20Product%20Front-end">Discuss scope <i data-lucide="arrow-up-right"></i></a></article>
        </div>
        <p class="service-note" data-en="Launch prices are starting points. Final quotes depend on scope, integrations, content and interaction complexity." data-pt="Os preços de lançamento são pontos de partida. O orçamento final depende de escopo, integrações, conteúdo e complexidade de interação.">Launch prices are starting points. Final quotes depend on scope, integrations, content and interaction complexity.</p>
      </div>`;
  }

  function buildTransparency(){
    const section = document.querySelector('.why-section');
    if(!section) return;
    section.innerHTML = `
      <div class="section-shell transparency-shell">
        <div class="transparency-head"><div><span class="section-kicker">08 / TRANSPARENCY</span></div><div><h2 data-en="No mystery between quote and launch." data-pt="Sem mistério entre orçamento e lançamento.">No mystery between quote and launch.</h2><p data-en="The scope, pricing logic and delivery expectations should be understandable before the build starts — not discovered halfway through it." data-pt="Escopo, lógica de preço e expectativas de entrega devem estar claros antes do início do projeto — não descobertos no meio dele.">The scope, pricing logic and delivery expectations should be understandable before the build starts — not discovered halfway through it.</p></div></div>
        <div class="transparency-list">
          ${accordion('01','Scope before build','Escopo antes do build','Before work starts, the agreed deliverables and boundaries are written down. If scope changes, we discuss the effect before implementation continues.','Antes do trabalho começar, entregáveis e limites combinados ficam claros. Se o escopo mudar, o impacto é discutido antes de continuar a implementação.')}
          ${accordion('02','Pricing & custom work','Preço e trabalho customizado','Landing and business-site prices are starting points. Custom Product Front-end is quoted after the real product scope is understood.','Os preços de landing e site empresarial são pontos de partida. Custom Product Front-end recebe orçamento depois que o escopo real do produto é entendido.')}
          ${accordion('03','Changes & revisions','Mudanças e revisões','Meaningful changes are surfaced before they become surprise cost or timeline shifts. The goal is to keep the project legible on both sides.','Mudanças relevantes são sinalizadas antes de virarem surpresa de custo ou prazo. A ideia é manter o projeto claro para os dois lados.')}
          ${accordion('04','QA, performance & launch','QA, performance e lançamento','Responsive behavior, interaction polish and launch readiness are treated as part of the build conversation instead of invisible last-minute extras.','Comportamento responsivo, refinamento de interação e prontidão para lançamento entram na conversa do projeto em vez de virarem extras invisíveis de última hora.')}
        </div>
      </div>`;
  }

  function accordion(index,enTitle,ptTitle,enCopy,ptCopy){
    return `<div class="t-acc" data-open="false"><button class="t-acc-head" type="button" aria-expanded="false"><span><em>${index}</em><b data-en="${enTitle}" data-pt="${ptTitle}">${enTitle}</b></span><span class="t-acc-chevron"><svg viewBox="0 0 16 16" fill="none"><path d="M4 6.5L8 10.5L12 6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></button><div class="t-acc-panel"><div class="t-acc-panel-inner"><p data-en="${enCopy}" data-pt="${ptCopy}">${enCopy}</p></div></div></div>`;
  }

  function initAccordions(){
    document.querySelectorAll('.t-acc').forEach(item => {
      const head = item.querySelector('.t-acc-head');
      head?.addEventListener('click', () => {
        const open = item.dataset.open === 'true';
        item.dataset.open = String(!open);
        head.setAttribute('aria-expanded', String(!open));
      });
    });
  }

  function polishContact(){
    const contact = document.querySelector('.contact-section');
    if(!contact) return;
    contact.querySelector('.contact-mark')?.remove();
    const actions = contact.querySelector('.contact-actions');
    if(actions){
      actions.innerHTML = `<a href="mailto:davimello.persona@gmail.com"><span>Email</span><span>davimello.persona@gmail.com ↗</span></a><a href="https://github.com/DaMello" target="_blank" rel="noopener"><span>GitHub</span><span>@DaMello ↗</span></a>`;
    }
  }

  function syncLanguage(){
    const pt = document.documentElement.lang.toLowerCase().startsWith('pt');
    document.querySelectorAll('[data-en][data-pt]').forEach(el => {
      el.textContent = pt ? el.dataset.pt : el.dataset.en;
    });
  }

  function revealNewCards(){
    const nodes = [...document.querySelectorAll('.work-system-card,.value-copy-card,.value-map-card,.transparency-shell')];
    if(reduceMotion || !('IntersectionObserver' in window)) return;
    nodes.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(18px)'; el.style.transition = 'opacity .65s cubic-bezier(.22,1,.36,1), transform .75s cubic-bezier(.22,1,.36,1)'; });
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    }), {threshold:.15});
    nodes.forEach(el => io.observe(el));
  }

  ready(() => {
    document.body.classList.add('space-v3');
    buildStars();
    installMoon();
    renameVisibleBrand();
    replaceMotionScenes();
    rebuildWorkSection();
    rebuildPricing();
    buildTransparency();
    polishContact();
    syncLanguage();
    initTilt();
    initSuccess();
    addMorphClose();
    initAccordions();
    revealNewCards();
    if(window.lucide) window.lucide.createIcons();
    if(window.ScrollTrigger) setTimeout(() => window.ScrollTrigger.refresh(), 80);
  });
})();
