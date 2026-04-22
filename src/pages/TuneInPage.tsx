import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { motion } from 'framer-motion';

// Spotify embed playlists curated per mood (public Spotify-editorial playlists).
// Embeds work without any API key.
interface MoodOption {
  name: string;
  icon: string;
  color: string;
  tagline: string;
  playlists: { title: string; spotifyId: string; type: 'playlist' | 'album' }[];
}

const moods: MoodOption[] = [
  {
    name: 'Anxious',
    icon: '😰',
    color: '#4169E1',
    tagline: 'Slow your breath. Let the sound hold you.',
    playlists: [
      { title: 'Peaceful Meditation', spotifyId: '37i9dQZF1DWZqd5JICZI0u', type: 'playlist' },
      { title: 'Calming Acoustic', spotifyId: '37i9dQZF1DX4E3UdUs7fUx', type: 'playlist' },
    ],
  },
  {
    name: 'Lonely',
    icon: '🥺',
    color: '#9370DB',
    tagline: 'You are not alone — this music sits with you.',
    playlists: [
      { title: 'Sad Songs', spotifyId: '37i9dQZF1DX7qK8ma5wgG1', type: 'playlist' },
      { title: 'Late Night Vibes', spotifyId: '37i9dQZF1DX4PP3DA4J0N8', type: 'playlist' },
    ],
  },
  {
    name: 'Motivated',
    icon: '💪',
    color: '#FF4500',
    tagline: 'Channel that fire — go build something.',
    playlists: [
      { title: 'Beast Mode', spotifyId: '37i9dQZF1DX76Wlfdnj7AP', type: 'playlist' },
      { title: 'Power Workout', spotifyId: '37i9dQZF1DXdxcBWuJkbcy', type: 'playlist' },
    ],
  },
  {
    name: 'Happy',
    icon: '😊',
    color: '#FFD700',
    tagline: 'Ride the wave. Dance a little.',
    playlists: [
      { title: 'Happy Hits!', spotifyId: '37i9dQZF1DXdPec7aLTmlC', type: 'playlist' },
      { title: 'Feel Good Friday', spotifyId: '37i9dQZF1DX7KNKjOK0o75', type: 'playlist' },
    ],
  },
  {
    name: 'Sad',
    icon: '😢',
    color: '#6495ED',
    tagline: 'Let the tears come. Music makes space for them.',
    playlists: [
      { title: 'Life Sucks', spotifyId: '37i9dQZF1DX3YSRoSdA634', type: 'playlist' },
      { title: 'Down in the Dumps', spotifyId: '37i9dQZF1DWVrtsSlLKzro', type: 'playlist' },
    ],
  },
  {
    name: 'Focused',
    icon: '🎯',
    color: '#8A2BE2',
    tagline: 'Tune out distractions, tune into deep work.',
    playlists: [
      { title: 'Deep Focus', spotifyId: '37i9dQZF1DWZeKCadgRdKQ', type: 'playlist' },
      { title: 'Lo-Fi Beats', spotifyId: '37i9dQZF1DWWQRwui0ExPn', type: 'playlist' },
    ],
  },
];

const TuneInPage = () => {
  const [selected, setSelected] = useState<string>('Happy');
  const selectedMood = moods.find(m => m.name === selected) ?? moods[0];

  return (
    <PageLayout>
      <section className="max-w-5xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
            Tune In 🎵
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Pick how you feel — we'll recommend Spotify playlists curated for that mood.
          </p>
        </motion.div>

        {/* Mood pills */}
        <div className="glass-card p-5 mb-6">
          <div className="flex flex-wrap justify-center gap-3">
            {moods.map((m, i) => (
              <motion.button
                key={m.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(m.name)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-md hover:-translate-y-1 hover:shadow-lg border-none cursor-pointer ${
                  selected === m.name ? 'ring-2 ring-botanical-dark scale-105' : ''
                }`}
                style={{
                  background: `linear-gradient(135deg, ${m.color}dd, ${m.color}88)`,
                  color: ['Happy'].includes(m.name) ? '#333' : '#fff',
                }}
              >
                {m.icon} {m.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <motion.div
          key={selectedMood.name}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="text-center mb-5">
            <p className="text-2xl">{selectedMood.icon}</p>
            <h2 className="font-heading text-xl font-semibold text-foreground">
              {selectedMood.name} — recommended for you
            </h2>
            <p className="text-sm text-muted-foreground italic mt-1">{selectedMood.tagline}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {selectedMood.playlists.map(p => (
              <div key={p.spotifyId} className="rounded-2xl overflow-hidden bg-card border border-border">
                <p className="text-sm font-semibold text-foreground px-4 pt-3 pb-2">
                  🎧 {p.title}
                </p>
                <iframe
                  title={p.title}
                  src={`https://open.spotify.com/embed/${p.type}/${p.spotifyId}?utm_source=generator&theme=0`}
                  width="100%"
                  height="352"
                  frameBorder={0}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="block"
                />
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-5">
            Powered by Spotify. A free Spotify account lets you play full tracks; otherwise you'll hear 30-second previews.
          </p>
        </motion.div>
      </section>
    </PageLayout>
  );
};

export default TuneInPage;
