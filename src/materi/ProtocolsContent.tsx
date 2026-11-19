import ImagePlaceholder from '../components/ImagePlaceholder';

const SectionTitle = ({ number, title }: { number: number, title:string }) => (
    <h2 className="font-display text-xl font-bold text-[#00d4ff] mb-4 border-t border-[rgba(0,212,255,0.1)] pt-8 mt-8">
        <span className="text-base text-[#4a5568] mr-2">{number}.</span>{title}
    </h2>
);

const ProtocolCard = ({ name, fullName, children }: { name: string, fullName: string, children: React.ReactNode }) => (
    <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
        <h4 className="font-bold text-white">{name} <span className="text-xs text-gray-400 font-normal">- {fullName}</span></h4>
        <p className="text-xs mt-2">{children}</p>
    </div>
);

export default function ProtocolsContent() {
    return (
        <div className="space-y-4 text-[#b0c4de] leading-relaxed text-sm">
            <p>
                Protokol jaringan adalah seperangkat <strong className="text-white">aturan dan standar</strong> yang memungkinkan dua atau lebih entitas (perangkat) dalam sebuah jaringan untuk berkomunikasi. Tanpa protokol, perangkat tidak akan mengerti cara mengirim, menerima, atau menginterpretasikan data satu sama lain. Analogi sederhananya adalah bahasa dan etiket saat manusia berbicara.
            </p>

            <SectionTitle number={1} title="Protokol Transport: TCP vs UDP" />
            <p>
                Ini adalah dua protokol paling fundamental di Layer Transport yang menentukan bagaimana data dikirim antar aplikasi.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
                <ProtocolCard name="TCP" fullName="Transmission Control Protocol">
                    <strong className="text-white">Connection-Oriented & Reliable.</strong> TCP membangun koneksi terlebih dahulu (three-way handshake), memastikan semua paket data sampai dengan utuh dan berurutan, serta melakukan pengecekan error.
                    <br/><br/>
                    <strong>Analogi:</strong> Panggilan telepon. Anda memastikan orang di seberang mendengar dengan jelas sebelum melanjutkan.
                    <br/><br/>
                    <strong>Contoh Penggunaan:</strong> Web Browsing (HTTP/HTTPS), Email (SMTP), File Transfer (FTP).
                </ProtocolCard>
                <ProtocolCard name="UDP" fullName="User Datagram Protocol">
                    <strong className="text-white">Connectionless & Unreliable.</strong> UDP mengirimkan data (datagram) tanpa membangun koneksi dan tanpa jaminan paket akan sampai. Fokus utamanya adalah kecepatan.
                    <br/><br/>
                    <strong>Analogi:</strong> Mengirim kartu pos. Anda hanya mengirimnya tanpa tahu pasti apakah akan sampai atau tidak.
                    <br/><br/>
                    <strong>Contoh Penggunaan:</strong> Video Streaming, Game Online, Voice over IP (VoIP), DNS.
                </ProtocolCard>
            </div>
            <ImagePlaceholder src="https://www.howtogeek.com/wp-content/uploads/2018/08/img_5b69f1091b6c6.png" alt="Perbandingan TCP dan UDP" caption="TCP fokus pada keandalan, sementara UDP fokus pada kecepatan." />

            <SectionTitle number={2} title="Protokol Layer Aplikasi" />
            <p>
                Ini adalah protokol yang paling sering kita gunakan secara tidak sadar saat berinteraksi dengan internet.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
                <ProtocolCard name="HTTP/HTTPS" fullName="HyperText Transfer Protocol (Secure)">
                    Protokol dasar untuk World Wide Web. Digunakan untuk memuat halaman web dari server ke browser. HTTPS adalah versi amannya yang mengenkripsi data.
                </ProtocolCard>
                <ProtocolCard name="FTP/SFTP" fullName="File Transfer Protocol (Secure)">
                    Digunakan untuk mentransfer file antara client dan server. SFTP (SSH File Transfer Protocol) adalah alternatif yang aman karena berjalan di atas koneksi SSH.
                </ProtocolCard>
                <ProtocolCard name="SMTP" fullName="Simple Mail Transfer Protocol">
                    Protokol standar untuk <strong className="text-white">mengirim</strong> email dari client ke server, atau antar server email.
                </ProtocolCard>
                <ProtocolCard name="POP3/IMAP" fullName="Post Office Protocol / Internet Message Access Protocol">
                    Keduanya digunakan untuk <strong className="text-white">menerima</strong> email. POP3 mengunduh email ke perangkat dan menghapusnya dari server. IMAP menyinkronkan email dengan server, memungkinkan akses dari banyak perangkat.
                </ProtocolCard>
                <ProtocolCard name="DNS" fullName="Domain Name System">
                    Berfungsi sebagai "buku telepon internet". Menerjemahkan nama domain yang mudah diingat manusia (misal: <code className="text-xs">google.com</code>) menjadi alamat IP yang dimengerti komputer (misal: <code className="text-xs">142.250.190.46</code>).
                </ProtocolCard>
                <ProtocolCard name="SSH" fullName="Secure Shell">
                    Protokol kriptografi untuk mengoperasikan layanan jaringan secara aman di atas jaringan yang tidak aman. Paling umum digunakan untuk mengakses dan mengelola server dari jarak jauh melalui command line.
                </ProtocolCard>
            </div>

            <SectionTitle number={3} title="Protokol Jaringan & Manajemen" />
            <p>
                Protokol ini bekerja di "belakang layar" untuk memastikan jaringan berjalan dengan baik dan efisien.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
                <ProtocolCard name="DHCP" fullName="Dynamic Host Configuration Protocol">
                    Mengalokasikan alamat IP dan informasi jaringan lainnya (subnet mask, gateway, DNS) secara otomatis kepada perangkat dalam jaringan. Ini menghilangkan kebutuhan konfigurasi manual.
                </ProtocolCard>
                <ProtocolCard name="ARP" fullName="Address Resolution Protocol">
                    Digunakan untuk menemukan alamat MAC (fisik) dari sebuah perangkat berdasarkan alamat IP-nya dalam jaringan lokal (LAN).
                </ProtocolCard>
                <ProtocolCard name="ICMP" fullName="Internet Control Message Protocol">
                    Digunakan oleh perangkat jaringan untuk mengirim pesan error dan informasi operasional. Perintah <code className="text-xs">ping</code> adalah implementasi paling terkenal dari ICMP untuk menguji konektivitas.
                </ProtocolCard>
                <ProtocolCard name="STP/RSTP" fullName="Spanning Tree Protocol / Rapid STP">
                    Protokol pada switch jaringan (Layer 2) yang mencegah terjadinya <strong className="text-white">looping broadcast</strong>. Jika ada jalur redundan (lebih dari satu jalur) antar switch, STP akan memblokir salah satu jalur untuk mencegah paket data berputar-putar tanpa henti. RSTP adalah versi yang lebih cepat.
                </ProtocolCard>
            </div>
            <ImagePlaceholder src="https://www.practicalnetworking.net/wp-content/uploads/2016/05/stp-converged-topology.png" alt="Cara Kerja Spanning Tree Protocol" caption="STP memblokir salah satu port untuk mencegah looping pada switch." />

            <SectionTitle number={4} title="Bagaimana Semuanya Bekerja Sama? (Contoh)" />
            <p>
                Bayangkan Anda membuka browser dan mengetik <code className="text-xs">google.com</code>:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-xs pl-2">
                <li>
                    <strong className="text-white">DNS:</strong> Komputer Anda mengirim permintaan DNS (via UDP) ke server DNS untuk menanyakan "Berapa IP address google.com?". Server DNS menjawab dengan IP address-nya.
                </li>
                <li>
                    <strong className="text-white">TCP:</strong> Browser Anda memulai koneksi TCP (three-way handshake) ke alamat IP Google di port 443 (untuk HTTPS).
                </li>
                <li>
                    <strong className="text-white">HTTPS:</strong> Setelah koneksi TCP terbentuk, browser Anda mengirimkan permintaan HTTPS untuk mengambil halaman utama Google.
                </li>
                <li>
                    <strong className="text-white">IP:</strong> Semua paket data (DNS, TCP, HTTPS) dibungkus dalam paket IP yang berisi alamat IP sumber (Anda) dan tujuan (Google).
                </li>
                <li>
                    <strong className="text-white">Ethernet/Wi-Fi:</strong> Paket IP tersebut kemudian dibungkus lagi dalam frame Ethernet/Wi-Fi yang berisi alamat MAC sumber dan tujuan (router Anda) untuk dikirim melalui jaringan lokal.
                </li>
            </ol>
            <p>
                Seluruh proses ini, yang melibatkan banyak protokol berbeda, terjadi dalam sepersekian detik. Ini menunjukkan betapa terkoordinasi dan efisiennya tumpukan protokol jaringan (protocol stack) bekerja.
            </p>
        </div>
    );
}