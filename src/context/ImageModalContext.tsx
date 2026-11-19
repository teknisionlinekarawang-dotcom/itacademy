import { createContext, useContext, useState, ReactNode } from 'react';

interface ImageModalContextType {
    isOpen: boolean;
    images: string[];
    alt: string;
    caption?: string;
    startIndex: number;
    openModal: (src: string | string[], alt: string, caption?: string, startIndex?: number) => void;
    closeModal: () => void;
}

const ImageModalContext = createContext<ImageModalContextType | undefined>(undefined);

export const useImageModal = () => {
    const context = useContext(ImageModalContext);
    if (!context) {
        throw new Error('useImageModal must be used within an ImageModalProvider');
    }
    return context;
};

export const ImageModalProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [alt, setAlt] = useState('');
    const [caption, setCaption] = useState<string | undefined>(undefined);
    const [startIndex, setStartIndex] = useState(0);

    const openModal = (src: string | string[], altText: string, cap?: string, start?: number) => {
        setImages(Array.isArray(src) ? src : [src]);
        setAlt(altText);
        setCaption(cap);
        setStartIndex(start ?? 0);
        setIsOpen(true);
    };

    const closeModal = () => setIsOpen(false);

    return (
        <ImageModalContext.Provider value={{ isOpen, images, alt, caption, startIndex, openModal, closeModal }}>
            {children}
        </ImageModalContext.Provider>
    );
};