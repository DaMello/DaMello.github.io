(() => {
  const FIVERR_URL = '[LINK_DO_FIVERR]';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile390 = window.matchMedia('(max-width: 480px)').matches;

  const currentLang = () => localStorage.getItem('dm-lang') === 'pt' ? 'pt' : 'en';

  function applyStoredLanguage(){
    const lang = currentLang();
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    document.querySelectorAll('[data-en][data-pt]').forEach(el => {
      el.textContent = el.dataset[lang];
    });

    document.title = lang === 'pt'
      ? 'Davi Mello — Landing pages com motion design premium'
      : 'Davi Mello — Landing pages with premium motion design';

    const meta = document.querySelector('meta[name="description"]');
    if(meta){
      meta.content = lang === 'pt'
        ? 'Davi Mello cria landing pages e interfaces responsivas com motion design premium, frontend e deploy.'
        : 'Davi Mello designs and builds responsive landing pages with premium motion design, frontend and deployment.';
    }

    const intro = document.querySelector('.intro-story');
    if(intro) intro.setAttribute('aria-label', lang === 'pt' ? 'Introdução e sobre Davi Mello' : 'Davi Mello introduction and about');
  }

  function fiverrify(anchor, labelEn = 'Hire on Fiverr', labelPt = 'Contratar no Fiverr'){
    if(!anchor) return;
    anchor.href = FIVERR_URL;
    anchor.target = '_blank';
    anchor.rel = 'noopener';
    const label = anchor.querySelector('[data-en][data-pt]');
    if(label){
      label.dataset.en = labelEn;
      label.dataset.pt = labelPt;
      label.textContent = currentLang() === 'pt' ? labelPt : labelEn;
    }else{
      anchor.textContent = currentLang() === 'pt' ? labelPt : labelEn;
      anchor.dataset.en = labelEn;
      anchor.dataset.pt = labelPt;
    }
  }

  function enhanceHeader(){
    const actions = document.querySelector('.header-actions');
    if(!actions) return;

    const gmail = [...actions.querySelectorAll('a')].find(a => a.href.includes('mail.google.com'));
    if(gmail){
      gmail.classList.add('header-gmail-cta');
      const span = gmail.querySelector('span');
      if(span){ span.dataset.en = 'Gmail'; span.dataset.pt = 'Gmail'; }
    }

    if(!actions.querySelector('.header-fiverr-cta')){
      const fiverr = document.createElement('a');
      fiverr.className = 'header-cta header-fiverr-cta';
      fiverr.href = FIVERR_URL;
      fiverr.target = '_blank';
      fiverr.rel = 'noopener';
      fiverr.innerHTML = '<span data-en="Hire on Fiverr" data-pt="Contratar no Fiverr">Hire on Fiverr</span><i data-lucide="arrow-up-right"></i>';
      actions.appendChild(fiverr);
    }

    document.querySelectorAll('a').forEach(a => {
      const text = a.textContent.trim().toLowerCase();
      if(text.includes('start project') || text.includes('discuss scope') || text.includes('iniciar projeto')){
        fiverrify(a);
      }
    });
  }

  function enhanceHero(){
    const intro = document.querySelector('.intro-sticky');
    const section = document.querySelector('.intro-story');
    const lockup = document.querySelector('.name-orbit-lockup');
    if(!intro || !section) return;

    if(lockup) lockup.setAttribute('aria-hidden','true');

    if(!document.querySelector('#seoHeroTitle')){
      const h1 = document.createElement('h1');
      h1.id = 'seoHeroTitle';
      h1.className = 'sr-only';
      h1.dataset.en = 'Davi Mello — Landing pages with premium motion design';
      h1.dataset.pt = 'Davi Mello — Landing pages com motion design premium';
      h1.textContent = h1.dataset.en;
      intro.prepend(h1);
    }

    if(!document.querySelector('.hero-service-offer')){
      const offer = document.createElement('div');
      offer.className = 'hero-service-offer';
      offer.innerHTML = `
        <h2 data-en="Landing pages with premium motion design" data-pt="Landing pages com motion design premium">Landing pages with premium motion design</h2>
        <p data-en="I design and build fast, responsive interfaces with motion that explains — from first sketch to deployed site." data-pt="Eu desenho e construo interfaces rápidas e responsivas com motion que explica — do primeiro rascunho ao site publicado.">I design and build fast, responsive interfaces with motion that explains — from first sketch to deployed site.</p>
        <div class="hero-service-actions">
          <a class="hero-package-cta" href="#pricing"><span data-en="View packages" data-pt="Ver pacotes">View packages</span></a>
          <a class="hero-fiverr-cta" href="${FIVERR_URL}" target="_blank" rel="noopener"><span data-en="Hire on Fiverr" data-pt="Contratar no Fiverr">Hire on Fiverr</span><i data-lucide="arrow-up-right"></i></a>
        </div>`;
      intro.appendChild(offer);

      if(!reduceMotion && window.gsap && window.ScrollTrigger){
        gsap.to(offer,{
          opacity:0,
          y:-24,
          ease:'none',
          scrollTrigger:{trigger:section,start:'top top',end:'22% top',scrub:true}
        });
      }
    }

    const surface = document.querySelector('#identitySurface');
    const aboutHeading = surface?.querySelector('.surface-copy h2');
    if(surface && aboutHeading){
      aboutHeading.id = 'aboutHeadingV7';
      surface.setAttribute('role','region');
      surface.setAttribute('aria-labelledby','aboutHeadingV7');
    }
  }

  function addSocialProof(){
    const products = document.querySelector('.products-section');
    if(!products || document.querySelector('.social-proof-section')) return;

    const section = document.createElement('section');
    section.className = 'social-proof-section';
    section.id = 'proof';
    section.innerHTML = `
      <div class="section-shell">
        <div class="section-intro compact proof-intro">
          <span class="section-kicker">06B / PROOF</span>
          <h2 data-en="Clear work. Clear communication." data-pt="Trabalho claro. Comunicação clara.">Clear work. Clear communication.</h2>
          <p data-en="Real testimonials and delivery metrics will live here. The placeholders are intentionally visible until I replace them with verified client feedback." data-pt="Depoimentos reais e métricas de entrega vão ficar aqui. Os placeholders ficam visíveis de propósito até eu substituir por feedback verificado de clientes.">Real testimonials and delivery metrics will live here. The placeholders are intentionally visible until I replace them with verified client feedback.</p>
        </div>

        <div class="proof-metrics unified-surface">
          <div><strong>[X]</strong><span data-en="projects delivered" data-pt="projetos entregues">projects delivered</span></div>
          <div><strong>[TEMPO]</strong><span data-en="typical response" data-pt="resposta típica">typical response</span></div>
          <div><strong>PT + EN</strong><span data-en="bilingual communication" data-pt="comunicação bilíngue">bilingual communication</span></div>
        </div>

        <div class="testimonial-grid">
          ${[1,2,3].map(i => `
            <article class="testimonial-card unified-surface">
              <p data-en="[TESTIMONIAL]" data-pt="[DEPOIMENTO]">[TESTIMONIAL]</p>
              <div><strong>[NOME]</strong><span data-en="[ROLE / PROJECT]" data-pt="[CARGO / PROJETO]">[ROLE / PROJECT]</span></div>
            </article>`).join('')}
        </div>
      </div>`;
    products.insertAdjacentElement('afterend',section);
  }

  function enhancePricing(){
    const list = document.querySelector('.service-list');
    if(!list) return;

    list.querySelectorAll('article').forEach((article,index) => {
      if(!article.querySelector('.service-fulfillment')){
        const line = document.createElement('p');
        line.className = 'service-fulfillment';
        line.dataset.en = 'Delivery: [PRAZO] · Revisions: [REVISÕES]';
        line.dataset.pt = 'Entrega: [PRAZO] · Revisões: [REVISÕES]';
        line.textContent = line.dataset.en;
        const price = article.querySelector('strong');
        if(price) price.insertAdjacentElement('afterend',line);
        else article.appendChild(line);
      }

      const cta = article.querySelector('a');
      if(cta){
        cta.innerHTML = '<span data-en="Hire on Fiverr" data-pt="Contratar no Fiverr">Hire on Fiverr</span><span aria-hidden="true"> ↗</span>';
        cta.href = FIVERR_URL;
        cta.target = '_blank';
        cta.rel = 'noopener';
      }
    });

    const note = document.querySelector('.service-note');
    if(note){
      note.dataset.en = 'Launch pricing. These are starting points; final quotes depend on scope, integrations, content and interaction complexity.';
      note.dataset.pt = 'Preços de lançamento. Estes são valores iniciais; o orçamento final depende de escopo, integrações, conteúdo e complexidade das interações.';
      note.textContent = note.dataset.en;
    }

    if(!document.querySelector('.launch-pricing-badge')){
      const badge = document.createElement('div');
      badge.className = 'launch-pricing-badge';
      badge.innerHTML = '<span data-en="LAUNCH PRICING" data-pt="PREÇO DE LANÇAMENTO">LAUNCH PRICING</span><b data-en="Transparent starting prices — no hidden quote wall." data-pt="Preços iniciais transparentes — sem esconder tudo atrás de orçamento.">Transparent starting prices — no hidden quote wall.</b>';
      list.insertAdjacentElement('beforebegin',badge);
    }
  }

  function rebuildBuyerFAQ(){
    const acc = document.querySelector('#transparencyAcc');
    if(!acc) return;

    const items = [
      ['Scope & quote','Escopo e orçamento','We define the scope before implementation. Anything outside it is discussed before it changes price or timing.','O escopo é definido antes da implementação. Qualquer item fora dele é discutido antes de alterar preço ou prazo.'],
      ['Revisions','Revisões','Normal feedback and polishing are expected. Large direction changes are treated separately so there are no surprise additions.','Feedback normal e refinamentos fazem parte do processo. Mudanças grandes de direção são tratadas separadamente para evitar surpresas.'],
      ['Payment','Pagamento','When hired through Fiverr, payment is handled through Fiverr according to the order and milestone structure shown there.','Quando o projeto é contratado pelo Fiverr, o pagamento é processado pelo Fiverr conforme o pedido e os marcos definidos por lá.'],
      ['Communication','Comunicação','Project updates can stay in Fiverr messages, with milestones and decisions kept clear throughout the build.','As atualizações do projeto podem ficar nas mensagens do Fiverr, mantendo marcos e decisões claros durante todo o desenvolvimento.'],
      ['Final delivery','Entrega final','The final handoff can include the source code, project files and deployment when those items are part of the agreed scope.','A entrega final pode incluir código-fonte, arquivos do projeto e deploy quando esses itens fizerem parte do escopo combinado.'],
      ['SEO & analytics','SEO e analytics','Basic technical SEO can be included. Analytics setup is added when it is part of the selected package or agreed scope.','SEO técnico básico pode ser incluído. A configuração de analytics entra quando fizer parte do pacote escolhido ou do escopo combinado.'],
      ['QA & delivery','QA e entrega','Responsive behaviour, core interactions and obvious blockers are checked before handoff or deployment.','Comportamento responsivo, interações principais e bloqueios evidentes são verificados antes da entrega ou do deploy.'],
      ['Ownership','Propriedade','Project-specific ownership and handoff details are agreed in the scope so both sides know exactly what is delivered.','Detalhes de propriedade e handoff são definidos no escopo para que os dois lados saibam exatamente o que será entregue.']
    ];

    acc.innerHTML = items.map((item,i) => `
      <div class="t-acc buyer-faq-item" data-open="${i===0?'true':'false'}">
        <button class="t-acc-head" type="button" aria-expanded="${i===0?'true':'false'}">
          <span data-en="${item[0]}" data-pt="${item[1]}">${item[0]}</span>
          <span class="t-acc-chevron"><svg viewBox="0 0 16 16"><path d="M4 6.5L8 10.5L12 6.5"/></svg></span>
        </button>
        <div class="t-acc-panel"><div class="t-acc-panel-inner"><p data-en="${item[2]}" data-pt="${item[3]}">${item[2]}</p></div></div>
      </div>`).join('');

    acc.querySelectorAll('.buyer-faq-item').forEach(item => {
      const btn = item.querySelector('.t-acc-head');
      btn.addEventListener('click',() => {
        const open = item.dataset.open === 'true';
        item.dataset.open = String(!open);
        btn.setAttribute('aria-expanded',String(!open));
      });
    });
  }

  function enhanceContact(){
    const inner = document.querySelector('.contact-section .contact-inner');
    if(!inner) return;

    const h2 = inner.querySelector('.contact-copy-v4 h2');
    const p = inner.querySelector('.contact-copy-v4 p');
    if(h2){
      h2.dataset.en = "Let's build something worth remembering.";
      h2.dataset.pt = 'Vamos construir algo que valha a pena lembrar.';
    }
    if(p){
      p.dataset.en = 'Open to freelance landing pages, product interfaces and remote frontend work.';
      p.dataset.pt = 'Disponível para landing pages, interfaces de produto e trabalho frontend remoto.';
    }

    if(!inner.querySelector('.conversion-final-cta')){
      const cta = document.createElement('a');
      cta.className = 'conversion-final-cta';
      cta.href = FIVERR_URL;
      cta.target = '_blank';
      cta.rel = 'noopener';
      cta.innerHTML = '<span><small data-en="READY WHEN YOU ARE" data-pt="QUANDO VOCÊ QUISER">READY WHEN YOU ARE</small><strong data-en="Hire Davi on Fiverr" data-pt="Contratar Davi no Fiverr">Hire Davi on Fiverr</strong></span><i data-lucide="arrow-up-right"></i>';
      inner.appendChild(cta);
    }
  }

  function fixPersonaWorlds(){
    const articles = [...document.querySelectorAll('.products-section .product-list article')];
    const worlds = articles.find(article => article.querySelector('h3')?.textContent.trim() === 'Persona Worlds');
    if(!worlds) return;
    if(worlds.parentElement?.tagName !== 'A'){
      worlds.classList.add('product-static');
      worlds.querySelector('.product-arrow')?.remove();
      worlds.setAttribute('aria-label','Persona Worlds — portfolio description, no external link');
    }
  }

  function optimizeMobile(){
    if(!mobile390) return;
    document.querySelectorAll('.v3-starfield .v3-star').forEach((el,i) => { if(i % 3 !== 0) el.remove(); });
    document.querySelectorAll('.hero-star-cluster .v3-star').forEach((el,i) => { if(i % 2 !== 0) el.remove(); });
    document.querySelectorAll('.moon-orbit-field i').forEach((el,i) => { if(i % 3 !== 0) el.remove(); });
  }

  function bindLanguageRefresh(){
    const button = document.querySelector('#languageToggle');
    if(!button) return;
    button.addEventListener('click',() => setTimeout(applyStoredLanguage,0));
  }

  function init(){
    enhanceHeader();
    enhanceHero();
    addSocialProof();
    enhancePricing();
    rebuildBuyerFAQ();
    enhanceContact();
    fixPersonaWorlds();
    optimizeMobile();
    applyStoredLanguage();
    bindLanguageRefresh();
    if(window.lucide) window.lucide.createIcons();
    if(window.ScrollTrigger) setTimeout(() => window.ScrollTrigger.refresh(),80);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
