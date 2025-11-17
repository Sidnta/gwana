import { useEffect, useRef, RefObject } from 'react';

interface SwipeCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeOptions {
  minSwipeDistance?: number; // Minimum distance in pixels
  preventScroll?: boolean;
}

/**
 * useSwipeGesture - Hook for handling swipe gestures on mobile
 * @param callbacks - Object with swipe direction callbacks
 * @param options - Configuration options
 * @returns ref - Attach to the element you want to detect swipes on
 */
export const useSwipeGesture = (
  callbacks: SwipeCallbacks,
  options: SwipeOptions = {}
): RefObject<HTMLDivElement> => {
  const { minSwipeDistance = 50, preventScroll = false } = options;
  const elementRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (preventScroll && touchStartRef.current) {
        const currentY = e.touches[0].clientY;
        const diffY = Math.abs(currentY - touchStartRef.current.y);
        
        // Prevent scroll if horizontal swipe is detected
        if (diffY < 10) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      };

      const diffX = touchEnd.x - touchStartRef.current.x;
      const diffY = touchEnd.y - touchStartRef.current.y;
      const absDiffX = Math.abs(diffX);
      const absDiffY = Math.abs(diffY);

      // Determine if horizontal or vertical swipe
      if (absDiffX > absDiffY) {
        // Horizontal swipe
        if (absDiffX > minSwipeDistance) {
          if (diffX > 0) {
            callbacks.onSwipeRight?.();
          } else {
            callbacks.onSwipeLeft?.();
          }
        }
      } else {
        // Vertical swipe
        if (absDiffY > minSwipeDistance) {
          if (diffY > 0) {
            callbacks.onSwipeDown?.();
          } else {
            callbacks.onSwipeUp?.();
          }
        }
      }

      touchStartRef.current = null;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventScroll });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [callbacks, minSwipeDistance, preventScroll]);

  return elementRef;
};
