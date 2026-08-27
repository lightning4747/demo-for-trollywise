import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrolleyViewer } from '../components/TrolleyViewer';
import { ArrowRight, Cpu, Eye, Activity, CheckCircle2, Shield } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  const scrollToFeatures = () => {
    const el = document.getElementById('features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[oklch(0.2077_0.0398_265.7549)] text-slate-100 selection:bg-emerald-400/20 selection:text-emerald-400 overflow-x-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-12 lg:pt-16 pb-16 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8 animate-fade-in-up">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-widest mx-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            TW-1 · SMART SHOPPING CART
          </div>

          {/* Centered Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-100 leading-[1.1] max-w-3xl mx-auto">
            The cart that <br />
            <span className="italic text-emerald-400 font-normal">knows your store.</span>
          </h1>

          {/* Subhead */}
          <p className="text-base sm:text-lg font-sans text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Real-time item recognition, live running totals, and shopper insight — in every aisle.
          </p>

          {/* Centered CTA Buttons */}
          <div className="pt-2 flex flex-wrap gap-4 items-center justify-center">
            <button
              onClick={scrollToFeatures}
              className="px-8 py-4 rounded-xl bg-emerald-400 text-slate-950 font-semibold text-base hover:bg-emerald-300 transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(124,255,212,0.2)] cursor-pointer"
            >
              See how it works <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <Link
              to={user ? '/book' : '/login'}
              className="px-6 py-4 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600 transition-colors font-medium text-sm"
            >
              Client Portal
            </Link>
          </div>

          {/* Centered 3D Model Viewer (No side text, container removed, perfectly framed) */}
          <div className="pt-4">
            <TrolleyViewer />
          </div>

          {/* Micro Stats Strip */}
          <div className="pt-6 grid grid-cols-3 gap-6 border-t border-slate-800/80 max-w-xl mx-auto text-center">
            <div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400">0.2s</div>
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">SCAN LATENCY</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400">98.4%</div>
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">THEFT PREVENTION</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400">14 hrs</div>
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">BATTERY SHIFT</div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section id="features" className="py-24 bg-slate-900/40 border-t border-slate-800/70 relative">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-3">
              WHY TW-1
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-100 max-w-2xl">
              Engineered for zero shrinkage and maximum velocity.
            </h2>
          </div>

          {/* Asymmetric Feature Cards Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Feature 1: Scan-as-you-go (Featured Double-Width Block: 7 cols) */}
            <div className="md:col-span-7 bg-[oklch(0.2795_0.0368_260.0310)] border border-slate-700/80 rounded-3xl p-8 sm:p-10 flex flex-col justify-between group hover:border-emerald-400/50 transition-all shadow-xl">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">
                  Scan-as-you-go Recognition
                </h3>
                <p className="font-sans text-slate-400 leading-relaxed text-sm sm:text-base">
                  Items are recognized automatically the moment shoppers place them into the cart. Dual-lens 4K edge cameras and neural vision eliminate manual barcode scanning entirely.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between font-mono text-xs text-slate-400">
                <span>0.2s Identification Latency</span>
                <span className="text-emerald-400">AI Vision Core v4</span>
              </div>
            </div>

            {/* Feature 2: Live Running Total (5 cols) */}
            <div className="md:col-span-5 bg-[oklch(0.2795_0.0368_260.0310)] border border-slate-700/80 rounded-3xl p-8 sm:p-10 flex flex-col justify-between group hover:border-emerald-400/50 transition-all shadow-xl">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-100">
                  Live Running Total
                </h3>
                <p className="font-sans text-slate-400 leading-relaxed text-sm">
                  Shoppers view their bill update in real time on the 10.1" anti-glare screen. Zero checkout lines, zero tally surprises.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 font-mono text-xs text-slate-400">
                10.1" Anti-Glare Touchscreen
              </div>
            </div>

            {/* Feature 3: Store Insights for Owners (Full Width: 12 cols) */}
            <div className="md:col-span-12 bg-[oklch(0.2795_0.0368_260.0310)] border border-slate-700/80 rounded-3xl p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group hover:border-emerald-400/50 transition-all shadow-xl">
              <div className="lg:col-span-7 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">
                  Store Insights for Operations
                </h3>
                <p className="font-sans text-slate-400 leading-relaxed text-sm sm:text-base">
                  Every cart feeds anonymized foot-traffic, dwell times, and product-interaction telemetry back to the manager dashboard. Store managers gain instant visibility into aisle friction points and high-converting product placement.
                </p>
              </div>

              <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 font-mono text-xs space-y-3">
                <div className="flex justify-between text-slate-400 pb-2 border-b border-slate-800">
                  <span>TELEMETRY STREAM</span>
                  <span className="text-emerald-400">REALTIME SYNC</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Aisle Dwell Index</span>
                  <span className="text-slate-100 font-bold">4.2 min avg</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Cart Weight Verification</span>
                  <span className="text-emerald-400 font-bold">± 0.5g precision</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Offline Sync Fallback</span>
                  <span className="text-slate-100 font-bold">Active</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= SPECS MATRIX STRIP ================= */}
      <section className="py-20 border-t border-slate-800/70 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-2">
              HARDWARE SPECIFICATIONS
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-100">
              TW-1 Technical Spec Sheet
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 font-mono text-xs">
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-2">
              <div className="text-slate-500 uppercase tracking-wider">Battery Life</div>
              <div className="text-slate-100 text-sm font-semibold">14 Hours Continuous</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-2">
              <div className="text-slate-500 uppercase tracking-wider">Charging</div>
              <div className="text-slate-100 text-sm font-semibold">Dock-Based (3.5h Full)</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-2">
              <div className="text-slate-500 uppercase tracking-wider">Display</div>
              <div className="text-slate-100 text-sm font-semibold">10.1" Anti-Glare Touch</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-2">
              <div className="text-slate-500 uppercase tracking-wider">Sensors</div>
              <div className="text-slate-100 text-sm font-semibold">Weight Base + 4x Cameras</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-2">
              <div className="text-slate-500 uppercase tracking-wider">Connectivity</div>
              <div className="text-slate-100 text-sm font-semibold">Wi-Fi 6 / Bluetooth 5.2</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-2">
              <div className="text-slate-500 uppercase tracking-wider">Weight Capacity</div>
              <div className="text-slate-100 text-sm font-semibold">40 kg Basket Load</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-2">
              <div className="text-slate-500 uppercase tracking-wider">Cart Weight</div>
              <div className="text-slate-100 text-sm font-semibold">18 kg (Empty)</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-2">
              <div className="text-slate-500 uppercase tracking-wider">Build</div>
              <div className="text-slate-100 text-sm font-semibold">IP54 Polymer Frame</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRICING / DEMO PROGRAM SECTION ================= */}
      <section id="pricing" className="py-24 border-t border-slate-800/70 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-3">
              THE DEMO PROGRAM
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-100 max-w-2xl mx-auto">
              Test TW-1 hardware in your store for 15 days.
            </h2>
          </div>

          {/* Single Centered Demo Program Card */}
          <div className="max-w-xl mx-auto bg-[oklch(0.2795_0.0368_260.0310)] border border-slate-700/90 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            {/* Medium Trolly Glow spotlight behind card */}
            <div className="trolly-glow w-80 h-80 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60"></div>

            <div className="relative z-10 space-y-6">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                15-DAY IN-STORE DEMO
              </div>

              <div className="font-mono text-5xl sm:text-6xl font-bold text-emerald-400 tracking-tight">
                ₹25,000
              </div>

              <p className="text-sm font-sans text-slate-300 max-w-md mx-auto leading-relaxed">
                Full TW-1 unit, on-site calibration, for two weeks. No commitment beyond the trial.
              </p>

              <div className="pt-4">
                <Link
                  to={user ? '/book' : '/signup'}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-400 text-slate-950 font-semibold text-base hover:bg-emerald-300 transition-all shadow-[0_0_25px_rgba(124,255,212,0.25)]"
                >
                  Book a demo <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
              </div>

              <div className="pt-6 border-t border-slate-800 flex items-center justify-center gap-4 text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Razorpay Test Payment
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" /> Fully Refundable Deposit
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
