import { useState, useMemo } from 'react';
import PageLayout from '@/components/PageLayout';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const STORAGE_KEY = 'healingHub_sleepData';

interface SleepEntry {
  date: string;
  bedtime: string;  // HH:MM
  wakeTime: string; // HH:MM
  quality: number;  // 1-5
  notes: string;
  duration: number; // hours
}

function getSleepData(): SleepEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function saveSleepData(entries: SleepEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function calcDuration(bedtime: string, wakeTime: string): number {
  const [bH, bM] = bedtime.split(':').map(Number);
  const [wH, wM] = wakeTime.split(':').map(Number);
  let bedMin = bH * 60 + bM;
  let wakeMin = wH * 60 + wM;
  if (wakeMin <= bedMin) wakeMin += 24 * 60; // next day
  return Math.round(((wakeMin - bedMin) / 60) * 10) / 10;
}

const qualityLabels = ['😫 Poor', '😕 Fair', '😐 Okay', '😌 Good', '😴 Excellent'];
const qualityColors = ['hsl(0, 60%, 65%)', 'hsl(30, 60%, 65%)', 'hsl(50, 60%, 65%)', 'hsl(135, 25%, 65%)', 'hsl(270, 30%, 72%)'];

const SleepCyclePage = () => {
  const [entries, setEntries] = useState<SleepEntry[]>(getSleepData);
  const [bedtime, setBedtime] = useState('22:30');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [quality, setQuality] = useState(3);
  const [notes, setNotes] = useState('');

  const todayKey = new Date().toISOString().split('T')[0];
  const todayEntry = entries.find(e => e.date === todayKey);

  const logSleep = () => {
    const duration = calcDuration(bedtime, wakeTime);
    const entry: SleepEntry = {
      date: todayKey,
      bedtime,
      wakeTime,
      quality,
      notes,
      duration,
    };

    const updated = entries.filter(e => e.date !== todayKey);
    updated.push(entry);
    updated.sort((a, b) => a.date.localeCompare(b.date));
    setEntries(updated);
    saveSleepData(updated);
    toast(`Sleep logged! ${duration}h recorded 💤`);
  };

  // Last 7 days chart data
  const chartData = useMemo(() => {
    const days: { label: string; duration: number | null; quality: number | null }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const entry = entries.find(e => e.date === key);
      days.push({
        label: d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
        duration: entry?.duration ?? null,
        quality: entry?.quality ?? null,
      });
    }
    return days;
  }, [entries]);

  const barChartData = {
    labels: chartData.map(d => d.label),
    datasets: [
      {
        label: 'Hours Slept',
        data: chartData.map(d => d.duration),
        backgroundColor: chartData.map(d =>
          d.quality ? qualityColors[d.quality - 1] : 'hsla(270, 20%, 85%, 0.5)'
        ),
        borderRadius: 8,
        borderSkipped: false as const,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        min: 0,
        max: 12,
        ticks: { stepSize: 2 },
        grid: { color: 'hsla(270, 20%, 85%, 0.5)' },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  // Stats
  const stats = useMemo(() => {
    if (entries.length === 0) return null;
    const last7 = entries.slice(-7);
    const avgDuration = last7.reduce((s, e) => s + e.duration, 0) / last7.length;
    const avgQuality = last7.reduce((s, e) => s + e.quality, 0) / last7.length;
    const bestDay = [...last7].sort((a, b) => b.duration - a.duration)[0];
    return {
      avgDuration: avgDuration.toFixed(1),
      avgQuality: avgQuality.toFixed(1),
      bestDay: bestDay ? new Date(bestDay.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '-',
      totalEntries: entries.length,
    };
  }, [entries]);

  const recentEntries = entries.slice(-5).reverse();

  return (
    <PageLayout>
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Sleep Cycle Tracker</h1>
          <p className="text-muted-foreground">Monitor your sleep patterns and improve your rest</p>
        </div>

        {/* Stats row */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Avg Duration', value: `${stats.avgDuration}h`, icon: '⏱️' },
              { label: 'Avg Quality', value: `${stats.avgQuality}/5`, icon: '⭐' },
              { label: 'Best Sleep', value: stats.bestDay, icon: '🏆' },
              { label: 'Total Logs', value: stats.totalEntries.toString(), icon: '📊' },
            ].map(stat => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4 text-center"
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <p className="font-heading text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Log sleep */}
          <div className="glass-card p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4 pb-2 border-b border-primary/20">
              {todayEntry ? '✏️ Update Tonight\'s Log' : '🌙 Log Your Sleep'}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground block mb-1">Bedtime</label>
                  <input
                    type="time"
                    value={bedtime}
                    onChange={e => setBedtime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-botanical-glow"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground block mb-1">Wake Time</label>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={e => setWakeTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-botanical-glow"
                  />
                </div>
              </div>

              <div className="text-center p-3 rounded-xl bg-card/50">
                <span className="text-sm text-muted-foreground">Duration: </span>
                <span className="font-heading text-lg font-bold text-foreground">
                  {calcDuration(bedtime, wakeTime)}h
                </span>
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground block mb-2">
                  Sleep Quality: {qualityLabels[quality - 1]}
                </label>
                <div className="flex gap-2">
                  {qualityLabels.map((label, i) => (
                    <button
                      key={i}
                      onClick={() => setQuality(i + 1)}
                      className={`flex-1 py-2 rounded-lg text-xs cursor-pointer border-none transition-all ${
                        quality === i + 1
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-primary/10 text-foreground hover:bg-primary/20'
                      }`}
                    >
                      {label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                placeholder="Any notes about your sleep..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground min-h-[60px] resize-y text-sm focus:outline-none focus:ring-2 focus:ring-botanical-glow"
              />

              <button
                onClick={logSleep}
                className="w-full px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold cursor-pointer border-none transition-all hover:-translate-y-0.5"
              >
                {todayEntry ? 'Update Log' : 'Log Sleep'}
              </button>
            </div>
          </div>

          {/* Chart */}
          <div className="glass-card p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4 pb-2 border-b border-primary/20">
              📊 Weekly Sleep Overview
            </h2>
            {entries.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
                Start logging your sleep to see trends here!
              </div>
            ) : (
              <Bar data={barChartData} options={barOptions as any} />
            )}
            <div className="flex flex-wrap gap-2 mt-3 justify-center">
              {qualityLabels.map((label, i) => (
                <div key={i} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: qualityColors[i] }} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent entries */}
        <div className="glass-card p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground mb-4 pb-2 border-b border-primary/20">
            Recent Sleep Logs
          </h2>
          {recentEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No sleep logs yet.</p>
          ) : (
            <div className="space-y-2">
              {recentEntries.map((entry, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-card/50">
                  <span className="text-2xl">{qualityLabels[entry.quality - 1].split(' ')[0]}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {entry.duration}h • {entry.bedtime} → {entry.wakeTime}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      {entry.notes && ` • ${entry.notes}`}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-foreground">
                    {qualityLabels[entry.quality - 1].split(' ')[1]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default SleepCyclePage;
