// components/News/RelatedNews/index.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { getTimeAgo } from '@/utils/date';
import type { NewsItem } from '@/types/news';

interface RelatedNewsProps {
  currentArticle: NewsItem;
  newsItems: NewsItem[];
  onArticleClick: (article: NewsItem) => void;
}

export function RelatedNews({ 
  currentArticle, 
  newsItems, 
  onArticleClick 
}: RelatedNewsProps) {
  const relatedArticles = newsItems
    .filter(item => 
      item.id !== currentArticle.id && 
      item.category_name === currentArticle.category_name
    )
    .slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vidi još</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentArticle.category_name && (
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">
              Zadnje iz {currentArticle.category_name}
            </Badge>
          </div>
        )}
        
        <div className="space-y-2">
          {relatedArticles.map(article => (
            <Card
              key={article.id}
              onClick={() => onArticleClick(article)}
              className="cursor-pointer hover:bg-muted/50 transition-all duration-200 hover:shadow-md group"
            >
              <CardContent className="p-3">
                <div className="flex gap-3">
                  <img
                    src={article.image_url || '/placeholder.svg?height=100&width=100'}
                    alt={article.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{getTimeAgo(article.date_unparsed)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function RelatedNewsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-24 bg-muted rounded" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-6 w-32 bg-muted rounded" />
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-3">
                <div className="flex gap-3">
                  <div className="w-20 h-20 bg-muted rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}