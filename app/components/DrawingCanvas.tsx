"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

const COLORS = [
  "#FFFFFF", "#FF3A3A", "#3A7DFF", "#22C55E",
  "#FFD600", "#F97316", "#A855F7", "#0B0B13",
];

const BRUSH_SIZES = [
  { label: "S", size: 3 },
  { label: "M", size: 8 },
  { label: "L", size: 16 },
];

const DrawingCanvas: React.FC<{
  onSubmit: (dataUrl: string) => void;
}> = ({ onSubmit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState("#0B0B13");
  const [brushSize, setBrushSize] = useState(8);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getCanvasPos = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    isDrawing.current = true;
    lastPos.current = getCanvasPos(e);
  }, [getCanvasPos]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !lastPos.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    const pos = getCanvasPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = isEraser ? "#ffffff" : color;
    ctx.lineWidth = isEraser ? brushSize * 2 : brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
  }, [color, brushSize, isEraser, getCanvasPos]);

  const handlePointerUp = useCallback(() => {
    isDrawing.current = false;
    lastPos.current = null;
  }, []);

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSubmit = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSubmit(canvas.toDataURL("image/png"));
  };

  return (
    <div className="flex flex-col items-center w-full">
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="rounded-2xl border border-gray-200/60 bg-white cursor-crosshair w-full max-w-100 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
        style={{ touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />

      {/* Color palette — round swatches */}
      <div className="flex gap-2 mt-4 flex-wrap justify-center">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => { setColor(c); setIsEraser(false); }}
            className={`w-8 h-8 rounded-full border-2 transition-all duration-150 ${
              color === c && !isEraser ? "border-gray-900 scale-110 ring-2 ring-gray-900/20" : "border-gray-200"
            }`}
            style={{ backgroundColor: c }}
            aria-label={`Color ${c}`}
          />
        ))}
      </div>

      {/* Tools row */}
      <div className="flex gap-1.5 mt-3 items-center flex-wrap justify-center">
        {BRUSH_SIZES.map((b) => (
          <button
            key={b.label}
            onClick={() => setBrushSize(b.size)}
            className={`h-9 px-4 rounded-full text-xs font-medium tracking-wide transition-all active:scale-[0.97] cursor-pointer ${
              brushSize === b.size
                ? "bg-gray-900 text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
                : "bg-white/70 text-gray-600 border border-gray-200 hover:bg-white"
            }`}
          >
            {b.label}
          </button>
        ))}

        <div className="w-px h-6 bg-gray-200 mx-1" />

        <button
          onClick={() => setIsEraser(!isEraser)}
          className={`h-9 px-4 rounded-full text-xs font-medium tracking-wide transition-all active:scale-[0.97] cursor-pointer ${
            isEraser
              ? "bg-gray-900 text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
              : "bg-white/70 text-gray-600 border border-gray-200 hover:bg-white"
          }`}
        >
          Eraser
        </button>

        <button
          onClick={handleClear}
          className="h-9 px-4 rounded-full text-xs font-medium tracking-wide border border-red-300 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-[0.97] cursor-pointer"
        >
          Clear
        </button>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="mt-4 w-full max-w-100 py-3.5 rounded-full bg-gray-900 text-white text-sm font-medium tracking-wide shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:bg-gray-800 hover:shadow-[0_6px_24px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer"
      >
        submit drawing
      </button>
    </div>
  );
};

export default DrawingCanvas;
