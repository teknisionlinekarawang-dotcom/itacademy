import { useState, useEffect, useRef, useCallback, type FC, type ReactNode } from 'react';

/* =====================================================================
   TooltipSimulator
   ---------------------------------------------------------------------
   Simulasi edukasi interaktif untuk memahami perilaku "Tooltip" /
   "Hover Information".

   Cara pakai:
       import TooltipSimulator from './simulator/TooltipSimulator';
       <TooltipSimulator />

   Komponen ini mandiri (single-file):
   - Hanya menggunakan hook standar React (useState, useEffect,
     useRef, useCallback).
   - Seluruh styling memakai Tailwind CSS utility classes.
   - Ikon memakai SVG inline bergaya Lucide (tanpa dependency tambahan).

   Fitur simulasi:
   1. Area teks dengan kata kunci tersorot (React JS, DOM, State,
      Component) yang memunculkan tooltip beranimasi.
   2. Control panel real-time: Posisi, Tema, Animasi, dan Trigger.
   3. Live console yang mencatat setiap event yang terjadi.
   ===================================================================== */

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
type TooltipTheme = 'dark' | 'light' | 'accent';
type TooltipAnimation = 'fade' | 'scale' | 'slide';
type TooltipTrigger = 'hover' | 'click';

interface KeywordDef {
    term: string;
    category: string;
    description: string;
    href: string;
    Icon: FC;
}

interface LogEntry {
    time: string;
    text: string;
    tone: 'info' | 'success' | 'warn' | 'dim';
}

interface Token {
    id: string;
    term: string;
}

/* ---- Label untuk UI & pesan console ---------------------------------- */
const POSITION_LABELS: Record<TooltipPosition, string> = {
    top: 'Top',
    bottom: 'Bottom',
    left: 'Left',
    right: 'Right',
};

const THEME_LABELS: Record<TooltipTheme, string> = {
    dark: 'Dark',
    light: 'Light',
    accent: 'Accent',
};

const ANIMATION_LABELS: Record<TooltipAnimation, string> = {
    fade: 'Fade In',
    scale: 'Scale Up',
    slide: 'Slide Up',
};

/* ---- Ikon SVG inline (gaya Lucide, stroke = currentColor) ------------ */
const InfoIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8h.01" />
        <path d="M11 12h1v4h1" />
    </svg>
);

const AtomIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
        <ellipse cx="12" cy="12" rx="9.5" ry="4.2" />
        <ellipse cx="12" cy="12" rx="9.5" ry="4.2" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9.5" ry="4.2" transform="rotate(120 12 12)" />
    </svg>
);

const DomIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="4" width="18" height="16" rx="2.5" />
        <path d="M3 9h18" />
        <path d="M7 6.5h.01" />
        <path d="M10 6.5h.01" />
    </svg>
);

const StateIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5">
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
        <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
    </svg>
);

const LayersIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 2 21 7l-9 5-9-5 9-5z" />
        <path d="M3 12l9 5 9-5" />
        <path d="M3 17l9 5 9-5" />
    </svg>
);

const SlidersIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5">
        <path d="M8 6h12M16 12h4M12 18h8" />
        <circle cx="6" cy="6" r="2" fill="currentColor" stroke="none" />
        <circle cx="14" cy="12" r="2" fill="currentColor" stroke="none" />
        <circle cx="10" cy="18" r="2" fill="currentColor" stroke="none" />
    </svg>
);

const TerminalIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="m5 8 4 4-4 4" />
        <path d="M12 16h6" />
    </svg>
);

const ExternalLinkIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M7 17 17 7" />
        <path d="M9 7h8v8" />
    </svg>
);

const ResetIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5" />
    </svg>
);

const MousePointerIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="m3 3 7.5 18 2.1-6.6 6.4-2.1L3 3z" />
        <path d="m14 14 4 4" />
    </svg>
);

const ChevronDownIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="m6 9 6 6 6-6" />
    </svg>
);

/* ---- Data kata kunci yang disorot di paragraf ------------------------- */
const KEYWORDS: KeywordDef[] = [
    {
        term: 'React JS',
        category: 'Library UI',
        description:
            'Pustaka JavaScript untuk membangun antarmuka pengguna (UI) yang cepat, deklaratif, dan berbasis komponen.',
        href: 'https://react.dev',
        Icon: AtomIcon,
    },
    {
        term: 'DOM',
        category: 'Document Object Model',
        description:
            'Representasi pohon elemen HTML yang dimanipulasi React — jembatan antara kode React dan tampilan di browser.',
        href: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model',
        Icon: DomIcon,
    },
    {
        term: 'State',
        category: 'Manajemen Data',
        description:
            'Data internal sebuah komponen. Ketika State berubah, React otomatis me-render ulang bagian UI yang bergantung padanya.',
        href: 'https://react.dev/learn/state-a-components-memory',
        Icon: StateIcon,
    },
    {
        term: 'Component',
        category: 'Unit UI',
        description:
            'Blok kode UI yang dapat dipakai ulang: menggabungkan markup, logika, dan state dalam satu fungsi JavaScript.',
        href: 'https://react.dev/learn/your-first-component',
        Icon: LayersIcon,
    },
];

const KEYWORD_MAP: Record<string, KeywordDef> = Object.fromEntries(
    KEYWORDS.map((k) => [k.term, k] as const)
);

/* ---- Setiap kemunculan kata kunci dalam paragraf ---------------------- */
const TOKENS: Record<string, Token> = {
    'r-1': { id: 'r-1', term: 'React JS' },
    'r-2': { id: 'r-2', term: 'React JS' },
    'd-1': { id: 'd-1', term: 'DOM' },
    'd-2': { id: 'd-2', term: 'DOM' },
    'c-1': { id: 'c-1', term: 'Component' },
    'c-2': { id: 'c-2', term: 'Component' },
    's-1': { id: 's-1', term: 'State' },
    's-2': { id: 's-2', term: 'State' },
};

/* ---- Transform posisi & animasi tooltip (fixed positioning) ----------- */
const BASE_TRANSLATE: Record<TooltipPosition, string> = {
    top: 'translate(-50%, calc(-100% - 0.75rem))',
    bottom: 'translate(-50%, 0.75rem)',
    left: 'translate(calc(-100% - 0.75rem), -50%)',
    right: 'translate(0.75rem, -50%)',
};

/**
 * Menghitung nilai CSS `transform` untuk tooltip.
 * Saat tersembunyi, ditambahkan offset sesuai animasi yang dipilih agar
 * tooltip "datang" dari arah tertentu lalu bertransisi ke posisi akhir.
 */
function buildTooltipTransform(
    position: TooltipPosition,
    animation: TooltipAnimation,
    visible: boolean
): string {
    const base = BASE_TRANSLATE[position];
    if (visible || animation === 'fade') return base;
    if (animation === 'scale') return `${base} scale(0.9)`;
    // slide: datang dari arah posisi tooltip
    if (position === 'top') return `${base} translateY(12px)`;
    if (position === 'bottom') return `${base} translateY(-12px)`;
    if (position === 'left') return `${base} translateX(12px)`;
    return `${base} translateX(-12px)`;
}

/* ---- Peta tema warna tooltip ------------------------------------------ */
const CARD_THEME: Record<TooltipTheme, string> = {
    dark: 'bg-[#0b1020]/95 border-[rgba(0,212,255,0.25)] backdrop-blur-sm',
    light: 'bg-white border-slate-200',
    accent: 'bg-gradient-to-br from-[#06b6d4] to-[#155e75] border-white/25',
};

const TITLE_THEME: Record<TooltipTheme, string> = {
    dark: 'text-white',
    light: 'text-slate-900',
    accent: 'text-white',
};

const DESC_THEME: Record<TooltipTheme, string> = {
    dark: 'text-[#b0c4de]',
    light: 'text-slate-500',
    accent: 'text-cyan-50',
};

const BADGE_THEME: Record<TooltipTheme, string> = {
    dark: 'bg-[rgba(0,212,255,0.12)] text-[#00d4ff]',
    light: 'bg-slate-100 text-slate-500',
    accent: 'bg-white/20 text-white',
};

const CHIP_THEME: Record<TooltipTheme, string> = {
    dark: 'bg-[rgba(0,212,255,0.12)] text-[#00d4ff]',
    light: 'bg-blue-50 text-blue-600',
    accent: 'bg-white/20 text-white',
};

const LINK_THEME: Record<TooltipTheme, string> = {
    dark: 'text-[#00d4ff]',
    light: 'text-blue-600',
    accent: 'text-white',
};

const ARROW_THEME: Record<TooltipTheme, string> = {
    dark: 'bg-[#0b1020]',
    light: 'bg-white',
    accent: 'bg-[#0f8ca8]',
};

const ARROW_POSITION: Record<TooltipPosition, string> = {
    top: '-bottom-1.5 left-1/2 -translate-x-1/2',
    bottom: '-top-1.5 left-1/2 -translate-x-1/2',
    left: '-right-1.5 top-1/2 -translate-y-1/2',
    right: '-left-1.5 top-1/2 -translate-y-1/2',
};

/* ---- Warna teks console sesuai jenis event ----------------------------- */
const TONE_COLOR: Record<LogEntry['tone'], string> = {
    info: 'text-[#00d4ff]',
    success: 'text-green-400',
    warn: 'text-amber-400',
    dim: 'text-slate-500',
};

/* =====================================================================
   Komponen utama
   ===================================================================== */
export default function TooltipSimulator() {
    /* ---- State pengaturan tooltip -------------------------------------- */
    const [position, setPosition] = useState<TooltipPosition>('top');
    const [theme, setTheme] = useState<TooltipTheme>('dark');
    const [animation, setAnimation] = useState<TooltipAnimation>('slide');
    const [trigger, setTrigger] = useState<TooltipTrigger>('hover');

    /* ---- State runtime tooltip & console ------------------------------- */
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const [anchor, setAnchor] = useState<{
        left: number;
        top: number;
        width: number;
        height: number;
    } | null>(null);
    const [visible, setVisible] = useState(false);
    const [logs, setLogs] = useState<LogEntry[]>([]);

    /* ---- Refs ------------------------------------------------------------ */
    const tokenRefs = useRef<Record<string, HTMLSpanElement | null>>({});
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const consoleRef = useRef<HTMLDivElement | null>(null);
    const bootedRef = useRef(false);

    /* ---- Helper: tambah baris log ke console ------------------------------ */
    const pushLog = useCallback((text: string, tone: LogEntry['tone']) => {
        const time = new Date().toLocaleTimeString('id-ID', { hour12: false });
        setLogs((prev) => [...prev.slice(-49), { time, text, tone }]);
    }, []);

    const clearLogs = useCallback(() => setLogs([]), []);

    /* ---- Tampilkan tooltip pada token tertentu ----------------------------- */
    const showTooltip = useCallback((token: Token) => {
        const el = tokenRefs.current[token.id];
        if (!el) return;
        const r = el.getBoundingClientRect();
        setAnchor({ left: r.left, top: r.top, width: r.width, height: r.height });
        setActiveKey(token.id);
        // Render dulu dalam kondisi tersembunyi, lalu tampilkan di frame
        // berikutnya agar transisi/animasi masuk tetap terpicu.
        setVisible(false);
        requestAnimationFrame(() => setVisible(true));
    }, []);

    /* ---- Sembunyikan tooltip ------------------------------------------------ */
    const hideTooltip = useCallback(() => {
        setActiveKey(null);
        setAnchor(null);
        setVisible(false);
    }, []);

    /* ---- Event handler pada kata kunci ------------------------------------- */
    const handleMouseEnter = useCallback(
        (token: Token) => {
            if (trigger === 'hover') {
                showTooltip(token);
                pushLog(
                    `Event: hovered on "${token.term}" | Position: ${POSITION_LABELS[position]} | Theme: ${THEME_LABELS[theme]} | Animation: ${ANIMATION_LABELS[animation]}`,
                    'success'
                );
            } else {
                pushLog(
                    `Event: hovered on "${token.term}" (Trigger = Click — tooltip tidak muncul saat hover)`,
                    'dim'
                );
            }
        },
        [trigger, position, theme, animation, showTooltip, pushLog]
    );

    const handleMouseLeave = useCallback(
        (token: Token) => {
            if (trigger !== 'hover' || activeKey !== token.id) return;
            hideTooltip();
            pushLog(`Event: mouse left "${token.term}" → tooltip disembunyikan`, 'warn');
        },
        [trigger, activeKey, hideTooltip, pushLog]
    );

    const handleTokenClick = useCallback(
        (token: Token) => {
            const opening = activeKey !== token.id;
            if (opening) {
                showTooltip(token);
                pushLog(`Event: clicked on "${token.term}" → tooltip ditampilkan`, 'success');
            } else {
                hideTooltip();
                pushLog(`Event: clicked on "${token.term}" → tooltip disembunyikan`, 'warn');
            }
        },
        [activeKey, showTooltip, hideTooltip, pushLog]
    );

    /* ---- Update pengaturan + catat ke console ------------------------------- */
    const updatePosition = useCallback(
        (v: TooltipPosition) => {
            setPosition(v);
            pushLog(`Settings: Position → ${POSITION_LABELS[v]}`, 'info');
        },
        [pushLog]
    );

    const updateTheme = useCallback(
        (v: TooltipTheme) => {
            setTheme(v);
            pushLog(`Settings: Theme → ${THEME_LABELS[v]}`, 'info');
        },
        [pushLog]
    );

    const updateAnimation = useCallback(
        (v: TooltipAnimation) => {
            setAnimation(v);
            pushLog(`Settings: Animation → ${ANIMATION_LABELS[v]}`, 'info');
        },
        [pushLog]
    );

    const updateTrigger = useCallback(
        (v: TooltipTrigger) => {
            setTrigger(v);
            hideTooltip(); // tutup tooltip yang mungkin sedang terbuka
            pushLog(`Settings: Trigger → ${v === 'hover' ? 'Hover' : 'Click'}`, 'info');
        },
        [hideTooltip, pushLog]
    );

    const resetSettings = useCallback(() => {
        setPosition('top');
        setTheme('dark');
        setAnimation('slide');
        setTrigger('hover');
        hideTooltip();
        pushLog('Settings: reset ke default (Top / Dark / Slide Up / Hover)', 'warn');
    }, [hideTooltip, pushLog]);

    /* ---- Klik di luar & tombol Escape menutup tooltip ------------------------ */
    useEffect(() => {
        if (trigger !== 'click') return;

        const onMouseDown = (e: MouseEvent) => {
            if (!activeKey) return;
            const target = e.target as HTMLElement | null;
            if (!target) return;
            // Klik pada kata kunci ditangani onClick (toggle), jadi dilewati.
            if (target.closest('[data-tooltip-keyword]')) return;
            if (!tooltipRef.current || !tooltipRef.current.contains(target)) {
                hideTooltip();
                pushLog('Event: klik di luar tooltip → tooltip disembunyikan', 'warn');
            }
        };

        document.addEventListener('mousedown', onMouseDown);
        return () => document.removeEventListener('mousedown', onMouseDown);
    }, [trigger, activeKey, hideTooltip, pushLog]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && activeKey) {
                hideTooltip();
                pushLog('Event: Escape → tooltip disembunyikan', 'warn');
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [activeKey, hideTooltip, pushLog]);

    /* ---- Auto-scroll console ke baris log terbaru ----------------------------- */
    useEffect(() => {
        const el = consoleRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [logs]);

    /* ---- Pesan pembuka console (sekali saja saat mount) ------------------------- */
    useEffect(() => {
        if (bootedRef.current) return;
        bootedRef.current = true;
        pushLog(
            'Console siap — arahkan kursor ke kata yang disorot, atau klik jika Trigger = Click.',
            'dim'
        );
    }, [pushLog]);

    /* ---- Token yang sedang aktif & datanya --------------------------------------- */
    const activeToken: Token | null = activeKey ? TOKENS[activeKey] : null;
    const activeDef = activeToken ? KEYWORD_MAP[activeToken.term] : null;

    /* ---- Span kata kunci interaktif di dalam paragraf ------------------------------ */
    const KeywordToken = ({ token, children }: { token: Token; children: ReactNode }) => {
        const isActive = activeKey === token.id;
        return (
            <span
                data-tooltip-keyword
                ref={(el) => { tokenRefs.current[token.id] = el; }}
                onMouseEnter={() => handleMouseEnter(token)}
                onMouseLeave={(e) => {
                    // Jangan sembunyikan jika kursor berpindah ke dalam tooltip.
                    const rel = e.relatedTarget as Node | null;
                    if (tooltipRef.current && rel && tooltipRef.current.contains(rel)) return;
                    handleMouseLeave(token);
                }}
                onClick={() => handleTokenClick(token)}
                className={`relative inline-block cursor-help rounded-md px-1 py-0.5 font-semibold transition-all duration-200 ${
                    isActive
                        ? 'bg-[rgba(0,212,255,0.14)] text-white ring-2 ring-[rgba(0,212,255,0.5)]'
                        : 'text-[#00d4ff] border-b-2 border-[rgba(0,212,255,0.35)] hover:bg-[rgba(0,212,255,0.08)]'
                }`}
            >
                {children}
            </span>
        );
    };

    return (
        <div className="w-full rounded-2xl bg-[#07090f] border border-[rgba(0,212,255,0.12)] p-5 md:p-8">
            {/* ===== Header Simulator ===== */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
                <div className="w-11 h-11 rounded-xl bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)] flex items-center justify-center text-[#00d4ff]">
                    <InfoIcon />
                </div>
                <div className="min-w-0">
                    <h2 className="font-display text-xl md:text-2xl font-bold text-white">
                        Simulator Tooltip &amp; Hover Information
                    </h2>
                    <p className="text-xs text-[#64748b] mt-1">
                        Simulasi edukasi untuk memahami perilaku tooltip secara real-time.
                    </p>
                </div>
                <span className="ml-auto hidden sm:inline-flex items-center px-3 py-1.5 rounded-full bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.15)] text-[10px] font-mono text-[#00d4ff]">
                    React Hooks + Tailwind CSS
                </span>
            </div>

            <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
                {/* ===== Kolom kiri: area teks + visualizer ===== */}
                <div className="space-y-6 min-w-0">
                    {/* Area Teks Interaktif */}
                    <div className="bg-[#0d1525]/50 border border-[rgba(0,212,255,0.1)] rounded-2xl p-5 md:p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl">💡</span>
                            <h3 className="font-display font-bold text-white">Area Teks Interaktif</h3>
                            <span className="ml-auto hidden md:inline text-[10px] font-mono text-[#4a5568]">
                                hover / click kata tersorot
                            </span>
                        </div>

                        <p className="text-sm md:text-[15px] leading-8 text-slate-300">
                            <KeywordToken token={TOKENS['r-1']}>React JS</KeywordToken> adalah pustaka
                            JavaScript populer yang bekerja melalui{' '}
                            <KeywordToken token={TOKENS['d-1']}>DOM</KeywordToken> untuk menggambar
                            antarmuka. Setiap bagian antarmuka kita bungkus di dalam{' '}
                            <KeywordToken token={TOKENS['c-1']}>Component</KeywordToken> yang menyimpan{' '}
                            <KeywordToken token={TOKENS['s-1']}>State</KeywordToken> miliknya sendiri.
                            Saat <KeywordToken token={TOKENS['s-2']}>State</KeywordToken> berubah,{' '}
                            <KeywordToken token={TOKENS['r-2']}>React JS</KeywordToken> memperbarui{' '}
                            <KeywordToken token={TOKENS['d-2']}>DOM</KeywordToken> secara efisien —
                            tanpa perlu memuat ulang halaman. Itulah mengapa{' '}
                            <KeywordToken token={TOKENS['c-2']}>Component</KeywordToken> menjadi fondasi
                            utama pengembangan aplikasi web modern.
                        </p>
                        {/* Status setting yang sedang aktif */}
                        <div className="mt-5 flex flex-wrap gap-2">
                            <span className="inline-flex items-center rounded-full bg-[#07090f] border border-[rgba(255,255,255,0.08)] px-3 py-1 text-[11px] font-mono text-[#94a3b8]">
                                Position: <span className="text-[#00d4ff] ml-1">{POSITION_LABELS[position]}</span>
                            </span>
                            <span className="inline-flex items-center rounded-full bg-[#07090f] border border-[rgba(255,255,255,0.08)] px-3 py-1 text-[11px] font-mono text-[#94a3b8]">
                                Theme: <span className="text-[#00d4ff] ml-1">{THEME_LABELS[theme]}</span>
                            </span>
                            <span className="inline-flex items-center rounded-full bg-[#07090f] border border-[rgba(255,255,255,0.08)] px-3 py-1 text-[11px] font-mono text-[#94a3b8]">
                                Animation: <span className="text-[#00d4ff] ml-1">{ANIMATION_LABELS[animation]}</span>
                            </span>
                            <span className="inline-flex items-center rounded-full bg-[#07090f] border border-[rgba(255,255,255,0.08)] px-3 py-1 text-[11px] font-mono text-[#94a3b8]">
                                Trigger: <span className="text-[#00d4ff] ml-1">{trigger === 'hover' ? 'Hover' : 'Click'}</span>
                            </span>
                        </div>

                        <p className="mt-3 text-xs text-[#4a5568]">
                            Petunjuk: kata berwarna cyan adalah kata kunci interaktif. Ubah pengaturan di
                            Control Panel untuk melihat perubahan perilaku tooltip secara langsung.
                        </p>
                    </div>

                    {/* How It Works — Visualizer */}
                    <div className="bg-[#0d1525]/50 border border-[rgba(0,212,255,0.1)] rounded-2xl overflow-hidden">
                        <div className="flex items-start gap-3 px-5 pt-5">
                            <span className="text-2xl">🛠️</span>
                            <div>
                                <h3 className="font-display font-bold text-white">How It Works — Visualizer</h3>
                                <p className="text-xs text-[#64748b] mt-0.5">
                                    Setiap event dan perubahan pengaturan dicetak langsung ke console di bawah.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 px-5 py-2.5 mt-4 border-y border-[rgba(0,212,255,0.08)] bg-[#04070d]/60">
                            <span className="text-[#00d4ff]">
                                <TerminalIcon />
                            </span>
                            <h4 className="font-mono text-xs text-[#94a3b8]">live-console.tsx</h4>
                            <button
                                onClick={clearLogs}
                                className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#07090f] border border-[rgba(255,255,255,0.08)] text-[10px] font-mono text-[#94a3b8] hover:text-white hover:border-[#00d4ff]/40 transition-colors"
                            >
                                <ResetIcon /> clear
                            </button>
                        </div>

                        <div ref={consoleRef} className="h-56 overflow-y-auto bg-[#04070d]/70 p-4 font-mono text-[11px] space-y-1.5">
                            {logs.length === 0 ? (
                                <p className="text-[#4a5568]">// Belum ada event — coba hover kata yang disorot di atas.</p>
                            ) : (
                                logs.map((entry, i) => (
                                    <div key={`${entry.time}-${i}`} className="flex gap-2 leading-relaxed">
                                        <span className="text-[#4a5568] shrink-0">[{entry.time}]</span>
                                        <span className={TONE_COLOR[entry.tone]}>{entry.text}</span>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="px-5 py-2.5 text-[10px] font-mono text-[#4a5568] border-t border-[rgba(0,212,255,0.08)]">
                            {logs.length} event tercatat • auto-scroll aktif
                        </div>
                    </div>
                </div>

                {/* ===== Kolom kanan: Control Panel ===== */}
                <div className="bg-[#0d1525]/50 border border-[rgba(0,212,255,0.1)] rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-[rgba(0,212,255,0.1)] flex items-center justify-center text-[#00d4ff]">
                            <SlidersIcon />
                        </div>
                        <h3 className="font-display font-bold text-white">Control Panel</h3>
                        <span className="ml-auto text-[10px] font-mono text-[#4a5568]">live</span>
                    </div>

                    {/* 1. Posisi */}
                    <div className="mb-5">
                        <label htmlFor="tooltip-position" className="block text-xs font-semibold text-[#94a3b8] mb-2">
                            Posisi Tooltip
                        </label>
                        <div className="relative">
                            <select
                                id="tooltip-position"
                                value={position}
                                onChange={(e) => updatePosition(e.target.value as TooltipPosition)}
                                className="w-full appearance-none bg-[#07090f] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2.5 pr-9 text-sm text-white focus:outline-none focus:border-[#00d4ff]/60 transition-colors cursor-pointer"
                            >
                                <option value="top">Atas (Top)</option>
                                <option value="bottom">Bawah (Bottom)</option>
                                <option value="left">Kiri (Left)</option>
                                <option value="right">Kanan (Right)</option>
                            </select>
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a5568] pointer-events-none">
                                <ChevronDownIcon />
                            </span>
                        </div>
                    </div>

                    {/* 2. Tema */}
                    <div className="mb-5">
                        <label className="block text-xs font-semibold text-[#94a3b8] mb-2">Tema Tooltip</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['dark', 'light', 'accent'] as TooltipTheme[]).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => updateTheme(t)}
                                    className={`px-2 py-2 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                                        theme === t
                                            ? 'bg-[#00d4ff] text-[#07090f] border-transparent shadow-[0_0_16px_rgba(0,212,255,0.35)]'
                                            : 'bg-[#07090f] text-[#94a3b8] border-[rgba(255,255,255,0.08)] hover:border-[#00d4ff]/40 hover:text-white'
                                    }`}
                                >
                                    {THEME_LABELS[t]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 3. Animasi */}
                    <div className="mb-5">
                        <label htmlFor="tooltip-animation" className="block text-xs font-semibold text-[#94a3b8] mb-2">
                            Animasi Masuk
                        </label>
                        <div className="relative">
                            <select
                                id="tooltip-animation"
                                value={animation}
                                onChange={(e) => updateAnimation(e.target.value as TooltipAnimation)}
                                className="w-full appearance-none bg-[#07090f] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2.5 pr-9 text-sm text-white focus:outline-none focus:border-[#00d4ff]/60 transition-colors cursor-pointer"
                            >
                                <option value="fade">Fade In</option>
                                <option value="scale">Scale Up</option>
                                <option value="slide">Slide Up</option>
                            </select>
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a5568] pointer-events-none">
                                <ChevronDownIcon />
                            </span>
                        </div>
                    </div>

                    {/* 4. Trigger */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-[#94a3b8] mb-2">
                            <span className="text-[#00d4ff]">
                                <MousePointerIcon />
                            </span>
                            Trigger
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {(['hover', 'click'] as TooltipTrigger[]).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => updateTrigger(t)}
                                    className={`px-2 py-2 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                                        trigger === t
                                            ? 'bg-[#00d4ff] text-[#07090f] border-transparent shadow-[0_0_16px_rgba(0,212,255,0.35)]'
                                            : 'bg-[#07090f] text-[#94a3b8] border-[rgba(255,255,255,0.08)] hover:border-[#00d4ff]/40 hover:text-white'
                                    }`}
                                >
                                    {t === 'hover' ? 'Hover' : 'Click'}
                                </button>
                            ))}
                        </div>
                        <p className="mt-2 text-[10px] text-[#4a5568] leading-relaxed">
                            Mode Click: klik kata untuk membuka/menutup tooltip, klik di luar atau tekan
                            Escape untuk menutup.
                        </p>
                    </div>

                    {/* Reset */}
                    <button
                        onClick={resetSettings}
                        className="w-full mt-5 inline-flex justify-center items-center gap-2 px-3 py-2.5 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.08)] text-xs font-semibold text-[#94a3b8] hover:text-white hover:border-[#00d4ff]/40 transition-colors"
                    >
                        <ResetIcon /> Reset ke Default
                    </button>
                </div>
            </div>

                {/* ===== Tooltip (fixed positioning berbasis viewport) ===== */}
                {activeDef && anchor && activeToken && (
                    <div
                        ref={tooltipRef}
                        data-tooltip
                        className="fixed z-[70] w-72 max-w-[calc(100vw-2rem)]"
                        style={{
                            left: anchor.left + anchor.width / 2,
                            top: anchor.top,
                            opacity: visible ? 1 : 0,
                            transform: buildTooltipTransform(position, animation, visible),
                            transition: 'opacity 160ms ease, transform 260ms cubic-bezier(0.16, 1, 0.3, 1)',
                            pointerEvents: visible ? 'auto' : 'none',
                        }}
                        onMouseLeave={() => {
                            if (trigger !== 'hover') return;
                            hideTooltip();
                            pushLog(`Event: mouse left tooltip "${activeToken.term}" → disembunyikan`, 'warn');
                        }}
                    >
                        {/* Kartu isi tooltip */}
                        <div className={`relative rounded-xl border p-3.5 shadow-2xl ${CARD_THEME[theme]}`}>
                            <div className="flex items-start gap-3">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${CHIP_THEME[theme]}`}>
                                    <activeDef.Icon />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className={`font-display text-sm font-bold ${TITLE_THEME[theme]}`}>
                                            {activeDef.term}
                                        </h4>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono whitespace-nowrap ${BADGE_THEME[theme]}`}>
                                            {activeDef.category}
                                        </span>
                                    </div>
                                    <p className={`text-xs leading-relaxed ${DESC_THEME[theme]}`}>{activeDef.description}</p>
                                    <a
                                        href={activeDef.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={`mt-2.5 inline-flex items-center gap-1 text-xs font-semibold hover:underline underline-offset-2 ${LINK_THEME[theme]}`}
                                    >
                                        Learn More <ExternalLinkIcon />
                                    </a>
                                </div>
                            </div>

                            {/* Panah penunjuk ke kata kunci */}
                            <span className={`absolute w-3 h-3 rotate-45 shadow-sm ${ARROW_THEME[theme]} ${ARROW_POSITION[position]}`} />
                        </div>
                    </div>
                )}
        </div>
    );
}
