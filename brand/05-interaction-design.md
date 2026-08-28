# स्वsnacks — Loop 5: Interaction Design Spec (v2, post-cut)

Philosophy: **luxury movement** — slow, smooth, natural, one easing curve
(cubic-bezier(.16,1,.3,1)), transform/opacity only. An interaction earns its
place by doing one of four jobs: (1) building desire, (2) proving craft,
(3) guiding the journey, (4) collapsing risk. Anything decorative-only dies.

## KEPT — the interaction system, each with its reason

| # | Interaction | Spec | Why it exists |
|---|---|---|---|
| 1 | Hero load choreography | 6 elements rise 28px/1s, 90ms stagger | First impression = composed, unhurried. Confidence is the message. |
| 2 | Makhana particle field | ≤22 canvas spheres, depth-layered, 2×DPR cap | The "3D floating makhana" brief, honestly: it puts the product in the air without fake WebGL renders. Desire. |
| 3 | Mouse parallax on field | lerp 0.045, ±46px by depth | Depth = physical presence. Slow lerp keeps it liquid, never twitchy. |
| 4 | Scroll flavor-tinting | field lerps cream→flavor hues over first viewport | The brief's "makhana becomes flavor particles" — foreshadows the gallery. Poetic, nearly free. |
| 5 | Rotating roast stamp | 26s/revolution | Provenance as a living seal. 26s is watch-movement slow — luxury pace. |
| 6 | Scroll cue | 2.2s repeating drop | Guides the journey; full-screen heroes need an exit signpost. |
| 7 | Ticker marquee | 30s loop, one direction | Brand rhythm + fact repetition (grade, no palm oil). Proof by drumbeat. |
| 8 | Pinned scroll story | 280% scrub, 4 steps, crossfade+scale | The category-expansion narrative IS the ₹100-crore claim. Skippable via anchors — cinema must never hold commerce hostage. |
| 9 | Story progress meter | 01–04 + scrub bar | Pinned sections without progress feel broken. Orientation. |
| 10 | Word-by-word manifesto | scrubbed, completes by 34% viewport | Forces the reading pace of a spoken line. The copy is the brand thesis; the motion makes it land. |
| 11 | Collection card hover | lift 8px, shadow bloom, tin trio fans, arrow slides | Affordance + shelf theatre. One coordinated move, not three competing ones. |
| 12 | Flavor card tilt | ±5–6°, rAF-throttled, desktop only | Tactility — the card behaves like a thing you pick up. Purchase intent is physical. |
| 13 | Flavor hover particles | 4 dots in flavor color, fade+drift on hover/focus | The emotional flavor signal (brief: "floating particles") — flavor as atmosphere, not nutrition table. |
| 14 | Gift lid reveal | lid lifts 46px + −7° when section enters, reverses on leave-back | The unboxing moment IS the gifting product. One-time theatre at exactly the right scroll. |
| 15 | Vessel hover | tilt + svg rises 8px + stage brightens | "3D rotating presentation," honest version. Material appreciation. |
| 16 | Video-card hover | lift + play button scales 1.1 | Signals playability; play button is the social-proof CTA. |
| 17 | Cart drawer | 550ms slide, scrim fade, Esc/scrim close | Commerce speed with luxury damping. Never a page reload. |
| 18 | Cart badge bump + toast | 260ms scale; 2.4s toast | Instant feedback = trust that the tap worked. |
| 19 | Free-ship meter copy | live ₹-to-go in drawer | The single highest-ROI AOV interaction on the site. |
| 20 | Roast pulse dot | 2s ring | True urgency (roast really ships Friday). Quietest possible signal. |
| 21 | FAQ + rotate, single-open | 45° plus | Objection cleanup with tidy state; single-open keeps focus. |
| 22 | Button/link hovers | −2px + shadow / arrow +4px | Consistent affordance grammar site-wide. |

## CUT — and why (the discipline that makes the rest premium)

1. **Tin rotate/scale inside flavor cards** — REMOVED. The card already tilts;
   a second transform inside a transforming parent reads as jitter, not craft.
   One object, one motion.
2. **Hero watermark parallax** (considered) — REJECTED before build. The type
   is the hero; background type competing for motion attention is noise.
3. **Per-letter headline animation** (considered) — REJECTED. Letter-stagger
   on a Didone headline is 2019 portfolio-site grammar; whole-line rise is
   calmer and reads faster. Words animate only in the manifesto, where reading
   pace is the point.
4. **Lenis on touch devices** — DISABLED. Native momentum scroll on phones is
   already correct; hijacking it is the opposite of premium.
5. **Cursor effects / magnetic buttons** — REJECTED. Agency-demo grammar, not
   FMCG commerce. Nothing may sit between finger and Add-to-cart.
6. **Confetti / cart celebration** — REJECTED. A toast and a badge bump are
   confirmation; confetti is a discount-brand reflex.
7. **Auto-playing ambient video / sound** — REJECTED. Performance and dignity.

## Accessibility & performance guarantees
- Every hover has a keyboard/touch equivalent (focus-visible rings; flavor
  particles fire on :focus-within; tilt is enhancement-only).
- prefers-reduced-motion: all choreography off, all content visible.
- Canvas pauses off-screen; tilt is rAF-throttled; all motion is
  transform/opacity; no layout thrash. 60fps is a budget, not a hope.
