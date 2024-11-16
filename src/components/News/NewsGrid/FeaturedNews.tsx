import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import type { NewsItem } from '@/types/news';
import { getTimeAgo } from '@/utils/date';

interface FeaturedNewsProps {
  article: NewsItem;
  onNewsClick: (article: NewsItem) => void;
}

export function FeaturedNews({ article, onNewsClick }: FeaturedNewsProps) {
  return (
    <Card 
      className="cursor-pointer group overflow-hidden h-full"
      onClick={() => onNewsClick(article)}
    >
      <div className="flex flex-col h-full">
        <div className="relative aspect-video">
          <img
            src={article.image_url || '/placeholder.svg?height=300&width=400'}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <CardContent className="flex flex-col flex-grow p-4">
          <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {article.title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {article.summary || article.content.replace(/#{1,6}\s[^\n]+/g, '').trim()}
          </p>

          <div className="flex items-center justify-between mt-auto text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{getTimeAgo(article.date_unparsed)}</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {article.category_name}
            </Badge>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}