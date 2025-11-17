import React from 'react';
import { ArrowLeft, Menu, Zap } from 'lucide-react';
import TalkingEmoji from '../TalkingEmoji';
import type { Persona } from '@/src/lib/types';

interface StudyMobileTopBarProps {
  title: string;
  onBack?: () => void;
  onMenuOpen?: () => void;
  persona: Persona;
  speakingPersona: Persona | null;
  studyStreak?: number;
  onAIAssistantOpen: () => void;
}

/**
 * StudyMobileTopBar - Compact mobile header with mini avatars
 */
const StudyMobileTopBar: React.FC<StudyMobileTopBarProps> = ({
  title,
  onBack,
  onMenuOpen,
  persona,
  speakingPersona,
  studyStreak = 0,
  onAIAssistantOpen
}) => {
  return (
    <div className="sticky top-0 z-30 bg-[var(--bg-secondary)]/95 backdrop-blur-md border-b border-[var(--border-color)] md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Back or Menu */}
        <button
          onClick={onBack || onMenuOpen}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          {onBack ? <ArrowLeft size={20} /> : <Menu size={20} />}
        </button>

        {/* Center: Title and Mini Avatars */}
        <div className="flex-1 flex items-center justify-center gap-3">
          <h1 className="text-lg font-semibold text-[var(--text-primary)] truncate max-w-[120px]">
            {title}
          </h1>
          
          {/* Mini AI Avatars - Tap to expand */}
          <button
            onClick={onAIAssistantOpen}
            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <div
              className="relative transition-all duration-300"
              style={{
                filter: speakingPersona === 'Agent Zero'
                  ? 'drop-shadow(0 0 8px var(--accent-cyan))'
                  : persona === 'Agent Zero'
                  ? 'drop-shadow(0 0 4px var(--accent-cyan))'
                  : 'none'
              }}
            >
              <TalkingEmoji persona="Agent Zero" activePersona={speakingPersona} size={32} />
            </div>
            <div
              className="relative transition-all duration-300"
              style={{
                filter: speakingPersona === 'Agent Zara'
                  ? 'drop-shadow(0 0 8px var(--accent-magenta))'
                  : persona === 'Agent Zara'
                  ? 'drop-shadow(0 0 4px var(--accent-magenta))'
                  : 'none'
              }}
            >
              <TalkingEmoji persona="Agent Zara" activePersona={speakingPersona} size={32} />
            </div>
          </button>
        </div>

        {/* Right: Streak Counter */}
        {studyStreak > 0 && (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--accent-amber)]/10 border border-[var(--accent-amber)]/30">
            <Zap size={14} className="text-[var(--accent-amber)]" />
            <span className="text-sm font-bold text-[var(--accent-amber)]">{studyStreak}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMobileTopBar;
