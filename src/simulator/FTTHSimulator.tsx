import { useState, useMemo, useEffect } from 'react';

type ComponentType = 'distance' | 'splice' | 'connector' | 'splitter';

interface TopologyComponent {
    label: string; // Tambahkan label untuk membedakan komponen dengan tipe yang sama
    id: number;
    type: ComponentType;
    value: number; // km for distance, ratio for splitter (e.g., 8 for 1:8)
}

const LOSS_VALUES = {
    distance: 0.25, // dB per km
    splice: 0.1,    // dB per splice
    connector: 0.5, // dB per connector
    splitter: (ratio: number) => {
        // Loss = 10 * log10(ratio) + insertion loss
        if (ratio === 2) return 3.5;
        if (ratio === 4) return 7.0;
        if (ratio === 8) return 10.5;
        if (ratio === 16) return 13.5;
        if (ratio === 32) return 17.0;
        return 0;
    },
};

const componentLibrary: { type: ComponentType, value?: number, label: string, icon: string }[] = [
    // Passive Components
    { type: 'distance', value: 1, label: 'Kabel 1km', icon: '〰️' },
    { type: 'connector', label: 'ODF', icon: '🗄️' },
    { type: 'splice', label: 'Sambungan', icon: '↔️' },
    { type: 'connector', label: 'Roset', icon: '🔌' },
    // Splitters
    { type: 'splitter', value: 2, label: 'Splitter 1:2', icon: '➗' },
    { type: 'splitter', value: 4, label: 'Splitter 1:4', icon: '➗' },
    { type: 'splitter', value: 8, label: 'Splitter 1:8', icon: '➗' },
    { type: 'splitter', value: 16, label: 'Splitter 1:16', icon: '➗' },
];

const SFP_CAPACITY = {
    gpon: 128,
    epon: 64,
};

export default function FTTHSimulator({ onComplete, disabled }: { onComplete?: () => void, disabled?: boolean }) {
    const [oltPower, setOltPower] = useState(7);
    const [topology, setTopology] = useState<TopologyComponent[]>([]);

    // onComplete is called when the simulation is "complete" (e.g., a valid power budget is achieved)
    const addComponent = (comp: typeof componentLibrary[0]) => {
        const newComponent: TopologyComponent = { 
            id: Date.now() + Math.random(), 
            type: comp.type, value: comp.value || 0, label: comp.label 
        };
        setTopology([...topology, newComponent]);
    };

    const removeComponent = (id: number) => {
        // Only allow removal if not disabled
        if (!disabled) {
            setTopology(topology.filter(c => c.id !== id));
        }
    };

    const [sfpType, setSfpType] = useState<'gpon' | 'epon'>('gpon');

    const { totalLoss, ontPower, totalClients } = useMemo(() => {
        let loss = 0;
        let clients = 1; // Start with 1, multiply by each splitter ratio

        topology.forEach(comp => {
            if (comp.type === 'distance') {
                loss += comp.value * LOSS_VALUES.distance;
            } else if (comp.type === 'splice') {
                loss += LOSS_VALUES.splice;
            } else if (comp.type === 'connector') {
                loss += LOSS_VALUES.connector;
            } else if (comp.type === 'splitter') {
                loss += LOSS_VALUES.splitter(comp.value);
                clients *= comp.value; // Multiply client count by splitter ratio
            }
        });

        return {
            totalLoss: loss,
            ontPower: oltPower - loss,
            // If no splitter is added, client count is 0 for this simulation's purpose
            totalClients: clients > 1 ? clients : 0
        };
    }, [topology, oltPower]);

    const getStatus = (power: number) => {
        if (power >= -24) return { text: 'BAIK', color: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30' };
        if (power >= -27) return { text: 'CUKUP', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30' };
        return { text: 'BURUK / LOS', color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30' };
    };

    useEffect(() => {
        if (!disabled && ontPower >= -24 && totalClients > 0) { // Example condition for "completion"
            onComplete?.();
        }
    }, [ontPower, totalClients, onComplete, disabled]);

    const status = getStatus(ontPower);

    const clientCapacity = SFP_CAPACITY[sfpType];
    const clientStatus = getClientStatus(totalClients, clientCapacity);

    function getClientStatus(clients: number, capacity: number) {
        if (clients > capacity) return { text: 'KAPASITAS PENUH', color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30' };
        return { text: 'OK', color: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30' };
    }

    return (
        <div className="bg-[#0d1525]/50 border border-[rgba(0,212,255,0.1)] rounded-xl p-6 lg:p-8">
            <h2 className="font-display text-xl font-bold text-center text-[#00d4ff] mb-2">Simulator Power Budget FTTH</h2>
            <p className="text-center text-[#64748b] font-mono text-sm mb-8">Bangun topologi jaringan dan hitung redaman akhirnya.</p>

            {/* Main Simulator Layout */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* Toolbox */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="font-display font-bold text-white">Toolbox Komponen</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {componentLibrary.map((comp, index) => (
                            <button
                                key={index}
                                onClick={() => addComponent(comp)}
                                disabled={disabled}
                                className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(0,212,255,0.3)] hover:bg-[#111827] transition-all text-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="text-2xl">{comp.icon}</div>
                                <div className="font-mono text-xs text-white mt-2">{comp.label}</div>
                            </button>
                        ))}
                    </div>
                    <div className="pt-4 space-y-4 border-t border-[rgba(255,255,255,0.05)]">
                        <label className="block font-mono text-[10px] text-[#4a5568] uppercase mb-2">Daya Output OLT</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                min="3"
                                max="9"
                                step="1"
                                value={oltPower}
                                onChange={e => setOltPower(Number(e.target.value))}
                                className="w-full"
                                disabled={disabled}
                            />
                            <span className="font-mono text-sm font-bold text-[#00d4ff] w-20 text-center">+{oltPower}.0 dBm</span>
                        </div>
                        <div>
                            <label className="block font-mono text-[10px] text-[#4a5568] uppercase mb-2">Jenis SFP OLT</label>
                            <div className="flex gap-2">
                                <button onClick={() => setSfpType('gpon')} disabled={disabled}
                                    className={`flex-1 p-2 rounded-md text-xs font-mono transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${sfpType === 'gpon' ? 'bg-[#00d4ff] text-black font-bold' : 'bg-[#07090f] hover:bg-[#111827] text-white'}`}>
                                    GPON <span className="text-[10px]">({SFP_CAPACITY.gpon} Client)</span>
                                </button>
                                <button onClick={() => setSfpType('epon')} className={`flex-1 p-2 rounded-md text-xs font-mono transition-colors ${sfpType === 'epon' ? 'bg-[#00d4ff] text-black font-bold' : 'bg-[#07090f] hover:bg-[#111827] text-white'}`}>
                                    EPON <span className="text-[10px]">({SFP_CAPACITY.epon} Client)</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Topology & Results */}
                <div className="lg:col-span-2">
                    <h3 className="font-display font-bold text-white mb-4">Topologi Jaringan</h3>
                    <div className="flex items-center gap-2 flex-wrap p-4 min-h-24 rounded-xl border-2 border-dashed border-[rgba(0,212,255,0.15)] bg-[#07090f] relative">
                        <div className="flex-shrink-0 text-center p-2">
                            <div className="text-2xl">🏢</div>
                            <div className="font-mono text-xs text-[#00d4ff]">OLT</div>
                            <div className="font-mono text-[9px] text-white">+{oltPower}.0 dBm</div>
                        </div>
                        <div className="text-2xl text-[#4a5568]">→</div>

                        {disabled && (
                            <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center text-white text-lg font-bold">
                                Simulasi Selesai
                            </div>
                        )}

                        {topology.map(comp => {
                            const loss = comp.type === 'splitter' ? LOSS_VALUES.splitter(comp.value) : comp.type === 'distance' ? comp.value * LOSS_VALUES.distance : LOSS_VALUES[comp.type];
                            return (
                                <div key={comp.id} className="flex items-center gap-2">
                                    <div className="relative group text-center p-2 rounded-lg hover:bg-red-500/10">
                                        <div className="text-2xl">{componentLibrary.find(c => c.label === comp.label)?.icon}</div>
                                        <div className="font-mono text-xs text-white">{comp.label}</div>
                                        <div className="font-mono text-[9px] text-red-400">-{loss.toFixed(1)}dB</div>
                                        {!disabled && (
                                            <button onClick={() => removeComponent(comp.id)} className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] hidden group-hover:flex items-center justify-center">✕</button>
                                        )}
                                    </div>
                                    <div className="text-2xl text-[#4a5568]">→</div>
                                </div>
                            );
                        })}

                        <div className="flex-shrink-0 text-center p-2">
                            <div className="text-2xl">🏠</div>
                            <div className="font-mono text-xs text-[#00d4ff]">ONT</div>
                            <div className={`font-mono text-[9px] font-bold ${status.color}`}>{ontPower.toFixed(2)} dBm</div>
                        </div>

                        {topology.length === 0 && (
                            <div className="text-center flex-1 text-[#4a5568] font-mono text-xs">
                                Tambahkan komponen dari toolbox untuk membangun jaringan...
                            </div>
                        )}
                    </div>

                    {/* Results Panel */}
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.08)] text-center">
                            <div className="font-mono text-[10px] text-[#4a5568] uppercase">Total Redaman</div>
                            <div className="font-display text-2xl font-bold text-red-400 mt-1">-{totalLoss.toFixed(2)} dB</div>
                        </div>
                        <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.08)] text-center">
                            <div className="font-mono text-[10px] text-[#4a5568] uppercase">Daya Terima ONT</div>
                            <div className={`font-display text-2xl font-bold ${status.color} mt-1`}>{totalClients > 0 ? ontPower.toFixed(2) : '-'} dBm</div>
                        </div>
                        <div className={`p-4 rounded-lg border text-center transition-colors ${status.bgColor} ${status.borderColor}`}>
                            <div className="font-mono text-[10px] text-[#4a5568] uppercase">Status Sinyal</div>
                            <div className={`font-display text-2xl font-bold ${status.color} mt-1`}>{status.text}</div>
                        </div>
                        <div className={`p-4 rounded-lg border text-center transition-colors ${clientStatus.bgColor} ${clientStatus.borderColor}`}>
                            <div className="font-mono text-[10px] text-[#4a5568] uppercase">Kapasitas Klien</div>
                            <div className="font-display text-lg font-bold text-white mt-1">
                                {totalClients}
                                <span className="text-xs text-[#64748b]"> / {clientCapacity}</span>
                            </div>
                            <div className={`font-mono text-[10px] font-bold ${clientStatus.color}`}>{clientStatus.text}</div>
                        </div>
                    </div>
                    <div className="text-center mt-4">
                        <button onClick={() => setTopology([])} className="font-mono text-[10px] text-[#4a5568] hover:text-red-400 transition-colors">Reset Topologi</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
