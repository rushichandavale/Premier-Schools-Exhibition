/**
 * school-cards.js
 * Mobile swipeable slider for "Choose the School" section.
 * Only activates below 640 px — above that the CSS grid is used.
 * Supports touch swipe, arrow buttons, dot pagination, and keyboard nav.
 *
 * Premier Schools Exhibition
 */

(function () {
  'use strict';

  /* ── DOM References ────────────────────────────────────────────────── */
  const sliderEl  = document.getElementById('school-slider');
  const track     = document.getElementById('school-slider-track');
  const prevBtn   = document.getElementById('school-prev');
  const nextBtn   = document.getElementById('school-next');
  const dotsWrap  = document.getElementById('school-dots');

  if (!sliderEl || !track) return;

  const slides = Array.from(track.querySelectorAll('.school-card'));
  const dots   = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.choose-school__dot')) : [];
  const total  = slides.length;

  let current    = 0;
  let touchStartX = 0;
  let isDragging  = false;

  /* ── Media query: only run on narrow viewports ─────────────────────── */
  const mqMobile = window.matchMedia('(max-width: 640px)');

  /* ── Core: Go to slide ─────────────────────────────────────────────── */
  function goTo(index) {
    current = ((index % total) + total) % total;

    /* Calculate card width + gap */
    const card = slides[0];
    if (!card) return;
    const style     = window.getComputedStyle(track);
    const gap       = parseFloat(style.gap) || 16;
    const cardWidth = card.offsetWidth + gap;

    track.style.transform = `translateX(-${current * cardWidth}px)`;

    /* Update dots */
    dots.forEach(function (dot, i) {
      const active = i === current;
      dot.classList.toggle('choose-school__dot--active', active);
      dot.setAttribute('aria-selected', String(active));
    });

    /* Update slides ARIA */
    slides.forEach(function (slide, i) {
      slide.setAttribute('aria-hidden', String(i !== current));
    });
  }

  /* ── Button handlers ───────────────────────────────────────────────── */
  if (prevBtn) {
    prevBtn.addEventListener('click', function () { goTo(current - 1); });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () { goTo(current + 1); });
  }

  /* Dot navigation */
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      const idx = Number(dot.dataset.index);
      if (!Number.isNaN(idx)) goTo(idx);
    });
  });

  /* ── Touch / Swipe ─────────────────────────────────────────────────── */
  track.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    isDragging  = true;
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    if (!isDragging) return;
    isDragging  = false;
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (delta < -50)      goTo(current + 1);
    else if (delta > 50)  goTo(current - 1);
  }, { passive: true });

  /* ── Keyboard ──────────────────────────────────────────────────────── */
  sliderEl.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
  });

  /* ── Init / Resize ─────────────────────────────────────────────────── */
  function init() {
    if (mqMobile.matches) {
      goTo(current);
    }
  }

  init();
  window.addEventListener('resize', init);
  mqMobile.addEventListener('change', init);

}());
