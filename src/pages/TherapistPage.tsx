import PageLayout from '@/components/PageLayout';
import { motion } from 'framer-motion';
import TherapyChatbot from '@/components/TherapyChatbot';

interface Helpline {
  region: string;
  name: string;
  number: string;
  hours: string;
  website: string;
  note?: string;
}

const helplines: Helpline[] = [
  {
    region: '🇮🇳 India',
    name: 'iCall (TISS)',
    number: '+91 9152987821',
    hours: 'Mon–Sat, 8 AM – 10 PM IST',
    website: 'https://icallhelpline.org',
    note: 'Free, confidential counselling by trained professionals.',
  },
  {
    region: '🇮🇳 India',
    name: 'Vandrevala Foundation',
    number: '1860 2662 345 / +91 9999 666 555',
    hours: '24/7',
    website: 'https://www.vandrevalafoundation.com',
    note: 'Free mental health support in multiple Indian languages.',
  },
  {
    region: '🇮🇳 India',
    name: 'AASRA',
    number: '+91 9820466726',
    hours: '24/7',
    website: 'http://www.aasra.info',
    note: 'Suicide prevention and crisis intervention.',
  },
  {
    region: '🇺🇸 USA',
    name: '988 Suicide & Crisis Lifeline',
    number: '988',
    hours: '24/7',
    website: 'https://988lifeline.org',
    note: 'Call or text 988. Free and confidential.',
  },
  {
    region: '🇺🇸 USA',
    name: 'NAMI HelpLine',
    number: '1-800-950-6264',
    hours: 'Mon–Fri, 10 AM – 10 PM ET',
    website: 'https://www.nami.org/help',
    note: 'Information, support, and referrals.',
  },
  {
    region: '🇬🇧 UK',
    name: 'Samaritans',
    number: '116 123',
    hours: '24/7',
    website: 'https://www.samaritans.org',
    note: 'Free to call from any UK phone.',
  },
  {
    region: '🇨🇦 Canada',
    name: 'Talk Suicide Canada',
    number: '1-833-456-4566',
    hours: '24/7',
    website: 'https://talksuicide.ca',
  },
  {
    region: '🇦🇺 Australia',
    name: 'Lifeline Australia',
    number: '13 11 14',
    hours: '24/7',
    website: 'https://www.lifeline.org.au',
  },
  {
    region: '🌍 International',
    name: 'Find A Helpline',
    number: 'Online directory',
    hours: '24/7',
    website: 'https://findahelpline.com',
    note: 'Locate a free, confidential helpline in 130+ countries.',
  },
];

const directories = [
  {
    name: 'Psychology Today',
    region: 'Global',
    desc: 'Search therapists by location, insurance, specialty, and approach.',
    url: 'https://www.psychologytoday.com/us/therapists',
    icon: '🔍',
  },
  {
    name: 'BetterHelp',
    region: 'Online',
    desc: 'Licensed online therapy via chat, phone, or video — matched within 24 hours.',
    url: 'https://www.betterhelp.com',
    icon: '💬',
  },
  {
    name: 'Talkspace',
    region: 'Online',
    desc: 'Text and video therapy with licensed clinicians, insurance accepted.',
    url: 'https://www.talkspace.com',
    icon: '📱',
  },
  {
    name: 'Practo (India)',
    region: 'India',
    desc: 'Find verified psychiatrists and psychologists near you with reviews.',
    url: 'https://www.practo.com/counselling-psychology',
    icon: '🩺',
  },
  {
    name: 'NHS Talking Therapies',
    region: 'UK',
    desc: 'Free NHS therapy referrals for anxiety, depression, and more.',
    url: 'https://www.nhs.uk/mental-health/talking-therapies-medicine-treatments/talking-therapies-and-counselling/nhs-talking-therapies/',
    icon: '🏥',
  },
  {
    name: 'MindDoc',
    region: 'Global',
    desc: 'Evidence-based self-help tools built by psychologists.',
    url: 'https://minddoc.com/us/en',
    icon: '🧠',
  },
];

const TherapistPage = () => (
  <PageLayout>
    <section className="max-w-6xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
          Connect with Support 🤝
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          You don't have to go through this alone. Reach out to a crisis line or find a therapist that fits your needs.
        </p>
      </motion.div>

      {/* Chatbot */}
      <div className="mb-10">
        <TherapyChatbot />
      </div>

      {/* Crisis banner */}
      <div
        className="glass-card p-5 mb-8 border-l-4"
        style={{ borderLeftColor: 'hsl(0, 70%, 60%)' }}
      >
        <p className="text-sm text-foreground">
          <strong>In immediate danger?</strong> Please call your local emergency number (112 in India/EU, 911 in US, 999 in UK) or one of the 24/7 helplines below. You matter.
        </p>
      </div>

      {/* Helplines */}
      <h2 className="font-heading text-2xl font-bold text-foreground mb-4">🌍 Crisis Helplines</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {helplines.map((h, i) => (
          <motion.div
            key={`${h.region}-${h.name}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card-hover p-5 flex flex-col"
          >
            <div className="text-xs font-semibold text-botanical-dark mb-1">{h.region}</div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{h.name}</h3>
            <a href={`tel:${h.number.replace(/\s+/g, '')}`} className="text-base font-bold text-foreground no-underline hover:text-botanical-dark mb-1">
              📞 {h.number}
            </a>
            <p className="text-xs text-muted-foreground mb-2">🕐 {h.hours}</p>
            {h.note && <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{h.note}</p>}
            <a
              href={h.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto text-xs text-botanical-dark font-semibold hover:underline no-underline"
            >
              Visit website →
            </a>
          </motion.div>
        ))}
      </div>

      {/* Therapist directories */}
      <h2 className="font-heading text-2xl font-bold text-foreground mb-4">🔎 Find a Therapist</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {directories.map((d, i) => (
          <motion.a
            key={d.name}
            href={d.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card-hover p-5 no-underline block"
          >
            <div className="text-3xl mb-2">{d.icon}</div>
            <div className="text-xs font-semibold text-botanical-dark mb-1">{d.region}</div>
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{d.name}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{d.desc}</p>
          </motion.a>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center max-w-2xl mx-auto">
        Healing Hub is not a medical service. Numbers and links above are sourced from official public records of each organization. Please verify local availability before calling.
      </p>
    </section>
  </PageLayout>
);

export default TherapistPage;