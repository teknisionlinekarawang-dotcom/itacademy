import ImagePlaceholder from '../components/ImagePlaceholder';
import VideoPlaceholder from '../components/VideoPlaceholder';
import { Link } from 'react-router-dom';

const SectionTitle = ({ number, title }: { number: number, title: string }) => (
    <h2 className="font-display text-xl font-bold text-[#00d4ff] mb-4 border-t border-[rgba(0,212,255,0.1)] pt-8 mt-8">
        <span className="text-base text-[#4a5568] mr-2">{number}.</span>{title}
    </h2>
);

export default function RamStorageContent() {
    return (
        <div className="space-y-4 text-[#b0c4de] leading-relaxed text-sm">
            <div className="mb-8">
                <Link to="/dashboard" className="text-cyan-400 hover:underline text-sm">&larr; Kembali ke Dashboard</Link>
            </div>
            <p>
                RAM (Random Access Memory) dan Storage (Penyimpanan) adalah dua komponen krusial dalam komputer yang seringkali disalahpahami. Keduanya berfungsi menyimpan data, tetapi dengan tujuan dan karakteristik yang sangat berbeda.
            </p>

            <SectionTitle number={1} title="RAM: Memori Jangka Pendek yang Cepat" />
            <p>
                RAM adalah memori volatil, artinya data yang tersimpan di dalamnya akan hilang saat komputer dimatikan. Fungsinya adalah sebagai "meja kerja" CPU, menyimpan data dan instruksi program yang sedang aktif digunakan agar dapat diakses dengan sangat cepat.
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs">
                <li><strong className="text-white">DRAM (Dynamic RAM):</strong> Jenis RAM paling umum di komputer modern. Setiap bit data disimpan dalam kapasitor kecil yang perlu disegarkan secara berkala.</li>
                <li><strong className="text-white">SRAM (Static RAM):</strong> Lebih cepat dan lebih mahal daripada DRAM, tidak perlu disegarkan. Digunakan untuk cache CPU.</li>
                <li><strong className="text-white">Generasi DDR (Double Data Rate):</strong> RAM terus berevolusi dengan generasi seperti DDR4, DDR5, yang menawarkan kecepatan transfer data yang lebih tinggi.</li>
            </ul>
            <ImagePlaceholder
                src={["http://www.cpu-zone.com/Ram/DSCF1178.JPG"]}
                alt="Modul RAM"
                caption="Contoh modul Random Access Memory (RAM)."
            />

            <VideoPlaceholder
                thumbnailSrc="https://www.sweetwater.com/sweetcare/media/2023/08/Installed-RAM-How-To-Install-RAM-In-a-Windows-PC.jpg" // Ganti dengan path thumbnail Anda
                videoSrc="/media/ram/ram-explained.mp4"
                alt="Penjelasan Video tentang RAM"
                caption="Tonton video penjelasan tentang cara kerja RAM."
            />

            <SectionTitle number={2} title="RAM vs. ROM: Perbedaan Mendasar" />
            <p>
                Selain RAM, ada juga <strong className="text-white">ROM (Read-Only Memory)</strong>. Keduanya adalah memori, tetapi fungsinya sangat berbeda.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">RAM (Random Access Memory)</h4>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li><strong className="text-white">Volatil:</strong> Data hilang saat listrik mati.</li>
                        <li><strong className="text-white">Tujuan:</strong> Menyimpan data yang sedang aktif diproses (memori kerja).</li>
                        <li><strong className="text-white">Kecepatan:</strong> Sangat cepat.</li>
                        <li><strong className="text-white">Operasi:</strong> Baca dan Tulis (Read/Write).</li>
                    </ul>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">ROM (Read-Only Memory)</h4>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li><strong className="text-white">Non-Volatil:</strong> Data tetap ada meski listrik mati.</li>
                        <li><strong className="text-white">Tujuan:</strong> Menyimpan firmware atau bootloader (instruksi awal saat komputer menyala).</li>
                        <li><strong className="text-white">Kecepatan:</strong> Lebih lambat dari RAM.</li>
                        <li><strong className="text-white">Operasi:</strong> Hanya Baca (Read-Only) pada kondisi normal.</li>
                    </ul>
                </div>
            </div>
            <p className="text-xs text-[#64748b]">Contoh ROM modern adalah chip BIOS/UEFI di motherboard yang berisi perangkat lunak untuk memulai sistem operasi.</p>

            <SectionTitle number={3} title="Evolusi Storage: Dari Pita ke Kapasitor" />
            <p>
                Storage adalah memori non-volatil, yang berarti data tetap tersimpan meskipun tidak ada daya. Ini adalah tempat file, program, dan sistem operasi disimpan secara permanen.
            </p>
            <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                <h4 className="font-bold text-white mb-2">Jenis Penyimpanan Modern pada PC</h4>
                <ul className="list-disc list-inside space-y-2 text-xs">
                    <li><strong className="text-white">Hard Disk Drive (HDD):</strong> Menggunakan piringan magnetis yang berputar dan lengan baca/tulis mekanis. Murah dan berkapasitas besar, namun paling lambat. Terhubung melalui antarmuka <strong className="text-white">SATA</strong> (Serial ATA) atau <strong className="text-white">IDE</strong> (PATA) pada model yang sangat lama.</li>
                    <li><strong className="text-white">Solid State Drive (SSD) SATA:</strong> Menggunakan chip memori flash, tanpa bagian bergerak. Jauh lebih cepat dari HDD. Bentuknya seperti HDD 2.5 inci dan menggunakan antarmuka SATA yang sama, sehingga kecepatannya terbatas oleh bandwidth SATA.</li>
                    <li><strong className="text-white">SSD NVMe (Non-Volatile Memory Express):</strong> Jenis SSD paling cepat saat ini. Berbentuk seperti stik RAM kecil dan dipasang langsung ke slot <strong className="text-white">M.2</strong> di motherboard. Menggunakan jalur PCIe yang jauh lebih cepat daripada SATA, memungkinkan kecepatan baca/tulis yang luar biasa. Keunggulan utama performa SSD dibandingkan HDD adalah karena SSD <strong className="text-green-400">tidak memiliki komponen mekanik yang bergerak</strong>, sehingga akses data menjadi instan.</li>
                </ul>
            </div>
            <div className="overflow-x-auto my-4">
                <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                        <tr className="border-b border-[rgba(0,212,255,0.2)] bg-[rgba(0,212,255,0.05)]">
                            <th className="p-2">Jenis Storage</th>
                            <th className="p-2">Kecepatan Baca (Sequential)</th>
                            <th className="p-2">Kecepatan Tulis (Sequential)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                        <tr>
                            <td className="p-2 text-[#f59e0b]">HDD 7200rpm (SATA)</td>
                            <td className="p-2">~150 MB/s</td>
                            <td className="p-2">~120 MB/s</td>
                        </tr>
                        <tr>
                            <td className="p-2 text-[#10b981]">SSD (SATA III)</td>
                            <td className="p-2">~550 MB/s</td>
                            <td className="p-2">~520 MB/s</td>
                        </tr>
                        <tr>
                            <td className="p-2 text-[#00d4ff]">SSD (NVMe PCIe 4.0)</td>
                            <td className="p-2">~7,000 MB/s</td>
                            <td className="p-2">~5,000 MB/s</td>
                        </tr>
                    </tbody>
                </table>
                <p className="text-center font-mono text-[10px] text-[#4a5568] mt-1">Kecepatan adalah perkiraan dan dapat bervariasi tergantung model dan kondisi.</p>
            </div>
            <ul className="list-disc list-inside space-y-2 text-xs">
                <li><strong className="text-white">Pita Magnetik (1950-an):</strong> Salah satu bentuk penyimpanan data digital paling awal. Lambat, berurutan, dan berkapasitas rendah, tetapi sangat murah untuk arsip jangka panjang.</li>
                <li><strong className="text-white">Cakram Magnetik (Hard Disk Drive - HDD, 1956):</strong> IBM memperkenalkan HDD pertama. Data disimpan pada piringan logam berputar yang dilapisi bahan magnetik. Akses data lebih cepat daripada pita, tetapi masih mekanis.</li>
                <li><strong className="text-white">Floppy Disk (1970-an):</strong> Media penyimpanan portabel yang populer, meskipun kapasitasnya sangat kecil (hingga 1.44 MB).</li>
                <li><strong className="text-white">CD (Compact Disc, 1982):</strong> Menggunakan laser untuk membaca data yang disimpan sebagai lubang mikroskopis pada permukaan cakram optik. Kapasitas sekitar 700 MB.</li>
                <li><strong className="text-white">DVD (Digital Versatile Disc, 1995):</strong> Peningkatan dari CD dengan kapasitas lebih besar (hingga 8.5 GB untuk dual-layer).</li>
                <li><strong className="text-white">Blu-ray Disc (2006):</strong> Menggunakan laser biru-violet untuk membaca data, memungkinkan kapasitas yang jauh lebih besar (hingga 50 GB untuk dual-layer).</li>
                <li><strong className="text-white">Solid State Drive (SSD, 1990-an, populer 2000-an):</strong> Menggunakan memori flash berbasis NAND (mirip dengan USB drive) untuk menyimpan data. Tidak ada bagian bergerak, membuatnya jauh lebih cepat, lebih tahan guncangan, dan lebih hemat energi daripada HDD.</li>
            </ul>
            <ImagePlaceholder
                src={["https://www.backup-systems.co.uk/wp-content/uploads/2023/04/Storage-size-timeline.jpg", "https://image.slideserve.com/431292/slide1-l.jpg", "https://3.bp.blogspot.com/-xNcD8ZN_lys/UmKHHdSWVFI/AAAAAAAAAB8/PggB8pCHfCY/s1600/a.jpg", "https://image1.slideserve.com/1585988/magnetic-tape-recording-l.jpg", "https://c8.alamy.com/comp/2YCJPYK/floppy-disk-2YCJPYK.jpg", "https://c8.alamy.com/comp/ANWG9Y/dvd-digital-video-disc-ANWG9Y.jpg", "https://www.cleverfiles.com/howto/wp-content/uploads/2023/06/ide-vs-sata.jpg", "https://png.pngtree.com/png-clipart/20230415/original/pngtree-ssd-solid-drive-computer-storage-png-image_9057662.png", "https://www.verbatim-europe.com/files/products/vi3000-ssd/verbatim-vi3000-m2-pcie-gen-3-nvme-ssd-49373-lifestyle01.jpg"]}
                alt="Timeline Evolusi Penyimpanan Data"
                caption="Perkembangan teknologi penyimpanan dari masa ke masa."
            />

            <SectionTitle number={4} title="Memori Modern: Kapasitor dan Gerbang Logika" />
            <p>
                Baik RAM (DRAM) maupun memori flash (digunakan di SSD) mengandalkan prinsip elektronik untuk menyimpan data.
            </p>
            <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                <h4 className="font-bold text-white mb-2">Bagaimana Data Disimpan?</h4>
                <ul className="list-disc list-inside space-y-1 text-xs">
                    <li><strong className="text-white">DRAM (RAM):</strong> Setiap bit data disimpan sebagai muatan listrik dalam kapasitor. Jika kapasitor bermuatan, itu adalah '1'; jika tidak, itu adalah '0'. Karena kapasitor bocor, muatan harus disegarkan ribuan kali per detik.</li>
                    <li><strong className="text-white">Memori Flash (SSD):</strong> Menggunakan transistor gerbang mengambang (floating-gate transistor). Muatan listrik terperangkap di gerbang terisolasi, yang dapat bertahan selama bertahun-tahun tanpa daya. Ini adalah memori non-volatil.</li>
                </ul>
            </div>

            <SectionTitle number={5} title="Jenis Memori Modern Lainnya" />
            <p>
                Selain DRAM dan NAND Flash pada SSD, ada beberapa jenis memori non-volatil lain yang penting dalam perangkat modern:
            </p>
            <ul className="list-disc list-inside space-y-3 text-xs">
                <li>
                    <strong className="text-white">EEPROM (Electrically Erasable Programmable ROM):</strong> Jenis ROM yang dapat dihapus dan diprogram ulang secara elektrik. Digunakan untuk menyimpan pengaturan konfigurasi pada perangkat seperti BIOS/UEFI motherboard atau mikrokontroler.
                </li>
                <li>
                    <strong className="text-white">eMMC (embedded MultiMediaCard):</strong> Sebuah paket tunggal yang berisi memori NAND flash dan controller. Ini seperti SSD mini yang disolder langsung ke motherboard. Umumnya ditemukan pada smartphone, tablet, dan laptop kelas entri untuk menghemat biaya dan ruang.
                </li>
                <li>
                    <strong className="text-white">UFS (Universal Flash Storage):</strong> Standar penyimpanan flash modern yang dirancang untuk menggantikan eMMC. UFS menawarkan kecepatan baca/tulis yang jauh lebih tinggi (setara SSD SATA) karena dapat melakukan operasi baca dan tulis secara bersamaan. Banyak digunakan pada smartphone kelas menengah hingga atas.
                </li>
            </ul>
            <ImagePlaceholder src={["https://www.flexxon.com/wp-content/uploads/emmc-storage-flexxon-img.png", "https://www.profolus.com/wp-content/uploads/2021/07/Universal-Flash-Storage-Advantages-and-Disadvantages-of-UFS.jpg"]} alt="Perbandingan eMMC dan UFS" caption="eMMC (kiri) dan UFS (kanan) adalah standar penyimpanan internal pada perangkat mobile." />


            <SectionTitle number={6} title="Masa Depan Storage: Project Silica dan Beyond" />
            <p>
                Kebutuhan akan penyimpanan data yang lebih besar, lebih cepat, dan lebih tahan lama terus mendorong inovasi.
            </p>
            <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                <ImagePlaceholder
                    src="https://ryanswanstrom.com/wp-content/uploads/2019/11/project-silica-blogheader-1.jpg"
                    alt="Konsep Project Silica"
                    caption="Ilustrasi penyimpanan data dalam kaca kuarsa oleh Project Silica."
                />
                <h4 className="font-bold text-white mb-2">Project Silica (Microsoft Research):</h4>
                <p className="text-xs">
                    Sebuah proyek ambisius dari Microsoft yang bertujuan untuk menyimpan data dalam <strong className="text-white">kaca kuarsa</strong>. Data ditulis ke dalam kaca menggunakan laser femtosecond, menciptakan "voxel" (titik 3D) yang dapat dibaca kembali dengan cahaya terpolarisasi dan algoritma pembelajaran mesin.
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs mt-2">
                    <li><strong className="text-white">Keunggulan:</strong> Sangat tahan lama (ribuan tahun), tahan terhadap suhu ekstrem, air, dan radiasi. Ideal untuk penyimpanan arsip jangka panjang (cold storage).</li>
                    <li><strong className="text-white">Status:</strong> Masih dalam tahap penelitian dan pengembangan, belum siap untuk komersial.</li>
                </ul>
            </div>
            <p className="text-xs text-[#64748b]">
                Selain Project Silica, ada juga penelitian tentang memori DNA, memori holografik, dan teknologi lain yang menjanjikan revolusi dalam cara kita menyimpan dan mengakses informasi di masa depan.
            </p>
        </div>
    );
}