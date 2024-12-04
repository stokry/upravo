import { useEffect } from 'react';

interface MetaProps {
  title: string;
  description: string;
  canonical?: string;
  type?: 'website' | 'article';
  image?: string;
  publishedTime?: string;
  section?: string;
  keywords?: string[];
}

const BASE_URL = 'https://brzi.info';
const SITE_NAME = 'Brzi.info';
const DEFAULT_IMAGE = 'https://brzi.info/static/images/default-share.jpg';

export function Meta({
  title,
  description,
  canonical,
  type = 'website',
  image = DEFAULT_IMAGE,
  publishedTime,
  section,
  keywords = []
}: MetaProps) {
  useEffect(() => {
    // Update title
    document.title = `${title} - ${SITE_NAME}`;

    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords.join(', '));

    // Update Open Graph tags
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:type', type);
    updateMetaTag('og:image', image.startsWith('http') ? image : `${BASE_URL}${image}`);
    updateMetaTag('og:url', canonical ? `${BASE_URL}${canonical}` : BASE_URL);
    updateMetaTag('og:site_name', SITE_NAME);

    // Update Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image.startsWith('http') ? image : `${BASE_URL}${image}`);

    // Update article specific tags if type is article
    if (type === 'article') {
      if (publishedTime) {
        updateMetaTag('article:published_time', publishedTime);
      }
      if (section) {
        updateMetaTag('article:section', section);
      }
    }

    // Update canonical link
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', canonical ? `${BASE_URL}${canonical}` : BASE_URL);

    // Cleanup function
    return () => {
      // Remove article specific tags on cleanup if they exist
      if (type === 'article') {
        removeMetaTag('article:published_time');
        removeMetaTag('article:section');
      }
    };
  }, [title, description, canonical, type, image, publishedTime, section, keywords]);

  return null;
}

function updateMetaTag(name: string, content: string) {
  let metaTag = document.querySelector(`meta[${name.startsWith('og:') || name.startsWith('twitter:') ? 'property' : 'name'}="${name}"]`);
  
  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute(name.startsWith('og:') || name.startsWith('twitter:') ? 'property' : 'name', name);
    document.head.appendChild(metaTag);
  }
  
  metaTag.setAttribute('content', content);
}

function removeMetaTag(name: string) {
  const metaTag = document.querySelector(`meta[${name.startsWith('og:') ? 'property' : 'name'}="${name}"]`);
  if (metaTag) {
    metaTag.remove();
  }
}
