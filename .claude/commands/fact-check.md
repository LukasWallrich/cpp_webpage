# Fact Check Content

Perform a thorough fact-check of the learning content for the specified week or file.

## Arguments

$ARGUMENTS - Week folder (e.g., "Week 1") or specific file path to check

## Process

### 1. Identify target files

If the argument is a week folder, find all markdown files in `{Week}/content/*.md`. If it's a specific file, use that file.

### 2. Check for existing source documents

Look in `fact_check_sources/` at the project root for any PDF or text files that may contain source material. Index these by filename for use during verification.

### 3. Extract and categorise content to verify

Read each target file and extract:

**Factual claims** - Statistics, dates, figures, named facts (e.g., "market estimated at $300 billion", "70% of fees from 5 countries", "McKinsey announced 10% workforce cuts")

**Source citations** - Items in `:::source` blocks with author, year, title, publication

**Reading references** - Items in `:::reading` blocks with author, title, chapters

### 4. Verification process

For each item, attempt verification in this order:

#### For factual claims:
1. Use WebSearch to find corroborating sources
2. Cross-reference with any documents in `fact_check_sources/`
3. Note the verification status and any discrepancies

#### For source citations:
1. Search for the exact citation to verify it exists
2. Check Unpaywall API for DOI and open access link: `https://api.unpaywall.org/v2/{DOI}?email=l.wallrich@bbk.ac.uk`
3. If you find a DOI, verify the citation details match
4. Check if the claimed insights/summaries accurately represent the source

#### How to find DOIs and references

To find a DOI from the reference, use Crossref first:
https://api.crossref.org/works?query.bibliographic={url_encoded_reference}

To find a reference given a DOI, use a call like the below:
$ curl -LH "Accept: text/bibliography; style=apa" http://dx.doi.org/10.1038/nrd842


#### For reading references:
1. Verify the book/article exists with correct author and title
2. Check chapter numbers are valid if specified

### 5. Generate fact_check.md report

Create/update `fact_check.md` at the project root with the following structure:

```markdown
# Fact Check Report

Generated: {date}
Files checked: {list of files}

## Summary

- **Verified claims**: X
- **Issues found**: Y
- **Sources needing manual review**: Z

## Verified Items

### Factual Claims
| Claim | Source file | Verification | Notes |
|-------|------------|--------------|-------|
| ... | ... | VERIFIED/ISSUE | ... |

### Source Citations
| Citation | DOI | Open Access Link | Status |
|----------|-----|------------------|--------|
| ... | ... | ... | VERIFIED/MISSING DOI/NEEDS REVIEW |

## Issues Found

### [Issue 1 title]
- **Location**: file:line
- **Claim**: what was stated
- **Problem**: what's wrong
- **Suggested fix**: correction if known

## Sources Requiring Manual Review

The following sources could not be fully verified online. Please add PDFs or text files to the `fact_check_sources/` folder and re-run the fact check.

### Books
- [ ] Author (Year) *Title* - Chapters X-Y
  - Filename to use: `author-year-title.pdf`

### Articles (no open access found)
- [ ] Author (Year) "Title", *Journal*
  - Filename to use: `author-year-short-title.pdf`

### Other sources
- [ ] Description of source needed
```

### 6. Important guidelines

- Be thorough but fair - note uncertainty rather than marking correct items as wrong
- For statistics, accept reasonable ranges (e.g., "$300 billion" vs "~$300 billion" vs "$290-310 billion")
- For dates, exact matches are required for specific events
- Flag anachronisms (e.g., citing 2025 events from a 2013 source)
- Check that source summaries accurately represent the source's actual arguments
- Use British English in the report

### 7. After completion

Report a summary of findings to the user and note any urgent issues that should be addressed immediately.
