import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Module, modules, LEARNING_TRACKS } from '../data/dashboardData';

// --- Sub-Components ---

const Hero = () => {
  const displayName = 'Teman Belajar';

  return (
  <div className="relative overflow-hidden border-b border-[rgba(0,212,255,0.1)] py-8 md:py-12">
    <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,212,255,0.08)] via-transparent to-[rgba(16,185,129,0.06)] opacity-50 md:opacity-100" />
    <div className="absolute top-0 right-0 w-full md:w-[600px] h-[300px] md:h-[400px] bg-[radial-gradient(ellipse,rgba(0,212,255,0.12),transparent_70%)]" />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
      <div className="flex flex-col md:flex-row items-start justify-between gap-8">
        <div className="flex-1 animate-slide-up w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(0,212,255,0.3)] bg-[rgba(0,212,255,0.05)] mb-3 md:mb-4">
            <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-[blink_1.5s_ease-in-out_infinite]" />
            <span className="font-mono text-xs text-[#00d4ff]">Modul Pembelajaran Interaktif</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight mb-2">
            Selamat datang kembali,<br />
            <span className="text-[#00d4ff]">{displayName}</span>
          </h1>
          <p className="text-[#94a3b8] text-sm sm:text-base mb-4 md:mb-6 max-w-md">
            Jelajahi modul dan simulator interaktif jaringan komputer. Semua bisa diakses langsung tanpa login.
          </p>
        </div>
      </div>
    </div>
  </div>
);};

const ModuleCard = ({ mod, step }: { mod: Module; step?: number }) => {
  const navigate = useNavigate();
  return (<div
    className="group bg-[#0d1525] border border-[rgba(0,212,255,0.1)] rounded-xl p-4 sm:p-5 hover:border-[rgba(0,212,255,0.3)] transition-all duration-300 hover:bg-[#111827] cursor-pointer relative overflow-hidden"
    onClick={() => mod.page !== 'dashboard' && navigate(`/module/${mod.page}`)}
    style={{ '--mod-accent': mod.accent } as React.CSSProperties}
  >
    <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ background: `radial-gradient(${mod.accent}20, transparent)` }} />

    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        {step !== undefined && (
          <span
            className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border"
            style={{ color: mod.accent, borderColor: `${mod.accent}40`, background: `${mod.accent}10` }}
          >
            {String(step).padStart(2, '0')}
          </span>
        )}
        <div className="text-3xl">{mod.icon}</div>
      </div>
      <span
        className="font-mono text-[10px] px-2 py-0.5 rounded-full border"
        style={{ color: mod.diffColor, borderColor: `${mod.diffColor}40`, background: `${mod.diffColor}10` }}
      >
        {mod.difficulty.length > 8 ? mod.difficulty.substring(0, 8) + '...' : mod.difficulty}
      </span>
    </div>

    <h3 className="font-display font-bold text-white text-base mb-1">{mod.title}</h3>
    <p className="text-[#64748b] text-xs mb-3 leading-relaxed">{mod.subtitle}</p>

    <div className="flex flex-wrap gap-1 mb-4">
      {(mod.tags ?? []).map((t) => (
        <span key={t} className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[rgba(0,212,255,0.05)] border border-[rgba(0,212,255,0.1)] text-[#4a5568]">
          {t}
        </span>
      ))}
    </div>

    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="font-mono text-[10px] text-[#4a5568]">Progress</span>
        <span className="font-mono text-[10px]" style={{ color: mod.accent }}>{mod.progress}%</span>
      </div>
      <div className="h-1.5 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${mod.progress}%`, background: mod.accent }}
        />
      </div>
    </div>

    <div className="flex items-center justify-end">
      <button
        className="font-display text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-200 hover:scale-105"
        style={{
          color: mod.accent,
          borderColor: `${mod.accent}40`,
          background: `${mod.accent}10`,
        }}
      >
                {(mod.progress ?? 0) > 0 ? 'Lanjutkan →' : 'Mulai →'}
      </button>
    </div>
  </div>
)};

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('')

  // Urutkan sesuai alur pembelajaran (field order) lalu kelompokkan per track.
  const q = searchQuery.toLowerCase().trim();
  const matches = (m: Module) =>
    !q || m.title.toLowerCase().includes(q) ||
    m.track.toLowerCase().includes(q) ||
    (m.tags ?? []).some((t) => t.toLowerCase().includes(q));

  const ordered = [...modules].sort((a, b) => a.order - b.order);
  const grouped = LEARNING_TRACKS.map((track) => ({
    track,
    items: ordered.filter((m) => m.track === track && matches(m)),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="min-h-screen grid-bg">
      {/* Hero */}
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3 sm:gap-0">
          <h2 className="font-display text-lg font-bold text-white">Modul Pembelajaran</h2>
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Cari modul / kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-56 bg-[#0d1525] border border-[rgba(0,212,255,0.12)] rounded-lg px-3 py-1.5 pl-8 font-mono text-xs text-[#94a3b8] placeholder-[#4a5568] focus:outline-none focus:border-[rgba(0,212,255,0.4)] focus:bg-[#111827] transition-all"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#4a5568] text-xs">🔍</span>
          </div>
        </div>

        {grouped.length === 0 ? (
          <p className="text-[#64748b] text-sm py-12 text-center">Tidak ada modul yang cocok dengan pencarian.</p>
        ) : (
          <div className="space-y-10">
            {grouped.map((g) => (
              <section key={g.track}>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-display text-sm font-bold text-[#00d4ff] tracking-wide uppercase">{g.track}</h3>
                  <span className="flex-1 h-px bg-[rgba(0,212,255,0.15)]" />
                  <span className="font-mono text-[10px] text-[#4a5568]">{g.items.length} modul</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {g.items.map((mod) => <ModuleCard key={mod.id} mod={mod} step={mod.order} />)}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
