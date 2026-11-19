import ImagePlaceholder from '../components/ImagePlaceholder';
import { Link } from 'react-router-dom';

const SectionTitle = ({ number, title }: { number: number, title: string }) => (
    <h2 className="font-display text-xl font-bold text-[#00d4ff] mb-4 border-t border-[rgba(0,212,255,0.1)] pt-6">
        <span className="text-base text-[#4a5568] mr-2">{number}.</span>{title}
    </h2>
);

const Code = ({ children }: { children: React.ReactNode }) => (
    <code className="font-mono bg-[#1a2535] px-1.5 py-0.5 rounded-md text-[#f59e0b] text-sm">{children}</code>
);

export default function IPAddressContent() {
    return (
        <div className="space-y-6 text-[#b0c4de] leading-relaxed text-sm">
            <SectionTitle number={1} title="Analogi Sederhana: Memahami IP Address" />
            <p>
                Untuk mempermudah pemahaman, bayangkan sistem pengiriman surat fisik: IP Address ibarat <strong className="text-white">Alamat Rumah + Kode Pos</strong>. Alamat menunjukkan nama jalan/kota (Jaringan/Network) dan nomor rumah spesifik (Perangkat/Host). Tanpa alamat ini, kurir (Router) tidak tahu ke mana harus mengantarkan paket data.
            </p>
            <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                <h4 className="font-bold text-white mb-2">MAC Address vs IP Address:</h4>
                <ul className="list-disc list-inside space-y-2 text-xs">
                    <li><strong className="text-white">MAC Address</strong> adalah seperti Nomor NIK KTP atau nomor seri fisik perangkat. Sifatnya permanen dan tertanam pada Network Interface Card (NIC) sejak diproduksi di pabrik (Layer 2 - Data Link).</li>
                    <li><strong className="text-white">IP Address</strong> adalah seperti Alamat Tempat Tinggal. Sifatnya dinamis/logis dan dapat berubah sesuai jaringan tempat perangkat tersebut terhubung (Layer 3 - Network).</li>
                </ul>
            </div>
            <ImagePlaceholder
                src="https://via.placeholder.com/600x400?text=MAC+vs+IP+Address"
                alt="Perbandingan MAC Address dan IP Address"
                caption="Perbedaan antara identitas fisik (MAC) dan logis (IP) perangkat."
            />

            <SectionTitle number={2} title="Sejarah Singkat dan Evolusi" />
            <p>
                Perjalanan IP Address dimulai dari era ARPANET (1970-an) hingga ledakan internet yang memicu krisis alamat IPv4 di tahun 1990-an. Krisis ini melahirkan solusi darurat seperti Private IP, NAT, dan CIDR, sebelum akhirnya IPv6 diluncurkan pada tahun 1998 sebagai solusi jangka panjang.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">IPv4 (Internet Protocol Version 4)</h4>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Panjang Data: 32 bit (4 Byte).</li>
                        <li>Format: Dotted Decimal (<Code>192.168.1.1</Code>).</li>
                        <li>Komponen: Network ID & Host ID.</li>
                    </ul>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">IPv6 (Internet Protocol Version 6)</h4>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Panjang Data: 128 bit (16 Byte).</li>
                        <li>Format: Hexadecimal (<Code>2001:db8::1</Code>).</li>
                        <li>Kapasitas: 340 Undesilion alamat.</li>
                    </ul>
                </div>
                <ImagePlaceholder
                    src="https://via.placeholder.com/600x400?text=IPv4+vs+IPv6+Header"
                    alt="Perbandingan Header IPv4 dan IPv6"
                    caption="Struktur header paket data IPv4 dan IPv6."
                />
            </div>

            <SectionTitle number={3} title="Klasifikasi IP Address" />
            <h3 className="font-display text-lg font-bold text-white -mt-2 mb-2">A. Berdasarkan Cakupan Akses (Public vs Private)</h3>
            <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-white">Public IP:</strong> Alamat yang dapat diakses langsung dari internet global, dialokasikan oleh ISP.</li>
                <li><strong className="text-white">Private IP:</strong> Alamat untuk jaringan lokal (LAN) dan tidak bisa diakses dari internet. Diatur dalam RFC 1918:
                    <ul className="list-circle list-inside ml-4 mt-1 text-xs space-y-1">
                        <li>Kelas A: <Code>10.0.0.0</Code> – <Code>10.255.255.255</Code> (/8)</li>
                        <li>Kelas B: <Code>172.16.0.0</Code> – <Code>172.31.255.255</Code> (/12)</li>
                        <li>Kelas C: <Code>192.168.0.0</Code> – <Code>192.168.255.255</Code> (/16)</li>
                    </ul>
                </li>
            </ul>

            <h3 className="font-display text-lg font-bold text-white mt-6 mb-2">B. Berdasarkan Cara Alokasi (Static vs Dynamic)</h3>
            <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-white">Static IP:</strong> Dikonfigurasi manual, nilainya tetap. Untuk server, printer, CCTV.</li>
                <li><strong className="text-white">Dynamic IP:</strong> Dialokasikan otomatis oleh DHCP Server, nilainya bisa berubah. Untuk client seperti laptop dan HP.</li>
            </ul>

            <ImagePlaceholder
                src="https://dl.wavlink.com/images/2024/01/25/162406615.jpg"
                alt="Public vs Private IP Address"
                caption="Rentang alamat IP publik dan privat."
            />
            <SectionTitle number={4} title="Subnetting & CIDR" />
            <p>
                Subnetting adalah teknik membagi satu jaringan besar menjadi beberapa sub-jaringan (subnet) yang lebih kecil. Batas antara Network ID dan Host ID ditentukan oleh <strong className="text-white">Subnet Mask</strong> atau <strong className="text-white">Prefix Length (CIDR)</strong>.
            </p>
            <p>
                Contoh: Subnet Mask <Code>255.255.255.0</Code> sama dengan notasi CIDR <Code>/24</Code>. Ini berarti 24 bit pertama adalah untuk Network ID, dan 8 bit sisanya untuk Host ID.
            </p>
            <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                        <tr className="border-b border-[rgba(0,212,255,0.2)] bg-[rgba(0,212,255,0.05)]">
                            <th className="p-2">Notasi CIDR</th>
                            <th className="p-2">Subnet Mask</th>
                            <th className="p-2">Jumlah Bit Host (n)</th>
                            <th className="p-2">Total Host Efektif</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                        <tr>
                            <td className="p-2 text-[#00d4ff]">/24</td>
                            <td className="p-2">255.255.255.0</td>
                            <td className="p-2">8 bit</td>
                            <td className="p-2">254 host</td>
                        </tr>
                        <tr>
                            <td className="p-2 text-[#00d4ff]">/25</td>
                            <td className="p-2">255.255.255.128</td>
                            <td className="p-2">7 bit</td>
                            <td className="p-2">126 host</td>
                        </tr>
                        <tr>
                            <td className="p-2 text-[#00d4ff]">/26</td>
                            <td className="p-2">255.255.255.192</td>
                            <td className="p-2">6 bit</td>
                            <td className="p-2">62 host</td>
                        </tr>
                        <tr>
                            <td className="p-2 text-[#00d4ff]">/30</td>
                            <td className="p-2">255.255.255.252</td>
                            <td className="p-2">2 bit</td>
                            <td className="p-2">2 host (Point-to-Point)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <ImagePlaceholder
                src="https://via.placeholder.com/600x400?text=Subnetting+Diagram"
                alt="Diagram Subnetting"
                caption="Pembagian jaringan besar menjadi subnet-subnet kecil."
            />

            <SectionTitle number={5} title="Cara Kerja Pengiriman Paket Data" />
            <p>
                Ketika Laptop A (<Code>192.168.1.10</Code>) ingin mengirim data, ia akan melakukan evaluasi:
            </p>
            <div className="space-y-4">
                <div>
                    <h4 className="font-bold text-white mb-2">1. Jika tujuan di jaringan lokal (LAN) - misal ke Server B (<Code>192.168.1.50</Code>):</h4>
                    <ol className="list-decimal list-inside space-y-2 pl-4 text-xs">
                        <li><strong className="text-white">Evaluasi Subnet:</strong> Laptop A melakukan operasi logika AND antara IP tujuan dan subnet mask-nya untuk mengecek apakah tujuan berada di jaringan yang sama.</li>
                        <li><strong className="text-white">Pencarian MAC Address (ARP):</strong> Jika di jaringan yang sama, Laptop A memeriksa ARP Cache. Jika MAC address Server B belum ada, Laptop A mengirimkan ARP Request secara broadcast.</li>
                        <li><strong className="text-white">Enkapsulasi Data:</strong> Data dibungkus dengan Header IP (IP Asal & Tujuan) lalu ditutupi Header Ethernet (MAC Asal & Tujuan).</li>
                        <li><strong className="text-white">Pengiriman Paket:</strong> Switch meneruskan frame tersebut langsung ke port fisik Server B berdasarkan MAC Address tujuan.</li>
                    </ol>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-2">2. Jika tujuan di luar jaringan lokal - misal ke Google (<Code>142.250.190.46</Code>):</h4>
                    <ol className="list-decimal list-inside space-y-2 pl-4 text-xs">
                        <li><strong className="text-white">Penerusan ke Gateway:</strong> Laptop A tidak mengirim data langsung ke IP tujuan, melainkan meneruskannya ke <strong className="text-white">Default Gateway</strong> (Router).</li>
                        <li><strong className="text-white">Routing:</strong> Router menggunakan tabel routing untuk memilih jalur terbaik melintasi internet hingga paket sampai ke tujuan.</li>
                    </ol>
                </div>
                <ImagePlaceholder
                    src="https://via.placeholder.com/600x400?text=Packet+Flow+Diagram"
                    alt="Diagram Aliran Paket Data"
                    caption="Bagaimana paket data dikirim dalam jaringan lokal dan ke internet."
                />
            </div>

            <SectionTitle number={6} title="Perbandingan IPv4 vs IPv6" />
            <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                        <tr className="border-b border-[rgba(0,212,255,0.2)] bg-[rgba(0,212,255,0.05)]">
                            <th className="p-2">Fitur</th>
                            <th className="p-2">IPv4</th>
                            <th className="p-2">IPv6</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                        <tr>
                            <td className="p-2 text-[#00d4ff]">Ukuran Alamat</td>
                            <td className="p-2">32 bit</td>
                            <td className="p-2">128 bit</td>
                        </tr>
                        <tr>
                            <td className="p-2 text-[#00d4ff]">Jumlah Alamat</td>
                            <td className="p-2">~4,3 Miliar</td>
                            <td className="p-2">~340 Undesilion</td>
                        </tr>
                        <tr>
                            <td className="p-2 text-[#00d4ff]">Format Penulisan</td>
                            <td className="p-2">Desimal (192.168.1.1)</td>
                            <td className="p-2">Heksadesimal (2001:db8::1)</td>
                        </tr>
                        <tr>
                            <td className="p-2 text-[#00d4ff]">Konfigurasi Alamat</td>
                            <td className="p-2">Manual / DHCP</td>
                            <td className="p-2">Auto-configuration (SLAAC) / DHCPv6</td>
                        </tr>
                        <tr>
                            <td className="p-2 text-[#00d4ff]">Keamanan (IPsec)</td>
                            <td className="p-2">Opsional (tambahan)</td>
                            <td className="p-2">Terintegrasi secara native</td>
                        </tr>
                        <tr>
                            <td className="p-2 text-[#00d4ff]">Kebutuhan NAT</td>
                            <td className="p-2">Wajib untuk efisiensi</td>
                            <td className="p-2">Tidak diperlukan (End-to-End)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Tombol Navigasi Materi Berikutnya */}
            <div className="pt-8 border-t border-[rgba(0,212,255,0.1)] text-center">
                <Link
                    to="/module/network-protocols"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00d4ff] text-[#07090f] font-display font-bold text-sm hover:bg-white transition-all duration-200 glow-cyan"
                >
                    <span>Materi Berikutnya: Protokol Jaringan</span>
                    <span>→</span>
                </Link>
            </div>
        </div>
    );
}