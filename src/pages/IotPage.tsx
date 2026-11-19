import { useEffect, useState } from 'react';
import IotContent from '../materi/IotContent';

export default function IotPage() {
    const [labOpen, setLabOpen] = useState(false);

    // Tutup lab dengan tombol Escape + kunci scroll body saat terbuka.
    useEffect(() => {
        if (!labOpen) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLabOpen(false); };
        document.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [labOpen]);

    return (
        <div className="min-h-screen grid-bg p-6 lg:p-8 text-white">
            <div className="max-w-7xl mx-auto">
                {/* Header Materi */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">🤖</span>
                        <h1 className="font-display text-2xl lg:text-3xl font-bold text-white">
                            Pengenalan Internet of Things
                        </h1>
                    </div>
                    <p className="text-[#94a3b8] text-base lg:text-lg max-w-3xl">
                        Dari mesin Coca-Cola hingga kota pintar, jelajahi dunia perangkat terhubung dan bagaimana mereka mengubah cara kita hidup dan bekerja.
                    </p>
                </div>

                {/* Tombol khusus: buka IoT Lab di tempat (same-origin, tanpa pindah halaman) */}
                <div className="mb-8 rounded-xl border border-[rgba(0,212,255,0.25)] bg-[rgba(0,212,255,0.06)] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl leading-none">🧪</span>
                        <div>
                            <h2 className="font-display font-bold text-white text-base">IoT Lab — Simulator Arduino &amp; ESP32</h2>
                            <p className="text-[#94a3b8] text-xs mt-1 max-w-xl">
                                Laboratorium interaktif: tulis kode, jalankan di papan virtual, dan lihat hasilnya secara langsung.
                                Dibuka di dalam modul ini tanpa keluar dari domain atau berpindah halaman.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setLabOpen(true)}
                        className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00d4ff] text-[#07090f] font-display font-bold text-sm hover:bg-white transition-all duration-200 glow-cyan"
                    >
                        <span>▶</span> Buka IoT Lab
                    </button>
                </div>

                {/* Konten Materi */}
                <div className="bg-[#0d1525]/50 border border-[rgba(0,212,255,0.1)] rounded-xl p-6 lg:p-8">
                    <IotContent />
                </div>
            </div>

            {/* Overlay lab (iframe same-origin) */}
            {labOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-[#07090f]/95 backdrop-blur-sm flex flex-col"
                    onClick={(e) => { if (e.target === e.currentTarget) setLabOpen(false); }}
                >
                    <div className="flex items-center justify-between px-4 h-14 flex-shrink-0 border-b border-[rgba(0,212,255,0.15)] bg-[#0d1525]">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">🧪</span>
                            <div>
                                <div className="font-display font-bold text-white text-sm leading-tight">IoT Lab — Simulator Arduino &amp; ESP32</div>
                                <div className="font-mono text-[10px] text-[#4a5568] leading-tight">Same-origin · tetap di dalam modul IoT</div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setLabOpen(false)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[rgba(0,212,255,0.25)] text-[#00d4ff] font-display text-sm font-semibold hover:bg-[rgba(0,212,255,0.1)] transition-all"
                        >
                            ✕ Tutup
                        </button>
                    </div>
                    <iframe
                        src="/iot-lab/index.html"
                        title="IoT Lab - Simulator Arduino dan ESP32"
                        allow="clipboard-write; fullscreen"
                        className="flex-1 w-full border-0"
                        style={{ background: '#0f172a' }}
                    />
                </div>
            )}
        </div>
    );
}
