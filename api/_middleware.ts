// api/_middleware.ts
import { NextResponse } from '@vercel/edge';
import type { NextRequest } from '@vercel/edge';
import * as path from 'path';
import * as fs from 'fs';

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
      const matches = path.match(/\/([^/]+)\/([^/]+)$/);
      const slug = matches ? matches[2] : null;
      
      if (slug) {
        const apiUrl = process.env.VITE_API_URL || baseUrl;
        const articleData = await fetch(
          `${apiUrl}/api/articles/${slug}`,
          {
            headers: {
              'Cache-Control': 'public, max-age=30, stale-while-revalidate=60'
            }
          }
        );

        if (!articleData.ok) {
          throw new Error(`API returned ${articleData.status}`);
        }

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
    // Keep default meta tags on error
  }

  return meta;
}

function generateHTML(meta: MetaTags, indexPath: string): string {
  return `
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
        <meta property="og:url" content="${meta.url}">
        <meta property="og:title" content="${meta.title}">
        <meta property="og:description" content="${meta.description}">
        <meta property="og:image" content="${meta.image}">
        <meta property="og:site_name" content="Brzi.info">
        <meta property="og:locale" content="hr_HR">
        
        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:url" content="${meta.url}">
        <meta name="twitter:title" content="${meta.title}">
        <meta name="twitter:description" content="${meta.description}">
        <meta name="twitter:image" content="${meta.image}">
        
        <!-- Keywords -->
        <meta name="keywords" content="${meta.keywords.join(', ')}">
        
        <!-- Canonical -->
        <link rel="canonical" href="${meta.url}">
        
        <!-- Security Headers -->
        <meta http-equiv="X-Content-Type-Options" content="nosniff">
        <meta http-equiv="X-Frame-Options" content="DENY">
        <meta http-equiv="X-XSS-Protection" content="1; mode=block">
        <meta name="referrer" content="strict-origin-when-cross-origin">

        <!-- Vite entry point -->
        <script type="module" crossorigin src="${indexPath}"></script>
    </head>
    <body>
        <div id="root"></div>
    </body>
    </html>
  `;
}

export default async function middleware(req: NextRequest) {
  const userAgent = req.headers.get('user-agent') || '';
  const meta = await generateMetaTags(req);
  
  // If it's a bot, return pre-rendered HTML with meta tags
  if (isBot(userAgent)) {
    // Get the correct Vite asset path from the build output
    const manifestPath = path.join(process.cwd(), 'dist', 'manifest.json');
    let indexPath = '/assets/index.js';
    
    try {
      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
        indexPath = manifest['index.html']?.file || indexPath;
      }
    } catch (error) {
      console.error('Error reading Vite manifest:', error);
    }

    return new Response(generateHTML(meta, indexPath), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
        'X-Robots-Tag': 'index, follow',
        'Link': `<${meta.url}>; rel="canonical"`,
        'Vary': 'User-Agent'
      }
    });
  }

  // For regular users, continue to the app
  const response = NextResponse.next();
  
  // Add meta tags via response headers
  response.headers.set('X-Meta-Title', meta.title);
  response.headers.set('X-Meta-Description', meta.description);
  response.headers.set('X-Meta-Image', meta.image);
  response.headers.set('X-Meta-Type', meta.type);
  response.headers.set('X-Meta-Keywords', meta.keywords.join(', '));
  
  // Security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('X-Robots-Tag', 'index, follow');
  response.headers.set('Vary', 'User-Agent');
  
  return response;
}

export const config = {
  matcher: '/((?!assets|static|api|favicon.ico).*)',
};