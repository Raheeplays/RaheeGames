import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // 1. AUTO-UPDATE LOGIC (GitHub URL fixed for Raheeplays)
  useEffect(() => {
    const checkUpdate = async () => {
      try {
        const res = await fetch('https://github.com/RaheePlays');
        const data = await res.json();
        if (data.tag_name && data.tag_name !== localStorage.getItem('app_v')) {
          console.log("New Update Available: " + data.tag_name);
          localStorage.setItem('app_v', data.tag_name);
        }
      } catch (e) { console.log("Offline Mode Active"); }
    };
    checkUpdate();
  }, []);

  // 2. SNAKE GAME LOGIC
  useEffect(() => {
    if (gameOver) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const box = 20;
    let d: string = 'RIGHT';
    let snake = [{ x: 10 * box, y: 10 * box }];
    let food = { x: 5 * box, y: 5 * box };

    const draw = () => {
      ctx.fillStyle = "#1e272e"; 
      ctx.fillRect(0, 0, 300, 300);

      for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "#1abc9c" : "#ecf0f1";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
      }

      ctx.fillStyle = "#e74c3c"; 
      ctx.fillRect(food.x, food.y, box, box);

      let snakeX = snake[0].x;
      let snakeY = snake[0].y;

      if (d === 'LEFT') snakeX -= box;
      if (d === 'UP') snakeY -= box;
      if (d === 'RIGHT') snakeX += box;
      if (d === 'DOWN') snakeY += box;

      if (snakeX === food.x && snakeY === food.y) {
        setScore(s => s + 1);
        food = { x: Math.floor(Math.random() * 14 + 1) * box, y: Math.floor(Math.random() * 14 + 1) * box };
      } else {
        snake.pop();
      }

      const newHead = { x: snakeX, y: snakeY };

      if (snakeX < 0 || snakeX >= 300 || snakeY < 0 || snakeY >= 300 || snake.some((s, idx) => idx !== 0 && s.x === newHead.x && s.y === newHead.y)) {
        setGameOver(true);
        clearInterval(game);
      }
      snake.unshift(newHead);
    };

    let game = setInterval(draw, 150);
    (window as any).move = (dir: string) => {
        if (dir === 'UP' && d !== 'DOWN') d = 'UP';
        if (dir === 'DOWN' && d !== 'UP') d = 'DOWN';
        if (dir === 'LEFT' && d !== 'RIGHT') d = 'LEFT';
        if (dir === 'RIGHT' && d !== 'LEFT') d = 'RIGHT';
    };

    return () => clearInterval(game);
  }, [gameOver]);

  return (
    <div style={{ color: 'white', textAlign: 'center', fontFamily: 'sans-serif', backgroundColor: '#2c3e50', minHeight: '100vh', padding: '20px' }}>
      <h2 style={{ margin: '10px 0' }}>Rahee Snake | Score: {score}</h2>
      
      <canvas ref={canvasRef} width="300" height="300" style={{ border: '4px solid #ecf0f1', borderRadius: '8px', backgroundColor: '#1e272e' }} />

      {gameOver && (
        <div style={{ marginTop: '10px' }}>
          <h3 style={{ color: '#e74c3c' }}>GAME OVER!</h3>
          <button style={{ padding: '10px 20px', cursor: 'pointer' }} onClick={() => setGameOver(false)}>Restart Game</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', width: '180px', margin: '20px auto', gap: '10px' }}>
        <button style={{ gridColumn: '2', padding: '15px', borderRadius: '8px' }} onClick={() => (window as any).move('UP')}>▲</button>
        <button style={{ gridColumn: '1', padding: '15px', borderRadius: '8px' }} onClick={() => (window as any).move('LEFT')}>◀</button>
        <button style={{ gridColumn: '2', padding: '15px', borderRadius: '8px' }} onClick={() => (window as any).move('DOWN')}>▼</button>
        <button style={{ gridColumn: '3', padding: '15px', borderRadius: '8px' }} onClick={() => (window as any).move('RIGHT')}>▶</button>
      </div>
      
      <p style={{ fontSize: '10px', color: '#bdc3c7' }}>Auto-update setup for @Raheeplays</p>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
