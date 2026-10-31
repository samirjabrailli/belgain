import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageSquare, Send, X, Bot, User, Minimize2, RotateCcw, Coffee, ChevronRight } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  time: string;
}

interface AiAssistantProps {
  isAzerbaijani: boolean;
  onNavigateToMenu?: () => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ isAzerbaijani, onNavigateToMenu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: isAzerbaijani
        ? 'Salam! Mən Belgian Chocolate & Coffee-nin virtual baristasıyam. Menyudakı imza içkilərimiz, əsl Belçika şokoladımız, filiallarımız və dad tövsiyələri barədə istədiyiniz sualı verə bilərsiniz!'
        : 'Hello! I am your virtual barista at Belgian Chocolate & Coffee. Feel free to ask me anything about our signature drinks, pure Belgian chocolate, branches, or taste recommendations!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Suggested prompt questions
  const suggestedQuestions = isAzerbaijani
    ? [
        'Ən məşhur imza qəhvəniz hansıdır?',
        'Şəkərbura Raf nədir və tərkibində nə var?',
        'Südsüz / Vegan qəhvə seçimləri var?',
        'Ağ Şəhər filialınız saat neçəyə qədər işləyir?',
        'Belçika vaflilərinin qiyməti nə qədərdir?',
      ]
    : [
        'What is your most popular signature drink?',
        'What is in the Shakarbura Raf?',
        'Do you have dairy-free / vegan options?',
        'What are the opening hours of White City branch?',
        'How much are the Belgian Liege waffles?',
      ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: 'usr_' + Date.now(),
      role: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!messageText) setInput('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
        }),
      });

      const data = await res.json();
      const replyText = data.reply || (isAzerbaijani ? 'Zəhmət olmasa bir qədər sonra yenidən cəhd edin.' : 'Please try again in a moment.');

      const botMessage: Message = {
        id: 'bot_' + Date.now(),
        role: 'model',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: 'err_' + Date.now(),
        role: 'model',
        text: isAzerbaijani
          ? 'Bağışlayın, hazırda cavab verməkdə çətinlik çəkirəm. Zəhmət olmasa *2020 qaynar xəttimizlə əlaqə saxlayın və ya menyumuza nəzər yetirin!'
          : 'Sorry, I am having trouble connecting right now. Please check our menu or reach out via *2020 hotline!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome_' + Date.now(),
        role: 'model',
        text: isAzerbaijani
          ? 'Söhbət yeniləndi. Buyurun, başqa nə barədə məlumat almaq istərdiniz?'
          : 'Chat refreshed. How else may I assist you with our coffee and chocolates?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Widget Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#113825] to-[#1c5539] hover:from-[#174932] hover:to-[#236846] text-white border-2 border-[#c59b27] rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#ffd359] bg-[#071a11] flex items-center justify-center">
            <img
              src="/assets/aistudio/IMG_5127_acff560b.jpeg"
              alt="Belgian AI"
              className="w-full h-full object-cover"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-black" />
          </div>
          <div className="text-left">
            <span className="text-[10px] text-[#eeddb2] block font-semibold uppercase tracking-wider">
              {isAzerbaijani ? 'Süni İntellekt' : 'AI Barista'}
            </span>
            <span className="text-xs font-bold text-white group-hover:text-[#eeddb2] transition">
              {isAzerbaijani ? 'Məhsulları Soruş' : 'Ask About Products'}
            </span>
          </div>
          <Sparkles className="w-4 h-4 text-[#eeddb2] animate-bounce" />
        </button>
      )}

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 sm:right-6 z-50 w-[94vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-[#0a1e15] border border-[#2b5e43] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-[#071710] border-b border-[#1b4430] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#c59b27] bg-[#091f15] relative">
                <img
                  src="/assets/aistudio/IMG_5127_acff560b.jpeg"
                  alt="Belgian Barista AI"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif-brand font-bold text-white text-sm">
                    Belgian Barista AI
                  </h3>
                  <span className="bg-[#143e2a] text-[#86e2b2] text-[9px] px-1.5 py-0.5 rounded font-mono border border-[#23583d]">
                    Gemini 3.8
                  </span>
                </div>
                <p className="text-[11px] text-[#c59b27]">
                  {isAzerbaijani ? 'Məhsullar & Filiallar üzrə bələdçi' : 'Your coffee & chocolate guide'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#123625] transition"
                title={isAzerbaijani ? 'Söhbəti təmizlə' : 'Clear chat'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#123625] transition"
                title={isAzerbaijani ? 'Bağla' : 'Close'}
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-7 h-7 rounded-full bg-[#123826] border border-[#c59b27] flex items-center justify-center shrink-0 text-[#eeddb2]">
                    <Coffee className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3 shadow-md ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-[#c59b27] to-[#e4ba4c] text-black font-medium'
                      : 'bg-[#0e271c] border border-[#234d37] text-gray-100'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`text-[9px] block text-right mt-1 font-mono ${
                      msg.role === 'user' ? 'text-black/60' : 'text-gray-400'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-[#c59b27] text-black flex items-center justify-center shrink-0 font-bold text-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="w-7 h-7 rounded-full bg-[#123826] border border-[#c59b27] flex items-center justify-center text-[#eeddb2]">
                  <Coffee className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-[#0e271c] border border-[#234d37] rounded-2xl px-3.5 py-2 text-gray-300 flex items-center gap-1.5">
                  <span className="text-[11px]">{isAzerbaijani ? 'Barista düşünür' : 'Barista is thinking'}</span>
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c59b27] animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c59b27] animate-pulse delay-100" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c59b27] animate-pulse delay-200" />
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Questions */}
          <div className="px-3 py-2 bg-[#081811] border-t border-[#1a3d2c] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] text-[#c59b27] font-semibold shrink-0 uppercase tracking-wider">
              {isAzerbaijani ? 'Sual seç:' : 'Suggestions:'}
            </span>
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-xl bg-[#0f2c1f] hover:bg-[#184631] border border-[#24533a] text-[11px] text-[#d6ede2] whitespace-nowrap transition disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-[#071710] border-t border-[#1b4430] flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder={isAzerbaijani ? 'Məhsul, inqrediyent və ya filial barədə yazın...' : 'Ask about ingredients, coffee or branches...'}
              className="flex-1 px-3.5 py-2.5 bg-[#091e15] border border-[#234f37] rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#c59b27] transition"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-gradient-to-r from-[#c59b27] to-[#e4ba4c] text-black hover:brightness-110 active:scale-95 transition disabled:opacity-40"
              title={isAzerbaijani ? 'Göndər' : 'Send'}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
