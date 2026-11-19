import { useState, FC } from 'react';
import ImagePlaceholder from '../components/ImagePlaceholder';
import VideoPlaceholder from '../components/VideoPlaceholder';
import { Link } from 'react-router-dom';
import OpticSimulation from '../simulator/OpticSimulation';

const SectionTitle = ({ number, title }: { number: number, title: string }) => (
    <h2 className="font-display text-xl font-bold text-[#00d4ff] mb-4 border-t border-[rgba(0,212,255,0.1)] pt-6">
        <span className="text-base text-[#4a5568] mr-2">{number}.</span>{title}
    </h2>
);

const getWaveColor = (nm: number) => {
    if (nm < 1000) return '#ef4444'; // Merah (representasi 850nm)
    if (nm < 1400) return '#3b82f6'; // Biru (representasi 1310nm)
    return '#a855f7'; // Ungu (representasi 1550nm)
};

const WavelengthVisualizer: FC<{ wavelength: number }> = ({ wavelength }) => {
    const color = getWaveColor(wavelength);
    const frequency = 2000 / wavelength; // Semakin panjang gelombang, semakin rendah frekuensi

    const pathData = Array.from({ length: 200 }).map((_, i) => {
        const x = i * 2;
        const y = 50 + Math.sin(i * 0.1 * frequency) * 20;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox="0 0 400 100" className="w-full h-auto">
            <path
                d={`M ${pathData}`}
                fill="none"
                stroke={color}
                strokeWidth="2"
                style={{ filter: `drop-shadow(0 0 4px ${color})`, transition: 'stroke 0.3s ease' }}
            />
        </svg>
    );
};

export default function FiberOpticContent() {
    const [wavelength, setWavelength] = useState(1550);

    return (

        <div className="space-y-6 text-[#b0c4de] leading-relaxed text-sm">
            <div className="mb-8">
                <Link to="/dashboard" className="text-cyan-400 hover:underline text-sm">&larr; Kembali ke Dashboard</Link>
            </div>
            <SectionTitle number={1} title="Apa itu Fiber Optic?" />
            <p>
                Fiber Optic (FO) adalah teknologi transmisi data yang menggunakan pulsa cahaya yang merambat melalui serat kaca atau plastik yang sangat tipis. Berbeda dengan kabel tembaga yang menggunakan sinyal listrik, FO kebal terhadap interferensi elektromagnetik dan mampu mentransfer data dengan kecepatan sangat tinggi (terabit per detik) pada jarak yang sangat jauh.
            </p>
            <ImagePlaceholder
                src="/media/fo/fo.jpg"
                alt="Penampang Kabel Fiber Optic"
                caption="Struktur inti kabel fiber optic."
            />
            <SectionTitle number={2} title="Proses Kirim & Terima Data" />
            <p>
                Proses komunikasi melalui fiber optic adalah konversi sinyal dari listrik ke cahaya, dan sebaliknya.
            </p>
            <ol className="list-decimal list-inside space-y-3 pl-2">
                <li>
                    <strong className="text-white">Transmitter (Pengirim):</strong> Perangkat elektronik mengambil data digital (bit 1 dan 0) dan menggunakan sumber cahaya (biasanya <strong className="text-white">LASER</strong>) untuk mengubahnya menjadi pulsa cahaya. Bit '1' direpresentasikan sebagai pulsa cahaya 'ON', dan bit '0' sebagai 'OFF'.
                </li>
                <li>
                    <strong className="text-white">Propagasi (Perambatan):</strong> Pulsa cahaya merambat di sepanjang inti (core) fiber optic melalui prinsip <strong className="text-white">Total Internal Reflection</strong> (Pemantulan Internal Total), di mana cahaya terus memantul di dalam inti tanpa bisa keluar.
                </li>
                <li>
                    <strong className="text-white">Receiver (Penerima):</strong> Di ujung lain, sebuah sensor cahaya (photodiode) mendeteksi pulsa cahaya yang masuk. Ia kemudian mengubahnya kembali menjadi sinyal listrik (bit 1 dan 0) yang dapat dipahami oleh komputer atau perangkat lain.
                </li>
            </ol>
            <OpticSimulation />
            <p className="text-xs text-[#64748b] -mt-2">
                Simulasi di atas menunjukkan bagaimana data digital (bit 0 dan 1) diubah menjadi pulsa cahaya dan merambat melalui serat optik.
            </p>
            <ImagePlaceholder
                src={["https://media.geeksforgeeks.org/wp-content/uploads/20221114155628/TotalInternalReflection.png", "https://diahask.com/wp-content/uploads/2023/12/bayangan-dari-total-internal-reflection.png"]}
                alt="Perambatan Cahaya dalam Fiber Optic"
                caption="Prinsip Total Internal Reflection dalam serat optik."
            />
            <SectionTitle number={3} title="Analogi: Laser Disc (DVD/Blu-ray)" />
            <p>
                Cara kerja laser pada DVD atau Blu-ray memiliki prinsip dasar yang mirip dengan proses pengiriman data di fiber optic: mengubah data digital menjadi sinyal cahaya.
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs">
                <li>Laser pada DVD player memancarkan cahaya ke permukaan disk.</li>
                <li>Permukaan disk memiliki area mikroskopis yang disebut "pits" (lubang) dan "lands" (dataran).</li>
                <li>Saat laser mengenai "land", cahayanya dipantulkan kembali dengan kuat (dibaca sebagai bit '1'). Saat mengenai "pit", pantulannya menjadi lemah atau tersebar (dibaca sebagai bit '0').</li>
                <li>Sensor mendeteksi perbedaan intensitas pantulan ini dan mengubahnya menjadi data digital. Ini mirip dengan bagaimana photodiode di ONT mendeteksi ada atau tidaknya pulsa cahaya.</li>
            </ul>
            <ImagePlaceholder
                src="https://3.14.by/files/dvd-imm.jpg"
                alt="Permukaan disk di bawah mikroskop"
                caption="Pits dan lands pada permukaan Blu-ray disc di bawah mikroskop."
            />
            <SectionTitle number={4} title="Konsep Kunci Jaringan Optik" />
            <div className="space-y-8">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">Single-mode vs Multi-mode</h4>
                    <p className="text-xs">
                        <strong className="text-white">Single-mode</strong> memiliki inti sangat kecil (~9µm) yang hanya memungkinkan satu mode cahaya merambat lurus, ideal untuk jarak jauh dan bandwidth tinggi. <strong className="text-white">Multi-mode</strong> memiliki inti lebih besar (~50µm) yang memungkinkan banyak mode cahaya memantul, cocok untuk jarak pendek (misal: dalam satu gedung).
                    </p>
                    <ImagePlaceholder
                        src={["https://dicsan.com/wp-content/uploads/2020/07/MM-vs-SM-2.jpg", "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgo9FywoVnfF_BjyaK4onziPbB_gfq-GMmIxWDRFbN0u5FrRWHYlNeudZ9njirESDxdRztHGuhdWQpjw1JfWyklt7Sll1Wxs0jvl0yRPlqnS1CjQNKq13mTYzJnLPeElvhc7-ViOHAI2hC7BaS0Ul46cv322QUYSKzCYRLd94KzicTXDdetEtXsjIOgrX0/w1200-h630-p-k-no-nu/perbedaan%20single%20mode%20vs%20multi%20mode.png"]}
                        alt="Perbandingan Single-mode dan Multi-mode Fiber"
                        caption="Perbedaan inti serat optik single-mode dan multi-mode."
                    />
                </div>
                
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">Panjang Gelombang (Wavelength)</h4>
                    <p className="text-xs">Data dalam fiber optic dikirim menggunakan cahaya inframerah. Panjang gelombang yang berbeda digunakan untuk tujuan yang berbeda, terutama terkait dengan jenis kabel.</p>
                    <ul className="list-disc list-inside space-y-1 text-xs mt-2">
                        <li><strong className="text-white">850 nm:</strong> Umumnya digunakan untuk kabel <strong className="text-white">Multi-mode</strong> pada jarak pendek.</li>
                        <li><strong className="text-white">1310 nm & 1550 nm:</strong> Standar untuk kabel <strong className="text-white">Single-mode</strong>, dengan 1550 nm memiliki redaman paling rendah untuk jarak sangat jauh.</li>
                    </ul>
                    <div className="mt-6">
                        <div className="w-full h-28">
                            <WavelengthVisualizer wavelength={wavelength} />
                        </div>
                        <div className="mt-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block font-mono text-[10px] text-[#4a5568] uppercase">Panjang Gelombang</label>
                                <span className="font-mono text-lg font-bold" style={{ color: getWaveColor(wavelength) }}>{wavelength} nm</span>
                            </div>
                            <input type="range" min="850" max="1600" step="10" value={wavelength} onChange={e => setWavelength(Number(e.target.value))} className="w-full" />
                            <div className="flex justify-between mt-1 font-mono text-[9px] text-[#4a5568]"><span>Multi-mode (850nm)</span><span>Single-mode (1550nm)</span></div>
                        </div>
                    </div>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">Multiplexing: TDM & WDM</h4>
                    <p className="text-xs mb-2">Multiplexing adalah teknik menggabungkan beberapa sinyal menjadi satu untuk ditransmisikan melalui satu media tunggal. Ini adalah kunci efisiensi jaringan.</p>
                    <ul className="list-disc list-inside space-y-2 text-xs">
                        <li><strong className="text-white">TDM (Time Division Multiplexing):</strong> Sinyal dibagi berdasarkan slot waktu. Bayangkan beberapa orang bergiliran berbicara di satu telepon. Ini umum di teknologi lama seperti PDH/SDH.</li>
                        <li><strong className="text-white">WDM (Wavelength Division Multiplexing):</strong> Mengirim beberapa sinyal data secara bersamaan melalui satu serat optik, dengan setiap sinyal menggunakan panjang gelombang (warna) cahaya yang berbeda. Ini seperti memiliki banyak jalur tol dengan warna berbeda dalam satu terowongan.</li>
                        <li><strong className="text-white">DWDM (Dense WDM):</strong> Versi lebih canggih dari WDM yang menggunakan spasi antar panjang gelombang yang sangat rapat (*dense*), memungkinkan puluhan atau bahkan ratusan sinyal dikirim bersamaan. Ini adalah tulang punggung internet modern.</li>
                    </ul>
                </div>
            </div>

            <SectionTitle number={5} title="Perangkat Aktif Jaringan Fiber Optic" />
            <p>
                Berbeda dengan komponen pasif seperti splitter dan kabel, perangkat aktif memerlukan sumber daya listrik untuk berfungsi. Mereka adalah "otak" dan "otot" dari jaringan yang melakukan konversi sinyal, manajemen, dan amplifikasi.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">OLT (Optical Line Terminal)</h4>
                    <p className="text-xs">Perangkat yang berada di pusat penyedia layanan (Central Office). OLT berfungsi sebagai titik awal dan manajer utama jaringan PON, mengontrol alokasi bandwidth dan slot waktu untuk setiap pengguna.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">ONU/ONT (Optical Network Unit/Terminal)</h4>
                    <p className="text-xs">Perangkat di sisi pelanggan yang menerima sinyal optik dan mengubahnya menjadi sinyal listrik untuk perangkat seperti router, PC, atau telepon. ONT biasanya untuk satu pelanggan (rumah), sementara ONU bisa melayani beberapa pelanggan (gedung).</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">EDFA (Erbium-Doped Fiber Amplifier)</h4>
                    <p className="text-xs">Penguat sinyal optik yang digunakan dalam transmisi jarak sangat jauh (long-haul). EDFA memperkuat sinyal cahaya secara langsung tanpa mengubahnya menjadi sinyal listrik terlebih dahulu, menjaga kualitas sinyal.</p>
                </div>
            </div>
            <ImagePlaceholder 
                src="https://www.telecomate.com/wp-content/uploads/2026/04/image_e63f97f4-scaled.jpg" 
                alt="Perangkat Aktif dalam Jaringan PON" 
                caption="Posisi OLT dan ONT/ONU dalam arsitektur jaringan PON." 
                />

            <h3 className="font-display text-lg font-bold text-white pt-6">SFP: Jantung Konektivitas Optik</h3>
            <p>
                <strong className="text-white">SFP (Small Form-factor Pluggable)</strong> adalah modul transceiver (transmitter & receiver) kecil yang dapat dipasang dan dilepas (hot-pluggable) pada port SFP di perangkat jaringan seperti OLT, switch, atau router. Fungsinya adalah mengubah sinyal listrik dari perangkat menjadi sinyal optik untuk dikirim melalui fiber, dan sebaliknya.
            </p>

            <div className="p-4 mt-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                <h4 className="font-bold text-white mb-2">Komponen Kunci: VCSEL</h4>
                <p className="text-xs">
                    Baik pada perangkat fiber optic modern (terutama untuk jarak pendek seperti di datacenter) maupun pada pembaca disk optik, sering digunakan komponen bernama <strong className="text-white">VCSEL (Vertical-Cavity Surface-Emitting Laser)</strong>. Ini adalah jenis dioda laser semikonduktor yang memancarkan sinar laser secara vertikal dari permukaannya. Keunggulannya adalah biaya produksi yang rendah, efisiensi daya yang baik, dan kemudahan untuk diproduksi secara massal, menjadikannya pilihan populer untuk aplikasi komunikasi data berkecepatan tinggi.
                </p>
            <ImagePlaceholder
                src={["https://29820736.s21i.faiusr.com/2/ABUIABACGAAgu5fNsAYotoHzjQYwoAY4oAY.jpg", "https://www.fiberopticom.com/Content/upload/2019273007/201901251101409820996.png"]}
                alt="Permukaan disk di bawah mikroskop"
                caption="Komponen VCSEL (Vertical-Cavity Surface-Emitting Laser) yang digunakan dalam komunikasi data optik."
            />

            </div>

            <div className="overflow-x-auto my-4">
                <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                        <tr className="border-b border-[rgba(0,212,255,0.2)] bg-[rgba(0,212,255,0.05)]">
                            <th className="p-2">Jenis</th>
                            <th className="p-2">Kecepatan Maks.</th>
                            <th className="p-2">Penggunaan Umum</th>
                            <th className="p-2">Panjang Gelombang</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                        <tr>
                            <td className="p-2 text-[#00d4ff]">SFP</td>
                            <td className="p-2">1 Gbps</td>
                            <td className="p-2">Koneksi antar switch, server</td>
                            <td className="p-2">850nm (MM), 1310/1550nm (SM)</td>
                        </tr>
                        <tr>
                            <td className="p-2 text-[#00d4ff]">SFP+</td>
                            <td className="p-2">10 Gbps</td>
                            <td className="p-2">Koneksi uplink, datacenter</td>
                            <td className="p-2">850nm (MM), 1310/1550nm (SM)</td>
                        </tr>
                        <tr>
                            <td className="p-2 text-[#00d4ff]">QSFP+</td>
                            <td className="p-2">40 Gbps</td>
                            <td className="p-2">Backbone jaringan, agregasi</td>
                            <td className="p-2">4x10G (WDM)</td>
                        </tr>
                        <tr>
                            <td className="p-2 text-[#00d4ff]">QSFP28</td>
                            <td className="p-2">100 Gbps</td>
                            <td className="p-2">Datacenter, interkoneksi ISP</td>
                            <td className="p-2">4x25G (WDM)</td>
                        </tr>
                        <tr>
                            <td className="p-2 text-[#f59e0b]">GPON SFP</td>
                            <td className="p-2">2.5G Down / 1.25G Up</td>
                            <td className="p-2">Digunakan di OLT untuk FTTH</td>
                            <td className="p-2">1490nm (Tx), 1310nm (Rx)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <ImagePlaceholder 
                src="https://www.mobinhost.com/mag/wp-content/uploads/2025/10/sfp-factor-types.jpg" 
                alt="Berbagai Jenis Modul SFP" 
                caption="Perbandingan fisik dan fungsional dari berbagai jenis transceiver SFP." 
            />

            
            <VideoPlaceholder
                thumbnailSrc="https://i.ytimg.com/vi/0T7DCpDtwPA/maxresdefault.jpg" // Ganti dengan path thumbnail Anda
                videoSrc="/media/fo/fo-explained.mp4" // Ganti dengan path video Anda
                alt="Video Penjelasan Cara Kerja Fiber Optic"
                caption="Tonton video penjelasan tentang cara kerja Fiber Optic."
            />

        </div>
    );
}
