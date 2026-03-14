import { describe, it, expect } from "vitest";
import {
  positionKey,
  placeFood,
  createGame,
  canChangeDirection,
  changeDirection,
  stepGame,
} from "./game";
import type { Direction, GameState } from "./game";

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    gridSize: 5,
    snake: [{ x: 2, y: 2 }],
    food: { x: 0, y: 0 },
    direction: "RIGHT",
    score: 0,
    phase: "PLAYING",
    ...overrides,
  };
}

describe("positionKey", () => {
  it("formats position as 'x,y'", () => {
    expect(positionKey({ x: 3, y: 7 })).toBe("3,7");
    expect(positionKey({ x: 0, y: 0 })).toBe("0,0");
  });
});

describe("placeFood", () => {
  it("places food on a free cell", () => {
    const snake = [{ x: 2, y: 2 }];
    const food = placeFood(5, snake);
    expect(positionKey(food)).not.toBe("2,2");
  });

  it("never places food on any snake segment", () => {
    const snake = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ];
    for (let i = 0; i < 50; i++) {
      const food = placeFood(5, snake);
      expect(snake.some((s) => positionKey(s) === positionKey(food))).toBe(false);
    }
  });

  it("throws when no free cells remain", () => {
    const snake = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ];
    expect(() => placeFood(2, snake)).toThrow("No free cell available for food");
  });

  it("respects the randomize parameter", () => {
    const snake = [{ x: 0, y: 0 }];
    const food = placeFood(3, snake, () => 0);
    expect(food).toEqual({ x: 1, y: 0 });
  });
});

describe("createGame", () => {
  it("places the snake at the grid center", () => {
    const state = createGame(5);
    expect(state.snake).toEqual([{ x: 2, y: 2 }]);
  });

  it("starts with score 0, direction RIGHT, phase PLAYING", () => {
    const state = createGame(5);
    expect(state.score).toBe(0);
    expect(state.direction).toBe("RIGHT");
    expect(state.phase).toBe("PLAYING");
  });

  it("food does not overlap the snake", () => {
    const state = createGame(5);
    expect(positionKey(state.food)).not.toBe(positionKey(state.snake[0]));
  });
});

describe("canChangeDirection", () => {
  it("allows perpendicular turns", () => {
    expect(canChangeDirection("RIGHT", "UP", 3)).toBe(true);
    expect(canChangeDirection("UP", "LEFT", 3)).toBe(true);
  });

  it("rejects same direction", () => {
    expect(canChangeDirection("RIGHT", "RIGHT", 1)).toBe(false);
  });

  it("rejects 180-degree turn when snake length > 1", () => {
    expect(canChangeDirection("RIGHT", "LEFT", 2)).toBe(false);
    expect(canChangeDirection("UP", "DOWN", 5)).toBe(false);
  });

  it("allows 180-degree turn when snake has length 1", () => {
    expect(canChangeDirection("RIGHT", "LEFT", 1)).toBe(true);
  });
});

describe("changeDirection", () => {
  it("updates direction on a valid turn", () => {
    const state = makeState({ direction: "RIGHT" });
    expect(changeDirection(state, "UP").direction).toBe("UP");
  });

  it("ignores invalid turns", () => {
    const state = makeState({
      direction: "RIGHT",
      snake: [
        { x: 2, y: 2 },
        { x: 1, y: 2 },
      ],
    });
    expect(changeDirection(state, "LEFT").direction).toBe("RIGHT");
  });

  it("is a no-op when phase is not PLAYING", () => {
    const state = makeState({ phase: "LOST" });
    expect(changeDirection(state, "UP")).toBe(state);
  });
});

describe("stepGame", () => {
  it("moves the snake head in the current direction", () => {
    const state = makeState({ direction: "RIGHT", snake: [{ x: 2, y: 2 }] });
    const next = stepGame(state);
    expect(next.snake[0]).toEqual({ x: 3, y: 2 });
  });

  it("keeps the snake at the same length when not eating", () => {
    const state = makeState({ direction: "RIGHT", snake: [{ x: 2, y: 2 }] });
    const next = stepGame(state);
    expect(next.snake.length).toBe(1);
  });

  it("transitions to LOST on wall collision", () => {
    const state = makeState({ direction: "RIGHT", snake: [{ x: 4, y: 2 }] });
    expect(stepGame(state).phase).toBe("LOST");
  });

  it("transitions to LOST on self collision", () => {
    const state = makeState({
      direction: "UP",
      snake: [
        { x: 2, y: 2 },
        { x: 1, y: 2 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 3, y: 1 },
      ],
    });
    expect(stepGame(state).phase).toBe("LOST");
  });

  it("grows the snake and adds points when eating food", () => {
    const state = makeState({
      direction: "RIGHT",
      snake: [{ x: 2, y: 2 }],
      food: { x: 3, y: 2 },
      score: 0,
    });
    const next = stepGame(state);
    expect(next.snake.length).toBe(2);
    expect(next.score).toBe(3);
  });

  it("spawns new food after eating", () => {
    const state = makeState({
      direction: "RIGHT",
      snake: [{ x: 2, y: 2 }],
      food: { x: 3, y: 2 },
    });
    const next = stepGame(state);
    expect(positionKey(next.food)).not.toBe("3,2");
  });

  it("transitions to WIN when score reaches WIN_SCORE", () => {
    const state = makeState({
      direction: "RIGHT",
      snake: [{ x: 2, y: 2 }],
      food: { x: 3, y: 2 },
      score: 27,
    });
    expect(stepGame(state).phase).toBe("WIN");
  });

  it("is a no-op when phase is not PLAYING", () => {
    const state = makeState({ phase: "LOST" });
    expect(stepGame(state)).toBe(state);
  });

  it("all four directions move correctly", () => {
    const cases: [Direction, { x: number; y: number }][] = [
      ["UP", { x: 2, y: 1 }],
      ["DOWN", { x: 2, y: 3 }],
      ["LEFT", { x: 1, y: 2 }],
      ["RIGHT", { x: 3, y: 2 }],
    ];
    for (const [direction, expected] of cases) {
      const state = makeState({ direction, snake: [{ x: 2, y: 2 }] });
      expect(stepGame(state).snake[0]).toEqual(expected);
    }
  });
});
