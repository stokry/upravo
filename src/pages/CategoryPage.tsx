import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { formatTimeAgo } from '../utils/dateUtils';
import { generateArticleUrl } from '../utils/urlUtils';
import { fetchArticlesByCategory } from '../utils/api';
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

  // Reset state when category changes
  useEffect(() => {
    setArticles([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    setError(null);
  }, [category]);

  // Initial load
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

  const loadMore = useCallback(async () => {
    if (!category || loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const newArticles = await fetchArticlesByCategory(category, nextPage);
      
      // Check for duplicates and only add unique articles
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
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.5 }
    );

    const trigger = document.getElementById('infinite-scroll-trigger');
    if (trigger) {
      observer.observe(trigger);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, loadMore]);

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
        <div className="bg-white p-3 md:p-4 rounded-sm shadow-sm mb-4 md:mb-6">
          <div className="flex items-center text-sm">
            <Link to="/" className="text-primary hover:text-secondary">Home</Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-600">{categoryDisplayName}</span>
          </div>
        </div>

        <div className="flex items-center mb-6 md:mb-8 gap-4 md:gap-6">
          <h1 className="text-2xl md:text-3xl font-bold text-primary shrink-0">{categoryDisplayName}</h1>
          <div className="h-0.5 bg-gray-200 w-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <article
              key={`${article.id}-${index}`}
              className="bg-white rounded-sm shadow-sm"
            >
              <Link to={generateArticleUrl(article)} className="group block">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.jpg';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {article.summary}
                  </p>
                  <time className="text-sm text-gray-500">
                    {formatTimeAgo(article.date_unparsed)}
                  </time>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {hasMore && (
          <div
            id="infinite-scroll-trigger"
            className="flex justify-center py-8"
          >
            {loadingMore && (
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}