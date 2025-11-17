import React from 'react';

interface ThreePanelLayoutProps {
  leftPanel: React.ReactNode;
  centerPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  mobileView?: 'left' | 'center' | 'right';
  mobileBottomNav?: React.ReactNode;
  mobileFAB?: React.ReactNode;
  mobileTopBar?: React.ReactNode;
  enableSwipeGestures?: boolean;
}

/**
 * ThreePanelLayout - Reusable three-column desktop layout
 * Left: 280px navigation & controls
 * Center: Flexible main content
 * Right: 360px AI assistant & context
 * Mobile: Single panel view with bottom navigation
 */
const ThreePanelLayout: React.FC<ThreePanelLayoutProps> = ({
  leftPanel,
  centerPanel,
  rightPanel,
  mobileView = 'center',
  mobileBottomNav,
  mobileFAB,
  mobileTopBar
}) => {
  return (
    <>
      {/* Desktop Layout - Three Panels */}
      <div className="hidden md:flex h-full w-full">
        {/* Left Panel - Navigation & Controls */}
        <div className="w-[280px] flex-shrink-0 bg-[var(--bg-secondary)]/50 backdrop-blur-sm border-r border-[var(--border-color)] overflow-y-auto">
          {leftPanel}
        </div>

        {/* Center Panel - Main Content */}
        <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
          {centerPanel}
        </div>

        {/* Right Panel - AI Assistant */}
        <div className="w-[360px] flex-shrink-0 bg-[var(--bg-secondary)]/30 backdrop-blur-sm border-l border-[var(--border-color)] overflow-y-auto">
          {rightPanel}
        </div>
      </div>

      {/* Mobile Layout - Single Panel with Bottom Nav */}
      <div className="md:hidden h-full w-full flex flex-col bg-[var(--bg-primary)]">
        {/* Mobile Top Bar */}
        {mobileTopBar}
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {mobileView === 'left' && leftPanel}
          {mobileView === 'center' && centerPanel}
          {mobileView === 'right' && rightPanel}
        </div>
        
        {/* Mobile Bottom Navigation */}
        {mobileBottomNav}
        
        {/* Floating Action Button */}
        {mobileFAB}
      </div>
    </>
  );
};

export default ThreePanelLayout;
