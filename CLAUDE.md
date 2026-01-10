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

## Deployment

Designed for GitHub Pages:
1. Push to repository
2. Enable Pages in Settings → Deploy from branch → main / root
3. Link from Moodle as URL resource
