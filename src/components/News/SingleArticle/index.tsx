// components/News/SingleArticle/index.tsx
import { useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArticleHeader, ArticleHeaderSkeleton } from './ArticleHeader';
import { ArticleContent, ArticleContentSkeleton } from './ArticleContent';
import { RelatedNews, RelatedNewsSkeleton } from '../RelatedNews';
import type { NewsItem } from '@/types/news';
import { createSlug } from '@/utils/seo';

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
      
      // Double check after a short delay
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

  // Ensure URL is correct when component mounts or article changes
  useLayoutEffect(() => {
    const categorySlug = createSlug(article.category_name);
    const titleSlug = createSlug(article.title);
    const currentPath = `/${categorySlug}/${titleSlug}`;
    
    // Update URL if it doesn't match current article
    if (window.location.pathname !== currentPath) {
      navigate(currentPath, { replace: false });
    }
  }, [article, navigate]);

  // Handle scrolling
  useEffect(() => {
    forceScrollTop();
  }, [article.id]);

  if (isLoading) {
    return <SingleArticleSkeleton />;
  }

  const handleRelatedNewsClick = async (selectedArticle: NewsItem) => {
    // First scroll to top
    await forceScrollTop();

    // Update URL and state
    const categorySlug = createSlug(selectedArticle.category_name);
    const titleSlug = createSlug(selectedArticle.title);
    const newPath = `/${categorySlug}/${titleSlug}`;
    
    // Navigate first
    navigate(newPath, { replace: false });
    
    // Then update state after a small delay
    setTimeout(() => {
      onNewsClick(selectedArticle);
      
      // Final scroll check
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