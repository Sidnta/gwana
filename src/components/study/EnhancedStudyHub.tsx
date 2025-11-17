import React, { useMemo } from 'react';
import { BookOpen, Layers, Target, HelpCircle, Trash2, FileText, TrendingUp, Zap, Play, Eye } from 'lucide-react';
import type { StudyHubItem, StudyProgress } from '@/src/lib/types';
import HolographicPanel from '../cyberpunk/HolographicPanel';
import HolographicText from '../cyberpunk/HolographicText';
import { getStudyColorVar } from '@/src/lib/studyColors';

interface EnhancedStudyHubProps {
  items: StudyHubItem[];
  onRemove: (id: string) => void;
  studyProgress: StudyProgress;
  onStartSession?: (item: StudyHubItem) => void;
}

const ItemIcon: React.FC<{ type: StudyHubItem['type'] }> = ({ type }) => {
  const colorVar = getStudyColorVar(type);
  const iconMap = {
    guide: FileText,
    cards: Layers,
    practice: Target,
    quiz: HelpCircle,
    learningPath: TrendingUp,
  };
  const Icon = iconMap[type] || BookOpen;
  return <Icon size={24} className={`text-[var(${colorVar})]`} />;
};

const ProgressTracker: React.FC<{ progress: StudyProgress }> = ({ progress }) => {
  const studyStreak = useMemo(() => {
    if (!progress.studyDays || progress.studyDays.length === 0) return 0;

    const uniqueDays = [...new Set(progress.studyDays)].sort().reverse();
    const today = new Date();
    const todayUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
    const mostRecentDay = new Date(uniqueDays[0] + 'T00:00:00Z').getTime();
    const diffFromToday = (todayUTC - mostRecentDay) / (1000 * 60 * 60 * 24);

    if (diffFromToday > 1) return 0;

    let streak = 1;
    for (let i = 0; i < uniqueDays.length - 1; i++) {
      const currentDay = new Date(uniqueDays[i] + 'T00:00:00Z').getTime();
      const nextDay = new Date(uniqueDays[i + 1] + 'T00:00:00Z').getTime();
      const diffBetweenDays = (currentDay - nextDay) / (1000 * 60 * 60 * 24);

      if (diffBetweenDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [progress.studyDays]);

  return (
    <HolographicPanel glowColor="cyan" withGrid className="p-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap size={32} className="text-[var(--accent-amber)]" />
            <HolographicText glowColor="amber" className="text-4xl font-bold">
              {studyStreak}
            </HolographicText>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">Day Streak</p>
        </div>
        <div className="text-center">
          <HolographicText glowColor="cyan" className="text-4xl font-bold mb-2">
            {progress.totalItems}
          </HolographicText>
          <p className="text-sm text-[var(--text-secondary)]">Items Mastered</p>
        </div>
      </div>
    </HolographicPanel>
  );
};

/**
 * EnhancedStudyHub - Main hub view with materials grid
 */
const EnhancedStudyHub: React.FC<EnhancedStudyHubProps> = ({
  items,
  onRemove,
  studyProgress,
  onStartSession
}) => {
  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Progress Tracker */}
      <ProgressTracker progress={studyProgress} />

      {/* Materials Grid */}
      {items.length === 0 ? (
        <HolographicPanel glowColor="cyan" className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <BookOpen size={64} className="mb-4 text-[var(--accent-cyan)] opacity-50" />
            <HolographicText glowColor="cyan" className="text-2xl font-semibold mb-2">
              Your Study Hub is Empty
            </HolographicText>
            <p className="max-w-md text-sm text-[var(--text-secondary)]">
              Materials you create in Classroom mode will be automatically saved here for you to
              review later.
            </p>
          </div>
        </HolographicPanel>
      ) : (
        <>
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
              Study Materials ({items.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {items.map((item) => (
                <HolographicPanel
                  key={item.id}
                  glowColor="cyan"
                  withCorners
                  className="p-4 group hover:scale-[1.02] transition-transform duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <ItemIcon type={item.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[var(--accent-cyan)] uppercase tracking-wider mb-1">
                        {item.type === 'learningPath' ? 'Learning Path' : item.type}
                      </p>
                      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2 truncate">
                        {item.type === 'learningPath' ? item.goal : item.topic}
                      </h3>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {onStartSession && (
                          <button
                            onClick={() => onStartSession(item)}
                            className="flex items-center gap-1 px-3 py-1 rounded-md bg-[var(--accent-green)]/20 hover:bg-[var(--accent-green)]/30 text-[var(--accent-green)] text-xs font-medium transition-colors"
                          >
                            <Play size={14} />
                            Start
                          </button>
                        )}
                        <button
                          className="flex items-center gap-1 px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] text-xs font-medium transition-colors"
                        >
                          <Eye size={14} />
                          View
                        </button>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="ml-auto p-1 text-[var(--text-secondary)] hover:text-red-400 transition-colors"
                          title="Remove from Hub"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </HolographicPanel>
              ))}
            </div>
          </div>

          {/* AI Suggestions */}
          <HolographicPanel glowColor="purple" className="p-6">
            <h3 className="text-lg font-semibold text-[var(--accent-magenta)] mb-4">
              Recommended Next Steps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button className="px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-left transition-all duration-200 border border-[var(--accent-magenta)]/20 hover:border-[var(--accent-magenta)]/40">
                <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
                  📚 Review flashcards
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  15 cards due for review
                </p>
              </button>
              <button className="px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-left transition-all duration-200 border border-[var(--accent-magenta)]/20 hover:border-[var(--accent-magenta)]/40">
                <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
                  🎯 Practice quiz
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  Test your knowledge
                </p>
              </button>
              <button className="px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-left transition-all duration-200 border border-[var(--accent-magenta)]/20 hover:border-[var(--accent-magenta)]/40">
                <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
                  ⚡ Quick session
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  5-minute challenge
                </p>
              </button>
            </div>
          </HolographicPanel>
        </>
      )}
    </div>
  );
};

export default EnhancedStudyHub;
