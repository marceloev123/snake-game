import { POINTS_PER_FOOD, WIN_SCORE } from "../config";
import type { Direction, GameStatus, GameState, NonEmptyArray, Position } from "./types";
import { GAME_STATUS } from "./types";

export type { Direction, GameStatus, GameState, NonEmptyArray, Position };
export { GAME_STATUS };

const OPPOSITES = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
} as const satisfies Record<Direction, Direction>;

const DELTAS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
} as const satisfies Record<Direction, Position>;

export function positionKey({ x, y }: Position): string {
  return `${x},${y}`;
}

function snakePositionSet(snake: Position[]): Set<string> {
  return new Set(snake.map(positionKey));
}

export function placeFood(
  gridSize: number,
  snake: Position[],
  randomize: () => number = Math.random,
): Position {
  const occupied = snakePositionSet(snake);
  const free: Position[] = [];

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (!occupied.has(positionKey({ x, y }))) {
        free.push({ x, y });
      }
    }
  }

  const position = free[Math.floor(randomize() * free.length)];
  if (!position) throw new Error("No free cell available for food");
  return position;
}

export function createGame(gridSize: number, randomize: () => number = Math.random): GameState {
  const center = Math.floor(gridSize / 2);
  const snake: NonEmptyArray<Position> = [{ x: center, y: center }];
  return {
    gridSize,
    snake,
    food: placeFood(gridSize, snake, randomize),
    direction: "RIGHT",
    score: 0,
    phase: GAME_STATUS.PLAYING,
  };
}

export function canChangeDirection(
  currentDirection: Direction,
  newDirection: Direction,
  snakeLength: number,
): boolean {
  if (newDirection === currentDirection) return false;
  if (OPPOSITES[newDirection] === currentDirection && snakeLength > 1) return false;
  return true;
}

export function changeDirection(state: GameState, newDirection: Direction): GameState {
  if (state.phase !== GAME_STATUS.PLAYING) return state;
  if (!canChangeDirection(state.direction, newDirection, state.snake.length)) return state;
  return { ...state, direction: newDirection };
}

export function stepGame(state: GameState, randomize: () => number = Math.random): GameState {
  if (state.phase !== GAME_STATUS.PLAYING) return state;

  const head = state.snake[0];
  const delta = DELTAS[state.direction];
  const newHead: Position = { x: head.x + delta.x, y: head.y + delta.y };

  if (
    newHead.x < 0 ||
    newHead.x >= state.gridSize ||
    newHead.y < 0 ||
    newHead.y >= state.gridSize
  ) {
    return { ...state, phase: "LOST" };
  }

  const ateFood = positionKey(newHead) === positionKey(state.food);

  const occupied = snakePositionSet(ateFood ? state.snake : state.snake.slice(0, -1));
  if (occupied.has(positionKey(newHead))) {
    return { ...state, phase: "LOST" };
  }

  const newSnake: NonEmptyArray<Position> = ateFood
    ? [newHead, ...state.snake]
    : [newHead, ...state.snake.slice(0, -1)];

  const newScore = ateFood ? state.score + POINTS_PER_FOOD : state.score;

  if (newScore >= WIN_SCORE) {
    return { ...state, snake: newSnake, score: newScore, phase: "WIN" };
  }

  return {
    ...state,
    snake: newSnake,
    score: newScore,
    food: ateFood ? placeFood(state.gridSize, newSnake, randomize) : state.food,
  };
}
