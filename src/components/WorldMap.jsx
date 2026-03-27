import { useState, memo } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  ZoomableGroup,
} from 'react-simple-maps'
import { COUNTRY_REGION_MAP, REGIONS } from '../data/regions'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const REGION_COLORS = Object.fromEntries(REGIONS.map(r => [r.id, r.color]))
const REGION_ACTIVE  = Object.fromEntries(REGIONS.map(r => [r.id, r.activeColor]))

function getCountryColor(numericId, selectedRegionId, hoveredRegionId) {
  const regionId = COUNTRY_REGION_MAP[numericId]
  if (!regionId) return '#1c1c2e'

  const isSelected = selectedRegionId === 'all' || regionId === selectedRegionId
  if (!isSelected) return '#111120'

  const isHovered = regionId === hoveredRegionId
  return isHovered
    ? (REGION_ACTIVE[regionId] ?? '#818cf8')
    : (REGION_COLORS[regionId] ?? '#6366f1')
}

export default memo(function WorldMap({ selectedRegion, onRegionSelect }) {
  const [hoveredRegion, setHoveredRegion] = useState(null)
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: '' })

  function handleMouseEnter(geo, evt) {
    const numericId = String(geo.id)
    const regionId = COUNTRY_REGION_MAP[numericId]
    const region = REGIONS.find(r => r.id === regionId)
    if (regionId) {
      setHoveredRegion(regionId)
      setTooltip({
        visible: true,
        x: evt.clientX,
        y: evt.clientY,
        text: `${geo.properties?.name ?? ''} — ${region?.name ?? regionId}`,
      })
    } else {
      setHoveredRegion(null)
      setTooltip(t => ({ ...t, visible: false }))
    }
  }

  function handleMouseMove(evt) {
    setTooltip(t => t.visible ? { ...t, x: evt.clientX, y: evt.clientY } : t)
  }

  function handleMouseLeave() {
    setHoveredRegion(null)
    setTooltip(t => ({ ...t, visible: false }))
  }

  function handleClick(geo) {
    const numericId = String(geo.id)
    const regionId = COUNTRY_REGION_MAP[numericId]
    if (!regionId) return
    if (selectedRegion.id === regionId) {
      onRegionSelect(REGIONS[0])
    } else {
      onRegionSelect(REGIONS.find(r => r.id === regionId))
    }
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-50 px-2 py-1 text-xs font-mono bg-black/90 border border-white/10 rounded pointer-events-none text-white whitespace-nowrap"
          style={{ left: tooltip.x + 14, top: tooltip.y - 32 }}
        >
          {tooltip.text}
        </div>
      )}

      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ scale: 160 }}
        width={800}
        height={450}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup center={[0, 10]} minZoom={1} maxZoom={8}>
          {/* Ocean */}
          <Sphere fill="#0a0a1a" stroke="#1a1a3e" strokeWidth={0.3} />

          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map(geo => {
                const numericId = String(geo.id)
                const regionId = COUNTRY_REGION_MAP[numericId]
                const fill = getCountryColor(numericId, selectedRegion.id, hoveredRegion)

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke="#050510"
                    strokeWidth={0.4}
                    style={{
                      default: { outline: 'none', transition: 'fill 0.12s ease' },
                      hover:   { outline: 'none', cursor: regionId ? 'pointer' : 'default' },
                      pressed: { outline: 'none' },
                    }}
                    onMouseEnter={e => handleMouseEnter(geo, e)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(geo)}
                  />
                )
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Region legend */}
      <div className="absolute bottom-3 left-3 flex flex-col gap-1 pointer-events-none bg-black/40 backdrop-blur-sm rounded-lg p-2">
        <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-0.5">Regions</span>
        {REGIONS.filter(r => r.id !== 'all').map(r => (
          <div key={r.id} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: r.id === selectedRegion.id ? r.activeColor : r.color,
                       opacity: selectedRegion.id === 'all' || r.id === selectedRegion.id ? 1 : 0.35 }}
            />
            <span
              className="text-[9px] font-mono"
              style={{ color: r.id === selectedRegion.id ? r.activeColor : 'rgba(255,255,255,0.35)' }}
            >
              {r.name}
            </span>
          </div>
        ))}
      </div>

      {/* Zoom hint */}
      <div className="absolute bottom-3 right-3 text-[10px] font-mono text-white/20 pointer-events-none">
        scroll to zoom · click country to select
      </div>
    </div>
  )
})
