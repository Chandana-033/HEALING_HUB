import { useState, useEffect } from 'react';

type Cell = 'X' | 'O' | null;

const lines = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

const checkWinner = (b: Cell[]): Cell | 'draw' | null => {
  for (const [a,b1,c] of lines) {
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
  }
  return b.every(Boolean) ? 'draw' : null;
};

const minimax = (b: Cell[], isMax: boolean): number => {
  const w = checkWinner(b);
  if (w === 'O') return 1;
  if (w === 'X') return -1;
  if (w === 'draw') return 0;
  let best = isMax ? -Infinity : Infinity;
  for (let i = 0; i < 9; i++) {
    if (!b[i]) {
      b[i] = isMax ? 'O' : 'X';
      const score = minimax(b, !isMax);
      b[i] = null;
      best = isMax ? Math.max(best, score) : Math.min(best, score);
    }
  }
  return best;
};

const aiMove = (b: Cell[]): number => {
  let best = -Infinity, move = -1;
  for (let i = 0; i < 9; i++) {
    if (!b[i]) {
      b[i] = 'O';
      const s = minimax(b, false);
      b[i] = null;
      if (s > best) { best = s; move = i; }
    }
  }
  return move;
};

const TicTacToeGame = () => {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<'X' | 'O'>('X');
  const winner = checkWinner(board);

  useEffect(() => {
    if (turn === 'O' && !winner) {
      const t = setTimeout(() => {
        const m = aiMove([...board]);
        if (m >= 0) {
          const next = [...board];
          next[m] = 'O';
          setBoard(next);
          setTurn('X');
        }
      }, 400);
      return () => clearTimeout(t);
    }
  }, [turn, board, winner]);

  const click = (i: number) => {
    if (board[i] || winner || turn !== 'X') return;
    const next = [...board];
    next[i] = 'X';
    setBoard(next);
    setTurn('O');
  };

  const reset = () => { setBoard(Array(9).fill(null)); setTurn('X'); };

  const status = winner === 'X' ? '🎉 You win!'
    : winner === 'O' ? '🤖 AI wins'
    : winner === 'draw' ? "It's a draw"
    : turn === 'X' ? 'Your turn (X)' : 'AI thinking…';

  return (
    <div className="space-y-4">
      <p className="text-center text-sm font-semibold text-foreground">{status}</p>
      <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto aspect-square">
        {board.map((c, i) => (
          <button
            key={i}
            onClick={() => click(i)}
            className="rounded-xl bg-card border border-border text-3xl font-bold font-heading text-primary hover:bg-secondary transition-all"
          >
            {c}
          </button>
        ))}
      </div>
      <div className="flex justify-center">
        <button onClick={reset} className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:-translate-y-0.5 transition-all">
          New Game
        </button>
      </div>
    </div>
  );
};

export default TicTacToeGame;