import React from 'react';
import GraphView from './components/GraphView';
import ChatPanel from './components/ChatPanel';

function App() {
  return (
    <div className="flex w-screen h-screen">
      {/* Left Pane: Graph Viewer (70%) */}
      <div className="w-[70%] h-full bg-slate-900 relative">
        <div className="absolute top-6 left-6 z-10 glass-panel px-6 py-4 rounded-xl shadow-2xl">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Order-To-Cash Context Graph
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Interactive Data Exploration</p>
        </div>
        <div className="h-full w-full border-r border-slate-800">
          <GraphView />
        </div>
      </div>

      {/* Right Pane: Conversational Interface (30%) */}
      <div className="w-[30%] h-full glass-panel border-l-0 rounded-l-2xl z-20 flex flex-col shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
        <ChatPanel />
      </div>
    </div>
  );
}

export default App;
