/**
 * Lightweight markdown → HTML converter for Docs Rok document viewer.
 * Handles: h1–h4, bold, italic, inline code, unordered/ordered lists,
 * markdown tables, blockquotes, horizontal rules, checkboxes, paragraphs.
 */

function inlineParse(text: string): string {
  return text
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // Checkboxes
    .replace(/\[x\]/gi, '<span class="cb cb-checked">☑</span>')
    .replace(/\[ \]/g, '<span class="cb">☐</span>')
    // Strikethrough
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
}

function parseTableRow(line: string): string[] {
  return line
    .split('|')
    .slice(1, -1) // remove leading/trailing empty strings from | ... |
    .map((cell) => cell.trim())
}

function isTableSeparator(line: string): boolean {
  return /^\|[\s\-:|]+\|$/.test(line.trim())
}

export function markdownToHtml(markdown: string): string {
  const lines = markdown.split('\n')
  const out: string[] = []

  let inUl = false
  let inOl = false
  let inTable = false
  let tableHeaderDone = false
  let inBlockquote = false

  function closeList() {
    if (inUl) { out.push('</ul>'); inUl = false }
    if (inOl) { out.push('</ol>'); inOl = false }
  }

  function closeTable() {
    if (inTable) {
      if (tableHeaderDone) out.push('</tbody>')
      out.push('</table>')
      inTable = false
      tableHeaderDone = false
    }
  }

  function closeBlockquote() {
    if (inBlockquote) { out.push('</blockquote>'); inBlockquote = false }
  }

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]
    const line = raw.trimEnd()

    // ── Table ───────────────────────────────────────────────
    if (line.startsWith('|')) {
      if (isTableSeparator(line)) {
        // Separator marks end of header row
        if (inTable && !tableHeaderDone) {
          out.push('</thead><tbody>')
          tableHeaderDone = true
        }
        continue
      }

      closeList()
      closeBlockquote()

      if (!inTable) {
        out.push('<table>')
        out.push('<thead>')
        inTable = true
        tableHeaderDone = false
      }

      const cells = parseTableRow(line)
      const tag = tableHeaderDone ? 'td' : 'th'
      out.push(
        '<tr>' +
          cells.map((c) => `<${tag}>${inlineParse(c)}</${tag}>`).join('') +
          '</tr>'
      )
      continue
    }

    // Leaving a table
    closeTable()

    // ── Blank line ──────────────────────────────────────────
    if (line.trim() === '') {
      closeList()
      closeBlockquote()
      continue
    }

    // ── Horizontal rule ─────────────────────────────────────
    if (/^[-*_]{3,}$/.test(line.trim())) {
      closeList()
      closeBlockquote()
      out.push('<hr />')
      continue
    }

    // ── Blockquote ──────────────────────────────────────────
    if (line.startsWith('> ')) {
      closeList()
      if (!inBlockquote) { out.push('<blockquote>'); inBlockquote = true }
      out.push(`<p>${inlineParse(line.slice(2))}</p>`)
      continue
    }
    closeBlockquote()

    // ── Headings ────────────────────────────────────────────
    const h4 = line.match(/^#### (.+)/)
    const h3 = line.match(/^### (.+)/)
    const h2 = line.match(/^## (.+)/)
    const h1 = line.match(/^# (.+)/)

    if (h4) { closeList(); out.push(`<h4>${inlineParse(h4[1])}</h4>`); continue }
    if (h3) { closeList(); out.push(`<h3>${inlineParse(h3[1])}</h3>`); continue }
    if (h2) { closeList(); out.push(`<h2>${inlineParse(h2[1])}</h2>`); continue }
    if (h1) { closeList(); out.push(`<h1>${inlineParse(h1[1])}</h1>`); continue }

    // ── Unordered list ──────────────────────────────────────
    const ul = line.match(/^[-*+] (.+)/)
    if (ul) {
      if (inOl) { out.push('</ol>'); inOl = false }
      if (!inUl) { out.push('<ul>'); inUl = true }
      out.push(`<li>${inlineParse(ul[1])}</li>`)
      continue
    }

    // ── Ordered list ────────────────────────────────────────
    const ol = line.match(/^\d+\. (.+)/)
    if (ol) {
      if (inUl) { out.push('</ul>'); inUl = false }
      if (!inOl) { out.push('<ol>'); inOl = true }
      out.push(`<li>${inlineParse(ol[1])}</li>`)
      continue
    }

    // ── Paragraph ───────────────────────────────────────────
    closeList()
    out.push(`<p>${inlineParse(line)}</p>`)
  }

  // Close anything still open
  closeList()
  closeTable()
  closeBlockquote()

  return out.join('\n')
}
