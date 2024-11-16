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
  // Split grid articles for different sections
  const [sideArticle, ...remainingArticles] = gridArticles;
  const textOnlyArticles = remainingArticles.slice(0, 2);
  const bottomGridArticles = remainingArticles.slice(2, 4);

  return (
    <section className="mt-12">
      {/* Section Separator */}
      <div className="border-t-2 border-brand" />
      
      {/* Section Title */}
      <h2 className="text-2xl font-bold mt-6 mb-6">Svijet</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Article with text left, image right */}
          <Card 
            className="cursor-pointer hover:shadow-md transition-all duration-200 group"
            onClick={() => onNewsClick(mainArticle)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Badge variant="secondary">{mainArticle.category_name}</Badge>
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
                <div className="md:w-[300px] flex-shrink-0">
                  <img
                    src={mainArticle.image_url || '/placeholder.svg?height=300&width=300'}
                    alt={mainArticle.title}
                    className="w-full aspect-[4/3] object-cover rounded-md"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Two Articles Grid Below Main Article */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bottomGridArticles.map((article, index) => (
              <Card
                key={article.id}
                ref={index === bottomGridArticles.length - 1 ? lastElementRef : undefined}
                className="cursor-pointer hover:shadow-md transition-all duration-200 group"
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
                    <h3 className="font-bold group-hover:text-primary transition-colors line-clamp-2">
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

        {/* Right Side Column (1/3 width) */}
        <div className="space-y-6">
          {/* Featured Article with Image */}
          <Card 
            className="cursor-pointer hover:shadow-md transition-all duration-200 group"
            onClick={() => onNewsClick(sideArticle)}
          >
            <CardContent className="p-4 space-y-4">
              <div className="aspect-video">
                <img
                  src={sideArticle.image_url || '/placeholder.svg?height=200&width=300'}
                  alt={sideArticle.title}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="space-y-3">
                <h3 className="font-bold group-hover:text-primary transition-colors line-clamp-2">
                  {sideArticle.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {sideArticle.summary}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {getTimeAgo(sideArticle.date_unparsed)}
                  </div>
                  <Badge variant="secondary">{sideArticle.category_name}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Two Articles without Images */}
          <div className="space-y-4">
            {textOnlyArticles.map(article => (
              <Card
                key={article.id}
                className="cursor-pointer hover:bg-muted/50 transition-all duration-200 group"
                onClick={() => onNewsClick(article)}
              >
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-bold group-hover:text-primary transition-colors line-clamp-2">
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
        </div>
      </div>
    </section>
  );
}