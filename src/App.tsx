import SnakeGame from "./game/snake";
import Home from "./game/home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router basename="/Snake-React">
      <div className="h-screen w-screen flex flex-col justify-start items-center mt-6">
        <div className="text-center">
          <h1 className="text-7xl font-bold" style={{ WebkitTextStroke: '2px white' }}>Snake</h1>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/:difficulty" element={<SnakeGame/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

