import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { monitorMentalSafety, triggerSafetyAlert } from '@/lib/wellness-logic';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  suggestion?: SuggestionKey;
}

type SuggestionKey = 'music' | 'mindfulness' | 'games' | 'journal' | 'insights' | 'therapist';

const SUGGESTIONS: Record<SuggestionKey, { label: string; to: string; emoji: string }> = {
  music:        { label: 'Open Tune In',         to: '/tune-in',      emoji: '🎵' },
  mindfulness:  { label: 'Try Mindfulness',      to: '/mindfulness',  emoji: '🌬️' },
  games:        { label: 'Play a Brain Teaser',  to: '/brain-teasers',emoji: '🧩' },
  journal:      { label: 'Open Soul Scribbles',  to: '/journal',      emoji: '📓' },
  insights:     { label: 'See your Insights',    to: '/insights',     emoji: '📈' },
  therapist:    { label: 'Find real support',    to: '/therapist',    emoji: '🤝' },
};

const greetings = [
  "Hi there 🌿 I'm here to listen. How are you feeling right now?",
  "Welcome 💚 What's on your mind today?",
  "Hello! I'm a gentle space to talk things through. How's your heart today?",
];

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const parseSuggestion = (raw: string): { text: string; suggestion?: SuggestionKey } => {
  const match = raw.match(/\[SUGGEST:(music|mindfulness|games|journal|insights|therapist)\]/i);
  if (!match) return { text: raw.trim() };
  const key = match[1].toLowerCase() as SuggestionKey;
  const text = raw.replace(match[0], '').trim();
  return { text, suggestion: key };
};

const TherapyChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'g', role: 'bot', text: pick(greetings) },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = async () => {
    const text = input.trim();
    if (!text || typing) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');

    // Safety check (local keyword scan triggers the modal regardless of AI)
    if (monitorMentalSafety(text)) {
      triggerSafetyAlert();
    }

    setTyping(true);

    try {
      const history = nextMessages.map(m => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.text,
      }));

      const { data, error } = await supabase.functions.invoke('therapy-chat', {
        body: { messages: history },
      });

      if (error) throw error;
      const raw: string = data?.reply ?? '';
      const { text: replyText, suggestion } = parseSuggestion(raw);

      setMessages(m => [
        ...m,
        {
          id: Date.now().toString() + 'b',
          role: 'bot',
          text: replyText || "I'm here with you. Could you tell me a little more?",
          suggestion,
        },
      ]);
    } catch (err: unknown) {
      console.error('therapy-chat error', err);
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast({
        title: "I couldn't reach the gentle space",
        description: message,
        variant: 'destructive',
      });
      setMessages(m => [
        ...m,
        {
          id: Date.now().toString() + 'b',
          role: 'bot',
          text: "I'm having trouble hearing you right now 🤍 Could you try sending that again in a moment?",
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="glass-card p-5 flex flex-col" style={{ height: '520px' }}>
      <div className="flex items-center gap-2 pb-3 border-b border-primary/20 mb-3">
        <span className="text-2xl">💬</span>
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground leading-tight">Sage — your gentle companion</h3>
          <p className="text-xs text-muted-foreground">A warm space to talk it out — not a substitute for professional care.</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-2">
        <AnimatePresence initial={false}>
          {messages.map(m => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-card text-foreground border border-border rounded-bl-sm'
                } whitespace-pre-wrap`}
              >
                {m.text}
              </div>
              {m.suggestion && SUGGESTIONS[m.suggestion] && (
                <Link
                  to={SUGGESTIONS[m.suggestion].to}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-botanical-glow/30 text-foreground text-xs font-medium border border-primary/30 no-underline hover:bg-botanical-glow/50 transition-colors"
                >
                  <span>{SUGGESTIONS[m.suggestion].emoji}</span>
                  {SUGGESTIONS[m.suggestion].label} →
                </Link>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && (
          <div className="flex justify-start">
            <div className="bg-card border border-border px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm text-muted-foreground">
              <span className="inline-block animate-pulse">typing…</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-primary/20">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') send(); }}
          placeholder="Share what's on your mind…"
          disabled={typing}
          className="flex-1 px-4 py-2.5 rounded-full bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-botanical-glow"
        />
        <button
          onClick={send}
          disabled={typing}
          className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold cursor-pointer border-none transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default TherapyChatbot;