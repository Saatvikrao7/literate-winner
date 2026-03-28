import { RefreshCw, TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react'

const STATE_LABEL = { REGULAR: 'OPEN', PRE: 'PRE', POST: 'AFTER', CLOSED: 'CLOSED' }
const STATE_COLOR = { REGULAR: '#22c55e', PRE: '#eab308', POST: '#f97316', CLOSED: '#6b7280' }

function MarketRow({ m }) {
  const up   = m.up === true
  const down = m.up === false
  const color = up ? '#22c55e' : down ? '#ef4444' : '#6b7280'
  const stateColor = STATE_COLOR[m.state] ?? '#6b7280'

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
      {/* Flag + name */}
      <span className="text-base flex-shrink-0">{m.flag}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-white/90 truncate">{m.name}</span>
          <span
            className="text-[9px] font-mono px-1 rounded"
            style={{ background: stateColor + '22', color: stateColor }}
          >
            {STATE_LABEL[m.state] ?? m.state}
          </span>
        </div>
        <span className="text-[10px] font-mono text-white/30">{m.country}</span>
      </div>

      {/* Price + change */}
      <div className="text-right flex-shrink-0">
        <div className="text-xs font-mono font-semibold text-white/90">{m.priceStr}</div>
        <div className="flex items-center justify-end gap-0.5">
          {up   && <TrendingUp  size={9} style={{ color }} />}
          {down && <TrendingDown size={9} style={{ color }} />}
          {!up && !down && <Minus size={9} className="text-white/30" />}
          <span className="text-[10px] font-mono" style={{ color }}>{m.pctStr}</span>
        </div>
      </div>
    </div>
  )
}

export default function MarketPanel({ data, loading, error, lastUpdated, refetch }) {
  // Group by rough region
  const regions = [
    { label: '🇺🇸 United States', ids: ['sp500','nasdaq','dow','voo'] },
    { label: '🇮🇳 India',         ids: ['nifty','sensex'] },
    { label: '🌍 Europe',         ids: ['ftse','dax','cac40'] },
    { label: '🌏 Asia Pacific',   ids: ['nikkei','hsi','sse','kospi','asx','sti'] },
    { label: '🌎 Americas',       ids: ['tsx','bovespa'] },
    { label: '🌍 Africa',         ids: ['jse'] },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-green-400" />
          <span className="text-xs font-mono text-white/60">Global Markets</span>
          {!loading && data.length > 0 && data[0]?.simulated && (
            <span className="text-[9px] font-mono px-1 rounded" style={{ background: '#eab30822', color: '#eab308' }}>SIMULATED</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="flex items-center gap-1 text-[10px] font-mono text-white/25 hidden sm:flex">
              <Clock size={9} />
              {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button
            onClick={refetch}
            disabled={loading}
            className="p-1 rounded text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors disabled:opacity-40"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Market summary bar */}
      {data.length > 0 && (() => {
        const up   = data.filter(m => m.up === true).length
        const down = data.filter(m => m.up === false).length
        const total = up + down || 1
        return (
          <div className="px-4 py-2 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-white/40">Market Sentiment</span>
              <span className="text-[10px] font-mono text-green-400">{up} up</span>
              <span className="text-[10px] font-mono text-red-400">{down} down</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden flex">
              <div className="h-full bg-green-500 transition-all" style={{ width: `${(up/total)*100}%` }} />
              <div className="h-full bg-red-500 transition-all"   style={{ width: `${(down/total)*100}%` }} />
            </div>
          </div>
        )
      })()}

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin py-1">
        {loading && data.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <RefreshCw size={18} className="text-white/20 animate-spin" />
            <span className="text-xs font-mono text-white/30">Fetching market data…</span>
          </div>
        )}

        {/* no error state — simulation always provides data */}

        {regions.map(region => {
          const items = region.ids.map(id => data.find(m => m.id === id)).filter(Boolean)
          if (!items.length) return null
          return (
            <div key={region.label} className="mb-2">
              <div className="px-4 py-1.5">
                <span className="text-[9px] font-mono text-white/25 uppercase tracking-widest">{region.label}</span>
              </div>
              {items.map(m => <MarketRow key={m.id} m={m} />)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
