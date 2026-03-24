import React from 'react';
import { Handle, Position } from 'reactflow';

const BaseNode = ({ data, title, gradient }) => (
  <div className="shadow-2xl rounded-xl min-w-[200px] bg-slate-800 border border-slate-700 overflow-hidden transform transition-all hover:-translate-y-1 hover:border-slate-500 duration-200">
    <div className={`px-4 py-2 bg-gradient-to-r ${gradient} flex items-center justify-between`}>
      <span className="text-white text-[10px] font-extrabold tracking-widest uppercase">{title}</span>
    </div>
    <div className="p-4 flex flex-col gap-1.5">
      <div className="text-sm font-semibold text-slate-100">{data.label}</div>
      {data.amount != null && <div className="text-xs text-emerald-400 font-mono font-semibold">Total: {data.amount} {data.currency || 'USD'}</div>}
      {data.status && <div className="text-[11px] text-slate-400">Status: <span className="text-slate-300">{data.status}</span></div>}
      {data.country && <div className="text-[11px] text-slate-400">Country: <span className="text-slate-300">{data.country}</span></div>}
    </div>
    <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-slate-300 border-2 border-slate-800" />
    <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-slate-300 border-2 border-slate-800" />
  </div>
);

export const CustomerNode = ({ data }) => <BaseNode data={data} title="Customer" gradient="from-purple-600 to-indigo-600" />;
export const SalesOrderNode = ({ data }) => <BaseNode data={data} title="Sales Order" gradient="from-blue-600 to-cyan-500" />;
export const DeliveryNode = ({ data }) => <BaseNode data={data} title="Delivery" gradient="from-emerald-600 to-teal-500" />;
export const BillingNode = ({ data }) => <BaseNode data={data} title="Billing Document" gradient="from-orange-500 to-amber-500" />;
export const PaymentNode = ({ data }) => <BaseNode data={data} title="Payment" gradient="from-rose-500 to-pink-600" />;
