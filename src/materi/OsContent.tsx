import ImagePlaceholder from '../components/ImagePlaceholder';

const SectionTitle = ({ number, title }: { number: number, title: string }) => (
    <h2 className="font-display text-xl font-bold text-[#00d4ff] mb-4 border-t border-[rgba(0,212,255,0.1)] pt-8 mt-8">
        <span className="text-base text-[#4a5568] mr-2">{number}.</span>{title}
    </h2>
);

const Code = ({ children }: { children: React.ReactNode }) => (
    <code className="font-mono bg-[#1a2535] px-1.5 py-0.5 rounded-md text-[#f59e0b] text-sm">{children}</code>
);

export default function OsContent() {
    return (
        <div className="space-y-4 text-[#b0c4de] leading-relaxed text-sm">
            <p>
                Sistem Operasi (OS) adalah perangkat lunak yang paling penting di dalam komputer. Ia bertindak sebagai jembatan antara pengguna (dan aplikasi) dengan perangkat keras (hardware) komputer. Tanpa OS, komputer hanyalah sekumpulan komponen elektronik yang tidak berguna.
            </p>

            <SectionTitle number={1} title="Sejarah Singkat Sistem Operasi" />
            <p>
                Evolusi OS mencerminkan evolusi komputasi itu sendiri.
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs">
                <li><strong className="text-white">1950-an - Sistem Batch:</strong> Komputer awal tidak memiliki OS. Pengguna memasukkan program menggunakan *punch card*. Kemudian muncul sistem batch yang menjalankan pekerjaan secara berurutan tanpa interaksi pengguna.</li>
                <li><strong className="text-white">1960-an - Multiprogramming & Timesharing:</strong> OS mulai bisa menjalankan beberapa program sekaligus (multiprogramming). Sistem *timesharing* memungkinkan banyak pengguna berinteraksi dengan komputer secara bersamaan melalui terminal. Lahirnya <strong className="text-white">Unix</strong> di Bell Labs menjadi tonggak penting.</li>
                <li><strong className="text-white">1970-an & 1980-an - Era Komputer Pribadi:</strong> Munculnya mikroprosesor melahirkan PC. <strong className="text-white">CP/M</strong> menjadi OS populer, yang kemudian digantikan oleh <strong className="text-white">MS-DOS</strong> dari Microsoft. Apple meluncurkan <strong className="text-white">Macintosh</strong> dengan Graphical User Interface (GUI) revolusioner.</li>
                <li><strong className="text-white">1990-an - Dominasi GUI:</strong> Microsoft merilis <strong className="text-white">Windows 3.0</strong> dan kemudian <strong className="text-white">Windows 95</strong>, yang mempopulerkan GUI secara massal. <strong className="text-white">Linux</strong>, sebuah kernel mirip Unix yang bersifat open-source, juga lahir di era ini.</li>
                <li><strong className="text-white">2000-an - Era Mobile:</strong> Ledakan smartphone melahirkan OS mobile modern. Apple merilis <strong className="text-white">iOS</strong> (awalnya iPhone OS) dan Google mengakuisisi Android, yang kemudian menjadi OS mobile paling dominan di dunia.</li>
            </ul>

            <ImagePlaceholder
                src={["https://computerrepairlouisvilleky.com/wp-content/uploads/2024/03/All-Microsoft-Windows-OSs-2048x1003.jpg", "https://miro.medium.com/v2/resize:fit:2560/1*-0GPrEi18UvU9e5oNtmDQw.jpeg", "/media/img/android-os.png"]}                alt="Timeline Sejarah Sistem Operasi"
                caption="Perkembangan sistem operasi dari batch hingga mobile."
            />
            <SectionTitle number={2} title="Fungsi Inti Sistem Operasi" />
            <p>
                OS memiliki beberapa tugas fundamental yang sering disebut sebagai "manajemen sumber daya".
            </p>
            <ul className="space-y-4 mt-4">
                <li className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <strong className="text-white">Manajemen Proses:</strong> OS bertanggung jawab untuk membuat, menjadwalkan, dan menghentikan proses (program yang sedang berjalan). Ia memastikan setiap proses mendapatkan jatah waktu CPU yang adil (multitasking).
                </li>
                <li className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <strong className="text-white">Manajemen Memori:</strong> OS mengalokasikan dan mengelola memori utama (RAM). Ia memastikan setiap proses memiliki ruang memori sendiri tanpa mengganggu proses lain.
                </li>
                <li className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <strong className="text-white">Manajemen Sistem File:</strong> OS menyediakan cara terstruktur untuk menyimpan dan mengakses data di perangkat penyimpanan (HDD/SSD). Ia mengelola file, direktori (folder), dan hak akses.
                </li>
                <li className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <strong className="text-white">Manajemen Perangkat I/O:</strong> OS berkomunikasi dengan perangkat keras (keyboard, mouse, printer, monitor) melalui driver. Ia menyederhanakan interaksi antara aplikasi dan hardware.
                </li>
                <li className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <strong className="text-white">Antarmuka Pengguna (User Interface):</strong> OS menyediakan cara bagi pengguna untuk berinteraksi dengan komputer. Ada dua jenis utama: <Code>CLI (Command-Line Interface)</Code> berbasis teks dan <Code>GUI (Graphical User Interface)</Code> berbasis grafis.
                </li>
            </ul>
            <ImagePlaceholder
                src="https://www.berwirausaha.net/wp-content/uploads/2019/03/Komponen-Pada-Sistem-Operasi.jpg"
                alt="Diagram Arsitektur Sistem Operasi"
                caption="Fungsi inti dan komponen utama sistem operasi."
            />

            <SectionTitle number={3} title="Kernel: Jantung Sistem Operasi" />
            <p>
                <strong className="text-white">Kernel</strong> adalah program inti dari sebuah OS. Ia memiliki kontrol penuh atas segala sesuatu dalam sistem. Kernel adalah bagian pertama dari OS yang dimuat ke memori saat boot-up dan tetap berada di sana selama komputer menyala. Semua fungsi inti yang disebutkan di atas dikelola langsung oleh kernel.
            </p>
            <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                <h4 className="font-bold text-white mb-2">Contoh Kernel:</h4>
                <ul className="list-disc list-inside space-y-1 text-xs">
                    <li><strong className="text-white">Kernel Linux:</strong> Digunakan oleh berbagai distribusi Linux (Ubuntu, Debian, Fedora) dan juga menjadi dasar dari Android.</li>
                    <li><strong className="text-white">Kernel NT (New Technology):</strong> Digunakan oleh semua versi modern Microsoft Windows (Windows 10, 11, Windows Server).</li>
                    <li><strong className="text-white">XNU (X is Not Unix):</strong> Kernel hibrida yang digunakan oleh macOS dan iOS, menggabungkan elemen dari kernel Mach dan komponen dari FreeBSD (turunan Unix).</li>
                </ul>
            </div>
            <ImagePlaceholder
                src="https://i.pinimg.com/originals/b0/80/06/b080063dbe7f9cf817972c558ef96e78.png"
                alt="Diagram Kernel Sistem Operasi"
                caption="Kernel sebagai inti dari sistem operasi."
            />

            <SectionTitle number={4} title="Contoh Sistem Operasi Populer" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <div className="p-4 rounded-lg bg-[#07090f]">
                    <h4 className="font-bold text-white mb-2">Microsoft Windows</h4>
                    <p className="text-xs">OS desktop paling dominan di dunia, dikenal karena kompatibilitas perangkat keras dan perangkat lunak yang luas serta antarmuka yang ramah pengguna.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f]">
                    <h4 className="font-bold text-white mb-2">Apple macOS</h4>
                    <p className="text-xs">Dikenal karena desainnya yang elegan, stabilitas (berbasis Unix), dan ekosistem yang terintegrasi erat dengan perangkat keras Apple lainnya.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f]">
                    <h4 className="font-bold text-white mb-2">Linux</h4>
                    <p className="text-xs">Bukan satu OS, melainkan keluarga OS berbasis kernel Linux. Bersifat open-source, sangat fleksibel, dan dominan di server, superkomputer, dan perangkat IoT. Contoh populer: Ubuntu, Mint, Debian.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f]">
                    <h4 className="font-bold text-white mb-2">Google Android</h4>
                    <p className="text-xs">OS mobile paling populer di dunia. Berbasis kernel Linux dan bersifat open-source, memungkinkan banyak produsen untuk menggunakannya di perangkat mereka.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f]">
                    <h4 className="font-bold text-white mb-2">Apple iOS</h4>
                    <p className="text-xs">OS mobile yang berjalan secara eksklusif di iPhone. Dikenal karena kinerjanya yang mulus, keamanan yang ketat, dan App Store yang terkurasi dengan baik.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f]">
                    <h4 className="font-bold text-white mb-2">OS Mobile Lainnya</h4>
                    <p className="text-xs">Sebelum dominasi Android dan iOS, ada beberapa pemain besar lainnya seperti <strong className="text-white">Symbian OS</strong> (Nokia), <strong className="text-white">BlackBerry OS</strong>, dan <strong className="text-white">Windows Mobile/Phone</strong>. Mereka adalah pionir di era smartphone awal.</p>
                </div>
            </div>
            <ImagePlaceholder
                src={["https://miro.medium.com/v2/resize:fit:1200/1*nzFFqocjgg3CSnF_zBHkdQ.png", "/media/img/BlackBerry.jpeg", "/media/img/symbian-os.png", "/media/img/windows-mobile-os.jpg"]}
                alt="Logo Sistem Operasi Populer"
                caption="Berbagai logo sistem operasi yang umum digunakan."
            />

            <SectionTitle number={5} title="OS di Luar PC & Smartphone" />
            <p>
                Sistem operasi tidak hanya ada di komputer atau ponsel. Banyak perangkat modern yang kita gunakan sehari-hari juga ditenagai oleh OS khusus yang disebut <strong className="text-white">sistem benam (embedded system)</strong>.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <div className="p-4 rounded-lg bg-[#07090f]">
                    <h4 className="font-bold text-white mb-2">Smart TV</h4>
                    <p className="text-xs">TV modern berjalan di atas OS seperti <strong className="text-white">Android TV/Google TV</strong>, <strong className="text-white">webOS</strong> (LG), atau <strong className="text-white">Tizen</strong> (Samsung). OS ini mengelola aplikasi streaming, koneksi internet, dan input dari remote.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f]">
                    <h4 className="font-bold text-white mb-2">Konsol Game</h4>
                    <p className="text-xs">Perangkat seperti <strong className="text-white">PlayStation (Orbis OS)</strong> dan <strong className="text-white">Xbox (Xbox OS)</strong> memiliki sistem operasi yang sangat dioptimalkan untuk gaming, mengelola grafis, jaringan, dan layanan online.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f]">
                    <h4 className="font-bold text-white mb-2">Sistem Infotainment Mobil</h4>
                    <p className="text-xs">Sistem di dasbor mobil Anda yang mengontrol navigasi, musik, dan panggilan telepon juga merupakan OS. Contohnya termasuk <strong className="text-white">Android Automotive</strong> dan <strong className="text-white">QNX</strong>.</p>
                </div>
            </div>
            <ImagePlaceholder
                src={["/media/img/androidtv.jpeg", "/media/img/orbis.jpg", "/media/img/steamos.jpg", "/media/img/xboxos.png"]}
                alt="Contoh Embedded OS"
                caption="Antarmuka webOS dari LG, salah satu contoh sistem operasi pada Smart TV."
            />
        </div>
    );
}