import { RefreshCw, TrendingUp, TrendingDown, Minus, Clock, Zap } from 'lucide-react'

const STATE_LABEL = { REGULAR: 'OPEN', PRE: 'PRE', POST: 'AFTER', CLOSED: 'CLOSED', SIMULATED: 'SIM' }
const STATE_COLOR = { REGULAR: '#22c55e', PRE: '#eab308', POST: '#f97316', CLOSED: '#6b7280', SIMULATED: '#eab308' }

function Sparkline({ history, up }) {
  if (!history || history.length < 2) return <div style={{ width: 52, height: 22 }} />
  const min = Math.min(...history)
  const max = Math.max(...history)
  const range = max - min || 1
  const W = 52, H = 22
  const pts = history
    .map((v, i) => `${(i / (history.length - 1)) * W},${H - ((v - min) / range) * (H - 2) - 1}`)
    .join(' ')
  const color = up === true ? '#22c55e' : up === false ? '#ef4444' : '#6b7280'
  return (
    <svg width={W} height={H} style={{ overflow: 'visible', flexShrink: 0 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
    </svg>
  )
}

function MarketRow({ m }) {
  const up    = m.up === true
  const down  = m.up === false
  const color = up ? '#22c55e' : down ? '#ef4444' : '#6b7280'
  const stateColor = STATE_COLOR[m.state] ?? '#6b7280'

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group">
      <span className="text-sm flex-shrink-0 leading-none">{m.flag}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-white/90 truncate">{m.name}</span>
          <span className="text-[8px] font-mono px-1 rounded leading-4"
            style={{ background: stateColor + '22', color: stateColor }}>
            {STATE_LABEL[m.state] ?? m.state}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] font-mono text-white/30">{m.country}</span>
          <span className="text-[10px] font-mono font-semibold text-white/70">{m.priceStr}</span>
        </div>
      </div>

      {/* Sparkline */}
      <Sparkline history={m.history} up={m.up} />

      {/* Change */}
      <div className="text-right flex-shrink-0 w-16">
        <div className="flex items-center justify-end gap-0.5">
          {up   && <TrendingUp  size={9} style={{ color }} />}
          {down && <TrendingDown size={9} style={{ color }} />}
          {!up && !down && <Minus size={9} className="text-white/30" />}
          <span className="text-[11px] font-mono font-semibold" style={{ color }}>{m.pctStr}</span>
        </div>
        <div className="text-[9px] font-mono text-white/30 text-right">{m.changeStr}</div>
      </div>
    </div>
  )
}

function MoverCard({ m, rank }) {
  const up    = m.up === true
  const color = up ? '#22c55e' : '#ef4444'
  return (
    <div className="flex-1 min-w-0 p-2 rounded-lg border"
      style={{ borderColor: color + '30', background: color + '0a' }}>
      <div className="flex items-center gap-1 mb-1">
        <span className="text-xs leading-none">{m.flag}</span>
        <span className="text-[9px] font-mono text-white/50 truncate">{m.name}</span>
      </div>
      <div className="text-[12px] font-mono font-bold" style={{ color }}>{m.pctStr}</div>
      <div className="text-[9px] font-mono text-white/30">{m.priceStr}</div>
    </div>
  )
}

const GROUPS = [
  { label: '🇺🇸 Americas',    ids: ['sp500','nasdaq','dow','voo','tsx','bovespa'] },
  { label: '🇮🇳 South Asia',  ids: ['nifty','sensex'] },
  { label: '🌍 Europe',       ids: ['ftse','dax','cac40'] },
  { label: '🌏 Asia Pacific', ids: ['nikkei','hsi','sse','kospi','asx','sti'] },
  { label: '🌍 Africa',       ids: ['jse'] },
]

export default function MarketPanel({ data, loading, lastUpdated, refetch }) {
  const isSimulated = data.length > 0 && data[0]?.simulated

  // Sentiment
  const upCount   = data.filter(m => m.up === true).length
  const downCount = data.filter(m => m.up === false).length
  const total     = upCount + downCount || 1
  const bullish   = upCount / total

  // Top movers
  const sorted  = [...data].filter(m => m.pct != null).sort((a, b) => b.pct - a.pct)
  const gainers = sorted.slice(0, 3)
  const losers  = sorted.slice(-3).reverse()

  // Weighted avg change (equally-weighted for simplicity)
  const avgPct = data.length
    ? (data.reduce((s, m) => s + (m.pct ?? 0), 0) / data.length).toFixed(2)
    : null

  return (
    <div className="flex flex-col h-full bg-surface">

      {/* ── Header ── */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-green-400" />
          <span className="text-xs font-mono text-white/70 font-semibold">Global Markets</span>
          {isSimulated && (
            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded"
              style={{ background: '#eab30818', color: '#eab308', border: '1px solid #eab30830' }}>
              SIMULATED
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="flex items-center gap-1 text-[10px] font-mono text-white/20">
              <Clock size={9} />
              {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          )}
          <button onClick={refetch} disabled={loading}
            className="p-1 rounded text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors disabled:opacity-40">
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ── Sentiment strip ── */}
      {data.length > 0 && (
        <div className="px-4 py-2.5 border-b border-border flex-shrink-0 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono text-white/35 uppercase tracking-wider">Sentiment</span>
              <span className="text-[9px] font-mono text-green-400">{upCount} up</span>
              <span className="text-[9px] font-mono text-red-400">{downCount} down</span>
            </div>
            {avgPct != null && (
              <span className="text-[10px] font-mono font-semibold"
                style={{ color: +avgPct >= 0 ? '#22c55e' : '#ef4444' }}>
                avg {+avgPct >= 0 ? '+' : ''}{avgPct}%
              </span>
            )}
          </div>
          <div className="h-2 rounded-full overflow-hidden flex gap-px"
            style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${bullish * 100}%`, background: 'linear-gradient(90deg,#16a34a,#22c55e)' }} />
            <div className="h-full rounded-full flex-1 transition-all duration-700"
              style={{ background: 'linear-gradient(90deg,#ef4444,#dc2626)' }} />
          </div>
        </div>
      )}

      {/* ── Top Movers ── */}
      {gainers.length > 0 && (
        <div className="px-3 py-2.5 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-1.5 mb-2">
            <Zap size={10} className="text-yellow-400" />
            <span className="text-[9px] font-mono text-white/35 uppercase tracking-wider">Top Movers</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <div className="text-[8px] font-mono text-green-400/60 uppercase tracking-wider px-0.5">Gainers</div>
              {gainers.map((m, i) => <MoverCard key={m.id} m={m} rank={i+1} />)}
            </div>
            <div className="space-y-1.5">
              <div className="text-[8px] font-mono text-red-400/60 uppercase tracking-wider px-0.5">Losers</div>
              {losers.map((m, i) => <MoverCard key={m.id} m={m} rank={i+1} />)}
            </div>
          </div>
        </div>
      )}

      {/* ── Index list ── */}
      <div className="flex-1 overflow-y-auto scrollbar-thin py-1">
        {loading && data.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <RefreshCw size={16} className="text-white/20 animate-spin" />
            <span className="text-xs font-mono text-white/25">Loading indices…</span>
          </div>
        )}
        {GROUPS.map(group => {
          const items = group.ids.map(id => data.find(m => m.id === id)).filter(Boolean)
          if (!items.length) return null
          return (
            <div key={group.label} className="mb-1">
              <div className="px-4 pt-2 pb-0.5">
                <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{group.label}</span>
              </div>
              {items.map(m => <MarketRow key={m.id} m={m} />)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
