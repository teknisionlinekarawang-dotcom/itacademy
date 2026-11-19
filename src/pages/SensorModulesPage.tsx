import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { sensorCategories, allSensorModules, type SensorModule } from '../data/sensorModules';
import SensorSimulator from '../simulator/SensorSimulator';

// Ilustrasi "image placeholder" untuk tiap modul: papan PCB bergaya dengan ikon besar.
// Tidak memakai URL eksternal agar selalu tampil (murni SVG).
function ModulePreview({ module }: { module: SensorModule }) {
    const c = module.swatch;
    return (
        <div className="relative rounded-xl border border-[rgba(0,212,255,0.12)] bg-[#07090f] p-4">
            <svg viewBox="0 0 320 190" className="w-full" role="img" aria-label={`Ilustrasi ${module.name}`}>
                {/* badan PCB */}
                <rect x="30" y="30" width="260" height="130" rx="12" fill="#0f172a" stroke={c} strokeOpacity="0.5" strokeWidth="2" />
                {/* jejak tembaga dekoratif */}
                <path d="M40 60 H120 V110 H200" fill="none" stroke={c} strokeOpacity="0.15" strokeWidth="2" />
                <path d="M280 55 H210 V95" fill="none" stroke={c} strokeOpacity="0.15" strokeWidth="2" />
                {/* pin headers kiri-kanan */}
                {Array.from({ length: 6 }).map((_, i) => (
                    <g key={i}>
                        <rect x="14" y={42 + i * 18} width="16" height="10" rx="2" fill="#1e293b" stroke="#334155" />
                        <rect x="290" y={42 + i * 18} width="16" height="10" rx="2" fill="#1e293b" stroke="#334155" />
                    </g>
                ))}
                {/* chip pusat */}
                <rect x="110" y="55" width="100" height="80" rx="8" fill="#07090f" stroke={c} strokeOpacity="0.35" />
                <text x="160" y="105" textAnchor="middle" fontSize="46">{module.icon}</text>
                {/* label nama */}
                <text x="160" y="150" textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily="monospace">{module.name}</text>
            </svg>
            <span className="absolute top-2 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full bg-black/40 text-[#4a5568] border border-[rgba(255,255,255,0.06)]">
                GAMBAR PLACEHOLDER
            </span>
        </div>
    );
}

function InterfaceBadge({ value }: { value: string }) {
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[rgba(0,212,255,0.08)] text-[#00d4ff] border border-[rgba(0,212,255,0.2)]">
            {value}
        </span>
    );
}

function DetailPanel({ module }: { module: SensorModule }) {
    return (
        <div className="space-y-5">
            <ModulePreview module={module} />

            <div>
                <div className="flex items-start justify-between gap-3 flex-wrap">
                    <h3 className="font-display text-xl font-bold text-white">{module.name}</h3>
                    <InterfaceBadge value={module.interface} />
                </div>
                <p className="mt-2 text-sm text-[#b0c4de] leading-relaxed">{module.summary}</p>
            </div>

            <div>
                <h4 className="font-display text-sm font-bold text-[#00d4ff] mb-2">Penjelasan &amp; Karakteristik</h4>
                <ul className="space-y-1.5 text-xs text-[#b0c4de]">
                    {module.details.map((d, i) => (
                        <li key={i} className="flex gap-2">
                            <span className="text-[#00d4ff]">▸</span>
                            <span>{d}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h4 className="font-display text-sm font-bold text-[#00d4ff] mb-2">Spesifikasi</h4>
                <div className="overflow-hidden rounded-lg border border-[rgba(255,255,255,0.06)]">
                    <table className="w-full text-left text-xs">
                        <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                            {module.specs.map((s, i) => (
                                <tr key={i} className="bg-[#07090f]">
                                    <td className="p-2 text-[#64748b] w-1/2">{s.label}</td>
                                    <td className="p-2 text-white font-mono">{s.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="rounded-lg border border-[rgba(0,212,255,0.12)] bg-[rgba(0,212,255,0.04)] p-3">
                <h4 className="font-display text-xs font-bold text-[#00d4ff] mb-1">🔌 Cara Memasang</h4>
                <p className="text-xs text-[#b0c4de] font-mono leading-relaxed">{module.wiring}</p>
            </div>

            <div>
                <h4 className="font-display text-sm font-bold text-[#00d4ff] mb-2">🧪 Simulasi Interaktif</h4>
                <SensorSimulator module={module} />
            </div>
        </div>
    );
}

export default function SensorModulesPage() {
    const [selId, setSelId] = useState<string | null>(null);
    const [query, setQuery] = useState('');
    const selected = allSensorModules.find((m) => m.id === selId) || null;

    // Filter modul berdasarkan nama ATAU nama kategori (case-insensitive).
    const q = query.trim().toLowerCase();
    const filteredCategories = useMemo(() => {
        if (!q) return sensorCategories;
        return sensorCategories
            .map((cat) => {
                const catMatch = cat.title.toLowerCase().includes(q) || cat.blurb.toLowerCase().includes(q);
                const modules = catMatch ? cat.modules : cat.modules.filter((m) => m.name.toLowerCase().includes(q));
                return { ...cat, modules };
            })
            .filter((cat) => cat.modules.length > 0);
    }, [q]);

    const totalShown = filteredCategories.reduce((n, c) => n + c.modules.length, 0);

    return (
        <div className="min-h-screen grid-bg p-6 lg:p-8 text-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link to="/module/esp-arduino" className="inline-flex items-center gap-1 text-xs text-[#64748b] hover:text-[#00d4ff] mb-3 transition-colors">
                        &larr; Kembali ke ESP32 &amp; Arduino
                    </Link>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">🧩</span>
                        <h1 className="font-display text-2xl lg:text-3xl font-bold text-white">
                            Jenis-jenis Modul Sensor Arduino &amp; ESP
                        </h1>
                    </div>
                    <p className="text-[#94a3b8] text-sm lg:text-base max-w-3xl">
                        Pilih salah satu modul pada daftar di kiri untuk menampilkan gambar, detail lengkap, dan simulasi interaktif di panel kanan.
                    </p>
                </div>

                {/* Master-detail */}
                <div className="grid lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] gap-6 items-start">
                    {/* KIRI: pencarian + daftar modul */}
                    <div className="lg:sticky lg:top-6">
                        <div className="relative mb-2">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a5568] text-sm">🔍</span>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Cari modul atau kategori..."
                                className="w-full bg-[#07090f] border border-[rgba(0,212,255,0.15)] rounded-lg pl-9 pr-20 py-2.5 text-sm text-white outline-none placeholder:text-[#4a5568] focus:border-[#00d4ff] transition-colors"
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={() => setQuery('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#64748b] hover:text-[#00d4ff] px-2 py-1 rounded"
                                >
                                    ✕ bersih
                                </button>
                            )}
                        </div>
                        <p className="text-[11px] text-[#64748b] mb-3">
                            {q ? `${totalShown} modul cocok dengan "${query.trim()}"` : `${allSensorModules.length} modul tersedia`}
                        </p>
                        <div className="space-y-5 lg:max-h-[calc(100vh-230px)] lg:overflow-y-auto lg:pr-1">
                        {filteredCategories.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-4xl opacity-40 mb-2">🔍</div>
                                <p className="text-sm text-[#94a3b8]">Tidak ada modul untuk "{query.trim()}".</p>
                                <button type="button" onClick={() => setQuery('')} className="mt-2 text-xs text-[#00d4ff] hover:underline">Hapus pencarian</button>
                            </div>
                        ) : (
                        filteredCategories.map((cat) => (
                            <div key={cat.id}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">{cat.icon}</span>
                                    <h2 className="font-display text-sm font-bold text-white">{cat.title}</h2>
                                </div>
                                <p className="text-[11px] text-[#64748b] mb-2">{cat.blurb}</p>
                                <div className="space-y-1.5">
                                    {cat.modules.map((m) => {
                                        const active = m.id === selId;
                                        return (
                                            <button
                                                key={m.id}
                                                type="button"
                                                onClick={() => setSelId(m.id)}
                                                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all ${
                                                    active
                                                        ? 'bg-[rgba(0,212,255,0.1)] border-[#00d4ff]'
                                                        : 'bg-[#0d1525]/50 border-[rgba(0,212,255,0.08)] hover:border-[rgba(0,212,255,0.3)]'
                                                }`}
                                            >
                                                <span className="text-xl flex-shrink-0">{m.icon}</span>
                                                <span className="min-w-0">
                                                    <span className="block text-sm font-semibold text-white truncate">{m.name}</span>
                                                    <span className="block text-[10px] font-mono text-[#64748b] truncate">{m.interface}</span>
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                        )}
                        </div>
                    </div>

                    {/* KANAN: panel preview */}
                    <div className="lg:sticky lg:top-6">
                        <div className="bg-[#0d1525]/50 border border-[rgba(0,212,255,0.1)] rounded-xl p-5 lg:p-6 min-h-[300px]">
                            {selected ? (
                                <DetailPanel module={selected} />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center py-16 gap-3">
                                    <div className="text-5xl opacity-40">🧪</div>
                                    <h3 className="font-display text-lg font-bold text-[#94a3b8]">Pilih sebuah modul</h3>
                                    <p className="text-xs text-[#64748b] max-w-xs">
                                        Klik salah satu modul pada daftar untuk memunculkan gambar preview, penjelasan, spesifikasi, dan simulasinya di sini.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
