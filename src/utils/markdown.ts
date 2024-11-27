import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: false,
  mangle: false
});

function extractJsonContent(content: string): string {
  if (!content) return '';

  try {
    // Check if content is wrapped in JSON
    if (content.includes('```json')) {
      const jsonMatch = content.match(/```json\s*({[\s\S]*?})\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        const parsed = JSON.parse(jsonMatch[1]);
        return parsed.main_content || parsed.content || '';
      }
    }
    return content;
  } catch (error) {
    console.error('Error parsing JSON content:', error);
    return content;
  }
}

function cleanupContent(content: string): string {
  return content
    .replace(/```json[\s\S]*?```/g, '') // Remove JSON code blocks
    .replace(/```[\s\S]*?```/g, '')     // Remove other code blocks
    .trim();
}

export function parseMarkdown(content: string): string {
  if (!content) return '';

  try {
    // First extract content from JSON if needed
    const extractedContent = extractJsonContent(content);
    
    // Clean up the content
    const cleanContent = cleanupContent(extractedContent);
    
    // Convert markdown to HTML
    const htmlContent = marked(cleanContent);
    
    // Sanitize HTML
    const sanitizedContent = DOMPurify.sanitize(htmlContent, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'a', 'ul', 'ol', 'li',
        'blockquote', 'code', 'pre',
        'strong', 'em', 'br', 'hr'
      ],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class']
    });
    
    return sanitizedContent;
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return content;
  }
}