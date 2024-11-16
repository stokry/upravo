import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { NewsItem, CategoryType } from '@/types/news';
import { createSlug } from '@/utils/seo';
import { getCategoryFromSlug } from '@/utils/category';

interface UseUrlNavigationProps {
  newsItems: NewsItem[];
  selectedCategory: CategoryType;
  setSelectedCategory: (category: CategoryType) => void;
  setSelectedArticle: (article: NewsItem | null) => void;
  resetNewsData: () => void;
  forceScrollTop: () => void;
}

export function useUrlNavigation({
  newsItems,
  selectedCategory,
  setSelectedCategory,
  setSelectedArticle,
  resetNewsData,
  forceScrollTop
}: UseUrlNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split('/').filter(Boolean);
    
    const loadArticleFromUrl = async () => {
      if (path.length === 2) {
        const categoryName = path[0];
        const articleSlug = path[1];
        
        // First try to find in existing items
        const existingArticle = newsItems.find(item => 
          createSlug(item.category_name) === categoryName && 
          createSlug(item.title) === articleSlug
        );
        
        if (existingArticle) {
          setSelectedArticle(existingArticle);
          setSelectedCategory(existingArticle.category_name as CategoryType);
          forceScrollTop();
          return;
        }
        
        // If not found, fetch from API
        try {
          const baseUrl = import.meta.env.VITE_SUPABASE_URL;
          const apiKey = import.meta.env.VITE_SUPABASE_API_KEY;
          
          const params = new URLSearchParams({ apikey: apiKey });
          const response = await fetch(`${baseUrl}?${params}`);
          if (!response.ok) throw new Error('Failed to fetch news');
          const data = await response.json() as NewsItem[];
          
          const article = data.find(item => 
            createSlug(item.category_name) === categoryName && 
            createSlug(item.title) === articleSlug
          );
          
          if (article) {
            setSelectedArticle(article);
            setSelectedCategory(article.category_name as CategoryType);
            forceScrollTop();
          } else {
            throw new Error('Article not found');
          }
        } catch (err) {
          console.error('Error loading article:', err);
          navigate('/', { replace: true });
        }
      } else if (path.length === 1) {
        const category = getCategoryFromSlug(path[0]);
        if (category && category !== selectedCategory) {
          setSelectedCategory(category);
          setSelectedArticle(null);
          resetNewsData();
          forceScrollTop();
        }
      }
    };
  
    loadArticleFromUrl();
  }, [location.pathname, newsItems, navigate, selectedCategory]);

  return { navigate };
}