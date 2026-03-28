import { useState, useEffect, useCallback } from 'react'
import { MARKETS, ALL_SYMBOLS } from '../data/markets'

const REFRESH_MS = 60_000 // refresh every 60 s

function fmt(n, decimals = 2) {
  if (n == null || isNaN(n)) return '—'
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export function useMarketData() {
  const [data,        setData]        = useState([])   // enriched market objects
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetch_ = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Vite proxies /yf → https://query1.finance.yahoo.com
      const url = `/yf/v7/finance/quote?symbols=${encodeURIComponent(ALL_SYMBOLS)}&fields=regularMarketPrice,regularMarketChange,regularMarketChangePercent,regularMarketPreviousClose,shortName,currency,marketState`
      const res  = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()

      const quotes = json.quoteResponse?.result ?? []

      // Merge Yahoo quotes back onto our MARKETS definitions
      const enriched = MARKETS.map(m => {
        const q = quotes.find(q => q.symbol === m.symbol) ?? {}
        const price   = q.regularMarketPrice         ?? null
        const change  = q.regularMarketChange        ?? null
        const pct     = q.regularMarketChangePercent ?? null
        const prev    = q.regularMarketPreviousClose ?? null
        const state   = q.marketState                ?? 'CLOSED'

        return {
          ...m,
          price,
          change,
          pct,
          prev,
          state,
          currency: q.currency ?? 'USD',
          up: pct != null ? pct >= 0 : null,
          // Formatted strings
          priceStr:  price  != null ? fmt(price)        : '—',
          changeStr: change != null ? (change >= 0 ? '+' : '') + fmt(change) : '—',
          pctStr:    pct    != null ? (pct    >= 0 ? '+' : '') + fmt(pct) + '%' : '—',
        }
      })

      setData(enriched)
      setLastUpdated(new Date())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch_()
    const id = setInterval(fetch_, REFRESH_MS)
    return () => clearInterval(id)
  }, [fetch_])

  return { data, loading, error, lastUpdated, refetch: fetch_ }
}
