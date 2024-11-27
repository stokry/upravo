import React from 'react';
import { Link } from 'react-router-dom';
import { formatTimeAgo } from '../utils/dateUtils';
import type { Article } from '../types/Article';

interface NumberedNewsSectionProps {
  title: string;
  articles: Article[];
}

// Helper function to create URL-friendly slug
function createSlug(title: string, id: number | string): string {
  return `${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}-${id}`;
}

export function NumberedNewsSection({ title, articles }: NumberedNewsSectionProps) {
  if (!articles.length) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center mb-8 gap-6">
        <h2 className="text-3xl font-bold text-primary shrink-0">{title}</h2>
        <div className="h-0.5 bg-gray-200 w-full"></div>
      </div>
      <div className="mb-4">
        {articles.map((article, index) => (
          <div key={article.id} className="flex items-start gap-4 mb-6 last:mb-0">
            <div className="text-4xl font-bold text-gray-200 leading-none">
              {index + 1}
            </div>
            <Link 
              to={`/${article.category_name.toLowerCase()}/${createSlug(article.title, article.id)}`} 
              className="group flex-1"
            >
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg md:text-xl group-hover:text-primary">
                  {article.title}
                </h3>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <time>{formatTimeAgo(article.date_unparsed)}</time>
                <span className="mx-2">•</span>
                <span className="text-primary">{article.category_name}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Link 
          to={`/${title.toLowerCase()}`}
          className="inline-flex items-center text-primary hover:text-secondary font-semibold"
        >
          <span>Više iz kategorije {title}</span>
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