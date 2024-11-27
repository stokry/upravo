import React from 'react';
import { Link } from 'react-router-dom';
import { formatTimeAgo } from '../utils/dateUtils';
import { generateArticleUrl } from '../utils/urlUtils';
import type { Article } from '../types/Article';

interface HeroSectionProps {
  articles: Article[];
}

export function HeroSection({ articles }: HeroSectionProps) {
  if (!articles.length) return null;

  const leftArticles = articles.slice(0, 2);
  const mainArticle = articles[2];
  const centerBulletArticles = articles.slice(3, 5);
  const rightArticles = articles.slice(5, 10);

  return (
    <div className="container-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Left Section */}
        <div className="lg:col-span-3">
          {leftArticles.map((article) => (
            <article key={article.id} className="bg-white rounded-sm shadow-sm mb-4 md:mb-6 last:mb-0">
              <Link to={generateArticleUrl(article)} className="group">
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

        {/* Center Section */}
        <div className="lg:col-span-6">
          {mainArticle && (
            <article className="bg-white rounded-sm shadow-sm mb-4 md:mb-6">
              <Link to={generateArticleUrl(mainArticle)} className="group">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={mainArticle.image_url}
                    alt={mainArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 md:p-4">
                  <h2 className="font-bold text-xl md:text-2xl mb-2 md:mb-3 group-hover:text-primary">
                    {mainArticle.title}
                  </h2>
                  <p className="text-gray-600 text-sm md:text-base mb-2 md:mb-3 line-clamp-2 md:line-clamp-3">
                    {mainArticle.summary}
                  </p>
                  <div className="flex items-center text-xs md:text-sm text-gray-500">
                    <span className="text-primary">{mainArticle.category_name}</span>
                    <span className="mx-2">•</span>
                    <time>{formatTimeAgo(mainArticle.date_unparsed)}</time>
                  </div>
                </div>
              </Link>
            </article>
          )}

          {/* Bullet Points */}
          <div className="bg-white rounded-sm shadow-sm p-3 md:p-4">
            {centerBulletArticles.map((article, index) => (
              <article
                key={article.id}
                className={index === 0 ? 'border-b border-gray-100 pb-3 md:pb-4 mb-3 md:mb-4' : ''}
              >
                <Link to={generateArticleUrl(article)} className="group">
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
        </div>

        {/* Right Section */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-sm shadow-sm p-3 md:p-4">
            {rightArticles.map((article, index) => (
              <article
                key={article.id}
                className={index < rightArticles.length - 1 ? 'border-b border-gray-100 pb-3 md:pb-4 mb-3 md:mb-4' : ''}
              >
                <Link to={generateArticleUrl(article)} className="group block">
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
      </div>
    </div>
  );
}