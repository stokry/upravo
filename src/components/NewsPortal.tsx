"use client"

import { Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NewsGrid from './NewsGrid';
import SingleArticle from './SingleArticle';
import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

export interface NewsItem {
  id: number;
  post_id: number;
  title: string;
  link: string;
  image_url: string;
  category_name: string;
  content: string;
  date_unparsed: string;
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

type CategoryType = typeof PREDEFINED_CATEGORIES[number] | 'All';
const categories: CategoryType[] = ['All', ...PREDEFINED_CATEGORIES];

interface LiveBadgeProps {
  className?: string;
}

function LiveBadge({ className }: LiveBadgeProps) {
  return (
    <div className={cn(
      "relative flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100",
      "px-4 py-1.5 rounded-full group hover:shadow-lg transition-all duration-300",
      className
    )}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 opacity-10 rounded-full blur-sm group-hover:opacity-15 transition-opacity" />
      <div className="relative flex items-center">
        <div className="relative">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping absolute" />
          <div className="w-2 h-2 bg-green-500 rounded-full relative" />
        </div>
        <span className="relative ml-2 text-sm font-medium text-green-800">
          Uživo
        </span>
      </div>
    </div>
  );
}

export default function NewsPortal() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
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

      if (selectedCategory === 'All') {
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
        (selectedCategory === 'All' ? PREDEFINED_CATEGORIES.includes(item.category_name as typeof PREDEFINED_CATEGORIES[number]) : true)
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

  const handleCategoryChange = (category: CategoryType) => {
    setSelectedArticle(null);
    setSelectedCategory(category);
    setNewsItems([]);
    loadedIds.current.clear();
    setPage(1);
    setHasMore(true);
  };

  useEffect(() => {
    fetchNews(page);
  }, [fetchNews, page]);

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
    <div className="min-h-screen bg-background font-mono">
      <div className="max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8">
        <header className="sticky top-0 bg-background border-b z-10 pb-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Newspaper className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">Vijesti Uživo</h1>
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
                className="flex-shrink-0"
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
              onNewsClick={setSelectedArticle}
              lastElementRef={lastNewsElementRef}
            />
          ) : (
            <SingleArticle 
              article={selectedArticle} 
              onBack={() => setSelectedArticle(null)}
              newsItems={newsItems}
              setSelectedArticle={setSelectedArticle}
            />
          )}

          {isLoading && page > 1 && (
            <p className="text-center mt-8">Loading more news...</p>
          )}
        </main>
      </div>
    </div>
  );
}