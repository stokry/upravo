import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CategoryType } from '@/types/news';

interface CategoryNavProps {
  categories: CategoryType[];
  selectedCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
}

export function CategoryNav({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: CategoryNavProps) {
  return (
    <nav className="flex items-center -mx-2 overflow-x-auto scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category}
          variant="ghost"
          onClick={() => onCategoryChange(category)}
          className={cn(
            "px-3 h-12 rounded-none border-b-2 border-transparent",
            selectedCategory === category && "border-brand text-brand",
            "hover:bg-transparent hover:text-brand transition-colors"
          )}
        >
          {category}
        </Button>
      ))}
    </nav>
  );
}