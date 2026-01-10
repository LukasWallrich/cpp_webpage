# Summarise PDF for Source Block

Generate a `:::source` block summary from a PDF file for use in learning content.

## Arguments

$ARGUMENTS - Path to the PDF file to summarise, or a URL to fetch the PDF from

## Execution

**IMPORTANT**: Use the Task tool with `subagent_type="general-purpose"` to perform this summarization. Pass the PDF path/URL and all instructions below to the agent. The agent should return only the final `:::source` block and any suggested `sources.json` entry.

The task prompt should include:
1. The PDF path or URL: $ARGUMENTS
2. The full process and formatting guidelines below
3. The current contents of `sources.json` (read it first and include in the prompt)

## Process for the agent

### 1. Read the PDF

Use the Read tool to access the PDF file at the provided path. If a URL is provided, use WebFetch to retrieve the content first.

### 2. Identify key information

Extract from the PDF:
- **Full citation**: Authors, year, title, journal/publisher, volume, pages
- **Core argument**: The main thesis or central claim
- **Key findings**: 2-5 major findings or arguments
- **Methodology**: Brief note on approach if relevant (empirical study, literature review, conceptual framework, etc.)
- **Implications for practitioners**: Practical takeaways for consultants or managers
- **Memorable quotes**: Any particularly quotable phrases that capture key insights

### 3. Check sources.json

Look in `sources.json` at the project root to see if this source already has an entry. If so, use the existing reference key (e.g., "sturdy2011") and formatted_reference. If not, create a new key using the format `{firstauthor_surname}{year}` (lowercase).

### 4. Generate the source block

Create a `:::source` block following this format:

```markdown
:::source[referencekey]
Opening paragraph summarising the source's main contribution and relevance to consultancy practice.

**Key findings/arguments**:
- First major point
- Second major point
- Third major point (if applicable)

**Key insight**: One sentence capturing the most important takeaway.
:::
```

### 5. Formatting guidelines

- Use British English spelling throughout
- Keep the opening paragraph to 2-3 sentences maximum
- Bullet points should be substantive but concise (one line each ideally)
- The "Key insight" should be memorable and actionable where possible
- Include relevant page numbers for specific claims if they would help students locate content
- If the source uses distinctive terminology or frameworks, explain these briefly
- Consider what would be most useful for MSc students studying management consultancy

### 6. Additional context sections (use as appropriate)

Depending on the source, you may add these optional sections before the Key insight:

- **For empirical studies**: Add "**Methodology**:" briefly noting the approach
- **For frameworks**: Add "**The [name] framework**:" with brief explanation
- **For practitioner-focused content**: Add "**For practitioners**:" with actionable implications
- **For critical/theoretical pieces**: Add "**Critical perspective**:" noting the theoretical lens
- **For sources with important caveats**: Add "**Limitations**:" noting scope or caveats

### 7. Output

Present the completed source block, ready to be copied into a content markdown file. Also suggest:

1. Whether a new entry should be added to `sources.json`
2. If so, provide the JSON entry with all available metadata (DOI, open access links via Unpaywall, etc.)

### Example output

For a PDF of Sturdy (2011) on consulting impact, the output might be:

```markdown
:::source[sturdy2011]
*This is one of your core readings.* Sturdy reviews the evidence on whether consultancy actually improves organisations.

**Key findings**:
- Direct evidence of consulting impact is surprisingly thin; it's methodologically hard to study
- Consultancy clearly affects *management discourse* (how managers talk and think)
- Impact varies hugely by context, client capability, and type of engagement
- The relationship between consultant and client is often more important than the content of advice

**Why it matters**: This isn't an attack on consulting; it's a call for clearer thinking about what consulting does and doesn't achieve.
:::
```
