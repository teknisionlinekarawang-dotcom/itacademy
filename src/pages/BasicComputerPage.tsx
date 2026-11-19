import BasicComputerContent from "../materi/BasicComputerContent.tsx";
import ComputerAssemblySimulator from "../simulator/ComputerAssemblySimulator.tsx";

export default function BasicComputerPage() {
    return (
        <div className="min-h-screen grid-bg p-6 lg:p-8 text-white">
            <div className="max-w-7xl mx-auto">
                {/* Header Materi */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">🖥️</span>
                        <h1 className="font-display text-2xl lg:text-3xl font-bold text-white">
                            Dasar-Dasar Komputer
                        </h1>
                    </div>
                    <p className="text-[#94a3b8] text-base lg:text-lg max-w-3xl">
                        Pahami anatomi komputer, dari komponen fisik (hardware) hingga program (software) yang menjalankannya.
                    </p>
                </div>

                {/* Simulator */}
                <div className="mb-8">
                    <ComputerAssemblySimulator />
                </div>

                {/* Konten Materi */}
                <div className="bg-[#0d1525]/50 border border-[rgba(0,212,255,0.1)] rounded-xl p-6 lg:p-8">
                    <BasicComputerContent />
                </div>
            </div>
        </div>
    );
}
