// components/News/SingleArticle/index.tsx
import { useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { NewsItem } from '@/types/news';
import { createSlug } from '@/utils/seo';
import { ArticleHeader } from './ArticleHeader';
import { ArticleContent } from './ArticleContent';
import { RelatedNews, RelatedNewsSkeleton } from '../RelatedNews';
import { Card, CardContent } from '@/components/ui/card';

interface SingleArticleProps {
  article: NewsItem;
  newsItems: NewsItem[];
  onBack: () => void;
  onNewsClick: (article: NewsItem) => void;
  isLoading?: boolean;
}

const forceScrollTop = () => {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      setTimeout(() => {
        if (window.scrollY > 0) {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }
        resolve();
      }, 50);
    });
  });
};

export function SingleArticle({
  article,
  newsItems,
  onBack,
  onNewsClick,
  isLoading = false
}: SingleArticleProps) {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const categorySlug = createSlug(article.category_name);
    const titleSlug = createSlug(article.title);
    const currentPath = `/${categorySlug}/${titleSlug}`;

    if (window.location.pathname !== currentPath) {
      navigate(currentPath, { replace: false });
    }
  }, [article, navigate]);

  useEffect(() => {
    forceScrollTop();
  }, [article.id]);

  if (isLoading) {
    return <SingleArticleSkeleton />;
  }

  const handleRelatedNewsClick = async (selectedArticle: NewsItem) => {
    await forceScrollTop();
    
    const categorySlug = createSlug(selectedArticle.category_name);
    const titleSlug = createSlug(selectedArticle.title);
    const newPath = `/${categorySlug}/${titleSlug}`;
    
    navigate(newPath, { replace: false });
    
    setTimeout(() => {
      onNewsClick(selectedArticle);
      requestAnimationFrame(() => {
        forceScrollTop();
      });
    }, 50);
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <ArticleHeader 
            article={article}
            onBack={onBack}
          />
          <ArticleContent article={article} />
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <RelatedNews
              currentArticle={article}
              newsItems={newsItems}
              onArticleClick={handleRelatedNewsClick}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

export function ArticleContentSkeleton() {
  return (
    <Card>
      <CardContent className="p-6 space-y-6 animate-pulse">
        <div className="h-20 bg-muted rounded w-full" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-11/12" />
              <div className="h-4 bg-muted rounded w-4/5" />
            </div>
          ))}
        </div>
        <div className="h-12 bg-muted rounded w-full mt-8" />
      </CardContent>
    </Card>
  );
}

export function ArticleHeaderSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 w-24 bg-muted rounded" />
      <div className="space-y-4">
        <div className="h-12 bg-muted rounded-lg w-3/4" />
        <div className="flex gap-4">
          <div className="h-6 w-24 bg-muted rounded" />
          <div className="h-6 w-32 bg-muted rounded" />
        </div>
      </div>
      <div className="aspect-video bg-muted rounded-lg" />
    </div>
  );
}

export function SingleArticleSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <ArticleHeaderSkeleton />
          <ArticleContentSkeleton />
        </div>
        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <RelatedNewsSkeleton />
          </div>
        </aside>
      </div>
    </div>
  );
}