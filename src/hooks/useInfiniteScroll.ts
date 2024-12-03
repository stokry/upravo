import { useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollProps {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  threshold?: number;
  container?: HTMLElement | null; // Allow custom container
}

export function useInfiniteScroll({
  loading,
  hasMore,
  onLoadMore,
  threshold = 1000,
  container = null
}: UseInfiniteScrollProps) {
  // Refs to track current state without triggering re-renders
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);
  const containerRef = useRef(container);

  // Update refs when props change
  useEffect(() => {
    loadingRef.current = loading;
    hasMoreRef.current = hasMore;
    containerRef.current = container;
  }, [loading, hasMore, container]);

  const checkScrollPosition = useCallback(() => {
    if (loadingRef.current || !hasMoreRef.current) return;

    // Get the scrollable container (either custom container, window, or document)
    const scrollContainer = containerRef.current || window;
    const doc = document.documentElement || document.body;

    let scrollPosition: number;
    let containerHeight: number;
    let totalHeight: number;

    if (scrollContainer === window) {
      // Window scroll calculations
      scrollPosition = window.scrollY || window.pageYOffset || doc.scrollTop;
      containerHeight = window.innerHeight;
      totalHeight = Math.max(
        doc.scrollHeight,
        doc.offsetHeight,
        doc.clientHeight
      );
    } else {
      // Custom container calculations
      scrollPosition = scrollContainer.scrollTop;
      containerHeight = scrollContainer.clientHeight;
      totalHeight = scrollContainer.scrollHeight;
    }

    // Calculate remaining scroll space
    const remainingScroll = totalHeight - (scrollPosition + containerHeight);

    // Trigger load more if we're within threshold
    if (remainingScroll < threshold) {
      onLoadMore();
    }
  }, [onLoadMore, threshold]);

  // Debounced scroll handler
  const debouncedCheck = useCallback(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        checkScrollPosition();
        timeoutId = null;
      }, 100);
    };
  }, [checkScrollPosition]);

  useEffect(() => {
    const scrollHandler = debouncedCheck();
    const targetElement = containerRef.current || window;

    // Add event listeners with passive option for better performance
    targetElement.addEventListener('scroll', scrollHandler, { passive: true });
    targetElement.addEventListener('touchmove', scrollHandler, { passive: true });
    targetElement.addEventListener('wheel', scrollHandler, { passive: true });

    // Check initial position (important for short content pages)
    checkScrollPosition();

    // Cleanup
    return () => {
      targetElement.removeEventListener('scroll', scrollHandler);
      targetElement.removeEventListener('touchmove', scrollHandler);
      targetElement.removeEventListener('wheel', scrollHandler);
      
      // Clear any pending timeouts
      scrollHandler();
    };
  }, [checkScrollPosition, debouncedCheck]);
}