import { GameBoard } from "./components/game-board";
import { EndOverlay, StartOverlay } from "./components/game-overlay";
import { useSnakeGame } from "./hooks/useSnakeGame";
import { GAME_STATUS } from "./lib/game";
import "./app.css";

function App() {
  const { state, started, restart } = useSnakeGame();

  return (
    <main className="app">
      <div className="score-display">
        Score <span className="score-value">{state.score}</span>
      </div>

      <GameBoard snake={state.snake} food={state.food} gridSize={state.gridSize} />

      {!started && state.phase === GAME_STATUS.PLAYING && <StartOverlay />}
      {state.phase !== GAME_STATUS.PLAYING && (
        <EndOverlay phase={state.phase} score={state.score} onRestart={restart} />
      )}
    </main>
  );
}

export default App;
