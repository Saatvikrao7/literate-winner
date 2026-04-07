import { useState, useEffect } from 'react'
import { Globe, TrendingUp, TrendingDown, Radio } from 'lucide-react'

export default function Header({ selectedRegion, mode, onModeChange, marketData }) {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // Market summary numbers for header
  const upCount   = marketData?.filter(m => m.up === true).length  ?? 0
  const downCount = marketData?.filter(m => m.up === false).length ?? 0
  const avgPct    = marketData?.length
    ? (marketData.reduce((s, m) => s + (m.pct ?? 0), 0) / marketData.length)
    : null

  return (
    <header className="flex items-center justify-between px-4 border-b border-border flex-shrink-0 z-10 gap-3"
      style={{ height: 46, background: 'rgba(10,10,20,0.95)', backdropFilter: 'blur(12px)' }}>

      {/* Logo */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div style={{
          width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Globe size={14} color="#fff" />
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>
          World<span style={{ color: '#818cf8' }}>Pulse</span>
        </span>
      </div>

      {/* Mode tabs */}
      <div className="flex items-center gap-0.5 flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 3 }}>
        <button
          onClick={() => onModeChange('news')}
          className="flex items-center gap-1.5 transition-all"
          style={{
            padding: '4px 12px', borderRadius: 8,
            fontSize: 11, fontFamily: 'monospace', fontWeight: 600,
            ...(mode === 'news'
              ? { background: 'linear-gradient(135deg,#4f46e5,#6366f1)', color: '#fff', boxShadow: '0 2px 8px #4f46e540' }
              : { color: 'rgba(255,255,255,0.38)' }),
          }}
        >
          <Globe size={10} />
          World News
        </button>
        <button
          onClick={() => onModeChange('markets')}
          className="flex items-center gap-1.5 transition-all"
          style={{
            padding: '4px 12px', borderRadius: 8,
            fontSize: 11, fontFamily: 'monospace', fontWeight: 600,
            ...(mode === 'markets'
              ? { background: 'linear-gradient(135deg,#15803d,#22c55e)', color: '#fff', boxShadow: '0 2px 8px #22c55e40' }
              : { color: 'rgba(255,255,255,0.38)' }),
          }}
        >
          <TrendingUp size={10} />
          Markets
        </button>
      </div>

      {/* Center context */}
      <div className="hidden sm:flex items-center gap-3 flex-1 overflow-hidden">
        {mode === 'news' ? (
          <>
            <span className="flex items-center gap-1.5 text-[10px] font-mono"
              style={{ color: '#22c55e', background: '#22c55e12', border: '1px solid #22c55e25', borderRadius: 4, padding: '2px 7px', flexShrink: 0 }}>
              <span className="pulse-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              LIVE NEWS
            </span>
            {selectedRegion.id !== 'all' && (
              <span className="text-[11px] font-mono truncate" style={{ color: selectedRegion.color }}>
                {selectedRegion.name}
              </span>
            )}
          </>
        ) : (
          marketData?.length > 0 && (
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[10px] font-mono"
                style={{ color: '#22c55e', background: '#22c55e12', border: '1px solid #22c55e25', borderRadius: 4, padding: '2px 7px' }}>
                <span className="pulse-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                LIVE MARKETS
              </span>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span style={{ color: '#22c55e' }} className="flex items-center gap-1">
                  <TrendingUp size={10} /> {upCount} up
                </span>
                <span style={{ color: '#ef4444' }} className="flex items-center gap-1">
                  <TrendingDown size={10} /> {downCount} down
                </span>
                {avgPct != null && (
                  <span style={{ color: avgPct >= 0 ? '#22c55e' : '#ef4444', fontWeight: 700 }}>
                    avg {avgPct >= 0 ? '+' : ''}{avgPct.toFixed(2)}%
                  </span>
                )}
              </div>
            </div>
          )
        )}
      </div>

      {/* UTC clock */}
      <div className="flex-shrink-0 ml-auto"
        style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.05em' }}>
        {time.toUTCString().slice(17, 25)}
        <span style={{ color: 'rgba(255,255,255,0.18)', marginLeft: 3 }}>UTC</span>
      </div>
    </header>
  )
}
