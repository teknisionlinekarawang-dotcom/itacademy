import { useEffect, useRef, useState } from 'react';
import type { SensorModule, Channel } from '../data/sensorModules';

// ---------- helper kecil ----------
const toneHex: Record<'ok' | 'warn' | 'bad', string> = {
    ok: '#22c55e',
    warn: '#f59e0b',
    bad: '#ef4444',
};

// Peta nilai channel ke ADC 10-bit (0..1023) untuk readout edukatif.
function toAdc(v: number, c: Channel): number {
    const ratio = (v - c.min) / (c.max - c.min);
    return Math.max(0, Math.min(1023, Math.round(ratio * 1023)));
}

function fmt(v: number, step: number): string {
    const decimals = step < 1 ? (step < 0.1 ? 2 : 1) : 0;
    return v.toFixed(decimals);
}

const Panel = ({ children }: { children: React.ReactNode }) => (
    <div className="rounded-lg border border-[rgba(0,212,255,0.15)] bg-[#07090f] p-4 space-y-4">
        {children}
    </div>
);

const Readout = ({ label, value, tone }: { label: string; value: string; tone?: 'ok' | 'warn' | 'bad' }) => (
    <div className="flex items-center justify-between gap-3 font-mono text-xs">
        <span className="text-[#64748b]">{label}</span>
        <span
            className="px-2 py-0.5 rounded"
            style={tone ? { color: toneHex[tone], border: `1px solid ${toneHex[tone]}55` } : { color: '#00d4ff' }}
        >
            {value}
        </span>
    </div>
);

// ---------- baris slider satu channel ----------
function SliderRow({ channel, value, onChange }: { channel: Channel; value: number; onChange: (v: number) => void }) {
    const st = channel.status ? channel.status(value) : undefined;
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <label className="text-xs text-[#b0c4de]">{channel.label}</label>
                <span className="font-mono text-sm text-white">
                    {fmt(value, channel.step)} <span className="text-[#64748b]">{channel.unit}</span>
                </span>
            </div>
            <input
                type="range"
                min={channel.min}
                max={channel.max}
                step={channel.step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full accent-[#00d4ff]"
            />
            <div className="flex items-center justify-between font-mono text-[10px] text-[#4a5568]">
                <span>ADC: {toAdc(value, channel)} / 1023</span>
                {st && (
                    <span style={{ color: toneHex[st.tone] }}>● {st.text}</span>
                )}
            </div>
        </div>
    );
}

// ---------- mesin: slider ----------
function SliderEngine({ module }: { module: SensorModule }) {
    const chs = module.channels || [];
    const [vals, setVals] = useState<number[]>(() => chs.map((c) => c.default));
    const set = (i: number, v: number) => setVals((p) => p.map((x, idx) => (idx === i ? v : x)));
    return (
        <Panel>
            {module.simHint && <p className="text-[11px] text-[#64748b]">{module.simHint}</p>}
            {chs.map((c, i) => (
                <SliderRow key={c.label} channel={c} value={vals[i]} onChange={(v) => set(i, v)} />
            ))}
        </Panel>
    );
}

// ---------- mesin: meter (INA219) ----------
function MeterEngine({ module }: { module: SensorModule }) {
    const chs = module.channels || [];
    const [vals, setVals] = useState<number[]>(() => chs.map((c) => c.default));
    const set = (i: number, v: number) => setVals((p) => p.map((x, idx) => (idx === i ? v : x)));
    const v = vals[0] ?? 0;
    const a = vals[1] ?? 0;
    const power = v * a;
    return (
        <Panel>
            {module.simHint && <p className="text-[11px] text-[#64748b]">{module.simHint}</p>}
            {chs.map((c, i) => (
                <SliderRow key={c.label} channel={c} value={vals[i]} onChange={(val) => set(i, val)} />
            ))}
            <div className="rounded-lg border border-[rgba(0,219,255,0.2)] bg-[rgba(0,212,255,0.05)] p-3 text-center">
                <div className="text-[10px] uppercase tracking-widest text-[#64748b]">Daya (P = V x I)</div>
                <div className="font-display text-2xl font-bold text-[#00d4ff]">{power.toFixed(2)} W</div>
            </div>
        </Panel>
    );
}

// ---------- mesin: digital ----------
function DigitalEngine({ module }: { module: SensorModule }) {
    const [on, setOn] = useState(false);
    return (
        <Panel>
            {module.simHint && <p className="text-[11px] text-[#64748b]">{module.simHint}</p>}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span
                        className="w-5 h-5 rounded-full transition-all"
                        style={{ background: on ? '#22c55e' : '#334155', boxShadow: on ? '0 0 12px #22c55e' : 'none' }}
                    />
                    <span className="font-mono text-sm text-white">Pin OUT: <span style={{ color: on ? '#22c55e' : '#64748b' }}>{on ? 'HIGH' : 'LOW'}</span></span>
                </div>
                <button
                    type="button"
                    onClick={() => setOn((x) => !x)}
                    className="px-4 py-2 rounded-lg font-display text-sm font-bold bg-[#00d4ff] text-[#07090f] hover:bg-white transition-all"
                >
                    {on ? 'Deteksi Berakhir' : 'Deteksi Gerakan'}
                </button>
            </div>
            <div className="rounded bg-[#0b1120] border border-[rgba(255,255,255,0.05)] p-2 font-mono text-[11px] text-[#94a3b8]">
                <div>{`> Serial.println(digitalRead(PIN));`}</div>
                <div className="text-white">{on ? '1' : '0'}</div>
            </div>
        </Panel>
    );
}

// ---------- mesin: RFID ----------
function RfidEngine({ module }: { module: SensorModule }) {
    const [uid, setUid] = useState<string | null>(null);
    const [granted, setGranted] = useState(false);
    const scan = () => {
        const bytes = Array.from({ length: 4 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase());
        setUid(bytes.join(':'));
        setGranted(Math.random() > 0.4);
    };
    return (
        <Panel>
            {module.simHint && <p className="text-[11px] text-[#64748b]">{module.simHint}</p>}
            <div className="text-center">
                <div className="font-mono text-lg text-white min-h-[1.5rem]">{uid || '--:--:--:--'}</div>
                <div className="text-[11px] text-[#64748b]">UID Kartu (MIFARE)</div>
            </div>
            <button
                type="button"
                onClick={scan}
                className="w-full px-4 py-2 rounded-lg font-display text-sm font-bold bg-[#00d4ff] text-[#07090f] hover:bg-white transition-all"
            >
                🪪 Tempelkan Kartu
            </button>
            {uid && (
                <div className="text-center font-display font-bold" style={{ color: granted ? '#22c55e' : '#ef4444' }}>
                    {granted ? '✓ AKSES DIBERIKAN — pintu terbuka' : '✕ AKSES DITOLAK'}
                </div>
            )}
        </Panel>
    );
}

// ---------- mesin: display ----------
function DisplayEngine({ module }: { module: SensorModule }) {
    const kind = module.displayKind || 'lcd';
    const [text, setText] = useState('Halo DEVAcademy');
    const perLine = kind === 'lcd' ? 16 : kind === 'matrix' ? 12 : 20;
    const lines = kind === 'lcd'
        ? [text.slice(0, 16), text.slice(16, 32)]
        : [text];

    const screen = (inner: React.ReactNode, boxStyle: React.CSSProperties) => (
        <div className="mx-auto rounded-md overflow-hidden" style={boxStyle}>{inner}</div>
    );

    return (
        <Panel>
            {module.simHint && <p className="text-[11px] text-[#64748b]">{module.simHint}</p>}
            <input
                type="text"
                value={text}
                maxLength={kind === 'lcd' ? 32 : 24}
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-[#0b1120] border border-[rgba(255,255,255,0.08)] rounded px-3 py-2 text-sm text-white outline-none focus:border-[#00d4ff]"
                placeholder="Teks untuk ditampilkan..."
            />

            {kind === 'lcd' && screen(
                <div className="bg-[#0f3d2e] p-2 font-mono leading-tight" style={{ width: '100%' }}>
                    {lines.map((ln, i) => (
                        <div key={i} className="text-[#7CFC90] text-base tracking-[2px] px-1" style={{ textShadow: '0 0 4px #22c55e' }}>
                            {ln.padEnd(perLine, '\u00A0')}
                        </div>
                    ))}
                </div>,
                { border: '4px solid #1f2937', maxWidth: 260 },
            )}

            {kind === 'oled' && screen(
                <div className="bg-black p-2 font-mono text-center" style={{ width: '100%', minHeight: 64 }}>
                    <div className="text-white text-sm tracking-wider" style={{ textShadow: '0 0 3px #fff' }}>{text || ' '}</div>
                    <div className="mt-1 text-[9px] text-[#9ca3af]">128 x 64 · SSD1306</div>
                </div>,
                { border: '3px solid #111827', maxWidth: 200 },
            )}

            {kind === 'tft' && screen(
                <div className="p-3 text-center" style={{ width: '100%', minHeight: 90, background: 'linear-gradient(135deg,#1e3a8a,#7c3aed)' }}>
                    <div className="text-white font-display font-bold text-lg drop-shadow">{text || ' '}</div>
                    <div className="mt-1 text-[9px] text-white/70">240 x 320 · ILI9341 · sentuh</div>
                </div>,
                { border: '3px solid #0f172a', maxWidth: 200 },
            )}

            {kind === 'matrix' && screen(
                <div className="bg-black p-2 font-mono text-center" style={{ width: '100%', minHeight: 40 }}>
                    <div className="text-[#ff7a1a] text-base tracking-[3px]" style={{ textShadow: '0 0 6px #ff7a1a' }}>{text.slice(0, perLine) || ' '}</div>
                </div>,
                { border: '3px solid #111827', maxWidth: 240, backgroundImage: 'radial-gradient(#1f2937 1px, transparent 1px)', backgroundSize: '6px 6px' },
            )}

            <p className="text-[10px] text-[#4a5568] text-center">
                {kind === 'lcd' ? 'Baris 1 maks 16 karakter, baris 2 sisanya.' : `Tampilan pratinjau (${kind.toUpperCase()}).`}
            </p>
        </Panel>
    );
}

// ---------- mesin: servo ----------
function ServoEngine({ module }: { module: SensorModule }) {
    const [angle, setAngle] = useState(90);
    const rad = (angle * Math.PI) / 180;
    const cx = 70, cy = 60, len = 46;
    const x = cx + len * Math.cos(Math.PI - rad);
    const y = cy - len * Math.sin(Math.PI - rad);
    return (
        <Panel>
            {module.simHint && <p className="text-[11px] text-[#64748b]">{module.simHint}</p>}
            <svg viewBox="0 0 140 100" className="w-full max-w-[220px] mx-auto">
                <rect x="40" y="60" width="60" height="30" rx="4" fill="#1e293b" stroke="#334155" />
                <circle cx={cx} cy={cy} r="8" fill="#0f172a" stroke="#00d4ff" />
                <line x1={cx} y1={cy} x2={x} y2={y} stroke="#00d4ff" strokeWidth="5" strokeLinecap="round" />
                <text x={cx} y={95} textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="monospace">{angle}°</text>
            </svg>
            <input type="range" min={0} max={180} value={angle} onChange={(e) => setAngle(parseInt(e.target.value))} className="w-full accent-[#00d4ff]" />
            <div className="flex justify-between font-mono text-[10px] text-[#4a5568]">
                <span>0°</span><span>pulsa {(1 + (angle / 180)).toFixed(2)} ms</span><span>180°</span>
            </div>
        </Panel>
    );
}

// ---------- mesin: motor driver ----------
function MotorEngine({ module }: { module: SensorModule }) {
    const [dir, setDir] = useState<'cw' | 'ccw' | 'stop'>('cw');
    const [pwm, setPwm] = useState(180);
    const running = dir !== 'stop' && pwm > 0;
    const dur = running ? Math.max(0.2, (255 - pwm) / 300 + 0.2) : 0;
    return (
        <Panel>
            {module.simHint && <p className="text-[11px] text-[#64748b]">{module.simHint}</p>}
            <div className="flex items-center justify-center">
                <svg viewBox="0 0 80 80" width="80" height="80">
                    <g style={running ? { transformOrigin: '40px 40px', animation: `spin ${dur}s linear infinite ${dir === 'ccw' ? 'reverse' : 'normal'}` } as React.CSSProperties : undefined}>
                        <circle cx="40" cy="40" r="30" fill="#0f172a" stroke="#00d4ff" strokeWidth="2" />
                        <rect x="37" y="12" width="6" height="18" rx="2" fill="#00d4ff" />
                        <rect x="37" y="50" width="6" height="18" rx="2" fill="#334155" />
                    </g>
                    <circle cx="40" cy="40" r="5" fill="#00d4ff" />
                </svg>
            </div>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <div className="flex gap-2">
                {(['ccw', 'stop', 'cw'] as const).map((d) => (
                    <button key={d} type="button" onClick={() => setDir(d)}
                        className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-display font-bold transition-all ${dir === d ? 'bg-[#00d4ff] text-[#07090f]' : 'bg-[#0b1120] text-[#94a3b8] border border-[rgba(255,255,255,0.06)]'}`}>
                        {d === 'cw' ? '▶ Maju' : d === 'ccw' ? '◀ Mundur' : '■ Stop'}
                    </button>
                ))}
            </div>
            <div>
                <div className="flex justify-between text-xs text-[#b0c4de]"><span>Kecepatan (PWM)</span><span className="font-mono text-white">{pwm} / 255</span></div>
                <input type="range" min={0} max={255} value={pwm} onChange={(e) => setPwm(parseInt(e.target.value))} className="w-full accent-[#00d4ff]" />
            </div>
        </Panel>
    );
}

// ---------- mesin: relay ----------
function RelayEngine({ module }: { module: SensorModule }) {
    const n = module.relayChannels || 4;
    const [state, setState] = useState<boolean[]>(() => Array(n).fill(false));
    const toggle = (i: number) => setState((p) => p.map((x, idx) => (idx === i ? !x : x)));
    return (
        <Panel>
            {module.simHint && <p className="text-[11px] text-[#64748b]">{module.simHint}</p>}
            <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: n }).map((_, i) => (
                    <button key={i} type="button" onClick={() => toggle(i)}
                        className="rounded-lg border p-3 text-left transition-all"
                        style={{ borderColor: state[i] ? '#22c55e55' : 'rgba(255,255,255,0.06)', background: state[i] ? 'rgba(34,197,94,0.08)' : '#0b1120' }}>
                        <div className="flex items-center justify-between">
                            <span className="font-display text-sm font-bold text-white">Kanal {i + 1}</span>
                            <span className="w-3 h-3 rounded-full" style={{ background: state[i] ? '#22c55e' : '#334155', boxShadow: state[i] ? '0 0 8px #22c55e' : 'none' }} />
                        </div>
                        <div className="mt-1 font-mono text-[10px]" style={{ color: state[i] ? '#22c55e' : '#64748b' }}>
                            {state[i] ? 'COM–NO tersambung' : 'terbuka'}
                        </div>
                        <div className="mt-2 text-lg">{state[i] ? '💡' : '🔅'}</div>
                    </button>
                ))}
            </div>
        </Panel>
    );
}

// ---------- mesin: buzzer ----------
function BuzzerEngine({ module }: { module: SensorModule }) {
    const [on, setOn] = useState(true);
    const [freq, setFreq] = useState(440);
    // gambar gelombang: makin tinggi frekuensi makin banyak siklus
    const cycles = Math.max(2, Math.round(freq / 110));
    const pts: string[] = [];
    const W = 260, H = 60;
    for (let i = 0; i <= 120; i++) {
        const x = (i / 120) * W;
        const y = on ? H / 2 - Math.sin((i / 120) * cycles * Math.PI * 2) * (H / 2 - 6) : H / 2;
        pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return (
        <Panel>
            {module.simHint && <p className="text-[11px] text-[#64748b]">{module.simHint}</p>}
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded bg-[#0b1120]">
                <polyline points={pts.join(' ')} fill="none" stroke={on ? '#facc15' : '#334155'} strokeWidth="2" />
            </svg>
            <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-white">{freq} Hz</span>
                <button type="button" onClick={() => setOn((x) => !x)}
                    className="px-4 py-2 rounded-lg font-display text-sm font-bold transition-all"
                    style={{ background: on ? '#facc15' : '#0b1120', color: on ? '#07090f' : '#94a3b8', border: on ? 'none' : '1px solid rgba(255,255,255,0.08)' }}>
                    {on ? '🔊 Berbunyi' : '🔇 Senyap'}
                </button>
            </div>
            <input type="range" min={200} max={2000} step={10} value={freq} onChange={(e) => setFreq(parseInt(e.target.value))} className="w-full accent-[#facc15]" />
            <p className="text-[10px] text-[#4a5568] text-center">tone(pin, {freq}); — tinggi nada mengikuti frekuensi.</p>
        </Panel>
    );
}

// ---------- mesin: clock (RTC) ----------
function ClockEngine({ module }: { module: SensorModule }) {
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    const pad = (x: number) => String(x).padStart(2, '0');
    const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][now.getDay()];
    return (
        <Panel>
            {module.simHint && <p className="text-[11px] text-[#64748b]">{module.simHint}</p>}
            <div className="rounded-lg bg-black border border-[#00d4ff33] p-4 text-center font-mono">
                <div className="text-3xl text-[#00d4ff]" style={{ textShadow: '0 0 8px #00d4ff' }}>
                    {pad(now.getHours())}:{pad(now.getMinutes())}:{pad(now.getSeconds())}
                </div>
                <div className="mt-1 text-xs text-[#94a3b8]">{hari}, {pad(now.getDate())}/{pad(now.getMonth() + 1)}/{now.getFullYear()}</div>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#64748b]">
                <span className="w-5 h-5 rounded-full bg-[#1e293b] border border-[#334155] grid place-items-center text-[10px]">🔋</span>
                Baterai CR2032 menjaga waktu walau daya utama dilepas.
            </div>
        </Panel>
    );
}

// ---------- mesin: GPS ----------
function GpsEngine({ module }: { module: SensorModule }) {
    const [fixed, setFixed] = useState(false);
    const [busy, setBusy] = useState(false);
    const [lat, setLat] = useState(-6.200000);
    const [lon, setLon] = useState(106.816666);
    const [sats, setSats] = useState(3);
    const timer = useRef<number | undefined>(undefined);
    const acquire = () => {
        setBusy(true); setFixed(false); setSats(2);
        let s = 2;
        timer.current = window.setInterval(() => {
            s += 1; setSats(s);
            if (s >= 9) {
                window.clearInterval(timer.current);
                setBusy(false); setFixed(true);
            }
        }, 300);
    };
    useEffect(() => () => { if (timer.current) window.clearInterval(timer.current); }, []);
    const move = () => {
        setLat((v) => +(v + (Math.random() - 0.5) * 0.0008).toFixed(6));
        setLon((v) => +(v + (Math.random() - 0.5) * 0.0008).toFixed(6));
    };
    return (
        <Panel>
            {module.simHint && <p className="text-[11px] text-[#64748b]">{module.simHint}</p>}
            <Readout label="Satelit terkunci" value={`${sats} / 12`} tone={sats >= 5 ? 'ok' : 'warn'} />
            <div className="rounded bg-[#0b1120] border border-[rgba(255,255,255,0.05)] p-2 font-mono text-[11px] text-[#94a3b8]">
                <div className="text-[#4a5568]">$GPGGA</div>
                <div className="text-white">{fixed ? `${lat.toFixed(6)}, ${lon.toFixed(6)}` : 'no fix…'}</div>
            </div>
            <div className="flex gap-2">
                <button type="button" onClick={acquire} disabled={busy}
                    className="flex-1 px-3 py-2 rounded-lg font-display text-sm font-bold bg-[#00d4ff] text-[#07090f] hover:bg-white transition-all disabled:opacity-50">
                    {busy ? 'Mencari…' : '🛰️ Cari Satelit'}
                </button>
                <button type="button" onClick={move} disabled={!fixed}
                    className="flex-1 px-3 py-2 rounded-lg font-display text-sm font-bold bg-[#0b1120] text-[#94a3b8] border border-[rgba(255,255,255,0.06)] disabled:opacity-40">
                    ➜ Simulasi Bergerak
                </button>
            </div>
        </Panel>
    );
}

// ---------- mesin: logger (MicroSD) ----------
function LoggerEngine({ module }: { module: SensorModule }) {
    const [rows, setRows] = useState<string[]>(['waktu,suhu_c,kelembapan_pct']);
    const rec = () => {
        const t = new Date().toLocaleTimeString('id-ID', { hour12: false });
        const suhu = (26 + Math.random() * 6).toFixed(1);
        const rh = (50 + Math.random() * 20).toFixed(0);
        setRows((p) => [...p, `${t},${suhu},${rh}`]);
    };
    const boxRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => { if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight; }, [rows]);
    return (
        <Panel>
            {module.simHint && <p className="text-[11px] text-[#64748b]">{module.simHint}</p>}
            <div ref={boxRef} className="h-28 overflow-auto rounded bg-[#0b1120] border border-[rgba(255,255,255,0.05)] p-2 font-mono text-[11px] text-[#94a3b8]">
                {rows.map((r, i) => <div key={i} className={i === 0 ? 'text-[#00d4ff]' : ''}>{r}</div>)}
            </div>
            <div className="flex gap-2">
                <button type="button" onClick={rec}
                    className="flex-1 px-3 py-2 rounded-lg font-display text-sm font-bold bg-[#00d4ff] text-[#07090f] hover:bg-white transition-all">
                    ⬇ Rekam ke data.csv
                </button>
                <button type="button" onClick={() => setRows(['waktu,suhu_c,kelembapan_pct'])}
                    className="px-3 py-2 rounded-lg font-display text-sm font-bold bg-[#0b1120] text-[#94a3b8] border border-[rgba(255,255,255,0.06)]">
                    Bersihkan
                </button>
            </div>
            <p className="text-[10px] text-[#4a5568] text-center">Ditulis ke kartu MicroSD (FAT) sebagai CSV.</p>
        </Panel>
    );
}

// ---------- mesin: charger (TP4056) ----------
function ChargerEngine({ module }: { module: SensorModule }) {
    const [soc, setSoc] = useState(35);
    const volt = (3.3 + (soc / 100) * 0.9).toFixed(2); // 3.3 - 4.2 V
    const full = soc >= 100;
    const phase = full ? 'Selesai (CV -> cutoff)' : soc > 85 ? 'Tahap CV (tegangan konstan)' : 'Tahap CC (arus konstan)';
    return (
        <Panel>
            {module.simHint && <p className="text-[11px] text-[#64748b]">{module.simHint}</p>}
            <div className="mx-auto w-40 h-16 rounded-md border-2 border-[#334155] relative overflow-hidden">
                <div className="absolute left-0 top-0 h-full transition-all" style={{ width: `${soc}%`, background: full ? '#22c55e' : soc > 85 ? '#4ade80' : '#f59e0b' }} />
                <div className="absolute inset-0 grid place-items-center font-mono text-sm text-white mix-blend-difference">{soc}%</div>
            </div>
            <div className="flex justify-center gap-4 text-[11px] font-mono">
                <span style={{ color: full ? '#334155' : '#ef4444' }}>● LED Merah {full ? 'mati' : 'isi'}</span>
                <span style={{ color: full ? '#3b82f6' : '#334155' }}>● LED Biru {full ? 'penuh' : 'mati'}</span>
            </div>
            <input type="range" min={0} max={100} value={soc} onChange={(e) => setSoc(parseInt(e.target.value))} className="w-full accent-[#22c55e]" />
            <Readout label="Tegangan baterai" value={`${volt} V`} />
            <Readout label="Tahap pengisian" value={phase} tone={full ? 'ok' : 'warn'} />
        </Panel>
    );
}

/* __ENGINES_MORE__ */

export default function SensorSimulator({ module }: { module: SensorModule }) {
    switch (module.sim) {
        case 'slider': return <SliderEngine module={module} />;
        case 'meter': return <MeterEngine module={module} />;
        case 'digital': return <DigitalEngine module={module} />;
        case 'rfid': return <RfidEngine module={module} />;
        case 'display': return <DisplayEngine module={module} />;
        case 'servo': return <ServoEngine module={module} />;
        case 'motor': return <MotorEngine module={module} />;
        case 'relay': return <RelayEngine module={module} />;
        case 'buzzer': return <BuzzerEngine module={module} />;
        case 'clock': return <ClockEngine module={module} />;
        case 'gps': return <GpsEngine module={module} />;
        case 'logger': return <LoggerEngine module={module} />;
        case 'charger': return <ChargerEngine module={module} />;
        /* __DISPATCH__ */
        default:
            return (
                <Panel>
                    <p className="text-xs text-[#64748b]">Simulasi interaktif belum tersedia untuk modul ini, namun detail & spesifikasinya lengkap di atas.</p>
                </Panel>
            );
    }
}
