import React, { useEffect, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import { CustomerNode, SalesOrderNode, DeliveryNode, BillingNode, PaymentNode } from './CustomNodes';

const nodeTypes = {
  Customer: CustomerNode,
  SalesOrder: SalesOrderNode,
  Delivery: DeliveryNode,
  BillingDocument: BillingNode,
  Payment: PaymentNode,
  custom: SalesOrderNode 
};

export default function GraphView({ highlightedNodes, onNodeClick }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setCenter } = useReactFlow();

  useEffect(() => {
    if (highlightedNodes && highlightedNodes.length > 0 && nodes.length > 0) {
      const targetId = highlightedNodes[0];
      const targetNode = nodes.find(n => n.id === String(targetId));
      if (targetNode) {
        setCenter(targetNode.position.x + 100, targetNode.position.y + 50, { zoom: 1.5, duration: 1200 });
        
        setNodes(nds => nds.map(n => ({
          ...n,
          style: { ...n.style, opacity: n.id === targetNode.id ? 1 : 0.4 }
        })));
      }
    }
  }, [highlightedNodes, nodes, setCenter]);

  useEffect(() => {
    fetch('/api/graph')
      .then(res => res.json())
      .then(data => {
        const mappedNodes = data.nodes.map(n => ({
          ...n,
          type: n.data.type || 'custom'
        }));
        setNodes(mappedNodes);
        setEdges(data.edges);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch graph data", err);
        setLoading(false);
      });
  }, []);

  const handleNodeClick = (event, node) => {
    if (onNodeClick) onNodeClick(node);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="animate-pulse text-indigo-400 flex flex-col items-center">
            <svg className="w-12 h-12 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            <span className="tracking-widest font-semibold uppercase text-xs">Loading Massive Graph Network...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{ 
            style: { stroke: '#475569', strokeWidth: 2 },
            animated: true
        }}
      >
        <Background color="#1e293b" gap={20} size={1} />
        <Controls className="!bg-slate-800 !border-slate-700 !fill-slate-200 overflow-hidden rounded-xl shadow-xl border m-4" />
        <MiniMap 
          nodeColor={(n) => {
            if (n.type === 'Customer') return '#7c3aed';
            if (n.type === 'SalesOrder') return '#2563eb';
            if (n.type === 'Delivery') return '#059669';
            if (n.type === 'BillingDocument') return '#f97316';
            if (n.type === 'Payment') return '#e11d48';
            return '#4f46e5';
          }} 
          maskColor="rgba(15, 23, 42, 0.8)" 
          className="!bg-slate-900 !border-slate-700 rounded-xl overflow-hidden shadow-2xl border"
          position="bottom-left"
        />
      </ReactFlow>
    </div>
  );
}
