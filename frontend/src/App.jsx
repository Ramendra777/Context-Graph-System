import React, { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import GraphView from './components/GraphView';
import ChatPanel from './components/ChatPanel';
import NodeDetailPanel from './components/NodeDetailPanel';

function App() {
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <div className="flex w-screen h-screen bg-gray-50">
      {/* Left Pane: Graph Viewer (70%) */}
      <div className="w-[70%] h-full bg-white relative">
        <div className="absolute top-5 left-5 z-10 bg-white/90 backdrop-blur-sm px-5 py-3 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
            <h1 className="text-base font-bold text-gray-800">
              Mapping / <span className="text-indigo-600">Order to Cash</span>
            </h1>
          </div>
        </div>
        <div className="h-full w-full border-r border-gray-200">
          <ReactFlowProvider>
            <GraphView highlightedNodes={highlightedNodes} onNodeClick={(node) => setSelectedNode(node)} />
          </ReactFlowProvider>
        </div>
        <NodeDetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
      </div>

      {/* Right Pane: Conversational Interface (30%) */}
      <div className="w-[30%] h-full bg-white border-l border-gray-200 flex flex-col overflow-hidden">
        <ChatPanel setHighlightedNodes={setHighlightedNodes} />
      </div>
    </div>
  );
}

export default App;
