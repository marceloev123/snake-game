import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  createGame,
  stepGame,
  changeDirection,
  canChangeDirection,
  GAME_STATUS,
  type GameState,
  type Direction,
} from "../lib/game";
import { GRID_SIZE, TICK_INTERVAL_MS } from "../config";
import { useArrowKeys } from "./useArrowKeys";

const MAX_QUEUED_DIRECTIONS = 2;

export type SnakeGame = {
  state: GameState;
  started: boolean;
  restart: () => void;
};

export function useSnakeGame(): SnakeGame {
  const [state, setState] = useState<GameState>(() => createGame(GRID_SIZE));
  const [started, setStarted] = useState(false);
  const directionQueue = useRef<Direction[]>([]);
  const stateRef = useRef(state);
  const startedRef = useRef(started);

  useLayoutEffect(() => {
    stateRef.current = state;
    startedRef.current = started;
  });

  useArrowKeys((direction: Direction) => {
    if (!startedRef.current) setStarted(true);

    const queue = directionQueue.current;
    if (queue.length >= MAX_QUEUED_DIRECTIONS) return;

    const lastQueued = queue.at(-1) ?? stateRef.current.direction;
    if (!canChangeDirection(lastQueued, direction, stateRef.current.snake.length)) return;

    queue.push(direction);
  });

  useEffect(() => {
    if (!started || state.phase !== GAME_STATUS.PLAYING) return;

    const id = setInterval(() => {
      const nextDirection = directionQueue.current.shift();
      setState((prev) => {
        const withDirection = nextDirection ? changeDirection(prev, nextDirection) : prev;
        return stepGame(withDirection);
      });
    }, TICK_INTERVAL_MS);

    return () => clearInterval(id);
  }, [started, state.phase]);

  const restart = useCallback(() => {
    setState(createGame(GRID_SIZE));
    setStarted(false);
    directionQueue.current = [];
  }, []);

  return { state, started, restart };
}
