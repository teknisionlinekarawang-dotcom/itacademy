// editor.js - Editor kode ringan: textarea transparan di atas blok highlight,
// dengan gutter nomor baris dan penanda baris error. Tidak memakai library eksternal.

const RE_HIGHLIGHT = new RegExp(
  [
    "(?<pre>^[ \\t]*#[A-Za-z_]+.*$)",
    "(?<block>/\\*[\\s\\S]*?\\*/|/\\*[\\s\\S]*$)",
    "(?<line>//[^\\n]*|//[^\\n]*$)",
    "(?<str>\"(?:[^\"\\\\\\n]|\\\\.)*\"|\"(?:[^\"\\\\\\n]|\\\\.)*$)",
    "(?<chr>'(?:[^'\\\\\\n]|\\\\.)*'|'(?:[^'\\\\\\n]|\\\\.)*$)",
    "(?<num>\\b0[xX][0-9a-fA-F]+\\b|\\b\\d[\\d.]*(?:[eE][+-]?\\d+)?[uUlLfF]*\\b)",
    "(?<type>\\b(?:void|bool|boolean|char|int|long|short|unsigned|signed|float|double|byte|word|String|Servo)\\b)",
    "(?<kw>\\b(?:if|else|for|while|do|break|continue|return|switch|case|default|const|static|sizeof)\\b)",
    "(?<const>\\b(?:HIGH|LOW|INPUT|INPUT_PULLUP|OUTPUT|LED_BUILTIN|SERIAL|DEC|HEX|BIN|OCT|PI|TWO_PI|HALF_PI|true|false|NULL|A[0-7])\\b)",
    "(?<fn>\\b(?:pinMode|digitalWrite|digitalRead|analogWrite|analogRead|delay|delayMicroseconds|millis|micros|map|constrain|min|max|abs|sq|sqrt|pow|round|floor|ceil|random|randomSeed|bit|bitRead|bitSet|lowByte|highByte|tone|noTone|setup|loop)\\b)",
    "(?<api>\\b(?:Serial|printf|println|print|begin|available|flush|attach|detach|writeMicroseconds|read|write|begin|read)\\b)",
    "(?<id>\\b[A-Za-z_][A-Za-z0-9_]*\\b)",
    "(?<op>[-+*/%=<>!~&|^?:;,.])",
    "(?<br>[(){}\\[\\]])",
  ].join("|"),
  "gm"
);

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export class CodeEditor {
  /**
   * @param {HTMLElement} root elemen pembungkus
   * @param {{onChange: (text:string)=>void, onCursor?: ()=>void}} hooks
   */
  constructor(root, hooks = {}) {
    this.root = root;
    this.hooks = hooks;
    this.root.innerHTML = `
      <div class="editor" role="textbox" aria-multiline="true" aria-label="Editor kode Arduino">
        <div class="gutter" aria-hidden="true"></div>
        <div class="code-area">
          <pre class="highlight" aria-hidden="true"><code></code></pre>
          <div class="err-band" aria-hidden="true"></div>
          <textarea class="input" spellcheck="false" autocomplete="off" autocapitalize="off" autocorrect="off"></textarea>
        </div>
      </div>`;
    this.gutter = root.querySelector(".gutter");
    this.codeEl = root.querySelector(".highlight code");
    this.pre = root.querySelector(".highlight");
    this.area = root.querySelector(".code-area");
    this.input = root.querySelector(".input");
    this.band = root.querySelector(".err-band");
    this.lineHeight = 0;

    this.input.addEventListener("input", () => this.refresh());
    this.input.addEventListener("scroll", () => this.syncScroll());
    this.input.addEventListener("keydown", (e) => this.onKey(e));
    this.input.addEventListener("keyup", () => this.emitCursor());
    this.input.addEventListener("click", () => this.emitCursor());
    this.refresh();
  }

  getValue() { return this.input.value; }

  setValue(text) {
    this.input.value = text;
    this.refresh();
    this.input.scrollTop = 0;
    this.pre.scrollTop = 0;
  }

  focus() { this.input.focus(); }

  refresh() {
    const text = this.input.value;
    // Tokenisasi teks mentah, lalu escape tiap bagian: menghindari entity
    // hasil escape ikut terwarnai.
    let out = "";
    let last = 0;
    RE_HIGHLIGHT.lastIndex = 0;
    let m;
    while ((m = RE_HIGHLIGHT.exec(text)) !== null) {
      out += escapeHtml(text.slice(last, m.index));
      const kinds = m.groups || {};
      const kind = Object.keys(kinds).find((k) => kinds[k] !== undefined);
      out += kind ? `<span class="t-${kind}">${escapeHtml(m[0])}</span>` : escapeHtml(m[0]);
      last = m.index + m[0].length;
      if (m[0].length === 0) RE_HIGHLIGHT.lastIndex++;
    }
    out += escapeHtml(text.slice(last));
    this.codeEl.innerHTML = out;
    const lines = text.split("\n").length;
    if (this.lineCount !== lines) {
      this.lineCount = lines;
      this.gutter.innerHTML = Array.from({ length: lines }, (_, i) => `<div class="ln">${i + 1}</div>`).join("");
    }
    this.syncScroll();
    this.emitCursor();
    this.hooks.onChange?.(text);
  }

  syncScroll() {
    this.pre.scrollTop = this.input.scrollTop;
    this.pre.scrollLeft = this.input.scrollLeft;
    this.gutter.scrollTop = this.input.scrollTop;
  }

  emitCursor() {
    const upto = this.input.value.slice(0, this.input.selectionStart);
    const line = upto.split("\n").length;
    const col = upto.length - upto.lastIndexOf("\n");
    this.hooks.onCursor?.(line, col, this.lineCount);
  }

  /** Tandai baris error; 0 berarti bersih. */
  setError(line) {
    this.gutter.querySelectorAll(".ln.err").forEach((n) => n.classList.remove("err"));
    if (!line || line <= 0) { this.band.style.display = "none"; return; }
    const node = this.gutter.children[line - 1];
    if (node) node.classList.add("err");
    if (!this.lineHeight) {
      const probe = document.createElement("div");
      probe.className = "ln";
      this.gutter.appendChild(probe);
      this.lineHeight = probe.getBoundingClientRect().height;
      probe.remove();
    }
    const padTop = 12;
    this.band.style.display = "block";
    this.band.style.top = `${padTop + (line - 1) * this.lineHeight - this.input.scrollTop}px`;
    this.band.style.height = `${this.lineHeight}px`;
  }

  onKey(e) {
    if (e.key === "Tab") {
      e.preventDefault();
      this.insertAtCaret("  ");
      return;
    }
    if (e.key === "Enter") {
      // Teruskan indentasi baris sebelumnya, dan tambahkan satu level setelah '{'.
      e.preventDefault();
      const pos = this.input.selectionStart;
      const before = this.input.value.slice(0, pos);
      const lineStart = before.lastIndexOf("\n") + 1;
      const curLine = before.slice(lineStart);
      const indent = /^[ \t]*/.exec(curLine)[0];
      const extra = /[{\[]\s*$/.test(curLine) ? "  " : "";
      this.insertAtCaret("\n" + indent + extra);
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "/") {
      e.preventDefault();
      this.toggleComment();
    }
  }

  insertAtCaret(text) {
    const s = this.input.selectionStart, e = this.input.selectionEnd;
    this.input.setRangeText(text, s, e, "end");
    this.refresh();
  }

  toggleComment() {
    const s = this.input.selectionStart, e = this.input.selectionEnd;
    const value = this.input.value;
    const ls = value.lastIndexOf("\n", s - 1) + 1;
    const le = value.indexOf("\n", e);
    const end = le === -1 ? value.length : le;
    const block = value.slice(ls, end);
    const lines = block.split("\n");
    const allCommented = lines.every((l) => /^\s*\/\//.test(l) || l.trim() === "");
    const next = lines.map((l) => (allCommented ? l.replace(/^(\s*)\/\/\s?/, "$1") : l.replace(/^(\s*)/, "$1// "))).join("\n");
    this.input.setRangeText(next, ls, end, "preserve");
    this.refresh();
  }
}
