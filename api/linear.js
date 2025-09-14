// api/linear.js
export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol   = searchParams.get('symbol');
    const interval = searchParams.get('interval');
    const from     = searchParams.get('from');

    if (!symbol || !interval || !from) {
      return new Response(JSON.stringify({ error: 'Missing symbol/interval/from' }), {
        status: 400,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'access-control-allow-origin': '*'
        }
      });
    }

    const url = new URL('https://api.bybit.com/public/linear/kline');
    url.searchParams.set('symbol', symbol);
    url.searchParams.set('interval', interval);
    url.searchParams.set('from', from);

    const r = await fetch(url.toString(), {
      headers: { accept: 'application/json' },
      cache: 'no-store'
    });

    const text = await r.text();
    return new Response(text, {
      status: r.status,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'access-control-allow-origin': '*'
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'access-control-allow-origin': '*'
      }
    });
  }
}
