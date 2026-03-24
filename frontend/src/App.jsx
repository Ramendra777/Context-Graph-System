import React from 'react';
import GraphView from './components/GraphView';

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
      <div className="w-[30%] h-full glass-panel border-l-0 rounded-l-2xl z-20 flex flex-col shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.5)]">
        <div className="p-6 border-b border-slate-700/50">
          <h2 className="font-semibold text-lg text-slate-100 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            AI Assistant
          </h2>
          <p className="text-sm text-slate-400 mt-1">Ask questions about your business data</p>
        </div>
        
        {/* Chat Messages Area */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
          <div className="bg-slate-700/50 self-start px-4 py-3 rounded-2xl rounded-tl-sm text-sm max-w-[85%] border border-slate-600/30">
            Hello! How can I help you explore the Order-to-Cash process today?
          </div>
        </div>

        {/* Input Area */}
        <div className="p-5 bg-slate-800/80 border-t border-slate-700/50">
          <div className="relative flex items-center">
            <input 
              type="text" 
              placeholder="Ask anything..." 
              className="w-full bg-slate-900 border border-slate-600 rounded-full px-5 py-3.5 pl-5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-200 placeholder-slate-500"
            />
            <button className="absolute right-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full p-2.5 transition-colors shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
