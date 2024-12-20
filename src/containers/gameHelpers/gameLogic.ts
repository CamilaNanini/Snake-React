import { useState, useEffect } from 'react';
import { generateFood } from './generateFood';

export const useSnakeGame = (difficulty: string) => {
  let BOARD_SIZE;
  if(difficulty === "Easy") {
    BOARD_SIZE = 8;
  } else if (difficulty === "Medium") {
    BOARD_SIZE = 10;
  } else {
    BOARD_SIZE = 12;
  }

  const INITIAL_SNAKE = [{ x: Math.floor(BOARD_SIZE / 2), y: Math.floor(BOARD_SIZE / 2) }];
  const INITIAL_FOOD = generateFood(INITIAL_SNAKE, BOARD_SIZE, Math.floor(BOARD_SIZE / 2), Math.floor(BOARD_SIZE / 2));
  const FINAL_SCORE = BOARD_SIZE * BOARD_SIZE;

  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState('');
  const [food, setFood] = useState(INITIAL_FOOD);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [youWin, setYouWin] = useState(false);

  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection('');
    setFood(generateFood(INITIAL_SNAKE, BOARD_SIZE, Math.floor(BOARD_SIZE / 2), Math.floor(BOARD_SIZE / 2)));
    setScore(0);
    setGameOver(false);
    setYouWin(false);
  };

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

  return { snake, food, score, gameOver, youWin, restartGame, BOARD_SIZE };
};
