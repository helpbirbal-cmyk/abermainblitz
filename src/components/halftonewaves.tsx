// components/halftonewaves.tsx
"use client"

import { useEffect, useRef } from 'react'

interface HalftoneWavesProps {
  width: number;
  height: number;
}

// Function to interpolate between two RGB colors
function interpolateColor(color1: number[], color2: number[], factor: number) {
  const result = color1.slice();
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  }
  return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
}

export default function HalftoneWaves({ width, height }: HalftoneWavesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Define the colors for the two gradients
  const financeGradientStart = [30, 64, 191]; // #1e40af
  const financeGradientEnd = [0, 102, 255]; // #0066ff
  const mediaGradientStart = [192, 38, 211]; // #c026d3
  const mediaGradientEnd = [236, 72, 153]; // #ec4899

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const drawHalftoneWave = () => {
      const gridSize = 20
      const rows = Math.ceil(height / gridSize)
      const cols = Math.ceil(width / gridSize)

      // Determine which gradient to use based on time for an alternating effect
      const switchColor = Math.floor(time / (Math.PI * 4)) % 2 === 0;
      const gradientStart = switchColor ? financeGradientStart : mediaGradientStart;
      const gradientEnd = switchColor ? financeGradientEnd : mediaGradientEnd;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const centerX = x * gridSize;
          const centerY = y * gridSize;
          const distanceFromCenter = Math.sqrt(
            Math.pow(centerX - width / 2, 2) +
            Math.pow(centerY - height / 2, 2)
          );
          const maxDistance = Math.sqrt(
            Math.pow(width / 2, 2) +
            Math.pow(height / 2, 2)
          );
          const normalizedDistance = distanceFromCenter / maxDistance;

          const waveOffset = Math.sin(normalizedDistance * 10 - time) * 0.5 + 0.5;
          const size = gridSize * waveOffset * 0.8;

          // Interpolate color based on normalized distance from the center
          const color = interpolateColor(gradientStart, gradientEnd, normalizedDistance);

          ctx.beginPath();
          // Use roundRect() instead of arc() to draw rounded squares
          // The last argument (size / 4) determines the corner radius
          ctx.roundRect(centerX - size / 2, centerY - size / 2, size, size, size / 1);
          // Apply the interpolated color with dynamic opacity
          ctx.fillStyle = `${color.replace('rgb', 'rgba').replace(')', `, ${waveOffset * 0.5})`)}`;
          ctx.fill();
        }
      }
    }

    const animate = () => {
      // Keep the background black
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawHalftoneWave();

      time += 0.05;
      animationFrameId = requestAnimationFrame(animate);
    }

    canvas.width = width;
    canvas.height = height;

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    }
  }, [width, height])

  return <canvas ref={canvasRef} className="w-full h-full bg-black" />
}
