// windows.js - Manajemen jendela: perkecil (minimize), perbesar (maximize),
// ubah tinggi (resize), dan ubah lebar antar kolom lewat pembatas. Semua
// pengaturan disimpan ke localStorage agar tata letak siswa bertahan saat
// halaman dimuat ulang. Tombol "Reset tata letak" mengembalikan ke bawaan.

const KEY = "iot-lab:windows:v1";
const MIN_H = 60;      // tinggi isi minimal sebuah jendela (px)
const MIN_W_LEFT = 180;
const MAX_W_LEFT = 520;
const MIN_W_RIGHT = 220;
const MAX_W_RIGHT = 640;

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const d = JSON.parse(raw);
    return {
      heights: d.heights && typeof d.heights === "object" ? d.heights : {},
      min: d.min && typeof d.min === "object" ? d.min : {},
      max: d.max && typeof d.max === "object" ? d.max : {},
      wLeft: Number(d.wLeft) || 0,
      wRight: Number(d.wRight) || 0,
    };
  } catch {
    return {};
  }
}

let saveTimer = 0;
function scheduleSave(collect) {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(collect())); } catch { /* kuota penuh */ }
  }, 250);
}

export function initWindows(options = {}) {
  const root = document.querySelector(".layout");
  if (!root) return () => {};
  const notify = typeof options.notify === "function" ? options.notify : () => {};

  const store = load();
  const wins = [...document.querySelectorAll(".win[data-win]")];
  const docEl = document.documentElement;

  // ---- helper keadaan jendela (normal | min | max) ----
  function setState(win, mode) {
    win.classList.toggle("min", mode === "min");
    win.classList.toggle("max", mode === "max");
    const minBtn = win.querySelector(".win-min");
    const maxBtn = win.querySelector(".win-max");
    if (minBtn) minBtn.setAttribute("aria-expanded", String(mode !== "min"));
    if (maxBtn) maxBtn.setAttribute("aria-pressed", String(mode === "max"));
  }
  const currentState = (win) =>
    win.classList.contains("min") ? "min" : win.classList.contains("max") ? "max" : "normal";

  // Hanya satu jendela yang boleh diperbesar per kolom; yang lain kembali normal.
  function unmaxSiblings(win) {
    const col = win.closest(".col");
    if (!col) return;
    for (const s of col.querySelectorAll(".win.max")) if (s !== win) setState(s, "normal");
  }

  // Tandai kolom yang punya jendela diperbesar agar jendela lain menciut ke bar.
  const cols = [...document.querySelectorAll(".col")];
  function refreshColMaxFlags() {
    for (const c of cols) c.classList.toggle("col-maxed", !!c.querySelector(".win.max"));
  }

  // ---- terapkan lebar kolom tersimpan ----
  if (store.wLeft) docEl.style.setProperty("--w-left", store.wLeft + "px");
  if (store.wRight) docEl.style.setProperty("--w-right", store.wRight + "px");

  function collect() {
    const heights = {};
    const min = {};
    const max = {};
    for (const win of wins) {
      const id = win.dataset.win;
      const h = parseFloat(win.style.getPropertyValue("--win-h"));
      if (!Number.isNaN(h)) heights[id] = Math.round(h);
      min[id] = win.classList.contains("min");
      max[id] = win.classList.contains("max");
    }
    return {
      heights,
      min,
      max,
      wLeft: Math.round(parseFloat(getComputedStyle(docEl).getPropertyValue("--w-left")) || 0) || undefined,
      wRight: Math.round(parseFloat(getComputedStyle(docEl).getPropertyValue("--w-right")) || 0) || undefined,
    };
  }

  // ---- terapkan keadaan tersimpan per jendela ----
  for (const win of wins) {
    const id = win.dataset.win;
    const h = store.heights && store.heights[id];
    if (h) win.style.setProperty("--win-h", h + "px");
    if (store.max && store.max[id]) setState(win, "max");
    else if (store.min && store.min[id]) setState(win, "min");
  }
  refreshColMaxFlags();

  // ---- tombol perkecil & perbesar + klik ganda judul ----
  for (const win of wins) {
    const minBtn = win.querySelector(".win-min");
    const maxBtn = win.querySelector(".win-max");
    const bar = win.querySelector(".win-bar");

    const toggleMin = () => {
      setState(win, currentState(win) === "min" ? "normal" : "min");
      refreshColMaxFlags();
      scheduleSave(collect);
    };
    const toggleMax = () => {
      if (currentState(win) === "max") setState(win, "normal");
      else { unmaxSiblings(win); setState(win, "max"); }
      refreshColMaxFlags();
      scheduleSave(collect);
    };

    if (minBtn) minBtn.addEventListener("click", toggleMin);
    if (maxBtn) maxBtn.addEventListener("click", toggleMax);
    if (bar) {
      bar.addEventListener("dblclick", (e) => {
        if (e.target.closest(".win-btn") || e.target.closest(".win-extra") || e.target.closest(".chip")) return;
        toggleMax();
      });
    }
  }

  // ---- gagang ubah tinggi ----
  for (const win of wins) {
    const grip = win.querySelector(".win-grip");
    if (!grip) continue;
    grip.addEventListener("pointerdown", (e) => {
      if (win.classList.contains("min") || win.classList.contains("max")) return;
      e.preventDefault();
      try { grip.setPointerCapture?.(e.pointerId); } catch { /* pointer sintetik: andalkan listener window */ }
      const body = win.querySelector(".win-body");
      const startH = body ? body.getBoundingClientRect().height
        : (parseFloat(win.style.getPropertyValue("--win-h")) || 200);
      const startY = e.clientY;
      win.classList.add("resizing");
      document.body.classList.add("no-select");

      const move = (ev) => {
        const nh = clamp(startH + (ev.clientY - startY), MIN_H, window.innerHeight - 80);
        win.style.setProperty("--win-h", Math.round(nh) + "px");
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        win.classList.remove("resizing");
        document.body.classList.remove("no-select");
        scheduleSave(collect);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    });
  }

  // ---- pembatas antar kolom: ubah lebar ----
  for (const sp of document.querySelectorAll(".vsplit[data-split]")) {
    const side = sp.dataset.split; // "left" | "right"
    const varName = side === "left" ? "--w-left" : "--w-right";

    const begin = (e) => {
      e.preventDefault();
      try { sp.setPointerCapture?.(e.pointerId); } catch { /* pointer sintetik: andalkan listener window */ }
      const startX = e.clientX;
      const startW = parseFloat(getComputedStyle(docEl).getPropertyValue(varName))
        || (side === "left" ? 244 : 312);
      sp.classList.add("active");
      document.body.classList.add("no-select", "resizing-col");

      const move = (ev) => {
        const dx = ev.clientX - startX;
        const nw = side === "left"
          ? clamp(startW + dx, MIN_W_LEFT, MAX_W_LEFT)
          : clamp(startW - dx, MIN_W_RIGHT, MAX_W_RIGHT);
        docEl.style.setProperty(varName, Math.round(nw) + "px");
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        sp.classList.remove("active");
        document.body.classList.remove("no-select", "resizing-col");
        scheduleSave(collect);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    };

    sp.addEventListener("pointerdown", begin);
    // Aksesibilitas keyboard: panah kiri/kanan mengatur lebar kolom.
    sp.addEventListener("keydown", (e) => {
      const step = e.shiftKey ? 40 : 12;
      let delta = 0;
      if (e.key === "ArrowLeft") delta = -step;
      else if (e.key === "ArrowRight") delta = step;
      else return;
      e.preventDefault();
      const cur = parseFloat(getComputedStyle(docEl).getPropertyValue(varName))
        || (side === "left" ? 244 : 312);
      const nw = side === "left"
        ? clamp(cur + delta, MIN_W_LEFT, MAX_W_LEFT)
        : clamp(cur - delta, MIN_W_RIGHT, MAX_W_RIGHT);
      docEl.style.setProperty(varName, Math.round(nw) + "px");
      scheduleSave(collect);
    });
  }

  // ---- reset tata letak ke bawaan ----
  function reset() {
    for (const win of wins) {
      win.style.removeProperty("--win-h");
      setState(win, "normal");
    }
    refreshColMaxFlags();
    docEl.style.removeProperty("--w-left");
    docEl.style.removeProperty("--w-right");
    try { localStorage.removeItem(KEY); } catch { /* abaikan */ }
    notify("Tata letak dikembalikan ke bawaan");
  }

  const resetBtn = document.getElementById("btnResetLayout");
  if (resetBtn) resetBtn.addEventListener("click", reset);

  return reset;
}
