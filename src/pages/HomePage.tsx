import React, { useEffect, useState } from 'react';
import { HeroSection } from '../components/HeroSection';
import { CategorySection } from '../components/CategorySection';
import { RegionCategorySection } from '../components/RegionCategorySection';
import { NumberedNewsSection } from '../components/NumberedNewsSection';
import { MagazineGridSection } from '../components/MagazineGridSection';
import { HealthSection } from '../components/HealthSection';
import { fetchArticles } from '../utils/api';
import type { Article } from '../types/Article';

export function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadArticles() {
      try {
        setLoading(true);
        const data = await fetchArticles();
        setArticles(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  const getLatestArticlesByCategory = (categoryName: string, limit: number) => {
    return articles
      .filter(article => article.category_name === categoryName)
      .slice(0, limit);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-4 md:py-6 lg:py-8">
        <div className="container px-4 mx-auto">
          {articles.length > 0 && <HeroSection articles={articles} />}
          
          <CategorySection 
            title="Svijet" 
            articles={getLatestArticlesByCategory('Svijet', 6)} 
          />
          
          <RegionCategorySection 
            title="Regija" 
            articles={getLatestArticlesByCategory('Regija', 6)} 
          />
          
          <NumberedNewsSection 
            title="Crna kronika" 
            articles={getLatestArticlesByCategory('Crna kronika', 5)} 
          />
          
          <CategorySection 
            title="Lifestyle" 
            articles={getLatestArticlesByCategory('Lifestyle', 6)} 
          />
          
          <MagazineGridSection 
            title="Magazin" 
            articles={getLatestArticlesByCategory('Magazin', 6)} 
          />
          
          <HealthSection 
            title="Zdravlje" 
            articles={getLatestArticlesByCategory('Zdravlje', 2)} 
          />
        </div>
      </main>
    </div>
  );
}