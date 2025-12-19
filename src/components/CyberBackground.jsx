import React, { useRef, useEffect } from 'react';

const CyberBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width, height;
    
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    let glitchActive = false;
    let glitchDuration = 0;
    let glitchType = 0;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e) => {
      mouseX = (e.clientX - width / 2) * 0.05;
      mouseY = (e.clientY - height / 2) * 0.05;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    const isMobile = width < 768;
    const gridSize = isMobile ? 60 : 40;
    const particleCount = isMobile ? 10 : 30;
    
    const drawGrid = (offsetX, offsetY, color = '#00f6ff', alpha = 0.1) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = alpha;
      ctx.beginPath();

      for (let x = offsetX % gridSize; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }

      for (let y = offsetY % gridSize; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }

      ctx.stroke();
      ctx.globalAlpha = 1.0;
    };

    const applyGlitch = () => {
      if (!glitchActive) {
        if (Math.random() < 0.005) {
          glitchActive = true;
          glitchDuration = Math.random() * 10 + 5;
          glitchType = Math.floor(Math.random() * 3);
        }
        return;
      }

      glitchDuration--;
      if (glitchDuration <= 0) {
        glitchActive = false;
        return;
      }

      const stripHeight = Math.random() * 50 + 10;
      const yPos = Math.random() * height;
      
      try {
        const imageData = ctx.getImageData(0, yPos, width, stripHeight);
        
        if (glitchType === 0) {
          ctx.putImageData(imageData, Math.random() * 20 - 10, yPos);
        }
        
        if (glitchType === 1) {
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                data[i] = 255 - data[i];
                data[i+2] = data[i+2] * 1.5;
            }
            ctx.putImageData(imageData, 0, yPos);
        }

        if (glitchType === 2) {
            ctx.fillStyle = Math.random() > 0.5 ? '#00f6ff' : '#ffaa00';
            ctx.fillRect(Math.random() * width, yPos, Math.random() * 200, stripHeight);
        }
      } catch {
        glitchActive = false;
      }
    };

    const render = (time) => {
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      ctx.fillStyle = 'rgba(5, 5, 5, 0.4)';
      ctx.fillRect(0, 0, width, height);

      drawGrid(-targetX, -targetY, '#00f6ff', 0.05);

      drawGrid(-targetX * 2 + width/2, -targetY * 2 + height/2, '#ffaa00', 0.03);

      ctx.fillStyle = '#00f6ff';
      for (let i = 0; i < particleCount; i++) {
        const x = (Math.sin(time * 0.0005 + i) * width/2 + width/2) - targetX * (i % 3);
        const y = (Math.cos(time * 0.0005 + i * 2) * height/2 + height/2) - targetY * (i % 3);
        const size = Math.random() * 2;
        ctx.globalAlpha = Math.random() * 0.5;
        ctx.fillRect(x, y, size, size);
      }
      ctx.globalAlpha = 1.0;

      applyGlitch();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default CyberBackground;
