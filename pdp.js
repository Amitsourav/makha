/* स्वsnacks — PDP engine
   Data-driven template: ?v=<slug> renders any volume of Shelf I.
   Shares cart state with the homepage via localStorage('sva-cart'). */

const PRODUCTS = {
  salt: {
    vol: 'No.01', colorName: 'Warm Ivory', fc: '#E8DCC8', ft: '#2C1D18',
    name: 'Himalayan Salt & A2 Ghee', mood: 'The quiet one. For evenings that need nothing added.',
    photos: { front: 'assets/salt-pouch.png', jar: 'assets/salt-jar.png', tin: 'assets/salt-tin.png' },
    cardPhoto: 'assets/salt-pouch.png',
    rating: 4.9, count: 812,
    prices: { tin: 349, pouch: 749, jar: 649 },
    tasteTitle: 'Butter, salt, and <em>restraint.</em>',
    story: 'This is the volume we test every new roaster on, because there is nowhere to hide. Slow-roasted in A2 ghee until the seed turns the colour of morning toast, then finished with hand-pounded pink salt — measured by the same three people, every week. It tastes the way quiet feels.',
    serve: 'Serve with: evening chai, a heavy book, or absolutely nothing at all.',
    notes: [['Ghee warmth', 85], ['Salt', 55], ['Roast depth', 65]],
    ingredients: [
      ['Lotus seeds', 'Pond No.4, Darbhanga · 6-suta lawa grade'],
      ['A2 desi ghee', 'Sitapur dairy co-op · slow-clarified'],
      ['Himalayan pink salt', 'hand-pounded, unrefined'],
    ],
    reviews: [
      [5, 'The first snack I\'ve bought where the plain one is the best one. It tastes expensive in a way I can\'t explain to my family.', 'Aditi R.', 'Bengaluru'],
      [5, 'Enormous, uniformly crisp, and the ghee is real — it perfumes the whole tin. Worth every rupee over the supermarket packet.', 'Kabir M.', 'Gurgaon'],
      [4, 'Wonderful, though I wish the 80g tin were bigger. It does not survive a single film.', 'Shruti V.', 'Pune'],
    ],
  },
  peri: {
    vol: 'No.02', colorName: 'Burnt Orange', fc: '#B0501C', ft: '#F8F4EE',
    name: 'Guntur Peri-Peri', mood: 'The loud one. Slow heat that earns its applause.',
    photos: { front: { src: 'assets/peri-pouch.jpg', scene: true }, jar: { src: 'assets/peri-jar.jpg', scene: true }, tin: { src: 'assets/peri-tin.jpg', scene: true } },
    cardPhoto: 'assets/peri-pouch.jpg',
    rating: 4.8, count: 623,
    prices: { tin: 349, pouch: 749, jar: 649 },
    tasteTitle: 'Heat that <em>arrives,</em> never attacks.',
    story: 'Sun-dried Guntur chillies are ground with a whisper of lime leaf and folded into the roast while it is still warm, so the heat soaks in instead of sitting on top. It builds over three seeds, peaks politely, and leaves you reaching again. Loud, but never rude.',
    serve: 'Serve with: cold beer, cricket, and people you like arguing with.',
    notes: [['Guntur heat', 78], ['Citrus lift', 45], ['Roast depth', 60]],
    ingredients: [
      ['Lotus seeds', 'Pond No.4, Darbhanga · 6-suta lawa grade'],
      ['Cold-pressed groundnut oil', 'single-press, unrefined'],
      ['Guntur chillies', 'sun-dried, stone-ground'],
      ['Lime leaf & garlic', 'a whisper of each'],
    ],
    reviews: [
      [5, 'Finally a peri-peri that is a flavour and not a dare. The heat curve is genuinely well designed.', 'Rahul D.', 'Hyderabad'],
      [5, 'My flatmate hides this tin. From me. In my own house.', 'Nikita S.', 'Mumbai'],
      [4, 'Brilliant, though I\'d take it one notch hotter. Guntur can do more.', 'Arvind K.', 'Vijayawada'],
    ],
  },
  bbq: {
    vol: 'No.03', colorName: 'Smoked Copper', fc: '#8A5A3C', ft: '#F8F4EE',
    name: 'Smoked Paprika BBQ', mood: 'The campfire one. Open fire, politely tinned.',
    photos: { front: { src: 'assets/bbq-pouch.jpg', scene: true }, jar: 'assets/bbq-jar.png', tin: { src: 'assets/bbq-tin.jpg', scene: true } },
    cardPhoto: 'assets/bbq-pouch.jpg',
    rating: 4.8, count: 291,
    prices: { tin: 349, pouch: 749, jar: 649 },
    tasteTitle: 'A campfire, <em>domesticated.</em>',
    story: 'Smoked Spanish paprika meets a breath of Kashmiri chilli and the gentlest sweetness — the taste of a fire that somebody responsible is watching. It is the volume people call "the interesting one" before quietly finishing the tin.',
    serve: 'Serve with: film nights, road trips, and anyone who claims they don\'t snack.',
    notes: [['Smoke', 72], ['Sweetness', 40], ['Chilli warmth', 48]],
    ingredients: [
      ['Lotus seeds', 'Pond No.4, Darbhanga · 6-suta lawa grade'],
      ['Cold-pressed groundnut oil', 'single-press, unrefined'],
      ['Smoked paprika', 'La Vera, oak-smoked'],
      ['Kashmiri chilli & jaggery', 'a breath of each'],
    ],
    reviews: [
      [5, 'Tastes like a barbecue that went to design school.', 'Tanya B.', 'Delhi'],
      [5, 'The smoke is real smoke, not the chemistry-lab kind. You can tell in one seed.', 'Joseph P.', 'Kochi'],
      [4, 'Excellent, slightly sweet for my taste. Still finished it in two days.', 'Manav G.', 'Jaipur'],
    ],
  },
  cheese: {
    vol: 'No.04', colorName: 'Muted Gold', fc: '#B98E4A', ft: '#2C1D18',
    name: 'Amber Cheese & Garlic', mood: 'The dangerous one. Restraint sold separately.',
    photos: { front: { src: 'assets/cheese-pouch.jpg', scene: true }, jar: { src: 'assets/cheese-jar.jpg', scene: true }, tin: { src: 'assets/cheese-tin.jpg', scene: true } },
    cardPhoto: 'assets/cheese-pouch.jpg',
    rating: 4.7, count: 355,
    prices: { tin: 379, pouch: 819, jar: 699 },
    tasteTitle: 'Sharp cheese, slow garlic, <em>no brakes.</em>',
    story: 'Aged cheese is dried and milled in-house, then folded with slow-toasted garlic that has lost its bite and kept its depth. The result is savoury in the way good rooms are warm — completely, and without announcing it. We print no serving suggestion. There is no serving. There is only the tin.',
    serve: 'Serve with: extreme caution and a second tin within reach.',
    notes: [['Cheese sharpness', 75], ['Garlic depth', 62], ['Salt', 50]],
    ingredients: [
      ['Lotus seeds', 'Pond No.4, Darbhanga · 6-suta lawa grade'],
      ['A2 desi ghee', 'Sitapur dairy co-op'],
      ['Aged cheese', 'dried & milled in-house'],
      ['Toasted garlic & black pepper', 'slow-roasted whole'],
    ],
    reviews: [
      [5, 'I have a spreadsheet job and this tin is the best part of my Tuesday.', 'Ishaan T.', 'Noida'],
      [5, 'Real cheese. REAL cheese. Do you understand how rare that is in this country\'s snack aisle?', 'Priya L.', 'Chennai'],
      [4, 'Dangerously good, as advertised. Docking one star for my own lack of self-control.', 'Rohit N.', 'Indore'],
    ],
  },
  choc: {
    vol: 'No.05', colorName: 'Deep Cocoa', fc: '#3B2A1E', ft: '#F8F4EE',
    name: 'Dark Chocolate & Sea Salt', mood: 'The midnight one. Dessert, quietly redeemed.',
    photos: { front: { src: 'assets/choc-pouch.jpg', scene: true }, jar: { src: 'assets/choc-jar.jpg', scene: true }, tin: { src: 'assets/choc-tin.jpg', scene: true } },
    cardPhoto: 'assets/choc-pouch.jpg',
    rating: 4.9, count: 502,
    prices: { tin: 399, pouch: 859, jar: 749 },
    tasteTitle: 'Dessert, <em>redeemed.</em>',
    story: 'Single-origin 64% dark chocolate is tempered and folded over the roast in thin coats, then cracked with sea salt while it sets. The seed stays crisp inside the shell — a truffle\'s manners on a roasted grain\'s conscience. This is the volume that converts people who "don\'t really snack".',
    serve: 'Serve with: black coffee, midnight, or as the last argument of a dinner party.',
    notes: [['Cocoa depth', 82], ['Sea salt', 45], ['Crisp', 70]],
    ingredients: [
      ['Lotus seeds', 'Pond No.4, Darbhanga · 6-suta lawa grade'],
      ['Dark chocolate 64%', 'single-origin, Idukki cacao'],
      ['Cocoa butter', 'pure-pressed'],
      ['Sea salt', 'hand-cracked flakes'],
    ],
    reviews: [
      [5, 'Sent the Tasting Library instead of mithai last Diwali. This tin is why they now expect it annually.', 'Meera S.', 'Mumbai'],
      [5, 'The chocolate is thin enough that the seed still crunches. Whoever engineered that ratio deserves a raise.', 'Dhruv A.', 'Ahmedabad'],
      [5, 'My "one a day" rule lasted four days. No regrets, only crumbs.', 'Sana F.', 'Lucknow'],
    ],
  },
  truffle: {
    vol: 'No.06', colorName: 'Charcoal', fc: '#2E2A26', ft: '#F8F4EE',
    name: 'Black Truffle & Pepper', mood: 'The occasion one. Lives on desks, gets defended.',
    photos: { front: { src: 'assets/truffle-pouch.jpg', scene: true }, jar: { src: 'assets/truffle-jar.jpg', scene: true }, tin: { src: 'assets/truffle-tin.jpg', scene: true } },
    cardPhoto: 'assets/truffle-pouch.jpg',
    rating: 4.9, count: 418,
    prices: { tin: 499, pouch: 1099, jar: 949 },
    tasteTitle: 'The flagship. <em>Earned.</em>',
    story: 'Black truffle is shaved into cultured butter, warmed until the room changes, and folded through the roast with cracked Tellicherry pepper. Nothing about this volume is casual — not the sourcing, not the price, not the way people guard the tin. It is the library\'s closing argument: makhana, in its highest form.',
    serve: 'Serve with: a single malt, a promotion, or someone you\'re trying to impress honestly.',
    notes: [['Truffle depth', 88], ['Cultured butter', 70], ['Tellicherry bite', 52]],
    ingredients: [
      ['Lotus seeds', 'Pond No.4, Darbhanga · 6-suta lawa grade'],
      ['Cultured butter', 'small-batch, slow-fermented'],
      ['Black truffle', 'shaved, never "truffle flavour"'],
      ['Tellicherry pepper', 'cracked to order'],
    ],
    reviews: [
      [5, 'The truffle tin lives on my desk and gets defended like office property.', 'Aditi R.', 'Bengaluru'],
      [5, 'I have paid more for worse truffle things in restaurants with dress codes.', 'Varun M.', 'Delhi'],
      [4, 'Exceptional. Four stars only because ₹499 keeps it a monthly ritual, not a weekly one — which may be the point.', 'Leah D.', 'Goa'],
    ],
  },
};
const ORDER = ['salt', 'peri', 'bbq', 'cheese', 'choc', 'truffle'];
const FORMATS = { tin: ['The Tin', '80g'], pouch: ['The Pouch', '200g'], jar: ['The Glass Jar', '150g'] };
const GRAMS = { tin: 80, pouch: 200, jar: 150 };
const STANDING_OFF = 0.15;

/* ── resolve product ── */
const slug = (() => {
  const v = new URLSearchParams(location.search).get('v');
  return PRODUCTS[v] ? v : 'truffle';
})();
const P = PRODUCTS[slug];
const state = { format: 'tin', plan: 'once', qty: 1 };
const rupees = n => '₹' + Math.round(n).toLocaleString('en-IN');
const unitPrice = () => Math.round(P.prices[state.format] * (state.plan === 'standing' ? 1 - STANDING_OFF : 1));

/* ── static fill ── */
document.title = `${P.name} — स्वsnacks · ${P.vol}`;
document.documentElement.style.setProperty('--fc', P.fc);
const $ = id => document.getElementById(id);
$('crumbName').textContent = P.name;
$('volLine').textContent = `Vol. ${P.vol} · ${P.colorName} · Shelf I`;
$('prodName').textContent = P.name;
$('prodMood').textContent = P.mood;
$('ratingLine').innerHTML = `★★★★★ <span>${P.rating} · ${P.count} reviews</span>`;
$('svgFlav').textContent = P.name.replace(' & ', ' & ');
$('svgBand').setAttribute('fill', P.fc);
$('svgVol').textContent = P.vol; $('svgVol').setAttribute('fill', P.ft);
$('svgWt').setAttribute('fill', P.ft);
$('svgJarBand').setAttribute('fill', P.fc);
const ingNames = P.ingredients.map(i => i[0]);
$('svgIng1').textContent = ingNames.slice(0, 2).join(' · ');
$('svgIng2').textContent = ingNames.slice(2).join(' · ') || '—';
$('svgIng3').textContent = 'Nothing else.';
$('tasteTitle').innerHTML = P.tasteTitle;
$('tasteStory').textContent = P.story;
$('tasteServe').textContent = P.serve;
$('stickyName').textContent = P.name;
$('stickyDot').style.background = P.fc;

/* tasting notes */
$('notesWrap').classList.add('reveal');
$('notesWrap').innerHTML = P.notes.map(([label, val]) =>
  `<div class="note__row"><div class="note__head"><span>${label}</span><span>${val}/100</span></div>
   <div class="note__bar"><i style="--val:${val}%"></i></div></div>`).join('');

/* ingredients */
$('ingList').innerHTML = P.ingredients.map(([n, src]) =>
  `<li class="reveal"><b>${n}</b><span>${src}</span></li>`).join('');

/* reviews */
$('revTitle').innerHTML = `${P.count} reviews. <em>${P.rating}</em> kept.`;
$('revBig').textContent = P.rating;
$('revCount').textContent = `${P.count} verified reviews`;
const dist = [[5, 88], [4, 9], [3, 2], [2, 1], [1, 0]];
$('revBars').innerHTML = dist.map(([s, pct]) =>
  `<div class="rbar"><span>${s}★</span><div class="rbar__track"><i style="width:${pct}%"></i></div><span>${pct}%</span></div>`).join('');
$('revCards').innerHTML = P.reviews.map(([stars, quote, name, city]) =>
  `<figure class="revcard reveal">
     <p class="revcard__stars">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</p>
     <blockquote>"${quote}"</blockquote>
     <figcaption>${name} · ${city} · <b>Verified buyer</b></figcaption>
   </figure>`).join('');

/* complete the shelf */
$('shelfRail').innerHTML = ORDER.filter(s => s !== slug).map(s => {
  const p = PRODUCTS[s];
  return `<article class="scard reveal">
    <a href="product.html?v=${s}" aria-label="${p.name}">
      ${p.cardPhoto ? `<img class="scard__photo" src="${p.cardPhoto}" alt="">` : `<svg viewBox="0 0 200 296"><use href="#pouch-card"/>
        <rect x="36" y="244" width="128.5" height="26" fill="${p.fc}"/>
        <text x="46" y="264" class="pc-vol" fill="${p.ft}">${p.vol}</text>
      </svg>`}
      <p class="scard__vol">Vol. ${p.vol} · ${p.colorName}</p>
      <h3>${p.name}</h3>
    </a>
    <div class="scard__row">
      <p class="scard__price">${rupees(p.prices.tin)}</p>
      <button class="btn-add" data-name="${p.name} · The Tin 80g" data-price="${p.prices.tin}" data-fc="${p.fc}">Add</button>
    </div>
  </article>`;
}).join('');

/* format options */
$('formatOpts').insertAdjacentHTML('beforeend',
  `<div class="fmt">` + Object.entries(FORMATS).map(([key, [label, wt]], i) =>
    `<label class="fmt__item ${i === 0 ? 'is-active' : ''}" data-format="${key}">
       <input type="radio" name="format" value="${key}" ${i === 0 ? 'checked' : ''}>
       <b>${label}</b><span>${wt} · ${rupees(P.prices[key])}</span>
     </label>`).join('') + `</div>`);

/* ── pricing + selection logic ── */
function paintPrice() {
  const u = unitPrice();
  const base = P.prices[state.format];
  const per = Math.round(u / GRAMS[state.format] * 100);
  $('priceNow').innerHTML = state.plan === 'standing' ? `<s>${rupees(base)}</s> ${rupees(u)}` : rupees(u);
  $('pricePer').textContent = `${rupees(per)} / 100g · ${FORMATS[state.format][1]}`;
  $('saveTag').textContent = `save ${rupees(base * STANDING_OFF)}`;
  $('atcBtn').textContent = `Add to cart — ${rupees(u * state.qty)}`;
  $('stickyPrice').textContent = rupees(u * state.qty);
}
function showView(view) {
  document.querySelectorAll('.gallery__thumb').forEach(b => b.classList.toggle('is-active', b.dataset.view === view));
  document.querySelectorAll('.gallery__view').forEach(v => v.classList.toggle('is-active', v.dataset.view === view));
}
document.querySelectorAll('.fmt__item').forEach(el => el.addEventListener('click', () => {
  document.querySelectorAll('.fmt__item').forEach(x => x.classList.remove('is-active'));
  el.classList.add('is-active');
  state.format = el.dataset.format;
  showView(state.format === 'jar' ? 'jar' : 'front');   // see what you choose
  paintPrice();
}));
document.querySelectorAll('.plan__item').forEach(el => el.addEventListener('click', () => {
  document.querySelectorAll('.plan__item').forEach(x => x.classList.remove('is-active'));
  el.classList.add('is-active');
  state.plan = el.dataset.plan;
  paintPrice();
}));
$('qtyDec').addEventListener('click', () => { state.qty = Math.max(1, state.qty - 1); $('qtyVal').textContent = state.qty; paintPrice(); });
$('qtyInc').addEventListener('click', () => { state.qty = Math.min(8, state.qty + 1); $('qtyVal').textContent = state.qty; paintPrice(); });
paintPrice();

/* real photography when the volume has it */
if (P.photos) {
  const main = $('galleryMain');
  const norm = e => (typeof e === 'string' ? { src: e } : e);
  const imgTag = (e, view) => `<img class="gallery__img${e.scene ? ' gallery__img--scene' : ''}" src="${e.src}" alt="${P.name} — ${view}">`;
  const setPhoto = (view, entry) => {
    const v = main.querySelector(`.gallery__view[data-view="${view}"]`);
    if (v && entry) v.innerHTML = imgTag(norm(entry), view);
  };
  setPhoto('front', P.photos.front);
  setPhoto('jar', P.photos.jar);
  if (P.photos.tin) {
    main.insertAdjacentHTML('beforeend',
      `<div class="gallery__view" data-view="tin">${imgTag(norm(P.photos.tin), 'tin')}</div>`);
    document.querySelector('.gallery__thumbs').insertAdjacentHTML('beforeend',
      `<button class="gallery__thumb" data-view="tin" aria-label="The tin">The tin</button>`);
  }
  const note = document.querySelector('.gallery__note');
  if (note) note.textContent = 'Shot on the locked packaging system · this is the pack that ships';
}

/* ── gallery ── */
document.querySelectorAll('.gallery__thumb').forEach(btn =>
  btn.addEventListener('click', () => showView(btn.dataset.view)));

/* pointer tilt on the gallery (desktop only) */
const TOUCH = matchMedia('(hover: none)').matches;
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!TOUCH && !REDUCED) {
  const card = $('galleryMain');
  let raf = null;
  card.addEventListener('pointermove', e => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - .5) * -4;
      const ry = ((e.clientX - r.left) / r.width - .5) * 5;
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      raf = null;
    });
  });
  card.addEventListener('pointerleave', () => {
    if (raf) cancelAnimationFrame(raf); raf = null;
    card.style.transform = '';
  });
}

/* ── reveals (IO — the PDP ships zero animation libraries) ── */
const io = new IntersectionObserver(entries => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ── sticky purchase bar ── */
const stickyBar = $('stickyBar');
new IntersectionObserver(([e]) => {
  stickyBar.classList.toggle('show', !e.isIntersecting);
  stickyBar.setAttribute('aria-hidden', e.isIntersecting);
}, { rootMargin: '-90px 0px 0px 0px' }).observe($('atcBtn'));

/* ══ CART — shared with homepage ══ */
const FLAVOR_FALLBACK = '#2C1D18';
const FREE_SHIP = 999;
const cart = new Map();
const colorStore = JSON.parse(localStorage.getItem('sva-cart-colors') || '{}');
try {
  for (const [n, it] of JSON.parse(localStorage.getItem('sva-cart') || '[]')) cart.set(n, it);
} catch (e) {}

const els = {
  drawer: $('cart'), scrim: $('cartScrim'), body: $('cartBody'),
  total: $('cartTotal'), ship: $('cartShip'), count: $('cartCount'), toast: $('toast'),
};
function openCart() { els.drawer.classList.add('open'); els.scrim.classList.add('open'); }
function closeCart() { els.drawer.classList.remove('open'); els.scrim.classList.remove('open'); }
$('cartBtn').addEventListener('click', openCart);
$('cartClose').addEventListener('click', closeCart);
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
      <div class="cart-item__dot" style="background:${colorStore[name] || FLAVOR_FALLBACK}"></div>
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
  if (total >= FREE_SHIP) { els.ship.textContent = '✦ Free shipping unlocked'; els.ship.classList.add('free'); }
  else if (total > 0) { els.ship.textContent = `Add ${rupees(FREE_SHIP - total)} more for free shipping`; els.ship.classList.remove('free'); }
  else { els.ship.textContent = `Free shipping unlocks at ${rupees(FREE_SHIP)}`; els.ship.classList.remove('free'); }
  try {
    localStorage.setItem('sva-cart', JSON.stringify([...cart]));
    localStorage.setItem('sva-cart-colors', JSON.stringify(colorStore));
  } catch (e) {}
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

function addToCart(name, price, fc, qty = 1) {
  const item = cart.get(name) || { price, qty: 0 };
  item.qty += qty; item.price = price;
  cart.set(name, item);
  colorStore[name] = fc;
  renderCart();
  openCart();
}

function buyBoxAdd() {
  const label = `${P.name} · ${FORMATS[state.format][0]} ${FORMATS[state.format][1]}` +
    (state.plan === 'standing' ? ' · Standing Order' : '');
  addToCart(label, unitPrice(), P.fc, state.qty);
}
$('atcBtn').addEventListener('click', buyBoxAdd);
$('stickyAtc').addEventListener('click', buyBoxAdd);

document.querySelectorAll('.shelf__rail .btn-add').forEach(btn =>
  btn.addEventListener('click', e => {
    e.preventDefault();
    addToCart(btn.dataset.name, +btn.dataset.price, btn.dataset.fc);
    btn.textContent = 'Added ✦';
    setTimeout(() => { btn.textContent = 'Add'; }, 1400);
  }));
