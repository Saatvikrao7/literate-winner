import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import https from 'https'

// Fetch a single symbol via YF v8 chart (no crumb needed)
function fetchYFChart(symbol) {
  return new Promise((resolve) => {
    const url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://finance.yahoo.com',
      },
    }, (res) => {
      let raw = ''
      res.on('data', c => { raw += c })
      res.on('end', () => {
        try {
          const json = JSON.parse(raw)
          const meta = json?.chart?.result?.[0]?.meta ?? {}
          const price = meta.regularMarketPrice ?? null
          const prev  = meta.previousClose ?? meta.chartPreviousClose ?? null
          const change = (price != null && prev != null) ? price - prev : null
          const changePct = (change != null && prev) ? (change / prev) * 100 : null
          resolve({
            symbol,
            regularMarketPrice:         price,
            regularMarketPreviousClose: prev,
            regularMarketChange:        change,
            regularMarketChangePercent: changePct,
            currency:   meta.currency ?? 'USD',
            marketState: meta.marketState ?? 'CLOSED',
            shortName:  meta.shortName ?? symbol,
          })
        } catch {
          resolve({ symbol })
        }
      })
    })
    req.on('error', () => resolve({ symbol }))
    req.setTimeout(8000, () => { req.destroy(); resolve({ symbol }) })
  })
}

export default defineConfig({
  plugins: [react()],
  server: {
    configureServer(server) {
      server.middlewares.use('/api/markets', async (req, res) => {
        const qs      = req.url.split('?')[1] ?? ''
        const symbols = new URLSearchParams(qs).get('symbols') ?? ''
        const list    = symbols.split(',').map(s => s.trim()).filter(Boolean)

        try {
          const quotes = await Promise.all(list.map(fetchYFChart))
          const payload = { quoteResponse: { result: quotes, error: null } }
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Cache-Control', 'no-store')
          res.end(JSON.stringify(payload))
        } catch (e) {
          console.error('[/api/markets]', e.message)
          res.statusCode = 502
          res.end(JSON.stringify({ error: e.message }))
        }
      })
    },
  },
})
