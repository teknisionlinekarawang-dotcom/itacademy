import { Link } from 'react-router-dom';
import ImagePlaceholder from '../components/ImagePlaceholder';

const SectionTitle = ({ number, title }: { number: number, title: string }) => (
    <h2 className="font-display text-xl font-bold text-[#00d4ff] mb-4 border-t border-[rgba(0,212,255,0.1)] pt-8 mt-8">
        <span className="text-base text-[#4a5568] mr-2">{number}.</span>{title}
    </h2>
);

const Code = ({ children }: { children: React.ReactNode }) => (
    <code className="font-mono bg-[#1a2535] px-1.5 py-0.5 rounded-md text-[#f59e0b] text-sm">{children}</code>
);

const Part = ({ name, desc }: { name: string, desc: string }) => (
    <li className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
        <strong className="text-white">{name}:</strong> {desc}
    </li>
);

export default function BasicComputerContent() {
    return (
        <div className="space-y-4 text-[#b0c4de] leading-relaxed text-sm">
            <div className="mb-8">
                <Link to="/dashboard" className="text-cyan-400 hover:underline text-sm">&larr; Kembali ke Dashboard</Link>
            </div>
            <p>
                Komputer adalah perangkat elektronik yang dapat menerima, menyimpan, memproses, dan menyajikan data. Dari perangkat raksasa seukuran ruangan hingga smartphone di saku Anda, prinsip dasarnya tetap sama. Mari kita jelajahi fondasi dari teknologi yang mengubah dunia ini.
            </p>

            <SectionTitle number={1} title="Sejarah Singkat Komputer" />
            <p>
                Perjalanan komputer sangatlah panjang, dimulai dari alat hitung mekanis hingga menjadi mesin cerdas seperti sekarang.
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs">
                <li><strong className="text-white">Generasi Pertama (1940-1956):</strong> Menggunakan tabung vakum, berukuran besar, dan mengonsumsi banyak daya. Contoh: ENIAC.</li>
                <li><strong className="text-white">Generasi Kedua (1956-1963):</strong> Transistor menggantikan tabung vakum, membuat komputer lebih kecil, cepat, dan hemat energi.</li>
                <li><strong className="text-white">Generasi Ketiga (1964-1971):</strong> Penggunaan Sirkuit Terpadu (IC), di mana ribuan transistor ditempatkan pada satu keping silikon.</li>
                <li><strong className="text-white">Generasi Keempat (1971-Sekarang):</strong> Munculnya mikroprosesor, yang menyatukan semua komponen CPU dalam satu chip. Ini melahirkan komputer pribadi (PC).</li>
                <li><strong className="text-white">Generasi Kelima (Masa Depan):</strong> Fokus pada Kecerdasan Buatan (AI), komputasi kuantum, dan interkoneksi masif melalui Internet of Things (IoT).</li>
            </ul>
            <ImagePlaceholder
                src="https://i.pinimg.com/originals/2b/eb/bd/2bebbdd41b3f89ca1914db289b5b23bc.jpg"
                alt="Timeline Sejarah Komputer"
                caption="Perkembangan komputer dari masa ke masa."
            />

            <SectionTitle number={2} title="Anatomi Komputer: Perangkat Keras (Hardware)" />
            <p>
                Perangkat keras adalah semua komponen fisik yang dapat Anda lihat dan sentuh. Mereka bekerja sama untuk menjalankan perintah.
            </p>
            <ul className="space-y-4 mt-4">
                <Part
                    name="Motherboard (Papan Induk)"
                    desc="Papan sirkuit utama yang menjadi 'tulang punggung' komputer. Semua komponen lain terhubung ke motherboard untuk dapat berkomunikasi satu sama lain."
                />
                <Part
                    name="CPU (Central Processing Unit)"
                    desc="Otak komputer. CPU menjalankan instruksi dari program dan melakukan kalkulasi. Kecepatannya diukur dalam Gigahertz (GHz)."
                />
                <div className="text-right mt-2">
                    <Link to="/module/cpu-details" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#00d4ff]/10 text-[#00d4ff] font-mono text-xs hover:bg-[#00d4ff]/20 transition-colors">
                        Pelajari Lebih Lanjut tentang CPU →
                    </Link>
                </div>
                <Part
                    name="RAM (Random Access Memory)"
                    desc="Memori jangka pendek komputer. RAM menyimpan data yang sedang aktif digunakan oleh aplikasi dan sistem operasi. Data di RAM akan hilang saat komputer dimatikan."
                />
                <Part
                    name="Penyimpanan (Storage)"
                    desc="Memori jangka panjang. Tempat file, aplikasi, dan sistem operasi disimpan secara permanen. Ada dua jenis utama: HDD (Hard Disk Drive) yang menggunakan piringan magnetis, dan SSD (Solid State Drive) yang lebih cepat karena menggunakan chip memori.
                    "
                />
                <Part
                    name="GPU (Graphics Processing Unit)"
                    desc="Komponen yang khusus untuk memproses dan merender grafis ke monitor. Sangat penting untuk bermain game, desain grafis, dan video editing."
                />
                <div className="text-right mt-2">
                    <Link to="/module/gpu-details" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#00d4ff]/10 text-[#00d4ff] font-mono text-xs hover:bg-[#00d4ff]/20 transition-colors">
                        Pelajari Lebih Lanjut tentang GPU →
                    </Link>
                </div>

                <Part
                    name="PSU (Power Supply Unit)"
                    desc="Menyediakan daya listrik untuk semua komponen di dalam komputer, mengubah listrik AC dari stopkontak menjadi listrik DC yang dibutuhkan."
                />
            </ul>
            <ImagePlaceholder
                src="https://miro.medium.com/v2/resize:fit:818/0*xC3hsaAv2P2ICE3_.png"
                alt="Diagram Motherboard dengan Komponen"
                caption="Komponen utama yang terpasang pada motherboard."
            />
            <div className="text-right mt-2">
                <Link to="/module/ram-storage-details" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#00d4ff]/10 text-[#00d4ff] font-mono text-xs hover:bg-[#00d4ff]/20 transition-colors">
                    Pelajari Lebih Lanjut tentang RAM & Storage →
                </Link>
            </div>

            <h3 className="font-display text-lg font-bold text-white pt-6">Perangkat Input & Output</h3>
            <p>Ini adalah bagaimana kita berinteraksi dengan komputer.</p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-lg bg-[#07090f]">
                    <h4 className="font-bold text-white mb-2">Perangkat Input</h4>
                    <ul className="list-disc list-inside text-xs space-y-1">
                        <li><strong className="text-white">Keyboard & Mouse:</strong> Untuk memasukkan teks dan perintah.</li>
                        <li><strong className="text-white">Mikrofon:</strong> Untuk memasukkan suara.</li>
                        <li><strong className="text-white">Webcam:</strong> Untuk memasukkan gambar video.</li>
                        <li><strong className="text-white">Touchscreen:</strong> Layar sentuh berfungsi sebagai input (menerima sentuhan) dan output (menampilkan gambar) sekaligus.</li>
                    </ul>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f]">
                    <h4 className="font-bold text-white mb-2">Perangkat Output</h4>
                    <ul className="list-disc list-inside text-xs space-y-1">
                        <li><strong className="text-white">Monitor:</strong> Menampilkan informasi visual.</li>
                        <li><strong className="text-white">Speaker/Headphone:</strong> Mengeluarkan suara.</li>
                        <li><strong className="text-white">Printer:</strong> Mencetak data ke media fisik (kertas).</li>
                    </ul>
                </div>
            </div>

            <SectionTitle number={3} title="Jiwa Komputer: Perangkat Lunak (Software)" />
            <p>
                Jika hardware adalah tubuhnya, maka software adalah jiwanya. Software adalah sekumpulan instruksi yang memberitahu hardware apa yang harus dilakukan.
            </p>
            <ul className="list-disc list-inside space-y-2">
                <li>
                    <strong className="text-white">Sistem Operasi (Operating System - OS):</strong> Perangkat lunak paling fundamental yang mengelola semua sumber daya hardware dan software. OS menyediakan antarmuka bagi pengguna untuk berinteraksi dengan komputer. Contoh: <Code>Windows</Code>, <Code>macOS</Code>, <Code>Linux</Code>, <Code>Android</Code>.
                </li>
                <div className="text-right mt-2">
                    <ImagePlaceholder
                        src="https://hubcomputers.co.uk/wp-content/uploads/2025/01/visual-operating-system-identification.jpg"
                        alt="Contoh Antarmuka Sistem Operasi"
                        caption="Tampilan antarmuka pengguna (GUI) dari sebuah sistem operasi."
                    />
                    <Link to="/module/os-details" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#00d4ff]/10 text-[#00d4ff] font-mono text-xs hover:bg-[#00d4ff]/20 transition-colors">
                        Pelajari Lebih Lanjut tentang OS →
                    </Link>
                </div>
                <li>
                    <strong className="text-white">Aplikasi (Application Software):</strong> Program yang dirancang untuk melakukan tugas spesifik bagi pengguna. Contoh: Browser Web (Chrome, Firefox), Pengolah Kata (Microsoft Word), Game, dan aplikasi editing foto.
                </li>
                <li>
                    <strong className="text-white">Driver:</strong> Perangkat lunak kecil yang memungkinkan sistem operasi untuk berkomunikasi dan mengontrol perangkat keras tertentu. Setiap komponen, dari mouse hingga GPU, memerlukan driver-nya sendiri.
                </li>
                <p className="text-xs text-[#64748b] pt-2">
                    Kegagalan pada sistem operasi atau driver yang tidak cocok seringkali menjadi penyebab utama masalah serius seperti <strong className="text-blue-400">Blue Screen of Death (BSOD)</strong> di Windows, di mana sistem berhenti total untuk mencegah kerusakan lebih lanjut.
                </p>
            </ul>

            <SectionTitle number={4} title="Bagaimana Semuanya Bekerja Sama?" />
            <p>
                Bayangkan Anda mengklik dua kali ikon aplikasi di desktop:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-xs pl-2">
                <li><strong className="text-white">Input:</strong> Mouse mengirimkan sinyal klik ke Sistem Operasi.</li>
                <li><strong className="text-white">Proses (CPU & OS):</strong> OS menerima sinyal dan memberitahu CPU untuk menemukan file aplikasi tersebut di perangkat penyimpanan (SSD/HDD).</li>
                <li><strong className="text-white">Memuat ke Memori:</strong> CPU memerintahkan agar data aplikasi disalin dari penyimpanan ke RAM agar bisa diakses dengan cepat.</li>
                <li><strong className="text-white">Eksekusi:</strong> CPU mulai menjalankan instruksi dari aplikasi yang sekarang ada di RAM.</li>
                <li><strong className="text-white">Output (GPU & Monitor):</strong> Saat aplikasi perlu menampilkan sesuatu, CPU mengirim data grafis ke GPU. GPU memproses data ini dan mengubahnya menjadi sinyal yang dapat ditampilkan oleh monitor sebagai antarmuka aplikasi yang Anda lihat.</li>
            </ol>
            <p>
                Seluruh proses ini terjadi dalam sepersekian detik, menunjukkan betapa cepat dan terkoordinasinya komponen-komponen komputer bekerja.
            </p>

            <SectionTitle number={5} title="Persiapan Instalasi Ulang Sistem Operasi (Pre-Install OS)" />
            <p>
                Menginstal ulang OS (sering disebut "install ulang") adalah proses untuk membersihkan sistem dan memulai dari awal. Sebelum melakukannya, ada beberapa persiapan krusial yang harus dilakukan untuk memastikan proses berjalan lancar.
            </p>
            <ul className="list-disc list-inside space-y-3 text-xs">
                <li>
                    <strong className="text-white">1. Cadangkan Data (Backup):</strong> Ini adalah langkah paling penting. Proses instalasi akan <strong className="text-red-400">menghapus semua data</strong> di partisi sistem (biasanya drive C:). Pindahkan semua file penting (dokumen, foto, video) ke hard disk eksternal, cloud storage (Google Drive, OneDrive), atau partisi lain yang tidak akan di-format.
                </li>
                <li>
                    <strong className="text-white">2. Siapkan Media Instalasi:</strong> Anda memerlukan media bootable untuk memulai proses instalasi. Umumnya ini adalah USB flash drive (minimal 8GB). Anda perlu:
                    <ul className="list-circle list-inside ml-4 mt-2 space-y-1">
                        <li>File <strong className="text-white">ISO</strong> dari sistem operasi yang diinginkan (misal: Windows 11, Ubuntu). File ini bisa diunduh dari situs resmi Microsoft atau Ubuntu.</li>
                        <li>Software untuk membuat media bootable seperti <strong className="text-white">Rufus</strong> atau <strong className="text-white">Media Creation Tool</strong> (untuk Windows).</li>
                    </ul>
                </li>
                <li>
                    <strong className="text-white">3. Siapkan Driver Penting:</strong> Setelah instalasi selesai, beberapa komponen mungkin tidak langsung berfungsi karena driver-nya belum terpasang. Unduh driver yang paling penting sebelumnya, terutama <strong className="text-white">Driver LAN/Wi-Fi</strong>, dan simpan di USB terpisah. Dengan driver jaringan terpasang, Anda bisa online untuk mengunduh driver lainnya.
                </li>
                <li>
                    <strong className="text-white">4. Kunci Produk (Product Key):</strong> Jika Anda menginstal Windows versi ritel, pastikan Anda memiliki kunci produk 25 digit untuk aktivasi. Untuk laptop modern, kunci produk seringkali sudah tertanam di firmware (BIOS/UEFI) dan akan terdeteksi otomatis.
                </li>
            </ul>
            <ImagePlaceholder src="https://rufus.ie/pics/rufus_en.png" alt="Tampilan Software Rufus" caption="Rufus adalah alat populer untuk membuat USB bootable dari file ISO." />

            <SectionTitle number={6} title="Partisi, Filesystem, dan Konfigurasi BIOS" />
            <p>
                Ini adalah tiga konsep teknis yang akan Anda temui selama proses instalasi.
            </p>
            <div className="space-y-4">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">Partisi Storage (MBR vs GPT)</h4>
                    <p className="text-xs mb-2">Partisi adalah proses membagi satu hard disk fisik menjadi beberapa "drive" logis (seperti C:, D:, dll.). Ini berguna untuk memisahkan file sistem operasi dari data pribadi. Ada dua skema partisi utama:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li><strong className="text-white">MBR (Master Boot Record):</strong> Skema lama, terbatas hanya untuk disk di bawah 2TB dan maksimal 4 partisi primer.</li>
                        <li><strong className="text-white">GPT (GUID Partition Table):</strong> Skema modern yang diperlukan untuk booting di mode UEFI. Mendukung disk di atas 2TB dan hingga 128 partisi. <strong className="text-green-400">Gunakan GPT untuk semua sistem modern.</strong></li>
                    </ul>
                </div>
                <p className="text-xs text-[#64748b] pt-2">
                    Seiring waktu, file-file pada partisi (terutama di HDD) bisa menjadi terfragmentasi (terpecah-pecah). Proses <strong className="text-white">Defragmentation</strong> adalah tindakan perawatan untuk menyusun kembali potongan-potongan file tersebut agar berdekatan, sehingga mempercepat waktu baca.
                </p>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">Jenis-jenis Filesystem</h4>
                    <p className="text-xs mb-2">Filesystem adalah struktur yang digunakan OS untuk mengatur, menyimpan, dan melacak file pada sebuah partisi. Ini seperti sistem pengarsipan untuk data Anda.</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li><strong className="text-white">NTFS (New Technology File System):</strong> Filesystem standar untuk Windows. Mendukung file besar, keamanan tingkat file, dan fitur modern lainnya.</li>
                        <li><strong className="text-white">FAT32:</strong> Filesystem lama dengan kompatibilitas universal (bisa dibaca di Windows, Mac, Linux). Namun, terbatas hanya untuk file di bawah 4GB. Sering digunakan untuk flash drive.</li>
                        <li><strong className="text-white">exFAT:</strong> Versi modern dari FAT32. Tidak memiliki batas ukuran file 4GB, menjadikannya pilihan bagus untuk hard disk eksternal yang perlu diakses di berbagai OS.</li>
                        <li><strong className="text-white">Ext4 (Fourth Extended Filesystem):</strong> Filesystem standar untuk sebagian besar distribusi Linux.</li>
                        <li><strong className="text-white">APFS (Apple File System):</strong> Filesystem modern yang dioptimalkan untuk SSD dan digunakan pada macOS, iOS, dan perangkat Apple lainnya.</li>
                    </ul>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">Konfigurasi BIOS/UEFI</h4>
                    <p className="text-xs mb-2">BIOS/UEFI adalah program tingkat rendah (firmware) yang tertanam pada chip di motherboard. Ia berjalan pertama kali saat komputer dinyalakan untuk melakukan <strong className="text-white">POST (Power-On Self Test)</strong>, yaitu pengecekan awal semua komponen hardware. Bunyi "beep" pendek satu kali biasanya menandakan POST berhasil. Anda perlu masuk ke menu ini (biasanya dengan menekan <Code>DEL</Code>, <Code>F2</Code>, atau <Code>F12</Code> saat boot) untuk mengatur beberapa hal:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li><strong className="text-white">Boot Order/Priority:</strong> Atur urutan boot agar komputer membaca <strong className="text-white">USB Drive</strong> terlebih dahulu, bukan hard disk internal. Ini akan memulai proses instalasi dari media yang sudah Anda siapkan.</li>
                        <li><strong className="text-white">Boot Mode (UEFI/Legacy):</strong> <strong className="text-white">UEFI</strong> adalah mode boot modern yang lebih cepat dan aman. <strong className="text-white">Legacy/CSM</strong> adalah mode kompatibilitas untuk OS lama. Pastikan mode ini diatur ke UEFI untuk OS modern seperti Windows 11.</li>
                        <li><strong className="text-white">Secure Boot:</strong> Fitur keamanan UEFI yang mencegah malware berjalan saat boot. Untuk Windows, biarkan ini aktif. Untuk beberapa distribusi Linux, fitur ini mungkin perlu dinonaktifkan sementara.</li>
                    </ul>
                </div>
            </div>
            <ImagePlaceholder src="https://www.howtogeek.com/wp-content/uploads/2017/06/ximg_593ef5a61b353.png.pagespeed.gp+jp+jw+pj+ws+js+rj+rp+rw+ri+cp+md.ic.lIu-30qYSU.png" alt="Tampilan Menu BIOS/UEFI" caption="Contoh tampilan menu pengaturan Boot Order di dalam BIOS/UEFI." />
        </div>
    );
}
