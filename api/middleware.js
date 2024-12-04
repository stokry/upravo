export const config = {
    runtime: 'edge'
  };
  
  // Bot detection with improved patterns
  const isBot = (userAgent) => {
    const bots = [
      'bot',
      'crawler',
      'spider',
      'facebookexternalhit',
      'Twitterbot',
      'LinkedInBot',
      'WhatsApp',
      'Slackbot',
      'TelegramBot',
      'googlebot',
      'bingbot',
      'yandexbot',
      'discordbot'
    ];
    return bots.some(bot => userAgent.toLowerCase().includes(bot.toLowerCase()));
  };
  
  export default async function middleware(request) {
    const response = new Response(null, {
      status: 200,
      headers: new Headers(request.headers)
    });
  
    const userAgent = request.headers.get('user-agent') || '';
  
    // Special handling for social media bots
    if (isBot(userAgent)) {
      const isSocialBot = [
        'facebookexternalhit',
        'twitterbot',
        'linkedinbot'
      ].some(bot => userAgent.toLowerCase().includes(bot));
  
      if (isSocialBot) {
        try {
          // Extract article ID from URL
          const url = new URL(request.url);
          const matches = url.pathname.match(/\/([^/]+)\/([^/]+)$/);
          const id = matches ? matches[2].split('-').pop() : null;
  
          if (id && process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_KEY) {
            // Fetch article data
            const articleResponse = await fetch(
              `${process.env.VITE_SUPABASE_URL}/rest/v1/articles?id=eq.${id}`,
              {
                headers: {
                  'apikey': process.env.VITE_SUPABASE_KEY,
                  'Authorization': `Bearer ${process.env.VITE_SUPABASE_KEY}`,
                  'Accept': 'application/json'
                }
              }
            );
  
            if (articleResponse.ok) {
              const articles = await articleResponse.json();
              const article = articles[0];
  
              if (article) {
                // Set cache headers for bots
                response.headers.set('Cache-Control', 'public, max-age=300');
              }
            }
          }
        } catch (error) {
          console.error('Error in bot middleware:', error);
        }
      }
    }
  
    return response;
  }