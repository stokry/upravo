// components/News/SingleArticle/ArticleContent.tsx
import ReactMarkdown from 'react-markdown';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { NewsItem } from '@/types/news';

interface ArticleContentProps {
  article: NewsItem;
}

export function ArticleContent({ article }: ArticleContentProps) {
  return (
    <Card>
      <CardContent className="p-6">
        {article.summary && (
          <div className="mb-6 text-lg font-medium text-muted-foreground border-l-4 border-primary pl-4">
            {article.summary}
          </div>
        )}
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2 className="text-3xl font-bold mt-8 mb-4">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-2xl font-semibold mt-6 mb-3">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-lg leading-relaxed mb-4">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-lg leading-relaxed">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-muted pl-4 italic my-4">
                  {children}
                </blockquote>
              )
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {article.keywords && article.keywords.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <div className="flex flex-wrap gap-2">
              {article.keywords.map((keyword, index) => (
                <Badge key={index} variant="outline">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}