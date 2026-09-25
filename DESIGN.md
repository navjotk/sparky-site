# Design

The visual world of sparky-box.com, as shipped. Derived from the built pages, not from intentions.
Chosen 2026-09-25 with the owner, who reviewed dark and light side by side and picked light, then
approved four changes one at a time from before/after comparisons.

## Direction

**"Spoken to, in a device."** The conversation is the product, so a real Telegram exchange is the
hero image — there is no product photography yet and the hardware is an off-the-shelf NUC. Instrument
details (status readouts, monospace data, ruled strips) are the secondary voice. Warm paper ground
rather than clinical white, so it reads domestic rather than developer-tooling.

Anti-references: the cream/huge-tight-tracked-headline/eyebrow-chip landing page this replaced (it
could have sold any AI product), and the hairline-border-plus-wide-blur card that the detector reads
as generated.

## Tokens (`styles.css` `:root`)

| Token | Value | Role |
|---|---|---|
| `--void` | `#f5efe4` | page ground, warm paper |
| `--panel` | `#fffdf8` | raised surfaces: conversation panel, cards |
| `--panel-2` | `#eae1d3` | the customer's own chat bubbles |
| `--line` | `#dbd1c2` | rules, dividers, column hairlines |
| `--text` | `#1b1a18` | primary text |
| `--text-dim` | `#5c554d` | secondary text (4.5:1+ on the ground) |
| `--signal` | `#b8430b` | buttons, links, labels. Brand orange darkened to carry text |
| `--signal-dim` | `#8f340a` | hover |
| `--ok` | `#2e7d46` | status indicators only |

The bright brand orange `#f26522` survives in the logo and favicon only; it fails contrast as text or
as a fill behind white, which is why `--signal` exists.

## Type

System sans (`--sans`) for everything except data, which uses `--mono`. Monospace is reserved for
status, labels and service names — never as a costume for "technical".

- `h1` `clamp(2.2rem,4.4vw,3.5rem)`, line-height 1.08, tracking -0.03em, `text-wrap:balance`
- `h2` `clamp(1.7rem,3vw,2.5rem)`; `.lede` up to 1.12rem at 1.62; body 16px/1.6
- Tracking floor is **-0.04em**. Display leading never below ~1.05. Prose measure capped in `ch`.

## Components

- **`.thread`** — the conversation panel. Rounded 22px, `--panel`, no border; depth is a stacked edge
  (`0 10px 0 -6px var(--panel-2)`) plus an offset shadow. `.thread-head` is a ruled bar with a status
  dot. `.msg-you` right-aligned on `--panel-2`; `.msg-sparky` left on `--void` with a hairline;
  `.msg-meta` is monospace status under the exchange.
- **`.readout`** — ruled two-by-two status strip (one column on phones), label left, indicator right.
- **`.panel`** — content cards with a monospace tag, heading and paragraph.
- **`.catalogue`** — monospace chips listing real services.
- **`.button`** — 48px min height, pill, `--signal` with white text; `.button-ghost` for secondary.

## Layout and motion

`.wrap` is 1140px with hairlines down both edges at desktop (dropped on phones). Sections separate
with `.rule` (1px top border, 88px padding — plain px, because the detector cannot read `clamp()` or
`padding-block` and flags them as flush). One authored motion moment: messages land in sequence when
a thread scrolls into view. **Messages are visible by default**; the script adds `js-armed` before it
animates, so no-JS and reduced-motion visitors see everything.

## Rules that keep it honest

- No label/eyebrow chip above a heading. Nine were removed; the heading carries itself.
- No invented numbers anywhere, including sample chats.
- Every text/background pair measured on the rendered page, not eyeballed: body 4.5:1, large 3:1,
  control borders 3:1.
- Both arcs share this system exactly. Only the argument differs, or the ad test measures art
  direction instead of positioning.
- `dist/` is a hand-maintained mirror and is what ships. An edit that misses it never goes live.

## Verify

```
npx wrangler dev --port 8788
"<impeccable>/scripts/impeccable" detect --json index.html homelab.html setup.html privacy.html terms.html
```

Clean means zero findings except `cream-palette`, which is the brand and is a known false positive.
Then check contrast, overflow and touch targets on the rendered page at desktop and 390px.
