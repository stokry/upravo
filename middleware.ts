// api/_middleware.ts
import { NextResponse } from '@vercel/edge';
import type { NextRequest } from '@vercel/edge';
import path from 'path';
import fs from 'fs/promises';

interface MetaTags {
  title: string;
  description: string;
  image: string;
  type: string;
  keywords: string[];
  url: string;
}

const isBot = (userAgent: string): boolean => {
  const bots = [
    'bot',
    'crawler',
    'spider',
    'facebookexternalhit',
    'twitterbot',
    'linkedinbot',
    'whatsapp',
    'telegram',
    'discord',
    'slackbot',
    'viber',
    'pinterest',
    'vkshare',
    'w3c_validator',
    'baiduspider',
    'yandex',
    'googlebot',
    'applebot',
    'bingbot',
    'duckduckbot',
    'skype',
    'slack',
    'x',
    'embedly'
  ];
  const ua = userAgent.toLowerCase();
  return bots.some(bot => ua.includes(bot)) || ua.startsWith('mozilla/5.0 (compatible;');
};

async function generateMetaTags(req: NextRequest): Promise<MetaTags> {
  const url = new URL(req.url);
  const path = url.pathname;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://brzi.info';

  // Default meta tags
  let meta: MetaTags = {
    title: 'Brzi.info - Najnovije vijesti',
    description: 'Pratite najnovije vijesti i događanja uživo na Brzi.info - vaš izvor za najnovije vijesti iz Hrvatske i svijeta.',
    image: `${baseUrl}/static/images/default-share.jpg`,
    type: 'website',
    keywords: ['vijesti', 'hrvatska', 'sport', 'svijet'],
    url: `${baseUrl}${path}`
  };

  try {
    if (path === '/') {
      // Homepage - use defaults
    } else if (path.match(/^\/([^/]+)$/)) {
      const category = path.split('/')[1];
      meta = {
        ...meta,
        title: `${category.charAt(0).toUpperCase() + category.slice(1)} vijesti - Brzi.info`,
        description: `Pratite najnovije ${category} vijesti i događanja uživo na Brzi.info`,
        keywords: [category, 'vijesti', 'hrvatska']
      };
    } else if (path.match(/\/([^/]+)\/([^/]+)$/)) {
      const [_, category, slug] = path.match(/\/([^/]+)\/([^/]+)$/) || [];
      
      if (category && slug) {
        try {
          const apiUrl = process.env.VITE_API_URL || baseUrl;
          const articleId = slug.split('-').pop();
          const response = await fetch(`${apiUrl}/api/articles/${articleId}`, {
            headers: {
              'Cache-Control': 'public, max-age=30, stale-while-revalidate=60'
            }
          });

          if (!response.ok) throw new Error(`Failed to fetch article: ${response.status}`);

          const article = await response.json();
          
          if (article) {
            meta = {
              title: article.title,
              description: article.description || article.summary || meta.description,
              image: article.image?.startsWith('http') ? article.image : `${baseUrl}${article.image}` || meta.image,
              type: 'article',
              keywords: [...(article.keywords || []), article.category_name?.toLowerCase(), 'vijesti'].filter(Boolean),
              url: `${baseUrl}${path}`
            };
          }
        } catch (error) {
          console.error('Error fetching article:', error);
        }
      }
    }
  } catch (error) {
    console.error('Error generating meta tags:', error);
  }

  return meta;
}

async function injectMetaTags(html: string, meta: MetaTags): Promise<string> {
  const replacements = {
    '__TITLE__': meta.title,
    '__DESCRIPTION__': meta.description,
    '__TYPE__': meta.type,
    '__URL__': meta.url,
    '__IMAGE__': meta.image,
    '__KEYWORDS__': meta.keywords.join(', ')
  };

  // Replace all placeholders
  Object.entries(replacements).forEach(([placeholder, value]) => {
    html = html.replace(new RegExp(placeholder, 'g'), value || '');
  });

  // Remove duplicate canonical tags if they exist
  const canonicalTags = html.match(/<link rel="canonical".*?>/g) || [];
  if (canonicalTags.length > 1) {
    // Keep only the first canonical tag and remove others
    canonicalTags.slice(1).forEach(tag => {
      html = html.replace(tag, '');
    });
  }

  return html;
}

export default async function middleware(req: NextRequest) {
  const userAgent = req.headers.get('user-agent') || '';
  const meta = await generateMetaTags(req);
  
  try {
    // Get the index.html content
    const indexPath = path.join(process.cwd(), 'dist', 'index.html');
    let template = await fs.promises.readFile(indexPath, 'utf-8');
    
    // Inject meta tags
    const html = await injectMetaTags(template, meta);

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
        'X-Robots-Tag': 'index, follow',
        'Link': `<${meta.url}>; rel="canonical"`,
        'Vary': 'User-Agent'
      }
    });
  } catch (error) {
    console.error('Error in middleware:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: '/((?!assets|static|api|favicon.ico).*)',
};