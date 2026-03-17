"use client";

import { useEffect, useRef, useState } from "react";

// マウスカーソルに追従する控えめなグロウエフェクト
export function CursorFollower() {
  const glowRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -200, y: -200 });
  const currentPos = useRef({ x: -200, y: -200 });
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMove);

    // スムーズな追従（lerp）
    let raf: number;
    const animate = () => {
      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * 0.08;
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * 0.08;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${currentPos.current.x - 200}px, ${currentPos.current.y - 200}px)`;
      }

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("resize", checkMobile);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (isMobile) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <div
        ref={glowRef}
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          opacity: 0.04,
        }}
      />
    </div>
  );
}
