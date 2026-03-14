import { memo } from "react";

type CellProps = {
  isHead: boolean;
  isBody: boolean;
  isFood: boolean;
};

const Cell = memo(function Cell({ isHead, isBody, isFood }: CellProps) {
  if (isHead)
    return <div className="h-6 w-6 bg-emerald-400 rounded-sm shadow-sm shadow-emerald-400/50" />;
  if (isBody) return <div className="h-6 w-6 bg-emerald-600 rounded-sm" />;
  if (isFood)
    return (
      <div className="h-6 w-6 flex items-center justify-center">
        <div className="h-4 w-4 bg-blue-400 rounded-full shadow-sm shadow-blue-400/60" />
      </div>
    );
  return <div className="h-6 w-6 bg-zinc-800/50 rounded-sm" />;
});

export { Cell };
