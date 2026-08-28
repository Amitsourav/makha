/* स्वsnacks — Gifting: build-a-box, note preview, corporate
   Shares cart state via localStorage('sva-cart'). */

const VOLUMES = [
  { slug: 'salt',    no: '01', short: 'Salt & Ghee',     tin: 349, fc: '#E8DCC8', ft: '#2C1D18' },
  { slug: 'peri',    no: '02', short: 'Peri-Peri',       tin: 349, fc: '#B0501C', ft: '#F8F4EE' },
  { slug: 'bbq',     no: '03', short: 'Smoked BBQ',      tin: 349, fc: '#8A5A3C', ft: '#F8F4EE' },
  { slug: 'cheese',  no: '04', short: 'Cheese & Garlic', tin: 379, fc: '#B98E4A', ft: '#2C1D18' },
  { slug: 'choc',    no: '05', short: 'Dark Chocolate',  tin: 399, fc: '#3B2A1E', ft: '#F8F4EE' },
  { slug: 'truffle', no: '06', short: 'Black Truffle',   tin: 499, fc: '#2E2A26', ft: '#F8F4EE' },
];
const BOX_VALUE = 249; // the letterpress box, ribbon & card, if you had to price it
const rupees = n => '₹' + n.toLocaleString('en-IN');
const $ = id => document.getElementById(id);
const vol = slug => VOLUMES.find(v => v.slug === slug);

const state = { size: 3, price: 1149, name: 'The Trio', picks: [] }; // picks = array of slugs, length ≤ size

/* ── render picker chips ── */
$('picker').innerHTML = VOLUMES.map(v => `
  <button class="pick" data-slug="${v.slug}" aria-label="Add ${v.short}">
    <span class="pick__dot" style="background:${v.fc}"></span>
    <span class="pick__no">${v.no}</span> ${v.short}
    <span class="pick__n" hidden>0</span>
  </button>`).join('');

/* ── paint everything from state ── */
function paint() {
  // spines: filled from picks, dashed for empty slots
  $('spines').innerHTML =
    state.picks.map((s, i) => {
      const v = vol(s);
      return `<button class="spine filled" data-i="${i}" style="--sp-c:${v.fc}; --sp-t:${v.ft}"
        aria-label="Remove ${v.short}" title="Click to remove">${v.no}</button>`;
    }).join('') +
    Array.from({ length: state.size - state.picks.length }, () => `<span class="spine"></span>`).join('') +
    (state.picks.length < state.size
      ? `<span class="spines__hint">${state.size - state.picks.length} to pick</span>` : '');

  // picker counts + disable when full
  const full = state.picks.length >= state.size;
  document.querySelectorAll('.pick').forEach(btn => {
    const n = state.picks.filter(s => s === btn.dataset.slug).length;
    const badge = btn.querySelector('.pick__n');
    badge.hidden = n === 0;
    badge.textContent = n;
    btn.disabled = full;
  });
  $('slotHint').textContent = full ? '— your box is full' : `— pick ${state.size - state.picks.length} more`;

  // summary
  $('sumName').textContent = state.name;
  const counts = {};
  state.picks.forEach(s => counts[s] = (counts[s] || 0) + 1);
  const entries = Object.entries(counts);
  $('sumList').innerHTML = entries.length
    ? entries.map(([s, n]) => {
        const v = vol(s);
        return `<li><i style="background:${v.fc}"></i>Vol. No.${v.no} · ${v.short}<em>×${n}</em></li>`;
      }).join('')
    : '<li class="summary__empty">No volumes chosen yet.</li>';

  // honest savings math: tins alone + box value vs bundle price
  const tinsWorth = state.picks.reduce((t, s) => t + vol(s).tin, 0);
  const save = tinsWorth + BOX_VALUE - state.price;
  const full3 = state.picks.length === state.size;
  $('sumSave').hidden = !(full3 && save > 0);
  if (full3 && save > 0) $('sumSaveAmt').textContent = `you save ${rupees(save)}`;

  $('sumTotal').textContent = rupees(state.price);
  $('giftAtc').disabled = !full3;
  $('giftAtc').textContent = full3 ? `Add the box — ${rupees(state.price)}` : `Pick ${state.size - state.picks.length} more volume${state.size - state.picks.length > 1 ? 's' : ''}`;
}

/* ── interactions ── */
document.querySelectorAll('.size').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.size').forEach(b => b.classList.toggle('is-active', b === btn));
  state.size = +btn.dataset.size;
  state.price = +btn.dataset.price;
  state.name = btn.querySelector('b').textContent;
  state.picks = state.picks.slice(0, state.size);
  paint();
}));

$('picker').addEventListener('click', e => {
  const btn = e.target.closest('.pick');
  if (!btn || btn.disabled) return;
  if (state.picks.length < state.size) { state.picks.push(btn.dataset.slug); paint(); }
});

$('spines').addEventListener('click', e => {
  const sp = e.target.closest('.spine.filled');
  if (!sp) return;
  state.picks.splice(+sp.dataset.i, 1);
  paint();
});

/* note preview */
$('noteInput').addEventListener('input', () => {
  $('notePreview').textContent = $('noteInput').value.trim() || 'Your note, letterpressed here.';
});

/* delivery date: min = 3 days out */
const min = new Date(Date.now() + 3 * 864e5);
$('giftDate').min = min.toISOString().slice(0, 10);

paint();

/* ── reveals ── */
const io = new IntersectionObserver(entries => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}, { threshold: .1, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ══ CART — shared ══ */
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

function addToCart(name, price, fc) {
  const item = cart.get(name) || { price, qty: 0 };
  item.qty++; item.price = price;
  cart.set(name, item);
  colorStore[name] = fc;
  renderCart();
  openCart();
}

/* build-a-box add */
$('giftAtc').addEventListener('click', () => {
  if (state.picks.length !== state.size) return;
  const counts = {};
  state.picks.forEach(s => counts[s] = (counts[s] || 0) + 1);
  const contents = Object.entries(counts).map(([s, n]) => `No.${vol(s).no}${n > 1 ? '×' + n : ''}`).join(' · ');
  const flags = [];
  if ($('noteInput').value.trim()) flags.push('with note');
  if ($('giftDate').value) flags.push('for ' + $('giftDate').value);
  addToCart(`${state.name} — ${contents}${flags.length ? ' (' + flags.join(', ') + ')' : ''}`, state.price, '#C9A578');
});

/* static gift adds (hamper) */
document.querySelectorAll('.btn-add[data-name]').forEach(btn =>
  btn.addEventListener('click', () => addToCart(btn.dataset.name, +btn.dataset.price, btn.dataset.fc)));
