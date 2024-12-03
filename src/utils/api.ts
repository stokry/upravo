import type { Article } from '../types/Article';
import { SUPABASE_URL, SUPABASE_KEY } from '../config/constants';

function extractJsonContent(content: string): string {
  if (!content) return '';

  try {
    if (content.includes('```json')) {
      const jsonMatch = content.match(/```json\s*({[\s\S]*?})\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        const parsed = JSON.parse(jsonMatch[1]);
        return parsed.main_content || parsed.content || '';
      }
    }
    return content;
  } catch (error) {
    console.error('Error extracting JSON content:', error);
    return content;
  }
}

function extractSummaryFromJson(summary: string): string {
  if (!summary) return '';

  try {
    if (summary.includes('```json')) {
      const jsonMatch = summary.match(/```json\s*({[\s\S]*?})\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        const parsed = JSON.parse(jsonMatch[1]);
        return parsed.summary || '';
      }
    }
    return summary;
  } catch (error) {
    console.error('Error extracting summary from JSON:', error);
    return summary;
  }
}

function processArticle(article: Article): Article {
  return {
    ...article,
    content: extractJsonContent(article.content),
    summary: extractSummaryFromJson(article.summary || ''),
    keywords: Array.isArray(article.keywords) ? article.keywords : []
  };
}

async function fetchFromAPI(endpoint: string): Promise<any> {
  try {
    const response = await fetch(`${SUPABASE_URL}${endpoint}`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function fetchArticles(): Promise<Article[]> {
  const data = await fetchFromAPI('?order=date_unparsed.desc');
  return data.map(processArticle);
}

export async function fetchLatestArticles(limit: number = 5): Promise<Article[]> {
  const data = await fetchFromAPI(`?order=date_unparsed.desc&limit=${limit}`);
  return data.map(processArticle);
}

export async function fetchArticlesByCategory(category: string, page: number = 1): Promise<Article[]> {
  const limit = 9;
  const offset = (page - 1) * limit;
  const data = await fetchFromAPI(
    `?category_name=ilike.${category}&order=date_unparsed.desc&limit=${limit}&offset=${offset}`
  );
  return data.map(processArticle);
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const id = slug.split('-').pop();
  if (!id) return null;

  const data = await fetchFromAPI(`?id=eq.${id}`);
  return data.length > 0 ? processArticle(data[0]) : null;
}

export async function fetchLatestArticle(): Promise<Article | null> {
  const data = await fetchFromAPI('?order=date_unparsed.desc&limit=1');
  return data.length > 0 ? processArticle(data[0]) : null;
}