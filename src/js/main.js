// src/js/main.js
import { initHeader } from './modules/header';
import { initCartBubble } from './modules/cart-bubble';
import { initAOS } from './modules/aos-init';
import { initMisc } from './modules/misc';
import { initFooterThree } from './modules/footer-three';
import { initTestimonialsSlider } from './modules/testimonials-slider';

// Safe wrapper to call from DOM ready + window.load (Ensure three.js loads)
function safeInitFooterThree($) {
  try {
    initFooterThree($);
  } catch (e) {
    console.error('Footer Three init failed:', e);
  }
}

jQuery(function ($) {
  initHeader($);
  initCartBubble($);
  initAOS($);
  initTestimonialsSlider();
  initMisc($);

  // Run footer init once DOM is ready
  safeInitFooterThree($);

  // Extra safety: if the canvas was 0×0 at first, try again after full load
  $(window).on('load', function () {
    const $container = $('#footer-logo-3d');
    const $canvas = $container.find('canvas.webgl');

    if ($container.length && $canvas.length) {
      const rect = $canvas[0].getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        safeInitFooterThree($);
      }
    }
  });

  // --- Search Redirect to WordPress Search Results
  const $searchInput = $('#ogig-search-input');
  const $searchButton = $('#ogig-search-button');

  if ($searchButton.length && $searchInput.length) {

    // Click button → redirect
    $searchButton.on('click', function (e) {
      e.preventDefault();
      const term = $searchInput.val().trim();
      if (term.length > 0) {
        window.location.href = '/?s=' + encodeURIComponent(term);
      }
    });

    // Press Enter inside input → trigger the same action
    $searchInput.on('keypress', function (e) {
      if (e.which === 13) {
        e.preventDefault();
        $searchButton.trigger('click');
      }
    });

  }

    // ===== Topbar Contact dropdown (matches screenshot behavior) =====
  const $contactWrap = $('.topbar-contact');
  const $contactBtn  = $('.topbar-contact__btn');
  const $contactMenu = $('.topbar-contact__menu');

  function closeContact() {
    $contactBtn.attr('aria-expanded', 'false');
    $contactMenu.prop('hidden', true);
  }

  $contactBtn.on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    const expanded = $(this).attr('aria-expanded') === 'true';
    $(this).attr('aria-expanded', String(!expanded));
    $contactMenu.prop('hidden', expanded);
  });

  // click outside closes
  $(document).on('click', function (e) {
    if (!$(e.target).closest('.topbar-contact').length) {
      closeContact();
    }
  });

  // esc closes
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') closeContact();
  });

  // ===== Dynamic Topbar Display (Call/Fax/Hours/Address) =====
  const $dynLink  = $('.topbar-dynamic');
  const $dynIcon  = $dynLink.find('i').first();
  const $dynLabel = $dynLink.find('.topbar-dynamic__label');
  const $dynValue = $dynLink.find('.topbar-dynamic__value');

  function setTopbarDynamic({ icon, label, value, href }) {
    // icon
    if (icon === 'fax') $dynIcon.attr('class', 'fa-solid fa-fax');
    else if (icon === 'clock') $dynIcon.attr('class', 'fa-regular fa-clock');
    else if (icon === 'location') $dynIcon.attr('class', 'fa-solid fa-location-dot');
    else $dynIcon.attr('class', 'fa-solid fa-phone');

    // text
    $dynLabel.text(label || '');
    $dynValue.text(value || '');

    // link behavior
    if (href) {
      $dynLink.attr('href', href).css('pointer-events', 'auto');
    } else {
      // Hours (no link)
      $dynLink.removeAttr('href').css('pointer-events', 'none');
    }
  }

  // Click dropdown item
  $(document).on('click', '.js-topbar-pick', function (e) {
    e.preventDefault();

    const $a = $(this);

    setTopbarDynamic({
      icon:  $a.data('icon'),
      label: $a.data('label'),
      value: $a.data('value'),
      href:  $a.data('href')
    });

    // close menu
    $('.topbar-contact__btn').attr('aria-expanded', 'false');
    $('.topbar-contact__menu').prop('hidden', true);
  });


});