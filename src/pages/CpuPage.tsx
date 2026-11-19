import CpuContent from "../materi/CpuContent.tsx";
import { Link } from "react-router-dom";

export default function CpuPage() {
    return (
        <div className="min-h-screen grid-bg p-6 lg:p-8 text-white">
            <div className="max-w-7xl mx-auto">
                <Link to="/module/basic-computer" className="text-cyan-400 hover:underline mb-6 block">&larr; Kembali ke Dasar Komputer</Link>
                {/* Header Materi */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">🧠</span>
                        <h1 className="font-display text-2xl lg:text-3xl font-bold text-white">
                            Detail CPU: Otak Komputer
                        </h1>
                    </div>
                    <p className="text-[#94a3b8] text-base lg:text-lg max-w-3xl">
                        Selami lebih dalam tentang Central Processing Unit (CPU), dari sejarah chip pertama hingga miliaran transistor di dalamnya.
                    </p>
                </div>

                {/* Konten Materi */}
                <div className="bg-[#0d1525]/50 border border-[rgba(0,212,255,0.1)] rounded-xl p-6 lg:p-8">
                    <CpuContent />
                </div>
            </div>
        </div>
    );
}