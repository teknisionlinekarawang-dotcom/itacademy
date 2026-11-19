import ImagePlaceholder from '../components/ImagePlaceholder';
import { Link } from 'react-router-dom';

const SectionTitle = ({ number, title }: { number: number, title: string }) => (
    <h2 className="font-display text-xl font-bold text-[#00d4ff] mb-4 border-t border-[rgba(0,212,255,0.1)] pt-8 mt-4">
        <span className="text-base text-[#4a5568] mr-2">{number}.</span>{title}
    </h2>
);

const Code = ({ children }: { children: React.ReactNode }) => (
    <code className="font-mono bg-[#1a2535] px-1.5 py-0.5 rounded-md text-[#f59e0b] text-sm">{children}</code>
);

export default function DigitalComputationContent() {
    return (
        <div className="space-y-4 text-[#b0c4de] leading-relaxed text-sm">
            <div className="mb-8">
                <Link to="/dashboard" className="text-cyan-400 hover:underline text-sm">&larr; Kembali ke Dashboard</Link>
            </div>
            <SectionTitle number={1} title="Unit Terkecil Data: Bit" />
            <p>
                Di dunia digital, semua informasi—teks, gambar, video, suara—pada dasarnya adalah kumpulan angka. Unit paling dasar dari informasi ini adalah <strong className="text-white">Bit</strong>, singkatan dari <strong className="text-white">Binary Digit</strong>.
            </p>
            <p>
                Bayangkan sebuah saklar lampu. Ia hanya memiliki dua kondisi: <strong className="text-white">ON</strong> atau <strong className="text-white">OFF</strong>. Komputer menggunakan prinsip yang sama. Sebuah Bit hanya bisa memiliki dua nilai: <strong className="text-white">1 (ON)</strong> atau <strong className="text-white">0 (OFF)</strong>. Sistem yang hanya menggunakan dua simbol ini disebut sistem <strong className="text-white">biner (binary)</strong>.
            </p>
            <ImagePlaceholder
                src="https://via.placeholder.com/600x400?text=Bit+Representation"
                alt="Representasi Bit"
                caption="Bit sebagai saklar ON/OFF."
            />

            <SectionTitle number={2} title="Kumpulan Bit: Byte" />
            <p>
                Satu bit saja tidak cukup untuk merepresentasikan informasi yang kompleks. Oleh karena itu, bit-bit ini dikelompokkan. Standar pengelompokan yang paling umum adalah <strong className="text-white">Byte</strong>, yang terdiri dari <strong className="text-white">8 bit</strong>.
            </p>
            <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                <h4 className="font-bold text-white mb-2">Mengapa 8 Bit?</h4>
                <p className="text-xs">
                    Dengan 8 bit, kita bisa membuat <strong className="text-white">256 kombinasi</strong> yang berbeda (dari <Code>00000000</Code> hingga <Code>11111111</Code>). Jumlah ini cukup untuk merepresentasikan semua huruf (besar dan kecil), angka (0-9), dan simbol-simbol umum yang kita gunakan dalam tulisan, seperti yang didefinisikan dalam standar <strong className="text-white">ASCII (American Standard Code for Information Interchange)</strong>.
                </p>
                <p className="text-xs mt-2">
                    Contoh: Huruf 'A' dalam ASCII direpresentasikan sebagai byte <Code>01000001</Code>.
                </p>
            </div>
            <ImagePlaceholder
                src="https://via.placeholder.com/600x400?text=Byte+and+ASCII"
                alt="Byte dan ASCII"
                caption="Satu byte terdiri dari 8 bit, merepresentasikan karakter ASCII."
            />

            <SectionTitle number={3} title="Sistem Bilangan dalam Komputer" />
            <p>
                Manusia terbiasa dengan sistem desimal (basis 10), tetapi komputer bekerja dengan sistem lain.
            </p>
            <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-white">Biner (Basis 2):</strong> Menggunakan angka 0 dan 1. Ini adalah bahasa asli komputer.</li>
                <li><strong className="text-white">Desimal (Basis 10):</strong> Menggunakan angka 0 hingga 9. Sistem yang kita gunakan sehari-hari.</li>
                <li><strong className="text-white">Heksadesimal (Basis 16):</strong> Menggunakan angka 0-9 dan huruf A-F (mewakili 10-15). Heksadesimal sering digunakan oleh programmer karena lebih ringkas untuk merepresentasikan nilai byte yang besar. Satu digit heksadesimal dapat mewakili 4 bit (nibble).</li>
            </ul>
            <p className="text-xs text-[#64748b]">
                Contoh: Nilai desimal <Code>255</Code> adalah <Code>11111111</Code> dalam biner, dan <Code>FF</Code> dalam heksadesimal. Jauh lebih mudah menulis <Code>FF</Code> daripada delapan angka satu.
            </p>
            <ImagePlaceholder
                src="https://via.placeholder.com/600x400?text=Sistem+Bilangan"
                alt="Perbandingan Sistem Bilangan"
                caption="Perbandingan desimal, biner, dan heksadesimal."
            />

            <SectionTitle number={4} title="Satuan Ukuran Data Digital" />
            <p>
                Sama seperti kita mengukur jarak dalam meter dan kilometer, kita mengukur data digital dalam Byte, Kilobyte, Megabyte, dan seterusnya. Namun, ada dua cara untuk menghitungnya:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">Basis 10 (SI)</h4>
                    <p className="text-xs">Umumnya digunakan oleh produsen media penyimpanan (Harddisk, SSD) untuk marketing.</p>
                    <ul className="list-disc list-inside space-y-1 text-xs mt-2">
                        <li>1 Kilobyte (KB) = 1,000 Byte</li>
                        <li>1 Megabyte (MB) = 1,000 KB</li>
                        <li>1 Gigabyte (GB) = 1,000 MB</li>
                    </ul>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">Basis 2 (Biner)</h4>
                    <p className="text-xs">Digunakan oleh sistem operasi (Windows, macOS) untuk menghitung ruang disk dan memori.</p>
                    <ul className="list-disc list-inside space-y-1 text-xs mt-2">
                        <li>1 Kibibyte (KiB) = 1,024 Byte</li>
                        <li>1 Mebibyte (MiB) = 1,024 KiB</li>
                        <li>1 Gibibyte (GiB) = 1,024 MiB</li>
                    </ul>
                </div>
            </div>
            <p className="text-xs text-[#4a5568]">
                Inilah sebabnya mengapa harddisk 1 TB (1 triliun byte) akan terbaca sekitar 931 GB (sebenarnya 931 GiB) di Windows. Sistem operasi menghitung menggunakan basis 2 (1024), bukan basis 10 (1000).
            </p>
            <ImagePlaceholder
                src="https://via.placeholder.com/600x400?text=KB+vs+KiB"
                alt="Perbedaan Kilobyte dan Kibibyte"
                caption="Perbedaan perhitungan ukuran data basis 10 dan basis 2."
            />

            <SectionTitle number={5} title="Representasi Informasi Lainnya" />
            <ul className="list-disc list-inside space-y-2">
                <li>
                    <strong className="text-white">Gambar (Bitmap):</strong> Sebuah gambar dibagi menjadi grid piksel. Setiap piksel diberi nilai warna. Misalnya, dalam warna 24-bit, setiap piksel membutuhkan 3 byte (masing-masing 1 byte untuk Merah, Hijau, dan Biru) untuk merepresentasikan 1 dari 16,7 juta warna.
                </li>
                <li>
                    <strong className="text-white">Teks Modern (Unicode/UTF-8):</strong> ASCII hanya cukup untuk bahasa Inggris. <strong className="text-white">Unicode</strong> adalah standar yang mendefinisikan setiap karakter di hampir semua bahasa di dunia. <strong className="text-white">UTF-8</strong> adalah cara paling populer untuk mengkodekan Unicode, di mana satu karakter bisa menggunakan 1 hingga 4 byte, membuatnya efisien untuk teks yang dominan menggunakan karakter Latin.
                </li>
            </ul>

            <SectionTitle number={6} title="Aplikasi Praktis: Bandwidth & Kecepatan Data" />
            <p>
                Konsep Bit dan Byte menjadi sangat penting saat kita berbicara tentang kecepatan internet. Di sinilah sering terjadi kebingungan antara <strong className="text-white">Megabit (Mb)</strong> dan <strong className="text-white">Megabyte (MB)</strong>.
            </p>

            <ImagePlaceholder
                src="https://via.placeholder.com/600x400?text=Mbps+vs+MBps"
                alt="Perbedaan Megabit dan Megabyte per detik"
                caption="Visualisasi perbedaan Mbps dan MBps."
            />
            <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(245,158,11,0.2)]">
                <h4 className="font-bold text-[#f59e0b] mb-2">Perbedaan Kunci: Mb vs MB</h4>
                <ul className="list-disc list-inside space-y-2 text-xs">
                    <li>
                        <strong className="text-white">Megabit per second (Mbps):</strong> Satuan yang digunakan oleh Penyedia Layanan Internet (ISP) untuk mengukur <strong className="text-white">kecepatan transfer data (bandwidth)</strong>. Ini mengukur berapa juta <strong className="text-white">bit</strong> yang dapat ditransfer setiap detik.
                    </li>
                    <li>
                        <strong className="text-white">Megabyte (MB):</strong> Satuan yang digunakan oleh komputer dan perangkat kita untuk mengukur <strong className="text-white">ukuran file</strong>. Ini mengukur berapa juta <strong className="text-white">byte</strong> ukuran sebuah file.
                    </li>
                </ul>
                <p className="font-mono text-[10px] text-center text-[#4a5568] mt-4 p-2 bg-[#1a2535] rounded-md">
                    Ingat: 1 Byte = 8 bit. Jadi, 1 MB = 8 Mb.
                </p>
            </div>

            <h3 className="font-display text-lg font-bold text-white pt-4">Contoh Perhitungan</h3>
            <p>
                Anda berlangganan internet dengan kecepatan <strong className="text-white">100 Mbps</strong>. Berapa lama waktu yang dibutuhkan untuk mengunduh file sebesar <strong className="text-white">500 MB</strong>?
            </p>
            <ol className="list-decimal list-inside space-y-3 pl-2 text-xs">
                <li>
                    <strong className="text-white">Konversi Ukuran File ke Megabit (Mb):</strong><br/>
                    Ukuran file dalam bit = 500 MB * 8 = <Code>4000 Mb</Code>.
                </li>
                <li>
                    <strong className="text-white">Hitung Waktu Unduh (Teoritis):</strong><br/>
                    Waktu = Total Ukuran (Mb) / Kecepatan (Mbps)<br/>
                    Waktu = 4000 Mb / 100 Mbps = <Code>40 detik</Code>.
                </li>
            </ol>
            <p className="text-xs text-[#64748b]">
                Jadi, secara teori, dibutuhkan waktu 40 detik untuk mengunduh file 500 MB dengan koneksi 100 Mbps. Dalam praktiknya, waktu ini bisa sedikit lebih lama karena faktor lain seperti latensi, kepadatan jaringan, dan kecepatan server sumber. Kecepatan nyata yang Anda dapatkan ini disebut <strong className="text-white">Throughput</strong>.
            </p>

            <SectionTitle number={7} title="Representasi Karakter: Dari Teks ke Biner" />
            <p>
                Kita sudah tahu bahwa 1 Byte (8 bit) dapat merepresentasikan 256 kombinasi. Bagaimana komputer menggunakan ini untuk menampilkan teks yang kita baca? Jawabannya ada pada <strong className="text-white">Character Encoding</strong>.
            </p>
            <ul className="list-disc list-inside space-y-3">
                <li>
                    <strong className="text-white">ASCII (American Standard Code for Information Interchange):</strong> Standar awal yang menggunakan 7-bit (128 karakter) untuk merepresentasikan huruf Inggris, angka, dan simbol dasar. Contoh: huruf 'A' adalah <Code>01000001</Code> (desimal 65). Keterbatasannya adalah tidak bisa merepresentasikan karakter dari bahasa lain seperti 'é' atau 'á'.
                </li>
                <li>
                    <strong className="text-white">Unicode:</strong> Standar modern yang bertujuan untuk mencakup semua karakter dari semua bahasa di dunia, termasuk simbol dan emoji. Unicode memberikan nomor unik (disebut *code point*) untuk setiap karakter. Contoh: 'A' adalah U+0041, '€' adalah U+20AC, dan '😊' adalah U+1F60A.
                </li>
                <li>
                    <strong className="text-white">UTF-8 (Unicode Transformation Format - 8-bit):</strong> Ini adalah cara paling populer untuk *meng-encode* (mewujudkan) Unicode menjadi bit. Kehebatannya adalah ia bersifat *variable-width*:
                    <ul className="list-circle list-inside ml-4 mt-2 text-xs space-y-1">
                        <li>Karakter ASCII dasar (seperti 'A', 'B', '1', '2') hanya butuh <strong className="text-white">1 Byte</strong>.</li>
                        <li>Karakter Eropa (seperti 'é', 'ü') butuh <strong className="text-white">2 Byte</strong>.</li>
                        <li>Karakter Asia umum (seperti '你', '私') butuh <strong className="text-white">3 Byte</strong>.</li>
                        <li>Simbol dan emoji (seperti '😊', '👍') butuh <strong className="text-white">4 Byte</strong>.</li>
                    </ul>
                </li>
            </ul>
            <p className="text-xs text-[#64748b]">
                Inilah sebabnya ukuran file teks tidak selalu sama dengan jumlah karakternya. Sebuah file teks dengan 100 emoji akan jauh lebih besar daripada file teks dengan 100 huruf 'a'.
            </p>

            <SectionTitle number={8} title="Efisiensi Data: Pengantar Kompresi" />
            <p>
                Setelah data direpresentasikan dalam bit dan byte, ukurannya seringkali sangat besar. Kompresi adalah teknik untuk memperkecil ukuran file agar lebih hemat ruang penyimpanan dan lebih cepat dikirim melalui jaringan.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(16,185,129,0.2)]">
                    <h4 className="font-bold text-[#10b981] mb-2">Kompresi Lossless (Tanpa Kehilangan)</h4>
                    <p className="text-xs mb-2">Memperkecil ukuran file tanpa kehilangan informasi sedikit pun. Data asli dapat dikembalikan 100% sempurna.</p>
                    <p className="text-xs mb-2"><strong className="text-white">Analogi:</strong> Menyingkat "Yang Terhormat" menjadi "Yth.". Informasinya tetap utuh.</p>
                    <p className="text-xs"><strong className="text-white">Contoh:</strong> File <Code>.zip</Code>, <Code>.rar</Code>, gambar <Code>.png</Code>, audio <Code>.flac</Code>.</p>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(239,68,68,0.2)]">
                    <h4 className="font-bold text-[#ef4444] mb-2">Kompresi Lossy (Dengan Kehilangan)</h4>
                    <p className="text-xs mb-2">Memperkecil ukuran file dengan membuang beberapa informasi yang dianggap "tidak terlalu penting" oleh persepsi manusia.</p>
                    <p className="text-xs mb-2"><strong className="text-white">Analogi:</strong> Meringkas film 2 jam menjadi trailer 2 menit. Intinya dapat, tapi detailnya hilang.</p>
                    <p className="text-xs"><strong className="text-white">Contoh:</strong> Gambar <Code>.jpeg</Code>, audio <Code>.mp3</Code>, video <Code>.mp4</Code>.</p>
                </div>
            </div>
            <p className="text-xs text-[#64748b]">
                Pemilihan jenis kompresi sangat bergantung pada kebutuhan. Untuk dokumen teks atau kode program, <strong className="text-white">lossless</strong> adalah wajib. Untuk media seperti musik dan film, <strong className="text-white">lossy</strong> seringkali merupakan kompromi yang baik antara ukuran dan kualitas.
            </p>
        </div>
    );
}