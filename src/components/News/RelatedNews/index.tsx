// components/News/RelatedNews/index.tsx
import { useEffect } from 'react';
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

  const scrollToTop = () => {
    // Try multiple scroll methods for better compatibility
    try {
      // Method 1: Smooth scroll with window.scrollTo
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      // Method 2: Scroll the documentElement
      document.documentElement.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      // Method 3: Scroll the body
      document.body.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      // Method 4: Fallback to immediate scroll if smooth scroll fails
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    } catch (error) {
      // Final fallback
      window.scrollTo(0, 0);
    }
  };

  const handleArticleClick = (article: NewsItem) => {
    // First scroll attempt
    scrollToTop();

    // Then trigger the article click with a delay
    setTimeout(() => {
      onArticleClick(article);
      
      // Second scroll attempt after content change
      requestAnimationFrame(() => {
        scrollToTop();
        
        // Final scroll check after a short delay
        setTimeout(() => {
          if (window.scrollY > 0) {
            scrollToTop();
          }
        }, 100);
      });
    }, 50);
  };

  // Add scroll to top when component mounts or updates
  useEffect(() => {
    scrollToTop();
  }, [currentArticle.id]);

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
        
        {relatedArticles.map(article => (
          <div
            key={article.id}
            className="group cursor-pointer hover:bg-muted/50 rounded-lg p-2 transition-colors"
            onClick={() => handleArticleClick(article)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleArticleClick(article);
              }
            }}
          >
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
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function RelatedNewsSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-6 w-24 bg-muted rounded" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-6 w-32 bg-muted rounded" />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-20 h-20 bg-muted rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/4" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}