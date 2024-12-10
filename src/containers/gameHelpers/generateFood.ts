export const generateFood = (snake: { x: number; y: number }[], boardSize: number, foodX: number, foodY: number) => {
    let newFood: { x: number; y: number } = { x: foodX, y: foodY };
  
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
    