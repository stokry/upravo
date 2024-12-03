import { useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollProps {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export function useInfiniteScroll({
  loading,
  hasMore,
  onLoadMore,
  threshold = 1000
}: UseInfiniteScrollProps) {
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => {
    loadingRef.current = loading;
    hasMoreRef.current = hasMore;
  }, [loading, hasMore]);

  const checkScrollPosition = useCallback(() => {
    if (loadingRef.current || !hasMoreRef.current) return;

    const scrollPosition = Math.max(
      window.pageYOffset,
      document.documentElement.scrollTop,
      document.body.scrollTop
    );
    
    const windowHeight = window.innerHeight;
    const documentHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );

    if (documentHeight - (scrollPosition + windowHeight) < threshold) {
      onLoadMore();
    }
  }, [onLoadMore, threshold]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkScrollPosition();
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleTouchMove = () => {
      handleScroll();
    };

    // Add event listeners with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('gesturechange', handleTouchMove, { passive: true });

    // Initial check
    checkScrollPosition();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('gesturechange', handleTouchMove);
    };
  }, [checkScrollPosition]);
}