# CSS Text Design

[Back to the CSS main index](./README.md)

A reference for expressive and readable text styling in modern CSS — from image-filled headings to line-break control that ships in browsers today.

---

## 1\. `background-clip: text`

Lets a background image or gradient show through the shape of your text.

### HTML

```html
<p class="text-image">Belize Reef</p>
```

### CSS

```css
.text-image {
  display: inline-block;

  background-image: url("image.jpg");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;

  background-clip: text;
  -webkit-background-clip: text; /* still required in Safari */

  color: transparent;
  -webkit-text-fill-color: transparent;

  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
}
```

### Gradient alternative

No image needed — a gradient reads especially well on headings:

```css
.text-gradient {
  display: inline-block;

  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #5f27cd 100%);
  background-clip: text;
  -webkit-background-clip: text;

  color: transparent;
  -webkit-text-fill-color: transparent;

  font-size: 3rem;
  font-weight: 700;
}
```

**2026 upgrade — animate the gradient.** Registering the gradient's angle with `@property` lets you transition it smoothly, which you normally can't do with plain gradients:

```css
@property --gradient-angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 135deg;
}

.text-gradient-animated {
  background: linear-gradient(var(--gradient-angle), #ff6b6b, #feca57, #5f27cd);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;

  transition: --gradient-angle 1.2s ease;
}

.text-gradient-animated:hover {
  --gradient-angle: 315deg;
}
```

---

## 2\. `vertical-align` vs. `align-content`

These solve different alignment problems — don't reach for one when you need the other.

### `vertical-align` — inline elements against surrounding text

```html
<p class="example-text">
  31 B <span class="emoji" aria-hidden="true">💺</span>
</p>
```

```css
.example-text {
  font-size: 1.125rem;
  line-height: 1.5;
}

.emoji {
  vertical-align: top;
}
```

Best for inline icons, images, and form controls sitting inline with text.

### `align-content` — vertically centering a block's content

```html
<p class="centered-text">Bonjour</p>
```

```css
.centered-text {
  width: 22.5rem;
  aspect-ratio: 1;
  display: block;

  text-align: center;
  align-content: center;

  background-color: var(--color-surface);
  color: var(--color-text);

  font-size: 1.5rem;
  line-height: 1.4;
  border-radius: 0.5rem;
}
```

`align-content: center` works on any block-level box now — it's the one-line replacement for the old flex/grid "centering hack" when all you need is vertical centering.

---

## 3\. `box-decoration-break`

Keeps borders, backgrounds, and shadows looking continuous across wrapped lines, instead of only applying to the first/last line.

```html
<p class="highlight-text">
  <span>
    water cooler chat<br />
    everyone agrees<br />
    it is hot
  </span>
</p>
```

```css
.highlight-text {
  font-size: 1.25rem;
  line-height: 1.8;
}

.highlight-text span {
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone; /* still required in Chrome/Safari */

  border: solid #3b5bdb;
  border-width: 0 0.0625rem 0.0625rem 0;
  box-shadow: 0.125rem 0.125rem 0.1875rem #adb5f5;

  padding-inline: 0.375rem;
  border-radius: 0.1875rem;

  background-color: #f8f9ff;
  color: #212529;
}
```

### Useful `rem` conversions (16px root)

| px  | rem       |
| --- | --------- |
| 1px | 0.0625rem |
| 2px | 0.125rem  |
| 3px | 0.1875rem |
| 4px | 0.25rem   |
| 6px | 0.375rem  |
| 8px | 0.5rem    |

---

## 4\. `letter-spacing` reveal animation

Animating `letter-spacing` from tight/invisible to normal/colored creates a simple text-reveal effect without JS.

```html
<section class="text-reveal">
  <span>Ingvar</span>
  <span>Kamprad</span>
  <span>Elmtaryd</span>
  <span>Agunnaryd</span>
</section>
```

```css
.text-reveal {
  display: grid;
  gap: 0.25rem;
  font-size: 2rem;
  font-weight: 700;
}

.text-reveal span {
  display: inline-block;
  letter-spacing: -0.05rem;
  color: transparent;

  transition:
    letter-spacing 0.4s cubic-bezier(0.8, -0.5, 0.2, 1.4),
    color 0.8s linear;
}

.text-reveal span::first-letter {
  color: #fbda0c;
}
```

### Trigger on a checkbox toggle

```html
<label class="toggle">
  <input type="checkbox" />
  Reveal text
</label>

<section class="text-reveal">
  <span>Ingvar</span>
  <span>Kamprad</span>
  <span>Elmtaryd</span>
  <span>Agunnaryd</span>
</section>
```

```css
body:has(.toggle input:checked) .text-reveal span {
  letter-spacing: 0;
  color: #0057ad;
}
```

`:has()` is Baseline-supported across all major browsers now, so this checkbox-driven pattern is safe to ship without a fallback. (Values here use `rem` rather than the more common `ch`/`em` for reveal animations — the visual result is font-dependent, so tune `-0.05rem` between roughly `-0.025rem` and `-0.1rem` for your typeface.)

---

## 5\. `text-combine-upright`

Keeps a short run of text (numbers, small labels) horizontal inside an otherwise vertical writing mode.

```html
<p class="vertical-text">2 Kilo <span>4 lb</span> Sugar</p>
<p class="vertical-text">
  <span aria-hidden="true">🏂</span>
  <span>Feb</span>
  02/26
</p>
```

```css
.vertical-text {
  writing-mode: vertical-lr;
  font-size: 1.25rem;
  line-height: 1.5;
  color: var(--color-text);
}

.vertical-text span {
  text-combine-upright: all;
}
```

Useful for vertical navigation, decorative typography, dates, labels, and space-constrained UI.

---

## 6\. `text-wrap: balance` / `text-wrap: pretty` _(new)_

This is the biggest quality-of-life addition to text layout in years, and it needs zero JavaScript. `text-wrap` reached Baseline in 2024, but the two values below behave very differently and are meant for different content.

```css
/* Headings — even, "balanced" line lengths */
h1,
h2,
h3,
h4,
.display-text {
  text-wrap: balance;
  max-width: 40ch; /* balance needs room to actually redistribute lines */
}

/* Body copy — no lonely last word (orphans) */
p,
li,
blockquote {
  text-wrap: pretty;
}
```

- **`balance`** recalculates line breaks so every line in the block is close to equal width. Great on headings, cards, and pull quotes. It's computationally expensive, so browsers cap it — Chrome stops balancing past 6 lines, Firefox past 10. Don't apply it to long paragraphs.
- **`pretty`** only adjusts the last few lines to avoid a stray single word sitting alone on the final line. Cheap enough for body copy, and safe as a progressive enhancement — unsupported browsers just fall back to normal wrapping with no visual breakage.
- **Support (as of mid-2026):** `balance` is solid across Chrome, Edge, Firefox, and Safari. `pretty` is supported in Chrome, Edge, and Safari; Firefox hasn't shipped it yet. Ship both — there's no downside to the fallback.

---

## 7\. `initial-letter` — drop caps without hacks _(new)_

Drop caps used to require manually sized/floated spans. `initial-letter` does it declaratively:

```html
<p class="drop-cap">Once upon a time, in a village...</p>
```

```css
.drop-cap::first-letter {
  initial-letter: 3; /* spans roughly 3 lines of body text */
  font-weight: 700;
  color: var(--color-primary);
  margin-inline-end: 0.5rem;
}
```

Support is currently strongest in Safari/Chromium; treat it as a progressive enhancement the same way as `text-wrap: pretty`.

---

## 8\. `text-box-trim` — precise vertical spacing _(new)_

Browsers historically add invisible "leading" space above and below text based on the font's internal metrics, which throws off tight vertical rhythm (e.g. a heading that never quite sits flush against a border). `text-box` (shorthand for `text-box-trim` + `text-box-edge`) removes that slack:

```css
h1,
h2,
h3 {
  text-box: trim-both cap alphabetic;
}
```

This trims the box down to the cap-height/baseline of the actual glyphs — useful any time you're aligning text tightly against another element (a badge, an icon, a card edge) and the default line-height padding keeps throwing the alignment off by a few pixels. Newly available in Chromium and Safari; treat as progressive enhancement in Firefox for now.

---

## 9\. `color-mix()` for shadows and states _(new)_

Instead of hand-picking a separate hex value for every shadow/hover tint, derive it from your existing palette:

```css
.highlight-text span {
  box-shadow: 0.125rem 0.125rem 0.1875rem
    color-mix(in srgb, var(--color-primary) 30%, white);
}
```

This keeps shadow/tint colors mathematically tied to your palette instead of drifting out of sync when the base color changes later.

---

# Global Typography Setup

```css
html {
  font-size: 100%;
}

body {
  margin: 0;

  background-color: var(--color-background);
  color: var(--color-text);

  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;

  font-size: 1rem;
  line-height: 1.5;
}

h1,
h2,
h3 {
  margin-block: 0;
  color: var(--color-heading);
  line-height: 1.1;
  text-wrap: balance;
}

h1 {
  font-size: clamp(2rem, 4vw + 1rem, 3rem);
}
h2 {
  font-size: clamp(1.5rem, 3vw + 1rem, 2rem);
}
h3 {
  font-size: 1.5rem;
}

p,
li,
blockquote {
  text-wrap: pretty;
}
```

Using `clamp()` for heading sizes (instead of fixed `rem` values) makes the type scale fluid across viewport widths without a media query, and pairs naturally with `text-wrap: balance` — headings stay visually centered and solid-looking at any width.

## Recommended Colour Palette

```css
:root {
  --color-primary: #0057ad;
  --color-accent: #fbda0c;

  --color-text: #212529;
  --color-heading: #111827;
  --color-muted: #6c757d;

  --color-background: #ffffff;
  --color-surface: #f8f9fa;

  --color-border: #dee2e6;
}
```

Then every example above draws from the same source of truth:

```css
.text-gradient {
  background: linear-gradient(
    135deg,
    var(--color-accent),
    var(--color-primary)
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}
```

## Quick Reference

| Property                      | Recommended usage                                 | Status                           |
| ----------------------------- | ------------------------------------------------- | -------------------------------- |
| `background-clip: text`       | Images and gradients inside text                  | Stable (keep `-webkit-` prefix)  |
| `vertical-align`              | Align inline elements with surrounding text       | Stable                           |
| `align-content`               | Center block content vertically without flex/grid | Stable                           |
| `box-decoration-break: clone` | Preserve decoration across wrapped lines          | Stable (keep `-webkit-` prefix)  |
| `letter-spacing`              | Control or animate character spacing              | Stable                           |
| `text-combine-upright`        | Combine short text in vertical writing            | Stable                           |
| `text-wrap: balance`          | Even line lengths on headings (≤6 lines)          | Baseline                         |
| `text-wrap: pretty`           | Prevent orphan words in body text                 | Broad, not yet in Firefox        |
| `initial-letter`              | Declarative drop caps                             | Progressive enhancement          |
| `text-box-trim`               | Trim font leading for tight vertical alignment    | Progressive enhancement          |
| `color-mix()`                 | Derive tint/shadow colors from palette variables  | Baseline                         |
| `@property` + gradient        | Animatable gradient angles/colors                 | Baseline (Chromium/Safari-first) |

### Unit guideline

Prefer `rem` for spacing and sizing so everything scales with the user's root font size:

```css
/* Good */
padding: 1rem;
margin: 2rem;
gap: 0.5rem;
font-size: 1.25rem;
border-radius: 0.375rem;
box-shadow: 0.125rem 0.125rem 0.25rem var(--color-border);
```

```css
/* Avoid when rem is appropriate */
padding: 16px;
margin: 32px;
gap: 8px;
font-size: 20px;
border-radius: 6px;
box-shadow: 2px 2px 4px rgb(173, 181, 189);
```

Keep values **unitless** where CSS specifically benefits from it (e.g. `line-height`), and reach for `%`, `vh`, `vw`, `ch`, or `clamp()` when they better express the intent than a fixed `rem` — fluid type scales and `max-width: Nch` on text blocks being the most common cases.# CSS Text Design

A reference for expressive and readable text styling in modern CSS — from image-filled headings to line-break control that ships in browsers today.

---

## 1\. `background-clip: text`

Lets a background image or gradient show through the shape of your text.

### HTML

```html
<p class="text-image">Belize Reef</p>
```

### CSS

```css
.text-image {
  display: inline-block;

  background-image: url("image.jpg");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;

  background-clip: text;
  -webkit-background-clip: text; /* still required in Safari */

  color: transparent;
  -webkit-text-fill-color: transparent;

  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
}
```

### Gradient alternative

No image needed — a gradient reads especially well on headings:

```css
.text-gradient {
  display: inline-block;

  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #5f27cd 100%);
  background-clip: text;
  -webkit-background-clip: text;

  color: transparent;
  -webkit-text-fill-color: transparent;

  font-size: 3rem;
  font-weight: 700;
}
```

**2026 upgrade — animate the gradient.** Registering the gradient's angle with `@property` lets you transition it smoothly, which you normally can't do with plain gradients:

```css
@property --gradient-angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 135deg;
}

.text-gradient-animated {
  background: linear-gradient(var(--gradient-angle), #ff6b6b, #feca57, #5f27cd);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;

  transition: --gradient-angle 1.2s ease;
}

.text-gradient-animated:hover {
  --gradient-angle: 315deg;
}
```

---

## 2\. `vertical-align` vs. `align-content`

These solve different alignment problems — don't reach for one when you need the other.

### `vertical-align` — inline elements against surrounding text

```html
<p class="example-text">
  31 B <span class="emoji" aria-hidden="true">💺</span>
</p>
```

```css
.example-text {
  font-size: 1.125rem;
  line-height: 1.5;
}

.emoji {
  vertical-align: top;
}
```

Best for inline icons, images, and form controls sitting inline with text.

### `align-content` — vertically centering a block's content

```html
<p class="centered-text">Bonjour</p>
```

```css
.centered-text {
  width: 22.5rem;
  aspect-ratio: 1;
  display: block;

  text-align: center;
  align-content: center;

  background-color: var(--color-surface);
  color: var(--color-text);

  font-size: 1.5rem;
  line-height: 1.4;
  border-radius: 0.5rem;
}
```

`align-content: center` works on any block-level box now — it's the one-line replacement for the old flex/grid "centering hack" when all you need is vertical centering.

---

## 3\. `box-decoration-break`

Keeps borders, backgrounds, and shadows looking continuous across wrapped lines, instead of only applying to the first/last line.

```html
<p class="highlight-text">
  <span>
    water cooler chat<br />
    everyone agrees<br />
    it is hot
  </span>
</p>
```

```css
.highlight-text {
  font-size: 1.25rem;
  line-height: 1.8;
}

.highlight-text span {
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone; /* still required in Chrome/Safari */

  border: solid #3b5bdb;
  border-width: 0 0.0625rem 0.0625rem 0;
  box-shadow: 0.125rem 0.125rem 0.1875rem #adb5f5;

  padding-inline: 0.375rem;
  border-radius: 0.1875rem;

  background-color: #f8f9ff;
  color: #212529;
}
```

### Useful `rem` conversions (16px root)

| px  | rem       |
| --- | --------- |
| 1px | 0.0625rem |
| 2px | 0.125rem  |
| 3px | 0.1875rem |
| 4px | 0.25rem   |
| 6px | 0.375rem  |
| 8px | 0.5rem    |

---

## 4\. `letter-spacing` reveal animation

Animating `letter-spacing` from tight/invisible to normal/colored creates a simple text-reveal effect without JS.

```html
<section class="text-reveal">
  <span>Ingvar</span>
  <span>Kamprad</span>
  <span>Elmtaryd</span>
  <span>Agunnaryd</span>
</section>
```

```css
.text-reveal {
  display: grid;
  gap: 0.25rem;
  font-size: 2rem;
  font-weight: 700;
}

.text-reveal span {
  display: inline-block;
  letter-spacing: -0.05rem;
  color: transparent;

  transition:
    letter-spacing 0.4s cubic-bezier(0.8, -0.5, 0.2, 1.4),
    color 0.8s linear;
}

.text-reveal span::first-letter {
  color: #fbda0c;
}
```

### Trigger on a checkbox toggle

```html
<label class="toggle">
  <input type="checkbox" />
  Reveal text
</label>

<section class="text-reveal">
  <span>Ingvar</span>
  <span>Kamprad</span>
  <span>Elmtaryd</span>
  <span>Agunnaryd</span>
</section>
```

```css
body:has(.toggle input:checked) .text-reveal span {
  letter-spacing: 0;
  color: #0057ad;
}
```

`:has()` is Baseline-supported across all major browsers now, so this checkbox-driven pattern is safe to ship without a fallback. (Values here use `rem` rather than the more common `ch`/`em` for reveal animations — the visual result is font-dependent, so tune `-0.05rem` between roughly `-0.025rem` and `-0.1rem` for your typeface.)

---

## 5\. `text-combine-upright`

Keeps a short run of text (numbers, small labels) horizontal inside an otherwise vertical writing mode.

```html
<p class="vertical-text">2 Kilo <span>4 lb</span> Sugar</p>
<p class="vertical-text">
  <span aria-hidden="true">🏂</span>
  <span>Feb</span>
  02/26
</p>
```

```css
.vertical-text {
  writing-mode: vertical-lr;
  font-size: 1.25rem;
  line-height: 1.5;
  color: var(--color-text);
}

.vertical-text span {
  text-combine-upright: all;
}
```

Useful for vertical navigation, decorative typography, dates, labels, and space-constrained UI.

---

## 6\. `text-wrap: balance` / `text-wrap: pretty` _(new)_

This is the biggest quality-of-life addition to text layout in years, and it needs zero JavaScript. `text-wrap` reached Baseline in 2024, but the two values below behave very differently and are meant for different content.

```css
/* Headings — even, "balanced" line lengths */
h1,
h2,
h3,
h4,
.display-text {
  text-wrap: balance;
  max-width: 40ch; /* balance needs room to actually redistribute lines */
}

/* Body copy — no lonely last word (orphans) */
p,
li,
blockquote {
  text-wrap: pretty;
}
```

- **`balance`** recalculates line breaks so every line in the block is close to equal width. Great on headings, cards, and pull quotes. It's computationally expensive, so browsers cap it — Chrome stops balancing past 6 lines, Firefox past 10. Don't apply it to long paragraphs.
- **`pretty`** only adjusts the last few lines to avoid a stray single word sitting alone on the final line. Cheap enough for body copy, and safe as a progressive enhancement — unsupported browsers just fall back to normal wrapping with no visual breakage.
- **Support (as of mid-2026):** `balance` is solid across Chrome, Edge, Firefox, and Safari. `pretty` is supported in Chrome, Edge, and Safari; Firefox hasn't shipped it yet. Ship both — there's no downside to the fallback.

---

## 7\. `initial-letter` — drop caps without hacks _(new)_

Drop caps used to require manually sized/floated spans. `initial-letter` does it declaratively:

```html
<p class="drop-cap">Once upon a time, in a village...</p>
```

```css
.drop-cap::first-letter {
  initial-letter: 3; /* spans roughly 3 lines of body text */
  font-weight: 700;
  color: var(--color-primary);
  margin-inline-end: 0.5rem;
}
```

Support is currently strongest in Safari/Chromium; treat it as a progressive enhancement the same way as `text-wrap: pretty`.

---

## 8\. `text-box-trim` — precise vertical spacing _(new)_

Browsers historically add invisible "leading" space above and below text based on the font's internal metrics, which throws off tight vertical rhythm (e.g. a heading that never quite sits flush against a border). `text-box` (shorthand for `text-box-trim` + `text-box-edge`) removes that slack:

```css
h1,
h2,
h3 {
  text-box: trim-both cap alphabetic;
}
```

This trims the box down to the cap-height/baseline of the actual glyphs — useful any time you're aligning text tightly against another element (a badge, an icon, a card edge) and the default line-height padding keeps throwing the alignment off by a few pixels. Newly available in Chromium and Safari; treat as progressive enhancement in Firefox for now.

---

## 9\. `color-mix()` for shadows and states _(new)_

Instead of hand-picking a separate hex value for every shadow/hover tint, derive it from your existing palette:

```css
.highlight-text span {
  box-shadow: 0.125rem 0.125rem 0.1875rem
    color-mix(in srgb, var(--color-primary) 30%, white);
}
```

This keeps shadow/tint colors mathematically tied to your palette instead of drifting out of sync when the base color changes later.

---

# Global Typography Setup

```css
html {
  font-size: 100%;
}

body {
  margin: 0;

  background-color: var(--color-background);
  color: var(--color-text);

  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;

  font-size: 1rem;
  line-height: 1.5;
}

h1,
h2,
h3 {
  margin-block: 0;
  color: var(--color-heading);
  line-height: 1.1;
  text-wrap: balance;
}

h1 {
  font-size: clamp(2rem, 4vw + 1rem, 3rem);
}
h2 {
  font-size: clamp(1.5rem, 3vw + 1rem, 2rem);
}
h3 {
  font-size: 1.5rem;
}

p,
li,
blockquote {
  text-wrap: pretty;
}
```

Using `clamp()` for heading sizes (instead of fixed `rem` values) makes the type scale fluid across viewport widths without a media query, and pairs naturally with `text-wrap: balance` — headings stay visually centered and solid-looking at any width.

## Recommended Colour Palette

```css
:root {
  --color-primary: #0057ad;
  --color-accent: #fbda0c;

  --color-text: #212529;
  --color-heading: #111827;
  --color-muted: #6c757d;

  --color-background: #ffffff;
  --color-surface: #f8f9fa;

  --color-border: #dee2e6;
}
```

Then every example above draws from the same source of truth:

```css
.text-gradient {
  background: linear-gradient(
    135deg,
    var(--color-accent),
    var(--color-primary)
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}
```

## Quick Reference

| Property                      | Recommended usage                                 | Status                           |
| ----------------------------- | ------------------------------------------------- | -------------------------------- |
| `background-clip: text`       | Images and gradients inside text                  | Stable (keep `-webkit-` prefix)  |
| `vertical-align`              | Align inline elements with surrounding text       | Stable                           |
| `align-content`               | Center block content vertically without flex/grid | Stable                           |
| `box-decoration-break: clone` | Preserve decoration across wrapped lines          | Stable (keep `-webkit-` prefix)  |
| `letter-spacing`              | Control or animate character spacing              | Stable                           |
| `text-combine-upright`        | Combine short text in vertical writing            | Stable                           |
| `text-wrap: balance`          | Even line lengths on headings (≤6 lines)          | Baseline                         |
| `text-wrap: pretty`           | Prevent orphan words in body text                 | Broad, not yet in Firefox        |
| `initial-letter`              | Declarative drop caps                             | Progressive enhancement          |
| `text-box-trim`               | Trim font leading for tight vertical alignment    | Progressive enhancement          |
| `color-mix()`                 | Derive tint/shadow colors from palette variables  | Baseline                         |
| `@property` + gradient        | Animatable gradient angles/colors                 | Baseline (Chromium/Safari-first) |

### Unit guideline

Prefer `rem` for spacing and sizing so everything scales with the user's root font size:

```css
/* Good */
padding: 1rem;
margin: 2rem;
gap: 0.5rem;
font-size: 1.25rem;
border-radius: 0.375rem;
box-shadow: 0.125rem 0.125rem 0.25rem var(--color-border);
```

```css
/* Avoid when rem is appropriate */
padding: 16px;
margin: 32px;
gap: 8px;
font-size: 20px;
border-radius: 6px;
box-shadow: 2px 2px 4px rgb(173, 181, 189);
```

Keep values **unitless** where CSS specifically benefits from it (e.g. `line-height`), and reach for `%`, `vh`, `vw`, `ch`, or `clamp()` when they better express the intent than a fixed `rem` — fluid type scales and `max-width: Nch` on text blocks being the most common cases.
