import { useState } from 'react';

const newTarget = () => Math.floor(Math.random() * 100) + 1;

const GuessingGame = () => {
  const [target, setTarget] = useState(newTarget);
  const [guess, setGuess] = useState('');
  const [history, setHistory] = useState<{ value: number; hint: string }[]>([]);
  const [won, setWon] = useState(false);

  const submit = () => {
    const n = parseInt(guess, 10);
    if (isNaN(n) || n < 1 || n > 100) return;
    let hint = '';
    if (n === target) { hint = '🎯 Correct!'; setWon(true); }
    else if (n < target) hint = '↑ Higher';
    else hint = '↓ Lower';
    setHistory(h => [{ value: n, hint }, ...h]);
    setGuess('');
  };

  const reset = () => {
    setTarget(newTarget());
    setHistory([]);
    setWon(false);
    setGuess('');
  };

  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-muted-foreground">
        I'm thinking of a number between <strong>1 and 100</strong>. Can you guess it?
      </p>
      {!won && (
        <div className="flex gap-2">
          <input
            type="number"
            min={1}
            max={100}
            value={guess}
            onChange={e => setGuess(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="1–100"
            className="flex-1 px-4 py-2.5 rounded-full bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-botanical-glow"
          />
          <button onClick={submit} className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:-translate-y-0.5 transition-all">
            Guess
          </button>
        </div>
      )}
      {won && (
        <div className="text-center p-4 bg-botanical-glow/20 rounded-xl">
          <p className="font-semibold text-lg text-foreground">🎉 You got it in {history.length} {history.length === 1 ? 'try' : 'tries'}!</p>
        </div>
      )}
      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {history.map((h, i) => (
          <div key={i} className="flex justify-between items-center px-4 py-2 bg-card rounded-lg border border-border text-sm">
            <span className="font-semibold text-foreground">{h.value}</span>
            <span className="text-muted-foreground">{h.hint}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <button onClick={reset} className="px-5 py-2 rounded-full bg-secondary text-foreground text-sm font-semibold hover:-translate-y-0.5 transition-all">
          New Game
        </button>
      </div>
    </div>
  );
};

export default GuessingGame;