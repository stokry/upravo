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
      const [_, category, slug] = path.match(/\/([^/]+)\/([^/]+)$/) || [];
      
      if (category && slug) {
        const articleUrl = `https://brzi.info/${category}/${slug}`;
        const response = await fetch(articleUrl, {
          headers: {
            'Cache-Control': 'public, max-age=30, stale-while-revalidate=60'
          }
        });

        if (!response.ok) throw new Error(`Failed to fetch article: ${response.status}`);

        const html = await response.text();
        
        // Extract meta data from HTML
        const titleMatch = html.match(/<meta property="og:title" content="([^"]*)"/) 
          || html.match(/<title>(.*?)<\/title>/);
        const descMatch = html.match(/<meta property="og:description" content="([^"]*)"/) 
          || html.match(/<meta name="description" content="([^"]*)"/);
        const imageMatch = html.match(/<meta property="og:image" content="([^"]*)"/);
        
        meta = {
          title: titleMatch?.[1] || meta.title,
          description: descMatch?.[1] || meta.description,
          image: imageMatch?.[1] || meta.image,
          type: 'article',
          keywords: [category, 'vijesti', 'hrvatska'],
          url: articleUrl
        };
      }
    }
  } catch (error) {
    console.error('Error generating meta tags:', error);
  }

  return meta;
}

async function injectMetaTags(html: string, meta: MetaTags): Promise<string> {
  // Replace title
  html = html.replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`);
  
  // Replace meta tags
  html = html.replace(/<meta name="title".*?>/, `<meta name="title" content="${meta.title}">`);
  html = html.replace(/<meta name="description".*?>/, `<meta name="description" content="${meta.description}">`);
  
  // Replace OG tags
  html = html.replace(/<meta property="og:title".*?>/, `<meta property="og:title" content="${meta.title}">`);
  html = html.replace(/<meta property="og:description".*?>/, `<meta property="og:description" content="${meta.description}">`);
  html = html.replace(/<meta property="og:image".*?>/, `<meta property="og:image" content="${meta.image}">`);
  html = html.replace(/<meta property="og:url".*?>/, `<meta property="og:url" content="${meta.url}">`);
  
  // Replace Twitter tags
  html = html.replace(/<meta name="twitter:title".*?>/, `<meta name="twitter:title" content="${meta.title}">`);
  html = html.replace(/<meta name="twitter:description".*?>/, `<meta name="twitter:description" content="${meta.description}">`);
  html = html.replace(/<meta name="twitter:image".*?>/, `<meta name="twitter:image" content="${meta.image}">`);
  html = html.replace(/<meta name="twitter:url".*?>/, `<meta name="twitter:url" content="${meta.url}">`);
  
  // Replace keywords and canonical
  html = html.replace(/<meta name="keywords".*?>/, `<meta name="keywords" content="${meta.keywords.join(', ')}">`);
  html = html.replace(/<link rel="canonical".*?>/, `<link rel="canonical" href="${meta.url}">`);

  return html;
}


export default async function middleware(req: NextRequest) {
  const userAgent = req.headers.get('user-agent') || '';
  const meta = await generateMetaTags(req);
  
  try {
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