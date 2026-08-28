import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, MapPin, Printer, ShieldCheck, Sparkles, Building, Calendar } from 'lucide-react';
import { BorderGlow } from '../components/react-bits/BorderGlow';
import { FadeContent } from '../components/react-bits/FadeContent';

export const ConfirmationPage: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await fetch(`/api/requests/${requestId}`);
        if (res.ok) {
          const data = await res.json();
          setRequest(data.request);
        }
      } catch (err) {
        console.error('Error fetching confirmation:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [requestId]);

  const handlePrintReceipt = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-[oklch(0.2077_0.0398_265.7549)] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-slate-400 tracking-wider">VERIFYING PAYMENT CAPTURE...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[oklch(0.2077_0.0398_265.7549)] py-16 px-4 relative overflow-hidden flex items-center justify-center">
      
      {/* Floating Celebratory Particle Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-emerald-400/40"
            style={{
              left: `${10 + (i * 7) % 80}%`,
              top: `${15 + (i * 11) % 70}%`,
            }}
            animate={{
              y: [-12, 12, -12],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: 2.5 + (i % 3),
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>

      <FadeContent className="w-full max-w-2xl relative z-10">
        <BorderGlow borderRadius="rounded-3xl">
          <div className="p-8 sm:p-12 text-center space-y-8 bg-slate-950/60 backdrop-blur-md">
            
            {/* Animated Spring SVG Checkmark */}
            <div className="relative inline-flex items-center justify-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.25, 1], opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                className="w-24 h-24 rounded-full bg-emerald-500/15 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_50px_rgba(52,211,153,0.35)] relative z-10"
              >
                <motion.svg
                  className="w-12 h-12 stroke-emerald-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.path
                    d="M20 6L9 17l-5-5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                  />
                </motion.svg>
              </motion.div>

              {/* Pulsing ring aura */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                className="absolute w-24 h-24 rounded-full border border-emerald-400/60 pointer-events-none"
              />
            </div>

            {/* Header Title */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-400 font-mono text-xs font-semibold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" /> PAYMENT CAPTURED • RESERVATION CONFIRMED
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-100 leading-tight">
                Demo Unit Locked In
              </h1>
              <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                Payment captured via Razorpay. Your 15-day smart cart hardware unit is reserved and queued for calibration.
              </p>
            </div>

            {/* Receipt Details Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-left space-y-4 text-xs font-sans shadow-lg">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <span className="font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> OFFICIAL RECEIPT
                </span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  TW-{String(request?.id).padStart(4, '0')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-slate-500 text-[11px] uppercase tracking-wider font-mono flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-400" /> Retail Brand
                  </div>
                  <div className="font-semibold text-slate-100 text-sm mt-0.5">{request?.businessName}</div>
                </div>

                <div>
                  <div className="text-slate-500 text-[11px] uppercase tracking-wider font-mono font-semibold">Deposit Captured</div>
                  <div className="font-mono text-emerald-400 text-base font-bold mt-0.5">₹25,000</div>
                </div>
              </div>

              <div>
                <div className="text-slate-500 text-[11px] uppercase tracking-wider font-mono">Deployment Store Address</div>
                <div className="text-slate-300 text-xs mt-0.5 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{request?.storeAddress}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 font-mono">
                <div>
                  <span className="text-slate-500">Transaction ID:</span>{' '}
                  <span className="text-slate-200">{request?.razorpayPaymentId || 'pay_captured'}</span>
                </div>
                <div className="sm:text-right">
                  <span className="text-slate-500">Trial Period:</span>{' '}
                  <span className="text-emerald-400 flex-inline items-center gap-1">
                    <Calendar className="w-3 h-3 inline mr-1" /> 15 Calendar Days
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap gap-4 items-center justify-center">
              <Link
                to="/dashboard"
                className="px-8 py-3.5 rounded-xl bg-emerald-400 text-slate-950 font-semibold text-sm hover:bg-emerald-300 transition-colors flex items-center gap-2 shadow-lg"
              >
                Return to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={handlePrintReceipt}
                className="px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors font-medium text-sm flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-400" /> Print Receipt
              </button>
            </div>

          </div>
        </BorderGlow>
      </FadeContent>
    </div>
  );
};
