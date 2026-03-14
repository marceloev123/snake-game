export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export type Position = { x: number; y: number };

export type NonEmptyArray<T> = [T, ...T[]];

export type GameStatus = "WIN" | "LOST" | "PLAYING";

export const GAME_STATUS = {
  PLAYING: "PLAYING",
  WIN: "WIN",
  LOST: "LOST",
} as const satisfies Record<GameStatus, GameStatus>;

export type GameState = {
  gridSize: number;
  snake: NonEmptyArray<Position>;
  food: Position;
  direction: Direction;
  score: number;
  phase: GameStatus;
};
