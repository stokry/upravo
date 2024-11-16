import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CategoryType } from '@/types/news';

interface CategoryNavProps {
  categories: CategoryType[];
  selectedCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
  className?: string;
}

export function CategoryNav({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  className 
}: CategoryNavProps) {
  return (
    <nav className={cn("flex items-center gap-6", className)}>
      {categories.map((category) => (
        <Button
          key={category}
          variant="ghost"
          onClick={() => onCategoryChange(category)}
          className={cn(
            "px-0 h-auto hover:bg-transparent",
            selectedCategory === category 
              ? "text-brand font-medium" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {category}
        </Button>
      ))}
    </nav>
  );
}