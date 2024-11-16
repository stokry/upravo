import { forwardRef } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight } from 'lucide-react';
import type { NewsItem } from '@/types/news';
import { getTimeAgo } from '@/utils/date';

interface ArticleCardProps {
  article: NewsItem;
  onClick: () => void;
  CardComponent?: typeof Card;
}

export const ArticleCard = forwardRef<HTMLDivElement, ArticleCardProps>(
  ({ article, onClick, CardComponent = Card }, ref) => {
    const previewContent = (article: NewsItem): string => {
      return article.summary || article.content.replace(/#{1,6}\s[^\n]+/g, '').trim();
    };

    return (
      <CardComponent
        ref={ref}
        className="cursor-pointer transform transition-all duration-500 hover:shadow-lg group"
        onClick={onClick}
      >
        <CardHeader className="pb-2">
          <div className="space-y-1">
            <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{getTimeAgo(article.date_unparsed)}</span>
              </div>
              <Badge variant="secondary">{article.category_name}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow">
          <div className="relative w-full h-48 mb-4">
            <img
              src={article.image_url || '/placeholder.svg?height=300&width=400'}
              alt={article.title}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
          <p className="text-muted-foreground line-clamp-3">
            {previewContent(article)}
          </p>
        </CardContent>
        <CardFooter>
          <Button
            variant="ghost"
            className="ml-auto group-hover:translate-x-1 transition-transform duration-200"
          >
            Pročitaj više
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </CardComponent>
    );
  }
);

ArticleCard.displayName = 'ArticleCard';