import React, { useEffect, useRef } from "react";

const quips: string[] = [
  "Why so serious?",
  "May the quips be with you",
  "To quip, or not to quip",
  "I'll be quip",
  "Quip happens",
  "Quip while you're ahead",
  "Get your quip together",
  "Quip on truckin'",
  "Quip it real",
  "Quip me if you can",
  "Stay calm and quip on",
  "Quip like nobody's watching",
  "Too legit to quip",
  "Seize the quip",
  "Quip, quip hooray",
];

const colors = ["#E32636", "#00509E", "#FFD700"];
const shapes = ["square", "circle", "triangle"];

class Shape {
  x: number;
  y: number;
  size: number;
  speed: number;
  quip: string;
  color: string;
  shapeType: string;
  rotation: number;
  rotationSpeed: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 80 + 40;
    this.speed = Math.random() * 2 + 0.5;
    this.quip = quips[Math.floor(Math.random() * quips.length)];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.shapeType = shapes[Math.floor(Math.random() * shapes.length)];
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    ctx.fillStyle = this.color;
    ctx.strokeStyle = "#1A1A1A";
    ctx.lineWidth = 4;

    ctx.beginPath();
    if (this.shapeType === "square") {
      ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
    } else if (this.shapeType === "circle") {
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
    } else if (this.shapeType === "triangle") {
      ctx.moveTo(0, -this.size / 2);
      ctx.lineTo(this.size / 2, this.size / 2);
      ctx.lineTo(-this.size / 2, this.size / 2);
      ctx.closePath();
    }
    ctx.fill();
    ctx.stroke();

    ctx.restore();

    ctx.font = `bold ${this.size / 5}px Arial`;
    ctx.fillStyle = "#1A1A1A";
    ctx.textAlign = "center";
    ctx.fillText(this.quip.toUpperCase(), this.x, this.y + this.size / 2 + 20);
  }

  update(canvasHeight: number) {
    this.y -= this.speed;
    this.rotation += this.rotationSpeed;

    if (this.y + this.size < -50) {
      this.y = canvasHeight + this.size + 50;
    }
  }
}

const FloatingQuipsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();

    const shapesArr: Shape[] = [];
    for (let i = 0; i < 15; i++) {
      shapesArr.push(new Shape(canvas.width, canvas.height));
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      shapesArr.forEach((shape) => {
        shape.update(canvas.height);
        shape.draw(ctx);
      });
      requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", setCanvasSize);

    return () => {
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        opacity: 0.5,
      }}
    />
  );
};

export default FloatingQuipsBackground;
