import { GameBoard } from "./components/game-board";
import { EndOverlay, StartOverlay } from "./components/game-overlay";
import { useSnakeGame } from "./hooks/useSnakeGame";
import "./app.css";

function App() {
  const { state, started, restart } = useSnakeGame();

  return (
    <main className="app">
      <div className="score-display">
        Score <span className="score-value">{state.score}</span>
      </div>

      <GameBoard snake={state.snake} food={state.food} gridSize={state.gridSize} />

      {!started && state.phase === "PLAYING" && <StartOverlay />}
      {state.phase !== "PLAYING" && (
        <EndOverlay phase={state.phase} score={state.score} onRestart={restart} />
      )}
    </main>
  );
}

export default App;
