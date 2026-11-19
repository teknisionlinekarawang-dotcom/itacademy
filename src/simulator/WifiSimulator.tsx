import { useState } from 'react';

const ChannelVisualizer = () => {
    const channels = Array.from({ length: 14 }, (_, i) => i + 1);
    const [selectedChannels, setSelectedChannels] = useState<number[]>([1, 6, 11]);

    const getChannelColor = (channel: number) => {
        if (selectedChannels.includes(channel)) {
            if (channel === 1) return 'rgba(0, 212, 255, 0.7)'; // Cyan
            if (channel === 6) return 'rgba(245, 158, 11, 0.7)'; // Amber
            if (channel === 11) return 'rgba(16, 185, 129, 0.7)'; // Emerald
        }
        return 'rgba(74, 85, 104, 0.3)';
    };

    const isOverlapping = (ch1: number, ch2: number) => Math.abs(ch1 - ch2) < 5;

    let overlapDetected = false;
    for (let i = 0; i < selectedChannels.length; i++) {
        for (let j = i + 1; j < selectedChannels.length; j++) {
            if (isOverlapping(selectedChannels[i], selectedChannels[j])) {
                overlapDetected = true;
                break;
            }
        }
        if (overlapDetected) break;
    }

    return (
        <div className="bg-[#0d1525]/80 border border-[rgba(0,212,255,0.1)] rounded-xl p-6 backdrop-blur-sm">
            <h3 className="font-display text-lg font-bold text-white mb-2">Visualisasi Channel 2.4 GHz</h3>
            <p className="font-mono text-xs text-[#64748b] mb-6">Pilih channel untuk melihat potensi tumpang tindih (interferensi).</p>
            
            <div className="relative h-40 w-full">
                {channels.map(ch => (
                    <div key={ch} className="absolute bottom-0 h-full" style={{ left: `${(ch - 1) * (100 / 14)}%`, width: `${(100 / 14) * 5}%` }}>
                        <div className="relative h-full w-full">
                            <div 
                                className="absolute bottom-0 w-full h-full rounded-t-full transition-all duration-300"
                                style={{
                                    background: `radial-gradient(ellipse at top, ${getChannelColor(ch)}, transparent 70%)`,
                                    opacity: selectedChannels.includes(ch) ? 1 : 0.2,
                                    transform: selectedChannels.includes(ch) ? 'scale(1)' : 'scale(0.8)'
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-2">
                {channels.map(ch => (
                    <button 
                        key={ch}
                        onClick={() => {
                            const newSelection = selectedChannels.includes(ch)
                                ? selectedChannels.filter(c => c !== ch)
                                : [...selectedChannels, ch];
                            setSelectedChannels(newSelection);
                        }}
                        className={`w-7 h-7 flex items-center justify-center font-mono text-xs rounded-md transition-all ${selectedChannels.includes(ch) ? 'bg-white/10 text-white' : 'text-[#4a5568] hover:bg-white/5'}`}
                    >
                        {ch}
                    </button>
                ))}
            </div>
            <div className={`mt-4 text-center font-mono text-xs p-2 rounded-md transition-colors ${overlapDetected ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                {overlapDetected ? 'Interferensi Terdeteksi! Channel tumpang tindih.' : 'Konfigurasi Optimal. Tidak ada interferensi.'}
            </div>
        </div>
    );
};

const RangeVisualizer = () => {
    const [walls, setWalls] = useState(1);

    const calculateRange = (baseRange: number, wallPenalty: number, numWalls: number) => {
        return Math.max(0, baseRange - (wallPenalty * numWalls));
    };

    const range24 = calculateRange(100, 25, walls);
    const range5 = calculateRange(60, 40, walls);

    return (
        <div className="bg-[#0d1525]/80 border border-[rgba(0,212,255,0.1)] rounded-xl p-6 backdrop-blur-sm mt-6">
            <h3 className="font-display text-lg font-bold text-white mb-2">Perbandingan Jangkauan 2.4 GHz vs 5 GHz</h3>
            <p className="font-mono text-xs text-[#64748b] mb-6">Geser slider untuk menambah jumlah dinding dan lihat pengaruhnya.</p>

            <div className="relative h-48 w-full flex items-center justify-center">
                {/* 5 GHz Range */}
                <div className="absolute rounded-full bg-amber-500/10 border-2 border-dashed border-amber-500/50 transition-all duration-300" style={{ width: `${range5}%`, height: `${range5}%` }} />
                {/* 2.4 GHz Range */}
                <div className="absolute rounded-full bg-cyan-500/10 border-2 border-dashed border-cyan-500/50 transition-all duration-300" style={{ width: `${range24}%`, height: `${range24}%` }} />
                
                <div className="text-3xl z-10">📡</div>
                <div className="absolute z-10" style={{ transform: `translateY(${range5/2 * 0.9}px) translateX(-${range5/2 * 0.9}px)` }}>
                    <span className="font-mono text-xs text-amber-400 bg-black/30 px-1 rounded">5GHz</span>
                </div>
                <div className="absolute z-10" style={{ transform: `translateY(${range24/2 * 0.9}px) translateX(${range24/2 * 0.9}px)` }}>
                    <span className="font-mono text-xs text-cyan-400 bg-black/30 px-1 rounded">2.4GHz</span>
                </div>
            </div>

            <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                    <label className="block font-mono text-[10px] text-[#4a5568] uppercase">Jumlah Dinding</label>
                    <span className="font-mono text-lg font-bold text-white">{walls} Dinding</span>
                </div>
                <input type="range" min="0" max="3" step="1" value={walls} onChange={e => setWalls(Number(e.target.value))} className="w-full" />
            </div>
        </div>
    );
};

export default function WifiSimulator() {
    return (
        <div>
            <ChannelVisualizer />
            <RangeVisualizer />
        </div>
    );
}