export const config = {
  runtime: 'edge',
  matcher: ['/', '/:path*']
};

// Enhanced bot detection with more specific patterns
const isBot = (userAgent) => {
  const botPatterns = [
    // Social Media Bots
    'facebookexternalhit',
    'facebookcatalog',
    'WhatsApp',
    'Twitterbot',
    'LinkedInBot',
    'Pinterest',
    'Slackbot',
    'TelegramBot',
    'Discordbot',
    'viber',
    
    // Search Engine Bots
    'googlebot',
    'bingbot',
    'yandexbot',
    'duckduckbot',
    'baiduspider',
    
    // Generic Bot Patterns
    'bot',
    'crawler',
    'spider',
    'prerender',
    'preview'
  ];
  
  const ua = userAgent.toLowerCase();
  return botPatterns.some(pattern => ua.includes(pattern.toLowerCase()));
};

// HTML encoding to prevent XSS
const encodeHTML = (str) => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Clean URL for canonical links
const getCleanUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return `https://brzi.info${urlObj.pathname}`;
  } catch {
    return 'https://brzi.info';
  }
};

export default async function middleware(request) {
  // Get user agent and URL
  const userAgent = request.headers.get('user-agent') || '';
  const url = new URL(request.url);
  
  // Early return for non-bot requests and static files
  if (!isBot(userAgent) || url.pathname.match(/\.(ico|png|jpg|jpeg|css|js|svg)$/)) {
    return new Response(null, {
      status: 200,
      headers: { 'x-middleware-next': '1' }
    });
  }

  try {
    // Extract article ID from URL with improved regex
    const matches = url.pathname.match(/\/([^/]+)\/([^/]+)$/);
    const id = matches ? matches[2].split('-').pop() : null;

    // Default meta tags for non-article pages
    let title = 'Brzi.info - Najnovije vijesti';
    let description = 'Pratite najnovije vijesti i događanja uživo na Brzi.info - vaš izvor za najnovije vijesti iz Hrvatske i svijeta.';
    let image = 'https://brzi.info/static/images/default-share.jpg';
    let type = 'website';

    // If we have an article ID, fetch its data
    if (id && process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
      try {
        const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/articles?id=eq.${id}`, {
          headers: {
            'apikey': process.env.SUPABASE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_KEY}`,
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          const articles = await response.json();
          const article = articles[0];
          
          if (article) {
            title = `${article.title} - Brzi.info`;
            description = article.summary || article.meta_description || `Pročitajte "${article.title}" na Brzi.info`;
            image = article.image_url || image;
            type = 'article';
          }
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    }

    // Encode all meta values
    title = encodeHTML(title);
    description = encodeHTML(description);
    image = encodeHTML(image);
    const canonicalUrl = getCleanUrl(request.url);

    // Get the HTML content
    const res = await fetch(request.url);
    if (!res.ok) {
      return new Response(null, {
        status: 200,
        headers: { 'x-middleware-next': '1' }
      });
    }

    let html = await res.text();

    // Comprehensive meta tags with proper formatting
    const metaTags = `
      <meta charset="utf-8">
      <title>${title}</title>
      <meta name="description" content="${description}">
      
      <!-- Open Graph / Facebook -->
      <meta property="og:type" content="${type}">
      <meta property="og:url" content="${canonicalUrl}">
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${description}">
      <meta property="og:image" content="${image}">
      <meta property="og:site_name" content="Brzi.info">
      <meta property="og:locale" content="hr_HR">
      
      <!-- Twitter -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:url" content="${canonicalUrl}">
      <meta name="twitter:title" content="${title}">
      <meta name="twitter:description" content="${description}">
      <meta name="twitter:image" content="${image}">
      
      <!-- Additional Meta -->
      <link rel="canonical" href="${canonicalUrl}">
      <meta name="robots" content="index,follow">
      <meta property="og:image:width" content="1200">
      <meta property="og:image:height" content="630">
    `.trim();

    // Remove existing meta tags to prevent duplicates
    html = html.replace(/<title>.*?<\/title>/i, '')
               .replace(/<meta[^>]*>/gi, '')
               .replace(/<link rel="canonical"[^>]*>/gi, '');

    // Insert new meta tags right after head tag
    const headMatch = html.match(/<head[^>]*>/i);
    if (headMatch) {
      html = html.replace(headMatch[0], `${headMatch[0]}\n${metaTags}`);
    }

    return new Response(html, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=3600, s-maxage=86400',
        'x-robots-tag': 'index, follow'
      }
    });
  } catch (error) {
    console.error('Middleware error:', error);
    return new Response(null, {
      status: 200,
      headers: { 'x-middleware-next': '1' }
    });
  }
}
