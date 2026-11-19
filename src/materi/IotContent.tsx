import ImagePlaceholder from '../components/ImagePlaceholder';
import { Link } from 'react-router-dom';

const SectionTitle = ({ number, title }: { number: number, title: string }) => (
    <h2 className="font-display text-xl font-bold text-[#00d4ff] mb-4 border-t border-[rgba(0,212,255,0.1)] pt-6">
        <span className="text-base text-[#4a5568] mr-2">{number}.</span>{title}
    </h2>
);

export default function IotContent() {
    return (
        <div className="space-y-6 text-[#b0c4de] leading-relaxed text-sm">
            <div className="mb-8">
                <Link to="/dashboard" className="text-cyan-400 hover:underline text-sm">&larr; Kembali ke Dashboard</Link>
            </div>
            <p>
                <strong className="text-white">Internet of Things (IoT)</strong> adalah konsep di mana objek atau "benda" fisik sehari-hari dilengkapi dengan sensor, perangkat lunak, dan teknologi lain yang memungkinkan mereka untuk terhubung dan bertukar data dengan perangkat dan sistem lain melalui internet.
            </p>

            <SectionTitle number={1} title="Sejarah Singkat IoT" />
            <p>
                Meskipun istilah "Internet of Things" baru populer di abad ke-21, idenya sudah ada jauh lebih lama.
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs pl-2">
                <li><strong className="text-white">1982 - Mesin Penjual Otomatis Terhubung:</strong> Mahasiswa di Carnegie Mellon University menghubungkan mesin penjual Coca-Cola ke ARPANET. Mereka bisa memeriksa dari jarak jauh apakah minuman di dalamnya dingin sebelum berjalan ke mesin tersebut. Ini dianggap sebagai salah satu contoh pertama perangkat yang terhubung ke internet.</li>
                <li><strong className="text-white">1999 - Istilah "Internet of Things" Dicetuskan:</strong> Kevin Ashton, seorang peneliti di Procter & Gamble (P&G), pertama kali menggunakan istilah ini saat presentasi tentang penggunaan RFID (Radio-Frequency Identification) untuk mengelola rantai pasokan.</li>
                <li><strong className="text-white">2008-2009 - Titik Balik:</strong> Jumlah "benda" yang terhubung ke internet untuk pertama kalinya melampaui jumlah populasi manusia. Era IoT secara resmi dimulai.</li>
                <li><strong className="text-white">2010-an - Ledakan Perangkat Konsumen:</strong> Munculnya perangkat seperti Google Nest (termostat pintar) dan Amazon Echo (speaker pintar) membawa konsep IoT ke rumah-rumah di seluruh dunia.</li>
            </ul>
            <ImagePlaceholder
                src="https://www.fortinet.com/content/dam/fortinet/images/cyberglossary/iot-timeline.jpg"
                alt="Timeline Sejarah IoT"
                caption="Perkembangan Internet of Things."
            />

            <SectionTitle number={2} title="Bagaimana Cara Kerja IoT?" />
            <p>
                Sistem IoT bekerja dalam siklus yang terus-menerus: mengumpulkan data, berkomunikasi, menganalisis, dan bertindak. Ada empat komponen utama yang terlibat:
            </p>
            <ol className="list-decimal list-inside space-y-3 pl-2">
                <li>
                    <strong className="text-white">1. Sensor/Perangkat (Things):</strong> Ini adalah "benda" itu sendiri. Mereka mengumpulkan data dari lingkungan sekitarnya. Contoh: sensor suhu di AC, GPS di mobil, atau kamera di bel pintu.
                </li>
                <li>
                    <strong className="text-white">2. Konektivitas (Connectivity):</strong> Data dari sensor dikirim ke cloud (internet). Ini bisa melalui berbagai media seperti Wi-Fi, Bluetooth, Seluler (4G/5G), LoRaWAN, dll.
                </li>
                <li>
                    <strong className="text-white">3. Pemrosesan Data (Data Processing):</strong> Setelah data sampai di cloud, perangkat lunak memprosesnya. Ini bisa sesederhana memeriksa apakah suhu berada dalam rentang normal, atau sekompleks menggunakan kecerdasan buatan (AI) untuk mengenali wajah dari video.
                </li>
                <li>
                    <strong className="text-white">4. Antarmuka Pengguna (User Interface):</strong> Hasil dari pemrosesan data disajikan kepada pengguna. Ini bisa berupa notifikasi di ponsel Anda ("Seseorang ada di depan pintu"), pembaruan suhu di aplikasi, atau email peringatan. Pengguna juga bisa memberikan perintah kembali ke perangkat melalui antarmuka ini (misalnya, menyalakan AC dari jarak jauh).
                </li>
            </ol>
            <ImagePlaceholder
                src="https://image.slidesharecdn.com/2arsitekturdaninfrastruktur-230215042531-4e7073f2/75/2-Arsitektur-dan-Infrastruktur-pdf-5-2048.jpg"
                alt="Arsitektur Sistem IoT"
                caption="Diagram cara kerja sistem Internet of Things."
            />

            <SectionTitle number={3} title="Contoh Perangkat IoT Modern" />
            <p>
                IoT bukan lagi fiksi ilmiah; ia ada di sekitar kita. Berikut adalah beberapa contoh di berbagai sektor:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">🏠 Smart Home (Rumah Pintar)</h4>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li><strong className="text-white">Lampu Pintar (Philips Hue):</strong> Dapat diubah warna dan kecerahannya dari ponsel.</li>
                        <li><strong className="text-white">Termostat Pintar (Google Nest):</strong> Mempelajari kebiasaan Anda dan menyesuaikan suhu secara otomatis untuk menghemat energi.</li>
                        <li><strong className="text-white">Kunci Pintu Pintar (August):</strong> Memungkinkan Anda membuka kunci pintu dari mana saja untuk tamu atau kurir.</li>
                        <li><strong className="text-white">Asisten Suara (Amazon Alexa, Google Assistant):</strong> Pusat komando untuk mengontrol semua perangkat pintar lainnya dengan suara.</li>
                    </ul>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">🏃 Wearables (Perangkat Sandang)</h4>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li><strong className="text-white">Jam Tangan Pintar (Apple Watch, Samsung Galaxy Watch):</strong> Melacak detak jantung, aktivitas fisik, tingkat oksigen darah, dan bahkan mendeteksi jatuh.</li>
                        <li><strong className="text-white">Cincin Pintar (Oura Ring):</strong> Fokus pada pelacakan kualitas tidur dan kesiapan tubuh.</li>
                    </ul>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">🚗 Connected Cars (Mobil Terhubung)</h4>
                    <p className="text-xs">
                        Mobil modern dilengkapi dengan ratusan sensor. Mereka dapat mengirim data diagnostik ke pabrikan, menyediakan navigasi real-time dengan data lalu lintas, dan bahkan memungkinkan pembaruan perangkat lunak (software update) secara nirkabel (Over-the-Air) seperti yang dilakukan Tesla.
                    </p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">🏭 Industri & Pertanian (IIoT & Smart Farming)</h4>
                    <p className="text-xs">
                        Di pabrik, sensor IoT memantau kondisi mesin untuk memprediksi kapan perawatan diperlukan (<strong className="text-white">predictive maintenance</strong>). Di pertanian, sensor kelembaban tanah dan drone digunakan untuk mengoptimalkan penggunaan air dan pupuk, meningkatkan hasil panen secara signifikan.
                    </p>
                </div>
            </div>
            <ImagePlaceholder
                src="https://via.placeholder.com/600x400?text=Smart+Home+Devices"
                alt="Contoh Perangkat Smart Home"
                caption="Berbagai perangkat pintar yang terhubung dalam ekosistem rumah pintar."
            />

            <SectionTitle number={4} title="Tantangan dan Masa Depan IoT" />
            <p>
                Meskipun potensinya besar, IoT juga menghadapi tantangan signifikan, terutama dalam hal <strong className="text-white">keamanan</strong> (bagaimana melindungi miliaran perangkat dari peretasan?) dan <strong className="text-white">privasi</strong> (siapa yang memiliki dan boleh melihat data yang dikumpulkan?).
            </p>
            <p>
                Masa depan IoT akan didorong oleh kemajuan teknologi lain seperti <strong className="text-white">5G</strong> (yang menyediakan konektivitas super cepat dan latensi rendah), <strong className="text-white">Kecerdasan Buatan (AI)</strong> (untuk menganalisis data dalam skala besar), dan <strong className="text-white">Edge Computing</strong> (memproses data lebih dekat ke sumbernya, bukan di cloud, untuk respons yang lebih cepat).
            </p>

            <SectionTitle number={5} title="Otak di Balik 'Things': Mikrokontroler" />
            <p>
                Di jantung hampir setiap perangkat IoT adalah sebuah <strong className="text-white">Mikrokontroler (MCU)</strong>. Ini adalah komputer kecil dalam satu chip yang berisi prosesor, memori (RAM), dan periferal input/output. MCU dirancang untuk menjalankan tugas spesifik, seperti membaca sensor dan mengirim data. Dua platform mikrokontroler paling populer untuk proyek IoT adalah Arduino dan ESP32.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">Arduino</h4>
                    <p className="text-xs">Platform open-source yang terdiri dari papan sirkuit (hardware) dan lingkungan pengembangan (IDE). Arduino sangat populer di kalangan pemula karena kemudahan penggunaannya dan komunitas yang besar. Model seperti <strong className="text-white">Arduino Uno</strong> sangat bagus untuk belajar dasar-dasar elektronika, tetapi untuk IoT, ia seringkali memerlukan modul tambahan (shields) untuk konektivitas Wi-Fi atau Bluetooth.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">ESP32</h4>
                    <p className="text-xs">Sebuah chip mikrokontroler berbiaya rendah dan berdaya rendah yang dikembangkan oleh Espressif Systems. Keunggulan utamanya adalah <strong className="text-white">Wi-Fi dan Bluetooth sudah terintegrasi</strong> di dalam chip. Dengan prosesor dual-core yang lebih kuat, ESP32 adalah pilihan yang sangat populer dan kuat untuk membangun proyek IoT yang terhubung langsung ke internet tanpa perlu banyak komponen tambahan.</p>
                </div>
            </div>
            <ImagePlaceholder
                src="https://www.electronicshub.org/wp-content/uploads/2022/02/Arduino-UNO-vs-ESP32.jpg"
                alt="Perbandingan Arduino Uno dan ESP32"
                caption="Arduino Uno (kiri) bagus untuk pemula, sementara ESP32 (kanan) unggul untuk proyek IoT karena konektivitas bawaannya."
            />

            {/* Tombol Navigasi Materi Berikutnya */}
            <div className="pt-8 border-t border-[rgba(0,212,255,0.1)] text-center">
                <Link
                    to="/module/esp-arduino"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00d4ff] text-[#07090f] font-display font-bold text-sm hover:bg-white transition-all duration-200 glow-cyan"
                >
                    <span>Materi Berikutnya: ESP32 & Arduino</span>
                    <span>→</span>
                </Link>
            </div>
        </div>
    );
}