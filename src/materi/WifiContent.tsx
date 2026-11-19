import ImagePlaceholder from '../components/ImagePlaceholder';

const SectionTitle = ({ number, title }: { number: number, title: string }) => (
    <h2 className="font-display text-xl font-bold text-[#00d4ff] mb-4 border-t border-[rgba(0,212,255,0.1)] pt-6">
        <span className="text-base text-[#4a5568] mr-2">{number}.</span>{title}
    </h2>
);

const Code = ({ children }: { children: React.ReactNode }) => (
    <code className="font-mono bg-[#1a2535] px-1.5 py-0.5 rounded-md text-[#f59e0b] text-sm">{children}</code>
);

export default function WifiContent() {
    return (
        <div className="space-y-6 text-[#b0c4de] leading-relaxed text-sm">
            <SectionTitle number={1} title="Apa itu Wi-Fi?" />
            <p>
                Wi-Fi (singkatan dari <strong className="text-white">Wireless Fidelity</strong>) adalah teknologi yang memungkinkan perangkat elektronik seperti komputer, smartphone, dan printer untuk terhubung ke jaringan secara nirkabel menggunakan gelombang radio. Bayangkan Wi-Fi seperti stasiun radio pribadi untuk data Anda, di mana <strong className="text-white">Access Point (Router)</strong> bertindak sebagai pemancar dan perangkat Anda sebagai penerima.
            </p>
            <ImagePlaceholder
                src="https://www.bhinneka.com/blog/wp-content/uploads/2021/09/fungsi-router.jpg"
                alt="Diagram Jaringan Wi-Fi"
                caption="Bagaimana perangkat terhubung ke router Wi-Fi."
            />

            <SectionTitle number={2} title="Bagaimana Wi-Fi Bekerja?" />
            <p>
                Prosesnya mengubah data digital (bit 0 dan 1) menjadi sinyal radio untuk dikirim, dan sebaliknya.
            </p>
            <ol className="list-decimal list-inside space-y-2 pl-2">
                <li><strong className="text-white">Enkoding & Modulasi:</strong> Kartu Wi-Fi (adapter) pada perangkat Anda mengambil data digital dan mengubahnya menjadi sinyal radio melalui proses modulasi.</li>
                <li><strong className="text-white">Transmisi:</strong> Antena mengirimkan sinyal radio ini ke segala arah.</li>
                <li><strong className="text-white">Penerimaan & Demodulasi:</strong> Antena pada router menangkap sinyal radio tersebut, mengubahnya kembali menjadi data digital, dan meneruskannya ke internet (atau perangkat lain di jaringan lokal).</li>
            </ol>
            <p className="text-xs text-[#64748b]">
                Nama jaringan Wi-Fi yang Anda lihat disebut <strong className="text-white">SSID (Service Set Identifier)</strong>. Saat Anda terhubung, perangkat Anda melakukan "jabat tangan" (authentication & association) dengan router.
            </p>
            <ImagePlaceholder
                src="https://via.placeholder.com/600x400?text=Radio+Wave+Propagation"
                alt="Perambatan Gelombang Radio"
                caption="Ilustrasi gelombang radio yang membawa data Wi-Fi."
            />

            <SectionTitle number={3} title="Frekuensi & Channel Wi-Fi" />
            <p>
                Wi-Fi beroperasi pada pita frekuensi radio tertentu, yang paling umum adalah 2.4 GHz dan 5 GHz.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">Pita 2.4 GHz</h4>
                    <p className="text-xs mb-2">Jalan raya yang lebih tua, lebih ramai, tapi jangkauannya jauh.</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li><strong className="text-green-400">Kelebihan:</strong> Jangkauan lebih luas, lebih baik menembus dinding/halangan.</li>
                        <li><strong className="text-red-400">Kekurangan:</strong> Kecepatan lebih rendah, sangat rentan terhadap interferensi dari Bluetooth, microwave, dan jaringan Wi-Fi tetangga. Hanya memiliki 3 channel yang tidak tumpang tindih (1, 6, 11).</li>
                    </ul>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">Pita 5 GHz</h4>
                    <p className="text-xs mb-2">Jalan tol modern, sangat cepat, tapi jangkauannya lebih pendek.</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li><strong className="text-green-400">Kelebihan:</strong> Kecepatan jauh lebih tinggi, lebih banyak channel (tidak tumpang tindih), lebih sedikit interferensi.</li>
                        <li><strong className="text-red-400">Kekurangan:</strong> Jangkauan lebih pendek, lebih sulit menembus dinding.</li>
                    </ul>
                </div>
            </div>
            <p className="text-xs text-[#4a5568]">
                Ada juga pita <strong className="text-white">6 GHz (Wi-Fi 6E)</strong>, yang merupakan "jalan tol super" baru dengan lebih banyak ruang dan kecepatan lebih tinggi lagi, namun jangkauannya paling pendek.
            </p>
            <ImagePlaceholder
                src="https://via.placeholder.com/600x400?text=2.4GHz+vs+5GHz"
                alt="Perbandingan Frekuensi 2.4 GHz dan 5 GHz"
                caption="Karakteristik pita frekuensi Wi-Fi."
            />

            <SectionTitle number={4} title="Standar & Generasi Wi-Fi (IEEE 802.11)" />
            <p>
                Teknologi Wi-Fi terus berkembang, dengan setiap generasi baru menawarkan kecepatan lebih tinggi dan fitur lebih baik. Standar ini dikelola oleh IEEE dengan kode <Code>802.11</Code>.
            </p>
            <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                        <tr className="border-b border-[rgba(0,212,255,0.2)] bg-[rgba(0,212,255,0.05)]">
                            <th className="p-2">Generasi</th>
                            <th className="p-2">Standar</th>
                            <th className="p-2">Frekuensi</th>
                            <th className="p-2">Kecepatan Maks. (Teoritis)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                        <tr><td className="p-2 text-[#f59e0b]">Wi-Fi 4</td><td className="p-2">802.11n</td><td className="p-2">2.4/5 GHz</td><td className="p-2">600 Mbps</td></tr>
                        <tr><td className="p-2 text-[#00d4ff]">Wi-Fi 5</td><td className="p-2">802.11ac</td><td className="p-2">5 GHz</td><td className="p-2">6.9 Gbps</td></tr>
                        <tr><td className="p-2 text-[#10b981]">Wi-Fi 6</td><td className="p-2">802.11ax</td><td className="p-2">2.4/5 GHz</td><td className="p-2">9.6 Gbps</td></tr>
                        <tr><td className="p-2 text-[#a855f7]">Wi-Fi 6E</td><td className="p-2">802.11ax</td><td className="p-2">6 GHz</td><td className="p-2">9.6 Gbps</td></tr>
                    </tbody>
                </table>
            </div>
            <ImagePlaceholder
                src="https://bte-jkt.telkomuniversity.ac.id/wp-content/uploads/2023/09/image-5.png"
                alt="Timeline Standar Wi-Fi"
                caption="Evolusi standar Wi-Fi dari 802.11n hingga Wi-Fi 6E."
            />

            <SectionTitle number={5} title="Keamanan Jaringan Nirkabel" />
            <p>
                Karena sinyal Wi-Fi dapat ditangkap oleh siapa saja dalam jangkauan, enkripsi sangat penting untuk melindungi data Anda.
            </p>
            <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-red-500">WEP (Wired Equivalent Privacy):</strong> Standar sangat lama dan <strong className="text-red-500">sangat tidak aman</strong>. Jangan pernah digunakan.</li>
                <li><strong className="text-yellow-500">WPA (Wi-Fi Protected Access):</strong> Peningkatan dari WEP, tetapi juga sudah usang.</li>
                <li><strong className="text-green-400">WPA2 (Wi-Fi Protected Access 2):</strong> Standar keamanan yang paling umum digunakan selama bertahun-tahun, menggunakan enkripsi AES yang kuat.</li>
                <li><strong className="text-cyan-400">WPA3 (Wi-Fi Protected Access 3):</strong> Standar terbaru dan <strong className="text-cyan-400">paling aman</strong>, menawarkan perlindungan yang lebih baik terhadap serangan dan enkripsi yang lebih kuat, bahkan di jaringan Wi-Fi publik.</li>
            </ul>

            <ImagePlaceholder
                src="https://via.placeholder.com/600x400?text=WPA3+Security"
                alt="Keamanan WPA3"
                caption="Logo atau konsep keamanan WPA3."
            />
            <SectionTitle number={6} title="Konsep Penting Lainnya" />
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">MIMO & Beamforming</h4>
                    <p className="text-xs">
                        <strong className="text-white">MIMO (Multiple-Input Multiple-Output)</strong> menggunakan beberapa antena pada router dan perangkat untuk mengirim dan menerima beberapa aliran data secara bersamaan, seperti memiliki beberapa jalur di jalan tol. <strong className="text-white">Beamforming</strong> adalah teknologi pintar di mana router dapat memfokuskan sinyal Wi-Fi langsung ke arah perangkat Anda, bukan menyebarkannya ke segala arah, sehingga koneksi lebih kuat dan stabil.
                    </p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">Mesh Wi-Fi</h4>
                    <p className="text-xs">
                        Sistem Mesh Wi-Fi menggunakan beberapa unit (node) yang tersebar di seluruh rumah untuk menciptakan satu jaringan Wi-Fi yang mulus dan luas. Berbeda dengan *range extender* yang membuat jaringan terpisah, sistem mesh bekerja sama secara cerdas untuk memastikan perangkat Anda selalu terhubung ke node dengan sinyal terkuat tanpa putus.
                    </p>
                </div>
            </div>

            <SectionTitle number={7} title="Evolusi Jaringan Nirkabel Seluler" />
            <p>
                Selain Wi-Fi, jaringan seluler juga merupakan bagian penting dari konektivitas nirkabel, terutama untuk perangkat mobile di luar jangkauan Wi-Fi. Evolusinya membawa peningkatan kecepatan yang drastis.
            </p>
            <ul className="list-disc list-inside space-y-3 text-xs">
                <li><strong className="text-white">2G (GPRS/EDGE):</strong> Generasi pertama "internet mobile". GPRS (~50 Kbps) memungkinkan pengiriman data paket, sementara EDGE (~200 Kbps) memberikan kecepatan yang sedikit lebih baik. Cukup untuk browsing ringan dan email teks.</li>
                <li><strong className="text-white">3G (HSPA/HSDPA):</strong> Revolusi internet mobile sejati. Dengan kecepatan beberapa Mbps, 3G memungkinkan browsing web modern, video call, dan streaming musik. HSPA/HSDPA adalah versi yang lebih cepat dari 3G.</li>
                <li><strong className="text-white">4G (LTE - Long Term Evolution):</strong> Standar dominan saat ini, menawarkan kecepatan puluhan hingga ratusan Mbps. 4G membuat streaming video HD, game online, dan pekerjaan remote di perangkat mobile menjadi hal yang umum.</li>
                <li><strong className="text-white">5G:</strong> Generasi terbaru dengan tiga keunggulan utama: kecepatan sangat tinggi (eMBB), latensi sangat rendah (URLLC), dan kemampuan menghubungkan jutaan perangkat per kilometer persegi (mMTC). Ini membuka jalan untuk mobil otonom, smart city, dan aplikasi IoT canggih.</li>
                <li><strong className="text-white">FWA (Fixed Wireless Access):</strong> Salah satu aplikasi 5G yang menarik. FWA menggunakan sinyal 5G untuk menyediakan koneksi internet berkecepatan tinggi ke rumah atau kantor, menjadi alternatif nirkabel untuk koneksi fiber optic atau kabel.</li>
            </ul>

            <SectionTitle number={8} title="Teknologi Nirkabel Masa Depan & Alternatif" />
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">Li-Fi (Light Fidelity)</h4>
                    <p className="text-xs">Teknologi yang mentransmisikan data menggunakan spektrum cahaya tampak dari bola lampu LED, bukan gelombang radio. Ini menawarkan kecepatan sangat tinggi dan keamanan yang lebih baik (karena cahaya tidak menembus dinding), tetapi memerlukan garis pandang langsung (line-of-sight) dan tidak berfungsi dalam gelap.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">Wi-Fi 7 (802.11be)</h4>
                    <p className="text-xs">Generasi Wi-Fi berikutnya yang akan datang. Wi-Fi 7 menjanjikan kecepatan teoritis hingga 46 Gbps, latensi yang jauh lebih rendah, dan fitur canggih seperti <strong className="text-white">Multi-Link Operation (MLO)</strong>, yang memungkinkan perangkat untuk terhubung ke beberapa pita frekuensi (2.4, 5, dan 6 GHz) secara bersamaan untuk koneksi yang lebih andal dan cepat.</p>
                </div>
            </div>
            <ImagePlaceholder src="https://www.purelifi.com/wp-content/uploads/2022/04/pureLiFi-LiFi-vs-WiFi-scaled.jpg" alt="Perbandingan Li-Fi dan Wi-Fi" caption="Li-Fi menggunakan cahaya, sementara Wi-Fi menggunakan gelombang radio." />
        </div>
    );
}