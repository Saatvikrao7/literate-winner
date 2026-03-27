import { useState, memo } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps'
import { COUNTRY_REGION_MAP, REGIONS } from '../data/regions'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const REGION_COLORS = Object.fromEntries(REGIONS.map(r => [r.id, r.color]))
const REGION_ACTIVE = Object.fromEntries(REGIONS.map(r => [r.id, r.activeColor]))

function getCountryColor(isoA3, selectedRegionId, hoveredRegionId) {
  const regionId = COUNTRY_REGION_MAP[isoA3]
  if (!regionId) return '#1a1a2e'

  const isSelected = selectedRegionId === 'all' || regionId === selectedRegionId
  const isHovered = regionId === hoveredRegionId

  if (!isSelected) return '#111122'

  if (isHovered) return REGION_ACTIVE[regionId] ?? '#4f46e5'
  return REGION_COLORS[regionId] ?? '#3730a3'
}

export default memo(function WorldMap({ selectedRegion, onRegionSelect }) {
  const [hoveredRegion, setHoveredRegion] = useState(null)
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: '' })

  function handleMouseEnter(geo, evt) {
    const numericId = String(geo.id)
    const regionId = COUNTRY_REGION_MAP[numericId]
    if (regionId) {
      setHoveredRegion(regionId)
      const region = REGIONS.find(r => r.id === regionId)
      setTooltip({
        visible: true,
        x: evt.clientX,
        y: evt.clientY,
        text: `${geo.properties?.name ?? numericId} — ${region?.name ?? regionId}`,
      })
    } else {
      setTooltip(t => ({ ...t, visible: false }))
    }
  }

  function handleMouseMove(evt) {
    if (tooltip.visible) {
      setTooltip(t => ({ ...t, x: evt.clientX, y: evt.clientY }))
    }
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
      onRegionSelect(REGIONS[0]) // deselect → back to global
    } else {
      onRegionSelect(REGIONS.find(r => r.id === regionId))
    }
  }

  return (
    <div className="relative w-full h-full" onMouseMove={handleMouseMove}>
      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-50 px-2 py-1 text-xs font-mono bg-black/80 border border-white/10 rounded pointer-events-none text-white"
          style={{ left: tooltip.x + 12, top: tooltip.y - 28 }}
        >
          {tooltip.text}
        </div>
      )}

      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ scale: 160 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup center={[0, 10]} minZoom={1} maxZoom={6}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map(geo => {
                const regionId = COUNTRY_REGION_MAP[String(geo.id)]
                const fill = getCountryColor(isoA3, selectedRegion.id, hoveredRegion)
                const isClickable = !!regionId

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke="#0a0a14"
                    strokeWidth={0.4}
                    style={{
                      default: { outline: 'none', transition: 'fill 0.15s ease' },
                      hover: { outline: 'none', cursor: isClickable ? 'pointer' : 'default' },
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

      {/* Region legend dots */}
      <div className="absolute bottom-3 left-3 flex flex-col gap-1 pointer-events-none">
        <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Regions</span>
        {REGIONS.filter(r => r.id !== 'all').map(r => (
          <div key={r.id} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: r.color }} />
            <span className="text-[10px] font-mono text-white/40">{r.name}</span>
          </div>
        ))}
      </div>

      {/* Zoom hint */}
      <div className="absolute bottom-3 right-3 text-[10px] font-mono text-white/20 pointer-events-none">
        scroll to zoom · click to select
      </div>
    </div>
  )
})
