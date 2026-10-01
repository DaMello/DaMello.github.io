(() => {
  const FIVERR_URL = 'https://www.fiverr.com/the_mello/buying?source=avatar_menu_profile';

  function wireFiverrLinks(){
    document.querySelectorAll('a').forEach(anchor => {
      const rawHref = anchor.getAttribute('href') || '';
      const isPlaceholder = rawHref.includes('LINK_DO_FIVERR');
      const isFiverrCta = /fiverr/i.test(anchor.textContent || '');
      if(!isPlaceholder && !isFiverrCta) return;
      anchor.href = FIVERR_URL;
      anchor.target = '_blank';
      anchor.rel = 'noopener';
    });
  }

  function simplifyMotionShowcase(){
    const story = document.querySelector('.motion-story');
    if(!story) return;

    const originalScenes = [...story.querySelectorAll('.motion-scene')];
    if(originalScenes.length >= 6){
      originalScenes[3]?.remove();
      originalScenes[4]?.remove();
    }

    const scenes = [...story.querySelectorAll('.motion-scene')];
    if(!scenes.length) return;

    scenes.forEach((scene,index) => {
      scene.dataset.scene = String(index);
      const label = scene.querySelector('.scene-copy > span');
      if(label){
        label.textContent = label.textContent.replace(/^\d{2}\s*\//, `${String(index + 1).padStart(2,'0')} /`);
      }
    });

    story.style.height = '420vh';

    const progress = story.querySelector('.motion-progress');
    const number = story.querySelector('#motionNumber');
    const bar = story.querySelector('#motionBar');
    const total = progress?.querySelector('span:last-child');
    if(total) total.textContent = String(scenes.length).padStart(2,'0');

    const setScene = idx => {
      scenes.forEach((scene,i) => scene.classList.toggle('is-active', i === idx));
      if(number) number.textContent = String(idx + 1).padStart(2,'0');
      if(bar) bar.style.transform = `scaleX(${(idx + 1) / scenes.length})`;
    };

    setScene(0);

    if(window.ScrollTrigger){
      window.ScrollTrigger.getAll().forEach(trigger => {
        if(trigger.trigger === story) trigger.kill();
      });

      if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
        window.ScrollTrigger.create({
          trigger: story,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: self => {
            const idx = Math.max(0, Math.min(scenes.length - 1, Math.floor(self.progress * scenes.length)));
            setScene(idx);
          }
        });
      }

      requestAnimationFrame(() => window.ScrollTrigger.refresh());
    }
  }

  function removeProofKicker(){
    const proof = document.querySelector('.social-proof-section');
    const kicker = proof?.querySelector('.proof-intro .section-kicker');
    if(kicker) kicker.remove();
  }

  function loadProofHotfix(){
    if(document.querySelector('script[data-proof-hotfix]')) return;
    const script = document.createElement('script');
    script.src = './hotfix-v9.js?v=20261001-proof9';
    script.defer = true;
    script.dataset.proofHotfix = 'true';
    document.head.appendChild(script);
  }

  function init(){
    wireFiverrLinks();
    simplifyMotionShowcase();
    removeProofKicker();
    loadProofHotfix();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true });
  else init();
})();
