import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { motion } from 'framer-motion';

const emotionCategories = [
  {
    name: 'Anxious',
    icon: '😰',
    gradient: 'from-blue-400 to-blue-600',
    color: '#4169E1',
    tracks: ['Calm Waves', 'Gentle Rain', 'Forest Ambience'],
  },
  {
    name: 'Lonely',
    icon: '🥺',
    gradient: 'from-purple-400 to-purple-600',
    color: '#9370DB',
    tracks: ['Warm Embrace', 'Soft Piano', 'Evening Stars'],
  },
  {
    name: 'Motivated',
    icon: '💪',
    gradient: 'from-orange-400 to-red-500',
    color: '#FF4500',
    tracks: ['Rise Up', 'Power Walk', 'Morning Energy'],
  },
  {
    name: 'Happy',
    icon: '😊',
    gradient: 'from-yellow-400 to-amber-500',
    color: '#FFD700',
    tracks: ['Sunshine Melody', 'Dancing Light', 'Joyful Hearts'],
  },
  {
    name: 'Sad',
    icon: '😢',
    gradient: 'from-blue-500 to-indigo-600',
    color: '#6495ED',
    tracks: ['Healing Tones', 'Gentle Comfort', 'Quiet Strength'],
  },
  {
    name: 'Focused',
    icon: '🎯',
    gradient: 'from-violet-500 to-purple-700',
    color: '#8A2BE2',
    tracks: ['Deep Focus', 'Alpha Waves', 'Study Flow'],
  },
];

const TuneInPage = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);

  const selectedCategory = emotionCategories.find(c => c.name === selected);

  return (
    <PageLayout>
      <section className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="glass-card max-w-xl w-full p-10 text-center">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-8">
            Tune In 🎵
          </h1>

          <p className="text-sm text-muted-foreground mb-6">
            Choose how you're feeling. We'll play music that matches.
          </p>

          {/* Emotion categories */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {emotionCategories.map((cat, i) => (
              <motion.button
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => { setSelected(cat.name); setPlaying(null); }}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all shadow-md hover:-translate-y-1 hover:shadow-lg border-none cursor-pointer ${
                  selected === cat.name ? 'ring-2 ring-botanical-dark scale-105' : ''
                }`}
                style={{
                  background: `linear-gradient(135deg, ${cat.color}dd, ${cat.color}88)`,
                  color: ['Happy', 'Relaxed'].includes(cat.name) ? '#333' : '#fff',
                }}
              >
                {cat.icon} {cat.name}
              </motion.button>
            ))}
          </div>

          {/* Track list */}
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl"
              style={{
                background: 'hsla(270, 30%, 97%, 0.7)',
                border: '1px solid hsla(135, 25%, 75%, 0.3)',
              }}
            >
              <p className="text-sm font-semibold text-foreground mb-4">
                {selectedCategory.icon} {selectedCategory.name} Tracks
              </p>
              <div className="space-y-3">
                {selectedCategory.tracks.map((track) => (
                  <button
                    key={track}
                    onClick={() => setPlaying(track)}
                    className={`w-full p-3 rounded-xl text-left text-sm transition-all border cursor-pointer ${
                      playing === track
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card border-border text-foreground hover:bg-secondary'
                    }`}
                  >
                    {playing === track ? '▶ ' : '♪ '}{track}
                  </button>
                ))}
              </div>

              {playing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-3 rounded-xl bg-card text-sm text-center text-botanical-dark font-medium"
                >
                  🎶 Now Playing: {playing}
                  <p className="text-xs text-muted-foreground mt-1">
                    (Audio files would be loaded from your media folder)
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default TuneInPage;
