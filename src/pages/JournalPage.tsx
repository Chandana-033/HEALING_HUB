import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { motion } from 'framer-motion';
import {
  monitorMentalSafety, triggerSafetyAlert, getCBTResponse,
  getJournalEntries, saveJournalEntries, getMoodData, saveMoodData,
  type JournalEntry,
} from '@/lib/wellness-logic';
import { toast } from 'sonner';

const moods = ['😊 Happy', '😌 Calm', '😐 Neutral', '😔 Sad', '😠 Angry'];
const moodScores: Record<string, number> = { '😊 Happy': 5, '😌 Calm': 4, '😐 Neutral': 3, '😔 Sad': 2, '😠 Angry': 1 };

const JournalPage = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [search, setSearch] = useState('');
  const [cbtMessage, setCbtMessage] = useState<string | null>(null);

  useEffect(() => {
    setEntries(getJournalEntries());
  }, []);

  const save = () => {
    if (!title.trim() || !content.trim()) {
      toast('Please fill in both title and content');
      return;
    }

    // Safety check
    if (monitorMentalSafety(content) || monitorMentalSafety(title)) {
      triggerSafetyAlert();
    }

    // CBT check
    const cbt = getCBTResponse(content);
    if (cbt) setCbtMessage(cbt);

    const now = new Date().toISOString();
    let updated: JournalEntry[];

    if (currentId) {
      updated = entries.map(e => e.id === currentId ? { ...e, title, content, mood, date: now } : e);
    } else {
      const newEntry: JournalEntry = { id: Date.now().toString(), title, content, mood, date: now };
      updated = [newEntry, ...entries];
      setCurrentId(newEntry.id);
    }

    setEntries(updated);
    saveJournalEntries(updated);

    // Save mood data
    if (mood) {
      const moodData = getMoodData();
      moodData.push({ date: now, mood, score: moodScores[mood] || 3 });
      saveMoodData(moodData);
    }

    toast('Entry saved!');
  };

  const loadEntry = (entry: JournalEntry) => {
    setCurrentId(entry.id);
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood);
    setCbtMessage(null);
  };

  const newEntry = () => {
    setCurrentId(null);
    setTitle('');
    setContent('');
    setMood('');
    setCbtMessage(null);
  };

  const deleteEntry = () => {
    if (!currentId) return;
    const updated = entries.filter(e => e.id !== currentId);
    setEntries(updated);
    saveJournalEntries(updated);
    newEntry();
    toast('Entry deleted');
  };

  const filtered = entries.filter(e =>
    !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.content.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <PageLayout>
      <section className="px-4 py-12 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground">Soul Scribbles</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Entries sidebar */}
          <div className="md:w-80 shrink-0">
            <div className="glass-card p-5">
              <h2 className="font-heading text-lg font-semibold text-foreground mb-4 pb-2 border-b border-primary/20">My Entries</h2>
              <input
                type="text"
                placeholder="Search entries..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-card border border-border text-sm text-foreground mb-4 focus:outline-none focus:ring-2 focus:ring-botanical-glow"
              />
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filtered.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-6">No entries yet. Start writing!</p>
                )}
                {filtered.map(entry => (
                  <div
                    key={entry.id}
                    onClick={() => loadEntry(entry)}
                    className={`p-3 rounded-xl cursor-pointer transition-all text-left border-l-[3px] ${
                      currentId === entry.id
                        ? 'bg-primary/15 border-l-primary'
                        : 'bg-card/50 border-l-primary/30 hover:bg-primary/5'
                    }`}
                  >
                    <p className="text-sm font-semibold text-foreground truncate">{entry.mood ? entry.mood + ' ' : ''}{entry.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(entry.date)}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{entry.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1">
            <div className="glass-card p-6">
              <h2 className="font-heading text-lg font-semibold text-foreground mb-4 pb-2 border-b border-primary/20">
                {currentId ? 'Edit Entry' : 'Write Today\'s Entry'}
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Give your entry a title..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-botanical-glow"
                />

                <div>
                  <label className="text-sm font-semibold text-muted-foreground block mb-2">How are you feeling?</label>
                  <div className="flex flex-wrap gap-2">
                    {moods.map(m => (
                      <button
                        key={m}
                        onClick={() => setMood(m)}
                        className={`px-3 py-1.5 rounded-full text-sm cursor-pointer border-none transition-all ${
                          mood === m ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-foreground hover:bg-primary/20'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  placeholder="Write your thoughts here..."
                  value={content}
                  onChange={e => {
                    setContent(e.target.value);
                    // Live CBT detection
                    const cbt = getCBTResponse(e.target.value);
                    if (cbt) setCbtMessage(cbt);
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground min-h-[250px] resize-y focus:outline-none focus:ring-2 focus:ring-botanical-glow"
                />

                {/* CBT Response */}
                {cbtMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl"
                    style={{ background: 'hsla(135, 25%, 75%, 0.2)', border: '1px solid hsla(135, 25%, 75%, 0.4)' }}
                  >
                    <p className="text-sm font-semibold text-botanical-dark mb-1">💚 A gentle thought for you:</p>
                    <p className="text-sm text-foreground leading-relaxed">{cbtMessage}</p>
                  </motion.div>
                )}

                <div className="flex flex-wrap gap-3">
                  <button onClick={save} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold cursor-pointer border-none transition-all hover:-translate-y-0.5">
                    Save Entry
                  </button>
                  <button onClick={newEntry} className="px-6 py-2.5 rounded-lg bg-transparent text-foreground font-semibold cursor-pointer border border-primary transition-all hover:bg-primary/10">
                    New Entry
                  </button>
                  {currentId && (
                    <button onClick={deleteEntry} className="px-6 py-2.5 rounded-lg bg-destructive text-destructive-foreground font-semibold cursor-pointer border-none transition-all hover:-translate-y-0.5">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default JournalPage;
