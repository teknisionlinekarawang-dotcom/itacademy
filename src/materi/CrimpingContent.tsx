import ImagePlaceholder from '../components/ImagePlaceholder';

const SectionTitle = ({ number, title }: { number: number, title: string }) => (
    <h2 className="font-display text-xl font-bold text-[#00d4ff] mb-4 border-t border-[rgba(0,212,255,0.1)] pt-6">
        <span className="text-base text-[#4a5568] mr-2">{number}.</span>{title}
    </h2>
);

export default function CrimpingContent() {
    return (
        <div className="space-y-6 text-[#b0c4de] leading-relaxed text-sm">
            <p>
                Kabel UTP (Unshielded Twisted Pair), yang secara awam sering disebut kabel LAN atau kabel Ethernet, adalah jenis kabel berpilin tanpa pelindung aluminium foil yang paling populer digunakan untuk membangun jaringan komputer lokal (LAN).
            </p>

            <SectionTitle number={1} title="Anatomi dan Cara Kerja Kabel UTP" />
            <p>
                Kabel UTP terdiri dari 8 helai kabel kecil berisi tembaga yang dikelompokkan menjadi 4 pasang (pair). Setiap pasang dipilin (twisted) melilit satu sama lain. Lilitan ini dirancang untuk mengurangi interferensi elektromagnetik (crosstalk) dari pasangan kabel di sebelahnya maupun dari gangguan sinyal luar.
            </p>
            <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                <h4 className="font-bold text-white mb-2">Pengkodean Warna & Fungsi Dasar:</h4>
                <ul className="list-disc list-inside space-y-2 text-xs">
                    <li><strong className="text-white">Oranye & Putih/Oranye:</strong> Transfer Data (Transmit/Receive)</li>
                    <li><strong className="text-white">Hijau & Putih/Hijau:</strong> Transfer Data (Transmit/Receive)</li>
                    <li><strong className="text-white">Biru & Putih/Biru:</strong> Suara / Data Tambahan / Power</li>
                    <li><strong className="text-white">Cokelat & Putih/Cokelat:</strong> Grounding / Power over Ethernet (PoE)</li>
                </ul>
            </div>

            <SectionTitle number={2} title="Kategori Kabel UTP (CAT)" />
            <p>
                Setiap kategori memiliki standar ketebalan tembaga, frekuensi (MHz), dan batas bandwidth maksimum.
            </p>
            <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                        <tr className="border-b border-[rgba(0,212,255,0.2)] bg-[rgba(0,212,255,0.05)]">
                            <th className="p-2">Kategori</th>
                            <th className="p-2">Kecepatan Maks.</th>
                            <th className="p-2">Jarak</th>
                            <th className="p-2">Penggunaan Umum</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                        <tr><td className="p-2 text-[#f59e0b]">Cat 5e</td><td className="p-2">1 Gbps</td><td className="p-2">100m</td><td className="p-2">Standar minimal jaringan rumah/kantor.</td></tr>
                        <tr><td className="p-2 text-[#00d4ff]">Cat 6</td><td className="p-2">10 Gbps</td><td className="p-2">~55m</td><td className="p-2">Jaringan profesional / server lokal.</td></tr>
                        <tr><td className="p-2 text-[#10b981]">Cat 6a</td><td className="p-2">10 Gbps</td><td className="p-2">100m</td><td className="p-2">Datacenter & backbone jaringan tinggi.</td></tr>
                    </tbody>
                </table>
            </div>
            <ImagePlaceholder
                src="https://blog.rumahweb.com/wp-content/uploads/2023/03/Versi-Kabel-UTP.jpg"
                alt="Kategori Kabel UTP"
                caption="Perbandingan berbagai kategori kabel UTP (Cat5e, Cat6, Cat6a)."
            />

            <SectionTitle number={3} title="Standar Urutan Kabel: T568A vs T568B" />
            <p>
                Ada dua standar internasional yang ditetapkan oleh TIA/EIA untuk penyusunan warna kabel ke konektor RJ45:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">Standar T568B (Paling Umum)</h4>
                    <p className="text-xs">Putih/Oranye, Oranye, Putih/Hijau, Biru, Putih/Biru, Hijau, Putih/Cokelat, Cokelat.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">Standar T568A</h4>
                    <p className="text-xs">Putih/Hijau, Hijau, Putih/Oranye, Biru, Putih/Biru, Oranye, Putih/Cokelat, Cokelat.</p>
                </div>
            </div>
            <ImagePlaceholder
                src="https://2.bp.blogspot.com/-pELJCVHqTNI/XIsdfTIn8RI/AAAAAAAABBI/RzLyluiTAzEonnd5-BWqKjqjyQTvlVO4wCLcBGAs/s1600/urutan%2Bwarna%2Bkabel.jpg"
                alt="Diagram Pinout T568A dan T568B"
                caption="Urutan warna kabel untuk standar T568A dan T568B."
            />

            <SectionTitle number={4} title="Jenis Kabel: Straight-Through vs Crossover" />
            <ul className="list-disc list-inside space-y-2">
                <li>
                    <strong className="text-white">Tipe Straight-Through (Lurus):</strong> Kedua ujung kabel menggunakan standar yang SAMA (T568B – T568B). Fungsinya untuk menghubungkan dua perangkat yang <strong className="text-white">berbeda jenis</strong>, seperti PC ke Switch.
                </li>
                <li>
                    <strong className="text-white">Tipe Cross-Over (Silang):</strong> Satu ujung menggunakan T568A, dan ujung satunya T568B. Fungsinya untuk menghubungkan dua perangkat yang <strong className="text-white">sejenis</strong>, seperti PC ke PC secara langsung.
                </li>
            </ul>
            <p className="text-xs text-[#4a5568]">Catatan: Perangkat jaringan modern (Gigabit) sudah memiliki fitur <strong className="text-[#64748b]">Auto-MDIX</strong>, yang otomatis mendeteksi tipe kabel. Sehingga kabel Straight-Through bisa digunakan untuk semua kondisi.</p>
            <ImagePlaceholder
                src="https://www.layer23-switch.com/wp-content/uploads/2025/12/straight-through-vs-crossover-.jpg"
                alt="Perbandingan Kabel Straight-Through dan Crossover"
                caption="Penggunaan kabel straight-through dan crossover."
            />

            <SectionTitle number={5} title="Fungsi Pinout Konektor RJ45" />
            <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-white">Fast Ethernet (10/100 Mbps):</strong> Hanya 4 pin yang aktif membawa data: Pin 1 (Tx+), 2 (Tx-), 3 (Rx+), dan 6 (Rx-).</li>
                <li><strong className="text-white">Gigabit Ethernet (1000 Mbps):</strong> Seluruh 8 pin (4 pasang) aktif bekerja secara simultan dua arah (bidirectional).</li>
            </ul>

            <SectionTitle number={6} title="Jenis-Jenis Konektor RJ (Registered Jack)" />
            <ul className="list-disc list-inside space-y-2 text-xs">
                <li><strong className="text-white">RJ45 Standard:</strong> Konektor standar 8 pin untuk kabel UTP/STP.</li>
                <li><strong className="text-white">RJ45 Pass-Through (EZ-RJ45):</strong> Ujungnya terbuka sehingga kabel bisa menembus keluar, memudahkan verifikasi urutan warna.</li>
                <li><strong className="text-white">RJ11:</strong> Konektor lebih kecil (4/6 pin) untuk kabel telepon analog atau modem ADSL.</li>
                <li><strong className="text-white">RJ45 Shielded:</strong> Konektor berlapis logam untuk kabel STP/FTP agar terhubung dengan grounding.</li>
            </ul>
            <ImagePlaceholder
                src={["https://m.media-amazon.com/images/I/61dV7hAat1S._SL1500_.jpg", "https://alston-systems.com/wp-content/uploads/2023/09/RJ-45.jpg", "https://m.media-amazon.com/images/I/71gfjFM45YL._SL1500_.jpg", "https://dtechtrading.com.np/storage/photos/3/Passive%20Devices/rj11%20conector.jpg"]}
                alt="Jenis Konektor RJ45 dan RJ11"
                caption="Perbandingan konektor RJ45, RJ45 Pass-Through, dan RJ11."
            />


            <SectionTitle number={7} title="Jenis Pelindung Kabel (Shielding)" />
            <ul className="list-disc list-inside space-y-2 text-xs">
                <li><strong className="text-white">UTP (Unshielded Twisted Pair):</strong> Tanpa pelindung foil. Fleksibel, murah, untuk penggunaan indoor.</li>
                <li><strong className="text-white">FTP / F/UTP (Foiled Twisted Pair):</strong> Seluruh 4 pasang dibungkus satu lapisan foil. Melindungi dari interferensi luar.</li>
                <li><strong className="text-white">STP / S/FTP (Shielded Twisted Pair):</strong> Masing-masing pasang dibungkus foil, lalu dibungkus lagi dengan anyaman logam. Untuk lingkungan industri berat atau outdoor.</li>
            </ul>

            <ImagePlaceholder
                src="https://electrica.net.ua/images/_o/articles/kabel-utp-ftp-stp-main.jpg"
                alt="Jenis Pelindung Kabel UTP, FTP, STP"
                caption="Perbandingan struktur kabel UTP, FTP, dan STP."
            />
            <SectionTitle number={8} title="Langkah-langkah Crimping" />
            <ol className="space-y-4">
                <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)] flex items-center justify-center font-mono text-xs text-[#00d4ff]">1</div>
                    <div>
                        <h4 className="font-bold text-white">Kupas Jaket Luar</h4>
                        <p className="text-xs">Kupas jaket pelindung kabel UTP sekitar 2 cm menggunakan Cable Stripper, pastikan tidak melukai isolasi 8 helai kabel kecil di dalamnya.</p>
                        <ImagePlaceholder
                            src="https://www.wikihow.com/images/thumb/9/93/Crimp-Rj45-Step-1-Version-3.jpg/aid1403126-v4-728px-Crimp-Rj45-Step-1-Version-3.jpg"
                            alt="Langkah 1 Crimping: Kupas Jaket"
                            caption="Mengupas jaket luar kabel UTP."
                        />
                    </div>
                </li>
                <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)] flex items-center justify-center font-mono text-xs text-[#00d4ff]">2</div>
                    <div>
                        <h4 className="font-bold text-white">Urutkan & Luruskan Warna</h4>
                        <p className="text-xs">Urai lilitan kabel, luruskan, lalu susun rapi sesuai urutan warna standar T568B (Putih/Oranye → Cokelat).</p>
                        <ImagePlaceholder
                            src={["https://www.wikihow.com/images/thumb/f/f3/Crimp-Rj45-Step-2-Version-3.jpg/v4-460px-Crimp-Rj45-Step-2-Version-3.jpg", "https://www.wikihow.com/images/thumb/0/04/Crimp-Rj45-Step-3-Version-3.jpg/aid1403126-v4-728px-Crimp-Rj45-Step-3-Version-3.jpg"]}
                            alt="Langkah 2 Crimping: Urutkan Warna"
                            caption="Mengurutkan kabel sesuai standar T568B."
                        />
                    </div>
                </li>
                <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)] flex items-center justify-center font-mono text-xs text-[#00d4ff]">3</div>
                    <div>
                        <h4 className="font-bold text-white">Ratakan Potongan</h4>
                        <p className="text-xs">Potong rata ujung kabel secara presisi menggunakan Tang Crimp hingga menyisakan panjang sekitar 1,2 cm dari jaket kabel.</p>
                        <ImagePlaceholder
                            src="https://www.wikihow.com/images/thumb/5/5a/Crimp-Rj45-Step-4-Version-3.jpg/v4-460px-Crimp-Rj45-Step-4-Version-3.jpg"
                            alt="Langkah 3 Crimping: Ratakan Potongan"
                            caption="Memotong ujung kabel agar rata."
                        />
                    </div>
                </li>
                <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)] flex items-center justify-center font-mono text-xs text-[#00d4ff]">4</div>
                    <div>
                        <h4 className="font-bold text-white">Masukkan ke RJ45 & Crimp</h4>
                        <p className="text-xs">Dorong kabel ke dalam konektor RJ45 hingga seluruh ujung tembaga menyentuh bagian depan. Gunakan Tang Crimp untuk menekan pin hingga mengunci kabel.</p>
                        <ImagePlaceholder
                            src={["https://www.wikihow.com/images/thumb/8/86/Crimp-Rj45-Step-5-Version-3.jpg/aid1403126-v4-728px-Crimp-Rj45-Step-5-Version-3.jpg", "https://www.wikihow.com/images/thumb/3/35/Crimp-Rj45-Step-6-Version-3.jpg/aid1403126-v4-728px-Crimp-Rj45-Step-6-Version-3.jpg"]}
                            alt="Langkah 4 Crimping: Masukkan & Crimp"
                            caption="Memasang kabel ke konektor RJ45 dan melakukan crimping."
                        />
                    </div>
                </li>
                <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)] flex items-center justify-center font-mono text-xs text-[#00d4ff]">5</div>
                    <div>
                        <h4 className="font-bold text-white">Pengujian dengan LAN Tester</h4>
                        <p className="text-xs">Tancapkan kedua ujung ke LAN Tester. Pastikan lampu indikator nomor 1 sampai 8 menyala berurutan dari kedua sisi (untuk kabel Straight).</p>
                        <ImagePlaceholder
                            src="https://ph-test-11.slatic.net/p/8f980dd3fdce1f5e9b2d485d15c55422.jpg"
                            alt="Langkah 5 Crimping: Uji dengan LAN Tester"
                            caption="Menguji kabel yang sudah di-crimping menggunakan LAN Tester."
                        />
                    </div>
                </li>
            </ol>
        </div>
    );
}
