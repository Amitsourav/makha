/* स्वsnacks — mobile interaction layer
   design-md `starbucks`, motion only. Loaded on every page.
   Colour is never touched here; see styles.css "MOBILE SYSTEM". */
(function () {
  const MOBILE = matchMedia('(max-width: 760px)');
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!MOBILE.matches || REDUCED) return;

  /* Image fade-in — Starbucks uses opacity .3s ease-in on load to stop
     lazy images popping in. Only images that have not decoded yet are
     hidden, so cached images never flash and a failed load still shows
     its alt text rather than staying invisible. */
  const fade = img => {
    if (img.dataset.fade) return;
    img.dataset.fade = '1';
    if (img.complete && img.naturalWidth) { img.classList.add('is-loaded'); return; }
    img.classList.add('is-fading');
    const reveal = () => img.classList.replace('is-fading', 'is-loaded');
    img.addEventListener('load', reveal, { once: true });
    img.addEventListener('error', reveal, { once: true });   // never strand an image hidden
  };
  document.querySelectorAll('img').forEach(fade);

  /* images added later (PDP gallery swaps, cart lines) */
  new MutationObserver(muts => {
    for (const m of muts) for (const n of m.addedNodes) {
      if (n.nodeType !== 1) continue;
      if (n.tagName === 'IMG') fade(n);
      else n.querySelectorAll?.('img').forEach(fade);
    }
  }).observe(document.body, { childList: true, subtree: true });
})();
