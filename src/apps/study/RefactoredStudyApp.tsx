import React, { useState, useEffect, useMemo } from 'react';
import type { AppProps } from '@/src/system/types';
import type { StudyHubItem, StudyProgress } from '@/src/lib/types';
import ThreePanelLayout from '@/src/components/layouts/ThreePanelLayout';
import StudyLeftPanel from '@/src/components/study/StudyLeftPanel';
import StudyRightPanel from '@/src/components/study/StudyRightPanel';
import EnhancedStudyHub from '@/src/components/study/EnhancedStudyHub';
import StudySession from '@/src/components/study/StudySession';
import AnalyticsDashboard from '@/src/components/AnalyticsDashboard';
import FlashcardManager from '@/src/components/FlashcardManager';
import FlashcardReviewSession from '@/src/components/FlashcardReviewSession';
import StudyMobileNav from '@/src/components/study/StudyMobileNav';
import StudyFAB from '@/src/components/study/StudyFAB';
import StudyMobileTopBar from '@/src/components/study/StudyMobileTopBar';
import StudyBottomSheet from '@/src/components/study/StudyBottomSheet';
import AITuningModal, { type AITuningSettings } from '@/src/components/study/AITuningModal';
import { useLiveAPIContext } from '@/src/contexts/LiveAPIContext';

type StudyView = 'hub' | 'analytics' | 'flashcards' | 'review' | 'session';

/**
 * RefactoredStudyApp - Enhanced Study Application with Three-Panel Layout
 * Left: Navigation & Controls (280px)
 * Center: Main Content (flexible)
 * Right: AI Assistant & Context (360px)
 */
const RefactoredStudyApp: React.FC<AppProps> = ({
  appId,
  systemServices,
  initialIntent,
  onNavigate,
  isActive
}) => {
  const [currentView, setCurrentView] = useState<StudyView>('hub');
  const [reviewingDeck, setReviewingDeck] = useState<any>(null);
  const [activeSession, setActiveSession] = useState<StudyHubItem | null>(null);
  const [persona, setPersona] = useState<'Agent Zero' | 'Agent Zara'>('Agent Zero');
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isAITuningOpen, setIsAITuningOpen] = useState(false);
  const [aiSettings, setAISettings] = useState<AITuningSettings>({
    focusLevel: 'deep',
    teachingStyle: 'socratic',
    difficulty: 5,
    autoAdjustDifficulty: true,
    preferredFormats: { text: true, visual: true, audio: false }
  });
  
  // Mock data - replace with actual data fetching
  const [studyItems, setStudyItems] = useState<StudyHubItem[]>([]);
  const [studyProgress] = useState<StudyProgress>({
    studyDays: [],
    totalItems: 0
  });

  // Get voice context
  const { speakingPersona } = useLiveAPIContext();

  // Calculate study streak
  const studyStreak = useMemo(() => {
    if (!studyProgress.studyDays || studyProgress.studyDays.length === 0) return 0;
    const uniqueDays = [...new Set(studyProgress.studyDays)].sort().reverse();
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
      if (diffBetweenDays === 1) streak++;
      else break;
    }
    return streak;
  }, [studyProgress.studyDays]);

  // Handle study-specific intents
  useEffect(() => {
    if (!initialIntent || !isActive) return;

    switch (initialIntent.action) {
      case 'CREATE':
        if (initialIntent.type?.startsWith('flashcard/')) {
          setCurrentView('flashcards');
        }
        break;

      case 'STUDY':
        if (initialIntent.data?.document) {
          setCurrentView('hub');
          systemServices.setToastMessage('Opening study material...');
        }
        break;
    }
  }, [initialIntent, isActive, systemServices]);

  const handleRemoveItem = (id: string) => {
    setStudyItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleStartSession = (item: StudyHubItem) => {
    setActiveSession(item);
    setCurrentView('session');
  };

  const handleCreateMaterial = (type: 'guide' | 'flashcards' | 'quiz') => {
    if (type === 'flashcards') {
      setCurrentView('flashcards');
    } else {
      systemServices.setToastMessage(`Creating ${type}...`);
    }
  };

  const handleAITuningSave = (settings: AITuningSettings) => {
    setAISettings(settings);
    systemServices.setToastMessage('AI settings updated!');
  };

  // Session context for right panel
  const sessionContext = activeSession
    ? {
        topic: activeSession.type === 'learningPath' ? activeSession.goal : activeSession.topic,
        itemsReviewed: 0,
        correctAnswers: 0,
        currentStreak: 0
      }
    : undefined;

  // AI suggestions based on current view
  const suggestions =
    currentView === 'hub'
      ? [
          'Create new flashcards',
          'Start a practice quiz',
          'Review today\'s materials',
          'Set study goals'
        ]
      : currentView === 'session'
      ? [
          'Explain this concept deeper',
          'Create flashcard from this',
          'Quiz me on this topic',
          'Show related concepts'
        ]
      : [];

  // Render center panel based on current view
  const renderCenterPanel = () => {
    switch (currentView) {
      case 'analytics':
        return <AnalyticsDashboard onBack={() => setCurrentView('hub')} />;

      case 'flashcards':
        return (
          <FlashcardManager
            onBack={() => setCurrentView('hub')}
            onStartReview={(deck) => {
              setReviewingDeck(deck);
              setCurrentView('review');
            }}
          />
        );

      case 'review':
        return reviewingDeck ? (
          <FlashcardReviewSession
            deck={reviewingDeck}
            onComplete={() => {
              setReviewingDeck(null);
              setCurrentView('flashcards');
            }}
          />
        ) : null;

      case 'session':
        return activeSession ? (
          <StudySession
            topic={
              activeSession.type === 'learningPath'
                ? activeSession.goal
                : activeSession.topic
            }
            onBack={() => {
              setActiveSession(null);
              setCurrentView('hub');
            }}
          />
        ) : null;

      case 'hub':
      default:
        return (
          <EnhancedStudyHub
            items={studyItems}
            onRemove={handleRemoveItem}
            studyProgress={studyProgress}
            onStartSession={handleStartSession}
          />
        );
    }
  };

  return (
    <div className="h-full w-full bg-[var(--bg-primary)]">
      <ThreePanelLayout
        leftPanel={
          <StudyLeftPanel
            currentView={currentView}
            onViewChange={setCurrentView}
            onCreateMaterial={() => setCurrentView('flashcards')}
            onAITuningClick={() => setIsAITuningOpen(true)}
          />
        }
        centerPanel={renderCenterPanel()}
        rightPanel={
          <StudyRightPanel
            persona={persona}
            setPersona={setPersona}
            sessionContext={sessionContext}
            suggestions={suggestions}
          />
        }
        mobileTopBar={
          <StudyMobileTopBar
            title="Study Center"
            persona={persona}
            speakingPersona={speakingPersona}
            studyStreak={studyStreak}
            onAIAssistantOpen={() => setIsAIAssistantOpen(true)}
          />
        }
        mobileBottomNav={
          <StudyMobileNav
            activeView={currentView === 'session' || currentView === 'review' ? 'hub' : currentView}
            onViewChange={(view) => {
              setCurrentView(view);
              setActiveSession(null);
              setReviewingDeck(null);
            }}
          />
        }
        mobileFAB={
          <StudyFAB onCreateMaterial={handleCreateMaterial} />
        }
      />

      {/* Mobile AI Assistant Bottom Sheet */}
      <StudyBottomSheet
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        title="AI Assistant"
      >
        <StudyRightPanel
          persona={persona}
          setPersona={setPersona}
          sessionContext={sessionContext}
          suggestions={suggestions}
        />
      </StudyBottomSheet>

      {/* AI Tuning Modal */}
      <AITuningModal
        isOpen={isAITuningOpen}
        onClose={() => setIsAITuningOpen(false)}
        settings={aiSettings}
        onSave={handleAITuningSave}
      />
    </div>
  );
};

export default RefactoredStudyApp;
