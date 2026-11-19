import { useState } from "react";
import FiberOpticContent from "../materi/FiberOpticContent.tsx";
import FiberOpticAdvancedContent from "../materi/FiberOpticAdvancedContent.tsx";
import FTTHSimulator from "../simulator/FTTHSimulator.tsx";

export default function FiberOpticPage() {
    const [showAdvanced, setShowAdvanced] = useState(false);

    return (
        <div className="min-h-screen grid-bg p-6 lg:p-8 text-white">
            <div className="max-w-7xl mx-auto">
                {/* Header Materi */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">✨</span>
                        <h1 className="font-display text-2xl lg:text-3xl font-bold text-white">
                            Pengenalan Fiber Optic & FTTH
                        </h1>
                    </div>
                    <p className="text-[#94a3b8] text-base lg:text-lg max-w-3xl">
                        Pahami cara kerja jaringan fiber optic dan simulasikan perhitungan power budget pada topologi Fiber to the Home (FTTH).
                    </p>
                </div>

                {/* Simulator */}
                <div className="mb-8">
                </div>
                {/* Konten Materi */}
                <div className="bg-[#0d1525]/50 border border-[rgba(0,212,255,0.1)] rounded-xl p-6 lg:p-8">
                    {!showAdvanced && (
                        <div>
                        <FiberOpticContent />
                        <div className="pt-8 mt-8 border-t border-[rgba(0,212,255,0.1)] text-center">
                            <button
                                onClick={() => setShowAdvanced(true)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00d4ff] text-[#07090f] font-display font-bold text-sm hover:bg-white transition-all duration-200 glow-cyan"
                            >
                                <span>Lanjutkan ke Materi Lanjutan</span>
                                <span>→</span>
                            </button>
                        </div>
                    </div>
                    )}

                    {/* Konten Lanjutan (ditampilkan setelah tombol diklik) */}
                    {showAdvanced && (
                        <div>
                            <FiberOpticAdvancedContent />
                            <div className="mt-8">
                                {/* <OpticSimulation /> */}
                                <FTTHSimulator />

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}