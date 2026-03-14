import { memo } from "react";
import { positionKey, type GameState } from "../../lib/game";
import { Cell } from "../cell";
import "./game-board.css";

type GameBoardProps = Pick<GameState, "snake" | "food" | "gridSize">;

const GameBoard = memo(function GameBoard({ snake, food, gridSize }: GameBoardProps) {
  const headKey = positionKey(snake[0]);
  const bodySet = new Set(snake.slice(1).map(positionKey));
  const foodKey = positionKey(food);

  return (
    <div
      className="game-board"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`,
      }}
    >
      {Array.from({ length: gridSize * gridSize }, (_, index) => {
        const x = index % gridSize;
        const y = Math.floor(index / gridSize);
        const key = positionKey({ x, y });
        return (
          <Cell
            key={key}
            isHead={key === headKey}
            isBody={bodySet.has(key)}
            isFood={key === foodKey}
          />
        );
      })}
    </div>
  );
});

export { GameBoard };
