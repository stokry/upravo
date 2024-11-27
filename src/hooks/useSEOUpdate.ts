import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useSEOUpdate() {
  const location = useLocation();

  useEffect(() => {
    // Force meta tags update
    const metaTags = document.getElementsByTagName('meta');
    for (let i = 0; i < metaTags.length; i++) {
      const tag = metaTags[i];
      if (tag.getAttribute('property')?.includes('og:') || 
          tag.getAttribute('name')?.includes('twitter:')) {
        const value = tag.getAttribute('content');
        if (value) {
          tag.setAttribute('content', value);
        }
      }
    }
  }, [location]);
}