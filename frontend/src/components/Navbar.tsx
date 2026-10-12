import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Eye, Menu, X, ScanSearch } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-slate-200 bg-white/95 shadow-soft backdrop-blur-md' : 'bg-white'
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-3 rounded-lg text-navy-800 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary-600">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-800 text-white shadow-soft">
            <Eye size={19} strokeWidth={2.1} />
          </span>
          <span className="text-[17px] font-bold tracking-[-0.02em]">
            DR<span className="text-primary-600">-</span>Visualize
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${isActive ? 'text-primary-600' : 'text-slate-600 hover:text-navy-800'}`}
          >
            Home
          </NavLink>
          <Link to="/analyze" className="btn-primary ml-4 px-4 py-2.5 text-sm">
            <ScanSearch size={16} />
            Analyze Image
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            <NavLink to="/" end className="rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">Home</NavLink>
            <Link to="/analyze" className="btn-primary mt-2 text-sm"> <ScanSearch size={16} /> Analyze Image </Link>
          </div>
        </div>
      )}
    </header>
  );
}
