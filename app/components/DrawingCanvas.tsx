"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

const COLORS = [
  "#000000", "#ef4444", "#3b82f6", "#22c55e",
  "#eab308", "#f97316", "#a855f7", "#ffffff",
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
  const [color, setColor] = useState("#000000");
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
        className="border-2 border-gray-300 rounded-lg bg-white cursor-crosshair w-full max-w-[400px]"
        style={{ touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />

      {/* Color palette */}
      <div className="flex gap-2 mt-3 flex-wrap justify-center">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => { setColor(c); setIsEraser(false); }}
            className={`w-8 h-8 rounded-full border-2 transition-transform ${
              color === c && !isEraser ? "border-indigo-500 scale-110" : "border-gray-300"
            }`}
            style={{ backgroundColor: c }}
            aria-label={`Color ${c}`}
          />
        ))}
      </div>

      {/* Tools row */}
      <div className="flex gap-3 mt-3 items-center flex-wrap justify-center">
        {/* Brush sizes */}
        {BRUSH_SIZES.map((b) => (
          <button
            key={b.label}
            onClick={() => setBrushSize(b.size)}
            className={`px-3 py-1 rounded text-sm font-bold transition-colors ${
              brushSize === b.size
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {b.label}
          </button>
        ))}

        <div className="w-px h-6 bg-gray-300" />

        {/* Eraser */}
        <button
          onClick={() => setIsEraser(!isEraser)}
          className={`px-3 py-1 rounded text-sm font-bold transition-colors ${
            isEraser
              ? "bg-pink-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Eraser
        </button>

        {/* Clear */}
        <button
          onClick={handleClear}
          className="px-3 py-1 rounded text-sm font-bold bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="mt-4 bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-6 rounded transition duration-300 ease-in-out"
      >
        Submit Drawing
      </button>
    </div>
  );
};

export default DrawingCanvas;
