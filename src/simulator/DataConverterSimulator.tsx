import { useState, useEffect, ChangeEvent } from 'react';

const InputField = ({ label, value, onChange, placeholder, error, onFocus }: { label: string, value: string, onChange: (e: ChangeEvent<HTMLInputElement>) => void, placeholder: string, error?: string, onFocus?: () => void }) => (
    <div>
        <label className="block font-mono text-[10px] text-[#4a5568] uppercase tracking-wider mb-1.5">{label}</label>
        <input
            type="text"
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            placeholder={placeholder}
            className={`w-full bg-[#07090f] rounded-lg px-3 py-2 font-mono text-sm text-white placeholder-[#2d3748] focus:outline-none transition-all border ${error ? 'border-red-500/50 focus:border-red-500' : 'border-[rgba(0,212,255,0.15)] focus:border-[rgba(0,212,255,0.5)]'}`}
        />
        {error && <p className="font-mono text-[9px] text-red-400 mt-1">{error}</p>}
    </div>
);

const NumberSystemConverter = () => {
    const [decimal, setDecimal] = useState('192');
    const [binary, setBinary] = useState('11000000');
    const [hex, setHex] = useState('c0');
    const [lastChanged, setLastChanged] = useState<'dec' | 'bin' | 'hex'>('dec');

    useEffect(() => {
        if (lastChanged === 'dec') {
            const num = parseInt(decimal, 10);
            if (!isNaN(num)) {
                setBinary(num.toString(2));
                setHex(num.toString(16));
            } else {
                setBinary('');
                setHex('');
            }
        }
    }, [decimal, lastChanged]);

    useEffect(() => {
        if (lastChanged === 'bin') {
            const num = parseInt(binary, 2);
            if (!isNaN(num)) {
                setDecimal(num.toString(10));
                setHex(num.toString(16));
            } else {
                setDecimal('');
                setHex('');
            }
        }
    }, [binary, lastChanged]);

    useEffect(() => {
        if (lastChanged === 'hex') {
            const num = parseInt(hex, 16);
            if (!isNaN(num)) {
                setDecimal(num.toString(10));
                setBinary(num.toString(2));
            } else {
                setDecimal('');
                setBinary('');
            }
        }
    }, [hex, lastChanged]);

    return (
        <div className="bg-[#0d1525]/80 border border-[rgba(0,212,255,0.1)] rounded-xl p-6 backdrop-blur-sm">
            <h3 className="font-display text-lg font-bold text-white mb-4">Konverter Sistem Bilangan</h3>
            <div className="space-y-4">
                <InputField label="Desimal (Basis 10)" value={decimal} onChange={(e) => setDecimal(e.target.value)} onFocus={() => setLastChanged('dec')} placeholder="e.g., 255" />
                <InputField label="Biner (Basis 2)" value={binary} onChange={(e) => setBinary(e.target.value)} onFocus={() => setLastChanged('bin')} placeholder="e.g., 11111111" />
                <InputField label="Heksadesimal (Basis 16)" value={hex} onChange={(e) => setHex(e.target.value)} onFocus={() => setLastChanged('hex')} placeholder="e.g., ff" />
            </div>
        </div>
    );
};

const DataSizeConverter = () => {
    const [value, setValue] = useState('1');
    const [unit, setUnit] = useState('GB');
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const factors = {
        'B': 1,
        'KB': 1000, 'MB': 1000**2, 'GB': 1000**3, 'TB': 1000**4, 'PB': 1000**5,
        'KiB': 1024, 'MiB': 1024**2, 'GiB': 1024**3, 'TiB': 1024**4, 'PiB': 1024**5,
    };

    const getConvertedValue = (fromValue: number, fromUnit: string, toUnit: string) => {
        const baseValue = fromValue * (factors[fromUnit as keyof typeof factors] || 1);
        const converted = baseValue / (factors[toUnit as keyof typeof factors] || 1);
        return Number(converted.toPrecision(4));
    };

    const numValue = parseFloat(value) || 0;

    return (
        <div className="bg-[#0d1525]/80 border border-[rgba(0,212,255,0.1)] rounded-xl p-6 backdrop-blur-sm mt-6">
            <h3 className="font-display text-lg font-bold text-white mb-4">Kalkulator Ukuran Data</h3>
            <div className="flex gap-4 items-end mb-6">
                <div className="flex-grow">
                    <label className="block font-mono text-[10px] text-[#4a5568] uppercase tracking-wider mb-1.5">Nilai</label>
                    <input type="number" value={value} onChange={e => setValue(e.target.value)} className="w-full bg-[#07090f] rounded-lg px-3 py-2 font-mono text-sm text-white placeholder-[#2d3748] focus:outline-none border border-[rgba(0,212,255,0.15)] focus:border-[rgba(0,212,255,0.5)]" />
                </div>
                <div>
                    <label className="block font-mono text-[10px] text-[#4a5568] uppercase tracking-wider mb-1.5">Unit</label>
                    <select value={unit} onChange={e => setUnit(e.target.value)} className="w-full bg-[#07090f] rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none border border-[rgba(0,212,255,0.15)] focus:border-[rgba(0,212,255,0.5)]">
                        {units.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 font-mono text-sm">
                <div className="col-span-1 md:col-span-2 font-display text-base font-bold text-[#00d4ff]">Hasil Konversi (Basis 10 - SI)</div>
                <div><span className="text-[#4a5568]">Byte (B):</span> <span className="text-white">{getConvertedValue(numValue, unit, 'B')}</span></div>
                <div><span className="text-[#4a5568]">Kilobyte (KB):</span> <span className="text-white">{getConvertedValue(numValue, unit, 'KB')}</span></div>
                <div><span className="text-[#4a5568]">Megabyte (MB):</span> <span className="text-white">{getConvertedValue(numValue, unit, 'MB')}</span></div>
                <div><span className="text-[#4a5568]">Gigabyte (GB):</span> <span className="text-white">{getConvertedValue(numValue, unit, 'GB')}</span></div>
                <div><span className="text-[#4a5568]">Terabyte (TB):</span> <span className="text-white">{getConvertedValue(numValue, unit, 'TB')}</span></div>
                
                <div className="col-span-1 md:col-span-2 font-display text-base font-bold text-[#f59e0b] pt-4 mt-4 border-t border-[rgba(255,255,255,0.1)]">Hasil Konversi (Basis 2 - Biner)</div>
                <div><span className="text-[#4a5568]">Byte (B):</span> <span className="text-white">{getConvertedValue(numValue, unit, 'B')}</span></div>
                <div><span className="text-[#4a5568]">Kibibyte (KiB):</span> <span className="text-white">{getConvertedValue(numValue, unit, 'KiB')}</span></div>
                <div><span className="text-[#4a5568]">Mebibyte (MiB):</span> <span className="text-white">{getConvertedValue(numValue, unit, 'MiB')}</span></div>
                <div><span className="text-[#4a5568]">Gibibyte (GiB):</span> <span className="text-white">{getConvertedValue(numValue, unit, 'GiB')}</span></div>
                <div><span className="text-[#4a5568]">Tebibyte (TiB):</span> <span className="text-white">{getConvertedValue(numValue, unit, 'TiB')}</span></div>
            </div>
        </div>
    );
};

const BandwidthSimulator = () => {
    const ispSpeeds = [20, 50, 100, 300, 500, 1000]; // in Mbps
    const [ispSpeed, setIspSpeed] = useState(100); // default 100 Mbps

    const downloadSpeed = ispSpeed / 8;

    return (
        <div className="bg-[#0d1525]/80 border border-[rgba(0,212,255,0.1)] rounded-xl p-6 backdrop-blur-sm mt-6">
            <h3 className="font-display text-lg font-bold text-white mb-2">Simulasi Kecepatan Internet (Speedtest)</h3>
            <p className="font-mono text-xs text-[#64748b] mb-6">Lihat bagaimana kecepatan paket ISP (dalam Megabit) dikonversi menjadi kecepatan unduh (dalam Megabyte).</p>

            {/* ISP Speed Selector */}
            <div className="mb-6">
                <label className="block font-mono text-[10px] text-[#4a5568] uppercase tracking-wider mb-2">Pilih Paket ISP (Mbps)</label>
                <div className="flex flex-wrap gap-2">
                    {ispSpeeds.map(speed => (
                        <button
                            key={speed}
                            onClick={() => setIspSpeed(speed)}
                            className={`font-mono text-xs px-3 py-1.5 rounded-lg border transition-all ${
                                ispSpeed === speed
                                ? 'border-[#00d4ff] bg-[rgba(0,212,255,0.12)] text-[#00d4ff]'
                                : 'border-[rgba(0,212,255,0.1)] text-[#64748b] hover:text-white hover:border-[rgba(0,212,255,0.25)]'
                            }`}
                        >
                            {speed} Mbps
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.08)] text-center">
                    <div className="font-mono text-[10px] text-[#4a5568] uppercase">Paket ISP</div>
                    <div className="font-display text-2xl font-bold text-[#00d4ff] mt-1">{ispSpeed}</div>
                    <div className="font-mono text-xs text-[#00d4ff]">Megabit/s</div>
                </div>

                <div className="text-center font-mono text-sm text-[#4a5568] py-4">
                    <p>Dibagi 8</p>
                    <p className="text-2xl font-bold text-white">÷</p>
                    <p>(1 Byte = 8 bit)</p>
                </div>

                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.08)] text-center">
                    <div className="font-mono text-[10px] text-[#4a5568] uppercase">Kecepatan Unduh</div>
                    <div className="font-display text-2xl font-bold text-[#f59e0b] mt-1">{downloadSpeed.toFixed(1)}</div>
                    <div className="font-mono text-xs text-[#f59e0b]">Megabyte/s</div>
                </div>
            </div>
        </div>
    );
};


export default function DataConverterSimulator() {
    return (
        <div>
            <NumberSystemConverter />
            <DataSizeConverter />
            <BandwidthSimulator />
        </div>
    );
}