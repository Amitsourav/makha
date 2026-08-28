# स्वsnacks — Loop 4: Website Architecture (v2, post-critique)

Goal: premium brand experience + high conversion. Governing principle on every
page: **desire → proof → price.** Emotion first, evidence second, transaction
third. Never lead with a discount.

## 1. Sitemap (Phase 1 → Phase 2)

PHASE 1 (launch)
/                          Home — flagship experience (built)
/collections/makhana       The Makhana Collection (6 SKUs)
/products/[slug]           PDP ×6 + tasting-library PDP
/gifting                   Gifting hub (retail tiers + corporate teaser)
/standard                  The Standard — why it costs more (grade, fire, tin)
/story                     Our Story — Mithila, farmers, founders' letter
/subscribe                 Standing Order landing
/cart (drawer + page) → /checkout (Razorpay/Shopify)
/faq · /contact · /policies/{shipping,returns,privacy,terms}

PHASE 2
/collections/jars          Premium Jars (glass, reserve ceramic)
/collections/popcorn …     as the library grows
/gifting/corporate         Lead-gen with tier table, co-branding, GST flow
/journal + /journal/[slug] Editorial SEO engine
/account                   Orders, buy-again, subscription self-serve

Nav stays at 4 links + Shop CTA + cart, always. The long tail lives in the
footer. Every added nav item is a tax on the four that convert.

## 2. Homepage architecture (built; the logic, documented)
Order = a desire funnel: Hero (wow + 2 CTAs) → Scroll story (future scale =
brand confidence) → Why We Exist (belief) → Collections (orientation) →
Flavor gallery (SHOP — the money section, reachable in one click from nav/hero,
never gated behind the cinematic sections) → Packaging (tangibility) →
Gifting (second revenue door) → Social proof + trust bar (risk collapse) →
Standing Order (retention seed) → FAQ (objection cleanup) → Footer capture.
Rule: the pinned story must always be skippable — anchor links jump past it;
it plays only on organic scroll.

## 3. Collection page (/collections/makhana)
1. Editorial header: title, one-line promise, roast-week pulse.
2. Filter by MOOD, not macros — Quiet / Loud / Sweet / The Occasion — plus
   heat level. (Health filters would re-anchor us as a diet brand.)
3. Grid in "house order" (price ladder 349→499) with quick-add; best-seller
   and flagship tags; per-SKU ratings.
4. Mid-grid band: Tasting Library bundle (AOV driver, placed after row 1).
5. Footer of page: The Standard link ("why one seed in fourteen") +
   Standing Order strip. No infinite scroll; 6–12 SKUs is a library, not a feed.

## 4. Product page (PDP — the conversion core)
Above the fold:
- LEFT gallery: tin render/photo, macro texture, lifestyle, 15s loop video.
- RIGHT buy box: name + mood line → rating (anchor-links to reviews) → price
  with per-100g line → format selector (80g tin / 200g pouch / 150g jar) →
  purchase toggle: One-time (default) vs Standing Order (−15%, visibly cheaper,
  never pre-selected) → quantity → ADD TO CART (sticky bar on mobile after
  scroll) → trust chips: 30-day guarantee · ships from Roast No. NN Friday ·
  free shipping ₹999 → pincode ETA (Phase 2, needs logistics API).
Below the fold, in order:
1. Tasting notes (sensory wheel, 3 words max per axis)
2. Ingredients — full list set LARGE ("read in one breath" as UI)
3. The Grade — 24mm ring diagram, link to /standard
4. Pairings ("serve with") — editorial, premium cue
5. Reviews with photos, keyword filters
6. Complete the shelf — cross-sell rail (excludes items in cart)
7. PDP FAQ (freshness, shelf life, shipping)
Schema.org Product + Review markup throughout.

## 5. Gifting pages
/gifting: occasion tabs (Diwali · Weddings · Thank-you · Corporate) →
tiered boxes (₹1,999 Tasting Library / ₹3,499 Reserve / custom) → gift-note
personalization at cart → delivery-date picker → "no prices in the box" toggle.
/gifting/corporate (Phase 2): lead form (name, company, qty band, date),
tier pricing table, logo co-branding preview, GST invoicing note, timeline
promise ("dispatch in 5 working days"), client logos. KPI = qualified leads,
not cart adds — do not force corporate buyers through retail checkout.

## 6. Story pages
/standard — the rational spine: grading rings, one-in-fourteen, the fire, the
tin, farmer pay. Linked from every PDP price ("why ₹349?"). Ends in Shop CTA.
/story — the emotional spine: Mithila ponds, Mallah divers, founders' letter,
photography-led. Ends in Tasting Library CTA (story-readers gift more).
Rule: neither page may mention discounts; they justify price, never apologize.

## 7. About/contact
Founders' letter (signed), credentials block (FSSAI lic., GI tag, lab reports
downloadable), press kit, WhatsApp concierge, response-time promise.

## User journeys (personas from Loop 1)
1. **Arrived Professional** (IG ad → home): needs wow in 3s, proof in 10s,
   product in one click. Path: hero → flavors → PDP → drawer → checkout.
   Risk-collapse: guarantee beside ATC; free-ship meter in drawer.
2. **Considered Gifter** (search/referral → /gifting): needs tiers, dates,
   "will it impress" reassurance. Path: gifting → box PDP → date picker →
   checkout; corporate forks to lead form.
3. **Repeat buyer** (email/WhatsApp → PDP or /account): needs one-tap
   reorder ("Buy again"), then a Standing Order nudge at order 2–3 with
   concrete math ("you'd have saved ₹157 this quarter").

## Conversion strategy (KPI ladder)
- Home→PDP: flavor cards with quick-add; nav Shop always one tap.
- PDP→Cart: buy box discipline; guarantee adjacency; reviews above cross-sell.
- Cart→Checkout: guest checkout, UPI + cards + COD (small COD fee to damp
  RTO without killing the ~60% of Indian D2C buyers who want it), express pays.
- AOV: free-ship threshold meter, Tasting Library, gift-wrap ₹99 add-on.
- Retention: roast-week emails (product IS the calendar), Standing Order,
  Diwali reactivation. Urgency only when true (roast ships Friday). No timers,
  no fake stock counts — one fake signal would bankrupt the trust the whole
  brand runs on.

## Upsell strategy
- Drawer: free-ship progress → one-tap "complete the shelf" (cheapest missing
  flavor) → gift-wrap toggle.
- PDP: format-size math (jar is better ₹/100g), pairs-with rail, subscribe
  toggle savings shown in ₹ not %.
- Price anchoring: ₹499 truffle anchors tins; ₹1,999 Library anchors gifting;
  corporate tiers anchor upward from there.
- Post-purchase (not on-site): order-2 coupon → subscription conversion.

## Critique log (v1 → v2)
- *Nav bloat risk* → hard cap: 4 links + Shop; footer owns the rest.
- *Journal at launch is vanity* → Phase 2; launch with 4 cornerstone pieces.
  Noted tension: search volume lives in health queries ("makhana benefits"),
  but health-first content would undo the taste-first brand. Resolution:
  answer health queries honestly in FAQ-structured pages; keep the Journal
  for provenance, taste and gifting stories.
- *Subscription pushed too early = commitment aversion* → one-time is always
  default; Standing Order is offered with math, post-purchase and at order 2.
- *Pincode ETA needs an API we don't have* → phased, not faked.
- *Corporate buyers forced through retail cart* → split to lead-gen flow.
- *Everything-at-launch scope* → two phases; Phase 1 is 9 templates, all
  reusing the built design system.
