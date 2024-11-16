import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


// Components
import { Header } from '@/components/Header/Header';
import { NewsGrid } from '@/components/News/NewsGrid';
import { SingleArticle } from '@/components/News/SingleArticle';
import { PageSEO } from '@/components/SEO/PageSEO';

// Types & Constants
import type { NewsItem, CategoryType } from '@/types/news';
import { PREDEFINED_CATEGORIES } from '@/types/news';

// Utils
import { createSlug } from '@/utils/seo';
import { getCategoryFromSlug } from '@/utils/category';

// Hooks
import { useNewsData } from '@/hooks/useNewsData';
import { useScrollToTop } from '@/hooks/useScrollToTop';

const categories: CategoryType[] = ['Sve', ...PREDEFINED_CATEGORIES];

export default function NewsPortal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { forceScrollTop } = useScrollToTop();
  
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Sve');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  
  const {
    newsItems,
    isLoading,
    error,
    page,
    setPage,
    hasMore,
    fetchNews,
    resetNewsData
  } = useNewsData();

  const handleCategoryChange = (category: CategoryType) => {
    if (category === selectedCategory) return;
    
    setSelectedArticle(null);
    resetNewsData();
    setSelectedCategory(category);

    if (category === 'Sve') {
      navigate('/', { replace: false });
    } else {
      navigate(`/${createSlug(category)}`, { replace: false });
    }
    
    forceScrollTop();
  };

  const handleNewsClick = (article: NewsItem) => {
    const categorySlug = createSlug(article.category_name);
    const titleSlug = createSlug(article.title);
    const newPath = `/${categorySlug}/${titleSlug}`;
    
    setSelectedArticle(article);
    navigate(newPath, { replace: false });
    forceScrollTop();
  };

  const handleBack = () => {
    setSelectedArticle(null);
    if (selectedCategory === 'Sve') {
      navigate('/', { replace: false });
    } else {
      navigate(`/${createSlug(selectedCategory)}`, { replace: false });
    }
    forceScrollTop();
  };

  const lastNewsElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (node) {
      const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prevPage => prevPage + 1);
        }
      });
      observer.observe(node);
      return () => observer.disconnect();
    }
  }, [isLoading, hasMore, setPage]);

  // URL handling effect
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
  }, [location.pathname, newsItems, navigate, selectedCategory, resetNewsData, forceScrollTop]);

  useEffect(() => {
    fetchNews(page, selectedCategory);
  }, [fetchNews, page, selectedCategory]);

  return (
    <>
      <PageSEO 
        article={selectedArticle} 
        category={selectedCategory}
      />

      <div className="min-h-screen bg-background font-sans">
        <div className="max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8">
          <Header 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          <main className="mt-6">
            {isLoading && page === 1 && (
              <p className="text-center">Loading news...</p>
            )}
            
            {error && (
              <p className="text-red-500 text-center">{error}</p>
            )}
            
            {!selectedArticle ? (
              <NewsGrid 
                news={newsItems} 
                onNewsClick={handleNewsClick}
                lastElementRef={lastNewsElementRef}
              />
            ) : (
              <SingleArticle 
                article={selectedArticle} 
                newsItems={newsItems}
                onBack={handleBack}
                onNewsClick={handleNewsClick}
              />
            )}

            {isLoading && page > 1 && (
              <p className="text-center mt-8">Loading more news...</p>
            )}
          </main>
        </div>
      </div>
    </>
  );
}