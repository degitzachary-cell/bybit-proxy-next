// /api/linear.js — Edge Function (no Next.js, no vercel.json needed)
export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol   = searchParams.get('symbol');
    const interval = searchParams.get('interval');
    const from     = searchParams.get('from'); // seconds since epoch

    if (!symbol || !interval || !from) {
      return new Response(JSON.stringify({ error: 'Missing symbol/interval/from' }), {
        status: 400,
        headers: { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*' }
      });
    }

    const bybit = new URL('https://api.bybit.com/public/linear/kline');
    bybit.searchParams.set('symbol', symbol);
    bybit.searchParams.set('interval', interval); // 1,3,5,15,30,60,120,240,360,720,D,W,M
    bybit.searchParams.set('from', from);

    const r = await fetch(bybit.toString(), { headers: { accept: 'application/json' }, cache: 'no-store' });
    const text = await r.text();

    return new Response(text, {
      status: r.status,
      headers: { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*' }
    });
  }
}
