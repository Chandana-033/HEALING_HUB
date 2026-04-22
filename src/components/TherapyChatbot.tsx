import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { monitorMentalSafety, triggerSafetyAlert, getCBTResponse } from '@/lib/wellness-logic';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
}

const greetings = [
  "Hi there 🌿 I'm here to listen. How are you feeling right now?",
  "Welcome 💚 What's on your mind today?",
  "Hello! I'm a gentle space to talk things through. How's your heart today?",
];

const fallbackReplies = [
  "Thank you for sharing that with me. Can you tell me a little more about what you're feeling?",
  "That sounds important. What do you think triggered this for you?",
  "I hear you. Sometimes naming what we feel helps it soften — would you like to try a breathing exercise?",
  "You're not alone in this. What would feel supportive right now?",
  "I'm here. Take your time — what's the strongest emotion in this moment?",
];

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

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

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages(m => [...m, userMsg]);
    setInput('');

    // Safety check
    if (monitorMentalSafety(text)) {
      triggerSafetyAlert();
    }

    setTyping(true);
    setTimeout(() => {
      const cbt = getCBTResponse(text);
      const reply = cbt || pick(fallbackReplies);
      setMessages(m => [...m, { id: Date.now().toString() + 'b', role: 'bot', text: reply }]);
      setTyping(false);
    }, 800 + Math.random() * 600);
  };

  return (
    <div className="glass-card p-5 flex flex-col" style={{ height: '520px' }}>
      <div className="flex items-center gap-2 pb-3 border-b border-primary/20 mb-3">
        <span className="text-2xl">💬</span>
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground leading-tight">Gentle Companion</h3>
          <p className="text-xs text-muted-foreground">A safe space to vent — not a substitute for professional care.</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-2">
        <AnimatePresence initial={false}>
          {messages.map(m => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-card text-foreground border border-border rounded-bl-sm'
                }`}
              >
                {m.text}
              </div>
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
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Share what's on your mind…"
          className="flex-1 px-4 py-2.5 rounded-full bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-botanical-glow"
        />
        <button
          onClick={send}
          className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold cursor-pointer border-none transition-all hover:-translate-y-0.5"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default TherapyChatbot;