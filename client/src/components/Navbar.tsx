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
    <nav className="w-full bg-[oklch(0.2077_0.0398_265.7549)] border-b border-slate-800/80 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 grid grid-cols-12 items-center">
        
        {/* Left: Brand Logo (3 cols) */}
        <div className="col-span-6 md:col-span-3 flex items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/assets/logo.jpeg"
              alt="TrollyWise Logo"
              className="w-9 h-9 rounded-lg object-cover border border-slate-700 group-hover:border-emerald-400 transition-colors"
            />
            <span className="text-xl font-bold tracking-tight text-slate-100 uppercase italic">
              Trolly<span className="text-emerald-400">Wise</span>
            </span>
          </Link>
        </div>

        {/* Center: Navigation Options (6 cols desktop) - Perfectly Centered */}
        <div className="hidden md:flex col-span-6 justify-center items-center gap-8 text-sm font-medium">
          <Link
            to="/"
            className={`transition-colors py-1 ${
              location.pathname === '/'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                : 'text-slate-300 hover:text-slate-100'
            }`}
          >
            Overview
          </Link>
          <a
            href="/#features"
            className="text-slate-300 hover:text-slate-100 transition-colors py-1"
          >
            Technology
          </a>
          <a
            href="/#pricing"
            className="text-slate-300 hover:text-slate-100 transition-colors py-1"
          >
            Demo Program
          </a>

          {user && (
            <>
              <Link
                to="/dashboard"
                className={`transition-colors py-1 ${
                  location.pathname === '/dashboard'
                    ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                    : 'text-slate-300 hover:text-slate-100'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/book"
                className={`transition-colors py-1 ${
                  location.pathname === '/book'
                    ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                    : 'text-slate-300 hover:text-slate-100'
                }`}
              >
                Request Demo
              </Link>
            </>
          )}
        </div>

        {/* Right: Auth / User Account (3 cols desktop) */}
        <div className="col-span-6 md:col-span-3 flex items-center justify-end">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-slate-200">{user.name}</div>
                <div className="text-[11px] font-mono text-slate-400">{user.email}</div>
              </div>

              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-slate-100 transition-colors px-3 py-2"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg bg-emerald-400 text-slate-950 text-sm font-semibold hover:bg-emerald-300 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden ml-3 p-2 text-slate-400 hover:text-slate-100 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
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
          <a
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-300 hover:text-emerald-400 py-1.5"
          >
            Technology
          </a>
          <a
            href="/#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-300 hover:text-emerald-400 py-1.5"
          >
            Demo Program
          </a>

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
