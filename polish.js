(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  function removeDuplicatePersistentMark(){
    document.querySelectorAll('.persistent-dm').forEach(el => el.remove());
  }

  function initMeasuredTabs(){
    const root = document.querySelector('#polishTabs');
    if(!root) return;
    const pill = root.querySelector('.t-tabs-pill');
    const tabs = [...root.querySelectorAll('.t-tab')];
    const readout = document.querySelector('#activeState');
    if(!pill || !tabs.length) return;

    const position = (tab, animate = true) => {
      if(!animate) pill.style.transition = 'none';
      pill.style.transform = `translateX(${tab.offsetLeft}px)`;
      pill.style.width = `${tab.offsetWidth}px`;
      if(!animate){ void pill.offsetWidth; pill.style.transition = ''; }
    };

    const select = tab => {
      tabs.forEach(t => t.setAttribute('aria-selected', String(t === tab)));
      position(tab, !reduceMotion);
      if(readout) readout.textContent = tab.textContent.trim();
    };

    tabs.forEach(tab => tab.addEventListener('click', () => select(tab)));
    const initial = tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0];
    requestAnimationFrame(() => position(initial, false));
    addEventListener('resize', () => position(tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0], false), {passive:true});
  }

  function initAvatarFalloff(){
    const root = document.querySelector('#avatarGroup');
    if(!root || !finePointer) return;
    const items = [...root.querySelectorAll('.t-avatar')];
    const lift = -4, scale = 1.05, falloff = .45;
    items.forEach((item, activeIdx) => {
      item.addEventListener('mouseenter', () => {
        items.forEach((el, i) => {
          const distance = Math.abs(i - activeIdx);
          const shift = lift * Math.pow(falloff, distance);
          el.style.transitionTimingFunction = 'var(--avatar-ease-in)';
          el.style.setProperty('--shift', `${shift.toFixed(3)}px`);
          el.style.setProperty('--scale-active', i === activeIdx ? scale : 1);
        });
      });
    });
    root.addEventListener('mouseleave', () => {
      items.forEach(el => {
        el.style.transitionTimingFunction = 'var(--avatar-ease-out)';
        el.style.setProperty('--shift', '0px');
        el.style.setProperty('--scale-active', '1');
      });
    });
  }

  function initDigitPop(){
    const group = document.querySelector('#metricDigits');
    const replay = document.querySelector('#replayDigits');
    if(!group) return;
    const play = () => { group.classList.remove('is-animating'); void group.offsetWidth; group.classList.add('is-animating'); };
    replay?.addEventListener('click', play);
    play();
  }

  function initMorph(){
    const root = document.querySelector('#polishMorph');
    const button = document.querySelector('#polishMorphToggle');
    if(!root || !button) return;
    button.addEventListener('click', () => {
      const open = root.dataset.open !== 'true';
      root.dataset.open = String(open);
      button.setAttribute('aria-expanded', String(open));
    });
    root.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      root.dataset.open = 'false';
      button.setAttribute('aria-expanded', 'false');
    }));
  }

  function initBannerStack(){
    const root = document.querySelector('#polishStack');
    const hitbox = document.querySelector('#stackDemo');
    const add = document.querySelector('#addPolishBanner');
    if(!root) return;
    const messages = [['Build ready','Responsive pass completed'],['Motion refined','Interaction timing updated'],['QA complete','No blocking issues found'],['Deploy shipped','Latest version is live']];
    let cursor = 0;
    const normalize = () => {
      const nodes = [...root.querySelectorAll('.t-stack-banner:not(.is-leaving)')];
      nodes.forEach((node, index) => node.dataset.depth = String(index));
      nodes.slice(3).forEach(node => { node.classList.add('is-leaving'); setTimeout(() => node.remove(), 270); });
    };
    const addBanner = (animate = true) => {
      const existing = [...root.querySelectorAll('.t-stack-banner:not(.is-leaving)')];
      existing.forEach(node => node.dataset.depth = String(Number(node.dataset.depth || 0) + 1));
      const [title, sub] = messages[cursor++ % messages.length];
      const node = document.createElement('div');
      node.className = `t-stack-banner${animate && !reduceMotion ? ' is-enter' : ''}`;
      node.dataset.depth = '0';
      node.innerHTML = `<div><strong>${title}</strong><span>${sub}</span></div>`;
      root.prepend(node);
      if(animate && !reduceMotion){ void node.offsetWidth; node.classList.remove('is-enter'); }
      normalize();
    };
    addBanner(false); addBanner(false); addBanner(false);
    add?.addEventListener('click', () => addBanner(true));
    hitbox?.addEventListener('pointerenter', () => root.classList.add('is-spread'));
    hitbox?.addEventListener('pointerleave', () => root.classList.remove('is-spread'));
  }

  addEventListener('DOMContentLoaded', () => {
    removeDuplicatePersistentMark();
    const observer = new MutationObserver(removeDuplicatePersistentMark);
    observer.observe(document.body, {childList:true});
    setTimeout(() => observer.disconnect(), 2500);
    initMeasuredTabs();
    initAvatarFalloff();
    initDigitPop();
    initMorph();
    initBannerStack();
  });
})();

(() => {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = './v3.css?v=20260930-space3';
  document.head.appendChild(css);
  const script = document.createElement('script');
  script.src = './v3.js?v=20260930-space3';
  script.defer = true;
  document.head.appendChild(script);
})();
