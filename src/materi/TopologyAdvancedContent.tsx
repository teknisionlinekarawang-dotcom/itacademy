import ImagePlaceholder from '../components/ImagePlaceholder';

const SectionTitle = ({ title }: { title: string }) => (
    <h2 className="font-display text-xl font-bold text-[#00d4ff] mb-4 border-t border-[rgba(0,212,255,0.1)] pt-6">
        {title}
    </h2>
);

const NetworkTypeCard = ({ title, scope, tech, icon, children }: { title: string, scope: string, tech: string, icon: string, children: React.ReactNode }) => (
    <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)] h-full">
        <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{icon}</span>
            <h4 className="font-bold text-white">{title}</h4>
        </div>
        <div className="space-y-2 text-xs">
            <p><strong className="text-white">Cakupan:</strong> {scope}</p>
            <p><strong className="text-white">Teknologi Umum:</strong> {tech}</p>
            <div className="pt-2 text-sm">{children}</div>
        </div>
    </div>
);

export default function TopologyAdvancedContent() {
    return (
        <div className="space-y-6 text-[#b0c4de] leading-relaxed text-sm">
            <SectionTitle title="Skala Jaringan: LAN, MAN, WAN, & Internet" />
            <p>
                Selain dari tata letak fisiknya (topologi), jaringan juga diklasifikasikan berdasarkan <strong className="text-white">cakupan geografisnya</strong>. Ini menentukan seberapa luas area yang bisa dijangkau oleh sebuah jaringan.
            </p>

            <ImagePlaceholder
                src="https://nginstall.id/wp-content/uploads/2026/01/perbedaan-lan-man-dan-wan.jpg"
                alt="Diagram LAN, MAN, WAN"
                caption="Perbandingan skala jaringan LAN, MAN, dan WAN."
            />
            <div className="grid md:grid-cols-2 gap-6">
                <NetworkTypeCard title="LAN (Local Area Network)" scope="Area terbatas (rumah, sekolah, kantor)." tech="Ethernet (kabel UTP), Wi-Fi." icon="🏠">
                    <p>Jaringan pribadi yang menghubungkan perangkat dalam satu gedung atau area kecil. Anda memiliki kontrol penuh atas jaringan ini.</p>
                </NetworkTypeCard>

                <NetworkTypeCard title="MAN (Metropolitan Area Network)" scope="Satu kota atau area metropolitan." tech="Fiber Optic, Wireless Microwave." icon="🏙️">
                    <p>Jaringan yang lebih besar dari LAN, biasanya menghubungkan beberapa kantor cabang dalam satu kota. Seringkali dimiliki oleh satu organisasi atau penyedia layanan.</p>
                </NetworkTypeCard>

                <NetworkTypeCard title="WAN (Wide Area Network)" scope="Antar kota, negara, atau benua." tech="Fiber Optic (submarine cables), Satelit." icon="🌍">
                    <p>Menghubungkan beberapa LAN atau MAN yang terpisah secara geografis. Internet adalah contoh terbesar dari sebuah WAN.</p>
                </NetworkTypeCard>

                <NetworkTypeCard title="Internet" scope="Global." tech="Kombinasi semua teknologi jaringan." icon="🌐">
                    <p>Sebuah "jaringan dari semua jaringan" (network of networks) yang saling terhubung di seluruh dunia menggunakan standar protokol TCP/IP, memungkinkan pertukaran data secara global.</p>
                </NetworkTypeCard>
            </div>

            <SectionTitle title="Bagaimana Internet Bekerja?" />
            <p>
                Bayangkan Anda mengirim pesan dari PC Anda ke server di negara lain:
            </p>
            <ol className="list-decimal list-inside space-y-2 pl-2">
                <li>Pesan Anda keluar dari <strong className="text-white">LAN</strong> (jaringan rumah/kantor) melalui router.</li>
                <li>Router meneruskannya ke jaringan <strong className="text-white">ISP (Internet Service Provider)</strong> Anda, yang merupakan bagian dari <strong className="text-white">MAN</strong>.</li>
                <li>ISP Anda menghubungkan Anda ke <strong className="text-white">WAN</strong>, meneruskan data Anda melalui kabel fiber optic bawah laut dan darat (backbone internet) melintasi berbagai negara.</li>
                <li>Data tersebut akhirnya sampai di ISP tujuan, lalu ke LAN tempat server berada, dan diterima oleh server. Semua ini terjadi dalam hitungan milidetik.</li>
            </ol>
        </div>
    );
}