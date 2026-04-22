import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import PageLayout from '@/components/PageLayout';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { getUserProfile } from '@/lib/user-profile';

const routeAfterAuth = () => {
  const profile = getUserProfile();
  return profile.completedOnboarding ? '/dashboard' : '/onboarding';
};

const AuthPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate(routeAfterAuth(), { replace: true });
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { display_name: displayName || email.split('@')[0] },
          },
        });
        if (error) throw error;
        toast.success('Welcome! Your sanctuary awaits 🌸');
        navigate('/onboarding');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Welcome back 🌿');
        navigate(routeAfterAuth());
      }
    } catch (err: any) {
      const msg = err?.message ?? 'Something went wrong';
      if (msg.toLowerCase().includes('already registered')) {
        toast.error('This email is already registered. Try signing in instead.');
      } else if (msg.toLowerCase().includes('invalid login')) {
        toast.error('Invalid email or password.');
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <section className="min-h-[80vh] flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card w-full max-w-md p-8"
        >
          <div className="text-center mb-6">
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
              {mode === 'signin' ? 'Welcome Back' : 'Begin Your Journey'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === 'signin' ? 'Sign in to your sanctuary' : 'Create your wellness sanctuary'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-sm font-semibold text-muted-foreground block mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="How should we call you?"
                  className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-botanical-glow"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-muted-foreground block mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-botanical-glow"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-muted-foreground block mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-botanical-glow"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold cursor-pointer border-none transition-all hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === 'signin' ? (
              <>
                New here?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-botanical-dark font-semibold hover:underline bg-transparent border-none cursor-pointer"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-botanical-dark font-semibold hover:underline bg-transparent border-none cursor-pointer"
                >
                  Sign in
                </button>
              </>
            )}
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-botanical-dark no-underline">
              ← Back to home
            </Link>
          </div>
        </motion.div>
      </section>
    </PageLayout>
  );
};

export default AuthPage;