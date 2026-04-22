import { useState, useEffect } from 'react';

// 3x3 sliding puzzle (8-puzzle)
const SIZE = 3;
const goal = [1, 2, 3, 4, 5, 6, 7, 8, 0];

const shuffle = (): number[] => {
  const arr = [...goal];
  // do random valid moves to ensure solvable
  let empty = arr.indexOf(0);
  for (let i = 0; i < 80; i++) {
    const moves: number[] = [];
    const r = Math.floor(empty / SIZE), c = empty % SIZE;
    if (r > 0) moves.push(empty - SIZE);
    if (r < SIZE - 1) moves.push(empty + SIZE);
    if (c > 0) moves.push(empty - 1);
    if (c < SIZE - 1) moves.push(empty + 1);
    const m = moves[Math.floor(Math.random() * moves.length)];
    [arr[empty], arr[m]] = [arr[m], arr[empty]];
    empty = m;
  }
  return arr;
};

const PuzzleGame = () => {
  const [tiles, setTiles] = useState<number[]>(() => shuffle());
  const [moves, setMoves] = useState(0);
  const won = tiles.every((v, i) => v === goal[i]);

  const click = (idx: number) => {
    if (won) return;
    const empty = tiles.indexOf(0);
    const r1 = Math.floor(idx / SIZE), c1 = idx % SIZE;
    const r2 = Math.floor(empty / SIZE), c2 = empty % SIZE;
    if (Math.abs(r1 - r2) + Math.abs(c1 - c2) !== 1) return;
    const next = [...tiles];
    [next[idx], next[empty]] = [next[empty], next[idx]];
    setTiles(next);
    setMoves(m => m + 1);
  };

  const reset = () => { setTiles(shuffle()); setMoves(0); };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Slide tiles to order 1–8</span>
        <span className="font-semibold text-primary">Moves: {moves}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 max-w-[280px] mx-auto aspect-square">
        {tiles.map((v, i) => (
          <button
            key={i}
            onClick={() => click(i)}
            className={`rounded-xl text-2xl font-bold font-heading transition-all ${
              v === 0
                ? 'bg-transparent'
                : 'bg-primary text-primary-foreground hover:scale-95 shadow-md'
            }`}
          >
            {v !== 0 && v}
          </button>
        ))}
      </div>
      {won && (
        <p className="text-center text-lg font-semibold text-botanical-dark">🎉 Solved in {moves} moves!</p>
      )}
      <div className="flex justify-center">
        <button onClick={reset} className="px-5 py-2 rounded-full bg-secondary text-foreground text-sm font-semibold hover:-translate-y-0.5 transition-all">
          Shuffle / Reset
        </button>
      </div>
    </div>
  );
};

export default PuzzleGame;