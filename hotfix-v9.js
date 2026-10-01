(() => {
  const lang = () => localStorage.getItem('dm-lang') === 'pt' ? 'pt' : 'en';

  function rebuildProof(){
    const section = document.querySelector('.social-proof-section');
    if(!section) return;
    const shell = section.querySelector('.section-shell');
    if(!shell) return;

    const intro = shell.querySelector('.proof-intro');
    if(intro){
      intro.querySelector('.section-kicker')?.remove();
      const copy = intro.querySelector('p');
      if(copy){
        copy.dataset.en = 'Proof you can inspect right now: live demos, interactive motion systems and a fast delivery target.';
        copy.dataset.pt = 'Prova que você pode testar agora: demos ao vivo, sistemas de motion interativos e uma meta de entrega rápida.';
        copy.textContent = copy.dataset[lang()];
      }
    }

    shell.querySelector('.proof-metrics')?.remove();
    shell.querySelector('.testimonial-grid')?.remove();
    shell.querySelector('.proof-unified-panel')?.remove();

    const panel = document.createElement('div');
    panel.className = 'proof-unified-panel';
    panel.innerHTML = `
      <div class="proof-unified-cell">
        <strong>03</strong>
        <span data-en="live demos" data-pt="demos ao vivo">live demos</span>
      </div>
      <div class="proof-unified-cell">
        <strong>04</strong>
        <span data-en="motion systems" data-pt="sistemas de motion">motion systems</span>
      </div>
      <div class="proof-unified-cell">
        <strong>≤7d</strong>
        <span data-en="typical delivery target" data-pt="meta típica de entrega">typical delivery target</span>
      </div>`;
    shell.appendChild(panel);
    panel.querySelectorAll('[data-en][data-pt]').forEach(el => el.textContent = el.dataset[lang()]);
  }

  function rebuildPriceComparison(){
    const chart = document.querySelector('.price-chart-shell');
    if(!chart) return;

    chart.classList.remove('unified-surface');
    chart.classList.add('price-comparison-flat');
    chart.setAttribute('aria-label', lang() === 'pt' ? 'Comparação de preço de entrada' : 'Entry price comparison');
    chart.innerHTML = `
      <div class="comparison-copy">
        <small data-en="MARKET CONTEXT" data-pt="CONTEXTO DE MERCADO">MARKET CONTEXT</small>
        <h3 data-en="A lower launch entry price." data-pt="Um preço de entrada menor no lançamento.">A lower launch entry price.</h3>
        <p data-en="Two reference points, shown plainly." data-pt="Dois pontos de referência, mostrados de forma simples.">Two reference points, shown plainly.</p>
      </div>
      <div class="comparison-layout">
        <div class="comparison-bars" aria-hidden="true">
          <div class="comparison-row">
            <div class="comparison-row-head"><span data-en="Agency / specialist team" data-pt="Agência / equipe especialista">Agency / specialist team</span><strong>US$2,000+</strong></div>
            <div class="comparison-track"><i class="comparison-fill agency" style="width:100%"></i></div>
          </div>
          <div class="comparison-row is-davi">
            <div class="comparison-row-head"><span>Davi Mello</span><strong>US$149+</strong></div>
            <div class="comparison-track"><i class="comparison-fill davi" style="width:7.45%"></i></div>
          </div>
        </div>
        <aside class="comparison-summary">
          <strong data-en="13.4× lower" data-pt="13,4× menor">13.4× lower</strong>
          <span data-en="launch entry price" data-pt="preço de entrada no lançamento">launch entry price</span>
          <p data-en="This compares Clutch's published agency project floor with my US$149 launch landing package. Scope is not identical." data-pt="A comparação usa o piso publicado pela Clutch para projetos de agência e meu pacote de landing de lançamento por US$149. O escopo não é idêntico.">This compares Clutch's published agency project floor with my US$149 launch landing package. Scope is not identical.</p>
          <a href="https://clutch.co/web-designers/pricing" target="_blank" rel="noopener" data-en="Source: Clutch 2026 ↗" data-pt="Fonte: Clutch 2026 ↗">Source: Clutch 2026 ↗</a>
        </aside>
      </div>`;

    chart.querySelectorAll('[data-en][data-pt]').forEach(el => el.textContent = el.dataset[lang()]);

    const pricingIntro = document.querySelector('.pricing-intro');
    const heading = pricingIntro?.querySelector('h2');
    const paragraph = pricingIntro?.querySelector('p');
    if(heading){
      heading.dataset.en = 'Premium craft at a lower launch entry point.';
      heading.dataset.pt = 'Acabamento premium com um preço de entrada menor no lançamento.';
      heading.textContent = heading.dataset[lang()];
    }
    if(paragraph){
      paragraph.dataset.en = 'I handle visual direction, front-end and motion in one workflow. The comparison below gives market context, while final quotes still depend on scope.';
      paragraph.dataset.pt = 'Eu cuido de direção visual, front-end e motion no mesmo fluxo. A comparação abaixo dá contexto de mercado, enquanto o orçamento final continua dependendo do escopo.';
      paragraph.textContent = paragraph.dataset[lang()];
    }
  }

  function removeUnresolvedPlaceholders(){
    document.querySelectorAll('.service-fulfillment').forEach(el => {
      if(/\[[^\]]+\]/.test(el.textContent || '')) el.remove();
    });
  }

  function decorateFiverrButtons(){
    document.querySelectorAll('a').forEach(anchor => {
      const text = (anchor.textContent || '').toLowerCase();
      const href = anchor.getAttribute('href') || '';
      if(!text.includes('fiverr') && !href.includes('fiverr.com')) return;

      const final = anchor.classList.contains('conversion-final-cta');
      anchor.classList.add('fiverr-flat-cta');
      const en = final ? 'Hire Davi on Fiverr' : 'Hire on Fiverr';
      const pt = final ? 'Contratar Davi no Fiverr' : 'Contratar no Fiverr';
      anchor.innerHTML = `
        <span class="fiverr-wordmark" aria-hidden="true">fiverr.</span>
        <span class="fiverr-label" data-en="${en}" data-pt="${pt}">${lang() === 'pt' ? pt : en}</span>
        <span class="fiverr-arrow" aria-hidden="true">↗</span>`;
    });
  }

  function removeEmDashes(){
    const clean = value => String(value || '').replace(/\s*—\s*/g, ' ');
    document.querySelectorAll('[data-en],[data-pt]').forEach(el => {
      if(el.dataset.en) el.dataset.en = clean(el.dataset.en);
      if(el.dataset.pt) el.dataset.pt = clean(el.dataset.pt);
    });
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while((node = walker.nextNode())){
      if(node.nodeValue?.includes('—')) node.nodeValue = clean(node.nodeValue);
    }
  }

  function installFinalStyles(){
    document.querySelector('#finalPortfolioStyles')?.remove();
    const style = document.createElement('style');
    style.id = 'finalPortfolioStyles';
    style.textContent = `
      /* Flat, solid information surfaces */
      .price-chart-shell,.proof-unified-panel,.service-list,.transparency-shell{
        background:transparent!important;
        background-image:none!important;
        backdrop-filter:none!important;
        -webkit-backdrop-filter:none!important;
        box-shadow:none!important;
        border-radius:0!important;
        border-left:0!important;
        border-right:0!important;
      }
      .price-chart-shell,.proof-unified-panel,.service-list,.transparency-shell{
        border-top:1px solid rgba(255,255,255,.18)!important;
        border-bottom:1px solid rgba(255,255,255,.18)!important;
      }
      .price-chart-shell{padding:42px 0!important;border-color:rgba(255,255,255,.2)!important}
      .proof-unified-panel{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));max-width:1040px;margin:38px auto 0!important;overflow:visible!important}
      .proof-unified-cell{min-height:142px;padding:28px 30px;display:flex;flex-direction:column;justify-content:flex-end;gap:8px;background:transparent!important}
      .proof-unified-cell + .proof-unified-cell{border-left:1px solid rgba(255,255,255,.14)}
      .proof-unified-cell strong{font-size:clamp(34px,4vw,58px);line-height:.95;letter-spacing:-.045em;font-weight:620;color:#fff}
      .proof-unified-cell span{font-size:12px;color:rgba(255,255,255,.62)}

      /* Informational pricing comparison */
      .comparison-copy{display:grid;grid-template-columns:minmax(0,.72fr) minmax(0,1.28fr);gap:28px;align-items:end;padding-bottom:32px;border-bottom:1px solid rgba(255,255,255,.14)}
      .comparison-copy small{font-size:10px;letter-spacing:.14em;color:rgba(255,255,255,.46)}
      .comparison-copy h3{font-size:clamp(30px,4vw,54px);line-height:.96;letter-spacing:-.045em;margin:0}
      .comparison-copy p{grid-column:2;margin:0;color:rgba(255,255,255,.58);font-size:13px;line-height:1.6}
      .comparison-layout{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(260px,.5fr);gap:44px;padding-top:42px;align-items:stretch}
      .comparison-bars{display:flex;flex-direction:column;justify-content:center;gap:42px;min-height:260px}
      .comparison-row{display:grid;gap:14px}
      .comparison-row-head{display:flex;justify-content:space-between;align-items:baseline;gap:20px}
      .comparison-row-head span{font-size:13px;color:rgba(255,255,255,.68)}
      .comparison-row-head strong{font-size:18px;font-weight:620;color:#fff;font-variant-numeric:tabular-nums}
      .comparison-track{height:12px;background:#1a1d23;position:relative;overflow:visible}
      .comparison-fill{display:block;height:12px;border-radius:2px;background:#7c828d;min-width:12px}
      .comparison-fill.davi{background:#2f7df4;min-width:32px}
      .comparison-row.is-davi .comparison-row-head span,.comparison-row.is-davi .comparison-row-head strong{color:#69a3ff}
      .comparison-summary{border-left:1px solid rgba(255,255,255,.14);padding-left:36px;display:flex;flex-direction:column;justify-content:center;align-items:flex-start}
      .comparison-summary>strong{font-size:clamp(46px,6vw,82px);line-height:.88;letter-spacing:-.06em;color:#2f7df4;font-weight:650}
      .comparison-summary>span{font-size:15px;margin-top:12px;color:#fff}
      .comparison-summary p{font-size:11px;line-height:1.65;color:rgba(255,255,255,.5);margin:24px 0 10px;max-width:290px}
      .comparison-summary a{font-size:10px;color:rgba(255,255,255,.68);text-decoration:underline;text-underline-offset:4px}

      /* Keep the package and FAQ language as lines, not floating glass cards */
      .service-list{overflow:visible!important}
      .service-list article{background:transparent!important;border-radius:0!important;border-left:0!important;border-right:0!important;box-shadow:none!important}
      .service-list article + article{border-top:1px solid rgba(255,255,255,.13)!important}
      .transparency-shell .t-acc{background:transparent!important}
      .launch-pricing-badge{background:transparent!important;background-image:none!important;border:0!important;border-radius:0!important;box-shadow:none!important;padding-left:0!important;padding-right:0!important}

      /* Fiverr gets brand contrast, not a gradient */
      .fiverr-flat-cta{
        background:#f4f5f6!important;
        background-image:none!important;
        color:#090b0e!important;
        border:1px solid #f4f5f6!important;
        box-shadow:none!important;
        text-shadow:none!important;
        display:inline-flex!important;
        align-items:center!important;
        justify-content:center!important;
        gap:10px!important;
      }
      .fiverr-flat-cta:hover{background:#fff!important;transform:translateY(-1px)}
      .fiverr-wordmark{color:#1dbf73!important;font-weight:800!important;letter-spacing:-.04em!important;text-transform:lowercase!important}
      .fiverr-label{color:#090b0e!important;font-weight:650!important;white-space:nowrap}
      .fiverr-arrow{color:#090b0e!important;font-size:16px!important}
      .header-fiverr-cta{min-height:44px!important;padding:0 18px!important}
      .hero-fiverr-cta{min-height:48px!important;padding:0 20px!important}
      .conversion-final-cta{min-height:104px!important;border-radius:18px!important;padding:26px 30px!important;width:100%!important;justify-content:flex-start!important}
      .conversion-final-cta .fiverr-wordmark{font-size:24px!important}
      .conversion-final-cta .fiverr-label{font-size:clamp(22px,3vw,38px)!important;letter-spacing:-.035em!important}
      .conversion-final-cta .fiverr-arrow{margin-left:auto!important;font-size:24px!important}
      .service-list .fiverr-flat-cta{background:transparent!important;color:#fff!important;border:0!important;padding:0!important;justify-content:flex-start!important}
      .service-list .fiverr-flat-cta .fiverr-label,.service-list .fiverr-flat-cta .fiverr-arrow{color:#fff!important}

      @media(max-width:820px){
        .comparison-copy{grid-template-columns:1fr}.comparison-copy p{grid-column:1}
        .comparison-layout{grid-template-columns:1fr;gap:30px}
        .comparison-summary{border-left:0;border-top:1px solid rgba(255,255,255,.14);padding:30px 0 0}
      }
      @media(max-width:700px){
        .proof-unified-panel{grid-template-columns:1fr}
        .proof-unified-cell{min-height:112px;padding:24px 6px}
        .proof-unified-cell + .proof-unified-cell{border-left:0;border-top:1px solid rgba(255,255,255,.14)}
        .comparison-bars{min-height:220px;gap:34px}
      }
    `;
    document.head.appendChild(style);
  }

  function refreshLanguage(){
    rebuildProof();
    rebuildPriceComparison();
    removeUnresolvedPlaceholders();
    decorateFiverrButtons();
    removeEmDashes();
  }

  function reveal(){
    clearTimeout(window.__dmRevealFallback);
    requestAnimationFrame(() => {
      document.documentElement.classList.remove('dm-preparing');
      document.querySelector('#dm-render-gate')?.remove();
    });
  }

  function init(){
    installFinalStyles();
    refreshLanguage();
    if(window.lucide) window.lucide.createIcons();
    if(window.ScrollTrigger) setTimeout(() => window.ScrollTrigger.refresh(),80);
    reveal();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();

  document.querySelector('#languageToggle')?.addEventListener('click',() => setTimeout(refreshLanguage,20));
})();
