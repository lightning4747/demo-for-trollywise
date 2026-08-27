import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Cart3D from '../components/Cart3D';
import { TextType } from '../components/react-bits/TextType';
import { BorderGlow } from '../components/react-bits/BorderGlow';
import { FadeContent } from '../components/react-bits/FadeContent';
import GradualBlur from '../components/react-bits/GradualBlur';
import { ArrowRight, Cpu, Eye, Activity, CheckCircle2, Shield, Maximize2, X, ChevronDown } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const [isFullScreenWhite, setIsFullScreenWhite] = useState(false);

  const cartRevealRef = useRef<HTMLDivElement>(null);

  // Pure fade-in for revealed main cart
  const { scrollYProgress: cartScrollProgress } = useScroll({
    target: cartRevealRef,
    offset: ['start end', 'center center'],
  });
  const cartOpacity = useTransform(cartScrollProgress, [0, 0.65], [0, 1]);

  const scrollToCartShowcase = () => {
    const el = document.getElementById('cart-showcase');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[oklch(0.2077_0.0398_265.7549)] text-slate-100 selection:bg-emerald-400/20 selection:text-emerald-400 overflow-x-hidden relative">
      
      {/* ================= PAGE-LEVEL GRADUAL GAUSSIAN BLUR OVERLAYS (WHOLE SITE) ================= */}
      <GradualBlur
        target="page"
        position="top"
        height="6rem"
        strength={1.5}
        divCount={5}
        curve="bezier"
        exponential
        opacity={1}
        zIndex={40}
      />

      <GradualBlur
        target="page"
        position="bottom"
        height="6rem"
        strength={1.5}
        divCount={5}
        curve="bezier"
        exponential
        opacity={1}
        zIndex={40}
      />

      {/* ================= FULLSCREEN WHITE CANVAS MODAL ================= */}
      {isFullScreenWhite && (
        <div className="fixed inset-0 z-[100] bg-white text-slate-900 flex flex-col animate-fade-in-up">
          {/* Header Controls Bar */}
          <div className="h-16 px-8 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 backdrop-blur">
            <div className="flex items-center gap-3">
              <img
                src="/assets/logo.jpeg"
                alt="TrollyWise Logo"
                className="w-7 h-7 rounded object-cover border border-slate-300"
              />
              <span className="font-bold text-sm tracking-tight uppercase italic text-slate-900">
                Trolly<span className="text-emerald-600">Wise</span> Studio View
              </span>
            </div>

            <button
              onClick={() => setIsFullScreenWhite(false)}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-medium text-xs hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <X className="w-4 h-4" /> Close Studio View
            </button>
          </div>

          {/* Full-Screen White 3D Viewport */}
          <div className="flex-1 w-full h-full relative bg-white">
            <Cart3D
              colorway="light"
              renderMode="pbr"
              enableFloat={true}
              enableControls={true}
            />
          </div>
        </div>
      )}

      {/* ================= HERO SECTION (CLEAN TEXT & CTA) ================= */}
      <section className="relative min-h-[85vh] flex flex-col justify-center items-center px-6 text-center">
        {/* Foreground Content: Clean Headline & CTA */}
        <div className="relative z-10 max-w-5xl mx-auto space-y-8 my-auto">
          {/* Typed Hero Headline using TextType */}
          <FadeContent duration={0.6}>
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-100 leading-[1.1] max-w-4xl mx-auto flex items-center justify-center">
              <TextType
                text="The cart that knows your store."
                typingSpeed={60}
                className="text-slate-100"
              />
            </h1>
          </FadeContent>

          {/* Hero Action CTA: Explore Technology */}
          <FadeContent delay={0.2}>
            <div className="pt-2 flex justify-center">
              <button
                onClick={scrollToCartShowcase}
                className="px-9 py-4 rounded-xl bg-emerald-400 text-slate-950 font-semibold text-sm hover:bg-emerald-300 transition-colors flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-emerald-400/20"
              >
                Explore Technology <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </FadeContent>
        </div>

        {/* Subtle Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-slate-500 font-mono text-[11px] pointer-events-none">
          <span className="uppercase tracking-widest text-slate-400 text-[10px]">Scroll to inspect</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-4 h-4 text-emerald-400" />
          </motion.div>
        </div>
      </section>

      {/* ================= MAIN REVEAL SECTION ================= */}
      <section
        id="cart-showcase"
        ref={cartRevealRef}
        className="relative py-20 lg:py-28 overflow-hidden border-t border-slate-800/60"
      >
        <div className="max-w-6xl mx-auto px-6 space-y-8 text-center">
          
          <FadeContent>
            <div className="space-y-2">
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                HARDWARE INSPECTION
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100">
                Interactive 3D Hardware Overview
              </h2>
            </div>
          </FadeContent>

          {/* Fully Revealed 3D CAD Cart Container */}
          <motion.div
            style={{ opacity: cartOpacity }}
            className="w-full max-w-5xl h-[520px] sm:h-[650px] lg:h-[720px] mx-auto relative rounded-3xl border border-slate-800/80 bg-slate-950/30 overflow-hidden shadow-2xl backdrop-blur-sm"
          >
            <Cart3D
              colorway="dark"
              renderMode="pbr"
              enableFloat={true}
              enableControls={true}
            />
          </motion.div>

          {/* Action Button: Directly UNDER the cart's container */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => setIsFullScreenWhite(true)}
              className="px-7 py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-400 text-slate-200 hover:text-white transition-all text-sm font-medium flex items-center gap-2.5 shadow-lg group cursor-pointer"
            >
              <Maximize2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              View Fullscreen (White Canvas)
            </button>
          </div>

          {/* Micro Telemetry Strip */}
          <FadeContent delay={0.2}>
            <div className="pt-10 grid grid-cols-3 gap-6 border-t border-slate-800/80 max-w-xl mx-auto text-center font-mono">
              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">0.2s</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest">Scan Latency</div>
              </div>
              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">98.4%</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest">Loss Prevention</div>
              </div>
              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">14 hrs</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest">Shift Runtime</div>
              </div>
            </div>
          </FadeContent>

        </div>
      </section>

      {/* ================= CORE CAPABILITIES SECTION ================= */}
      <section id="features" className="py-24 bg-slate-900/40 border-t border-slate-800/70 relative">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          
          <FadeContent>
            <div className="space-y-3">
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                CORE CAPABILITIES
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-100 max-w-2xl">
                Engineered for zero shrinkage and maximum retail velocity.
              </h2>
            </div>
          </FadeContent>

          {/* Asymmetric Feature Cards Layout with BorderGlow */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Feature 1: Scan-as-you-go (7 cols) */}
            <FadeContent className="md:col-span-7">
              <BorderGlow className="h-full">
                <div className="p-8 sm:p-10 h-full flex flex-col justify-between space-y-8">
                  <div className="space-y-6">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400">
                      <Eye className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">
                      Scan-as-you-go Recognition
                    </h3>
                    <p className="font-sans text-slate-400 leading-relaxed text-sm sm:text-base">
                      Items are recognized automatically the moment shoppers place them into the cart. Dual-lens 4K edge cameras and neural vision eliminate manual barcode scanning entirely.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-800 flex items-center justify-between font-mono text-xs text-slate-400">
                    <span>0.2s Identification Latency</span>
                    <span className="text-emerald-400">AI Vision Core v4</span>
                  </div>
                </div>
              </BorderGlow>
            </FadeContent>

            {/* Feature 2: Live Running Total (5 cols) */}
            <FadeContent className="md:col-span-5">
              <BorderGlow className="h-full">
                <div className="p-8 sm:p-10 h-full flex flex-col justify-between space-y-8">
                  <div className="space-y-6">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400">
                      <Activity className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-slate-100">
                      Live Running Total
                    </h3>
                    <p className="font-sans text-slate-400 leading-relaxed text-sm">
                      Shoppers view their bill update in real time on the 10.1" anti-glare screen. Zero checkout lines, zero tally surprises.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-800 font-mono text-xs text-slate-400">
                    10.1" Anti-Glare Touchscreen
                  </div>
                </div>
              </BorderGlow>
            </FadeContent>

            {/* Feature 3: Store Insights for Operations (12 cols) */}
            <FadeContent className="md:col-span-12">
              <BorderGlow>
                <div className="p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-100">
                      Store Operations & Telemetry
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
                      <span>Cart Weight Precision</span>
                      <span className="text-emerald-400 font-bold">± 0.5g accuracy</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Offline Buffer Cache</span>
                      <span className="text-slate-100 font-bold">Active</span>
                    </div>
                  </div>
                </div>
              </BorderGlow>
            </FadeContent>

          </div>
        </div>
      </section>

      {/* ================= HARDWARE SPECIFICATIONS ================= */}
      <section className="py-20 border-t border-slate-800/70 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <FadeContent>
            <div className="space-y-2">
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                HARDWARE SPECIFICATIONS
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-100">
                TrollyWise Technical Architecture
              </h2>
            </div>
          </FadeContent>

          <FadeContent delay={0.2}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 font-mono text-xs">
              <BorderGlow borderRadius="rounded-xl">
                <div className="p-5 space-y-2">
                  <div className="text-slate-500 uppercase tracking-widest text-[10px]">Battery Life</div>
                  <div className="text-slate-100 text-sm font-semibold">14 Hours Shift</div>
                </div>
              </BorderGlow>

              <BorderGlow borderRadius="rounded-xl">
                <div className="p-5 space-y-2">
                  <div className="text-slate-500 uppercase tracking-widest text-[10px]">Charging</div>
                  <div className="text-slate-100 text-sm font-semibold">Dock (3.5h Full)</div>
                </div>
              </BorderGlow>

              <BorderGlow borderRadius="rounded-xl">
                <div className="p-5 space-y-2">
                  <div className="text-slate-500 uppercase tracking-widest text-[10px]">Display</div>
                  <div className="text-slate-100 text-sm font-semibold">10.1" Touchscreen</div>
                </div>
              </BorderGlow>

              <BorderGlow borderRadius="rounded-xl">
                <div className="p-5 space-y-2">
                  <div className="text-slate-500 uppercase tracking-widest text-[10px]">Sensors</div>
                  <div className="text-slate-100 text-sm font-semibold">Weight + 4x Optics</div>
                </div>
              </BorderGlow>

              <BorderGlow borderRadius="rounded-xl">
                <div className="p-5 space-y-2">
                  <div className="text-slate-500 uppercase tracking-widest text-[10px]">Connectivity</div>
                  <div className="text-slate-100 text-sm font-semibold">Wi-Fi 6 / BT 5.2</div>
                </div>
              </BorderGlow>

              <BorderGlow borderRadius="rounded-xl">
                <div className="p-5 space-y-2">
                  <div className="text-slate-500 uppercase tracking-widest text-[10px]">Payload</div>
                  <div className="text-slate-100 text-sm font-semibold">40 kg Max Capacity</div>
                </div>
              </BorderGlow>

              <BorderGlow borderRadius="rounded-xl">
                <div className="p-5 space-y-2">
                  <div className="text-slate-500 uppercase tracking-widest text-[10px]">Chassis Weight</div>
                  <div className="text-slate-100 text-sm font-semibold">18 kg (Empty)</div>
                </div>
              </BorderGlow>

              <BorderGlow borderRadius="rounded-xl">
                <div className="p-5 space-y-2">
                  <div className="text-slate-500 uppercase tracking-widest text-[10px]">Rating</div>
                  <div className="text-slate-100 text-sm font-semibold">IP54 Polymer Build</div>
                </div>
              </BorderGlow>
            </div>
          </FadeContent>
        </div>
      </section>

      {/* ================= DEMO PROGRAM PRICING CARD ================= */}
      <section id="pricing" className="py-24 border-t border-slate-800/70 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          
          <FadeContent>
            <div className="space-y-3">
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                15-DAY HARDWARE PILOT
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-100 max-w-2xl mx-auto">
                Test TrollyWise in your store environment.
              </h2>
            </div>
          </FadeContent>

          {/* Single Centered Demo Program Card with BorderGlow */}
          <FadeContent delay={0.2} className="max-w-xl mx-auto">
            <BorderGlow borderRadius="rounded-3xl">
              <div className="p-8 sm:p-12 text-center space-y-6">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  15-DAY HARDWARE PILOT DEPOSIT
                </div>

                <div className="font-mono text-5xl sm:text-6xl font-bold text-emerald-400 tracking-tight">
                  ₹25,000
                </div>

                <p className="text-sm font-sans text-slate-300 max-w-md mx-auto leading-relaxed">
                  Full TrollyWise smart cart hardware unit, on-site calibration, and manager telemetry access for 15 calendar days.
                </p>

                <div className="pt-2">
                  <Link
                    to={user ? '/book' : '/signup'}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-400 text-slate-950 font-semibold text-sm hover:bg-emerald-300 transition-colors shadow-md"
                  >
                    Request Demo Unit <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>
                </div>

                <div className="pt-6 border-t border-slate-800 flex items-center justify-center gap-4 text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Razorpay Test Payment
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" /> Refundable Security Deposit
                  </span>
                </div>
              </div>
            </BorderGlow>
          </FadeContent>

        </div>
      </section>

    </div>
  );
};
