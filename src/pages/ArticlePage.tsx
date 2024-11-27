import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { SEO } from '../components/SEO';
import { LatestNewsSidebar } from '../components/LatestNewsSidebar';
import { fetchArticleBySlug, fetchLatestArticles } from '../utils/api';
import { parseMarkdown } from '../utils/markdown';
import { formatTimeAgo } from '../utils/dateUtils';
import type { Article } from '../types/Article';
import '../styles/article.css';

// Add structured data for articles
const createArticleStructuredData = (article: Article) => ({
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": article.title,
  "description": article.summary || article.meta_description,
  "image": [article.image_url],
  "datePublished": article.date_unparsed,
  "dateModified": article.date_unparsed,
  "author": [{
    "@type": "Organization",
    "name": "Brzi.info",
    "url": "https://brzi.info"
  }],
  "publisher": {
    "@type": "Organization",
    "name": "Brzi.info",
    "logo": {
      "@type": "ImageObject",
      "url": "https://brzi.info/logo.png" // Update with your actual logo URL
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://brzi.info/${article.category_name.toLowerCase()}/${article.slug}`
  }
});

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
  const fullUrl = `https://brzi.info/${article.category_name.toLowerCase()}/${slug}`;

  return (
    <main className="py-4 md:py-6 lg:py-8">
      <SEO 
        title={article.title}
        description={article.summary || article.meta_description || ''}
        canonical={`/${article.category_name.toLowerCase()}/${slug}`}
        type="article"
        image={article.image_url}
        publishedTime={article.date_unparsed}
        section={article.category_name}
        keywords={article.keywords}
        isArticle={true}
      />
      
      {/* Additional meta tags for better SEO */}
      <Helmet>
        <link rel="alternate" hrefLang="hr" href={fullUrl} />
        <meta property="article:author" content="https://brzi.info" />
        <meta property="article:publisher" content="https://brzi.info" />
        <script type="application/ld+json">
          {JSON.stringify(createArticleStructuredData(article))}
        </script>
      </Helmet>

      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Article Content */}
          <div className="flex-grow lg:w-3/4">
            <article className="bg-white rounded-sm shadow-sm overflow-hidden" itemScope itemType="https://schema.org/NewsArticle">
              <div className="p-4 md:p-6">
                {/* Article Header */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Link 
                    to={`/${article.category_name.toLowerCase()}`}
                    className="text-primary hover:text-secondary"
                  >
                    <span itemProp="articleSection">{article.category_name}</span>
                  </Link>
                  <span className="mx-2">•</span>
                  <time itemProp="datePublished" dateTime={article.date_unparsed}>
                    {formatTimeAgo(article.date_unparsed)}
                  </time>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4" itemProp="headline">
                  {article.title}
                </h1>

                {/* Summary */}
                {article.summary && (
                  <p className="text-lg text-gray-600 mb-6" itemProp="description">
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
                      itemProp="image"
                    />
                  </div>
                )}

                {/* Article Content */}
                <div 
                  className="article-content prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: parsedContent }}
                  itemProp="articleBody"
                />

                {/* Keywords */}
                {article.keywords?.length > 0 && (
                  <div className="mt-8 pt-8 border-t">
                    <div className="flex flex-wrap gap-2">
                      {article.keywords.map((keyword, index) => (
                        <span 
                          key={index}
                          className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                          itemProp="keywords"
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