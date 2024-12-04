import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Bot detection
const isBot = (userAgent: string) => {
  const bots = [
    'bot', 'crawler', 'spider', 'facebookexternalhit',
    'Twitterbot', 'LinkedInBot', 'WhatsApp',
    'Slackbot', 'TelegramBot'
  ]
  return bots.some(bot => userAgent.toLowerCase().includes(bot.toLowerCase()))
}

export async function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || ''
  
  // Only process bot requests
  if (!isBot(userAgent)) {
    return NextResponse.next()
  }

  try {
    // Extract article ID from URL
    const url = new URL(request.url)
    const matches = url.pathname.match(/\/[^\/]+\/([^\/]+)$/)
    const id = matches ? matches[1].split('-').pop() : null

    if (!id) {
      return NextResponse.next()
    }

    // Fetch article data from your API
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/articles?id=eq.${id}`, {
      headers: {
        'apikey': process.env.SUPABASE_KEY || '',
        'Authorization': `Bearer ${process.env.SUPABASE_KEY || ''}`
      }
    })

    const articles = await response.json()
    const article = articles[0]

    if (!article) {
      return NextResponse.next()
    }

    // Generate meta tags
    const title = `${article.title} - Brzi.info`
    const description = article.summary || article.meta_description || `Pročitajte "${article.title}" na Brzi.info`
    const image = article.image_url || 'https://brzi.info/static/images/default-share.jpg'
    const canonicalUrl = `https://brzi.info${url.pathname}`

    // Get the HTML content
    const res = await fetch(request.url)
    let html = await res.text()

    // Insert meta tags
    const metaTags = `
      <title>${title}</title>
      <meta name="description" content="${description}" />
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${description}" />
      <meta property="og:image" content="${image}" />
      <meta property="og:url" content="${canonicalUrl}" />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Brzi.info" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${title}" />
      <meta name="twitter:description" content="${description}" />
      <meta name="twitter:image" content="${image}" />
    `

    html = html.replace('</head>', `${metaTags}</head>`)

    return new NextResponse(html, {
      headers: { 'content-type': 'text/html; charset=utf-8' }
    })
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    // Add paths that should be processed by the middleware
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
