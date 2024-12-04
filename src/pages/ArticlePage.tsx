import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LatestNewsSidebar } from '../components/LatestNewsSidebar';
import { fetchArticleBySlug, fetchLatestArticles } from '../utils/api';
import { parseMarkdown } from '../utils/markdown';
import { formatTimeAgo } from '../utils/dateUtils';
import type { Article } from '../types/Article';
import '../styles/article.css';

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        if (!slug) {
          throw new Error('Invalid article URL');
        }

        const [articleData, latestNews] = await Promise.all([
          fetchArticleBySlug(slug),
          fetchLatestArticles(5)
        ]);

        if (!articleData) {
          throw new Error('Article not found');
        }

        setArticle(articleData);
        setLatestArticles(latestNews.filter(news => news.id !== articleData.id));
        setError(null);
      } catch (error) {
        console.error('Error fetching article:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch article');
      } finally {
        setLoading(false);
      }
    }

    loadData();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error: {error || 'Article not found'}</div>
      </div>
    );
  }

  const parsedContent = parseMarkdown(article.content);

  return (
    <main className="py-4 md:py-6 lg:py-8">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Article Content */}
          <div className="flex-grow lg:w-3/4">
            <article className="bg-white rounded-sm shadow-sm overflow-hidden">
              <div className="p-4 md:p-6">
                {/* Article Header */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Link 
                    to={`/${article.category_name.toLowerCase()}`}
                    className="text-primary hover:text-secondary"
                  >
                    {article.category_name}
                  </Link>
                  <span className="mx-2">•</span>
                  <time>{formatTimeAgo(article.date_unparsed)}</time>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                  {article.title}
                </h1>

                {/* Summary */}
                {article.summary && (
                  <p className="text-lg text-gray-600 mb-6">
                    {article.summary}
                  </p>
                )}

                {/* Featured Image */}
                {article.image_url && (
                  <div className="mb-6">
                    <img 
                      src={article.image_url} 
                      alt={article.title}
                      className="w-full rounded-sm"
                    />
                  </div>
                )}

                {/* Article Content */}
                <div 
                  className="article-content prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: parsedContent }}
                />

                {/* Keywords */}
                {article.keywords?.length > 0 && (
                  <div className="mt-8 pt-8 border-t">
                    <div className="flex flex-wrap gap-2">
                      {article.keywords.map((keyword, index) => (
                        <span 
                          key={index}
                          className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/4">
            <LatestNewsSidebar articles={latestArticles} />
          </aside>
        </div>
      </div>
    </main>
  );
}