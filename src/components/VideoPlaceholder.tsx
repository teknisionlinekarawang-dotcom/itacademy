// import React from 'react';

interface VideoPlaceholderProps {
    thumbnailSrc: string;
    videoSrc: string;
    alt: string;
    caption?: string;
    className?: string;
}

export default function VideoPlaceholder({ thumbnailSrc, videoSrc, alt, caption, className }: VideoPlaceholderProps) {
    const handleClick = () => {
        // Buat URL absolut untuk memastikan file lokal dari folder /public berfungsi.
        const absoluteUrl = videoSrc.startsWith('http') ? videoSrc : `${window.location.origin}${videoSrc}`;
        window.open(absoluteUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <div
            className={`relative my-4 p-2 bg-[#07090f] border border-[rgba(255,255,255,0.04)] rounded-lg flex flex-col items-center cursor-pointer group ${className || ''}`}
            onClick={handleClick}
        >
            <div className="relative w-full flex justify-center items-center" style={{ maxHeight: '200px' }}>
                <img
                    src={thumbnailSrc}
                    alt={alt}
                    className="max-w-full h-auto rounded-md transition-transform duration-200 group-hover:scale-[1.02]"
                    style={{ maxHeight: '200px', objectFit: 'contain' }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors duration-300 rounded-md">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">▶</div>
                </div>
            </div>
            {caption && <p className="mt-2 text-xs text-[#64748b] text-center font-mono">{caption} <span className="text-[#00d4ff] group-hover:underline">(Klik untuk putar)</span></p>}
        </div>
    );
}