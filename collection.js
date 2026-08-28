/* स्वsnacks — Collection: the library ledger
   Mood-filtered, house-ordered. Shares cart state via localStorage('sva-cart'). */

const VOLUMES = [
  { slug: 'salt', no: '01', name: 'Himalayan Salt & A2 Ghee', photo: 'assets/salt-pouch.webp', mood: 'The quiet one. For evenings that need nothing added.',
    moodKey: 'quiet', notes: 'Ghee warmth · Pink salt · Morning-toast roast', heat: 0,
    rating: 4.9, count: 812, price: 349, fc: '#E8DCC8', ft: '#2C1D18', tag: 'Best seller' },
  { slug: 'peri', no: '02', name: 'Guntur Peri-Peri', photo: 'assets/peri-pouch.webp', mood: 'The loud one. Slow heat that earns its applause.',
    moodKey: 'loud', notes: 'Guntur chilli · Lime leaf · Slow-building heat', heat: 3,
    rating: 4.8, count: 623, price: 349, fc: '#B0501C', ft: '#F8F4EE' },
  { slug: 'bbq', no: '03', name: 'Smoked Paprika BBQ', photo: 'assets/bbq-pouch.webp', mood: 'The campfire one. Open fire, politely tinned.',
    moodKey: 'loud', notes: 'Oak smoke · Kashmiri chilli · Gentle sweetness', heat: 2,
    rating: 4.8, count: 291, price: 349, fc: '#8A5A3C', ft: '#F8F4EE' },
  { slug: 'cheese', no: '04', name: 'Amber Cheese & Garlic', photo: 'assets/cheese-pouch.webp', mood: 'The dangerous one. Restraint sold separately.',
    moodKey: 'loud', notes: 'Aged cheese · Toasted garlic · Black pepper', heat: 1,
    rating: 4.7, count: 355, price: 379, fc: '#B98E4A', ft: '#2C1D18' },
  { slug: 'choc', no: '05', name: 'Dark Chocolate & Sea Salt', photo: 'assets/choc-pouch.webp', mood: 'The midnight one. Dessert, quietly redeemed.',
    moodKey: 'sweet', notes: 'Idukki cacao 64% · Sea salt · Crisp centre', heat: 0,
    rating: 4.9, count: 502, price: 399, fc: '#3B2A1E', ft: '#F8F4EE' },
  { slug: 'truffle', no: '06', name: 'Black Truffle & Pepper', photo: 'assets/truffle-pouch.webp', mood: 'The occasion one. Lives on desks, gets defended.',
    moodKey: 'occasion', notes: 'Shaved truffle · Cultured butter · Tellicherry', heat: 1,
    rating: 4.9, count: 418, price: 499, fc: '#2E2A26', ft: '#F8F4EE', tag: 'Flagship', tagDark: true },
];
const HEAT_NAMES = ['No heat', 'A whisper', 'Warm', 'Loud'];
const rupees = n => '₹' + n.toLocaleString('en-IN');
const $ = id => document.getElementById(id);

/* ── render the ledger ── */
$('libRows').innerHTML = VOLUMES.map(v => `
  <article class="vol reveal" id="row-${v.slug}" data-mood="${v.moodKey}">
    <a class="vol__link" href="product.html?v=${v.slug}" aria-label="${v.name} — view volume ${v.no}"></a>
    ${v.tag ? `<span class="vol__tag ${v.tagDark ? 'vol__tag--dark' : ''}">${v.tag}</span>` : ''}
    <span class="vol__no">${v.no}</span>
    <div class="vol__pack" aria-hidden="true">
      ${v.photo ? `<img src="${v.photo}" alt="">` : `<svg viewBox="0 0 200 296"><use href="#pouch-card"/>
        <rect x="36" y="244" width="128.5" height="26" fill="${v.fc}"/>
        <text x="46" y="264" class="pc-vol" fill="${v.ft}">No.${v.no}</text>
        <text x="156" y="262" text-anchor="end" class="pc-wt" fill="${v.ft}">80g</text>
      </svg>`}
    </div>
    <div class="vol__meta">
      <h2>${v.name}</h2>
      <p class="vol__mood">${v.mood}</p>
      <p class="vol__notes">${v.notes}</p>
    </div>
    <div class="vol__facts">
      <span class="vol__heat" aria-label="Heat: ${HEAT_NAMES[v.heat]}">
        ${[0, 1, 2].map(i => `<i class="${i < v.heat ? 'on' : ''}"></i>`).join('')}
        <span>${HEAT_NAMES[v.heat]}</span>
      </span>
      <span class="vol__rating">★ ${v.rating} <span>· ${v.count} reviews</span></span>
    </div>
    <div class="vol__buy">
      <p class="vol__price">${rupees(v.price)} <span>· 80g tin</span></p>
      <button class="btn-add" data-name="${v.name} · The Tin 80g" data-price="${v.price}" data-fc="${v.fc}">Add to cart</button>
    </div>
  </article>`).join('');

/* ── the index — table of contents for the shelf ── */
$('indexRail').innerHTML = VOLUMES.map(v => `
  <button class="ix" data-slug="${v.slug}" aria-label="Jump to ${v.name}">
    <span class="ix__dot" style="background:${v.fc}"></span>
    <span class="ix__no">${v.no}</span> ${v.name.split(' & ')[0]}
  </button>`).join('');

/* the Tasting Library band interrupts the ledger after volume 03 (AOV placement) */
document.querySelectorAll('.vol')[2].after($('tastingBand'));

/* ── mood filtering — fade out, then collapse, with count feedback ── */
const rows = [...document.querySelectorAll('.vol')];
const WORDS = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'];
function applyMood(mood) {
  document.querySelectorAll('.chip').forEach(c => c.classList.toggle('is-active', c.dataset.mood === mood));
  let n = 0;
  rows.forEach(row => {
    const show = mood === 'all' || row.dataset.mood === mood;
    if (show) {
      n++;
      row.classList.remove('vol--hide');
      requestAnimationFrame(() => requestAnimationFrame(() => row.classList.remove('vol--out')));
    } else {
      row.classList.add('vol--out');
      setTimeout(() => row.classList.add('vol--hide'), 280);
    }
  });
  $('moodCount').textContent = `${WORDS[n]} of six volumes`;
}
document.querySelectorAll('.chip').forEach(chip =>
  chip.addEventListener('click', () => applyMood(chip.dataset.mood)));

/* index jumps: reset filter, scroll, light the row */
document.querySelectorAll('.ix').forEach(btn => btn.addEventListener('click', () => {
  applyMood('all');
  const row = document.getElementById('row-' + btn.dataset.slug);
  setTimeout(() => {
    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    row.classList.add('vol--lit');
    setTimeout(() => row.classList.remove('vol--lit'), 1600);
  }, 300);
}));

/* ── reveals ── */
const io = new IntersectionObserver(entries => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}, { threshold: .1, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ══ CART — shared with homepage & PDP ══ */
const FREE_SHIP = 999;
const cart = new Map();
const colorStore = JSON.parse(localStorage.getItem('sva-cart-colors') || '{}');
try {
  for (const [n, it] of JSON.parse(localStorage.getItem('sva-cart') || '[]')) cart.set(n, it);
} catch (e) {}

const els = {
  drawer: $('cart'), scrim: $('cartScrim'), body: $('cartBody'),
  total: $('cartTotal'), ship: $('cartShip'), count: $('cartCount'),
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
      <div class="cart-item__dot" style="background:${colorStore[name] || '#2C1D18'}"></div>
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

document.querySelectorAll('.btn-add').forEach(btn =>
  btn.addEventListener('click', e => {
    e.preventDefault();
    const { name, price, fc } = btn.dataset;
    const item = cart.get(name) || { price: +price, qty: 0 };
    item.qty++; item.price = +price;
    cart.set(name, item);
    colorStore[name] = fc;
    renderCart();
    openCart();
  }));
