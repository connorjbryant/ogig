// src/js/modules/header.js

export function initHeader($) {
  const $html = $('html');
  const $body = $('body');

  const $header = $('.site-header');
  const $nav = $('nav.main-navigation.mobile-menu');
  const $hamburger = $('.mobile-hamburger');
  const $overlay = $('.site-overlay');

  if (!$header.length || !$nav.length || !$hamburger.length) return;

  const BP = 1024;
  const mqMobile = window.matchMedia(`(max-width: ${BP}px)`);

  // -----------------------------
  // Helpers
  // -----------------------------
  function setHeaderVars() {
    // Measure *actual* header height (topbar may be hidden on mobile)
    const h = $header.outerHeight() || 0;
    document.documentElement.style.setProperty('--header-h', `${h}px`);

    // Body offset for fixed header
    $body.addClass('has-fixed-header');
  }

  function openMobileMenu() {
    $nav.addClass('active');
    $hamburger.attr('aria-expanded', 'true');
    $html.addClass('menu-open');
  }

  function closeMobileMenu() {
    $nav.removeClass('active');
    $hamburger.attr('aria-expanded', 'false');
    $html.removeClass('menu-open');

    // collapse any open submenus on close
    $nav.find('.sub-open').removeClass('sub-open');
  }

  function isMobile() {
    return mqMobile.matches;
  }

  // Debounce resize work
  let resizeTimer = null;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setHeaderVars();

      // If we crossed into desktop, hard-reset mobile state so it can’t “stick”
      if (!isMobile()) {
        closeMobileMenu();
      }
    }, 60);
  }

  // -----------------------------
  // Init header height var
  // -----------------------------
  setHeaderVars();
  $(window).on('load', setHeaderVars);
  $(window).on('resize orientationchange', onResize);

  // If matchMedia fires (more reliable than resize for some browsers)
  if (mqMobile.addEventListener) {
    mqMobile.addEventListener('change', () => {
      setHeaderVars();
      if (!isMobile()) closeMobileMenu();
    });
  } else {
    mqMobile.addListener(() => {
      setHeaderVars();
      if (!isMobile()) closeMobileMenu();
    });
  }

  // -----------------------------
  // Hamburger toggle
  // -----------------------------
  $hamburger.on('click', function (e) {
    e.preventDefault();

    // Always update height before opening
    setHeaderVars();

    const expanded = $(this).attr('aria-expanded') === 'true';
    if (expanded) closeMobileMenu();
    else openMobileMenu();
  });

  // Overlay click closes
  $overlay.on('click', function () {
    closeMobileMenu();
  });

  // Escape closes
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') closeMobileMenu();
  });

  // -----------------------------
  // Mobile submenu toggles
  // - Tap parent item toggles submenu (instead of navigating)
  // - Desktop keeps hover behavior (CSS)
  // -----------------------------
  $nav.on('click', '.menu-item-has-children > a', function (e) {
    if (!isMobile()) return;

    const $li = $(this).parent('li');

    // Toggle this submenu
    e.preventDefault();
    $li.toggleClass('sub-open');
  });

  // -----------------------------
  // Close menu when clicking a normal link (mobile only)
  // -----------------------------
  $nav.on('click', 'a', function () {
    if (!isMobile()) return;

    const $a = $(this);
    const $li = $a.closest('li');

    // If it has children, the handler above toggles; don’t close.
    if ($li.hasClass('menu-item-has-children')) return;

    closeMobileMenu();
  });
}