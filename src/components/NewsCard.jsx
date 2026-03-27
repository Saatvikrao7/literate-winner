import { ExternalLink, Clock, User } from 'lucide-react'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function NewsCard({ article, accentColor }) {
  const fields = article.fields ?? {}
  const headline = fields.headline || article.webTitle
  const trail = fields.trailText
  const thumbnail = fields.thumbnail
  const byline = fields.byline
  const published = article.webPublicationDate
  const url = article.webUrl
  const section = article.sectionName

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-panel border border-border rounded-lg overflow-hidden hover:border-white/20 transition-all duration-200 hover:shadow-lg hover:shadow-black/40"
    >
      {thumbnail && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={thumbnail}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-panel/80 to-transparent" />
          <span
            className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-mono rounded uppercase tracking-wider text-black font-semibold"
            style={{ background: accentColor ?? '#6366f1' }}
          >
            {section}
          </span>
        </div>
      )}

      <div className="p-3 space-y-2">
        {!thumbnail && (
          <span
            className="inline-block px-2 py-0.5 text-[10px] font-mono rounded uppercase tracking-wider text-black font-semibold"
            style={{ background: accentColor ?? '#6366f1' }}
          >
            {section}
          </span>
        )}

        <h3 className="text-sm font-semibold text-white/90 leading-snug group-hover:text-white transition-colors line-clamp-3">
          {headline}
        </h3>

        {trail && (
          <p
            className="text-xs text-white/50 leading-relaxed line-clamp-2"
            dangerouslySetInnerHTML={{ __html: trail }}
          />
        )}

        <div className="flex items-center gap-3 pt-1">
          {byline && (
            <span className="flex items-center gap-1 text-[10px] text-white/30 font-mono truncate">
              <User size={10} />
              {byline}
            </span>
          )}
          {published && (
            <span className="flex items-center gap-1 text-[10px] text-white/30 font-mono ml-auto flex-shrink-0">
              <Clock size={10} />
              {timeAgo(published)}
            </span>
          )}
          <ExternalLink size={10} className="text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
        </div>
      </div>
    </a>
  )
}
