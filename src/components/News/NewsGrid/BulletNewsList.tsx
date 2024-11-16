import type { NewsItem } from '@/types/news';

interface BulletNewsListProps {
  articles: NewsItem[];
  onNewsClick: (article: NewsItem) => void;
}

export function BulletNewsList({ articles, onNewsClick }: BulletNewsListProps) {
  return (
    <ul className="space-y-3">
      {articles.map(article => (
        <li 
          key={article.id}
          className="flex items-start space-x-2 cursor-pointer group"
          onClick={() => onNewsClick(article)}
        >
          <span className="text-primary mt-1">•</span>
          <h3 className="text-base font-medium group-hover:text-primary transition-colors">
            {article.title}
          </h3>
        </li>
      ))}
    </ul>
  );
}