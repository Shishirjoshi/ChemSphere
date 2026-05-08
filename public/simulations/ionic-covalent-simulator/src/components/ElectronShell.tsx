import React, { useEffect, useRef } from 'react';
import { AtomData } from '../data/atomData';

interface ElectronShellProps {
  atom: AtomData;
  size?: number;
  animated?: boolean;
  highlight?: boolean;
  transferring?: boolean;
}

const ElectronShell: React.FC<ElectronShellProps> = ({
  atom,
  size = 120,
  animated = true,
  highlight = false,
  transferring = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  const getShellConfig = (atomicNumber: number): number[] => {
    if (atomicNumber <= 2) return [atomicNumber];
    if (atomicNumber <= 10) return [2, atomicNumber - 2];
    if (atomicNumber <= 18) return [2, 8, atomicNumber - 10];
    if (atomicNumber <= 36) return [2, 8, 18, atomicNumber - 28];
    return [2, 8, 18, 18, atomicNumber - 46];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = size;
    canvas.height = size;

    const cx = size / 2;
    const cy = size / 2;
    const shells = getShellConfig(atom.atomicNumber);
    const maxShell = shells.length;
    const baseRadius = (size / 2 - 10) / maxShell;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      timeRef.current += 0.02;
      const t = timeRef.current;

      // Draw nucleus
      const nucleusRadius = size * 0.1;
      const nucGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, nucleusRadius);
      nucGrad.addColorStop(0, '#fff');
      nucGrad.addColorStop(0.4, atom.glowColor);
      nucGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = nucGrad;
      ctx.shadowBlur = highlight ? 20 : 10;
      ctx.shadowColor = atom.glowColor;
      ctx.beginPath();
      ctx.arc(cx, cy, nucleusRadius, 0, Math.PI * 2);
      ctx.fill();

      // Atom symbol in nucleus
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${Math.max(8, size * 0.1)}px Orbitron, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(atom.symbol, cx, cy);

      // Draw shells and electrons
      shells.forEach((electronCount, shellIndex) => {
        const shellRadius = baseRadius * (shellIndex + 1);

        // Shell ring
        ctx.strokeStyle = atom.color + '40';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(cx, cy, shellRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Electrons
        const speed = animated ? (shellIndex + 1) * 0.4 : 0;
        for (let i = 0; i < electronCount; i++) {
          const angle = (i / electronCount) * Math.PI * 2 + t * speed;
          const ex = cx + Math.cos(angle) * shellRadius;
          const ey = cy + Math.sin(angle) * shellRadius;

          // Electron trail
          if (animated) {
            for (let trail = 1; trail <= 4; trail++) {
              const ta = angle - (trail * 0.15);
              const tx = cx + Math.cos(ta) * shellRadius;
              const ty = cy + Math.sin(ta) * shellRadius;
              ctx.fillStyle = atom.color + Math.floor((1 - trail / 5) * 60).toString(16).padStart(2, '0');
              ctx.beginPath();
              ctx.arc(tx, ty, (3 - trail * 0.5) * (size / 120), 0, Math.PI * 2);
              ctx.fill();
            }
          }

          // Electron dot
          ctx.shadowBlur = transferring && shellIndex === shells.length - 1 ? 15 : 8;
          ctx.shadowColor = atom.glowColor;
          ctx.fillStyle = transferring && shellIndex === shells.length - 1 ? '#fff' : atom.color;
          ctx.beginPath();
          ctx.arc(ex, ey, 3.5 * (size / 120), 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });
    };

    if (animated) {
      const loop = () => {
        draw();
        animRef.current = requestAnimationFrame(loop);
      };
      animRef.current = requestAnimationFrame(loop);
    } else {
      draw();
    }

    return () => cancelAnimationFrame(animRef.current);
  }, [atom, size, animated, highlight, transferring]);

  return <canvas ref={canvasRef} width={size} height={size} className="block" />;
};

export default ElectronShell;
