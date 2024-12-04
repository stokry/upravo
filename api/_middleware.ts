// api/_middleware.ts
import { NextResponse } from '@vercel/edge';
import type { NextRequest } from '@vercel/edge';

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
      // Extract category and slug from URL
      const [_, category, slug] = path.match(/\/([^/]+)\/([^/]+)$/) || [];
      
      if (category && slug) {
        // Use the actual URL structure
        const articleUrl = `https://brzi.info/${category}/${slug}`;
          {
            headers: {
              'Cache-Control': 'public, max-age=30, stale-while-revalidate=60'
            }
          }
        );

        if (!articleData.ok) throw new Error(`API returned ${articleData.status}`);

        const article = await articleData.json();
        
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
      }
    }
  } catch (error) {
    console.error('Error generating meta tags:', error);
  }

  return meta;
}

async function injectMetaTags(html: string, meta: MetaTags): Promise<string> {
  return html
    .replace(/__TITLE__/g, meta.title)
    .replace(/__DESCRIPTION__/g, meta.description)
    .replace(/__TYPE__/g, meta.type)
    .replace(/__URL__/g, meta.url)
    .replace(/__IMAGE__/g, meta.image)
    .replace(/__KEYWORDS__/g, meta.keywords.join(', '));
}

export default async function middleware(req: NextRequest) {
  const userAgent = req.headers.get('user-agent') || '';
  const meta = await generateMetaTags(req);
  
  try {
    // Fetch the index.html template
    const indexResponse = await fetch(new URL('/index.html', req.url));
    if (!indexResponse.ok) throw new Error('Failed to fetch index.html');
    
    const template = await indexResponse.text();
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