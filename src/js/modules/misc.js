export function initMisc($) {
  // Smooth scroll (keep as-is)
  $('a[href^="#"]').on('click', function (e) {
    const target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: target.offset().top - 80 }, 400);
    }
  });

  const $wraps = $('.ogig-gear2-wrap');
  if (!$wraps.length) return;

  let isAnimating = false;
  let lastTriggerScroll = window.scrollY;

  function getPrimaryWrap(){
    const $visible = $wraps.filter(function(){
      const r = this.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    });
    return $visible.first().length ? $visible.first() : $wraps.first();
  }

  $(window).on('scroll', function(){
    const y = window.scrollY;
    if (Math.abs(y - lastTriggerScroll) < 90) return;
    if (isAnimating) return;

    lastTriggerScroll = y;
    isAnimating = true;

    const $wrap = getPrimaryWrap();
    $wrap.addClass('is-torque');

    setTimeout(() => {
      $wrap.removeClass('is-torque');
      isAnimating = false;
    }, 420);
  });

}
