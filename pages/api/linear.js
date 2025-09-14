// Next.js API (Edge) — Bybit v5 klines
export const config = { runtime: 'edge', regions: ['hnd1','sin1','fra1'] };

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol   = searchParams.get('symbol');   // e.g. BTCUSDT
    const interval = searchParams.get('interval'); // 1,3,5,15,30,60,120,240,360,720,D,W,M
    const fromSec  = searchParams.get('from');     // epoch seconds

    if (!symbol || !interval || !fromSec) {
      return new Response(JSON.stringify({ error: 'Missing symbol/interval/from (seconds)' }), {
        status: 400,
        headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' }
      });
    }

    // v5 requires milliseconds for start time
    const startMs = String(Number(fromSec) * 1000);

    const u = new URL('https://api.bybit.com/v5/market/kline');
    u.searchParams.set('category', 'linear');
    u.searchParams.set('symbol', symbol);
    u.searchParams.set('interval', interval);
    u.searchParams.set('start', startMs);
    u.searchParams.set('limit', '1000'); // optional, but useful

    const r = await fetch(u.toString(), { headers: { accept: 'application/json' }, cache: 'no-store' });
    const text = await r.text();

    return new Response(text, {
      status: r.status,
      headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' }
    });
  }
}
