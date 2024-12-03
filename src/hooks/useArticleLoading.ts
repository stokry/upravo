// useArticleLoading.ts
import { useState, useCallback, useEffect } from 'react';
import { fetchArticlesByCategory } from '../utils/api';
import type { Article } from '../types/Article';

interface UseArticleLoadingProps {
  category?: string;
  pageSize?: number;
}

export function useArticleLoading({ category, pageSize = 9 }: UseArticleLoadingProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMore = useCallback(async () => {
    if (!category || loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const newArticles = await fetchArticlesByCategory(category, nextPage);
      
      setArticles(prev => {
        const existingIds = new Set(prev.map(article => article.id));
        const uniqueNewArticles = newArticles.filter(article => !existingIds.has(article.id));
        
        if (uniqueNewArticles.length > 0) {
          setPage(nextPage);
          setHasMore(uniqueNewArticles.length >= pageSize);
          return [...prev, ...uniqueNewArticles];
        }
        
        setHasMore(false);
        return prev;
      });
    } catch (error) {
      console.error('Error loading more articles:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [category, page, hasMore, loadingMore, pageSize]);

  useEffect(() => {
    async function loadInitialArticles() {
      if (!category) return;
      
      setLoading(true);
      setPage(1);
      
      try {
        const data = await fetchArticlesByCategory(category, 1);
        setArticles(data || []);
        setHasMore((data?.length || 0) >= pageSize);
        setError(null);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    }

    loadInitialArticles();
    window.scrollTo(0, 0);
  }, [category, pageSize]);

  return {
    articles,
    loading,
    error,
    hasMore,
    loadingMore,
    loadMore
  };
}