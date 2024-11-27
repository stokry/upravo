import React from 'react';
import { Link } from 'react-router-dom';
import { formatTimeAgo } from '../utils/dateUtils';
import { generateArticleUrl } from '../utils/urlUtils';
import type { Article } from '../types/Article';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const articleUrl = generateArticleUrl(article);

  return (
    <article className={`bg-white rounded-sm shadow-sm ${featured ? 'col-span-2 row-span-2' : ''}`}>
      <Link to={articleUrl} className="group block">
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <span className="text-primary">{article.category_name}</span>
            <span className="mx-2">•</span>
            <time>{formatTimeAgo(article.date_unparsed)}</time>
          </div>
          <h2 className={`${featured ? 'text-2xl' : 'text-lg'} font-bold mb-2 line-clamp-2 group-hover:text-primary`}>
            {article.title}
          </h2>
          {article.summary && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {article.summary}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}