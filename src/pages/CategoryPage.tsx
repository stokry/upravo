import React from 'react';
import { useParams } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { CategoryHeader } from '../components/CategoryHeader';
import { CategoryArticleGrid } from '../components/CategoryArticleGrid';
import { LoadMoreButton } from '../components/LoadMoreButton';
import { useArticleLoading } from '../hooks/useArticleLoading';
import { CATEGORY_NAMES } from '../config/constants';

export function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const {
    articles,
    loading,
    error,
    hasMore,
    loadingMore,
    loadMore
  } = useArticleLoading({ category });

  const categoryDisplayName = category ? CATEGORY_NAMES[category.toUpperCase()] || category : '';

  if (loading) {
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
        <CategoryArticleGrid articles={articles} />
        <LoadMoreButton 
          onClick={loadMore}
          loading={loadingMore}
          hasMore={hasMore}
        />
      </div>
    </main>
  );
}