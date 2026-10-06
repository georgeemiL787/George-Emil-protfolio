/* Dependency-free motion with a static fallback and an explicit pause control. */
(() => {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.querySelector('.motion-toggle');
  let manuallyPaused = false;
  try { manuallyPaused = localStorage.getItem('portfolio-motion') === 'paused'; } catch { /* Optional storage. */ }
  let paused = media.matches || manuallyPaused;
  let frame = 0;
  let lastTime = 0;
  let elapsed = 0;
  let visible = false;
  let accent = '';
  const visual = document.querySelector('.hero-visual');
  const canvas = visual.querySelector('canvas');
  const context = canvas.getContext('2d');
  const pointer = { x:0, y:0, targetX:0, targetY:0 };
  let size = 0;

  function setMotion() {
    paused = media.matches || manuallyPaused;
    document.body.classList.toggle('motion-paused', paused);
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', media.matches ? 'Animations disabled by reduced motion preference' : paused ? 'Play animations' : 'Pause animations');
    toggle.innerHTML = `<span aria-hidden="true">${paused ? '▷' : 'Ⅱ'}</span> ${media.matches ? 'Reduced motion' : paused ? 'Motion off' : 'Motion on'}`;
    toggle.disabled = media.matches;
    if (paused) {
      document.querySelectorAll('.reveal-ready').forEach(element => element.classList.add('in-view'));
      document.getAnimations().forEach(animation => {
        if (animation.id === 'project-filter') animation.cancel();
      });
    }
    syncLoop();
  }
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    manuallyPaused = !manuallyPaused;
    try { localStorage.setItem('portfolio-motion', manuallyPaused ? 'paused' : 'playing'); } catch { /* Optional storage. */ }
    setMotion();
  });
  media.addEventListener('change', setMotion);

  // Reveal small pieces rather than whole sections, which can exceed the viewport.
  const revealElements = document.querySelectorAll('.section-heading, .project-card, .portrait-frame, .about-copy, .skill-group, .training-card, .contact-layout');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold:0, rootMargin:'0px 0px -25px 0px' });
  revealElements.forEach((element, index) => {
    element.style.setProperty('--reveal-delay', `${index % 3 * 70}ms`);
    element.classList.add('reveal-ready');
    if (paused) element.classList.add('in-view');
    else revealObserver.observe(element);
  });

  document.querySelectorAll('.project-filters button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.project-card:not([hidden])').forEach((card, index) => {
        card.classList.add('in-view');
        if (paused) return;
        card.getAnimations().filter(animation => animation.id === 'project-filter').forEach(animation => animation.cancel());
        card.animate([{ opacity:0, transform:'translateY(22px) scale(.98)' }, { opacity:1, transform:'none' }], {
          duration:450, delay:Math.min(index, 5) * 55, easing:'cubic-bezier(.16,1,.3,1)', fill:'backwards', id:'project-filter'
        });
      });
    });
  });

  document.querySelectorAll('.project-art').forEach(art => {
    art.addEventListener('pointermove', event => {
      if (paused || event.pointerType !== 'mouse') return;
      const box = art.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width;
      const y = (event.clientY - box.top) / box.height;
      art.style.setProperty('--pointer-x', `${x * 100}%`);
      art.style.setProperty('--pointer-y', `${y * 100}%`);
      art.style.setProperty('--tilt-x', `${(y - .5) * -14}deg`);
      art.style.setProperty('--tilt-y', `${(x - .5) * 14}deg`);
    });
    art.addEventListener('pointerleave', () => {
      art.style.setProperty('--tilt-x', '0deg');
      art.style.setProperty('--tilt-y', '0deg');
    });
  });

  // Fibonacci sphere: rotating nodes, local connections, and a traveling wave.
  const nodes = Array.from({ length:210 }, (_, i) => {
    const y = 1 - i / 209 * 2;
    const radius = Math.sqrt(1 - y * y);
    const angle = i * Math.PI * (3 - Math.sqrt(5));
    return { x:Math.cos(angle) * radius, y, z:Math.sin(angle) * radius };
  });
  const edges = [];
  nodes.forEach((a, i) => {
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      if (Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z) < .31) edges.push([i, j]);
    }
  });
  function draw() {
    if (!context || !size) return;
    context.clearRect(0, 0, size, size);
    const angle = elapsed * .32 + pointer.x;
    const tilt = -.22 + pointer.y;
    const cos = Math.cos(angle), sin = Math.sin(angle);
    const ct = Math.cos(tilt), st = Math.sin(tilt);
    const points = nodes.map((node, i) => {
      const wave = 1 + Math.sin(elapsed * 1.5 + node.y * 4) * .045;
      const x = node.x * cos + node.z * sin;
      const z = node.z * cos - node.x * sin;
      const y = node.y * ct - z * st;
      const depth = node.y * st + z * ct;
      const scale = 2.8 / (2.8 - depth * .4);
      return { x:size / 2 + x * size * .32 * scale * wave, y:size / 2 + y * size * .32 * scale * wave, z:depth, index:i };
    });
    context.strokeStyle = accent;
    context.lineWidth = .7;
    edges.forEach(([a, b]) => {
      const p = points[a], q = points[b];
      context.globalAlpha = .08 + ((p.z + q.z + 2) / 4) * .35;
      context.beginPath(); context.moveTo(p.x, p.y); context.lineTo(q.x, q.y); context.stroke();
    });
    points.sort((a, b) => a.z - b.z).forEach(point => {
      context.globalAlpha = .25 + (point.z + 1) * .375;
      context.fillStyle = point.index % 11 === 0 ? '#b59df0' : accent;
      const pulse = Math.sin(elapsed * 2 - point.index * .16) > .9;
      context.beginPath(); context.arc(point.x, point.y, (point.z + 1.5) * .9 + (pulse ? 1.2 : 0), 0, Math.PI * 2); context.fill();
    });
    context.globalAlpha = 1;
  }
  function tick(time) {
    frame = 0;
    elapsed += lastTime ? Math.min((time - lastTime) / 1000, .05) : 0;
    lastTime = time;
    pointer.x += (pointer.targetX - pointer.x) * .055;
    pointer.y += (pointer.targetY - pointer.y) * .055;
    draw();
    frame = requestAnimationFrame(tick);
  }
  function syncLoop() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    if (context && visible && !paused && !document.hidden) frame = requestAnimationFrame(tick);
    else draw();
  }
  function resize() {
    size = visual.clientWidth;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(size * ratio);
    canvas.height = Math.round(size * ratio);
    context?.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  }
  function refreshColor() {
    accent = getComputedStyle(document.body).getPropertyValue('--accent').trim();
    draw();
  }
  if (context) {
    refreshColor();
    resize();
    visual.classList.add('canvas-ready');
    new ResizeObserver(resize).observe(visual);
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; syncLoop(); }).observe(visual);
    document.getElementById('dark-mode-toggle').addEventListener('click', refreshColor);
    visual.addEventListener('pointermove', event => {
      if (paused || event.pointerType !== 'mouse') return;
      const rect = visual.getBoundingClientRect();
      pointer.targetX = ((event.clientX - rect.left) / rect.width - .5) * 1.5;
      pointer.targetY = ((event.clientY - rect.top) / rect.height - .5) * .7;
    });
    visual.addEventListener('pointerleave', () => { pointer.targetX = 0; pointer.targetY = 0; });
    document.addEventListener('visibilitychange', syncLoop);
  }
  const progress = document.querySelector('.scroll-progress');
  function updateProgress() {
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${distance > 0 ? window.scrollY / distance : 0})`;
  }
  window.addEventListener('scroll', updateProgress, { passive:true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
  setMotion();
})();
