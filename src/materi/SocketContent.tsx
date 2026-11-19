import ImagePlaceholder from '../components/ImagePlaceholder';

const SectionTitle = ({ number, title }: { number: number, title: string }) => (
    <h2 className="font-display text-xl font-bold text-[#00d4ff] mb-4 border-t border-[rgba(0,212,255,0.1)] pt-8 mt-8">
        <span className="text-base text-[#4a5568] mr-2">{number}.</span>{title}
    </h2>
);

const SocketCard = ({ name, desc, children }: { name: string, desc: string, children?: React.ReactNode }) => (
    <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
        <h4 className="font-bold text-white mb-1">{name}</h4>
        <p className="text-xs text-[#b0c4de]">{desc}</p>
        {children && <div className="mt-3">{children}</div>}
    </div>
);

export default function SocketContent() {
    return (
        <div className="space-y-4 text-[#b0c4de] leading-relaxed text-sm">
            <p>
                Socket, port, dan slot adalah "titik temu" di motherboard yang memungkinkan berbagai komponen perangkat keras untuk terhubung dan berkomunikasi satu sama lain. Memahami jenis-jenisnya adalah kunci untuk merakit dan melakukan upgrade PC.
            </p>

            <SectionTitle number={1} title="Socket Prosesor (CPU)" />
            <p>
                Ini adalah dudukan tempat CPU dipasang. Setiap jenis socket dirancang untuk seri prosesor tertentu dan tidak kompatibel satu sama lain. Ada dua tipe utama:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
                <SocketCard name="LGA (Land Grid Array)" desc="Digunakan oleh Intel. Pin-pin rapuh berada di socket motherboard, sementara bagian bawah CPU datar dengan titik kontak." />
                <SocketCard name="PGA (Pin Grid Array)" desc="Digunakan oleh AMD (sebelum seri AM5). Pin-pin berada di CPU itu sendiri dan dimasukkan ke dalam lubang-lubang di socket." />
            </div>
            <ImagePlaceholder
                src={["https://www.pcworld.com/wp-content/uploads/2023/03/DSCF0394.jpg?quality=50&strip=all", "https://i.ytimg.com/vi/mzoi9p_I2-4/maxresdefault.jpg"]}
                alt="Socket CPU LGA dan PGA"
                caption="Perbandingan socket LGA Intel (kiri) dan PGA AMD (kanan)."
            />

            <SectionTitle number={2} title="Slot Memori (RAM)" />
            <p>
                Slot panjang tempat modul RAM dipasang. Jenis slot harus sesuai dengan generasi RAM (misalnya, DDR4 atau DDR5).
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
                <SocketCard name="DIMM (Dual In-line Memory Module)" desc="Slot RAM standar untuk komputer desktop." />
                <SocketCard name="SO-DIMM (Small Outline DIMM)" desc="Versi yang lebih kecil dari DIMM, digunakan untuk laptop dan PC berukuran mini." />
            </div>
            <ImagePlaceholder
                src={["https://www.crucial.com/content/dam/crucial/dram-products/ddr5-pro-memory/images/crucial-ddr5-pro-dimm-installed-on-motherboard.tif.transform/small-png/image.png", "https://www.crucial.com/content/dam/crucial/dram-products/ddr5-memory-for-laptops/images/crucial-ddr5-sodimm-installed-in-laptop.tif.transform/small-png/image.png"]}
                alt="Slot RAM DIMM dan SO-DIMM"
                caption="Slot DIMM pada PC desktop (kiri) dan SO-DIMM pada laptop (kanan)."
            />

            <SectionTitle number={3} title="Slot Ekspansi (Expansion Slots)" />
            <p>
                Slot ini digunakan untuk menambahkan fungsionalitas ke PC dengan memasang kartu ekspansi seperti kartu grafis, kartu suara, atau kartu jaringan.
            </p>
            <div className="space-y-4 mt-4">
                <SocketCard name="PCIe (Peripheral Component Interconnect Express)" desc="Standar modern yang sangat cepat. Memiliki berbagai ukuran (x16, x8, x4, x1). Slot x16 biasanya untuk kartu grafis, sementara x1 untuk kartu yang lebih kecil seperti Wi-Fi adapter." />
                <SocketCard name="PCI (Peripheral Component Interconnect)" desc="Standar lama yang lebih lambat. Jarang ditemukan di motherboard modern, tetapi mungkin masih ada untuk kompatibilitas dengan perangkat lama." />
                <SocketCard name="AGP (Accelerated Graphics Port)" desc="Slot khusus untuk kartu grafis yang sudah usang, populer sebelum era PCIe." />
            </div>
            <ImagePlaceholder
                src="https://www.howtogeek.com/wp-content/uploads/2016/07/img_5796a3e294128.jpg"
                alt="Berbagai Slot PCIe"
                caption="Berbagai ukuran slot PCIe pada motherboard."
            />

            <SectionTitle number={4} title="Konektor Penyimpanan (Storage)" />
            <p>
                Port ini menghubungkan motherboard dengan perangkat penyimpanan seperti HDD, SSD, atau drive optik.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
                <SocketCard name="SATA (Serial ATA)" desc="Konektor standar modern untuk HDD dan SSD 2.5 inci. Terdiri dari port data (kecil) dan port daya (besar)." />
                <SocketCard name="M.2" desc="Slot modern yang ringkas, dipasang langsung di motherboard. Mendukung SSD SATA dan SSD NVMe yang jauh lebih cepat." />
                <SocketCard name="IDE / PATA (Parallel ATA)" desc="Konektor lebar dan pipih yang digunakan untuk HDD lama. Sudah sepenuhnya digantikan oleh SATA." />
            </div>
            <ImagePlaceholder
                src={["https://www.crucial.com/content/dam/crucial/ssd-products/p5-plus-ssd/images/crucial-p5-plus-ssd-installed-on-motherboard.tif.transform/small-png/image.png", "https://i.stack.imgur.com/K2r3m.jpg"]}
                alt="Konektor Penyimpanan"
                caption="Slot M.2 untuk SSD NVMe (kiri) dan port SATA untuk SSD/HDD (kanan)."
            />

            <SectionTitle number={5} title="Port Panel I/O (Input/Output)" />
            <p>
                Ini adalah kumpulan port di bagian belakang casing PC yang terhubung langsung ke motherboard, berfungsi untuk menyambungkan perangkat eksternal.
            </p>

            <h3 className="font-bold text-white pt-4">Port Legacy (Lama)</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                <SocketCard name="PS/2" desc="Port bulat berwarna ungu (keyboard) dan hijau (mouse). Sudah digantikan oleh USB." />
                <SocketCard name="Serial (COM)" desc="Port 9-pin untuk perangkat lama seperti modem atau beberapa peralatan industri." />
                <SocketCard name="Parallel (LPT)" desc="Port 25-pin yang lebih lebar, umumnya untuk printer model lama." />
            </div>
            <ImagePlaceholder
                src="https://www.howtogeek.com/wp-content/uploads/2012/11/650x300xmotherboard-ports.jpg.pagespeed.gp+jp+jw+pj+ws+js+rj+rp+rw+ri+cp+md.ic.sfoZtO0qJ3.jpg"
                alt="Port Legacy"
                caption="Contoh port-port legacy seperti PS/2, Serial, dan Parallel."
            />

            <h3 className="font-bold text-white pt-4">Port Display (Tampilan)</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                <SocketCard name="VGA (Video Graphics Array)" desc="Port analog 15-pin berwarna biru. Kualitas gambar paling rendah dan sudah usang." />
                <SocketCard name="DVI (Digital Visual Interface)" desc="Port digital (biasanya putih) yang lebih baik dari VGA. Ada beberapa varian (DVI-D, DVI-I)." />
                <SocketCard name="HDMI (High-Definition Multimedia Interface)" desc="Standar modern yang paling umum, mengirimkan video dan audio digital dalam satu kabel." />
                <SocketCard name="DisplayPort (DP)" desc="Standar modern lain yang populer untuk monitor PC, mendukung refresh rate dan resolusi sangat tinggi." />
            </div>
            <ImagePlaceholder
                src="https://www.cnet.com/a/img/resize/008331378278f5f845763a4321a73f8730335c4c/hub/2021/08/11/7f5c5031-298f-43c3-a773-41007b85567c/video-ports.jpg?auto=webp&fit=crop&height=675&width=1200"
                alt="Port Display"
                caption="Perbandingan port display: DisplayPort, HDMI, DVI, dan VGA."
            />

            <h3 className="font-bold text-white pt-4">Port Data & Periferal Modern</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                <SocketCard name="USB (Universal Serial Bus)" desc="Port paling serbaguna. Ada berbagai versi (2.0, 3.0, 3.1) dan tipe (Type-A yang persegi, Type-C yang oval dan bolak-balik)." />
                <SocketCard name="Ethernet (RJ-45)" desc="Port untuk koneksi jaringan kabel (LAN). Menghubungkan PC ke router atau switch." />
                <SocketCard name="Audio Jacks" desc="Kumpulan port 3.5mm berwarna untuk speaker (hijau), mikrofon (merah muda), dan line-in (biru)." />
                <SocketCard name="eSATA" desc="Varian dari port SATA untuk menghubungkan hard drive eksternal dengan kecepatan setara internal, namun kurang populer dibanding USB 3.0." />
            </div>
            <ImagePlaceholder
                src="https://www.howtogeek.com/wp-content/uploads/2018/07/img_5b57a33a734a6.jpg"
                alt="Port Modern"
                caption="Contoh panel I/O modern dengan berbagai jenis port USB, HDMI, dan Ethernet."
            />

        </div>
    );
}