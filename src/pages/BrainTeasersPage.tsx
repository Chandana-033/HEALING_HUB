import PageLayout from '@/components/PageLayout';
import { motion } from 'framer-motion';
import { useState } from 'react';
import RiddlesGame from '@/components/games/RiddlesGame';
import PuzzleGame from '@/components/games/PuzzleGame';
import GuessingGame from '@/components/games/GuessingGame';
import TicTacToeGame from '@/components/games/TicTacToeGame';
import SudokuGame from '@/components/games/SudokuGame';

type GameKey = 'riddles' | 'puzzle' | 'guess' | 'ttt' | 'sudoku';

const games: { key: GameKey; icon: string; title: string; desc: string }[] = [
  { key: 'riddles', icon: '🧩', title: 'Riddles', desc: 'Solve mind-bending riddles that test your logical thinking and creativity.' },
  { key: 'puzzle',  icon: '🧠', title: 'Sliding Puzzle', desc: 'Slide tiles into order — a calming brain workout.' },
  { key: 'guess',   icon: '🎯', title: 'Guess the Number', desc: 'Use higher/lower hints to find the secret number.' },
  { key: 'ttt',     icon: '⭕', title: 'Tic Tac Toe', desc: 'Play X\'s and O\'s against a thoughtful AI opponent.' },
  { key: 'sudoku',  icon: '🔢', title: 'Mini Sudoku', desc: 'A gentle 4×4 sudoku — perfect for a focused pause.' },
];

const renderGame = (key: GameKey) => {
  switch (key) {
    case 'riddles': return <RiddlesGame />;
    case 'puzzle':  return <PuzzleGame />;
    case 'guess':   return <GuessingGame />;
    case 'ttt':     return <TicTacToeGame />;
    case 'sudoku':  return <SudokuGame />;
  }
};

const BrainTeasersPage = () => {
  const [active, setActive] = useState<GameKey | null>(null);
  const activeGame = games.find(g => g.key === active);

  return (
    <PageLayout>
      <section className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="glass-card max-w-4xl w-full p-8">
          {!active ? (
            <>
              <div className="text-center">
                <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Brain Teasers</h1>
                <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                  Challenge your mind with these calming puzzles and games — pick one to play.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {games.map((game, i) => (
                  <motion.div
                    key={game.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="glass-card-hover p-6 flex flex-col items-center gap-3 text-center"
                  >
                    <span className="text-4xl p-3 bg-secondary rounded-xl">{game.icon}</span>
                    <h3 className="font-heading text-lg font-semibold text-foreground">{game.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{game.desc}</p>
                    <button
                      onClick={() => setActive(game.key)}
                      className="mt-auto px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold cursor-pointer border-none transition-all hover:-translate-y-0.5"
                    >
                      Start Playing
                    </button>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setActive(null)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← All games
                </button>
                <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                  <span>{activeGame?.icon}</span> {activeGame?.title}
                </h2>
                <span className="w-20" />
              </div>
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {renderGame(active)}
              </motion.div>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default BrainTeasersPage;
