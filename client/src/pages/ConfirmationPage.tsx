import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, MapPin } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-[oklch(0.2077_0.0398_265.7549)] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-slate-400 tracking-wider">LOADING CONFIRMATION...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[oklch(0.2077_0.0398_265.7549)] py-16 px-4 relative overflow-hidden flex items-center justify-center">
      <div className="w-full max-w-xl bg-[oklch(0.2795_0.0368_260.0310)] border border-slate-700/80 rounded-3xl p-8 sm:p-12 shadow-xl relative z-10 text-center animate-fade-in-up space-y-8">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle2 className="w-8 h-8 stroke-[2]" />
        </div>

        {/* Header */}
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            DEMO RESERVATION CONFIRMED
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-100">
            You're confirmed.
          </h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            Hardware allocation for your 15-day smart cart trial is locked in. Our deployment lead will reach out to coordinate calibration.
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-left space-y-4 text-xs font-sans">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <span className="font-mono text-slate-400 uppercase tracking-wider">Request Ticket</span>
            <span className="font-mono font-bold text-emerald-400">TrollyWise-{String(request?.id).padStart(4, '0')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-slate-500 text-[11px] uppercase tracking-wider font-mono">Retail Brand</div>
              <div className="font-semibold text-slate-200 text-sm mt-0.5">{request?.businessName}</div>
            </div>

            <div>
              <div className="text-slate-500 text-[11px] uppercase tracking-wider font-mono font-semibold">Deposit Paid</div>
              <div className="font-mono text-slate-200 text-sm font-semibold mt-0.5">₹25,000</div>
            </div>
          </div>

          <div>
            <div className="text-slate-500 text-[11px] uppercase tracking-wider font-mono">Store Location</div>
            <div className="text-slate-300 text-xs mt-0.5 flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <span>{request?.storeAddress}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-500 font-mono">
            <span>Payment ID: {request?.razorpayPaymentId || 'pay_verified'}</span>
            <span className="text-emerald-400">Duration: 15 Days</span>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-400 text-slate-950 font-semibold text-sm hover:bg-emerald-300 transition-colors"
          >
            Return to Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
