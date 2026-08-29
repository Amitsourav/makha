/* स्वsnacks — motion engine & commerce
   Native scroll · GSAP ScrollTrigger · canvas particle field
   Degrades gracefully: no GSAP → IO reveals + stacked story; reduced motion honored. */

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const CAPTURE = new URLSearchParams(location.search).has('capture');
const TOUCH = matchMedia('(hover: none)').matches;

/* ── Hero load choreography ── */
requestAnimationFrame(() => document.body.classList.add('is-loaded'));

/* ── Nav scroll state ── */
const nav = document.getElementById('nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 40), { passive: true });

/* ══════════════════════════════════════════
   HERO CANVAS — floating makhana, depth parallax,
   scroll-driven flavor tinting
   ══════════════════════════════════════════ */
(function heroField() {
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  if (REDUCED || CAPTURE) { canvas.remove(); return; }

  // A 3x phone rasterises 9x the pixels of a 1x screen for what is a
  // soft, out-of-focus background. 1.5 is indistinguishable here and
  // cuts the fill cost by more than half on modern handsets.
  const DPR = Math.min(devicePixelRatio || 1, innerWidth < 760 ? 1.5 : 2);
  const COUNT = innerWidth < 700 ? 12 : 22;
  // flavor tints the field drifts toward as you scroll (loop-2 architecture)
  const TINTS = [[232, 220, 200], [176, 80, 28], [185, 142, 74], [59, 42, 30]];
  const BASE = [239, 231, 218];
  let w, h, mx = 0, my = 0, tmx = 0, tmy = 0, scrollP = 0, running = true;

  // Piece radius is authored for a desktop field. Held at that size on a
  // phone the spheres crowd the headline instead of sitting behind it, so
  // scale with the viewport — floored at .5 so they stay legible as objects.
  const RSCALE = Math.max(.5, Math.min(1, innerWidth / 1100));

  const rnd = (a, b) => a + Math.random() * (b - a);
  const pieces = Array.from({ length: COUNT }, () => ({
    x: Math.random(), y: Math.random(),
    r: rnd(10, 34) * RSCALE, z: rnd(.25, 1),  // z = depth: nearer moves more
    vx: rnd(-.012, .012), vy: rnd(-.008, .008),
    rot: rnd(0, Math.PI * 2), vr: rnd(-.0012, .0012),
    tint: Math.floor(Math.random() * TINTS.length),
    wob: rnd(0, Math.PI * 2),
  }));

  function size() {
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * DPR; canvas.height = h * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  size(); addEventListener('resize', size);

  addEventListener('pointermove', e => {
    tmx = (e.clientX / innerWidth - .5); tmy = (e.clientY / innerHeight - .5);
  }, { passive: true });
  addEventListener('scroll', () => {
    scrollP = Math.min(1, scrollY / (innerHeight * .9));
  }, { passive: true });

  const lerp = (a, b, t) => a + (b - a) * t;

  /* ── Sprite cache ───────────────────────────────────────────────
     Each piece was built from scratch every frame: a radial gradient
     constructed per piece, plus a shadow ellipse, a filled arc and a
     stroked arc. That is ~12 gradient objects and ~36 path operations
     per frame, and gradient construction is the expensive part.

     A makhana puff only ever differs by tint and size, so each tint is
     rendered once into a small offscreen canvas and then blitted with
     drawImage(). Scroll tinting is a blend between the base cream and
     four flavour tints, so we bake a short ramp per tint and pick the
     nearest step — indistinguishable at 3% steps, and it turns the hot
     path into a single texture copy per piece. */
  const RAMP = 12;                     // tint steps baked per flavour
  const SPRITE_R = 44;                 // sprite is drawn once at this radius
  const sprites = TINTS.map((tint, ti) =>
    Array.from({ length: RAMP }, (_, si) => {
      const k = si / (RAMP - 1);
      const c = tint.map((v, i) => Math.round(lerp(BASE[i], v, k)));
      // Body only. The ground shadow must NOT be baked in: the original
      // draws it before ctx.rotate() so it always stays below the piece,
      // and baking it here would spin it with the sprite.
      const pad = 4, size = (SPRITE_R + pad) * 2;
      const off = document.createElement('canvas');
      off.width = off.height = size * DPR;
      const o = off.getContext('2d');
      o.scale(DPR, DPR);
      o.translate(size / 2, size / 2);
      const R = SPRITE_R;
      const g = o.createRadialGradient(-R * .35, -R * .4, R * .1, 0, 0, R * 1.15);
      g.addColorStop(0, `rgba(${Math.min(c[0] + 16, 255)},${Math.min(c[1] + 14, 255)},${Math.min(c[2] + 12, 255)},.95)`);
      g.addColorStop(.75, `rgba(${c[0]},${c[1]},${c[2]},.92)`);
      g.addColorStop(1, `rgba(${c[0] - 24},${c[1] - 22},${c[2] - 20},.9)`);
      o.fillStyle = g;
      o.beginPath(); o.arc(0, 0, R, 0, 7); o.fill();
      o.strokeStyle = 'rgba(44,29,24,.16)'; o.lineWidth = Math.max(1, R * .06);
      o.beginPath(); o.arc(0, R * .1, R * .62, Math.PI * 1.15, Math.PI * 1.85); o.stroke();
      return { cv: off, size };
    }));

  function drawPiece(p, t) {
    const px = p.x * w + mx * 46 * p.z;
    const py = p.y * h + my * 30 * p.z + Math.sin(t * .0006 + p.wob) * 8 * p.z;
    const R = p.r * (0.8 + p.z * .4);
    const step = Math.min(RAMP - 1, Math.round(scrollP * .85 * (RAMP - 1)));
    const sp = sprites[p.tint][step];
    const draw = (R / SPRITE_R) * sp.size;
    ctx.save();
    ctx.translate(px, py);
    // shadow first, unrotated — a plain ellipse fill, which is cheap;
    // the gradient was the part worth caching, not this.
    ctx.fillStyle = 'rgba(44,29,24,.05)';
    ctx.beginPath(); ctx.ellipse(3, R * 1.28, R * .8, R * .26, 0, 0, 7); ctx.fill();
    ctx.rotate(p.rot);
    ctx.drawImage(sp.cv, -draw / 2, -draw / 2, draw, draw);
    ctx.restore();
  }

  let raf;
  function frame(t) {
    if (!running) return;
    mx = lerp(mx, tmx, .045); my = lerp(my, tmy, .045);
    ctx.clearRect(0, 0, w, h);
    for (const p of pieces) {
      p.x += p.vx / 100; p.y += p.vy / 100; p.rot += p.vr;
      if (p.x < -.08) p.x = 1.08; if (p.x > 1.08) p.x = -.08;
      if (p.y < -.1) p.y = 1.1; if (p.y > 1.1) p.y = -.1;
      drawPiece(p, t);
    }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  // pause when hero offscreen — free the main thread
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !running) { running = true; raf = requestAnimationFrame(frame); }
    else if (!e.isIntersecting) { running = false; cancelAnimationFrame(raf); }
  }).observe(canvas);
})();

/* ══════════════════════════════════════════
   MOTION — GSAP on native scroll, graceful fallback
   ══════════════════════════════════════════ */
const story = document.getElementById('story');

function ioReveals() {
  const io = new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

function splitWhy() {
  document.querySelectorAll('.why__line').forEach(line => {
    if (line.dataset.split) return;
    line.dataset.split = '1';
    const splitNode = node => {
      [...node.childNodes].forEach(child => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(tok => {
            if (!tok.trim()) { frag.appendChild(document.createTextNode(tok)); return; }
            const s = document.createElement('span');
            s.className = 'w'; s.textContent = tok;
            frag.appendChild(s);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) splitNode(child);
      });
    };
    splitNode(line);
  });
}

function initMotion() {
  const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

  if (REDUCED || CAPTURE || !hasGsap) {
    // stacked story, IO reveals, everything visible and calm
    story.classList.add('no-pin');
    if (CAPTURE || REDUCED) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
      document.querySelectorAll('.why__line .w').forEach(wd => wd.classList.add('on'));
      document.getElementById('giftbox').classList.add('open');
      if (CAPTURE) {
        document.body.classList.add('capture');
        document.querySelector('.hero').style.minHeight = 'auto';
        document.querySelector('.story__pin').style.minHeight = 'auto';
      }
    } else {
      ioReveals();
      new IntersectionObserver(([e], io) => {
        if (e.isIntersecting) { document.getElementById('giftbox').classList.add('open'); io.disconnect(); }
      }, { threshold: .5 }).observe(document.getElementById('giftbox'));
    }
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  // Mobile browsers fire resize every time the address bar shows or hides.
  // Left alone, ScrollTrigger re-measures mid-scroll and the pinned story
  // unpins and jumps — measured: a 900→700 viewport change released the pin
  // and shifted scroll by 66px. Height-only changes on touch are ignored.
  ScrollTrigger.config({ ignoreMobileResize: true });
  // Native scroll drives ScrollTrigger. Lenis was cut after real-device QA:
  // buffered wheel input + long easing read as lag-then-lurch, violating
  // "the OS feeling untouched" (see brand/06-cut-list.md #13).

  // Reveals — batched, staggered, slow rise
  ScrollTrigger.batch('.reveal', {
    start: 'top 88%',
    onEnter: batch => batch.forEach(el => el.classList.add('in')),
    once: true,
  });

  // Scroll story — continuous scrub choreography.
  // Every property is a pure function of scroll position: fully reversible,
  // 1:1 with the wheel, no thresholds to glitch across. scrub:0.6 adds the
  // liquid catch-up; anticipatePin softens the pin engage on fast scroll.
  const figs = gsap.utils.toArray('.story__fig');
  const words = gsap.utils.toArray('.story__word');
  const idxEl = document.getElementById('storyIdx');
  // The primary CTA is shared by all four chapters, so it read "Shop Makhana"
  // over Popcorn, Protein Puffs and Millet — none of which are on sale. Shelf I
  // is the only thing that can actually be bought, so the arriving chapters say
  // so plainly rather than offering a product that does not exist yet.
  const ctaEl = document.querySelector('.story__ctas .btn--cream');
  const CTA = [
    ['Shop Makhana',       'collection.html'],
    ['Start with Shelf I', 'collection.html'],
    ['Start with Shelf I', 'collection.html'],
    ['Start with Shelf I', 'collection.html'],
  ];
  let lastIdx = -1;
  const barEl = document.getElementById('storyBar');
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  story.classList.add('story--scrub');
  // Chapter timeline runs 0.5 → 3.15: chapter 4 reaches full state at the
  // exact moment the pin releases — no dead tail, no "same frame again".
  // Driven through a tween so scrub smoothing is real (it only smooths
  // attached animations, not raw progress reads).
  const state = { x: 0.5 };
  const paint = () => {
    const x = state.x;
    for (let k = 0; k < 4; k++) {
      const c = k + 0.5;
      // Crossfade shape. The original (0.65 / 0.3) held a chapter at full
      // opacity only within +/-0.35 of its centre, so for roughly 60% of the
      // scroll two chapters were simultaneously half-visible. On desktop that
      // reads as a dissolve; on a phone, where the chapters stack, it reads as
      // doubled, unreadable text. Widening the plateau to +/-0.39 and
      // shortening the fade band to 0.16 makes the handover decisive while
      // still overlapping enough to avoid a blank frame at the midpoint.
      const w = clamp((0.55 - Math.abs(x - c)) / 0.16, 0, 1);
      const drift = clamp(c - x, -0.65, 0.65);
      figs[k].style.opacity = w;
      // Only two chapters are ever visible at once. Hiding the other two
      // lets the compositor skip them entirely — each is a full-viewport
      // SVG wrapping a ~1.5MP raster, and scale() on that forces a
      // re-rasterisation every frame it is painted.
      figs[k].style.visibility = w > 0.004 ? 'visible' : 'hidden';
      figs[k].style.transform = `scale(${(0.84 + 0.16 * w).toFixed(4)}) rotate(${(drift * 5).toFixed(2)}deg)`;
      words[k].style.opacity = w;
      words[k].style.transform = `translateY(${(drift * 44).toFixed(1)}px)`;
    }
    const idx = clamp(Math.round(x - 0.5), 0, 3);
    idxEl.textContent = '0' + (idx + 1);
    // only touch the DOM when the chapter actually turns over
    if (idx !== lastIdx) {
      lastIdx = idx;
      const [label, href] = CTA[idx];
      ctaEl.textContent = label;
      ctaEl.href = href;
    }
  };
  paint();
  gsap.to(state, {
    x: 3.15,
    ease: 'none',
    onUpdate: paint,
    scrollTrigger: {
      trigger: story,
      start: 'top top',
      // 280% = 70% of a viewport per chapter, per 07-motion-spec §2. At the
      // 200% this previously used, chapters turned over 40% faster than the
      // spec intends, which reads as rushed rather than composed.
      // 280% of a tall portrait viewport is a very long hold on a phone,
      // where the reader scrolls faster; 200% keeps the same four beats
      // without the section outstaying its welcome. Function form is
      // re-evaluated on refresh, so rotation picks up the right distance.
      end: () => '+=' + (matchMedia('(max-width: 760px)').matches ? 200 : 280) + '%',
      pin: '.story__pin',
      // Smoothing costs responsiveness. On a phone the finger IS the
      // scrubber, so a 0.6s catch-up keeps animating after the thumb
      // stops and reads as drift. 06-cut-list.md #13: "luxury is 1:1
      // input response". Desktop keeps the liquid catch-up.
      scrub: matchMedia('(max-width: 760px)').matches ? true : 0.6,
      // anticipatePin was removed, not tuned. It pins ahead of the start
      // based on scroll velocity, and on a fast flick that fixed the panel
      // to the viewport up to ~225px BEFORE the section began — so the
      // makhana pack appeared over the hero above it. Measured: pin
      // position:fixed at scrollY 720 while the story starts at 945.
      // The jump it was hiding is better solved by not pinning early.
      invalidateOnRefresh: true,
      onUpdate(self) { barEl.style.right = (100 - self.progress * 100) + '%'; },
    },
  });

  // Why we exist — word-by-word editorial reveal
  splitWhy();
  document.querySelectorAll('.why__line').forEach(line => {
    const words = line.querySelectorAll('.w');
    ScrollTrigger.create({
      trigger: line, start: 'top 82%', end: 'top 34%', scrub: .4,
      onUpdate(self) {
        const n = Math.round(self.progress * words.length);
        words.forEach((wd, i) => wd.classList.toggle('on', i < n));
      },
    });
  });

  // Gift box — lid lifts as the section arrives
  ScrollTrigger.create({
    trigger: '#giftbox', start: 'top 75%',
    onEnter: () => document.getElementById('giftbox').classList.add('open'),
    onLeaveBack: () => document.getElementById('giftbox').classList.remove('open'),
  });
}

// scripts are deferred; CDN may land after us — init on load if gsap isn't here yet
if (typeof gsap !== 'undefined') initMotion();
else addEventListener('load', initMotion);

/* ── Card tilt — pointer-tracked depth (desktop only) ── */
if (!TOUCH && !REDUCED) {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    let raf = null;
    card.addEventListener('pointermove', e => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - .5) * -5;
        const ry = ((e.clientX - r.left) / r.width - .5) * 6;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
        raf = null;
      });
    });
    card.addEventListener('pointerleave', () => {
      if (raf) cancelAnimationFrame(raf); raf = null;
      card.style.transform = '';
    });
  });
}

/* ══════════════════════════════════════════
   COMMERCE — cart, toast, newsletter, FAQ
   ══════════════════════════════════════════ */
const FLAVOR_COLORS = {
  'Himalayan Salt & A2 Ghee': '#E8DCC8',
  'Guntur Peri-Peri': '#B0501C',
  'Smoked Paprika BBQ': '#8A5A3C',
  'Amber Cheese & Garlic': '#B98E4A',
  'Dark Chocolate & Sea Salt': '#3B2A1E',
  'Black Truffle & Pepper': '#2E2A26',
  'The Tasting Library': '#C9A578',
};
const FREE_SHIP = 999;
const cart = new Map();
try {
  for (const [n, it] of JSON.parse(localStorage.getItem('sva-cart') || '[]')) cart.set(n, it);
} catch (e) { /* corrupt state — start clean */ }

const els = {
  drawer: document.getElementById('cart'), scrim: document.getElementById('cartScrim'),
  body: document.getElementById('cartBody'), total: document.getElementById('cartTotal'),
  ship: document.getElementById('cartShip'), count: document.getElementById('cartCount'),
  toast: document.getElementById('toast'),
};
const rupees = n => '₹' + n.toLocaleString('en-IN');

function openCart() { els.drawer.classList.add('open'); els.scrim.classList.add('open'); }
function closeCart() { els.drawer.classList.remove('open'); els.scrim.classList.remove('open'); }
document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
els.scrim.addEventListener('click', closeCart);
addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

function renderCart() {
  let total = 0, count = 0;
  els.body.innerHTML = '';
  if (cart.size === 0) els.body.innerHTML = '<p class="cart__empty">Your cart is empty — for now.</p>';
  for (const [name, item] of cart) {
    total += item.price * item.qty; count += item.qty;
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div class="cart-item__dot" style="background:${FLAVOR_COLORS[name] || '#2C1D18'}"></div>
      <div class="cart-item__meta">
        <p class="cart-item__name">${name}</p>
        <p class="cart-item__price">${rupees(item.price)} each</p>
      </div>
      <div class="cart-item__qty">
        <button data-act="dec" data-name="${name}" aria-label="Decrease quantity">−</button>
        <span>${item.qty}</span>
        <button data-act="inc" data-name="${name}" aria-label="Increase quantity">+</button>
      </div>`;
    els.body.appendChild(row);
  }
  els.total.textContent = rupees(total);
  els.count.textContent = count;
  els.count.classList.add('bump');
  setTimeout(() => els.count.classList.remove('bump'), 260);

  if (total >= FREE_SHIP) { els.ship.textContent = '✦ Free shipping unlocked'; els.ship.classList.add('free'); }
  else if (total > 0) { els.ship.textContent = `Add ${rupees(FREE_SHIP - total)} more for free shipping`; els.ship.classList.remove('free'); }
  else { els.ship.textContent = `Free shipping unlocks at ${rupees(FREE_SHIP)}`; els.ship.classList.remove('free'); }
  try { localStorage.setItem('sva-cart', JSON.stringify([...cart])); } catch (e) {}
}
if (cart.size) renderCart();

els.body.addEventListener('click', e => {
  const btn = e.target.closest('button[data-act]');
  if (!btn) return;
  const item = cart.get(btn.dataset.name);
  if (!item) return;
  if (btn.dataset.act === 'inc') item.qty++;
  else if (--item.qty <= 0) cart.delete(btn.dataset.name);
  renderCart();
});

let toastTimer;
function toast(msg) {
  els.toast.textContent = msg;
  els.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2400);
}

document.querySelectorAll('.btn-add').forEach(btn => {
  btn.addEventListener('click', () => {
    const { name, price } = btn.dataset;
    const item = cart.get(name) || { price: +price, qty: 0 };
    item.qty++; cart.set(name, item);
    renderCart();
    openCart();
    btn.classList.add('added');
    const label = btn.textContent;
    btn.textContent = 'Added ✦';
    setTimeout(() => { btn.classList.remove('added'); btn.textContent = label; }, 1400);
  });
});

document.querySelectorAll('.vcard__play').forEach(b =>
  b.addEventListener('click', () => toast('Customer films arrive with the launch batch.')));

const newsForm = document.getElementById('newsForm');
newsForm.addEventListener('submit', e => {
  e.preventDefault();
  newsForm.style.display = 'none';
  document.getElementById('newsDone').style.display = 'block';
});

document.querySelectorAll('.faq__item').forEach(d => {
  d.addEventListener('toggle', () => {
    if (d.open) document.querySelectorAll('.faq__item[open]').forEach(o => { if (o !== d) o.open = false; });
  });
});

// dev: ?jump=<id> scrolls instantly to a section after load (debug/screenshot rig)
{
  const jump = new URLSearchParams(location.search).get('jump');
  if (jump) addEventListener('load', () => setTimeout(() => {
    const el = document.getElementById(jump);
    if (el) scrollTo({ top: el.getBoundingClientRect().top + scrollY + (+new URLSearchParams(location.search).get('off') || 0), behavior: 'instant' });
  }, 800));
}

// Story chapters: on phones the figure gets its own band under the copy
// (see styles.css §13) and fills it by cropping toward the product mass on
// the right of the artboard. Re-evaluated on resize so a rotation doesn't
// leave the desktop framing on a portrait screen, or vice versa.
// Story chapters: reframe the artboard for phones.
// The chapter artboard is 1440x800 and holds the pack (x 610-1440,
// y 100-740) plus a watermark numeral on the far left and a caption on
// the far right. On a phone that whole board letterboxes to a ~200px
// strip, so the previous fix cropped it with 'slice' — which cut the pack
// through its own lettering.
//
// Apple's rule is that a product render keeps its aspect ratio and only
// changes scale; it is never cropped. So on phones the viewBox is
// narrowed to the pack's own bounds instead: the product is framed whole
// and centred, and the numeral and caption drop away — the overlay
// already carries the chapter number, and Apple tiles carry no such
// chrome anyway.
{
  const NARROW = '(max-width: 760px)';
  const FULL_BOARD = '0 0 1440 800';
  const PACK_ONLY  = '610 100 830 640';
  const figs = document.querySelectorAll('.story__fig');
  const frameFigs = () => {
    const narrow = matchMedia(NARROW).matches;
    figs.forEach(f => {
      f.setAttribute('viewBox', narrow ? PACK_ONLY : FULL_BOARD);
      f.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    });
  };
  frameFigs();
  matchMedia(NARROW).addEventListener('change', frameFigs);
}
