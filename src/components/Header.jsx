import { useState, useEffect } from 'react'
import { Radio, Globe } from 'lucide-react'
import { REGIONS } from '../data/regions'

const TICKER_ITEMS = [
  'Click any country on the map to filter news by region',
  'Use the category bar below to filter by topic',
  'Powered by The Guardian open platform API',
  'Scroll and zoom the map to explore regions',
]

export default function Header({ selectedRegion }) {
  const [tickerIdx, setTickerIdx] = useState(0)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setTickerIdx(i => (i + 1) % TICKER_ITEMS.length), 6000)
    return () => clearInterval(id)
  }, [])

  const regionInfo = REGIONS.find(r => r.id === selectedRegion.id)

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-border bg-panel/80 backdrop-blur-sm flex-shrink-0 z-10">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <Globe size={16} className="text-indigo-400" />
        <span className="font-mono text-sm font-semibold tracking-tight text-white">
          World<span className="text-indigo-400">Pulse</span>
        </span>
      </div>

      {/* Center: Ticker */}
      <div className="hidden sm:flex items-center gap-2 flex-1 mx-6 overflow-hidden">
        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-400 font-mono text-[10px] flex-shrink-0">
          <Radio size={8} className="animate-pulse" />
          LIVE
        </span>
        <div className="overflow-hidden relative flex-1">
          <p
            key={tickerIdx}
            className="text-[11px] font-mono text-white/40 truncate animate-fade-in"
          >
            {TICKER_ITEMS[tickerIdx]}
          </p>
        </div>
      </div>

      {/* Right: Region pill + clock */}
      <div className="flex items-center gap-3">
        {regionInfo && regionInfo.id !== 'all' && (
          <span
            className="hidden sm:inline-block px-2 py-0.5 rounded font-mono text-[10px] font-semibold text-black"
            style={{ background: regionInfo.color }}
          >
            {regionInfo.name}
          </span>
        )}
        <span className="font-mono text-[11px] text-white/30">
          {time.toUTCString().slice(17, 25)} UTC
        </span>
      </div>
    </header>
  )
}
