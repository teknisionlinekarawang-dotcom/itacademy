// interpreter.js - Tree-walking interpreter untuk AST dari parser.js.
// Memakai generator: setiap `delay()` dan batas langkah mengembalikan kontrol ke UI,
// jadi simulasi panjang tidak membekukan browser. Tidak memakai eval()/Function().

import { HIGH, LOW, INPUT, OUTPUT, INPUT_PULLUP, analogAliases, Display } from "./hardware.js";

export class RuntimeError extends Error {
  constructor(message, line) {
    super(line ? `${message} (baris ${line})` : message);
    this.name = "RuntimeError";
    this.line = line || 0;
  }
}

class BreakSignal {}
class ContinueSignal {}
class ReturnSignal {
  constructor(value) { this.value = value; }
}

const YIELD_EVERY = 1200; // langkah antara dua yield ke UI
const FLUSH_US = 40; // ambang akumulasi waktu CPU sebelum menulis ke jam
const DELAY_CHUNK_MS = 25; // presisi animasi saat delay panjang

const SERIAL_NS = { __obj: "Serial" };

function toNum(v) {
  if (typeof v === "number") return v;
  if (typeof v === "boolean") return v ? 1 : 0;
  if (typeof v === "string") { const n = Number(v); return Number.isNaN(n) ? 0 : n; }
  if (v && typeof v === "object" && v.__obj === "Servo") return v.angle || 0;
  return 0;
}
function truthy(v) {
  if (typeof v === "string") return v.length > 0;
  if (v === null || v === undefined) return false;
  return toNum(v) !== 0;
}
function intDiv(a, b) {
  if (b === 0) throw new RuntimeError("Pembagian dengan nol");
  return Math.trunc(a / b);
}
const isIntegral = (v) => typeof v === "number" && Number.isInteger(v);

function toStr(v) {
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v.join("");
  if (typeof v === "number") return Number.isInteger(v) ? String(v) : v.toFixed(2);
  if (v === null || v === undefined) return "";
  if (v && typeof v === "object" && v.__obj === "Servo") return "Servo";
  return String(v);
}

function defaultFor(type) {
  if (!type) return 0;
  if (type.includes("Servo")) return { __obj: "Servo", pin: null, angle: 0 };
  if (displayKind(type) === "lcd") return { __obj: "LCD", disp: null };
  if (displayKind(type) === "oled") return { __obj: "OLED", disp: null };
  if (type.includes("String")) return "";
  return 0;
}

/** Kenali tipe pustaka layar dari nama tipenya. */
function displayKind(type) {
  if (!type) return null;
  if (/LiquidCrystal/.test(type)) return "lcd";
  if (/SSD1306|Adafruit_SSD1306|U8g2|SH1106/.test(type)) return "oled";
  return null;
}

function combine(cur, op, v, line) {
  const a = toNum(cur), b = toNum(v);
  switch (op) {
    case "+=": return typeof cur === "string" ? cur + toStr(v) : a + b;
    case "-=": return a - b;
    case "*=": return a * b;
    case "/=": return b === 0 ? a : (isIntegral(a) && isIntegral(b) ? intDiv(a, b) : a / b);
    case "%=": return b === 0 ? a : a % b;
    case "&=": return Math.trunc(a) & Math.trunc(b);
    case "|=": return Math.trunc(a) | Math.trunc(b);
    case "^=": return Math.trunc(a) ^ Math.trunc(b);
    default: throw new RuntimeError(`Operator "${op}" tak didukung`, line);
  }
}

function stringMethod(s, prop, args, line) {
  switch (prop) {
    case "length": return s.length;
    case "charAt": return s.charCodeAt(Math.trunc(toNum(args[0]))) || 0;
    case "toInt": return parseInt(s, 10) || 0;
    case "toFloat": return parseFloat(s) || 0;
    case "substring": return s.substring(Math.trunc(toNum(args[0])), args[1] === undefined ? s.length : Math.trunc(toNum(args[1])));
    case "toUpperCase": return s.toUpperCase();
    case "toLowerCase": return s.toLowerCase();
    case "indexOf": return s.indexOf(toStr(args[0]));
    default: throw new RuntimeError(`Metode String ".${prop}" tak dikenal`, line);
  }
}

export class Interpreter {
  /** @param {import('./hardware.js').Board} board @param {object} ast */
  constructor(board, ast) {
    this.board = board;
    this.ast = ast;
    this.globals = new Map();
    this.funcs = new Map();
    this.steps = 0;
    this.pendingUs = 0;
    this.usPerStep = 1e6 / (board.spec.stepsPerSecond || 4000000);
    this.depth = 0;
    this.stopped = false;
    this.iterations = 0; // berapa kali loop() sudah selesai
    this.delayUsInIteration = 0; // waktu yang dihabiskan delay() pada iterasi terakhir
    this.buildEnv();
    this.declareGlobals();
  }

  buildEnv() {
    const spec = this.board.spec;
    const consts = {
      HIGH, LOW, INPUT, OUTPUT, INPUT_PULLUP,
      LED_BUILTIN: spec.builtinLed,
      SERIAL: 0, DEC: 10, HEX: 16, OCT: 8, BIN: 2,
      NULL: 0,
      PI: Math.PI, HALF_PI: Math.PI / 2, TWO_PI: Math.PI * 2,
      Serial: SERIAL_NS,
      // Konstanta pustaka layar (OLED SSD1306 / LCD). Font dipetakan ke tinggi piksel.
      WHITE: 1, BLACK: 0,
      ArialMT_Plain_10: 10, ArialMT_Plain_16: 16, ArialMT_Plain_24: 24,
      TEXT_ALIGN_LEFT: 0, TEXT_ALIGN_CENTER: 1, TEXT_ALIGN_RIGHT: 2,
      TEXT_ALIGN_TOP_LEFT: 0, TEXT_ALIGN_TOP_CENTER: 1, TEXT_ALIGN_TOP_RIGHT: 2,
      TEXT_ALIGN_BOTTOM_LEFT: 0, TEXT_ALIGN_BOTTOM_CENTER: 1, TEXT_ALIGN_BOTTOM_RIGHT: 2,
    };
    for (const [name, pin] of Object.entries(analogAliases(this.board.boardId))) consts[name] = pin;
    this.consts = consts;
  }

  declareGlobals() {
    for (const g of this.ast.globals) this.globals.set(g.name, this.materialize(g, [new Map()], g.line));
    for (const f of this.ast.functions) this.funcs.set(f.name, f);
  }

  stop() { this.stopped = true; }

  // ---- scope --------------------------------------------------------------

  find(chain, name) {
    for (let i = chain.length - 1; i >= 0; i--) if (chain[i].has(name)) return chain[i];
    return null;
  }
  lookup(name, chain, line) {
    const s = this.find(chain, name);
    if (s) return s.get(name);
    if (this.globals.has(name)) return this.globals.get(name);
    if (name in this.consts) return this.consts[name];
    throw new RuntimeError(`Variabel "${name}" belum dideklarasikan`, line);
  }
  assignVar(name, value, chain, line) {
    const s = this.find(chain, name);
    if (s) { s.set(name, value); return value; }
    if (this.globals.has(name)) { this.globals.set(name, value); return value; }
    if (name in this.consts) throw new RuntimeError(`"${name}" konstanta bawaan, tidak bisa diubah`, line);
    throw new RuntimeError(`Variabel "${name}" belum dideklarasikan`, line);
  }

  /**
   * Satu langkah eksekusi = waktu CPU berjalan. Ini membuat millis() tetap maju
   * meski program tidak pernah memanggil delay(), seperti di perangkat nyata.
   */
  tick() {
    this.steps++;
    this.pendingUs += this.usPerStep;
    if (this.pendingUs >= FLUSH_US) {
      this.board.advanceMicros(this.pendingUs);
      this.pendingUs = 0;
    }
    return this.steps % YIELD_EVERY === 0;
  }

  /** Paksa akumulasi waktu CPU masuk ke jam papan (dipakai millis/micros). */
  flushTime() {
    if (this.pendingUs > 0) {
      this.board.advanceMicros(this.pendingUs);
      this.pendingUs = 0;
    }
  }

  // ---- siklus hidup -------------------------------------------------------

  /** setup() sekali, lalu loop() terus-menerus. */
  *run() {
    const setup = this.funcs.get("setup");
    const loop = this.funcs.get("loop");
    if (setup) yield* this.callFunction(setup, []);
    while (!this.stopped) {
      this.iterations++;
      this.delayUsInIteration = 0;
      yield* this.callFunction(loop, []);
    }
  }

  *callFunction(fn, args) {
    if (this.depth > 64) throw new RuntimeError("Rekursi terlalu dalam (kemungkinan loop tak berujung)", fn.line);
    this.depth++;
    const scope = new Map();
    fn.params.forEach((p, i) => scope.set(p.name, args[i] !== undefined ? args[i] : defaultFor(p.type)));
    try {
      yield* this.exec(fn.body, [scope]);
    } catch (e) {
      if (e instanceof ReturnSignal) { this.depth--; return e.value; }
      this.depth--;
      throw e;
    }
    this.depth--;
    return 0;
  }

  // ---- pernyataan ---------------------------------------------------------

  *exec(node, chain) {
    if (!node) return;
    switch (node.k) {
      case "block": return yield* this.execBlock(node.body, chain);
      case "vars": {
        const target = chain[chain.length - 1] || new Map();
        for (const d of node.list) target.set(d.name, this.materialize(d, chain, node.line));
        return;
      }
      case "expr":
        if (this.tick(node)) yield;
        return yield* this.eval(node.expr, chain);
      case "if": {
        const t = yield* this.eval(node.test, chain);
        if (truthy(t)) return yield* this.exec(node.cons, chain);
        if (node.alt) return yield* this.exec(node.alt, chain);
        return;
      }
      case "while": {
        for (;;) {
          const t = yield* this.eval(node.test, chain);
          if (!truthy(t)) return;
          if (this.tick(node)) yield;
          try { yield* this.exec(node.body, chain); }
          catch (e) { if (e instanceof BreakSignal) return; if (!(e instanceof ContinueSignal)) throw e; }
        }
      }
      case "dowhile": {
        for (;;) {
          try { yield* this.exec(node.body, chain); }
          catch (e) { if (e instanceof BreakSignal) return; if (!(e instanceof ContinueSignal)) throw e; }
          if (this.tick(node)) yield;
          const t = yield* this.eval(node.test, chain);
          if (!truthy(t)) return;
        }
      }
      case "for": {
        const scope = new Map();
        const inner = [...chain, scope];
        if (node.init) {
          if (node.init.k === "vars") for (const d of node.init.list) scope.set(d.name, this.materialize(d, inner, node.line));
          else yield* this.exec(node.init, inner);
        }
        for (;;) {
          if (node.test) {
            const t = yield* this.eval(node.test, inner);
            if (!truthy(t)) return;
          }
          if (this.tick(node)) yield;
          try { yield* this.exec(node.body, inner); }
          catch (e) { if (e instanceof BreakSignal) return; if (!(e instanceof ContinueSignal)) continue; }
          if (node.update) yield* this.eval(node.update.expr, inner);
        }
      }
      case "return": {
        const value = node.value ? yield* this.eval(node.value, chain) : 0;
        throw new ReturnSignal(value);
      }
      case "break": throw new BreakSignal();
      case "continue": throw new ContinueSignal();
      default: throw new RuntimeError(`Pernyataan tak dikenal "${node.k}"`, node.line);
    }
  }

  *execBlock(stmts, chain) {
    const scope = new Map();
    const inner = [...chain, scope];
    for (const s of stmts) {
      if (this.stopped) return;
      if (s.k === "vars") {
        for (const d of s.list) scope.set(d.name, this.materialize(d, inner, s.line));
        continue;
      }
      yield* this.exec(s, inner);
    }
  }

  /** Deklarasi tidak mengandung delay, jadi generator dijalankan sampai selesai. */
  materialize(decl, chain, line) {
    const run = (gen) => { let r = gen.next(); while (!r.done) r = gen.next(); return r.value; };
    if (decl.arraySize !== null && decl.arraySize !== undefined) {
      const size = Math.max(0, Math.min(256, Math.trunc(toNum(run(this.eval(decl.arraySize, chain))))));
      const base = decl.type && decl.type.includes("String") ? "" : 0;
      if (decl.value && decl.value.k === "list") return decl.value.items.map((it) => run(this.eval(it, chain)));
      return Array.from({ length: size }, () => base);
    }
    if (decl.value) {
      if (decl.value.k === "list") return decl.value.items.map((it) => run(this.eval(it, chain)));
      if (decl.value.k === "ctor") return this.makeObject(decl.value);
      return run(this.eval(decl.value, chain));
    }
    return defaultFor(decl.type);
  }

  /** Buat instance layar dari deklarasi konstruktor, mis. `LiquidCrystal_I2C lcd(0x27,16,2);`. */
  makeObject(ctor) {
    const run = (gen) => { let r = gen.next(); while (!r.done) r = gen.next(); return r.value; };
    const nums = ctor.args.map((a) => { try { return toNum(run(this.eval(a, [new Map()]))); } catch { return 0; } });
    const kind = displayKind(ctor.type);
    if (kind === "lcd") {
      // LiquidCrystal_I2C(address, cols, rows) -> pakai argumen terakhir sbg ukuran.
      const cols = nums.length >= 2 ? nums[nums.length - 2] : 16;
      const rows = nums.length >= 1 ? nums[nums.length - 1] : 2;
      const disp = this.board.addDisplay(new Display("lcd", { cols, rows }));
      return { __obj: "LCD", disp };
    }
    if (kind === "oled") {
      // SSD1306Wire(address, sda, scl): ukuran layar tetap 128x64 bawaan.
      const disp = this.board.addDisplay(new Display("oled", { w: 128, h: 64 }));
      return { __obj: "OLED", disp };
    }
    return defaultFor(ctor.type);
  }

  // ---- ekspresi -----------------------------------------------------------

  *eval(node, chain) {
    if (!node) return 0;
    switch (node.k) {
      case "num": case "str": return node.v;
      case "null": return 0;
      case "id": return this.lookup(node.name, chain, node.line);
      case "cast": {
        const v = yield* this.eval(node.e, chain);
        return /int|long|short|byte|word|char|bool/.test(node.type) ? Math.trunc(toNum(v)) : toNum(v);
      }
      case "un": {
        const v = yield* this.eval(node.e, chain);
        if (node.op === "!") return truthy(v) ? 0 : 1;
        if (node.op === "-") return -toNum(v);
        if (node.op === "+") return toNum(v);
        if (node.op === "~") return ~Math.trunc(toNum(v));
        throw new RuntimeError(`Operator unary "${node.op}" tak didukung`, node.line);
      }
      case "bin": return yield* this.binary(node, chain);
      case "ternary": {
        const t = yield* this.eval(node.test, chain);
        return truthy(t) ? yield* this.eval(node.cons, chain) : yield* this.eval(node.alt, chain);
      }
      case "assign": return yield* this.assignNode(node, chain);
      case "update": return yield* this.updateNode(node, chain);
      case "index": {
        const arr = yield* this.eval(node.arr, chain);
        const idx = Math.trunc(toNum(yield* this.eval(node.idx, chain)));
        if (Array.isArray(arr)) {
          if (idx < 0 || idx >= arr.length) throw new RuntimeError(`Indeks [${idx}] di luar jangkauan 0..${arr.length - 1}`, node.line);
          return arr[idx];
        }
        if (typeof arr === "string") return idx < arr.length ? arr.charCodeAt(idx) : 0;
        throw new RuntimeError("Nilai ini tidak bisa di-indeks", node.line);
      }
      case "member": {
        const obj = yield* this.eval(node.obj, chain);
        if (obj && typeof obj === "object" && obj.__obj === "Servo") return obj[node.prop];
        throw new RuntimeError(`Akses anggota ".${node.prop}" tanpa panggilan() tidak didukung`, node.line);
      }
      case "call": return yield* this.callNode(node, chain);
      case "list": {
        const out = [];
        for (const it of node.items) out.push(yield* this.eval(it, chain));
        return out;
      }
      default: throw new RuntimeError(`Ekspresi tak dikenal "${node.k}"`, node.line);
    }
  }

  *binary(node, chain) {
    const op = node.op;
    if (op === "&&") { const a = yield* this.eval(node.l, chain); return truthy(a) ? (truthy(yield* this.eval(node.r, chain)) ? 1 : 0) : 0; }
    if (op === "||") { const a = yield* this.eval(node.l, chain); return truthy(a) ? 1 : (truthy(yield* this.eval(node.r, chain)) ? 1 : 0); }

    const a = yield* this.eval(node.l, chain);
    const b = yield* this.eval(node.r, chain);
    if (this.tick(node)) yield;

    if (typeof a === "string" || typeof b === "string") {
      const sa = toStr(a), sb = toStr(b);
      switch (op) {
        case "+": return sa + sb;
        case "==": return sa === sb ? 1 : 0;
        case "!=": return sa === sb ? 0 : 1;
        case "<": return sa < sb ? 1 : 0;
        case ">": return sa > sb ? 1 : 0;
        case "<=": return sa <= sb ? 1 : 0;
        case ">=": return sa >= sb ? 1 : 0;
      }
    }
    const x = toNum(a), y = toNum(b);
    switch (op) {
      case "+": return x + y;
      case "-": return x - y;
      case "*": return x * y;
      case "/": return isIntegral(x) && isIntegral(y) ? intDiv(x, y) : x / y;
      case "%": return y === 0 ? 0 : x % y;
      case "==": return x === y ? 1 : 0;
      case "!=": return x !== y ? 1 : 0;
      case "<": return x < y ? 1 : 0;
      case ">": return x > y ? 1 : 0;
      case "<=": return x <= y ? 1 : 0;
      case ">=": return x >= y ? 1 : 0;
      case "&": return Math.trunc(x) & Math.trunc(y);
      case "|": return Math.trunc(x) | Math.trunc(y);
      case "^": return Math.trunc(x) ^ Math.trunc(y);
      case "<<": return Math.trunc(x) * Math.pow(2, Math.trunc(y));
      case ">>": return intDiv(Math.trunc(x), Math.pow(2, Math.trunc(y)));
      default: throw new RuntimeError(`Operator "${op}" tak didukung`, node.line);
    }
  }

  *assignNode(node, chain) {
    const t = node.target;
    let v;
    if (t.k === "id") {
      v = node.value.k === "list" ? (() => { throw new RuntimeError("Assignment list hanya untuk deklarasi", node.line); })()
        : yield* this.eval(node.value, chain);
      if (this.tick(node)) yield;
      if (node.op === "=") return this.assignVar(t.name, v, chain, node.line);
      return this.assignVar(t.name, combine(this.lookup(t.name, chain, node.line), node.op, v, node.line), chain, node.line);
    }
    if (t.k === "index") {
      const arr = yield* this.eval(t.arr, chain);
      const idx = Math.trunc(toNum(yield* this.eval(t.idx, chain)));
      v = yield* this.eval(node.value, chain);
      if (this.tick(node)) yield;
      if (!Array.isArray(arr)) throw new RuntimeError("Tidak bisa menulis ke indeks nilai ini", node.line);
      if (idx < 0 || idx >= arr.length) throw new RuntimeError(`Indeks [${idx}] di luar jangkauan 0..${arr.length - 1}`, node.line);
      arr[idx] = node.op === "=" ? v : combine(arr[idx], node.op, v, node.line);
      return arr[idx];
    }
    throw new RuntimeError("Target assignment tidak valid", node.line);
  }

  *updateNode(node, chain) {
    const delta = node.op === "++" ? 1 : -1;
    if (node.e.k === "id") {
      const cur = toNum(this.lookup(node.e.name, chain, node.line));
      this.assignVar(node.e.name, cur + delta, chain, node.line);
      return node.prefix ? cur + delta : cur;
    }
    if (node.e.k === "index") {
      const arr = yield* this.eval(node.e.arr, chain);
      const idx = Math.trunc(toNum(yield* this.eval(node.e.idx, chain)));
      if (!Array.isArray(arr) || idx < 0 || idx >= arr.length) throw new RuntimeError("Indeks tidak valid untuk ++/--", node.line);
      const cur = toNum(arr[idx]);
      arr[idx] = cur + delta;
      return node.prefix ? arr[idx] : cur;
    }
    throw new RuntimeError("Operator ++/-- butuh variabel atau elemen array", node.line);
  }

  *args(list, chain) {
    const out = [];
    for (const a of list) out.push(yield* this.eval(a, chain));
    return out;
  }

  *callNode(node, chain) {
    const callee = node.callee;

    if (callee.k === "member") {
      const obj = yield* this.eval(callee.obj, chain);
      const args = yield* this.args(node.args, chain);
      if (this.tick(node)) yield;
      if (obj && typeof obj === "object" && obj.__obj === "Serial") return this.serialMethod(callee.prop, args, node.line);
      if (obj && typeof obj === "object" && obj.__obj === "Servo") return this.servoMethod(obj, callee.prop, args, node.line);
      if (obj && typeof obj === "object" && obj.__obj === "LCD") return this.lcdMethod(obj, callee.prop, args, node.line);
      if (obj && typeof obj === "object" && obj.__obj === "OLED") return this.oledMethod(obj, callee.prop, args, node.line);
      if (typeof obj === "string") return stringMethod(obj, callee.prop, args, node.line);
      const owner = callee.obj.name || "objek";
      throw new RuntimeError(`${owner}.${callee.prop}() tidak dikenal - pastikan "${owner}" dideklarasikan dengan tipe yang benar`, node.line);
    }

    if (callee.k !== "id") throw new RuntimeError("Panggilan fungsi tidak valid", node.line);
    const fname = callee.name;

    if (this.funcs.has(fname)) {
      const args = yield* this.args(node.args, chain);
      if (this.tick(node)) yield;
      return yield* this.callFunction(this.funcs.get(fname), args);
    }

    const args = yield* this.args(node.args, chain);
    if (this.tick(node)) yield;

    if (fname === "delay" || fname === "delayMicroseconds") return yield* this.wait(fname, args, node.line);
    return this.builtin(fname, args, node.line);
  }

  /** delay() memajukan jam semu lalu yield supaya host mengatur pacing. */
  *wait(fname, args, line) {
    const raw = toNum(args[0] || 0);
    if (raw < 0) throw new RuntimeError("delay() tidak menerima nilai negatif", line);
    const totalMs = fname === "delay" ? Math.min(raw, 120000) : Math.min(raw / 1000, 120000);
    this.flushTime();
    let left = totalMs;
    if (left <= 0) {
      const us = fname === "delay" ? raw * 1000 : raw;
      this.delayUsInIteration += us;
      this.board.advanceMicros(us);
      return 0;
    }
    while (left > 0 && !this.stopped) {
      const chunk = Math.min(left, DELAY_CHUNK_MS);
      left -= chunk;
      this.delayUsInIteration += chunk * 1000;
      this.board.advanceMicros(chunk * 1000);
      yield { wait: chunk };
    }
    return 0;
  }

  // ---- API bawaan ---------------------------------------------------------

  serialMethod(prop, args, line) {
    const s = this.board.serial;
    const base = args.length > 1 ? Math.trunc(toNum(args[1])) : 10;
    const fmt = (v) => {
      if (typeof v === "string") return v;
      const n = toNum(v);
      if (base === 16) return n.toString(16);
      if (base === 2) return Math.trunc(n).toString(2);
      if (base === 8) return Math.trunc(n).toString(8);
      if (typeof v === "number" && !Number.isInteger(v)) return v.toFixed(base >= 10 ? 2 : base);
      return String(Math.trunc(n));
    };
    switch (prop) {
      case "begin": this.baud = toNum(args[0]); return 0;
      case "end": return 0;
      case "print": s.print(args.map(fmt).join("")); return 0;
      case "println": s.println(args.length ? args.map(fmt).join("") : ""); return 0;
      case "printf": s.print(formatC(args[0] === undefined ? "" : toStr(args[0]), args.slice(1))); return 0;
      case "write": s.print(args.map(fmt).join("")); return 0;
      case "flush": return 0;
      case "available": return 0;
      case "read": return -1;
      case "parseInt": return 0;
      default: throw new RuntimeError(`Serial.${prop}() belum didukung simulator`, line);
    }
  }

  servoMethod(obj, prop, args, line) {
    const b = this.board;
    switch (prop) {
      case "attach": {
        obj.pin = Math.trunc(toNum(args[0]));
        if (!Number.isFinite(obj.pin)) throw new RuntimeError("Servo.attach() butuh nomor pin", line);
        b.servoAttach(obj.pin);
        return obj.pin;
      }
      case "detach": b.servoDetach(obj.pin); return 0;
      case "write": obj.angle = Math.trunc(toNum(args[0])); b.servoWrite(obj.pin, args[0]); return 0;
      case "writeMicroseconds": b.servoWriteMicroseconds(obj.pin, toNum(args[0])); return 0;
      case "read": return b.servoRead(obj.pin);
      case "readMicroseconds": return Math.round(500 + (b.servoRead(obj.pin) / 180) * 1900);
      default: throw new RuntimeError(`Metode Servo ".${prop}()" tak dikenal`, line);
    }
  }

  /** Format nilai untuk tampilan layar (serupa Print yang dipakai pustaka). */
  screenText(v) {
    if (typeof v === "string") return v;
    if (typeof v === "number") return Number.isInteger(v) ? String(v) : v.toFixed(2);
    if (v === null || v === undefined) return "";
    return String(v);
  }

  lcdMethod(obj, prop, args, line) {
    const d = obj.disp;
    if (!d) throw new RuntimeError("Objek LCD belum dibuat", line);
    const num = (i) => Math.trunc(toNum(args[i] || 0));
    switch (prop) {
      case "begin": {
        if (args.length >= 2) { d.cols = Math.max(1, num(0)); d.rows = Math.max(1, num(1)); d.grid = Array.from({ length: d.rows }, () => Array(d.cols).fill(" ")); }
        d.home();
        return 0;
      }
      case "init": case "home": d.home(); return 0;
      case "clear": d.clear(); return 0;
      case "backlight": d.backlight = true; return 0;
      case "noBacklight": d.backlight = false; return 0;
      case "setCursor": d.setCursor(num(0), num(1)); return 0;
      case "print": d.write(this.screenText(args[0] === undefined ? "" : args[0])); return 0;
      case "println": d.println(this.screenText(args[0] === undefined ? "" : args[0])); return 0;
      case "scrollDisplayLeft": d.scrollLeft(); return 0;
      case "scrollDisplayRight": d.scrollRight(); return 0;
      case "autoscroll": case "noAutoscroll": case "createChar": case "cursor": case "noCursor":
      case "blink": case "noBlink": case "display": case "noDisplay": return 0;
      default: throw new RuntimeError(`Metode LCD ".${prop}()" belum didukung simulator`, line);
    }
  }

  oledMethod(obj, prop, args, line) {
    const d = obj.disp;
    if (!d) throw new RuntimeError("Objek layar OLED belum dibuat", line);
    const num = (i) => toNum(args[i] || 0);
    switch (prop) {
      case "init": case "begin": return 0;
      case "clearDisplay": d.clearPending(); return 0;
      case "display": d.commit(); this.board.emit("display", d); return 0;
      case "setFont": { const f = Math.trunc(num(0)); d.font = f === 16 || f === 24 ? f : 10; return 0; }
      case "setTextAlignment": d.align = Math.trunc(num(0)); return 0;
      case "flipScreenVertically": d.flip = true; return 0;
      case "drawString": d.add({ t: "text", x: num(0), y: num(1), s: this.screenText(args[2] === undefined ? "" : args[2]), font: d.font }); return 0;
      case "drawStringCentered": d.add({ t: "text", x: num(0), y: num(1), s: this.screenText(args[2] === undefined ? "" : args[2]), font: d.font, centered: true }); return 0;
      case "setPixel": case "drawPixel": d.add({ t: "px", x: num(0), y: num(1) }); return 0;
      case "drawLine": d.add({ t: "line", x0: num(0), y0: num(1), x1: num(2), y1: num(3) }); return 0;
      case "drawRect": d.add({ t: "rect", x: num(0), y: num(1), w: num(2), h: num(3) }); return 0;
      case "fillRect": d.add({ t: "fill", x: num(0), y: num(1), w: num(2), h: num(3) }); return 0;
      case "drawCircle": d.add({ t: "circle", x: num(0), y: num(1), r: num(2) }); return 0;
      case "fillCircle": d.add({ t: "fillcircle", x: num(0), y: num(1), r: num(2) }); return 0;
      case "fillScreen": d.clearPending(); d.add({ t: "fill", x: 0, y: 0, w: d.w, h: d.h }); return 0;
      case "width": return d.w;
      case "height": return d.h;
      case "textWidth": return d.textWidth(args[0] === undefined ? "" : args[0]);
      default: throw new RuntimeError(`Metode OLED ".${prop}()" belum didukung simulator`, line);
    }
  }

  builtin(name, args, line) {
    const b = this.board;
    const num = (i, d = 0) => (args[i] === undefined ? d : toNum(args[i]));
    switch (name) {
      case "pinMode": {
        const m = args[1];
        const mode = typeof m === "string" ? m : truthy(m) ? OUTPUT : INPUT;
        b.pinMode(num(0), mode);
        return 0;
      }
      case "digitalWrite": b.digitalWrite(num(0), truthy(args[1]) ? HIGH : LOW); return 0;
      case "digitalRead": return b.digitalRead(num(0));
      case "analogWrite": case "ledcWrite": b.analogWrite(num(0), num(1)); return 0;
      case "analogRead": return b.analogRead(num(0));
      case "analogReadResolution": case "analogWriteResolution": case "ledcSetup":
      case "ledcAttach": case "ledcAttachPin": case "randomSeed": case "tone":
      case "noTone": case "shiftOut": return 0;

      case "millis": this.flushTime(); return Math.floor(b.timeUs / 1000);
      case "micros": this.flushTime(); return Math.floor(b.timeUs);

      case "map": {
        const [x, inMin, inMax, outMin, outMax] = [0, 1, 2, 3, 4].map((i) => Math.trunc(num(i)));
        if (inMax === inMin) return outMin;
        return intDiv((x - inMin) * (outMax - outMin), inMax - inMin) + outMin;
      }
      case "constrain": { const v = num(0), lo = num(1), hi = num(2); return v < lo ? lo : v > hi ? hi : v; }
      case "min": return Math.min(num(0), num(1));
      case "max": return Math.max(num(0), num(1));
      case "abs": return Math.abs(num(0));
      case "sq": return num(0) * num(0);
      case "sqrt": return Math.sqrt(Math.max(0, num(0)));
      case "pow": return Math.pow(num(0), num(1));
      case "round": return Math.round(num(0));
      case "floor": return Math.floor(num(0));
      case "ceil": return Math.ceil(num(0));
      case "sin": return Math.sin(num(0));
      case "cos": return Math.cos(num(0));
      case "tan": return Math.tan(num(0));
      case "random": {
        if (args.length === 0) return Math.floor(Math.random() * 100000000);
        if (args.length === 1) return Math.floor(Math.random() * Math.max(1, num(0)));
        return num(0) + Math.floor(Math.random() * Math.max(1, num(1) - num(0)));
      }
      case "bit": return Math.pow(2, Math.trunc(num(0)));
      case "bitRead": return intDiv(num(0), Math.pow(2, Math.trunc(num(1)))) & 1;
      case "bitSet": return Math.trunc(num(0)) | Math.pow(2, Math.trunc(num(1)));
      case "bitClear": return Math.trunc(num(0)) & ~Math.pow(2, Math.trunc(num(1)));
      case "lowByte": return Math.trunc(num(0)) & 0xff;
      case "highByte": return intDiv(Math.trunc(num(0)), 256) & 0xff;
      case "String": return toStr(args[0] === undefined ? "" : args[0]);
      default:
        throw new RuntimeError(`Fungsi "${name}()" belum didukung simulator ini`, line);
    }
  }
}

/** Implementasi singkat printf: %d %i %u %f %s %c %% */
function formatC(template, args) {
  let i = 0;
  return String(template).replace(/%(-?)(\d*)([diufscxXb%])/g, (m, dash, pad, conv) => {
    if (conv === "%") return "%";
    const v = args[i++];
    let out;
    if (conv === "s") out = toStr(v);
    else if (conv === "f") out = toNum(v).toFixed(2);
    else if (conv === "c") out = String.fromCharCode(Math.trunc(toNum(v)));
    else if (conv === "x" || conv === "X") out = Math.trunc(toNum(v)).toString(conv === "x" ? 16 : 16).toUpperCase();
    else if (conv === "b") out = Math.trunc(toNum(v)).toString(2);
    else out = String(Math.trunc(toNum(v)));
    return pad ? out.padStart(Number(pad), dash ? " " : "0") : out;
  });
}
