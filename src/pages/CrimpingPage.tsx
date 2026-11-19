import CrimpingContent from "../materi/CrimpingContent.tsx";
import CrimpingSimulator from "../simulator/CrimpingSimulator.tsx";

export default function CrimpingPage() {
    return (
        <div className="min-h-screen grid-bg p-6 lg:p-8 text-white">
            <div className="max-w-7xl mx-auto">
                {/* Header Materi */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">🔌</span>
                        <h1 className="font-display text-2xl lg:text-3xl font-bold text-white">
                            Pengenalan Kabel UTP & Crimping
                        </h1>
                    </div>
                    <p className="text-[#94a3b8] text-base lg:text-lg max-w-3xl">
                        Pelajari komponen dasar kabel jaringan dan praktikkan cara memasangnya dengan benar menggunakan simulator interaktif.
                    </p>
                </div>

                {/* Konten Materi */}
                <div className="mb-8 bg-[#0d1525]/50 border border-[rgba(0,212,255,0.1)] rounded-xl p-6 lg:p-8">
                    <CrimpingContent />
                </div>

                {/* Simulator */}
                <CrimpingSimulator />
            </div>
        </div>
    );
}