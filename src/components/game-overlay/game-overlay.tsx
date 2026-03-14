import type { ReactNode } from "react";
import type { GameStatus } from "../../lib/game";
import "./game-overlay.css";

type EndOverlayProps = {
  phase: Exclude<GameStatus, "PLAYING">;
  score: number;
  onRestart: () => void;
};

function Overlay({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div role="dialog" aria-modal="true" aria-label={label} className="overlay">
      <div className="overlay-card">{children}</div>
    </div>
  );
}

export function StartOverlay() {
  return (
    <Overlay label="Snake game">
      <h1 className="overlay-title">SNAKE</h1>
      <p className="overlay-hint">Press an arrow key to play</p>
    </Overlay>
  );
}

export function EndOverlay({ phase, score, onRestart }: EndOverlayProps) {
  const isWin = phase === "WIN";
  return (
    <Overlay label={isWin ? "You win" : "Game over"}>
      <h2 className={`end-title ${isWin ? "end-title--win" : "end-title--lose"}`}>
        {isWin ? "YOU WIN" : "GAME OVER"}
      </h2>
      <p className="end-score">
        Score: <span className="end-score-value">{score}</span>
      </p>
      <button autoFocus className="btn-restart" onClick={onRestart}>
        Play Again
      </button>
    </Overlay>
  );
}
