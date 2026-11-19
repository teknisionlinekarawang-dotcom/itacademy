import React, { useState } from 'react';
import ImagePlaceholder from '../components/ImagePlaceholder';
import { Link } from 'react-router-dom';

const SectionTitle = ({ number, title }: { number: number, title: string }) => (
    <h2 className="font-display text-xl font-bold text-[#00d4ff] mb-4 border-t border-[rgba(0,212,255,0.1)] pt-8 mt-8">
        <span className="text-base text-[#4a5568] mr-2">{number}.</span>{title}
    </h2>
);

const Code = ({ children }: { children: React.ReactNode }) => (
    <code className="font-mono bg-[#1a2535] px-1.5 py-0.5 rounded-md text-[#f59e0b] text-sm">{children}</code>
);

const scaleItems = [
    { name: 'Rambut Manusia', size: 70000, color: '#a855f7', info: 'Diameter rata-rata rambut manusia.' },
    { name: 'Sel Darah Merah', size: 7000, color: '#ef4444', info: 'Ukuran sel darah merah yang membawa oksigen.' },
    { name: 'Virus (COVID-19)', size: 100, color: '#f59e0b', info: 'Ukuran partikel virus SARS-CoV-2.' },
    { name: 'Transistor Modern', size: 5, color: '#00d4ff', info: 'Ukuran "gate" pada prosesor 5nm.' },
    { name: 'Atom Silikon', size: 0.2, color: '#10b981', info: 'Diameter satu atom silikon.' },
];

const NanometerScaleSimulator = () => {
    const [selectedIndex, setSelectedIndex] = useState(3); // Default to Transistor
    const selectedItem = scaleItems[selectedIndex];
    const containerWidth = 300; // Lebar kontainer visualisasi dalam px

    return (
        <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.08)] my-4">
            <div className="flex flex-col items-center">
                <p className="font-mono text-xs text-center text-[#64748b] mb-4">Pilih objek untuk dibandingkan dengan Transistor 5nm:</p>
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {scaleItems.map((item, index) => (
                        <button
                            key={item.name}
                            onClick={() => setSelectedIndex(index)}
                            className={`font-mono text-[10px] px-2 py-1 rounded-full border transition-all ${selectedIndex === index ? 'text-black font-bold' : 'text-gray-400'}`}
                            style={{
                                backgroundColor: selectedIndex === index ? item.color : 'transparent',
                                borderColor: item.color,
                            }}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>

                <div className="w-full max-w-sm text-center">
                    <h4 className="font-bold text-lg" style={{ color: selectedItem.color }}>{selectedItem.name} ({selectedItem.size} nm)</h4>
                    <p className="text-xs text-[#64748b] mb-4">{selectedItem.info}</p>
                    <div className="relative h-20 flex items-center justify-center bg-black/20 rounded-md p-2 overflow-hidden">
                        <div
                            className="absolute transition-all duration-300 ease-out"
                            style={{
                                width: `${Math.max(1, (selectedItem.size / 5) * (containerWidth / 100))}px`, // Skalakan relatif terhadap transistor 5nm
                                height: `${Math.max(1, (selectedItem.size / 5) * (containerWidth / 100))}px`,
                                backgroundColor: selectedItem.color,
                                boxShadow: `0 0 15px ${selectedItem.color}`,
                                borderRadius: selectedItem.name === 'Atom Silikon' ? '50%' : '2px',
                            }}
                        ></div>
                        <p className="absolute bottom-1 right-2 font-mono text-[9px] text-gray-600">Skala relatif terhadap Transistor 5nm</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function CpuContent() {
    return (
        <div className="space-y-4 text-[#b0c4de] leading-relaxed text-sm">
            <div className="mb-8">
                <Link to="/dashboard" className="text-cyan-400 hover:underline text-sm">&larr; Kembali ke Dashboard</Link>
            </div>
            <p>
                Central Processing Unit (CPU) adalah "otak" dari setiap komputer. Ini adalah sirkuit elektronik yang menjalankan instruksi yang membentuk program komputer. CPU melakukan operasi aritmatika, logika, kontrol, dan input/output dasar yang ditentukan oleh instruksi dalam program.
            </p>

            <SectionTitle number={1} title="Sejarah Singkat Chip CPU" />
            <p>
                Perjalanan CPU dimulai dari komponen-komponen terpisah hingga menjadi satu chip terintegrasi yang kompleks.
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs">
                <li><strong className="text-white">1940-an - Komputer Awal:</strong> CPU masih berupa kumpulan tabung vakum dan relay yang besar, tidak dalam bentuk chip tunggal.</li>
                <li><strong className="text-white">1960-an - Sirkuit Terpadu (IC):</strong> Penemuan IC memungkinkan banyak transistor ditempatkan pada satu keping silikon, membuka jalan bagi mikroprosesor.</li>
                <li><strong className="text-white">1971 - Intel 4004:</strong> Dianggap sebagai mikroprosesor komersial pertama. Ini adalah CPU 4-bit yang dirancang oleh Intel untuk kalkulator Busicom. Ini adalah tonggak sejarah karena menyatukan semua fungsi pemrosesan pada satu chip.</li>
                <li><strong className="text-white">1978 - Intel 8086:</strong> Mikroprosesor 16-bit yang menjadi dasar arsitektur x86, yang masih dominan di komputer pribadi hingga saat ini.</li>
                <li><strong className="text-white">1990-an - Era Pentium:</strong> Intel meluncurkan seri Pentium, membawa peningkatan kecepatan dan kemampuan multimedia yang signifikan.</li>
                <li><strong className="text-white">2000-an - Multi-core:</strong> Munculnya CPU dengan banyak inti (core) untuk meningkatkan kinerja multitasking dan pemrosesan paralel.</li>
            </ul>
            <ImagePlaceholder
                src="https://spectrum.ieee.org/media-library/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbWFnZSI6Imh0dHBzOi8vYXNzZXRzLnJibC5tcy8yNjc4MzU3My9vcmlnaW4uanBnIiwiZXhwaXJlc19hdCI6MTY2OTYwNjU1NH0.I8K3gGB_oQWRWqfPCsr9YxdX00Wsh-cYDaMScsEBJao/image.jpg"
                alt="Gambar Chip Intel 4004"
                caption="Intel 4004, mikroprosesor komersial pertama."
            />

            <SectionTitle number={2} title="CPU: Miliaran Transistor dalam Satu Sirkuit" />
            <p>
                Inti dari CPU adalah transistor, saklar elektronik kecil yang dapat ON atau OFF (mewakili 1 atau 0 dalam biner). Kemajuan teknologi manufaktur telah memungkinkan penempatan miliaran transistor ini pada satu chip silikon yang sangat kecil. Semakin banyak transistor, semakin kompleks dan cepat CPU dapat memproses data.
            </p>
            <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                <h4 className="font-bold text-white mb-2">Fakta Jumlah Transistor (Perkiraan):</h4>
                <ul className="list-disc list-inside space-y-1 text-xs">
                    <li><strong className="text-white">Intel 4004 (1971):</strong> Sekitar <Code>2.300</Code> transistor.</li>
                    <li><strong className="text-white">Intel Pentium (1993):</strong> Sekitar <Code>3,1 juta</Code> transistor.</li>
                    <li><strong className="text-white">Intel Core i7 (Generasi Awal, 2008):</strong> Sekitar <Code>731 juta</Code> transistor.</li>
                    <li><strong className="text-white">Apple M1 (2020):</strong> Sekitar <Code>16 miliar</Code> transistor.</li>
                    <li><strong className="text-white">Intel Core i9 (Generasi Terbaru, 2023):</strong> Lebih dari <Code>100 miliar</Code> transistor (tergantung model dan arsitektur).</li>
                </ul>
                <p className="text-xs mt-2 text-[#64748b]">
                    Peningkatan eksponensial ini dikenal sebagai Hukum Moore, yang menyatakan bahwa jumlah transistor pada sirkuit terpadu akan berlipat ganda setiap dua tahun.
                </p>
            </div>
            <ImagePlaceholder
                src="https://www.pingdom.com/wp-content/uploads/2012/02/microprocessor-size.001.jpg"
                alt="Grafik Kepadatan Transistor CPU"
                caption="Peningkatan jumlah transistor pada CPU dari waktu ke waktu."
            />

            <SectionTitle number={3} title="Arsitektur & Komponen Internal CPU" />
            <p>
                Meskipun terlihat seperti satu unit, CPU modern terdiri dari beberapa komponen utama yang bekerja sama:
            </p>
            <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-white">Arithmetic Logic Unit (ALU):</strong> Melakukan operasi aritmatika (penjumlahan, pengurangan) dan logika (AND, OR, NOT).</li>
                <li><strong className="text-white">Control Unit (CU):</strong> Mengelola dan mengkoordinasikan semua komponen CPU, mengambil instruksi dari memori, mendekode, dan mengeksekusinya.</li>
                <li><strong className="text-white">Registers:</strong> Memori kecil dan sangat cepat di dalam CPU yang digunakan untuk menyimpan data sementara yang sedang diproses.</li>
                <li><strong className="text-white">Cache Memory:</strong> Memori super cepat yang menyimpan salinan data dan instruksi yang paling sering diakses dari RAM, mengurangi waktu akses ke memori utama.</li>
                <li><strong className="text-white">Socket Processor:</strong> Meskipun bukan bagian internal CPU, ini adalah komponen krusial di motherboard yang berfungsi sebagai dudukan atau tempat untuk memasang CPU.</li>
            </ul>

            <div className="text-right mt-2">
                <Link to="/module/socket-details" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#00d4ff]/10 text-[#00d4ff] font-mono text-xs hover:bg-[#00d4ff]/20 transition-colors">
                    Pelajari Lebih Lanjut tentang Socket PC →
                </Link>
            </div>

            <ImagePlaceholder
                src="https://hips.hearstapps.com/pop.h-cdn.co/assets/16/37/2048x1365/gallery-1473786750-gettyimages-107253611.jpg"
                alt="Diagram Arsitektur Internal CPU"
                caption="Komponen utama di dalam sebuah CPU."
            />

            <SectionTitle number={4} title="Skala Nanometer: Dunia di Dalam CPU" />
            <p>
                Ketika kita mendengar istilah seperti "prosesor 7nm" atau "5nm", angka tersebut merujuk pada skala proses manufaktur, khususnya ukuran salah satu bagian terkecil dari transistor, yaitu <strong className="text-white">panjang gerbang (gate length)</strong>. Ukuran ini sangat kecil, bahkan mendekati ukuran beberapa molekul.
            </p>
            <p>
                Sebagai perbandingan, satu atom silikon memiliki diameter sekitar <Code>0.2 nanometer</Code>. Ini berarti sebuah "gate" transistor 5nm hanya setebal sekitar <strong className="text-white">25 atom silikon</strong> yang disusun berjajar. Simulator di bawah ini akan membantu Anda memvisualisasikan betapa kecilnya skala ini.
            </p>
            <NanometerScaleSimulator />

            <SectionTitle number={5} title="Faktor-faktor yang Mempengaruhi Kinerja CPU" />
            <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-white">Clock Speed (Kecepatan Clock):</strong> Diukur dalam Gigahertz (GHz), menunjukkan berapa banyak siklus instruksi yang dapat dijalankan CPU per detik.</li>
                <li><strong className="text-white">Jumlah Core:</strong> Semakin banyak core, semakin banyak tugas yang dapat dijalankan secara paralel.</li>
                <li><strong className="text-white">Ukuran Cache:</strong> Cache yang lebih besar dapat menyimpan lebih banyak data yang sering digunakan, mengurangi ketergantungan pada RAM yang lebih lambat.</li>
                <li><strong className="text-white">Arsitektur:</strong> Desain internal CPU yang menentukan efisiensi dalam menjalankan instruksi.</li>
            </ul>
            <ImagePlaceholder
                src="https://via.placeholder.com/600x400?text=CPU+Performance+Factors"
                alt="Faktor-faktor Kinerja CPU"
                caption="Diagram yang menunjukkan faktor-faktor yang mempengaruhi kinerja CPU."
            />
        </div>
    );
}