import { Helmet } from 'react-helmet';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  type?: 'website' | 'article';
  image?: string;
  publishedTime?: string;
  section?: string;
  keywords?: string[];
  isArticle?: boolean;
}

const DEFAULT_IMAGE = 'https://testara.vercel.app/static/images/default-share.jpg';
const SITE_NAME = 'Brzi.info';
const BASE_URL = 'https://testara.vercel.app';

export function SEO({
  title,
  description,
  canonical,
  type = 'website',
  image = DEFAULT_IMAGE,
  publishedTime,
  section,
  keywords = [],
  isArticle = false
}: SEOProps) {
  const fullTitle = `${title} - ${SITE_NAME}`;
  const url = canonical ? `${BASE_URL}${canonical}` : BASE_URL;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content={SITE_NAME} />

      {/* Keywords */}
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}

      {/* Article Specific Tags */}
      {isArticle && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {isArticle && section && (
        <meta property="article:section" content={section} />
      )}

      {/* Localization */}
      <meta property="og:locale" content="hr_HR" />

      {/* Additional Meta */}
      <meta name="theme-color" content="#8b1852" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    </Helmet>
  );
}