// src/js/modules/aos-init.js
export function initAOS() {
  if (typeof AOS === 'undefined') return;

  AOS.init({
    duration: 600,
    once: true
  });

  // Recalculate after everything settles
  window.addEventListener('load', () => {
    AOS.refreshHard();
  });
}