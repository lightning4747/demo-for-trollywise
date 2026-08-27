# TrollyWise Landing Page — Design Document

**Scope:** Landing page only (Hero with 3D model → Features → Pricing → CTA)
**Theme:** Same system as the client portal — shadcn `ocean-breeze`, dark-first, cinematic
**Reference:** See `trollywise-design.md` for the full token system, type roles, and signature element (the "trolly glow"). This doc applies that system to the landing page and does not repeat the token tables.

---

## 1. Placeholder product data (fill-in, since no real spec exists yet)

Use this consistently across hero, features, and pricing — so the page reads as one coherent product, not scattered filler.

**Product name:** TrollyWise Smart Cart — Model **TW-1**

**Tagline:** "The cart that knows your store."

**Specs (footer strip / spec sheet, shown small and mono):**
| Spec | Value |
|---|---|
| Battery life | Up to 14 hours continuous use |
| Charging | Dock-based, 3.5 hr full charge |
| Display | 10.1" anti-glare touchscreen |
| Sensors | Weight-sensing base + 4x object-detection cameras |
| Connectivity | Wi-Fi 6, Bluetooth 5.2, offline sync fallback |
| Weight capacity | 40 kg basket load |
| Cart weight | 18 kg (empty) |
| Build | IP54-rated, reinforced polymer frame |

**Three core features (for the Features section):**
1. **Scan-as-you-go** — Items are recognized automatically as they're placed in the cart, no barcode scanning needed.
2. **Live running total** — Shoppers see their bill update in real time on the cart's screen, no surprises at checkout.
3. **Store insights for owners** — Every cart feeds anonymized foot-traffic and product-interaction data back to a dashboard, so store owners understand shopper behavior.

**Pricing framing:** Since TrollyWise has no live customers yet, don't present tiered SaaS pricing (would look invented and undercut credibility with investors). Instead, present **one plan: "Demo Program"** — ₹25,000 for a 15-day in-store trial, framed as the entry point, not a permanent price list. This also ties directly into the client portal's actual booking flow, so the landing page's CTA and the portal's payment amount agree with each other.

---

## 2. Hero section

### Layout
Full-viewport hero. Dark canvas (`background` token). The `.glb` model is the entire right ~55–60% of the viewport on desktop (left-aligned copy, right-aligned object) — this avoids the centered-hero SaaS default and gives the 3D model room to breathe and rotate without colliding with text.

On mobile: model stacks above the copy, scaled down, auto-rotate only (drag-to-rotate is a desktop-hover-intent interaction — see §3).

```
Desktop:
┌──────────────────────────────────────────────┐
│  [eyebrow: TW-1 · Smart Shopping Cart]        │
│                                                │
│  The cart that                    [ 3D MODEL  │
│  knows your store.                  glb, glow │
│                                      behind it,│
│  Real-time recognition,             drag/auto-│
│  live totals, and shopper           rotate ]  │
│  insight — in every aisle.                    │
│                                                │
│  [ See how it works ↓ ]                       │
└──────────────────────────────────────────────┘
```

### Copy
- **Eyebrow** (Plex Mono, small, letter-spaced, muted-foreground): `TW-1 · SMART SHOPPING CART`
- **Headline** (Lora, largest scale, foreground color): "The cart that knows your store."
- **Subhead** (DM Sans, muted-foreground, one line): "Real-time item recognition, live running totals, and shopper insight — in every aisle."
- **Primary CTA** (Button, primary-green fill): "See how it works" — scrolls smoothly to Features.
- No secondary CTA in the hero itself — keep it to one decisive action, per the brief.

### The trolly glow, applied here
This is the glow's largest, most prominent use across the whole product (portal + landing page) — a soft radial mint-green bloom centered behind the 3D model, large blur, low opacity, extending slightly beyond the model's silhouette so it reads as "spotlit in a dark showroom," not a UI effect. Same token (`primary`, ~12–18% opacity) as defined in the portal design doc — this is what visually unifies the two.

---

## 3. The 3D model

**Stack:** react-three-fiber + `@react-three/drei` (`useGLTF` for loading, `OrbitControls` for interaction). This is the standard, well-supported path for a single `.glb` in a React app — no reason to reach for anything heavier.

**Behavior:**
- **Idle:** slow auto-rotate (~4–6°/sec) around the Y axis — enough to read as "alive," slow enough to stay cinematic rather than gimmicky.
- **On drag:** user can grab and rotate freely (`OrbitControls` with `enableZoom={false}`, `enablePan={false}` — rotation only, keeps the framing controlled). Auto-rotate pauses on interaction, resumes after ~2s idle.
- **No zoom/pan** — constraining interaction to rotation-only keeps the hero composition intact no matter what the user does.

**Lighting:** Since the model's own materials/textures are unknown (only the `.glb` file exists, no context on how it's authored), light it deliberately rather than trusting embedded lighting:
- One soft key light (cool white, slightly blue) from upper-front
- One dim rim light in the primary mint-green, from behind — this is what makes the model itself pick up the "glow" color at its edges, tying the object to the signature element rather than just sitting in front of it.
- Dark environment/background so the model reads as floating in the same dark canvas as the rest of the page, not in its own box.

**Performance/fallback:**
- Show a low-opacity blurred placeholder (or the glow alone, model absent) while the `.glb` loads — avoid a layout-shift pop-in.
- If WebGL is unavailable (rare, but real), fall back to a static hero product image in the same position — never a broken canvas.

---

## 4. Page-load animation

This is the "cinematic fade in" ask — one orchestrated sequence, not simultaneous pop-in of everything:

1. **0ms:** Dark canvas is already present (no flash).
2. **~100ms:** Eyebrow text fades in (200ms, ease-out).
3. **~250ms:** Headline fades in + rises 12px (400ms, ease-out) — the emotional anchor of the page, given the most deliberate entrance.
4. **~450ms:** Subhead fades in (300ms).
5. **~550ms:** CTA button fades in (250ms).
6. **~300ms (parallel to headline):** 3D model fades in from ~85% scale + 0 opacity to 100%/full opacity (600ms, ease-out), glow blooms in alongside it (slightly slower, 800ms) — the glow arriving a beat after the model gives it the feeling of light "catching" the object rather than both appearing simultaneously.

Total sequence resolves by ~1.2s. Respect `prefers-reduced-motion`: skip straight to end-state, no fades/slides, model still renders (only the entrance animation is skipped, not the interactivity).

---

## 5. Features section

Directly below hero, reached via the CTA's smooth scroll.

- Section eyebrow (Plex Mono): `WHY TW-1`
- Three features from §1, laid out as **three unequal-weight blocks**, not a symmetric 3-column grid (grid-of-cards is the generic default the theme's tone should avoid) — e.g., the first feature ("Scan-as-you-go") gets a larger block since it's the core mechanic, the other two sit smaller beside/below it.
- Each feature: short Lora sub-headline (not full display size — one step down), one sentence DM Sans body, no icon-in-a-circle cliché — if an icon is used, keep it as a simple line-weight glyph, not a filled badge.
- No trolly-glow here — the glow is reserved for hero/portal focal moments (per the "used sparingly" rule in the portal doc). This section stays quieter, letting the hero's impact carry.

---

## 6. Pricing section

- Section eyebrow: `THE DEMO PROGRAM`
- Single centered card (only place on this page a card is centered — appropriate here since it's literally one offer, not a comparison): "15-Day In-Store Demo"
- Price in Plex Mono, large: `₹25,000`
- One line beneath: "Full TW-1 unit, on-site, for two weeks. No commitment beyond the trial."
- Card gets a subtle version of the trolly-glow (smaller, dimmer than hero) — this is the second-most-important focal moment on the page after the hero, so it earns a touch of the signature treatment, but visibly less than the hero's.
- CTA on the card: "Book a demo" → sends unauthenticated users to signup/login (entry point into the client portal), consistent with the portal flow already designed.

---

## 7. Consistency with the client portal

- Same type roles (Lora display / DM Sans body / Plex Mono data).
- Same glow signature, with intentional hierarchy: hero (largest) > pricing card (medium) > portal's login/payment/confirmation (as already specified).
- Same motion philosophy: one orchestrated entrance, restrained hover states, `prefers-reduced-motion` respected throughout.
- The ₹25,000 figure and "15 days" language match exactly what's in the booking/payment flow — no discrepancy between what's marketed and what's charged.