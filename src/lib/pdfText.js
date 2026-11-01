// PDF to Text — extraction helpers.
//
// Everything runs in the visitor's browser with pdf.js; the PDF is never uploaded.
// pdf.js itself is handed in by the caller (it is loaded only when someone converts a
// file), so this module is safe to import during the static build.

export const MAX_PDF_BYTES = 50 * 1024 * 1024

export class PdfPasswordError extends Error {
  constructor(incorrect) {
    super(incorrect ? 'That password is incorrect.' : 'This PDF is password protected.')
    this.name = 'PdfPasswordError'
    this.incorrect = incorrect
  }
}

// Turns one page's positioned text fragments into lines of text. PDFs store text as
// fragments with coordinates, not as sentences, so line breaks, word gaps and paragraph
// gaps are worked out from where each fragment sits.
export function pageToText(items) {
  const lines = []
  let line = ''
  let lastY = null
  let lastEndX = null
  let lastLineY = null
  let lineHeight = 10

  const flush = () => {
    const text = line.replace(/[ \t]+$/g, '')
    if (text) {
      // A bigger-than-normal vertical gap between two lines marks a new paragraph.
      if (lastLineY !== null && lines.length && lastLineY - lastY > lineHeight * 1.7) lines.push('')
      lines.push(text)
      lastLineY = lastY
    }
    line = ''
    lastEndX = null
  }

  for (const item of items) {
    if (!item || typeof item.str !== 'string') continue
    const x = item.transform ? item.transform[4] : 0
    const y = item.transform ? item.transform[5] : 0
    const height = item.height || lineHeight

    if (lastY !== null && Math.abs(y - lastY) > height * 0.6) {
      flush()
    } else if (lastEndX !== null && x - lastEndX > height * 0.15 && !line.endsWith(' ') && !item.str.startsWith(' ')) {
      line += ' '
    }

    if (item.str) {
      line += item.str
      lineHeight = height
      lastY = y
      lastEndX = x + (item.width || 0)
    }
    if (item.hasEOL) flush()
  }
  flush()
  return lines.join('\n')
}

// Reads every page of a PDF and returns one text string per page.
export async function extractPdf(pdfjs, data, { password, onProgress = () => {} } = {}) {
  const task = pdfjs.getDocument({ data, password, isEvalSupported: false })
  let pdf
  try {
    pdf = await task.promise
  } catch (err) {
    if (err && err.name === 'PasswordException') throw new PdfPasswordError(err.code === 2)
    if (err && err.name === 'InvalidPDFException') throw new Error('This file is not a valid PDF, or it is damaged.')
    if (err && err.name === 'MissingPDFException') throw new Error('The PDF could not be found.')
    throw new Error('This PDF could not be read. It may be damaged or use an unsupported feature.')
  }

  const pages = []
  try {
    for (let n = 1; n <= pdf.numPages; n += 1) {
      onProgress(n, pdf.numPages)
      const page = await pdf.getPage(n)
      const content = await page.getTextContent()
      pages.push(pageToText(content.items))
      page.cleanup()
    }
  } finally {
    await pdf.destroy()
  }
  return pages
}

// Joins lines that were only broken by the page layout back into paragraphs.
export function reflow(text) {
  return text
    .split(/\n{2,}/)
    .map((paragraph) =>
      paragraph
        .replace(/([a-z\u00DF-\u00FF])-\n(?=[a-z\u00DF-\u00FF])/g, '$1') // "exam-\nple" -> "example"
        .replace(/\n+/g, ' ')
        .replace(/[ \t]{2,}/g, ' ')
        .trim()
    )
    .filter(Boolean)
    .join('\n\n')
}

export function buildText(pages, { separators = true, join = false } = {}) {
  const parts = pages.map((text, i) => {
    const body = join ? reflow(text) : text
    return separators && pages.length > 1 ? `--- Page ${i + 1} ---\n\n${body}` : body
  })
  return parts.join('\n\n').trim()
}

export function textStats(text) {
  const trimmed = text.trim()
  return { words: trimmed ? trimmed.split(/\s+/).length : 0, characters: text.length }
}
