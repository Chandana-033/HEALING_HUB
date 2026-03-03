import PageLayout from '@/components/PageLayout';
import { motion } from 'framer-motion';

const games = [
  { icon: '🧩', title: 'Riddles', desc: 'Solve mind-bending riddles that test your logical thinking and creativity.' },
  { icon: '🧠', title: 'Puzzles', desc: 'Challenge yourself with puzzles designed to exercise different parts of your brain.' },
  { icon: '🎯', title: 'Guessing Games', desc: 'Test your intuition and knowledge with fun guessing challenges.' },
  { icon: '⭕', title: 'Tic Tac Toe', desc: 'Play the classic game of X\'s and O\'s against a challenging AI opponent.' },
  { icon: '🔢', title: 'Sudoku', desc: 'Fill the grid with numbers in this popular logic-based number placement puzzle.' },
];

const BrainTeasersPage = () => (
  <PageLayout>
    <section className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="glass-card max-w-4xl w-full p-8 text-center">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Brain Teasers</h1>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          Challenge your mind and boost your cognitive abilities with these entertaining brain teasers and puzzles.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {games.map((game, i) => (
            <motion.div
              key={game.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-hover p-6 cursor-pointer flex flex-col items-center gap-3"
            >
              <span className="text-4xl p-3 bg-secondary rounded-xl">{game.icon}</span>
              <h3 className="font-heading text-lg font-semibold text-foreground">{game.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{game.desc}</p>
              <button className="mt-auto px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold cursor-pointer border-none transition-all hover:-translate-y-0.5">
                Start Playing
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default BrainTeasersPage;
