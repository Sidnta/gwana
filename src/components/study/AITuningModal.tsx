import React, { useState } from 'react';
import { X, Zap, MessageCircle, Sliders, Volume2 } from 'lucide-react';
import HolographicPanel from '../cyberpunk/HolographicPanel';
import HolographicText from '../cyberpunk/HolographicText';

export interface AITuningSettings {
  focusLevel: 'deep' | 'quick';
  teachingStyle: 'socratic' | 'direct' | 'simplified';
  difficulty: number; // 1-10
  autoAdjustDifficulty: boolean;
  preferredFormats: {
    text: boolean;
    visual: boolean;
    audio: boolean;
  };
}

interface AITuningModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AITuningSettings;
  onSave: (settings: AITuningSettings) => void;
}

/**
 * AITuningModal - Customize AI teaching behavior
 */
const AITuningModal: React.FC<AITuningModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<AITuningSettings>(settings);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <HolographicPanel
          glowColor="cyan"
          withCorners
          withGrid
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
            <HolographicText glowColor="cyan" className="text-2xl font-bold flex items-center gap-2">
              <Sliders size={24} />
              AI Tuning
            </HolographicText>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Focus Level */}
            <div>
              <label className="block text-sm font-semibold text-[var(--accent-cyan)] mb-3">
                <Zap size={16} className="inline mr-2" />
                Focus Level
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setLocalSettings({ ...localSettings, focusLevel: 'deep' })}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    localSettings.focusLevel === 'deep'
                      ? 'border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10'
                      : 'border-[var(--border-color)] hover:border-[var(--accent-cyan)]/50'
                  }`}
                >
                  <div className="text-lg font-semibold mb-1">🎯 Deep</div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    Thorough explanations with examples
                  </div>
                </button>
                <button
                  onClick={() => setLocalSettings({ ...localSettings, focusLevel: 'quick' })}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    localSettings.focusLevel === 'quick'
                      ? 'border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10'
                      : 'border-[var(--border-color)] hover:border-[var(--accent-cyan)]/50'
                  }`}
                >
                  <div className="text-lg font-semibold mb-1">⚡ Quick</div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    Concise, straight to the point
                  </div>
                </button>
              </div>
            </div>

            {/* Teaching Style */}
            <div>
              <label className="block text-sm font-semibold text-[var(--accent-magenta)] mb-3">
                <MessageCircle size={16} className="inline mr-2" />
                Teaching Style
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['socratic', 'direct', 'simplified'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => setLocalSettings({ ...localSettings, teachingStyle: style })}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      localSettings.teachingStyle === style
                        ? 'border-[var(--accent-magenta)] bg-[var(--accent-magenta)]/10'
                        : 'border-[var(--border-color)] hover:border-[var(--accent-magenta)]/50'
                    }`}
                  >
                    <div className="text-sm font-semibold capitalize">{style}</div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-2">
                {localSettings.teachingStyle === 'socratic' && '🤔 Guides you with questions'}
                {localSettings.teachingStyle === 'direct' && '📝 Clear, straightforward answers'}
                {localSettings.teachingStyle === 'simplified' && '🎈 ELI5 explanations'}
              </p>
            </div>

            {/* Difficulty Level */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-[var(--accent-amber)]">
                  Difficulty Level: {localSettings.difficulty}
                </label>
                <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <input
                    type="checkbox"
                    checked={localSettings.autoAdjustDifficulty}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, autoAdjustDifficulty: e.target.checked })
                    }
                    className="rounded"
                  />
                  Auto-adjust
                </label>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={localSettings.difficulty}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, difficulty: parseInt(e.target.value) })
                }
                disabled={localSettings.autoAdjustDifficulty}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
                <span>Beginner</span>
                <span>Expert</span>
              </div>
            </div>

            {/* Preferred Formats */}
            <div>
              <label className="block text-sm font-semibold text-[var(--accent-green)] mb-3">
                <Volume2 size={16} className="inline mr-2" />
                Preferred Formats
              </label>
              <div className="space-y-2">
                {(['text', 'visual', 'audio'] as const).map((format) => (
                  <label key={format} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.preferredFormats[format]}
                      onChange={(e) =>
                        setLocalSettings({
                          ...localSettings,
                          preferredFormats: {
                            ...localSettings.preferredFormats,
                            [format]: e.target.checked
                          }
                        })
                      }
                      className="rounded"
                    />
                    <span className="text-sm capitalize">{format} Explanations</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--border-color)]">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-[var(--border-color)] hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-lg bg-[var(--accent-cyan)]/20 border border-[var(--accent-cyan)]/40 text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/30 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </HolographicPanel>
      </div>
    </>
  );
};

export default AITuningModal;
