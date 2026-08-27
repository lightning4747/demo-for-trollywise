# TrollyWise Demo App — Design Document

**Scope:** Client Portal (Login, Dashboard, Booking Form, Payment, Confirmation)
**Theme base:** shadcn `ocean-breeze` (`npx shadcn@latest add https://tweakcn.com/r/themes/ocean-breeze.json`)
**Direction:** Cinematic — deliberate, restrained, dark-first. Not a stock SaaS dashboard.

---

## 1. Why dark-first

The `ocean-breeze` light mode is a bright mint/sky palette — friendly, but reads as generic SaaS the moment it's a full-page background. Its **dark mode** is where the theme actually earns "cinematic": a deep blue-black (`oklch(0.2077 0.0398 265.7549)`) with a single glowing mint-green primary (`oklch(0.7729 0.1535 163.2231)`). That combination — near-black canvas, one saturated accent — is the palette of a product shot in a dark studio, not a dashboard. We build **dark mode as the default and primary experience**. Light mode still exists (shadcn theming gives it for free) but every deliberate design decision below is made for dark.

This also fits the subject: a "smart trolly" is a hardware product. Hardware sells best against darkness — think Apple product pages, Tesla's dark UI, Sonos. Light, airy SaaS aesthetics undersell a physical object.

---

## 2. Token system

### Color (from ocean-breeze `dark`, used deliberately — not every token gets equal weight)

| Role | Token | Value | Usage |
|---|---|---|---|
| Canvas | `background` | `oklch(0.2077 0.0398 265.7549)` — near-black blue | Full page background. This is the "studio floor." |
| Surface | `card` | `oklch(0.2795 0.0368 260.0310)` — dark slate | Cards, form panels, elevated content |
| Text (primary) | `foreground` | `oklch(0.8717 0.0093 258.3382)` — soft cool white | Body text, never pure white — keeps the cinematic softness |
| Accent (signature) | `primary` | `oklch(0.7729 0.1535 163.2231)` — glowing mint-green | **Used sparingly**: CTA buttons, active states, the trolly's glow, status "confirmed" badge, focus rings |
| Muted text | `muted-foreground` | `oklch(0.5510 0.0234 264.3637)` | Captions, helper text, timestamps |
| Border | `border` | `oklch(0.4461 0.0263 256.8018)` | Hairline dividers — kept low-contrast, never a strong outline |
| Destructive | `destructive` | `oklch(0.6368 0.2078 25.3313)` — warm red | Errors, failed payment only |

**Rule:** primary-green appears in at most one dominant place per screen. It is the "signal in the dark" — if it's everywhere, it stops meaning anything. Everything else stays in the muted blue-grey register.

### Typography

The theme ships three faces — assign each a strict role, don't mix casually:

| Face | Role | Where |
|---|---|---|
| **Lora** (serif) | Display / cinematic headlines | Page titles ("Book Your Demo", "Welcome back"), section headers. Large size, generous line-height, a little editorial weight — this is what makes it feel considered, not templated. |
| **DM Sans** (sans) | Body / UI text | Form labels, buttons, table content, nav. Workhorse face — never used for the big emotional moments. |
| **IBM Plex Mono** (mono) | Data / status | Request IDs, payment amounts (₹25,000), status codes, timestamps. Monospace on numbers signals "this is real data," reinforcing that the app is functioning, not a mockup. |

Type scale (rem): 3.5 / 2.25 / 1.5 / 1.125 / 1 / 0.875 — display headlines only ever use the top two sizes, sparingly.

### Layout

- **Generous negative space.** Dark backgrounds read cinematic only when content doesn't crowd the frame. Wide margins, single-column focus on forms — no dashboard-grid clutter.
- **Cards float, they don't tile.** Avoid the "grid of equal-weight cards" SaaS default. One clear focal card per screen (the form, the payment summary), supporting content recedes into the dark.
- **Asymmetry over centering** on the dashboard — content aligned left, generous right-margin breathing room, rather than everything centered in a boxed container.

---

## 3. Signature element

**The "trolly glow."** A single soft radial gradient in the primary mint-green, positioned behind key focal points (login card, the payment amount, the "confirmed" badge) — like a product spotlighted in a dark showroom. Low opacity (~12–18%), large blur radius, never a hard-edged glow. This is the one recurring visual signature tying every page back to "a product being unveiled," without repeating the literal 3D model outside the landing page (which is your friend's scope).

Used at:
- Behind the login/signup card
- Behind the ₹25,000 amount on the payment screen
- Behind the "confirmed" status badge on the dashboard

Not used elsewhere — restraint is what makes it read as intentional.

---

## 4. Page-by-page direction

### 4.1 Login / Signup
- Centered card, dark canvas, trolly-glow behind it.
- Headline in Lora: "Welcome back." / "Set up your account."
- Minimal chrome — no marketing copy here, this is a threshold, not a pitch (pitch already happened on the landing page).
- Inputs: shadcn `Input` styled with theme borders, focus ring in primary green (subtle, not neon).

### 4.2 Dashboard
- Left-aligned header in Lora: "Your demo requests."
- Empty state (no requests yet): understated, one line in muted-foreground + a single primary-colored CTA button. No illustration clutter — let the dark space do the work.
- Request list: table using IBM Plex Mono for request ID / amount / date, DM Sans for business name. Status shown as a small pill — `pending_payment` in muted grey, `confirmed` in primary green with the signature glow behind just that badge.

### 4.3 Booking form
- Single-column, generous field spacing — this is the most "functional" screen, so let typography and spacing carry the cinematic feel rather than decoration.
- Field labels in DM Sans, small-caps or letter-spaced slightly (`tracking-wide` token available in the theme) for a considered, almost signage-like feel.
- Progress/step indicator only if it's a true multi-step form (form → payment) — a slim two-dot indicator, not a heavy stepper component.

### 4.4 Payment
- The ₹25,000 amount is the hero of this screen — large, Lora or Plex Mono (numeric, so mono reads better — test both), with the trolly-glow behind it.
- Razorpay checkout is a third-party modal — we can't restyle it, so the page behind it should already feel resolved and calm before the modal opens.
- Trust microcopy in muted-foreground, small: "Secured by Razorpay" — plain, not a badge wall.

### 4.5 Confirmation
- Full-bleed dark canvas, centered content, trolly-glow at its most prominent here — this is the emotional peak of the flow ("you got the demo").
- Lora headline: "You're confirmed."
- Summary in a quiet card below: business name, address, amount, duration — DM Sans + Plex Mono for the data fields.
- Single primary button back to dashboard. No confetti, no over-the-top animation — one clean fade/scale-in on load is enough (respect `prefers-reduced-motion`).

---

## 5. Motion

One orchestrated moment per page-load, nothing scattered:

- **Card entrance:** subtle fade + 8–12px upward slide, ~300ms, ease-out. Applied to the single focal card per screen, not every element individually.
- **Glow pulse:** the trolly-glow has an extremely slow (6–8s), extremely subtle opacity breathing animation — barely perceptible, reads as "alive" rather than "animated."
- **Status change (confirmed):** the status pill transitions color with a brief glow flash — the one moment of delight tied directly to the payment succeeding.
- **No hover-happy micro-interactions everywhere.** Buttons get a simple opacity/brightness shift on hover — nothing bouncy, nothing that reads as a UI kit default.

Respect `prefers-reduced-motion`: fall back to instant state changes, no slide/fade.

---

## 6. Component notes (shadcn)

- Use shadcn `Card`, `Input`, `Button`, `Badge`, `Table`, `Form` primitives as the base — the theme already skins these correctly via CSS variables once installed.
- Override `Button` default radius only if the theme's `0.5rem` feels too soft against the cinematic direction — test at `0.375rem` for a slightly more precise, less "rounded SaaS" edge.
- `Badge` component for status pills — customize the `confirmed` variant to use `primary` + the glow, don't leave it as default shadcn green.
- Do not introduce extra color outside the token table above (no ad-hoc blues/purples) — everything traces back to the theme's CSS variables so light/dark mode both stay coherent.

---

## 7. What makes this not "vibe coded"

- Every color used is a named token from the actual installed theme — no arbitrary hex values invented on the fly.
- One signature element (the glow), used at exactly three points, not sprinkled everywhere.
- Typography has strict role assignment (display / body / data) rather than one font doing everything.
- Motion is one orchestrated entrance per screen, not a library of scattered hover effects.
- Dark mode is a deliberate choice justified by the subject (hardware/product staging), not a default toggle left unconsidered.