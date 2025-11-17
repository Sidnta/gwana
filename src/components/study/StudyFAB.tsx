import React, { useState } from 'react';
import { Plus, FileText, Brain, HelpCircle, X } from 'lucide-react';

interface StudyFABProps {
  onCreateMaterial: (type: 'guide' | 'flashcards' | 'quiz') => void;
}

/**
 * StudyFAB - Floating Action Button for quick material creation
 * Android-style expandable FAB
 */
const StudyFAB: React.FC<StudyFABProps> = ({ onCreateMaterial }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const quickActions = [
    { type: 'guide' as const, label: 'Study Guide', icon: FileText, color: 'cyan' },
    { type: 'flashcards' as const, label: 'Flashcards', icon: Brain, color: 'magenta' },
    { type: 'quiz' as const, label: 'Quiz', icon: HelpCircle, color: 'green' }
  ];

  const handleActionClick = (type: 'guide' | 'flashcards' | 'quiz') => {
    onCreateMaterial(type);
    setIsExpanded(false);
  };

  return (
    <div className="fixed right-4 bottom-20 z-50 md:hidden">
      {/* Expanded Actions */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 space-y-3 mb-2">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={action.type}
                onClick={() => handleActionClick(action.type)}
                className="flex items-center gap-3 bg-[var(--bg-secondary)]/95 backdrop-blur-sm border border-[var(--border-color)] rounded-full px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-200 animate-fade-in"
                style={{
                  animationDelay: `${index * 50}ms`,
                  boxShadow: `0 4px 20px hsl(var(--accent-${action.color}) / 0.3)`
                }}
              >
                <Icon size={20} className={`text-[var(--accent-${action.color})]`} />
                <span className="text-sm font-medium text-[var(--text-primary)] whitespace-nowrap">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main FAB Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 rounded-full bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-magenta)] text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${
          isExpanded ? 'rotate-45' : ''
        }`}
        style={{
          boxShadow: '0 4px 20px hsl(var(--accent-cyan) / 0.4)'
        }}
      >
        {isExpanded ? <X size={24} /> : <Plus size={24} />}
      </button>

      {/* Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default StudyFAB;
