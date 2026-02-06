// src/js/modules/cart-bubble.js

export function initCartBubble($) {
  const $count = $('.header__cart-count');

  // If there's no cart count element, do nothing
  if (!$count.length) return;

  // Trigger the pop-out animation whenever the number changes
  const observer = new MutationObserver(function() {
    $count.css('animation', 'none');           // reset
    // force reflow so animation can restart
    // eslint-disable-next-line no-unused-expressions
    $count[0].offsetHeight;
    $count.css('animation', 'popOut 0.4s ease-out');
  });

  // Watch for changes to the text inside the count bubble (and the element itself)
  observer.observe($count[0], {
    childList: true,
    subtree: true,
    characterData: true
  });

  // Trigger once on page load if there's already items in cart
  if (parseInt($count.text(), 10) > 0) {
    $count.css('animation', 'popOut 0.6s ease-out');
  }
}