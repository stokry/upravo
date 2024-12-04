// api/_middleware.ts
import { createEdgeRouter } from 'next-connect';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface RequestContext {
  params: {
    [key: string]: string | string[];
  };
}

const router = createEdgeRouter<NextRequest, RequestContext>();

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

router.get(async (req: NextRequest) => {
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
              'Cache-Control': 'public, max-age=300'
            }
          });
        }
      }
    } catch (error) {
      console.error('Error processing bot request:', error);
    }
  }
  
  return NextResponse.next();
});

export default router.handler();

export const config = {
  matcher: '/((?!_next/static|_next/image|assets|favicon.ico).*)',
};