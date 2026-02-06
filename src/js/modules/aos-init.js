// src/js/modules/aos-init.js

export function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 600,
      once: true
    });
  }
}