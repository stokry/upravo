import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { SportFilter } from '../../components/SportFilter';
import { ArticleGrid } from '../../components/ArticleGrid';
import { LoadMoreButton } from '../../components/LoadMoreButton';
import { SEO } from '../../components/SEO';
import { useScrollReset } from '../../hooks/useScrollReset';
import { fetchArticlesByCategory } from '../../utils/api';
import type { Article } from '../../types/Article';
import { SPORT_CATEGORIES } from '../../config/constants';

export function SportPage() {
  const { sport } = useParams<{ sport?: string }>();
  useScrollReset();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      let newArticles: Article[] = [];

      if (sport) {
        newArticles = await fetchArticlesByCategory(sport, nextPage);
      } else {
        const sportCategories = Object.values(SPORT_CATEGORIES);
        const promises = sportCategories.map(category => 
          fetchArticlesByCategory(category, nextPage)
        );
        const results = await Promise.all(promises);
        newArticles = results.flat().sort((a, b) => 
          new Date(b.date_unparsed).getTime() - new Date(a.date_unparsed).getTime()
        );
      }

      setArticles(prev => {
        const existingIds = new Set(prev.map(article => article.id));
        const uniqueNewArticles = newArticles.filter(article => !existingIds.has(article.id));
        
        if (uniqueNewArticles.length > 0) {
          setPage(nextPage);
          setHasMore(uniqueNewArticles.length >= 9);
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
  }, [sport, page, hasMore, loadingMore]);

  useEffect(() => {
    async function loadInitialArticles() {
      try {
        setLoading(true);
        setArticles([]);
        setPage(1);
        setHasMore(true);
        setError(null);

        let initialArticles: Article[] = [];

        if (sport) {
          initialArticles = await fetchArticlesByCategory(sport, 1);
        } else {
          const sportCategories = Object.values(SPORT_CATEGORIES);
          const promises = sportCategories.map(category => 
            fetchArticlesByCategory(category, 1)
          );
          const results = await Promise.all(promises);
          initialArticles = results.flat().sort((a, b) => 
            new Date(b.date_unparsed).getTime() - new Date(a.date_unparsed).getTime()
          );
        }

        setArticles(initialArticles);
        setHasMore(initialArticles.length >= 9);
        setError(null);
      } catch (error) {
        console.error('Error fetching sports articles:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    }

    loadInitialArticles();
  }, [sport]);

  const pageTitle = sport 
    ? `${sport.charAt(0).toUpperCase() + sport.slice(1)} vijesti`
    : 'Sport vijesti';

  const pageDescription = sport
    ? `Najnovije vijesti iz ${sport.toLowerCase()}a. Pratite rezultate, analize i novosti.`
    : 'Sve sportske vijesti na jednom mjestu. Pratite najnovije vijesti iz svijeta sporta.';

  const canonical = sport ? `/sport/${sport}` : '/sport';

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <SEO 
        title={pageTitle}
        description={pageDescription}
        canonical={canonical}
        type="website"
      />

      <div className="container mx-auto px-4 py-4">
        <SportFilter />
        
        {error ? (
          <div className="text-red-600 mt-4">{error}</div>
        ) : (
          <div className="mt-6">
            <ArticleGrid articles={articles} />
            {hasMore && (
              <LoadMoreButton 
                onClick={loadMore}
                loading={loadingMore}
                hasMore={hasMore}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}