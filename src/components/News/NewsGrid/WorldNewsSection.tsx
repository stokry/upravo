import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import type { NewsItem } from '@/types/news';
import { getTimeAgo } from '@/utils/date';

interface WorldNewsSectionProps {
  mainArticle: NewsItem;
  gridArticles: NewsItem[];
  onNewsClick: (article: NewsItem) => void;
  lastElementRef?: (node: HTMLDivElement | null) => void;
}

export function WorldNewsSection({ 
  mainArticle, 
  gridArticles, 
  onNewsClick,
  lastElementRef 
}: WorldNewsSectionProps) {
  // Split grid articles into different sections
  const [featuredArticle, ...otherArticles] = gridArticles;
  const textOnlyArticles = otherArticles.slice(0, 2);
  const bottomGridArticles = otherArticles.slice(2, 5);

  return (
    <section>
      {/* Section Separator */}
      <div className="border-t border-border my-8" />

      {/* Section Header */}
      <h2 className="text-2xl font-bold mb-6">Svijet</h2>

      <div className="space-y-8">
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Article */}
          <div className="lg:col-span-8">
            <Card 
              className="cursor-pointer group overflow-hidden"
              onClick={() => onNewsClick(mainArticle)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col-reverse lg:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Badge variant="secondary">
                        {mainArticle.category_name}
                      </Badge>
                      <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                        {mainArticle.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground line-clamp-3">
                      {mainArticle.summary}
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {getTimeAgo(mainArticle.date_unparsed)}
                    </div>
                  </div>
                  <div className="lg:w-[300px] aspect-video lg:aspect-square flex-shrink-0">
                    <img
                      src={mainArticle.image_url || '/placeholder.svg?height=300&width=300'}
                      alt={mainArticle.title}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Featured Side Article */}
          <div className="lg:col-span-4">
            <Card 
              className="cursor-pointer group h-full"
              onClick={() => onNewsClick(featuredArticle)}
            >
              <CardContent className="p-4 space-y-4">
                <div className="aspect-video">
                  <img
                    src={featuredArticle.image_url || '/placeholder.svg?height=200&width=300'}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="space-y-3">
                  <h3 className="font-bold group-hover:text-primary transition-colors">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {featuredArticle.summary}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {getTimeAgo(featuredArticle.date_unparsed)}
                    </div>
                    <Badge variant="secondary">{featuredArticle.category_name}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Text-Only Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {textOnlyArticles.map(article => (
            <Card
              key={article.id}
              className="cursor-pointer group"
              onClick={() => onNewsClick(article)}
            >
              <CardContent className="p-4 space-y-3">
                <h3 className="font-bold group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {article.summary}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {getTimeAgo(article.date_unparsed)}
                  </div>
                  <Badge variant="secondary">{article.category_name}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Grid Articles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bottomGridArticles.map((article, index) => (
            <Card
              key={article.id}
              ref={index === bottomGridArticles.length - 1 ? lastElementRef : undefined}
              className="cursor-pointer group"
              onClick={() => onNewsClick(article)}
            >
              <CardContent className="p-4 space-y-4">
                <div className="aspect-video">
                  <img
                    src={article.image_url || '/placeholder.svg?height=200&width=300'}
                    alt={article.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="space-y-3">
                  <h3 className="font-bold group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {article.summary}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {getTimeAgo(article.date_unparsed)}
                    </div>
                    <Badge variant="secondary">{article.category_name}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}