import { RefreshCw, AlertCircle, Newspaper } from 'lucide-react'
import NewsCard from './NewsCard'

export default function NewsPanel({ articles, loading, error, lastUpdated, refetch, region, category }) {
  const accentColor = category.id !== 'all' ? category.color : region.color

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <Newspaper size={14} className="text-white/40" />
          <span className="text-xs font-mono text-white/60">
            {region.id === 'all' ? 'Global' : region.name}
            {category.id !== 'all' && (
              <> &mdash; <span style={{ color: category.color }}>{category.name}</span></>
            )}
          </span>
          {!loading && articles.length > 0 && (
            <span className="text-[10px] font-mono text-white/25 ml-1">({articles.length})</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-[10px] font-mono text-white/25 hidden sm:block">
              {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button
            onClick={refetch}
            disabled={loading}
            className="p-1 rounded text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors disabled:opacity-40"
            title="Refresh"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 scrollbar-thin">
        {loading && articles.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <RefreshCw size={20} className="text-white/20 animate-spin" />
            <span className="text-xs font-mono text-white/30">Fetching news…</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-950/30 border border-red-800/30 rounded-lg">
            <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-red-400 font-mono">Failed to load news</p>
              <p className="text-[11px] text-red-400/60 mt-1">{error}</p>
              <button
                onClick={refetch}
                className="mt-2 text-[11px] text-red-400 underline font-mono hover:text-red-300"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 gap-2">
            <Newspaper size={20} className="text-white/10" />
            <span className="text-xs font-mono text-white/25">No articles found</span>
          </div>
        )}

        {articles.map(article => (
          <NewsCard
            key={article.id}
            article={article}
            accentColor={accentColor}
          />
        ))}

        {loading && articles.length > 0 && (
          <div className="flex justify-center py-2">
            <RefreshCw size={14} className="text-white/20 animate-spin" />
          </div>
        )}
      </div>
    </div>
  )
}
