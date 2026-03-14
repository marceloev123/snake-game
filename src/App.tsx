import { GameBoard } from "./components/game-board";
import { EndOverlay, StartOverlay } from "./components/game-overlay";
import { useSnakeGame } from "./hooks/useSnakeGame";

function App() {
  const { state, started, restart } = useSnakeGame();

  return (
    <main className="bg-zinc-950 h-screen flex items-center justify-center flex-col gap-6">
      <div className="font-mono text-zinc-400 text-sm tracking-[0.3em] uppercase">
        Score <span className="text-emerald-400 font-bold text-xl">{state.score}</span>
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
