import { MainNews } from '../NewsGrid/MainNews';
import { SideNews } from '../NewsGrid/SideNews';
import { LatestNewsList } from '../NewsGrid/LatestNewsList';
import { BulletNewsList } from '../NewsGrid/BulletNewsList';
import type { NewsItem } from '@/types/news';

interface HomeHeroProps {
  news: NewsItem[];
  onNewsClick: (item: NewsItem) => void;
}

export function HomeHero({ news, onNewsClick }: HomeHeroProps) {
  if (!news.length) return null;

  const mainArticle = news[0];
  const leftArticles = news.slice(1, 3); // Two articles for left side
  const rightArticles = news.slice(3, 7); // Four articles for right side list
  const bulletArticles = news.slice(7, 9); // Two bullet articles below main content

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Side Articles */}
      <div className="lg:col-span-3">
        <SideNews 
          articles={leftArticles}
          onNewsClick={onNewsClick}
        />
      </div>

      {/* Main Article */}
      <div className="lg:col-span-6">
        <MainNews 
          article={mainArticle}
          onNewsClick={onNewsClick}
        />
        {/* Bullet News List */}
        <div className="mt-6">
          <BulletNewsList 
            articles={bulletArticles}
            onNewsClick={onNewsClick}
          />
        </div>
      </div>

      {/* Right Side List */}
      <div className="lg:col-span-3">
        <LatestNewsList 
          articles={rightArticles}
          onNewsClick={onNewsClick}
        />
      </div>
    </div>
  );
}