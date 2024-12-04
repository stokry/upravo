import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollReset() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset scroll position
    window.scrollTo(0, 0);
    
    // Ensure body is scrollable
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    
    // Force layout recalculation
    document.body.offsetHeight;
  }, [pathname]);
}
