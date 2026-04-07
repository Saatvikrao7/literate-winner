import { useState, useEffect } from 'react'
import { RefreshCw, TrendingUp, TrendingDown, Clock, Zap, Activity } from 'lucide-react'
import { isMarketOpen, getMarketLocalTime, getMarketTimezone } from '../utils/marketHours'

// ── Sparkline (area + line) ──────────────────────────────────────────────────
function AreaSparkline({ history, up }) {
  if (!history || history.length < 2) return <div style={{ width: 58, height: 24 }} />
  const W = 58, H = 24
  const min = Math.min(...history)
  const max = Math.max(...history)
  const range = max - min || 0.001
  const toX = i => (i / (history.length - 1)) * W
  const toY = v => H - 2 - ((v - min) / range) * (H - 4)
  const linePts = history.map((v, i) => `${toX(i)},${toY(v)}`).join(' ')
  const areaPath = `M0,${toY(history[0])} ` +
    history.map((v, i) => `L${toX(i)},${toY(v)}`).join(' ') +
    ` L${W},${H} L0,${H} Z`
  const color = up === true ? '#22c55e' : up === false ? '#ef4444' : '#6b7280'
  const gid = `sg${up ? 'u' : 'd'}`
  return (
    <svg width={W} height={H} style={{ flexShrink: 0, overflow: 'visible' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gid})`} />
      <polyline points={linePts} fill="none" stroke={color}
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
    </svg>
  )
}

// ── Performance bar ───────────────────────────────────────────────────────────
function PerfBar({ pct, up }) {
  const width = Math.min(Math.abs(pct ?? 0) / 4 * 100, 100)
  const color = up === true ? '#22c55e' : up === false ? '#ef4444' : '#6b7280'
  return (
    <div style={{ width: 36, height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ width: `${width}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.6s ease' }} />
    </div>
  )
}

// ── Single market row ─────────────────────────────────────────────────────────
function MarketRow({ m, now }) {
  const up    = m.up === true
  const down  = m.up === false
  const color = up ? '#22c55e' : down ? '#ef4444' : '#6b7280'
  const open  = isMarketOpen(m.id, now)
  const localTime = getMarketLocalTime(m.id, now)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 8, transition: 'background 0.15s' }}
      className="hover:bg-white/5 group">

      {/* Flag + name */}
      <span style={{ fontSize: 15, lineHeight: 1, flexShrink: 0 }}>{m.flag}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.88)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'system-ui' }}>
            {m.name}
          </span>
          <span style={{
            fontSize: 8, fontFamily: 'monospace', padding: '1px 4px', borderRadius: 3,
            background: open ? '#22c55e18' : '#6b728018',
            color: open ? '#22c55e' : '#6b7280',
            border: `1px solid ${open ? '#22c55e30' : '#6b728030'}`,
            flexShrink: 0,
          }}>
            {open ? 'OPEN' : 'CLOSED'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 1 }}>
          <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.28)' }}>{m.country}</span>
          {localTime && <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.22)' }}>{localTime}</span>}
          <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{m.priceStr}</span>
        </div>
      </div>

      {/* Perf bar */}
      <PerfBar pct={m.pct} up={m.up} />

      {/* Sparkline */}
      <AreaSparkline history={m.history} up={m.up} />

      {/* % change */}
      <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
          {up   && <TrendingUp  size={9} color={color} />}
          {down && <TrendingDown size={9} color={color} />}
          <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color }}>{m.pctStr}</span>
        </div>
        <div style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textAlign: 'right' }}>{m.changeStr}</div>
      </div>
    </div>
  )
}

// ── Top mover card ────────────────────────────────────────────────────────────
function MoverCard({ m }) {
  const up    = m.up === true
  const color = up ? '#22c55e' : '#ef4444'
  return (
    <div style={{
      flex: 1, padding: '7px 8px', borderRadius: 8,
      background: color + '0c', border: `1px solid ${color}28`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
        <span style={{ fontSize: 12 }}>{m.flag}</span>
        <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</span>
      </div>
      <div style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 800, color, letterSpacing: '-0.01em' }}>{m.pctStr}</div>
      <div style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.28)', marginTop: 1 }}>{m.priceStr}</div>
    </div>
  )
}

// ── Group label with regional clock ──────────────────────────────────────────
const REGION_TZ = {
  '🇺🇸 Americas':    'America/New_York',
  '🇮🇳 South Asia':  'Asia/Kolkata',
  '🌍 Europe':       'Europe/London',
  '🌏 Asia Pacific': 'Asia/Tokyo',
  '🌍 Africa':       'Africa/Johannesburg',
}

function GroupHeader({ label, now }) {
  const tz = REGION_TZ[label]
  const localTime = tz ? new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }).format(now) : null
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px 3px' }}>
      <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {label}
      </span>
      {localTime && (
        <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', gap: 3 }}>
          <Clock size={8} />
          {localTime}
        </span>
      )}
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

// ── Main panel ────────────────────────────────────────────────────────────────
export default function MarketPanel({ data, loading, lastUpdated, refetch }) {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  const isSimulated = data.length > 0 && data[0]?.simulated
  const upCount     = data.filter(m => m.up === true).length
  const downCount   = data.filter(m => m.up === false).length
  const openCount   = data.filter(m => isMarketOpen(m.id, now)).length
  const total       = upCount + downCount || 1
  const bullish     = upCount / total
  const avgPct      = data.length
    ? data.reduce((s, m) => s + (m.pct ?? 0), 0) / data.length
    : null

  const sorted  = [...data].filter(m => m.pct != null).sort((a, b) => b.pct - a.pct)
  const gainers = sorted.slice(0, 3)
  const losers  = sorted.slice(-3).reverse()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0a0a16' }}>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', borderBottom: '1px solid #1a1a2e', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={13} color="#22c55e" />
          <span style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color: 'rgba(255,255,255,0.75)' }}>
            Global Markets
          </span>
          {isSimulated && (
            <span style={{
              fontSize: 8, fontFamily: 'monospace', padding: '2px 5px', borderRadius: 3,
              background: '#eab30815', color: '#eab308', border: '1px solid #eab30828',
            }}>SIM</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {openCount > 0 && (
            <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#22c55e', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span className="pulse-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              {openCount} open
            </span>
          )}
          {lastUpdated && (
            <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: 3 }}>
              <Clock size={8} />
              {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          )}
          <button onClick={refetch} disabled={loading}
            style={{ padding: 4, borderRadius: 5, background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', display: 'flex' }}
            className="hover:bg-white/5 transition-colors disabled:opacity-40">
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ── Sentiment bar ── */}
      {data.length > 0 && (
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #1a1a2e', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sentiment</span>
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#22c55e' }}>▲ {upCount}</span>
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#ef4444' }}>▼ {downCount}</span>
            </div>
            {avgPct != null && (
              <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: avgPct >= 0 ? '#22c55e' : '#ef4444' }}>
                {avgPct >= 0 ? '+' : ''}{avgPct.toFixed(2)}% avg
              </span>
            )}
          </div>
          <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', display: 'flex' }}>
            <div style={{
              height: '100%', borderRadius: '3px 0 0 3px', transition: 'width 0.8s ease',
              width: `${bullish * 100}%`,
              background: 'linear-gradient(90deg,#15803d,#22c55e)',
            }} />
            <div style={{
              height: '100%', flex: 1, borderRadius: '0 3px 3px 0',
              background: 'linear-gradient(90deg,#ef4444,#dc2626)',
            }} />
          </div>
        </div>
      )}

      {/* ── Top Movers ── */}
      {gainers.length > 0 && (
        <div style={{ padding: '10px 12px', borderBottom: '1px solid #1a1a2e', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
            <Zap size={10} color="#facc15" />
            <span style={{ fontSize: 9, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)' }}>
              Top Movers
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 8, fontFamily: 'monospace', color: '#22c55e60', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Gainers</span>
              {gainers.map(m => <MoverCard key={m.id} m={m} />)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 8, fontFamily: 'monospace', color: '#ef444460', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Losers</span>
              {losers.map(m => <MoverCard key={m.id} m={m} />)}
            </div>
          </div>
        </div>
      )}

      {/* ── Loading ── */}
      {loading && data.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 160, gap: 10 }}>
          <RefreshCw size={16} color="rgba(255,255,255,0.15)" className="animate-spin" />
          <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)' }}>Loading indices…</span>
        </div>
      )}

      {/* ── Indices list ── */}
      <div style={{ flex: 1, overflowY: 'auto' }} className="scrollbar-thin">
        {GROUPS.map(group => {
          const items = group.ids.map(id => data.find(m => m.id === id)).filter(Boolean)
          if (!items.length) return null
          return (
            <div key={group.label}>
              <GroupHeader label={group.label} now={now} />
              {items.map(m => <MarketRow key={m.id} m={m} now={now} />)}
            </div>
          )
        })}
        <div style={{ height: 12 }} />
      </div>
    </div>
  )
}
