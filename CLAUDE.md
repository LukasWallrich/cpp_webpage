# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **markdown-based learning companion** for the MSc Management Consultancy & Professional Practice module at Birkbeck, University of London. Content is authored in markdown files and rendered dynamically by an HTML page using marked.js.

## Architecture

Each week folder (e.g., `Week 1/`) contains:
- `index.html` - Main page that loads and renders markdown (rarely edited)
- `styles.css` - Styling with CSS variables in `:root` for theming
- `content/` - Numbered markdown files (00-overview.md, 01-topic.md, etc.) containing actual content

The HTML uses `data-src` attributes to specify which markdown file each section loads. The JavaScript processes custom block syntax before rendering.

## Custom Markdown Syntax

The system extends standard markdown with `:::` fenced blocks that render as styled components:

```markdown
:::outcomes
- Learning outcome one
- Learning outcome two
:::

:::definition
"Quote text"
Attribution, *Source* (year)
:::

:::reflect
Your reflection question here?
:::

:::source
Author (Year) "Title", *Journal*
Summary paragraph. **Key insight**: Main takeaway.
:::

:::reading[core]   (or [optional])
Author – *Title*, Chapters X-Y
Description text.
:::

:::audio
Part 1: Title
~8 minutes
- Topic covered
:::

:::checklist
- Item one
- Item two
:::
```

### `:::summary` processing order

**`:::summary` blocks are processed last** in `scripts.js`. All other `:::` blocks (reflect, source, framework, etc.) are converted to HTML first. This means:

- The summary regex captures everything between its closing `:::` and the next `###` heading as expandable "Read more" details.
- Other `:::` blocks placed between a summary and the next `###` will be swallowed into the summary's details, because their `:::` markers are already gone (replaced with HTML) by the time the summary regex runs.
- **The only reliable boundary for ending summary details is a `###` heading.**
- To keep content (like a `:::reflect` block) outside a summary card, place it after the next `###` heading.

## Citation Syntax

Citations use Pandoc-style syntax and are rendered as clickable popups. The citation key must exist in `sources.json`.

**Two formats:**

| Syntax | Renders as | Use when |
|--------|------------|----------|
| `[@schein1987]` | (Schein, 1987) | Parenthetical citation - author not mentioned in sentence |
| `[-@schein1987]` | (1987) | Author already named in sentence |

**Examples:**

```markdown
<!-- CORRECT: Author in sentence + year-only citation -->
Schein [-@schein1987] emphasises that clients own both the problem and the solution.
→ Renders: Schein (1987) emphasises that clients own both the problem and the solution.

<!-- CORRECT: Parenthetical citation -->
This aligns with process consultation principles [@schein1987].
→ Renders: This aligns with process consultation principles (Schein, 1987).

<!-- WRONG: Missing author name before year-only citation -->
As [-@schein1987] emphasises...
→ Renders: As (1987) emphasises... ← Missing author name!
```

**Key rule:** When using `[-@key]`, always include the author name before it in your sentence.

## Skills

Make sure to call on the following skills or commands when relevant:
- pptx folder contains skills for creating and editing powerpoint slides
- /summarise-pdf for generating source block summaries from PDFs
- /fact-check for verifying factual claims and citations

## Local Development

The page loads external files via fetch, requiring a local server:

```bash
# Node.js
npx serve
```

Then open http://localhost:8000

## Adding New Weeks

1. Copy an existing week folder (e.g., `Week 1/` to `Week 2/`)
2. Update `index.html` header (title, week number, dates)
3. Edit content files in `content/` directory

## Content rules

We need to be very careful that all content is clear and accurate. Please follow these rules:
- Use British English spelling and grammar.
- Ensure all references and attributions are correct. Include DOIs for all sources, as well as open access PDF links retrieved from the Unpaywall API, using a call like https://api.unpaywall.org/v2/10.1038/nature12373?email=l.wallrich@bbk.ac.uk

## Custom Commands

### /summarise-pdf

Generates a `:::source` block summary from a PDF file or URL. Usage:

```
/summarise-pdf path/to/article.pdf
/summarise-pdf https://example.com/paper.pdf
```

The command reads the PDF, extracts key findings, and outputs a formatted source block ready to paste into content files. It also checks `sources.json` for existing entries and suggests new ones with DOI/open access metadata.

### /fact-check

Verifies factual claims and source citations in learning content. See `.claude/commands/fact-check.md` for details.

## Pixabay Image Downloads

To download images from Pixabay, use their API with the key stored in `.env` (`PIXABAY_API_KEY`). To find an image by its Pixabay photo ID (from the URL), query the API and use the `largeImageURL` field:

```bash
# Look up image by ID
curl -s "https://pixabay.com/api/?key=$(grep PIXABAY_API_KEY .env | cut -d= -f2)&id=PHOTO_ID" | python3 -m json.tool

# Or search by keywords
curl -s "https://pixabay.com/api/?key=$(grep PIXABAY_API_KEY .env | cut -d= -f2)&q=rope+knotted&image_type=photo" | python3 -m json.tool
```

The response includes `largeImageURL` (1280px) and `webformatURL` (640px). Download with `curl -sL "<url>" -o path/to/image.jpg`.

## Generating Presentation PDFs

The reveal.js HTML presentations in each week's `presentations/` folder can be exported to PDF for student download. Use `decktape` (with the reveal plugin) to capture slides, then compress with Ghostscript:

```bash
# 1. Start a local server
npx serve -l 8787 . &

# 2. Generate PDF with decktape
npx decktape reveal --size 1920x1080 --pause 2000 --load-pause 3000 \
  "http://localhost:8787/W7_concluding_and_evaluating/presentations/01-evaluation.html" \
  "W7_concluding_and_evaluating/presentations/01-evaluation.pdf"

# 3. Compress with Ghostscript (reduces ~24MB → ~1.6MB)
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook \
  -dNOPAUSE -dBATCH -dQUIET \
  -sOutputFile=output_compressed.pdf input.pdf
mv output_compressed.pdf input.pdf

# 4. Stop the server
pkill -f "serve -l 8787"
```

**Important:** Do not use Playwright's `page.pdf()` or Chrome's native print-to-PDF with `?print-pdf` — these break the slide layouts (missing title background images, broken two-column slides). Decktape captures each slide as rendered in the browser, producing correct output.

After generating PDFs, update the download links in the corresponding `content/` markdown files to point to `.pdf` instead of `.pptx`:

```html
<a href="presentations/01-evaluation.pdf" class="download-btn">
  ...
  Download slides (PDF)
</a>
```

## Deployment

Designed for GitHub Pages:
1. Push to repository
2. Enable Pages in Settings → Deploy from branch → main / root
3. Link from Moodle as URL resource
