#!/usr/bin/env node

/**
 * fetch-oa-links.js
 *
 * Queries Unpaywall API for open access links for sources in sources.json
 * Caches failed attempts to avoid repeated API calls
 *
 * Usage:
 *   node fetch-oa-links.js [--force] [--key source_key]
 *
 * Options:
 *   --force: Re-check all sources, even those previously checked
 *   --key:   Only check specific source key(s)
 */

const fs = require('fs').promises;
const path = require('path');

// Configuration
const SOURCES_FILE = path.join(__dirname, 'sources.json');
const EMAIL = 'l.wallrich@bbk.ac.uk'; // Required by Unpaywall
const RATE_LIMIT_MS = 1000; // 1 request per second (Unpaywall guideline)

// Unpaywall API endpoint
const UNPAYWALL_API = 'https://api.unpaywall.org/v2';

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  gray: '\x1b[90m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    force: false,
    keys: []
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--force') {
      options.force = true;
    } else if (args[i] === '--key' && args[i + 1]) {
      options.keys.push(args[i + 1]);
      i++;
    }
  }

  return options;
}

// Load sources.json
async function loadSources() {
  try {
    const data = await fs.readFile(SOURCES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    log(`Error loading ${SOURCES_FILE}: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Save sources.json with pretty formatting
async function saveSources(sources) {
  try {
    await fs.writeFile(
      SOURCES_FILE,
      JSON.stringify(sources, null, 2),
      'utf8'
    );
    log(`\nSaved updated sources to ${SOURCES_FILE}`, 'green');
  } catch (error) {
    log(`Error saving ${SOURCES_FILE}: ${error.message}`, 'red');
    throw error;
  }
}

// Query Unpaywall API
async function queryUnpaywall(doi) {
  const url = `${UNPAYWALL_API}/${encodeURIComponent(doi)}?email=${EMAIL}`;

  try {
    const response = await fetch(url);

    if (response.status === 404) {
      // DOI not found in Unpaywall
      return { found: false, error: 'DOI not in Unpaywall database' };
    }

    if (!response.ok) {
      return { found: false, error: `HTTP ${response.status}` };
    }

    const data = await response.json();

    // Check for OA availability
    if (data.is_oa && data.best_oa_location) {
      return {
        found: true,
        oa_link: data.best_oa_location.url_for_pdf || data.best_oa_location.url,
        oa_status: data.oa_status,
        version: data.best_oa_location.version
      };
    }

    // No OA version available
    return { found: false, error: null };

  } catch (error) {
    return { found: false, error: `Network error: ${error.message}` };
  }
}

// Sleep function for rate limiting
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main processing function
async function processSource(key, source, options) {
  // Skip if no DOI
  if (!source.doi) {
    log(`  ${key}: Skipping (no DOI)`, 'gray');
    return { updated: false };
  }

  // Skip if already checked (unless --force)
  const alreadyChecked = source.oa_check_failed !== null && source.oa_check_failed !== undefined;
  if (alreadyChecked && !options.force) {
    if (source.OA_link) {
      log(`  ${key}: Already has OA link`, 'gray');
    } else {
      log(`  ${key}: Previously checked, no OA available`, 'gray');
    }
    return { updated: false };
  }

  // Query Unpaywall
  log(`  ${key}: Checking Unpaywall for ${source.doi}...`, 'blue');
  const result = await queryUnpaywall(source.doi);

  const today = new Date().toISOString().split('T')[0];

  if (result.found) {
    // OA link found!
    source.OA_link = result.oa_link;
    source.oa_check_failed = false;
    source.oa_last_checked = today;
    log(`  ${key}: ✓ Found OA link (${result.oa_status})`, 'green');
    log(`    → ${result.oa_link}`, 'green');
    return { updated: true, success: true };
  } else {
    // No OA link
    source.oa_check_failed = result.error ? 'error' : true;
    source.oa_last_checked = today;
    if (result.error) {
      log(`  ${key}: ⚠ Error: ${result.error}`, 'yellow');
    } else {
      log(`  ${key}: ✗ No OA version available`, 'red');
    }
    return { updated: true, success: false };
  }
}

// Main execution
async function main() {
  const options = parseArgs();

  log('\n=== Unpaywall OA Link Fetcher ===\n', 'blue');

  // Load sources
  const sources = await loadSources();
  const sourceKeys = options.keys.length > 0
    ? options.keys
    : Object.keys(sources);

  log(`Processing ${sourceKeys.length} source(s)...${options.force ? ' (forced re-check)' : ''}\n`);

  let stats = {
    total: sourceKeys.length,
    checked: 0,
    found: 0,
    notFound: 0,
    skipped: 0,
    errors: 0
  };

  // Process each source
  for (let i = 0; i < sourceKeys.length; i++) {
    const key = sourceKeys[i];
    const source = sources[key];

    if (!source) {
      log(`  ${key}: Key not found in sources.json`, 'red');
      continue;
    }

    const result = await processSource(key, source, options);

    if (result.updated) {
      stats.checked++;
      if (result.success) {
        stats.found++;
      } else {
        stats.notFound++;
      }
    } else {
      stats.skipped++;
    }

    // Rate limiting (except for last item)
    if (i < sourceKeys.length - 1 && result.updated) {
      await sleep(RATE_LIMIT_MS);
    }
  }

  // Save updated sources
  if (stats.checked > 0) {
    await saveSources(sources);
  }

  // Print summary
  log('\n=== Summary ===', 'blue');
  log(`Total sources:     ${stats.total}`);
  log(`Checked:          ${stats.checked}`, stats.checked > 0 ? 'blue' : 'reset');
  log(`OA links found:   ${stats.found}`, stats.found > 0 ? 'green' : 'reset');
  log(`Not available:    ${stats.notFound}`, stats.notFound > 0 ? 'red' : 'reset');
  log(`Skipped:          ${stats.skipped}`, 'gray');

  log('\nDone!\n', 'green');
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    log(`\nFatal error: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { queryUnpaywall, processSource };
