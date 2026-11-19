import { useState } from 'react';
import { Link } from 'react-router-dom';
import FTTHMappingSimulator from '../simulator/FTTHMappingSimulator';

const SectionTitle = ({ number, title }: { number: number, title: string }) => (
    <h2 className="font-display text-xl font-bold text-[#00d4ff] mb-4 border-t border-[rgba(0,212,255,0.1)] pt-8 mt-4">
        <span className="text-base text-[#4a5568] mr-2">{number}.</span>{title}
    </h2>
);

const Code = ({ children }: { children: React.ReactNode }) => (
    <code className="font-mono bg-[#1a2535] px-1.5 py-0.5 rounded-md text-[#f59e0b] text-sm">{children}</code>
);

/* ---- Alur arsitektur ODN dari STO sampai pelanggan --------------------- */
const ODN_FLOW: { icon: string; label: string }[] = [
    { icon: '🏢', label: 'STO / OLT' },
    { icon: '🟡', label: 'Feeder Cable' },
    { icon: '🗄️', label: 'ODC' },
    { icon: '🔵', label: 'Distribution Cable' },
    { icon: '📦', label: 'ODP' },
    { icon: '🟢', label: 'Drop Cable' },
    { icon: '🔌', label: 'Roset' },
    { icon: '📺', label: 'ONT / Modem' },
];

export default function MappingFTTH() {
    /* ---- Kalkulator kebutuhan ODP --------------------------------------- */
    const [homes, setHomes] = useState<number>(32);

    const safeHomes = Math.max(1, Math.min(500, homes || 0));
    const units8 = Math.ceil(safeHomes / 8);
    const units16 = Math.ceil(safeHomes / 16);

    return (
        <div className="space-y-6 text-[#b0c4de] leading-relaxed text-sm">
            {/* Kembali ke materi sebelumnya */}
            <div>
                <Link to="/module/fiber-optic" className="text-cyan-400 hover:underline text-sm">
                    &larr; Kembali ke Materi Fiber Optic Lanjutan
                </Link>
            </div>

            <SectionTitle number={1} title="Konsep Dasar Jaringan ODN (Optical Distribution Network)" />
            <p>
                Sebelum melakukan mapping ODP, Anda harus memahami posisi ODP dalam arsitektur FTTH. Alur kabel optik umumnya adalah:
            </p>

            {/* Diagram alur ODN */}
            <div className="bg-[#07090f] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 overflow-x-auto">
                <div className="flex items-center gap-1 min-w-max justify-center">
                    {ODN_FLOW.map((f, i) => (
                        <div key={f.label} className="flex items-center gap-1">
                            <div className={`flex flex-col items-center w-24 py-2 rounded-lg border ${f.label === 'ODP' ? 'bg-[rgba(0,212,255,0.08)] border-[#00d4ff]/40' : 'bg-[#0d1525] border-white/10'}`}>
                                <span className="text-xl">{f.icon}</span>
                                <span className={`mt-1 text-[10px] font-mono text-center leading-tight px-1 ${f.label === 'ODP' ? 'text-[#00d4ff]' : 'text-[#94a3b8]'}`}>{f.label}</span>
                            </div>
                            {i < ODN_FLOW.length - 1 && <span className="text-[#00d4ff]/60 text-lg flex-shrink-0">→</span>}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">🗄️ ODC (Kapasitas Besar)</h4>
                    <p className="text-xs">Tempat <strong className="text-white">splitter tahap pertama</strong> (biasanya rasio <Code>1:4</Code> atau <Code>1:8</Code>). Mendistribusikan kabel feeder ke banyak kabel distribusi.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[#00d4ff]/30">
                    <h4 className="font-bold text-[#00d4ff] mb-2">📦 ODP (Kapasitas Kecil)</h4>
                    <p className="text-xs">Tempat <strong className="text-white">splitter tahap kedua</strong> (biasanya rasio <Code>1:8</Code> atau <Code>1:16</Code>) yang menyebarkan layanan langsung ke rumah pelanggan.</p>
                </div>
            </div>
<SectionTitle number={2} title="Aturan dan Parameter Penempatan ODP" />
            <p>
                Dalam melakukan mapping, ada beberapa aturan standar teknis yang harus dipatuhi agar redaman (loss) sirkuit optik tidak terlalu besar:
            </p>

            <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)] text-center">
                    <span className="text-2xl">📏</span>
                    <h4 className="font-bold text-white mt-1.5 mb-1">Radius Jangkauan</h4>
                    <p className="text-xs">Jarak ideal ODP ke rumah pelanggan (drop core) adalah <strong className="text-[#00d4ff]">maksimal 150 meter</strong>. Lebih dari itu rentan putus atau redaman tinggi.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)] text-center">
                    <span className="text-2xl">🔢</span>
                    <h4 className="font-bold text-white mt-1.5 mb-1">Kapasitas Port</h4>
                    <p className="text-xs">ODP umumnya berkapasitas <strong className="text-[#00d4ff]">8 port</strong> atau <strong className="text-[#00d4ff]">16 port</strong>.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)] text-center">
                    <span className="text-2xl">➗</span>
                    <h4 className="font-bold text-white mt-1.5 mb-1">Rasio Splitter Total</h4>
                    <p className="text-xs">Maksimal dari OLT hingga pelanggan adalah <Code>1:64</Code> — misalnya <Code>1:4</Code> di ODC lalu <Code>1:16</Code> di ODP.</p>
                </div>
            </div>

            <div>
                <h4 className="font-bold text-white mb-3">📍 Lokasi Pemasangan ODP:</h4>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                        <h4 className="font-bold text-white mb-2">🪜 ODP Poles (Tiang)</h4>
                        <p className="text-xs">Dipasang di tiang listrik atau tiang khusus telekomunikasi. <strong className="text-white">Paling banyak digunakan</strong> di area residensial/perumahan biasa.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                        <h4 className="font-bold text-white mb-2">⬛ ODP Pedestal</h4>
                        <p className="text-xs">Dipasang di permukaan tanah, biasanya untuk kawasan perumahan elit dengan sistem kabel bawah tanah (<em>underground</em>).</p>
                    </div>
                    <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                        <h4 className="font-bold text-white mb-2">🧱 ODP Wall (Dinding)</h4>
                        <p className="text-xs">Dipasang di dinding gedung, ruko, atau apartemen.</p>
                    </div>
                </div>
            </div>
<SectionTitle number={3} title="Tahapan Proses Mapping Penyebaran ODP" />

            {/* Tahap A — Survey Lapangan */}
            <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                <h4 className="font-bold text-white mb-3">🔍 A. Survey Lapangan (Data Collection)</h4>
                <ul className="list-disc list-inside space-y-2 text-xs">
                    <li><strong className="text-white">Homepass Counting:</strong> Menghitung jumlah total rumah/bangunan di area target.</li>
                    <li><strong className="text-white">Identifikasi Tiang:</strong> Memetakan posisi tiang yang sudah ada (eksisting) atau merencanakan titik tiang baru.</li>
                    <li><strong className="text-white">Identifikasi Hambatan:</strong> Mencatat adanya sungai, jalan raya besar, atau pohon rimbun yang memerlukan teknik penarikan kabel khusus.</li>
                </ul>
            </div>

            {/* Tahap B — Perancangan Dokumen */}
            <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                <h4 className="font-bold text-white mb-3">🗺️ B. Perancangan Dokumen Pemetaan (Desain Jaringan)</h4>
                <p className="text-xs mb-2">Pemetaan biasanya dilakukan menggunakan aplikasi GIS seperti Google Earth (KML/KMZ) atau QGIS/ArcGIS. Langkahnya:</p>
                <ol className="list-decimal list-inside space-y-2 text-xs pl-1">
                    <li><strong className="text-white">Klasterisasi (Clustering):</strong> Membagi wilayah perumahan menjadi beberapa blok berdasarkan kepadatan penduduk.</li>
                    <li><strong className="text-white">Penentuan Titik ODP:</strong>
                        <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-[#94a3b8]">
                            <li>Satu ODP 8 Port idealnya meng-cover <Code>6–8</Code> rumah terdekat.</li>
                            <li>Satu ODP 16 Port idealnya meng-cover <Code>12–16</Code> rumah terdekat.</li>
                            <li>Letakkan ODP di tiang yang berada di <strong className="text-white">tengah-tengah kelompok rumah</strong> tersebut (titik episentrum) untuk menghemat kabel drop core.</li>
                        </ul>
                    </li>
                    <li><strong className="text-white">Ploting Jalur Kabel Distribusi:</strong> Menggambar jalur kabel dari ODC menuju deretan ODP yang telah ditentukan.</li>
                </ol>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-amber-400/25 bg-[rgba(251,191,36,0.06)] p-3.5">
                <span className="text-lg flex-shrink-0">💡</span>
                <p className="text-xs leading-relaxed">
                    <strong className="text-amber-300">Titik Episentrum:</strong> bayangkan kelompok 8 rumah berderet. ODP sebaiknya dipasang di tiang yang persis berada di tengah deretan, sehingga kabel drop ke rumah terjauh tetap pendek dan merata ke dua arah.
                </p>
            </div>
<SectionTitle number={4} title="Standar Penamaan (Naming Convention) ODP" />
            <p>
                Penamaan ODP yang rapi sangat penting untuk memudahkan tim lapangan melakukan instalasi (maintenance) dan perbaikan gangguan.
            </p>

            <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                <h4 className="font-bold text-white mb-3">Contoh Format Umum:</h4>
                <p className="font-mono text-sm mb-4">
                    <span className="text-[#00d4ff]">ODP</span>-<span className="text-green-400">[NAMA_ODC]</span>-<span className="text-violet-400">[KODE_AREA]</span>-<span className="text-amber-400">[NOMOR_ODP]</span>
                </p>

                {/* Breakdown contoh nyata */}
                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex flex-col items-center">
                        <span className="px-3 py-1.5 rounded-md font-mono text-xs font-bold bg-[rgba(0,212,255,0.12)] border border-[#00d4ff]/40 text-[#00d4ff]">ODP</span>
                        <span className="mt-1 text-[9px] font-mono text-[#64748b]">Prefix perangkat</span>
                    </div>
                    <span className="font-mono text-lg text-[#64748b]">-</span>
                    <div className="flex flex-col items-center">
                        <span className="px-3 py-1.5 rounded-md font-mono text-xs font-bold bg-[rgba(16,185,129,0.12)] border border-emerald-500/40 text-emerald-400">ODC_BGR_01</span>
                        <span className="mt-1 text-[9px] font-mono text-[#64748b]">Terhubung ke ODC Bogor 01</span>
                    </div>
                    <span className="font-mono text-lg text-[#64748b]">-</span>
                    <div className="flex flex-col items-center">
                        <span className="px-3 py-1.5 rounded-md font-mono text-xs font-bold bg-[rgba(167,139,250,0.12)] border border-violet-400/40 text-violet-300">A</span>
                        <span className="mt-1 text-[9px] font-mono text-[#64748b]">Klaster / Sektor A</span>
                    </div>
                    <span className="font-mono text-lg text-[#64748b]">-</span>
                    <div className="flex flex-col items-center">
                        <span className="px-3 py-1.5 rounded-md font-mono text-xs font-bold bg-[rgba(245,158,11,0.12)] border border-amber-400/40 text-amber-400">05</span>
                        <span className="mt-1 text-[9px] font-mono text-[#64748b]">ODP nomor 5</span>
                    </div>
                </div>

                <p className="mt-4 text-xs">
                    Artinya: <strong className="text-white">ODP nomor 5</strong>, terhubung ke <strong className="text-white">ODC Bogor 01</strong>, berada di <strong className="text-white">Klaster/Sektor A</strong>.
                </p>
            </div>
<SectionTitle number={5} title="Contoh Ilustrasi Perhitungan Kebutuhan ODP" />
            <p>
                Misalkan Anda ingin memetakan jaringan di sebuah gang perumahan yang memiliki 32 rumah:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs pl-2">
                <li>Jika menggunakan ODP 8 Port: Anda membutuhkan <Code>32 / 8 = 4 unit</Code> ODP.</li>
                <li>Jika menggunakan ODP 16 Port: Anda membutuhkan <Code>32 / 16 = 2 unit</Code> ODP.</li>
            </ul>

            {/* Kalkulator interaktif */}
            <div className="p-5 rounded-xl bg-[#07090f] border border-[#00d4ff]/25">
                <h4 className="font-display font-bold text-white mb-1">🧮 Kalkulator Kebutuhan ODP</h4>
                <p className="text-xs text-[#64748b] mb-4">Masukkan jumlah rumah (homepass) di area target, lalu lihat kebutuhan ODP-nya.</p>

                <label htmlFor="odp-homes" className="block text-xs font-semibold text-[#94a3b8] mb-2">
                    Jumlah Rumah / Homepass
                </label>
                <input
                    id="odp-homes"
                    type="number"
                    min={1}
                    max={500}
                    value={homes}
                    onChange={(e) => setHomes(Number(e.target.value))}
                    className="w-full sm:w-48 bg-[#0d1525] border border-[rgba(0,212,255,0.25)] rounded-lg px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-[#00d4ff]/60 transition-colors"
                />

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-3 rounded-lg bg-[#0d1525] border border-white/10 text-center">
                        <div className="font-mono text-[10px] text-[#94a3b8]">ODP 8 PORT</div>
                        <div className="font-display text-2xl font-bold text-[#00d4ff] mt-1">{units8}</div>
                        <div className="text-[10px] font-mono text-[#64748b]">unit dibutuhkan</div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#0d1525] border border-white/10 text-center">
                        <div className="font-mono text-[10px] text-[#94a3b8]">ODP 16 PORT</div>
                        <div className="font-display text-2xl font-bold text-emerald-400 mt-1">{units16}</div>
                        <div className="text-[10px] font-mono text-[#64748b]">unit dibutuhkan</div>
                    </div>
                </div>

                {safeHomes > 128 && (
                    <p className="mt-3 flex items-start gap-2 text-xs text-amber-300 bg-[rgba(251,191,36,0.08)] border border-amber-400/30 rounded-lg p-3">
                        <span>⚠️</span>
                        <span>Melebihi kapasitas rasio total maksimal <Code>1:64</Code> untuk satu kolom splitter — area ini sebaiknya dipecah menjadi lebih dari satu ODC.</span>
                    </p>
                )}
            </div>

            {/* Pertimbangan */}
            <div className="flex items-start gap-3 rounded-lg border border-amber-400/25 bg-[rgba(251,191,36,0.06)] p-3.5">
                <span className="text-lg flex-shrink-0">⚖️</span>
                <p className="text-xs leading-relaxed">
                    <strong className="text-amber-300">Pertimbangan:</strong> jika rumah-rumah tersebut berderet sangat panjang (lebih dari 300 meter), lebih baik menggunakan <strong className="text-white">4 unit ODP 8 Port yang disebar merata</strong>, daripada 2 unit ODP 16 Port — agar jarak drop core ke setiap rumah tetap di bawah <Code>150 meter</Code>.
                </p>
            </div>

            <p className="pt-2 border-t border-[rgba(0,212,255,0.08)]">
                Proses mapping yang akurat akan menghemat biaya material (<strong className="text-white">CAPEX</strong>) dan mempermudah operasional (<strong className="text-white">OPEX</strong>) perusahaan penyedia internet (ISP) di masa mendatang.
            </p>

            {/* Simulator Interaktif */}
            <div className="pt-2">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">🖥️</span>
                    <div>
                        <div className="font-display text-xl font-bold text-[#00d4ff]">Simulator Interaktif Mapping FTTH</div>
                        <p className="text-xs text-[#64748b] mt-0.5">
                            Praktikkan langsung materi di atas — tempatkan <Code>ODC / ODP / Rumah</Code> di peta, lalu tarik drop core dari ODP ke rumah untuk melihat atenuasi berdasarkan jarak.
                        </p>
                    </div>
                </div>
                <FTTHMappingSimulator />
            </div>
        </div>
    );
}
