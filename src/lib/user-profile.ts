// ============================
// USER PROFILE & PERSONALIZATION
// LocalStorage-based personality + cycle prefs
// ============================

const PROFILE_KEY = 'healingHub_userProfile';
const CYCLE_KEY = 'healingHub_cycleData';

export interface UserProfile {
  completedOnboarding: boolean;
  pronouns?: string;
  ageRange?: string;
  tracksCycle: boolean;
  averageCycleLength: number; // days
  averagePeriodLength: number; // days
  // Personality
  primaryGoal?: string; // 'manage-stress' | 'sleep-better' | 'cycle-awareness' | 'self-discovery' | 'mood-stability'
  copingStyle?: string; // 'solitude' | 'connection' | 'movement' | 'creativity'
  energyPattern?: string; // 'morning' | 'evening' | 'variable'
  supportPreference?: string; // 'gentle' | 'direct' | 'playful' | 'analytical'
  stressTriggers?: string[];
  joyfulActivities?: string[];
  createdAt?: string;
}

export const DEFAULT_PROFILE: UserProfile = {
  completedOnboarding: false,
  tracksCycle: false,
  averageCycleLength: 28,
  averagePeriodLength: 5,
};

export function getUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveUserProfile(profile: UserProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function clearUserProfile() {
  localStorage.removeItem(PROFILE_KEY);
}

// ============================
// CYCLE TRACKING
// ============================

export interface CycleEntry {
  date: string; // YYYY-MM-DD
  flow?: 'spotting' | 'light' | 'medium' | 'heavy';
  mood?: string;
  energy?: number; // 1-5
  symptoms?: string[]; // cramps, headache, bloating, etc.
  note?: string;
  isPeriodStart?: boolean;
}

export interface CycleData {
  entries: CycleEntry[];
  periodStarts: string[]; // sorted YYYY-MM-DD
}

const DEFAULT_CYCLE: CycleData = { entries: [], periodStarts: [] };

export function getCycleData(): CycleData {
  try {
    const raw = localStorage.getItem(CYCLE_KEY);
    if (!raw) return { ...DEFAULT_CYCLE };
    const parsed = JSON.parse(raw);
    return { entries: parsed.entries ?? [], periodStarts: parsed.periodStarts ?? [] };
  } catch {
    return { ...DEFAULT_CYCLE };
  }
}

export function saveCycleData(data: CycleData) {
  localStorage.setItem(CYCLE_KEY, JSON.stringify(data));
}

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal' | 'unknown';

export interface PhaseInfo {
  phase: CyclePhase;
  dayOfCycle: number | null;
  daysUntilNextPeriod: number | null;
  nextPeriodDate: string | null;
  ovulationDate: string | null;
  fertileWindowStart: string | null;
  fertileWindowEnd: string | null;
}

function ymd(d: Date) {
  return d.toISOString().split('T')[0];
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function diffDays(a: Date, b: Date) {
  const ms = a.setHours(0,0,0,0) - new Date(b).setHours(0,0,0,0);
  return Math.round(ms / 86400000);
}

/**
 * Predict cycle phase + next period from period start history + averages.
 */
export function predictCyclePhase(
  cycle: CycleData,
  profile: UserProfile,
  forDate: Date = new Date()
): PhaseInfo {
  const cycleLen = profile.averageCycleLength || 28;
  const periodLen = profile.averagePeriodLength || 5;

  if (cycle.periodStarts.length === 0) {
    return {
      phase: 'unknown',
      dayOfCycle: null,
      daysUntilNextPeriod: null,
      nextPeriodDate: null,
      ovulationDate: null,
      fertileWindowStart: null,
      fertileWindowEnd: null,
    };
  }

  const sorted = [...cycle.periodStarts].sort();
  // Most recent period start on or before forDate
  const target = ymd(forDate);
  const lastStartStr = [...sorted].reverse().find(s => s <= target) ?? sorted[sorted.length - 1];
  const lastStart = new Date(lastStartStr);

  const dayOfCycle = diffDays(new Date(forDate), lastStart) + 1;
  const nextPeriod = addDays(lastStart, cycleLen);
  const daysUntilNext = diffDays(nextPeriod, new Date(forDate));
  const ovulation = addDays(lastStart, cycleLen - 14);
  const fertileStart = addDays(ovulation, -5);
  const fertileEnd = addDays(ovulation, 1);

  let phase: CyclePhase;
  if (dayOfCycle <= periodLen) phase = 'menstrual';
  else if (dayOfCycle < cycleLen - 14 - 1) phase = 'follicular';
  else if (dayOfCycle <= cycleLen - 14 + 1) phase = 'ovulation';
  else phase = 'luteal';

  return {
    phase,
    dayOfCycle,
    daysUntilNextPeriod: daysUntilNext,
    nextPeriodDate: ymd(nextPeriod),
    ovulationDate: ymd(ovulation),
    fertileWindowStart: ymd(fertileStart),
    fertileWindowEnd: ymd(fertileEnd),
  };
}

export const PHASE_INSIGHTS: Record<CyclePhase, { title: string; emoji: string; body: string; suggestions: string[] }> = {
  menstrual: {
    title: 'Menstrual Phase',
    emoji: '🌑',
    body: "Your body is shedding and resetting. Energy may dip — this is a natural time to slow down, rest, and turn inward.",
    suggestions: ['Gentle stretching or restorative yoga', 'Warm baths and heating pads', 'Journaling and reflection', 'Iron-rich foods and warm teas'],
  },
  follicular: {
    title: 'Follicular Phase',
    emoji: '🌒',
    body: "Estrogen is rising. You may feel more energetic, creative, and ready to start new things.",
    suggestions: ['Try a new workout or hobby', 'Brainstorm and plan projects', 'Social activities feel good now', 'Cardio and strength training'],
  },
  ovulation: {
    title: 'Ovulation Phase',
    emoji: '🌕',
    body: "Peak energy and confidence. Communication and connection often feel easier — a great time for important conversations.",
    suggestions: ['Schedule meetings or dates', 'High-intensity workouts', 'Creative collaboration', 'Express your needs clearly'],
  },
  luteal: {
    title: 'Luteal Phase',
    emoji: '🌘',
    body: "Progesterone rises, then falls. You may feel more inward, sensitive, or focused on detail. Be gentle with yourself.",
    suggestions: ['Lower-intensity movement like walking or yoga', 'Magnesium-rich foods (dark chocolate, nuts)', 'Set boundaries and rest', 'Finish projects rather than start new ones'],
  },
  unknown: {
    title: 'Log a Period to Begin',
    emoji: '🌙',
    body: "Once you log your first period, we can predict your cycle phases and personalize insights.",
    suggestions: ['Tap "Log Period Start" when you next begin menstruating'],
  },
};

export function logPeriodStart(date: string): CycleData {
  const data = getCycleData();
  if (!data.periodStarts.includes(date)) {
    data.periodStarts = [...data.periodStarts, date].sort();
  }
  // Mark entry as period start
  const existing = data.entries.find(e => e.date === date);
  if (existing) {
    existing.isPeriodStart = true;
    existing.flow = existing.flow ?? 'medium';
  } else {
    data.entries.push({ date, isPeriodStart: true, flow: 'medium' });
  }
  saveCycleData(data);
  return data;
}

export function removePeriodStart(date: string): CycleData {
  const data = getCycleData();
  data.periodStarts = data.periodStarts.filter(d => d !== date);
  const entry = data.entries.find(e => e.date === date);
  if (entry) entry.isPeriodStart = false;
  saveCycleData(data);
  return data;
}

export function upsertCycleEntry(entry: CycleEntry): CycleData {
  const data = getCycleData();
  const idx = data.entries.findIndex(e => e.date === entry.date);
  if (idx >= 0) {
    data.entries[idx] = { ...data.entries[idx], ...entry };
  } else {
    data.entries.push(entry);
  }
  if (entry.isPeriodStart && !data.periodStarts.includes(entry.date)) {
    data.periodStarts = [...data.periodStarts, entry.date].sort();
  }
  saveCycleData(data);
  return data;
}

/**
 * Recompute average cycle length from period start history.
 */
export function computeAverageCycleLength(starts: string[], fallback = 28): number {
  if (starts.length < 2) return fallback;
  const sorted = [...starts].sort();
  const gaps: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const a = new Date(sorted[i - 1]);
    const b = new Date(sorted[i]);
    const days = Math.round((b.getTime() - a.getTime()) / 86400000);
    if (days >= 15 && days <= 60) gaps.push(days);
  }
  if (gaps.length === 0) return fallback;
  return Math.round(gaps.reduce((s, g) => s + g, 0) / gaps.length);
}

/**
 * Greeting tone based on personality profile.
 */
export function getPersonalizedTone(profile: UserProfile): string {
  const map: Record<string, string> = {
    gentle: 'soft and nurturing',
    direct: 'clear and grounded',
    playful: 'warm and lighthearted',
    analytical: 'thoughtful and reflective',
  };
  return map[profile.supportPreference ?? 'gentle'] ?? 'gentle';
}