// Scrolling financial ticker — shown below the header in Markets mode
export default function TickerBar({ data }) {
  if (!data || data.length === 0) return null

  const items = [...data, ...data] // duplicate for seamless loop

  return (
    <div
      style={{
        background: '#06060f',
        borderBottom: '1px solid #1a1a2e',
        height: 30,
        overflow: 'hidden',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* Left fade */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 48,
        background: 'linear-gradient(90deg,#06060f,transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      {/* Label */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 3,
        display: 'flex', alignItems: 'center',
        background: '#06060f',
        paddingLeft: 12, paddingRight: 10,
        borderRight: '1px solid #1a1a2e',
        gap: 5,
      }}>
        <span className="pulse-dot" style={{
          width: 5, height: 5, borderRadius: '50%', background: '#22c55e', flexShrink: 0,
        }} />
        <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', fontWeight: 700 }}>
          MARKETS
        </span>
      </div>

      {/* Scrolling track */}
      <div style={{ paddingLeft: 92 }}>
        <div className="ticker-track">
          {items.map((m, i) => {
            const color = m.up === true ? '#22c55e' : m.up === false ? '#ef4444' : '#6b7280'
            const arrow = m.up === true ? '▲' : m.up === false ? '▼' : '—'
            return (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '0 18px', fontSize: 11, fontFamily: 'ui-monospace, monospace',
                borderRight: '1px solid rgba(255,255,255,0.05)',
              }}>
                <span style={{ fontSize: 13, lineHeight: 1 }}>{m.flag}</span>
                <span style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.02em' }}>{m.name}</span>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>{m.priceStr}</span>
                <span style={{ color, fontWeight: 600, fontSize: 10 }}>
                  {arrow} {m.pctStr}
                </span>
              </span>
            )
          })}
        </div>
      </div>

      {/* Right fade */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 48,
        background: 'linear-gradient(270deg,#06060f,transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />
    </div>
  )
}
