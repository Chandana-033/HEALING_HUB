import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { motion, AnimatePresence } from 'framer-motion';

const factDatabase: Record<string, string[]> = {
  animals: [
    "Octopuses have three hearts: two pump blood through the gills, while the third pumps it through the body.",
    "A sloth can hold its breath for up to 40 minutes underwater.",
    "Flamingos are naturally white; their diet of brine shrimp and algae turns them pink.",
    "Dolphins give each other names and will respond when called by their specific whistles.",
    "Elephants are the only mammals that cannot jump.",
    "The hummingbird is the only bird that can fly backwards.",
    "Pigs can get sunburned, and they roll in mud to cool off and protect themselves.",
    "Cows have best friends and get stressed when separated from them!",
    "Dogs developed puppy eyes to manipulate humans!",
    "Polar bears have black skin under their white fur!",
  ],
  space: [
    "A year on Neptune lasts 165 Earth years.",
    "If you could put Saturn in water, it would float.",
    "The Sun makes up 99.86% of the mass in our solar system.",
    "There are more stars in the universe than grains of sand on all the beaches on Earth.",
    "A Day on Venus is Longer Than a Year on Venus!",
    "The Moon is slowly moving away from Earth at a rate of about 3.8 cm per year.",
    "Space is completely silent as there is no atmosphere to carry sound waves.",
    "The largest volcano in our solar system is Olympus Mons on Mars.",
  ],
  history: [
    "The shortest war in history was between Britain and Zanzibar in 1896, lasting only 38 minutes.",
    "Cleopatra lived closer in time to the invention of the iPhone than to the building of the pyramids.",
    "Oxford University is older than the Aztec Empire.",
    "Pirates wore eye patches to keep one eye adjusted to darkness for below-deck activities.",
    "Scotland's national animal is the unicorn, a purely fictional creature!",
    "Napoleon was once attacked by thousands of rabbits.",
  ],
  science: [
    "If you remove all the empty space from atoms, all of humanity would fit into a sugar cube.",
    "A teaspoonful of neutron star would weigh about 6 billion tons.",
    "A bolt of lightning is five times hotter than the surface of the sun.",
    "The human brain can store 2.5 petabytes of information.",
    "Humans share 50% of their DNA with bananas.",
    "No number spelled out before one thousand contains the letter 'A'!",
    "Bananas are berries, but strawberries are not!",
  ],
  random: [
    "The inventor of the Pringles can is buried in one.",
    "A 'jiffy' is an actual unit of time: 1/100th of a second.",
    "The dot over the letter 'i' is called a tittle.",
    "The Hawaiian alphabet has only 12 letters.",
    "Allodoxaphobia is the fear of opinions!",
    "Earth has a waistline!",
    "Mosquitoes are attracted to people who just ate bananas!",
  ],
};

const categories = Object.keys(factDatabase);

const FactsPage = () => {
  const [category, setCategory] = useState('animals');
  const [index, setIndex] = useState(0);
  const facts = factDatabase[category];

  const next = () => setIndex((i) => (i + 1) % facts.length);
  const prev = () => setIndex((i) => (i - 1 + facts.length) % facts.length);

  const switchCategory = (cat: string) => {
    setCategory(cat);
    setIndex(0);
  };

  return (
    <PageLayout>
      <section className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="glass-card max-w-xl w-full p-8">
          <div className="text-center mb-6">
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
              Unlimited Facts
            </h1>
            <p className="text-sm text-muted-foreground">
              Swipe or click to discover amazing facts about our world!
            </p>
          </div>

          {/* Category buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => switchCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm capitalize transition-all border ${
                  category === cat
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border text-muted-foreground hover:bg-secondary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Fact display */}
          <div className="relative h-48 flex items-center justify-center mb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${category}-${index}`}
                initial={{ opacity: 0, rotateX: -90, y: 30 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                exit={{ opacity: 0, rotateX: 90, y: -30 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center p-6 rounded-xl bg-card text-center text-base text-foreground leading-relaxed"
                style={{ boxShadow: '0 5px 15px rgba(0,0,0,0.08)' }}
              >
                <span className="absolute top-2 right-3 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                {facts[index]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress */}
          <div className="w-full h-1.5 bg-secondary rounded-full mb-5 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${((index + 1) / facts.length) * 100}%` }}
            />
          </div>

          {/* Nav buttons */}
          <div className="flex justify-between">
            <button onClick={prev} className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-semibold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5">
              Previous
            </button>
            <button onClick={next} className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-semibold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5">
              Next
            </button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default FactsPage;
