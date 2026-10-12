/* SEO / GEO Calculator — analysis engine (ported from the Site Auditor browser extension).
   Pages are fetched through /api/audit (a website can't read other sites directly), then analysed here in the browser.
   Every check returns: { id, label, status: 'pass'|'warn'|'fail', detail, impact: 'high'|'medium'|'low', fix }
   impact weight: high=3, medium=2, low=1 — used to compute category + overall scores. */


// ---- Talking to /api/audit ------------------------------------------------
async function apiPost(action, url, timeoutMs = 30000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, url }),
      signal: controller.signal,
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(body.error || `The audit service had a problem (error ${res.status}). Please try again in a moment.`)
    return body
  } finally {
    clearTimeout(timer)
  }
}

const IMPACT_WEIGHT = { high: 3, medium: 2, low: 1 };
const GENERIC_LINK_TEXT = ['click here', 'here', 'read more', 'more', 'link', 'this page', 'learn more'];

function chk(id, label, status, detail, impact, fix) {
  return { id, label, status, detail, impact, fix: status === 'pass' ? null : fix };
}

function textOf(el) {
  return (el && el.textContent ? el.textContent.replace(/\s+/g, ' ').trim() : '');
}

function visibleWordCount(doc) {
  const clone = doc.body ? doc.body.cloneNode(true) : null;
  if (!clone) return 0;
  clone.querySelectorAll('script,style,noscript,template').forEach(n => n.remove());
  const text = clone.textContent.replace(/\s+/g, ' ').trim();
  return text ? text.split(' ').length : 0;
}

function looksLikeFilenameAlt(alt, src) {
  if (!alt) return false;
  const stripped = alt.trim().toLowerCase();
  if (/^(img|image|dsc|photo|screenshot)[\-_ ]?\d+$/.test(stripped.replace(/\.(jpg|jpeg|png|gif|webp|svg)$/, ''))) return true;
  if (/\.(jpg|jpeg|png|gif|webp|svg)$/.test(stripped)) return true;
  return false;
}

/* ---------------- META & INDEXABILITY ---------------- */
function checkMeta(doc, headers) {
  const out = [];
  const title = textOf(doc.querySelector('title'));
  if (!title) {
    out.push(chk('title', 'Title tag', 'fail', 'No <title> element found.', 'high',
      'Add a unique, descriptive <title> (50–60 characters) that includes the page\'s primary keyword near the front.'));
  } else if (title.length < 15 || title.length > 65) {
    out.push(chk('title', 'Title tag', 'warn', `Title is ${title.length} characters: "${title}".`, 'medium',
      'Aim for roughly 50–60 characters so it doesn\'t get truncated in search results.'));
  } else {
    out.push(chk('title', 'Title tag', 'pass', `"${title}" (${title.length} chars).`, 'high', null));
  }

  const desc = doc.querySelector('meta[name="description"]');
  const descContent = desc ? (desc.getAttribute('content') || '').trim() : '';
  if (!descContent) {
    out.push(chk('meta-desc', 'Meta description', 'fail', 'No meta description found.', 'high',
      'Add a meta description (140–160 characters) that summarizes the page and gives someone a reason to click from search results.'));
  } else if (descContent.length < 70 || descContent.length > 165) {
    out.push(chk('meta-desc', 'Meta description', 'warn', `${descContent.length} characters.`, 'medium',
      'Tighten to roughly 140–160 characters — long descriptions get cut off, very short ones waste the opportunity.'));
  } else {
    out.push(chk('meta-desc', 'Meta description', 'pass', `${descContent.length} characters.`, 'high', null));
  }

  const canonical = doc.querySelector('link[rel="canonical"]');
  if (!canonical || !canonical.getAttribute('href')) {
    out.push(chk('canonical', 'Canonical URL', 'warn', 'No canonical link tag found.', 'medium',
      'Add <link rel="canonical" href="..."> pointing to the preferred version of this URL to prevent duplicate-content splitting.'));
  } else {
    out.push(chk('canonical', 'Canonical URL', 'pass', canonical.getAttribute('href'), 'medium', null));
  }

  const robotsMeta = doc.querySelector('meta[name="robots"]');
  const robotsContent = (robotsMeta ? robotsMeta.getAttribute('content') : '') || '';
  const xRobotsHeader = headers ? (headers.get('x-robots-tag') || '') : '';
  const blocked = /noindex/i.test(robotsContent) || /noindex/i.test(xRobotsHeader);
  if (blocked) {
    out.push(chk('robots', 'Indexability', 'fail', 'Page is marked noindex (meta robots or X-Robots-Tag header).', 'high',
      'Remove the noindex directive if this page should appear in search results — right now it\'s explicitly excluded.'));
  } else {
    out.push(chk('robots', 'Indexability', 'pass', 'No noindex directive found.', 'high', null));
  }

  const viewport = doc.querySelector('meta[name="viewport"]');
  if (!viewport) {
    out.push(chk('viewport', 'Mobile viewport tag', 'fail', 'No viewport meta tag found.', 'high',
      'Add <meta name="viewport" content="width=device-width, initial-scale=1"> — required for mobile usability, which Google uses for mobile-first indexing.'));
  } else {
    out.push(chk('viewport', 'Mobile viewport tag', 'pass', viewport.getAttribute('content') || '', 'high', null));
  }

  const lang = doc.documentElement.getAttribute('lang');
  if (!lang) {
    out.push(chk('lang', 'Declared language', 'fail', 'No lang attribute on <html>.', 'medium',
      'Add lang="en" (or the appropriate code) to the <html> tag — search engines and screen readers both rely on it.'));
  } else {
    out.push(chk('lang', 'Declared language', 'pass', `lang="${lang}"`, 'medium', null));
  }

  const charset = doc.querySelector('meta[charset]') || doc.querySelector('meta[http-equiv="Content-Type"]');
  if (!charset) {
    out.push(chk('charset', 'Character encoding', 'warn', 'No explicit charset meta tag found.', 'low',
      'Add <meta charset="UTF-8"> as the first tag in <head> to avoid encoding/rendering issues.'));
  } else {
    out.push(chk('charset', 'Character encoding', 'pass', 'Charset declared.', 'low', null));
  }

  return out;
}

/* ---------------- CONTENT & STRUCTURE ---------------- */
function checkContent(doc) {
  const out = [];
  const h1s = Array.from(doc.querySelectorAll('h1'));
  if (h1s.length === 0) {
    out.push(chk('h1', 'H1 heading', 'fail', 'No H1 found on the page.', 'high',
      'Add exactly one H1 that clearly states what the page is about — it\'s the strongest on-page relevance signal after the title.'));
  } else if (h1s.length > 1) {
    out.push(chk('h1', 'H1 heading', 'warn', `${h1s.length} H1 elements found.`, 'medium',
      'Use a single H1 per page. Multiple H1s dilute topical focus and confuse the document outline.'));
  } else {
    out.push(chk('h1', 'H1 heading', 'pass', `"${textOf(h1s[0])}"`, 'high', null));
  }

  const headings = Array.from(doc.querySelectorAll('h1,h2,h3,h4,h5,h6'))
    .map(h => parseInt(h.tagName[1], 10));
  let skipped = false;
  for (let i = 1; i < headings.length; i++) {
    if (headings[i] - headings[i - 1] > 1) { skipped = true; break; }
  }
  if (headings.length === 0) {
    out.push(chk('heading-order', 'Heading hierarchy', 'fail', 'No headings found at all.', 'medium',
      'Break the content into H2/H3 sections — both readers and search engines use heading structure to understand the page.'));
  } else if (skipped) {
    out.push(chk('heading-order', 'Heading hierarchy', 'warn', 'Heading levels skip (e.g. H2 straight to H4).', 'medium',
      'Keep heading levels sequential (H1 → H2 → H3) without skipping — skipped levels break the outline for screen reader users and crawlers.'));
  } else {
    out.push(chk('heading-order', 'Heading hierarchy', 'pass', `${headings.length} headings, sequential.`, 'medium', null));
  }

  const words = visibleWordCount(doc);
  if (words < 150) {
    out.push(chk('word-count', 'Content depth', 'fail', `~${words} visible words.`, 'medium',
      'Thin pages (under ~150 words) rarely rank or satisfy AI-search summarizers. Expand with substantive, specific content.'));
  } else if (words < 300) {
    out.push(chk('word-count', 'Content depth', 'warn', `~${words} visible words.`, 'low',
      'Consider expanding — pages with more thorough coverage of a topic tend to perform better for both search and AI-answer engines.'));
  } else {
    out.push(chk('word-count', 'Content depth', 'pass', `~${words} visible words.`, 'medium', null));
  }

  return out;
}

/* ---------------- IMAGES & MEDIA ---------------- */
function checkImages(doc) {
  const out = [];
  const imgs = Array.from(doc.querySelectorAll('img'));
  if (imgs.length === 0) {
    out.push(chk('img-alt', 'Image alt text', 'pass', 'No images on this page.', 'high', null));
    out.push(chk('img-dims', 'Image dimensions', 'pass', 'No images on this page.', 'medium', null));
    return out;
  }

  const missingAlt = imgs.filter(i => !i.hasAttribute('alt'));
  const emptyAlt = imgs.filter(i => i.hasAttribute('alt') && !i.getAttribute('alt').trim());
  const filenameAlt = imgs.filter(i => looksLikeFilenameAlt(i.getAttribute('alt'), i.getAttribute('src')));
  const badAlt = missingAlt.length + filenameAlt.length;

  if (missingAlt.length > 0) {
    out.push(chk('img-alt', 'Image alt text', 'fail',
      `${missingAlt.length} of ${imgs.length} images have no alt attribute at all.`, 'high',
      'Add an alt attribute to every image. Decorative images should use alt="" (still valid) so screen readers skip them cleanly.'));
  } else if (badAlt > 0 || emptyAlt.length > imgs.length * 0.5) {
    out.push(chk('img-alt', 'Image alt text', 'warn',
      `${filenameAlt.length} image(s) use filename-style alt text; ${emptyAlt.length} use empty alt.`, 'medium',
      'Replace filename-style or blank alt text on meaningful images with a short, specific description of what the image shows.'));
  } else {
    out.push(chk('img-alt', 'Image alt text', 'pass', `${imgs.length} images, alt text looks descriptive.`, 'high', null));
  }

  const missingDims = imgs.filter(i => !i.hasAttribute('width') || !i.hasAttribute('height'));
  if (missingDims.length > imgs.length * 0.3) {
    out.push(chk('img-dims', 'Image dimensions', 'warn',
      `${missingDims.length} of ${imgs.length} images lack explicit width/height.`, 'medium',
      'Add width and height attributes (or aspect-ratio in CSS) so the browser reserves space before the image loads — this prevents layout shift, a Core Web Vitals factor.'));
  } else {
    out.push(chk('img-dims', 'Image dimensions', 'pass', 'Most images declare dimensions.', 'medium', null));
  }

  return out;
}

/* ---------------- ACCESSIBILITY ---------------- */
function checkAccessibility(doc) {
  const out = [];

  const inputs = Array.from(doc.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]),textarea,select'));
  const unlabeled = inputs.filter(inp => {
    const id = inp.getAttribute('id');
    const hasFor = id && doc.querySelector(`label[for="${CSS.escape ? CSS.escape(id) : id}"]`);
    const hasAria = inp.getAttribute('aria-label') || inp.getAttribute('aria-labelledby');
    const wrappedInLabel = inp.closest('label');
    return !hasFor && !hasAria && !wrappedInLabel;
  });
  if (inputs.length === 0) {
    out.push(chk('form-labels', 'Form field labels', 'pass', 'No form fields on this page.', 'high', null));
  } else if (unlabeled.length > 0) {
    out.push(chk('form-labels', 'Form field labels', 'fail',
      `${unlabeled.length} of ${inputs.length} form fields have no associated label.`, 'high',
      'Give every input a <label for="..."> (or aria-label) tied to its id. Unlabeled fields are effectively unusable with a screen reader.'));
  } else {
    out.push(chk('form-labels', 'Form field labels', 'pass', `All ${inputs.length} form fields are labeled.`, 'high', null));
  }

  const landmarks = ['header', 'nav', 'main', 'footer'].filter(tag => doc.querySelector(tag) || doc.querySelector(`[role="${tag === 'main' ? 'main' : tag === 'nav' ? 'navigation' : tag}"]`));
  if (landmarks.length <= 1) {
    out.push(chk('landmarks', 'Landmark regions', 'fail', `Only ${landmarks.length} of 4 landmark regions present (header/nav/main/footer).`, 'medium',
      'Wrap the page in semantic landmarks — <header>, <nav>, <main>, <footer> — so screen reader users can jump between regions instead of reading linearly.'));
  } else if (landmarks.length < 4) {
    out.push(chk('landmarks', 'Landmark regions', 'warn', `${landmarks.length} of 4 landmark regions present.`, 'low',
      'Fill in the missing landmark(s) for a fully navigable structure.'));
  } else {
    out.push(chk('landmarks', 'Landmark regions', 'pass', 'header, nav, main and footer all present.', 'medium', null));
  }

  const links = Array.from(doc.querySelectorAll('a'));
  const genericLinks = links.filter(a => GENERIC_LINK_TEXT.includes(textOf(a).toLowerCase()));
  if (links.length > 0 && genericLinks.length > 0) {
    out.push(chk('link-text', 'Descriptive link text', genericLinks.length > 3 ? 'fail' : 'warn',
      `${genericLinks.length} link(s) use generic text like "click here" or "read more".`, 'medium',
      'Rewrite link text to describe the destination ("Download the 2026 report" instead of "click here") — screen reader users often navigate by a list of links out of context.'));
  } else {
    out.push(chk('link-text', 'Descriptive link text', 'pass', 'No generic link text detected.', 'medium', null));
  }

  out.push(chk('contrast-note', 'Color contrast', 'warn',
    'Not measurable from fetched HTML alone (requires computed/rendered styles).', 'low',
    'Manually check contrast with a tool like the Chrome DevTools contrast checker or WebAIM Contrast Checker — aim for at least 4.5:1 for normal text (WCAG AA).'));

  return out;
}

/* ---------------- TECHNICAL SEO ---------------- */
async function checkTechnical(doc, pageUrl, headers) {
  const out = [];
  const isHttps = pageUrl.startsWith('https://');
  out.push(isHttps
    ? chk('https', 'HTTPS', 'pass', 'Served over HTTPS.', 'high', null)
    : chk('https', 'HTTPS', 'fail', 'Page is served over plain HTTP.', 'high',
      'Move the site to HTTPS. It\'s a confirmed ranking signal and browsers flag HTTP pages as "Not Secure".'));

  const jsonLdScripts = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
  const types = [];
  jsonLdScripts.forEach(s => {
    try {
      const data = JSON.parse(s.textContent);
      const items = Array.isArray(data) ? data : [data];
      items.forEach(it => { if (it && it['@type']) types.push(String(it['@type'])); });
    } catch (e) { /* malformed JSON-LD, ignore */ }
  });
  if (jsonLdScripts.length === 0) {
    out.push(chk('structured-data', 'Structured data (JSON-LD)', 'fail', 'No JSON-LD structured data found.', 'high',
      'Add schema.org JSON-LD (Article, Product, Organization, FAQPage, etc. as fits the page) — it powers rich results and is how AI-search engines reliably extract facts about the page.'));
  } else {
    out.push(chk('structured-data', 'Structured data (JSON-LD)', 'pass', `Types found: ${types.join(', ') || 'unspecified'}.`, 'high', null));
  }

  const ogTitle = doc.querySelector('meta[property="og:title"]');
  const ogDesc = doc.querySelector('meta[property="og:description"]');
  const ogImage = doc.querySelector('meta[property="og:image"]');
  const ogCount = [ogTitle, ogDesc, ogImage].filter(Boolean).length;
  if (ogCount === 0) {
    out.push(chk('open-graph', 'Open Graph tags', 'fail', 'No Open Graph tags found.', 'medium',
      'Add og:title, og:description and og:image so shared links render properly on social platforms and chat apps instead of a bare URL.'));
  } else if (ogCount < 3) {
    out.push(chk('open-graph', 'Open Graph tags', 'warn', `${ogCount} of 3 core Open Graph tags present.`, 'low',
      'Fill in the remaining og: tags for a complete social preview.'));
  } else {
    out.push(chk('open-graph', 'Open Graph tags', 'pass', 'og:title, og:description and og:image all present.', 'medium', null));
  }

  const twitterCard = doc.querySelector('meta[name="twitter:card"]');
  out.push(twitterCard
    ? chk('twitter-card', 'Twitter/X card tags', 'pass', 'twitter:card present.', 'low', null)
    : chk('twitter-card', 'Twitter/X card tags', 'warn', 'No twitter:card meta tag.', 'low',
      'Add twitter:card (and twitter:title/description/image) for a controlled preview when shared on X.'));

  // Best-effort external checks — never let these fail the whole audit.
  const origin = new URL(pageUrl).origin;
  const robotsCheck = await fetchTextSafe(origin + '/robots.txt');
  if (robotsCheck === null) {
    out.push(chk('robots-txt', 'robots.txt', 'warn', 'Could not fetch /robots.txt.', 'low',
      'Add a robots.txt at the site root — even a permissive one — so crawlers have explicit instructions instead of guessing.'));
  } else if (/Disallow:\s*\/\s*$/m.test(robotsCheck) && !/Allow:/i.test(robotsCheck)) {
    out.push(chk('robots-txt', 'robots.txt', 'fail', 'robots.txt appears to disallow the entire site.', 'high',
      'Check robots.txt — a blanket "Disallow: /" will block search engines from crawling anything.'));
  } else {
    out.push(chk('robots-txt', 'robots.txt', 'pass', 'robots.txt reachable and not blanket-blocking.', 'low', null));
  }

  const sitemapCheck = await fetchTextSafe(origin + '/sitemap.xml');
  out.push(sitemapCheck
    ? chk('sitemap', 'XML sitemap', 'pass', 'sitemap.xml reachable at the root.', 'medium', null)
    : chk('sitemap', 'XML sitemap', 'warn', 'No sitemap.xml found at the root.', 'medium',
      'Publish an XML sitemap at /sitemap.xml (and reference it in robots.txt) so crawlers can discover all pages efficiently.'));

  return out;
}

/* ---------------- GEO / AI-SEARCH READINESS ---------------- */
async function checkGeo(doc, pageUrl) {
  const out = [];

  const jsonLdScripts = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
  const relevantTypes = ['Article', 'BlogPosting', 'FAQPage', 'HowTo', 'Product', 'Organization', 'WebPage'];
  let hasRelevant = false;
  jsonLdScripts.forEach(s => {
    try {
      const data = JSON.parse(s.textContent);
      const items = Array.isArray(data) ? data : [data];
      items.forEach(it => { if (it && relevantTypes.includes(it['@type'])) hasRelevant = true; });
    } catch (e) { /* ignore */ }
  });
  out.push(hasRelevant
    ? chk('geo-schema', 'AI-relevant schema type', 'pass', 'Structured data includes an AI/search-relevant type.', 'high', null)
    : chk('geo-schema', 'AI-relevant schema type', 'fail', 'No Article/FAQPage/HowTo/Product/Organization schema found.', 'high',
      'AI answer engines (Google AI Overviews, Perplexity, ChatGPT browsing) lean heavily on structured data to extract clean facts. Add the schema type that matches this page\'s content.'));

  const authorMeta = doc.querySelector('meta[name="author"]') || doc.querySelector('[rel="author"]') || doc.querySelector('.author, .byline');
  out.push(authorMeta
    ? chk('geo-author', 'Author / byline', 'pass', 'Author information detected.', 'medium', null)
    : chk('geo-author', 'Author / byline', 'warn', 'No clear author or byline found.', 'medium',
      'Add a visible author byline and matching author meta tag or Person schema — both classic SEO (E-E-A-T) and AI engines weight demonstrated expertise and attribution.'));

  const dateMeta = doc.querySelector('meta[property="article:published_time"]') ||
    doc.querySelector('meta[name="date"]') || doc.querySelector('time[datetime]');
  out.push(dateMeta
    ? chk('geo-date', 'Published/updated date', 'pass', 'A published or updated date is present.', 'medium', null)
    : chk('geo-date', 'Published/updated date', 'warn', 'No published/updated date found.', 'medium',
      'Expose a clear published or last-updated date (visibly and via <time datetime> or article:modified_time) — freshness signals matter more for AI-answer engines than for classic search.'));

  const h1 = doc.querySelector('h1');
  let firstPara = null;
  if (h1) {
    let el = h1.nextElementSibling;
    let hops = 0;
    while (el && hops < 6) {
      if (el.tagName === 'P' && textOf(el).length > 20) { firstPara = el; break; }
      el = el.nextElementSibling;
      hops++;
    }
  }
  if (!firstPara) firstPara = doc.querySelector('p');
  const paraText = textOf(firstPara);
  if (!paraText || paraText.split(' ').length < 15) {
    out.push(chk('geo-answer-first', 'Answer-first opening', 'warn',
      'The first paragraph after the main heading is short or missing.', 'high',
      'Open with a 2–3 sentence paragraph that directly answers "what is this page about" in plain language — this is the passage AI engines are most likely to quote or summarize.'));
  } else {
    out.push(chk('geo-answer-first', 'Answer-first opening', 'pass',
      `Opening paragraph is ${paraText.split(' ').length} words and reads as a direct answer.`, 'high', null));
  }

  const semanticEls = ['article', 'section', 'main'].filter(tag => doc.querySelector(tag));
  out.push(semanticEls.length >= 2
    ? chk('geo-semantic', 'Semantic HTML5 structure', 'pass', `Uses ${semanticEls.join(', ')}.`, 'low', null)
    : chk('geo-semantic', 'Semantic HTML5 structure', 'warn', 'Little to no semantic HTML5 sectioning (article/section/main).', 'low',
      'Wrap primary content in <main> and <article>/<section> instead of generic <div>s — it helps both accessibility tools and content extractors identify what\'s actually the page content.'));

  const links = Array.from(doc.querySelectorAll('a[href^="http"]'));
  const pageHost = new URL(pageUrl).host;
  const externalLinks = links.filter(a => { try { return new URL(a.href).host !== pageHost; } catch (e) { return false; } });
  out.push(externalLinks.length > 0
    ? chk('geo-citations', 'Outbound citations', 'pass', `${externalLinks.length} outbound link(s) to other domains.`, 'low', null)
    : chk('geo-citations', 'Outbound citations', 'warn', 'No outbound links to external sources.', 'low',
      'Where relevant, link out to primary sources or authoritative references — pages that cite sources are favored by both search quality raters and AI-answer engines.'));

  const origin = new URL(pageUrl).origin;
  const llmsTxt = await fetchTextSafe(origin + '/llms.txt');
  out.push(llmsTxt
    ? chk('geo-llms-txt', 'llms.txt', 'pass', 'llms.txt found at the site root.', 'low', null)
    : chk('geo-llms-txt', 'llms.txt', 'warn', 'No llms.txt found.', 'low',
      'Optional but emerging: llms.txt at the site root gives AI crawlers a curated, plain-language map of the site. Not yet a ranking factor, but low-cost to add.'));

  return out;
}

// robots.txt / sitemap.xml / llms.txt. Sites whose server answers every unknown
// URL with their home page (common with single-page apps) would otherwise look
// like they have these files, so an HTML response counts as "not found".
async function fetchTextSafe(url) {
  try {
    const res = await apiPost('text', url, 15000)
    if (!res.ok || !res.text || !res.text.trim()) return null
    if (/text\/html/i.test(res.contentType || '')) return null
    return res.text
  } catch (e) {
    return null
  }
}

/* ---------------- PERFORMANCE (PageSpeed Insights / Core Web Vitals) ---------------- */
function rateMetric(value, good, needsImprovement) {
  if (value <= good) return 'good';
  if (value <= needsImprovement) return 'needs-improvement';
  return 'poor';
}
function metricStatus(rating) {
  return rating === 'good' ? 'pass' : rating === 'needs-improvement' ? 'warn' : 'fail';
}
function fmtMs(ms) {
  return ms >= 1000 ? (ms / 1000).toFixed(2) + 's' : Math.round(ms) + 'ms';
}

async function checkPerformance(pageUrl) {
  const out = [];

  let data;
  try {
    data = await apiPost('psi', pageUrl, 58000);
  } catch (e) {
    const timedOut = e && e.name === 'AbortError';
    out.push(chk('psi-error', 'PageSpeed Insights check', 'warn',
      timedOut ? 'The performance check timed out.' : `Could not retrieve live performance data: ${e.message}`, 'medium',
      'Re-run the audit. Very slow or unreachable sites can cause PageSpeed Insights itself to time out.'));
    return out;
  }

  if (data && data.psiError) {
    const reason = data.psiError.message || `HTTP ${data.psiError.status}`;
    const isQuota = data.psiError.status === 429 || /quota/i.test(reason);
    out.push(chk('psi-error', 'PageSpeed Insights check', 'warn',
      `Could not retrieve live performance data: ${reason}`, 'medium',
      isQuota
        ? 'Google\'s PageSpeed service is rate-limiting requests right now. Wait a minute and run the audit again.'
        : 'This is usually transient — try re-running the audit. If it persists, the target site may be blocking automated requests.'));
    return out;
  }

  const lh = data.lighthouseResult;
  const audits = lh && lh.audits ? lh.audits : {};
  const perfScore = lh && lh.categories && lh.categories.performance ? Math.round(lh.categories.performance.score * 100) : null;

  if (perfScore !== null) {
    const rating = perfScore >= 90 ? 'good' : perfScore >= 50 ? 'needs-improvement' : 'poor';
    out.push(chk('perf-score', 'Lighthouse performance score (mobile)', metricStatus(rating),
      `${perfScore}/100 — Google's lab-based overall performance score for this page on a simulated mobile connection.`, 'high',
      'Lighthouse\'s "Opportunities" and "Diagnostics" sections (run this same URL at pagespeed.web.dev) list the specific fixes ranked by expected time saved.'));
  }

  // Prefer real-user field data (CrUX) when available; fall back to lab data.
  const field = (data.loadingExperience && data.loadingExperience.metrics) ||
    (data.originLoadingExperience && data.originLoadingExperience.metrics) || null;
  const usingField = !!field;

  const lcpMs = field ? field.LARGEST_CONTENTFUL_PAINT_MS && field.LARGEST_CONTENTFUL_PAINT_MS.percentile
    : (audits['largest-contentful-paint'] && audits['largest-contentful-paint'].numericValue);
  if (lcpMs != null) {
    const rating = rateMetric(lcpMs, 2500, 4000);
    out.push(chk('lcp', 'Largest Contentful Paint (LCP)', metricStatus(rating),
      `${fmtMs(lcpMs)} ${usingField ? '(real-user data)' : '(lab simulation)'} — time until the largest visible element renders.`, 'high',
      'Speed up LCP by compressing/resizing the hero image or largest text block, preloading it, cutting render-blocking CSS/JS, and using a faster server or CDN. Target under 2.5s.'));
  }

  const clsRaw = field ? field.CUMULATIVE_LAYOUT_SHIFT_SCORE && field.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile / 100
    : (audits['cumulative-layout-shift'] && audits['cumulative-layout-shift'].numericValue);
  if (clsRaw != null) {
    const rating = rateMetric(clsRaw, 0.1, 0.25);
    out.push(chk('cls', 'Cumulative Layout Shift (CLS)', metricStatus(rating),
      `${clsRaw.toFixed(3)} ${usingField ? '(real-user data)' : '(lab simulation)'} — how much visible content jumps around while loading.`, 'high',
      'Reserve space for images/ads/embeds with width & height (or aspect-ratio), avoid injecting content above existing content, and preload web fonts to prevent text reflow. Target under 0.1.'));
  }

  const inpMs = field && field.INTERACTION_TO_NEXT_PAINT ? field.INTERACTION_TO_NEXT_PAINT.percentile : null;
  const tbtMs = audits['total-blocking-time'] ? audits['total-blocking-time'].numericValue : null;
  if (inpMs != null) {
    const rating = rateMetric(inpMs, 200, 500);
    out.push(chk('inp', 'Interaction to Next Paint (INP)', metricStatus(rating),
      `${fmtMs(inpMs)} (real-user data) — how responsive the page feels to clicks/taps.`, 'high',
      'Break up long JavaScript tasks, defer non-critical scripts, and reduce main-thread work triggered by interactions. Target under 200ms.'));
  } else if (tbtMs != null) {
    const rating = rateMetric(tbtMs, 200, 600);
    out.push(chk('tbt', 'Total Blocking Time (lab proxy for INP)', metricStatus(rating),
      `${fmtMs(tbtMs)} (lab simulation) — no real-user interaction data yet for this URL, so this lab metric stands in for INP.`, 'medium',
      'Reduce JavaScript execution time on load: split large bundles, defer third-party scripts, and remove unused JS. Target under 200ms.'));
  }

  if (!usingField) {
    out.push(chk('field-data-note', 'Real-user (CrUX) data', 'warn',
      'No Chrome UX Report field data available for this URL — likely too little real traffic. Metrics above are lab simulations only.', 'low',
      'Lab data is a reasonable proxy but can differ from what real visitors on real networks experience — worth re-checking once the page has more traffic.'));
  }

  return out;
}

/* ---------------- TARGET KEYWORD ANALYSIS (optional) ---------------- */
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function countOccurrences(text, phrase) {
  if (!phrase) return 0;
  const pattern = '\\b' + escapeRegex(phrase).replace(/\s+/g, '\\s+') + '\\b';
  const re = new RegExp(pattern, 'gi');
  const matches = text.match(re);
  return matches ? matches.length : 0;
}

function checkKeyword(doc, pageUrl, rawKeyword) {
  const keyword = rawKeyword.trim();
  const kwLower = keyword.toLowerCase();
  const out = [];
  if (!keyword) return out;

  const title = textOf(doc.querySelector('title'));
  const titleLower = title.toLowerCase();
  const titleIdx = titleLower.indexOf(kwLower);
  if (titleIdx === -1) {
    out.push(chk('kw-title', 'Keyword in title', 'fail',
      `"${keyword}" was not found in the title ("${title}").`, 'high',
      `Work "${keyword}" naturally into the title, ideally in the first half — title relevance is one of the strongest signals for ranking on a specific query.`));
  } else if (titleIdx > 25) {
    out.push(chk('kw-title', 'Keyword in title', 'warn',
      `"${keyword}" appears in the title, but late in it.`, 'medium',
      `Move "${keyword}" earlier in the title where you can — earlier placement carries slightly more weight and is what searchers see first.`));
  } else {
    out.push(chk('kw-title', 'Keyword in title', 'pass', `"${keyword}" appears near the start of the title.`, 'high', null));
  }

  const descEl = doc.querySelector('meta[name="description"]');
  const descText = descEl ? (descEl.getAttribute('content') || '') : '';
  out.push(descText.toLowerCase().includes(kwLower)
    ? chk('kw-meta-desc', 'Keyword in meta description', 'pass', `"${keyword}" appears in the meta description.`, 'medium', null)
    : chk('kw-meta-desc', 'Keyword in meta description', 'warn', `"${keyword}" was not found in the meta description.`, 'medium',
      `Include "${keyword}" once in the meta description — it won't move rankings directly, but it's what gets bolded in results and drives click-through.`));

  const h1 = doc.querySelector('h1');
  const h1Text = textOf(h1);
  out.push(h1Text.toLowerCase().includes(kwLower)
    ? chk('kw-h1', 'Keyword in H1', 'pass', `"${keyword}" appears in the H1.`, 'high', null)
    : chk('kw-h1', 'Keyword in H1', 'fail',
      h1Text ? `H1 is "${h1Text}" — it doesn't include "${keyword}".` : 'No H1 found on the page.', 'high',
      `Include "${keyword}" (or a close natural variant) in the H1 — it's the clearest on-page signal of what the page is actually about.`));

  let path = '';
  try { path = new URL(pageUrl).pathname.toLowerCase(); } catch (e) { /* ignore */ }
  const slugWords = kwLower.split(/\s+/).filter(Boolean);
  const slugHit = slugWords.length > 0 && slugWords.every(w => path.includes(w));
  out.push(slugHit
    ? chk('kw-url', 'Keyword in URL', 'pass', 'The URL path includes the keyword terms.', 'medium', null)
    : chk('kw-url', 'Keyword in URL', 'warn', `The URL path (${path || '/'}) doesn't clearly include "${keyword}".`, 'medium',
      `Where practical, use a URL slug that includes "${keyword}" (e.g. /${slugWords.join('-')}/) — a minor but easy signal, and it makes the URL more scannable in search results.`));

  let firstPara = null;
  if (h1) {
    let el = h1.nextElementSibling, hops = 0;
    while (el && hops < 6) {
      if (el.tagName === 'P' && textOf(el).length > 20) { firstPara = el; break; }
      el = el.nextElementSibling; hops++;
    }
  }
  if (!firstPara) firstPara = doc.querySelector('p');
  const introText = textOf(firstPara);
  out.push(introText.toLowerCase().includes(kwLower)
    ? chk('kw-intro', 'Keyword in opening paragraph', 'pass', 'The opening paragraph mentions the keyword.', 'medium', null)
    : chk('kw-intro', 'Keyword in opening paragraph', 'warn', 'The opening paragraph doesn\'t mention the keyword.', 'medium',
      `Mention "${keyword}" within the first paragraph — both classic search and AI-answer engines weight early confirmation that the page matches intent.`));

  const subheads = Array.from(doc.querySelectorAll('h2,h3')).map(h => textOf(h).toLowerCase());
  const headingHit = subheads.some(h => h.includes(kwLower));
  if (subheads.length > 0) {
    out.push(headingHit
      ? chk('kw-subheadings', 'Keyword in subheadings', 'pass', 'At least one H2/H3 includes the keyword or a close variant.', 'low', null)
      : chk('kw-subheadings', 'Keyword in subheadings', 'warn', 'No H2/H3 mentions the keyword.', 'low',
        `Work "${keyword}" (or a natural variant) into at least one subheading — it reinforces topical relevance for crawlers and skimming readers alike.`));
  }

  const imgs = Array.from(doc.querySelectorAll('img'));
  if (imgs.length > 0) {
    const altHit = imgs.some(i => (i.getAttribute('alt') || '').toLowerCase().includes(kwLower));
    out.push(altHit
      ? chk('kw-alt', 'Keyword in an image alt attribute', 'pass', 'At least one image alt attribute references the keyword.', 'low', null)
      : chk('kw-alt', 'Keyword in an image alt attribute', 'warn', 'No image alt text mentions the keyword.', 'low',
        `If an image genuinely depicts "${keyword}", describe that in its alt text — don't force it onto unrelated images just to boost density.`));
  }

  const bodyText = (doc.body ? doc.body.textContent : '').replace(/\s+/g, ' ').trim();
  const totalWords = bodyText ? bodyText.split(' ').length : 0;
  const occurrences = countOccurrences(bodyText, keyword);
  const density = totalWords > 0 ? (occurrences / totalWords) * 100 : 0;
  if (occurrences === 0) {
    out.push(chk('kw-density', 'Keyword density in body copy', 'fail',
      `"${keyword}" does not appear anywhere in the visible body text.`, 'high',
      `Use "${keyword}" naturally a handful of times in the body copy — right now there are zero mentions, which makes ranking for this term very unlikely.`));
  } else if (density > 3) {
    out.push(chk('kw-density', 'Keyword density in body copy', 'warn',
      `"${keyword}" appears ${occurrences} time(s) (~${density.toFixed(1)}% of body words) — unusually dense.`, 'medium',
      'Dial it back — above roughly 2-3% density reads as keyword stuffing, which search engines can penalize. Swap some repetitions for natural synonyms.'));
  } else {
    out.push(chk('kw-density', 'Keyword density in body copy', 'pass',
      `"${keyword}" appears ${occurrences} time(s) (~${density.toFixed(2)}% of body words) — a natural range.`, 'medium', null));
  }

  return out;
}

function scoreCategory(checks) {
  let earned = 0, total = 0;
  checks.forEach(c => {
    const w = IMPACT_WEIGHT[c.impact];
    total += w;
    if (c.status === 'pass') earned += w;
    else if (c.status === 'warn') earned += w * 0.5;
  });
  return total === 0 ? 100 : Math.round((earned / total) * 100);
}

function buildCategoryMeta(hasKeyword, keyword) {
  const m = {};
  m.meta = { label: 'Meta & Indexability', weight: 1.1 };
  if (hasKeyword) m.keyword = { label: `Target Keyword — "${keyword}"`, weight: 1.2 };
  m.performance = { label: 'Performance (Core Web Vitals)', weight: 1.2 };
  m.content = { label: 'Content & Structure', weight: 1.0 };
  m.images = { label: 'Images & Media', weight: 0.8 };
  m.accessibility = { label: 'Accessibility', weight: 1.0 };
  m.technical = { label: 'Technical SEO', weight: 1.1 };
  m.geo = { label: 'GEO / AI-Search Readiness', weight: 1.0 };
  return m;
}


// Many sites answer automated requests with a short "Access Denied" / "verify you are human"
// page, sometimes with a normal 200 status. The report still runs on what we received,
// but it is flagged so the results aren't mistaken for the real page's.
const BLOCK_TITLE = /^(access denied|403 forbidden|forbidden|request blocked|blocked|just a moment\.{0,3}|attention required.*|pardon our interruption.*|access to this page has been denied.*|are you a robot.*|robot check|security check|human verification|please verify you are a human.*|error 1020.*|one more step.*)$/i;
const BLOCK_BODY = /don['\u2019]t have permission to access|request unsuccessful\. incapsula|verify you are (a )?human|enable javascript and cookies to continue|checking your browser before accessing|access to this page has been denied|reference #\d+\.[0-9a-f.]+/i;

function looksLikeBlockPage(doc) {
  if (visibleWordCount(doc) > 300) return false;
  const title = textOf(doc.querySelector('title'));
  const body = textOf(doc.body);
  return BLOCK_TITLE.test(title) || BLOCK_BODY.test(body);
}

async function auditUrl(url, opts) {
  opts = opts || {};
  const onProgress = opts.onProgress || function () {};
  const startedAt = Date.now();

  onProgress('Fetching page…');
  const page = await apiPost('page', url, 30000);
  if (page.status < 200 || page.status >= 300) {
    const blocked = page.status === 401 || page.status === 403 || page.status === 429;
    throw new Error(blocked
      ? `The site responded ${page.status} ${page.statusText}. It may block automated requests or require a login, so it can't be audited from here.`
      : `Fetch failed — the server responded ${page.status} ${page.statusText}.`);
  }
  // Some servers label real HTML with the wrong content type, so also look at the markup itself.
  const looksLikeHtml = /<(?:!doctype\s+html|html|head|body)\b/i.test((page.html || '').slice(0, 5000));
  if (page.contentType && !/html|xml/i.test(page.contentType) && !looksLikeHtml) {
    const type = page.contentType.split(';')[0].trim();
    throw new Error(`That URL returned "${type}" instead of a web page. Sites that block automated requests often do this, so it can't be audited from here.`);
  }
  if (!page.html || !page.html.trim()) {
    throw new Error('The page came back empty, so there was nothing to audit. The site may block automated requests.');
  }
  // Use the address we ended up on (after redirects) for every address-based check.
  url = page.finalUrl;
  const headers = { get: (name) => (String(name).toLowerCase() === 'x-robots-tag' ? page.xRobotsTag || '' : '') };
  const doc = new DOMParser().parseFromString(page.html, 'text/html');
  // Don't refuse: still audit what we received, but flag it so the report can say so.
  const accessDenied = looksLikeBlockPage(doc);

  const targetKeyword = (opts.targetKeyword || '').trim();
  const hasKeyword = !!targetKeyword;

  const categories = {};
  categories.meta = checkMeta(doc, headers);
  if (hasKeyword) categories.keyword = checkKeyword(doc, url, targetKeyword);
  categories.content = checkContent(doc);
  categories.images = checkImages(doc);
  categories.accessibility = checkAccessibility(doc);

  onProgress('Checking technical SEO, GEO signals & live performance (this can take up to a minute)…');
  const [technical, geo, performance] = await Promise.all([
    checkTechnical(doc, url, headers),
    checkGeo(doc, url),
    checkPerformance(url)
  ]);
  categories.technical = technical;
  categories.geo = geo;
  categories.performance = performance;

  const CATEGORY_META = buildCategoryMeta(hasKeyword, targetKeyword);

  onProgress('Scoring…');

  const categoryScores = {};
  let weightedSum = 0, weightTotal = 0;
  Object.keys(categories).forEach(key => {
    const score = scoreCategory(categories[key]);
    categoryScores[key] = score;
    const w = CATEGORY_META[key].weight;
    weightedSum += score * w;
    weightTotal += w;
  });
  const overall100 = Math.round(weightedSum / weightTotal);
  const overallScore10 = Math.round((overall100 / 10) * 10) / 10;

  // Ranking Readiness: emphasizes the factors most tied to organic performance —
  // technical + content + GEO + real performance carry more weight than pure accessibility/media here.
  const rankingWeights = { meta: 1.2, keyword: 1.4, content: 1.3, images: 0.5, accessibility: 0.7, technical: 1.3, geo: 1.0, performance: 1.3 };
  let rWeightedSum = 0, rWeightTotal = 0;
  Object.keys(categoryScores).forEach(key => {
    rWeightedSum += categoryScores[key] * rankingWeights[key];
    rWeightTotal += rankingWeights[key];
  });
  const rankingReadiness = Math.round(rWeightedSum / rWeightTotal);

  const allChecks = Object.keys(categories).flatMap(k => categories[k].map(c => ({ ...c, category: k })));
  const wins = allChecks.filter(c => c.status === 'pass');
  const issues = allChecks.filter(c => c.status !== 'pass')
    .sort((a, b) => IMPACT_WEIGHT[b.impact] - IMPACT_WEIGHT[a.impact]);

  return {
    url,
    title: textOf(doc.querySelector('title')) || '(no title)',
    targetKeyword: hasKeyword ? targetKeyword : null,
    pageTruncated: !!page.truncated,
    accessDenied,
    fetchedAt: new Date().toISOString(),
    tookMs: Date.now() - startedAt,
    overallScore10,
    rankingReadiness,
    categoryScores,
    categoryMeta: CATEGORY_META,
    categories,
    wins,
    issues
  };
}

export { auditUrl };