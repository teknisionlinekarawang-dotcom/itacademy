import { useState } from 'react';
import IPAddressSimulator from '../simulator/IPAddressSimulator.tsx';
import IPAddressContent from '../materi/IPAddressContent';
import SubnettingVisualizer from '../simulator/SubnettingVisualizer.tsx';

export default function IPAddressPage() {
    const [showSubnetting, setShowSubnetting] = useState(false);

    return (
        <div className="min-h-screen grid-bg p-6 lg:p-8 text-white">
            <div className="max-w-7xl mx-auto">
                {/* Header Materi */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">📡</span>
                        <h1 className="font-display text-2xl lg:text-3xl font-bold text-white">
                            Pengenalan IP Address
                        </h1>
                    </div>
                    <p className="text-[#94a3b8] text-base lg:text-lg max-w-3xl">
                        IP Address (Internet Protocol Address) adalah label numerik yang diberikan ke setiap perangkat yang terhubung ke jaringan komputer berbasis Internet Protocol. Singkatnya, IP address berfungsi sebagai identitas unik sekaligus alamat lokasi logis agar perangkat bisa saling menemukan dan bertukar data.
                    </p>
                </div>

                {/* Area Simulasi Interaktif */}
                <div className="bg-[#0d1525]/50 border border-[rgba(0,212,255,0.1)] rounded-xl p-6 lg:p-8">
                    <IPAddressSimulator />
                </div>

                {/* Accordion untuk Subnetting Visualizer */}
                <div className="mt-8 bg-[#0d1525]/50 border border-[rgba(0,212,255,0.1)] rounded-xl">
                    <button
                        onClick={() => setShowSubnetting(!showSubnetting)}
                        className="w-full flex items-center justify-between p-6 text-left"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🌐</span>
                            <div>
                                <h2 className="font-display text-lg font-bold text-white">
                                    Buka Subnetting Visualizer
                                </h2>
                                <p className="font-mono text-xs text-[#4a5568]">Gunakan alat ini untuk membantu menghitung subnet Anda.</p>
                            </div>
                        </div>
                        <span className={`transform transition-transform duration-300 ${showSubnetting ? 'rotate-180' : ''}`}>
                            ▼
                        </span>
                    </button>
                    {showSubnetting && (
                        <div className="p-6 border-t border-[rgba(0,212,255,0.1)]">
                            <SubnettingVisualizer />
                        </div>
                    )}
                </div>

                {/* Konten Materi Tambahan */}
                <div className="mt-8 bg-[#0d1525]/50 border border-[rgba(0,212,255,0.1)] rounded-xl p-6 lg:p-8">
                    <h2 className="font-display text-xl font-bold text-center text-white mb-4">Materi Pendukung</h2>
                    <IPAddressContent />
                </div>
            </div>
        </div>
    );
}