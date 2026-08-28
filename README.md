# स्वsnacks — House of Mithila

Premium hand-graded Mithila makhana. Static marketing + commerce site.

## Stack
Plain HTML/CSS/JS. No build step. GSAP + ScrollTrigger from CDN for scroll
motion, with a full no-JS / no-GSAP / reduced-motion fallback path.
Deployed on Vercel; payments via Razorpay.

## Local development
```bash
python3 -m http.server 4321      # then open http://127.0.0.1:4321
```
Debug helper: `?jump=<section-id>` on the homepage scrolls straight to a
section (e.g. `index.html?jump=gifting`).

## Pages
| File | Purpose |
|---|---|
| `index.html` / `main.js` | Homepage — particle hero, pinned scroll story, cart |
| `collection.html` / `collection.js` | Shelf I, the six volumes, mood filters |
| `product.html` / `pdp.js` | PDP, `?v=<slug>` (salt, peri, bbq, cheese, choc, truffle) |
| `gifting.html` / `gifting.js` | Gift box builder |
| `standards.html`, `house-of-mithila.html` / `editorial.js` | Editorial |
| `packaging-board.html` | Internal packaging system board (not linked in nav) |

`styles.css` is the shared design system; each page adds its own stylesheet.
Cart state is shared across pages via `localStorage('sva-cart')`.

## Assets
All images are WebP. Sources are PNG/JPG in git history at the initial
commit — regenerate with:
```bash
cwebp -q 88 -alpha_q 100 -m 6 in.png -o out.webp    # transparent packs
cwebp -q 82 -m 6 in.jpg -o out.webp                 # photography
```
Every `<img>` carries intrinsic `width`/`height` — keep it that way, CLS
budget is 0.

## Docs
`brand/` holds the full brand system, 01–09, plus `10-launch-readiness.md`
(the production gap audit and phase plan). **`06-cut-list.md` is binding:**
it records effects that were deliberately removed. Do not re-add anything
on that list without a stronger argument than the one that killed it.
