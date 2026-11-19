// main.js - Merangkai papan, editor, interpreter, dan UI.
// Inti perilaku "live recompile": perubahan kode didebounce, diparse, lalu
// program lama dihentikan dan program baru dijalankan dari setup().

import { Board, BOARDS } from "./hardware.js";
import { parse } from "./parser.js";
import { Interpreter } from "./interpreter.js";
import { MODULES } from "./modules.js";
import { BoardView, buildOutputCards, buildInputControls, colorFor } from "./board.js";
import { CodeEditor } from "./editor.js";
import { SerialView } from "./serial.js";
import { buildSketch, buildWiringReadme, filenameFor, downloadText, copyText } from "./export.js";
import { initWindows } from "./windows.js";

const $ = (id) => document.getElementById(id);
const STORE_KEY = "iot-lab:v1";
const COMPILE_DEBOUNCE_MS = 400;
const FRAME_BUDGET_MS = 6;

const state = {
  moduleId: MODULES[0].id,
  boardId: "esp32",
  speed: 1,
  running: true,
  code: {},
  tasks: {},
};

// ---- penyimpanan lokal -----------------------------------------------------

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    Object.assign(state, {
      moduleId: saved.moduleId && MODULES.some((m) => m.id === saved.moduleId) ? saved.moduleId : state.moduleId,
      boardId: BOARDS[saved.boardId] ? saved.boardId : state.boardId,
      speed: Number(saved.speed) || state.speed,
      code: saved.code || {},
      tasks: saved.tasks || {},
    });
  } catch { /* penyimpanan rusak: pakai bawaan */ }
}

let saveTimer = 0;
function saveStore() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* kuota penuh */ }
  }, 300);
}

// ---- objek utama -----------------------------------------------------------

let board, view, editor, serialView;
let interp = null, gen = null;
let t0Real = 0, baseUs = 0, simLag = false, compileError = null;
let compileTimer = 0, rafId = 0;

function currentModule() {
  return MODULES.find((m) => m.id === state.moduleId) || MODULES[0];
}

function codeFor(m) {
  return state.code[m.id] !== undefined ? state.code[m.id] : m.sketch;
}

// ---- siklus simulasi -------------------------------------------------------

function startProgram(ast) {
  if (interp) interp.stop();
  board.reset();
  board.warnings = [];
  board.serial.clear();
  interp = new Interpreter(board, ast);
  gen = interp.run();
  t0Real = performance.now();
  baseUs = 0;
  compileError = null;
  setChip($("chipCompile"), "berjalan", "ok");
  editor.setError(0);
  state.running = true;
  syncPlayButton();
}

function stopProgram(message, kind) {
  if (interp) interp.stop();
  interp = null;
  gen = null;
  if (message) {
    setChip($("chipCompile"), message, kind || "err");
    state.running = false;
    syncPlayButton();
  }
}

/** Sinkronkan basis waktu setelah jeda/lompat agar simulasi tidak "kejar tayang". */
function rebase() {
  t0Real = performance.now();
  baseUs = board ? board.timeUs : 0;
}

function frame() {
  rafId = requestAnimationFrame(frame);
  if (!gen) { render(); return; }

  if (state.running) {
    const deadline = performance.now() + FRAME_BUDGET_MS;
    const target = baseUs + (performance.now() - t0Real) * 1000 * state.speed;
    try {
      let guard = 0;
      while (board.timeUs < target && performance.now() < deadline && guard < 500000) {
        gen.next();
        guard++;
      }
      simLag = board.timeUs < target - 1000;
    } catch (e) {
      compileError = e;
      stopProgram(shortMessage(e), "err");
      editor.setError(e.line || 0);
      render();
      return;
    }
  } else {
    rebaseSoft();
  }
  render();
}

/** Saat dijeda, basis waktu ikut dibekukan supaya target tidak lari. */
function rebaseSoft() {
  t0Real = performance.now();
  baseUs = board.timeUs;
  simLag = false;
}

function stepOneIteration() {
  if (!gen) return;
  const start = interp.iterations;
  const deadline = performance.now() + 400;
  try {
    while (interp.iterations === start && performance.now() < deadline) gen.next();
    rebase();
  } catch (e) {
    stopProgram(shortMessage(e), "err");
    editor.setError(e.line || 0);
  }
  render();
}

function shortMessage(e) {
  const text = (e && e.message) || String(e);
  return text.length > 120 ? text.slice(0, 117) + "…" : text;
}

// ---- kompilasi hidup --------------------------------------------------------

function scheduleCompile(immediate) {
  clearTimeout(compileTimer);
  const run = () => {
    const m = currentModule();
    const code = editor.getValue();
    state.code[m.id] = code;
    saveStore();
    const { ast, error } = parse(code);
    if (error) {
      compileError = error;
      if (interp) interp.stop();
      interp = null;
      gen = null;
      setChip($("chipCompile"), error.name === "ParseError" ? `error sintaks ${error.line ? "baris " + error.line : ""}` : error.message, "err");
      editor.setError(error.line || 0);
      render();
      return;
    }
    startProgram(ast);
    render();
  };
  if (immediate) run();
  else compileTimer = setTimeout(run, COMPILE_DEBOUNCE_MS);
}

// ---- render UI --------------------------------------------------------------

function setChip(el, text, kind) {
  el.textContent = text;
  el.className = "chip" + (kind ? " " + kind : "");
  el.title = compileError ? compileError.message : "";
}

function fmtTime(us) {
  const ms = us / 1000;
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}.${String(Math.floor(ms % 1000)).padStart(3, "0")}`;
}

let lastRenderCount = -1;
let lastStatusAt = 0;

function render() {
  view.update();
  // SerialView sudah berlangganan ke log, jadi hanya perlu dipanggil saat jumlah baris berubah.
  if (board.serial.lines.length !== lastRenderCount) {
    lastRenderCount = board.serial.lines.length;
    serialView.render();
  }
  const now = performance.now();
  if (now - lastStatusAt > 100) {
    lastStatusAt = now;
    renderStatus();
  }
}

function renderStatus() {
  const host = $("statusHost");
  const secs = board.timeUs / 1e6;
  const ips = secs > 0.05 ? interp ? interp.iterations / secs : 0 : 0;
  const rows = [
    ["Waktu papan", fmtTime(board.timeUs) + " (menit:detik.milidetik)"],
    ["Iterasi loop()", interp ? interp.iterations.toLocaleString("id-ID") : "-"],
    ["Iterasi / detik papan", ips > 0 ? ips.toLocaleString("id-ID", { maximumFractionDigits: 0 }) : "-"],
    ["Kecepatan simulasi", `${state.speed}x` + (simLag ? " (tertinggal)" : "")],
    ["Status", gen ? (state.running ? "berjalan" : "dijeda") : "berhenti"],
  ];
  host.innerHTML = rows.map(([k, v]) => `<div class="status-row"><dt>${k}</dt><dd>${v}</dd></div>`).join("");

  const notes = [];
  if (interp && interp.iterations > 30 && interp.delayUsInIteration === 0) {
    notes.push("loop() tidak memakai delay(): program berjalan secepat CPU simulator. Waktu papan tetap maju, jadi millis() bisa dipakai.");
  }
  if (simLag) notes.push("Simulasi tertinggal dari waktu nyata karena kode Anda sangat padat. Turunkan kecepatan atau tambahkan delay().");
  for (const w of board.warnings) notes.push(w);
  if (compileError) notes.push(compileError.message);

  const ul = $("warningHost");
  ul.replaceChildren();
  for (const n of notes) {
    const li = document.createElement("li");
    li.textContent = n;
    ul.appendChild(li);
  }
  ul.hidden = notes.length === 0;
}

// ---- materi & daftar modul ---------------------------------------------------

function renderModuleList() {
  const ol = $("moduleList");
  ol.replaceChildren();
  const levels = [...new Set(MODULES.map((m) => m.level))].sort((a, b) => a - b);
  for (const lv of levels) {
    const group = document.createElement("li");
    group.className = "level-group";
    const label = document.createElement("p");
    label.className = "level-label";
    label.textContent = lv === 0 ? "Mulai" : `Tingkat ${lv}`;
    group.appendChild(label);
    for (const m of MODULES.filter((x) => x.level === lv)) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "module-item" + (m.id === state.moduleId ? " active" : "");
      const done = (state.tasks[m.id] || []).filter(Boolean).length;
      btn.innerHTML = `<span class="mi-title">${m.title}</span>
        <span class="mi-sub">${m.subtitle || ""}</span>
        <span class="mi-meta">${done}/${m.tasks.length} tugas</span>`;
      btn.addEventListener("click", () => selectModule(m.id));
      group.appendChild(btn);
    }
    ol.appendChild(group);
  }
}

function renderLesson() {
  const m = currentModule();
  $("lessonTitle").textContent = m.title;
  const host = $("lessonBody");
  const checks = state.tasks[m.id] || [];
  host.innerHTML = `
    <p class="goal">${m.goal}</p>
    <div class="concepts">${(m.concepts || []).map((c) => `<code>${c}</code>`).join("")}</div>
    ${(m.explain || []).map((s) => `<h4>${s.h}</h4><p>${s.p}</p>`).join("")}
    <h4>Tugas Anda</h4>
    <ul class="tasks">${m.tasks.map((t, i) => `<li><label>
      <input type="checkbox" data-i="${i}" ${checks[i] ? "checked" : ""} /> <span>${t}</span></label></li>`).join("")}</ul>
    <p class="hint"><strong>Petunjuk.</strong> ${m.hint}</p>
    <p class="success"><strong>Berhasil jika.</strong> ${m.success}</p>`;
  host.querySelectorAll("input[type=checkbox]").forEach((box) => {
    box.addEventListener("change", () => {
      const arr = state.tasks[m.id] || [];
      arr[Number(box.dataset.i)] = box.checked;
      state.tasks[m.id] = arr;
      saveStore();
      renderModuleList();
    });
  });
}

function selectModule(id) {
  if (id === state.moduleId) return;
  state.moduleId = id;
  const m = currentModule();
  // Muat kode modul baru SEBELUM mengganti papan: applyBoard() memicu kompilasi
  // yang membaca editor, sehingga editor harus sudah berisi sketch modul ini.
  editor.setValue(codeFor(m));
  if (m.board !== "any" && m.board !== state.boardId) {
    state.boardId = m.board;
    $("boardSelect").value = m.board;
    applyBoard();
  }
  buildPanels();
  renderModuleList();
  renderLesson();
  scheduleCompile(true);
  saveStore();
}

// ---- papan & panel -----------------------------------------------------------

function applyBoard() {
  board.setBoard(state.boardId);
  $("boardSelect").value = state.boardId;
  view.setParts(currentModule().parts);
  buildPanels();
  scheduleCompile(true);
}

function buildPanels() {
  const m = currentModule();
  view.setParts(m.parts);
  $("outputHost").replaceChildren();
  const cards = buildOutputCards($("outputHost"), m.parts, view.colorByPin);
  view.cards = cards;
  buildInputControls($("inputHost"), m.parts, board, () => { if (!state.running) render(); });
}

// ---- kontrol -----------------------------------------------------------------

function syncPlayButton() {
  const btn = $("btnPlay");
  btn.textContent = state.running ? "Jeda" : "Jalankan";
  btn.setAttribute("aria-pressed", String(state.running));
}

function toast(text) {
  const el = $("toast");
  el.textContent = text;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 2200);
}

// ---- boot --------------------------------------------------------------------

function boot() {
  loadStore();

  const sel = $("boardSelect");
  sel.replaceChildren();
  for (const b of Object.values(BOARDS)) {
    const o = document.createElement("option");
    o.value = b.id;
    o.textContent = `${b.label} - ${b.mcu}`;
    sel.appendChild(o);
  }
  sel.value = state.boardId;

  // Papan harus sudah final sebelum SerialView mengikat ke board.serial,
  // karena papan cadangan membuat log baru yang tidak lagi dipantau UI.
  const m0 = currentModule();
  if (m0.board !== "any") { state.boardId = m0.board; sel.value = m0.board; }
  board = new Board(state.boardId);
  view = new BoardView($("boardSvg"), board);
  serialView = new SerialView($("serialHost"), board.serial);

  editor = new CodeEditor($("editorHost"), {
    onChange: () => scheduleCompile(false),
    onCursor: (line, col) => setChip($("chipCursor"), `baris ${line}, kolom ${col}`, ""),
  });
  editor.setValue(codeFor(m0));

  buildPanels();
  renderModuleList();
  renderLesson();
  $("speedSelect").value = String(state.speed);
  syncPlayButton();

  // kontrol header
  sel.addEventListener("change", () => { state.boardId = sel.value; saveStore(); applyBoard(); });
  $("speedSelect").addEventListener("change", () => { state.speed = Number($("speedSelect").value); rebase(); saveStore(); });
  $("btnPlay").addEventListener("click", () => {
    if (!gen) { scheduleCompile(true); return; }
    state.running = !state.running;
    if (state.running) rebase();
    syncPlayButton();
  });
  $("btnStep").addEventListener("click", () => { if (!gen) scheduleCompile(true); stepOneIteration(); });
  $("btnRestart").addEventListener("click", () => { scheduleCompile(true); toast("Program dijalankan ulang dari setup()"); });

  // manajemen jendela: perkecil, perbesar, ubah tinggi, ubah lebar antar kolom
  initWindows({ notify: toast });

  $("btnIno").addEventListener("click", () => {
    const m = currentModule();
    const text = buildSketch(editor.getValue(), { boardId: state.boardId, moduleTitle: m.title });
    downloadText(filenameFor(m.id, state.boardId), text);
    toast(`${filenameFor(m.id, state.boardId)} diunduh - siap di-flash lewat Arduino IDE`);
  });
  $("btnReadme").addEventListener("click", () => {
    const m = currentModule();
    downloadText(`${m.id}_pengkabelan.md`, buildWiringReadme(m.parts, { boardId: state.boardId, moduleTitle: m.title }));
    toast("Catatan pengkabelan diunduh");
  });
  $("btnCopy").addEventListener("click", async () => {
    const ok = await copyText(editor.getValue());
    toast(ok ? "Kode disalin ke papan klip" : "Browser menolak akses papan klip - salin manual dari editor");
  });

  // pintasan
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); scheduleCompile(true); toast("Dikompilasi ulang"); }
    if (e.key === " " && e.target === document.body) { e.preventDefault(); $("btnPlay").click(); }
  });

  scheduleCompile(true);
  rafId = requestAnimationFrame(frame);
}

boot();
