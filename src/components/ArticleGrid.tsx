import React from 'react';
import { ArticleCard } from './ArticleCard';
import type { Article } from '../types/Article';

interface ArticleGridProps {
  articles: Article[];
  featured?: boolean;
}

export function ArticleGrid({ articles, featured = false }: ArticleGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, index) => (
        <ArticleCard
          key={article.id}
          article={article}
          featured={featured && index === 0}
        />
      ))}
    </div>
  );
}