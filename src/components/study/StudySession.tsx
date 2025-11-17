import React, { useState } from 'react';
import { Send, Sparkles, BookOpen } from 'lucide-react';
import HolographicPanel from '../cyberpunk/HolographicPanel';
import HolographicText from '../cyberpunk/HolographicText';
import '@/src/styles/typography.css';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface StudySessionProps {
  topic: string;
  onBack: () => void;
}

/**
 * StudySession - Chat-based study interface with AI
 */
const StudySession: React.FC<StudySessionProps> = ({ topic, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      content: `Let's dive into ${topic}! What would you like to explore first?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: `Great question! Let me explain that for you...`,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="mb-4">
        <HolographicText glowColor="cyan" className="text-2xl font-bold flex items-center gap-2">
          <BookOpen size={24} />
          {topic}
        </HolographicText>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`chat-message ${
                message.sender === 'user' ? 'chat-message-user' : 'chat-message-ai'
              }`}
            >
              <p className="study-content">{message.content}</p>
              <p className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <HolographicPanel glowColor="green" className="p-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question or request explanation..."
            className="flex-1 bg-transparent border border-[var(--accent-green)]/30 rounded-lg px-4 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-green)]/60"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 rounded-lg bg-[var(--accent-green)]/20 hover:bg-[var(--accent-green)]/30 border border-[var(--accent-green)]/40 text-[var(--accent-green)] transition-all duration-200 flex items-center gap-2"
          >
            <Send size={18} />
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2 mt-3">
          <button className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 text-xs text-[var(--text-secondary)] transition-colors">
            💡 Explain concept
          </button>
          <button className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 text-xs text-[var(--text-secondary)] transition-colors">
            📝 Create flashcard
          </button>
          <button className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 text-xs text-[var(--text-secondary)] transition-colors">
            🎯 Quiz me
          </button>
        </div>
      </HolographicPanel>
    </div>
  );
};

export default StudySession;
