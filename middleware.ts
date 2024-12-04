import { NextResponse } from '@vercel/edge';
import type { NextRequest } from '@vercel/edge';

async function generateMetaTags(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname;

  // Default meta
  let meta = {
    title: 'Brzi.info - Najnovije vijesti',
    description: 'Pratite najnovije vijesti i događanja uživo na Brzi.info',
    type: 'website',
    url: `https://brzi.info${path}`,
    image: 'https://brzi.info/static/images/default-share.jpg',
    keywords: 'vijesti, hrvatska'
  };

  // Handle category pages
  if (path.match(/^\/([^/]+)$/)) {
    const category = path.split('/')[1];
    meta.title = `${category.charAt(0).toUpperCase() + category.slice(1)} vijesti - Brzi.info`;
    meta.description = `Pratite najnovije ${category} vijesti`;
    meta.keywords = `${category}, vijesti, hrvatska`;
  }
  
  // Handle article pages
  else if (path.match(/\/([^/]+)\/([^/]+)$/)) {
    try {
      const response = await fetch(`https://brzi.info${path}`);
      const html = await response.text();
      
      const title = html.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1];
      const desc = html.match(/<meta name="description" content="([^"]*)">/)?.[1];
      const img = html.match(/<meta property="og:image" content="([^"]*)">/)?.[1];
      
      if (title) {
        meta.title = title;
        meta.description = desc || meta.description;
        meta.image = img || meta.image;
        meta.type = 'article';
      }
    } catch (error) {
      console.error('Error fetching article data:', error);
    }
  }

  return meta;
}

export default async function middleware(req: NextRequest) {
  const meta = await generateMetaTags(req);
  const template = await fetch(new URL('/index.html', req.url)).then(r => r.text());
  
  const html = template
    .replace(/__TITLE__/g, meta.title)
    .replace(/__DESCRIPTION__/g, meta.description)
    .replace(/__TYPE__/g, meta.type)
    .replace(/__URL__/g, meta.url)
    .replace(/__IMAGE__/g, meta.image)
    .replace(/__KEYWORDS__/g, meta.keywords);

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=300'
    }
  });
}

export const config = {
  matcher: '/((?!assets|static|api|favicon.ico).*)'
};