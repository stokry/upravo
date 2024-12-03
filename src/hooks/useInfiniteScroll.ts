import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { CategoryHeader } from '../components/CategoryHeader';
import { CategoryArticleGrid } from '../components/CategoryArticleGrid';
import { fetchArticlesByCategory } from '../utils/api';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import type { Article } from '../types/Article';
import { CATEGORY_NAMES } from '../config/constants';

export function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const categoryDisplayName = category ? CATEGORY_NAMES[category.toUpperCase()] || category : '';

  const loadMore = useCallback(async () => {
    if (!category || loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const newArticles = await fetchArticlesByCategory(category, nextPage);
      
      const existingIds = new Set(articles.map(article => article.id));
      const uniqueNewArticles = newArticles.filter(article => !existingIds.has(article.id));
      
      if (uniqueNewArticles.length > 0) {
        setArticles(prev => [...prev, ...uniqueNewArticles]);
        setPage(nextPage);
        setHasMore(uniqueNewArticles.length >= 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more articles:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [category, page, hasMore, loadingMore, articles]);

  useEffect(() => {
    setArticles([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    setError(null);
    window.scrollTo(0, 0);
  }, [category]);

  useEffect(() => {
    async function loadInitialArticles() {
      try {
        if (!category) {
          throw new Error('Category is required');
        }
        const data = await fetchArticlesByCategory(category, 1);
        setArticles(data);
        setHasMore(data.length >= 10);
        setError(null);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    }

    loadInitialArticles();
  }, [category]);

  const lastElementRef = useInfiniteScroll({
    loading: loading || loadingMore,
    hasMore,
    onLoadMore: loadMore,
    rootMargin: '300px',
    threshold: 0.1
  });

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <main className="py-4 md:py-6 lg:py-8">
      <SEO 
        title={categoryDisplayName}
        description={`Pratite najnovije vijesti i događanja uživo iz naše ${categoryDisplayName} kategorije. Vaš izvor za najnovije vijesti.`}
        canonical={`/${category}`}
        type="website"
      />

      <div className="container px-4 mx-auto">
        <CategoryHeader categoryDisplayName={categoryDisplayName} />
        <CategoryArticleGrid articles={articles} lastElementRef={lastElementRef} />

        {loadingMore && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          </div>
        )}
      </div>
    </main>
  );
}