import React from 'react';
import { Link } from 'react-router-dom';
import { formatTimeAgo } from '../../utils/dateUtils';
import { generateArticleUrl } from '../../utils/urlUtils';
import { useLatestNews } from '../../hooks/useLatestNews';
import type { Article } from '../../types/Article';

interface CenterSectionProps {
  mainArticle: Article;
  bulletArticles: Article[];
}

export function CenterSection({ mainArticle: initialArticle, bulletArticles }: CenterSectionProps) {
  const { article: latestArticle, loading, error } = useLatestNews();

  // Use latest article if available, otherwise fall back to initial article
  const displayMainArticle = latestArticle || initialArticle;

  if (!displayMainArticle) return null;

  return (
    <div className="lg:col-span-6">
      <article className="bg-white rounded-sm shadow-sm mb-4 md:mb-6">
        <Link 
          to={generateArticleUrl(displayMainArticle)} 
          className="group block p-3 md:p-4"
        >
          <div className="flex items-center text-xs md:text-sm text-gray-500 mb-2">
            <span className="bg-primary text-white px-2 py-1 rounded-sm text-xs">
              Najnovije
            </span>
            <span className="mx-2">•</span>
            <time>{formatTimeAgo(displayMainArticle.date_unparsed)}</time>
          </div>
          <h2 className="font-bold text-xl md:text-2xl mb-2 md:mb-3 group-hover:text-primary">
            {displayMainArticle.title}
          </h2>
          <p className="text-gray-600 text-sm md:text-base mb-2 md:mb-3 line-clamp-2 md:line-clamp-3">
            {displayMainArticle.summary}
          </p>
          <div className="flex items-center text-xs md:text-sm text-gray-500">
            <span className="text-primary">{displayMainArticle.category_name}</span>
            <span className="mx-2">•</span>
            <time>{formatTimeAgo(displayMainArticle.date_unparsed)}</time>
          </div>
        </Link>
      </article>

      {/* Bullet Articles */}
      <div className="bg-white rounded-sm shadow-sm p-3 md:p-4">
        {bulletArticles.map((article, index) => (
          <article
            key={article.id}
            className={index < bulletArticles.length - 1 ? 'border-b border-gray-100 pb-3 md:pb-4 mb-3 md:mb-4' : ''}
          >
            <Link 
              to={generateArticleUrl(article)} 
              className="group"
            >
              <h3 className="font-semibold text-sm md:text-base group-hover:text-primary line-clamp-2">
                {article.title}
              </h3>
              <div className="flex items-center text-xs md:text-sm text-gray-500 mt-2">
                <span className="text-primary">{article.category_name}</span>
                <span className="mx-2">•</span>
                <time>{formatTimeAgo(article.date_unparsed)}</time>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {loading && (
        <div className="absolute top-0 right-0 p-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}