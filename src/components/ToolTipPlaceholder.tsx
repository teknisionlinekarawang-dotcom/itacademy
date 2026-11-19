import { useState, useEffect, useRef, useCallback, type FC, type ReactNode } from 'react';
import { useImageModal } from '../context/ImageModalContext';

/* =====================================================================
   ToolTipPlaceholder
   ---------------------------------------------------------------------
   Komponen pasangan dari ImagePlaceholder / VideoPlaceholder:
   menandai teks/kata yang butuh penjelasan tambahan. Tooltip muncul
   saat teks di-HOVER atau di-KLIK, dan bisa memuat:
   - Judul + deskripsi (mendukung rich content / ReactNode)
   - Satu atau beberapa GAMBAR (klik gambar → dibuka di ImageViewerModal)

   Contoh pakai:
       <ToolTipPlaceholder
           title="DNS (Domain Name System)"
           description="Buku telepon internet: mengubah nama domain menjadi IP."
           imageSrc="/media/dns.jpg"
           imageCaption="Ilustrasi cara kerja DNS"
           trigger="hover"
           placement="top"
       >
           DNS Server
       </ToolTipPlaceholder>
   ===================================================================== */

type Placement = 'top' | 'bottom' | 'left' | 'right';
type TooltipDisplayMode = 'dark' | 'light';

interface ToolTipPlaceholderProps {
    /** Teks pemicu yang disorot. Opsional — jika dikosongkan, pemicu menjadi
     *  tombol lingkaran "?" kecil yang bisa dipasang berdiri sendiri di kartu. */
    children?: ReactNode;
    /** Judul tooltip */
    title: string;
    /** Penjelasan tambahan (boleh ReactNode: list, bold, dll.) */
    description?: ReactNode;
    /** Gambar opsional di dalam tooltip (satu atau galeri) */
    imageSrc?: string | string[];
    /** Alt text untuk gambar */
    imageAlt?: string;
    /** Caption kecil di bawah gambar */
    imageCaption?: string;
    /** Cara memunculkan tooltip: hover (default) atau click */
    trigger?: 'hover' | 'click';
    /** Posisi preferensi; otomatis dibalik jika ruang tidak cukup */
    placement?: Placement;
    /** Kelas tambahan untuk teks pemicu */
    className?: string;
    /** Mode tampilan kartu tooltip: dark (default) atau light */
    theme?: TooltipDisplayMode;
}

/* ---- Lebar tooltip (px) — dipakai untuk clamp posisi di viewport ------- */
const TOOLTIP_WIDTH = 300;

/* ---- Transform dasar agar kartu menempel tepat di sekitar pemicu ------- */
const BASE_TRANSLATE: Record<Placement, string> = {
    top: 'translate(-50%, calc(-100% - 10px))',
    bottom: 'translate(-50%, 10px)',
    left: 'translate(calc(-100% - 10px), -50%)',
    right: 'translate(10px, -50%)',
};

/** Offset kecil saat tersembunyi → memberi kesan masuk dari arah posisinya */
const HIDDEN_OFFSET: Record<Placement, string> = {
    top: ' translateY(6px)',
    bottom: ' translateY(-6px)',
    left: ' translateX(6px)',
    right: ' translateX(-6px)',
};

/* ---- Peta tema tampilan kartu tooltip ------------------------------------- */
interface DisplayTheme {
    card: string;
    title: string;
    desc: string;
    accentBar: string;
    iconColor: string;
    arrow: string;
    imgBorder: string;
    imgHoverBorder: string;
    imgBox: string;
    caption: string;
}

const DISPLAY_MODES: Record<TooltipDisplayMode, DisplayTheme> = {
    dark: {
        card: 'bg-[#0b1020]/97 border-[rgba(0,212,255,0.25)] backdrop-blur-sm shadow-2xl',
        title: 'text-white',
        desc: 'text-[#b0c4de]',
        accentBar: 'from-[#00d4ff]',
        iconColor: 'text-[#00d4ff]',
        arrow: 'bg-[#0b1020] border-[rgba(0,212,255,0.25)]',
        imgBorder: 'border-white/10',
        imgHoverBorder: 'group-hover/img:border-[#00d4ff]/40',
        imgBox: '#0a0f1c',
        caption: 'text-[#64748b]',
    },
    light: {
        card: 'bg-white border-slate-200 shadow-[0_20px_50px_rgba(2,6,23,0.25)]',
        title: 'text-slate-900',
        desc: 'text-slate-600',
        accentBar: 'from-blue-500',
        iconColor: 'text-blue-500',
        arrow: 'bg-white border-slate-200',
        imgBorder: 'border-slate-200',
        imgHoverBorder: 'group-hover/img:border-blue-400/70',
        imgBox: '#f8fafc',
        caption: 'text-slate-400',
    },
};

/**
 * Menyesuaikan posisi preferensi dengan ruang viewport yang tersedia,
 * sehingga tooltip tidak pernah keluar layar / terpotong.
 */
function resolvePlacement(pref: Placement, r: DOMRect): Placement {
    const needVertical = 250;
    const needHorizontal = TOOLTIP_WIDTH + 40;
    const spaceAbove = r.top;
    const spaceBelow = window.innerHeight - r.bottom;
    const spaceLeft = r.left;
    const spaceRight = window.innerWidth - r.right;

    if (pref === 'top') return spaceAbove < needVertical && spaceBelow > spaceAbove ? 'bottom' : 'top';
    if (pref === 'bottom') return spaceBelow < needVertical && spaceAbove > spaceBelow ? 'top' : 'bottom';
    if (pref === 'left') return spaceLeft < needHorizontal && spaceRight > spaceLeft ? 'right' : 'left';
    return spaceRight < needHorizontal && spaceLeft > spaceRight ? 'left' : 'right'; // right
}

/* ---- Ikon kecil di samping judul ---------------------------------------- */
const InfoIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8h.01" />
        <path d="M11 12h1v4h1" />
    </svg>
);

/* ---- Tanda tanya kecil pada teks pemicu ---------------------------------- */
const QMarkIcon: FC = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5">
        <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.4-3 4" />
        <path d="M12 17.5h.01" />
    </svg>
);

/* =====================================================================
   Komponen utama
   ===================================================================== */
export default function ToolTipPlaceholder({
    children,
    title,
    description,
    imageSrc,
    imageAlt,
    imageCaption,
    trigger = 'hover',
    placement = 'top',
    theme = 'dark',
    className,
}: ToolTipPlaceholderProps) {
    const { openModal } = useImageModal();

    const [open, setOpen] = useState(false); // tooltip sedang tampil?
    const [pinned, setPinned] = useState(false); // terkunci karena klik?
    const [visible, setVisible] = useState(false); // flag animasi masuk
    const [anchor, setAnchor] = useState<{
        left: number;
        top: number;
        width: number;
        height: number;
    } | null>(null);
    /** Posisi efektif setelah auto-flip; fallback ke preferensi. */
    const [resolvedPlacement, setResolvedPlacement] = useState<Placement>(placement);

    const triggerRef = useRef<HTMLSpanElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const enterTimer = useRef<number | null>(null);

    /* ---- Normalisasi daftar gambar -------------------------------------- */
    const images = imageSrc ? (Array.isArray(imageSrc) ? imageSrc : [imageSrc]) : [];

    /* ---- Baca ulang posisi pemicu ----------------------------------------- */
    const syncAnchor = useCallback(() => {
        const el = triggerRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        setAnchor({ left: r.left, top: r.top, width: r.width, height: r.height });
        setResolvedPlacement(resolvePlacement(placement, r));
    }, [placement]);

    /* ---- Tampilkan / sembunyikan -------------------------------------------- */
    const showNow = useCallback(() => {
        clearTimeout(enterTimer.current ?? undefined);
        syncAnchor();
        setOpen(true);
        setVisible(false);
        requestAnimationFrame(() => setVisible(true));
    }, [syncAnchor]);

    const hideNow = useCallback(() => {
        clearTimeout(enterTimer.current ?? undefined);
        setOpen(false);
        setPinned(false);
        setVisible(false);
    }, []);

    /* ---- Handler pada teks pemicu --------------------------------------------- */
    const handleEnter = () => {
        if (trigger !== 'hover' || pinned) return;
        // Delay singkat agar tidak flicker saat kursor menyapu banyak kata.
        enterTimer.current = window.setTimeout(showNow, 110);
    };

    const handleLeave = () => {
        if (enterTimer.current) window.clearTimeout(enterTimer.current);
        if (!pinned) setOpen(false);
    };

    const handleClick = () => {
        if (open && pinned) {
            hideNow();
        } else {
            setPinned(true);
            showNow();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    };

    /* ---- Saat terbuka: ikuti scroll/resize + tutup saat klik luar/Escape ------ */
    useEffect(() => {
        if (!open) return;

        const onReflow = () => syncAnchor();
        const onMouseDown = (e: MouseEvent) => {
            const target = e.target as Node | null;
            if (!target) return;
            if (triggerRef.current?.contains(target)) return;
            if (tooltipRef.current?.contains(target)) return;
            hideNow(); // klik di luar selalu menutup (termasuk yang pinned)
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') hideNow();
        };

        window.addEventListener('scroll', onReflow, true);
        window.addEventListener('resize', onReflow);
        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('scroll', onReflow, true);
            window.removeEventListener('resize', onReflow);
            document.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open, syncAnchor, hideNow]);

    useEffect(() => () => {
        if (enterTimer.current) window.clearTimeout(enterTimer.current);
    }, []);

    /* ---- Hitung posisi & transform tooltip ---------------------------------- */
    let tooltipStyle: React.CSSProperties | null = null;
    if (open && anchor) {
        const halfW = TOOLTIP_WIDTH / 2;
        let left: number;
        let top: number;

        if (resolvedPlacement === 'top' || resolvedPlacement === 'bottom') {
            left = anchor.left + anchor.width / 2;
            // Clamp agar kartu tidak keluar batas kiri/kanan viewport
            left = Math.min(Math.max(left, 12 + halfW), window.innerWidth - 12 - halfW);
            top = resolvedPlacement === 'top' ? anchor.top : anchor.top + anchor.height;
        } else {
            left = resolvedPlacement === 'left' ? anchor.left : anchor.left + anchor.width;
            top = Math.min(Math.max(anchor.top + anchor.height / 2, 120), window.innerHeight - 120);
        }

        tooltipStyle = {
            position: 'fixed',
            left,
            top,
            width: TOOLTIP_WIDTH,
            maxWidth: 'calc(100vw - 1.5rem)',
            opacity: visible ? 1 : 0,
            transform: `${BASE_TRANSLATE[resolvedPlacement]}${visible ? '' : HIDDEN_OFFSET[resolvedPlacement] + ' scale(0.96)'}`,
            transition: 'opacity 150ms ease, transform 240ms cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: visible ? 'auto' : 'none',
        };
    }

    /* ---- Kelas panah sesuai posisi efektif ------------------------------------ */
    const ARROW_BORDER: Record<Placement, string> = {
        top: '-bottom-[5px] left-1/2 -translate-x-1/2 border-b border-r',
        bottom: '-top-[5px] left-1/2 -translate-x-1/2 border-t border-l',
        left: '-right-[5px] top-1/2 -translate-y-1/2 border-t border-r',
        right: '-left-[5px] top-1/2 -translate-y-1/2 border-b border-l',
    };

    /** Mode pemicu: teks berlabel (jika children diisi) atau tombol "?" saja */
    const hasLabel = children !== undefined && children !== null;

    /* ---- Tema tampilan kartu ---------------------------------------------------- */
    const t = DISPLAY_MODES[theme];

    return (
        <>
            {/* ===== Teks pemicu ===== */}
            <span
                ref={triggerRef}
                data-tooltip-trigger
                role="button"
                tabIndex={0}
                aria-expanded={open}
                aria-label={title}
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                onClick={(e) => { e.stopPropagation(); handleClick(); }}
                onKeyDown={handleKeyDown}
                className={
                    hasLabel
                        ? `inline cursor-help font-semibold text-[#00d4ff] underline decoration-dashed decoration-[#00d4ff]/50 underline-offset-4 rounded px-0.5 transition-colors duration-200 hover:bg-[rgba(0,212,255,0.08)] focus:outline-none ${
                              open ? 'bg-[rgba(0,212,255,0.12)]' : ''
                          } ${className || ''}`
                        : `inline-flex w-6 h-6 cursor-help items-center justify-center rounded-full bg-[rgba(0,212,255,0.12)] border border-[rgba(0,212,255,0.45)] text-[#00d4ff] align-middle mx-1 transition-all duration-200 hover:bg-[rgba(0,212,255,0.28)] focus:outline-none ${
                              open ? 'bg-[#00d4ff] text-[#07090f]' : ''
                          } ${className || ''}`
                }
            >
                {hasLabel ? (
                    <>
                        {children}
                        <sup className="ml-0.5 inline-flex w-3.5 h-3.5 rounded-full bg-[#00d4ff] text-[#07090f] items-center justify-center align-super">
                            <QMarkIcon />
                        </sup>
                    </>
                ) : (
                    <QMarkIcon />
                )}
            </span>

            {/* ===== Kartu Tooltip (fixed positioning berbasis viewport) ===== */}
            {tooltipStyle && (
                <div
                    ref={tooltipRef}
                    data-tooltip-card
                    className="fixed z-[80]"
                    style={tooltipStyle}
                    onClick={(e) => e.stopPropagation()}
                    onMouseEnter={() => { if (enterTimer.current) window.clearTimeout(enterTimer.current); }}
                >
                    <div className={`relative rounded-xl border overflow-hidden ${t.card}`}>
                        {/* Aksen garis kiri */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b to-transparent ${t.accentBar}`} />

                        <div className="p-3.5 pl-4">
                            {/* Judul */}
                            <h4 className={`flex items-center gap-2 font-display text-sm font-bold ${t.title}`}>
                                <span className={t.iconColor}>
                                    <InfoIcon />
                                </span>
                                {title}
                            </h4>

                            {/* Deskripsi (mendukung rich content / ReactNode) */}
                            {description && (
                                <div className={`mt-1.5 text-xs leading-relaxed ${t.desc}`}>{description}</div>
                            )}

                            {/* Gambar di dalam tooltip — klik untuk perbesar via modal */}
                            {images.length > 0 && (
                                <div className="mt-2.5 space-y-2">
                                    {images.map((src, i) => (
                                        <button
                                            key={`${src}-${i}`}
                                            onClick={() => openModal(images, imageAlt || title, imageCaption)}
                                            className="group/img block w-full text-left"
                                            aria-label={`Perbesar gambar: ${imageAlt || title}`}
                                        >
                                            <img
                                                src={src.startsWith('/') ? `${window.location.origin}${src}` : src}
                                                alt={`${imageAlt || title}${images.length > 1 ? ` - ${i + 1}/${images.length}` : ''}`}
                                                loading="lazy"
                                                className={`w-full max-h-40 mx-auto object-contain rounded-lg border transition-all duration-200 ${t.imgBorder} ${t.imgHoverBorder}`}
                                                style={{ backgroundColor: t.imgBox }}
                                            />
                                        </button>
                                    ))}
                                    <p className={`text-center font-mono text-[9px] ${t.caption}`}>
                                        {imageCaption || 'klik gambar untuk perbesar'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Panah penunjuk ke teks pemicu */}
                        <span
                            className={`absolute w-2.5 h-2.5 rotate-45 ${t.arrow} ${ARROW_BORDER[resolvedPlacement]}`}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
