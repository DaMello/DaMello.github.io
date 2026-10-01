(() => {
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
        const lang = localStorage.getItem('dm-lang') === 'pt' ? 'pt' : 'en';
        copy.textContent = copy.dataset[lang];
      }
    }

    shell.querySelector('.proof-metrics')?.remove();
    shell.querySelector('.testimonial-grid')?.remove();

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

    if(!document.querySelector('#proofUnifiedStyles')){
      const style = document.createElement('style');
      style.id = 'proofUnifiedStyles';
      style.textContent = `
        .social-proof-section .proof-unified-panel{
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          max-width:1040px;
          margin:34px auto 0;
          border:1px solid rgba(255,255,255,.11);
          border-radius:28px;
          overflow:hidden;
          background:rgba(8,10,15,.58);
          backdrop-filter:blur(24px) saturate(135%);
          -webkit-backdrop-filter:blur(24px) saturate(135%);
          box-shadow:0 24px 80px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.025);
        }
        .social-proof-section .proof-unified-cell{
          min-height:158px;
          padding:34px 30px;
          display:flex;
          flex-direction:column;
          justify-content:flex-end;
          gap:8px;
        }
        .social-proof-section .proof-unified-cell + .proof-unified-cell{
          border-left:1px solid rgba(255,255,255,.09);
        }
        .social-proof-section .proof-unified-cell strong{
          font-size:clamp(34px,4vw,58px);
          line-height:.95;
          letter-spacing:-.045em;
          font-weight:650;
          color:#f5f7fb;
        }
        .social-proof-section .proof-unified-cell span{
          font-size:12px;
          letter-spacing:.02em;
          color:rgba(226,232,242,.58);
        }
        @media(max-width:700px){
          .social-proof-section .proof-unified-panel{grid-template-columns:1fr;border-radius:24px}
          .social-proof-section .proof-unified-cell{min-height:122px;padding:26px 24px}
          .social-proof-section .proof-unified-cell + .proof-unified-cell{border-left:0;border-top:1px solid rgba(255,255,255,.09)}
        }
      `;
      document.head.appendChild(style);
    }

    const lang = localStorage.getItem('dm-lang') === 'pt' ? 'pt' : 'en';
    panel.querySelectorAll('[data-en][data-pt]').forEach(el => el.textContent = el.dataset[lang]);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',rebuildProof,{once:true});
  else rebuildProof();

  document.querySelector('#languageToggle')?.addEventListener('click',() => setTimeout(rebuildProof,0));
})();
