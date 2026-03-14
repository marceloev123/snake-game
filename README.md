# Snake Game

A classic Snake game built with React 19, TypeScript, and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js 24 or later
- pnpm 10 or later

### Install & Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
pnpm build
```

### Run Tests

```bash
pnpm test
```

## How to Play

- Press any **arrow key** to start the game and change direction
- The snake moves automatically every tick
- Eat the **blue food** to grow and earn **+3 points**
- Reach **30 points** to win
- Avoid hitting the **walls** or **yourself**

## Configuration

All gameplay constants are in `src/config.ts`:

| Constant           | Default | Description                  |
| ------------------ | ------- | ---------------------------- |
| `GRID_SIZE`        | `20`    | Board size (20 × 20 cells)   |
| `TICK_INTERVAL_MS` | `130`   | Snake speed in milliseconds  |
| `POINTS_PER_FOOD`  | `3`     | Points earned per food eaten |
| `WIN_SCORE`        | `30`    | Score required to win        |

## Assumptions

- The game starts on the first arrow key press to avoid the snake moving before the player is ready.
- Direction inputs are queued (up to 2) so fast key presses are not lost between ticks.
- A 180° turn is only blocked when the snake has more than one segment; a single-cell snake can reverse freely.
- The win condition ("score ≥ 30") is treated as a distinct **WIN** phase, separate from the **LOST** phase, so the overlay can show different messages for each outcome.
