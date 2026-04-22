import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const riddles = [
  { q: "I speak without a mouth and hear without ears. I have no body, but come alive with the wind. What am I?", a: "echo" },
  { q: "The more you take, the more you leave behind. What am I?", a: "footsteps" },
  { q: "I'm tall when I'm young, and short when I'm old. What am I?", a: "candle" },
  { q: "What has keys but can't open locks?", a: "piano" },
  { q: "What has to be broken before you can use it?", a: "egg" },
  { q: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?", a: "map" },
  { q: "What gets wet while drying?", a: "towel" },
  { q: "What has a head and a tail but no body?", a: "coin" },
  { q: "The more of this there is, the less you see. What is it?", a: "darkness" },
  { q: "What can travel around the world while staying in a corner?", a: "stamp" },
];

const RiddlesGame = () => {
  const [i, setI] = useState(0);
  const [guess, setGuess] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const r = riddles[i];

  const submit = () => {
    if (!guess.trim()) return;
    if (guess.toLowerCase().trim().includes(r.a)) {
      setScore(s => s + 1);
      setFeedback('correct');
      setRevealed(true);
    } else {
      setFeedback('wrong');
    }
  };

  const next = () => {
    setI((i + 1) % riddles.length);
    setGuess('');
    setRevealed(false);
    setFeedback(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Riddle {i + 1} of {riddles.length}</span>
        <span className="font-semibold text-primary">Score: {score}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-6 bg-card rounded-xl border border-border min-h-[120px] flex items-center justify-center text-center"
        >
          <p className="text-base text-foreground leading-relaxed">{r.q}</p>
        </motion.div>
      </AnimatePresence>

      {!revealed && (
        <div className="flex gap-2">
          <input
            value={guess}
            onChange={e => setGuess(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="Your answer..."
            className="flex-1 px-4 py-2.5 rounded-full bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-botanical-glow"
          />
          <button onClick={submit} className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:-translate-y-0.5 transition-all">
            Guess
          </button>
        </div>
      )}

      {feedback === 'wrong' && !revealed && (
        <p className="text-center text-sm text-destructive">Not quite — try again or reveal.</p>
      )}

      {revealed && (
        <div className="text-center p-4 bg-botanical-glow/20 rounded-xl">
          <p className="text-sm text-muted-foreground">Answer:</p>
          <p className="font-semibold text-lg text-foreground capitalize">{r.a}</p>
        </div>
      )}

      <div className="flex justify-center gap-2">
        {!revealed && (
          <button onClick={() => setRevealed(true)} className="px-4 py-2 rounded-full bg-secondary text-foreground text-sm hover:-translate-y-0.5 transition-all">
            Reveal
          </button>
        )}
        <button onClick={next} className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:-translate-y-0.5 transition-all">
          Next Riddle →
        </button>
      </div>
    </div>
  );
};

export default RiddlesGame;