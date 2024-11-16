import { CategoryNav } from './CategoryNav';
import type { CategoryType } from '@/types/news';

interface HeaderProps {
  categories: CategoryType[];
  selectedCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
}

export function Header({ categories, selectedCategory, onCategoryChange }: HeaderProps) {
  // Filter out 'Sve' category and split remaining categories
  const filteredCategories = categories.filter(cat => cat !== 'Sve');
  const midpoint = Math.ceil(filteredCategories.length / 2);
  const leftCategories = filteredCategories.slice(0, midpoint);
  const rightCategories = filteredCategories.slice(midpoint);

  return (
    <header className="sticky top-0 bg-background z-10 border-b border-border">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Left Categories */}
          <CategoryNav 
            categories={leftCategories}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
            className="justify-end"
          />

          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer px-8" 
            onClick={() => onCategoryChange('Sve')}
          >
            <img 
              src="/logo.svg" 
              alt="Brzi.info Logo" 
              className="h-12 w-auto" // Increased from h-8 to h-12
            />
          </div>

          {/* Right Categories */}
          <CategoryNav 
            categories={rightCategories}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
            className="justify-start"
          />
        </div>
      </div>
    </header>
  );
}