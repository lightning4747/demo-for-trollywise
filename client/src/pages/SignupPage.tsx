import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BorderGlow } from '../components/react-bits/BorderGlow';
import { FadeContent } from '../components/react-bits/FadeContent';
import { User as UserIcon, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[oklch(0.2077_0.0398_265.7549)] flex items-center justify-center px-4 py-12">
      <FadeContent className="w-full max-w-md">
        <BorderGlow borderRadius="rounded-2xl">
          <div className="p-8 space-y-6">
            <div className="text-center sm:text-left space-y-3">
              <img
                src="/assets/logo.jpeg"
                alt="TrollyWise Logo"
                className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-md"
              />
              <div>
                <h1 className="font-serif text-3xl font-bold text-slate-100 mb-1">
                  Set up your account.
                </h1>
                <p className="text-sm font-sans text-slate-400">
                  Register a client portal account to request smart cart hardware demos.
                </p>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-sans flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 font-sans">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3.5 pl-10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                  />
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-4" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@retailgroup.com"
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3.5 pl-10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-4" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3.5 pl-10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-4" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-emerald-400 text-slate-950 font-semibold text-sm hover:bg-emerald-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Complete Registration <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400 font-sans">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-400 hover:underline font-semibold">
                Log in
              </Link>
            </div>
          </div>
        </BorderGlow>
      </FadeContent>
    </div>
  );
};
