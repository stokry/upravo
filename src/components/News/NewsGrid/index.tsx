import { HomeHero } from '../HomeHero';
import { WorldNewsSection } from './WorldNewsSection';
import type { NewsItem } from '@/types/news';

interface NewsGridProps {
  news: NewsItem[];
  onNewsClick: (item: NewsItem) => void;
  lastElementRef: (node: HTMLDivElement | null) => void;
}

export function NewsGrid({ news, onNewsClick, lastElementRef }: NewsGridProps) {
  if (!news.length) return null;

  // Filter world news
  const worldNews = news.filter(item => item.category_name === 'Svijet').slice(0, 7);
  const worldMainArticle = worldNews[0];
  const worldGridArticles = worldNews.slice(1);

  return (
    <div className="space-y-12">
      {/* Home Hero Section */}
      <HomeHero 
        news={news}
        onNewsClick={onNewsClick}
      />

      {/* World News Section */}
      {worldNews.length > 0 && (
        <WorldNewsSection
          mainArticle={worldMainArticle}
          gridArticles={worldGridArticles}
          onNewsClick={onNewsClick}
          lastElementRef={lastElementRef}
        />
      )}
    </div>
  );
}