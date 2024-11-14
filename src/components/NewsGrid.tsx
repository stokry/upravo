import { Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NewsItem } from '@/types/news';
import { getTimeAgo } from '@/utils/date';

interface NewsGridProps {
  news: NewsItem[];
  onNewsClick: (item: NewsItem) => void;
  lastElementRef: (node: any) => void;
}

export default function NewsGrid({ news, onNewsClick, lastElementRef }: NewsGridProps) {
  const mainArticle = news[0];
  const otherArticles = news.slice(1);

  if (!mainArticle) return null;
  const handleArticleClick = (article: NewsItem) => {
    // Scroll to top before handling the click
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNewsClick(article);
  };


  return (
    <div className="space-y-6">
      <main className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Article */}
        <div className="col-span-1 lg:col-span-2">
          <Card
            className="cursor-pointer transform transition-all duration-500 hover:shadow-lg border-l-4 border-l-primary group"
            onClick={() => handleArticleClick(mainArticle)}
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

        {/* 3 Latest Articles */}
        <div className="col-span-1 lg:col-span-1 space-y-4">
          {otherArticles.slice(0, 4).map((article) => (
            <Card
              key={article.id}
              className="cursor-pointer transform transition-all duration-500 hover:shadow-lg group"
              onClick={() => handleArticleClick(mainArticle)}
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
      {/* Other Articles in Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {otherArticles.map((article, index) => (
          <Card
            key={article.id}
            className="cursor-pointer transform transition-all duration-500 hover:shadow-lg group"
            onClick={() => handleArticleClick(mainArticle)}
            ref={index === otherArticles.length - 1 ? lastElementRef : null}
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
