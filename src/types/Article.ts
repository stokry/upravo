export interface Article {
  id: number;
  post_id: number;
  title: string;
  link: string;
  image_url: string;
  category_name: string;
  content: string;
  date_unparsed: string;
  summary: string;
  keywords: string[];
  meta_description: string;
}