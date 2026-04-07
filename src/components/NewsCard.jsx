import { ExternalLink, Clock, User } from 'lucide-react'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function NewsCard({ article, accentColor }) {
  const fields    = article.fields ?? {}
  const headline  = fields.headline || article.webTitle
  const trail     = fields.trailText
  const thumbnail = fields.thumbnail
  const byline    = fields.byline
  const published = article.webPublicationDate
  const url       = article.webUrl
  const section   = article.sectionName
  const color     = accentColor ?? '#6366f1'

  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="group block rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: '#10101e',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = color + '50'
        e.currentTarget.style.transform = 'translateY(-1px)'
        e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px ${color}20`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.4)'
      }}
    >
      {thumbnail && (
        <div style={{ position: 'relative', height: 148, overflow: 'hidden' }}>
          <img src={thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease', display: 'block' }}
            className="group-hover:scale-105" />
          {/* Gradient */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(16,16,30,0.95) 100%)' }} />
          {/* Section badge */}
          <span style={{
            position: 'absolute', top: 10, left: 10,
            fontSize: 9, fontFamily: 'monospace', fontWeight: 700,
            padding: '3px 7px', borderRadius: 5,
            background: color, color: '#000',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            {section}
          </span>
        </div>
      )}

      <div style={{ padding: '12px 13px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {!thumbnail && (
          <span style={{
            display: 'inline-block', fontSize: 9, fontFamily: 'monospace', fontWeight: 700,
            padding: '3px 7px', borderRadius: 5,
            background: color + '22', color: color,
            border: `1px solid ${color}40`,
            textTransform: 'uppercase', letterSpacing: '0.08em',
            marginBottom: 2,
          }}>
            {section}
          </span>
        )}

        <h3 style={{
          fontSize: 13, fontWeight: 600, lineHeight: 1.45,
          color: 'rgba(255,255,255,0.9)',
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {headline}
        </h3>

        {trail && (
          <p style={{
            fontSize: 11, color: 'rgba(255,255,255,0.42)', lineHeight: 1.6,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}
            dangerouslySetInnerHTML={{ __html: trail }} />
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 4 }}>
          {byline && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', overflow: 'hidden', flex: 1 }}>
              <User size={9} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{byline}</span>
            </span>
          )}
          {published && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', flexShrink: 0, marginLeft: 'auto' }}>
              <Clock size={9} />
              {timeAgo(published)}
            </span>
          )}
          <ExternalLink size={10} style={{ color: 'rgba(255,255,255,0.15)', flexShrink: 0, transition: 'color 0.15s' }}
            className="group-hover:text-white/50" />
        </div>
      </div>
    </a>
  )
}
