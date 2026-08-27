import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/60 bg-[oklch(0.2077_0.0398_265.7549)] py-10 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-emerald-400 text-xs">
            T
          </div>
          <span className="text-xs font-bold tracking-widest uppercase text-slate-400 italic">
            TrollyWise <span className="font-mono text-[10px] normal-case text-slate-600">v4.0.2</span>
          </span>
        </div>

        <div className="flex items-center gap-6 font-mono text-[11px] text-slate-500 uppercase tracking-wider">
          <span>AI Vision Core v4</span>
          <span className="text-slate-700">•</span>
          <span>Razorpay Test Mode</span>
          <span className="text-slate-700">•</span>
          <span>15-Day Hardware Demo</span>
        </div>

        <div className="font-mono text-[10px] text-slate-600">
          © {new Date().getFullYear()} TROLLYWISE INFRASTRUCTURE
        </div>
      </div>
    </footer>
  );
};
