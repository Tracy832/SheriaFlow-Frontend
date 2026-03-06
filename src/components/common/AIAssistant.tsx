import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, Loader2 } from 'lucide-react';
import api from '../../api/axios'; 

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Hello! I am SheriaFlow AI. Ask me about payroll anomalies or legal compliance.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await api.post('/payroll/chat/', { message: userMsg });
      setMessages(prev => [...prev, { role: 'ai', text: response.data.response }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "I'm having trouble reaching the server. Please try again later." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none transition-all duration-300">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="pointer-events-auto mb-4 w-80 md:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300 transition-colors">
          
          {/* Header */}
          <div className="bg-slate-900 dark:bg-slate-950 p-4 flex justify-between items-center text-white transition-colors">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/20">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-bold text-sm">SheriaFlow Assistant</h3>
                <p className="text-[10px] text-slate-300 dark:text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="h-80 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900/50 space-y-3 custom-scrollbar transition-colors">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 text-sm rounded-2xl shadow-sm transition-all ${
                  msg.role === 'user' 
                    ? 'bg-slate-900 dark:bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-none'
                }`}>
                  <p 
                    className="leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: msg.text
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                        .replace(/\n/g, '<br/>') 
                    }} 
                  />
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
               <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-2 items-center transition-colors">
                     <Loader2 size={16} className="animate-spin text-emerald-600 dark:text-emerald-500" />
                     <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Processing...</span>
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex gap-2 transition-colors">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about payroll..." 
              className="flex-1 bg-slate-100 dark:bg-slate-900 border-none dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none transition-colors"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Launcher Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto w-14 h-14 bg-slate-900 dark:bg-emerald-600 text-white rounded-full shadow-xl hover:scale-105 transition-transform flex items-center justify-center group relative border-4 border-white dark:border-slate-900"
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />}
        {!isOpen && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-bounce"></span>
        )}
      </button>
    </div>
  );
};

export default AIAssistant;