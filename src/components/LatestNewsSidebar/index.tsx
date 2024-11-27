import React from 'react';
import { Link } from 'react-router-dom';
import { formatTimeAgo } from '../../utils/dateUtils';
import { generateArticleUrl } from '../../utils/urlUtils';
import type { Article } from '../../types/Article';

interface LatestNewsSidebarProps {
  articles: Article[];
}

export function LatestNewsSidebar({ articles }: LatestNewsSidebarProps) {
  if (!articles.length) return null;

  return (
    <div className="bg-white rounded-sm shadow-sm p-4">
      <h2 className="text-xl font-bold mb-4 text-primary">Zadnje novosti</h2>
      <div className="space-y-4">
        {articles.map((article) => (
          <article key={article.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
            <Link to={generateArticleUrl(article)} className="group block">
              <h3 className="font-semibold text-base mb-2 group-hover:text-primary line-clamp-2">
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