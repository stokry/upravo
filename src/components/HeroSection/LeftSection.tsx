import React from 'react';
import { Link } from 'react-router-dom';
import { formatTimeAgo } from '../../utils/dateUtils';
import type { Article } from '../../types/Article';

interface LeftSectionProps {
  articles: Article[];
}

export function LeftSection({ articles }: LeftSectionProps) {
  return (
    <div className="lg:col-span-3">
      {articles.map((article) => (
        <article key={article.id} className="bg-white rounded-sm shadow-sm mb-4 md:mb-6 last:mb-0">
          <Link to={`/article/${article.id}`} className="group">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3 md:p-4">
              <h3 className="font-semibold text-base md:text-lg mb-2 group-hover:text-primary line-clamp-2">
                {article.title}
              </h3>
              <div className="flex items-center text-xs md:text-sm text-gray-500">
                <span className="text-primary">{article.category_name}</span>
                <span className="mx-2">•</span>
                <time>{formatTimeAgo(article.date_unparsed)}</time>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}