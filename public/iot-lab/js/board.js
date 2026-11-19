// board.js - Render papan sebagai SVG plus kartu komponen keluaran yang hidup.
// Pin yang terpakai diberi warna, dan warna yang sama dipakai pada kartu
// komponen, sehingga hubungan pin-komponen terbaca tanpa kabel yang semrawut.

import { BOARDS } from "./hardware.js";

const PALET = ["#f97316", "#22d3ee", "#a3e635", "#e879f9", "#facc15", "#60a5fa", "#f87171", "#34d399", "#c084fc", "#fbbf24"];

export function colorFor(index) {
  return PALET[index % PALET.length];
}

const SVGNS = "http://www.w3.org/2000/svg";

function el(name, attrs = {}, text) {
  const n = document.createElementNS(SVGNS, name);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (text !== undefined) n.textContent = text;
  return n;
}

/** Strip kiri = pin digital murni, strip kanan = pin yang bisa dibaca analog. */
function pinLayout(spec) {
  const left = spec.digital.filter((p) => !spec.analog.includes(p));
  const right = spec.analog;
  return { left, right };
}

export class BoardView {
  /**
   * @param {SVGSVGElement} svgRoot
   * @param {import('./hardware.js').Board} board
   */
  constructor(svgRoot, board) {
    this.svg = svgRoot;
    this.board = board;
    this.parts = [];
    this.colorByPin = new Map();
    this.nodes = { pins: new Map(), leds: new Map(), servos: new Map(), builtin: null };
    this.render();
  }

  setParts(parts) {
    this.parts = parts || [];
    this.colorByPin.clear();
    this.parts.forEach((p, i) => {
      if (p.pin !== undefined) this.colorByPin.set(String(p.pin), colorFor(i));
    });
    this.render();
  }

  render() {
    const spec = this.board.spec;
    const W = 300, H = 360;
    this.svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    this.svg.replaceChildren();
    this.nodes = { pins: new Map(), leds: new Map(), servos: new Map(), builtin: null };

    const { left, right } = pinLayout(spec);

    // badan papan
    this.svg.appendChild(el("rect", { x: 34, y: 26, width: W - 68, height: H - 52, rx: 10, class: "pcb" }));
    this.svg.appendChild(el("rect", { x: 118, y: 8, width: 64, height: 26, rx: 4, class: "usb" }));
    this.svg.appendChild(el("text", { x: W / 2, y: H / 2 - 6, class: "board-name", "text-anchor": "middle" }, spec.label));
    this.svg.appendChild(el("text", { x: W / 2, y: H / 2 + 12, class: "board-mcu", "text-anchor": "middle" }, spec.mcu));

    // LED bawaan
    const builtinY = 52;
    this.svg.appendChild(el("circle", { cx: W / 2 + 52, cy: builtinY, r: 5, class: "led-shell" }));
    this.nodes.builtin = el("circle", { cx: W / 2 + 52, cy: builtinY, r: 3.2, class: "led-core" });
    this.svg.appendChild(this.nodes.builtin);
    this.svg.appendChild(el("text", { x: W / 2 + 62, y: builtinY + 3, class: "tiny" }, "ON"));

    const drawStrip = (pins, x, labelOf, side) => {
      const top = 46, bottom = H - 46;
      const step = pins.length > 1 ? (bottom - top) / (pins.length - 1) : 0;
      pins.forEach((p, i) => {
        const y = top + i * step;
        const g = el("g", { class: "pin" });
        g.appendChild(el("rect", { x, y: y - 5, width: 14, height: 10, rx: 2, class: "pin-hole" }));
        const color = this.colorByPin.get(String(p));
        const dot = el("circle", {
          cx: side === "left" ? x + 20 : x - 6,
          cy: y, r: 3.4,
          class: "pin-dot",
          fill: color || "var(--pin-idle)",
        });
        g.appendChild(dot);
        if (color) {
          g.appendChild(el("rect", {
            x: side === "left" ? x + 26 : x - 40, y: y - 5, width: 14, height: 10, rx: 2,
            fill: color, opacity: "0.18",
          }));
        }
        g.appendChild(el("text", {
          x: side === "left" ? x - 6 : x + 22, y: y + 3.5,
          class: "pin-label", "text-anchor": side === "left" ? "end" : "start",
          fill: color || "var(--text-dim)",
        }, labelOf(p)));
        this.svg.appendChild(g);
        this.nodes.pins.set(String(p), { dot, state: null });
      });
    };

    drawStrip(left, 40, (p) => String(p), "left");
    drawStrip(right, W - 54, (p) => spec.analogNames[p] || String(p), "right");
  }

  /** Perbarui warna pin, LED, dan servo dari state papan saat ini. */
  update() {
    const b = this.board;
    // LED bawaan
    const rec = b.pins.get(b.spec.builtinLed);
    if (this.nodes.builtin) {
      const on = rec ? rec.out : 0;
      this.nodes.builtin.setAttribute("class", "led-core" + (on ? " on" : ""));
    }

    for (const [pin, node] of this.nodes.pins) {
      const st = b.pins.get(Number(pin));
      const active = st && (st.mode || st.pwm > 0 || st.out);
      const color = this.colorByPin.get(pin);
      node.dot.setAttribute("opacity", active ? "1" : "0.45");
      if (color) node.dot.setAttribute("fill", active ? color : "var(--pin-idle)");
    }

    for (const card of this.cards || []) card.update(b);
  }
}

// ---- kartu komponen keluaran ------------------------------------------------

class LedCard {
  constructor(part, color) {
    this.part = part;
    this.color = color;
    const root = document.createElement("div");
    root.className = "comp-card";
    root.innerHTML = `
      <div class="comp-lamp" style="--glow:${color}">
        <span class="lamp"></span>
      </div>
      <div class="comp-meta">
        <div class="comp-title">${part.label || "LED"}</div>
        <div class="comp-sub">pin ${part.pin}${part.builtin ? " (bawaan)" : ""}</div>
        <div class="comp-state">-</div>
      </div>`;
    this.el = root;
    this.lamp = root.querySelector(".lamp");
    this.state = root.querySelector(".comp-state");
  }
  update(board) {
    const rec = board.pins.get(this.part.pin);
    if (!rec) { this.lamp.style.opacity = 0.15; this.state.textContent = "belum dipakai"; return; }
    const duty = rec.pwm > 0 ? rec.pwm / board.spec.pwmMax : rec.out ? 1 : 0;
    this.lamp.style.opacity = 0.15 + duty * 0.85;
    this.lamp.style.boxShadow = duty > 0 ? `0 0 ${8 + duty * 16}px ${this.color}` : "none";
    if (rec.pwm > 0 && rec.pwm < board.spec.pwmMax) this.state.textContent = `PWM ${rec.pwm} (${Math.round(duty * 100)}%)`;
    else this.state.textContent = rec.out ? "HIGH - nyala" : rec.mode ? "LOW - mati" : "belum dipakai";
  }
}

class ServoCard {
  constructor(part, color) {
    this.part = part;
    this.color = color;
    const root = document.createElement("div");
    root.className = "comp-card";
    root.innerHTML = `
      <div class="comp-servo">
        <svg viewBox="0 0 84 60" width="84" height="60">
          <path d="M42 42 L42 8" class="servo-arc-path" />
          <path d="M14 42 A28 28 0 0 1 70 42" class="servo-arc" />
          <rect x="22" y="34" width="40" height="22" rx="3" class="servo-body" />
          <circle cx="42" cy="42" r="6" class="servo-horn-base" />
          <g class="servo-arm" style="transform-origin:42px 42px">
            <rect x="39" y="14" width="6" height="30" rx="2" fill="${color}" />
          </g>
          <circle cx="42" cy="42" r="2.5" class="servo-pivot" />
        </svg>
      </div>
      <div class="comp-meta">
        <div class="comp-title">${part.label || "Servo"}</div>
        <div class="comp-sub">pin ${part.pin}</div>
        <div class="comp-state">-</div>
      </div>`;
    this.el = root;
    this.arm = root.querySelector(".servo-arm");
    this.state = root.querySelector(".comp-state");
  }
  update(board) {
    const rec = board.servos.get(this.part.pin);
    if (!rec) { this.arm.style.transform = "rotate(-90deg)"; this.state.textContent = "belum di-attach"; return; }
    // 0 derajat = lengan ke kiri, 180 derajat = ke kanan.
    this.arm.style.transform = `rotate(${rec.angle - 90}deg)`;
    this.state.textContent = `${rec.angle}\u00b0 (${Math.round(500 + (rec.angle / 180) * 1900)} us)`;
  }
}

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

class LcdCard {
  constructor(part) {
    this.part = part;
    const root = document.createElement("div");
    root.className = "comp-card comp-display";
    root.innerHTML = `
      <div class="disp-wrap">
        <div class="disp-label">
          <span class="disp-name">${escapeHtml(part.label || "LCD I2C")}</span>
          <span class="disp-sub">${escapeHtml(part.addr || "I2C")}</span>
        </div>
        <div class="lcd-screen"><div class="lcd-grid"></div></div>
      </div>`;
    this.el = root;
    this.grid = root.querySelector(".lcd-grid");
    this.sub = root.querySelector(".disp-sub");
    this._sig = "";
  }
  update(board) {
    const d = board.firstDisplay("lcd");
    if (!d) {
      if (this._sig !== "none") {
        this._sig = "none";
        this.grid.className = "lcd-grid";
        this.grid.innerHTML = '<div class="lcd-row idle">belum diinisialisasi</div>';
      }
      return;
    }
    const rows = d.textRows();
    const sig = d.cols + "x" + d.rows + "|" + (d.backlight ? 1 : 0) + "|" + rows.join("\u0001");
    if (sig === this._sig) return;
    this._sig = sig;
    this.sub.textContent = `I2C ${d.cols}x${d.rows}`;
    this.grid.className = "lcd-grid" + (d.backlight ? "" : " off");
    this.grid.innerHTML = rows.map((r) => `<div class="lcd-row">${escapeHtml(r)}</div>`).join("");
  }
}

class OledCard {
  constructor(part) {
    this.part = part;
    const root = document.createElement("div");
    root.className = "comp-card comp-display";
    root.innerHTML = `
      <div class="disp-wrap">
        <div class="disp-label">
          <span class="disp-name">${escapeHtml(part.label || "OLED 0.96")}</span>
          <span class="disp-sub">128x64</span>
        </div>
        <div class="oled-frame"><canvas class="oled-canvas" width="128" height="64"></canvas></div>
      </div>`;
    this.el = root;
    this.canvas = root.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.sub = root.querySelector(".disp-sub");
    this._ver = -1;
    this._w = 0;
    this._h = 0;
  }
  update(board) {
    const d = board.firstDisplay("oled");
    if (!d) {
      if (this._ver !== -2) { this._ver = -2; this._paint(null); }
      return;
    }
    if (d.version === this._ver) return;
    this._ver = d.version;
    this.sub.textContent = `${d.w}x${d.h}`;
    if (this._w !== d.w || this._h !== d.h) {
      this._w = d.w; this._h = d.h;
      this.canvas.width = d.w; this.canvas.height = d.h;
    }
    this._paint(d);
  }
  _paint(d) {
    const ctx = this.ctx, W = this.canvas.width, H = this.canvas.height;
    ctx.fillStyle = "#05070a";
    ctx.fillRect(0, 0, W, H);
    if (!d) return;
    const glow = "#8dffc0";
    ctx.fillStyle = glow;
    ctx.strokeStyle = glow;
    ctx.lineWidth = 1;
    for (const p of d.visible) {
      switch (p.t) {
        case "text": {
          const fs = p.font || 10;
          ctx.font = `${fs}px ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace`;
          ctx.textBaseline = "top";
          if (p.centered) { ctx.textAlign = "center"; ctx.fillText(p.s, p.x, p.y); ctx.textAlign = "left"; }
          else ctx.fillText(p.s, p.x, p.y);
          break;
        }
        case "px": ctx.fillRect(p.x, p.y, 1, 1); break;
        case "fill": ctx.fillRect(p.x, p.y, p.w, p.h); break;
        case "rect": ctx.strokeRect(p.x + 0.5, p.y + 0.5, p.w, p.h); break;
        case "line": ctx.beginPath(); ctx.moveTo(p.x0 + 0.5, p.y0 + 0.5); ctx.lineTo(p.x1 + 0.5, p.y1 + 0.5); ctx.stroke(); break;
        case "circle": ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.stroke(); break;
        case "fillcircle": ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); break;
      }
    }
  }
}

/** Bangun daftar kartu keluaran dari parts modul. */
export function buildOutputCards(container, parts, colorByPin) {
  container.replaceChildren();
  const cards = [];
  for (const p of parts) {
    if (p.kind === "led") cards.push(new LedCard(p, colorByPin.get(String(p.pin)) || PALET[0]));
    if (p.kind === "servo") cards.push(new ServoCard(p, colorByPin.get(String(p.pin)) || PALET[1]));
    if (p.kind === "lcd") cards.push(new LcdCard(p));
    if (p.kind === "oled") cards.push(new OledCard(p));
  }
  for (const c of cards) container.appendChild(c.el);
  if (!cards.length) {
    const note = document.createElement("p");
    note.className = "muted small";
    note.textContent = "Modul ini tidak punya komponen keluaran. Amati Serial Monitor.";
    container.appendChild(note);
  }
  return cards;
}

/** Bangun panel input: tombol tekan-tahan dan slider sumber analog. */
export function buildInputControls(container, parts, board, onChange) {
  container.replaceChildren();
  let any = false;
  for (const p of parts) {
    if (p.kind === "button") {
      any = true;
      const wrap = document.createElement("div");
      wrap.className = "input-row";
      wrap.innerHTML = `
        <span class="input-tag" style="color:${colorFor(0)}">pin ${p.pin}</span>
        <button type="button" class="btn-press">Tekan & tahan: ${p.label || "Tombol"}</button>`;
      const btn = wrap.querySelector(".btn-press");
      const set = (pressed) => { board.setDigitalInput(p.pin, pressed); btn.classList.toggle("is-pressed", pressed); onChange(); };
      btn.addEventListener("pointerdown", () => set(true));
      btn.addEventListener("pointerup", () => set(false));
      btn.addEventListener("pointerleave", () => { if (btn.classList.contains("is-pressed")) set(false); });
      btn.addEventListener("pointercancel", () => set(false));
      container.appendChild(wrap);
    }
    if (p.kind === "analog") {
      any = true;
      const idx = parts.indexOf(p);
      const wrap = document.createElement("div");
      wrap.className = "input-row";
      const kindLabel = p.kind2 === "ldr" ? "gelap" : "0%";
      const kindLabel2 = p.kind2 === "ldr" ? "terang" : "100%";
      wrap.innerHTML = `
        <span class="input-tag" style="color:${colorFor(idx)}">pin ${p.pin}</span>
        <label class="slider-line">
          <span class="slider-name">${p.label || "Sensor"}</span>
          <input type="range" min="0" max="1000" value="${Math.round((p.value ?? 0.5) * 1000)}" />
          <span class="slider-out"></span>
        </label>
        <div class="slider-scale"><span>${kindLabel}</span><span>${kindLabel2}</span></div>`;
      const range = wrap.querySelector("input");
      const out = wrap.querySelector(".slider-out");
      const push = () => {
        const norm = Number(range.value) / 1000;
        board.setAnalogSource(p.pin, norm);
        out.textContent = `${Math.round(norm * board.spec.adcMax)} / ${(norm * board.spec.vcc).toFixed(2)} V`;
        onChange();
      };
      range.addEventListener("input", push);
      container.appendChild(wrap);
      push();
    }
  }
  if (!any) {
    const note = document.createElement("p");
    note.className = "muted small";
    note.textContent = "Modul ini tidak memakai input. Gerakkan hanya lewat kode.";
    container.appendChild(note);
  }
}

export { BOARDS };
