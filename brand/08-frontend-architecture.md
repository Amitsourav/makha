# स्वsnacks — Loop 7: Production Frontend Architecture (v1.0)
### Next.js 15 · TypeScript · Tailwind v4 · GSAP · Framer Motion · Lenis · Shopify · Sanity

Target: Lighthouse 90+ (mobile), production-ready, mobile-first.
Prime directive carried over from the static build: **server-render everything,
hydrate almost nothing.** Motion is an island, commerce is an island,
everything else is HTML.

---

## 1. Folder structure

```
svasnacks/
├── app/
│   ├── layout.tsx                    # fonts, providers, announce bar, header/footer
│   ├── page.tsx                      # Home (server) — composes sections/
│   ├── (marketing)/
│   │   ├── standard/page.tsx         # The Standard (static, ISR daily)
│   │   ├── story/page.tsx
│   │   ├── gifting/page.tsx
│   │   └── journal/[slug]/page.tsx   # Phase 2
│   ├── (shop)/
│   │   ├── collections/[handle]/page.tsx
│   │   └── products/[handle]/page.tsx
│   ├── api/
│   │   ├── revalidate/route.ts       # Shopify + Sanity webhooks → revalidateTag
│   │   └── draft/route.ts            # Sanity preview mode
│   ├── sitemap.ts  robots.ts  manifest.ts
│   └── opengraph-image.tsx           # brand-tokened OG via ImageResponse
├── components/
│   ├── ui/                           # Button, Badge, Price, Stars, Accordion, Input
│   ├── layout/                       # Header, Footer, AnnounceBar, CartDrawer, Toast
│   ├── motion/                       # the ONLY animation-aware components
│   │   ├── MotionProvider.tsx        # reduced-motion/touch context
│   │   ├── LenisProvider.tsx         # desktop-only smooth scroll
│   │   ├── Reveal.tsx                # entrance system
│   │   ├── TiltCard.tsx              # pointer tilt
│   │   ├── ParticleField.tsx         # hero canvas (dynamic, ssr:false)
│   │   ├── ScrollStory.tsx           # pinned narrative
│   │   └── WordReveal.tsx            # manifesto scrub
│   ├── product/                      # FlavorCard, BuyBox, VariantSelector,
│   │   TinRender, RatingSummary, CrossSellRail
│   └── sections/                     # Hero, Manifesto, CollectionsGrid,
│       FlavorGallery, PackagingShowcase, GiftingSection, SocialProof,
│       StandingOrder, FAQSection      (server components; motion via children)
├── lib/
│   ├── shopify/
│   │   ├── client.ts                 # typed Storefront fetch w/ cache tags
│   │   ├── queries/  mutations/      # .graphql + generated types (codegen)
│   │   └── adapters.ts               # Shopify → domain types (never leak API shape)
│   ├── cms/
│   │   ├── sanity.client.ts
│   │   └── schemas/                  # see §5
│   ├── motion/tokens.ts              # THE motion constants (mirrors 07-motion-spec)
│   ├── seo/jsonld.ts                 # Product/Org/FAQ/Breadcrumb builders
│   └── utils.ts
├── hooks/                            # useCart, useTilt, usePrefersReducedMotion
├── store/cart.tsx                    # cart context + optimistic reducer
├── styles/globals.css                # Tailwind v4 @theme — design tokens (§3)
├── content/fallback/*.json           # CMS-absent fallbacks (site never breaks)
├── public/fonts/                     # self-hosted via next/font/local if needed
└── e2e/  tests/                      # Playwright + vitest + axe
```

## 2. Component structure & hydration policy

Three tiers, enforced in review:
1. **Server components (default)** — all `sections/`, all pages. Zero JS shipped.
2. **Client islands** — `motion/*`, `CartDrawer`, `BuyBox`, `FAQAccordion`.
   Each begins with `'use client'` and must justify its bundle bytes.
3. **Deferred islands** — `ParticleField`, `ScrollStory` load via
   `next/dynamic({ ssr:false })` after first paint; GSAP itself is imported
   *inside* those chunks, so gsap+ScrollTrigger (~30KB gz) never blocks TTI.

Composition rule: server sections receive motion as wrappers —
`<Reveal delay={1}><h2>…</h2></Reveal>` — so content is in the HTML stream
(SEO, no CLS) and only the wrapper hydrates.

**GSAP vs Framer Motion division of labor (hard rule):**
- GSAP + ScrollTrigger → scroll-driven and timeline choreography
  (story pin, word scrub, reveals, gift lid).
- Framer Motion → state-driven presence (CartDrawer slide, Toast,
  variant-selector layout, button taps on touch).
- Never both on one element. Lenis feeds ScrollTrigger only.

## 3. Design system (Tailwind v4, CSS-first)

`styles/globals.css`:
```css
@import "tailwindcss";
@theme {
  --color-cream: #F8F4EE;    --color-espresso: #2C1D18;
  --color-cocoa: #5C4033;    --color-beige: #EFE7DA;
  --color-copper: #A97C50;   --color-copper-2: #C9A578;
  --color-sindoor: #B0501C;
  --color-flavor-salt: #E8DCC8;  --color-flavor-peri: #B0501C;
  --color-flavor-bbq: #8A5A3C;   --color-flavor-cheese: #B98E4A;
  --color-flavor-choc: #3B2A1E;  --color-flavor-truffle: #2E2A26;
  --font-display: var(--font-rozha);   /* next/font variables */
  --font-body: var(--font-hanken);
  --radius-s: 8px; --radius-m: 16px; --radius-l: 28px;
  --shadow-1: 0 1px 2px rgb(44 29 24 / .05), 0 8px 24px rgb(44 29 24 / .07);
  --shadow-2: 0 2px 4px rgb(44 29 24 / .06), 0 24px 56px rgb(44 29 24 / .14);
  --ease-lux: cubic-bezier(.16,1,.3,1);
}
```
- Fonts via `next/font/google`: Rozha One (latin+devanagari subsets) and
  Hanken Grotesk — self-hosted at build, zero layout shift, no Google request.
- UI primitives typed with `cva` variants (`<Button intent="dark|ghost|cream">`)
  mirroring the built CSS exactly.
- `lib/motion/tokens.ts` exports durations/easings/staggers so GSAP code and
  Tailwind transitions read the same numbers (single source: 07-motion-spec).

## 4. Animation system

```tsx
// MotionProvider — every motion component consumes this
const ctx = { reduced: prefersReducedMotion(), touch: !window.matchMedia('(hover:hover)').matches }
```
- `LenisProvider`: mounts only `!touch && !reduced`; single rAF via gsap.ticker.
- `Reveal`: CSS class state; ScrollTrigger.batch when GSAP present, IO otherwise
  — same DOM, same classes as the static build (drop-in port).
- `ScrollStory`: `useGSAP()` (official hook) with `gsap.context` scoping +
  cleanup; pin/scrub config verbatim from 07-motion-spec §2; renders the
  stacked 4-up grid on server and enhances to pinned on the client — the
  no-JS/reduced path is the SSR output itself.
- `ParticleField`: the audited canvas, unchanged; `dynamic(() => import(...),
  { ssr:false, loading: () => null })`; respects ctx flags.
- CartDrawer (Framer): `<AnimatePresence>` slide with the 550ms lux tween;
  focus-trap + inert background (upgrades the static build's a11y).

## 5. CMS architecture (Sanity)

Split of truth — never duplicated:
- **Shopify owns**: products, variants, prices, inventory, cart, checkout.
- **Sanity owns**: everything editorial — keyed to Shopify handles.

Schemas:
```
productEnrichment { shopifyHandle, moodLine, flavorKey, colorHex, indexLabel,
                    tastingNotes[], pairings[], gallery[], faq[] }
homepage          { heroLines[], manifesto[], sectionOrder[], pressLogos[] }
roastWeek         { number, shipsOn, potency: singleton }   ← powers the pulse
giftingTier       { title, price, contents[], occasions[] }
testimonial       { quote, name, city, videoUrl?, colorHex }
journalPost       { … Phase 2 }
siteSettings      { announceBar, freeShipThreshold, guaranteeCopy }
```
Flow: GROQ fetch in server components → `sanityFetch` with tags →
Sanity webhook hits `/api/revalidate` → `revalidateTag('homepage')`.
Draft mode for previews. `content/fallback/*.json` used when env vars absent —
the site must build and demo without any external account.

## 6. Shopify integration (Storefront API)

```ts
// lib/shopify/client.ts — typed fetch, tag-based cache
export async function sf<T>(query: string, vars?: object, tags?: string[]) {
  const res = await fetch(process.env.SHOPIFY_STOREFRONT_URL!, {
    method: 'POST',
    headers: { 'X-Shopify-Storefront-Access-Token': TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: vars }),
    next: { tags, revalidate: 3600 },
  })
  …
}
```
- **Reads** (server): `productByHandle`, `collectionWithProducts` — tagged
  `product:<handle>` etc.; Shopify webhook (`products/update`) → revalidateTag.
- **Metafields**: `svasnacks.roast_week`, `svasnacks.grade`, `svasnacks.flavor_key`
  — provenance data lives with the product, not hardcoded.
- **Cart**: Storefront Cart API. `cartId` in httpOnly cookie; mutations via
  Server Actions (`cartCreate`, `cartLinesAdd/Update/Remove`); optimistic
  reducer in `store/cart.tsx` so the drawer bumps instantly, reconciles on
  response. Free-ship meter reads `cart.cost.subtotalAmount`.
- **Checkout**: `cart.checkoutUrl` → Shopify-hosted (UPI/COD/cards via
  Indian gateway app). We never touch payment data.
- **Subscriptions**: selling-plan-aware buy box (Skio/Appstle apps expose
  sellingPlanGroups through the same API) — Phase 2, UI toggle already specced.
- Adapters map API → domain types; components never see Shopify's shape.

## 7. Performance (Lighthouse 90+ is a budget, not a hope)

| Budget | Target |
|---|---|
| JS first load (home) | < 120KB gz total; < 40KB before deferred islands |
| LCP (mobile) | < 2.0s — hero H1 is the LCP: server-rendered text, zero wait |
| CLS | 0 — fonts via next/font (size-adjust), aspect-ratio on all media |
| INP | < 200ms — tilt rAF-throttled, canvas paused off-screen |

Tactics: RSC-by-default (§2); GSAP/Lenis/canvas in deferred chunks on idle;
Framer Motion tree-shaken via `LazyMotion`+`domAnimation` (~5KB);
`next/image` AVIF/WebP with explicit sizes; static SVG tins inlined (no
requests); preconnect to `cdn.shopify.com`; ISR everywhere (no runtime CMS
calls on hot paths); Partial Prerendering for PDP (static shell + dynamic
price/inventory slot); Vercel Analytics + `useReportWebVitals` wired to a
dashboard. CI gate: Lighthouse-CI on PR, fails under 90 mobile.

## 8. SEO architecture

- **Metadata API** per route: title template `%s — स्वsnacks`, canonical,
  OG/Twitter; `opengraph-image.tsx` renders brand-tokened OG cards at the
  edge (espresso ground, Rozha wordmark, flavor color band).
- **JSON-LD** (`lib/seo/jsonld.ts`): Organization + `Product` (offers,
  aggregateRating, brand) on PDPs, `BreadcrumbList`, `FAQPage` on FAQ/PDP.
- `sitemap.ts` composes static routes + Shopify handles at build/ISR;
  `robots.ts` allows all, points to sitemap.
- Semantic HTML already proven in the static build (single h1, landmark
  nav/main/footer, alt text policy); hreflang deferred until hi-IN content
  exists (per Loop 4, no fake internationalization).
- Journal (Phase 2) = the organic engine; FAQ pages answer health queries
  honestly without re-anchoring the brand (Loop 4 resolution).

## Migration map (static build → this architecture)
| Today (built & verified) | Becomes |
|---|---|
| index.html sections | `components/sections/*` (server) |
| styles.css tokens | `@theme` in globals.css (values identical) |
| main.js canvas | `motion/ParticleField.tsx` (verbatim logic) |
| main.js ScrollTriggers | `ScrollStory`, `WordReveal`, `Reveal` |
| cart Map + drawer | `store/cart.tsx` + Storefront Cart API |
| SVG defs | `TinRender`/vessel components (typed props: flavorKey) |

## Critique log (v1 → shipped decisions)
- *Two animation libraries is bundle bloat* → made structural: GSAP only in
  deferred islands, Framer only via LazyMotion; division-of-labor rule in §2.
  Combined motion cost after defer: ~35KB gz, none of it blocking.
- *Tailwind rewrite risks design drift* → tokens ported byte-identical; the
  static build stays in repo as the visual reference implementation.
- *CMS+commerce double fetch on PDP* → one server pass, `Promise.all`,
  both tagged; PPR keeps shell static.
- *Env-less dev breaks demos* → `content/fallback` JSON path is mandatory;
  `pnpm dev` works with zero external accounts.
- *Lighthouse claims without CI are fiction* → LHCI gate in the pipeline,
  not a launch-week hope.
