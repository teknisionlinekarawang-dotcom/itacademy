// hardware.js - Model papan virtual: pin, PWM, ADC, servo, jam semu, dan serial.
// Tidak ada dependensi pada DOM, jadi modul ini bisa diuji dengan Node.

export const HIGH = 1;
export const LOW = 0;
export const INPUT = "INPUT";
export const OUTPUT = "OUTPUT";
export const INPUT_PULLUP = "INPUT_PULLUP";

/** Spesifikasi papan yang didukung. */
export const BOARDS = {
  uno: {
    id: "uno",
    label: "Arduino Uno",
    mcu: "ATmega328P",
    vcc: 5,
    adcMax: 1023,
    pwmMax: 255,
    digital: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    analog: [14, 15, 16, 17, 18, 19],
    analogNames: { 14: "A0", 15: "A1", 16: "A2", 17: "A3", 18: "A4", 19: "A5" },
    pwm: [3, 5, 6, 9, 10, 11],
    builtinLed: 13,
    clockMHz: 16,
    stepsPerSecond: 4000000,
    notes: "Pin 0 dan 1 dipakai Serial (RX/TX). Pin 13 adalah LED bawaan.",
  },
  esp32: {
    id: "esp32",
    label: "ESP32 DevKit v1",
    mcu: "ESP32-WROOM-32",
    vcc: 3.3,
    adcMax: 4095,
    pwmMax: 255,
    digital: [2, 4, 5, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26, 27, 32, 33],
    analog: [32, 33, 34, 35, 18, 19],
    analogNames: { 32: "A4", 33: "A5", 34: "A6", 35: "A7", 18: "A0", 19: "A1" },
    pwm: [2, 4, 5, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26, 27, 32, 33],
    builtinLed: 2,
    clockMHz: 240,
    stepsPerSecond: 20000000,
    notes: "GPIO34 dan GPIO35 hanya bisa input. GPIO6-11 terpakai untuk flash internal - hindari.",
  },
};

/** Peta nama alias analog (A0, A1, ...) ke nomor pin fisik papan. */
export function analogAliases(boardId) {
  const spec = BOARDS[boardId] || BOARDS.uno;
  const out = {};
  for (const [pin, label] of Object.entries(spec.analogNames)) {
    if (/^A\d$/.test(label)) out[label] = Number(pin);
  }
  return out;
}

/** Nama pin yang bisa dibaca manusia, mis. 14 -> "A0", 13 -> "13". */
export function pinName(boardId, pin) {
  const spec = BOARDS[boardId] || BOARDS.uno;
  const alias = spec.analogNames[pin];
  return alias ? alias : String(pin);
}

/** Log serial dengan pembatas baris agar memori stabil saat loop panjang. */
export class SerialLog {
  constructor(limit = 1500) {
    this.limit = limit;
    this.lines = [];
    this.listeners = new Set();
    this.partial = "";
  }
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
  _flushPartial() {
    if (!this.partial) return;
    this.lines.push({ kind: "line", text: this.partial });
    this.partial = "";
  }
  print(text) {
    const parts = String(text).split("\n");
    for (let i = 0; i < parts.length; i++) {
      this.partial += parts[i];
      if (i < parts.length - 1) {
        this.lines.push({ kind: "line", text: this.partial });
        this.partial = "";
      }
    }
    this._emit();
  }
  println(text) {
    this.print(String(text) + "\n");
  }
  _emit() {
    if (this.lines.length > this.limit) this.lines.splice(0, this.lines.length - this.limit);
    for (const fn of this.listeners) fn();
  }
  clear() {
    this.lines = [];
    this.partial = "";
    for (const fn of this.listeners) fn();
  }
}

/** Layar virtual: LCD karakter (matriks teks) atau OLED (tumpukan primitif).
 *  OLED memakai model buffer ganda seperti pustaka nyata: gambar ditulis ke
 *  buffer, lalu display() menyalinnya ke layar yang terlihat. */
export class Display {
  constructor(kind, opts = {}) {
    this.kind = kind; // "lcd" | "oled"
    if (kind === "lcd") {
      this.cols = clampInt(opts.cols, 1, 40, 16);
      this.rows = clampInt(opts.rows, 1, 8, 2);
      this.grid = [];
      this.clear();
      this.cursor = { c: 0, r: 0 };
      this.backlight = true;
    } else {
      this.w = clampInt(opts.w, 16, 256, 128);
      this.h = clampInt(opts.h, 8, 128, 64);
      this.pending = [];
      this.visible = [];
      this.version = 0;
      this.font = 10;
      this.align = 0;
      this.flip = false;
    }
  }

  // ---- LCD karakter ----
  clear() {
    this.grid = Array.from({ length: this.rows }, () => Array(this.cols).fill(" "));
    this.cursor = { c: 0, r: 0 };
  }
  home() { this.cursor = { c: 0, r: 0 }; }
  setCursor(c, r) {
    this.cursor = {
      c: clampInt(c, 0, this.cols - 1, 0),
      r: clampInt(r, 0, this.rows - 1, 0),
    };
  }
  /** Tulis satu karakter pada kursor lalu majukan (membungkus antar baris). */
  putChar(ch) {
    if (ch === "\n") { this.cursor = { c: 0, r: this.cursor.r + 1 }; return; }
    this.grid[this.cursor.r][this.cursor.c] = ch;
    this.cursor.c++;
    if (this.cursor.c >= this.cols) { this.cursor.c = 0; this.cursor.r++; }
    if (this.cursor.r >= this.rows) this.cursor.r = this.rows - 1;
  }
  write(text) { for (const ch of String(text)) this.putChar(ch); }
  println(text) { this.write(String(text) + "\n"); }
  /** Geser seluruh isi satu kolom ke kiri (karakter hilang di kiri, ruang di kanan). */
  scrollLeft() { for (const row of this.grid) { row.shift(); row.push(" "); } }
  scrollRight() { for (const row of this.grid) { row.pop(); row.unshift(" "); } }
  textRows() { return this.grid.map((r) => r.join("")); }

  // ---- OLED primitif (gambar ke buffer) ----
  add(p) { this.pending.push(p); }
  clearPending() { this.pending = []; }
  commit() { this.visible = this.pending.slice(); this.version++; }
  textWidth(s) { return String(s).length * Math.round(this.font * 0.6); }
}

function clampInt(v, lo, hi, dflt) {
  const n = Math.trunc(Number(v));
  if (!Number.isFinite(n)) return dflt;
  return Math.max(lo, Math.min(hi, n));
}

export class Board {
  /** @param {string} boardId kunci BOARDS */
  constructor(boardId = "esp32") {
    this.boardId = BOARDS[boardId] ? boardId : "esp32";
    this.spec = BOARDS[this.boardId];
    this.timeUs = 0;
    this.pins = new Map(); // pin -> { mode, out, pwm }
    this.inputDrive = new Map(); // pin -> 0/1 dari UI
    this.analogSource = new Map(); // pin -> 0..1 dari UI
    this.servos = new Map(); // pin -> { angle, attached }
    this.displays = []; // daftar Display aktif (LCD/OLED) dari sketch
    this.serial = new SerialLog();
    this.listeners = new Set();
    this.warnings = [];
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
  emit(type, detail) {
    for (const fn of this.listeners) fn(type, detail);
  }

  setBoard(boardId) {
    if (!BOARDS[boardId] || boardId === this.boardId) return false;
    this.boardId = boardId;
    this.spec = BOARDS[boardId];
    // Pin berbeda antar papan, jadi sumber input dari UI harus dilepas.
    this.inputDrive.clear();
    this.analogSource.clear();
    this.reset();
    this.emit("board", this.spec);
    return true;
  }

  /** Bersihkan hasil eksekusi, tetapi pertahankan setelan input UI. */
  reset() {
    this.timeUs = 0;
    this.pins.clear();
    this.servos.clear();
    this.displays = [];
    this.warnings = [];
    this.emit("reset", null);
  }

  /** Daftarkan layar yang dibuat interpreter, lalu beri tahu UI. */
  addDisplay(d) {
    this.displays.push(d);
    this.emit("display", d);
    return d;
  }
  firstDisplay(kind) {
    return this.displays.find((d) => d.kind === kind) || null;
  }

  pin(pin) {
    const p = Math.trunc(Number(pin));
    if (!Number.isFinite(p)) throw new Error(`Nomor pin tidak valid: ${pin}`);
    if (!this.pins.has(p)) this.pins.set(p, { mode: null, out: 0, pwm: 0 });
    return this.pins.get(p);
  }

  // ---- API Arduino -------------------------------------------------------

  pinMode(pin, mode) {
    const rec = this.pin(pin);
    rec.mode = mode;
    if (mode === INPUT_PULLUP) rec.out = 1;
    this.emit("pin", { pin: this.pinLabel(pin), rec });
  }

  digitalWrite(pin, value) {
    const rec = this.pin(pin);
    const v = value ? HIGH : LOW;
    if (rec.out === v) return;
    rec.out = v;
    this.emit("pin", { pin: this.pinLabel(pin), rec });
  }

  digitalRead(pin) {
    const p = Math.trunc(Number(pin));
    const rec = this.pin(p);
    if (this.inputDrive.has(p)) return this.inputDrive.get(p) ? HIGH : LOW;
    if (rec.mode === OUTPUT) return rec.out ? HIGH : LOW;
    if (rec.mode === INPUT_PULLUP) return HIGH;
    return LOW;
  }

  analogWrite(pin, value) {
    const p = Math.trunc(Number(pin));
    const rec = this.pin(p);
    const v = Math.max(0, Math.min(this.spec.pwmMax, Math.trunc(Number(value) || 0)));
    if (!this.spec.pwm.includes(p)) {
      const msg = `Pin ${this.pinLabel(p)} tidak mendukung PWM pada ${this.spec.label}.`;
      if (!this.warnings.includes(msg)) {
        this.warnings.push(msg);
        this.emit("warning", msg);
      }
    }
    rec.pwm = v;
    rec.mode = rec.mode || OUTPUT;
    rec.out = v > 0 ? HIGH : LOW;
    this.emit("pin", { pin: this.pinLabel(p), rec });
  }

  analogRead(pin) {
    const p = Math.trunc(Number(pin));
    const norm = this.analogSource.has(p) ? this.analogSource.get(p) : 0;
    return Math.round(norm * this.spec.adcMax);
  }

  // ---- Servo -------------------------------------------------------------

  servoAttach(pin) {
    const p = Math.trunc(Number(pin));
    if (!this.servos.has(p)) this.servos.set(p, { angle: 0, attached: true });
    this.servos.get(p).attached = true;
    this.emit("servo", { pin: this.pinLabel(p), angle: this.servos.get(p).angle });
  }

  servoWrite(pin, angle) {
    const p = Math.trunc(Number(pin));
    const rec = this.servos.get(p);
    if (!rec || !rec.attached) {
      const msg = `Servo pada pin ${this.pinLabel(p)} belum dipanggil attach().`;
      if (!this.warnings.includes(msg)) {
        this.warnings.push(msg);
        this.emit("warning", msg);
      }
      return;
    }
    const a = Math.max(0, Math.min(180, Math.round(Number(angle) || 0)));
    if (rec.angle === a) return;
    rec.angle = a;
    this.emit("servo", { pin: this.pinLabel(p), angle: a });
  }

  servoWriteMicroseconds(pin, us) {
    this.servoWrite(pin, ((Number(us) - 500) / 1900) * 180);
  }

  servoDetach(pin) {
    const rec = this.servos.get(Math.trunc(Number(pin)));
    if (rec) rec.attached = false;
  }

  servoRead(pin) {
    const rec = this.servos.get(Math.trunc(Number(pin)));
    return rec ? rec.angle : 0;
  }

  // ---- Kontrol dari UI ---------------------------------------------------

  pinLabel(pin) {
    return pinName(this.boardId, pin);
  }
  setDigitalInput(pin, pressed) {
    this.inputDrive.set(Math.trunc(Number(pin)), pressed ? 0 : 1);
    this.emit("input", { pin: this.pinLabel(pin) });
  }
  setAnalogSource(pin, norm) {
    this.analogSource.set(Math.trunc(Number(pin)), Math.max(0, Math.min(1, Number(norm) || 0)));
    this.emit("input", { pin: this.pinLabel(pin) });
  }
  advanceMicros(delta) {
    if (!(delta > 0)) return;
    this.timeUs += delta;
    this.emit("clock", this.timeUs);
  }
}