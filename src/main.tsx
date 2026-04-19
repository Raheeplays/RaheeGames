import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  const [score, setScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- AUTO UPDATE LOGIC ---
  useEffect(() => {
    const checkUpdate = async () => {
      try {
        // Change 'YOUR_GITHUB_USERNAME' to your actual username
        const res = await fetch('https://github.com');
        const data = await res.json();
        const latestVer = data.tag_name;
        const currentVer = localStorage.getItem('app_v') || 'v0';

        if (latestVer !== currentVer) {
          console.log("New update found: " + latestVer);
          // Yahan FileSystem download logic trigger hogi
          localStorage.setItem('app_v', latestVer);
        }
      } catch (e) { console.log("Offline mode"); }
    };
    checkUpdate();
  }, []);

  // --- SNAKE GAME LOGIC ---
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let box = 20, d: string = 'RIGHT';
    let snake = [{x: 10*box, y: 10*box}];
    let food = {x: 5*box, y: 5*box};

    const game = setInterval(() => {
      ctx.fillStyle = "black"; ctx.fillRect(0,0,300,300);
      snake.forEach((s, i) => { ctx.fillStyle = i==0 ? "#1abc9c":"white"; ctx.fillRect(s.x, s.y, box, box); });
      ctx.fillStyle = "red"; ctx.fillRect(food.x, food.y, box, box);

      let head = {x: snake[0].x, y: snake[0].y};
      if(d==='UP') head.y -= box; if(d==='DOWN') head.y += box;
      if(d==='LEFT') head.x -= box; if(d==='RIGHT') head.x += box;

      if(head.x === food.x && head.y === food.y) {
        setScore(s => s+1);
        food = {x: Math.floor(Math.random()*14)*box, y: Math.floor(Math.random()*14)*box};
      } else { snake.pop(); }

      if(head.x<0 || head.y<0 || head.x>=300 || head.y>=300) clearInterval(game);
      snake.unshift(head);
    }, 150);

    (window as any).move = (dir: string) => { d = dir; };
    return () => clearInterval(game);
  }, []);

  return (
    <div style={{color:'white', textAlign:'center', paddingTop:'20px'}}>
      <h2>Rahee Games | Score: {score}</h2>
      <canvas ref={canvasRef} width="300" height="300" style={{border:'2px solid white'}} />
      <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', width:'150px', margin:'20px auto', gap:'10px'}}>
        <button style={{gridColumn:'2'}} onClick={()=> (window as any).move('UP')}>▲</button>
        <button onClick={()=> (window as any).move('LEFT')}>◀</button>
        <button onClick={()=> (window as any).move('DOWN')}>▼</button>
        <button onClick={()=> (window as any).move('RIGHT')}>▶</button>
      </div>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);

