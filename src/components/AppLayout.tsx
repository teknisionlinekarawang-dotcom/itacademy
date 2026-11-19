import { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import DoodleCanvas from './DoodleCanvas.tsx';

const navItems: { path: string; label: string; icon: string; }[] = [
  { path: '/dashboard', label: 'Dashboard', icon: '⊞' },
];

export default function AppLayout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isDoodleMode, setIsDoodleMode] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#07090f] text-[#e2e8f0] flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-[rgba(7,9,15,0.92)] backdrop-blur-xl border-b border-[rgba(0,212,255,0.1)]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 cursor-pointer flex-shrink-0">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-lg bg-[rgba(0,212,255,0.15)] border border-[rgba(0,212,255,0.3)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="5" width="6" height="4" rx="0.5" stroke="#00d4ff" strokeWidth="1" />
                  <rect x="9" y="5" width="6" height="4" rx="0.5" stroke="#10b981" strokeWidth="1" />
                  <line x1="7" y1="7" x2="9" y2="7" stroke="#00d4ff" strokeWidth="1" />
                  <circle cx="8" cy="7" r="0.8" fill="#00d4ff" />
                  <line x1="1" y1="3" x2="4" y2="5" stroke="#4a5568" strokeWidth="0.8" />
                  <line x1="15" y1="3" x2="12" y2="5" stroke="#4a5568" strokeWidth="0.8" />
                  <line x1="1" y1="11" x2="4" y2="9" stroke="#4a5568" strokeWidth="0.8" />
                  <line x1="15" y1="11" x2="12" y2="9" stroke="#4a5568" strokeWidth="0.8" />
                </svg>
              </div>
            </div>
            <div>
              <div className="font-display font-bold text-white text-sm leading-tight">DEV Academy</div>
              <div className="font-mono text-[9px] text-[#4a5568] leading-tight">TKJ • Jaringan Komputer</div>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg font-display text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[rgba(0,212,255,0.1)] text-[#00d4ff] border border-[rgba(0,212,255,0.2)]'
                      : 'text-[#64748b] hover:text-white hover:bg-[rgba(255,255,255,0.04)]'
                  }`}
                >
                  <span className="text-base leading-none">{item.icon}</span>
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-[#00d4ff]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              {searchOpen ? (
                <input
                  autoFocus
                  type="text"
                  placeholder="Cari modul, materi..."
                  onBlur={() => setSearchOpen(false)}
                  className="w-52 bg-[#0d1525] border border-[rgba(0,212,255,0.2)] rounded-lg px-3 py-1.5 pl-8 font-mono text-xs text-white placeholder-[#4a5568] focus:outline-none"
                />
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-[rgba(0,212,255,0.1)] text-[#4a5568] hover:text-[#00d4ff] hover:border-[rgba(0,212,255,0.3)] transition-all"
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.3" /><line x1="8.5" y1="8.5" x2="12" y2="12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
                </button>
              )}
              {searchOpen && (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#4a5568] pointer-events-none"><circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.3" /><line x1="8.5" y1="8.5" x2="12" y2="12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
              )}
            </div>

            {/* Doodle Mode Button */}
            <button
              onClick={() => setIsDoodleMode(!isDoodleMode)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all ${isDoodleMode ? 'bg-[#00d4ff] text-[#07090f] border-[#00d4ff]' : 'border-[rgba(0,212,255,0.1)] text-[#4a5568] hover:text-[#00d4ff] hover:border-[rgba(0,212,255,0.3)]'}`}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M10.4211 1.57895L12.4211 3.57895M1.5 12.5L11.2105 2.78947C11.5368 2.46316 12.0526 2.46316 12.3789 2.78947L11.2105 2.78947C11.5368 2.46316 12.0526 2.46316 12.3789 2.78947L12.7895 3.21053C13.1158 3.53684 13.1158 4.05263 12.7895 4.37895L3.07895 14.0905L1.5 12.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>

            {/* Lencana portal (statis, tanpa login) */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[rgba(0,212,255,0.15)] bg-[rgba(0,212,255,0.05)]">
              <div className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span className="font-mono text-[10px] text-[#00d4ff]">Portal Belajar</span>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className={`flex-1 ${isDoodleMode ? 'pointer-events-none' : ''}`}>
        <Outlet /> {/* Ini akan me-render komponen Route anak */}
      </main>

      {/* Doodle Canvas Overlay */}
      {isDoodleMode && <DoodleCanvas onClose={() => setIsDoodleMode(false)} />}

      {/* Footer */}
      <footer className="border-t border-[rgba(0,212,255,0.06)] bg-[#07090f]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[9px] text-[#2d3748]">DEV Academy TKJ v2.5.1</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              <span className="font-mono text-[9px] text-[#10b981]">Semua sistem normal</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[9px] text-[#2d3748]">DEV LOVER - PROJECT</span>
            <span className="font-mono text-[9px] text-[#2d3748]">Semester Genap 2025/2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
