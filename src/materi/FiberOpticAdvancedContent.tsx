import { useState } from 'react';
import { Link } from 'react-router-dom'; // Link diimpor tetapi tidak digunakan, bisa dihapus jika tidak ada link lain
import ImagePlaceholder from '../components/ImagePlaceholder';

const SectionTitle = ({ number, title }: { number: number, title: string }) => (
    <h2 className="font-display text-xl font-bold text-[#00d4ff] mb-4 border-t border-[rgba(0,212,255,0.1)] pt-8 mt-4">
        <span className="text-base text-[#4a5568] mr-2">{number}.</span>{title}
    </h2>
);

const Code = ({ children }: { children: React.ReactNode }) => (
    <code className="font-mono bg-[#1a2535] px-1.5 py-0.5 rounded-md text-[#f59e0b] text-sm">{children}</code>
);

const SplitterSimulator = () => {
    const [state, setState] = useState<'idle' | 'sending' | 'delivered'>('idle');

    const handleAnimate = () => {
        if (state !== 'idle') return;
        setState('sending');
        setTimeout(() => {
            setState('delivered');
            setTimeout(() => setState('idle'), 3500); // Reset after 3.5s
        }, 2000); // Animation duration
    };

    const ontData = [
        { id: 'A', color: 'bg-red-500', shadow: 'shadow-[0_0_8px_theme(colors.red.500)]' },
        { id: 'B', color: 'bg-green-500', shadow: 'shadow-[0_0_8px_theme(colors.green.500)]' },
        { id: 'C', color: 'bg-blue-500', shadow: 'shadow-[0_0_8px_theme(colors.blue.500)]' },
    ];

    return (
        <div className="my-6 p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.08)]">
            <div className="relative h-48 flex items-center justify-between">
                {/* OLT */}
                <div className="flex flex-col items-center w-20">
                    <div className="text-3xl">🏢</div>
                    <div className="font-mono text-xs text-[#00d4ff]">OLT</div>
                </div>

                {/* Splitter */}
                <div className="flex flex-col items-center">
                    <div className="text-4xl">➗</div>
                    <div className="font-mono text-xs text-white">Splitter</div>
                </div>

                {/* ONTs */}
                <div className="flex flex-col items-center w-20 space-y-4">
                    {ontData.map((ont) => (
                        <div key={ont.id} className={`relative flex flex-col items-center transition-transform duration-500 ${state === 'delivered' && ont.id === 'B' ? 'scale-110' : ''}`}>
                            <div className="text-2xl">🏠</div>
                            <div className={`font-mono text-xs transition-colors duration-500 ${state === 'delivered' && ont.id === 'B' ? 'text-green-400' : 'text-gray-500'}`}>ONT {ont.id}</div>
                            {state === 'delivered' && ont.id !== 'B' && (
                                <div className="absolute -top-1 -right-1 text-red-500 text-lg animate-ping-once">✕</div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Lines */}
                <svg className="absolute inset-0 w-full h-full" fill="none" stroke="rgba(74, 85, 104, 0.4)" strokeWidth="2">
                    <line x1="80" y1="96" x2="50%" y2="96" />
                    <line x1="50%" y1="96" x2="calc(100% - 80px)" y2="36" />
                    <line x1="50%" y1="96" x2="calc(100% - 80px)" y2="96" />
                    <line x1="50%" y1="96" x2="calc(100% - 80px)" y2="156" />
                </svg>

                {/* Packets */}
                {state !== 'idle' && (
                    <>
                        {/* Main Packet to Splitter */}
                        <div className={`absolute top-1/2 -translate-y-1/2 flex gap-1 p-1 rounded-full bg-black/50 backdrop-blur-sm ${state === 'sending' ? 'animate-to-splitter' : 'opacity-0'}`}>
                            {ontData.map(d => <div key={d.id} className={`w-2 h-2 rounded-full ${d.color} ${d.shadow}`} />)}
                        </div>

                        {/* Split Packets to ONTs */}
                        {ontData.map((ont, i) => (
                            <div key={ont.id} className={`absolute top-1/2 -translate-y-1/2 flex gap-1 p-1 rounded-full bg-black/50 backdrop-blur-sm ${state === 'sending' ? 'animate-from-splitter' : 'opacity-0'}`} style={{ animationName: `to-ont-${i+1}` }}>
                                {ontData.map(d => <div key={d.id} className={`w-2 h-2 rounded-full ${d.color} ${d.shadow}`} />)}
                            </div>
                        ))}
                    </>
                )}
            </div>
            <button onClick={handleAnimate} disabled={state !== 'idle'} className="w-full mt-4 font-mono text-xs px-4 py-2 rounded-lg bg-[#00d4ff] text-black font-bold disabled:bg-gray-600 disabled:text-gray-400 hover:bg-white transition-colors">
                {state === 'idle' ? 'Kirim Data Gabungan (Broadcast)' : state === 'sending' ? 'Mengirim...' : 'Data Diterima!'}
            </button>
            <p className="text-center font-mono text-[10px] text-[#4a5568] mt-2">
                Simulasi ini menunjukkan bagaimana data untuk semua pengguna (A, B, C) dikirim bersamaan, tetapi hanya ONT B yang memproses data yang ditujukan untuknya.
            </p>
        </div>
    );
};

export default function FiberOpticAdvancedContent() {
    
    return (
        <div className="space-y-6 text-[#b0c4de] leading-relaxed text-sm">
            <div className="mb-8">
                <Link to="/module/fiber-optic" className="text-cyan-400 hover:underline text-sm">&larr; Kembali ke Materi Dasar</Link>
            </div>
            <SectionTitle number={1} title="Struktur Jaringan FTTH (Fiber to the Home)" />
            <p>
                FTTH adalah arsitektur pengiriman sinyal optik dari pusat penyedia (provider) hingga ke rumah pelanggan. Komponen utamanya adalah:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs pl-2">
                <li><strong className="text-white">OLT (Optical Line Terminal):</strong> Perangkat aktif di sisi provider yang berfungsi sebagai titik awal jaringan FTTH.</li>
                <li><strong className="text-white">Kabel Fiber Optic:</strong> Media transmisi utama yang membawa sinyal cahaya. Terdiri dari kabel feeder, distribusi, dan drop.</li>
                <li><strong className="text-white">ONT (Optical Network Terminal) / ONU:</strong> Perangkat aktif di sisi pelanggan yang menerima sinyal cahaya dan mengubahnya menjadi sinyal listrik.</li>
            </ul>
            <ImagePlaceholder
                src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXf0jXfRM77y-KZ42TZOp3E9H8AtJqlg9f24tR_5VuNwDZaHpkdpPY67zez8QZLBPwhMQoo2MfE8z3XLEAujda0U_8ZZCpLcrLtF5E_K4qEEKUfSJot41wm8EeaBlwjR2DSmKZ2eKy6YtU65QnhV88XrxCDE?key=CVl4fPbiRiSe1yOAdeKflA"
                alt="Diagram Topologi FTTH"
                caption="Arsitektur jaringan Fiber to the Home (FTTH)."
            />

            <SectionTitle number={2} title="Jenis-Jenis Infrastruktur FTTX" />
            <p>
                Infrastruktur fiber optik <strong className="text-white">FTTX (Fiber to the X)</strong> dibagi berdasarkan seberapa jauh kabel serat optik digelar hingga mendekati pengguna akhir. Berikut adalah jenis-jenis infrastruktur FTTX yang dikelompokkan berdasarkan lokasi titik terminasi optiknya:
            </p>

            <h3 className="font-display text-lg font-bold text-white pt-4">Kelompok Utama FTTX</h3>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(0,212,255,0.15)]">
                    <h4 className="font-bold text-[#00d4ff] mb-2">🏠 FTTH (Fiber to the Home)</h4>
                    <p className="text-xs">Jaringan kabel serat optik ditarik <strong className="text-white">langsung sampai ke dalam rumah tinggal atau unit apartemen</strong> konsumen. Ini adalah jenis FTTX dengan penetrasi optik paling dalam.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">🏢 FTTB (Fiber to the Building)</h4>
                    <p className="text-xs">Kabel optik mencapai <strong className="text-white">gedung komersial atau apartemen besar</strong>, lalu distribusi ke dalam ruangan menggunakan kabel tembaga (Ethernet) atau koaksial.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">🛣️ FTTC (Fiber to the Curb / Cabinet)</h4>
                    <p className="text-xs">Titik terminasi optik berada di dalam <strong className="text-white">kabinet jalanan</strong> yang berjarak beberapa ratus meter dari bangunan pengguna, diteruskan dengan kabel tembaga.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">🗼 FTTN (Fiber to the Node / Neighborhood)</h4>
                    <p className="text-xs">Kabel optik berhenti di sebuah <strong className="text-white">simpul pusat (node) berskala lingkungan</strong> yang cakupannya lebih luas dan lebih jauh dari FTTC.</p>
                </div>
            </div>

            <h3 className="font-display text-lg font-bold text-white pt-4">Kelompok FTTX Lainnya</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">🏬 FTTO (Fiber to the Office)</h4>
                    <p className="text-xs">Konsepnya mirip dengan FTTH, namun jaringan serat optik ditarik <strong className="text-white">khusus untuk area perkantoran atau perusahaan</strong> dengan kapasitas data yang lebih besar.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">🖥️ FTTD (Fiber to the Desk)</h4>
                    <p className="text-xs">Kabel serat optik ditarik langsung sampai ke <strong className="text-white">meja kerja atau perangkat komputer pengguna individu</strong> di dalam lingkungan kantor.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">📡 FTTA (Fiber to the Antenna)</h4>
                    <p className="text-xs">Penggunaan kabel optik untuk menghubungkan <strong className="text-white">stasiun pangkalan (base station) ke antena di menara telekomunikasi</strong> untuk mendukung jaringan seluler seperti 4G dan 5G.</p>
                </div>
            </div>

            <SectionTitle number={3} title="Cara Kerja Splitter & Distribusi Data" />
            <p>
                Splitter adalah komponen pasif, artinya ia tidak memerlukan listrik untuk bekerja. Ia membagi sinyal cahaya dari satu serat input ke beberapa serat output. Pertanyaannya adalah: jika semua klien menerima sinyal cahaya yang sama, bagaimana data bisa sampai ke tujuan yang benar?
            </p>
            <SplitterSimulator />
            <ImagePlaceholder
                src="https://tekniksipil.id/wp-content/uploads/2024/08/Neptec-PLC-SPLITTER.png"
                alt="Diagram Cara Kerja Splitter"
                caption="Splitter membagi sinyal optik ke beberapa pelanggan."
            />
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">Arah Downstream (OLT ke ONT)</h4>
                    <p className="text-xs">
                        Seperti yang disimulasikan di atas, dari OLT, data untuk semua pengguna digabungkan menjadi satu sinyal cahaya. Splitter membagi sinyal ini secara merata ke semua ONT yang terhubung. Setiap ONT kemudian akan "mendengarkan" seluruh aliran data, tetapi hanya akan memproses paket data yang ditujukan untuknya (berdasarkan ID unik). Ini seperti seorang penyiar radio yang berbicara ke banyak pendengar, tetapi setiap pendengar hanya memperhatikan pesan yang memanggil nama mereka.
                        Dari OLT, data untuk semua pengguna digabungkan menjadi satu sinyal cahaya. Splitter membagi sinyal ini secara merata ke semua ONT yang terhubung. Setiap ONT kemudian akan "mendengarkan" seluruh aliran data, tetapi hanya akan memproses paket data yang ditujukan untuknya (berdasarkan ID unik). Ini seperti seorang penyiar radio yang berbicara ke banyak pendengar, tetapi setiap pendengar hanya memperhatikan pesan yang memanggil nama mereka.
                    </p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">Arah Upstream (ONT ke OLT)</h4>
                    <p className="text-xs">
                        Ini lebih rumit karena semua ONT tidak bisa mengirim data secara bersamaan (akan terjadi "tabrakan" sinyal). Untuk mengatasi ini, digunakan teknik <strong className="text-white">TDMA (Time Division Multiple Access)</strong>. OLT bertindak sebagai pengatur lalu lintas, memberikan setiap ONT slot waktu (*timeslot*) yang sangat singkat untuk mengirim data. Setiap ONT akan mengirimkan datanya secara bergiliran sesuai jadwal yang diberikan OLT, sehingga tidak ada tabrakan sinyal di titik splitter.
                    </p>
                </div>
            </div>
            <p className="text-xs text-[#64748b] mt-4">
                Jadi, meskipun splitter hanya membagi cahaya secara fisik, kecerdasan jaringan PON terletak pada bagaimana OLT dan ONT mengatur waktu pengiriman dan penerimaan data (<strong className="text-white">multiplexing</strong>) untuk memastikan setiap pengguna mendapatkan data yang benar tanpa mengganggu yang lain.
            </p>
            <SectionTitle number={4} title="Perangkat Pasif Jaringan FTTH" />
            <p>
                Perangkat pasif adalah komponen yang tidak memerlukan daya listrik untuk beroperasi. Mereka berfungsi untuk mendistribusikan, melindungi, dan mengelola serat optik dalam jaringan.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">Splitter Optik</h4>
                    <p className="text-xs">Membagi satu sinyal optik menjadi beberapa sinyal yang lebih lemah. Rasio umum: 1:2, 1:4, 1:8, 1:16, 1:32. Setiap pembagian menimbulkan redaman.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">ODF (Optical Distribution Frame)</h4>
                    <p className="text-xs">Rak atau panel yang berfungsi sebagai titik terminasi, distribusi, dan proteksi kabel fiber optik di Central Office atau POP (Point of Presence).</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">OTB (Optical Termination Box)</h4>
                    <p className="text-xs">Kotak terminasi optik yang digunakan untuk melindungi sambungan dan distribusi serat optik di dalam gedung atau area yang lebih kecil.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">ODC (Optical Distribution Cabinet)</h4>
                    <p className="text-xs">Kabinet distribusi optik yang lebih besar, biasanya diletakkan di luar ruangan (outdoor) untuk mendistribusikan kabel feeder ke kabel distribusi.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">ODP (Optical Distribution Point)</h4>
                    <p className="text-xs">Kotak distribusi optik yang lebih kecil dari ODC, sering dipasang di tiang atau dinding, berfungsi sebagai titik akhir kabel distribusi dan titik awal kabel drop ke pelanggan.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">OTP (Optical Termination Premise) / Roset Optik</h4>
                    <p className="text-xs">Kotak terminasi kecil di dalam rumah pelanggan, tempat kabel drop berakhir dan dihubungkan ke ONT. Melindungi serat optik dari kerusakan.</p>
                </div>
            </div>
            <ImagePlaceholder
                src={["https://universeleader.com.au/wp-content/uploads/2021/10/1x2-to-1x32-PLC-Fiber-Splitter-LGX-CassetteSCUPCSM.jpg", "https://3.bp.blogspot.com/-1zaoCmahY_8/VtUzVt_0USI/AAAAAAAAALE/R6Q-JJJ6B5U/s1600/fdh-indoor1.png", "https://s.alicdn.com/@sc04/kf/Ha5b24ee710454088a0f74a7051f00834Y.png_720x720q50.png", "https://down-id.img.susercontent.com/file/sg-11134201-7rd44-m6s07fxjtt7l22", "https://img.mbizmarket.co.id/products/thumbs/800x800/2023/05/02/e38fee7afd278c1ce07fbb8b4d40eaca.jpg", "https://down-id.img.susercontent.com/file/id-11134207-7r98t-lp5bojy1d7kx16", "https://down-id.img.susercontent.com/file/id-11134207-7rasf-m0mm00enx44g93"]}
                alt="Berbagai Perangkat Pasif FTTH"
                caption="Contoh perangkat pasif seperti ODP, OTB, dan Roset."
            />
            <SectionTitle number={5} title="Redaman (Attenuation) & Power Budget" />
            <p>
                Redaman adalah pelemahan sinyal cahaya saat merambat di sepanjang kabel fiber optik. Satuannya adalah desibel (dB). Total redaman dalam sebuah jaringan harus dihitung agar sinyal yang sampai di ONT masih cukup kuat untuk dibaca. Ini disebut <strong className="text-white">Power Budget Calculation</strong>.
            </p>
            <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                <h4 className="font-bold text-white mb-2">Sumber-sumber Redaman Utama:</h4>
                <ul className="list-disc list-inside space-y-2 text-xs">
                    <li><strong className="text-white">Redaman Kabel:</strong> Pelemahan sinyal per kilometer. Untuk kabel single-mode pada panjang gelombang 1490nm, nilainya sekitar <Code>0.25 dB/km</Code>.</li>
                    <li><strong className="text-white">Redaman Splitter:</strong> Bergantung pada rasio pembagian. Semakin banyak dibagi, semakin besar redamannya. Contoh: Splitter 1:8 memiliki redaman sekitar <Code>10.5 dB</Code>.</li>
                    <li><strong className="text-white">Redaman Sambungan (Splice):</strong> Redaman pada titik penyambungan dua kabel fiber. Nilainya sangat kecil, sekitar <Code>0.1 dB</Code>.</li>
                    <li><strong className="text-white">Redaman Konektor:</strong> Redaman pada konektor (misal: di ODF atau roset). Nilainya sekitar <Code>0.5 dB</Code> per konektor.</li>
                </ul>
            </div>
            <ImagePlaceholder
                src={[ "https://image3.slideserve.com/6720461/link-budget-of-fiber-optics1-l.jpg", "https://www.thefoa.org/tech/Power-Loss-Budgets/Power-and-Link-Loss-Budget.jpg" ]}
                alt="Perhitungan Power Budget"
                caption="Ilustrasi komponen redaman dalam jaringan fiber optic."
            />

            <SectionTitle number={6} title="Standar Daya Terima ONT" />
            <p>
                ONT memiliki ambang batas daya terima agar dapat berfungsi dengan baik. Jika daya yang diterima terlalu lemah, koneksi akan tidak stabil atau bahkan putus sama sekali (LOS - Loss of Signal).
            </p>
            <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-green-400">Baik:</strong> &lt; -24 dBm (misal: -19 dBm, -22 dBm)</li>
                <li><strong className="text-yellow-400">Cukup:</strong> -25 dBm hingga -27 dBm</li>
                <li><strong className="text-red-400">Buruk/LOS:</strong>  -27 dBm (misal: -28 dBm, -30 dBm)</li>
            </ul>
            <p className="text-xs text-[#4a5568]">
                Rumus dasarnya adalah: <strong className="text-[#64748b]">Daya Terima (ONT) = Daya Kirim (OLT) - Total Redaman Jaringan</strong>.
            </p>

            <SectionTitle number={7} title="Peralatan Pendukung & Troubleshooting" />
            <p>
                Untuk membangun dan memelihara jaringan fiber optic, teknisi menggunakan berbagai peralatan khusus untuk penyambungan, pengukuran, dan pencarian masalah.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">Fusion Splicer</h4>
                    <p className="text-xs">Alat presisi tinggi untuk menyambung dua ujung serat optik secara permanen dengan meleburnya menggunakan busur listrik. Menghasilkan sambungan dengan redaman sangat rendah (mendekati 0 dB).</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">OLS & OPM</h4>
                    <p className="text-xs"><strong className="text-white">Optical Light Source (OLS)</strong> memancarkan cahaya stabil, sementara <strong className="text-white">Optical Power Meter (OPM)</strong> mengukur daya cahaya yang diterima. Digunakan berpasangan untuk mengukur total redaman (loss) pada sebuah link.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">OTDR (Optical Time-Domain Reflectometer)</h4>
                    <p className="text-xs">Alat canggih untuk troubleshooting. OTDR mengirim pulsa cahaya dan menganalisis pantulannya untuk membuat "peta" grafis dari link fiber, menunjukkan panjang kabel, lokasi sambungan, dan titik putus dengan akurat.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">VFL (Visual Fault Locator)</h4>
                    <p className="text-xs">Alat berbentuk pena yang memancarkan laser merah terang. Sangat berguna untuk menemukan titik putus atau tekukan tajam pada kabel jarak dekat (patch cord), karena cahaya merah akan bocor keluar di titik masalah.</p>
                </div>
            </div>
            <ImagePlaceholder
                src={["/media/fo/splicer.jpg", "/media/fo/1-1.png", "/media/fo/otdr.jpg", "/media/fo/vfl.jpg"]}
                alt="Peralatan Fiber Optic"
                caption="Berbagai alat yang digunakan teknisi fiber optic untuk instalasi dan troubleshooting."
            />
            
    
            <SectionTitle number={8} title="Jenis-jenis Konektor Fiber Optic" />
            <p>
                Konektor fiber optic berfungsi untuk menyambungkan dua serat optik atau menyambungkan serat optik ke perangkat jaringan. Pemilihan jenis konektor penting untuk memastikan redaman minimal dan kinerja optimal.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">SC (Subscriber Connector / Square Connector)</h4>
                    <p className="text-xs">Konektor persegi dengan mekanisme push-pull. Populer karena mudah digunakan dan redamannya rendah. Sering digunakan di jaringan GPON.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">LC (Lucent Connector / Little Connector)</h4>
                    <p className="text-xs">Konektor kecil dengan mekanisme latch (pengunci) seperti konektor RJ45. Ukurannya yang ringkas membuatnya ideal untuk aplikasi kepadatan tinggi (high-density) seperti di datacenter.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">FC (Ferrule Connector)</h4>
                    <p className="text-xs">Konektor ulir (screw-on) dengan ferrule keramik. Memberikan koneksi yang sangat kuat dan stabil, sering digunakan di lingkungan industri atau aplikasi yang membutuhkan presisi tinggi.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">ST (Straight Tip)</h4>
                    <p className="text-xs">Konektor bayonet (twist-on) yang mirip dengan konektor BNC. Umumnya digunakan pada jaringan multi-mode lama.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">MPO/MTP (Multi-fiber Push-on/pull-off)</h4>
                    <p className="text-xs">Konektor multi-serat yang dapat menampung 12, 24, atau lebih serat dalam satu konektor. Penting untuk koneksi berkecepatan sangat tinggi dan kepadatan tinggi di datacenter.</p>
                </div>
            </div>
            <ImagePlaceholder
                src={["https://arjuscorp.com/wp-content/uploads/2019/07/Conector-SC-SM.jpg", "https://www.commercialelectronics.com/wp-content/uploads/2022/02/lc-connector-type.jpg", "https://www.tarluz.com/wp-content/uploads/2016/01/connector_fc1.jpg", "https://somebooks.es/wp-content/uploads/2017/05/redes033.jpg", "https://abptel.com/wp-content/uploads/2025/07/MPO-vs-MTP-Precision-Matters-in-Fiber-Connectivity-1024x662.jpg"]}
                alt="Jenis-jenis Konektor Fiber Optic"
                caption="Berbagai jenis konektor fiber optic yang umum digunakan."
            />

            {/* Tombol Navigasi Materi Berikutnya */}
            <div className="pt-8 border-t border-[rgba(0,212,255,0.1)] text-center">
                <Link
                    to="/module/ftth-mapping"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00d4ff] text-[#07090f] font-display font-bold text-sm hover:bg-white transition-all duration-200 glow-cyan"
                >
                    <span>Materi Berikutnya: Mapping &amp; Penempatan ODP FTTH</span>
                    <span>→</span>
                </Link>
            </div>
        </div>
    );
}