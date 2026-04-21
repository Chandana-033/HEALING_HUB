// ============================
// WELLNESS LOGIC MODULE
// Safety monitoring, CBT responses, privacy
// ============================

// High-risk keywords for safety monitoring
const HIGH_RISK_KEYWORDS = [
  'hopeless', 'end it all', 'kill myself', 'suicide', 'want to die',
  'no reason to live', 'better off dead', 'can\'t go on', 'give up on life',
  'self harm', 'hurt myself', 'not worth living', 'end my life',
];

// CBT-based response patterns
const CBT_RESPONSES: Record<string, string[]> = {
  overwhelmed: [
    "Let's try a grounding exercise: Name 3 things you can see right now, 2 things you can touch, and 1 thing you can hear.",
    "Take a slow breath. Now, let's break this feeling down: What is one small thing you can control right now?",
    "Feeling overwhelmed is your mind's signal that it's carrying too much. Let's set one thing aside — what can wait until tomorrow?",
  ],
  anxious: [
    "Try the 4-7-8 breathing technique: Inhale for 4 seconds, hold for 7, exhale for 8. Let's do it together.",
    "Anxiety often lives in the future. Let's come back to now: What are you physically feeling in your body right now?",
    "Write down one worst-case scenario and one best-case scenario. Reality is usually somewhere in between.",
  ],
  sad: [
    "It's okay to feel sad. Can you recall one small moment today that brought you even a tiny bit of comfort?",
    "Sadness is a valid emotion. Try writing three things you're grateful for, even tiny ones like warm socks.",
    "Sometimes sadness needs space. Would you like to try a gentle breathing exercise or listen to calming music?",
  ],
  angry: [
    "Let's pause before reacting. Try clenching your fists for 5 seconds, then slowly releasing. Notice the difference.",
    "Anger often masks another feeling underneath. Can you identify what triggered this? Was it hurt, frustration, or fear?",
    "Try the STOP technique: Stop, Take a breath, Observe your feelings, Proceed mindfully.",
  ],
  lonely: [
    "Loneliness can feel heavy. Remember: reaching out isn't weakness. Is there someone you could send a simple 'hi' to?",
    "Try this: write a letter to your future self about how you're feeling. It's a form of self-connection.",
    "You're here, and that matters. Would you like to try journaling your thoughts in Soul Scribbles?",
  ],
  stressed: [
    "Let's do a body scan: Starting from your toes, slowly move attention upward. Where do you feel tension? Breathe into that spot.",
    "Stress often comes from 'should' thinking. Replace 'I should' with 'I could' — notice how that changes the pressure.",
    "Write down everything stressing you. Circle what you can control. Let go of the rest for now.",
  ],
};

/**
 * Monitor text input for mental safety concerns
 * Returns true if high-risk content detected
 */
export function monitorMentalSafety(text: string): boolean {
  const lowerText = text.toLowerCase();
  return HIGH_RISK_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

/**
 * Get CBT-based response for a detected mood keyword
 */
export function getCBTResponse(text: string): string | null {
  const lowerText = text.toLowerCase();
  for (const [mood, responses] of Object.entries(CBT_RESPONSES)) {
    if (lowerText.includes(mood)) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  return null;
}

// ============================
// LOCAL STORAGE PRIVACY LAYER
// ============================

const STORAGE_KEYS = {
  JOURNAL_ENTRIES: 'healingHub_journalEntries',
  MOOD_DATA: 'healingHub_moodData',
  CUSTOM_FACTS: 'healingHub_customFacts',
  LUNA_DATA: 'healingHub_lunaMoodData',
  SLEEP_DATA: 'healingHub_sleepData',
  EXERCISE_LOG: 'healingHub_exerciseLog',
};

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  date: string;
}

export interface MoodEntry {
  date: string;
  mood: string;
  score: number; // 1-5
}

export interface ExerciseLogEntry {
  date: string; // YYYY-MM-DD
  type: 'breathing' | 'yoga';
  name: string;
  durationSec?: number;
  timestamp: number;
}

export function getExerciseLog(): ExerciseLogEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EXERCISE_LOG);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function logExercise(entry: Omit<ExerciseLogEntry, 'date' | 'timestamp'>) {
  const all = getExerciseLog();
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  all.push({ ...entry, date, timestamp: now.getTime() });
  localStorage.setItem(STORAGE_KEYS.EXERCISE_LOG, JSON.stringify(all));
  return all;
}

export function getJournalEntries(): JournalEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveJournalEntries(entries: JournalEntry[]) {
  localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(entries));
}

export function getMoodData(): MoodEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MOOD_DATA);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveMoodData(entries: MoodEntry[]) {
  localStorage.setItem(STORAGE_KEYS.MOOD_DATA, JSON.stringify(entries));
}

export function useWellnessStorage() {
  const clearAllData = () => {
    if (window.confirm('This will permanently delete all your journal entries, mood data, and custom facts. This cannot be undone. Continue?')) {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
      window.location.reload();
    }
  };

  return { clearAllData };
}

// Safety event bus
type SafetyListener = () => void;
let safetyListeners: SafetyListener[] = [];

export function onSafetyAlert(listener: SafetyListener) {
  safetyListeners.push(listener);
  return () => {
    safetyListeners = safetyListeners.filter(l => l !== listener);
  };
}

export function triggerSafetyAlert() {
  safetyListeners.forEach(l => l());
}
