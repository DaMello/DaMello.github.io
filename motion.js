(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer:fine)').matches;
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  const q = (s, root=document) => root.querySelector(s);
  const qa = (s, root=document) => [...root.querySelectorAll(s)];

  function injectChrome(){
    if (!q('.scroll-progress')) {
      const progress = document.createElement('div');
      progress.className = 'scroll-progress';
      progress.setAttribute('aria-hidden','true');
      document.body.appendChild(progress);
    }
    if (!q('.motion-ambient.a')) {
      const a = document.createElement('div');
      a.className = 'motion-ambient a';
      const b = document.createElement('div');
      b.className = 'motion-ambient b';
      a.setAttribute('aria-hidden','true');
      b.setAttribute('aria-hidden','true');
      document.body.append(a,b);
    }
  }

  function injectLoader(){
    if (reduceMotion || q('.intro-loader')) return null;
    const loader = document.createElement('div');
    loader.className = 'intro-loader';
    loader.innerHTML = '<div class="intro-mark"><strong>DM</strong><span>DESIGN + CODE</span><div class="intro-line"><i></i></div></div>';
    document.body.appendChild(loader);
    return loader;
  }

  function splitHeroLines(){
    qa('.hero h1 > span, .hero h1 > strong').forEach(el => {
      if (el.classList.contains('motion-line')) return;
      const text = el.textContent;
      const tag = el.tagName.toLowerCase();
      const replacement = document.createElement(tag);
      [...el.attributes].forEach(a => replacement.setAttribute(a.name,a.value));
      replacement.classList.add('motion-line');
      const inner = document.createElement('span');
      inner.className = 'motion-line-inner';
      inner.textContent = text;
      replacement.appendChild(inner);
      el.replaceWith(replacement);
    });
  }

  function splitWords(el){
    if (!el || el.dataset.motionSplit === '1') return;
    el.dataset.motionSplit = '1';
    const nodes = [...el.childNodes];
    el.textContent = '';
    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE){
        const words = node.textContent.split(/(\s+)/);
        words.forEach(w => {
          if (!w) return;
          if (/^\s+$/.test(w)) { el.appendChild(document.createTextNode(w)); return; }
          const outer = document.createElement('span');
          outer.className = 'split-word';
          const inner = document.createElement('span');
          inner.textContent = w;
          outer.appendChild(inner);
          el.appendChild(outer);
        });
      } else {
        el.appendChild(node.cloneNode(true));
      }
    });
  }

  function nativeScrollProgress(){
    const bar = q('.scroll-progress');
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? scrollY / max : 0;
      if (bar) bar.style.transform = `scaleX(${Math.max(0,Math.min(1,p))})`;
      document.body.style.setProperty('--page-progress',p.toFixed(4));
    };
    addEventListener('scroll', update, {passive:true});
    addEventListener('resize', update, {passive:true});
    update();
  }

  function pointerGlow(){
    if (!finePointer || reduceMotion) return;
    addEventListener('pointermove', e => {
      document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
      document.documentElement.style.setProperty('--my', `${e.clientY}px`);
    }, {passive:true});
  }

  function makeSpotlight(el){
    if (!finePointer || reduceMotion) return;
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--spot-x', `${e.clientX-r.left}px`);
      el.style.setProperty('--spot-y', `${e.clientY-r.top}px`);
    }, {passive:true});
  }

  function makeTilt(el, amount=7, scale=1.01){
    if (!finePointer || reduceMotion) return;
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX-r.left)/r.width - .5;
      const y = (e.clientY-r.top)/r.height - .5;
      if (gsap) gsap.to(el,{rotateY:x*amount,rotateX:-y*amount,scale,duration:.45,ease:'power3.out',transformPerspective:900,transformOrigin:'center'});
      else el.style.transform = `perspective(900px) rotateY(${x*amount}deg) rotateX(${-y*amount}deg) scale(${scale})`;
    });
    el.addEventListener('pointerleave',() => {
      if (gsap) gsap.to(el,{rotateY:0,rotateX:0,scale:1,duration:.7,ease:'power3.out'});
      else el.style.transform='';
    });
  }

  function magnetic(el, strength=18){
    if (!finePointer || reduceMotion) return;
    el.classList.add('magnetic');
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX-(r.left+r.width/2))/r.width;
      const y = (e.clientY-(r.top+r.height/2))/r.height;
      if (gsap) gsap.to(el,{x:x*strength,y:y*strength,duration:.35,ease:'power3.out'});
    });
    el.addEventListener('pointerleave',() => gsap ? gsap.to(el,{x:0,y:0,duration:.65,ease:'elastic.out(1,.45)'}) : (el.style.transform=''));
  }

  function enhanceCursor(){
    const cursor = q('.cursor');
    if (!cursor || !finePointer || reduceMotion) return;
    qa('a,button,.service-card,.demo-card,.featured-project,.price-card').forEach(el => {
      el.addEventListener('pointerenter',() => cursor.classList.add('motion-open'));
      el.addEventListener('pointerleave',() => cursor.classList.remove('motion-open'));
    });
    addEventListener('pointerdown',() => cursor.classList.add('motion-press'));
    addEventListener('pointerup',() => cursor.classList.remove('motion-press'));
  }

  function headerMotion(){
    const header = q('.site-header');
    if (!header) return;
    let last = scrollY;
    const update = () => {
      const y = scrollY;
      header.classList.toggle('is-scrolled', y > 28);
      if (y > 240 && y > last + 8) header.classList.add('motion-hidden');
      if (y < last - 6 || y < 140) header.classList.remove('motion-hidden');
      last = y;
    };
    addEventListener('scroll', update,{passive:true});
    update();
  }

  function stackMarquee(){
    const track = q('.stack-items');
    if (!track || reduceMotion) return;
    const original = track.innerHTML;
    track.innerHTML = original + original;
    track.setAttribute('aria-label','Core technologies — animated marquee');
    if (gsap){
      gsap.set(track,{x:0});
      const tween = gsap.to(track,{xPercent:-50,duration:24,ease:'none',repeat:-1});
      track.addEventListener('pointerenter',()=>tween.timeScale(.22));
      track.addEventListener('pointerleave',()=>tween.timeScale(1));
    }
  }

  function fallbackReveal(){
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('motion-inview');
      entry.target.animate([{opacity:0,transform:'translateY(34px)'},{opacity:1,transform:'none'}],{duration:750,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
      io.unobserve(entry.target);
    }),{threshold:.1});
    qa('.section,.featured-project,.demo-card,.process-grid article,.price-card').forEach(el => io.observe(el));
  }

  function gsapMotion(loader){
    if (!gsap || !ScrollTrigger || reduceMotion){ fallbackReveal(); return; }
    gsap.registerPlugin(ScrollTrigger);
    gsap.config({nullTargetWarn:false});

    const intro = gsap.timeline({defaults:{ease:'power4.out'}});
    if (loader){
      intro.to('.intro-line i',{x:'0%',duration:.55,ease:'power2.inOut'})
        .from('.intro-mark strong',{y:70,opacity:0,rotateX:-40,duration:.75},0)
        .from('.intro-mark>span',{y:12,opacity:0,duration:.5},.18)
        .to('.intro-loader',{yPercent:-102,duration:.82,ease:'power4.inOut'},.7)
        .set('.intro-loader',{display:'none'});
    }

    intro.from('.site-header',{y:-35,opacity:0,duration:.7},loader?1.02:0)
      .from('.status-pill',{y:18,opacity:0,duration:.55},'<.08')
      .from('.hero-overline',{y:16,opacity:0,duration:.5},'<.08')
      .from('.hero h1 .motion-line-inner',{yPercent:112,rotateX:-24,stagger:.1,duration:.9},'<.05')
      .from('.hero-description',{y:25,opacity:0,duration:.65},'<.2')
      .from('.hero-actions>*',{y:22,opacity:0,stagger:.08,duration:.55},'<.08')
      .from('.hero-meta>div',{y:20,opacity:0,stagger:.07,duration:.5},'<.08')
      .from('.hero-visual',{x:70,opacity:0,rotateY:-9,scale:.94,duration:1.05},loader?.82:.1)
      .from('.hero-visual .float-card',{y:50,opacity:0,stagger:.1,duration:.8},'<.28')
      .from('.hero-visual .floating-badge',{scale:.2,opacity:0,stagger:.09,duration:.6,ease:'back.out(1.8)'},'<.25');

    const heroVisual = q('.hero-visual');
    if (heroVisual){
      gsap.to(heroVisual,{y:95,scale:.94,rotateX:3,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1.2}});
      gsap.to('.hero-copy',{y:58,opacity:.35,ease:'none',scrollTrigger:{trigger:'.hero',start:'35% top',end:'bottom top',scrub:1}});
      gsap.to('.profile-card',{y:-24,x:14,rotation:-5,duration:3.5,ease:'sine.inOut',repeat:-1,yoyo:true});
      gsap.to('.browser-card',{y:18,x:-10,rotation:3.5,duration:4.2,ease:'sine.inOut',repeat:-1,yoyo:true});
      gsap.to('.code-card',{y:-15,x:8,rotation:1,duration:3.2,ease:'sine.inOut',repeat:-1,yoyo:true});
      gsap.to('.badge-react',{y:-13,rotation:11,duration:2.6,ease:'sine.inOut',repeat:-1,yoyo:true});
      gsap.to('.badge-ui',{y:12,rotation:-8,duration:2.8,ease:'sine.inOut',repeat:-1,yoyo:true});
      gsap.to('.badge-ai',{x:9,y:-10,rotation:-12,duration:3.1,ease:'sine.inOut',repeat:-1,yoyo:true});
      setInterval(()=>heroVisual.classList.add('motion-sheen'),5000);
      heroVisual.addEventListener('animationend',e=>{if(e.animationName==='heroSheen')heroVisual.classList.remove('motion-sheen')});
    }

    qa('.section-head h2,.contact-copy h2').forEach(splitWords);
    qa('.section-head h2,.contact-copy h2').forEach(h => {
      const inners = qa('.split-word>span',h);
      gsap.from(inners,{yPercent:105,opacity:0,stagger:.025,duration:.72,ease:'power4.out',scrollTrigger:{trigger:h,start:'top 84%',once:true}});
    });

    qa('.section').forEach(section => {
      ScrollTrigger.create({trigger:section,start:'top 72%',once:true,onEnter:()=>section.classList.add('motion-inview')});
    });

    gsap.from('.about-photo-card',{clipPath:'inset(0 0 100% 0 round 28px)',y:45,duration:1.05,ease:'power4.out',scrollTrigger:{trigger:'.about-layout',start:'top 76%',once:true}});
    gsap.from('.about-photo-card img',{scale:1.16,duration:1.4,ease:'power3.out',scrollTrigger:{trigger:'.about-layout',start:'top 76%',once:true}});
    gsap.to('.about-photo-card img',{yPercent:7,ease:'none',scrollTrigger:{trigger:'.about-layout',start:'top bottom',end:'bottom top',scrub:1.1}});
    gsap.from('.about-content>p',{y:34,opacity:0,stagger:.13,duration:.75,scrollTrigger:{trigger:'.about-content',start:'top 76%',once:true}});
    gsap.from('.about-facts article',{y:38,opacity:0,scale:.96,stagger:.09,duration:.72,ease:'power3.out',scrollTrigger:{trigger:'.about-facts',start:'top 84%',once:true}});

    gsap.from('.service-card',{y:75,opacity:0,rotateX:8,stagger:.08,duration:.85,ease:'power4.out',scrollTrigger:{trigger:'.services-grid',start:'top 82%',once:true}});
    qa('.service-icon').forEach((icon,i)=>gsap.to(icon,{rotation:i%2?8:-8,y:i%2?-3:3,duration:2.6+i*.18,ease:'sine.inOut',repeat:-1,yoyo:true}));
    gsap.to('.service-mini-visual i',{x:(i)=>i%2?10:-8,y:(i)=>i*2,duration:2.7,stagger:.15,ease:'sine.inOut',repeat:-1,yoyo:true});

    const featured = q('.featured-project');
    if (featured){
      gsap.from(featured,{y:80,opacity:0,scale:.98,duration:1,scrollTrigger:{trigger:featured,start:'top 82%',once:true}});
      const tl = gsap.timeline({scrollTrigger:{trigger:featured,start:'top 78%',end:'bottom 28%',scrub:1.2}});
      tl.fromTo('.persona-window-main',{x:80,y:35,rotateY:-10,rotateZ:2},{x:-10,y:-10,rotateY:0,rotateZ:-1,ease:'none'},0)
        .fromTo('.persona-phone',{x:-45,y:65,rotation:-8},{x:8,y:-4,rotation:2,ease:'none'},0)
        .fromTo('.persona-bubble',{x:55,y:35,scale:.8},{x:-4,y:-16,scale:1.04,ease:'none'},0);
    }

    qa('.demo-card').forEach((card,i)=>{
      gsap.from(card,{y:75,opacity:0,rotateY:i%2?-6:6,duration:.9,ease:'power4.out',scrollTrigger:{trigger:card,start:'top 86%',once:true}});
      const visual=q('.demo-visual',card);
      if(visual)gsap.to(visual,{y:-18,ease:'none',scrollTrigger:{trigger:card,start:'top bottom',end:'bottom top',scrub:1.1}});
    });

    qa('.process-grid article').forEach((card,i)=>{
      gsap.from(card,{y:45,opacity:0,stagger:.1,duration:.7,scrollTrigger:{trigger:'.process-grid',start:'top 82%',once:true}});
      ScrollTrigger.create({trigger:card,start:'top 56%',end:'bottom 44%',onEnter:()=>card.classList.add('is-active'),onLeave:()=>card.classList.remove('is-active'),onEnterBack:()=>card.classList.add('is-active'),onLeaveBack:()=>card.classList.remove('is-active')});
    });
    ScrollTrigger.create({trigger:'.process-grid',start:'top 75%',end:'bottom 30%',scrub:true,onUpdate:self=>q('.process-grid')?.style.setProperty('--process-progress',self.progress.toFixed(3))});

    gsap.from('.price-card',{y:70,opacity:0,scale:.97,stagger:.1,duration:.8,ease:'power3.out',scrollTrigger:{trigger:'.pricing-grid',start:'top 84%',once:true}});
    gsap.from('.contact-copy>*',{y:36,opacity:0,stagger:.1,duration:.75,ease:'power3.out',scrollTrigger:{trigger:'.contact-grid',start:'top 80%',once:true}});
    gsap.from('.contact-card',{x:65,opacity:0,rotateY:-7,duration:.95,ease:'power4.out',scrollTrigger:{trigger:'.contact-grid',start:'top 80%',once:true}});

    ScrollTrigger.create({start:0,end:'max',onUpdate:self=>{
      const bar=q('.scroll-progress');
      if(bar)gsap.set(bar,{scaleX:self.progress});
    }});

    gsap.to('.motion-ambient.a',{x:-120,y:180,ease:'none',scrollTrigger:{start:0,end:'max',scrub:2}});
    gsap.to('.motion-ambient.b',{x:150,y:-130,ease:'none',scrollTrigger:{start:0,end:'max',scrub:2.5}});
  }

  function cardInteractions(){
    qa('.service-card,.demo-card,.price-card,.about-facts article,.featured-project').forEach(makeSpotlight);
    qa('.service-card,.demo-card,.price-card').forEach(el=>makeTilt(el,el.classList.contains('demo-card')?5:4,1.008));
    qa('.button,.nav-contact,.lang-toggle,.brand,.text-link').forEach(el=>magnetic(el,el.classList.contains('button')?16:10));
  }

  function smoothAnchors(){
    qa('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
      const id=a.getAttribute('href');
      if(!id||id==='#')return;
      const target=q(id);
      if(!target)return;
      if(gsap && !reduceMotion){
        e.preventDefault();
        const y=target.getBoundingClientRect().top+scrollY-92;
        window.scrollTo({top:y,behavior:'smooth'});
      }
    }));
  }

  injectChrome();
  const loader = injectLoader();
  splitHeroLines();
  pointerGlow();
  headerMotion();
  stackMarquee();
  cardInteractions();
  enhanceCursor();
  smoothAnchors();
  if (!gsap || !ScrollTrigger) nativeScrollProgress();
  gsapMotion(loader);
})();
