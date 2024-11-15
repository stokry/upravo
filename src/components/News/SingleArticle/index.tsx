import { ArticleHeader, ArticleHeaderSkeleton } from './ArticleHeader';
import { ArticleContent, ArticleContentSkeleton } from './ArticleContent';
import { RelatedNews, RelatedNewsSkeleton } from '../RelatedNews';
import type { NewsItem } from '@/types/news';
import { useEffect, useLayoutEffect } from 'react';

interface SingleArticleProps {
  article: NewsItem;
  newsItems: NewsItem[];
  onBack: () => void;
  onNewsClick: (article: NewsItem) => void;
  isLoading?: boolean;
}

const forceScrollTop = () => {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Double check after a short delay
      setTimeout(() => {
        if (window.scrollY > 0) {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }
      }, 50);
    });
  };

export function SingleArticle({ 
  article, 
  newsItems, 
  onBack, 
  onNewsClick,
  isLoading = false
}: SingleArticleProps) {

    useLayoutEffect(() => {
        forceScrollTop();
      }, [article.id]); // Run when article changes

      useEffect(() => {
        forceScrollTop();
      }, [article.id]);
    
  if (isLoading) {
    return <SingleArticleSkeleton />;
  }

  const handleRelatedNewsClick = (selectedArticle: NewsItem) => {
    // Force scroll before handling the click
    forceScrollTop();
    
    // Handle the click with a slight delay
    setTimeout(() => {
      onNewsClick(selectedArticle);
      // Double-check scroll position after state updates
      requestAnimationFrame(() => {
        forceScrollTop();
      });
    }, 50);
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          <ArticleHeader 
            article={article} 
            onBack={onBack}
          />
          <ArticleContent article={article} />
        </div>

        {/* Sidebar */}
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