import { useState, useEffect, useCallback, useRef } from 'react';
import PageLayout from '@/components/PageLayout';
import { motion } from 'framer-motion';

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'pause';

const phaseConfig: { phase: Phase; duration: number; label: string }[] = [
  { phase: 'inhale', duration: 4, label: 'Inhale deeply' },
  { phase: 'hold', duration: 4, label: 'Hold your breath' },
  { phase: 'exhale', duration: 6, label: 'Exhale slowly' },
  { phase: 'pause', duration: 2, label: 'Pause' },
];

const yogaPoses = [
  { name: 'Tadasana (Mountain Pose)', desc: 'Stand tall with feet together, grounding through your feet. Engage your core and lengthen your spine. Arms at your sides, palms facing forward.' },
  { name: 'Vrikshasana (Tree Pose)', desc: 'Shift weight to one foot and place the other foot on your inner thigh. Bring hands to prayer at heart center. Focus on a fixed point for balance.' },
  { name: 'Adho Mukha Svanasana (Downward Dog)', desc: 'Form an inverted V-shape. Press hands firmly into the ground, lift hips high, and press heels toward the floor.' },
  { name: 'Balasana (Child\'s Pose)', desc: 'Kneel and sit back on your heels, then fold forward with arms extended. Rest your forehead on the ground and breathe deeply.' },
  { name: 'Savasana (Corpse Pose)', desc: 'Lie flat on your back with arms at your sides, palms up. Close your eyes and let every muscle relax completely.' },
];

const MindfulnessPage = () => {
  const [view, setView] = useState<'home' | 'breathing' | 'yoga'>('home');
  const [running, setRunning] = useState(false);
  const [totalTime, setTotalTime] = useState(180);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseTime, setPhaseTime] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [poseIndex, setPoseIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentPhase = running ? phaseConfig[phaseIndex] : null;
  const phaseDuration = currentPhase?.duration ?? 1;
  const progress = running ? (phaseTime / phaseDuration) * 100 : 0;

  const startBreathing = () => {
    setRunning(true);
    setTotalTime(180);
    setPhaseIndex(0);
    setPhaseTime(0);
    setBreathCount(0);
  };

  const tick = useCallback(() => {
    setTotalTime(t => {
      if (t <= 1) {
        setRunning(false);
        if (timerRef.current) clearInterval(timerRef.current);
        return 0;
      }
      return t - 1;
    });
    setPhaseTime(pt => {
      const dur = phaseConfig[phaseIndex]?.duration ?? 4;
      if (pt + 1 >= dur) {
        setPhaseIndex(pi => {
          const next = (pi + 1) % phaseConfig.length;
          if (next === 0) setBreathCount(bc => bc + 1);
          return next;
        });
        return 0;
      }
      return pt + 1;
    });
  }, [phaseIndex]);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(tick, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [running, tick]);

  const mins = Math.floor(totalTime / 60);
  const secs = totalTime % 60;

  const circleScale = currentPhase?.phase === 'inhale' ? 1.2
    : currentPhase?.phase === 'exhale' ? 0.85
    : 1;

  if (view === 'breathing') {
    return (
      <PageLayout>
        <section className="min-h-[80vh] flex items-center justify-center px-4 py-12">
          <div className="glass-card max-w-md w-full p-8 text-center">
            <button onClick={() => { setView('home'); setRunning(false); }} className="text-sm text-muted-foreground mb-4 cursor-pointer bg-transparent border-none hover:text-foreground">
              ← Back
            </button>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Breathing Exercise</h1>
            <p className="text-sm text-muted-foreground mb-6">Follow the rhythm for deep relaxation</p>

            <p className="text-3xl font-bold text-foreground mb-2 font-body tabular-nums">
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </p>

            <p className="text-lg text-botanical-dark font-medium mb-4 min-h-[28px]">
              {running ? currentPhase?.label : totalTime === 0 ? 'Exercise Complete!' : 'Click Start to begin'}
            </p>

            <motion.div
              animate={{ scale: running ? circleScale : 1 }}
              transition={{ duration: phaseDuration, ease: 'easeInOut' }}
              className="w-40 h-40 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{
                background: `conic-gradient(hsl(var(--primary)) ${progress}%, hsl(var(--secondary)) 0%)`,
              }}
            >
              <div className="w-36 h-36 rounded-full bg-card flex items-center justify-center">
                <span className="text-4xl font-bold text-foreground">{breathCount}</span>
              </div>
            </motion.div>

            {!running && totalTime > 0 && (
              <button onClick={startBreathing} className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold transition-all hover:-translate-y-0.5 cursor-pointer border-none">
                Start
              </button>
            )}
            {totalTime === 0 && (
              <button onClick={() => setView('yoga')} className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold transition-all hover:-translate-y-0.5 cursor-pointer border-none">
                Continue to Yoga
              </button>
            )}
          </div>
        </section>
      </PageLayout>
    );
  }

  if (view === 'yoga') {
    const pose = yogaPoses[poseIndex];
    return (
      <PageLayout>
        <section className="min-h-[80vh] flex items-center justify-center px-4 py-12">
          <div className="glass-card max-w-lg w-full p-8 text-center">
            <button onClick={() => setView('home')} className="text-sm text-muted-foreground mb-4 cursor-pointer bg-transparent border-none hover:text-foreground">
              ← Back
            </button>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-4">Yoga Postures</h1>

            <div className="flex justify-center gap-2 mb-6">
              {yogaPoses.map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full transition-all ${i === poseIndex ? 'bg-primary scale-125' : 'bg-secondary'}`} />
              ))}
            </div>

            <motion.div key={poseIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">{pose.name}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed text-left">{pose.desc}</p>
            </motion.div>

            <div className="flex gap-3 justify-center">
              {poseIndex > 0 && (
                <button onClick={() => setPoseIndex(i => i - 1)} className="px-6 py-2 rounded-full bg-secondary text-foreground font-medium cursor-pointer border-none transition-all hover:-translate-y-0.5">
                  Previous
                </button>
              )}
              {poseIndex < yogaPoses.length - 1 && (
                <button onClick={() => setPoseIndex(i => i + 1)} className="px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium cursor-pointer border-none transition-all hover:-translate-y-0.5">
                  Next Pose
                </button>
              )}
              {poseIndex === yogaPoses.length - 1 && (
                <button onClick={() => setView('home')} className="px-6 py-2 rounded-full bg-botanical text-foreground font-medium cursor-pointer border-none transition-all hover:-translate-y-0.5">
                  Complete ✓
                </button>
              )}
            </div>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass-card max-w-md w-full p-10 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Wellness Journey</h1>
          <p className="text-botanical-dark mb-8">Begin your path to mindfulness</p>

          <div className="relative w-40 h-40 mx-auto mb-8">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full"
                style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--botanical)))' }}
                animate={{ scale: [0.8 - i * 0.1, 1 - i * 0.1], opacity: [0.5, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', delay: i * 0.5 }}
              />
            ))}
          </div>

          <div className="space-y-3">
            <button onClick={() => setView('breathing')} className="w-full px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold cursor-pointer border-none transition-all hover:-translate-y-0.5 hover:shadow-lg">
              🫁 Breathing Exercise
            </button>
            <button onClick={() => setView('yoga')} className="w-full px-6 py-3 rounded-full bg-secondary text-foreground font-semibold cursor-pointer border-none transition-all hover:-translate-y-0.5 hover:shadow-lg">
              🧘 Yoga Postures
            </button>
          </div>
        </motion.div>
      </section>
    </PageLayout>
  );
};

export default MindfulnessPage;
