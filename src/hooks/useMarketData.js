import { useState, useEffect, useCallback, useRef } from 'react'
import { MARKETS } from '../data/markets'

const REFRESH_MS = 30_000
const HISTORY_LEN = 24 // sparkline points

const BASE_PRICES = {
  '^GSPC':    5700,
  '^IXIC':   18200,
  '^DJI':    42500,
  'VOO':       522,
  '^NSEI':   23200,
  '^BSESN':  76800,
  '^FTSE':    8650,
  '^GDAXI':  22100,
  '^FCHI':    7900,
  '^N225':   37500,
  '^HSI':    22500,
  '000001.SS': 3350,
  '^KS11':    2650,
  '^AXJO':    8250,
  '^GSPTSE': 24500,
  '^BVSP':  129000,
  '^STI':     3850,
  '^J203.JO': 3050,
}

function fmt(n, decimals = 2) {
  if (n == null || isNaN(n)) return '—'
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function pushHistory(histRef, symbol, price) {
  const arr = histRef.current[symbol] ?? []
  arr.push(price)
  if (arr.length > HISTORY_LEN) arr.splice(0, arr.length - HISTORY_LEN)
  histRef.current[symbol] = arr
}

function enrich(m, price, change, pct, prev, state, histRef) {
  if (price != null) pushHistory(histRef, m.symbol, price)
  return {
    ...m,
    price,
    change,
    pct,
    prev,
    state: state ?? 'CLOSED',
    currency: m.currency ?? 'USD',
    up: pct != null ? pct >= 0 : null,
    priceStr:  price  != null ? fmt(price)                              : '—',
    changeStr: change != null ? (change >= 0 ? '+' : '') + fmt(change)  : '—',
    pctStr:    pct    != null ? (pct    >= 0 ? '+' : '') + fmt(pct) + '%' : '—',
    history: [...(histRef.current[m.symbol] ?? [])],
    simulated: state === 'SIMULATED',
  }
}

function simulateMarkets(prevPrices, histRef) {
  return MARKETS.map(m => {
    const base  = prevPrices.current[m.symbol] ?? BASE_PRICES[m.symbol] ?? 1000
    const move  = base * (Math.random() * 0.006 - 0.003)
    const price = +(base + move).toFixed(2)
    prevPrices.current[m.symbol] = price
    const prev   = BASE_PRICES[m.symbol] ?? price
    const change = +(price - prev).toFixed(2)
    const pct    = +((change / prev) * 100).toFixed(2)
    return enrich(m, price, change, pct, prev, 'SIMULATED', histRef)
  })
}

export function useMarketData() {
  const [data,        setData]        = useState([])
  const [loading,     setLoading]     = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const prevPrices = useRef({ ...BASE_PRICES })
  const histRef    = useRef({})

  const fetch_ = useCallback(async () => {
    setLoading(true)
    try {
      const symbols = MARKETS.map(m => m.symbol).join(',')
      const res = await fetch(`/api/markets?symbols=${encodeURIComponent(symbols)}`, {
        signal: AbortSignal.timeout(10_000),
      })

      let quotes = []
      if (res.ok) {
        const json = await res.json()
        quotes = json.quoteResponse?.result ?? []
      }

      const gotRealData = quotes.some(q => q.regularMarketPrice != null)

      if (gotRealData) {
        const enriched = MARKETS.map(m => {
          const q      = quotes.find(q => q.symbol === m.symbol) ?? {}
          const price  = q.regularMarketPrice         ?? null
          const change = q.regularMarketChange        ?? null
          const pct    = q.regularMarketChangePercent ?? null
          const prev   = q.regularMarketPreviousClose ?? null
          const state  = q.marketState                ?? 'CLOSED'
          if (price != null) prevPrices.current[m.symbol] = price
          return enrich(m, price, change, pct, prev, state, histRef)
        })
        setData(enriched)
      } else {
        setData(simulateMarkets(prevPrices, histRef))
      }
      setLastUpdated(new Date())
    } catch {
      setData(simulateMarkets(prevPrices, histRef))
      setLastUpdated(new Date())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch_()
    const id = setInterval(fetch_, REFRESH_MS)
    return () => clearInterval(id)
  }, [fetch_])

  return { data, loading, lastUpdated, refetch: fetch_ }
}
