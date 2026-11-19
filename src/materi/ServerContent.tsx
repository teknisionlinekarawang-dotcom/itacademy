import { Link } from 'react-router-dom';

const SectionTitle = ({ number, title }: { number: number, title: string }) => (
    <h2 className="font-display text-xl font-bold text-[#00d4ff] mb-4 border-t border-[rgba(0,212,255,0.1)] pt-8 mt-8">
        <span className="text-base text-[#4a5568] mr-2">{number}.</span>{title}
    </h2>
);

export default function ServerContent() {
    return (
        <div className="space-y-4 text-[#b0c4de] leading-relaxed text-sm">
            <div className="mb-8">
                <Link to="/dashboard" className="text-cyan-400 hover:underline text-sm">&larr; Kembali ke Dashboard</Link>
            </div>

            {/* TODO: Isi materi Server akan ditambahkan di sini */}
            <div className="p-6 rounded-xl bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.2)] text-center">
                <span className="text-4xl">🖧</span>
                <h2 className="font-display text-xl font-bold text-white mt-3">Materi Pengenalan Server</h2>
                <p className="text-xs text-[#64748b] mt-2">
                    Konten materi sedang disiapkan dan akan segera ditambahkan. Nantikan pembaruan dari tim kami.
                </p>
            </div>

            <SectionTitle number={1} title="Pengantar Server" />
            <p>
                Isi materi pengantar Server akan ditambahkan di sini.
            </p>

            <SectionTitle number={2} title="Jenis-Jenis Server" />
            <p>
                Isi materi jenis-jenis server akan ditambahkan di sini.
            </p>
        </div>
    );
}
