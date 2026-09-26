(async () => {
  try {
    const urls = [0, 1, 2, 3].map(i => `./font-parts/${i}.txt?v=20260926`);
    const parts = await Promise.all(urls.map(async url => {
      const res = await fetch(url, { cache: 'force-cache' });
      if (!res.ok) throw new Error(`Font part failed: ${url}`);
      return (await res.text()).trim();
    }));

    const binary = atob(parts.join(''));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

    const blobUrl = URL.createObjectURL(new Blob([bytes], { type: 'font/woff2' }));
    const personaFont = new FontFace('PersonaFontRuntime', `url(${blobUrl}) format("woff2")`, {
      style: 'normal',
      weight: '400'
    });

    await personaFont.load();
    document.fonts.add(personaFont);
    document.documentElement.style.setProperty('--display-font', '"PersonaFontRuntime","Inter Tight","DM Sans",system-ui,sans-serif');
    document.documentElement.classList.add('persona-font-ready');
  } catch (error) {
    console.warn('Persona display font could not be loaded; using fallback.', error);
  }
})();
