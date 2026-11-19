import ImagePlaceholder from '../components/ImagePlaceholder';
import CpuGpuSimulator from '../simulator/CpuGpuSimulator';
import { Link } from 'react-router-dom';

const SectionTitle = ({ number, title }: { number: number, title: string }) => (
    <h2 className="font-display text-xl font-bold text-[#00d4ff] mb-4 border-t border-[rgba(0,212,255,0.1)] pt-8 mt-8">
        <span className="text-base text-[#4a5568] mr-2">{number}.</span>{title}
    </h2>
);

export default function GpuContent() {
    return (
        <div className="space-y-4 text-[#b0c4de] leading-relaxed text-sm">
            <div className="mb-8">
                <Link to="/dashboard" className="text-cyan-400 hover:underline text-sm">&larr; Kembali ke Dashboard</Link>
            </div>
            <p>
                GPU (Graphics Processing Unit) atau sering disebut kartu grafis, adalah prosesor khusus yang dirancang untuk mempercepat rendering gambar, video, dan animasi. Awalnya hanya untuk grafis, kini GPU telah berevolusi menjadi mesin komputasi paralel yang sangat kuat untuk berbagai tugas.
            </p>

            <SectionTitle number={1} title="Sejarah Singkat GPU" />
            <p>
                Perjalanan GPU dimulai dari chip sederhana hingga menjadi komponen kompleks yang kita kenal sekarang.
            </p>
            <ul className="list-disc list-inside space-y-2 text-xs">
                <li><strong className="text-white">1970-an - Awal Grafis Komputer:</strong> Komputer awal memiliki kemampuan grafis yang sangat terbatas, seringkali hanya teks atau grafis monokrom sederhana.</li>
                <li><strong className="text-white">1980-an - Kartu Grafis 2D:</strong> Munculnya kartu grafis yang mampu mempercepat tampilan grafis 2D, seperti yang digunakan di komputer IBM PC.</li>
                <li><strong className="text-white">1990-an - Era 3D:</strong> Perkembangan game 3D mendorong kebutuhan akan hardware grafis khusus. Perusahaan seperti 3dfx (dengan Voodoo Graphics) dan NVIDIA (dengan Riva 128) menjadi pionir.</li>
                <li><strong className="text-white">1999 - NVIDIA GeForce 256:</strong> NVIDIA memperkenalkan istilah "GPU" dengan peluncuran GeForce 256, yang mampu melakukan transformasi dan pencahayaan (T&L) secara hardware.</li>
                <li><strong className="text-white">2000-an - Komputasi Paralel:</strong> GPU mulai digunakan tidak hanya untuk grafis, tetapi juga untuk komputasi umum (GPGPU - General-Purpose computing on Graphics Processing Units), terutama dengan munculnya CUDA dari NVIDIA.</li>
                <li><strong className="text-white">2010-an - AI & Machine Learning:</strong> GPU menjadi tulang punggung untuk pelatihan model Kecerdasan Buatan dan Machine Learning karena kemampuannya melakukan banyak perhitungan secara paralel.</li>
            </ul>
            <ImagePlaceholder
                src="https://pintartekno.id/wp-content/uploads/2023/06/sejarah-singkat-graphic-card.jpg"
                alt="Timeline Sejarah GPU"
                caption="Evolusi Graphics Processing Unit dari masa ke masa."
            />

            <SectionTitle number={2} title="Jenis-Jenis GPU" />
            <p>
                Ada dua kategori utama GPU yang digunakan di komputer modern:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">Integrated Graphics (iGPU)</h4>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li><strong className="text-white">Lokasi:</strong> Terintegrasi langsung ke dalam CPU atau motherboard.</li>
                        <li><strong className="text-white">Memori:</strong> Berbagi RAM sistem dengan CPU.</li>
                        <li><strong className="text-white">Kelebihan:</strong> Lebih murah, hemat daya, cocok untuk tugas sehari-hari (browsing, office, video).</li>
                        <li><strong className="text-white">Kekurangan:</strong> Kinerja grafis terbatas, tidak cocok untuk gaming berat atau aplikasi profesional.</li>
                    </ul>
                </div>
                <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                    <h4 className="font-bold text-white mb-2">Dedicated Graphics (dGPU) / Kartu Grafis Diskrit</h4>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li><strong className="text-white">Lokasi:</strong> Komponen terpisah yang dipasang ke slot PCIe di motherboard.</li>
                        <li><strong className="text-white">Memori:</strong> Memiliki memori khusus sendiri (VRAM - Video RAM) yang jauh lebih cepat.</li>
                        <li><strong className="text-white">Kelebihan:</strong> Kinerja grafis superior, ideal untuk gaming, desain 3D, video editing, dan AI/ML.</li>
                        <li><strong className="text-white">Kekurangan:</strong> Lebih mahal, mengonsumsi lebih banyak daya, menghasilkan lebih banyak panas.</li>
                    </ul>
                </div>
            </div>
            <ImagePlaceholder
                src="https://www.cgdirector.com/wp-content/uploads/media/2022/04/Type-of-GPUs-Graphics-Processing-Unit.jpg"
                alt="Perbandingan Integrated dan Dedicated GPU"
                caption="Ilustrasi perbedaan antara GPU terintegrasi dan diskrit."
            />

            <SectionTitle number={3} title="Komponen Kunci GPU" />
            <p>
                GPU modern adalah chip yang sangat kompleks, terdiri dari ribuan hingga jutaan unit pemrosesan.
            </p>
            <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-white">CUDA Cores (NVIDIA) / Stream Processors (AMD):</strong> Ini adalah "otak" GPU, unit pemrosesan paralel yang melakukan perhitungan grafis dan komputasi umum. Semakin banyak, semakin baik kinerja paralelnya.</li>
                <li><strong className="text-white">VRAM (Video RAM):</strong> Memori khusus berkecepatan tinggi yang digunakan GPU untuk menyimpan data grafis (tekstur, buffer frame). Kapasitas dan kecepatan VRAM sangat mempengaruhi kinerja, terutama pada resolusi tinggi.</li>
                <li><strong className="text-white">Memory Bus:</strong> Jalur data yang menghubungkan GPU dengan VRAM-nya. Lebar bus (misal: 256-bit, 384-bit) dan kecepatan memori menentukan bandwidth memori total.</li>
                <li><strong className="text-white">Tensor Cores (NVIDIA):</strong> Unit khusus yang dirancang untuk mempercepat operasi matriks, sangat penting untuk aplikasi AI dan Machine Learning.</li>
            </ul>
            <ImagePlaceholder
                src="https://via.placeholder.com/600x400?text=GPU+Architecture+Diagram"
                alt="Diagram Arsitektur Internal GPU"
                caption="Komponen utama di dalam sebuah GPU modern."
            />

            <SectionTitle number={4} title="Pengaruh GPU pada Kinerja CPU" />
            <p>
                Meskipun CPU dan GPU memiliki tugas yang berbeda, keduanya bekerja sama erat. GPU dapat secara signifikan mempengaruhi kinerja CPU dengan:
            </p>
            <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-white">Offloading Tugas Grafis:</strong> GPU mengambil alih semua perhitungan grafis dari CPU. Tanpa GPU, CPU harus melakukan semua pekerjaan ini sendiri, yang akan sangat memperlambat sistem secara keseluruhan.</li>
                <li><strong className="text-white">Akselerasi Komputasi:</strong> Untuk tugas-tugas yang dapat diparalelkan (seperti simulasi fisika, rendering video, atau pelatihan AI), GPU dapat melakukan perhitungan jauh lebih cepat daripada CPU. Ini membebaskan CPU untuk menangani tugas-tugas serial lainnya.</li>
                <li><strong className="text-white">Bottleneck:</strong> Jika CPU terlalu lambat dibandingkan GPU (atau sebaliknya), salah satu komponen bisa menjadi "bottleneck". Misalnya, CPU yang lambat tidak dapat memberi data ke GPU cukup cepat, sehingga GPU tidak dapat bekerja pada kapasitas penuh.</li>
            </ul>
            
            <h3 className="font-display text-lg font-bold text-white pt-6">Simulasi: CPU vs GPU Rendering</h3>
            <p>Simulator di bawah ini mendemonstrasikan perbedaan fundamental cara kerja CPU dan GPU. CPU, yang dirancang untuk tugas sekuensial, akan merender piksel gambar satu per satu. Sebaliknya, GPU dengan ribuan core-nya akan memproses banyak piksel secara bersamaan (paralel), menghasilkan gambar jauh lebih cepat.</p>
            <CpuGpuSimulator />

            <ImagePlaceholder
                src="https://i.ytimg.com/vi/n_DKEalUO7k/maxresdefault.jpg"
                alt="Interaksi CPU dan GPU"
                caption="Bagaimana CPU dan GPU bekerja sama dalam sebuah sistem komputer."
            />

            <SectionTitle number={5} title="GPU dalam Aplikasi Modern" />
            <p>
                Peran GPU telah meluas jauh melampaui sekadar menampilkan gambar di layar.
            </p>
            <ul className="list-disc list-inside space-y-2">
                <li>
                    <strong className="text-white">Gaming:</strong> Ini adalah aplikasi paling jelas. GPU merender grafis 3D yang kompleks, efek pencahayaan, dan tekstur untuk menciptakan pengalaman bermain game yang imersif.
                </li>
                <li>
                    <strong className="text-white">Desain Grafis & Video Editing:</strong> Software seperti Adobe Photoshop, Premiere Pro, Blender, dan AutoCAD sangat mengandalkan GPU untuk mempercepat rendering, simulasi, dan pratinjau real-time.
                </li>
                <li>
                    <strong className="text-white">Kecerdasan Buatan (AI) & Machine Learning:</strong> Pelatihan model AI, terutama jaringan saraf dalam (deep neural networks), membutuhkan daya komputasi paralel yang masif, yang disediakan secara efisien oleh GPU.
                </li>
                <li>
                    <strong className="text-white">Penelitian Ilmiah & Simulasi:</strong> GPU digunakan dalam bidang seperti fisika komputasi, kimia, biologi, dan keuangan untuk menjalankan simulasi kompleks dan menganalisis data besar.
                </li>
                <li>
                    <strong className="text-white">Cryptocurrency Mining:</strong> Meskipun perannya telah banyak digantikan oleh hardware khusus (ASIC), GPU pernah menjadi raja dalam menambang mata uang kripto seperti Bitcoin dan Ethereum.
                    <ul className="list-circle list-inside ml-4 mt-2 text-xs space-y-1">
                        <li><strong className="text-white">Apa itu Mining?</strong> Proses "menambang" adalah kompetisi untuk memecahkan masalah matematika yang sangat kompleks (perhitungan hash) untuk memvalidasi transaksi dan menambahkannya ke blockchain.</li>
                        <li><strong className="text-white">Kenapa GPU, Bukan CPU?</strong> CPU dirancang untuk tugas-tugas kompleks yang berurutan (serial). Sebaliknya, GPU memiliki ribuan core sederhana yang dirancang untuk melakukan banyak perhitungan sederhana secara bersamaan (paralel). Proses mining yang pada dasarnya adalah "menebak" triliunan kombinasi hash per detik adalah tugas yang sangat paralel, sehingga ribuan core GPU jauh lebih efisien daripada beberapa core CPU yang kuat.</li>
                        <li><strong className="text-white">Fungsi GPU dalam Mining:</strong> Fungsi utama GPU adalah melakukan perhitungan algoritma hash (seperti SHA-256 untuk Bitcoin) secepat mungkin. Kecepatan ini diukur dalam *hashes per second* (H/s). Semakin tinggi *hash rate* sebuah GPU, semakin besar peluangnya untuk menemukan solusi hash yang benar dan mendapatkan imbalan blok.</li>
                    </ul>
                </li>
            </ul>
            <ImagePlaceholder
                src="https://i.ytimg.com/vi/aB44bY_2PqI/maxresdefault.jpg"
                alt="Aplikasi Modern GPU"
                caption="Berbagai bidang di mana GPU memainkan peran krusial."
            />

            <SectionTitle number={6} title="Masa Depan GPU" />
            <p>
                Inovasi di bidang GPU terus berlanjut dengan pesat.
            </p>
            <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-white">Ray Tracing & Path Tracing:</strong> Teknik rendering yang semakin realistis, meniru cara cahaya berinteraksi dengan objek di dunia nyata, membutuhkan GPU yang sangat kuat.</li>
                <li><strong className="text-white">Upscaling AI (DLSS, FSR):</strong> Teknologi seperti NVIDIA DLSS dan AMD FSR menggunakan AI untuk merender game pada resolusi lebih rendah dan kemudian meng-upscale-nya ke resolusi target dengan kualitas mendekati native, meningkatkan performa secara signifikan.</li>
                <li><strong className="text-white">Integrasi Lebih Lanjut:</strong> Batasan antara CPU dan GPU semakin kabur, dengan arsitektur seperti Apple Silicon yang mengintegrasikan CPU, GPU, dan Neural Engine ke dalam satu chip untuk efisiensi yang lebih tinggi.</li>
                <li><strong className="text-white">Komputasi Kuantum:</strong> Meskipun masih dalam tahap awal, GPU mungkin akan memainkan peran dalam akselerasi simulasi komputasi kuantum.</li>
            </ul>
            <ImagePlaceholder
                src="https://via.placeholder.com/600x400?text=Future+of+GPUs"
                alt="Masa Depan GPU"
                caption="Konsep teknologi grafis dan komputasi masa depan."
            />
        </div>
    );
}