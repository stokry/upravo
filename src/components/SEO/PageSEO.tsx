import { Helmet } from 'react-helmet-async';
import type { NewsItem } from '@/types/news';
import { createSlug } from '@/utils/seo';

interface PageSEOProps {
  article?: NewsItem | null;
  category?: string;
  baseUrl?: string;
}

export function PageSEO({ article, category, baseUrl = window.location.origin }: PageSEOProps) {
  const getPageTitle = () => {
    if (article) {
      return `${article.title} | Brzi.info`;
    }
    if (category && category !== 'Sve') {
      return `${category} Vijesti | Brzi.info`;
    }
    return 'Brzi.info | Najnovije vijesti';
  };

  const getMetaDescription = () => {
    if (article) {
      return article.meta_description || article.summary || 
        'Pročitajte najnovije vijesti na Brzi.info - vaš izvor za najnovije vijesti iz Hrvatske i svijeta.';
    }
    if (category && category !== 'Sve') {
      return `Najnovije vijesti iz kategorije ${category}. Pratite najnovije vijesti i događanja uživo.`;
    }
    return 'Pratite najnovije vijesti i događanja uživo na Brzi.info - vaš izvor za najnovije vijesti iz Hrvatske i svijeta.';
  };

  const getCurrentUrl = () => {
    if (article) {
      return `${baseUrl}/${createSlug(article.category_name)}/${createSlug(article.title)}`;
    }
    if (category && category !== 'Sve') {
      return `${baseUrl}/${createSlug(category)}`;
    }
    return baseUrl;
  };

  const getKeywords = () => {
    if (article) {
      return article.keywords?.join(', ') || 
        `vijesti, ${article.category_name.toLowerCase()}, hrvatska, novosti`;
    }
    if (category && category !== 'Sve') {
      return `vijesti, ${category.toLowerCase()}, hrvatska, novosti, uživo`;
    }
    return 'vijesti, hrvatska, najnovije vijesti, uživo, novosti, svijet, regija';
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{getPageTitle()}</title>
      <meta name="description" content={getMetaDescription()} />
      <meta name="keywords" content={getKeywords()} />
      <link rel="canonical" href={getCurrentUrl()} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={getPageTitle()} />
      <meta property="og:description" content={getMetaDescription()} />
      <meta property="og:url" content={getCurrentUrl()} />
      <meta property="og:type" content={article ? 'article' : 'website'} />
      {article && (
        <>
          <meta property="og:image" content={article.image_url} />
          <meta property="article:published_time" content={new Date(article.date_unparsed).toISOString()} />
          <meta property="article:section" content={article.category_name} />
          {article.keywords?.map((keyword, index) => (
            <meta key={index} property="article:tag" content={keyword} />
          ))}
        </>
      )}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={getPageTitle()} />
      <meta name="twitter:description" content={getMetaDescription()} />
      {article && <meta name="twitter:image" content={article.image_url} />}

      {/* Article Schema.org Markup */}
      {article && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": article.title,
            "image": [article.image_url],
            "datePublished": new Date(article.date_unparsed).toISOString(),
            "dateModified": new Date(article.date_unparsed).toISOString(),
            "articleSection": article.category_name,
            "keywords": article.keywords,
            "description": article.meta_description || article.summary,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": getCurrentUrl()
            },
            "publisher": {
              "@type": "Organization",
              "name": "Brzi.info",
              "url": baseUrl
            }
          })}
        </script>
      )}
    </Helmet>
  );
}