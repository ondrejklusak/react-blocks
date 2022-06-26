import { FunctionComponent } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Game from "./pages/GamePage";
import Leaderboard from "./pages/LeaderboardPage";
import Start from "./pages/StartPage";

const App: FunctionComponent = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">React Blocks</header>
        <main>
          <Routes>
            <Route path="/" element={<Start />} />
            <Route path="game" element={<Game />} />
            <Route path="leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
