import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { getMoodData, getJournalEntries } from '@/lib/wellness-logic';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const moodEmoji: Record<string, string> = {
  happy: '😊', calm: '😌', neutral: '😐', anxious: '😰', sad: '😢',
  angry: '😠', overwhelmed: '🥺', stressed: '😩', lonely: '🥀', excited: '✨',
};

interface SleepEntry { date: string; duration: number; quality: number; }

const DashboardPage = () => {
  const { user, loading } = useAuth();
  const [displayName, setDisplayName] = useState<string>('');

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('display_name').eq('id', user.id).maybeSingle()
      .then(({ data }) => {
        setDisplayName(data?.display_name ?? user.email?.split('@')[0] ?? 'Friend');
      });
  }, [user]);

  const moodData = useMemo(() => getMoodData(), []);
  const journalEntries = useMemo(() => getJournalEntries(), []);
  const sleepEntries: SleepEntry[] = useMemo(() => {
    try {
      const d = localStorage.getItem('healingHub_sleepData');
      return d ? JSON.parse(d) : [];
    } catch { return []; }
  }, []);

  // Streak: consecutive days with mood logged ending today
  const streak = useMemo(() => {
    if (moodData.length === 0) return 0;
    const dates = new Set(moodData.map(m => m.date));
    let count = 0;
    const d = new Date();
    while (dates.has(d.toISOString().split('T')[0])) {
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }, [moodData]);

  // Mood distribution
  const moodDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    moodData.forEach(m => { counts[m.mood] = (counts[m.mood] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [moodData]);

  // 30-day mood trend
  const trendData = useMemo(() => {
    const days: { label: string; score: number | null }[] = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const entry = moodData.find(m => m.date === key);
      days.push({
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: entry?.score ?? null,
      });
    }
    return days;
  }, [moodData]);

  // Heatmap: last 35 days
  const heatmapData = useMemo(() => {
    const days: { date: string; score: number | null }[] = [];
    const now = new Date();
    for (let i = 34; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const entry = moodData.find(m => m.date === key);
      days.push({ date: key, score: entry?.score ?? null });
    }
    return days;
  }, [moodData]);

  const avgSleep = sleepEntries.length
    ? (sleepEntries.slice(-7).reduce((s, e) => s + e.duration, 0) / Math.min(sleepEntries.length, 7)).toFixed(1)
    : '-';

  if (loading) {
    return <PageLayout><div className="p-12 text-center text-muted-foreground">Loading…</div></PageLayout>;
  }

  if (!user) {
    return (
      <PageLayout>
        <section className="min-h-[60vh] flex items-center justify-center px-6">
          <div className="glass-card p-8 text-center max-w-md">
            <h1 className="font-heading text-2xl font-bold text-foreground mb-3">Your Dashboard Awaits</h1>
            <p className="text-muted-foreground mb-6">Sign in to see your personalized wellness journey.</p>
            <Link to="/auth" className="inline-block px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold no-underline">
              Sign in / Sign up
            </Link>
          </div>
        </section>
      </PageLayout>
    );
  }

  const lineChart = {
    labels: trendData.map(d => d.label),
    datasets: [{
      label: 'Mood',
      data: trendData.map(d => d.score),
      borderColor: 'hsl(270, 30%, 55%)',
      backgroundColor: 'hsla(270, 30%, 72%, 0.2)',
      tension: 0.4,
      fill: true,
      spanGaps: true,
      pointBackgroundColor: 'hsl(135, 30%, 55%)',
      pointRadius: 4,
    }],
  };

  const lineOpts = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { min: 0, max: 5, ticks: { stepSize: 1 }, grid: { color: 'hsla(270, 20%, 85%, 0.5)' } },
      x: { grid: { display: false }, ticks: { maxTicksLimit: 10 } },
    },
  };

  const heatmapColor = (score: number | null) => {
    if (score === null) return 'hsla(270, 20%, 85%, 0.35)';
    const map = [
      'hsl(0, 60%, 70%)',    // 1
      'hsl(30, 55%, 70%)',   // 2
      'hsl(50, 55%, 72%)',   // 3
      'hsl(135, 30%, 70%)',  // 4
      'hsl(270, 40%, 72%)',  // 5
    ];
    return map[Math.max(0, Math.min(4, score - 1))];
  };

  return (
    <PageLayout>
      <section className="max-w-6xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
            Hello, {displayName} 🌸
          </h1>
          <p className="text-muted-foreground">Here's your wellness reflection for today</p>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Current Streak', value: `${streak} ${streak === 1 ? 'day' : 'days'}`, icon: '🔥' },
            { label: 'Mood Logs', value: moodData.length.toString(), icon: '💭' },
            { label: 'Journal Entries', value: journalEntries.length.toString(), icon: '✍️' },
            { label: 'Avg Sleep (7d)', value: avgSleep === '-' ? '-' : `${avgSleep}h`, icon: '😴' },
          ].map(s => (
            <div key={s.label} className="glass-card p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className="font-heading text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* 30-day trend */}
          <div className="glass-card p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4 pb-2 border-b border-primary/20">
              📈 30-Day Mood Trend
            </h2>
            {moodData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
                Log your first mood to start tracking.
              </div>
            ) : (
              <Line data={lineChart} options={lineOpts as any} />
            )}
          </div>

          {/* Mood distribution */}
          <div className="glass-card p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4 pb-2 border-b border-primary/20">
              🎨 Top Moods
            </h2>
            {moodDistribution.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
                No mood data yet.
              </div>
            ) : (
              <div className="space-y-3">
                {moodDistribution.map(([mood, count]) => {
                  const pct = (count / moodData.length) * 100;
                  return (
                    <div key={mood}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground capitalize">
                          {moodEmoji[mood] ?? '•'} {mood}
                        </span>
                        <span className="text-muted-foreground">{count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-card/60 overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Heatmap */}
        <div className="glass-card p-6 mb-6">
          <h2 className="font-heading text-lg font-semibold text-foreground mb-4 pb-2 border-b border-primary/20">
            🗓️ Last 5 Weeks
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {heatmapData.map(d => (
              <div
                key={d.date}
                className="aspect-square rounded-md"
                style={{ background: heatmapColor(d.score) }}
                title={`${d.date}${d.score ? ` — ${d.score}/5` : ''}`}
              />
            ))}
          </div>
          <div className="flex items-center justify-end gap-2 mt-3 text-xs text-muted-foreground">
            <span>Low</span>
            {[1, 2, 3, 4, 5].map(s => (
              <div key={s} className="w-3 h-3 rounded" style={{ background: heatmapColor(s) }} />
            ))}
            <span>High</span>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { to: '/journal', icon: '✍️', label: 'New Journal Entry' },
            { to: '/insights', icon: '📊', label: 'Weekly Insights' },
            { to: '/therapist', icon: '🤝', label: 'Talk to Someone' },
            { to: '/mindfulness', icon: '🧘', label: 'Breathe' },
          ].map(l => (
            <Link key={l.to} to={l.to} className="glass-card-hover p-5 text-center no-underline">
              <div className="text-3xl mb-2">{l.icon}</div>
              <p className="text-sm font-semibold text-foreground">{l.label}</p>
            </Link>
          ))}
        </div>
      </section>
    </PageLayout>
  );
};

export default DashboardPage;