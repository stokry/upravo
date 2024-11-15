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
    <nav className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category)}
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
  );
}