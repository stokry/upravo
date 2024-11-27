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

const DEFAULT_IMAGE = 'https://testara.vercel.app/static/images/default-share.jpg';
const SITE_NAME = 'Brzi.info';
const BASE_URL = 'https://brzi.info';

export function SEO({
  title,
  description,
  canonical,
  type = 'website',
  image = DEFAULT_IMAGE,
  publishedTime,
  section = 'Vijesti',
  keywords = [],
  isArticle = true
}: SEOProps) {
  const fullTitle = `${title} - ${SITE_NAME}`;
  const url = canonical ? `${BASE_URL}${canonical}` : BASE_URL;

  // Ensure image URL is absolute
  const fullImageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`;

  return (
    <Helmet>
      {/* Force page reload for metadata update */}
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={isArticle ? 'article' : type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Additional SEO Tags */}
      <meta name="robots" content="max-image-preview:large" />
      <meta name="author" content={SITE_NAME} />

      {/* Keywords */}
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}

      {/* Article Specific Tags */}
      {isArticle && publishedTime && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          <meta property="article:modified_time" content={publishedTime} />
          <meta property="article:section" content={section} />
          <meta property="article:publisher" content={BASE_URL} />
        </>
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