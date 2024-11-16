import { Card, CardHeader } from '@/components/ui/card';
import type { NewsItem } from '@/types/news';
import { getTimeAgo } from '@/utils/date';

interface LatestNewsListProps {
  articles: NewsItem[];
  onNewsClick: (article: NewsItem) => void;
}

export function LatestNewsList({ articles, onNewsClick }: LatestNewsListProps) {
  return (
    <div className="space-y-4">
      {articles.map(article => (
        <Card
          key={article.id}
          className="cursor-pointer hover:bg-muted/50 transition-all duration-300 group"
          onClick={() => onNewsClick(article)}
        >
          <CardHeader className="p-3 space-y-2">
            <h3 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{article.category_name}</span>
              <span>{getTimeAgo(article.date_unparsed)}</span>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}