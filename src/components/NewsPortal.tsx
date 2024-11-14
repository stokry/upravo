"use client"


import { Button } from '@/components/ui/button';
import NewsGrid from './NewsGrid';
import SingleArticle from './SingleArticle';
import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

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

const PREDEFINED_CATEGORIES = [
  'Vijesti',
  'Svijet',
  'Regija',
  'Crna kronika',
  'Nogomet',
  'Magazin',
  'Lifestyle',
  'Zdravlje'
] as const;

type CategoryType = typeof PREDEFINED_CATEGORIES[number] | 'Sve';
const categories: CategoryType[] = ['Sve', ...PREDEFINED_CATEGORIES];

interface LiveBadgeProps {
  className?: string;
}

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD") // Decompose characters with accents
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove any remaining non-word characters except whitespace and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Trim any leading or trailing hyphens
}

// Helper to convert slug back to category name
function getCategoryFromSlug(slug: string): CategoryType | null {
  if (!slug) return 'Sve';
  
  const exactMatch = PREDEFINED_CATEGORIES.find(
    cat => createSlug(cat) === slug
  );
  if (exactMatch) return exactMatch;

  return null;
}

function LiveBadge({ className }: LiveBadgeProps) {
  return (
    <div className={cn(
      "relative flex items-center space-x-2 bg-gradient-to-r from-brand/10 to-brand/5",
      "px-4 py-1.5 rounded-full group hover:shadow-lg transition-all duration-300",
      className
    )}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-brand to-brand-light opacity-10 rounded-full blur-sm group-hover:opacity-15 transition-opacity" />
      <div className="relative flex items-center">
        <div className="relative">
        <div className="w-2 h-2 bg-brand rounded-full animate-ping absolute" />
        <div className="w-2 h-2 bg-brand rounded-full relative" />
        </div>
        <span className="relative ml-2 text-sm font-medium text-brand">
          Uživo
        </span>
      </div>
    </div>
  );
}

function generateMetaDescription(text: string, maxLength: number = 160): string {
  if (!text) return '';
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.substring(0, maxLength).split(' ').slice(0, -1).join(' ') + '...';
}



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
      const baseUrl = 'https://kibfdaxeegvddusnknfs.supabase.co/rest/v1/articles';
      const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpYmZkYXhlZWd2ZGR1c25rbmZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQzMTQ2NzMsImV4cCI6MjAzOTg5MDY3M30.l9HjERTXw_8mAqzIOkv8vck82CBbh2wPiZ_pS96k7Mg';
      
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

  // Effect to handle URL routing for both categories and articles
  useEffect(() => {
    const path = location.pathname.split('/').filter(Boolean);
    
    if (path.length === 0) {
      if (selectedCategory !== 'Sve') {
        setSelectedCategory('Sve');
        setNewsItems([]);
        loadedIds.current.clear();
        setPage(1);
      }
    } else if (path.length === 1) {
      const category = getCategoryFromSlug(path[0]);
      if (category && category !== selectedCategory) {
        setSelectedCategory(category);
        setSelectedArticle(null);
        setNewsItems([]);
        loadedIds.current.clear();
        setPage(1);
      } else if (!category) {
        navigate('/');
      }
    } else if (path.length === 2) {
      const category = getCategoryFromSlug(path[0]);
      if (category && newsItems.length > 0) {
        const article = newsItems.find(item => 
          createSlug(item.category_name) === path[0] && 
          createSlug(item.title) === path[1]
        );
        
        if (article) {
          setSelectedArticle(article);
          setSelectedCategory(category);
        }
      }
    }
  }, [location.pathname]);

  const handleCategoryChange = (category: CategoryType) => {
    if (category === selectedCategory) return;
    
    setSelectedArticle(null);
    setNewsItems([]);
    loadedIds.current.clear();
    setPage(1);
    setHasMore(true);
    setSelectedCategory(category);

    if (category === 'Sve') {
      navigate('/');
    } else {
      navigate(`/${createSlug(category)}`);
    }
  };

  const handleNewsClick = (article: NewsItem) => {
    setSelectedArticle(article);
    const categorySlug = createSlug(article.category_name);
    const titleSlug = createSlug(article.title);
    navigate(`/${categorySlug}/${titleSlug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedArticle(null);
    navigate(selectedCategory === 'Sve' ? '/' : `/${createSlug(selectedCategory)}`);
  };

  // Effect for fetching news on category or page changes
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

    <meta property="og:type" content={selectedArticle ? 'article' : 'website'} />
    <meta property="og:title" content={getPageTitle()} />
    <meta property="og:description" content={getMetaDescription()} />
    <meta property="og:url" content={getCurrentUrl()} />
    <meta property="og:site_name" content="Brzi.info" />

    {selectedArticle && (
      <>
        <meta property="og:image" content={selectedArticle.image_url} />
        <meta property="article:published_time" content={new Date(selectedArticle.date_unparsed).toISOString()} />
        <meta property="article:section" content={selectedArticle.category_name} />
        <meta property="article:author" content="Brzi.info" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": selectedArticle.title,
            "description": generateMetaDescription(selectedArticle.content),
            "image": selectedArticle.image_url,
            "datePublished": new Date(selectedArticle.date_unparsed).toISOString(),
            "dateModified": new Date(selectedArticle.date_unparsed).toISOString(),
            "author": {
              "@type": "Organization",
              "name": "Brzi.info"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Brzi.info",
              "logo": {
                "@type": "ImageObject",
                "url": `${window.location.origin}/logo.png`
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": getCurrentUrl()
            }
          })}
        </script>
      </>
    )}

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={getPageTitle()} />
    <meta name="twitter:description" content={getMetaDescription()} />
    {selectedArticle && <meta name="twitter:image" content={selectedArticle.image_url} />}

    <meta name="robots" content="index, follow" />
    <meta name="language" content="Croatian" />
    {selectedCategory !== 'Sve' && (
      <meta name="keywords" content={`vijesti, ${selectedCategory.toLowerCase()}, hrvatska, novosti, uživo`} />
    )}
  </Helmet>

    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8">
        <header className="sticky top-0 bg-background border-b border-brand/10 z-10 pb-4 space-y-4">
        <div className="flex items-center justify-between">
    <div 
      className="flex items-center space-x-2 cursor-pointer" 
      onClick={() => handleCategoryChange('Sve')}
    >
      <img 
        src="/logo.svg" 
        alt="Brzi.info Logo" 
        className="h-11 w-auto" // Adjust size as needed
      />
    </div>
            <LiveBadge />
          </div>

          <nav className="flex gap-2 overflow-x-auto pb-2">
    {categories.map((category) => (
      <Button
        key={category}
        variant={selectedCategory === category ? "default" : "outline"}
        size="sm"
        onClick={() => handleCategoryChange(category)}
        className={cn(
          "flex-shrink-0 transition-colors",
          selectedCategory === category 
            ? "bg-brand hover:bg-brand-light text-white"
            : "hover:text-brand border-brand/20 hover:border-brand"
        )}
      >
        {category}
      </Button>
    ))}
  </nav>
        </header>

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
              onBack={handleBack}
              newsItems={newsItems}
              setSelectedArticle={(article) => {
                setSelectedArticle(article);
                const categorySlug = createSlug(article.category_name);
                const titleSlug = createSlug(article.title);
                navigate(`/${categorySlug}/${titleSlug}`);
              }}
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