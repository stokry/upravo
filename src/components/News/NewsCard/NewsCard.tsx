// components/News/NewsCard/index.tsx
import { forwardRef } from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { NewsItem } from '@/types/news';
import { getTimeAgo } from '@/utils/date';

interface NewsCardProps {
  article: NewsItem;
  onClick: () => void;
  isMain?: boolean;
}

export const NewsCard = forwardRef<HTMLDivElement, NewsCardProps>(
  ({ article, onClick, isMain = false }, ref) => {
    const previewSummary = article.summary || article.content.replace(/#{1,6}\s[^\n]+/g, '').trim();

    if (isMain) {
      return (
        <Card
          ref={ref}
          className="cursor-pointer transform transition-all duration-500 hover:shadow-lg border-l-4 border-l-primary group"
          onClick={onClick}
        >
          <CardHeader className="pb-2">
            <div className="flex flex-col justify-between items-start gap-2">
              <div className="space-y-1 w-full">
                <CardTitle className="text-2xl group-hover:text-primary transition-colors">
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
            </div>
          </CardHeader>
          <CardContent className="flex flex-col flex-grow">
            <div className="relative w-full h-72 mb-4">
              <img
                src={article.image_url || '/placeholder.svg?height=400&width=800'}
                alt={article.title}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <p className="text-muted-foreground line-clamp-3">{previewSummary}</p>
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
        </Card>
      );
    }

    return (
      <Card
        ref={ref}
        className="cursor-pointer transform transition-all duration-500 hover:shadow-lg group"
        onClick={onClick}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start gap-4">
            <div className="relative w-24 h-24 flex-shrink-0">
              <img
                src={article.image_url || '/placeholder.svg?height=100&width=100'}
                alt={article.title}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <div className="space-y-1 flex-grow">
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
          </div>
        </CardHeader>
      </Card>
    );
  }
);

NewsCard.displayName = 'NewsCard';