import { useState, useEffect, type FC, type ReactNode } from 'react';

/* =====================================================================
   InternetSimulator
   ---------------------------------------------------------------------
   Simulasi interaktif "Bagaimana Internet Bekerja?" untuk siswa SMK.
   Membisualisasikan perjalanan paket data melewati 5 entitas:
   Client → Router/ISP → DNS Server → Samudra (Kabel Fiber Optik) → Server.

   Cara pakai:
       import InternetSimulator from './simulator/InternetSimulator';
       <InternetSimulator />

   Mandiri (single-file): hanya React hooks standar + Tailwind CSS +
   <style> lokal untuk keyframes (tanpa library animasi eksternal).
   ===================================================================== */

type NodeId = 'client' | 'isp' | 'dns' | 'ocean' | 'server';
type Dir = 'right' | 'left' | 'down' | 'up';
type SegId = 'c-isp' | 'isp-ocean' | 'ocean-server' | 'isp-dns';

interface StepDef {
    title: string;
    phase: string;
    body: string;
    analogy: string;
}

/** Spesifikasi satu titik paket yang beranimasi pada sebuah segmen. */
interface DotSpec {
    dir: Dir;
    delay: number;
    color: number; // indeks warna paket (0..2) — merepresentasikan nomor paket
}

/* ---- Warna paket (sesuai nomor paket saat chunking) -------------------- */
const PACKET_COLORS = ['#22d3ee', '#a78bfa', '#fbbf24'];

/* ---- Definisi 5 langkah simulasi ---------------------------------------- */
const STEPS: StepDef[] = [
    {
        title: 'Mengetik Alamat Website',
        phase: 'REQUEST',
        body: 'Kamu mengetik google.com di browser. Komputer tidak paham huruf — ia hanya paham angka (IP Address).',
        analogy: 'Ibarat menulis nama teman pada amplop. Namanya saja belum cukup — petugas pos butuh alamat lengkap.',
    },
    {
        title: 'Tanya ke Buku Telepon (DNS)',
        phase: 'DNS LOOKUP',
        body: 'Browser bertanya ke DNS: "Di mana google.com?" DNS menjawab dengan alamat angkanya: 172.217.0.46.',
        analogy: 'DNS ibarat buku telepon raksasa: cari nama "Google", langsung dapat nomor rumahnya.',
    },
    {
        title: 'File Dipotong Jadi Paket',
        phase: 'CHUNKING',
        body: 'File besar tidak bisa dikirim sekali jalan. Ia dipotong menjadi paket-paket kecil bernomor: Paket 1, Paket 2, Paket 3.',
        analogy: 'Seperti puzzle besar yang dipecah ke beberapa kotak kecil supaya mudah dibawa kurir.',
    },
    {
        title: 'Menyeberangi Samudra',
        phase: 'TRANSMISI',
        body: 'Paket-paket berlomba melewati router, ISP, lalu kabel serat optik bawah laut menuju server di Amerika — hanya dalam hitungan milidetik.',
        analogy: 'Kabel bawah laut ibarat jalan tol bawah laut yang membentang sepanjang samudra.',
    },
    {
        title: 'Dirakit & Balasan Dikirim',
        phase: 'REASSEMBLY',
        body: 'Server menyusun Paket 1-2-3 sesuai nomor hingga file utuh. Ia lalu mengirim balasan kecil ke perangkatmu — halaman pun tampil!',
        analogy: 'Kurir merangkai potongan puzzle di rumah tujuan, lalu mengirim kartu "sampai tujuan" balik kepadamu.',
    },
];

/* ---- Node mana yang "menyala" pada tiap langkah ------------------------- */
const NODE_ACTIVE: Record<number, NodeId[]> = {
    1: ['client'],
    2: ['client', 'isp', 'dns'],
    3: ['client'],
    4: ['client', 'isp', 'ocean', 'server'],
    5: ['server', 'ocean', 'isp', 'client'],
};

/* ---- Teks status kecil di bawah judul tiap entitas ----------------------- */
const NODE_SUB: Record<number, Partial<Record<NodeId, string>>> = {
    1: { client: 'Mengetik alamat…' },
    2: { client: 'Nunggu jawaban DNS…', isp: 'Meneruskan ke DNS', dns: 'Mencari google.com…' },
    3: { client: 'Memotong file jadi paket…' },
    4: { client: 'Mengirim paket!', isp: 'Meneruskan paket', ocean: 'Ramai lalu lintas paket!', server: 'Paket mulai datang…' },
    5: { server: 'Merakit & membalas', ocean: 'Balasan melintas', isp: 'Meneruskan balasan', client: 'Halaman tampil ✓' },
};

/**
 * Daftar titik paket yang harus dianimasikan pada sebuah segmen kabel
 * untuk langkah (step) tertentu. Delay dalam detik; warna = nomor paket.
 */
function getSegDots(step: number, seg: SegId): DotSpec[] {
    if (step === 2) {
        if (seg === 'c-isp') {
            return [
                { dir: 'right', delay: 0, color: 0 }, // pertanyaan berangkat
                { dir: 'left', delay: 2.1, color: 1 }, // jawaban IP kembali
            ];
        }
        if (seg === 'isp-dns') {
            return [
                { dir: 'down', delay: 0.55, color: 0 }, // tanya ke DNS
                { dir: 'up', delay: 1.35, color: 1 }, // DNS menjawab
            ];
        }
        return [];
    }
    if (step === 4) {
        // 3 paket berdesakan menyeberangi seluruh jalur (staggered).
        if (seg === 'c-isp') return [0, 1, 2].map((i) => ({ dir: 'right' as Dir, delay: i * 0.4, color: i }));
        if (seg === 'isp-ocean') return [0, 1, 2].map((i) => ({ dir: 'right' as Dir, delay: 0.55 + i * 0.4, color: i }));
        if (seg === 'ocean-server') return [0, 1, 2].map((i) => ({ dir: 'right' as Dir, delay: 1.1 + i * 0.4, color: i }));
        return [];
    }
    if (step === 5) {
        // Balasan dari server kembali menuju client.
        if (seg === 'ocean-server') return [{ dir: 'left', delay: 1.7, color: 0 }];
        if (seg === 'isp-ocean') return [{ dir: 'left', delay: 2.25, color: 0 }];
        if (seg === 'c-isp') return [{ dir: 'left', delay: 2.8, color: 0 }];
        return [];
    }
    return [];
}

/* ---- Ikon SVG inline (gaya Lucide, stroke = currentColor) --------------- */
const GlobeIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </svg>
);

const LaptopIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="4" y="4" width="16" height="11" rx="2" />
        <path d="M2 19h20" />
    </svg>
);

const RouterIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="13" width="18" height="7" rx="2" />
        <path d="M7 16.5h.01M10.5 16.5h.01" />
        <path d="M6.5 9.5a7 7 0 0 1 11 0" />
        <path d="M9 12a4 4 0 0 1 6 0" />
    </svg>
);

const BookOpenIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 6c-1.5-1.7-4-2-8-2v14c4 0 6.5.3 8 2 1.5-1.7 4-2 8-2V4c-4 0-6.5.3-8 2z" />
        <path d="M12 6v14" />
    </svg>
);

const WavesIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M2 6c.8.8 1.8 1.2 2.7 1.2S6.5 6.8 7.3 6c.8-.8 1.8-1.2 2.7-1.2S11.8 5.2 12.6 6c.8.8 1.8 1.2 2.7 1.2S17.1 6.8 18 6c.8-.8 1.8-1.2 2.7-1.2" />
        <path d="M2 12c.8.8 1.8 1.2 2.7 1.2s1.8-.4 2.6-1.2c.8-.8 1.8-1.2 2.7-1.2s1.8.4 2.6 1.2c.8.8 1.8 1.2 2.7 1.2s1.8-.4 2.7-1.2c.8-.8 1.8-1.2 2.7-1.2" />
        <path d="M2 18c.8.8 1.8 1.2 2.7 1.2s1.8-.4 2.6-1.2c.8-.8 1.8-1.2 2.7-1.2s1.8.4 2.6 1.2c.8.8 1.8 1.2 2.7 1.2s1.8-.4 2.7-1.2c.8-.8 1.8-1.2 2.7-1.2" />
    </svg>
);

const ServerTowerIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="4" y="3" width="16" height="8" rx="2" />
        <rect x="4" y="13" width="16" height="8" rx="2" />
        <path d="M8 7h.01M8 17h.01" />
        <path d="M12 7h4M12 17h4" />
    </svg>
);

const BoxIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
        <path d="M3.5 8.5 12 13l8.5-4.5" />
        <path d="M12 22V13" />
    </svg>
);

const CheckCircleIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12 2.5 2.5 4.5-5" />
    </svg>
);

const ChevronLeftIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="m15 18-6-6 6-6" />
    </svg>
);

const ChevronRightIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="m9 18 6-6-6-6" />
    </svg>
);

const PlayIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M6 4.5v15l13-7.5L6 4.5z" />
    </svg>
);

const PauseIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4">
        <path d="M8 5v14M16 5v14" />
    </svg>
);

const RotateCcwIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5" />
    </svg>
);

const LightbulbIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M9 18h6M10 21h4" />
        <path d="M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 3z" />
    </svg>
);

/* ---- Kartu entitas jaringan ---------------------------------------------- */
const EntityNode = ({ icon, label, sub, active, children }: {
    icon: ReactNode;
    label: string;
    sub?: string;
    active: boolean;
    children?: ReactNode;
}) => (
    <div
        className={`rounded-xl border p-3 transition-all duration-500 ${
            active
                ? 'bg-[#0d1525] border-[#00d4ff]/60 shadow-[0_0_28px_rgba(0,212,255,0.18)]'
                : 'bg-[#07090f]/80 border-white/10 opacity-75'
        }`}
    >
        <div className="flex items-center gap-2 mb-1">
            <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                    active ? 'bg-[rgba(0,212,255,0.15)] text-[#00d4ff]' : 'bg-white/5 text-slate-400'
                }`}
            >
                {icon}
            </span>
            <div className="min-w-0">
                <h4 className="font-display text-xs font-bold text-white leading-tight">{label}</h4>
                <p className="text-[10px] text-[#64748b] leading-snug mt-0.5 min-h-[13px]">{sub ?? ''}</p>
            </div>
        </div>
        {children}
    </div>
);

/* ---- Segmen kabel horizontal dengan titik paket --------------------------- */
const HSegment = ({ dots }: { dots: DotSpec[] }) => (
    <div
        className={`relative h-1 self-center mx-1 rounded-full transition-colors duration-300 ${
            dots.length > 0 ? 'bg-[rgba(0,212,255,0.4)]' : 'bg-white/10'
        }`}
    >
        {dots.map((d, i) => (
            <span
                key={`${i}-${d.dir}`}
                className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full net-dot-${d.dir}`}
                style={{
                    backgroundColor: PACKET_COLORS[d.color],
                    boxShadow: `0 0 10px ${PACKET_COLORS[d.color]}`,
                    animationDelay: `${d.delay}s`,
                }}
            />
        ))}
    </div>
);

/* ---- Segmen kabel vertikal (jalur ke DNS) ---------------------------------- */
const VSegment = ({ dots }: { dots: DotSpec[] }) => (
    <div
        className={`relative w-1 h-14 mx-auto rounded-full transition-colors duration-300 ${
            dots.length > 0 ? 'bg-[rgba(0,212,255,0.4)]' : 'bg-white/10'
        }`}
    >
        {dots.map((d, i) => (
            <span
                key={`${i}-${d.dir}`}
                className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full net-dot-${d.dir}`}
                style={{
                    backgroundColor: PACKET_COLORS[d.color],
                    boxShadow: `0 0 10px ${PACKET_COLORS[d.color]}`,
                    animationDelay: `${d.delay}s`,
                }}
            />
        ))}
    </div>
);

/* =====================================================================
   Komponen utama
   ===================================================================== */
export default function InternetSimulator() {
    /* step: 1..5 — langkah simulasi yang sedang aktif */
    const [step, setStep] = useState(1);
    const [playing, setPlaying] = useState(false);

    const nextStep = () => {
        setPlaying(false);
        setStep((s) => Math.min(5, s + 1));
    };

    const prevStep = () => {
        setPlaying(false);
        setStep((s) => Math.max(1, s - 1));
    };

    const resetSim = () => {
        setPlaying(false);
        setStep(1);
    };

    /* ---- Putar otomatis: maju 1 langkah tiap 4,5 detik ------------------- */
    useEffect(() => {
        if (playing && step >= STEPS.length) setPlaying(false);
    }, [playing, step]);

    useEffect(() => {
        if (!playing || step >= STEPS.length) return;
        const id = window.setTimeout(() => {
            setStep((s) => Math.min(STEPS.length, s + 1));
        }, 4500);
        return () => window.clearTimeout(id);
    }, [playing, step]);

    /* ---- Data langkah aktif ----------------------------------------------- */
    const current = STEPS[step - 1];
    const activeNodes = NODE_ACTIVE[step] ?? [];
    const isNodeActive = (id: NodeId) => activeNodes.includes(id);
    const subOf = (id: NodeId) => NODE_SUB[step]?.[id];

        return (
        <div className="w-full">
            {/* Keyframes animasi simulasi (lokal, tanpa library eksternal) */}
            <style>{`
                @keyframes netsim-travel-r { 0% { left: -4px; opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { left: calc(100% - 8px); opacity: 0; } }
                @keyframes netsim-travel-l { 0% { left: calc(100% - 8px); opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { left: -4px; opacity: 0; } }
                @keyframes netsim-travel-d { 0% { top: -4px; opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { top: calc(100% - 8px); opacity: 0; } }
                @keyframes netsim-travel-u { 0% { top: calc(100% - 8px); opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { top: -4px; opacity: 0; } }
                .net-dot-right { animation: netsim-travel-r 1.15s ease-in-out forwards; }
                .net-dot-left  { animation: netsim-travel-l 1.15s ease-in-out forwards; }
                .net-dot-down  { animation: netsim-travel-d 0.9s ease-in-out forwards; }
                .net-dot-up    { animation: netsim-travel-u 0.9s ease-in-out forwards; }
                @keyframes netsim-fiber-pulse { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.95; } }
                .net-fiber-pulse { animation: netsim-fiber-pulse 1.2s ease-in-out infinite; }
                @keyframes netsim-pop { 0% { transform: scale(0.3); opacity: 0; } 70% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
                .net-pop { opacity: 0; animation: netsim-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
                @keyframes netsim-slot-fill { 0% { transform: translateY(-10px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
                .net-slot-fill { opacity: 0; animation: netsim-slot-fill 0.4s ease-out forwards; }
                @keyframes netsim-typing { from { width: 0; } to { width: 100%; } }
                .net-typing { display: inline-block; overflow: hidden; white-space: nowrap; vertical-align: bottom; animation: netsim-typing 1.2s steps(20, end) forwards; }
            `}</style>

            {/* ===== Header Simulator ===== */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)] flex items-center justify-center text-[#00d4ff]">
                    <GlobeIcon />
                </div>
                <div className="min-w-0">
                    <h2 className="font-display text-xl md:text-2xl font-bold text-white">
                        Simulator: Perjalanan Paket Data
                    </h2>
                    <p className="text-xs text-[#64748b] mt-1">
                        Ikuti perjalanan data dari HP-mu sampai ke server Google — langkah demi langkah.
                    </p>
                </div>
                <span className="ml-auto hidden sm:inline-flex items-center px-3 py-1.5 rounded-full bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.15)] text-[10px] font-mono text-[#00d4ff]">
                    5 Entitas • 5 Langkah • Interaktif
                </span>
            </div>

            <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
                {/* ===== Kolom kiri: peta jaringan ===== */}
                <div className="bg-[#07090f] border border-white/10 rounded-2xl p-4 md:p-5">
                    {/* Banner langkah + progress dots */}
                    <div className="flex items-center justify-between mb-4 px-1">
                        <span className="text-xs font-mono text-[#00d4ff]">
                            LANGKAH {step}/5 — {current.phase}
                        </span>
                        <div className="flex gap-1.5 items-center">
                            {STEPS.map((_, i) => {
                                const n = i + 1;
                                return (
                                    <button
                                        key={n}
                                        aria-label={`Langkah ${n}`}
                                        onClick={() => { setPlaying(false); setStep(n); }}
                                        className={`h-2.5 rounded-full transition-all duration-300 ${
                                            n === step ? 'w-6 bg-[#00d4ff]' : n < step ? 'w-2.5 bg-[#00d4ff]/40' : 'w-2.5 bg-white/15'
                                        }`}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* Peta jaringan — geser horizontal di layar kecil */}
                    <div className="overflow-x-auto pb-2">
                        <div
                            className="min-w-[790px] grid gap-y-0"
                            style={{ gridTemplateColumns: '150px minmax(52px,1fr) 178px minmax(52px,1fr) 190px minmax(52px,1fr) 178px' }}
                        >
                            {/* Baris 1 — CLIENT */}
                            <EntityNode icon={<LaptopIcon />} label="CLIENT" sub={subOf('client')} active={isNodeActive('client')}>
                                <div className="mt-1 rounded-md bg-[#0a0f1c] border border-white/10 px-2 py-1.5">
                                    <p className="font-mono text-[10px] leading-none">
                                        {step === 1 ? (
                                            <span className="net-typing text-[#00d4ff]">https://google.com</span>
                                        ) : (
                                            <span className="text-slate-400">🔒 https://google.com</span>
                                        )}
                                    </p>
                                </div>

                                {step === 3 && (
                                    <div className="mt-2 space-y-1.5">
                                        <p className="text-[9px] font-mono text-[#64748b]">file besar dipotong:</p>
                                        <div className="h-1.5 w-full rounded bg-gradient-to-r from-cyan-500/60 to-violet-500/60" />
                                        <div className="flex gap-1.5 pt-0.5">
                                            {[0, 1, 2].map((i) => (
                                                <span
                                                    key={i}
                                                    className="net-pop flex-1 h-7 rounded-md flex items-center justify-center text-[9px] font-mono font-bold"
                                                    style={{
                                                        backgroundColor: `${PACKET_COLORS[i]}22`,
                                                        color: PACKET_COLORS[i],
                                                        border: `1px solid ${PACKET_COLORS[i]}55`,
                                                        animationDelay: `${0.2 + i * 0.28}s`,
                                                    }}
                                                >
                                                    P{i + 1}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {step === 5 && (
                                    <div className="net-slot-fill mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-green-400" style={{ animationDelay: '3.7s' }}>
                                        <CheckCircleIcon /> Halaman dimuat!
                                    </div>
                                )}
                            </EntityNode>

                            <HSegment dots={getSegDots(step, 'c-isp')} />

                            {/* Baris 1 — ROUTER / ISP */}
                            <EntityNode icon={<RouterIcon />} label="ROUTER / ISP" sub={subOf('isp')} active={isNodeActive('isp')}>
                                <p className="mt-1 text-[9px] font-mono text-[#4a5568]">gerbang menuju internet</p>
                            </EntityNode>

                            <HSegment dots={getSegDots(step, 'isp-ocean')} />

                            {/* Baris 1 — SAMUDRA / FIBER OPTIC */}
                            <EntityNode icon={<WavesIcon />} label="SAMUDRA / KABEL FIBER" sub={subOf('ocean')} active={isNodeActive('ocean')}>
                                <div className={`mt-2 h-1 rounded-full ${step === 4 ? 'net-fiber-pulse bg-gradient-to-r from-transparent via-[#22d3ee] to-transparent' : 'bg-white/5'}`} />
                                <p className="mt-1.5 text-[9px] font-mono text-[#4a5568]">jalur bawah lintas negara</p>
                            </EntityNode>

                            <HSegment dots={getSegDots(step, 'ocean-server')} />

                            {/* Baris 1 — WEB SERVER */}
                            <EntityNode icon={<ServerTowerIcon />} label="WEB SERVER" sub={subOf('server')} active={isNodeActive('server')}>
                                {step === 5 ? (
                                    <div className="mt-1 space-y-1.5">
                                        <div className="flex gap-1.5">
                                            {[0, 1, 2].map((i) => (
                                                <span
                                                    key={i}
                                                    className="net-slot-fill flex-1 h-7 rounded-md flex items-center justify-center text-[9px] font-mono font-bold"
                                                    style={{
                                                        backgroundColor: `${PACKET_COLORS[i]}22`,
                                                        color: PACKET_COLORS[i],
                                                        border: `1px solid ${PACKET_COLORS[i]}66`,
                                                        animationDelay: `${0.25 + i * 0.35}s`,
                                                    }}
                                                >
                                                    P{i + 1}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="net-slot-fill h-1.5 w-full rounded-full bg-green-400/80" style={{ animationDelay: '1.35s' }} />
                                        <p className="net-slot-fill flex items-center gap-1.5 text-[10px] font-semibold text-green-400" style={{ animationDelay: '1.65s' }}>
                                            <CheckCircleIcon /> File utuh — balasan dikirim!
                                        </p>
                                    </div>
                                ) : (
                                    <p className="mt-1 text-[9px] font-mono text-[#4a5568]">
                                        {step === 4 ? 'menunggu semua paket…' : 'google.com / instagram.com'}
                                    </p>
                                )}
                            </EntityNode>

                            {/* Baris 2 — jalur vertikal ke DNS (di bawah ISP) */}
                            <div />
                            <div />
                            <VSegment dots={getSegDots(step, 'isp-dns')} />
                            <div />
                            <div />
                            <div />
                            <div />

                            {/* Baris 3 — kartu DNS SERVER */}
                            <div />
                            <div />
                            <EntityNode icon={<BookOpenIcon />} label="DNS SERVER" sub={subOf('dns')} active={isNodeActive('dns')}>
                                {step === 2 ? (
                                    <div className="space-y-1.5 mt-1">
                                        <p className="font-mono text-[10px] text-amber-300">&quot;Di mana google.com?&quot;</p>
                                        <div className="net-slot-fill h-px w-full bg-white/15" style={{ animationDelay: '1.05s' }} />
                                        <p className="net-slot-fill font-mono text-[11px] font-bold text-green-400" style={{ animationDelay: '1.45s' }}>
                                            → 172.217.0.46 ✓
                                        </p>
                                    </div>
                                ) : step > 2 ? (
                                    <p className="mt-1 font-mono text-[10px] text-green-400/80">google.com → 172.217.0.46 ✓</p>
                                ) : (
                                    <p className="mt-1 font-mono text-[10px] text-[#4a5568]">buku telepon internet…</p>
                                )}
                            </EntityNode>
                            <div />
                            <div />
                            <div />
                            <div />
                        </div>
                    </div>

                    {/* ===== Panel kontrol langkah ===== */}
                    <div className="flex flex-wrap items-center gap-2.5 mt-5 pt-4 border-t border-white/10">
                        <button
                            onClick={prevStep}
                            disabled={step === 1}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0d1525] border border-white/10 text-xs font-semibold text-[#94a3b8] hover:text-white hover:border-[#00d4ff]/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/10"
                        >
                            <ChevronLeftIcon /> Back
                        </button>
                        <button
                            onClick={nextStep}
                            disabled={step === STEPS.length}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00d4ff] text-[#07090f] text-xs font-display font-bold hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Next Step <ChevronRightIcon />
                        </button>
                        <button
                            onClick={() => setPlaying((p) => !p)}
                            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${
                                playing
                                    ? 'bg-[rgba(251,191,36,0.12)] border-amber-400/40 text-amber-300'
                                    : 'bg-[#0d1525] border-white/10 text-[#94a3b8] hover:text-white hover:border-[#00d4ff]/40'
                            }`}
                        >
                            {playing ? <PauseIcon /> : <PlayIcon />} {playing ? 'Jeda' : 'Putar Otomatis'}
                        </button>
                        <button
                            onClick={resetSim}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0d1525] border border-white/10 text-xs font-semibold text-[#94a3b8] hover:text-white hover:border-[#00d4ff]/40 transition-colors"
                        >
                            <RotateCcwIcon /> Ulangi
                        </button>
                        <span className="ml-auto hidden sm:block text-[10px] font-mono text-[#4a5568]">
                            💡 di layar kecil, geser peta ke samping
                        </span>
                    </div>
                </div>

                {/* ===== Kolom kanan: penjelasan langkah ===== */}
                <div className="space-y-4 lg:sticky lg:top-6">
                    <div className="bg-[#0d1525]/50 border border-[rgba(0,212,255,0.1)] rounded-2xl p-5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[rgba(0,212,255,0.12)] text-[10px] font-mono text-[#00d4ff]">
                            {current.phase}
                        </span>
                        <h3 className="font-display text-lg font-bold text-white mt-3">
                            {step}. {current.title}
                        </h3>
                        <p className="text-sm text-[#b0c4de] leading-relaxed mt-2">{current.body}</p>

                        {/* Kotak analogi */}
                        <div className="mt-4 rounded-lg bg-[#07090f] border border-[rgba(251,191,36,0.25)] p-3">
                            <p className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wide mb-1">
                                <LightbulbIcon /> Analogi
                            </p>
                            <p className="text-xs text-slate-300 leading-relaxed">{current.analogy}</p>
                        </div>

                        {/* Legenda warna paket */}
                        {(step === 3 || step === 4) && (
                            <div className="mt-4">
                                <p className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                                    <BoxIcon /> Paket yang dihasilkan
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {PACKET_COLORS.map((c, i) => (
                                        <span
                                            key={i}
                                            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono"
                                            style={{ backgroundColor: `${c}18`, color: c, border: `1px solid ${c}44` }}
                                        >
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} /> Paket {i + 1}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Daftar langkah — klik untuk lompat */}
                    <div className="bg-[#0d1525]/50 border border-[rgba(0,212,255,0.1)] rounded-2xl p-3">
                        <p className="text-[10px] font-mono text-[#4a5568] px-2 pt-1 pb-2 uppercase tracking-wide">Daftar langkah</p>
                        {STEPS.map((s, i) => {
                            const n = i + 1;
                            const done = n < step;
                            const act = n === step;
                            return (
                                <button
                                    key={s.title}
                                    onClick={() => { setPlaying(false); setStep(n); }}
                                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-colors ${
                                        act ? 'bg-[rgba(0,212,255,0.1)]' : 'hover:bg-white/5'
                                    }`}
                                >
                                    <span
                                        className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center font-mono text-[10px] border transition-colors ${
                                            act
                                                ? 'bg-[#00d4ff] text-[#07090f] border-transparent font-bold'
                                                : done
                                                    ? 'border-[#00d4ff]/50 text-[#00d4ff]'
                                                    : 'border-white/15 text-slate-500'
                                        }`}
                                    >
                                        {done ? '✓' : n}
                                    </span>
                                    <span className={`text-xs ${act ? 'text-white font-semibold' : done ? 'text-[#b0c4de]' : 'text-slate-500'}`}>
                                        {s.title}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
