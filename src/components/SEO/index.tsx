import React from 'react';
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

const BASE_URL = 'https://brzi.info';
const SITE_NAME = 'Brzi.info';
const DEFAULT_IMAGE = 'https://brzi.info/static/images/default-share.jpg';

export function SEO({
  title,
  description,
  canonical,
  type = 'article',
  image,
  publishedTime,
  section,
  keywords = [],
  isArticle = true
}: SEOProps) {
  const fullImageUrl = image ? (image.startsWith('http') ? image : `${BASE_URL}${image}`) : DEFAULT_IMAGE;
  const fullCanonicalUrl = canonical ? `${BASE_URL}${canonical}` : BASE_URL;
  const fullTitle = isArticle ? `${title} - ${SITE_NAME}` : title;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="hr_HR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullCanonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Article Specific Meta Tags */}
      {isArticle && publishedTime && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          {section && <meta property="article:section" content={section} />}
          {keywords.map((keyword, index) => (
            <meta key={`keyword-${index}`} property="article:tag" content={keyword} />
          ))}
        </>
      )}

      {/* Additional Meta Tags */}
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
    </Helmet>
  );
}