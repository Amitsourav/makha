# स्वsnacks — The Cut List
### Everything we removed or refused, and why

Premium is mostly subtraction. This document records every effect that was
cut from the build or refused during design review, so future designers and
developers know these were *decisions*, not omissions. Do not re-add anything
on this list without a stronger argument than the one that killed it.

---

## 1. Tin rotation/scale inside flavor cards — CUT (was built, then removed)
The flavor card already tilts in 3D under the pointer. A second transform
(the tin rotating and scaling) inside an already-transforming parent creates
compound motion that reads as jitter, not craft.
**Rule it produced:** one object, one motion. A container and its contents
never animate independently on the same trigger.

## 2. Per-letter headline animation — REFUSED
Letter-by-letter staggers on a Didone serif are 2019 portfolio-site grammar.
They slow reading, add ~60 DOM nodes per headline, and make type feel like a
special effect instead of a voice. Whole-line rises are calmer and faster.
**Exception that proves the rule:** the manifesto animates word-by-word —
there, controlling reading pace IS the point, and it's the only place.

## 3. Smooth-scroll hijacking on touch devices — DISABLED
Lenis runs on desktop pointers only. A phone's native momentum scroll is
already perfect; overriding it adds latency and makes the page feel like it's
fighting the thumb. Luxury on mobile = the OS feeling untouched.

## 4. Magnetic buttons / custom cursors / cursor trails — REFUSED
Agency-showreel grammar, not FMCG commerce. Anything that changes how the
pointer behaves adds one microsecond of doubt between finger and
Add to Cart — and that button is the entire business.

## 5. Cart confetti / celebration animations — REFUSED
Confetti is a discount-brand reflex; it congratulates the user for spending.
A quiet toast and a badge bump *confirm* instead of *celebrate*. Premium
brands assume the purchase was obviously correct.

## 6. Auto-playing ambient video or sound — REFUSED
Costs megabytes and dignity. Sound on load is hostile; background video
competes with the type, murders Lighthouse, and drains phone batteries.
The canvas particle field delivers "alive" at ~0 network cost.

## 7. Hero watermark parallax — REFUSED
The giant स्व watermark moving behind the headline would compete with the
particle field and the type. One viewport, one motion focus. The watermark's
job is stillness — it is the seal, not the show.

## 8. Fake urgency mechanics — REFUSED PERMANENTLY
No countdown timers, no "only 3 left!" stock counters, no fake "someone in
Mumbai just bought" popups. The brand's entire price premium rests on trust;
one fabricated signal bankrupts it. The only urgency allowed is true:
the weekly roast genuinely ships Friday (pulse dot, one line, no theatrics).

## 9. WebGL / Three.js product renders — REFUSED (for now)
Fake-photoreal 3D tins would read as CGI and undermine "real food, real
ponds." The honest ladder is: crafted SVG vessels today → real macro
photography at launch → optional true 3D scans later. Never the uncanny middle.

## 10. Scroll-jacking outside the story section — REFUSED
Exactly one pinned sequence exists (the category-expansion story), it shows
progress (01–04), and every nav anchor jumps past it. Nothing else may take
control of the scrollbar. Cinema is permitted; hostage-taking is not.

## 11. Skeleton loaders / spinners on the homepage — REFUSED
Nothing on the page loads slowly enough to justify them; adding them would
manufacture the feeling of waiting. The hero choreography IS the loading
state — by the time it finishes, everything is interactive.

## 12. Newsletter popup / exit-intent modal — REFUSED
The single most brand-cheapening pattern in e-commerce. The newsletter earns
subscribers with copy ("one email a month, written by a person") from its
place in the footer. A brand that interrupts you to say it's premium isn't.

## 13. Lenis smooth scrolling — CUT after real-device QA (was: desktop-only)
Shipped desktop-only, then failed on real hardware: buffered wheel input
plus a 1.15s ease read as "responds late, then lurches 3–4 sections" —
the opposite of luxury. Rule #3 said mobile premium = the OS untouched;
real-device QA proved it applies to desktops too. Native scroll now drives
ScrollTrigger directly. The grain overlay also lost its mix-blend-mode at
the same time (full-viewport blending recomposited every scroll frame).
Luxury is 1:1 input response; smoothness that costs responsiveness is lag
with good branding.

---

### The four-question test (apply before adding ANY new effect)
1. Does it build **desire**, prove **craft**, guide the **journey**, or
   collapse **risk**? (Must be yes to at least one.)
2. Does it run at 60fps on a mid-range phone using only transform/opacity?
3. Does it have a keyboard/touch/reduced-motion equivalent or fallback?
4. Would it still feel right in five years?
Four yeses or it doesn't ship.
