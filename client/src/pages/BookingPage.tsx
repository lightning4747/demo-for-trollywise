import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BorderGlow } from '../components/react-bits/BorderGlow';
import { FadeContent } from '../components/react-bits/FadeContent';
import { Store, MapPin, Phone, User as UserIcon, AlertCircle, ArrowRight } from 'lucide-react';

export const BookingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!businessName.trim()) {
      setError('Business / Retail Brand name is required.');
      return;
    }
    if (!storeAddress.trim()) {
      setError('Store address is required.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setError('Please enter a valid phone number (at least 8 digits).');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: businessName.trim(),
          storeAddress: storeAddress.trim(),
          phone: phone.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit demo request.');
      }

      // Direct redirect to payment step
      navigate(`/payment/${data.request.id}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating your booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[oklch(0.2077_0.0398_265.7549)] py-12 px-4 flex items-center justify-center">
      <FadeContent className="w-full max-w-xl">
        <BorderGlow borderRadius="rounded-2xl">
          <div className="p-8 sm:p-10 space-y-6">
            {/* Step label */}
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
              STEP 1 OF 2 — DEMO SPECIFICATION
            </div>

            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100 mb-2">
                Request 15-Day Hardware Demo.
              </h1>
              <p className="text-slate-400 text-sm font-sans">
                Specify your store location. Our hardware calibration lead will coordinate delivery.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-sans flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 font-sans">
              {/* Contact Person */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                  Contact Person
                </label>
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    value={user?.name || ''}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3.5 pl-10 text-sm text-slate-400 cursor-not-allowed"
                  />
                  <UserIcon className="w-4 h-4 text-slate-600 absolute left-3.5 top-4" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">Tied to your logged in user session</p>
              </div>

              {/* Retail Brand / Business Name */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                  Retail Brand / Business Name <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Apex Hypermarket Ltd."
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3.5 pl-10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
                  />
                  <Store className="w-4 h-4 text-slate-500 absolute left-3.5 top-4" />
                </div>
              </div>

              {/* Store Address */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                  Primary Store Address <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <textarea
                    required
                    rows={3}
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                    placeholder="104 Commercial Street, Retail Hub, Block 4, Mumbai, 400001"
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 pl-10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all resize-none"
                  />
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                  Contact Phone Number <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3.5 pl-10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all font-mono"
                  />
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-4" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-emerald-400 text-slate-950 font-semibold text-sm hover:bg-emerald-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                    Creating demo request...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Proceed to Payment (₹25,000) <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </form>
          </div>
        </BorderGlow>
      </FadeContent>
    </div>
  );
};
