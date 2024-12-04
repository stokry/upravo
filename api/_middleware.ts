// api/_middleware.ts
import { NextResponse } from '@vercel/edge';
import type { NextRequest } from '@vercel/edge';

interface RequestContext {
  params: {
    [key: string]: string | string[];
  };
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
    'slackbot'
  ];
  return bots.some(bot => userAgent.toLowerCase().includes(bot));
};

async function generateMetaTags(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname;

  // Default meta tags
  let meta = {
    title: 'Brzi.info - Najnovije vijesti',
    description: 'Pratite najnovije vijesti i događanja uživo na Brzi.info - vaš izvor za najnovije vijesti iz Hrvatske i svijeta.',
    image: 'https://brzi.info/static/images/default-share.jpg',
    type: 'website',
    keywords: ['vijesti', 'hrvatska', 'sport', 'svijet']
  };

  // Match different page types
  if (path === '/') {
    // Homepage - use defaults
  } else if (path.match(/^\/([^/]+)$/)) {
    // Category pages
    const category = path.split('/')[1];
    meta = {
      ...meta,
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} vijesti - Brzi.info`,
      description: `Pratite najnovije ${category} vijesti i događanja uživo na Brzi.info`,
      keywords: [category, 'vijesti', 'hrvatska']
    };
  } else if (path.match(/\/([^/]+)\/([^/]+)$/)) {
    // Article pages
    try {
      const matches = path.match(/\/([^/]+)\/([^/]+)$/);
      const slug = matches ? matches[2] : null;
      
      if (slug) {
        const articleData = await fetch(`${process.env.VITE_API_URL}/api/articles/${slug}`);
        const article = await articleData.json();
        
        if (article) {
          meta = {
            title: article.title,
            description: article.description || article.summary,
            image: article.image || meta.image,
            type: 'article',
            keywords: [...article.keywords, article.category_name.toLowerCase(), 'vijesti']
          };
        }
      }
    } catch (error) {
      console.error('Error fetching article data:', error);
    }
  }

  return meta;
}

export default async function middleware(req: NextRequest) {
  const userAgent = req.headers.get('user-agent') || '';
  const meta = await generateMetaTags(req);
  
  // Generate HTML with meta tags
  const html = `
    <!DOCTYPE html>
    <html lang="hr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <!-- Primary Meta Tags -->
        <title>${meta.title}</title>
        <meta name="title" content="${meta.title}">
        <meta name="description" content="${meta.description}">
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="${meta.type}">
        <meta property="og:url" content="${req.url}">
        <meta property="og:title" content="${meta.title}">
        <meta property="og:description" content="${meta.description}">
        <meta property="og:image" content="${meta.image}">
        <meta property="og:site_name" content="Brzi.info">
        <meta property="og:locale" content="hr_HR">
        
        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:url" content="${req.url}">
        <meta name="twitter:title" content="${meta.title}">
        <meta name="twitter:description" content="${meta.description}">
        <meta name="twitter:image" content="${meta.image}">
        
        <!-- Keywords -->
        <meta name="keywords" content="${meta.keywords.join(', ')}">
        
        <!-- Canonical -->
        <link rel="canonical" href="${req.url}">
        
        <!-- Security Headers -->
        <meta http-equiv="X-Content-Type-Options" content="nosniff">
        <meta http-equiv="X-Frame-Options" content="DENY">
        <meta http-equiv="X-XSS-Protection" content="1; mode=block">
        <meta name="referrer" content="strict-origin-when-cross-origin">
    </head>
    <body>
        <div id="root"></div>
        <script type="module" src="/src/main.tsx"></script>
    </body>
    </html>
  `;

  // If it's a bot, return the pre-rendered HTML
  if (isBot(userAgent)) {
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
        'X-Robots-Tag': 'index, follow',
        'Link': `<${req.url}>; rel="canonical"`
      }
    });
  }

  // For regular users, add meta tags via response headers
  const response = NextResponse.next();
  
  response.headers.set('X-Meta-Title', meta.title);
  response.headers.set('X-Meta-Description', meta.description);
  response.headers.set('X-Meta-Image', meta.image);
  response.headers.set('X-Meta-Type', meta.type);
  response.headers.set('X-Meta-Keywords', meta.keywords.join(', '));
  
  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Add default SEO meta tags
  response.headers.set('X-Robots-Tag', 'index, follow');
  
  return response;
}

export const config = {
  matcher: '/((?!assets|static|api|favicon.ico).*)',
};