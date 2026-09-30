(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initAboutV5(){
    const section = document.querySelector('.intro-story');
    const intro = document.querySelector('.intro-sticky');
    const surface = document.querySelector('#identitySurface');
    const content = document.querySelector('#surfaceContent');
    const hero = document.querySelector('.hero-copy');
    const ribbon = document.querySelector('.skill-ribbon');
    const cue = document.querySelector('.scroll-cue');
    if(!section || !intro || !surface || !content) return;

    document.body.classList.add('about-v5-active');
    document.querySelectorAll('.persistent-dm').forEach(el => el.remove());
    document.querySelector('.about-stage-label')?.remove();

    let lockup = document.querySelector('.name-orbit-lockup');
    if(!lockup){
      lockup = document.createElement('div');
      lockup.className = 'name-orbit-lockup';
      lockup.setAttribute('aria-hidden','true');
      lockup.innerHTML = '<span>Davi</span><i></i><span>Mello</span>';
      intro.appendChild(lockup);
    }

    if(!window.gsap || !window.ScrollTrigger){
      surface.style.left = '5vw';
      surface.style.top = '18vh';
      surface.style.width = '90vw';
      surface.style.height = '72vh';
      content.style.opacity = '1';
      lockup.style.display = 'none';
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Remove only the old intro-story scroll controllers. Everything else stays untouched.
    ScrollTrigger.getAll().forEach(st => {
      if(st.trigger === section) st.kill(true);
    });
    gsap.killTweensOf([surface,content,hero,ribbon,cue,lockup]);

    const articles = surface.querySelectorAll('.capability-grid article');

    const setupDesktop = () => {
      gsap.set(hero,{clearProps:'transform,opacity'});
      gsap.set(ribbon,{clearProps:'transform,opacity'});
      gsap.set(cue,{clearProps:'transform,opacity'});
      gsap.set(lockup,{opacity:0,y:28,scale:.985});
      gsap.set(surface,{
        left:'50%',top:'116%',xPercent:-50,yPercent:-50,
        width:300,height:138,borderRadius:30,opacity:1
      });
      gsap.set(content,{opacity:0,y:34,scale:.985,filter:'blur(9px)'});
      gsap.set(articles,{opacity:0,y:18});

      const tl = gsap.timeline({
        scrollTrigger:{
          trigger:section,
          start:'top top',
          end:'bottom bottom',
          scrub:.8,
          invalidateOnRefresh:true
        }
      });

      tl.to(hero,{y:-82,opacity:0,ease:'none',duration:.14},.055)
        .to(ribbon,{y:24,opacity:0,ease:'none',duration:.12},.085)
        .to(cue,{opacity:0,ease:'none',duration:.07},.065)

        // Davi [moon] Mello
        .to(lockup,{opacity:1,y:0,scale:1,ease:'power3.out',duration:.17},.14)
        .to(lockup,{opacity:1,duration:.12},.28)

        // The About card rises from below while growing.
        .to(surface,{
          top:'50%',
          width:'86vw',
          height:'76vh',
          borderRadius:30,
          ease:'power3.inOut',
          duration:.34
        },.30)

        // Reveal content while the card is still growing, not afterward.
        .to(content,{
          opacity:1,
          y:0,
          scale:1,
          filter:'blur(0px)',
          ease:'power2.out',
          duration:.22
        },.38)
        .to(articles,{
          opacity:1,
          y:0,
          stagger:.024,
          ease:'power2.out',
          duration:.16
        },.41)

        // Let the name give way to the card as it arrives.
        .to(lockup,{opacity:0,y:-40,scale:.97,ease:'power2.in',duration:.13},.36)

        // Hold the fully revealed About card, then leave cleanly for the next section.
        .to({}, {duration:.24})
        .to(surface,{opacity:0,yPercent:-58,ease:'power2.in',duration:.12},.86);

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    };

    const setupMobile = () => {
      gsap.set(hero,{clearProps:'transform,opacity'});
      gsap.set(ribbon,{clearProps:'transform,opacity'});
      gsap.set(cue,{clearProps:'transform,opacity'});
      gsap.set(lockup,{opacity:0,y:20,scale:.99});
      gsap.set(surface,{
        left:'50%',top:'114%',xPercent:-50,yPercent:-50,
        width:'78vw',height:118,borderRadius:26,opacity:1
      });
      gsap.set(content,{opacity:0,y:28,scale:.99,filter:'blur(7px)'});
      gsap.set(articles,{opacity:0,y:14});

      const tl = gsap.timeline({
        scrollTrigger:{trigger:section,start:'top top',end:'bottom bottom',scrub:.7,invalidateOnRefresh:true}
      });
      tl.to(hero,{y:-54,opacity:0,ease:'none',duration:.14},.055)
        .to(ribbon,{y:18,opacity:0,ease:'none',duration:.11},.085)
        .to(cue,{opacity:0,ease:'none',duration:.06},.06)
        .to(lockup,{opacity:1,y:0,scale:1,ease:'power3.out',duration:.17},.14)
        .to(surface,{top:'51%',width:'92vw',height:'80vh',borderRadius:26,ease:'power3.inOut',duration:.36},.30)
        .to(content,{opacity:1,y:0,scale:1,filter:'blur(0px)',ease:'power2.out',duration:.22},.39)
        .to(articles,{opacity:1,y:0,stagger:.02,ease:'power2.out',duration:.14},.42)
        .to(lockup,{opacity:0,y:-30,scale:.97,ease:'power2.in',duration:.12},.36)
        .to({}, {duration:.24})
        .to(surface,{opacity:0,yPercent:-58,ease:'power2.in',duration:.12},.86);
      return () => { tl.scrollTrigger?.kill(); tl.kill(); };
    };

    if(reduceMotion){
      gsap.set(lockup,{display:'none'});
      gsap.set(surface,{left:'50%',top:'52%',xPercent:-50,yPercent:-50,width:'92vw',height:'78vh',opacity:1});
      gsap.set(content,{opacity:1,y:0,filter:'none'});
      gsap.set(articles,{opacity:1,y:0});
      return;
    }

    const mm = gsap.matchMedia();
    mm.add('(min-width: 761px)',setupDesktop);
    mm.add('(max-width: 760px)',setupMobile);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',initAboutV5,{once:true});
  else initAboutV5();
})();