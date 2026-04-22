import { useEffect, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { motion, AnimatePresence } from 'framer-motion';

interface GratitudeEntry {
  id: string;
  text: string;
  date: string; // YYYY-MM-DD
  flower: string;
}

const STORAGE_KEY = 'healingHub_gratitudeGarden';
const FLOWERS = ['🌸', '🌷', '🌼', '🌻', '🌹', '🪷', '💐', '🌺', '🌿', '🍀'];

const todayStr = () => new Date().toISOString().slice(0, 10);

const loadEntries = (): GratitudeEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveEntries = (entries: GratitudeEntry[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

const PROMPTS = [
  'A small moment that made you smile today…',
  'A person you appreciate right now…',
  'Something your body did well for you today…',
  'A comfort you sometimes take for granted…',
  'A tiny win from the last 24 hours…',
  'Something in nature that caught your eye…',
];

const GratitudeGardenPage = () => {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [text, setText] = useState('');
  const [prompt, setPrompt] = useState(PROMPTS[0]);

  useEffect(() => {
    setEntries(loadEntries());
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  }, []);

  const addEntry = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const entry: GratitudeEntry = {
      id: Date.now().toString(),
      text: trimmed,
      date: todayStr(),
      flower: FLOWERS[Math.floor(Math.random() * FLOWERS.length)],
    };
    const next = [entry, ...entries];
    setEntries(next);
    saveEntries(next);
    setText('');
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  };

  const removeEntry = (id: string) => {
    const next = entries.filter(e => e.id !== id);
    setEntries(next);
    saveEntries(next);
  };

  const todayCount = entries.filter(e => e.date === todayStr()).length;
  const uniqueDays = new Set(entries.map(e => e.date)).size;
  const totalFlowers = entries.length;

  return (
    <PageLayout>
      <section className="min-h-[80vh] px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <div className="glass-card p-8 text-center">
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
              Gratitude Garden 🌷
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Each thing you're grateful for plants a flower in your garden. Watch it bloom over time.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Today', value: todayCount },
              { label: 'Days tended', value: uniqueDays },
              { label: 'Flowers', value: totalFlowers },
            ].map(s => (
              <div key={s.label} className="glass-card p-4 text-center">
                <p className="text-2xl font-heading font-bold text-primary">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Add entry */}
          <div className="glass-card p-6 space-y-3">
            <p className="text-sm italic text-botanical-dark">{prompt}</p>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="I'm grateful for…"
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-botanical-glow resize-none"
            />
            <div className="flex justify-end">
              <button
                onClick={addEntry}
                disabled={!text.trim()}
                className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Plant 🌱
              </button>
            </div>
          </div>

          {/* Garden visual */}
          {entries.length > 0 && (
            <div className="glass-card p-6">
              <h2 className="font-heading text-lg font-semibold text-foreground mb-3 text-center">
                Your Garden
              </h2>
              <div className="flex flex-wrap gap-2 justify-center text-3xl min-h-[60px]">
                <AnimatePresence>
                  {entries.map((e) => (
                    <motion.span
                      key={e.id}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      title={e.text}
                    >
                      {e.flower}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Recent entries */}
          {entries.length > 0 && (
            <div className="glass-card p-6">
              <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
                Recent Reflections
              </h2>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {entries.slice(0, 20).map(e => (
                  <div
                    key={e.id}
                    className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border"
                  >
                    <span className="text-2xl">{e.flower}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground break-words">{e.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">{e.date}</p>
                    </div>
                    <button
                      onClick={() => removeEntry(e.id)}
                      className="text-muted-foreground hover:text-destructive text-sm transition-colors"
                      aria-label="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default GratitudeGardenPage;