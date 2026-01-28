## 5. Diagnostic techniques

This section covers two structured approaches to diagnosis that are widely used in consulting: Root Cause Analysis and Six Sigma. Both provide systematic methods for moving beyond surface symptoms to identify underlying issues.

### Root cause analysis

Root cause analysis (RCA) is a systematic approach to identifying why problems occur, rather than simply addressing symptoms. The goal is to find the fundamental cause that, if addressed, will prevent recurrence.

#### The "five whys"

A technique from the Toyota Production System helps dig beneath surface symptoms:

![Five Whys](content/img/five-whys.png)

Each "why" gets you to a deeper level of understanding, moving from symptoms to potential root causes. Block [-@block2011] similarly discusses "layers of analysis" that move from presenting problems to underlying issues.

Note that the five whys can also lead to **branching**: a single problem may have multiple root causes, each requiring its own line of investigation.

<!-- Summary generated from PDF: sources/RootCauseForBeginners.pdf -->
:::source[rooneyheuvel2004]
James J. Rooney and Lee N. Vanden Heuvel are senior risk and reliability engineers who provide a foundational guide to root cause analysis (RCA), a systematic process for investigating events and identifying their underlying causes rather than surface-level explanations.

**Key findings/arguments**:
- RCA is designed to identify not only what and how an event occurred, but critically why it happened, enabling effective corrective measures
- Root causes must be underlying, reasonably identifiable, controllable by management, and allow for generation of actionable recommendations
- The process involves four major steps: data collection, causal factor charting, root cause identification, and recommendation generation and implementation
- Causal factor charting provides a sequence diagram with logic tests that organises information and identifies gaps in knowledge during investigation
- Root cause identification uses a structured Root Cause Map to determine the underlying reasons for causal factors
- Common mistakes include stopping at surface-level causes like "operator error" without probing deeper, and addressing only the most visible causal factor when events typically result from multiple contributors

**Key insight**: Understanding why an event occurred, rather than simply identifying what happened, is essential for developing recommendations that prevent recurrence rather than merely treating symptoms.
:::

#### Limitations of RCA

While RCA is valuable, it has significant limitations that consultants should understand:

<!-- Summary generated from PDF: sources/417.full.pdf -->
:::source[peerally2017]
Peerally, Carr, Waring, and Dixon-Woods examine the limitations of root cause analysis (RCA) in healthcare, arguing that whilst RCA has potential value, it has been widely implemented without adequate attention to what makes it effective in its original contexts or customisation for healthcare specifics.

**Key findings/arguments**:
- RCA's name implies a single linear cause, promoting a flawed reductionist view that displaces more complex, multi-factorial accounts of how adverse events unfold
- RCA investigations in healthcare are typically conducted by local teams lacking specialist expertise in systems thinking, human factors, and cognitive interviewing, unlike accident investigators in other high-risk industries
- Investigations are constrained by strict timelines and hindsight bias, often resulting in compromises between investigative depth and accuracy, with reports influenced by hierarchical tensions and organisational interests
- Risk control strategies stemming from RCA tend to favour weaker administrative solutions (such as reminders) rather than addressing latent causes like poorly designed technology or defective systems
- Feedback mechanisms function poorly, with implementation rates of action plans varying between 45% and 70%, and little formal follow-up occurring
- The focus on single incident analysis in isolation within bounded organisations prevents organisations from recognising recurring patterns and disseminating learning across systems
- Healthcare struggles with distinguishing between blame and accountability, with confusion about "no-blame" culture creating dissonance between policy and legal/disciplinary reality
- The "problem of many hands" makes it difficult to address system-level hazards when multiple actors contribute to outcomes yet lie outside individual organisations' control

**Key insight**: RCA often functions as a procedural ritual (the "tombstone effect") rather than genuinely securing organisational learning, due to inadequate investigation quality, poor risk control design, and failure to aggregate and share lessons across incidents.
:::

### The Six Sigma approach

For technical and operational problems, Six Sigma offers a structured diagnostic methodology using the **DMAIC** cycle: Define → Measure → Analyse → Improve → Control. Many clients use this as their standard improvement framework, so familiarity with the vocabulary is valuable even if you don't specialise in it.

Six Sigma works best for quantifiable, process-based, repetitive problems; it is less suited to culture, relationships, or strategy.

:::framework
**The DMAIC cycle**

- **Define**: Clarify the problem, its scope, and what success looks like. Who is affected? What are the project boundaries?
- **Measure**: Collect baseline data on current performance. How bad is the problem? How will you know if it improves?
- **Analyse**: Use the data to identify root causes. Statistical tools (correlation, ANOVA) and visual methods (fishbone diagrams, Pareto charts) help separate signal from noise.
- **Improve**: Develop and test solutions that address root causes. Pilot changes before full rollout.
- **Control**: Put systems in place to sustain improvements (monitoring dashboards, updated procedures, ongoing review).

While DMAIC appears linear, iteration is common. Its strength lies in forcing rigorous measurement before jumping to solutions. For a comprehensive guide to Six Sigma tools and techniques, see the Council for Six Sigma Certification [-@sixsigma2024].
:::

### When to use structured techniques

Both RCA and Six Sigma provide valuable rigour, but should be chosen appropriately:

| Approach | Best suited for | Limitations |
|----------|----------------|-------------|
| **Five Whys** | Quick initial exploration; single incidents | Can oversimplify; may miss systemic issues |
| **Full RCA** | Serious incidents; recurring problems | Time-intensive; can be politicised |
| **Six Sigma** | Process improvement; quantifiable outcomes | Requires data; less suited to "soft" problems |

The key is matching the technique to the situation and recognising that structured methods complement rather than replace professional judgement.

:::reflect
Think about a problem you've encountered at work. What would happen if you asked "why?" five times? What root causes might you uncover?
:::
