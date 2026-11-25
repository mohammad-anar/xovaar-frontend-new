"use client";

import React, { useEffect, useRef } from "react";

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
  lineWidth: number;
}

interface TailPoint {
  x: number;
  y: number;
}

export default function WaterRippleCursor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current?.parentElement;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = container.clientWidth;
    let height = container.clientHeight;
    let dpr = window.devicePixelRatio || 1;

    // Resize canvas to match container with DPR scaling for crisp graphics
    const handleResize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth;
      height = container.clientHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    handleResize();

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Mouse coordinates relative to hero banner
    let mouse = { x: -9999, y: -9999 };
    let lastSpawn = { x: -9999, y: -9999 };
    let isHovering = false;

    // Tail Points (14 points for fluid liquid trail)
    const TAIL_LENGTH = 14;
    const tailPoints: TailPoint[] = Array.from({ length: TAIL_LENGTH }, () => ({
      x: -9999,
      y: -9999,
    }));

    // Ripple array
    const ripples: Ripple[] = [];

    const spawnRipple = (x: number, y: number, isClick = false) => {
      // Primary wave
      ripples.push({
        x,
        y,
        radius: 2,
        maxRadius: isClick ? 85 : 45 + Math.random() * 20,
        opacity: isClick ? 0.85 : 0.65,
        speed: isClick ? 2.4 : 1.6 + Math.random() * 0.4,
        lineWidth: isClick ? 2.2 : 1.5,
      });

      // Secondary echoing wave (delayed harmonic ripple)
      setTimeout(() => {
        ripples.push({
          x,
          y,
          radius: 1,
          maxRadius: isClick ? 65 : 35 + Math.random() * 15,
          opacity: isClick ? 0.6 : 0.45,
          speed: isClick ? 2.0 : 1.3,
          lineWidth: isClick ? 1.8 : 1.2,
        });
      }, 70);

      if (isClick) {
        // Third inner ripple on click
        setTimeout(() => {
          ripples.push({
            x,
            y,
            radius: 1,
            maxRadius: 45,
            opacity: 0.4,
            speed: 1.6,
            lineWidth: 1.0,
          });
        }, 140);
      }
    };

    // Mouse Event Handlers on Hero Container
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouse.x = x;
      mouse.y = y;
      isHovering = true;

      // Initialize tail points on first move into section
      if (tailPoints[0].x === -9999) {
        for (let i = 0; i < TAIL_LENGTH; i++) {
          tailPoints[i] = { x, y };
        }
      }

      // Spawn water ripple if cursor moved enough distance (> 22px)
      const dist = Math.hypot(x - lastSpawn.x, y - lastSpawn.y);
      if (dist > 24) {
        spawnRipple(x, y, false);
        lastSpawn = { x, y };
      }
    };

    const onMouseEnter = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouse.x = x;
      mouse.y = y;
      lastSpawn = { x, y };
      isHovering = true;

      for (let i = 0; i < TAIL_LENGTH; i++) {
        tailPoints[i] = { x, y };
      }

      spawnRipple(x, y, false);
    };

    const onMouseLeave = () => {
      isHovering = false;
    };

    const onMouseDown = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spawnRipple(x, y, true);
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);
    container.addEventListener("mousedown", onMouseDown);

    // Main 60fps Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Update & Draw Tail Points with Smooth Spring Physics
      if (isHovering && mouse.x !== -9999) {
        // Head smoothly targets mouse
        tailPoints[0].x += (mouse.x - tailPoints[0].x) * 0.45;
        tailPoints[0].y += (mouse.y - tailPoints[0].y) * 0.45;

        // Each trailing point springs towards the previous point
        for (let i = 1; i < TAIL_LENGTH; i++) {
          tailPoints[i].x += (tailPoints[i - 1].x - tailPoints[i].x) * 0.35;
          tailPoints[i].y += (tailPoints[i - 1].y - tailPoints[i].y) * 0.35;
        }

        // Draw Connected Fluid Liquid Ribbon (Water trail)
        ctx.beginPath();
        for (let i = 0; i < TAIL_LENGTH - 1; i++) {
          const xc = (tailPoints[i].x + tailPoints[i + 1].x) / 2;
          const yc = (tailPoints[i].y + tailPoints[i + 1].y) / 2;

          if (i === 0) {
            ctx.moveTo(tailPoints[0].x, tailPoints[0].y);
          } else {
            ctx.quadraticCurveTo(tailPoints[i].x, tailPoints[i].y, xc, yc);
          }
        }
        ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();

        // Draw Individual Liquid Droplets along the Tail
        for (let i = 0; i < TAIL_LENGTH; i++) {
          const ratio = 1 - i / TAIL_LENGTH;
          const radius = 4.5 * ratio + 0.8;
          const alpha = 0.55 * ratio + 0.05;

          ctx.beginPath();
          ctx.arc(tailPoints[i].x, tailPoints[i].y, radius, 0, Math.PI * 2);

          // Subtle gradient water droplet fill
          const grad = ctx.createRadialGradient(
            tailPoints[i].x - radius * 0.3,
            tailPoints[i].y - radius * 0.3,
            radius * 0.1,
            tailPoints[i].x,
            tailPoints[i].y,
            radius
          );
          grad.addColorStop(0, `rgba(255, 255, 255, ${alpha + 0.2})`);
          grad.addColorStop(0.6, `rgba(224, 242, 254, ${alpha})`);
          grad.addColorStop(1, `rgba(186, 230, 253, ${alpha * 0.6})`);

          ctx.fillStyle = grad;
          ctx.fill();

          // Delicate specular highlight on head droplet
          if (i === 0) {
            ctx.beginPath();
            ctx.arc(tailPoints[i].x - 1.2, tailPoints[i].y - 1.2, 1.2, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
            ctx.fill();

            // Outer soft water aura glow
            ctx.beginPath();
            ctx.arc(tailPoints[i].x, tailPoints[i].y, radius + 4, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // 2. Update & Draw Concentric Water Wave Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;

        // Non-linear realistic water wave fade
        const progress = r.radius / r.maxRadius;
        const currentAlpha = Math.max(0, r.opacity * (1 - Math.pow(progress, 1.4)));

        if (r.radius >= r.maxRadius || currentAlpha <= 0.01) {
          ripples.splice(i, 1);
          continue;
        }

        // Draw Wave Crest Ring
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        ctx.lineWidth = r.lineWidth * (1 - progress * 0.4);
        ctx.stroke();

        // Subtle Refractive Inner Shadow Ring (simulates water surface depth)
        if (r.radius > 6) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, Math.max(1, r.radius - 2.5), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(186, 230, 253, ${currentAlpha * 0.45})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mouseleave", onMouseLeave);
      container.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-15 overflow-hidden w-full h-full select-none"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
      />
    </div>
  );
}
