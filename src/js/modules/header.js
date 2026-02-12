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

  // --- Desktop active nav underline (Induscity-style) ---
  function initDesktopActiveLine() {
    const BP = 1024;
    const $menu = $nav.find('ul.nav-menu').first();
    if (!$menu.length) return;

    // Only desktop
    if (window.innerWidth <= BP) {
      $menu.find('#ogig-active-line').remove();
      $menu.find('> li').removeClass('ogig-is-current');
      return;
    }

    // Create the underline element if missing
    let $line = $menu.find('#ogig-active-line');
    if (!$line.length) {
      $menu.append('<li id="ogig-active-line"></li>');
      $line = $menu.find('#ogig-active-line');
    }

    // Pick the "current" item:
    // 1) Prefer WP current classes if they exist
    // 2) Fallback to URL pathname match
    let $currentLi = $menu.find('> li.current-menu-item, > li.current_page_item, > li.current-menu-ancestor, > li.current-menu-parent').first();

    if (!$currentLi.length) {
      const curPath = (window.location.pathname || '/').replace(/\/+$/, '') || '/';

      $menu.find('> li > a').each(function () {
        const a = this;
        let aPath = '/';
        try {
          aPath = (new URL(a.href, window.location.origin)).pathname.replace(/\/+$/, '') || '/';
        } catch (e) {}

        if (aPath === curPath) {
          $currentLi = $(a).parent('li');
          return false;
        }
      });
    }

    // If we still don’t have a match, hide the line and bail
    if (!$currentLi.length) {
      $line.css({ width: 0, left: 0 });
      return;
    }

    // Mark text red (optional)
    $menu.find('> li').removeClass('ogig-is_current ogig-is-current');
    $currentLi.addClass('ogig-is-current');

    // Position the line under the anchor text width (like your screenshot)
    function moveLineTo($li, animate = true) {
      const $a = $li.children('a');
      if (!$a.length) return;

      const menuRect = $menu[0].getBoundingClientRect();
      const aRect = $a[0].getBoundingClientRect();

      const width = aRect.width * 1; // bar smaller than text (tweak: 0.35–0.6)
      const left = (aRect.left - menuRect.left) + (aRect.width / 2) - (width / 2);

      if (!animate) $line.css('transition', 'none');
      else $line.css('transition', '');

      $line.css({ width: width + 'px', left: left + 'px' });

      if (!animate) {
        // force reflow then restore transition
        $line[0].offsetHeight;
        $line.css('transition', '');
      }
    }

    // set initial position
    moveLineTo($currentLi, false);

    // hover behavior
    $menu.find('> li').off('.ogigLine');
    $menu.find('> li').on('mouseenter.ogigLine', function () {
      moveLineTo($(this), true);
    });

    $menu.on('mouseleave.ogigLine', function () {
      moveLineTo($currentLi, true);
    });

    // keep it correct on resize
    $(window).off('resize.ogigLine').on('resize.ogigLine', function () {
      initDesktopActiveLine();
    });
  }

  // run it
  initDesktopActiveLine();
  $(window).on('load', initDesktopActiveLine);

}