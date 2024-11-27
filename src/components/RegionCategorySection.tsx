import React from 'react';
import { Link } from 'react-router-dom';
import { formatTimeAgo } from '../utils/dateUtils';
import type { Article } from '../types/Article';

interface RegionCategorySectionProps {
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

export function RegionCategorySection({ title, articles }: RegionCategorySectionProps) {
  if (!articles.length) return null;

  return (
    <div className="mt-8 md:mt-12">
      <div className="flex items-center mb-4 md:mb-8 gap-4 md:gap-6">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary shrink-0">{title}</h2>
        <div className="h-0.5 bg-gray-200 w-full"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-4">
        {articles.map((article) => (
          <article key={article.id} className="bg-white rounded-sm shadow-sm">
            <Link 
              to={`/${article.category_name.toLowerCase()}/${createSlug(article.title, article.id)}`} 
              className="group block"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img 
                  src={article.image_url} 
                  alt={article.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 md:p-4">
                <h3 className="text-base md:text-lg font-semibold mb-2 group-hover:text-primary line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-2 text-xs md:text-sm line-clamp-2">
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
      <div className="flex justify-end mt-4 md:mt-6">
        <Link 
          to={`/${title.toLowerCase()}`}
          className="inline-flex items-center text-primary hover:text-secondary font-semibold text-sm md:text-base"
        >
          <span>Vidi više</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 md:h-5 md:w-5 ml-2" 
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