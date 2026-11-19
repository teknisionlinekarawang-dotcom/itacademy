import RamStorageContent from "../materi/RamStorageContent.tsx";
import { Link } from "react-router-dom";

export default function RamStoragePage() {
    return (
        <div className="min-h-screen grid-bg p-6 lg:p-8 text-white">
            <div className="max-w-7xl mx-auto">
                <Link to="/module/basic-computer" className="text-cyan-400 hover:underline mb-6 block">&larr; Kembali ke Dasar Komputer</Link>
                {/* Header Materi */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">💾</span>
                        <h1 className="font-display text-2xl lg:text-3xl font-bold text-white">
                            RAM & Storage: Evolusi Memori
                        </h1>
                    </div>
                    <p className="text-[#94a3b8] text-base lg:text-lg max-w-3xl">
                        Jelajahi perbedaan antara RAM dan Storage, serta bagaimana teknologi penyimpanan data telah berevolusi dari pita magnetik hingga Project Silica.
                    </p>
                </div>

                {/* Konten Materi */}
                <div className="bg-[#0d1525]/50 border border-[rgba(0,212,255,0.1)] rounded-xl p-6 lg:p-8">
                    <RamStorageContent />
                </div>
            </div>
        </div>
    );
}