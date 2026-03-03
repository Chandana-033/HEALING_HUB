import { useWellnessStorage } from '@/lib/wellness-logic';

const Footer = () => {
  const { clearAllData } = useWellnessStorage();

  return (
    <footer
      className="mt-16 py-10 px-6 text-center border-t"
      style={{
        background: 'hsla(270, 30%, 97%, 0.75)',
        backdropFilter: 'blur(15px)',
        borderColor: 'hsla(135, 25%, 75%, 0.3)',
      }}
    >
      <p className="italic text-botanical-dark max-w-2xl mx-auto mb-6 font-light leading-relaxed">
        "Healing doesn't mean the damage never existed. It means the damage no
        longer controls our lives." — Akshay Dubey
      </p>

      <div className="flex justify-center gap-6 flex-wrap mb-6">
        <a href="#" className="text-sm text-muted-foreground hover:text-botanical-dark transition-colors no-underline">About</a>
        <a href="#" className="text-sm text-muted-foreground hover:text-botanical-dark transition-colors no-underline">Contact</a>
        <a href="#" className="text-sm text-muted-foreground hover:text-botanical-dark transition-colors no-underline">Support</a>
        <a href="#" className="text-sm text-muted-foreground hover:text-botanical-dark transition-colors no-underline">Privacy</a>
      </div>

      <button
        onClick={clearAllData}
        className="mb-4 px-5 py-2 rounded-full text-xs font-medium transition-all border"
        style={{
          background: 'hsla(0, 70%, 60%, 0.1)',
          borderColor: 'hsla(0, 70%, 60%, 0.3)',
          color: 'hsl(0, 70%, 45%)',
        }}
      >
        🔒 Clear My Data
      </button>

      <p className="text-xs text-muted-foreground border-t pt-4" style={{ borderColor: 'hsla(135, 25%, 75%, 0.2)' }}>
        © 2025 Healing Hub. Crafted with care for your wellbeing. Your data stays on your device.
      </p>
    </footer>
  );
};

export default Footer;
