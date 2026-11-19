import { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 20; // 20x20 grid
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

// Helper to create a shuffled array of indices for a more "random" parallel look
const createShuffledIndices = () => {
    const indices = Array.from({ length: TOTAL_CELLS }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
};

const CpuGpuSimulator = () => {
    const [cells, setCells] = useState(() => Array(TOTAL_CELLS).fill(true));
    const [mode, setMode] = useState<'idle' | 'cpu' | 'gpu'>('idle');
    const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);

    const resetGrid = useCallback(() => {
        setCells(Array(TOTAL_CELLS).fill(true));
        setShuffledIndices(createShuffledIndices());
    }, []);

    useEffect(() => {
        resetGrid(); // Initial setup
    }, [resetGrid]);

    useEffect(() => {
        let timers: NodeJS.Timeout[] = [];

        if (mode === 'cpu') {
            let i = 0;
            const interval = setInterval(() => {
                if (i < TOTAL_CELLS) {
                    setCells(prev => {
                        const newCells = [...prev];
                        newCells[i] = false;
                        return newCells;
                    });
                    i++;
                } else {
                    clearInterval(interval);
                    setTimeout(() => setMode('idle'), 1000);
                }
            }, 10); // Sequential reveal, 10ms per cell
            timers.push(interval);
        } else if (mode === 'gpu') {
            shuffledIndices.forEach((cellIndex) => {
                const timer = setTimeout(() => {
                    setCells(prev => {
                        const newCells = [...prev];
                        newCells[cellIndex] = false;
                        return newCells;
                    });
                }, Math.random() * 200); // Reveal cells "almost" at the same time with slight random delay
                timers.push(timer);
            });
            const finalTimer = setTimeout(() => setMode('idle'), 1000);
            timers.push(finalTimer);
        }

        return () => {
            timers.forEach(clearTimeout);
        };
    }, [mode, shuffledIndices]);

    const startSimulation = (simMode: 'cpu' | 'gpu') => {
        if (mode !== 'idle') return;
        resetGrid();
        // A short delay to ensure the grid is reset visually before starting animation
        setTimeout(() => setMode(simMode), 50);
    };

    return (
        <div className="p-4 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.08)] my-4">
            <div className="relative w-full aspect-video overflow-hidden rounded-md border border-black">
                <img
                    src="/media/simulator/cp-hd.jpg"
                    alt="Cyberpunk City"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
                    {cells.map((isVisible, index) => (
                        <div
                            key={index}
                            className="bg-[#0d1525] border border-black/20 transition-opacity duration-300"
                            style={{ opacity: isVisible ? 1 : 0 }}
                        />
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <button onClick={() => startSimulation('cpu')} disabled={mode !== 'idle'} className="font-mono text-xs px-4 py-2 rounded-lg bg-blue-500 text-white font-bold disabled:bg-gray-600 disabled:text-gray-400 hover:bg-blue-600 transition-colors">
                    {mode === 'cpu' ? 'CPU Merender (Serial)...' : 'Mulai Render dengan CPU'}
                </button>
                <button onClick={() => startSimulation('gpu')} disabled={mode !== 'idle'} className="font-mono text-xs px-4 py-2 rounded-lg bg-green-500 text-white font-bold disabled:bg-gray-600 disabled:text-gray-400 hover:bg-green-600 transition-colors">
                    {mode === 'gpu' ? 'GPU Merender (Paralel)...' : 'Mulai Render dengan GPU'}
                </button>
            </div>
            <p className="text-center font-mono text-[10px] text-[#4a5568] mt-2">
                Perhatikan bagaimana CPU merender gambar secara berurutan (lambat), sementara GPU merendernya secara paralel (hampir serentak).
            </p>
        </div>
    );
};

export default CpuGpuSimulator;