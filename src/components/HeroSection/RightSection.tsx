import React from 'react';
import { Link } from 'react-router-dom';
import { formatTimeAgo } from '../../utils/dateUtils';
import type { Article } from '../../types/Article';

interface RightSectionProps {
  articles: Article[];
}

export function RightSection({ articles }: RightSectionProps) {
  return (
    <div className="lg:col-span-3">
      <div className="bg-white rounded-sm shadow-sm p-3 md:p-4">
        {articles.map((article, index) => (
          <article
            key={article.id}
            className={index < articles.length - 1 ? 'border-b border-gray-100 pb-3 md:pb-4 mb-3 md:mb-4' : ''}
          >
            <Link to={`/article/${article.id}`} className="group block">
              <h3 className="font-semibold text-sm md:text-base mb-2 group-hover:text-primary line-clamp-2">
                {article.title}
              </h3>
              <div className="flex items-center text-xs text-gray-500">
                <span className="text-primary">{article.category_name}</span>
                <span className="mx-2">•</span>
                <time>{formatTimeAgo(article.date_unparsed)}</time>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}