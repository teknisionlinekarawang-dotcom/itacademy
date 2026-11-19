import ImagePlaceholder from '../components/ImagePlaceholder';
import ToolTipPlaceholder from '../components/ToolTipPlaceholder';
import ToolTipplaceholder from '../components/ToolTipPlaceholder';
import { Link } from 'react-router-dom';

const SectionTitle = ({ number, title }: { number: number, title: string }) => (
    <h2 className="font-display text-xl font-bold text-[#00d4ff] mb-4 border-t border-[rgba(0,212,255,0.1)] pt-6">
        <span className="text-base text-[#4a5568] mr-2">{number}.</span>{title}
    </h2>
);

const TopologyCard = ({ title, pros, cons, children }: { title: string, pros: string, cons: string, children: React.ReactNode }) => (
    <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
        <div className="flex items-center gap-3 mb-3">
            {children}
            <h4 className="font-bold text-white">{title}</h4>
        </div>
        <div className="space-y-2 text-xs">
            <p><strong className="text-green-400">Kelebihan:</strong> {pros}</p>
            <p><strong className="text-red-400">Kekurangan:</strong> {cons}</p>
        </div>
    </div>
);

const DeviceCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
        <div className="flex items-center gap-3 mb-3">
            {icon}
            <h4 className="font-bold text-white">{title}</h4>
        </div>
        <div className="text-xs">{children}</div>
    </div>
);

const Code = ({ children }: { children: React.ReactNode }) => (
    <code className="font-mono bg-[#1a2535] px-1.5 py-0.5 rounded-md text-[#f59e0b] text-sm">{children}</code>
);

export default function TopologyContent() {
    return (
        <div className="space-y-6 text-[#b0c4de] leading-relaxed text-sm">
            <SectionTitle number={1} title="Jenis-Jenis Jaringan Berdasarkan Jangkauan Geografis" />
            <p>
                Jaringan komputer dapat diklasifikasikan berdasarkan <strong className="text-white">jangkauan geografisnya</strong>, mulai dari skala yang sangat kecil di sekitar perangkat hingga skala global antar-negara. Berikut jenis-jenisnya:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
                <DeviceCard icon={<span className="text-2xl">📱</span>} title="PAN (Personal Area Network)">
                    <p className="mb-2"><strong className="text-white">Jangkauan:</strong> Sangat dekat, hanya mencakup area di sekitar perangkat (biasanya beberapa meter).</p>
                    <p><strong className="text-white">Contoh:</strong> Koneksi Bluetooth antara smartphone dan headset.</p>
                </DeviceCard>

                <DeviceCard icon={<span className="text-2xl">🏠</span>} title="LAN (Local Area Network)">
                    <p className="mb-2"><strong className="text-white">Jangkauan:</strong> Area terbatas, seperti dalam satu rumah, sekolah, atau kantor.</p>
                    <p><strong className="text-white">Contoh:</strong> Jaringan komputer di dalam rumah, laboratorium sekolah, atau kantor.</p>
                </DeviceCard>

                <DeviceCard icon={<span className="text-2xl">🏙️</span>} title="MAN (Metropolitan Area Network)">
                    <p className="mb-2"><strong className="text-white">Jangkauan:</strong> Menghubungkan antar-LAN dalam satu kota (wilayah metropolitan).</p>
                    <p><strong className="text-white">Contoh:</strong> Jaringan perbankan yang menghubungkan cabang-cabang bank di satu kota.</p>
                </DeviceCard>

                <DeviceCard icon={<span className="text-2xl">🌍</span>} title="WAN (Wide Area Network)">
                    <p className="mb-2"><strong className="text-white">Jangkauan:</strong> Global atau antar-negara.</p>
                    <p className="mb-3"><strong className="text-white">Contoh:</strong> Internet adalah WAN terbesar yang menghubungkan jaringan-jaringan di seluruh dunia.</p>
                    <Link
                        to="/module/internet-working"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00d4ff] text-[#07090f] font-display font-bold text-xs hover:bg-white transition-all duration-200 glow-cyan"
                    >
                        <span>Pelajari Internet Bekerja</span>
                        <span>→</span>
                    </Link>
                </DeviceCard>
            </div>

            <div>
                <ImagePlaceholder
                    src={["/media/network/pan.jpg"]}
                    alt="Jenis-Jenis Jaringan Berdasarkan Jangkauan Geografis"
                    caption="Ilustrasi jenis-jenis jaringan berdasarkan jangkauan geografis."
                />
            </div>

            <SectionTitle number={2} title="Topologi Jaringan (Bentuk Fisik/Logis)" />
            <p>
                Setelah memahami jenis jaringan berdasarkan jangkauan, selanjutnya kita pelajari <strong className="text-white">topologi jaringan</strong>, yaitu tata letak atau desain geometris tentang bagaimana perangkat (seperti komputer, switch, router) saling terhubung dalam sebuah jaringan. Topologi ini bisa berupa tata letak fisik (bagaimana kabel dipasang) atau logis (bagaimana data mengalir). Berikut jenis-jenis topologi yang umum digunakan:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
                <TopologyCard title="Topologi Bus" pros="Murah dan mudah diinstalasi karena semua perangkat terhubung ke satu kabel utama (backbone)." cons="Jika kabel utama (backbone) putus, seluruh jaringan mati.">
                    <span className="text-2xl">🚌</span>
                </TopologyCard>

                <TopologyCard title="Topologi Star (Bintang)" pros="Paling populer digunakan; mudah dikelola dan jika satu kabel client putus, tidak mempengaruhi yang lain." cons="Sangat bergantung pada perangkat pusat (hub/switch). Jika pusat gagal, seluruh jaringan ikut mati.">
                    <span className="text-2xl">⭐</span>
                </TopologyCard>

                <TopologyCard title="Topologi Ring (Cincin)" pros="Aliran data teratur karena data mengalir searah mengikuti lingkaran." cons="Jika satu node gagal, seluruh jaringan bisa terganggu.">
                    <span className="text-2xl">💍</span>
                </TopologyCard>

                <TopologyCard title="Topologi Mesh (Jala)" pros="Sangat aman (fault-tolerant) karena banyak jalur alternatif jika salah satu jalur putus." cons="Sangat mahal dan boros kabel, karena setiap perangkat terhubung langsung ke semua perangkat lain.">
                    <span className="text-2xl">🕸️</span>
                </TopologyCard>
            </div>

            <ImagePlaceholder
                src={["https://4.bp.blogspot.com/-7QYdWeWVxPo/XCMAkcGK5iI/AAAAAAAAAxs/siCE0wx0Bf0KojBWcELIVCKxlrZlDkm1wCEwYBhgL/s1600/Untitled-4.jpg", "/media/network/mesh.jpeg"]}
                alt="Gambaran Umum Topologi Jaringan"
                caption="Berbagai cara perangkat terhubung dalam jaringan."
            />

            <SectionTitle number={3} title="Perangkat Keras Jaringan (Hardware)" />
            <p>
                Agar sebuah jaringan dapat bekerja, diperlukan <strong className="text-white">perangkat keras (hardware)</strong> yang berperan sebagai media transmisi dan pengelola lalu lintas data. Berikut perangkat keras jaringan yang umum digunakan:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
                <DeviceCard icon={<span className="text-2xl">🔌</span>} title="Kabel Jaringan"><ToolTipPlaceholder
                    title="Kabel Jaringan"
                    description="Kabel Jaringan adalah media transmisi fisik yang menghantarkan data antar perangkat."
                    imageSrc="/media/network/kabel-jaringan.jpg"
                    imageAlt="Kabel Jaringan"
                    imageCaption="Kabel Jaringan adalah media transmisi fisik yang menghantarkan data antar perangkat."
                />
                    <p className="mb-2"><strong className="text-white">Peran:</strong> Media transmisi fisik yang menghantarkan data antar perangkat.</p>
                    <p><strong className="text-white">Contoh:</strong> Kabel UTP/LAN dan Kabel Serat Optik (Fiber Optic).</p>
                </DeviceCard>

                <DeviceCard icon={<span className="text-2xl">📇</span>} title="NIC (Network Interface Card)"><ToolTipPlaceholder
                    title="NIC (Network Interface Card)"
                    description="NIC (Network Interface Card) adalah kartu jaringan yang tertanam di komputer agar dapat terhubung ke jaringan, baik melalui kabel maupun Wi-Fi. Setiap NIC memiliki MAC Address unik."
                    imageSrc="/media/network/nic.jpg"
                    imageAlt="NIC (Network Interface Card)"
                    imageCaption="NIC (Network Interface Card) adalah kartu jaringan yang tertanam di komputer agar dapat terhubung ke jaringan."
                    trigger="hover"
                />
                    <p><strong className="text-white">Peran:</strong> Kartu jaringan yang tertanam di komputer agar dapat terhubung ke jaringan, baik melalui kabel maupun Wi-Fi. Setiap NIC memiliki MAC Address unik.</p>
                </DeviceCard>

                <DeviceCard icon={<span className="text-2xl">🔀</span>} title="Hub & Switch"><ToolTipPlaceholder
                    title="Hub & Switch"
                    description="Hub dan Switch adalah perangkat jaringan yang digunakan untuk menghubungkan beberapa perangkat dalam jaringan lokal (LAN)."
                    imageSrc="/media/network/switch.jpg"
                    imageAlt="Hub dan Switch"
                    imageCaption="Hub dan Switch digunakan untuk menghubungkan perangkat dalam jaringan lokal."
                    trigger="hover"
                />
                    <p className="mb-2"><strong className="text-white">Peran:</strong> Penghubung antar-komputer dalam jaringan lokal (LAN).</p>
                    <p><strong className="text-white">Catatan:</strong> Switch lebih pintar daripada hub karena switch dapat menyaring data, sehingga data hanya dikirim ke perangkat yang dituju.</p>
                </DeviceCard>

                <DeviceCard icon={<span className="text-2xl">🚦</span>} title="Router"><ToolTipplaceholder
                    title="Router"
                    description="Router adalah perangkat jaringan yang digunakan untuk menghubungkan dua atau lebih jaringan yang berbeda. Router bekerja pada layer jaringan (Layer 3) dan dapat memilih jalur terbaik untuk mengirim data."
                    imageSrc="/media/network/router.jpg"
                    imageAlt="Router"
                    imageCaption="Router adalah perangkat jaringan yang menghubungkan beberapa jaringan."
                    trigger="hover"                
                />
                    <p className="mb-2"><strong className="text-white">Peran:</strong> Menghubungkan dua atau lebih jaringan yang berbeda.</p>
                    <p><strong className="text-white">Contoh:</strong> Menghubungkan LAN rumah ke internet.</p>
                </DeviceCard>

                <DeviceCard icon={<span className="text-2xl">📡</span>} title="Modem">
                <ToolTipplaceholder
                    title="Modem"
                    description="Modem adalah perangkat yang digunakan untuk mengubah sinyal digital menjadi analog dan sebaliknya, memungkinkan komputer untuk terhubung ke jaringan telepon."
                    imageSrc="/media/network/modem.jpg"
                    imageAlt="Modem"
                    imageCaption="Modem digunakan untuk menghubungkan komputer ke jaringan telepon."
                    trigger="hover"
                />
                    <p className="mb-2"><strong className="text-white">Peran:</strong> Mengubah sinyal analog menjadi digital dan sebaliknya.</p>
                    <p><strong className="text-white">Kegunaan:</strong> Digunakan untuk mengakses internet melalui media seperti kabel telepon atau serat optik.</p>
                </DeviceCard>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-4">
                <Link
                    to="/module/crimping"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00d4ff] text-[#07090f] font-display font-bold text-sm hover:bg-white transition-all duration-200 glow-cyan"
                >
                    <span>Pelajari Kabel UTP</span>
                    <span>→</span>
                </Link>
                <Link
                    to="/module/fiber-optic"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00d4ff] text-[#07090f] font-display font-bold text-sm hover:bg-white transition-all duration-200 glow-cyan"
                >
                    <span>Pelajari Fiber Optic</span>
                    <span>→</span>
                </Link>
            </div>

            <SectionTitle number={4} title="Protokol dan Pengalamatan (IP Address)" />
            <p>
                Setiap perangkat dalam jaringan membutuhkan <strong className="text-white">alamat (pengalamatan)</strong> agar data dapat dikirim ke tujuan yang tepat, serta <strong className="text-white">protokol</strong> sebagai aturan komunikasi yang disepakati. Berikut penjelasannya:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">IP Address (Alamat IP)</h4>
                    <p className="text-xs"><strong className="text-white">Peran:</strong> Identitas numerik unik untuk setiap perangkat dalam sebuah jaringan.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">MAC Address</h4>
                    <p className="text-xs"><strong className="text-white">Peran:</strong> Alamat fisik yang permanen dan unik, melekat pada NIC sejak diproduksi di pabrik.</p>
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-[#f59e0b] mb-2">IPv4</h4>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Menggunakan format 32-bit.</li>
                        <li>Contoh: <Code>192.168.1.1</Code></li>
                    </ul>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-[#f59e0b] mb-2">IPv6</h4>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Menggunakan format 128-bit berbasis heksadesimal.</li>
                        <li>Diciptakan untuk menggantikan IPv4 yang mulai habis.</li>
                    </ul>
                </div>
            </div>
            <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                <h4 className="font-bold text-white mb-2">Protokol Populer</h4>
                <ul className="list-disc list-inside space-y-1 text-xs">
                    <li><strong className="text-white">HTTP/HTTPS:</strong> Protokol untuk web (HyperText Transfer Protocol berfungsi untuk web).</li>
                    <li><strong className="text-white">FTP:</strong> Protokol untuk transfer file.</li>
                    <li><strong className="text-white">DNS:</strong> Mengubah nama domain menjadi IP address.</li>
                </ul>
            </div>

            <div className="mt-4 flex justify-center">
                <Link
                    to="/module/ip-address"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00d4ff] text-[#07090f] font-display font-bold text-sm hover:bg-white transition-all duration-200 glow-cyan"
                >
                    <span>Pelajari IP Address</span>
                    <span>→</span>
                </Link>
            </div>

            <SectionTitle number={5} title="Model Referensi Jaringan (OSI Layer vs TCP/IP)" />
            <p>
                Model OSI dan TCP/IP digunakan untuk memahami bagaimana <strong className="text-white">data mengalir dari satu komputer ke komputer lain</strong> melalui jaringan. Kedua model ini membagi proses komunikasi menjadi beberapa layer (lapisan), dari yang paling dekat dengan perangkat keras hingga yang paling dekat dengan pengguna.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-3">OSI Model (7 Layer)</h4>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                        <li><strong className="text-white">Physical</strong></li>
                        <li><strong className="text-white">Data Link</strong></li>
                        <li><strong className="text-white">Network</strong></li>
                        <li><strong className="text-white">Transport</strong></li>
                        <li><strong className="text-white">Session</strong></li>
                        <li><strong className="text-white">Presentation</strong></li>
                        <li><strong className="text-white">Application</strong></li>
                    </ol>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-3">TCP/IP Model (4 Layer)</h4>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                        <li><strong className="text-white">Network Interface</strong></li>
                        <li><strong className="text-white">Internet</strong></li>
                        <li><strong className="text-white">Transport</strong></li>
                        <li><strong className="text-white">Application</strong></li>
                    </ol>
                </div>
            </div>
        </div>
    );
}