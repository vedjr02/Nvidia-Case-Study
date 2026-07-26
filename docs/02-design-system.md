# Design system

The design has one job: make a dense financial argument pleasant to read for
twenty minutes. Everything below follows from that.

## Principles

1. **Typography and spacing are the design.** There is no decorative layer. If
   a screen looks flat and quiet, it is working.
2. **Colour is data.** The palette is almost entirely neutral so that the six
   series colours mean something the moment they appear.
3. **Every exhibit is an argument.** Charts state a question, show evidence and
   give a reading. Charts that only display numbers were cut.
4. **Motion sequences, never decorates.** Reveals mark the boundary between
   beats. Remove them and nothing is lost but rhythm.

## Surfaces

The reading surface is `#FBFAF7` — a warm off-white rather than pure white.
Pure white at full-page scale produces noticeably more eye strain over long
reading sessions, and the warmth reads as paper rather than as an application
window.

| Token | Value | Use |
| --- | --- | --- |
| `paper` | `#FBFAF7` | The default reading surface |
| `paper-raised` | `#FFFFFF` | Exhibits that need to lift off the page |
| `paper-sunken` | `#F3F1EC` | Interstitials, summary panels |
| `pitch` | `#101215` | Chapter openers only |

**There is no dark mode.** This is a deliberate editorial decision, not an
omission. Printed and digital long-form journalism is set on light surfaces
because sustained reading of body copy is measurably easier there. Instead of a
theme toggle, the piece uses dark full-bleed bands as chapter openers, which
gives the document its structural rhythm — the reader knows a new chapter has
started before reading a word.

## Ink

| Token | Value | Contrast on paper | Use |
| --- | --- | --- | --- |
| `ink` | `#14161A` | 16.6:1 | Body, headings |
| `ink-secondary` | `#4A5058` | 8.2:1 | Ledes, chart readings |
| `ink-muted` | `#6F757D` | 4.9:1 | Captions, axis labels |
| `ink-faint` | `#9AA0A7` | 2.8:1 | Source lines only — never for content that must be read |

All body and interface text clears WCAG AA. `ink-faint` is used exclusively for
source attributions, which are supplementary; the same citations are repeated at
full contrast in the Sources section.

## Accent

NVIDIA's green `#76B900` is the accent, because the subject's own brand colour
is the honest choice for the subject's own data series. It is used for:

- NVIDIA's series in every chart
- the rule beside a chart's reading
- the rule beside a pull quote

It is **never** used for text, because `#76B900` on `#FBFAF7` is 2.4:1 and fails
contrast. Where an accent-coloured word is needed, `accent-deep` `#4A7500`
(4.8:1) is used instead.

## Categorical palette

| Series | Token | Value |
| --- | --- | --- |
| Data Center | `series-datacenter` | `#76B900` |
| Gaming | `series-gaming` | `#1F3A5F` |
| Professional Visualization | `series-proviz` | `#BF7833` |
| Automotive | `series-automotive` | `#7D6A9C` |
| OEM & Other | `series-oem` | `#A9A49A` |
| Edge Computing | `series-edge` | `#2F7D78` |

Chosen for hue separation that survives deuteranopia and protanopia, and for
distinct luminance so the stack is still legible in greyscale. Series are
additionally **directly labelled** at the end of the line or inside the band, so
the reader never has to move their eye to a legend and back.

## Type

Two families, both variable, both loaded through `next/font` with `display:
swap` and subsetted to Latin.

- **Source Serif 4** — everything the reader reads continuously. It has an
  optical-size axis, so display sizes tighten automatically and body sizes stay
  open. Editorial gravity without the fussiness of a Didone.
- **Inter** — everything the reader scans: chart labels, figures, kickers,
  sources, captions. Its tabular figures are what make column alignment work.

### Scale

| Role | Size | Family | Notes |
| --- | --- | --- | --- |
| Display | `clamp(2.75rem, 7.5vw, 6rem)` | Serif 400 | Leading 0.98, tracking −0.028em. Once per document. |
| Chapter | `clamp(2rem, 4.6vw, 3.5rem)` | Serif 400 | Once per chapter. |
| Heading | `1.5–1.75rem` | Serif 600 | Movements within a chapter. |
| Lede | `clamp(1.1875rem, 2.1vw, 1.5rem)` | Serif 400 | `ink-secondary`. |
| Body | `1.1875rem` / 1.7 | Serif 400 | 19px. Larger than a typical web default because this is long-form. |
| Pull quote | `clamp(1.375rem, 2.6vw, 1.875rem)` | Serif 400 | Roughly once per chapter. |
| Caption | `0.8125rem` | Sans 400 | `ink-muted`. |
| Kicker | `0.6875rem` | Sans 600 | Uppercase, tracking 0.16em. |
| Source | `0.75rem` | Sans 400 | `ink-faint`. |

Display sizes use negative tracking because large type at default tracking looks
loose; body sizes use none.

### Measure

The reading column is capped at `42rem` — around 68 characters at 19px. Charts
break out to `64rem`, and a small number of exhibits to `78rem`. Prose never
occupies the wide measures.

## Motion

| Interaction | Behaviour |
| --- | --- |
| Section entry | 12px rise, 0.55s, `cubic-bezier(0.22, 1, 0.36, 1)`, fires once |
| List entry | Same, staggered 80ms |
| Chart draw | Line paths animate on first view, 1.1s, ease-out |
| Figures | Count up over 1.4s on first view |
| Sticky exhibits | Chart pins while the accompanying prose scrolls past |

All of it is suppressed under `prefers-reduced-motion: reduce`, both by the
global CSS rule and by `useReducedMotion` in each component — the components
render the static branch rather than an animation with a zero duration, so no
transition machinery runs at all.

Count-up figures always expose the final value to assistive technology; the
animating value is `aria-hidden`.

## Responsive behaviour

Each breakpoint is designed, not shrunk.

- **< 640px** — single column, 24px gutters. Sticky exhibits unpin and sit
  inline above their prose. Charts drop to a taller aspect ratio and thin their
  axis ticks. Margin notes become inline asides.
- **640–1024px** — the measure widens; charts use the full column.
- **> 1024px** — scrollytelling layout activates: exhibit pinned on one side,
  argument scrolling on the other. Margin notes move into the outer gutter.

Charts are rendered in a `ResponsiveContainer` with an aspect ratio rather than
a fixed height, so they reflow without a resize handler.
