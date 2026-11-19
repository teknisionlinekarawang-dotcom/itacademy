// parser.js - Tokenizer + recursive-descent parser untuk subset C++ Arduino.
// Hasil: AST { libs, defines, globals, functions, errors }.
// Tidak memakai eval()/Function() sehingga aman dan bisa diuji di Node.

export class ParseError extends Error {
  constructor(message, line, col) {
    super(line ? `${message} (baris ${line}${col ? ", kolom " + col : ""})` : message);
    this.name = "ParseError";
    this.line = line || 0;
    this.col = col || 0;
  }
}

const PRIMITIVES = new Set([
  "void", "bool", "boolean", "char", "unsigned", "signed", "short", "int", "long", "float", "double", "byte", "word",
]);
const KEYWORDS = new Set([
  ...PRIMITIVES, "const", "static", "if", "else", "for", "while", "do", "break", "continue",
  "return", "true", "false", "NULL", "nullptr", "switch", "case", "default",
]);

const PUNCT3 = [">>=", "<<=", "..."];
const PUNCT2 = [">>", "<<", "==", "!=", "<=", ">=", "&&", "||", "++", "--", "+=", "-=", "*=", "/=", "%=", "->", "&=", "|=", "^="];
const PUNCT1 = "+-*/%=<>!~&|^?:;,()[]{}.".split("");

/** @typedef {{t:string,v:any,line:number,col:number}} Token */

export function tokenize(src) {
  const out = [];
  let i = 0, line = 1, col = 1;
  const n = src.length;

  const push = (t, v) => { out.push({ t, v, line, col }); };
  const adv = (k = 1) => {
    for (let j = 0; j < k; j++) {
      if (src[i] === "\n") { line++; col = 1; } else col++;
      i++;
    }
  };

  while (i < n) {
    const c = src[i];
    // whitespace
    if (c === " " || c === "\t" || c === "\r" || c === "\n") { adv(); continue; }
    // komentar
    if (c === "/" && src[i + 1] === "/") { while (i < n && src[i] !== "\n") adv(); continue; }
    if (c === "/" && src[i + 1] === "*") {
      adv(2);
      while (i < n && !(src[i] === "*" && src[i + 1] === "/")) adv();
      adv(2);
      continue;
    }
    // preprosesor: ambil satu baris penuh
    if (c === "#") {
      const startLine = line;
      let text = "";
      while (i < n && src[i] !== "\n") { text += src[i]; adv(); }
      out.push({ t: "pre", v: text.trim(), line: startLine, col });
      continue;
    }
    // identifier / keyword
    if (/[A-Za-z_]/.test(c)) {
      let s = "";
      while (i < n && /[A-Za-z0-9_]/.test(src[i])) { s += src[i]; adv(); }
      push(KEYWORDS.has(s) ? "kw" : "id", s);
      continue;
    }
    // angka
    if (/[0-9]/.test(c) || (c === "." && /[0-9]/.test(src[i + 1]))) {
      const startLine = line, startCol = col;
      let s = "";
      if (c === "0" && /[xX]/.test(src[i + 1])) {
        adv(2); s = "0x";
        while (i < n && /[0-9a-fA-F]/.test(src[i])) { s += src[i]; adv(); }
      } else if (c === "0" && /[bB]/.test(src[i + 1])) {
        adv(2); s = "0b";
        while (i < n && /[01]/.test(src[i])) { s += src[i]; adv(); }
      } else {
        while (i < n && /[0-9.eE]/.test(src[i])) {
          if (src[i] === "e" || src[i] === "E") { s += src[i]; adv(); if (/[+-]/.test(src[i])) { s += src[i]; adv(); } }
          else { s += src[i]; adv(); }
        }
      }
      while (i < n && /[uUlLfF]/.test(src[i])) adv(); // suffiks
      const v = /^0x/i.test(s) ? parseInt(s, 16) : /^0b/i.test(s) ? parseInt(s.slice(2), 2) : parseFloat(s);
      out.push({ t: "num", v, line: startLine, col: startCol });
      continue;
    }
    // karakter 'x'
    if (c === "'") {
      const startLine = line, startCol = col;
      adv();
      let s = "";
      while (i < n && src[i] !== "'") {
        if (src[i] === "\\") { adv(); s += unesc(src[i]); adv(); }
        else { s += src[i]; adv(); }
      }
      adv();
      out.push({ t: "chr", v: s.charCodeAt(0) || 0, text: s, line: startLine, col: startCol });
      continue;
    }
    // string "..."
    if (c === '"') {
      const startLine = line, startCol = col;
      adv();
      let s = "";
      while (i < n && src[i] !== '"' && src[i] !== "\n") {
        if (src[i] === "\\") { adv(); s += unesc(src[i]); adv(); }
        else { s += src[i]; adv(); }
      }
      if (src[i] !== '"') throw new ParseError("String belum ditutup", startLine, startCol);
      adv();
      out.push({ t: "str", v: s, line: startLine, col: startCol });
      continue;
    }
    // operator / punctuation
    const three = src.slice(i, i + 3), two = src.slice(i, i + 2);
    const m3 = PUNCT3.find((p) => three.startsWith(p) && p.length === 3);
    if (m3) { push("op", m3); adv(3); continue; }
    const m2 = PUNCT2.find((p) => two === p);
    if (m2) { push("op", m2); adv(2); continue; }
    if (PUNCT1.includes(c)) { push("op", c); adv(); continue; }
    throw new ParseError(`Karakter tak dikenal "${c}"`, line, col);
  }
  out.push({ t: "eof", v: null, line, col });
  return out;
}

function unesc(c) {
  switch (c) {
    case "n": return "\n"; case "t": return "\t"; case "r": return "\r";
    case "0": return "\0"; case "\\": return "\\"; case "'": return "'";
    case '"': return '"'; default: return c;
  }
}

/** Ganti pemanggilan macro object-like dengan token nilainya. */
function applyDefines(tokens) {
  const defines = new Map();
  const libs = [];
  const kept = [];
  for (const t of tokens) {
    if (t.t !== "pre") { kept.push(t); continue; }
    const m = /^#\s*define\s+([A-Za-z_][A-Za-z0-9_]*)\s+(.*)$/.exec(t.v);
    const inc = /^#\s*include\s*[<"]([^>"]+)[>"]/.exec(t.v);
    if (inc) { libs.push(inc[1]); continue; }
    if (m) {
      let body;
      try { body = tokenize(m[2] + "\n"); } catch { body = [{ t: "eof" }]; }
      defines.set(m[1], body.slice(0, -1).map((x) => (x.t === "id" && x.v === m[1] ? { ...x, macro: m[1] } : x)));
      continue;
    }
    // #ifdef, #pragma, dll. diabaikan.
  }
  // Substitusi bertahap (maks 4 putaran) agar #define bertingkat bekerja.
  let cur = kept, pass = 0;
  while (pass++ < 4) {
    let changed = false;
    const next = [];
    for (const t of cur) {
      if (t.t === "id" && defines.has(t.v) && !t.macro) {
        next.push(...defines.get(t.v));
        changed = true;
      } else next.push(t);
    }
    cur = next;
    if (!changed) break;
  }
  return { tokens: cur, defines, libs };
}

// ---------------------------------------------------------------------------

class Parser {
  constructor(src) {
    const { tokens, defines, libs } = applyDefines(tokenize(src));
    this.toks = tokens;
    this.i = 0;
    this.defines = defines;
    this.libs = libs;
  }

  peek(k = 0) { return this.toks[Math.min(this.i + k, this.toks.length - 1)]; }
  next() { return this.toks[this.i++]; }
  at(t, v) { const p = this.peek(); return p.t === t && (v === undefined || p.v === v); }
  eat(t, v) { if (this.at(t, v)) { this.next(); return true; } return false; }
  isOp(...ops) { const p = this.peek(); return p.t === "op" && ops.includes(p.v); }
  expect(t, v, what) {
    if (!this.at(t, v)) {
      const p = this.peek();
      throw new ParseError(`Butuh ${what || v || t}, ditemukan "${p.v ?? "akhir berkas"}"`, p.line, p.col);
    }
    return this.next();
  }

  parseProgram() {
    const globals = [], functions = [];
    while (!this.at("eof")) {
      const s = this.parseStatement(true);
      if (s.k === "fn") functions.push(s);
      else if (s.k === "vars") s.list.forEach((v) => globals.push(v));
      else if (s.k === "empty") { /* ; kosong */ }
      else {
        const p = this.peek();
        throw new ParseError(`Deklarasi tingkat atas tidak didukung: "${p.v}"`, p.line, p.col);
      }
      this.eat("op", ";");
    }
    return { libs: this.libs, defines: [...this.defines.keys()], globals, functions };
  }

  parseType() {
    const p = this.peek();
    if (p.t !== "kw" && p.t !== "id") return null;
    if (p.t === "kw" && (p.v === "const" || p.v === "static")) {
      this.next();
      const inner = this.parseType();
      if (!inner) return null;
      return "const " + inner;
    }
    if (PRIMITIVES.has(p.v)) {
      let s = "";
      while (this.peek().t === "kw" && PRIMITIVES.has(this.peek().v)) {
        s += (s ? " " : "") + this.next().v;
      }
      return s;
    }
    // Tipe kelas (Servo, WiFiClient, ...): huruf besar + diikuti identifier.
    if (/^[A-Z][A-Za-z0-9_]*$/.test(p.v) && this.peek(1).t === "id") { this.next(); return p.v; }
    return null;
  }

  parseStatement(top = false) {
    const p = this.peek();

    if (this.eat("op", "{")) {
      const body = [];
      while (!this.at("op", "}") && !this.at("eof")) {
        const before = this.i;
        const s = this.parseStatement();
        if (s.k !== "empty") body.push(s);
        if (s.k !== "fn") this.eat("op", ";");
        if (this.i === before) {
          const p = this.peek();
          throw new ParseError(`Tidak bisa melanjutkan pada "${p.v ?? "akhir berkas"}"`, p.line, p.col);
        }
      }
      this.expect("op", "}", "}");
      return { k: "block", body };
    }
    if (this.at("op", ";")) { this.next(); return { k: "empty" }; }

    if (p.t === "kw") {
      switch (p.v) {
        case "if": {
          this.next();
          const test = this.parseParenExpr();
          const cons = this.parseStatement();
          // Titik-koma penutup pernyataan tunggal bukan bagian dari if; lewati agar `else` terlihat.
          while (this.at("op", ";")) this.next();
          let alt = null;
          if (this.peek().t === "kw" && this.peek().v === "else") {
            this.next();
            alt = this.parseStatement();
            while (this.at("op", ";")) this.next();
          }
          return { k: "if", test, cons, alt };
        }
        case "while": {
          this.next();
          const test = this.parseParenExpr();
          return { k: "while", test, body: this.parseStatement() };
        }
        case "do": {
          this.next();
          const body = this.parseStatement();
          this.expect("kw", "while", "while");
          const test = this.parseParenExpr();
          return { k: "dowhile", body, test };
        }
        case "for": {
          this.next();
          this.expect("op", "(", "for (");
          let init = null;
          if (!this.at("op", ";")) init = this.parseStatement();
          this.expect("op", ";", ";");
          let test = null;
          if (!this.at("op", ";")) test = this.parseExpr();
          this.expect("op", ";", ";");
          let update = null;
          if (!this.at("op", ")")) update = { k: "expr", expr: this.parseExpr() };
          this.expect("op", ")", ")");
          return { k: "for", init, test, update, body: this.parseStatement() };
        }
        case "return": {
          this.next();
          const value = this.at("op", ";") ? null : this.parseExpr();
          return { k: "return", value };
        }
        case "break": this.next(); return { k: "break" };
        case "continue": this.next(); return { k: "continue" };
        case "switch": throw new ParseError("switch/case belum didukung pada simulator ini", p.line, p.col);
      }
    }

    // Deklarasi: `tipe nama [= nilai];` atau `tipe nama[n];`
    const type = this.parseType();
    if (type) {
      const decls = [];
      do {
        const nameTok = this.expect("id", undefined, "nama variabel");
        let arraySize = null;
        if (this.eat("op", "[")) {
          arraySize = this.parseExpr();
          this.expect("op", "]", "]");
        }
        let value = null;
        if (this.eat("op", "=")) {
          if (this.at("op", "{")) value = this.parseInitList();
          else value = this.parseExpr();
        }
        decls.push({ k: "var", type, name: nameTok.v, arraySize, value, line: nameTok.line });
      } while (this.eat("op", ","));

      // `Tipe nama(args) ...`: bisa definisi fungsi (diikuti `{`) atau
      // deklarasi objek lewat konstruktor (diikuti `;`), mis.
      // `LiquidCrystal_I2C lcd(0x27, 16, 2);`.
      if (decls.length === 1 && !decls[0].arraySize && decls[0].value === null && this.at("op", "(")) {
        const fnName = decls[0].name;
        if (this.tokenAfterParen() === ";") {
          const ctor = { k: "ctor", type, args: this.parseArgList(), line: decls[0].line };
          decls[0].value = ctor;
          return { k: "vars", list: decls, forEach: (f) => decls.forEach(f) };
        }
        const params = this.parseParams();
        if (this.at("op", "{")) {
          const body = this.parseStatement();
          return { k: "fn", type, name: fnName, params, body };
        }
        throw new ParseError(`Prototipe fungsi "${fnName}" diabaikan; simulator butuh isi fungsi`, p.line, p.col);
      }
      return { k: "vars", list: decls, forEach: (f) => decls.forEach(f) };
    }

    if (top) throw new ParseError(`Deklarasi tingkat atas tidak didukung: "${p.v}"`, p.line, p.col);
    return { k: "expr", expr: this.parseExpr() };
  }

  parseInitList() {
    this.expect("op", "{", "{");
    const items = [];
    while (!this.at("op", "}")) {
      items.push(this.parseExpr());
      if (!this.eat("op", ",")) break;
    }
    this.expect("op", "}", "}");
    return { k: "list", items };
  }

  /** Intai tanpa mengonsumsi: nilai token tepat setelah kurung tutup yang
   *  cocok dengan "(" pada posisi kursor. Dipakai membedakan fungsi vs konstruktor. */
  tokenAfterParen() {
    let j = this.i + 1; // mulai setelah "("
    let depth = 1;
    while (j < this.toks.length && depth > 0) {
      const t = this.toks[j];
      if (t.t === "op" && t.v === "(") depth++;
      else if (t.t === "op" && t.v === ")") depth--;
      j++;
    }
    return this.toks[Math.min(j, this.toks.length - 1)].v;
  }

  /** Daftar argumen `( expr, expr, ... )` sebagai ekspresi, untuk nilai konstruktor. */
  parseArgList() {
    this.expect("op", "(", "(");
    const args = [];
    while (!this.at("op", ")")) {
      args.push(this.parseExpr());
      if (!this.eat("op", ",")) break;
    }
    this.expect("op", ")", ")");
    return args;
  }

  parseParams() {
    this.expect("op", "(", "(");
    const params = [];
    while (!this.at("op", ")")) {
      const type = this.parseType() || "int";
      let name = "arg" + params.length;
      if (this.at("id")) name = this.next().v;
      while (!this.at("op", ")") && !this.at("op", ",")) this.next(); // abaikan * & []
      params.push({ type, name });
      this.eat("op", ",");
    }
    this.expect("op", ")", ")");
    return params;
  }

  parseParenExpr() {
    this.expect("op", "(", "(");
    const e = this.parseExpr();
    this.expect("op", ")", ")");
    return e;
  }

  // Precedence climbing -----------------------------------------------------
  parseExpr() { return this.assign(); }

  assign() {
    const left = this.ternary();
    const p = this.peek();
    if (p.t === "op" && ["=", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^="].includes(p.v)) {
      this.next();
      const right = this.assign();
      return { k: "assign", op: p.v, target: left, value: right, line: p.line };
    }
    return left;
  }

  ternary() {
    const test = this.binary(0);
    if (this.eat("op", "?")) {
      const cons = this.assign();
      this.expect("op", ":", ":");
      const alt = this.assign();
      return { k: "ternary", test, cons, alt };
    }
    return test;
  }

  static LEVELS = [["||"], ["&&"], ["|"], ["^"], ["&"], ["==", "!="], ["<=", ">=", "<", ">"], ["<<", ">>"], ["+", "-"], ["*", "/", "%"]];

  binary(level = 0) {
    const levels = Parser.LEVELS;
    if (level >= levels.length) return this.unary();
    let left = this.binary(level + 1);
    for (;;) {
      const p = this.peek();
      if (p.t === "op" && levels[level].includes(p.v)) {
        this.next();
        const right = this.binary(level + 1);
        left = { k: "bin", op: p.v, l: left, r: right, line: p.line };
      } else break;
    }
    return left;
  }

  unary() {
    const p = this.peek();
    if (p.t === "op" && ["!", "-", "+", "~", "++", "--"].includes(p.v)) {
      this.next();
      const e = this.unary();
      if (p.v === "++" || p.v === "--") return { k: "update", op: p.v, e, prefix: true, line: p.line };
      return { k: "un", op: p.v, e, line: p.line };
    }
    return this.postfix();
  }

  postfix() {
    let node = this.primary();
    for (;;) {
      const p = this.peek();
      if (p.t === "op" && p.v === "(") {
        this.next();
        const args = [];
        while (!this.at("op", ")")) {
          args.push(this.parseExpr());
          if (!this.eat("op", ",")) break;
        }
        this.expect("op", ")", ")");
        node = { k: "call", callee: node, args, line: p.line };
      } else if (p.t === "op" && p.v === "[") {
        this.next();
        const idx = this.parseExpr();
        this.expect("op", "]", "]");
        node = { k: "index", arr: node, idx, line: p.line };
      } else if (p.t === "op" && (p.v === "." || p.v === "->")) {
        this.next();
        const prop = this.next();
        if (prop.t !== "id" && prop.t !== "kw") throw new ParseError("Butuh nama anggota setelah '.'", p.line, p.col);
        node = { k: "member", obj: node, prop: prop.v, line: p.line };
      } else if (p.t === "op" && (p.v === "++" || p.v === "--")) {
        this.next();
        node = { k: "update", op: p.v, e: node, prefix: false, line: p.line };
      } else break;
    }
    return node;
  }

  primary() {
    const p = this.next();
    switch (p.t) {
      case "num": return { k: "num", v: p.v, line: p.line };
      case "str": return { k: "str", v: p.v, line: p.line };
      case "chr": return { k: "num", v: p.v, line: p.line };
      case "id": return { k: "id", name: p.v, line: p.line };
      case "op":
        if (p.v === "(") { const e = this.parseExpr(); this.expect("op", ")", ")"); return e; }
        if (p.v === "{") { this.i--; return this.parseInitList(); }
        throw new ParseError(`Token tak terduga "${p.v}"`, p.line, p.col);
      case "kw":
        if (p.v === "true") return { k: "num", v: 1, line: p.line };
        if (p.v === "false") return { k: "num", v: 0, line: p.line };
        if (p.v === "NULL" || p.v === "nullptr") return { k: "null", line: p.line };
        if (PRIMITIVES.has(p.v)) { // mis. (int)x
          this.i--;
          const type = this.parseType();
          if (this.eat("op", "(")) { const e = this.parseExpr(); this.expect("op", ")", ")"); return { k: "cast", type, e }; }
        }
        throw new ParseError(`Kata kunci "${p.v}" tak terduga`, p.line, p.col);
      case "eof": throw new ParseError("Berkas berakhir di tengah ekspresi", p.line, p.col);
      default: throw new ParseError(`Token tak terduga "${p.v}"`, p.line, p.col);
    }
  }
}

/** Parse sumber, kembalikan { ast, error } alih-alih melempar. */
export function parse(src) {
  try {
    const ast = new Parser(src).parseProgram();
    const names = new Set();
    for (const g of ast.globals) names.add(g.name);
    for (const f of ast.functions) names.add(f.name);
    const missing = [];
    if (!ast.functions.some((f) => f.name === "setup")) missing.push("setup()");
    if (!ast.functions.some((f) => f.name === "loop")) missing.push("loop()");
    if (missing.length) return { ast: null, error: new ParseError(`Fungsi wajib belum ada: ${missing.join(", ")}`, 0, 0) };
    return { ast, error: null };
  } catch (e) {
    if (e instanceof ParseError) return { ast: null, error: e };
    return { ast: null, error: new ParseError(e.message || String(e), 0, 0) };
  }
}
