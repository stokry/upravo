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
    <Helmet prioritizeSeoTags>
      {/* Force meta tags refresh */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} key="title" />
      <meta name="description" content={description} key="description" />
      <link rel="canonical" href={fullCanonicalUrl} key="canonical" />

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content={SITE_NAME} key="og:site_name" />
      <meta property="og:type" content={isArticle ? 'article' : type} key="og:type" />
      <meta property="og:url" content={fullCanonicalUrl} key="og:url" />
      <meta property="og:title" content={fullTitle} key="og:title" />
      <meta property="og:description" content={description} key="og:description" />
      <meta property="og:image" content={fullImageUrl} key="og:image" />
      <meta property="og:image:width" content="1200" key="og:image:width" />
      <meta property="og:image:height" content="630" key="og:image:height" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
      <meta name="twitter:site" content="@brzi_info" key="twitter:site" />
      <meta name="twitter:url" content={fullCanonicalUrl} key="twitter:url" />
      <meta name="twitter:title" content={fullTitle} key="twitter:title" />
      <meta name="twitter:description" content={description} key="twitter:description" />
      <meta name="twitter:image" content={fullImageUrl} key="twitter:image" />

      {/* Article Specific Tags */}
      {isArticle && publishedTime && (
        <>
          <meta property="article:published_time" content={publishedTime} key="article:published_time" />
          <meta property="article:modified_time" content={publishedTime} key="article:modified_time" />
          <meta property="article:section" content={section} key="article:section" />
          <meta property="article:publisher" content={BASE_URL} key="article:publisher" />
        </>
      )}

      {/* Localization */}
      <meta property="og:locale" content="hr_HR" key="og:locale" />
      <html lang="hr" />

      {/* Keywords */}
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} key="keywords" />
      )}

      {/* Additional Meta */}
      <meta name="theme-color" content="#8b1852" key="theme-color" />
      <meta name="mobile-web-app-capable" content="yes" key="mobile-web-app-capable" />
      <meta name="apple-mobile-web-app-capable" content="yes" key="apple-mobile-web-app-capable" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" key="apple-mobile-web-app-status-bar-style" />
      <meta name="robots" content="index, follow, max-image-preview:large" key="robots" />
    </Helmet>
  );
}