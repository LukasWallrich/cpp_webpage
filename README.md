# Week 1 Companion Page - Maintainable Version

## How it works

This learning companion uses **markdown files** for all content, making it easy to update without touching HTML. The `index.html` file loads and renders markdown from the `content/` folder.

```
w1-markdown/
├── index.html          # Main page (rarely needs editing)
├── styles.css          # Styling (rarely needs editing)
├── content/
│   ├── 00-overview.md
│   ├── 01-what-is-consultancy.md
│   ├── 02-industry-landscape.md
│   ├── 03-roles-perspectives.md
│   ├── 04-readings.md
│   └── 05-preparation.md
└── README.md           # This file
```

## Editing content

Open any `.md` file in a text editor (VS Code, Notepad++, or even Notepad). Standard markdown works:

```markdown
## Headings

Regular paragraphs with **bold** and *italic*.

- Bullet lists
- Like this

1. Numbered lists
2. Like this

[Links](https://example.com)
```

## Special components

The system recognises special blocks that render as styled components:

### Audio cards
```markdown
:::audio
Part 1: Title here
~8 minutes
- Topic one
- Topic two
:::
```

### Key definitions
```markdown
:::definition
"The quote text here"
Attribution, *Source* (year)
:::
```

### Reflection prompts
```markdown
:::reflect
Your reflection question here?
:::
```

### Academic source summaries
```markdown
:::source
Author (Year) "Title", *Journal*

Summary paragraph here. Key points:

- Point one
- Point two

**Key insight**: The main takeaway.
:::
```

### Learning outcomes
```markdown
:::outcomes
- Outcome one
- Outcome two
:::
```

### Reading cards
```markdown
:::reading[core]
Author – *Title*, Chapters X-Y

Description of the reading.

<div class="reading-questions">
  <div class="label">Read with these questions</div>
  <ul>
    <li>Question one?</li>
    <li>Question two?</li>
  </ul>
</div>
:::
```

Use `[core]` or `[optional]` to set the badge.

### Checklists
```markdown
:::checklist
- Item one
- Item two
- Item three
:::
```

## Adding new academic sources

To add a new source summary, just add another `:::source` block anywhere in the relevant section:

```markdown
:::source
NewAuthor, A. (2024) "New Article Title", *Journal Name*

Your summary of the key arguments and why it matters.

**Key insight**: The main takeaway for students.
:::
```

The blocks are collapsible by default, so you can add many without overwhelming the page.

## Testing locally

Because the page loads external files, you need a local server to test:

```bash
# If you have Python installed:
cd w1-markdown
python -m http.server 8000
# Then open http://localhost:8000

# Or with Node.js:
npx serve
```

## Deploying to GitHub Pages

This is the recommended approach - free, reliable, and easy to update.

### Initial setup

1. Create a GitHub repository (e.g., `consultancy-module`)
2. Upload the contents of this folder to the repository (not the folder itself - the files should be at the root)
3. Go to **Settings → Pages**
4. Under "Source", select **Deploy from a branch**
5. Choose `main` branch and `/ (root)` folder
6. Click Save

Your site will be live at `https://yourusername.github.io/consultancy-module/` within a minute or two.

### Updating content

**Option A: Edit directly on GitHub**
1. Navigate to the file in your repository (e.g., `content/02-industry-landscape.md`)
2. Click the pencil icon to edit
3. Make your changes
4. Click "Commit changes"
5. Site updates automatically in ~30 seconds

**Option B: Edit locally**
1. Clone the repository
2. Edit the markdown files
3. Commit and push
4. Site updates automatically

### Multiple weeks

For a full module, consider this structure:
```
consultancy-module/
├── index.html          # Landing page linking to weeks
├── week1/
│   ├── index.html
│   ├── styles.css
│   └── content/
├── week2/
│   ├── index.html
│   ├── styles.css
│   └── content/
└── shared/
    └── styles.css      # If you want consistent styling
```

### Linking from Moodle

Once hosted, simply add a **URL resource** in Moodle pointing to your GitHub Pages URL. You can also embed it in an iframe if your Moodle allows.

## Creating additional weeks

1. Copy the entire `w1-markdown` folder to `w2-markdown`
2. Update `index.html` header (title, week number, dates)
3. Edit the content files for Week 2's content
4. Update the navigation links if needed

## Common updates

| Task | What to edit |
|------|--------------|
| Fix a typo | The relevant `.md` file |
| Add a new source summary | Add `:::source` block to relevant section |
| Update industry statistics | `02-industry-landscape.md` |
| Change reading questions | `04-readings.md` |
| Add/remove a checklist item | `05-preparation.md` |
| Change colours/fonts | `styles.css` (the `:root` variables) |
| Update live session date | `index.html` header |

## Limitations

- Audio/video must be embedded via HTML (the markdown won't auto-embed media)
- Complex tables are better written in HTML
- The custom blocks (`:::`) only work with this specific setup, not standard markdown

## Questions?

The system is designed to be maintainable by someone comfortable with basic text editing. If you need to make structural changes to the HTML/CSS, that may require more technical help.
