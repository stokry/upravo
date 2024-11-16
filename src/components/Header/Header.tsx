import { LiveBadge } from './LiveBadge';
import { CategoryNav } from './CategoryNav';
import { TopNav } from './TopNav';
import type { CategoryType } from '@/types/news';

interface HeaderProps {
  categories: CategoryType[];
  selectedCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
}

export function Header({ categories, selectedCategory, onCategoryChange }: HeaderProps) {
  return (
    <header className="sticky top-0 bg-background z-10 border-b border-border">
      {/* Top Bar */}
      <div className="bg-brand text-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <TopNav />
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-border bg-background">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => onCategoryChange('Sve')}
          >
            <img 
              src="/logo.svg" 
              alt="Brzi.info Logo" 
              className="h-8 w-auto"
            />
          </div>
          <LiveBadge />
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-background shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4">
          <CategoryNav 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />
        </div>
      </div>
    </header>
  );
}