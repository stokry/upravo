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

export default async function middleware(req: NextRequest) {
  const userAgent = req.headers.get('user-agent') || '';
  
  if (isBot(userAgent)) {
    try {
      const url = new URL(req.url);
      const matches = url.pathname.match(/\/([^/]+)\/([^/]+)$/);
      const slug = matches ? matches[2] : null;
      
      if (slug) {
        // Fetch article data from your API/database
        const articleData = await fetch(`${process.env.VITE_API_URL}/api/articles/${slug}`);
        const article = await articleData.json();
        
        if (article) {
          // Generate static HTML with proper meta tags
          const html = `
            <!DOCTYPE html>
            <html lang="hr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                
                <!-- Primary Meta Tags -->
                <title>${article.title} - Brzi.info</title>
                <meta name="title" content="${article.title} - Brzi.info">
                <meta name="description" content="${article.description}">
                
                <!-- Open Graph / Facebook -->
                <meta property="og:type" content="article">
                <meta property="og:url" content="${req.url}">
                <meta property="og:title" content="${article.title} - Brzi.info">
                <meta property="og:description" content="${article.description}">
                <meta property="og:image" content="${article.image}">
                <meta property="og:site_name" content="Brzi.info">
                <meta property="og:locale" content="hr_HR">
                
                <!-- Twitter -->
                <meta name="twitter:card" content="summary_large_image">
                <meta name="twitter:url" content="${req.url}">
                <meta name="twitter:title" content="${article.title} - Brzi.info">
                <meta name="twitter:description" content="${article.description}">
                <meta name="twitter:image" content="${article.image}">
                
                <!-- Keywords -->
                <meta name="keywords" content="${article.keywords}">
                
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
          
          return new Response(html, {
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'public, max-age=300',
              'X-Robots-Tag': 'index, follow',
              'Link': `<${req.url}>; rel="canonical"`
            }
          });
        }
      }
    } catch (error) {
      console.error('Error processing bot request:', error);
    }
  }

  // Add default SEO headers for non-bot requests
  const response = NextResponse.next();
  
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