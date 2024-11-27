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
const DEFAULT_IMAGE = 'https://brzi.info/default-share.jpg'; // Update with your default image

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
  // Ensure image URL is absolute
  const fullImageUrl = image ? (image.startsWith('http') ? image : `${BASE_URL}${image}`) : DEFAULT_IMAGE;
  
  // Ensure canonical URL is absolute
  const fullCanonicalUrl = canonical ? `${BASE_URL}${canonical}` : BASE_URL;
  
  // Create full title with site name
  const fullTitle = `${title} - ${SITE_NAME}`;

  return (
    <Helmet>
      {/* Force update meta tags */}
      <meta charSet="utf-8" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={isArticle ? 'article' : type} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@brzi_info" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:url" content={fullCanonicalUrl} />

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
      
      {/* Keywords */}
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}

      {/* Preconnect to your image domain */}
      <link rel="preconnect" href={new URL(fullImageUrl).origin} />
    </Helmet>
  );
}