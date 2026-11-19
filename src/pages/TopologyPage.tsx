import { useState } from "react";
import TopologyContent from "../materi/TopologyContent";
import TopologySimulator from "../simulator/TopologySimulator.tsx";
import TopologyAdvancedContent from "../materi/TopologyAdvancedContent.tsx";
import NetworkScaleSimulator from "../simulator/NetworkScaleSimulator.tsx";

export default function TopologyPage() {
    const [showAdvanced, setShowAdvanced] = useState(false);

    return (
        <div className="min-h-screen grid-bg p-6 lg:p-8 text-white">
            <div className="max-w-7xl mx-auto">
                {/* Header Materi */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">🕸️</span>
                        <h1 className="font-display text-2xl lg:text-3xl font-bold text-white">
                            Dasar Dasar Jaringan
                        </h1>
                    </div>
                    <p className="text-[#94a3b8] text-base lg:text-lg max-w-3xl">
                        Pahami berbagai cara untuk menyusun perangkat dalam sebuah jaringan dan lihat bagaimana data mengalir di setiap desain.
                    </p>
                </div>

                {/* Konten Dasar */}
                <div className={showAdvanced ? 'hidden' : ''}>
                    <div className="mb-8">
                        <TopologySimulator />
                    </div>
                    <div className="bg-[#0d1525]/50 border border-[rgba(0,212,255,0.1)] rounded-xl p-6 lg:p-8">
                        <TopologyContent />
                        <div className="pt-8 mt-8 border-t border-[rgba(0,212,255,0.1)] text-center">
                            <button
                                onClick={() => setShowAdvanced(true)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00d4ff] text-[#07090f] font-display font-bold text-sm hover:bg-white transition-all duration-200 glow-cyan"
                            >
                                <span>Lanjutkan: Skala Jaringan</span>
                                <span>→</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Konten Lanjutan */}
                {showAdvanced && (
                    <div>
                        <div className="mb-8">
                            <NetworkScaleSimulator />
                        </div>
                        <div className="bg-[#0d1525]/50 border border-[rgba(0,212,255,0.1)] rounded-xl p-6 lg:p-8">
                            <TopologyAdvancedContent />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}