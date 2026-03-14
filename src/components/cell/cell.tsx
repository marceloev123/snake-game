import { memo } from "react";
import "./cell.css";

type CellProps = {
  isHead: boolean;
  isBody: boolean;
  isFood: boolean;
};

const Cell = memo(function Cell({ isHead, isBody, isFood }: CellProps) {
  if (isHead) return <div className="cell-head" />;
  if (isBody) return <div className="cell-body" />;
  if (isFood)
    return (
      <div className="cell-food">
        <div className="cell-food-dot" />
      </div>
    );
  return <div className="cell-empty" />;
});

export { Cell };
