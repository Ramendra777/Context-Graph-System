import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NodeDetailPanel({ node, onClose }) {
  if (!node) return null;
  
  const data = node.data || {};
  const nodeType = data.type || 'Unknown';
  
  const entries = Object.entries(data).filter(([k]) => k !== 'type');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] z-30 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{nodeType}</p>
            <h3 className="text-base font-bold text-gray-800 mt-0.5">{data.label || node.id}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[360px] overflow-y-auto px-5 py-4">
          <div className="flex flex-col gap-0">
            <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
              <span className="text-[11px] text-gray-400 font-medium">Entity</span>
              <span className="text-[12px] text-gray-800 font-medium">{nodeType}</span>
            </div>
            {entries.map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-b-0">
                <span className="text-[11px] text-gray-400 font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="text-[12px] text-gray-800 font-mono max-w-[180px] truncate text-right">{value != null ? String(value) : '—'}</span>
              </div>
            ))}
            <div className="flex justify-between items-center py-2.5 text-[11px] text-gray-300 italic">
              <span>Additional fields hidden for readability</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
