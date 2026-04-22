import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  getCycleData,
  getUserProfile,
  saveUserProfile,
  logPeriodStart,
  removePeriodStart,
  upsertCycleEntry,
  predictCyclePhase,
  computeAverageCycleLength,
  PHASE_INSIGHTS,
  CycleData,
  UserProfile,
  CyclePhase,
} from '@/lib/user-profile';

const FLOW_OPTIONS: { value: 'spotting' | 'light' | 'medium' | 'heavy'; label: string; emoji: string }[] = [
  { value: 'spotting', label: 'Spotting', emoji: '💧' },
  { value: 'light', label: 'Light', emoji: '🌧️' },
  { value: 'medium', label: 'Medium', emoji: '🌊' },
  { value: 'heavy', label: 'Heavy', emoji: '🔴' },
];

const MOODS = ['🌟 Radiant', '😊 Bright', '😌 Calm', '🌫️ Hazy', '😢 Tearful', '😤 Irritable', '🥀 Low'];
const ENERGY_LABELS = ['Drained', 'Low', 'Steady', 'Good', 'Vibrant'];
const SYMPTOMS = [
  { v: 'cramps', l: 'Cramps', e: '🌀' },
  { v: 'headache', l: 'Headache', e: '🤕' },
  { v: 'bloating', l: 'Bloating', e: '🎈' },
  { v: 'tender', l: 'Tender breasts', e: '💗' },
  { v: 'fatigue', l: 'Fatigue', e: '😴' },
  { v: 'acne', l: 'Acne', e: '🌸' },
  { v: 'cravings', l: 'Cravings', e: '🍫' },
  { v: 'backache', l: 'Back pain', e: '🌿' },
];

const PHASE_COLORS: Record<CyclePhase, string> = {
  menstrual: 'hsl(0, 65%, 70%)',
  follicular: 'hsl(135, 45%, 70%)',
  ovulation: 'hsl(50, 80%, 70%)',
  luteal: 'hsl(270, 40%, 72%)',
  unknown: 'hsla(270, 20%, 80%, 0.4)',
};

const todayStr = () => new Date().toISOString().split('T')[0];

const LunaTrackerPage = () => {
  const [cycle, setCycle] = useState<CycleData>(getCycleData);
  const [profile, setProfile] = useState<UserProfile>(getUserProfile);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr());
  const [mood, setMood] = useState('');
  const [flow, setFlow] = useState<'spotting' | 'light' | 'medium' | 'heavy' | ''>('');
  const [energy, setEnergy] = useState(3);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [viewMonth, setViewMonth] = useState(() => {
    const n = new Date();
    return { year: n.getFullYear(), month: n.getMonth() };
  });

  // Hydrate form when selected date changes
  useEffect(() => {
    const entry = cycle.entries.find(e => e.date === selectedDate);
    setMood(entry?.mood ?? '');
    setFlow(entry?.flow ?? '');
    setEnergy(entry?.energy ?? 3);
    setSymptoms(entry?.symptoms ?? []);
    setNote(entry?.note ?? '');
  }, [selectedDate, cycle]);

  const todayPhaseInfo = useMemo(
    () => predictCyclePhase(cycle, profile, new Date()),
    [cycle, profile]
  );
  const selectedPhaseInfo = useMemo(
    () => predictCyclePhase(cycle, profile, new Date(selectedDate)),
    [cycle, profile, selectedDate]
  );
  const insights = PHASE_INSIGHTS[todayPhaseInfo.phase];

  const handleLogPeriodStart = () => {
    const updated = logPeriodStart(selectedDate);
    // Recompute average cycle length
    const avg = computeAverageCycleLength(updated.periodStarts, profile.averageCycleLength);
    if (avg !== profile.averageCycleLength) {
      const nextProfile = { ...profile, averageCycleLength: avg };
      saveUserProfile(nextProfile);
      setProfile(nextProfile);
    }
    setCycle(updated);
    toast.success('Period start logged 🌸');
  };

  const handleRemovePeriodStart = () => {
    const updated = removePeriodStart(selectedDate);
    setCycle(updated);
    toast('Period start removed');
  };

  const saveEntry = () => {
    const updated = upsertCycleEntry({
      date: selectedDate,
      mood: mood || undefined,
      flow: flow || undefined,
      energy,
      symptoms,
      note: note || undefined,
      isPeriodStart: cycle.periodStarts.includes(selectedDate),
    });
    setCycle(updated);
    toast.success('Saved 🌙');
  };

  const toggleSymptom = (v: string) => {
    setSymptoms(s => s.includes(v) ? s.filter(x => x !== v) : [...s, v]);
  };

  // Calendar
  const calendarDays = useMemo(() => {
    const { year, month } = viewMonth;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const key = date.toISOString().split('T')[0];
      const entry = cycle.entries.find(e => e.date === key);
      const phaseInfo = predictCyclePhase(cycle, profile, date);
      days.push({ day: d, date: key, entry, phase: phaseInfo.phase, isPeriodStart: cycle.periodStarts.includes(key) });
    }
    return { days, firstDay };
  }, [viewMonth, cycle, profile]);

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

  const isPeriodStartSelected = cycle.periodStarts.includes(selectedDate);

  return (
    <PageLayout>
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Luna Tracker</h1>
          <p className="text-muted-foreground">Track your cycle, mood, and body in rhythm with you</p>
        </div>

        {!profile.tracksCycle && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 mb-6 text-center border-2 border-primary/30"
          >
            <p className="text-sm text-foreground mb-3">
              Cycle tracking is currently turned off in your profile.
            </p>
            <button
              onClick={() => {
                const next = { ...profile, tracksCycle: true };
                saveUserProfile(next);
                setProfile(next);
                toast.success('Cycle tracking enabled 🌙');
              }}
              className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold border-none cursor-pointer"
            >
              Turn on cycle tracking
            </button>
            <Link to="/onboarding" className="block mt-3 text-xs text-muted-foreground hover:text-botanical-dark">
              Or update your full profile →
            </Link>
          </motion.div>
        )}

        {/* Today's phase summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-8"
          style={{ borderLeft: `4px solid ${PHASE_COLORS[todayPhaseInfo.phase]}` }}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="text-6xl">{insights.emoji}</div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-heading text-xl font-semibold text-foreground">{insights.title}</h2>
              {todayPhaseInfo.dayOfCycle !== null && (
                <p className="text-sm text-muted-foreground mt-1">
                  Day {todayPhaseInfo.dayOfCycle} of your cycle
                  {todayPhaseInfo.daysUntilNextPeriod !== null && todayPhaseInfo.daysUntilNextPeriod >= 0 && (
                    <> · Next period in ~{todayPhaseInfo.daysUntilNextPeriod} {todayPhaseInfo.daysUntilNextPeriod === 1 ? 'day' : 'days'}</>
                  )}
                </p>
              )}
              <p className="text-sm text-foreground mt-3">{insights.body}</p>
            </div>
          </div>

          {insights.suggestions.length > 0 && (
            <div className="mt-5 pt-4 border-t border-primary/10">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Gentle suggestions</p>
              <ul className="grid sm:grid-cols-2 gap-2">
                {insights.suggestions.map(s => (
                  <li key={s} className="text-sm text-foreground flex items-start gap-2">
                    <span className="text-primary">·</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Log entry */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-primary/20">
              <h2 className="font-heading text-lg font-semibold text-foreground">
                {selectedDate === todayStr() ? "Today's Entry" : `Entry for ${new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`}
              </h2>
              <input
                type="date"
                value={selectedDate}
                max={todayStr()}
                onChange={e => setSelectedDate(e.target.value)}
                className="text-xs px-2 py-1 rounded bg-card border border-border text-foreground"
              />
            </div>

            <div className="space-y-4">
              {profile.tracksCycle && (
                <>
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground block mb-2">Period flow</label>
                    <div className="flex flex-wrap gap-2">
                      {FLOW_OPTIONS.map(f => (
                        <button
                          key={f.value}
                          onClick={() => setFlow(flow === f.value ? '' : f.value)}
                          className={`px-3 py-1.5 rounded-full text-sm border-none cursor-pointer transition-all ${
                            flow === f.value ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-foreground hover:bg-primary/20'
                          }`}
                        >
                          {f.emoji} {f.label}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={isPeriodStartSelected ? handleRemovePeriodStart : handleLogPeriodStart}
                      className={`mt-3 text-xs px-3 py-1.5 rounded-full border-none cursor-pointer transition-all ${
                        isPeriodStartSelected
                          ? 'bg-card text-muted-foreground hover:bg-card/70'
                          : 'bg-accent/30 text-foreground hover:bg-accent/50'
                      }`}
                    >
                      {isPeriodStartSelected ? '✕ Unmark as period start' : '🌸 Mark as period start day'}
                    </button>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-muted-foreground block mb-2">Symptoms</label>
                    <div className="flex flex-wrap gap-2">
                      {SYMPTOMS.map(s => (
                        <button
                          key={s.v}
                          onClick={() => toggleSymptom(s.v)}
                          className={`px-3 py-1.5 rounded-full text-xs border-none cursor-pointer transition-all ${
                            symptoms.includes(s.v) ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-foreground hover:bg-primary/20'
                          }`}
                        >
                          {s.e} {s.l}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-sm font-semibold text-muted-foreground block mb-2">Mood</label>
                <div className="flex flex-wrap gap-2">
                  {MOODS.map(m => (
                    <button
                      key={m}
                      onClick={() => setMood(mood === m ? '' : m)}
                      className={`px-3 py-1.5 rounded-full text-sm border-none cursor-pointer transition-all ${
                        mood === m ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-foreground hover:bg-primary/20'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground block mb-2">
                  Energy: {ENERGY_LABELS[energy - 1]}
                </label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={energy}
                  onChange={e => setEnergy(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <textarea
                placeholder="Anything you'd like to remember about today..."
                value={note}
                onChange={e => setNote(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground min-h-[70px] resize-y text-sm focus:outline-none focus:ring-2 focus:ring-botanical-glow"
              />

              <button
                onClick={saveEntry}
                className="w-full px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold cursor-pointer border-none transition-all hover:-translate-y-0.5"
              >
                Save Entry
              </button>
            </div>
          </div>

          {/* Cycle stats */}
          <div className="glass-card p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4 pb-2 border-b border-primary/20">
              🔮 Your Cycle
            </h2>

            {profile.tracksCycle ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-card/50 text-center">
                    <p className="text-xs text-muted-foreground">Avg cycle</p>
                    <p className="font-heading text-xl font-bold text-foreground">{profile.averageCycleLength}<span className="text-xs ml-1">days</span></p>
                  </div>
                  <div className="p-3 rounded-xl bg-card/50 text-center">
                    <p className="text-xs text-muted-foreground">Avg period</p>
                    <p className="font-heading text-xl font-bold text-foreground">{profile.averagePeriodLength}<span className="text-xs ml-1">days</span></p>
                  </div>
                </div>

                {todayPhaseInfo.nextPeriodDate && (
                  <div className="p-3 rounded-xl bg-accent/20">
                    <p className="text-xs text-muted-foreground">Next period predicted</p>
                    <p className="font-semibold text-foreground">
                      {new Date(todayPhaseInfo.nextPeriodDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                )}

                {todayPhaseInfo.fertileWindowStart && todayPhaseInfo.fertileWindowEnd && (
                  <div className="p-3 rounded-xl bg-card/50">
                    <p className="text-xs text-muted-foreground">Fertile window</p>
                    <p className="text-sm text-foreground">
                      {new Date(todayPhaseInfo.fertileWindowStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(todayPhaseInfo.fertileWindowEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-muted-foreground mb-2">Recent period starts</p>
                  {cycle.periodStarts.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No period starts logged yet. Mark your first to begin predictions.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {[...cycle.periodStarts].reverse().slice(0, 6).map(d => (
                        <span key={d} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-foreground">
                          {new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Enable cycle tracking above to see predictions and phase insights.</p>
            )}
          </div>
        </div>

        {/* Calendar */}
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

            {Array.from({ length: calendarDays.firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {calendarDays.days.map(({ day, date, entry, phase, isPeriodStart }) => {
              const isSelected = date === selectedDate;
              const isToday = date === todayStr();
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`relative p-1.5 rounded-lg text-center transition-all min-h-[58px] flex flex-col items-center justify-center gap-0.5 cursor-pointer border-none ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  } ${isToday ? 'font-bold' : ''}`}
                  style={{
                    background: profile.tracksCycle && phase !== 'unknown'
                      ? `${PHASE_COLORS[phase]}55`
                      : 'hsla(270, 20%, 90%, 0.3)',
                  }}
                  title={`${date} — ${PHASE_INSIGHTS[phase].title}`}
                >
                  <span className="text-xs text-foreground">{day}</span>
                  {isPeriodStart && <span className="text-xs leading-none">🌸</span>}
                  {entry?.flow && !isPeriodStart && <span className="text-xs leading-none">💧</span>}
                  {entry?.mood && <span className="text-xs leading-none">{entry.mood.split(' ')[0]}</span>}
                </button>
              );
            })}
          </div>

          {profile.tracksCycle && (
            <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-muted-foreground">
              {(['menstrual', 'follicular', 'ovulation', 'luteal'] as CyclePhase[]).map(p => (
                <div key={p} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded" style={{ background: PHASE_COLORS[p] }} />
                  <span className="capitalize">{p}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default LunaTrackerPage;