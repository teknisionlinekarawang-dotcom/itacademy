import { Link } from 'react-router-dom';
import MappingFTTH from '../materi/MappingFTTH';

export default function FiberOpticMappingPage() {
    return (
        <div className="min-h-screen grid-bg p-6 lg:p-8 text-white">
            <div className="max-w-7xl mx-auto">
                {/* Header Materi */}
                <div className="mb-8">
                    <Link to="/module/fiber-optic" className="text-cyan-400 hover:underline text-sm inline-block mb-4">
                        &larr; Kembali ke Materi Fiber Optic Lanjutan
                    </Link>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">🗺️</span>
                        <h1 className="font-display text-2xl lg:text-3xl font-bold text-white">
                            Mapping &amp; Penempatan ODP — Jaringan FTTH
                        </h1>
                    </div>
                    <p className="text-[#94a3b8] text-base lg:text-lg max-w-3xl">
                        Pelajari cara memetakan dan menempatkan ODP (Optical Distribution Pack) pada jaringan
                        Fiber-to-the-Home: konsep ODN, aturan radius &amp; splitter, tahapan survey, naming
                        convention, hingga perhitungan kebutuhan ODP.
                    </p>
                </div>

                {/* Konten Materi (termasuk Simulator Interaktif di akhir section) */}
                <div className="bg-[#0d1525]/50 border border-[rgba(0,212,255,0.1)] rounded-xl p-6 lg:p-8 mb-6">
                    <MappingFTTH />
                </div>
            </div>
        </div>
    );
}
