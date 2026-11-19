import { useState, useMemo, useEffect } from 'react';

// Helper untuk mengubah karakter menjadi array biner 8-bit
function charToBinaryArray(char: string): number[] {
    if (!char) return Array(8).fill(0);
    const binaryString = char.charCodeAt(0).toString(2).padStart(8, '0');
    return binaryString.split('').map(Number);
}

export default function OpticSimulation() {
    const [angle, setAngle] = useState(60);
    const [currentChar, setCurrentChar] = useState('A');
    const [currentBitIndex, setCurrentBitIndex] = useState(0);

    const criticalAngle = 41.8; // Untuk kaca ke udara
    const isTIR = angle > criticalAngle;

    const bits = useMemo(() => charToBinaryArray(currentChar), [currentChar]);
    const exampleChars = ['A', 'B', 'C', '!', '?', 'X', 'Y', 'Z'];

    // Efek untuk menganimasikan bit yang sedang dikirim
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBitIndex(prevIndex => (prevIndex + 1) % 8);
        }, 250); // Ganti bit setiap 250ms
        return () => clearInterval(interval);
    }, [currentChar]); // Reset animasi saat karakter berubah

    const currentBit = bits[currentBitIndex];
    const isLampOn = currentBit === 1;

    return (
        <div className="bg-[#0d1525]/50 border border-[rgba(0,212,255,0.1)] rounded-xl p-6 lg:p-8">
            <h2 className="font-display text-xl font-bold text-center text-[#00d4ff] mb-8">Simulasi Perambatan Cahaya</h2>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Visualisasi Total Internal Reflection */}
                <div>
                    <h3 className="font-display font-bold text-white mb-2">1. Total Internal Reflection</h3>
                    <div className="relative w-full h-40 bg-[#07090f] rounded-lg overflow-hidden border border-[rgba(255,255,255,0.1)]">
                        {/* Cladding */}
                        <div className="absolute top-0 left-0 w-full h-8 bg-[rgba(0,212,255,0.05)]" />
                        <div className="absolute bottom-0 left-0 w-full h-8 bg-[rgba(0,212,255,0.05)]" />
                        <div className="absolute top-8 left-0 w-full border-t border-dashed border-[rgba(0,212,255,0.1)]" />
                        <div className="absolute bottom-8 left-0 w-full border-b border-dashed border-[rgba(0,212,255,0.1)]" />
                        <p className="absolute top-2 left-3 font-mono text-[9px] text-[#4a5568]">Cladding (n2)</p>
                        <p className="absolute top-1/2 left-3 -translate-y-1/2 font-mono text-[9px] text-[#4a5568]">Core (n1)</p>

                        {/* Light Ray */}
                        <div className="absolute top-1/2 left-0 w-full h-full" style={{ transform: `translateY(-50%) rotate(${90 - angle}deg)` }}>
                            <div
                                className={`absolute top-1/2 left-1/2 w-96 h-0.5 ${isTIR ? 'bg-yellow-300' : 'bg-red-500'}`}
                                style={{
                                    transform: 'translate(-50%, -50%)',
                                    boxShadow: `0 0 8px ${isTIR ? 'rgba(250,204,21,0.5)' : 'rgba(239,68,68,0.5)'}`
                                }}
                            />
                        </div>
                        <div className="absolute top-1/2 left-1/2 w-px h-full bg-dotted" />
                        <p className={`absolute top-1/2 left-1/2 ml-2 font-mono text-xs ${isTIR ? 'text-yellow-300' : 'text-red-400'}`}>{angle}°</p>
                    </div>
                    <div className="mt-4">
                        <label className="block font-mono text-[10px] text-[#4a5568] uppercase mb-2">Sudut Datang Cahaya</label>
                        <input type="range" min="10" max="89" value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-full" />
                        <p className={`mt-2 text-center font-mono text-xs ${isTIR ? 'text-green-400' : 'text-red-400'}`}>
                            {isTIR ? `Sudut > ${criticalAngle}°: Cahaya memantul sempurna!` : `Sudut < ${criticalAngle}°: Cahaya bocor keluar!`}
                        </p>
                    </div>
                </div>

                {/* Visualisasi Data Transmission */}
                <div>
                    <h3 className="font-display font-bold text-white mb-2">2. Transmisi Data Digital</h3>
                    <div className="flex items-center gap-4">
                        <div className="text-center w-16">
                            <p className="font-display text-4xl font-bold text-white animate-pulse">{currentChar}</p>
                            <p className="font-mono text-[9px] text-[#4a5568]">Karakter</p>
                        </div>
                        <div className="text-2xl text-[#4a5568]">→</div>
                        <div className="flex-1 text-center">
                            <div className="h-10 bg-[#07090f] rounded-lg flex items-center px-2 border border-[rgba(255,255,255,0.1)]">
                                <div className="relative w-full h-full flex items-center">
                                    {isLampOn && (
                                        <div className="w-full h-1 bg-yellow-300 rounded-full animate-pulse" style={{ boxShadow: '0 0 5px rgba(250,204,21,0.7)' }} />
                                    )}
                                </div>
                            </div>
                            <p className="font-mono text-xs text-white mt-1 tracking-widest">
                                {bits.map((b, i) => <span key={i} className={i === currentBitIndex ? 'text-yellow-300 font-bold' : 'text-gray-500'}>{b}</span>)}
                            </p>
                        </div>
                        <div className="text-2xl text-[#4a5568]">→</div>
                        <div className="text-center w-16">
                            <div className={`relative w-12 h-12 mx-auto rounded-full flex items-center justify-center transition-all duration-100 ${isLampOn ? 'bg-yellow-400/20' : 'bg-gray-800/50'}`}>
                                <div className={`w-8 h-8 rounded-full transition-all duration-100 ${isLampOn ? 'bg-yellow-400' : 'bg-gray-700'}`} />
                                {isLampOn && <div className="absolute inset-0 rounded-full bg-yellow-400 blur-lg opacity-70" />}
                            </div>
                            <p className="font-mono text-[9px] text-[#4a5568] mt-1">Penerima</p>
                        </div>
                    </div>
                    <p className="text-center font-mono text-[10px] text-[#4a5568] mt-4">
                        Pilih karakter di bawah untuk melihat representasi biner dan sinyal cahayanya.
                    </p>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {exampleChars.map(char => (
                            <button
                                key={char}
                                onClick={() => setCurrentChar(char)}
                                className={`w-10 h-10 rounded-lg font-display text-lg font-bold transition-all duration-200 border ${
                                    currentChar === char
                                        ? 'bg-[#00d4ff] text-[#07090f] border-[#00d4ff] scale-110'
                                        : 'bg-[#07090f] text-[#64748b] border-[rgba(255,255,255,0.1)] hover:border-[rgba(0,212,255,0.4)] hover:text-white'
                                }`}
                            >
                                {char}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
