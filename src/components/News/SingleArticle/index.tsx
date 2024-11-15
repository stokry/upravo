import { ArticleHeader, ArticleHeaderSkeleton } from './ArticleHeader';
import { ArticleContent, ArticleContentSkeleton } from './ArticleContent';
import { RelatedNews, RelatedNewsSkeleton } from '../RelatedNews';
import type { NewsItem } from '@/types/news';

interface SingleArticleProps {
  article: NewsItem;
  newsItems: NewsItem[];
  onBack: () => void;
  onNewsClick: (article: NewsItem) => void;
  isLoading?: boolean;
}

export function SingleArticle({ 
  article, 
  newsItems, 
  onBack, 
  onNewsClick,
  isLoading = false
}: SingleArticleProps) {
  if (isLoading) {
    return <SingleArticleSkeleton />;
  }

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
              onArticleClick={onNewsClick}
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