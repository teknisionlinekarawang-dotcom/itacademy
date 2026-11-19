// export.js - Sisi "hybrid": mengubah kode di editor menjadi berkas .ino nyata
// yang bisa di-flash ke papan asli, plus catatan pengkabelan.

import { BOARDS, pinName } from "./hardware.js";

/** Lengkapi sketch agar siap di-flash: header, include yang kurang, dan catatan papan. */
export function buildSketch(code, opts = {}) {
  const boardId = opts.boardId || "esp32";
  const spec = BOARDS[boardId] || BOARDS.esp32;
  let src = code.replace(/\s+$/, "") + "\n";

  const usesServo = /\bServo\s+[A-Za-z_]\w*\s*(=|;)/.test(src) || /\.\s*attach\s*\(/.test(src);
  const hasServoInclude = /^\s*#\s*include\s*[<"]Servo\.h[>"]/m.test(src);
  if (usesServo && !hasServoInclude) src = '#include <Servo.h>\n' + src;

  // Layar I2C: tambahkan include yang kurang agar .ino bisa langsung di-flash.
  const extraIncludes = [];
  const usesLcd = /\bLiquidCrystal\w*\s+[A-Za-z_]\w*\s*\(/.test(src) || /\.\s*(setCursor|scrollDisplayLeft)\s*\(/.test(src);
  if (usesLcd && !/^\s*#\s*include\s*[<"]LiquidCrystal_I2C\.h[>"]/m.test(src)) extraIncludes.push("LiquidCrystal_I2C.h");
  const usesOled = /\bSSD1306\w*\s+[A-Za-z_]\w*\s*\(/.test(src) || /\.\s*(drawString|clearDisplay|flipScreenVertically)\s*\(/.test(src);
  if (usesOled && !/^\s*#\s*include\s*[<"]SSD1306\w*\.h[>"]/m.test(src)) extraIncludes.push("SSD1306Wire.h");
  if ((usesLcd || usesOled) && !/^\s*#\s*include\s*[<"]Wire\.h[>"]/m.test(src)) extraIncludes.push("Wire.h");
  if (extraIncludes.length) src = extraIncludes.map((h) => `#include <${h}>`).join("\n") + "\n" + src;

  const libs = [];
  if (usesServo) libs.push("Servo");
  if (usesLcd) libs.push("LiquidCrystal I2C");
  if (usesOled) libs.push("SSD1306 (OLED)");

  const header = [
    "/*",
    ` * ${opts.moduleTitle || "Sketch"} - dibuat dengan IoT Lab Simulator`,
    " *",
    ` * Papan sasaran : ${spec.label} (${spec.mcu}, ${spec.vcc} V, ADC 0..${spec.adcMax})`,
    ` * Terverifikasi : ${new Date().toLocaleString("id-ID")}`,
    " *",
    " * Catatan:",
    ` * - ${spec.notes}`,
    libs.length ? ` * - Pustaka yang dipakai: ${libs.join(", ")}.` : " * - Tidak memakai pustaka tambahan.",
    " * - Di Arduino IDE: Tools > Board, pilih papan di atas sebelum Upload.",
    " */",
    "",
  ].join("\n");

  return header + src;
}

/** Catatan pengkabelan berbasis komponen modul. */
export function buildWiringReadme(parts, opts = {}) {
  const boardId = opts.boardId || "esp32";
  const spec = BOARDS[boardId] || BOARDS.esp32;
  const rows = [];
  for (const p of parts || []) {
    if (p.kind === "led") {
      rows.push(`- LED "${p.label || "LED"}": kaki panjang (anoda) ke GPIO${pinName(boardId, p.pin)} lewat resistor 220-330 ohm, kaki pendek (katoda) ke GND.`);
    }
    if (p.kind === "servo") {
      rows.push(`- Servo SG90 "${p.label || "Servo"}": merah ke 5V (lewat sumber luar, bukan pin board), cokelat/hitam ke GND, oranye/kuning ke GPIO${pinName(boardId, p.pin)}.`);
    }
    if (p.kind === "button") {
      rows.push(`- Tombol "${p.label || "Tombol"}": satu kaki ke GPIO${pinName(boardId, p.pin)}, satu kaki ke GND. Kode memakai INPUT_PULLUP sehingga tidak butuh resistor eksternal.`);
    }
    if (p.kind === "analog") {
      const label = p.kind2 === "ldr" ? "pembagi tegangan dengan LDR" : "potensiometer (kaki tengah ke pin, kaki kiri-kanan ke GND dan 3V3)";
      rows.push(`- Sensor "${p.label || "Analog"}" pada GPIO${pinName(boardId, p.pin)}: ${label}.`);
    }
    if (p.kind === "lcd") {
      rows.push(`- LCD 16x2 beradaptor I2C "${p.label || "LCD"}" (alamat ${p.addr || "0x27"}): VCC ke 5V/3V3, GND ke GND, SDA ke pin SDA papan, SCL ke pin SCL papan. Di ESP32 default SDA=GPIO21, SCL=GPIO22 (modul contoh memakai 5 dan 4).`);
    }
    if (p.kind === "oled") {
      rows.push(`- OLED 0.96" SSD1306 I2C "${p.label || "OLED"}" (alamat ${p.addr || "0x3C"}): VCC ke 3V3, GND ke GND, SDA dan SCL ke pin I2C papan (contoh memakai GPIO5 dan GPIO4).`);
    }
  }
  return [
    `# Pengkabelan - ${opts.moduleTitle || "Modul"}`,
    "",
    `Papan: **${spec.label}** (${spec.mcu})`,
    "",
    rows.length ? rows.join("\n") : "- Modul ini tidak memerlukan komponen eksternal.",
    "",
    "## Batasan simulator",
    "",
    "- Simulator menjalankan subset C++ Arduino: `setup()`, `loop()`, GPIO, PWM, ADC, servo, serial, serta layar I2C (LCD 16x2 dan OLED SSD1306).",
    "- WiFi, MQTT, SPI, dan interupsi tidak disimulasikan; kode yang memakainya harus di-flash ke papan asli.",
    `- Resolusi ADC papan ini ${spec.adcMax === 4095 ? "12 bit (0-4095)" : "10 bit (0-1023)"}; sesuaikan konstanta batas atas pada kode.`,
    "",
  ].join("\n");
}

export function filenameFor(moduleId, boardId) {
  const base = (moduleId || "sketch").replace(/[^a-z0-9_-]+/gi, "_");
  return `${base}_${boardId || "esp32"}.ino`;
}

/** Unduh teks sebagai berkas. */
export function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
