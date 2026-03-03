import { useState, useMemo } from 'react';
import PageLayout from '@/components/PageLayout';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

// Lunar phase calculation
function getLunarPhase(date: Date): { name: string; emoji: string; illumination: number } {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Simplified lunar phase calculation (Trig method)
  const c = Math.floor(365.25 * year);
  const e = Math.floor(30.6 * month);
  const jd = c + e + day - 694039.09;
  const phase = jd / 29.53058867;
  const phaseNorm = phase - Math.floor(phase);

  const phases = [
    { name: 'New Moon', emoji: '🌑', range: [0, 0.0625] },
    { name: 'Waxing Crescent', emoji: '🌒', range: [0.0625, 0.1875] },
    { name: 'First Quarter', emoji: '🌓', range: [0.1875, 0.3125] },
    { name: 'Waxing Gibbous', emoji: '🌔', range: [0.3125, 0.4375] },
    { name: 'Full Moon', emoji: '🌕', range: [0.4375, 0.5625] },
    { name: 'Waning Gibbous', emoji: '🌖', range: [0.5625, 0.6875] },
    { name: 'Last Quarter', emoji: '🌗', range: [0.6875, 0.8125] },
    { name: 'Waning Crescent', emoji: '🌘', range: [0.8125, 1] },
  ];

  const found = phases.find(p => phaseNorm >= p.range[0] && phaseNorm < p.range[1]) || phases[0];
  return { ...found, illumination: Math.round(Math.abs(phaseNorm - 0.5) * 200) };
}

const STORAGE_KEY = 'healingHub_lunaMoodData';

interface LunaMoodEntry {
  date: string;
  mood: string;
  energy: number; // 1-5
  note: string;
  lunarPhase: string;
}

function getLunaMoodData(): LunaMoodEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function saveLunaMoodData(entries: LunaMoodEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

const moods = ['🌟 Radiant', '😊 Bright', '😌 Calm', '🌫️ Hazy', '🌧️ Low'];
const energyLabels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];

const LunaTrackerPage = () => {
  const [entries, setEntries] = useState<LunaMoodEntry[]>(getLunaMoodData);
  const [selectedMood, setSelectedMood] = useState('');
  const [energy, setEnergy] = useState(3);
  const [note, setNote] = useState('');
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const todayPhase = useMemo(() => getLunarPhase(new Date()), []);
  const todayKey = new Date().toISOString().split('T')[0];
  const todayEntry = entries.find(e => e.date === todayKey);

  const logMood = () => {
    if (!selectedMood) {
      toast('Please select a mood');
      return;
    }

    const entry: LunaMoodEntry = {
      date: todayKey,
      mood: selectedMood,
      energy,
      note,
      lunarPhase: `${todayPhase.emoji} ${todayPhase.name}`,
    };

    const updated = entries.filter(e => e.date !== todayKey);
    updated.push(entry);
    setEntries(updated);
    saveLunaMoodData(updated);
    toast('Moon mood logged! 🌙');
  };

  // Calendar generation
  const calendarDays = useMemo(() => {
    const { year, month } = viewMonth;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: { day: number; date: string; phase: ReturnType<typeof getLunarPhase>; entry?: LunaMoodEntry }[] = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const dateKey = dateObj.toISOString().split('T')[0];
      days.push({
        day: d,
        date: dateKey,
        phase: getLunarPhase(dateObj),
        entry: entries.find(e => e.date === dateKey),
      });
    }

    return { days, firstDay };
  }, [viewMonth, entries]);

  const monthName = new Date(viewMonth.year, viewMonth.month).toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const changeMonth = (delta: number) => {
    setViewMonth(prev => {
      let m = prev.month + delta;
      let y = prev.year;
      if (m < 0) { m = 11; y--; }
      if (m > 11) { m = 0; y++; }
      return { year: y, month: m };
    });
  };

  return (
    <PageLayout>
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Luna Tracker</h1>
          <p className="text-muted-foreground">Track your moods with the rhythm of the moon</p>
        </div>

        {/* Today's lunar phase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-8 text-center"
        >
          <div className="text-6xl mb-3">{todayPhase.emoji}</div>
          <h2 className="font-heading text-xl font-semibold text-foreground">{todayPhase.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {todayPhase.illumination}% illumination • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Log today's mood */}
          <div className="glass-card p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4 pb-2 border-b border-primary/20">
              {todayEntry ? '✏️ Update Today\'s Mood' : '🌙 Log Today\'s Moon Mood'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-muted-foreground block mb-2">How do you feel?</label>
                <div className="flex flex-wrap gap-2">
                  {moods.map(m => (
                    <button
                      key={m}
                      onClick={() => setSelectedMood(m)}
                      className={`px-3 py-1.5 rounded-full text-sm cursor-pointer border-none transition-all ${
                        selectedMood === m ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-foreground hover:bg-primary/20'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground block mb-2">
                  Energy Level: {energyLabels[energy - 1]}
                </label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={energy}
                  onChange={e => setEnergy(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  {energyLabels.map(l => <span key={l}>{l}</span>)}
                </div>
              </div>

              <textarea
                placeholder="Any reflections for today..."
                value={note}
                onChange={e => setNote(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground min-h-[80px] resize-y text-sm focus:outline-none focus:ring-2 focus:ring-botanical-glow"
              />

              <button
                onClick={logMood}
                className="w-full px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold cursor-pointer border-none transition-all hover:-translate-y-0.5"
              >
                {todayEntry ? 'Update Mood' : 'Log Mood'}
              </button>
            </div>
          </div>

          {/* Phase insights */}
          <div className="glass-card p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4 pb-2 border-b border-primary/20">
              🔮 Phase Insights
            </h2>
            <div className="space-y-3 text-sm text-foreground leading-relaxed">
              {todayPhase.name === 'New Moon' && (
                <p>🌑 <strong>New Moon</strong> — A time for new beginnings and intention setting. Reflect on what you want to manifest this cycle.</p>
              )}
              {todayPhase.name === 'Waxing Crescent' && (
                <p>🌒 <strong>Waxing Crescent</strong> — Your intentions are taking root. Focus on building habits and staying motivated.</p>
              )}
              {todayPhase.name === 'First Quarter' && (
                <p>🌓 <strong>First Quarter</strong> — A time of action and decision. Push through challenges with determination.</p>
              )}
              {todayPhase.name === 'Waxing Gibbous' && (
                <p>🌔 <strong>Waxing Gibbous</strong> — Refine and adjust. Your efforts are building toward fruition.</p>
              )}
              {todayPhase.name === 'Full Moon' && (
                <p>🌕 <strong>Full Moon</strong> — Peak energy and illumination. Celebrate accomplishments and release what no longer serves you.</p>
              )}
              {todayPhase.name === 'Waning Gibbous' && (
                <p>🌖 <strong>Waning Gibbous</strong> — Share your wisdom. Practice gratitude and give back.</p>
              )}
              {todayPhase.name === 'Last Quarter' && (
                <p>🌗 <strong>Last Quarter</strong> — Let go and forgive. Clear space for the next cycle.</p>
              )}
              {todayPhase.name === 'Waning Crescent' && (
                <p>🌘 <strong>Waning Crescent</strong> — Rest and surrender. Recharge before the new cycle begins.</p>
              )}

              <div className="mt-4 p-3 rounded-xl bg-card/50">
                <p className="text-xs text-muted-foreground mb-2">Recent entries by phase:</p>
                {entries.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No entries yet. Start logging to see patterns!</p>
                ) : (
                  <div className="space-y-1">
                    {entries.slice(-5).reverse().map((e, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span>{e.mood.split(' ')[0]}</span>
                        <span className="text-muted-foreground">{e.lunarPhase}</span>
                        <span className="text-muted-foreground ml-auto">{new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Calendar */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => changeMonth(-1)} className="px-3 py-1.5 rounded-lg bg-primary/10 text-foreground cursor-pointer border-none hover:bg-primary/20 transition-colors text-sm">
              ← Prev
            </button>
            <h2 className="font-heading text-lg font-semibold text-foreground">{monthName}</h2>
            <button onClick={() => changeMonth(1)} className="px-3 py-1.5 rounded-lg bg-primary/10 text-foreground cursor-pointer border-none hover:bg-primary/20 transition-colors text-sm">
              Next →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-xs font-semibold text-muted-foreground py-2">{d}</div>
            ))}

            {/* Empty cells for offset */}
            {Array.from({ length: calendarDays.firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {calendarDays.days.map(({ day, date, phase, entry }) => (
              <div
                key={date}
                className={`relative p-1.5 rounded-lg text-center transition-all min-h-[60px] flex flex-col items-center justify-center gap-0.5 ${
                  date === todayKey
                    ? 'bg-primary/20 ring-2 ring-primary/40'
                    : entry
                    ? 'bg-accent/20'
                    : 'bg-card/30 hover:bg-card/50'
                }`}
              >
                <span className="text-xs font-medium text-foreground">{day}</span>
                <span className="text-sm leading-none">{phase.emoji}</span>
                {entry && <span className="text-xs leading-none">{entry.mood.split(' ')[0]}</span>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default LunaTrackerPage;
