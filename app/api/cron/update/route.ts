import { uploadMarketDataToFirestore } from "@pinisok/resonance-firestore";

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron
    if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Update market data
    await uploadMarketDataToFirestore();
    
    return new Response('Market data updated successfully', { status: 200 })
  } catch (error) {
    console.error('Cron job failed:', error);
    return new Response('Internal Server Error', { status: 500 })
  }
} 