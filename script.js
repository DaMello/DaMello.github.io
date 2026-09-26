const personaFontLoader = document.createElement('script');
personaFontLoader.src = './font-loader.js?v=20260926';
personaFontLoader.async = true;
document.head.appendChild(personaFontLoader);

const translations = {
  en: {
    "nav.about":"About","nav.services":"Services","nav.work":"Work","nav.pricing":"Pricing","nav.contact":"Contact",
    "hero.open":"Open to remote work & freelance","hero.hi":"HI, I'M","hero.copy":"Front-end developer & web designer focused on fast, responsive and memorable digital experiences.","cta.start":"Start a project",
    "about.label":"About me","about.title":"I BUILD THINGS PEOPLE WANT TO USE.","about.lead":"I’m a front-end developer and web designer based in Brasília, Brazil. I turn ideas and product concepts into responsive interfaces with strong visual identity, smooth interactions and practical UX.","about.body1":"My work sits between development and design: HTML, CSS, JavaScript, React, responsive layouts, UI/UX and product thinking. I also use AI-assisted workflows to prototype, test and iterate faster without sacrificing quality.","about.body2":"I’m especially interested in remote projects, early-stage products and businesses that need a modern web presence.",
    "services.label":"Services","services.title":"WHAT I CAN BUILD FOR YOU.","services.s1t":"Landing Pages","services.s1d":"Focused pages for launches, products and campaigns — responsive, polished and built to convert.","services.s2t":"Business Websites","services.s2d":"Modern multi-page websites for small businesses, professionals and brands that need a stronger online presence.","services.s3t":"Front-end Development","services.s3d":"Interfaces and product screens built with clean HTML, CSS, JavaScript and React.","services.s4t":"UI/UX Implementation","services.s4d":"Turning Figma concepts and design systems into responsive, usable web interfaces.","services.s5t":"Maintenance & Optimization","services.s5d":"Fixes, visual polish, responsiveness, performance improvements and ongoing site updates.",
    "work.label":"Selected work","work.title":"PROJECTS & EXPERIMENTS.","work.persona":"A real product project focused on conversational experiences, responsive UI, product iteration and front-end development.","work.live":"Live project","work.demo1":"A conversion-focused commercial landing page concept. First portfolio demo.","work.demo2":"A clean product browsing and e-commerce interface concept for responsive screens.","work.demo3":"A SaaS dashboard concept showing component systems, hierarchy and application UI.","work.open":"Open demo",
    "pricing.label":"Pricing","pricing.title":"SIMPLE STARTING PRICES.","pricing.note":"Clear starting points for small projects. Final pricing depends on scope, content and complexity.","pricing.popular":"Popular","pricing.p1k":"LANDING PAGE","pricing.p1d":"One-page responsive website for a product, service or campaign.","pricing.p2k":"BUSINESS SITE","pricing.p2d":"A complete website for a small business, professional or brand.","pricing.p3k":"CUSTOM FRONT-END","pricing.p3d":"Custom interfaces, product screens or React-based front-end work.","pricing.p4k":"MAINTENANCE","pricing.p4d":"Ongoing fixes, content changes, small improvements and monitoring.","pricing.liResponsive":"Responsive design","pricing.liSections":"Up to 6 sections","pricing.liContact":"Contact / CTA integration","pricing.liPages":"Up to 5 pages","pricing.liBasicSeo":"Basic SEO setup","pricing.liComponents":"Reusable components","pricing.liInteraction":"Interactive UI","pricing.liGit":"Git-based delivery","pricing.liUpdates":"Monthly updates","pricing.liFixes":"Minor fixes","pricing.liSupport":"Priority support",
    "contact.label":"Contact","contact.title":"LET'S BUILD\nSOMETHING GOOD.","contact.copy":"Available for remote junior front-end opportunities, freelance websites and selected product work.","contact.email":"Email me"
  },
  pt: {
    "nav.about":"Sobre","nav.services":"Serviços","nav.work":"Projetos","nav.pricing":"Preços","nav.contact":"Contato",
    "hero.open":"Disponível para trabalho remoto e freelas","hero.hi":"OI, EU SOU","hero.copy":"Desenvolvedor front-end e web designer focado em experiências digitais rápidas, responsivas e marcantes.","cta.start":"Começar um projeto",
    "about.label":"Sobre mim","about.title":"EU CRIO COISAS QUE AS PESSOAS QUEREM USAR.","about.lead":"Sou desenvolvedor front-end e web designer de Brasília, Brasil. Transformo ideias e conceitos de produto em interfaces responsivas com identidade visual forte, interações fluidas e UX prática.","about.body1":"Meu trabalho fica entre desenvolvimento e design: HTML, CSS, JavaScript, React, layouts responsivos, UI/UX e visão de produto. Também uso fluxos com IA para prototipar, testar e iterar mais rápido sem sacrificar qualidade.","about.body2":"Tenho interesse especial em projetos remotos, produtos em estágio inicial e negócios que precisam de uma presença web moderna.",
    "services.label":"Serviços","services.title":"O QUE EU POSSO CRIAR PARA VOCÊ.","services.s1t":"Landing Pages","services.s1d":"Páginas focadas em lançamentos, produtos e campanhas — responsivas, bem acabadas e pensadas para conversão.","services.s2t":"Sites para negócios","services.s2d":"Sites modernos com várias páginas para pequenos negócios, profissionais e marcas que precisam melhorar sua presença online.","services.s3t":"Desenvolvimento Front-end","services.s3d":"Interfaces e telas de produto construídas com HTML, CSS, JavaScript e React.","services.s4t":"Implementação UI/UX","services.s4d":"Transformo conceitos do Figma e design systems em interfaces web responsivas e utilizáveis.","services.s5t":"Manutenção e otimização","services.s5d":"Correções, acabamento visual, responsividade, performance e atualizações contínuas no site.",
    "work.label":"Trabalhos selecionados","work.title":"PROJETOS & EXPERIMENTOS.","work.persona":"Um produto real focado em experiências conversacionais, UI responsiva, evolução de produto e desenvolvimento front-end.","work.live":"Abrir projeto","work.demo1":"Conceito de landing page comercial focada em conversão. Primeiro demo do portfólio.","work.demo2":"Conceito de interface de e-commerce e navegação de produtos para telas responsivas.","work.demo3":"Conceito de dashboard SaaS mostrando componentes, hierarquia e UI de aplicação.","work.open":"Abrir demo",
    "pricing.label":"Preços","pricing.title":"PREÇOS INICIAIS SIMPLES.","pricing.note":"Valores de partida para projetos pequenos. O preço final depende do escopo, conteúdo e complexidade.","pricing.popular":"Popular","pricing.p1k":"LANDING PAGE","pricing.p1d":"Site responsivo de uma página para produto, serviço ou campanha.","pricing.p2k":"SITE EMPRESARIAL","pricing.p2d":"Site completo para pequeno negócio, profissional ou marca.","pricing.p3k":"FRONT-END SOB MEDIDA","pricing.p3d":"Interfaces personalizadas, telas de produto ou trabalho front-end em React.","pricing.p4k":"MANUTENÇÃO","pricing.p4d":"Correções contínuas, alterações de conteúdo, pequenas melhorias e monitoramento.","pricing.liResponsive":"Design responsivo","pricing.liSections":"Até 6 seções","pricing.liContact":"Integração de contato / CTA","pricing.liPages":"Até 5 páginas","pricing.liBasicSeo":"Configuração básica de SEO","pricing.liComponents":"Componentes reutilizáveis","pricing.liInteraction":"UI interativa","pricing.liGit":"Entrega via Git","pricing.liUpdates":"Atualizações mensais","pricing.liFixes":"Pequenas correções","pricing.liSupport":"Suporte prioritário",
    "contact.label":"Contato","contact.title":"VAMOS CRIAR\nALGO BOM.","contact.copy":"Disponível para oportunidades remotas de front-end júnior, sites freelance e projetos selecionados de produto.","contact.email":"Me mande um e-mail"
  }
};

let language = localStorage.getItem('dm-lang') || 'en';
const toggle = document.getElementById('langToggle');

function applyLanguage(lang){
  language = lang;
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const value = translations[lang][key];
    if (!value) return;
    if (key === 'contact.title') el.innerHTML = value.replace('\n','<br>');
    else el.textContent = value;
  });
  toggle.textContent = lang === 'en' ? 'PT' : 'EN';
  toggle.setAttribute('aria-label', lang === 'en' ? 'Mudar para português' : 'Switch to English');
  localStorage.setItem('dm-lang', lang);
}
applyLanguage(language);
toggle.addEventListener('click', () => applyLanguage(language === 'en' ? 'pt' : 'en'));

const reveals = document.querySelectorAll('.reveal');
requestAnimationFrame(() => reveals.forEach((el, i) => setTimeout(() => el.classList.add('visible'), i * 110 + 80)));

const cursor = document.querySelector('.cursor');
if (window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.body.classList.add('cursor-ready');
  let tx = innerWidth/2, ty = innerHeight/2, x = tx, y = ty;
  addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  const animate = () => { x += (tx-x)*.18; y += (ty-y)*.18; cursor.style.left = `${x}px`; cursor.style.top = `${y}px`; requestAnimationFrame(animate); };
  animate();
  document.querySelectorAll('a,button').forEach(el => {
    el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-link'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-link'));
  });
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const a = document.querySelector('.hero-card-a');
  const b = document.querySelector('.hero-card-b');
  addEventListener('mousemove', e => {
    const px = (e.clientX / innerWidth - .5);
    const py = (e.clientY / innerHeight - .5);
    if (a) a.style.transform = `translate(${px*16}px,${py*12}px) rotate(7deg)`;
    if (b) b.style.transform = `translate(${px*-13}px,${py*-10}px) rotate(-7deg)`;
  }, {passive:true});
}
