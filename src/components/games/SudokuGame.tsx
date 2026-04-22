import { useState, useMemo } from 'react';

// Simple 4x4 sudoku — gentler & faster than 9x9 for a wellness app
type Grid = number[][];

const puzzles: { puzzle: Grid; solution: Grid }[] = [
  {
    puzzle: [[1,0,0,4],[0,0,1,0],[0,1,0,0],[4,0,0,3]],
    solution: [[1,3,2,4],[2,4,1,3],[3,1,4,2],[4,2,3,1]],
  },
  {
    puzzle: [[0,0,3,0],[3,0,0,2],[2,0,0,3],[0,3,0,0]],
    solution: [[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]],
  },
  {
    puzzle: [[0,4,0,0],[2,0,0,1],[1,0,0,2],[0,0,1,0]],
    solution: [[3,4,2,1],[2,1,4,3],[1,3,4,2],[4,2,1,3]],
  },
];

const SudokuGame = () => {
  const [pIdx, setPIdx] = useState(0);
  const { puzzle, solution } = puzzles[pIdx];
  const [grid, setGrid] = useState<Grid>(() => puzzle.map(r => [...r]));
  const fixed = useMemo(() => puzzle.map(r => r.map(v => v !== 0)), [puzzle]);

  const set = (r: number, c: number, v: number) => {
    if (fixed[r][c]) return;
    const next = grid.map(row => [...row]);
    next[r][c] = v;
    setGrid(next);
  };

  const isComplete = grid.every((row, r) => row.every((v, c) => v === solution[r][c]));
  const hasErrors = grid.some((row, r) => row.some((v, c) => v !== 0 && v !== solution[r][c]));

  const next = () => {
    const n = (pIdx + 1) % puzzles.length;
    setPIdx(n);
    setGrid(puzzles[n].puzzle.map(r => [...r]));
  };

  const reset = () => setGrid(puzzle.map(r => [...r]));

  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-muted-foreground">
        Fill so each row, column, and 2×2 box has 1–4.
      </p>
      <div className="grid grid-cols-4 gap-0.5 max-w-[260px] mx-auto bg-foreground/30 p-0.5 rounded-lg">
        {grid.map((row, r) =>
          row.map((v, c) => {
            const isFixed = fixed[r][c];
            const wrong = !isFixed && v !== 0 && v !== solution[r][c];
            const borderR = c === 1 ? 'mr-0.5' : '';
            const borderB = r === 1 ? 'mb-0.5' : '';
            return (
              <input
                key={`${r}-${c}`}
                value={v || ''}
                onChange={e => {
                  const n = parseInt(e.target.value.slice(-1), 10);
                  if (e.target.value === '') set(r, c, 0);
                  else if (n >= 1 && n <= 4) set(r, c, n);
                }}
                readOnly={isFixed}
                className={`aspect-square text-center text-xl font-bold font-heading rounded-sm focus:outline-none focus:ring-2 focus:ring-botanical-glow ${borderR} ${borderB} ${
                  isFixed
                    ? 'bg-secondary text-foreground cursor-not-allowed'
                    : wrong
                    ? 'bg-destructive/20 text-destructive'
                    : 'bg-card text-primary'
                }`}
              />
            );
          })
        )}
      </div>
      {isComplete && (
        <p className="text-center text-lg font-semibold text-botanical-dark">🌟 Puzzle solved!</p>
      )}
      {hasErrors && !isComplete && (
        <p className="text-center text-xs text-destructive">Some cells aren't quite right yet.</p>
      )}
      <div className="flex justify-center gap-2">
        <button onClick={reset} className="px-4 py-2 rounded-full bg-secondary text-foreground text-sm font-semibold hover:-translate-y-0.5 transition-all">
          Reset
        </button>
        <button onClick={next} className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:-translate-y-0.5 transition-all">
          New Puzzle
        </button>
      </div>
    </div>
  );
};

export default SudokuGame;