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
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);
  const scrollListenerRef = useRef<(() => void) | null>(null);
  const lastScrollY = useRef(0);
  const isScrolling = useRef(false);

  // Update refs when props change
  useEffect(() => {
    loadingRef.current = loading;
    hasMoreRef.current = hasMore;
  }, [loading, hasMore]);

  const checkScrollPosition = useCallback(() => {
    if (loadingRef.current || !hasMoreRef.current || isScrolling.current) return;

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Prevent multiple triggers when scroll position hasn't changed significantly
    if (Math.abs(scrollTop - lastScrollY.current) < 50) return;
    lastScrollY.current = scrollTop;

    if (documentHeight - (scrollTop + windowHeight) < threshold) {
      isScrolling.current = true;
      onLoadMore();
      // Reset isScrolling after a delay
      setTimeout(() => {
        isScrolling.current = false;
      }, 100);
    }
  }, [onLoadMore, threshold]);

  useEffect(() => {
    // Remove existing scroll listeners if any
    if (scrollListenerRef.current) {
      window.removeEventListener('scroll', scrollListenerRef.current);
      window.removeEventListener('touchmove', scrollListenerRef.current);
    }

    // Create new scroll handler with debounce
    const handleScroll = () => {
      requestAnimationFrame(checkScrollPosition);
    };

    // Store reference to current handler
    scrollListenerRef.current = handleScroll;

    // Add event listeners with passive flag for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });

    // Initial check after a short delay to ensure content is rendered
    const timeoutId = setTimeout(() => {
      checkScrollPosition();
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      if (scrollListenerRef.current) {
        window.removeEventListener('scroll', scrollListenerRef.current);
        window.removeEventListener('touchmove', scrollListenerRef.current);
      }
    };
  }, [checkScrollPosition, loading]); // Added loading dependency for proper reinitialization
}