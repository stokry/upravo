import { useState, useCallback, useEffect } from 'react';
import { fetchArticlesByCategory } from '../utils/api';
import type { Article } from '../types/Article';

interface UseArticleLoadingProps {
  category?: string;
  pageSize?: number;
}

interface ArticleLoadingState {
  articles: Article[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadingMore: boolean;
}

export function useArticleLoading({ category, pageSize = 9 }: UseArticleLoadingProps) {
  const [state, setState] = useState<ArticleLoadingState>({
    articles: [],
    loading: true,
    error: null,
    hasMore: true,
    loadingMore: false
  });
  const [page, setPage] = useState(1);

  const loadMore = useCallback(async () => {
    if (!category || state.loadingMore || !state.hasMore) return;

    setState(prev => ({ ...prev, loadingMore: true }));
    
    try {
      const nextPage = page + 1;
      const newArticles = await fetchArticlesByCategory(category, nextPage);
      
      setState(prev => {
        const existingIds = new Set(prev.articles.map(article => article.id));
        const uniqueNewArticles = newArticles.filter(article => !existingIds.has(article.id));
        
        if (uniqueNewArticles.length > 0) {
          return {
            ...prev,
            articles: [...prev.articles, ...uniqueNewArticles],
            hasMore: uniqueNewArticles.length >= pageSize,
            loadingMore: false
          };
        }
        
        return {
          ...prev,
          hasMore: false,
          loadingMore: false
        };
      });
      
      setPage(nextPage);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load more articles',
        loadingMore: false
      }));
    }
  }, [category, page, pageSize, state.loadingMore, state.hasMore]);

  useEffect(() => {
    async function loadInitialArticles() {
      if (!category) return;

      setState(prev => ({ ...prev, loading: true }));
      setPage(1);

      try {
        const data = await fetchArticlesByCategory(category, 1);
        setState({
          articles: data,
          loading: false,
          error: null,
          hasMore: data.length >= pageSize,
          loadingMore: false
        });
      } catch (error) {
        setState({
          articles: [],
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch articles',
          hasMore: false,
          loadingMore: false
        });
      }
    }

    loadInitialArticles();
    window.scrollTo(0, 0);
  }, [category, pageSize]);

  return {
    ...state,
    loadMore
  };
}