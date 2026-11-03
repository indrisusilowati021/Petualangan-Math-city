import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Pen, RotateCcw, Trash2 } from 'lucide-react';

export const DetectiveScratchpad: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#fbbf24');
  const [lineWidth, setLineWidth] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set background to dark slate blackboard
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid dots for math note taking
    ctx.fillStyle = '#1e293b';
    for (let x = 20; x < canvas.width; x += 20) {
      for (let y = 20; y < canvas.height; y += 20) {
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.beginPath();
    ctx.moveTo((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.strokeStyle = isEraser ? '#0f172a' : color;
    ctx.lineWidth = isEraser ? 18 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.lineTo((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#1e293b';
    for (let x = 20; x < canvas.width; x += 20) {
      for (let y = 20; y < canvas.height; y += 20) {
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 flex flex-col gap-2">
      {/* Scratchpad toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsEraser(false)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition ${
              !isEraser ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Pen className="w-3.5 h-3.5" /> Pena
          </button>
          <button
            type="button"
            onClick={() => setIsEraser(true)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition ${
              isEraser ? 'bg-rose-500 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Eraser className="w-3.5 h-3.5" /> Penghapus
          </button>
        </div>

        {/* Color Palette */}
        {!isEraser && (
          <div className="flex items-center gap-1.5">
            {['#fbbf24', '#38bdf8', '#34d399', '#f43f5e', '#ffffff'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-5 h-5 rounded-full border-2 transition ${
                  color === c ? 'border-white scale-110 shadow' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: c }}
                title={`Pilih warna ${c}`}
              />
            ))}
          </div>
        )}

        {/* Clear */}
        <button
          type="button"
          onClick={clearCanvas}
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Bersihkan Papan
        </button>
      </div>

      {/* Blackboard Drawing Area */}
      <div className="relative border border-slate-700/80 rounded-lg overflow-hidden touch-none">
        <canvas
          ref={canvasRef}
          width={600}
          height={240}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-44 sm:h-52 cursor-crosshair bg-slate-950 block"
        />
        <div className="absolute bottom-2 right-2 text-[10px] text-slate-500 pointer-events-none select-none">
          Papan Coret-Coret Detektif
        </div>
      </div>
    </div>
  );
};
