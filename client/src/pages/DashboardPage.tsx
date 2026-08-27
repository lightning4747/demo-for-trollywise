import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, CheckCircle2, Clock, ArrowRight, Store, RefreshCw } from 'lucide-react';

export interface DemoRequest {
  id: number;
  businessName: string;
  storeAddress: string;
  phone: string;
  status: 'pending_payment' | 'confirmed';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<DemoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/requests');
      if (!res.ok) throw new Error('Failed to fetch demo requests.');
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (err: any) {
      setError(err.message || 'Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();

    // Refetch on window focus to ensure instant status update after payment completion
    const onFocus = () => fetchRequests();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[oklch(0.2077_0.0398_265.7549)] py-12 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-10 relative z-10 animate-fade-in-up">
        {/* Asymmetrical Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/80 pb-8">
          <div>
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-2">
              CLIENT PORTAL OVERVIEW
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-100 leading-tight">
              Your demo requests.
            </h1>
            <p className="text-slate-400 text-sm mt-2 max-w-xl">
              Track 15-day smart cart hardware allocation orders and payment status.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchRequests}
              title="Refresh requests"
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              to="/book"
              className="px-6 py-3.5 rounded-xl bg-emerald-400 text-slate-950 font-semibold text-sm hover:bg-emerald-300 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" /> Request a Demo
            </Link>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
              <span className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></span>
              LOADING HARDWARE REQUESTS...
            </div>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm font-sans flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchRequests} className="underline text-xs">Try again</button>
          </div>
        ) : requests.length === 0 ? (
          /* Restrained Empty State */
          <div className="py-20 px-8 rounded-3xl bg-[oklch(0.2795_0.0368_260.0310)] border border-slate-800 text-center max-w-2xl mx-auto space-y-6 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-emerald-400">
                <Store className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-slate-100">
                No active demo requests found
              </h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                You haven't requested a hardware pilot demo yet. Launch your 15-day smart cart trial by submitting a request below.
              </p>
              <div className="pt-2">
                <Link
                  to="/book"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-400 text-slate-950 font-semibold text-sm hover:bg-emerald-300 transition-colors"
                >
                  Request a Demo Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Request List Cards & Table */
          <div className="space-y-6">
            <div className="bg-[oklch(0.2795_0.0368_260.0310)] border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/60 font-mono text-[11px] uppercase tracking-wider text-slate-400">
                      <th className="py-4 px-6 font-semibold">Request ID</th>
                      <th className="py-4 px-6 font-semibold">Business Name</th>
                      <th className="py-4 px-6 font-semibold">Address / Store</th>
                      <th className="py-4 px-6 font-semibold">Date Requested</th>
                      <th className="py-4 px-6 font-semibold">Amount</th>
                      <th className="py-4 px-6 font-semibold">Status</th>
                      <th className="py-4 px-6 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 text-sm font-sans">
                    {requests.map((req) => {
                      const isConfirmed = req.status === 'confirmed';
                      return (
                        <tr key={req.id} className="hover:bg-slate-900/40 transition-colors">
                          {/* ID */}
                          <td className="py-4 px-6 font-mono text-slate-300 font-medium">
                            TrollyWise-{String(req.id).padStart(4, '0')}
                          </td>

                          {/* Business */}
                          <td className="py-4 px-6 font-semibold text-slate-100">
                            {req.businessName}
                          </td>

                          {/* Address */}
                          <td className="py-4 px-6 text-slate-400 text-xs max-w-xs truncate">
                            {req.storeAddress}
                          </td>

                          {/* Date */}
                          <td className="py-4 px-6 font-mono text-xs text-slate-400">
                            {new Date(req.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>

                          {/* Amount */}
                          <td className="py-4 px-6 font-mono font-medium text-slate-200">
                            ₹25,000
                          </td>

                          {/* Status Badge */}
                          <td className="py-4 px-6">
                            {isConfirmed ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/15 border border-emerald-400/30 text-emerald-400">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 border border-slate-700 text-slate-400">
                                <Clock className="w-3.5 h-3.5 text-slate-400" /> Pending Payment
                              </span>
                            )}
                          </td>

                          {/* Action */}
                          <td className="py-4 px-6 text-right">
                            {isConfirmed ? (
                              <Link
                                to={`/confirmation/${req.id}`}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-emerald-400 transition-colors"
                              >
                                View Ticket <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            ) : (
                              <Link
                                to={`/payment/${req.id}`}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-400 text-slate-950 font-semibold text-xs hover:bg-emerald-300 transition-colors"
                              >
                                Complete Payment
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
