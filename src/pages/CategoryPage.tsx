import React from 'react';
import { useParams } from 'react-router-dom';
import { CategoryHeader } from '../components/CategoryHeader';
import { CategoryArticleGrid } from '../components/CategoryArticleGrid';
import { LoadMoreButton } from '../components/LoadMoreButton';
import { useArticleLoading } from '../hooks/useArticleLoading';
import { useScrollReset } from '../hooks/useScrollReset';
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
  useScrollReset();

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
    <div className="h-full">
      <div className="container mx-auto px-4 py-4">
        <CategoryHeader categoryDisplayName={categoryDisplayName} />
        <div className="mt-6">
          <CategoryArticleGrid articles={articles} />
          {hasMore && (
            <LoadMoreButton 
              onClick={loadMore}
              loading={loadingMore}
              hasMore={hasMore}
            />
          )}
        </div>
      </div>
    </div>
  );
}