import { CategoryType, PREDEFINED_CATEGORIES } from '@/types/news';
import { createSlug } from './seo';

export function getCategoryFromSlug(slug: string): CategoryType | null {
  if (!slug) return 'Sve';
  const exactMatch = PREDEFINED_CATEGORIES.find(
    cat => createSlug(cat) === slug
  );
  return exactMatch || null;
}