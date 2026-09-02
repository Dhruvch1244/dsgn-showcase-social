# Thrum — a dsgn showcase

Thrum is a **fictional** community feed app — a Twitter/Bluesky/Discord-adjacent
place where people post what they made instead of sleeping. It exists to answer
one question honestly: what do you actually get, in a fresh project, from
[`@dhruvchoudhary/dsgn`](https://design.dhruvchoudhary.com)?

Nothing here is a mockup of a real product. The name, the rooms
(`~night-shift`, `~synth-diy`, `~typeface-crimes`), the people, every pulse,
every reaction count, and every line of copy are invented for this demo. No
real company's name, mark, palette, or copy appears anywhere in it.

This is showcase #2. The first, [Halyard](https://design.dhruvchoudhary.com/design-analytics),
is a product-analytics workspace in the `corporate` voice — deliberately the
opposite end of the registry from this one, so the two together show how far
the same 36 components can be pushed.

## The vocabulary

Thrum has its own words, because a social app that calls things "posts" and
"likes" is a clone with the serial numbers filed off:

| Thrum | The thing it is |
|---|---|
| **pulse** | a post |
| **spark** | a like |
| **echo** | a repost |
| **room** (`~night-shift`) | a community / channel |
| **reaction** | a short mono token (`same`, `2am`, `ship`, `how?`, `oof`, `!!`) rather than an emoji, so the set is part of the product's voice and renders identically on every platform |

## How it was built

A genuine external consumer of the published package — no workspace link, no
hand-copied component sources, no local registry.

```bash
npx create-next-app@latest dsgn-showcase-social \
  --ts --tailwind --eslint --app --import-alias "@/*"

npx @dhruvchoudhary/dsgn init

npx @dhruvchoudhary/dsgn add button card badge input textarea separator \
  tooltip avatar hover-card tabs dialog sheet toast popover scroll-area \
  skeleton empty-state toggle collapsible context-menu dropdown-menu switch \
  progress alert-dialog select radio-group alert checkbox

npx @dhruvchoudhary/dsgn add recipe:notification-list
```

27 components plus one composed recipe, all living in `components/dsgn/` as
source this project owns and has edited.

### Where each one earns its place

| Component | Used for |
|---|---|
| `avatar` | every person, initials-only — this project ships no image assets |
| `hover-card` | the profile preview on a hovered name, in the feed and the "makers to follow" rail |
| `tabs` | feed streams (For you / Following / Your rooms), notification filters, profile sections |
| `dialog` | the composer |
| `sheet` | the thread reader, the preferences panel, and the mobile navigation drawer |
| `toast` | post confirmation, echo, join/leave, copy link, mute |
| `popover` | the reaction picker |
| `scroll-area` | the joined-rooms list in the nav; the thread and preferences bodies |
| `skeleton` | the feed's stream-switch loading pass |
| `empty-state` | no search results, an empty profile tab, an empty notification filter |
| `toggle` | the spark button — the singular `Toggle`, one pressed/unpressed control |
| `collapsible` | in-feed reply threads |
| `context-menu` | right-click on a pulse: open thread, copy link, mute, report |
| `dropdown-menu` | the pulse `...` menu, the account menu, the accent picker |
| `progress` | in-pulse poll results and room activity meters |
| `alert-dialog` | mute confirmation |
| `radio-group` | "who can reply" in the composer |
| `select` | target room in the composer; quiet hours in preferences |
| `switch` / `checkbox` | notification toggles and digest topics in preferences |
| `alert` | the "this is a demo" disclosure, below `xl` where the right rail is hidden |
| `tooltip` | every icon-only action, since the glyph carries the meaning |
| `recipe:notification-list` | the "This week" rolled-up digest above the itemised list |

## Style voice

**`startup`**, from `skills/dsgn/agents/startup.md`. What that actually meant here:

- **Deep violet-black, not a neutral void.** `#0b0518` — three points darker
  than the dsgn site's own startup preset, because this app puts long-form text
  directly on the background rather than on cards, and the headroom is what
  keeps `--ink-faint` above 4.5:1 without desaturating it toward grey.
- **The accent is a gradient, not a hue.** Two colours, applied only where the
  eye should land first: hero headlines, the wordmark's second syllable, stat
  callouts, and the one primary CTA per view. Never as wallpaper.
- **Oversized, mixed-weight display type.** `clamp(2.4rem, 7vw, 3.75rem)` with a
  light word set against an extra-bold gradient one in the same line. That
  device needs a real weight axis, which is why the display face is Bricolage
  Grotesque (200–800) rather than a two-weight static family.
- **Overshoot motion.** `--ease-spring: cubic-bezier(0.34, 1.42, 0.62, 1)` on
  reveals and press states — the corporate voice's flat ease-out reads as the
  wrong product entirely here.
- **`--radius-scale: 1.6`**, pill-leaning.

### Three accent presets, and why they're in the demo

The palette picker in the nav (and in preferences) switches between **Aurora**,
**Ember** and **Bloom**. It is worth having specifically because of what it
*doesn't* do: it sets one attribute on `<html>`. No component re-renders
differently, no className is swapped, no theme object is threaded through
context. All 27 installed components restyle because they were written against
semantic token names and `globals.css` repoints those names per preset.

Contrast was checked at **both ends of every gradient**, not just the midpoint —
the voice's own accessibility note. The tightest pairing is Aurora's violet end
against `--accent-foreground` at 5.2:1, which still clears AA for a button label.

There is no light mode. The startup voice's own light variant is still a dark
violet, and shipping a near-white theme would have meant abandoning the voice
rather than expressing it.

## Structure

| Path | What lives there |
|---|---|
| `app/globals.css` | The whole token system: raw values → semantic aliases → `@theme inline`. A rebrand is an edit to the raw values and nothing else. |
| `lib/feed.ts` | Data layer. Imports no React, no Next, no component — the philosophy's first pillar as a real boundary. Every selector is pure and complexity-annotated. |
| `lib/format.ts` | Relative time, compact counts, avatar initials. Hand-rolled rather than a date/number dependency. |
| `lib/accent.ts` | The accent preset as an external store (`data-accent` + `localStorage`), read via `useSyncExternalStore`, primed by an inline pre-paint script. |
| `lib/views.ts` | The view registry the desktop rail, the mobile bottom bar, and the mobile drawer all read. |
| `components/dsgn/` | Installed registry components. Local edits carry a `LOCAL EDIT` comment saying why. |
| `components/` | Everything Thrum-specific: the shell, four views, the pulse card, the composer, the thread reader, the hand-drawn icon set. |
| `components/icons.tsx` | 18 glyphs, 1.5px stroke, one shared wrapper. Hand-drawn rather than an icon package — stroke weight is a voice decision here, not an implementation detail. |

All cross-view state lives in `components/app-shell.tsx` and nowhere else. The
four views are pure functions of props; none of them can navigate on its own.

## Local edits to installed components

Two, both marked in-file:

- **`button.tsx` — the `glow` variant.** Shipped as a flat `bg-accent` fill
  with a single-hue drop glow. Swapped for `bg-[image:var(--accent-grad)]` plus
  `--glow-accent`, which is itself composed from both ends of the accent pair
  and so follows a preset swap for free. Edited in the variant rather than
  passed per call site because four CTAs use it and they must not drift apart.
- **`recipes/notification-list.tsx`.** The recipe ships a hardcoded three-row
  `const` array, so a second instance on a page renders identical rows. Given
  an `items` prop, a `title`, and a `className`; its own `max-w-sm` dropped so
  it can size to the column it's placed in.

One project-level fix that is *not* a component edit, in `globals.css`:

- **`--tw-ring-offset-color`.** Every registry component writing
  `focus-visible:ring-offset-2` inherits Tailwind's default offset colour,
  `#fff` — a solid 2px white band between the control and its accent ring.
  Invisible on the corporate voice's near-white page; a bright halo on this
  one. Because Tailwind registers that property with `inherits: false`, setting
  it on `:root` does nothing; it has to be declared in the `*` rule. Measured
  before and after with `getComputedStyle` on a focused `Textarea`.

## Run it

```bash
npm install
npm run dev
```

## Verified

- `tsc --noEmit`, `eslint`, and `next build` all clean.
- Playwright sweep against the **production build** at 1440×1000 and 390×844:
  zero console errors, zero page errors, zero failed requests.
- `documentElement.scrollWidth === clientWidth` asserted on every view at
  390px, plus inside the nav drawer, the composer, and the thread sheet — no
  horizontal overflow anywhere. (`overflow-x: clip` on both `html` and `body`,
  not `hidden`, which would force the other axis to `auto` and break every
  sticky rail.)
- Sticky top bar confirmed pinned at `top: 0` after a 1200px scroll, i.e. the
  overflow fix didn't cost stickiness.
- Interaction pass: hover card, collapsible thread, reaction popover, spark
  toggle, toast, context menu, thread sheet, composer, accent switch (asserted
  `data-accent` actually changes), and the search empty state.
- `prefers-reduced-motion: reduce`: `[data-reveal]` resolves to
  `animation-name: none` with `opacity: 1` — reduced motion cannot leave
  content invisible.
