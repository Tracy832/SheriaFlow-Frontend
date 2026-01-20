import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot } from 'lucide-react'; // <--- Removed MessageSquare

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

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Add User Message
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    // 2. Simulate Backend AI Call
    setTimeout(() => {
      let aiResponse = "I can help with that. Let me check the database...";
      
      // Simple mock logic
      if (userMsg.toLowerCase().includes('spike') || userMsg.toLowerCase().includes('salary')) {
        aiResponse = "I detected a **15% salary spike** for John Kamau this month compared to his 3-month average. This appears to be a one-time performance bonus.";
      } else if (userMsg.toLowerCase().includes('receipt')) {
         aiResponse = "To process a receipt, please use the 'Scan Receipt' button in the Payroll or Expenses tab. I will automatically extract the tax details.";
      }

      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="pointer-events-auto mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500 rounded-lg">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-bold text-sm">SheriaFlow Assistant</h3>
                <p className="text-[10px] text-slate-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="h-80 overflow-y-auto p-4 bg-slate-50 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 text-sm rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-slate-900 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                }`}>
                  <p dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
              </div>
            ))}
            {isTyping && (
               <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                     <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                     <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                     <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about payroll..." 
              className="flex-1 bg-slate-100 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Launcher Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto w-14 h-14 bg-slate-900 text-white rounded-full shadow-xl hover:scale-105 transition-transform flex items-center justify-center group relative"
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />}
        {!isOpen && <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>}
      </button>
    </div>
  );
};

export default AIAssistant;