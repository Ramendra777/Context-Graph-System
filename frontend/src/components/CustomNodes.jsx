import React from 'react';
import { Handle, Position } from 'reactflow';

const BaseNode = ({ data, accentColor, typeLabel }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-w-[170px] overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer">
    <div className="flex items-center gap-2 px-3 py-1.5 border-b border-gray-100">
      <div className={`w-2 h-2 rounded-full ${accentColor}`}></div>
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{typeLabel}</span>
    </div>
    <div className="px-3 py-2.5 flex flex-col gap-1">
      <div className="text-xs font-semibold text-gray-800">{data.label}</div>
      {data.amount != null && (
        <div className="text-[10px] text-gray-500">
          Total: <span className="font-medium text-gray-700">{data.amount} {data.currency || 'INR'}</span>
        </div>
      )}
      {data.status && (
        <div className="text-[10px] text-gray-500">
          Status: <span className="font-medium text-gray-700">{data.status}</span>
        </div>
      )}
      {data.country && (
        <div className="text-[10px] text-gray-500">
          Country: <span className="font-medium text-gray-700">{data.country}</span>
        </div>
      )}
    </div>
    <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-gray-300 !border-2 !border-white" />
    <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-gray-300 !border-2 !border-white" />
  </div>
);

export const CustomerNode = ({ data }) => <BaseNode data={data} typeLabel="Customer" accentColor="bg-violet-500" />;
export const SalesOrderNode = ({ data }) => <BaseNode data={data} typeLabel="Sales Order" accentColor="bg-blue-500" />;
export const DeliveryNode = ({ data }) => <BaseNode data={data} typeLabel="Delivery" accentColor="bg-emerald-500" />;
export const BillingNode = ({ data }) => <BaseNode data={data} typeLabel="Billing Document" accentColor="bg-orange-500" />;
export const PaymentNode = ({ data }) => <BaseNode data={data} typeLabel="Payment" accentColor="bg-rose-500" />;
