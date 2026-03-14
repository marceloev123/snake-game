import { useEffect, useLayoutEffect, useRef } from "react";
import type { Direction } from "../lib/game";

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: "UP",
  ArrowDown: "DOWN",
  ArrowLeft: "LEFT",
  ArrowRight: "RIGHT",
};

export function useArrowKeys(onDirection: (direction: Direction) => void): void {
  const onDirectionRef = useRef(onDirection);

  useLayoutEffect(() => {
    onDirectionRef.current = onDirection;
  });

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const direction = KEY_TO_DIRECTION[event.key];
      if (!direction) return;
      event.preventDefault();
      onDirectionRef.current(direction);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);
}
