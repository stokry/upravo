import { forwardRef } from 'react';
import { Card } from '@/components/ui/card';
import type { NewsItem } from '@/types/news';
import { ArticleCard } from './ArticleCard';

interface OtherArticlesProps {
  articles: NewsItem[];
  onNewsClick: (article: NewsItem) => void;
  lastElementRef: (node: HTMLDivElement | null) => void;
}

const LastCard = forwardRef<HTMLDivElement, React.ComponentProps<typeof Card>>(
  (props, ref) => <Card ref={ref} {...props} />
);
LastCard.displayName = 'LastCard';

export function OtherArticles({ articles, onNewsClick, lastElementRef }: OtherArticlesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {articles.map((article: NewsItem, index: number) => (
        index === articles.length - 1 ? (
          <ArticleCard
            key={article.id}
            article={article}
            onClick={() => onNewsClick(article)}
            CardComponent={LastCard}
            ref={lastElementRef}
          />
        ) : (
          <ArticleCard
            key={article.id}
            article={article}
            onClick={() => onNewsClick(article)}
            CardComponent={Card}
          />
        )
      ))}
    </div>
  );
}