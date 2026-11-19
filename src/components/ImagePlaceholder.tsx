import { useImageModal } from '../context/ImageModalContext';
import ReactPlayer from 'react-player';

interface ImagePlaceholderProps {
    src: string | string[];
    alt: string;
    caption?: string;
    className?: string; // For styling the container
    imgClassName?: string; // For styling the img tag
}

// Helper untuk mendeteksi URL video
const isVideo = (url: string) => {
    // ReactPlayer.canPlay(url) adalah cara yang lebih robust,
    // tapi untuk simple case, kita bisa cek ekstensi atau domain umum.
    return (
        url.match(/\.(mp4|webm|ogv)$/) != null ||
        url.includes('youtube.com') ||
        url.includes('youtu.be') ||
        url.includes('vimeo.com')
    );
};

export default function ImagePlaceholder({ src, alt, caption, className, imgClassName }: ImagePlaceholderProps) {
    const { openModal } = useImageModal();
    const displaySrc = Array.isArray(src) ? src[0] : src;
    const isGallery = Array.isArray(src) && src.length > 1;
    const isDisplaySrcVideo = isVideo(displaySrc);

    const handleClick = () => {
        if (isDisplaySrcVideo) {
            // Untuk video, buka URL di tab baru.
            // Buat URL absolut untuk memastikan file lokal berfungsi.
            const absoluteUrl = displaySrc.startsWith('/') ? `${window.location.origin}${displaySrc}` : displaySrc;
            window.open(absoluteUrl, '_blank', 'noopener,noreferrer');
        } else {
            // Untuk gambar, buka modal seperti biasa.
            openModal(src, alt, caption);
        }
    };

    const cursorClass = isDisplaySrcVideo ? 'cursor-pointer' : 'cursor-pointer'; // Tetap pointer untuk keduanya

    return (
        <div
            className={`relative my-4 p-2 bg-[#07090f] border border-[rgba(255,255,255,0.04)] rounded-lg flex flex-col items-center group ${cursorClass} ${className || ''}`}
            onClick={handleClick}
        >
            <div className="relative w-full flex justify-center items-center" style={{ maxHeight: '200px' }}>
                {isDisplaySrcVideo ? (
                    <>
                    <ReactPlayer src={displaySrc.startsWith('/') ? `${window.location.origin}${displaySrc}` : displaySrc} width="100%" height="100%" light style={{ maxHeight: '200px' }} playing={false} />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors duration-300">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
                                ▶
                            </div>
                        </div>
                    </>
                ) : (
                    <img
                        src={displaySrc}
                        alt={alt}
                        className={`max-w-full h-auto rounded-md transition-transform duration-200 group-hover:scale-[1.02] ${imgClassName || ''}`}
                        style={{ maxHeight: '200px', objectFit: 'contain' }}
                    />
                )}
            </div>
            {isGallery && (
                <div className="absolute top-3 right-3 bg-black/50 text-white font-mono text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">
                    🖼️ {src.length}
                </div>
            )}
            {caption && <p className="mt-2 text-xs text-[#64748b] text-center font-mono">{caption} <span className="text-[#00d4ff] group-hover:underline">(Klik untuk perbesar)</span></p>}
            {!caption && <p className="mt-2 text-xs text-[#64748b] text-center font-mono group-hover:underline">Klik untuk perbesar</p>}
        </div>
    );
}
