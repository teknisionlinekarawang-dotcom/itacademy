import { useCallback, useRef, useState } from 'react';

/* =====================================================================
   useLinearCarousel
   ---------------------------------------------------------------------
   Shared hook implementing a "Linear Swipe Carousel" for both the
   gallery preview (ImagePlaceholder) and the full-screen modal
   (ImageViewerModal).

   Builds a horizontal, single-track carousel where slides are placed
   side-by-side and translated via `transform: translateX(
   calc(-index * 100% + dragXpx))`.

   Features:
   - Wrap-around navigation (next/prev cycles edges).
   - Pointer-based swipe (mouse + touch) with live drag following and a
     20% width snap threshold on release.
   - `movedRef` flag so click handlers can distinguish "tap" from "swipe".
   ===================================================================== */
export interface UseLinearCarouselOptions {
    total: number;
    startIndex?: number;
}

export function useLinearCarousel({ total, startIndex = 0 }: UseLinearCarouselOptions) {
    const safeTotal = Math.max(total, 1);

    const [index, setIndex] = useState(() => Math.min(Math.max(startIndex, 0), Math.max(safeTotal - 1, 0)));
    const [dragX, setDragX] = useState(0); // deltaX in px while dragging
    const [dragging, setDragging] = useState(false);

    const dragStartRef = useRef(0);
    const draggingRef = useRef(false);
    /** True once a drag actually moved beyond ~6px (muted for tap). */
    const movedRef = useRef(false);

    /** Jump to an absolute index (wrapped). */
    const goTo = useCallback(
        (next: number) => {
            setIndex(((next % safeTotal) + safeTotal) % safeTotal);
        },
        [safeTotal]
    );

    const goToNext = useCallback(() => goTo(index + 1), [goTo, index]);
    const goToPrevious = useCallback(() => goTo(index - 1), [goTo, index]);

    /** Reset to an absolute index without wrapping (used when a modal opens). */
    const resetIndex = useCallback(
        (next: number) => {
            setIndex(Math.min(Math.max(next, 0), safeTotal - 1));
        },
        [safeTotal]
    );

    /* ---- Drag handlers -------------------------------------------------- */
    const beginDrag = useCallback((clientX: number) => {
        draggingRef.current = true;
        movedRef.current = false;
        dragStartRef.current = clientX;
        setDragX(0);
        setDragging(true);
    }, []);

    const moveDrag = useCallback((clientX: number) => {
        if (!draggingRef.current) return;
        const dx = clientX - dragStartRef.current;
        if (Math.abs(dx) > 6) movedRef.current = true;
        setDragX(dx);
    }, []);

    const endDrag = useCallback(
        (clientX: number, viewportWidth: number) => {
            if (!draggingRef.current) return { changed: false, moved: false };
            draggingRef.current = false;

            const dx = clientX - dragStartRef.current;
            const threshold = (viewportWidth || 300) * 0.2;
            let changed = false;
            if (dx < -threshold) {
                goToNext();
                changed = true;
            } else if (dx > threshold) {
                goToPrevious();
                changed = true;
            }

            setDragging(false);
            setDragX(0);
            return { changed, moved: movedRef.current };
        },
        [goToNext, goToPrevious]
    );

    const cancelDrag = useCallback(() => {
        draggingRef.current = false;
        setDragging(false);
        setDragX(0);
    }, []);

    return {
        index,
        resetIndex,
        dragX,
        dragging,
        movedRef,
        goToNext,
        goToPrevious,
        beginDrag,
        moveDrag,
        endDrag,
        cancelDrag,
    };
}