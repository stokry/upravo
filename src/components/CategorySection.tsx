import React from 'react';
import { Link } from 'react-router-dom';
import { formatTimeAgo } from '../utils/dateUtils';
import { generateArticleUrl } from '../utils/urlUtils';
import type { Article } from '../types/Article';

interface CategorySectionProps {
  title: string;
  articles: Article[];
}

export function CategorySection({ title, articles }: CategorySectionProps) {
  if (!articles.length) return null;

  return (
    <div className="mt-8 md:mt-12">
      <div className="flex items-center mb-4 md:mb-8 gap-4 md:gap-6">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary shrink-0">{title}</h2>
        <div className="h-0.5 bg-gray-200 w-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        <div className="lg:col-span-8">
          {articles[0] && (
            <article className="bg-white rounded-sm shadow-sm mb-4 md:mb-6">
              <Link to={generateArticleUrl(articles[0])} className="group block">
                <div className="flex flex-col md:grid md:grid-cols-12 md:gap-6">
                  <div className="md:col-span-5 md:order-2">
                    <div className="aspect-w-16 aspect-h-9 md:h-full">
                      <img 
                        src={articles[0].image_url} 
                        alt={articles[0].title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="p-4 md:p-6 md:col-span-7 md:order-1">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4 leading-tight group-hover:text-primary">
                      {articles[0].title}
                    </h3>
                    <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base lg:text-lg line-clamp-3 md:line-clamp-4">
                      {articles[0].summary}
                    </p>
                    <div className="flex items-center text-xs md:text-sm text-gray-500">
                      <time>{formatTimeAgo(articles[0].date_unparsed)}</time>
                      <span className="mx-2">•</span>
                      <span className="text-primary">{articles[0].category_name}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {articles.slice(1, 4).map((article) => (
              <article key={article.id} className="bg-white rounded-sm shadow-sm">
                <Link to={generateArticleUrl(article)} className="group block">
                  <div className="aspect-w-16 aspect-h-9">
                    <img 
                      src={article.image_url} 
                      alt={article.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="text-sm md:text-base font-semibold mb-2 group-hover:text-primary line-clamp-2">
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
        </div>

        <div className="lg:col-span-4">
          {articles[4] && (
            <article className="bg-white rounded-sm shadow-sm mb-4 md:mb-6">
              <Link to={generateArticleUrl(articles[4])} className="group block">
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src={articles[4].image_url} 
                    alt={articles[4].title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="text-sm md:text-base font-semibold mb-2 group-hover:text-primary line-clamp-2">
                    {articles[4].title}
                  </h3>
                  <p className="text-gray-600 mb-2 text-xs md:text-sm line-clamp-2">
                    {articles[4].summary}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <time>{formatTimeAgo(articles[4].date_unparsed)}</time>
                    <span className="mx-2">•</span>
                    <span className="text-primary">{articles[4].category_name}</span>
                  </div>
                </div>
              </Link>
            </article>
          )}

          <div className="bg-white rounded-sm shadow-sm p-3 md:p-4">
            {articles.slice(5).map((article) => (
              <article key={article.id} className="border-b border-gray-100 pb-3 md:pb-4 mb-3 md:mb-4 last:mb-0">
                <Link to={generateArticleUrl(article)} className="group block">
                  <h3 className="text-sm md:text-base font-semibold mb-2 group-hover:text-primary line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500">
                    <time>{formatTimeAgo(article.date_unparsed)}</time>
                    <span className="mx-2">•</span>
                    <span className="text-primary">{article.category_name}</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4 md:mt-6">
        <Link 
          to={`/${title.toLowerCase()}`}
          className="inline-flex items-center text-primary hover:text-secondary font-semibold text-sm md:text-base"
        >
          <span>Vidi više</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
  );
}