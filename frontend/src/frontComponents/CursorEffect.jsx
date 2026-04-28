import { useEffect, useRef } from "react";

export default function CursorEffect({ type = "specs" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const s = {
      rawX: -300, rawY: -300,
      cx: -300, cy: -300,
      frame: 0,
      parts: [],
      nodes: Array(20).fill(null).map((_, i) => ({
        x: -300, y: -300, vx: 0, vy: 0,
        sc: Math.max(0.08, 1 - (i / 20) * 0.92),
        al: Math.max(0.03, 1 - i / 20),
      })),
    };

    const CYAN = "#00d4ff";
    const TEAL = "#00ffcc";
    const BLUE = "#0088ff";

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function spawnPart(x, y, burst) {
      if (s.parts.length > 70) s.parts.shift();
      const a = Math.random() * Math.PI * 2;
      const spd = burst
        ? 1.5 + Math.random() * 3
        : 0.2 + Math.random() * 1;
      s.parts.push({
        x, y,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd - 0.3,
        life: 1,
        ml: burst ? 0.8 : 0.5 + Math.random() * 0.3,
        sz: burst ? 2 + Math.random() * 4 : 1 + Math.random() * 2,
        color: Math.random() < 0.5 ? CYAN : TEAL,
        type: Math.random() < 0.25 ? "ring" : "dot",
      });
    }

    function onMove(e) {
      s.rawX = e.clientX;
      s.rawY = e.clientY;
      if (Math.random() < 0.3) spawnPart(e.clientX, e.clientY, false);
    }

    function onClick(e) {
      for (let k = 0; k < 14; k++) spawnPart(e.clientX, e.clientY, true);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onClick);

    function updateChain() {
      s.cx = lerp(s.cx, s.rawX, 0.16);
      s.cy = lerp(s.cy, s.rawY, 0.16);
      s.nodes[0].x = s.cx;
      s.nodes[0].y = s.cy;

      for (let i = 1; i < 20; i++) {
        const p = s.nodes[i - 1];
        const n = s.nodes[i];
        const dx = p.x - n.x;
        const dy = p.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const over = dist - 7;
        n.vx = (n.vx + (dx / dist) * over * 0.15) * 0.74;
        n.vy = (n.vy + (dy / dist) * over * 0.15) * 0.74;
        n.x += n.vx;
        n.y += n.vy;
      }
    }

    function drawParts() {
      for (let i = s.parts.length - 1; i >= 0; i--) {
        const p = s.parts[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.life -= 1 / 60 / p.ml;

        if (p.life <= 0) {
          s.parts.splice(i, 1);
          continue;
        }

        const a = p.life * 0.85;
        ctx.save();
        ctx.globalAlpha = a;

        if (p.type === "ring") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.sz * (2.5 - p.life * 1.5), 0, Math.PI * 2);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.sz * p.life, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.sz * p.life * 2.2, 0, Math.PI * 2);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 0.5;
          ctx.globalAlpha = a * 0.25;
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    function drawRings(x, y, t, color) {
      [
        { r: 28, d: 0, a: 0.3 },
        { r: 44, d: 0.6, a: 0.16 },
        { r: 60, d: 1.2, a: 0.08 },
      ].forEach((rd) => {
        const pulse = 1 + Math.sin(t * 0.06 + rd.d) * 0.04;
        ctx.beginPath();
        ctx.arc(x, y, rd.r * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = rd.a;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });
    }

    function drawMouseCursor(x, y, sc, alpha) {
      ctx.save();
      ctx.globalAlpha = Math.min(alpha, 1);
      ctx.translate(x, y);
      ctx.scale(sc, sc);

      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 28);
      g.addColorStop(0, `rgba(0,212,255,${0.2 * alpha})`);
      g.addColorStop(1, "rgba(0,212,255,0)");
      ctx.beginPath();
      ctx.arc(0, 0, 28, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, -20);
      ctx.bezierCurveTo(-10, -20, -14, -10, -14, 2);
      ctx.bezierCurveTo(-14, 12, -8, 18, 0, 20);
      ctx.bezierCurveTo(8, 18, 14, 12, 14, 2);
      ctx.bezierCurveTo(14, -10, 10, -20, 0, -20);
      ctx.closePath();
      ctx.strokeStyle = CYAN;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "rgba(0,212,255,0.08)";
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, -20);
      ctx.lineTo(0, -5);
      ctx.strokeStyle = CYAN;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-1, -20);
      ctx.bezierCurveTo(-10, -20, -13, -12, -13, -5);
      ctx.lineTo(-1, -5);
      ctx.closePath();
      ctx.fillStyle = "rgba(0,212,255,0.25)";
      ctx.fill();

      const wPulse = 1 + Math.sin(s.frame * 0.15) * 0.15;
      ctx.beginPath();
      ctx.roundRect(-3, -12, 6, 10 * wPulse, 3);
      ctx.strokeStyle = CYAN;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = `rgba(0,212,255,${0.3 + Math.sin(s.frame * 0.15) * 0.2})`;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-2, -8);
      ctx.lineTo(2, -8);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, 20);
      ctx.bezierCurveTo(0, 26, 4, 28, 4, 32);
      ctx.strokeStyle = "rgba(0,212,255,0.5)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([2, 2]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.roundRect(-17, 0, 4, 8, 2);
      ctx.fillStyle = "rgba(0,255,204,0.4)";
      ctx.fill();
      ctx.strokeStyle = TEAL;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      if (s.frame % 8 < 3) {
        ctx.beginPath();
        ctx.moveTo(-14, Math.sin(s.frame * 0.3) * 8);
        ctx.lineTo(14, Math.sin(s.frame * 0.3) * 8);
        ctx.strokeStyle = "rgba(0,255,204,0.3)";
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      ctx.restore();
    }

    function drawSpecsCursor(x, y, sc, alpha) {
      ctx.save();
      ctx.globalAlpha = Math.min(alpha, 1);
      ctx.translate(x, y);
      ctx.scale(sc, sc);

      // Outer glow
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 36);
      g.addColorStop(0, `rgba(0,136,255,${0.2 * alpha})`);
      g.addColorStop(1, "rgba(0,136,255,0)");
      ctx.beginPath();
      ctx.arc(0, 0, 36, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      // Left lens
      ctx.beginPath();
      ctx.roundRect(-28, -12, 22, 20, 10);
      ctx.strokeStyle = CYAN;
      ctx.lineWidth = 2.2;
      ctx.fillStyle = "rgba(0,136,255,0.12)";
      ctx.fill();
      ctx.stroke();

      // Right lens
      ctx.beginPath();
      ctx.roundRect(6, -12, 22, 20, 10);
      ctx.strokeStyle = CYAN;
      ctx.lineWidth = 2.2;
      ctx.fillStyle = "rgba(0,136,255,0.12)";
      ctx.fill();
      ctx.stroke();

      // Bridge
      ctx.beginPath();
      ctx.moveTo(-6, -4);
      ctx.lineTo(6, -4);
      ctx.strokeStyle = CYAN;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Left temple arm
      ctx.beginPath();
      ctx.moveTo(-28, -4);
      ctx.bezierCurveTo(-34, -4, -38, 0, -40, 6);
      ctx.strokeStyle = CYAN;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke();

      // Right temple arm
      ctx.beginPath();
      ctx.moveTo(28, -4);
      ctx.bezierCurveTo(34, -4, 38, 0, 40, 6);
      ctx.strokeStyle = CYAN;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke();

      // Code chars flickering in lenses
      const codeChars = ["</>", "{}", "()", "[]", "fn", "=>", "&&", "||", "==", "!!"];
      const lf = Math.floor(s.frame * 0.15) % codeChars.length;

      // Left lens code
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(-28, -12, 22, 20, 10);
      ctx.clip();
      ctx.font = "bold 7px monospace";
      ctx.fillStyle = `rgba(0,255,204,${0.5 + Math.sin(s.frame * 0.12) * 0.3})`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(codeChars[lf], -17, -2);
      ctx.restore();

      // Right lens code
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(6, -12, 22, 20, 10);
      ctx.clip();
      ctx.font = "bold 7px monospace";
      ctx.fillStyle = `rgba(0,255,204,${0.5 + Math.sin(s.frame * 0.12 + 1) * 0.3})`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(codeChars[(lf + 3) % codeChars.length], 17, -2);
      ctx.restore();

      // Scan line sweep
      const scanY = -12 + ((s.frame * 0.6) % 20);
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(-28, -12, 22, 20, 10);
      ctx.roundRect(6, -12, 22, 20, 10);
      ctx.clip();
      ctx.beginPath();
      ctx.moveTo(-28, scanY);
      ctx.lineTo(28, scanY);
      ctx.strokeStyle = "rgba(0,212,255,0.35)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Lens glare dots
      [[-22, -8], [12, -8]].forEach(([lx, ly]) => {
        ctx.beginPath();
        ctx.arc(lx, ly, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(s.frame * 0.08) * 0.2})`;
        ctx.fill();
      });

      // Nose pad dots
      [-8, 8].forEach((nx) => {
        ctx.beginPath();
        ctx.arc(nx, -12, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = TEAL;
        ctx.fill();
      });

      // Blinking cursor below
      if (Math.sin(s.frame * 0.18) > 0) {
        ctx.beginPath();
        ctx.rect(-2, 14, 2, 10);
        ctx.fillStyle = "rgba(0,212,255,0.9)";
        ctx.fill();
      }

      // Tiny code rain below glasses
      for (let c = 0; c < 3; c++) {
        const cx2 = -14 + c * 14;
        const cyy = 22 + ((s.frame * 0.8 + c * 8) % 20);
        ctx.font = "6px monospace";
        ctx.fillStyle = `rgba(0,255,204,${0.2 + c * 0.1})`;
        ctx.textAlign = "center";
        ctx.fillText(["0", "1", "{"][c], cx2, cyy);
      }

      ctx.restore();
    }

    let raf;

    function animate() {
      s.frame++;
      updateChain();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw trail
      for (let i = 19; i >= 1; i--) {
        const n = s.nodes[i];
        if (n.x < -200) continue;
        const al = n.al * 0.45 * (1 - (i / 20) * 0.5);
        if (type === "mouse") {
          drawMouseCursor(n.x, n.y, n.sc * 0.38, al);
        } else {
          drawSpecsCursor(n.x, n.y, n.sc * 0.3, al);
        }
      }

      drawParts();
      drawRings(s.cx, s.cy, s.frame, type === "mouse" ? CYAN : BLUE);

      if (type === "mouse") {
        drawMouseCursor(s.cx, s.cy, 1, 1);
      } else {
        drawSpecsCursor(s.cx, s.cy, 1, 1);
      }

      raf = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onClick);
    };
  }, [type]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 99999,
      }}
    />
  );
}