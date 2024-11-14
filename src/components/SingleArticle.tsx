import { ArrowLeft, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NewsItem } from '@/types/news';
import { getTimeAgo } from '@/utils/date';
import { useNavigate } from 'react-router-dom';

interface SingleArticleProps {
  article: NewsItem;
  onBack: () => void;
  newsItems: NewsItem[];
  setSelectedArticle: (article: NewsItem) => void;
}

// Helper function for creating URL-friendly slugs
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

// Utility to split content into paragraphs and headings
function renderContent(content: string) {
  // Split content by sections for headings (like `##` markers) and paragraphs by newlines.
  const sections = content.split('\n').map((section, idx) => {
    if (section.startsWith('##')) {
      // Headings, using "##" as a custom delimiter for headings
      return <h3 key={idx} className="text-2xl font-semibold mb-2">{section.replace(/^##/, '').trim()}</h3>;
    } else {
      // Regular paragraph
      return <p key={idx} className="text-lg leading-relaxed">{section}</p>;
    }
  });

  return sections;
}

export default function SingleArticle({
  article,
  onBack,
  newsItems,
  setSelectedArticle
}: SingleArticleProps) {
  const navigate = useNavigate();

  const handleRelatedArticleClick = (relatedArticle: NewsItem) => {
    setSelectedArticle(relatedArticle);
    const categorySlug = createSlug(relatedArticle.category_name);
    const titleSlug = createSlug(relatedArticle.title);
    navigate(`/${categorySlug}/${titleSlug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Natrag
      </Button>

      <article className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight hidden sm:block">{article.title}</h1>
            <h1 className="text-2xl font-bold leading-tight sm:hidden">{article.title}</h1>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">{article.category_name}</Badge>
              <span className="text-sm text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {getTimeAgo(article.date_unparsed)}
              </span>
            </div>
          </div>

          <div className="relative w-full aspect-video">
            <img
              src={article.image_url || '/placeholder.svg?height=400&width=800'}
              alt={article.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Rendered article content */}
          <div className="prose prose-lg max-w-none space-y-6">
            {renderContent(article.content)}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vidi još</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {article.category_name && (
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">Zadnje iz {article.category_name}</Badge>
                  </div>
                )}
                {newsItems
                  .filter(item => item.id !== article.id && item.category_name === article.category_name)
                  .slice(0, 6)
                  .map(relatedArticle => (
                    <div
                      key={relatedArticle.id}
                      className="group cursor-pointer"
                      onClick={() => handleRelatedArticleClick(relatedArticle)}
                    >
                      <div className="flex gap-3">
                        <img
                          src={relatedArticle.image_url || '/placeholder.svg?height=100&width=100'}
                          alt={relatedArticle.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                            {relatedArticle.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{getTimeAgo(relatedArticle.date_unparsed)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </aside>
      </article>
    </div>
  );
}