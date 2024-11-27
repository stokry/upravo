import type { Article } from '../types/Article';

function normalizeSpecialCharacters(text: string): string {
  const charMap: { [key: string]: string } = {
    'č': 'c', 'ć': 'c', 'ž': 'z', 'š': 's', 'đ': 'd',
    'dž': 'dz', 'lj': 'lj', 'nj': 'nj',
    'Č': 'c', 'Ć': 'c', 'Ž': 'z', 'Š': 's', 'Đ': 'd',
    'Dž': 'dz', 'DŽ': 'dz', 'Lj': 'lj', 'LJ': 'lj',
    'Nj': 'nj', 'NJ': 'nj'
  };

  return text.replace(/[čćžšđ]|dž|lj|nj/gi, match => charMap[match.toLowerCase()] || match);
}

export function createSlug(text: string): string {
  if (!text) return '';
  
  const normalized = normalizeSpecialCharacters(text);
  return normalized
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateArticleUrl(article: Article): string {
  if (!article?.category_name || !article?.title || !article?.id) {
    console.error('Invalid article data for URL generation:', article);
    return '/';
  }

  const categorySlug = createSlug(article.category_name);
  const titleSlug = createSlug(article.title);
  
  // Ensure we have valid slugs
  if (!categorySlug || !titleSlug) {
    console.error('Invalid slugs generated:', { categorySlug, titleSlug });
    return '/';
  }

  return `/${categorySlug}/${titleSlug}-${article.id}`;
}

export function extractIdFromSlug(slug: string): number | null {
  if (!slug) return null;

  try {
    const match = slug.match(/-(\d+)$/);
    if (!match) return null;

    const id = parseInt(match[1], 10);
    return isNaN(id) ? null : id;
  } catch (error) {
    console.error('Error extracting ID from slug:', error);
    return null;
  }
}

export function normalizeCategoryName(category: string): string {
  if (!category) return '';
  
  // First normalize special characters
  const normalized = normalizeSpecialCharacters(category);
  
  // Convert to lowercase and trim
  return normalized.toLowerCase().trim();
}
