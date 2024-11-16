import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import type { NewsItem } from '@/types/news';
import { getTimeAgo } from '@/utils/date';

interface MainNewsProps {
  article: NewsItem;
  onNewsClick: (article: NewsItem) => void;
}

export function MainNews({ article, onNewsClick }: MainNewsProps) {
  return (
    <Card 
      className="cursor-pointer transform transition-all duration-500 hover:shadow-lg group border-b-4 border-b-primary overflow-hidden"
      onClick={() => onNewsClick(article)}
    >
      <div className="relative w-full aspect-video">
        <img
          src={article.image_url || '/placeholder.svg?height=400&width=800'}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge 
          variant="secondary" 
          className="absolute top-4 left-4 bg-white/90"
        >
          {article.category_name}
        </Badge>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          <CardTitle className="text-2xl md:text-3xl group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </CardTitle>

          <p className="text-muted-foreground line-clamp-3">
            {article.summary || article.content.replace(/#{1,6}\s[^\n]+/g, '').trim()}
          </p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{getTimeAgo(article.date_unparsed)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}