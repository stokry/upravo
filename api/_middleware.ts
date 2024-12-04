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
    'discord'
  ];
  return bots.some(bot => userAgent.toLowerCase().includes(bot));
};

router.get(async (req: NextRequest) => {
  const userAgent = req.headers.get('user-agent') || '';
  
  if (isBot(userAgent)) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'public, max-age=300');
    
    try {
      const url = new URL(req.url);
      const matches = url.pathname.match(/\/([^/]+)\/([^/]+)$/);
      const id = matches ? matches[2].split('-').pop() : null;

      if (id) {
        // Add your bot-specific logic here
        response.headers.set('X-Bot-Handled', 'true');
      }
    } catch (error) {
      console.error('Error processing bot request:', error);
    }
    
    return response;
  }
  
  return NextResponse.next();
});

export default router.handler();

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};