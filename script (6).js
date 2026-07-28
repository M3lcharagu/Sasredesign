  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, {threshold:0.15});
  revealEls.forEach(el=>io.observe(el));

  // Header background shift on scroll (transparent over the slideshow, solid once scrolled)
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', ()=>{
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  });

  // Mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  const navBackdrop = document.getElementById('nav-backdrop');

  function closeNav(){
    if(navToggle) navToggle.classList.remove('is-active');
    if(mainNav) mainNav.classList.remove('is-open');
    if(navBackdrop) navBackdrop.classList.remove('is-open');
    document.body.classList.remove('nav-locked');
    if(navToggle) navToggle.setAttribute('aria-expanded', 'false');
  }
  function openNav(){
    if(navToggle) navToggle.classList.add('is-active');
    if(mainNav) mainNav.classList.add('is-open');
    if(navBackdrop) navBackdrop.classList.add('is-open');
    document.body.classList.add('nav-locked');
    if(navToggle) navToggle.setAttribute('aria-expanded', 'true');
  }
  if(navToggle && mainNav){
    navToggle.addEventListener('click', ()=>{
      mainNav.classList.contains('is-open') ? closeNav() : openNav();
    });
    mainNav.querySelectorAll('a').forEach(a=>a.addEventListener('click', closeNav));
  }
  if(navBackdrop){
    navBackdrop.addEventListener('click', closeNav);
  }
  window.addEventListener('resize', ()=>{
    if(window.innerWidth > 960) closeNav();
  });

  // Slideshow: auto-advance through the 4 photos, with manual dot navigation
  const slides = document.querySelectorAll('.slideshow .slide');
  const dots = document.querySelectorAll('.slideshow-dots .dot');
  let currentSlide = 0;
  let slideTimer;

  function goToSlide(index){
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }
  function nextSlide(){
    goToSlide((currentSlide + 1) % slides.length);
  }
  function startSlideTimer(){
    clearInterval(slideTimer);
    slideTimer = setInterval(nextSlide, 5000);
  }
  if(slides.length){
    startSlideTimer();
    dots.forEach((dot, i)=>{
      dot.addEventListener('click', ()=>{
        goToSlide(i);
        startSlideTimer();
      });
    });
  }

  // Blueprint spec panel interactivity
  const specItems = document.querySelectorAll('.spec-item');
  const svgTargets = {
    'stringer-1': document.getElementById('stringer-1'),
    'stringer-2': document.getElementById('stringer-2'),
    'stringer-3': document.getElementById('stringer-3'),
    'ht-stamp': document.getElementById('ht-stamp'),
    'deck-boards': document.getElementById('deck-boards'),
  };
  function clearHighlights(){
    Object.values(svgTargets).forEach(el=>{
      if(el) el.style.filter = 'none';
    });
  }
  specItems.forEach(item=>{
    item.addEventListener('click', ()=>{
      specItems.forEach(i=>i.classList.remove('active'));
      item.classList.add('active');
      clearHighlights();
      const ids = item.dataset.target.split(' ');
      ids.forEach(id=>{
        const el = svgTargets[id];
        if(el) el.style.filter = 'drop-shadow(0 0 6px #B08968)';
      });
    });
  });

  // Product tabs
  const tabButtons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.product-panel');
  tabButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      tabButtons.forEach(b=>b.classList.remove('active'));
      panels.forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');
      document.querySelector(`.product-panel[data-panel="${btn.dataset.tab}"]`).classList.add('active');
    });
  });

(function(){
  const root        = document.getElementById('heroSlideshow');
  const slides       = Array.from(root.querySelectorAll('.slide'));
  const dotsWrap      = document.getElementById('heroDots');
  const prevBtn        = document.getElementById('prevBtn');
  const nextBtn        = document.getElementById('nextBtn');
  const indexLabel     = document.getElementById('heroIndexCurrent');
  const SLIDE_DURATION = 6000; // ms each slide is shown

  root.style.setProperty('--slide-duration', (SLIDE_DURATION / 1000) + 's');

  let current = 0;
  let timer = null;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'hero-dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', () => goTo(i, true));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function render(){
    slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
    indexLabel.textContent = String(current + 1).padStart(2, '0');
  }

  function goTo(i, userInitiated){
    current = (i + slides.length) % slides.length;
    render();
    if (userInitiated) restartTimer();
  }

  function next(){ goTo(current + 1); }
  function prev(){ goTo(current - 1); }

  function restartTimer(){
    clearInterval(timer);
    timer = setInterval(next, SLIDE_DURATION);
  }

  nextBtn.addEventListener('click', () => goTo(current + 1, true));
  prevBtn.addEventListener('click', () => goTo(current - 1, true));

  // Pause on hover / focus, resume on leave
  root.addEventListener('mouseenter', () => clearInterval(timer));
  root.addEventListener('mouseleave', restartTimer);
  root.addEventListener('focusin', () => clearInterval(timer));
  root.addEventListener('focusout', restartTimer);

  // Keyboard navigation
  root.setAttribute('tabindex', '0');
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goTo(current + 1, true);
    if (e.key === 'ArrowLeft') goTo(current - 1, true);
  });

  render();
  restartTimer();
})();