(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function seeded(seed){
    let s = seed >>> 0;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }

  function rebuildHeader(){
    const brand = document.querySelector('.brand');
    const nav = document.querySelector('.desktop-nav');
    const actions = document.querySelector('.header-actions');
    if(brand){
      brand.innerHTML = '<span>DM</span><b>Davi Mello</b>';
      brand.setAttribute('aria-label','Davi Mello home');
    }
    if(nav){
      nav.innerHTML = `
        <a href="#work">Work</a>
        <a href="#motion">Motion</a>
        <a href="#pricing">Pricing</a>
        <a href="https://github.com/DaMello" target="_blank" rel="noopener">GitHub</a>
        <a href="mailto:davimello.persona@gmail.com">Email</a>`;
    }
    if(actions){
      const lang = actions.querySelector('#languageToggle');
      actions.innerHTML = '';
      if(lang) actions.appendChild(lang);
      const gmail = document.createElement('a');
      gmail.className = 'header-cta';
      gmail.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=davimello.persona@gmail.com';
      gmail.target = '_blank';
      gmail.rel = 'noopener';
      gmail.innerHTML = '<span>Gmail</span><i data-lucide="arrow-up-right"></i>';
      actions.appendChild(gmail);
      if(window.lucide) window.lucide.createIcons();
    }
  }

  function buildMoonOrbit(stage){
    const field = stage.querySelector('.moon-orbit-field');
    if(!field) return;
    const random = seeded(610422);
    field.innerHTML = '';

    const addParticle = (angle, rx, ry, warmChance=.2, alphaBase=.22) => {
      const p = document.createElement('i');
      const jitterX = (random() - .5) * 22;
      const jitterY = (random() - .5) * 22;
      const x = Math.cos(angle) * rx + jitterX;
      const y = Math.sin(angle) * ry + jitterY;
      const size = .7 + random() * 3.4;
      p.style.setProperty('--x',`${x.toFixed(1)}px`);
      p.style.setProperty('--y',`${y.toFixed(1)}px`);
      p.style.setProperty('--s',`${size.toFixed(2)}px`);
      p.style.setProperty('--a',`${(alphaBase + random()*.66).toFixed(2)}`);
      p.style.setProperty('--d',`${(2 + random()*4.5).toFixed(2)}s`);
      p.style.setProperty('--delay',`${(-random()*5).toFixed(2)}s`);
      if(random() < warmChance) p.classList.add('warm');
      field.appendChild(p);
    };

    // Broad crescent-like sweep inspired by the user's reference screenshots.
    for(let i=0;i<120;i++){
      const t = i / 119;
      const angle = -2.65 + t * 4.45;
      addParticle(angle, 132 + random()*38, 112 + random()*35, .22, .18);
    }
    // Denser inner trail close to the moon.
    for(let i=0;i<72;i++){
      const t = i / 71;
      const angle = -1.95 + t * 3.8;
      addParticle(angle, 94 + random()*25, 80 + random()*22, .16, .26);
    }
  }

  function initAboutV6(){
    const section = document.querySelector('.intro-story');
    const intro = document.querySelector('.intro-sticky');
    const surface = document.querySelector('#identitySurface');
    const content = document.querySelector('#surfaceContent');
    const hero = document.querySelector('.hero-copy');
    const ribbon = document.querySelector('.skill-ribbon');
    const cue = document.querySelector('.scroll-cue');
    if(!section || !intro || !surface || !content) return;

    document.body.classList.add('about-v5-active');
    rebuildHeader();
    document.querySelectorAll('.persistent-dm').forEach(el => el.remove());
    document.querySelector('.about-stage-label')?.remove();

    let lockup = document.querySelector('.name-orbit-lockup');
    if(!lockup){
      lockup = document.createElement('div');
      lockup.className = 'name-orbit-lockup';
      lockup.setAttribute('aria-label','Davi Mello');
      intro.appendChild(lockup);
    }
    lockup.innerHTML = `
      <span>Davi</span>
      <div class="moon-stage" aria-hidden="true">
        <div class="moon-orbit-field"></div>
        <i class="moon-core"></i>
      </div>
      <span>Mello</span>`;
    const moonStage = lockup.querySelector('.moon-stage');
    buildMoonOrbit(moonStage);

    hero?.setAttribute('aria-hidden','true');
    ribbon?.setAttribute('aria-hidden','true');
    cue?.setAttribute('aria-hidden','true');

    if(!window.gsap || !window.ScrollTrigger){
      Object.assign(surface.style,{left:'5vw',top:'18vh',width:'90vw',height:'72vh'});
      content.style.opacity = '1';
      lockup.style.opacity = '0';
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.getAll().forEach(st => { if(st.trigger === section) st.kill(true); });
    gsap.killTweensOf([surface,content,hero,ribbon,cue,lockup,moonStage]);

    const articles = surface.querySelectorAll('.capability-grid article');

    const setupDesktop = () => {
      gsap.set(lockup,{opacity:1,y:0,scale:1});
      gsap.set(surface,{
        left:'50%',top:'116%',xPercent:-50,yPercent:-50,
        width:300,height:132,borderRadius:30,opacity:1
      });
      gsap.set(content,{opacity:0,y:36,scale:.985,filter:'blur(10px)'});
      gsap.set(articles,{opacity:0,y:18});

      const tl = gsap.timeline({
        scrollTrigger:{trigger:section,start:'top top',end:'bottom bottom',scrub:.8,invalidateOnRefresh:true}
      });

      // Hold the OpenAI-style identity frame first.
      tl.to({}, {duration:.18})
        // Then bring the About card up from below while it grows.
        .to(surface,{
          top:'50%',width:'86vw',height:'76vh',borderRadius:30,
          ease:'power3.inOut',duration:.38
        },.18)
        // Reveal content during the growth itself.
        .to(content,{
          opacity:1,y:0,scale:1,filter:'blur(0px)',
          ease:'power2.out',duration:.25
        },.29)
        .to(articles,{
          opacity:1,y:0,stagger:.024,ease:'power2.out',duration:.18
        },.33)
        // Identity frame yields to the incoming card.
        .to(lockup,{opacity:0,y:-54,scale:.965,ease:'power2.in',duration:.18},.26)
        .to(moonStage,{scale:.9,filter:'blur(4px)',ease:'power2.in',duration:.16},.27)
        .to({}, {duration:.27})
        .to(surface,{opacity:0,yPercent:-58,ease:'power2.in',duration:.12},.87);

      return () => { tl.scrollTrigger?.kill(); tl.kill(); };
    };

    const setupMobile = () => {
      gsap.set(lockup,{opacity:1,y:0,scale:1});
      gsap.set(surface,{
        left:'50%',top:'114%',xPercent:-50,yPercent:-50,
        width:'78vw',height:118,borderRadius:26,opacity:1
      });
      gsap.set(content,{opacity:0,y:28,scale:.99,filter:'blur(8px)'});
      gsap.set(articles,{opacity:0,y:14});

      const tl = gsap.timeline({
        scrollTrigger:{trigger:section,start:'top top',end:'bottom bottom',scrub:.7,invalidateOnRefresh:true}
      });
      tl.to({}, {duration:.17})
        .to(surface,{top:'51%',width:'92vw',height:'80vh',borderRadius:26,ease:'power3.inOut',duration:.38},.17)
        .to(content,{opacity:1,y:0,scale:1,filter:'blur(0px)',ease:'power2.out',duration:.24},.29)
        .to(articles,{opacity:1,y:0,stagger:.02,ease:'power2.out',duration:.15},.33)
        .to(lockup,{opacity:0,y:-34,scale:.97,ease:'power2.in',duration:.16},.26)
        .to(moonStage,{scale:.9,filter:'blur(3px)',ease:'power2.in',duration:.15},.27)
        .to({}, {duration:.26})
        .to(surface,{opacity:0,yPercent:-58,ease:'power2.in',duration:.12},.87);
      return () => { tl.scrollTrigger?.kill(); tl.kill(); };
    };

    if(reduceMotion){
      gsap.set(lockup,{opacity:1,y:0,scale:1});
      gsap.set(surface,{left:'50%',top:'120%',xPercent:-50,yPercent:-50,width:'92vw',height:'78vh',opacity:1});
      gsap.set(content,{opacity:1,y:0,filter:'none'});
      gsap.set(articles,{opacity:1,y:0});
      return;
    }

    const mm = gsap.matchMedia();
    mm.add('(min-width: 761px)',setupDesktop);
    mm.add('(max-width: 760px)',setupMobile);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',initAboutV6,{once:true});
  else initAboutV6();
})();