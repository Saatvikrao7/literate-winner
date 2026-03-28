import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Server-side Yahoo Finance crumb cache
let yfCookie = ''
let yfCrumb  = ''
let crumbAt  = 0
const CRUMB_TTL = 25 * 60 * 1000 // 25 min

async function getYFCrumb() {
  if (yfCrumb && Date.now() - crumbAt < CRUMB_TTL) return { cookie: yfCookie, crumb: yfCrumb }

  try {
    // Step 1: get session cookie
    const r1 = await fetch('https://fc.yahoo.com/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
      redirect: 'follow',
    })
    const sc = r1.headers.get('set-cookie') ?? ''
    yfCookie = sc.split(';')[0]

    // Step 2: get crumb using the cookie
    const r2 = await fetch('https://query1.finance.yahoo.com/v1/test/getcrumb', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Cookie': yfCookie,
      },
    })
    const text = await r2.text()
    if (text && text.length < 50) {
      yfCrumb = text
      crumbAt = Date.now()
    }
  } catch (e) {
    console.warn('[YF crumb]', e.message)
  }

  return { cookie: yfCookie, crumb: yfCrumb }
}

export default defineConfig({
  plugins: [react()],
  server: {
    configureServer(server) {
      // Custom /api/markets endpoint — handles YF cookie+crumb server-side
      server.middlewares.use('/api/markets', async (req, res) => {
        const qs  = req.url.split('?')[1] ?? ''
        const params = new URLSearchParams(qs)
        const symbols = params.get('symbols') ?? ''

        try {
          const { cookie, crumb } = await getYFCrumb()

          const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbols)}&crumb=${encodeURIComponent(crumb)}&fields=regularMarketPrice,regularMarketChange,regularMarketChangePercent,regularMarketPreviousClose,shortName,currency,marketState`

          const r = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Cookie': cookie,
              'Accept': 'application/json',
            },
          })

          if (!r.ok) throw new Error(`YF HTTP ${r.status}`)

          const data = await r.json()
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Cache-Control', 'no-store')
          res.end(JSON.stringify(data))
        } catch (e) {
          console.error('[/api/markets]', e.message)
          res.statusCode = 502
          res.end(JSON.stringify({ error: e.message }))
        }
      })
    },
  },
})
