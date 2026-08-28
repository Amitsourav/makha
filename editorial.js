/* स्वsnacks — editorial pages: reveals + shared cart drawer */
const rupees = n => '₹' + n.toLocaleString('en-IN');
const $ = id => document.getElementById(id);

const io = new IntersectionObserver(entries => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}, { threshold: .1, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

const FREE_SHIP = 999;
const cart = new Map();
const colorStore = JSON.parse(localStorage.getItem('sva-cart-colors') || '{}');
try { for (const [n, it] of JSON.parse(localStorage.getItem('sva-cart') || '[]')) cart.set(n, it); } catch (e) {}

const els = { drawer: $('cart'), scrim: $('cartScrim'), body: $('cartBody'),
  total: $('cartTotal'), ship: $('cartShip'), count: $('cartCount') };
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
