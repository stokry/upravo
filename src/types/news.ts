export interface NewsItem {
  id: number;
  post_id: number;
  title: string;
  link: string;
  image_url: string;
  category_name: string;
  content: string;
  date_unparsed: string;
  slug: string;        
  category_slug: string;  
}

export const PREDEFINED_CATEGORIES = [
  'Vijesti',
  'Svijet',
  'Regija',
  'Crna kronika',
  'Nogomet',
  'Magazin',
  'Lifestyle',
  'Zdravlje'
] as const;

export type CategoryType = typeof PREDEFINED_CATEGORIES[number] | 'Sve';