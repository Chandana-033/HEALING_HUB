import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { getUserProfile, saveUserProfile, UserProfile } from '@/lib/user-profile';

interface ChoiceOption {
  value: string;
  label: string;
  emoji: string;
  description?: string;
}

interface Step {
  key: keyof UserProfile;
  question: string;
  subtitle?: string;
  type: 'single' | 'multi' | 'number';
  options?: ChoiceOption[];
  min?: number;
  max?: number;
  unit?: string;
  optional?: boolean;
}

const STEPS: Step[] = [
  {
    key: 'pronouns',
    question: 'How would you like us to refer to you?',
    subtitle: 'This helps us speak to you in a way that feels right.',
    type: 'single',
    options: [
      { value: 'she/her', label: 'She / Her', emoji: '🌸' },
      { value: 'they/them', label: 'They / Them', emoji: '🌿' },
      { value: 'he/him', label: 'He / Him', emoji: '🍃' },
      { value: 'prefer-not', label: 'Prefer not to say', emoji: '✨' },
    ],
  },
  {
    key: 'tracksCycle',
    question: 'Would you like to track a menstrual cycle?',
    subtitle: 'Luna Tracker can help you understand mood patterns across your cycle.',
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes, track my cycle', emoji: '🌙', description: 'Personalized cycle insights & predictions' },
      { value: 'no', label: 'Not right now', emoji: '🌟', description: 'Just mood and wellness tracking' },
    ],
  },
  {
    key: 'averageCycleLength',
    question: 'Roughly how long is your usual cycle?',
    subtitle: 'From the first day of one period to the first of the next. The average is 28 days — but yours is uniquely yours.',
    type: 'number',
    min: 21,
    max: 40,
    unit: 'days',
  },
  {
    key: 'averagePeriodLength',
    question: 'How many days does your period usually last?',
    type: 'number',
    min: 2,
    max: 10,
    unit: 'days',
  },
  {
    key: 'primaryGoal',
    question: 'What brings you here today?',
    subtitle: 'No wrong answer — this just helps us tune your dashboard.',
    type: 'single',
    options: [
      { value: 'manage-stress', label: 'Manage stress & anxiety', emoji: '🍃' },
      { value: 'mood-stability', label: 'Understand my moods', emoji: '🌈' },
      { value: 'cycle-awareness', label: 'Cycle & body awareness', emoji: '🌙' },
      { value: 'self-discovery', label: 'Self-reflection & growth', emoji: '✨' },
    ],
  },
  {
    key: 'copingStyle',
    question: 'When things feel heavy, what helps you most?',
    type: 'single',
    options: [
      { value: 'solitude', label: 'Quiet time alone', emoji: '🌌' },
      { value: 'connection', label: 'Talking with someone', emoji: '🤝' },
      { value: 'movement', label: 'Moving my body', emoji: '🧘' },
      { value: 'creativity', label: 'Creating or expressing', emoji: '🎨' },
    ],
  },
  {
    key: 'energyPattern',
    question: 'When do you feel most like yourself?',
    type: 'single',
    options: [
      { value: 'morning', label: 'Early mornings', emoji: '🌅' },
      { value: 'evening', label: 'Late evenings', emoji: '🌙' },
      { value: 'variable', label: 'It changes', emoji: '🌊' },
    ],
  },
  {
    key: 'supportPreference',
    question: 'How would you like our companion to talk with you?',
    subtitle: 'You can always change this later.',
    type: 'single',
    options: [
      { value: 'gentle', label: 'Soft & nurturing', emoji: '🌷' },
      { value: 'direct', label: 'Clear & grounded', emoji: '🌳' },
      { value: 'playful', label: 'Warm & lighthearted', emoji: '🌻' },
      { value: 'analytical', label: 'Thoughtful & reflective', emoji: '🌙' },
    ],
  },
  {
    key: 'stressTriggers',
    question: 'What tends to drain you? (pick any)',
    type: 'multi',
    optional: true,
    options: [
      { value: 'work', label: 'Work pressure', emoji: '💼' },
      { value: 'relationships', label: 'Relationships', emoji: '💞' },
      { value: 'sleep', label: 'Poor sleep', emoji: '😴' },
      { value: 'overwhelm', label: 'Too many tasks', emoji: '📚' },
      { value: 'social', label: 'Social situations', emoji: '👥' },
      { value: 'health', label: 'Health worries', emoji: '🩺' },
    ],
  },
  {
    key: 'joyfulActivities',
    question: 'What lights you up? (pick any)',
    type: 'multi',
    optional: true,
    options: [
      { value: 'music', label: 'Music', emoji: '🎵' },
      { value: 'nature', label: 'Time in nature', emoji: '🌿' },
      { value: 'reading', label: 'Reading', emoji: '📖' },
      { value: 'cooking', label: 'Cooking', emoji: '🍳' },
      { value: 'art', label: 'Art & creativity', emoji: '🎨' },
      { value: 'movement', label: 'Movement', emoji: '🤸' },
      { value: 'pets', label: 'Animals', emoji: '🐾' },
      { value: 'friends', label: 'Friends & family', emoji: '🫂' },
    ],
  },
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(getUserProfile);
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Determine visible steps based on cycle preference
  const visibleSteps = STEPS.filter(s => {
    if ((s.key === 'averageCycleLength' || s.key === 'averagePeriodLength') && !profile.tracksCycle) {
      return false;
    }
    return true;
  });

  const step = visibleSteps[stepIdx];
  const progress = ((stepIdx + 1) / visibleSteps.length) * 100;

  const setValue = (val: any) => {
    if (step.key === 'tracksCycle') {
      setProfile(p => ({ ...p, tracksCycle: val === 'yes' }));
    } else {
      setProfile(p => ({ ...p, [step.key]: val } as UserProfile));
    }
  };

  const toggleMulti = (val: string) => {
    const current = (profile[step.key] as string[] | undefined) ?? [];
    const next = current.includes(val) ? current.filter(v => v !== val) : [...current, val];
    setProfile(p => ({ ...p, [step.key]: next } as UserProfile));
  };

  const currentValue = profile[step.key];
  const canAdvance = step.optional || step.type === 'multi'
    ? true
    : step.key === 'tracksCycle'
      ? profile.tracksCycle !== undefined
      : currentValue !== undefined && currentValue !== '';

  const next = () => {
    if (stepIdx < visibleSteps.length - 1) {
      setStepIdx(stepIdx + 1);
    } else {
      finish();
    }
  };

  const finish = () => {
    const finalProfile: UserProfile = {
      ...profile,
      completedOnboarding: true,
      createdAt: profile.createdAt ?? new Date().toISOString(),
    };
    saveUserProfile(finalProfile);
    toast.success('Your sanctuary is ready 🌸');
    navigate('/dashboard');
  };

  const skip = () => {
    const finalProfile: UserProfile = {
      ...profile,
      completedOnboarding: true,
      createdAt: new Date().toISOString(),
    };
    saveUserProfile(finalProfile);
    navigate('/dashboard');
  };

  if (authLoading || !user) {
    return <PageLayout><div className="p-12 text-center text-muted-foreground">Loading…</div></PageLayout>;
  }

  return (
    <PageLayout>
      <section className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2 text-xs text-muted-foreground">
            <span>Step {stepIdx + 1} of {visibleSteps.length}</span>
            <button onClick={skip} className="hover:text-botanical-dark bg-transparent border-none cursor-pointer">
              Skip for now
            </button>
          </div>
          <div className="h-1.5 rounded-full bg-card overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={stepIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-8"
          >
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">
              {step.question}
            </h1>
            {step.subtitle && (
              <p className="text-sm text-muted-foreground mb-6">{step.subtitle}</p>
            )}

            {step.type === 'single' && step.options && (
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {step.options.map(opt => {
                  const selected = step.key === 'tracksCycle'
                    ? (profile.tracksCycle && opt.value === 'yes') || (!profile.tracksCycle && opt.value === 'no' && currentValue !== undefined)
                    : currentValue === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setValue(opt.value)}
                      className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        selected
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-card/50 hover:border-primary/50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{opt.emoji}</div>
                      <div className="font-semibold text-foreground text-sm">{opt.label}</div>
                      {opt.description && (
                        <div className="text-xs text-muted-foreground mt-1">{opt.description}</div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {step.type === 'multi' && step.options && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                {step.options.map(opt => {
                  const arr = (currentValue as string[] | undefined) ?? [];
                  const selected = arr.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => toggleMulti(opt.value)}
                      className={`text-center p-3 rounded-xl border-2 transition-all cursor-pointer ${
                        selected
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-card/50 hover:border-primary/50'
                      }`}
                    >
                      <div className="text-xl mb-0.5">{opt.emoji}</div>
                      <div className="text-xs font-medium text-foreground">{opt.label}</div>
                    </button>
                  );
                })}
              </div>
            )}

            {step.type === 'number' && (
              <div className="mb-6">
                <div className="text-center mb-4">
                  <div className="font-heading text-5xl font-bold text-foreground">
                    {(currentValue as number) ?? (step.key === 'averageCycleLength' ? 28 : 5)}
                  </div>
                  <div className="text-sm text-muted-foreground">{step.unit}</div>
                </div>
                <input
                  type="range"
                  min={step.min}
                  max={step.max}
                  value={(currentValue as number) ?? (step.key === 'averageCycleLength' ? 28 : 5)}
                  onChange={e => setValue(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{step.min} {step.unit}</span>
                  <span>{step.max} {step.unit}</span>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <button
                onClick={() => setStepIdx(Math.max(0, stepIdx - 1))}
                disabled={stepIdx === 0}
                className="text-sm text-muted-foreground hover:text-botanical-dark bg-transparent border-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Back
              </button>
              <button
                onClick={next}
                disabled={!canAdvance}
                className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold cursor-pointer border-none transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {stepIdx === visibleSteps.length - 1 ? 'Finish 🌸' : 'Continue →'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>
    </PageLayout>
  );
};

export default OnboardingPage;