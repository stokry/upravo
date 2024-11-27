import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { SportFilter } from '../../components/SportFilter';
import { ArticleGrid } from '../../components/ArticleGrid';
import { SEO } from '../../components/SEO';
import { fetchArticlesByCategory } from '../../utils/api';
import type { Article } from '../../types/Article';
import { SPORT_CATEGORIES } from '../../config/constants';

export function SportPage() {
  const { sport } = useParams<{ sport?: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadArticles = useCallback(async (pageNum: number, isInitial: boolean = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      let newArticles: Article[] = [];

      if (sport) {
        // Fetch articles for specific sport category
        const data = await fetchArticlesByCategory(sport, pageNum);
        newArticles = data;
      } else {
        // Fetch articles for all sport categories
        const sportCategories = Object.values(SPORT_CATEGORIES);
        const promises = sportCategories.map(category => 
          fetchArticlesByCategory(category, pageNum)
        );
        const results = await Promise.all(promises);
        newArticles = results.flat();
      }

      // Sort by date
      const sortedData = newArticles.sort((a, b) => 
        new Date(b.date_unparsed).getTime() - new Date(a.date_unparsed).getTime()
      );

      if (isInitial) {
        setArticles(sortedData);
      } else {
        setArticles(prev => [...prev, ...sortedData]);
      }

      setHasMore(newArticles.length >= 10);
      setError(null);
    } catch (error) {
      console.error('Error fetching sports articles:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch articles');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [sport]);

  // Initial load
  useEffect(() => {
    setPage(1);
    setArticles([]);
    setHasMore(true);
    loadArticles(1, true);
  }, [sport, loadArticles]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000 &&
        !loading &&
        !loadingMore &&
        hasMore
      ) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, loadingMore, hasMore]);

  // Load more when page changes
  useEffect(() => {
    if (page > 1) {
      loadArticles(page);
    }
  }, [page, loadArticles]);

  const pageTitle = sport 
    ? `${sport.charAt(0).toUpperCase() + sport.slice(1)} vijesti`
    : 'Sport vijesti';

  const pageDescription = sport
    ? `Najnovije vijesti iz ${sport.toLowerCase()}a. Pratite rezultate, analize i novosti.`
    : 'Sve sportske vijesti na jednom mjestu. Pratite najnovije vijesti iz svijeta sporta.';

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="py-4 md:py-6 lg:py-8">
      <SEO 
        title={pageTitle}
        description={pageDescription}
        canonical={sport ? `/sport/${sport}` : '/sport'}
      />

      <div className="container px-4 mx-auto">
        <SportFilter />

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-sm p-4">
            {error}
          </div>
        ) : articles.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 text-gray-600 rounded-sm p-4">
            Nema dostupnih članaka za ovu kategoriju.
          </div>
        ) : (
          <>
            <ArticleGrid articles={articles} />
            
            {loadingMore && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}