import { useState, useEffect } from 'react';

const generateFood = (snake: { x: number; y: number }[], boardSize: number, foodX: number, foodY: number) => {
  let newFood: { x: number; y: number };
  if (snake.some(segment => segment.x === foodX && segment.y === foodY)) {
    newFood = {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize),
    };
  } else {
    newFood = {
      x: foodX,
      y: foodY,
    };
  }
  return newFood;
};

const SnakeGame = () => {
  const BOARD_SIZE = 10; 
  const INITIAL_SNAKE = [{ x: 5, y: 5 }];
  const INITIAL_FOOD = generateFood(INITIAL_SNAKE, BOARD_SIZE, 5, 5);
  
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState('');
  const [food, setFood] = useState(INITIAL_FOOD);
  const [score, setScore] = useState(99); //Modificar a 0 para el final
  const [gameOver, setGameOver] = useState(false);
  const [youWin, setYouWin] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
          if (direction !== 'left') setDirection('right');
          break;
        case 'ArrowLeft':
          if (direction !== 'right') setDirection('left');
          break;
        case 'ArrowUp':
          if (direction !== 'down') setDirection('up');
          break;
        case 'ArrowDown':
          if (direction !== 'up') setDirection('down');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  //Aquí actualizo la comida, el puntaje y la serpiente
useEffect(() => {
  if (score === 100) {
    setYouWin(true);
    return;
  }

  const intervalId = setInterval(() => {
    setSnake(prevSnake => {
      const newSnake = prevSnake.map(segment => ({ x: segment.x, y: segment.y }));
      const head = { x: newSnake[0].x, y: newSnake[0].y };

      switch (direction) {
        case 'right':
          head.x += 1;
          break;
        case 'left':
          head.x -= 1;
          break;
        case 'up':
          head.y -= 1;
          break;
        case 'down':
          head.y += 1;
          break;
      }

      newSnake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        // Solo incrementa el puntaje si es menor que 100
        if (score < 100) {
          setScore(prevScore => {
            const newScore = prevScore + 1;
            return newScore < 100 ? newScore : 100; // Asegúrate de no pasar de 100
          });
        }
        setFood(generateFood(newSnake, BOARD_SIZE, food.x, food.y));
      } else {
        newSnake.pop();
      }

      if (
        head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE ||
        newSnake.some((part, index) => index !== 0 && part.x === newSnake[0].x && part.y === newSnake[0].y)
      ) {
        setGameOver(true);
        return prevSnake;
      }

      return newSnake;
    });
  }, 200);

  return () => clearInterval(intervalId);
}, [direction, food, score]);


  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection('');
    setFood(generateFood(INITIAL_SNAKE, BOARD_SIZE, 0, 0));
    setScore(0);
    setGameOver(false);
    setYouWin(false);
  };

  return (
    <div>
      <p>Score: {score}</p>
      {gameOver ? (
        <div>
          <h2>Game Over</h2>
          <button onClick={restartGame}>Restart</button>
        </div>
      ) : youWin ? (
        <div>
          <h2>YOU WIN</h2>
          <button onClick={restartGame}>Restart</button>
        </div>
      ):(
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${BOARD_SIZE}, 30px)`,
            gap: '2px',
          }}
        >
          {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, idx) => {
            const x = idx % BOARD_SIZE;
            const y = Math.floor(idx / BOARD_SIZE);
            const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;
  
            return (
              <div
                key={idx}
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: isSnake ? 'green' : isFood ? 'red' : 'white',
                  border: '1px solid black',
                }}
              ></div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
