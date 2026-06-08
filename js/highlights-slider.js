/**
 * highlights-slider.js
 * Exhibition Highlights section slider.
 * Supports arrow buttons, touch swipe, keyboard, auto-play (optional),
 * and prefers-reduced-motion.
 *
 * Premier Schools Exhibition
 */

(function () {
  'use strict';

  /* ── DOM References ────────────────────────────────────────────────── */
  const sliderEl = document.getElementById('highlights-slider');
  const track    = document.getElementById('highlights-track');
  const prevBtn  = document.getElementById('highlights-prev');
  const nextBtn  = document.getElementById('highlights-next');

  if (!sliderEl || !track) return;

  const cards = Array.from(track.querySelectorAll('.highlight-card'));
  const total  = cards.length;

  let current      = 0;
  let touchStartX  = 0;
  let isDragging   = false;
  let autoTimer    = null;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const AUTO_INTERVAL = 4500;

  /* ── Compute visible count from CSS card width ─────────────────────── */
  function getVisibleCount() {
    if (!cards[0]) return 3;
    const trackWidth = sliderEl.offsetWidth;
    const cardStyle  = window.getComputedStyle(cards[0]);
    const cardWidth  = cards[0].offsetWidth +
                       parseFloat(cardStyle.marginRight || '0');
    return Math.max(1, Math.floor(trackWidth / cardWidth));
  }

  /* ── Core: Go to offset ────────────────────────────────────────────── */
  function goTo(index) {
    const visibleCount = getVisibleCount();
    const maxIndex     = Math.max(0, total - visibleCount);

    current = Math.max(0, Math.min(index, maxIndex));

    /* Calculate scroll amount */
    const trackStyle  = window.getComputedStyle(track);
    const gap         = parseFloat(trackStyle.gap) || 20;
    const cardWidth   = cards[0] ? cards[0].offsetWidth + gap : 0;

    track.style.transform = `translateX(-${current * cardWidth}px)`;

    /* Disable buttons at boundaries */
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current >= maxIndex;
  }

  /* ── Auto-play ─────────────────────────────────────────────────────── */
  function startAuto() {
    if (prefersReducedMotion) return;
    stopAuto();
    autoTimer = setInterval(function () {
      const visibleCount = getVisibleCount();
      const maxIndex     = Math.max(0, total - visibleCount);
      if (current >= maxIndex) {
        goTo(0);
      } else {
        goTo(current + 1);
      }
    }, AUTO_INTERVAL);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  /* ── Button handlers ───────────────────────────────────────────────── */
  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      goTo(current - 1);
      startAuto();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      goTo(current + 1);
      startAuto();
    });
  }

  /* ── Touch / Swipe ─────────────────────────────────────────────────── */
  track.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    isDragging  = true;
    stopAuto();
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    if (!isDragging) return;
    isDragging  = false;
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (delta < -50)     goTo(current + 1);
    else if (delta > 50) goTo(current - 1);
    startAuto();
  }, { passive: true });

  /* ── Keyboard ──────────────────────────────────────────────────────── */
  sliderEl.setAttribute('tabindex', '0');

  sliderEl.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1); startAuto(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); startAuto(); }
  });

  /* ── Pause on hover / focus ────────────────────────────────────────── */
  sliderEl.addEventListener('mouseenter', stopAuto);
  sliderEl.addEventListener('mouseleave', startAuto);
  sliderEl.addEventListener('focusin',    stopAuto);
  sliderEl.addEventListener('focusout',   startAuto);

  /* ── Init / Resize ─────────────────────────────────────────────────── */
  goTo(0);
  startAuto();

  let resizeDebounce = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeDebounce);
    resizeDebounce = setTimeout(function () {
      goTo(current); // recalculate card width
    }, 150);
  });

}());
