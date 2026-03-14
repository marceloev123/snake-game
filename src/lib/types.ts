export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export type Position = { x: number; y: number };

export type NonEmptyArray<T> = [T, ...T[]];

export type GameStatus = "WIN" | "LOST" | "PLAYING";

export type GameState = {
  gridSize: number;
  snake: NonEmptyArray<Position>;
  food: Position;
  direction: Direction;
  score: number;
  phase: GameStatus;
};
