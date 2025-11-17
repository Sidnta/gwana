import React from 'react';
import { BookOpen, Brain, BarChart3 } from 'lucide-react';

type StudyView = 'hub' | 'flashcards' | 'analytics';

interface StudyMobileNavProps {
  activeView: StudyView;
  onViewChange: (view: StudyView) => void;
}

/**
 * StudyMobileNav - Bottom navigation for mobile study app
 * Material Design inspired tab bar
 */
const StudyMobileNav: React.FC<StudyMobileNavProps> = ({ activeView, onViewChange }) => {
  const navItems = [
    { id: 'hub' as StudyView, label: 'Hub', icon: BookOpen },
    { id: 'flashcards' as StudyView, label: 'Cards', icon: Brain },
    { id: 'analytics' as StudyView, label: 'Stats', icon: BarChart3 }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--bg-secondary)]/95 backdrop-blur-md border-t border-[var(--border-color)] z-40 md:hidden">
      <div className="flex items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-6 rounded-lg transition-all duration-200 relative ${
                isActive ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-secondary)]'
              }`}
            >
              {/* Material Design Ripple Effect */}
              <div
                className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                  isActive ? 'bg-[var(--accent-cyan)]/10' : ''
                }`}
              />
              
              <Icon
                size={24}
                className={`mb-1 relative z-10 transition-transform duration-200 ${
                  isActive ? 'scale-110' : ''
                }`}
              />
              <span
                className={`text-xs font-medium relative z-10 ${
                  isActive ? 'font-semibold' : ''
                }`}
              >
                {item.label}
              </span>
              
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-[var(--accent-cyan)] rounded-b-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default StudyMobileNav;
