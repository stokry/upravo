import React from 'react';
import { Link } from 'react-router-dom';
import { formatTimeAgo } from '../utils/dateUtils';
import { generateArticleUrl } from '../utils/urlUtils';
import type { Article } from '../types/Article';

interface CategoryArticleGridProps {
  articles: Article[];
}

export function CategoryArticleGrid({ articles }: CategoryArticleGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, index) => (
        <article
          key={`${article.id}-${index}`}
          className="bg-white rounded-sm shadow-sm"
        >
          <Link to={generateArticleUrl(article)} className="group block">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-image.jpg';
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary line-clamp-2">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {article.summary}
              </p>
              <time className="text-sm text-gray-500">
                {formatTimeAgo(article.date_unparsed)}
              </time>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}