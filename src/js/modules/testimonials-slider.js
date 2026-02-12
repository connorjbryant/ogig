// src/js/modules/testimonials-slider.js
export function initTestimonialsSlider() {
  const BP = 1024;
  const grids = document.querySelectorAll('.ogig-tm__grid');

  grids.forEach((grid) => {
    const section = grid.closest('.ogig-tm');
    if (!section) return;

    const autoplay = section.getAttribute('data-ogig-tm-autoplay') === '1';
    const interval = Math.max(
      2000,
      parseInt(section.getAttribute('data-ogig-tm-interval') || '4500', 10)
    );

    let timer = null;
    let userLock = false;
    let userLockTimer = null;

    const isMobile = () => window.innerWidth <= BP;
    const cards = () => Array.from(grid.querySelectorAll('.ogig-tm__card'));

    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    function lockUser(ms = 1500) {
      userLock = true;
      if (userLockTimer) clearTimeout(userLockTimer);
      userLockTimer = setTimeout(() => (userLock = false), ms);
    }

    function getGapPx() {
      const cs = window.getComputedStyle(grid);
      return parseFloat(cs.columnGap || cs.gap || '0') || 0;
    }

    function maxScroll() {
      return Math.max(0, grid.scrollWidth - grid.clientWidth);
    }

    function hasOverflow() {
      return maxScroll() > 2;
    }

    function stepSize() {
      // Mobile: page by viewport
      if (isMobile()) return grid.clientWidth;

      // Desktop: step by card+gap so arrows feel natural
      const first = cards()[0];
      if (!first) return grid.clientWidth;

      const w = Math.round(first.getBoundingClientRect().width);
      return Math.max(1, w + Math.round(getGapPx()));
    }

    function indexNow() {
      const step = stepSize();
      if (!step) return 0;
      return Math.round(grid.scrollLeft / step);
    }

    function scrollToIndex(idx, behavior = 'smooth') {
      const step = stepSize();
      const max = maxScroll();
      const left = Math.max(0, Math.min(idx * step, max));
      grid.scrollTo({ left, behavior });
    }

    function next() {
      const n = cards().length;
      if (n <= 1) return;

      const max = maxScroll();
      if (grid.scrollLeft >= max - 2) scrollToIndex(0);
      else scrollToIndex(indexNow() + 1);
    }

    function prev() {
      const n = cards().length;
      if (n <= 1) return;

      if (grid.scrollLeft <= 2) {
        const step = stepSize();
        const max = maxScroll();
        const lastIdx = step ? Math.floor(max / step) : 0;
        scrollToIndex(Math.max(0, lastIdx));
      } else {
        scrollToIndex(Math.max(0, indexNow() - 1));
      }
    }

    function applyCarouselState() {
      const n = cards().length;

      // Mobile is ALWAYS carousel
      if (isMobile()) {
        grid.classList.add('is-carousel');
        return;
      }

      // Desktop carousel should be based on COUNT (not overflow!)
      // If you want desktop carousel at 3+, change 4 -> 3
      if (n >= 4) grid.classList.add('is-carousel');
      else grid.classList.remove('is-carousel');
    }

    function ensureNav() {
      const n = cards().length;
      if (n <= 1) return;

      // Only show nav if:
      // - we're in carousel mode AND
      // - something is actually offscreen
      const show = grid.classList.contains('is-carousel') && hasOverflow();

      let nav = section.querySelector('.ogig-tm__nav');

      if (!show) {
        if (nav) nav.style.display = 'none';
        return;
      }

      if (!nav) {
        nav = document.createElement('div');
        nav.className = 'ogig-tm__nav';

        const btnPrev = document.createElement('button');
        btnPrev.type = 'button';
        btnPrev.className = 'ogig-tm__nav-btn ogig-tm__nav-btn--prev';
        btnPrev.setAttribute('aria-label', 'Previous testimonial');
        btnPrev.innerHTML = '‹';

        const btnNext = document.createElement('button');
        btnNext.type = 'button';
        btnNext.className = 'ogig-tm__nav-btn ogig-tm__nav-btn--next';
        btnNext.setAttribute('aria-label', 'Next testimonial');
        btnNext.innerHTML = '›';

        btnPrev.addEventListener('click', () => {
          lockUser(1200);
          stop();
          prev();
          start();
        });

        btnNext.addEventListener('click', () => {
          lockUser(1200);
          stop();
          next();
          start();
        });

        nav.appendChild(btnPrev);
        nav.appendChild(btnNext);
        grid.insertAdjacentElement('afterend', nav);
      }

      nav.classList.toggle('is-desktop', !isMobile());
      nav.style.display = '';
    }

    function start() {
      stop();

      // IMPORTANT: force carousel state FIRST (creates overflow)
      applyCarouselState();

      // Let layout settle so scrollWidth is accurate
      requestAnimationFrame(() => {
        ensureNav();

        if (!autoplay) return;
        if (!grid.classList.contains('is-carousel')) return;
        if (!hasOverflow()) return;
        if (cards().length <= 1) return;

        timer = setInterval(() => {
          if (userLock) return;
          next();
        }, interval);
      });
    }

    // Pause briefly when user interacts
    grid.addEventListener('touchstart', () => lockUser(2500), { passive: true });
    grid.addEventListener('pointerdown', () => lockUser(2000));
    grid.addEventListener('wheel', () => lockUser(1200), { passive: true });
    grid.addEventListener('scroll', () => lockUser(900), { passive: true });

    // Resize/layout changes
    window.addEventListener('resize', () => {
      stop();
      start();
    });

    // init (multiple passes for font/image/AOS layout settling)
    start();
    window.addEventListener('load', () => start(), { once: true });
    setTimeout(() => start(), 150);
  });
}