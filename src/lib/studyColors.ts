/**
 * Study Material Color Coding System
 * Consistent colors for different study material types
 */

export const STUDY_COLORS = {
  studyGuide: 'hsl(213, 94%, 68%)',    // #60A5FA - Blue
  guide: 'hsl(213, 94%, 68%)',         // Alias for studyGuide
  flashcards: 'hsl(250, 86%, 77%)',    // #A78BFA - Purple
  cards: 'hsl(250, 86%, 77%)',         // Alias for flashcards
  quiz: 'hsl(152, 69%, 58%)',          // #34D399 - Green
  practice: 'hsl(43, 96%, 56%)',       // #FBBF24 - Yellow
  analytics: 'hsl(0, 91%, 71%)',       // #F87171 - Red
  aiSuggestion: 'hsl(168, 100%, 33%)', // #00a884 - WhatsApp green
  learningPath: 'hsl(28, 90%, 60%)',   // Orange
} as const;

export type StudyMaterialType = keyof typeof STUDY_COLORS;

/**
 * Get color for a study material type
 */
export const getStudyColor = (type: string): string => {
  return STUDY_COLORS[type as StudyMaterialType] || 'hsl(var(--accent-cyan))';
};

/**
 * Get text color with good contrast for a material type
 */
export const getStudyTextColor = (type: string): string => {
  // All our colors are vibrant, so white text works well
  return 'hsl(0, 0%, 100%)';
};

/**
 * Get CSS variable name for material type
 */
export const getStudyColorVar = (type: string): string => {
  const colorMap: Record<string, string> = {
    studyGuide: '--accent-cyan',
    guide: '--accent-cyan',
    flashcards: '--accent-magenta',
    cards: '--accent-magenta',
    quiz: '--accent-green',
    practice: '--accent-amber',
    analytics: '--accent-red',
    learningPath: '--accent-amber',
  };
  
  return colorMap[type] || '--accent-cyan';
};
