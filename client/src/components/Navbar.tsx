import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="w-full bg-[oklch(0.2077_0.0398_265.7549)] border-b border-slate-800/80 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded bg-slate-900 border border-emerald-500/30 flex items-center justify-center relative overflow-hidden group-hover:border-emerald-400 transition-colors">
            <div className="absolute inset-0 bg-emerald-500/10 rounded"></div>
            <span className="text-emerald-400 font-bold text-lg relative z-10">T</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-100 uppercase italic">
            Trolly<span className="text-emerald-400">Wise</span>
          </span>
          {location.pathname !== '/' && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase tracking-widest hidden sm:inline-block">
              CLIENT PORTAL
            </span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/'
                ? 'text-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview
          </Link>
          <a
            href="/#features"
            className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Technology
          </a>
          <a
            href="/#pricing"
            className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Demo Program
          </a>

          {user && (
            <>
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/dashboard'
                    ? 'text-emerald-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/book"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/book'
                    ? 'text-emerald-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Request Demo
              </Link>

              <div className="h-4 w-px bg-slate-800 my-auto"></div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-200">{user.name}</div>
                  <div className="text-[11px] font-mono text-slate-400">{user.email}</div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {!user && (
            <div className="flex items-center gap-3 ml-2">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors px-3 py-2"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg bg-emerald-400 text-slate-950 text-sm font-semibold hover:bg-emerald-300 transition-all shadow-[0_0_15px_rgba(124,255,212,0.2)]"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-slate-100 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[oklch(0.2077_0.0398_265.7549)] px-6 py-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-300 hover:text-emerald-400 py-1.5"
          >
            Overview
          </Link>
          {user ? (
            <>
              <div className="pb-3 border-b border-slate-800/80 pt-2">
                <div className="text-sm font-semibold text-slate-200">{user.name}</div>
                <div className="text-xs font-mono text-slate-400">{user.email}</div>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-slate-300 hover:text-emerald-400 py-1.5"
              >
                Dashboard
              </Link>
              <Link
                to="/book"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-slate-300 hover:text-emerald-400 py-1.5"
              >
                Request Demo
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left text-sm font-medium text-rose-400 hover:text-rose-300 py-1.5 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2 text-sm font-medium text-slate-200 border border-slate-700 rounded-lg"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2 text-sm font-semibold text-slate-950 bg-emerald-400 rounded-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
