import React from 'react';
import { BookOpen, BarChart3, Brain, Plus, Settings } from 'lucide-react';
import HolographicText from '../cyberpunk/HolographicText';

type StudyView = 'hub' | 'analytics' | 'flashcards' | 'review' | 'session';

interface StudyLeftPanelProps {
  currentView: StudyView;
  onViewChange: (view: StudyView) => void;
  onCreateMaterial?: () => void;
  onAITuningClick?: () => void;
}

/**
 * StudyLeftPanel - Navigation & Controls for Study App
 */
const StudyLeftPanel: React.FC<StudyLeftPanelProps> = ({
  currentView,
  onViewChange,
  onCreateMaterial,
  onAITuningClick
}) => {
  const navItems = [
    { id: 'hub' as StudyView, label: 'Study Hub', icon: BookOpen, color: 'cyan' },
    { id: 'analytics' as StudyView, label: 'Analytics', icon: BarChart3, color: 'green' },
    { id: 'flashcards' as StudyView, label: 'Flashcards', icon: Brain, color: 'magenta' }
  ];

  return (
    <div className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="mb-6">
        <HolographicText glowColor="cyan" className="text-2xl font-bold">
          Study Center
        </HolographicText>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          AI-Powered Learning Hub
        </p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-white/10 border border-[var(--accent-cyan)]/40 shadow-lg'
                  : 'hover:bg-white/5 border border-transparent'
              }`}
              style={{
                boxShadow: isActive ? `0 0 20px var(--accent-${item.color})20` : 'none'
              }}
            >
              <Icon
                size={20}
                className={isActive ? `text-[var(--accent-${item.color})]` : 'text-[var(--text-secondary)]'}
              />
              <span
                className={`text-sm font-medium ${
                  isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="mt-auto space-y-2 pt-4 border-t border-[var(--border-color)]">
        {onCreateMaterial && (
          <button
            onClick={onCreateMaterial}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--accent-cyan)]/20 hover:bg-[var(--accent-cyan)]/30 border border-[var(--accent-cyan)]/40 transition-all duration-200"
          >
            <Plus size={20} className="text-[var(--accent-cyan)]" />
            <span className="text-sm font-medium text-[var(--text-primary)]">
              Create Material
            </span>
          </button>
        )}

        <button 
          onClick={onAITuningClick}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-all duration-200"
        >
          <Settings size={20} className="text-[var(--text-secondary)]" />
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            AI Tuning
          </span>
        </button>
      </div>
    </div>
  );
};

export default StudyLeftPanel;
