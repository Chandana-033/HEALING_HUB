import { Link } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { motion } from 'framer-motion';

const features = [
  { to: '/gratitude', icon: '🌷', title: 'Gratitude Garden', desc: 'Plant a flower for each thing you\'re grateful for and watch it bloom' },
  { to: '/tune-in', icon: '🎵', title: 'Tune In', desc: 'Immerse yourself in carefully selected calming music' },
  { to: '/mindfulness', icon: '🧘', title: 'Mindfulness', desc: 'Guided meditation and breathing exercises for inner peace' },
  { to: '/brain-teasers', icon: '🧩', title: 'Brain Teasers', desc: 'Engage your mind with creative puzzles and challenges' },
  { to: '/journal', icon: '✍️', title: 'Soul Scribbles', desc: 'Journal your thoughts and emotions in a safe space' },
  { to: '/insights', icon: '📊', title: 'Insights', desc: 'Track your mood trends and wellness journey' },
  { to: '/luna-tracker', icon: '🌙', title: 'Luna Tracker', desc: 'Log your moods in rhythm with the lunar phases' },
  { to: '/sleep-cycle', icon: '😴', title: 'Sleep Cycle', desc: 'Monitor bedtime, wake-up and sleep quality trends' },
  { to: '/therapist', icon: '🤝', title: 'Talk to Someone', desc: 'Real helplines and trusted directories to find a therapist' },
];

const Index = () => {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="min-h-[85vh] flex flex-col justify-center items-center text-center px-6 py-12">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground mb-3 tracking-tight leading-tight">
            Healing Hub
          </h1>
          <p className="text-lg text-botanical-dark font-light tracking-wide mb-2">
            A Sanctuary for Your Mental Wellness
          </p>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
            Find peace, clarity, and connection. Our curated collection of mindfulness tools, wellness journeys, and calming resources invites you to pause, breathe, and restore balance.
          </p>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
            Explore Your Wellness
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Choose from a carefully designed collection of tools to support your mental health journey
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.to}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={i % 2 === 1 ? 'lg:translate-y-12' : ''}
            >
              <Link to={f.to} className="glass-card-hover block p-8 text-center no-underline min-h-[260px] flex flex-col items-center justify-center gap-3">
                <span className="text-5xl">{f.icon}</span>
                <h3 className="font-heading text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
