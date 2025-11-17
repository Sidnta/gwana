import React from 'react';
import TalkingEmoji from '../TalkingEmoji';
import { useLiveAPIContext } from '../../contexts/LiveAPIContext';
import type { Persona } from '@/src/lib/types';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Sparkles } from 'lucide-react';
import HolographicPanel from '../cyberpunk/HolographicPanel';
import HolographicText from '../cyberpunk/HolographicText';

interface StudyRightPanelProps {
  persona: Persona;
  setPersona: (persona: Persona) => void;
  sessionContext?: {
    topic?: string;
    itemsReviewed?: number;
    correctAnswers?: number;
    currentStreak?: number;
  };
  suggestions?: string[];
}

/**
 * StudyRightPanel - AI Assistant Panel for Study App
 * Features: Dual avatars, voice controls, context display, smart suggestions
 */
const StudyRightPanel: React.FC<StudyRightPanelProps> = ({
  persona,
  setPersona,
  sessionContext,
  suggestions = []
}) => {
  const {
    callState,
    startCall,
    endCall,
    isMuted,
    toggleMute,
    isSpeakerOn,
    toggleSpeaker,
    speakingPersona
  } = useLiveAPIContext();

  const isSessionActive = ['ringing', 'connecting', 'connected', 'paused'].includes(callState);

  const handleCallButtonClick = () => {
    if (isSessionActive) {
      endCall('idle');
    } else {
      startCall();
    }
  };

  const handleSelectPersona = (selectedPersona: Persona) => {
    if (!isSessionActive) {
      setPersona(selectedPersona);
    }
  };

  const isZeroActive = persona === 'Agent Zero';
  const isZeroSpeaking = speakingPersona === 'Agent Zero';
  const isZaraSpeaking = speakingPersona === 'Agent Zara';

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      {/* AI Avatars - Primary/Secondary Layout */}
      <HolographicPanel glowColor="cyan" withCorners className="p-4">
        <div className="flex flex-col items-center space-y-4">
          {/* Primary Agent - Larger, Active */}
          <div className="flex flex-col items-center">
            <div
              className={`relative transition-all duration-300 ${
                isZeroActive && isZeroSpeaking ? 'animate-pulse' : ''
              }`}
              style={{
                filter: isZeroActive && isZeroSpeaking
                  ? 'drop-shadow(0 0 20px var(--accent-cyan)) drop-shadow(0 0 40px var(--accent-cyan))'
                  : isZeroActive
                  ? 'drop-shadow(0 0 10px var(--accent-cyan))'
                  : isZaraSpeaking
                  ? 'drop-shadow(0 0 20px var(--accent-magenta)) drop-shadow(0 0 40px var(--accent-magenta))'
                  : 'drop-shadow(0 0 10px var(--accent-magenta))'
              }}
            >
              <TalkingEmoji 
                persona={persona} 
                activePersona={speakingPersona} 
                size={120} 
              />
            </div>
            <HolographicText 
              glowColor={isZeroActive ? 'cyan' : 'magenta'} 
              className="mt-2 text-base font-semibold"
            >
              {persona}
            </HolographicText>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent" />

          {/* Secondary Agent - Smaller, Switch Button */}
          <button
            onClick={() => handleSelectPersona(isZeroActive ? 'Agent Zara' : 'Agent Zero')}
            disabled={isSessionActive}
            className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div
              className="relative opacity-70 hover:opacity-100 transition-opacity"
              style={{
                filter: 'grayscale(0.3)'
              }}
            >
              <TalkingEmoji 
                persona={isZeroActive ? 'Agent Zara' : 'Agent Zero'} 
                activePersona={null} 
                size={60} 
              />
            </div>
            <span className="text-xs text-[var(--text-secondary)] font-medium">
              Switch to {isZeroActive ? 'Zara' : 'Zero'}
            </span>
          </button>
        </div>
      </HolographicPanel>

      {/* Voice Controls */}
      <HolographicPanel glowColor="amber" withScanlines={false} className="p-3">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={toggleMute}
            disabled={!isSessionActive}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 transition-all duration-200"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <button
            onClick={handleCallButtonClick}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              isSessionActive
                ? 'bg-red-500/80 hover:bg-red-600 animate-pulse'
                : 'bg-green-500/80 hover:bg-green-600'
            }`}
            title={isSessionActive ? 'End Session' : 'Start Session'}
          >
            {isSessionActive ? <PhoneOff size={20} /> : <Phone size={20} />}
          </button>

          <button
            onClick={toggleSpeaker}
            disabled={!isSessionActive}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 transition-all duration-200"
            title={isSpeakerOn ? 'Mute Speaker' : 'Unmute Speaker'}
          >
            {isSpeakerOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </HolographicPanel>

      {/* Session Context */}
      {sessionContext && (
        <HolographicPanel glowColor="purple" className="p-4">
          <h3 className="text-sm font-semibold text-[var(--accent-cyan)] mb-3 flex items-center gap-2">
            <Sparkles size={16} />
            Session Context
          </h3>
          <div className="space-y-2 text-xs text-[var(--text-secondary)]">
            {sessionContext.topic && (
              <div>
                <span className="text-[var(--text-primary)]">Topic:</span> {sessionContext.topic}
              </div>
            )}
            {sessionContext.itemsReviewed !== undefined && (
              <div>
                <span className="text-[var(--text-primary)]">Items Reviewed:</span>{' '}
                {sessionContext.itemsReviewed}
              </div>
            )}
            {sessionContext.correctAnswers !== undefined && (
              <div>
                <span className="text-[var(--text-primary)]">Correct:</span>{' '}
                {sessionContext.correctAnswers}
              </div>
            )}
            {sessionContext.currentStreak !== undefined && (
              <div>
                <span className="text-[var(--text-primary)]">Streak:</span>{' '}
                {sessionContext.currentStreak}
              </div>
            )}
          </div>
        </HolographicPanel>
      )}

      {/* Smart Suggestions */}
      {suggestions.length > 0 && (
        <HolographicPanel glowColor="green" className="p-4 flex-1">
          <h3 className="text-sm font-semibold text-[var(--accent-green)] mb-3">
            AI Suggestions
          </h3>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-200 border border-[var(--accent-green)]/20 hover:border-[var(--accent-green)]/40"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </HolographicPanel>
      )}
    </div>
  );
};

export default StudyRightPanel;
