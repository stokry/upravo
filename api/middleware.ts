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

// HTML encoding to prevent XSS
const encodeHTML = (str: string) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=63072000')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  const userAgent = request.headers.get('user-agent') || ''
  if (!isBot(userAgent)) {
    return response
  }

  // Special handling for social media bots
  if (userAgent.toLowerCase().includes('facebookexternalhit') || 
      userAgent.toLowerCase().includes('twitterbot') ||
      userAgent.toLowerCase().includes('linkedinbot')) {
    response.headers.set('Cache-Control', 'public, max-age=300')
  }

  try {
    // Extract article ID from URL with improved regex
    const url = new URL(request.url)
    const matches = url.pathname.match(/\/([^/]+)\/([^/]+)$/)
    const id = matches ? matches[2].split('-').pop() : null

    if (!id) {
      console.debug('No article ID found in URL:', url.pathname)
      return response
    }

    // Validate Supabase credentials
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      console.error('Missing Supabase credentials')
      return response
    }

    // Fetch article data with error handling
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/articles?id=eq.${id}`, {
      headers: {
        'apikey': process.env.SUPABASE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_KEY}`,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('Supabase API error:', response.status)
      return NextResponse.next()
    }

    const articles = await response.json()
    const article = articles[0]

    if (!article) {
      console.debug('Article not found:', id)
      return response
    }

    // Generate meta tags with encoding
    const title = encodeHTML(`${article.title} - Brzi.info`)
    const description = encodeHTML(article.summary || article.meta_description || `Pročitajte "${article.title}" na Brzi.info`)
    const image = encodeHTML(article.image_url || 'https://brzi.info/static/images/default-share.jpg')
    const canonicalUrl = encodeHTML(`https://brzi.info${url.pathname}`)

    // Get the HTML content
    const res = await fetch(request.url)
    if (!res.ok) {
      console.error('Failed to fetch HTML:', res.status)
      return response
    }

    let html = await res.text()

    // Insert meta tags with proper formatting
    const metaTags = `
      <meta charset="utf-8">
      <title>${title}</title>
      <meta name="description" content="${description}">
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${description}">
      <meta property="og:image" content="${image}">
      <meta property="og:url" content="${canonicalUrl}">
      <meta property="og:type" content="article">
      <meta property="og:site_name" content="Brzi.info">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${title}">
      <meta name="twitter:description" content="${description}">
      <meta name="twitter:image" content="${image}">
      <link rel="canonical" href="${canonicalUrl}">
    `.trim()

    // More robust head tag replacement
    const headMatch = html.match(/<head[^>]*>/i)
    if (headMatch) {
      html = html.replace(headMatch[0], `${headMatch[0]}\n${metaTags}`)
    }

    return new NextResponse(html, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=3600'
      }
    })
  } catch (error) {
    console.error('Middleware error:', error)
    return response
  }
}

// Configure middleware paths with improved matcher
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'
  ]
}