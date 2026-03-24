import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatPanel() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I help you explore the Order-to-Cash process today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const apiHistory = newHistory.slice(0, -1).map(m => ({ role: m.role, content: m.content }));
      
      const response = await fetch('/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMessage.content,
          history: apiHistory 
        })
      });

      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      
      setMessages([...newHistory, { role: 'assistant', content: data.answer }]);
    } catch (err) {
      setMessages([...newHistory, { role: 'assistant', content: 'Sorry, I encountered an error connecting to the LLM backend.', isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-6 border-b border-slate-700/50">
        <h2 className="font-semibold text-lg text-slate-100 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_2px_rgba(52,211,153,0.5)]"></div>
          AI Assistant
        </h2>
        <p className="text-[12px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">Generative Database Querying</p>
      </div>

      <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 scroll-smooth">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white self-end rounded-br-sm shadow-indigo-900/50 shadow-lg' 
                  : msg.isError
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 self-start rounded-tl-sm'
                    : 'bg-slate-700/50 backdrop-blur-sm text-slate-200 border border-slate-600/30 self-start rounded-tl-sm'
              }`}
            >
              {msg.content}
            </motion.div>
          ))}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-700/50 backdrop-blur-sm self-start px-4 py-3.5 rounded-2xl rounded-tl-sm text-sm border border-slate-600/30 w-16 flex justify-center items-center gap-1.5"
            >
               <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
               <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
               <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-5 bg-slate-800/80 border-t border-slate-700/50">
        <form onSubmit={handleSend} className="relative flex items-center group">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Ask about orders, delivery..." 
            className="w-full bg-slate-900 border border-slate-600 rounded-full px-5 py-3.5 pl-5 pr-12 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-slate-200 placeholder-slate-500 shadow-inner"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-full p-2.5 transition-colors shadow-lg shadow-indigo-900/50 group-focus-within:bg-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
}
