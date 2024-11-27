import React from 'react';
import { Link } from 'react-router-dom';
import { formatTimeAgo } from '../utils/dateUtils';
import { generateArticleUrl, normalizeCategoryName } from '../utils/urlUtils';
import type { Article } from '../types/Article';

interface HealthSectionProps {
  title: string;
  articles: Article[];
}

export function HealthSection({ title, articles }: HealthSectionProps) {
  if (!articles.length) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center mb-8 gap-6">
        <h2 className="text-3xl font-bold text-primary shrink-0">{title}</h2>
        <div className="h-0.5 bg-gray-200 w-full"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
        {articles.map((article) => (
          <article key={article.id} className="bg-white rounded-sm shadow-sm">
            <Link 
              to={generateArticleUrl(article)} 
              className="group block"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-full object-cover"
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
                <p className="text-gray-600 mb-2 text-sm line-clamp-2">
                  {article.summary}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <time>{formatTimeAgo(article.date_unparsed)}</time>
                  <span className="mx-2">•</span>
                  <span className="text-primary">{article.category_name}</span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
      <div className="flex justify-end">
        <Link
          to={`/${normalizeCategoryName(title)}`}
          className="inline-flex items-center text-primary hover:text-secondary font-semibold"
        >
          <span>Vidi više</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}