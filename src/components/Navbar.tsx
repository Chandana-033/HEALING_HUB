import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/facts', label: 'Facts' },
  { to: '/tune-in', label: 'Tune In' },
  { to: '/mindfulness', label: 'Mindfulness' },
  { to: '/brain-teasers', label: 'Brain Teasers' },
  { to: '/journal', label: 'Soul Scribbles' },
  { to: '/insights', label: 'Insights' },
  { to: '/luna-tracker', label: 'Luna' },
  { to: '/sleep-cycle', label: 'Sleep' },
  { to: '/therapist', label: 'Therapist' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <nav
      className={`sticky top-0 z-50 flex items-center justify-between px-6 transition-all duration-300 border-b ${
        scrolled ? 'py-3' : 'py-4'
      }`}
      style={{
        background: scrolled
          ? 'hsla(270, 30%, 97%, 0.95)'
          : 'hsla(270, 30%, 97%, 0.8)',
        backdropFilter: 'blur(15px)',
        borderColor: 'hsla(135, 25%, 75%, 0.3)',
        boxShadow: '0 0 20px hsla(135, 25%, 65%, 0.15)',
      }}
    >
      <Link
        to="/"
        className="flex items-center gap-2 text-foreground no-underline transition-colors hover:text-botanical-dark"
      >
        <span className="text-xl">🌿</span>
        <span className="font-heading text-xl font-bold tracking-tight">
          Healing Hub
        </span>
      </Link>

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-xl text-foreground bg-transparent border-none cursor-pointer"
        aria-label="Toggle menu"
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      <ul
        className={`list-none gap-6 items-center ${
          menuOpen
            ? 'flex flex-col absolute top-full left-0 w-full py-4 px-6 gap-3 md:flex-row md:relative md:top-auto md:w-auto md:p-0'
            : 'hidden md:flex'
        }`}
        style={
          menuOpen
            ? {
                background: 'hsla(270, 30%, 97%, 0.95)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                borderBottom: '1px solid hsla(135, 25%, 75%, 0.3)',
              }
            : {}
        }
      >
        {navLinks.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className={`relative text-sm font-medium tracking-wide no-underline transition-colors pb-1 ${
                location.pathname === link.to
                  ? 'text-botanical-dark'
                  : 'text-foreground hover:text-botanical-dark'
              }`}
              style={{
                borderBottom:
                  location.pathname === link.to
                    ? '2px solid hsl(135, 30%, 55%)'
                    : '2px solid transparent',
              }}
            >
              {link.label}
            </Link>
          </li>
        ))}
        <li>
          {user ? (
            <button
              onClick={() => signOut()}
              className="text-sm font-semibold px-4 py-1.5 rounded-full bg-primary text-primary-foreground border-none cursor-pointer transition-all hover:-translate-y-0.5"
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/auth"
              className="text-sm font-semibold px-4 py-1.5 rounded-full bg-primary text-primary-foreground no-underline transition-all hover:-translate-y-0.5 inline-block"
            >
              Sign in
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
