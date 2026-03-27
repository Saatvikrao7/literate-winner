import { CATEGORIES, REGIONS } from '../data/regions'

export default function CategoryBar({ selectedCategory, onCategorySelect, selectedRegion, onRegionSelect }) {
  return (
    <div className="flex flex-col gap-2 px-3 py-2 border-t border-border bg-panel/60 backdrop-blur-sm flex-shrink-0">
      {/* Category row */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-mono text-white/25 uppercase tracking-widest flex-shrink-0 mr-1">Category</span>
        {CATEGORIES.map(cat => {
          const active = selectedCategory.id === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs flex-shrink-0 transition-all duration-150 border"
              style={{
                borderColor: active ? cat.color : 'transparent',
                background: active ? `${cat.color}22` : 'transparent',
                color: active ? cat.color : 'rgba(255,255,255,0.35)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: cat.color, opacity: active ? 1 : 0.4 }}
              />
              {cat.name}
            </button>
          )
        })}
      </div>

      {/* Region row */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-mono text-white/25 uppercase tracking-widest flex-shrink-0 mr-1">Region</span>
        {REGIONS.map(reg => {
          const active = selectedRegion.id === reg.id
          return (
            <button
              key={reg.id}
              onClick={() => onRegionSelect(reg)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs flex-shrink-0 transition-all duration-150 border"
              style={{
                borderColor: active ? reg.color : 'transparent',
                background: active ? `${reg.color}22` : 'transparent',
                color: active ? reg.color : 'rgba(255,255,255,0.35)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: reg.color, opacity: active ? 1 : 0.4 }}
              />
              {reg.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
