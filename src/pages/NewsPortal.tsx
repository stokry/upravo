// pages/NewsPortal.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Components
import { Header } from '@/components/Header/Header';
import { NewsGrid } from '@/components/News/NewsGrid';
import { SingleArticle } from '@/components/News/SingleArticle';

// Types & Constants
import type { NewsItem, CategoryType } from '@/types/news';
import { PREDEFINED_CATEGORIES } from '@/types/news';

// Utils
import { createSlug, generateMetaDescription } from '@/utils/seo';
import { getCategoryFromSlug } from '@/utils/category';

const categories: CategoryType[] = ['Sve', ...PREDEFINED_CATEGORIES];

const forceScrollTop = () => {
  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });
};

export default function NewsPortal() {
  const navigate = useNavigate();
  const location = useLocation();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Sve');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadedIds = useRef<Set<number>>(new Set());

  const fetchNews = useCallback(async (pageNumber: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const baseUrl = import.meta.env.VITE_SUPABASE_URL;
      const apiKey = import.meta.env.VITE_SUPABASE_API_KEY;
      
      const params = new URLSearchParams({
        apikey: apiKey,
        order: 'date_unparsed.desc',
        limit: '12',
        offset: ((pageNumber - 1) * 12).toString(),
      });

      if (selectedCategory === 'Sve') {
        const categoriesQuery = PREDEFINED_CATEGORIES.map(cat => `"${cat}"`).join(',');
        params.append('category_name', `in.(${categoriesQuery})`);
      } else {
        params.append('category_name', `eq.${selectedCategory}`);
      }

      const response = await fetch(`${baseUrl}?${params}`);
      if (!response.ok) throw new Error('Failed to fetch news');
      const data = await response.json() as NewsItem[];
      
      const newItems = data.filter(item => 
        !loadedIds.current.has(item.id) && 
        (selectedCategory === 'Sve' ? PREDEFINED_CATEGORIES.includes(item.category_name as typeof PREDEFINED_CATEGORIES[number]) : true)
      );
      
      newItems.forEach(item => loadedIds.current.add(item.id));

      setNewsItems(prevItems => {
        const combinedItems = [...prevItems, ...newItems];
        return combinedItems.sort((a, b) => 
          new Date(b.date_unparsed).getTime() - new Date(a.date_unparsed).getTime()
        );
      });
      
      setHasMore(data.length === 12);
    } catch (err) {
      setError('Failed to load news. Please try again later.');
      console.error('Error fetching news:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  const getPageTitle = useCallback(() => {
    if (selectedArticle) {
      return `${selectedArticle.title} | Brzi.info`;
    }
    if (selectedCategory !== 'Sve') {
      return `${selectedCategory} Vijesti | Brzi.info`;
    }
    return 'Brzi.info | Najnovije vijesti';
  }, [selectedArticle, selectedCategory]);

  const getMetaDescription = useCallback(() => {
    if (selectedArticle) {
      return generateMetaDescription(selectedArticle.content);
    }
    if (selectedCategory !== 'Sve') {
      return `Najnovije vijesti iz kategorije ${selectedCategory}. Pratite najnovije vijesti i događanja uživo.`;
    }
    return 'Pratite najnovije vijesti i događanja uživo na Vijesti Uživo - vaš izvor za najnovije vijesti iz Hrvatske i svijeta.';
  }, [selectedArticle, selectedCategory]);

  const getCurrentUrl = useCallback(() => {
    const baseUrl = window.location.origin;
    if (selectedArticle) {
      return `${baseUrl}/${createSlug(selectedArticle.category_name)}/${createSlug(selectedArticle.title)}`;
    }
    if (selectedCategory !== 'Sve') {
      return `${baseUrl}/${createSlug(selectedCategory)}`;
    }
    return baseUrl;
  }, [selectedArticle, selectedCategory]);

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
          const baseUrl = 'https://kibfdaxeegvddusnknfs.supabase.co/rest/v1/articles';
          const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpYmZkYXhlZWd2ZGR1c25rbmZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQzMTQ2NzMsImV4cCI6MjAzOTg5MDY3M30.l9HjERTXw_8mAqzIOkv8vck82CBbh2wPiZ_pS96k7Mg';
          
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
            setNewsItems(data);
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
          setNewsItems([]);
          loadedIds.current.clear();
          setPage(1);
          forceScrollTop();
        }
      }
    };
  
    loadArticleFromUrl();
  }, [location.pathname, newsItems, navigate, selectedCategory]);

  const handleCategoryChange = (category: CategoryType) => {
    if (category === selectedCategory) return;
    
    setSelectedArticle(null);
    setNewsItems([]);
    loadedIds.current.clear();
    setPage(1);
    setHasMore(true);
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

  useEffect(() => {
    fetchNews(page);
  }, [fetchNews, page, selectedCategory]);

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
  }, [isLoading, hasMore]);

  return (
    <>
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getMetaDescription()} />
        <link rel="canonical" href={getCurrentUrl()} />
        <meta name="keywords" content={
          selectedArticle 
            ? `vijesti, ${selectedArticle.category_name.toLowerCase()}, hrvatska, novosti, ${selectedArticle.title.toLowerCase()}`
            : selectedCategory !== 'Sve'
            ? `vijesti, ${selectedCategory.toLowerCase()}, hrvatska, novosti, uživo`
            : 'vijesti, hrvatska, najnovije vijesti, uživo, novosti, svijet, regija'
        } />
        {selectedArticle && (
          <>
            <meta property="og:type" content="article" />
            <meta property="og:title" content={selectedArticle.title} />
            <meta property="og:description" content={generateMetaDescription(selectedArticle.content)} />
            <meta property="og:image" content={selectedArticle.image_url} />
            <meta property="og:url" content={getCurrentUrl()} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:image" content={selectedArticle.image_url} />
            <meta property="article:published_time" content={new Date(selectedArticle.date_unparsed).toISOString()} />
            <meta property="article:section" content={selectedArticle.category_name} />
          </>
        )}
      </Helmet>

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