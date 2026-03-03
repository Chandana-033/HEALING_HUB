import { useState, useEffect } from 'react';
import { onSafetyAlert } from '@/lib/wellness-logic';

const SafetyModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    return onSafetyAlert(() => setOpen(true));
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div
        className="max-w-md w-full rounded-3xl p-8 relative"
        style={{
          background: 'hsla(270, 30%, 97%, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid hsla(135, 25%, 75%, 0.4)',
          boxShadow: '0 0 40px hsla(135, 25%, 65%, 0.2)',
        }}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-xl bg-transparent border-none cursor-pointer"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <span className="text-4xl mb-3 block">💚</span>
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">You're Not Alone</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            It sounds like you might be going through a really tough time. Please know that help is available and people care about you.
          </p>
        </div>

        <div className="space-y-3">
          {[
            { name: 'National Suicide Prevention Lifeline', number: '988', note: 'Call or Text' },
            { name: 'Crisis Text Line', number: 'Text HOME to 741741', note: 'Free 24/7' },
            { name: 'SAMHSA Helpline', number: '1-800-662-4357', note: 'Free & Confidential' },
            { name: 'International Association for Suicide Prevention', number: 'https://www.iasp.info/resources/Crisis_Centres/', note: 'Global Resources' },
          ].map((resource) => (
            <div
              key={resource.name}
              className="p-3 rounded-xl text-left"
              style={{
                background: 'hsla(135, 25%, 75%, 0.15)',
                border: '1px solid hsla(135, 25%, 75%, 0.3)',
              }}
            >
              <p className="text-sm font-semibold text-foreground">{resource.name}</p>
              <p className="text-sm font-bold text-botanical-dark">{resource.number}</p>
              <p className="text-xs text-muted-foreground">{resource.note}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Your privacy is important. This message is shown locally and no data is shared.
        </p>
      </div>
    </div>
  );
};

export default SafetyModal;
