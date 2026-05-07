import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { askChemistryBot } from '../../services/gemini';
import { cn } from '../../lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello! I'm your ChemSphere AI tutor. Ask me anything about NEB Chemistry!", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const botResponse = await askChemistryBot(input);
    const botMsg: Message = { id: (Date.now() + 1).toString(), text: botResponse, sender: 'bot' };
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-2xl flex items-center justify-center text-white"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
          </span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[70vh] bg-[#0A0F1E] border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden backdrop-blur-3xl"
          >
            {/* Header */}
            <div className="p-6 bg-white/5 border-b border-white/5 flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Bot size={28} />
               </div>
               <div>
                  <h3 className="font-bold text-lg">ChemSphere AI</h3>
                  <div className="flex items-center gap-1.5">
                     <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Online Assistant</span>
                  </div>
               </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
               {messages.map((msg) => (
                  <div key={msg.id} className={cn(
                     "flex gap-3",
                     msg.sender === 'user' ? "flex-row-reverse" : ""
                  )}>
                     <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        msg.sender === 'user' ? "bg-white/10" : "bg-cyan-500/20 text-cyan-400"
                     )}>
                        {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                     </div>
                     <div className={cn(
                        "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                        msg.sender === 'user' ? "bg-cyan-500 text-white rounded-tr-none" : "bg-white/5 text-white/80 rounded-tl-none border border-white/5"
                     )}>
                        <div className="prose prose-invert prose-sm prose-p:leading-relaxed prose-code:text-cyan-300">
                           <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                     </div>
                  </div>
               ))}
               {isLoading && (
                  <div className="flex gap-3">
                     <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                        <Loader2 className="animate-spin" size={16} />
                     </div>
                     <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5">
                        <div className="flex gap-1">
                           <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-white/40" />
                           <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-white/40" />
                           <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-white/40" />
                        </div>
                     </div>
                  </div>
               )}
            </div>

            {/* Input */}
            <div className="p-6 bg-white/5 border-t border-white/5">
               <div className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about bonding, organics..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 top-2 p-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-400 disabled:opacity-50 disabled:hover:bg-cyan-500 transition-all flex items-center justify-center"
                  >
                    <Send size={18} />
                  </button>
               </div>
               <p className="text-[10px] text-center text-white/20 mt-4 font-medium uppercase tracking-widest">Powered by ChemSphere AI</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
