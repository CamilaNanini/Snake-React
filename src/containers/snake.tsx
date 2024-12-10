import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnakeGame } from './gameHelpers/gameLogic';
import { Button } from '../components/ui/button';
import happySnake from '../assets/happy.png';
import sadSnake from '../assets/sad.png';

const SnakeGame: React.FC = () => {
  const { difficulty } = useParams();
  const { snake, food, score, gameOver, youWin, restartGame,BOARD_SIZE } = useSnakeGame(difficulty || 'Medium');
  const navigate = useNavigate();

  return (
    <div>
      <p className="m-3 text-xl font-black bg-white bg-opacity-80 rounded-lg">Score: {score}</p>
      {gameOver ? (
        <div>
          <h2 className="m-3 text-xl font-black text-red-800 bg-white bg-opacity-80 rounded-lg">GAME OVER</h2>
          <img src={sadSnake} alt="Icono" className="w-[300px] h-[300px]" />
          <Button variant="default" className="mt-5 font-extrabold bg-opacity-50" onClick={restartGame}>Restart</Button>
        </div>
      ) : youWin ? (
        <div>
          <h2 className="m-3 text-xl font-black text-green-800 bg-white bg-opacity-80 rounded-lg">YOU WIN!!</h2>
          <img src={happySnake} alt="Icono" className="w-[300px] h-[300px]" />
          <Button variant="default" className="mt-5 font-extrabold bg-opacity-50" onClick={restartGame}>Restart</Button>
        </div>
      ) : (
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
                    <div
                      style={{
                        position: 'absolute',
                        top: '11px',
                        left: '6px',
                        width: '6px',
                        height: '6px',
                        backgroundColor: 'white',
                      }}
                    ></div>
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '7px',
                        width: '4px',
                        height: '4px',
                        backgroundColor: 'black',
                      }}
                    ></div>

                    <div
                      style={{
                        position: 'absolute',
                        top: '11px',
                        right: '6px',
                        width: '6px',
                        height: '6px',
                        backgroundColor: 'white',
                      }}
                    ></div>
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
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
      <Button className="mt-4 bg-opacity-50" onClick={() => navigate(`/`)}>Home</Button>
    </div>
  );
};

export default SnakeGame;
