import ImagePlaceholder from '../components/ImagePlaceholder';
import MikrotikSimulator from '../simulator/MikrotikSimulator'; // Import the new simulator

const SectionTitle = ({ number, title }: { number: number, title: string }) => (
    <h2 className="font-display text-xl font-bold text-[#00d4ff] mb-4 border-t border-[rgba(0,212,255,0.1)] pt-8 mt-8">
        <span className="text-base text-[#4a5568] mr-2">{number}.</span>{title}
    </h2>
);

export default function MikrotikContent() {
    return (
        <div className="space-y-4 text-[#b0c4de] leading-relaxed text-sm">
            <p>
                <strong className="text-white">MikroTik</strong> adalah perusahaan asal Latvia yang mengembangkan perangkat keras (hardware) dan perangkat lunak (software) untuk jaringan komputer. Produk utamanya adalah <strong className="text-white">RouterBOARD</strong> (hardware) dan <strong className="text-white">RouterOS</strong> (sistem operasi). MikroTik sangat populer karena harganya yang terjangkau namun memiliki fitur yang sangat lengkap, setara dengan router kelas enterprise yang jauh lebih mahal.
            </p>

            <div className="grid md:grid-cols-3 gap-4 my-6">
                <div className="p-3 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)] text-center">
                    <img src="/media/img/hap-ac-lite.jpg" alt="MikroTik hAP ac lite" className="h-20 mx-auto object-contain mb-2"/>
                    <h5 className="font-bold text-white text-xs">RouterBOARD hAP series</h5>
                    <p className="text-[10px] text-gray-500">Router SOHO (Small Office/Home Office) yang ringkas dan populer.</p>
                </div>
                <div className="p-3 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)] text-center">
                    <img src="/media/img/rb4011.jpg" alt="MikroTik RB4011" className="h-20 mx-auto object-contain mb-2"/>
                    <h5 className="font-bold text-white text-xs">RouterBOARD RB series</h5>
                    <p className="text-[10px] text-gray-500">Router kelas menengah dengan performa tinggi untuk bisnis kecil hingga menengah.</p>
                </div>
                <div className="p-3 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)] text-center">
                    <img src="/media/img/CCR2004.png" alt="MikroTik CCR" className="h-20 mx-auto object-contain mb-2"/>
                    <h5 className="font-bold text-white text-xs">Cloud Core Router (CCR)</h5>
                    <p className="text-[10px] text-gray-500">Router kelas enterprise dengan puluhan core CPU untuk ISP dan jaringan skala besar.</p>
                </div>
            </div>

            <SectionTitle number={1} title="Apa itu RouterOS?" />
            <p>
                RouterOS adalah sistem operasi berbasis Linux yang mengubah sebuah perangkat keras menjadi router jaringan. Ia menawarkan berbagai fitur canggih untuk mengelola lalu lintas jaringan, keamanan, dan konektivitas.
            </p>
            <ImagePlaceholder
                src={["/media/img/winboxv4gui.png",]}
                alt="Tampilan Antarmuka WinBox"
                caption="WinBox adalah aplikasi GUI untuk mengkonfigurasi RouterOS dari Windows."
            />

            <SectionTitle number={2} title="Cara Mengakses Router MikroTik" />
            <p>
                Ada beberapa cara untuk mengkonfigurasi perangkat MikroTik:
            </p>
            <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-white">WinBox:</strong> Aplikasi utilitas untuk Windows yang menyediakan antarmuka grafis (GUI) yang cepat dan mudah untuk mengelola RouterOS. Ini adalah cara paling populer bagi pemula dan profesional.</li>
                <li><strong className="text-white">WebFig:</strong> Antarmuka berbasis web yang dapat diakses melalui browser. Fungsionalitasnya hampir sama dengan WinBox.</li>
                <li><strong className="text-white">CLI (Command Line Interface):</strong> Akses melalui Terminal (SSH atau Telnet) untuk konfigurasi berbasis teks. Memberikan kontrol penuh dan sangat kuat untuk otomatisasi skrip.</li>
            </ul>

            {/* Integrasi Simulator MikroTik */}
            <div className="my-8">
                <MikrotikSimulator />
            </div>

            <SectionTitle number={3} title="Poin-Poin Penting Konfigurasi Dasar (Rekomendasi)" />
            <p>
                Berikut adalah beberapa konfigurasi awal yang fundamental dan akan menjadi dasar untuk materi selanjutnya:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">1. Konfigurasi Identitas & User</h4>
                    <p className="text-xs">
                        Memberi nama pada router untuk identifikasi dan membuat user baru dengan password yang kuat untuk mengamankan akses ke router.
                    </p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">2. Konfigurasi IP Address</h4>
                    <p className="text-xs">
                        Menetapkan alamat IP untuk setiap interface (port) router. Satu interface untuk koneksi ke internet (WAN) dan satu lagi untuk jaringan lokal (LAN).
                    </p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">3. Konfigurasi DHCP Client & Server</h4>
                    <p className="text-xs">
                        <strong className="text-white">DHCP Client</strong> pada interface WAN untuk mendapatkan IP otomatis dari ISP. <strong className="text-white">DHCP Server</strong> pada interface LAN untuk memberikan IP otomatis ke perangkat klien (laptop, HP).
                    </p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">4. Konfigurasi Firewall (NAT)</h4>
                    <p className="text-xs">
                        Mengatur NAT (Network Address Translation) agar semua perangkat di jaringan lokal dapat berbagi satu koneksi internet publik. Ini adalah langkah krusial agar klien bisa terhubung ke internet.
                    </p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">5. Konfigurasi DNS</h4>
                    <p className="text-xs">
                        Mengatur server DNS agar router dan klien dapat menerjemahkan nama domain (seperti google.com) menjadi alamat IP.
                    </p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">6. Konfigurasi Wireless (WiFi)</h4>
                    <p className="text-xs">
                        Jika menggunakan RouterBOARD dengan fitur wireless, materi ini akan mencakup cara membuat Access Point (AP) dengan keamanan WPA2.
                    </p>
                </div>
            </div>
            <ImagePlaceholder
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjzYrVhQB0NSH1M-C19SZ6bJ3flFmXaCY712knurhb9HzwEY0uJ1YFtMUbPiB8yHyrDOP2AF68l73dxS-5g7PAA8I5HZnqDeLbhM3wNyHSUxm27kIpnBh5pBB0KSHIgwUiOPql9WE_lbd6Q/s1600/Topologi+Dasar+Mikrotik.png"
                alt="Topologi Jaringan Sederhana MikroTik"
                caption="Contoh topologi dasar: ISP -> MikroTik -> Klien LAN."
            />

            <SectionTitle number={4} title="Materi Lanjutan yang Akan Datang" />
            <p>
                Setelah menguasai dasar-dasarnya, materi dapat diperluas ke topik yang lebih canggih seperti:
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs">
                <li><strong className="text-white">Manajemen Bandwidth (Queue):</strong> Membatasi kecepatan internet untuk pengguna tertentu.</li>
                <li><strong className="text-white">Firewall Filter Rules:</strong> Memblokir situs web atau layanan tertentu.</li>
                <li><strong className="text-white">Hotspot:</strong> Membuat sistem login portal untuk pengguna WiFi.</li>
                <li><strong className="text-white">VPN (Virtual Private Network):</strong> Membangun koneksi aman antar jaringan melalui internet.</li>
            </ul>

            <div className="pt-8 border-t border-[rgba(0,212,255,0.1)] text-center">
                <p className="text-gray-400 font-display font-bold text-sm">
                    Materi Lengkap Segera Hadir!
                </p>
            </div>
        </div>
    );
}