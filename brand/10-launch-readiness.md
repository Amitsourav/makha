# स्वsnacks — Loop 8: Production Launch Readiness (v1.0)
### Gap audit of the built static site, 2026-08-26

Scope: every gap between what exists in this repo today and a site a real
customer can buy from. Audited against the commitments already made in
04-ux-architecture.md, 07-motion-spec.md and 08-frontend-architecture.md.

**Verdict:** a beautifully finished prototype, not a shop. The brand, design
system and front-end craft are at agency standard. But nobody can buy
anything, and no order can reach us. There is no backend, no payment, no
data capture. The distance to "a user completes a purchase" is the entire
commerce stack.

What already passes: no broken internal links; all 17 images carry `alt`
and `loading`; reduced-motion and no-GSAP fallbacks are real, not stubs;
the no-fake-urgency rule of 06-cut-list.md #8 is honored in code.

---

## P0 — Blocks launch entirely

### 1. The Checkout button is dead
`cart__checkout` appears in 6 HTML files and has **zero handlers in any JS
file**. A user fills a cart, clicks Checkout, and nothing happens. Single
biggest gap in the repo.

### 2. No payment, no order capture, no backend
No Razorpay/Shopify/Stripe, no `fetch()` to anything. Cart lives only in
`localStorage('sva-cart')` — clearing the browser deletes the order, and we
never learn it existed.

### 3. Cart line-item split bug
`pdp.js:399` adds `"Himalayan Salt & A2 Ghee · The Tin 80g"`; `index.html:231`
and `collection.js` add the bare `"Himalayan Salt & A2 Ghee"`. The cart keys
on name, so **one tin becomes two lines**, and `addToCart` overwrites price
on merge. Users see duplicated products and wrong totals.

### 4. Newsletter captures nothing
`main.js:367-372` hides the form and shows success. The user is told they
subscribed; they didn't. A trust breach this brand specifically cannot afford.

### 5. No legal pages
Shipping, Returns, Privacy, Terms are specced in 04-ux-architecture.md and
do not exist as files. Indian D2C and every payment gateway require them for
onboarding. We also make hard commitments in copy — "30-day full refund, no
return shipping", "dispatch in 2 working days", "insured shipping" — with no
policy page behind them.

### 6. Fabricated social proof shipped as fact
`index.html:66` claims "4.9 · 2,400+ reviews"; `collection.js:7-22` hardcodes
per-SKU counts (812, 623, 291, 355, 502, 418); `pdp.js` ships named reviews
from people who don't exist. For a pre-launch brand these are invented —
an ASCI / CCPA-India dark-pattern exposure, and a direct contradiction of
06-cut-list.md #8. Note also that Product/Review JSON-LD is specced but
absent; adding it with these numbers would mean fake structured data to
Google.

### 7. FSSAI licence number is a placeholder
`10424999000123` in the footer. Publishing a fake licence number on a food
site is a regulatory problem, not a cosmetic one.

---

## P1 — Ships broken or invisible

### 8. No SEO infrastructure
Missing `robots.txt`, `sitemap.xml`, `favicon.ico`, `404.html`. No `canonical`
on any page. No `og:image` anywhere. Only `index.html` has any OG tags, so
every share of a PDP or the gifting page renders as a naked link. No JSON-LD
at all, against the full spec in 08-frontend-architecture.md §8.

### 9. 25MB of unoptimized assets
`pack-millet.png` is 2.8MB; four PNGs exceed 2.5MB each. All PNG, no
WebP/AVIF, no responsive `srcset`, and **0 of 17 images carry width/height**
— guaranteed CLS. 07-motion-spec.md promises LCP < 2.0s and CLS 0. On Indian
4G this currently fails both badly.

### 10. GSAP loads from CDN with no SRI and no local fallback
`index.html:686-687`. A third-party dependency on the homepage's motion with
no `integrity` hash. Blocked cdnjs degrades gracefully, but this is a
supply-chain surface on a script that can read the cart.

### 11. Zero analytics
No GA4/GTM/Plausible/Meta Pixel, no cookie consent. We cannot measure the
Home → PDP → Cart → Checkout funnel that 04-ux-architecture.md defines as the
KPI ladder. Launching blind.

### 12. Cart drawer is not accessible
Esc-to-close exists (`main.js:296`) but there is no `role="dialog"`, no
`aria-modal`, no focus trap, no focus return, no `inert` on the background.
Keyboard and screen-reader users tab into the page behind the open drawer.

### 13. Roast Week 29 is hardcoded in 8+ places
Across `index.html`, `collection.html`, `product.html`, `standards.html`
(which also hardcodes "Roast Week 29, 2026"). The roast date is our core
freshness ritual — it goes stale the week after launch and must be
hand-edited in every file.

### 14. Cart drawer logic is copy-pasted 5×
`openCart` / `closeCart` / `renderCart` / `FREE_SHIP = 999` are duplicated in
`main.js`, `pdp.js`, `collection.js`, `gifting.js`, `editorial.js`. Every cart
fix must be made five times — this is how gap #3 happened, and it will
happen again.

### 15. Product data forked across three files
Prices live in `pdp.js`, `collection.js`, `gifting.js` **and** hardcoded in
`index.html` — six places to change one price. `pdp.js` carries pouch/jar
prices (749/649) that exist nowhere else, so no other page can sell those
formats.

---

## P2 — Promised in the docs, absent in the build

- **Missing pages:** `/subscribe` (Standing Order landing), `/faq` and
  `/contact` as pages, `/gifting/corporate` lead form (currently a `mailto:`
  — no lead capture, no CRM).
- **Gifting flow gaps:** gift-note personalization, delivery-date picker, and
  the "no prices in the box" toggle — all specced in 04, absent from cart.
- **No GST/tax line and no shipping cost line** in the cart; only the
  free-ship threshold meter.
- **No inventory or sold-out state** anywhere. Every SKU is infinitely
  available.
- **No order confirmation, email, or account/reorder path.**
- **No repo hygiene:** not a git repository, no README, no `package.json`, no
  `.gitignore`, no deploy config. Nothing is version-controlled — one bad
  edit is unrecoverable.
- **No test suite** (`e2e/` and `tests/` are specced in 08, never created).

---

## Recommended sequence

| Phase | Scope | Outcome |
|---|---|---|
| **0. Safety net** (½ day) | `git init` + commit, README, images to WebP | Recoverable; 25MB → ~3MB |
| **1. Make it honest** (2–3 days) | Strip/flag fake reviews, real FSSAI number, 4 legal pages, newsletter wired to a real list | Legally publishable |
| **2. Make it sell** (1–2 weeks) | Choose Shopify Storefront or Razorpay; unify cart into one shared module; fix the line-item key bug; wire Checkout | **A user can actually buy** |
| **3. Make it findable** (3–4 days) | robots/sitemap/canonical/OG per page, JSON-LD with real ratings, favicon, 404 | Shareable and indexable |
| **4. Make it measurable** (2 days) | GA4 + consent, funnel events, Lighthouse CI | We can see what works |
| **5. Harden** (ongoing) | Cart a11y, roast week from one config, image dimensions, SRI | Meets the standard these docs already set |

**Phase 2 is the real project.** Everything else is days; the commerce stack
is the fork in the road — and 08-frontend-architecture.md already argues for
the Next.js + Shopify rebuild rather than bolting a gateway onto static HTML.
That decision is worth making before writing any more code.
