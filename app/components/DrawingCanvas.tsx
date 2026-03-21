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
    <div className="flex flex-col items-center w-full font-sans">
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="bauhaus-border bg-white cursor-crosshair w-full max-w-[400px] mb-4"
        style={{ touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />

      {/* Color palette */}
      <div className="flex gap-2 mb-4 flex-wrap justify-center">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => { setColor(c); setIsEraser(false); }}
            className={`w-10 h-10 border-4 transition-transform ${
              color === c && !isEraser ? "border-text-primary scale-110" : "border-transparent hover:border-gray-300"
            }`}
            style={{ backgroundColor: c, borderRadius: 0 }}
            aria-label={`Color ${c}`}
          />
        ))}
      </div>

      {/* Tools row */}
      <div className="flex gap-4 mb-6 items-center flex-wrap justify-center">
        {/* Brush sizes */}
        {BRUSH_SIZES.map((b) => (
          <button
            key={b.label}
            onClick={() => setBrushSize(b.size)}
            className={`px-4 py-2 text-lg font-black uppercase border-4 border-text-primary transition-colors ${
              brushSize === b.size
                ? "bg-text-primary text-background-light"
                : "bg-background-light text-text-primary hover:bg-gray-200"
            }`}
          >
            {b.label}
          </button>
        ))}

        <div className="w-1 h-8 bg-text-primary" />

        {/* Eraser */}
        <button
          onClick={() => setIsEraser(!isEraser)}
          className={`px-4 py-2 text-lg font-black uppercase border-4 border-text-primary transition-colors ${
            isEraser
              ? "bg-text-primary text-background-light"
              : "bg-background-light text-text-primary hover:bg-gray-200"
          }`}
        >
          ERASER
        </button>

        {/* Clear */}
        <button
          onClick={handleClear}
          className="px-4 py-2 text-lg font-black uppercase border-4 border-text-primary bg-primary text-background-light hover:bg-primary-dark transition-colors"
        >
          CLEAR
        </button>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="w-full max-w-[400px] bg-secondary text-background-light py-4 px-6 bauhaus-button text-xl hover:bg-secondary-dark"
      >
        SUBMIT DRAWING
      </button>
    </div>
  );
};

export default DrawingCanvas;
