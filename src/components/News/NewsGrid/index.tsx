// components/News/NewsGrid/index.tsx
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight } from 'lucide-react';
import type { NewsItem } from '@/types/news';
import { getTimeAgo } from '@/utils/date';

interface NewsGridProps {
  news: NewsItem[];
  onNewsClick: (item: NewsItem) => void;
  lastElementRef: (node: HTMLDivElement | null) => void;
}

export function NewsGrid({ news, onNewsClick, lastElementRef }: NewsGridProps) {
  if (!news.length) return null;

  const mainArticle = news[0];
  const topArticles = news.slice(1, 5);
  const otherArticles = news.slice(5);

  return (
    <div className="space-y-6">
      <main className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Featured Article */}
        <div className="col-span-1 lg:col-span-2">
          <Card
            className="cursor-pointer transform transition-all duration-500 hover:shadow-lg border-l-4 border-l-primary group"
            onClick={() => onNewsClick(mainArticle)}
          >
            <CardHeader className="pb-2">
              <div className="flex flex-col justify-between items-start gap-2">
                <div className="space-y-1 w-full">
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                    {mainArticle.title}
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{getTimeAgo(mainArticle.date_unparsed)}</span>
                    </div>
                    <Badge variant="secondary">{mainArticle.category_name}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              <div className="relative w-full h-72 mb-4">
                <img
                  src={mainArticle.image_url || '/placeholder.svg?height=400&width=800'}
                  alt={mainArticle.title}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <p className="text-muted-foreground line-clamp-3">{mainArticle.content}</p>
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
        </div>

        {/* Top Articles Sidebar */}
        <div className="col-span-1 lg:col-span-1 space-y-4">
          {topArticles.map((article) => (
            <Card
              key={article.id}
              className="cursor-pointer transform transition-all duration-500 hover:shadow-lg group"
              onClick={() => onNewsClick(article)}
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
          ))}
        </div>
      </main>

      {/* Other Articles in Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {otherArticles.map((article, index) => (
          <Card
            key={article.id}
            ref={index === otherArticles.length - 1 ? lastElementRef : undefined}
            className="cursor-pointer transform transition-all duration-500 hover:shadow-lg group"
            onClick={() => onNewsClick(article)}
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
              <p className="text-muted-foreground line-clamp-3">{article.content}</p>
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
        ))}
      </div>
    </div>
  );
}

export function NewsGridSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <main className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Article Skeleton */}
        <div className="col-span-1 lg:col-span-2">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <div className="space-y-3">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="flex gap-2">
                  <div className="h-5 bg-muted rounded w-24" />
                  <div className="h-5 bg-muted rounded w-32" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-72 bg-muted rounded mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
                <div className="h-4 bg-muted rounded w-4/6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Articles Skeleton */}
        <div className="col-span-1 lg:col-span-1 space-y-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-muted rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="flex gap-2">
                      <div className="h-4 bg-muted rounded w-20" />
                      <div className="h-4 bg-muted rounded w-24" />
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>

      {/* Other Articles Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="space-y-2">
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="flex gap-2">
                  <div className="h-4 bg-muted rounded w-20" />
                  <div className="h-4 bg-muted rounded w-24" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-muted rounded mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
                <div className="h-4 bg-muted rounded w-4/6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}