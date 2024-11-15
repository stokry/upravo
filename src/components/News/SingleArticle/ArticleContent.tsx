import type { NewsItem } from '@/types/news';

interface ArticleContentProps {
  article: NewsItem;
}

export function ArticleContent({ article }: ArticleContentProps) {
  const renderContent = (content: string) => {
    return content.split('\n').map((section, idx) => {
      if (section.startsWith('##')) {
        // Headings (using "##" as a custom delimiter for headings)
        return (
          <h3 key={idx} className="text-2xl font-semibold mb-4">
            {section.replace(/^##/, '').trim()}
          </h3>
        );
      } else if (section.trim()) {
        // Regular paragraphs (skip empty lines)
        return (
          <p key={idx} className="text-lg leading-relaxed mb-6">
            {section}
          </p>
        );
      }
      return null;
    });
  };

  return (
    <div className="prose prose-lg max-w-none space-y-6">
      {renderContent(article.content)}
    </div>
  );
}

export function ArticleContentSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="space-y-4">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-11/12" />
          <div className="h-4 bg-muted rounded w-4/5" />
        </div>
      ))}
    </div>
  );
}