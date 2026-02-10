# Reveal.js Presentation Template

Shared styles are in `styles.css`. Each presentation HTML file links to this stylesheet.

## HTML boilerplate

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>W6: Implementation — [Recording Title]</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@700;800&family=Bitter:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/theme/black.css" id="theme">
<link rel="stylesheet" href="styles.css">
</head>
<body>
<div class="reveal">
<div class="slides">

<!-- slides go here -->

</div></div>
<script src="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.js"></script>
<script src="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/plugin/notes/notes.js"></script>
<script>
  Reveal.initialize({
    hash: true, width: 1920, height: 1080, margin: 0.04,
    minScale: 0.2, maxScale: 2.0, center: false,
    transition: 'fade', transitionSpeed: 'default',
    backgroundTransition: 'fade', slideNumber: true,
    plugins: [ RevealNotes ]
  });
</script>
</body>
</html>
```

## Available slide layouts

### Title slide (module-level, used once per week)

Full-bleed image on right with ellipse clip-path. Used for the first slide only.

```html
<section class="title-slide">
  <div class="title-text">
    <h1>Consultancy and<br>Professional Practice</h1>
    <div class="subtitle">W6: Implementation</div>
    <p class="byline">Dr Lukas Wallrich (<a href="mailto:l.wallrich@bbk.ac.uk">l.wallrich@bbk.ac.uk</a>)</p>
  </div>
  <div class="title-image" style="background-image: url('img/title-w6.jpg');"></div>
</section>
```

### Recording title slide

Centred heading with recording number and duration. Also works as a transition/divider slide.

```html
<section class="recording-title">
  <h2>Partnership &amp;<br>Stakeholder Dynamics</h2>
  <p>Recording 1 &middot; ~18 minutes</p>
  <aside class="notes">...</aside>
</section>
```

### Quote slide

Image on left (3:4 aspect), quote with attribution on right. Good for key quotes and named principles.

```html
<section class="quote-slide">
  <div class="quote-image">
    <img src="img/block-book.jpg" alt="Description">
  </div>
  <div class="quote-content">
    <div class="quote-label">Key Insight</div>
    <blockquote>"The quote text here."</blockquote>
    <p class="attribution">&mdash; Author Name, <em>Source</em></p>
  </div>
  <aside class="notes">...</aside>
</section>
```

### Two-column layout

CSS grid with two equal columns. `h2`, `.callout`, and `.footnote` span full width automatically.

```html
<section class="two-col">
  <h2>Comparison Title</h2>
  <div class="card">
    <h3>Left Column</h3>
    <ul><li>Point one</li></ul>
  </div>
  <div class="card">
    <h3>Right Column</h3>
    <ul><li>Point one</li></ul>
  </div>
  <div class="callout">
    <span class="icon">&#128161;</span>
    <p><strong>Key point</strong> spanning full width.</p>
  </div>
  <aside class="notes">...</aside>
</section>
```

### Image + text side by side

Image takes 45% width on the left; text content fills the rest.

```html
<section class="img-text">
  <img src="img/photo.jpg" alt="Description">
  <div class="text-content">
    <h2>Title</h2>
    <p>Text content here.</p>
  </div>
  <aside class="notes">...</aside>
</section>
```

### Diagonal image

Text on left ~50% width; angled image fills right side with a diagonal clip-path.

```html
<section class="has-diagonal">
  <h2>Title</h2>
  <ul><li>Content point</li></ul>
  <div class="diagonal-img" style="background-image: url('img/photo.jpg');"></div>
  <aside class="notes">...</aside>
</section>
```

### Standard content slide (no special class)

Default flexbox column layout, vertically centred. Use for content-heavy slides.

```html
<section>
  <h2>Title</h2>
  <p>Content here.</p>
  <aside class="notes">...</aside>
</section>
```

## Reusable components

### Card grid

Responsive grid of card boxes. Override `grid-template-columns` for specific layouts (e.g. 2x2).

```html
<div class="card-grid" style="grid-template-columns: 1fr 1fr;">
  <div class="card">
    <h3>Card Title</h3>
    <p>Card content.</p>
  </div>
  <!-- more cards -->
</div>
```

### Card (standalone or in grid)

Semi-transparent box with border. Add `.highlighted` for olive-background emphasis.

```html
<div class="card">
  <h3>Title</h3>
  <p>Content.</p>
</div>

<div class="card highlighted">
  <h3>Emphasised Card</h3>
  <p>This one stands out.</p>
</div>
```

### Callout box

Olive-background insight/warning box with icon.

```html
<div class="callout">
  <span class="icon">&#128161;</span>  <!-- lightbulb -->
  <p><strong>Key point:</strong> explanation here.</p>
</div>
```

Common icons: `&#128161;` (lightbulb), `&#9888;` (warning triangle), `&#10008;` (cross mark).

Add `.warning` or `.insight` for colour-coded variants:

```html
<div class="callout warning">
  <span class="icon">&#9888;</span>
  <p><strong>Warning:</strong> yellow-tinted background with yellow left border.</p>
</div>

<div class="callout insight">
  <span class="icon">&#128161;</span>
  <p><strong>Insight:</strong> green-tinted background with green left border.</p>
</div>
```

### Highlight box (yellow)

Used for reflection prompts. Dark text on yellow background.

```html
<div class="highlight-box">
  <p><strong>Reflect:</strong> Your question here?</p>
</div>
```

### Spectrum / scale bar

Gradient bar between two labelled extremes.

```html
<div class="spectrum">
  <span class="label-left">Left extreme<br><em>Description</em></span>
  <div class="bar"></div>
  <span class="label-right">Right extreme<br><em>Description</em></span>
</div>
```

### "Coming up next" bridge

Used at the end of summary slides to bridge to the next recording.

```html
<div class="next-up">
  <div class="label">&rarr; Coming Up Next</div>
  <p>Recording 2: Description of what comes next.</p>
</div>
```

### Footnote / source attribution

Small, muted text for source references.

```html
<p class="footnote">Based on Author (Year)</p>
```

### Table

Standard HTML table, styled automatically. Use for structured comparisons and frameworks.

```html
<table>
  <thead>
    <tr><th>Column 1</th><th>Column 2</th></tr>
  </thead>
  <tbody>
    <tr><td>Data</td><td>Data</td></tr>
  </tbody>
</table>
```

### Timeline

Vertical timeline with events. Good for process sequences.

```html
<div class="timeline">
  <div class="event">
    <h3>Step 1</h3>
    <p>Description.</p>
  </div>
  <div class="event">
    <h3>Step 2</h3>
    <p>Description.</p>
  </div>
</div>
```

### Myth-busting strikethrough

Red diagonal line through text. For debunking claims.

```html
<span class="myth-line">Text to strike through</span>
```

## Speaker notes

All slides should include `<aside class="notes">` with bullet-point talking points.

```html
<aside class="notes">
  <ul>
    <li>Key talking point one</li>
    <li>Key talking point two</li>
  </ul>
</aside>
```

## Colour palette

| Variable | Value | Use |
|----------|-------|-----|
| `--bg` | `#2D2A24` | Dark brown background |
| `--cream` | `#E1E5CD` | Headings, strong text |
| `--muted` | `#C2C4B5` | Body text |
| `--olive` | `#6B6D45` | Borders, accents |
| `--olive-bg` | `rgba(107,109,69,0.35)` | Callout backgrounds |
| `--gold` | `#9FA582` | Emphasis, links, italics |
| `--highlight` | `#FEF3C7` | Yellow reflection boxes |
| `--red` | `#D63B3B` | Warnings, subtitles |
| `--card` | `rgba(255,255,255,0.08)` | Card backgrounds |
| `--card-border` | `rgba(255,255,255,0.12)` | Card borders |
