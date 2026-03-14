import type { ReactNode } from "react";
import type { GameStatus } from "../lib/game";

type EndOverlayProps = {
  phase: Exclude<GameStatus, "PLAYING">;
  score: number;
  onRestart: () => void;
};

function Overlay({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10"
    >
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl px-12 py-10 text-center shadow-2xl min-w-72">
        {children}
      </div>
    </div>
  );
}

export function StartOverlay() {
  return (
    <Overlay label="Snake game">
      <h1 className="text-5xl font-black text-emerald-400 tracking-[0.2em] mb-4">SNAKE</h1>
      <p className="text-zinc-400 text-sm tracking-widest uppercase">Press an arrow key to play</p>
    </Overlay>
  );
}

export function EndOverlay({ phase, score, onRestart }: EndOverlayProps) {
  const isWin = phase === "WIN";
  return (
    <Overlay label={isWin ? "You win" : "Game over"}>
      <h2
        className={`text-3xl font-black mb-1 tracking-wide ${isWin ? "text-yellow-400" : "text-red-400"}`}
      >
        {isWin ? "YOU WIN" : "GAME OVER"}
      </h2>
      <p className="text-zinc-400 text-sm mb-6">
        Score: <span className="text-white font-bold text-lg">{score}</span>
      </p>
      <button
        autoFocus
        className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold py-2 px-8 rounded-lg transition-colors tracking-wide"
        onClick={onRestart}
      >
        Play Again
      </button>
    </Overlay>
  );
}
