// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Bot detection with improved patterns
const isBot = (userAgent: string) => {
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
  ]
  return bots.some(bot => userAgent.toLowerCase().includes(bot.toLowerCase()))
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'
  ]
}

export default async function middleware(request: NextRequest) {
  // Create base response
  const response = NextResponse.next()
  
  const userAgent = request.headers.get('user-agent') || ''
  
  // Special handling for social media bots
  if (isBot(userAgent)) {
    if (userAgent.toLowerCase().includes('facebookexternalhit') || 
        userAgent.toLowerCase().includes('twitterbot') ||
        userAgent.toLowerCase().includes('linkedinbot')) {
      
      try {
        // Extract article ID from URL
        const url = new URL(request.url)
        const matches = url.pathname.match(/\/([^/]+)\/([^/]+)$/)
        const id = matches ? matches[2].split('-').pop() : null

        if (id && process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
          // Fetch article data
          const articleResponse = await fetch(
            `${process.env.SUPABASE_URL}/rest/v1/articles?id=eq.${id}`,
            {
              headers: {
                'apikey': process.env.SUPABASE_KEY,
                'Authorization': `Bearer ${process.env.SUPABASE_KEY}`,
                'Accept': 'application/json'
              }
            }
          )

          if (articleResponse.ok) {
            const articles = await articleResponse.json()
            const article = articles[0]

            if (article) {
              // Set cache headers for bots
              response.headers.set('Cache-Control', 'public, max-age=300')
            }
          }
        }
      } catch (error) {
        console.error('Error in bot middleware:', error)
      }
    }
  }

  return response
}