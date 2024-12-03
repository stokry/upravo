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
  threshold = 800
}: UseInfiniteScrollProps) {
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);

  // Update refs when props change
  useEffect(() => {
    loadingRef.current = loading;
    hasMoreRef.current = hasMore;
  }, [loading, hasMore]);

  const checkScrollPosition = useCallback(() => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      if (loadingRef.current || !hasMoreRef.current) return;

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      if (documentHeight - (scrollTop + windowHeight) < threshold) {
        onLoadMore();
      }
    }, 50);
  }, [onLoadMore, threshold]);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(checkScrollPosition);
    };

    // Add both scroll and touch events with passive flag
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial check on mount
    setTimeout(checkScrollPosition, 100);

    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [checkScrollPosition]);
}