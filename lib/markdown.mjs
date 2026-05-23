/**
 * Zero-dependency content toolkit for the FeedZero landing site.
 *
 * Three jobs:
 *   1. parseFrontmatter(text) - split a `---`-delimited frontmatter block from
 *      the markdown body and parse the frontmatter as a small YAML subset.
 *   2. renderInline(str)      - render inline markdown (links, bold, em, code)
 *      in a single string. Raw inline HTML (e.g. <kbd>, <br>) passes through.
 *   3. renderMarkdown(text)   - render a block of markdown (paragraphs, lists,
 *      headings, code fences, raw HTML blocks) to HTML.
 *
 * Content is first-party and trusted, so text is NOT HTML-escaped: authors may
 * drop raw HTML into any field, exactly like the release-notes pipeline does.
 *
 * The YAML subset is deliberately small. Supported:
 *   - nested mappings, indented by two spaces
 *   - sequences of scalars (`- value`) and sequences of mappings (`- key: v`)
 *   - plain (unquoted, verbatim) scalars and "double-" or 'single-quoted' ones
 *   - booleans true/false; everything else stays a string
 *   - full-line `#` comments and blank lines (ignored)
 * Not supported: flow syntax ({}, []), anchors, multi-line block scalars.
 */

// ---------- Frontmatter ----------

export function parseFrontmatter(text) {
  const normalized = text.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) {
    return { data: {}, body: normalized };
  }
  const end = normalized.indexOf("\n---", 4);
  if (end === -1) {
    return { data: {}, body: normalized };
  }
  const fm = normalized.slice(4, end + 1);
  let body = normalized.slice(end + 4);
  if (body.startsWith("\n")) body = body.slice(1);
  return { data: parseYaml(fm), body };
}

const KEY_RE = /^([A-Za-z_][\w-]*):(?:[ \t]+(.*))?$/;
const KEYISH_RE = /^[A-Za-z_][\w-]*:([ \t]|$)/;

export function parseYaml(src) {
  const lines = [];
  for (const raw of src.split("\n")) {
    const stripped = raw.replace(/\s+$/, "");
    if (stripped.trim() === "") continue;
    if (stripped.trim().startsWith("#")) continue;
    const indent = stripped.length - stripped.replace(/^ +/, "").length;
    lines.push({ indent, text: stripped.slice(indent) });
  }
  const state = { i: 0 };
  if (lines.length === 0) return {};
  return parseNode(lines, state, lines[0].indent);
}

function parseNode(lines, state, indent) {
  const first = lines[state.i];
  if (/^-(\s|$)/.test(first.text)) {
    return parseSequence(lines, state, indent);
  }
  return parseMapping(lines, state, indent);
}

function parseMapping(lines, state, indent) {
  const map = {};
  while (state.i < lines.length && lines[state.i].indent === indent) {
    const line = lines[state.i];
    const m = line.text.match(KEY_RE);
    if (!m) break;
    const key = m[1];
    const inline = m[2];
    state.i++;
    if (inline !== undefined && inline !== "") {
      map[key] = parseScalar(inline);
    } else if (state.i < lines.length && lines[state.i].indent > indent) {
      map[key] = parseNode(lines, state, lines[state.i].indent);
    } else {
      map[key] = null;
    }
  }
  return map;
}

function parseSequence(lines, state, indent) {
  const arr = [];
  const childIndent = indent + 2;
  while (
    state.i < lines.length &&
    lines[state.i].indent === indent &&
    /^-(\s|$)/.test(lines[state.i].text)
  ) {
    const rest = lines[state.i].text.replace(/^-\s?/, "");
    if (rest === "") {
      state.i++;
      if (state.i < lines.length && lines[state.i].indent > indent) {
        arr.push(parseNode(lines, state, lines[state.i].indent));
      } else {
        arr.push(null);
      }
      continue;
    }
    // Rewrite the dash line into a normal line at the item's indent so the
    // generic node parser can absorb it plus any deeper continuation lines.
    lines[state.i] = { indent: childIndent, text: rest };
    if (KEYISH_RE.test(rest)) {
      arr.push(parseNode(lines, state, childIndent));
    } else {
      arr.push(parseScalar(rest));
      state.i++;
    }
  }
  return arr;
}

function parseScalar(s) {
  const t = s.trim();
  if (t.length >= 2 && t.startsWith('"') && t.endsWith('"')) {
    return t
      .slice(1, -1)
      .replace(/\\"/g, '"')
      .replace(/\\n/g, "\n")
      .replace(/\\\\/g, "\\");
  }
  if (t.length >= 2 && t.startsWith("'") && t.endsWith("'")) {
    return t.slice(1, -1).replace(/''/g, "'");
  }
  if (t === "true") return true;
  if (t === "false") return false;
  return t;
}

// ---------- Inline markdown ----------

export function renderInline(str) {
  if (str == null) return "";
  let s = String(str);

  // Protect inline code spans from the other inline transforms.
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_m, c) => {
    codes.push(c);
    return `@@CODE${codes.length - 1}@@`;
  });

  // [text](url)
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text, url) => {
    const rel = /^https?:\/\//.test(url) ? ' rel="noopener"' : "";
    return `<a href="${url}"${rel}>${text}</a>`;
  });
  // **bold**
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // *em*
  s = s.replace(/(^|[^*])\*(?!\*)([^*]+)\*(?!\*)/g, "$1<em>$2</em>");

  s = s.replace(/@@CODE(\d+)@@/g, (_m, i) => `<code>${codes[Number(i)]}</code>`);
  return s;
}

// ---------- Block markdown ----------

export function renderMarkdown(text) {
  if (!text) return "";
  const src = text.replace(/\r\n/g, "\n").trim();
  if (src === "") return "";

  const blocks = src.split(/\n{2,}/);
  const out = [];

  for (const block of blocks) {
    const lines = block.split("\n");
    const firstTrim = lines[0].trimStart();

    // Code fence
    if (firstTrim.startsWith("```")) {
      const inner = lines.slice(1, lines[lines.length - 1].trim() === "```" ? -1 : undefined);
      out.push(`<pre><code>${inner.join("\n")}</code></pre>`);
      continue;
    }

    // Raw HTML block / comment: emit verbatim.
    if (firstTrim.startsWith("<")) {
      out.push(block);
      continue;
    }

    // Heading
    const h = firstTrim.match(/^(#{1,4})\s+(.*)$/);
    if (h && lines.length === 1) {
      const level = h[1].length;
      out.push(`<h${level}>${renderInline(h[2])}</h${level}>`);
      continue;
    }

    // Unordered list
    if (/^[-*]\s+/.test(firstTrim)) {
      const items = [];
      let buf = null;
      for (const line of lines) {
        const m = line.trimStart().match(/^[-*]\s+(.*)$/);
        if (m) {
          if (buf !== null) items.push(buf);
          buf = m[1];
        } else if (buf !== null) {
          buf += " " + line.trim();
        }
      }
      if (buf !== null) items.push(buf);
      out.push(
        `<ul>\n${items.map((it) => `    <li>${renderInline(it)}</li>`).join("\n")}\n</ul>`,
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(firstTrim)) {
      const items = [];
      let buf = null;
      for (const line of lines) {
        const m = line.trimStart().match(/^\d+\.\s+(.*)$/);
        if (m) {
          if (buf !== null) items.push(buf);
          buf = m[1];
        } else if (buf !== null) {
          buf += " " + line.trim();
        }
      }
      if (buf !== null) items.push(buf);
      out.push(
        `<ol>\n${items.map((it) => `    <li>${renderInline(it)}</li>`).join("\n")}\n</ol>`,
      );
      continue;
    }

    // Paragraph: join soft lines, honor trailing "  " as a hard break.
    const joined = lines
      .map((l, idx) => {
        const hard = /  $/.test(l);
        return l.trim() + (hard && idx < lines.length - 1 ? "<br>" : "");
      })
      .join(" ")
      .replace(/<br> /g, "<br>");
    out.push(`<p>${renderInline(joined)}</p>`);
  }

  return out.join("\n");
}
