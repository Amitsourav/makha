# स्वsnacks — Loop 6: Motion Specification (v1.0)
### The complete motion system, as implemented in main.js / styles.css

Every animation must increase **desire**, **trust**, or **premium perception**.
Each entry below names which. Anything that can't name one is banned
(see 06-cut-list.md).

---

## 0. Motion tokens (the whole language)

| Token | Value | Used for |
|---|---|---|
| `--ease-lux` | `cubic-bezier(.16,1,.3,1)` | ALL choreography — long glide-out tail, zero bounce |
| `--ease` | `cubic-bezier(.22,.9,.24,1)` | Small UI (badges, arrows, FAQ icons) |
| Micro | 250–350ms | Buttons, badges, toggles |
| Standard | 500–700ms | Cards, tilts, figure crossfades |
| Editorial | 900–1100ms | Reveals, hero rises, gift lid |
| Ambient | 5–30s | Particles, stamp, ticker, drift |
| Stagger unit | 80–90ms | All sequences |
| Distance | 28px rise | All entrances (one physics, one world) |

Rules: transform + opacity ONLY (compositor-safe). No bounce/elastic easings —
overshoot is playful; premium is settled. One easing family site-wide so the
entire page moves like a single object.

---

## 1. GSAP architecture

Load: gsap.min.js + ScrollTrigger.min.js from CDN, `defer`, non-blocking.
Init flow (main.js):

```
initMotion()
├─ guard: REDUCED || CAPTURE || !gsap  → fallback path (§7)
├─ gsap.registerPlugin(ScrollTrigger)
├─ Lenis (desktop pointers only) → lenis.on('scroll', ScrollTrigger.update)
│    driven by gsap.ticker (single rAF loop for scroll + animation)
├─ ScrollTrigger.batch('.reveal', …)      — reveal system (§5)
├─ ScrollTrigger.create(story pin, …)     — scroll story (§2)
├─ per-line ScrollTriggers on .why__line  — manifesto scrub (§2)
└─ ScrollTrigger.create(giftbox, …)       — gift reveal (§6)
```

Design decisions:
- **State lives in CSS classes** (`.in`, `.is-active`, `.open`), GSAP only
  decides *when*. Benefit: identical visuals on the no-GSAP fallback path,
  and reduced-motion needs only CSS overrides.
- **One ticker** (gsap.ticker drives Lenis) — never two rAF loops fighting.
- `lagSmoothing(0)` — no catch-up jumps after tab switches.
- Hero load choreography is **pure CSS** (body.is-loaded + delays) — first
  paint must never wait for a CDN.

## 2. ScrollTrigger architecture

| Trigger | Config | Purpose (desire/trust/premium) |
|---|---|---|
| Story pin | `start: 'top top'`, `end: '+=280%'`, `pin: .story__pin`, `scrub: true` | Category-expansion narrative = brand scale. 280% = 70% scroll per chapter: enough to read, short enough to respect the user. **Desire + premium** |
| Story steps | progress → `floor(p*4)` → class swap; CSS crossfades 700ms | Discrete chapters, not soup; scrub-reversible both directions. |
| Manifesto lines | per-line, `start: 'top 82%'`, `end: 'top 34%'`, `scrub: .4` | Word-count maps to progress; sentence completes while still readable. `.4` scrub = slight lag = liquid feel. **Trust** (the thesis lands) |
| Gift lid | `start: 'top 75%'`, onEnter open / onLeaveBack close | One-time theatre at exactly the right moment; replays only on genuine re-approach. **Desire** |
| Reveal batch | `start: 'top 88%'`, `once: true` | §5. Never re-hides — content that vanishes behind you reads as broken. **Trust** |

Pin rule: exactly ONE pinned section per page. Anchors jump past it.

## 3. Parallax system

Only true parallax: the hero particle field (canvas, not DOM).
- Pointer target → lerp factor **0.045** per frame (≈600ms settle): liquid,
  never twitchy. Depth `z ∈ [0.25, 1]` scales offset (±46px x, ±30px y),
  size, and wobble — near objects move more = real depth. **Desire**
- Scroll input: first-viewport progress tints particles cream→flavor hues
  (85% max blend) — "makhana becomes flavour" foreshadowing. **Desire**
- Ambient wobble: `sin(t*.0006 + seed) * 8px * z` — slow breathing.
- Idle drift: ±0.012%/frame with edge wrap; field never freezes, never rushes.
- NO DOM parallax (backgrounds, watermarks, sections): background type
  competing for attention is noise (cut list §7).

## 4. Hover system

Grammar: **surfaces lift, contents stay** (one object, one motion).

| Element | Motion | Why |
|---|---|---|
| Buttons | rise 2px + shadow bloom, 350ms lux | Affordance; shadow = physical lift. **Trust** |
| Collection cards | rise 8px + shadow-2; tin trio fans ±3° (one coordinated move) | Shelf theatre. **Desire** |
| Flavor cards | pointer tilt ±5°/6° via `perspective(900px)`, rAF-throttled, + 4 flavor-color particles fade in (drift 5–7s, staggered delays) | The card behaves like a thing you pick up; flavour as atmosphere. **Desire** |
| Vessels | tilt + SVG rises 8px + stage brightens | Material appreciation. **Premium** |
| Video cards | rise 6px + play button 1.1× | Signals playability. **Trust** |
| Links | arrow +4–5px x-shift, border darkens | Direction affordance. |

Tilt engine: shared `[data-tilt]` handler; ±5–6° max (>8° reads as a toy);
rAF-throttled (one transform per frame); pointer-only (`hover:none` skips);
resets to identity on leave. Hover states have :focus-within parity.

## 5. Reveal system

One entrance for everything: **opacity 0→1 + translateY 28px→0, 900ms lux**.
- Trigger: ScrollTrigger.batch at 88% viewport (fallback: IO at threshold .12,
  rootMargin -40px).
- Stagger: `.d-1…d-5` = 80ms steps, max 5 per viewport-group — beyond 400ms
  total, staggering reads as waiting. `once: true` always.
- Hero variant (`.hero-rise`): same physics, 1s, 90ms stagger, fired by
  `body.is-loaded` on first rAF — the page introduces itself in reading order:
  eyebrow → 3 title lines → sub → CTAs → proof. **Premium** (composure)

## 6. Product animation system

- **Tins (SVG)**: never animate internally; they move only with their
  surface (card tilt/fan). Product = still life; the stage moves. **Premium**
- **Hero particle field**: the product floating in air — the desire engine.
- **Story figures**: crossfade + scale .82→1 + rotate −4°→0, 700ms — new
  chapter "settles into place." **Desire**
- **Gift box**: lid `translateY(-46px) rotate(-7deg)`, 1.1s lux — slow enough
  to feel the hinge; the unboxing IS the product. **Desire**
- **Roast stamp**: 26s/rev, linear, infinite — watch-movement pace; provenance
  as living seal. **Trust + premium**
- **Cart feedback**: badge 1.45× bump 260ms; toast rise+fade 350ms, 2.4s hold;
  button label swaps to "Added ✦" for 1.4s. Confirmation, not celebration.
  **Trust**
- **Ticker**: 30s linear loop, duplicated track, translateX(-50%). Drumbeat
  of facts. **Trust**
- **Pulse dot**: 2s ring expand — true urgency at minimum volume. **Trust**

## 7. Mobile & degradation system

Philosophy: mobile premium = the OS feeling untouched.
- **Lenis OFF on touch** — native momentum scroll is already correct.
- **Tilt OFF on touch** (`hover: none`) — no orientation gimmicks.
- Particles: 12 (vs 22 desktop); DPR capped at 2; canvas rAF paused via
  IntersectionObserver when hero off-screen.
- Story pin: works via ScrollTrigger on mobile; touch gets shorter effective
  chapters (natural faster scroll) — acceptable, tested.
- Hover-dependent moments (flavor particles) are enhancements — never carry
  information. Ratings, prices, names are always static text.
- **prefers-reduced-motion**: all animation/transition killed by CSS; reveals
  forced visible; story becomes stacked 4-up grid; gift box pre-opened;
  canvas removed entirely. Full content, zero motion.
- **No-GSAP/CDN-fail path**: IO reveals + stacked story + gift box opens via
  IO. The site is never broken, only calmer.
- Perf budget: 60fps on mid-range Android; transform/opacity only; zero
  layout/paint properties animated; will-change only on tilting cards.

---

## QA checklist (run before any release)
1. 4× CPU throttle: hero holds ~60fps; scroll story scrubs without jank.
2. Tab-away 30s → return: no animation catch-up jump (lagSmoothing 0).
3. Keyboard-only pass: every hover state reachable via focus.
4. prefers-reduced-motion: zero movement, all content present.
5. Block CDN: site renders, reveals fire, story stacks, nothing pins.
6. iOS Safari: pin section no address-bar jump (svh units, not vh).
7. Every animation answers: desire, trust, or premium? If unclear — cut it.
