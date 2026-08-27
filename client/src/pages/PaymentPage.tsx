import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BorderGlow } from '../components/react-bits/BorderGlow';
import { FadeContent } from '../components/react-bits/FadeContent';
import { CreditCard, AlertCircle, ArrowLeft, Lock } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const PaymentPage: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await fetch(`/api/requests/${requestId}`);
        if (!res.ok) throw new Error('Demo request not found.');
        const data = await res.json();

        if (data.request.status === 'confirmed') {
          navigate(`/confirmation/${requestId}`, { replace: true });
          return;
        }

        setRequest(data.request);
      } catch (err: any) {
        setError(err.message || 'Error fetching request details');
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [requestId, navigate]);

  const handleRazorpayPayment = async () => {
    setError(null);
    setIsProcessing(true);

    try {
      // 1. Create Razorpay order on backend
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
      });

      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || 'Order creation failed.');

      // 2. Configure Razorpay checkout options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount * 100,
        currency: orderData.currency,
        name: 'TrollyWise Infrastructure',
        description: '15-Day Smart Cart Hardware Pilot',
        order_id: orderData.orderId,
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: request?.phone,
        },
        theme: {
          color: '#7cffd4',
        },
        handler: async (response: any) => {
          try {
            // 3. Verify signature on backend
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                requestId,
                razorpay_order_id: response.razorpay_order_id || orderData.orderId,
                razorpay_payment_id: response.razorpay_payment_id || `pay_test_${Date.now()}`,
                razorpay_signature: response.razorpay_signature || 'test_signature',
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error || 'Payment verification failed.');

            // Success -> navigate to confirmation
            navigate(`/confirmation/${requestId}`);
          } catch (verifyErr: any) {
            setError(verifyErr.message || 'Payment signature verification failed.');
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      // Open Razorpay Standard Checkout modal or simulation fallback
      if (typeof window.Razorpay !== 'undefined') {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback test simulation mode for dev environments
        setTimeout(async () => {
          const simRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              requestId,
              razorpay_order_id: orderData.orderId,
              razorpay_payment_id: `pay_sim_${Date.now()}`,
              razorpay_signature: 'test_sim_signature',
            }),
          });
          if (simRes.ok) {
            navigate(`/confirmation/${requestId}`);
          } else {
            setError('Simulated payment failed.');
            setIsProcessing(false);
          }
        }, 1200);
      }
    } catch (err: any) {
      setError(err.message || 'Payment setup failed.');
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-[oklch(0.2077_0.0398_265.7549)] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-slate-400 tracking-wider">PREPARING PAYMENT ORDER...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[oklch(0.2077_0.0398_265.7549)] py-12 px-4 flex items-center justify-center">
      <FadeContent className="w-full max-w-lg">
        <BorderGlow borderRadius="rounded-3xl">
          <div className="p-8 sm:p-10 space-y-6">
            {/* Stepper Header */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800/60 transition-colors"
                  title="Back to Dashboard"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  STEP 2 OF 2 — DEPOSIT PAYMENT
                </span>
              </div>

              <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">
                TW-{String(request?.id).padStart(4, '0')}
              </span>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-sans flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Hero Amount Display */}
            <div className="text-center py-4 space-y-2">
              <div className="text-xs font-mono uppercase tracking-widest text-slate-400">
                FIXED 15-DAY DEMO DEPOSIT
              </div>
              <div className="font-mono text-5xl sm:text-6xl font-bold text-emerald-400 tracking-tight">
                ₹25,000
              </div>
              <div className="text-xs text-slate-400 font-sans">
                Fully refundable deposit per hardware unit configuration
              </div>
            </div>

            {/* Breakdown Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 text-xs font-sans">
              <div className="flex justify-between text-slate-400">
                <span>Retail Business</span>
                <span className="font-semibold text-slate-200">{request?.businessName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Store Address</span>
                <span className="font-semibold text-slate-200 truncate max-w-[200px]">{request?.storeAddress}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Trial Duration</span>
                <span className="font-mono font-semibold text-emerald-400">15 Calendar Days</span>
              </div>
            </div>

            {/* Single Primary Payment CTA */}
            <div className="space-y-4">
              <button
                onClick={handleRazorpayPayment}
                disabled={isProcessing}
                className="w-full py-4 rounded-xl bg-emerald-400 text-slate-950 font-semibold text-base hover:bg-emerald-300 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                    Processing Checkout...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 stroke-[2]" /> Pay ₹25,000 with Razorpay
                  </span>
                )}
              </button>

              {/* Microcopy Trust line */}
              <div className="flex items-center justify-center gap-2 text-[11px] font-sans text-slate-500 pt-1">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>Secured by Razorpay • Test Mode</span>
              </div>
            </div>
          </div>
        </BorderGlow>
      </FadeContent>
    </div>
  );
};
