import { useMemo } from 'react';
import PageLayout from '@/components/PageLayout';
import { getMoodData } from '@/lib/wellness-logic';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

const InsightsPage = () => {
  const moodData = useMemo(() => getMoodData(), []);

  // Group by day, last 7 days
  const last7Days = useMemo(() => {
    const days: Record<string, number[]> = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      days[key] = [];
    }

    moodData.forEach(entry => {
      const key = entry.date.split('T')[0];
      if (days[key]) {
        days[key].push(entry.score);
      }
    });

    return Object.entries(days).map(([date, scores]) => ({
      date,
      label: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      avg: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null,
    }));
  }, [moodData]);

  const chartData = {
    labels: last7Days.map(d => d.label),
    datasets: [
      {
        label: 'Mood Score',
        data: last7Days.map(d => d.avg),
        borderColor: 'hsl(270, 30%, 72%)',
        backgroundColor: 'hsla(270, 30%, 72%, 0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'hsl(135, 30%, 55%)',
        pointBorderColor: 'hsl(135, 30%, 55%)',
        pointRadius: 5,
        pointHoverRadius: 7,
        spanGaps: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: (value: number | string) => {
            const labels: Record<number, string> = { 1: '😠', 2: '😔', 3: '😐', 4: '😌', 5: '😊' };
            return labels[Number(value)] || '';
          },
        },
        grid: { color: 'hsla(270, 20%, 85%, 0.5)' },
      },
      x: {
        grid: { color: 'hsla(270, 20%, 85%, 0.3)' },
      },
    },
  };

  const recentMoods = moodData.slice(-10).reverse();

  return (
    <PageLayout>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Your Wellness Insights</h1>
          <p className="text-muted-foreground">Track your mood trends and reflect on your journey</p>
        </div>

        {/* Weekly mood chart */}
        <div className="glass-card p-6 mb-8">
          <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Weekly Mood Trend</h2>
          {moodData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No mood data yet. Start journaling in Soul Scribbles to see your trends here!
            </p>
          ) : (
            <Line data={chartData} options={chartOptions as any} />
          )}
        </div>

        {/* Recent mood entries */}
        <div className="glass-card p-6">
          <h2 className="font-heading text-xl font-semibold text-foreground mb-4">Recent Mood Entries</h2>
          {recentMoods.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No entries yet.</p>
          ) : (
            <div className="space-y-2">
              {recentMoods.map((entry, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-card/50">
                  <span className="text-2xl">{entry.mood.split(' ')[0]}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{entry.mood}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default InsightsPage;
