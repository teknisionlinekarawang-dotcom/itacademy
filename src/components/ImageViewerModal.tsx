import { useEffect } from 'react';
import { useImageModal } from '../context/ImageModalContext';
import ReactPlayer from 'react-player';
import { useLinearCarousel } from '../hooks/useLinearCarousel';

// Helper untuk mendeteksi URL video, konsisten dengan ImagePlaceholder
const isVideo = (url: string) => {
    // Cek ekstensi video atau domain streaming yang umum
    return (
        url.match(/\.(mp4|webm|ogv)$/) != null ||
        url.includes('youtube.com') ||
        url.includes('youtu.be') ||
        url.includes('vimeo.com')
    );
};

// Membuat URL absolut untuk file lokal.
const toAbsolute = (url: string) => (url.startsWith('/') ? `${window.location.origin}${url}` : url);

export default function ImageViewerModal() {
    const { isOpen, closeModal, images, alt, caption, startIndex } = useImageModal();

    const total = images.length;
    const carousel = useLinearCarousel({ total, startIndex: startIndex ?? 0 });
    const { index, dragX, dragging } = carousel;
    const isGallery = total > 1;

    /* ---- Buka pada slide yang diminta pengirim --------------------------- */
    useEffect(() => {
        if (isOpen) {
            carousel.resetIndex(Math.min(startIndex ?? 0, Math.max(total - 1, 0)));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, images, startIndex]);

    /* ---- Kunci scroll body saat modal terbuka ----------------------------- */
    useEffect(() => {
        if (!isOpen) return;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    /* ---- Navigasi keyboard ------------------------------------------------ */
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') carousel.goToNext();
            else if (e.key === 'ArrowLeft') carousel.goToPrevious();
            else if (e.key === 'Escape') closeModal();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, carousel.goToNext, carousel.goToPrevious, closeModal]);

    if (!isOpen) return null;
    if (!images || images.length === 0) return null;

    /* ---- Drag / Swipe handlers (Linear Carousel) -------------------------- */
    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        carousel.beginDrag(e.clientX);
        e.currentTarget.setPointerCapture?.(e.pointerId);
    };
    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (dragging) carousel.moveDrag(e.clientX);
    };
    const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
        carousel.endDrag(e.clientX, e.currentTarget.clientWidth);
    };

    return (
        <div
            className="fixed inset-0 z-[9999] bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={closeModal}
        >
            <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
                <div
                    className="relative w-full bg-[#0d1525]/50 rounded-lg shadow-2xl border border-[rgba(0,212,255,0.1)] overflow-hidden select-none"
                    style={{ touchAction: 'pan-y' }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerEnd}
                    onPointerCancel={handlePointerEnd}
                >
                    {/* Track linier carousel: semua slide sejajar lalu digeser */}
                    <div
                        className="flex"
                        style={{
                            transform: `translateX(calc(${-index * 100}% + ${dragX}px))`,
                            transition: dragging ? 'none' : 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)',
                        }}
                    >
                        {images.map((slideSrc, i) => {
                            const abs = toAbsolute(slideSrc);
                            const active = i === index;
                            if (isVideo(slideSrc)) {
                                return (
                                    <div key={`${slideSrc}-${i}`} className="flex-none w-full aspect-video flex items-center justify-center bg-black">
                                        {active ? (
                                            <ReactPlayer
                                                src={abs}
                                                playing={false}
                                                config={{ html: { attributes: { playsInline: true } } }}
                                                onError={e => console.error('ReactPlayer Error:', e)}
                                                onReady={() => console.log('ReactPlayer Ready:', abs)}
                                                controls
                                                width="100%"
                                                height="100%"
                                            />
                                        ) : (
                                            <span className="font-mono text-xs text-[#4a5568]">🎬 Video {i + 1}</span>
                                        )}
                                    </div>
                                );
                            }
                            return (
                                <img
                                    key={`${slideSrc}-${i}`}
                                    src={abs}
                                    alt={`${alt} - ${i + 1}/${images.length}`}
                                    draggable={false}
                                    loading={active ? undefined : 'lazy'}
                                    className="flex-none w-full max-h-[70vh] object-contain"
                                />
                            );
                        })}
                    </div>

                    {/* Hint saat sedang diseret */}
                    {dragging && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                            <span className="font-mono text-xs text-white bg-black/50 px-3 py-1.5 rounded-full">
                                {dragX < 0 ? '◀' : '▶'}
                            </span>
                        </div>
                    )}
                </div>
                
                {/* Close Button */}
                <button onClick={closeModal} className="absolute -top-3 -right-3 z-20 w-8 h-8 rounded-full bg-[#0d1525] text-white border border-[rgba(0,212,255,0.2)] hover:bg-[#00d4ff] hover:text-black transition-all" aria-label="Close">✕</button>

                {/* Navigation Arrows */}
                {isGallery && (
                    <>
                        <button onClick={() => carousel.goToPrevious()} className="absolute top-1/2 -left-5 transform -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
                            &#10094;
                        </button>
                        <button onClick={() => carousel.goToNext()} className="absolute top-1/2 -right-5 transform -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
                            &#10095;
                        </button>
                    </>
                )}

                {/* Caption and Counter */}
                <div className="absolute bottom-0 left-0 right-0 p-3 text-center space-y-2">
                    {caption && (
                        <div className="bg-black/70 p-2 rounded-md text-white text-sm font-mono inline-block">
                            {caption}
                        </div>
                    )}
                    {isGallery && ( // images is guaranteed to be an array here
                        <div className="flex justify-center">
                            <div className="bg-black/70 px-3 py-1 rounded-full text-white text-xs font-mono">
                                {index + 1} / {images.length}
                            </div>
                        </div>
                    )}
                </div>

                {/* Old caption position (for reference, now combined above) */}
                {/* {imgCaption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-3 text-white text-sm text-center font-mono">
                        {imgCaption}
                    </div>
                )} */}
            </div>
        </div>
    );
}
