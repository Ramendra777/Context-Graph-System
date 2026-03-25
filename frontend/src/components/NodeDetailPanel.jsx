import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NodeDetailPanel({ node, onClose }) {
  if (!node) return null;
  
  const data = node.data || {};
  const nodeType = data.type || 'Unknown';
  
  const gradientMap = {
    Customer: 'from-purple-600 to-indigo-600',
    SalesOrder: 'from-blue-600 to-cyan-500',
    Delivery: 'from-emerald-600 to-teal-500',
    BillingDocument: 'from-orange-500 to-amber-500',
    Payment: 'from-rose-500 to-pink-600',
  };

  const gradient = gradientMap[nodeType] || 'from-slate-600 to-slate-500';

  const entries = Object.entries(data).filter(([k]) => k !== 'type');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute top-0 right-0 w-[340px] h-full z-30 glass-panel border-l border-slate-700 shadow-[-10px_0_40px_-15px_rgba(0,0,0,0.6)] flex flex-col"
      >
        {/* Header */}
        <div className={`p-5 bg-gradient-to-r ${gradient} flex items-center justify-between`}>
          <div>
            <p className="text-[10px] font-extrabold text-white/70 uppercase tracking-widest">{nodeType}</p>
            <h3 className="text-lg font-bold text-white mt-0.5">{data.label || node.id}</h3>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <p className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400 mb-3">Attributes</p>
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center p-3 bg-slate-900/60 rounded-lg border border-slate-700/50">
              <span className="text-[11px] text-slate-400 font-semibold uppercase">Node ID</span>
              <span className="text-[12px] text-slate-200 font-mono">{node.id}</span>
            </div>
            {entries.map(([key, value]) => (
              <div key={key} className="flex justify-between items-center p-3 bg-slate-900/60 rounded-lg border border-slate-700/50">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">{key.replace(/_/g, ' ')}</span>
                <span className="text-[12px] text-slate-200 font-mono max-w-[160px] truncate text-right">{value != null ? String(value) : '—'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50 text-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Click another node or close</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
