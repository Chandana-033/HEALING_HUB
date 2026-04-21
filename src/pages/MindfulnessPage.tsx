import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import PageLayout from '@/components/PageLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { getExerciseLog, logExercise, ExerciseLogEntry } from '@/lib/wellness-logic';
import yogaMountain from '@/assets/yoga-mountain.jpg';
import yogaTree from '@/assets/yoga-tree.jpg';
import yogaDowndog from '@/assets/yoga-downdog.jpg';
import yogaChild from '@/assets/yoga-child.jpg';
import yogaCobra from '@/assets/yoga-cobra.jpg';
import yogaWarrior from '@/assets/yoga-warrior.jpg';
import yogaCatcow from '@/assets/yoga-catcow.jpg';
import yogaSavasana from '@/assets/yoga-savasana.jpg';

type View = 'home' | 'breathing' | 'yoga' | 'tracker';

interface BreathingTechnique {
  id: string;
  name: string;
  desc: string;
  benefit: string;
  pattern: { phase: 'inhale' | 'hold' | 'exhale' | 'pause'; duration: number; label: string }[];
  totalDuration: number;
}

const breathingTechniques: BreathingTechnique[] = [
  {
    id: 'box',
    name: 'Box Breathing (4-4-4-4)',
    desc: 'Used by Navy SEALs to stay calm under pressure. Equal counts on inhale, hold, exhale, hold.',
    benefit: 'Reduces stress, improves focus',
    pattern: [
      { phase: 'inhale', duration: 4, label: 'Inhale' },
      { phase: 'hold', duration: 4, label: 'Hold' },
      { phase: 'exhale', duration: 4, label: 'Exhale' },
      { phase: 'pause', duration: 4, label: 'Hold' },
    ],
    totalDuration: 240,
  },
  {
    id: '478',
    name: '4-7-8 Relaxing Breath',
    desc: 'Dr. Andrew Weil\'s technique. Inhale 4s, hold 7s, exhale 8s. A natural tranquilizer for the nervous system.',
    benefit: 'Eases anxiety, helps sleep',
    pattern: [
      { phase: 'inhale', duration: 4, label: 'Inhale through nose' },
      { phase: 'hold', duration: 7, label: 'Hold gently' },
      { phase: 'exhale', duration: 8, label: 'Exhale through mouth' },
    ],
    totalDuration: 228,
  },
  {
    id: 'belly',
    name: 'Diaphragmatic (Belly) Breathing',
    desc: 'Slow, deep breathing into the belly rather than the chest. Hand on stomach, feel it rise and fall.',
    benefit: 'Lowers blood pressure, calms the body',
    pattern: [
      { phase: 'inhale', duration: 5, label: 'Inhale into belly' },
      { phase: 'exhale', duration: 5, label: 'Exhale slowly' },
    ],
    totalDuration: 180,
  },
  {
    id: 'coherent',
    name: 'Coherent Breathing (5-5)',
    desc: 'Equal 5-second inhales and exhales — about 6 breaths per minute. Brings heart rate variability into balance.',
    benefit: 'Boosts mood, balances nervous system',
    pattern: [
      { phase: 'inhale', duration: 5, label: 'Inhale' },
      { phase: 'exhale', duration: 5, label: 'Exhale' },
    ],
    totalDuration: 300,
  },
];

interface YogaPose {
  name: string;
  sanskrit: string;
  image: string;
  duration: string;
  steps: string[];
  benefits: string;
}

const yogaPoses: YogaPose[] = [
  {
    name: 'Mountain Pose',
    sanskrit: 'Tadasana',
    image: yogaMountain,
    duration: '30–60 sec',
    steps: [
      'Stand with feet hip-width apart, big toes touching.',
      'Distribute weight evenly through both feet.',
      'Engage your thighs, lift your kneecaps, lengthen your tailbone.',
      'Roll shoulders back and down; arms relaxed at sides, palms forward.',
      'Crown of the head reaches toward the ceiling. Breathe deeply.',
    ],
    benefits: 'Improves posture, builds awareness, grounds the body.',
  },
  {
    name: 'Tree Pose',
    sanskrit: 'Vrikshasana',
    image: yogaTree,
    duration: '30 sec each side',
    steps: [
      'Begin in Mountain Pose. Shift weight onto your left foot.',
      'Place the sole of your right foot on your inner left calf or thigh (avoid the knee).',
      'Bring palms together at heart center, or extend arms overhead.',
      'Fix your gaze on a still point in front of you.',
      'Hold, breathe steadily, then switch sides.',
    ],
    benefits: 'Improves balance, strengthens legs, calms the mind.',
  },
  {
    name: 'Downward-Facing Dog',
    sanskrit: 'Adho Mukha Svanasana',
    image: yogaDowndog,
    duration: '1 min',
    steps: [
      'Start on hands and knees, wrists under shoulders, knees under hips.',
      'Tuck your toes and lift your hips up and back into an inverted V.',
      'Press firmly through your palms and spread your fingers wide.',
      'Keep a slight bend in the knees if needed; lengthen your spine.',
      'Let your head hang heavy. Breathe.',
    ],
    benefits: 'Stretches hamstrings, calves, and shoulders; energizes the body.',
  },
  {
    name: 'Cat–Cow Stretch',
    sanskrit: 'Marjaryasana–Bitilasana',
    image: yogaCatcow,
    duration: '5–10 cycles',
    steps: [
      'Begin on hands and knees in tabletop position.',
      'Inhale (Cow): drop your belly, lift your chest and tailbone, gaze up.',
      'Exhale (Cat): round your spine, tuck your chin and tailbone.',
      'Move slowly with your breath, linking each motion.',
      'Continue for 5 to 10 full cycles.',
    ],
    benefits: 'Mobilizes the spine, relieves back tension, eases stress.',
  },
  {
    name: 'Cobra Pose',
    sanskrit: 'Bhujangasana',
    image: yogaCobra,
    duration: '15–30 sec',
    steps: [
      'Lie face down with legs extended, tops of feet on the floor.',
      'Place palms under your shoulders, elbows hugged into ribs.',
      'Press the tops of your feet and pelvis firmly into the floor.',
      'On an inhale, gently lift your chest, keeping a slight bend in the elbows.',
      'Roll shoulders back; broaden across the collarbones.',
    ],
    benefits: 'Strengthens back, opens chest, improves mood.',
  },
  {
    name: 'Warrior II',
    sanskrit: 'Virabhadrasana II',
    image: yogaWarrior,
    duration: '30 sec each side',
    steps: [
      'Step feet wide apart. Turn the right foot out 90°, left foot slightly in.',
      'Bend the right knee directly over the right ankle (thigh parallel to floor).',
      'Extend arms parallel to the floor, palms down, gaze over the right hand.',
      'Keep the back leg strong and straight; sink hips down.',
      'Hold, breathe, then switch sides.',
    ],
    benefits: 'Builds strength and stamina, opens hips, fosters confidence.',
  },
  {
    name: 'Child\'s Pose',
    sanskrit: 'Balasana',
    image: yogaChild,
    duration: '1–3 min',
    steps: [
      'Kneel on the floor, big toes touching, knees apart wide.',
      'Sit your hips back onto your heels.',
      'Fold forward, resting your torso between your thighs.',
      'Extend arms forward, palms down, or rest them alongside your body.',
      'Let your forehead rest on the mat. Breathe softly.',
    ],
    benefits: 'Restful pose; calms the mind, gently stretches hips and back.',
  },
  {
    name: 'Corpse Pose',
    sanskrit: 'Savasana',
    image: yogaSavasana,
    duration: '5 min',
    steps: [
      'Lie flat on your back, legs extended and slightly apart.',
      'Let arms rest at your sides, palms facing up.',
      'Close your eyes. Relax your jaw and the muscles of your face.',
      'Allow your body to feel heavy and supported by the floor.',
      'Breathe naturally and stay for at least 5 minutes.',
    ],
    benefits: 'Integrates the practice; deeply restorative for body and mind.',
  },
];

const todayKey = () => new Date().toISOString().slice(0, 10);

const MindfulnessPage = () => {
  const [view, setView] = useState<View>('home');
  const [techniqueId, setTechniqueId] = useState<string>(breathingTechniques[0].id);
  const [running, setRunning] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseTime, setPhaseTime] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [poseIndex, setPoseIndex] = useState(0);
  const [completedPoses, setCompletedPoses] = useState<Set<number>>(new Set());
  const [log, setLog] = useState<ExerciseLogEntry[]>(() => getExerciseLog());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const technique = breathingTechniques.find(t => t.id === techniqueId)!;
  const currentPhase = running ? technique.pattern[phaseIndex] : null;
  const phaseDuration = currentPhase?.duration ?? 1;
  const progress = running ? (phaseTime / phaseDuration) * 100 : 0;

  const startBreathing = () => {
    setRunning(true);
    setTotalTime(technique.totalDuration);
    setPhaseIndex(0);
    setPhaseTime(0);
    setBreathCount(0);
  };

  const tick = useCallback(() => {
    setTotalTime(t => {
      if (t <= 1) {
        setRunning(false);
        if (timerRef.current) clearInterval(timerRef.current);
        // log on completion
        setLog(logExercise({ type: 'breathing', name: technique.name, durationSec: technique.totalDuration }));
        return 0;
      }
      return t - 1;
    });
    setPhaseTime(pt => {
      const dur = technique.pattern[phaseIndex]?.duration ?? 4;
      if (pt + 1 >= dur) {
        setPhaseIndex(pi => {
          const next = (pi + 1) % technique.pattern.length;
          if (next === 0) setBreathCount(bc => bc + 1);
          return next;
        });
        return 0;
      }
      return pt + 1;
    });
  }, [phaseIndex, technique]);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(tick, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [running, tick]);

  const completePose = () => {
    if (completedPoses.has(poseIndex)) return;
    const pose = yogaPoses[poseIndex];
    setLog(logExercise({ type: 'yoga', name: pose.name }));
    setCompletedPoses(prev => new Set(prev).add(poseIndex));
  };

  // Tracker stats
  const today = todayKey();
  const todayCount = log.filter(e => e.date === today).length;
  const last7Days = useMemo(() => {
    const days: { date: string; label: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({
        date: key,
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        count: log.filter(e => e.date === key).length,
      });
    }
    return days;
  }, [log]);
  const maxCount = Math.max(1, ...last7Days.map(d => d.count));
  const streak = useMemo(() => {
    let s = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      if (log.some(e => e.date === key)) s++;
      else if (i === 0) break; // no entry today => streak 0
      else break;
    }
    return s;
  }, [log]);

  const mins = Math.floor(totalTime / 60);
  const secs = totalTime % 60;
  const circleScale = currentPhase?.phase === 'inhale' ? 1.25
    : currentPhase?.phase === 'exhale' ? 0.85
    : 1;

  // ============ BREATHING VIEW ============
  if (view === 'breathing') {
    return (
      <PageLayout>
        <section className="min-h-[80vh] px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <button onClick={() => { setView('home'); setRunning(false); }} className="text-sm text-muted-foreground mb-4 cursor-pointer bg-transparent border-none hover:text-foreground">
              ← Back
            </button>

            <div className="glass-card p-6 mb-4">
              <h1 className="font-heading text-2xl font-bold text-foreground mb-1">Breathing Exercises</h1>
              <p className="text-sm text-muted-foreground mb-4">Choose a technique that fits your moment</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {breathingTechniques.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setTechniqueId(t.id); setRunning(false); setTotalTime(0); setBreathCount(0); }}
                    disabled={running}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      techniqueId === t.id
                        ? 'bg-primary/10 border-primary'
                        : 'bg-card border-border hover:border-primary/40'
                    } ${running ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="font-semibold text-sm text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{t.benefit}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card p-8 text-center">
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{technique.desc}</p>

              <p className="text-3xl font-bold text-foreground mb-2 font-body tabular-nums">
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
              </p>
              <p className="text-lg text-botanical-dark font-medium mb-4 min-h-[28px]">
                {running ? currentPhase?.label : totalTime === 0 && breathCount > 0 ? 'Session complete! 🌿' : 'Press Start when ready'}
              </p>

              <motion.div
                animate={{ scale: running ? circleScale : 1 }}
                transition={{ duration: phaseDuration, ease: 'easeInOut' }}
                className="w-44 h-44 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ background: `conic-gradient(hsl(var(--primary)) ${progress}%, hsl(var(--secondary)) 0%)` }}
              >
                <div className="w-40 h-40 rounded-full bg-card flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-foreground">{breathCount}</span>
                  <span className="text-xs text-muted-foreground">breaths</span>
                </div>
              </motion.div>

              {!running ? (
                <button onClick={startBreathing} className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold transition-all hover:-translate-y-0.5 cursor-pointer border-none">
                  {totalTime === 0 && breathCount > 0 ? 'Start Again' : 'Start'}
                </button>
              ) : (
                <button onClick={() => { setRunning(false); setTotalTime(0); }} className="px-8 py-3 rounded-full bg-secondary text-foreground font-semibold transition-all hover:-translate-y-0.5 cursor-pointer border-none">
                  Stop
                </button>
              )}
            </div>
          </div>
        </section>
      </PageLayout>
    );
  }

  // ============ YOGA VIEW ============
  if (view === 'yoga') {
    const pose = yogaPoses[poseIndex];
    const done = completedPoses.has(poseIndex);
    return (
      <PageLayout>
        <section className="min-h-[80vh] px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <button onClick={() => setView('home')} className="text-sm text-muted-foreground mb-4 cursor-pointer bg-transparent border-none hover:text-foreground">
              ← Back
            </button>

            <div className="glass-card p-6 mb-4">
              <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Yoga Practice</h1>
              <div className="flex flex-wrap gap-2">
                {yogaPoses.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setPoseIndex(i)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      i === poseIndex
                        ? 'bg-primary text-primary-foreground border-primary'
                        : completedPoses.has(i)
                        ? 'bg-botanical/30 border-botanical text-foreground'
                        : 'bg-card border-border text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    {completedPoses.has(i) && '✓ '}{p.name}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={poseIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="glass-card p-6 grid md:grid-cols-2 gap-6"
              >
                <div className="rounded-xl overflow-hidden bg-secondary/40 flex items-center justify-center">
                  <img src={pose.image} alt={pose.name} loading="lazy" width={512} height={512} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-1">{pose.name}</h2>
                  <p className="text-sm italic text-botanical-dark mb-3">{pose.sanskrit} · {pose.duration}</p>

                  <h3 className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">How to do it</h3>
                  <ol className="space-y-1.5 mb-4 text-sm text-foreground">
                    {pose.steps.map((step, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-botanical-dark font-bold">{i + 1}.</span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>

                  <div className="p-3 rounded-lg bg-secondary/50 mb-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1">Benefits</p>
                    <p className="text-sm text-foreground">{pose.benefits}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={completePose}
                      disabled={done}
                      className={`flex-1 px-4 py-2 rounded-full font-semibold text-sm transition-all border-none ${
                        done
                          ? 'bg-botanical/40 text-foreground cursor-default'
                          : 'bg-primary text-primary-foreground cursor-pointer hover:-translate-y-0.5'
                      }`}
                    >
                      {done ? '✓ Logged today' : 'Mark as done'}
                    </button>
                    {poseIndex < yogaPoses.length - 1 && (
                      <button onClick={() => setPoseIndex(i => i + 1)} className="px-4 py-2 rounded-full bg-secondary text-foreground font-medium text-sm cursor-pointer border-none transition-all hover:-translate-y-0.5">
                        Next →
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </PageLayout>
    );
  }

  // ============ TRACKER VIEW ============
  if (view === 'tracker') {
    const recent = [...log].reverse().slice(0, 15);
    return (
      <PageLayout>
        <section className="min-h-[80vh] px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <button onClick={() => setView('home')} className="text-sm text-muted-foreground mb-4 cursor-pointer bg-transparent border-none hover:text-foreground">
              ← Back
            </button>

            <div className="glass-card p-6 mb-4">
              <h1 className="font-heading text-2xl font-bold text-foreground mb-1">Daily Practice Tracker</h1>
              <p className="text-sm text-muted-foreground mb-6">Your mindfulness streak and history</p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-4 rounded-xl bg-secondary/50 text-center">
                  <div className="text-3xl font-bold text-foreground">{todayCount}</div>
                  <div className="text-xs text-muted-foreground mt-1">Today</div>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50 text-center">
                  <div className="text-3xl font-bold text-foreground">{streak} 🔥</div>
                  <div className="text-xs text-muted-foreground mt-1">Day streak</div>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50 text-center">
                  <div className="text-3xl font-bold text-foreground">{log.length}</div>
                  <div className="text-xs text-muted-foreground mt-1">All time</div>
                </div>
              </div>

              <h3 className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-3">Last 7 days</h3>
              <div className="flex items-end justify-between gap-2 h-32 mb-6">
                {last7Days.map(d => (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-xs text-foreground font-medium">{d.count || ''}</div>
                    <div
                      className="w-full rounded-t-md bg-primary/70 transition-all min-h-[4px]"
                      style={{ height: `${(d.count / maxCount) * 80}%` }}
                    />
                    <div className="text-xs text-muted-foreground">{d.label}</div>
                  </div>
                ))}
              </div>

              <h3 className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-3">Recent activity</h3>
              {recent.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No exercises logged yet. Start a breathing or yoga session!</p>
              ) : (
                <ul className="space-y-2 max-h-64 overflow-y-auto">
                  {recent.map((e, i) => (
                    <li key={i} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{e.type === 'breathing' ? '🫁' : '🧘'}</span>
                        <div>
                          <div className="text-sm font-medium text-foreground">{e.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(e.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      {e.durationSec && (
                        <span className="text-xs text-muted-foreground">{Math.round(e.durationSec / 60)} min</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </PageLayout>
    );
  }

  // ============ HOME VIEW ============
  return (
    <PageLayout>
      <section className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass-card max-w-md w-full p-10 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Mindfulness</h1>
          <p className="text-botanical-dark mb-6">Breathe, move, and track your practice</p>

          <div className="grid grid-cols-3 gap-2 mb-6 text-center">
            <div className="p-2 rounded-lg bg-secondary/40">
              <div className="text-xl font-bold text-foreground">{todayCount}</div>
              <div className="text-[10px] text-muted-foreground">Today</div>
            </div>
            <div className="p-2 rounded-lg bg-secondary/40">
              <div className="text-xl font-bold text-foreground">{streak} 🔥</div>
              <div className="text-[10px] text-muted-foreground">Streak</div>
            </div>
            <div className="p-2 rounded-lg bg-secondary/40">
              <div className="text-xl font-bold text-foreground">{log.length}</div>
              <div className="text-[10px] text-muted-foreground">Total</div>
            </div>
          </div>

          <div className="space-y-3">
            <button onClick={() => setView('breathing')} className="w-full px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold cursor-pointer border-none transition-all hover:-translate-y-0.5 hover:shadow-lg">
              🫁 Breathing Exercises
            </button>
            <button onClick={() => setView('yoga')} className="w-full px-6 py-3 rounded-full bg-secondary text-foreground font-semibold cursor-pointer border-none transition-all hover:-translate-y-0.5 hover:shadow-lg">
              🧘 Yoga Postures
            </button>
            <button onClick={() => setView('tracker')} className="w-full px-6 py-3 rounded-full bg-botanical/40 text-foreground font-semibold cursor-pointer border-none transition-all hover:-translate-y-0.5 hover:shadow-lg">
              📊 My Practice Tracker
            </button>
          </div>
        </motion.div>
      </section>
    </PageLayout>
  );
};

export default MindfulnessPage;