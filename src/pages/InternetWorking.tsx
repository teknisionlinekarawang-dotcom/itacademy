import { Link } from 'react-router-dom';
import InternetSimulator from '../simulator/InternetSimulator';

const SectionTitle = ({ number, title }: { number: number, title: string }) => (
    <h2 className="font-display text-xl font-bold text-[#00d4ff] mb-4 border-t border-[rgba(0,212,255,0.1)] pt-6">
        <span className="text-base text-[#4a5568] mr-2">{number}.</span>{title}
    </h2>
);

const InfoCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
        <div className="flex items-center gap-3 mb-3">
            {icon}
            <h4 className="font-bold text-white">{title}</h4>
        </div>
        <div className="text-xs leading-relaxed">{children}</div>
    </div>
);

const StepBlock = ({ number, title, children }: { number: number, title: string, children: React.ReactNode }) => (
    <li className="flex items-start gap-3">
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)] flex items-center justify-center font-mono text-xs text-[#00d4ff]">
            {number}
        </div>
        <div>
            <h4 className="font-bold text-white mb-1">{title}</h4>
            <p className="text-xs leading-relaxed">{children}</p>
        </div>
    </li>
);

const Code = ({ children }: { children: React.ReactNode }) => (
    <code className="font-mono bg-[#1a2535] px-1.5 py-0.5 rounded-md text-[#f59e0b] text-sm">{children}</code>
);

export default function InternetWorking() {
    return (
        <div className="min-h-screen grid-bg p-6 lg:p-8 text-white">
            <div className="max-w-7xl mx-auto">
                {/* Header Materi */}
                <div className="mb-8">
                    <Link to="/module/topology" className="text-[#00d4ff] hover:underline text-sm inline-block mb-4">
                        &larr; Kembali ke Topologi Jaringan
                    </Link>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">🌐</span>
                        <h1 className="font-display text-2xl lg:text-3xl font-bold text-white">
                            Bagaimana Internet Bekerja? (Di Balik Layar Klik "Send")
                        </h1>
                    </div>
                    <p className="text-[#94a3b8] text-base lg:text-lg max-w-3xl">
                        Apa yang sebenarnya terjadi di balik layar saat kita membuka sebuah website atau menekan tombol "Send"? Mari kita bongkar proses yang berlangsung dalam hitungan detik.
                    </p>
                </div>

                {/* Konten Materi */}
                <div className="bg-[#0d1525]/50 border border-[rgba(0,212,255,0.1)] rounded-xl p-6 lg:p-8">
                    <div className="space-y-6 text-[#b0c4de] leading-relaxed text-sm">
<SectionTitle number={1} title="Pengantar: Apa Itu Internet Sebenarnya?" />
                        <p>
                            <strong className="text-white">Definisi:</strong> Kata "Internet" adalah singkatan dari <strong className="text-white">Interconnected Network</strong>, yaitu jaringan yang saling terhubung.
                        </p>
                        <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                            <h4 className="font-bold text-white mb-2">Analogi Jaringan</h4>
                            <p className="text-xs">
                                Internet bukanlah "awan ajaib" di langit (cloud), melainkan <strong className="text-white">jutaan komputer dan kabel di seluruh dunia yang saling terhubung</strong>. Data tidak melayang di udara — data selalu berpindah melalui kabel dan router yang nyata.
                            </p>
                        </div>
                        <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                            <h4 className="font-bold text-white mb-2">Analogi Sederhana</h4>
                            <p className="text-xs">
                                Bayangkan internet seperti <strong className="text-white">jaringan jalan raya global</strong>. Komputer, HP, dan server di seluruh dunia adalah rumah-rumahnya, sedangkan kabel dan router adalah jalan raya dan papan penunjuk jalannya. Tanpa jalan raya, data tidak tahu harus pergi ke mana.
                            </p>
                        </div>
<SectionTitle number={2} title="Komponen Utama Internet" />
                        <p>
                            Untuk bisa saling berkomunikasi, internet membutuhkan <strong className="text-white">4 komponen utama</strong> berikut ini:
                        </p>
                        <div className="grid md:grid-cols-2 gap-6">
                            <InfoCard icon={<span className="text-2xl">📱</span>} title="Klien (Client)">
                                Perangkat yang kita gunakan untuk <strong className="text-white">meminta informasi</strong>. Contoh: HP, Laptop.
                            </InfoCard>
                            <InfoCard icon={<span className="text-2xl">🖥️</span>} title="Server">
                                Komputer raksasa yang menyala 24 jam untuk <strong className="text-white">menyimpan data</strong>. Contoh: Server YouTube, Instagram, Mobile Legends.
                            </InfoCard>
                            <InfoCard icon={<span className="text-2xl">🔢</span>} title="Alamat IP (IP Address)">
                                "Alamat rumah" unik milik <strong className="text-white">setiap perangkat</strong> agar data tidak salah kirim.
                            </InfoCard>
                            <InfoCard icon={<span className="text-2xl">📡</span>} title="ISP (Internet Service Provider)">
                                Perusahaan yang <strong className="text-white">menyediakan akses ke jalan raya internet</strong>. Contoh: IndiHome, Telkomsel, XL, Biznet.
                            </InfoCard>
                        </div>
<SectionTitle number={3} title="Proses Langkah Demi Langkah: Saat Kita Membuka Website" />
                        <p>
                            Bagaimana sebuah foto di Instagram bisa muncul di layar HP kita dalam waktu kurang dari 1 detik? Berikut prosesnya langkah demi langkah:
                        </p>
                        <ol className="space-y-5">
                            <StepBlock number={1} title="Mengetik Alamat (Request)">
                                Siswa mengetik <Code>https://google.com</Code> di browser. Komputer tidak paham huruf — komputer hanya paham angka (<strong className="text-white">IP Address</strong>).
                            </StepBlock>
                            <StepBlock number={2} title='Bertanya ke "Buku Telepon" Internet (DNS)'>
                                Browser akan bertanya ke <strong className="text-white">DNS (Domain Name System)</strong>, yaitu "buku telepon" internet. DNS mengubah nama <Code>google.com</Code> menjadi koordinat angka, misalnya <Code>172.217.0.46</Code>.
                            </StepBlock>
                            <StepBlock number={3} title='Memotong Data Menjadi "Paket" Kecil'>
                                Data yang dikirim (foto/video) terlalu besar jika dikirim utuh. Internet <strong className="text-white">memotongnya menjadi jutaan potongan kecil</strong> bernama <strong className="text-white">Paket Data</strong>.
                            </StepBlock>
                            <StepBlock number={4} title="Perjalanan Lewat Kabel Bawah Laut">
                                Paket data dikirim dari HP, melewati router rumah, ke tiang ISP, lalu masuk ke <strong className="text-white">kabel serat optik (fiber optic) raksasa di dasar samudra</strong> untuk menuju server tujuan (misalnya di Amerika).
                            </StepBlock>
                            <StepBlock number={5} title="Dirakit Kembali di Tujuan">
                                Setelah paket-paket sampai di server tujuan, paket tersebut <strong className="text-white">dirakit kembali menjadi data utuh</strong>. Server lalu mengirimkan balasan data (misalnya halaman web Google) dengan cara dipotong-potong lagi menjadi paket hingga sampai ke HP kita.
                            </StepBlock>
                        </ol>
<SectionTitle number={4} title='Protokol: "Aturan Lalu Lintas" Internet' />
                        <p>
                            Agar semua komputer di dunia yang berbeda merk bisa saling terhubung, mereka harus menggunakan bahasa atau aturan yang sama, yang dinamakan <strong className="text-white">Protokol</strong>.
                        </p>
                        <div className="grid md:grid-cols-2 gap-6">
                            <InfoCard icon={<span className="text-2xl">📦</span>} title="TCP/IP">
                                Petugas yang bertugas <strong className="text-white">memotong data jadi paket</strong>, memberi nomor urut, dan memastikan <strong className="text-white">tidak ada paket yang hilang</strong> di jalan.
                            </InfoCard>
                            <InfoCard icon={<span className="text-2xl">🔒</span>} title="HTTP / HTTPS">
                                Aturan main untuk <strong className="text-white">memindahkan halaman web</strong>. Huruf 'S' berarti <strong className="text-white">Secure / Aman</strong> karena datanya dikunci (di-enkripsi).
                            </InfoCard>
                        </div>

                    </div>
                </div>

                {/* ===== Final Section: Simulator Interaktif Perjalanan Paket Data ===== */}
                <InternetSimulator />
            </div>
        </div>
    );
}