// pages/api/linear.js
export default async function handler(req, res) {
  try {
    const { symbol, interval, from } = req.query;

    if (!symbol || !interval || !from) {
      return res.status(400).json({ error: "Missing symbol, interval, or from" });
    }

    const url = new URL("https://api.bybit.com/public/linear/kline");
    url.searchParams.set("symbol", symbol);
    url.searchParams.set("interval", interval);
    url.searchParams.set("from", from);

    const response = await fetch(url.toString(), {
      headers: { accept: "application/json" },
    });

    const text = await response.text();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(response.status).send(text);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
