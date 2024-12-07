import SnakeGame from "./game/snake";

function App() {
  return (
    <div className="h-screen w-screen flex flex-col justify-start items-center mt-6">
      <div className="text-center">
        <h1 className="text-7xl font-bold">Snake</h1>
          <SnakeGame/>
      </div>
    </div>
  );
}

export default App;
