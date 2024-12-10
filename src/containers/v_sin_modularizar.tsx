import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Button } from '../components/ui/button';
import happySnake from '../assets/happy.png';
import sadSnake from '../assets/sad.png';

const generateFood = (snake: { x: number; y: number }[], boardSize: number, foodX: number, foodY: number) => {
  let newFood: { x: number; y: number };
  newFood = {
    x: foodX,
    y: foodY,
  };
  const getRandomPosition = () => ({
    x: Math.floor(Math.random() * boardSize),
    y: Math.floor(Math.random() * boardSize),
  });

  // Si la serpiente ya está ahí genero otra posición
  while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
   newFood = getRandomPosition(); 
  }
  return newFood;
};

const SnakeGame: React.FC = () =>  {
  const { difficulty } = useParams(); 
  let BOARD_SIZE;
  if(difficulty === "Easy"){
    BOARD_SIZE = 8;
  }
  else if (difficulty === "Medium"){
    BOARD_SIZE = 10;
  }
  else {
    BOARD_SIZE = 12;
  }

  const navigate = useNavigate();
  const INITIAL_SNAKE = [{ x: Math.floor(BOARD_SIZE / 2), y: Math.floor(BOARD_SIZE / 2) }];
  const INITIAL_FOOD = generateFood(INITIAL_SNAKE, BOARD_SIZE, Math.floor(BOARD_SIZE / 2), Math.floor(BOARD_SIZE / 2));
  const FINAL_SCORE = BOARD_SIZE * BOARD_SIZE
  
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState('');
  const [food, setFood] = useState(INITIAL_FOOD);
  const [score, setScore] = useState(0);
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
  if (score === FINAL_SCORE) {
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
        // Solo incrementa el puntaje si es menor que FINAL_SCORE
        if (score < FINAL_SCORE) {
          setScore(prevScore => {
            const newScore = prevScore + 1;
            return newScore < FINAL_SCORE ? newScore : FINAL_SCORE;
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
    setFood(generateFood(INITIAL_SNAKE, BOARD_SIZE, Math.floor(BOARD_SIZE / 2), Math.floor(BOARD_SIZE / 2)));
    setScore(0);
    setGameOver(false);
    setYouWin(false);
  };

  return (
    <div>
      <p className='m-3 text-xl font-black bg-white bg-opacity-80 rounded-lg'>Score: {score}</p>
      {gameOver ? (
        <div>
          <h2 className='m-3 text-xl font-black text-red-800 bg-white bg-opacity-80 rounded-lg'>GAME OVER</h2>
          <img src={sadSnake} alt="Icono" className="w-[300px] h-[300px]" />
          <Button variant='default' className='mt-5 font-extrabold bg-opacity-50' onClick={restartGame}>Restart</Button>
        </div>
      ) : youWin ? (
        <div>
          <h2 className='m-3 text-xl font-black text-green-800 bg-white bg-opacity-80 rounded-lg'>YOU WIN!!</h2>
          <img src={happySnake} alt="Icono" className="w-[300px] h-[300px]" />
          <Button variant='default' className='mt-5 font-extrabold bg-opacity-50' onClick={restartGame}>Restart</Button>
        </div>
      ):(
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${BOARD_SIZE}, 30px)`,
            gap: '2px',
            background: '#33A14A'
          }}
        >
          {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, idx) => {
            const x = idx % BOARD_SIZE;
            const y = Math.floor(idx / BOARD_SIZE);
            const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;
            const isHead = snake[0].x === x && snake[0].y === y;
  
            return (
              <div
                key={idx}
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: isSnake ? 'green' : isFood ? 'red' : 'white',
                  border: '1px solid black',
                  position: 'relative', 
                }}
              >
                {isHead && (
                  <>
                    {/* Ojo izquierdo */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '6px',
                        left: '6px',
                        width: '6px',
                        height: '6px',
                        backgroundColor: 'white',
                      }}
                    ></div>
                    <div
                      style={{
                        position: 'absolute',
                        top: '7px',
                        left: '7px',
                        width: '4px',
                        height: '4px',
                        backgroundColor: 'black',
                      }}
                    ></div>
          
                    {/* Ojo derecho */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        width: '6px',
                        height: '6px',
                        backgroundColor: 'white',
                      }}
                    ></div>
                    <div
                      style={{
                        position: 'absolute',
                        top: '7px',
                        right: '7px',
                        width: '4px',
                        height: '4px',
                        backgroundColor: 'black',
                      }}
                    ></div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
      <Button className='mt-4 bg-opacity-50' onClick={()=>navigate(`/`)}>Home</Button>
    </div>
  );
};

export default SnakeGame;
