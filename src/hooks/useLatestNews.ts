import { useState, useEffect } from 'react';
import { fetchLatestArticles } from '../utils/api';
import type { Article } from '../types/Article';

export function useLatestNews(limit: number = 1) {
  const [state, setState] = useState<{
    article: Article | null;
    loading: boolean;
    error: string | null;
  }>({
    article: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let mounted = true;

    async function fetchLatest() {
      try {
        const articles = await fetchLatestArticles(1);
        if (!mounted) return;

        if (!articles.length) {
          throw new Error('No articles found');
        }

        setState({
          article: articles[0],
          loading: false,
          error: null
        });
      } catch (error) {
        if (!mounted) return;
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load latest news'
        }));
      }
    }

    // Initial fetch
    fetchLatest();

    // Set up polling interval
    const interval = setInterval(fetchLatest, 10000); // Check every 10 seconds

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return state;
}