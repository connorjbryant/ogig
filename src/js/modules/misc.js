export function initMisc($) {
  // Smooth scroll for anchor links (keep as-is)
  $('a[href^="#"]').on('click', function (e) {
    const target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: target.offset().top - 80 }, 400);
    }
  });

  // === FORKLIFT LIFT ON SCROLL (no hover/click interaction) ===
  const $wrap = $('.fr-forklift-btn-wrap');
  if (!$wrap.length) return;

  // Respect users who prefer reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let isAnimating = false;
  let lastTriggerScroll = window.scrollY;

  $(window).on('scroll', function () {
    const currentY = window.scrollY;

    // Only trigger if user has scrolled at least 60px since last animation
    if (Math.abs(currentY - lastTriggerScroll) < 60) return;
    if (isAnimating) return;

    lastTriggerScroll = currentY;
    isAnimating = true;

    $wrap.addClass('is-lifted');

    // Match timing with your CSS transition (~0.35s up + a bit of hang)
    setTimeout(() => {
      $wrap.removeClass('is-lifted');
      isAnimating = false;
    }, 900);
  });
}