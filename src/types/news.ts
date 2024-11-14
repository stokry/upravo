export interface NewsItem {
  id: number;
  post_id: number;
  title: string;
  slug: string; // New field for URL-friendly title
  link: string;
  image_url: string;
  category_name: string;
  category_slug: string; // New field for URL-friendly category
  content: string;
  date_unparsed: string;
}
