"use client";

import { useEffect, useRef, useState } from "react";

// マウスカーソルに追従するグロウエフェクト＋パーティクル
export function CursorFollower() {
  const glowRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);
  const mousePos = useRef({ x: -100, y: -100 });
  const positions = useRef<{ x: number; y: number }[]>(
    Array.from({ length: 5 }, () => ({ x: -100, y: -100 }))
  );
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // モバイルではカーソルエフェクト無効
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMove);

    // なめらかな追従アニメーション
    let raf: number;
    const animate = () => {
      // メインのグロウ
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${mousePos.current.x - 150}px, ${mousePos.current.y - 150}px)`;
      }

      // トレイル（遅延追従するドット）
      positions.current.forEach((pos, i) => {
        const target = i === 0 ? mousePos.current : positions.current[i - 1];
        const speed = 0.15 - i * 0.02;
        pos.x += (target.x - pos.x) * speed;
        pos.y += (target.y - pos.y) * speed;
        if (trailRefs.current[i]) {
          trailRefs.current[i].style.transform = `translate(${pos.x - 4}px, ${pos.y - 4}px)`;
        }
      });

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
      {/* メインのグロウサークル */}
      <div
        ref={glowRef}
        className="absolute w-[300px] h-[300px] rounded-full opacity-[0.07] transition-none"
        style={{
          background: "radial-gradient(circle, var(--accent) 0%, var(--accent-secondary) 40%, transparent 70%)",
        }}
      />
      {/* トレイルドット */}
      {positions.current.map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) trailRefs.current[i] = el;
          }}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: `var(--accent)`,
            opacity: 0.4 - i * 0.07,
            width: `${8 - i}px`,
            height: `${8 - i}px`,
          }}
        />
      ))}
    </div>
  );
}
