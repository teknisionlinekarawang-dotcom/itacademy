// serial.js - Panel Serial Monitor: stream baris, auto-scroll, filter, dan jernihan.

export class SerialView {
  /** @param {HTMLElement} root @param {import('./hardware.js').SerialLog} log */
  constructor(root, log) {
    this.root = root;
    this.log = log;
    this.autoscroll = true;
    this.filter = "";
    this.root.innerHTML = `
      <div class="serial-bar">
        <span class="serial-count">0 baris</span>
        <input type="search" class="serial-filter" placeholder="saring log\u2026" aria-label="Saring log serial" />
        <label class="serial-toggle"><input type="checkbox" checked /> auto-scroll</label>
        <button type="button" class="btn tiny serial-clear">Bersihkan</button>
      </div>
      <pre class="serial-body" tabindex="0" aria-label="Serial Monitor"></pre>`;
    this.body = root.querySelector(".serial-body");
    this.count = root.querySelector(".serial-count");
    this.filterEl = root.querySelector(".serial-filter");
    this.toggleEl = root.querySelector(".serial-toggle input");
    this.clearBtn = root.querySelector(".serial-clear");

    this.toggleEl.addEventListener("change", () => { this.autoscroll = this.toggleEl.checked; });
    this.filterEl.addEventListener("input", () => { this.filter = this.filterEl.value.toLowerCase(); this.render(); });
    this.clearBtn.addEventListener("click", () => this.log.clear());
    this.body.addEventListener("scroll", () => {
      const atBottom = this.body.scrollHeight - this.body.scrollTop - this.body.clientHeight < 24;
      if (!atBottom && this.autoscroll) { this.autoscroll = false; this.toggleEl.checked = false; }
    });
    this.unsubscribe = this.log.subscribe(() => this.render());
    this.render();
  }

  render() {
    const lines = this.log.lines;
    const shown = this.filter ? lines.filter((l) => l.text.toLowerCase().includes(this.filter)) : lines;
    const frag = document.createDocumentFragment();
    for (const l of shown) {
      const span = document.createElement("span");
      span.className = "serial-line";
      span.textContent = l.text + "\n";
      frag.appendChild(span);
    }
    this.body.replaceChildren(frag);
    this.count.textContent = `${shown.length}${this.filter ? " / " + lines.length : ""} baris`;
    if (this.autoscroll) this.body.scrollTop = this.body.scrollHeight;
  }

  destroy() { this.unsubscribe(); }
}
