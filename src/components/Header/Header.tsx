import { LiveBadge } from './LiveBadge';
import { CategoryNav } from './CategoryNav';
import type { CategoryType } from '@/types/news';

interface HeaderProps {
  categories: CategoryType[];
  selectedCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
}

export function Header({ categories, selectedCategory, onCategoryChange }: HeaderProps) {
  return (
    <header className="sticky top-0 bg-background border-b border-brand/10 z-10 pb-4 space-y-4">
      <div className="flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => onCategoryChange('Sve')}
        >
          <img 
            src="/logo.svg" 
            alt="Brzi.info Logo" 
            className="h-11 w-auto"
          />
        </div>
        <LiveBadge />
      </div>
      <CategoryNav 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />
    </header>
  );
}