import { useRef, useEffect, useState } from 'react';

interface DoodleCanvasProps {
  onClose: () => void;
}

const COLORS = ['#ef4444', '#f59e0b', '#00d4ff', '#10b981', '#ffffff'];

export default function DoodleCanvas({ onClose }: DoodleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[0]);
  const lineWidth = 4;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth * 2; // Use 2x resolution for retina displays
      canvas.height = window.innerHeight * 2;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const context = canvas.getContext('2d');
      if (context) {
        context.scale(2, 2);
        context.lineCap = 'round';
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        contextRef.current = context;
      }
    };

    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);

    return () => window.removeEventListener('resize', setCanvasDimensions);
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
    }
  }, [color]);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.lineWidth = lineWidth;
    }
  }, [lineWidth]);

  const getCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if (e.nativeEvent instanceof MouseEvent) {
      return { x: e.nativeEvent.clientX - rect.left, y: e.nativeEvent.clientY - rect.top };
    }
    if (e.nativeEvent instanceof TouchEvent) {
      return { x: e.nativeEvent.touches[0].clientX - rect.left, y: e.nativeEvent.touches[0].clientY - rect.top };
    }
    return { x: 0, y: 0 };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const context = contextRef.current;
    if (!context) return;
    const { x, y } = getCoords(e);
    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
  };

  const stopDrawing = () => {
    contextRef.current?.closePath();
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !contextRef.current) return;
    const { x, y } = getCoords(e);
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="fixed inset-0 z-50 cursor-crosshair">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        onTouchStart={startDrawing}
        onTouchEnd={stopDrawing}
        onTouchMove={draw}
        onMouseLeave={stopDrawing}
      />
      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#0d1525] border border-[rgba(0,212,255,0.2)] rounded-xl p-2 flex items-center gap-2 shadow-2xl">
        {COLORS.map(c => (
          <button key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-lg transition-transform ${color === c ? 'scale-110 ring-2 ring-offset-2 ring-offset-[#0d1525] ring-[#00d4ff]' : ''}`} style={{ backgroundColor: c }} />
        ))}
        <div className="w-px h-8 bg-[rgba(255,255,255,0.1)] mx-2" />
        <button onClick={clearCanvas} className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.05)] text-lg">🗑️</button>
        <button onClick={onClose} className="w-10 h-10 rounded-lg bg-red-500/20 text-lg border border-red-500/30">✕</button>
      </div>
    </div>
  );
}
