(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer:fine)').matches;
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const q = (s,r=document)=>r.querySelector(s);
  const qa = (s,r=document)=>[...r.querySelectorAll(s)];

  function addLoader(){
    if (reduceMotion) return null;
    const loader=document.createElement('div');
    loader.className='dm-loader';
    loader.innerHTML='<div class="dm-loader-inner"><div class="dm-loader-orbit"></div><strong class="dm-loader-mark">DM</strong><span class="dm-loader-copy">DESIGN · CODE · MOTION</span><div class="dm-loader-line"><i></i></div></div>';
    document.body.appendChild(loader);
    return loader;
  }

  function progress(){
    const bar=q('.page-progress i');
    const update=()=>{
      const max=document.documentElement.scrollHeight-innerHeight;
      const p=max>0?scrollY/max:0;
      if(bar)bar.style.transform=`scaleX(${Math.max(0,Math.min(1,p))})`;
      document.documentElement.style.setProperty('--scroll-p',p.toFixed(4));
    };
    addEventListener('scroll',update,{passive:true});
    addEventListener('resize',update,{passive:true});
    update();
  }

  function cursor(){
    const el=q('.cursor');
    if(!el||!finePointer||reduceMotion)return;
    document.body.classList.add('cursor-ready');
    let tx=innerWidth/2,ty=innerHeight/2,x=tx,y=ty;
    addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;document.documentElement.style.setProperty('--mouse-x',`${e.clientX}px`);document.documentElement.style.setProperty('--mouse-y',`${e.clientY}px`)},{passive:true});
    const loop=()=>{x+=(tx-x)*.22;y+=(ty-y)*.22;el.style.left=`${x}px`;el.style.top=`${y}px`;requestAnimationFrame(loop)};loop();
    qa('a,button,.lab-card,.work-card,.price-card,.capability-list article').forEach(node=>{
      node.addEventListener('pointerenter',()=>el.classList.add('is-link'));
      node.addEventListener('pointerleave',()=>el.classList.remove('is-link'));
    });
    addEventListener('pointerdown',()=>el.classList.add('is-press'));
    addEventListener('pointerup',()=>el.classList.remove('is-press'));
  }

  function pointerMaterials(){
    if(!finePointer||reduceMotion)return;
    qa('.lab-card,.work-card,.price-card').forEach(el=>{
      el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.setProperty('--spot-x',`${e.clientX-r.left}px`);el.style.setProperty('--spot-y',`${e.clientY-r.top}px`)},{passive:true});
    });
    const room=q('.hero-room');
    if(room){
      room.addEventListener('pointermove',e=>{
        const px=e.clientX/innerWidth-.5,py=e.clientY/innerHeight-.5;
        if(gsap){
          gsap.to('.studio-svg',{x:px*-22,y:py*-14,duration:1.2,ease:'power3.out'});
          gsap.to('.shape-a',{x:px*34,y:py*22,duration:1,ease:'power3.out'});
          gsap.to('.shape-b',{x:px*-25,y:py*-18,duration:1.2,ease:'power3.out'});
          gsap.to('.shape-c',{x:px*48,y:py*-28,duration:1.1,ease:'power3.out'});
          gsap.to('.ui-float-a',{x:px*-30,y:py*20,duration:1.1,ease:'power3.out'});
          gsap.to('.ui-float-b',{x:px*25,y:py*-16,duration:1.15,ease:'power3.out'});
        }
      },{passive:true});
    }
  }

  function magnetic(){
    if(!finePointer||reduceMotion||!gsap)return;
    qa('.magnetic').forEach(el=>{
      el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)/r.width;const y=(e.clientY-r.top-r.height/2)/r.height;gsap.to(el,{x:x*20,y:y*14,duration:.35,ease:'power3.out'})});
      el.addEventListener('pointerleave',()=>gsap.to(el,{x:0,y:0,duration:.7,ease:'elastic.out(1,.45)'}));
    });
  }

  function tilt(){
    if(!finePointer||reduceMotion||!gsap)return;
    qa('.lab-card,.price-card').forEach((el,i)=>{
      el.classList.add('tilt');
      el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;gsap.to(el,{rotateY:x*(i%2?5:-5),rotateX:-y*4,scale:1.006,duration:.5,ease:'power3.out',transformPerspective:1100})});
      el.addEventListener('pointerleave',()=>gsap.to(el,{rotateY:0,rotateX:0,scale:1,duration:.75,ease:'power3.out'}));
    });
  }

  function header(){
    const h=q('.site-header');if(!h)return;
    let last=scrollY;
    const update=()=>{const y=scrollY;if(y>200&&y>last+6)h.classList.add('is-hidden');if(y<last-5||y<120)h.classList.remove('is-hidden');last=y};
    addEventListener('scroll',update,{passive:true});
  }

  function geometryLengths(){
    qa('.draw-lines path,.draw-lines rect,.draw-lines circle').forEach(el=>{
      try{const l=el.getTotalLength();el.style.setProperty('--path-length',`${l}`);el.style.strokeDasharray=l;el.style.strokeDashoffset=l}catch{}
    });
  }

  function fallback(){
    geometryLengths();
    qa('.draw-lines path,.draw-lines rect,.draw-lines circle').forEach(el=>el.style.strokeDashoffset=0);
    qa('.hero-enter').forEach(el=>{el.style.opacity=1;el.style.transform='none'});
  }

  function choreograph(loader){
    if(!gsap||!ScrollTrigger||reduceMotion){fallback();return}
    gsap.registerPlugin(ScrollTrigger);
    gsap.config({nullTargetWarn:false});
    geometryLengths();

    // Intro: short enough to feel premium, not like a splash screen tax.
    const intro=gsap.timeline({defaults:{ease:'power4.out'}});
    if(loader){
      intro.to('.dm-loader-line i',{x:'0%',duration:.45,ease:'power2.inOut'})
        .from('.dm-loader-mark',{y:75,opacity:0,rotateX:-38,duration:.72},0)
        .from('.dm-loader-copy',{y:14,opacity:0,duration:.45},.16)
        .to('.dm-loader-orbit',{rotation:125,scale:1.08,duration:.85,ease:'power2.inOut'},.1)
        .to(loader,{yPercent:-102,duration:.82,ease:'power4.inOut'},.65)
        .set(loader,{display:'none'});
    }
    const start=loader?.95||0;
    intro.from('.site-header',{y:-34,opacity:0,duration:.65},start)
      .from('.hero-tag',{y:18,opacity:0,duration:.5},'<.05')
      .from('.hero-title .hero-line',{yPercent:105,opacity:0,rotateX:-18,stagger:.11,duration:.9},'<.04')
      .from('.hero-copy',{y:28,opacity:0,duration:.62},'<.22')
      .from('.hero-bottom>*',{y:24,opacity:0,stagger:.09,duration:.55},'<.08')
      .from('.scroll-cue',{x:-18,opacity:0,duration:.5},'<.05');

    intro.to('.draw-lines path,.draw-lines rect,.draw-lines circle',{strokeDashoffset:0,duration:1.45,stagger:{each:.006,from:'random'},ease:'power2.inOut'},start+.15)
      .from('.shape',{scale:0,opacity:0,rotation:-45,stagger:.08,duration:.7,ease:'back.out(1.8)'},start+.52)
      .from('.pointer',{scale:.3,opacity:0,stagger:.12,duration:.55,ease:'back.out(2)'},start+.7)
      .from('.ui-float',{y:35,opacity:0,scale:.9,stagger:.1,duration:.7},start+.72);

    // Hero decomposes into depth as the next section arrives.
    gsap.to('.hero-content',{y:90,opacity:.25,ease:'none',scrollTrigger:{trigger:'.hero',start:'35% top',end:'bottom top',scrub:1}});
    gsap.to('.studio-svg',{y:110,scale:1.045,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1.1}});
    gsap.to('.shape-a',{y:-140,x:40,rotation:80,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1.3}});
    gsap.to('.shape-c',{y:-210,x:-60,rotation:140,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});

    // Dark header states.
    ['.proof-section','.persona-case','.contact-section'].forEach(sel=>{
      ScrollTrigger.create({trigger:sel,start:'top 70px',end:'bottom 70px',onEnter:()=>q('.site-header')?.classList.add('is-dark'),onEnterBack:()=>q('.site-header')?.classList.add('is-dark'),onLeave:()=>q('.site-header')?.classList.remove('is-dark'),onLeaveBack:()=>q('.site-header')?.classList.remove('is-dark')});
    });

    // Proof section.
    gsap.from('.proof-intro .eyebrow',{y:18,opacity:0,duration:.55,scrollTrigger:{trigger:'.proof-intro',start:'top 82%',once:true}});
    gsap.from('.proof-intro .display-title>*',{y:70,opacity:0,stagger:.09,duration:.9,ease:'power4.out',scrollTrigger:{trigger:'.proof-intro',start:'top 78%',once:true}});
    gsap.from('.proof-intro .section-copy',{y:35,opacity:0,duration:.65,scrollTrigger:{trigger:'.proof-intro',start:'top 70%',once:true}});
    gsap.from('.lab-shell',{y:100,opacity:0,scale:.965,rotateX:6,duration:1.05,ease:'power4.out',scrollTrigger:{trigger:'.lab-shell',start:'top 88%',once:true}});
    gsap.from('.lab-card',{y:45,opacity:0,stagger:.09,duration:.72,scrollTrigger:{trigger:'.lab-grid',start:'top 82%',once:true}});
    gsap.to('.mini-browser',{y:-10,rotateX:2,duration:3.8,ease:'sine.inOut',repeat:-1,yoyo:true});
    qa('.field-orb').forEach((orb,i)=>gsap.to(orb,{y:i%2?-12:14,x:i%2?9:-7,duration:2.7+i*.37,ease:'sine.inOut',repeat:-1,yoyo:true}));

    // Persona scrollytelling.
    const sceneNames=['DISCOVER','CHAT','WORLDS'];
    const sceneNumber=q('#sceneNumber'),sceneName=q('#sceneName');
    const steps=qa('.persona-steps span');
    const scenes=[q('.scene-discover'),q('.scene-chat'),q('.scene-world')];
    const personaTl=gsap.timeline({scrollTrigger:{trigger:'.persona-case',start:'top top',end:'bottom bottom',scrub:1.15,onUpdate:self=>{
      const idx=Math.min(2,Math.floor(self.progress*3));
      if(sceneNumber)sceneNumber.textContent=`0${idx+1}`;
      if(sceneName)sceneName.textContent=sceneNames[idx];
      steps.forEach((s,i)=>s.classList.toggle('active',i===idx));
      scenes.forEach((s,i)=>{if(!s)return;const active=i===idx;s.style.visibility=active?'visible':'hidden';s.style.pointerEvents=active?'auto':'none'});
    }}});
    personaTl.fromTo('.persona-desktop',{x:100,rotateY:-10,scale:.93},{x:0,rotateY:0,scale:1,duration:.28,ease:'none'},0)
      .fromTo('.persona-phone',{x:-90,y:100,rotation:-12,scale:.82},{x:0,y:0,rotation:2,scale:1,duration:.28,ease:'none'},0)
      .fromTo('.persona-quote',{x:80,y:60,opacity:0},{x:0,y:0,opacity:1,duration:.24,ease:'none'},.08)
      .to('.scene-discover',{opacity:0,y:-25,scale:.97,duration:.10,ease:'none'},.28)
      .fromTo('.scene-chat',{opacity:0,y:28,scale:.98},{opacity:1,y:0,scale:1,duration:.10,ease:'none'},.31)
      .to('.persona-desktop',{rotateY:4,x:-28,duration:.12,ease:'none'},.32)
      .to('.persona-phone',{x:56,y:-28,rotation:-4,duration:.12,ease:'none'},.32)
      .to('.scene-chat',{opacity:0,x:-24,scale:.97,duration:.10,ease:'none'},.61)
      .fromTo('.scene-world',{opacity:0,x:30,scale:.98},{opacity:1,x:0,scale:1,duration:.10,ease:'none'},.64)
      .to('.persona-desktop',{rotateY:-4,x:18,scale:1.025,duration:.14,ease:'none'},.65)
      .to('.persona-phone',{x:-6,y:10,rotation:5,duration:.14,ease:'none'},.65)
      .to('.persona-quote',{scale:1.08,x:-20,duration:.16,ease:'none'},.68)
      .to('.persona-stage',{y:-26,duration:.2,ease:'none'},.8);

    // Horizontal work track. The whole section becomes a timeline.
    const track=q('#workTrack');
    if(track){
      const getDistance=()=>Math.max(0,track.scrollWidth-innerWidth+60);
      gsap.to(track,{x:()=>-getDistance(),ease:'none',scrollTrigger:{trigger:'.horizontal-wrap',start:'top top',end:'bottom bottom',scrub:1.05,invalidateOnRefresh:true}});
      qa('.work-card').forEach((card,i)=>{
        const visual=q('.work-visual',card)||q('.next-orbit',card);
        if(visual)gsap.fromTo(visual,{scale:.92,rotateY:i%2?4:-4},{scale:1.03,rotateY:0,ease:'none',scrollTrigger:{trigger:card,containerAnimation:null,start:'left 85%',end:'right 15%',scrub:1}});
      });
    }

    // About / capability choreography.
    gsap.from('.about-photo',{clipPath:'inset(100% 0 0 0 round 28px)',y:60,rotation:-8,duration:1.1,ease:'power4.out',scrollTrigger:{trigger:'.about-grid',start:'top 78%',once:true}});
    gsap.from('.about-badge',{scale:0,rotation:-40,duration:.8,ease:'back.out(1.8)',scrollTrigger:{trigger:'.about-grid',start:'top 72%',once:true}});
    gsap.to('.about-photo img',{yPercent:8,scale:1.05,ease:'none',scrollTrigger:{trigger:'.about-section',start:'top bottom',end:'bottom top',scrub:1}});
    gsap.to('.about-badge',{rotation:26,y:-45,ease:'none',scrollTrigger:{trigger:'.about-section',start:'top bottom',end:'bottom top',scrub:1.2}});
    gsap.from('.about-copy-block .display-title>*',{y:65,opacity:0,stagger:.08,duration:.85,ease:'power4.out',scrollTrigger:{trigger:'.about-copy-block',start:'top 80%',once:true}});
    gsap.from('.capability-list article',{x:50,opacity:0,stagger:.09,duration:.7,ease:'power3.out',scrollTrigger:{trigger:'.capability-list',start:'top 82%',once:true}});

    // Pricing and contact.
    gsap.from('.pricing-head .display-title>*',{y:60,opacity:0,stagger:.08,duration:.85,ease:'power4.out',scrollTrigger:{trigger:'.pricing-head',start:'top 82%',once:true}});
    gsap.from('.price-card',{y:75,opacity:0,rotateX:8,stagger:.1,duration:.85,ease:'power4.out',scrollTrigger:{trigger:'.pricing-grid',start:'top 86%',once:true}});
    gsap.from('.contact-inner h2>*',{y:70,opacity:0,stagger:.1,duration:.9,ease:'power4.out',scrollTrigger:{trigger:'.contact-inner',start:'top 76%',once:true}});
    gsap.from('.contact-inner>p,.contact-email,.contact-meta',{y:36,opacity:0,stagger:.1,duration:.68,scrollTrigger:{trigger:'.contact-inner',start:'top 64%',once:true}});
    gsap.to('.orbit-one',{rotation:80,scale:1.08,ease:'none',scrollTrigger:{trigger:'.contact-section',start:'top bottom',end:'bottom bottom',scrub:1}});
    gsap.to('.orbit-two',{rotation:-110,scale:.92,ease:'none',scrollTrigger:{trigger:'.contact-section',start:'top bottom',end:'bottom bottom',scrub:1.2}});

    // General section title entrances.
    qa('.work-heading,.about-copy-block,.pricing-head').forEach(section=>{
      const eye=q('.eyebrow',section);if(eye)gsap.from(eye,{y:16,opacity:0,duration:.5,scrollTrigger:{trigger:section,start:'top 85%',once:true}})
    });

    setTimeout(()=>ScrollTrigger.refresh(),150);
  }

  progress();cursor();pointerMaterials();magnetic();tilt();header();
  const loader=addLoader();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>choreograph(loader));else choreograph(loader);
})();
