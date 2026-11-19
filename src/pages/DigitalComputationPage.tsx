import DigitalComputationContent from "../materi/DigitalComputationContent";
import DataConverterSimulator from "../simulator/DataConverterSimulator";

export default function DigitalComputationPage() {
    return (
        <div className="min-h-screen grid-bg p-6 lg:p-8 text-white">
            <div className="max-w-7xl mx-auto">
                {/* Header Materi */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">🔢</span>
                        <h1 className="font-display text-2xl lg:text-3xl font-bold text-white">
                            Dasar Komputasi Digital
                        </h1>
                    </div>
                    <p className="text-[#94a3b8] text-base lg:text-lg max-w-3xl">
                        Pahami bagaimana komputer merepresentasikan dan menghitung data menggunakan sistem biner, dari bit hingga terabyte.
                    </p>
                </div>

                {/* Simulator & Kalkulator */}
                <div className="mb-8">
                    <DataConverterSimulator />
                </div>

                {/* Konten Materi Utama */}
                <div className="bg-[#0d1525]/50 border border-[rgba(0,212,255,0.1)] rounded-xl p-6 lg:p-8">
                    <DigitalComputationContent />
                </div>
            </div>
        </div>
    );
}