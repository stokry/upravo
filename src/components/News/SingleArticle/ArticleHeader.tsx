// components/News/SingleArticle/ArticleHeader.tsx
import { Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { NewsItem } from '@/types/news';
import { getTimeAgo } from '@/utils/date';

interface ArticleHeaderProps {
  article: NewsItem;
  onBack: () => void;
}

export function ArticleHeader({ article, onBack }: ArticleHeaderProps) {
  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Natrag
      </Button>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold leading-tight hidden sm:block">
          {article.title}
        </h1>
        <h1 className="text-2xl font-bold leading-tight sm:hidden">
          {article.title}
        </h1>

        <div className="flex items-center gap-4">
          <Badge variant="secondary">{article.category_name}</Badge>
          <span className="text-sm text-muted-foreground flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {getTimeAgo(article.date_unparsed)}
          </span>
        </div>
      </div>

      <div className="relative w-full aspect-video">
        <img
          src={article.image_url || '/placeholder.svg?height=400&width=800'}
          alt={article.title}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    </div>
  );
}