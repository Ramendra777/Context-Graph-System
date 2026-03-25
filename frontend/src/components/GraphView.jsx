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
          style: { ...n.style, opacity: n.id === targetNode.id ? 1 : 0.3 }
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
      <div className="flex items-center justify-center w-full h-full bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Loading Graph Network...</span>
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
            style: { stroke: '#93c5fd', strokeWidth: 1.5 },
            animated: true,
            type: 'smoothstep'
        }}
      >
        <Background color="#e5e7eb" gap={20} size={1} />
        <Controls className="!bg-white !border-gray-200 !fill-gray-500 overflow-hidden rounded-lg shadow-md border m-4" />
        <MiniMap 
          nodeColor={(n) => {
            if (n.type === 'Customer') return '#8b5cf6';
            if (n.type === 'SalesOrder') return '#3b82f6';
            if (n.type === 'Delivery') return '#10b981';
            if (n.type === 'BillingDocument') return '#f97316';
            if (n.type === 'Payment') return '#f43f5e';
            return '#6366f1';
          }} 
          maskColor="rgba(255, 255, 255, 0.85)" 
          className="!bg-white !border-gray-200 rounded-lg overflow-hidden shadow-md border"
          position="bottom-left"
        />
      </ReactFlow>
    </div>
  );
}
