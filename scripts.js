// Shared JavaScript for MSc Management Consultancy prep materials
// This file is sourced by all week pages (W1_introduction, W2_xxx, etc.)

// Configure marked for safety and features
marked.setOptions({
  breaks: true,
  gfm: true
});

// Custom renderer to handle special components
const renderer = new marked.Renderer();

// Global sources cache
let sourcesDB = null;

// Load sources.json once at page initialization
async function loadSources() {
  if (sourcesDB) return sourcesDB; // Already loaded

  try {
    const response = await fetch('../sources.json');
    if (!response.ok) {
      console.warn('sources.json not found, using legacy source rendering');
      return null;
    }
    sourcesDB = await response.json();
    console.log(`Loaded ${Object.keys(sourcesDB).length} sources`);
    return sourcesDB;
  } catch (error) {
    console.error('Error loading sources.json:', error);
    return null;
  }
}

// Render source links (DOI, OA, BBK) - used in source blocks
function renderSourceLinks(source) {
  const links = [];

  if (source.doi) {
    links.push(`<a href="https://doi.org/${source.doi}" class="source-link doi-link" target="_blank">📄 DOI</a>`);
  }
  if (source.OA_link) {
    links.push(`<a href="${source.OA_link}" class="source-link oa-link" target="_blank">🔓 Open Access PDF</a>`);
  }
  if (source.BBK_link) {
    links.push(`<a href="${source.BBK_link}" class="source-link bbk-link" target="_blank">🏛️ Birkbeck Library</a>`);
  }

  return links.length > 0 ? `<div class="source-links">${links.join('')}</div>` : '';
}

// Get short citation for in-text references
function getShortCitation(source) {
  const firstAuthor = source.authors[0];
  const surname = firstAuthor.split(',')[0] || firstAuthor.split(' ').pop();

  if (source.authors.length === 1) return `${surname}, ${source.year}`;
  if (source.authors.length === 2) {
    const secondSurname = source.authors[1].split(',')[0] || source.authors[1].split(' ').pop();
    return `${surname} & ${secondSurname}, ${source.year}`;
  }
  return `${surname} et al., ${source.year}`;
}

// Process in-text citations [@key] or [@key1; @key2]
// Use [-@key] for narrative citations (year only, when author is already in text)
// Creates placeholder markers that will be replaced after marked.parse()
function processInTextCitations(markdown) {
  if (!sourcesDB) return markdown;

  // First handle narrative citations [-@key] - year only
  markdown = markdown.replace(/\[-@([a-zA-Z0-9_]+)\]/g, (match, key) => {
    const source = sourcesDB[key];
    if (!source) {
      return `<span class="citation-error" title="Source not found">[${key}?]</span>`;
    }
    // Year-only citation for narrative use (e.g., "Hodges [-@hodges2017]" → "Hodges (2017)")
    return `(<span class="citation" data-source-key="${key}">${source.year}</span>)`;
  });

  // Then handle standard citations [@key] or [@key1; @key2]
  markdown = markdown.replace(/\[@([a-zA-Z0-9_;]+)\]/g, (match, keysString) => {
    const keys = keysString.split(';').map(k => k.trim());
    const citations = keys.map(key => {
      const source = sourcesDB[key];
      if (!source) {
        return `<span class="citation-error" title="Source not found">[${key}?]</span>`;
      }

      const shortCite = getShortCitation(source);
      // Use a placeholder that won't be touched by marked.parse()
      return `<span class="citation" data-source-key="${key}">${shortCite}</span>`;
    });

    return `(${citations.join('; ')})`;
  });

  return markdown;
}

// Add citation popups after HTML is rendered
function addCitationPopups(container) {
  container.querySelectorAll('.citation').forEach(cite => {
    // Skip citations inside <summary> elements (popups get clipped by overflow:hidden)
    if (cite.closest('summary')) {
      return;
    }
    const key = cite.dataset.sourceKey;
    if (sourcesDB && sourcesDB[key]) {
      const source = sourcesDB[key];
      const popup = document.createElement('span');
      popup.className = 'citation-popup';

      // Create popup reference
      const popupRef = document.createElement('div');
      popupRef.className = 'popup-reference';
      popupRef.innerHTML = marked.parseInline(source.formatted_reference);
      popup.appendChild(popupRef);

      // Add links if available
      const links = [];
      if (source.doi) {
        const doiLink = document.createElement('a');
        doiLink.href = `https://doi.org/${source.doi}`;
        doiLink.className = 'source-link doi-link';
        doiLink.target = '_blank';
        doiLink.textContent = '📄 DOI';
        links.push(doiLink);
      }
      if (source.OA_link) {
        const oaLink = document.createElement('a');
        oaLink.href = source.OA_link;
        oaLink.className = 'source-link oa-link';
        oaLink.target = '_blank';
        oaLink.textContent = '🔓 Open Access PDF';
        links.push(oaLink);
      }
      if (source.BBK_link) {
        const bbkLink = document.createElement('a');
        bbkLink.href = source.BBK_link;
        bbkLink.className = 'source-link bbk-link';
        bbkLink.target = '_blank';
        bbkLink.textContent = '🏛️ Birkbeck Library';
        links.push(bbkLink);
      }

      if (links.length > 0) {
        const linksDiv = document.createElement('div');
        linksDiv.className = 'source-links';
        links.forEach(link => linksDiv.appendChild(link));
        popup.appendChild(linksDiv);
      }

      cite.appendChild(popup);
    }
  });
}

// Convert ::: blocks into styled components
function processCustomBlocks(markdown) {
  // IMPORTANT: Process blocks in order from innermost to outermost.
  // Blocks that cannot contain other blocks are processed first, so that
  // by the time we process container blocks (like summary), any nested
  // blocks have already been converted to HTML and won't confuse the regex.

  // Key definitions (cannot contain other blocks)
  markdown = markdown.replace(
    /:::definition\s*\n([\s\S]*?)\n:::/g,
    (match, content) => {
      const lines = content.trim().split('\n');
      const quote = lines[0] || '';
      const attribution = lines[1] || '';
      return `
<div class="concept-box">
  <div class="label">Key definition</div>
  <blockquote>${marked.parseInline(quote)}</blockquote>
  ${attribution ? `<div class="attribution">— ${marked.parseInline(attribution)}</div>` : ''}
</div>`;
    }
  );

  // Reflection prompts (cannot contain other blocks)
  markdown = markdown.replace(
    /:::reflect\s*\n([\s\S]*?)\n:::/g,
    (match, content) => `
<div class="reflection-box">
  <h3><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Pause and reflect</h3>
  ${marked.parse(content)}
</div>`
  );

  // Learning outcomes (cannot contain other blocks)
  markdown = markdown.replace(
    /:::outcomes\s*\n([\s\S]*?)\n:::/g,
    (match, content) => `
<div class="outcomes-box">
  <h3>By the end of this week, you should be able to:</h3>
  ${marked.parse(content)}
</div>`
  );

  // Checklist (cannot contain other blocks)
  const pageKey = window.location.pathname.replace(/[^a-zA-Z0-9]/g, '-');
  markdown = markdown.replace(
    /:::checklist\s*\n([\s\S]*?)\n:::/g,
    (match, content) => {
      const items = content.trim().split('\n').filter(l => l.startsWith('- '));
      const checkboxes = items.map((item, i) =>
        `<li><input type="checkbox" id="check-${pageKey}-${i}"><label for="check-${pageKey}-${i}">${marked.parseInline(item.slice(2))}</label></li>`
      ).join('');
      return `
<div class="checklist">
  <h3>✓ Preparation checklist</h3>
  <ul>${checkboxes}</ul>
</div>`;
    }
  );

  // Audio cards (cannot contain other blocks)
  markdown = markdown.replace(
    /:::audio\s*\n([\s\S]*?)\n:::/g,
    (match, content) => {
      const lines = content.trim().split('\n');
      const title = lines[0] || 'Audio segment';
      const duration = lines[1] || '';
      const topics = lines.slice(2).filter(l => l.startsWith('- ')).map(l => `<li>${marked.parseInline(l.slice(2))}</li>`).join('');
      return `
<div class="audio-card">
  <div class="audio-card-header">
    <div class="audio-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
    </div>
    <div>
      <div class="audio-card-title">${marked.parseInline(title)}</div>
      <div class="audio-card-meta">${marked.parseInline(duration)}</div>
    </div>
  </div>
  <div class="audio-placeholder">[Audio player would be embedded here]</div>
  ${topics ? `<details class="audio-topics"><summary>What's covered</summary><ul>${topics}</ul></details>` : ''}
</div>`;
    }
  );

  // Video cards - with embedded YouTube and download button
  markdown = markdown.replace(
    /:::video\s*\n([\s\S]*?)\n:::/g,
    (match, content) => {
      // Extract iframe
      const iframeMatch = content.match(/<iframe[^>]*>.*?<\/iframe>/s);
      const iframeHtml = iframeMatch ? iframeMatch[0] : '';

      // Extract download button (may span multiple lines)
      const downloadMatch = content.match(/<a\s+href="[^"]*"[^>]*class="download-btn"[^>]*>[\s\S]*?<\/a>/);
      const downloadBtnHtml = downloadMatch ? downloadMatch[0] : '';

      // Extract title and topics from remaining lines
      const lines = content.trim().split('\n');
      let titleLine = '';
      const topicLines = [];

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('Part ') || (trimmedLine.match(/^[A-Z]/) && !trimmedLine.startsWith('<') && !trimmedLine.startsWith('-'))) {
          if (!titleLine) titleLine = trimmedLine;
        } else if (trimmedLine.startsWith('- ')) {
          topicLines.push(trimmedLine);
        }
      }

      const topics = topicLines.map(l => `<li>${marked.parseInline(l.slice(2))}</li>`).join('');

      return `
<div class="video-card">
  <div class="video-embed">
    ${iframeHtml}
  </div>
  <div class="video-meta">
    <div class="video-title">${marked.parseInline(titleLine)}</div>
    ${downloadBtnHtml}
  </div>
  ${topics ? `<details class="video-topics"><summary>What's covered</summary><ul>${topics}</ul></details>` : ''}
</div>`;
    }
  );

  // Academic source summaries - enhanced with JSON support
  markdown = markdown.replace(
    /:::source(?:\[([^\]]+)\])?\s*\n([\s\S]*?)\n:::/g,
    (match, sourceKey, content) => {
      if (sourceKey && sourcesDB) {
        // New format with JSON lookup
        const source = sourcesDB[sourceKey];

        if (!source) {
          // Missing key - show error but don't break
          return `
<div class="source-error">
  <strong>Source reference error:</strong> Key "${sourceKey}" not found in sources.json
</div>`;
        }

        // Render with JSON metadata
        const links = renderSourceLinks(source);

        // Create compact icons for summary
        const summaryIcons = [];
        if (source.OA_link) {
          summaryIcons.push(`<a href="${source.OA_link}" class="source-summary-link oa" target="_blank" title="Open Access PDF" onclick="event.stopPropagation()">🔓</a>`);
        }
        if (source.BBK_link) {
          summaryIcons.push(`<a href="${source.BBK_link}" class="source-summary-link bbk" target="_blank" title="Birkbeck Library Access" onclick="event.stopPropagation()">🏛️</a>`);
        }
        const summaryIconsHTML = summaryIcons.length > 0 ? `<span class="source-summary-links">${summaryIcons.join('')}</span>` : '';

        // Wrap content in source-content-main div for proper layout
        const parsedContent = marked.parse(content);

        return `
<details class="source-summary" data-source-key="${sourceKey}">
  <summary><span class="source-title"><span class="source-title-text">${marked.parseInline(source.formatted_reference)}</span>${summaryIconsHTML}</span></summary>
  <div class="source-content">
${links}<div class="source-content-main">${parsedContent}</div>
  </div>
</details>`;

      } else {
        // Legacy format: first line = title
        const lines = content.trim().split('\n');
        const title = lines[0] || '';
        const body = lines.slice(1).join('\n');
        return `
<details class="source-summary legacy">
  <summary><span class="source-title">${marked.parseInline(title)}</span></summary>
  <div class="source-content">
    <div class="source-content-main">${marked.parse(body)}</div>
  </div>
</details>`;
      }
    }
  );

  // Reading cards - supports both legacy format and JSON lookup
  // With key: :::reading[core][key] Optional extra text\nBody...:::
  // Without key: :::reading[core]\nTitle line\nBody...:::
  markdown = markdown.replace(
    /:::reading\[(core|optional)\](?:\[([^\]]+)\])?[ \t]*(.*?)\s*\n([\s\S]*?)\n:::/g,
    (match, type, sourceKey, titleExtra, content) => {
      let title, body, linksHTML = '';

      if (sourceKey && sourcesDB) {
        // New format with JSON lookup - title from JSON + optional extra text
        const source = sourcesDB[sourceKey];

        if (!source) {
          return `
<div class="source-error">
  <strong>Reading reference error:</strong> Key "${sourceKey}" not found in sources.json
</div>`;
        }

        // Build title: JSON reference + optional extra (e.g., ", Chapters 1-2")
        title = source.formatted_reference;
        if (titleExtra && titleExtra.trim()) {
          // If extra text starts with comma or other punctuation, append directly; otherwise add comma
          const extra = titleExtra.trim();
          if (/^[,;:\-–—]/.test(extra)) {
            title += ' ' + extra;
          } else {
            title += ', ' + extra;
          }
        }
        body = content.trim();

        // Build links from JSON source
        const summaryIcons = [];
        if (source.OA_link) {
          summaryIcons.push(`<a href="${source.OA_link}" class="source-summary-link oa" target="_blank" title="Open Access PDF" onclick="event.stopPropagation()">🔓</a>`);
        }
        if (source.BBK_link) {
          summaryIcons.push(`<a href="${source.BBK_link}" class="source-summary-link bbk" target="_blank" title="Birkbeck Library Access" onclick="event.stopPropagation()">🏛️</a>`);
        }
        if (source.doi) {
          summaryIcons.push(`<a href="https://doi.org/${source.doi}" class="source-summary-link doi" target="_blank" title="DOI" onclick="event.stopPropagation()">📄</a>`);
        }
        linksHTML = summaryIcons.length > 0 ? `<span class="source-summary-links">${summaryIcons.join('')}</span>` : '';

      } else {
        // Legacy format: first line = title (titleExtra would be empty, content has title)
        const lines = content.trim().split('\n');
        title = lines[0] || '';
        body = lines.slice(1).join('\n');
      }

      return `
<details class="reading-card" ${sourceKey ? `data-source-key="${sourceKey}"` : ''}>
  <summary class="reading-header">
    <span class="reading-title">${marked.parseInline(title)}${linksHTML}</span>
    <span class="reading-type ${type === 'optional' ? 'optional' : ''}">${type === 'core' ? 'Core' : 'Optional'}</span>
  </summary>
  <div class="reading-content">${marked.parse(body)}</div>
</details>`;
    }
  );

  // Framework displays (for the 4 roles etc)
  markdown = markdown.replace(
    /:::framework\s*\n([\s\S]*?)\n:::/g,
    (match, content) => `
<div class="framework-display">
  ${marked.parse(content)}
</div>`
  );

  // Summary cards (lecture recap with "Read more" expansion)
  // IMPORTANT: Process last since summary blocks can contain other blocks.
  // Pattern: :::summary\n<summary text>\n:::\n<expanded details until next heading or block>
  markdown = markdown.replace(
    /:::summary\s*[\r\n]+([\s\S]*?)[\r\n]+:::[ \t]*[\r\n]+([\s\S]*?)(?=[\r\n]+###|[\r\n]+:::|$)/g,
    (match, summary, details) => {
      const trimmedDetails = details.trim();
      if (!trimmedDetails) {
        // No details, just show the summary as a standalone card
        return `
<div class="summary-card summary-only">
  <div class="summary-label">Lecture recap</div>
  <div class="summary-text">${marked.parse(summary.trim())}</div>
</div>`;
      }
      return `
<details class="summary-card">
  <summary class="summary-header">
    <div class="summary-label">Lecture recap</div>
    <span class="summary-text">${marked.parse(summary.trim())}</span>
    <span class="summary-expand">Read more</span>
  </summary>
  <div class="summary-details">${marked.parse(trimmedDetails)}</div>
</details>`;
    }
  );

  return markdown;
}

// LocalStorage functions for checklist persistence
function saveCheckboxState(checkbox) {
  localStorage.setItem(checkbox.id, checkbox.checked);
}

function restoreCheckboxStates() {
  document.querySelectorAll('.checklist input[type="checkbox"]').forEach(cb => {
    const saved = localStorage.getItem(cb.id);
    if (saved === 'true') cb.checked = true;
  });
}

// Image lightbox functionality
function initializeImageLightbox() {
  const lightbox = document.getElementById('imageLightbox');
  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.image-lightbox-close');

  // Add click handlers to all images in main content
  document.querySelectorAll('main img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
  });

  // Close lightbox on background click or close button
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  };

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightboxImg) {
      closeLightbox();
    }
  });

  closeBtn.addEventListener('click', closeLightbox);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

// Show loading state
document.querySelectorAll('.section-content[data-src]').forEach(section => {
  section.innerHTML = '<p class="loading">Loading...</p>';
});

// Attach event listeners for citation popups
function attachCitationListeners(container) {
  // Hover behavior with delay
  container.querySelectorAll('.citation').forEach(cite => {
    let hideTimeout;

    const show = () => {
      clearTimeout(hideTimeout);
      cite.classList.add('active');
    };

    const hide = () => {
      hideTimeout = setTimeout(() => {
        cite.classList.remove('active');
      }, 150); // 150ms delay before hiding
    };

    // Show on hover over citation
    cite.addEventListener('mouseenter', show);
    cite.addEventListener('mouseleave', hide);

    // Keep open when hovering over popup
    const popup = cite.querySelector('.citation-popup');
    if (popup) {
      popup.addEventListener('mouseenter', show);
      popup.addEventListener('mouseleave', hide);
    }
  });
}

// Load and render markdown content
async function loadContent() {
  // Load sources FIRST
  await loadSources();

  const sections = document.querySelectorAll('.section-content[data-src]');

  for (const section of sections) {
    const src = section.getAttribute('data-src');
    try {
      const response = await fetch(src);
      if (response.ok) {
        let markdown = await response.text();

        // IMPORTANT: Process in-text citations BEFORE custom blocks
        markdown = processInTextCitations(markdown);
        markdown = processCustomBlocks(markdown);

        section.innerHTML = marked.parse(markdown);

        // Add citation popups after HTML is rendered
        addCitationPopups(section);

        // Attach event listeners
        attachCitationListeners(section);
        section.querySelectorAll('.checklist input[type="checkbox"]').forEach(cb => {
          cb.addEventListener('change', () => saveCheckboxState(cb));
        });
      } else {
        section.innerHTML = `<p class="load-error">Could not load: ${src}</p>`;
      }
    } catch (error) {
      console.error(`Error loading ${src}:`, error);
      section.innerHTML = `<p class="load-error">Could not load content. If viewing locally, use a server: <code>python -m http.server</code></p>`;
    }
  }
  // Restore saved checkbox states after all content is loaded
  restoreCheckboxStates();
  // Initialize image lightbox functionality
  initializeImageLightbox();
}

// Initialize
document.addEventListener('DOMContentLoaded', loadContent);
