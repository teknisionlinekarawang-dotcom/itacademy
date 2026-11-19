import { Link } from 'react-router-dom';

const SectionTitle = ({ number, title }: { number: number, title: string }) => (
    <h2 className="font-display text-xl font-bold text-[#00d4ff] mb-4 border-t border-[rgba(0,212,255,0.1)] pt-8 mt-8">
        <span className="text-base text-[#4a5568] mr-2">{number}.</span>{title}
    </h2>
);

const CiaCard = ({ icon, name, children }: { icon: string, name: string, children: React.ReactNode }) => (
    <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)] h-full">
        <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{icon}</span>
            <h4 className="font-bold text-white">{name}</h4>
        </div>
        <p className="text-xs">{children}</p>
    </div>
);

export default function CyberSecurityContent() {
    return (
        <div className="space-y-4 text-[#b0c4de] leading-relaxed text-sm">
            <div className="mb-8">
                <Link to="/dashboard" className="text-cyan-400 hover:underline text-sm">&larr; Kembali ke Dashboard</Link>
            </div>

            <p>
                <strong className="text-white">Cyber Security</strong> (Keamanan Siber) adalah praktik melindungi sistem komputer, jaringan, program, dan data dari serangan digital yang tidak sah atau berbahaya. Di era di mana hampir semua aspek kehidupan terhubung ke internet, keamanan siber bukan lagi sekadar kebutuhan teknis, melainkan kebutuhan fundamental bagi individu maupun organisasi.
            </p>

            <SectionTitle number={1} title="Pilar Utama Keamanan: CIA Triad" />
            <p>
                Setiap strategi keamanan siber wajib dibangun di atas tiga fondasi utama yang dikenal sebagai <strong className="text-white">CIA Triad</strong>:
            </p>
            <div className="grid md:grid-cols-3 gap-6">
                <CiaCard icon="🔒" name="Confidentiality (Kerahasiaan)">
                    Memastikan data hanya dapat diakses oleh pihak yang memiliki hak akses resmi. Contoh penerapannya adalah penggunaan <strong className="text-white">enkripsi data</strong> dan <strong className="text-white">pembatasan hak akses</strong>.
                </CiaCard>
                <CiaCard icon="⚖️" name="Integrity (Integritas)">
                    Menjamin bahwa data tetap akurat, konsisten, dan tidak diubah atau dimanipulasi oleh pihak yang tidak sah selama proses penyimpanan atau pengiriman.
                </CiaCard>
                <CiaCard icon="🟢" name="Availability (Ketersediaan)">
                    Memastikan bahwa sistem, jaringan, dan data selalu siap diakses oleh pengguna yang berwenang kapan pun dibutuhkan.
                </CiaCard>
            </div>

            <SectionTitle number={2} title="Jenis-Jenis Cyber Security" />
            <p>
                Ruang lingkup keamanan siber dibagi menjadi beberapa kategori berdasarkan fokus proteksinya:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">🌐 Network Security</h4>
                    <p className="text-xs">Fokus mengamankan lalu lintas jaringan internal dari akses ilegal dan penyusupan menggunakan perangkat seperti <strong className="text-white">firewall</strong> dan <strong className="text-white">IPS (Intrusion Prevention System)</strong>.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">📱 Application Security</h4>
                    <p className="text-xs">Melindungi kode dan data di dalam aplikasi agar terhindar dari eksploitasi celah keamanan (<em>vulnerability</em>) sejak tahap pengembangan hingga aplikasi dirilis.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">🗄️ Information/Data Security</h4>
                    <p className="text-xs">Melindungi kerahasiaan dan integritas data sensitif, baik saat disimpan (<em>at rest</em>) maupun saat ditransfer (<em>in transit</em>).</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">☁️ Cloud Security</h4>
                    <p className="text-xs">Rangkaian kontrol dan teknologi untuk melindungi data, aplikasi, dan infrastruktur yang berjalan di lingkungan cloud.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">💻 Endpoint Security</h4>
                    <p className="text-xs">Mengamankan perangkat ujung yang terhubung ke jaringan seperti laptop, smartphone, dan komputer server.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">📋 Operational Security (OpSec)</h4>
                    <p className="text-xs">Prosedur dan keputusan operasional dalam mengelola dan melindungi aset data, termasuk aturan hak akses pengguna.</p>
                </div>
            </div>

            <SectionTitle number={3} title="Jenis Ancaman dan Serangan Siber (Cyber Threats)" />
            <p>
                Serangan siber dapat datang dari berbagai metode. Beberapa yang paling sering dijumpai meliputi:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(239,68,68,0.15)]">
                    <h4 className="font-bold text-[#f87171] mb-2">🦠 Malware</h4>
                    <p className="text-xs">Perangkat lunak berbahaya seperti <strong className="text-white">virus</strong>, <strong className="text-white">ransomware</strong> (enkripsi data untuk tebusan), dan <strong className="text-white">spyware</strong> yang dirancang untuk merusak atau mencuri data.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(239,68,68,0.15)]">
                    <h4 className="font-bold text-[#f87171] mb-2">🎣 Phishing</h4>
                    <p className="text-xs">Metode penipuan berupa email, pesan, atau situs web palsu yang menyerupai institusi resmi untuk mencuri informasi sensitif seperti password dan data kartu kredit.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(239,68,68,0.15)]">
                    <h4 className="font-bold text-[#f87171] mb-2">🕵️ Man-in-the-Middle (MitM)</h4>
                    <p className="text-xs">Penyerang menyusup di antara komunikasi dua pihak (misalnya pada Wi-Fi publik yang tidak aman) untuk menguping atau mencuri data.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(239,68,68,0.15)]">
                    <h4 className="font-bold text-[#f87171] mb-2">🌊 Distributed Denial of Service (DDoS)</h4>
                    <p className="text-xs">Membanjiri lalu lintas server atau jaringan dengan traffic palsu hingga sistem kehabisan daya dan tumbang (tidak bisa diakses).</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(239,68,68,0.15)]">
                    <h4 className="font-bold text-[#f87171] mb-2">💉 SQL Injection (SQLi)</h4>
                    <p className="text-xs">Menyuntikkan kode berbahaya ke dalam input aplikasi untuk memanipulasi database di belakangnya.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(239,68,68,0.15)]">
                    <h4 className="font-bold text-[#f87171] mb-2">🧠 Social Engineering</h4>
                    <p className="text-xs">Manipulasi psikologis terhadap manusia agar mereka membocorkan informasi rahasia atau melakukan tindakan yang merusak keamanan.</p>
                </div>
            </div>
        </div>
    );
}
