import { useState } from 'react';

type View = 'LAN' | 'MAN' | 'WAN' | 'Internet';
const views: View[] = ['LAN', 'MAN', 'WAN', 'Internet'];

const Packet = ({ view }: { view: View }) => {
    const getPosition = () => {
        switch (view) {
            case 'LAN': return { top: '50%', left: '50%', transform: 'translate(-50%, -50%) scale(0.5)' };
            case 'MAN': return { top: '45%', left: '40%', transform: 'translate(-50%, -50%) scale(0.3)' };
            case 'WAN': return { top: '55%', left: '60%', transform: 'translate(-50%, -50%) scale(0.2)' };
            case 'Internet': return { top: '30%', left: '70%', transform: 'translate(-50%, -50%) scale(0.1)' };
        }
    };
    return (
        <div className="absolute transition-all duration-1000 ease-in-out" style={getPosition()}>
            <div className="relative w-4 h-4">
                <div className="absolute inset-0 rounded-full bg-yellow-400 animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-yellow-400 blur-sm" />
            </div>
        </div>
    );
};

export default function NetworkScaleSimulator() {
    const [activeView, setActiveView] = useState<View>('LAN');

    return (
        <div className="bg-[#0d1525]/50 border border-[rgba(0,212,255,0.1)] rounded-xl p-6 lg:p-8">
            <h2 className="font-display text-xl font-bold text-center text-[#00d4ff] mb-2">Simulasi Skala Jaringan</h2>
            <p className="text-center text-[#64748b] font-mono text-sm mb-8">Lihat bagaimana jaringan lokal terhubung ke internet global.</p>

            {/* Controls */}
            <div className="flex justify-center mb-6">
                <div className="grid grid-cols-4 gap-1 p-1 bg-[#07090f] rounded-lg border border-[rgba(255,255,255,0.05)]">
                    {views.map(view => (
                        <button
                            key={view}
                            onClick={() => setActiveView(view)}
                            className={`px-6 py-2 rounded-md font-display font-bold text-xs transition-all duration-200 ${activeView === view ? 'bg-[#00d4ff] text-[#07090f] glow-cyan' : 'text-[#64748b] hover:text-white'}`}
                        >
                            {view}
                        </button>
                    ))}
                </div>
            </div>

            {/* Visualizer */}
            <div className="relative w-full aspect-video bg-[#07090f] rounded-xl border border-[rgba(255,255,255,0.1)] overflow-hidden">
                {/* Internet Layer */}
                <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${activeView === 'Internet' ? 'opacity-100 scale-100' : 'opacity-0 scale-150'}`}>
                    <p className="absolute top-2 left-3 font-mono text-xs text-[#a855f7]">🌐 INTERNET</p>
                    <div className="absolute w-full h-full bg-[url('https://unpkg.com/world-atlas@2/land-110m.json')] opacity-5" />
                    <svg className="absolute inset-0 w-full h-full" fill="none" stroke="rgba(168, 85, 247, 0.1)" strokeWidth="1">
                        <path d="M 100,150 C 200,50 400,250 500,150" />
                        <path d="M 50,50 C 150,200 300,50 450,200" />
                    </svg>
                </div>

                {/* WAN Layer */}
                <div className={`absolute inset-[5%] rounded-lg border border-dashed border-blue-500/30 transition-all duration-1000 ease-in-out ${activeView === 'WAN' ? 'opacity-100 scale-100' : activeView > 'WAN' ? 'opacity-100 scale-100' : 'opacity-0 scale-150'}`}>
                    <p className="absolute top-2 left-3 font-mono text-xs text-blue-500">🌍 WAN</p>
                </div>

                {/* MAN Layer */}
                <div className={`absolute inset-[15%] rounded-lg border border-dashed border-emerald-500/30 transition-all duration-1000 ease-in-out ${activeView === 'MAN' ? 'opacity-100 scale-100' : activeView > 'MAN' ? 'opacity-100 scale-100' : 'opacity-0 scale-150'}`}>
                    <p className="absolute top-2 left-3 font-mono text-xs text-emerald-500">🏙️ MAN</p>
                </div>

                {/* LAN Layer */}
                <div className={`absolute inset-[30%] rounded-lg border border-dashed border-cyan-500/30 transition-all duration-1000 ease-in-out ${activeView === 'LAN' ? 'opacity-100 scale-100' : activeView > 'LAN' ? 'opacity-100 scale-100' : 'opacity-0 scale-150'}`}>
                    <p className="absolute top-2 left-3 font-mono text-xs text-cyan-500">🏠 LAN</p>
                </div>

                <Packet view={activeView} />
            </div>
        </div>
    );
}
