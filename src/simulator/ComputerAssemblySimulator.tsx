import { useState } from 'react';

const components = {
    motherboard: { 
        name: 'Motherboard', 
        desc: 'Papan sirkuit utama yang menjadi "tulang punggung" dan menghubungkan semua komponen agar dapat berkomunikasi.',
        img: '/media/pc/mobo.png',
        process: 'Menyediakan jalur komunikasi (bus) antar CPU, RAM, GPU, dan SSD. Mengatur aliran daya dari PSU.'
    },
    cpu: { 
        name: 'CPU (Central Processing Unit)', 
        desc: 'Otak komputer, menjalankan semua instruksi dan pemrosesan data.',
        img: '/media/pc/cpu.png',
        process: 'Saat game berjalan, CPU memproses logika game, fisika, dan AI. Ia mengirimkan perintah render ke GPU dan mengambil data dari RAM.'
    },
    ram: { 
        name: 'RAM (Random Access Memory)', 
        desc: 'Memori sementara berkecepatan tinggi untuk data yang sedang aktif digunakan.',
        img: '/media/pc/ram.png',
        process: 'Menyimpan aset game (model 3D, tekstur) yang sering diakses agar CPU dan GPU dapat mengambilnya dengan cepat tanpa harus membaca dari SSD yang lebih lambat.'
    },
    gpu: { 
        name: 'GPU (Graphics Processing Unit)', 
        desc: 'Komponen khusus untuk memproses dan menghasilkan output grafis ke monitor.',
        img: '/media/pc/gpu.png',
        process: 'Menerima perintah dari CPU, lalu merender jutaan poligon, tekstur, dan efek pencahayaan untuk menciptakan gambar yang Anda lihat di layar.'
    },
    ssd: { 
        name: 'SSD (Solid State Drive)', 
        desc: 'Penyimpanan data permanen berkecepatan tinggi untuk sistem operasi, game, dan file.',
        img: '/media/pc/ssd.png',
        process: 'Saat game dimulai, SSD memuat data game ke dalam RAM. Selama bermain, ia menyediakan data aset baru saat dibutuhkan (misal: loading level baru).'
    },
    psu: { 
        name: 'PSU (Power Supply Unit)', 
        desc: 'Mengubah listrik dari stopkontak dan memberikan daya ke seluruh komponen.',
        img: '/media/pc/psu.png',
        process: 'Menyediakan daya listrik dengan voltase yang tepat untuk motherboard, CPU, GPU, dan semua komponen lain agar dapat beroperasi.'
    },
};

type ComponentKey = keyof typeof components;
const componentKeys = Object.keys(components) as ComponentKey[];

export default function ComputerAssemblySimulator() {
    const [installed, setInstalled] = useState<Record<ComponentKey, boolean>>({
        motherboard: true, // Motherboard terpasang secara default
        cpu: false,
        ram: false,
        gpu: false,
        ssd: false,
        psu: false,
    });
    const [selected, setSelected] = useState<ComponentKey>('motherboard');

    const handleInstall = (id: ComponentKey) => {
        setInstalled(prev => ({ ...prev, [id]: !prev[id] }));
        setSelected(id);
    };

    const PartSlot = ({ id, area, children }: { id: ComponentKey, area: string, children: React.ReactNode }) => (
        <div
            className={`absolute border-2 border-dashed rounded-md transition-all duration-200 flex items-center justify-center overflow-hidden
                ${installed[id] ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-white/10 hover:bg-white/10 hover:border-cyan-400 cursor-pointer'}`}
            style={{ gridArea: area }}
            onClick={() => setSelected(id)}
        >
            {installed[id] ? (
                <img src={components[id].img} alt={components[id].name} className="w-full h-full object-contain p-2" />
            ) : (
                <span className="font-mono text-xs text-white/50">{children}</span>
            )}
        </div>
    );

    return (
        <div className="bg-[#0d1525]/50 border border-[rgba(0,212,255,0.1)] rounded-xl p-6 lg:p-8">
            <h2 className="font-display text-xl font-bold text-center text-[#00d4ff] mb-2">Simulator Perakitan PC</h2>
            <p className="text-center text-[#64748b] font-mono text-sm mb-8">Klik komponen di rak untuk memasang/melepasnya, dan lihat alur kerjanya.</p>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* PC Case */}
                <div className="lg:col-span-2 aspect-square bg-[#07090f] rounded-xl p-4 border border-white/10 relative">
                    <div
                        className="relative w-full h-full grid gap-2"
                        style={{
                            gridTemplateAreas: `
                                "cpu cpu ram ram"
                                "cpu cpu ram ram"
                                ". . . ."
                                "gpu gpu gpu ."
                                "gpu gpu gpu ."
                                "ssd ssd psu psu"
                            `,
                            gridTemplateRows: '1fr 1fr 0.5fr 1.5fr 1.5fr 1fr',
                            gridTemplateColumns: '1fr 1fr 1fr 1fr',
                        }}
                        onClick={() => setSelected('motherboard')}
                    >
                        {/* Motherboard Background */}
                        <div className="absolute inset-0 rounded-lg">
                            <img src={components.motherboard.img} alt="Motherboard" className="w-full h-full object-cover opacity-30" />
                        </div>

                        <PartSlot id="cpu" area="cpu">CPU</PartSlot>
                        <PartSlot id="ram" area="ram">RAM</PartSlot>
                        <PartSlot id="gpu" area="gpu">GPU</PartSlot>
                        <PartSlot id="ssd" area="ssd">SSD</PartSlot>
                        <PartSlot id="psu" area="psu">PSU</PartSlot>
                    </div>
                </div>

                {/* Panels */}
                <div className="flex flex-col gap-4">
                    {/* Parts Bin */}
                    <div className="bg-[#07090f] rounded-xl p-4 border border-white/10">
                        <h3 className="font-display text-base font-bold text-white mb-3">Rak Komponen</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {componentKeys.filter(key => key !== 'motherboard').map(key => (
                                <button
                                    key={key}
                                    onClick={() => handleInstall(key)}
                                    className={`p-2 rounded-md border-2 transition-all text-center ${installed[key] ? 'bg-cyan-500/20 border-cyan-500' : 'bg-gray-700/50 border-gray-600 hover:border-cyan-400'}`}
                                >
                                    <img src={components[key].img} alt={components[key].name} className="w-10 h-10 mx-auto object-contain" />
                                    <span className="block font-mono text-[10px] text-white mt-1">{components[key].name.split(' ')[0]}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Info Panel */}
                    <div className="bg-[#07090f] rounded-xl p-6 border border-white/10 flex-grow flex flex-col justify-center">
                        {selected ? (
                            <div className="animate-fade-in">
                                <h3 className="font-display text-lg font-bold text-cyan-400">{components[selected].name}</h3>
                                <p className="text-sm text-gray-300 mt-2">{components[selected].desc}</p>
                                
                                {installed[selected] && (
                                    <div className="mt-4 pt-4 border-t border-dashed border-white/10">
                                        <h4 className="font-mono text-xs uppercase text-amber-400 mb-2">Alur Proses (Contoh: Gaming)</h4>
                                        <p className="text-xs text-gray-400 leading-relaxed">{components[selected].process}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 text-sm">Klik komponen di casing atau rak untuk melihat info.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
