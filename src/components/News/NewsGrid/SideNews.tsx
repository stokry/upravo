import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import type { NewsItem } from '@/types/news';
import { getTimeAgo } from '@/utils/date';

interface SideNewsProps {
  articles: NewsItem[];
  onNewsClick: (article: NewsItem) => void;
}

export function SideNews({ articles, onNewsClick }: SideNewsProps) {
  return (
    <div className="space-y-4">
      {articles.map(article => (
        <Card
          key={article.id}
          className="cursor-pointer hover:shadow-md transition-all duration-300 group"
          onClick={() => onNewsClick(article)}
        >
          <CardHeader className="p-3 space-y-3">
            <div className="relative w-full aspect-video">
              <img
                src={article.image_url || '/placeholder.svg?height=200&width=300'}
                alt={article.title}
                className="w-full h-full object-cover rounded"
              />
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-base group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h3>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {article.summary}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{getTimeAgo(article.date_unparsed)}</span>
                </div>
                <Badge variant="secondary">{article.category_name}</Badge>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}