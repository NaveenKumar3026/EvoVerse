import { useEffect, useRef } from "react";

export default function NebulaBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize stars
    const starCount = 100;
    const stars: Array<{ x: number; y: number; size: number; speed: number; opacity: number; dir: number }> = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.05 + 0.01,
        opacity: Math.random(),
        dir: Math.random() > 0.5 ? 1 : -1,
      });
    }

    // Nebula cloud coordinates
    let nebulaX = canvas.width / 2;
    let nebulaY = canvas.height / 2;
    let angle = 0;

    const draw = () => {
      ctx.fillStyle = "rgba(6, 10, 24, 0.2)"; // Deep space fade
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Nebula Gas Clouds
      angle += 0.0002;
      nebulaX = canvas.width / 2 + Math.cos(angle) * 100;
      nebulaY = canvas.height / 2 + Math.sin(angle) * 50;

      const gradient = ctx.createRadialGradient(
        nebulaX, nebulaY, 10,
        nebulaX, nebulaY, Math.max(canvas.width, canvas.height) * 0.6
      );
      gradient.addColorStop(0, "rgba(56, 189, 248, 0.08)"); // Cyan/Sky blue
      gradient.addColorStop(0.3, "rgba(139, 92, 246, 0.05)"); // Purple
      gradient.addColorStop(0.6, "rgba(236, 72, 153, 0.02)"); // Pink
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw Twinkling Starfield
      for (let i = 0; i < starCount; i++) {
        const star = stars[i]!;
        
        // Move stars down slowly
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }

        // Twinkle effect
        star.opacity += 0.005 * star.dir;
        if (star.opacity > 1) {
          star.opacity = 1;
          star.dir = -1;
        } else if (star.opacity < 0.1) {
          star.opacity = 0.1;
          star.dir = 1;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-50 bg-[#030712] pointer-events-none"
    />
  );
}
