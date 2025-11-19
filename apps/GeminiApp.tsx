import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, User, Bot } from 'lucide-react';
import { streamGeminiResponse } from '../services/gemini';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const GeminiApp: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm your AI assistant powered by Gemini 2.5 Flash. How can I help you today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    // Add placeholder for streaming response
    setMessages(prev => [...prev, { role: 'model', text: '' }]);

    let fullResponse = '';

    await streamGeminiResponse(userMessage, (chunk) => {
      fullResponse += chunk;
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].text = fullResponse;
        return newMessages;
      });
    });

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50/80">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-500' : 'bg-purple-500'}`}>
              {msg.role === 'user' ? <User size={16} className="text-white" /> : <Sparkles size={16} className="text-white" />}
            </div>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-500 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
            }`}>
              {msg.text ? (
                <span className="whitespace-pre-wrap">{msg.text}</span>
              ) : (
                <span className="animate-pulse">Thinking...</span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Gemini anything..."
            className="w-full bg-gray-100 text-gray-800 rounded-full py-3 px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-transparent focus:border-blue-400 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
        <div className="text-center mt-2">
            <span className="text-[10px] text-gray-400">Powered by Gemini 2.5 Flash</span>
        </div>
      </div>
    </div>
  );
};