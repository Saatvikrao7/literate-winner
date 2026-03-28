import { useEffect, useRef, useState, useCallback, memo } from 'react'
import Globe from 'react-globe.gl'
import * as topojson from 'topojson-client'
import { COUNTRY_REGION_MAP, REGIONS } from '../data/regions'
import { COUNTRY_MARKET_MAP } from '../data/markets'
import { CITIES } from '../data/cities'
import { CONFLICT_ZONES, CONFLICT_ARCS } from '../data/events'
import { useConflictEvents } from '../hooks/useConflictEvents'
import { MissilesLayer } from './MissilesLayer'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

export default memo(function GlobeMap({ selectedRegion, onRegionSelect, mode, marketData }) {
  const globeRef = useRef()
  const containerRef = useRef()
  const [countries, setCountries] = useState({ features: [] })
  const [hoveredCountry, setHoveredCountry] = useState(null)
  const [size, setSize] = useState({ w: 800, h: 600 })
  const autoRotateRef = useRef(true)
  const rotateTimerRef = useRef(null)

  // Live conflict events from news API (refreshes every 5 min)
  const { zones: liveZones, arcs: liveArcs, status: conflictStatus } = useConflictEvents()

  // Merge static fallbacks with live data (static fills the gap before first fetch)
  const activeZones = liveZones.length > 0 ? liveZones : CONFLICT_ZONES
  const activeArcs  = liveArcs.length  > 0 ? liveArcs  : CONFLICT_ARCS

  // Load country polygons (topojson → geojson)
  useEffect(() => {
    fetch(GEO_URL)
      .then(r => r.json())
      .then(world => setCountries(topojson.feature(world, world.objects.countries)))
  }, [])

  // Responsive sizing
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() =>
      setSize({ w: el.offsetWidth, h: el.offsetHeight })
    )
    ro.observe(el)
    setSize({ w: el.offsetWidth, h: el.offsetHeight })
    return () => ro.disconnect()
  }, [])

  // Auto-rotate + controls setup after globe mounts
  const initGlobe = useCallback(node => {
    if (!node) return
    globeRef.current = node
    const controls = node.controls()
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.35
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 120
    controls.maxDistance = 500

    // Pause rotation while user drags, resume 3s after release
    const canvas = node.renderer().domElement
    const pause = () => {
      controls.autoRotate = false
      autoRotateRef.current = false
      clearTimeout(rotateTimerRef.current)
    }
    const resume = () => {
      clearTimeout(rotateTimerRef.current)
      rotateTimerRef.current = setTimeout(() => {
        controls.autoRotate = true
        autoRotateRef.current = true
      }, 3000)
    }
    canvas.addEventListener('pointerdown', pause)
    canvas.addEventListener('pointerup', resume)
  }, [])

  // Fly to region when selected
  useEffect(() => {
    if (!globeRef.current || !selectedRegion.center) return
    const { lat, lng, altitude } = selectedRegion.center
    globeRef.current.pointOfView({ lat, lng, altitude }, 1200)
  }, [selectedRegion.id])

  const getCapColor = useCallback(d => {
    const regionId = COUNTRY_REGION_MAP[String(d.id)]
    if (!regionId) return 'rgba(18,18,32,0.85)'
    const isSelected = selectedRegion.id === 'all' || regionId === selectedRegion.id
    if (!isSelected) return 'rgba(8,8,20,0.9)'
    const isHovered = hoveredCountry && String(hoveredCountry.id) === String(d.id)
    const region = REGIONS.find(r => r.id === regionId)
    return isHovered ? (region?.activeColor ?? '#818cf8') : (region?.color ?? '#6366f1')
  }, [selectedRegion, hoveredCountry])

  const getAltitude = useCallback(d => {
    const regionId = COUNTRY_REGION_MAP[String(d.id)]
    if (!regionId) return 0.002
    const isSelected = selectedRegion.id === 'all' || regionId === selectedRegion.id
    if (!isSelected) return 0.002
    const isHovered = hoveredCountry && String(hoveredCountry.id) === String(d.id)
    return isHovered ? 0.06 : 0.012
  }, [selectedRegion, hoveredCountry])

  const handleClick = useCallback(d => {
    const regionId = COUNTRY_REGION_MAP[String(d.id)]
    if (!regionId) return
    onRegionSelect(
      selectedRegion.id === regionId
        ? REGIONS[0]
        : REGIONS.find(r => r.id === regionId)
    )
  }, [selectedRegion, onRegionSelect])

  const getLabel = useCallback(d => {
    const regionId = COUNTRY_REGION_MAP[String(d.id)]
    const region = REGIONS.find(r => r.id === regionId)
    const name = d.properties?.name ?? ''
    return `<div style="
      background:rgba(5,5,15,0.92);
      border:1px solid rgba(255,255,255,0.1);
      border-radius:6px;
      padding:5px 10px;
      font-family:'JetBrains Mono',monospace;
      font-size:11px;
      color:#fff;
      pointer-events:none;
      white-space:nowrap;
    ">
      <div style="font-weight:600">${name}</div>
      ${region ? `<div style="color:${region.color};margin-top:2px;font-size:10px">${region.name}</div>` : ''}
    </div>`
  }, [])

  // City dot helpers
  const getCityColor = useCallback(city => {
    const region = REGIONS.find(r => r.id === city.region)
    const isActive = selectedRegion.id === 'all' || city.region === selectedRegion.id
    if (!isActive) return 'rgba(255,255,255,0.18)'
    // Capitals get a bright white-ish highlight; others get region color
    return city.capital ? '#ffffff' : (region?.activeColor ?? '#fff')
  }, [selectedRegion])

  const getCityRadius = useCallback(city => {
    const isActive = selectedRegion.id === 'all' || city.region === selectedRegion.id
    if (city.capital) return isActive ? 0.9 : 0.35
    return isActive ? 0.55 : 0.2
  }, [selectedRegion])

  const getCityAltitude = useCallback(city => {
    const isActive = selectedRegion.id === 'all' || city.region === selectedRegion.id
    if (!isActive) return 0.01
    return city.capital ? 0.08 : 0.05
  }, [selectedRegion])

  const getCityLabel = useCallback(city => {
    const region = REGIONS.find(r => r.id === city.region)
    return `<div style="
      background:rgba(5,5,15,0.95);
      border:1px solid rgba(255,255,255,0.12);
      border-radius:6px;
      padding:4px 9px;
      font-family:'JetBrains Mono',monospace;
      font-size:11px;
      color:#fff;
      pointer-events:none;
      white-space:nowrap;
    ">
      <span style="font-weight:600">${city.name}</span>
      ${city.capital ? '<span style="color:#facc15;margin-left:5px;font-size:9px">★ CAPITAL</span>' : ''}
      <div style="color:${region?.color ?? '#888'};font-size:9px;margin-top:2px">${region?.name ?? ''}</div>
    </div>`
  }, [])

  // ── Markets mode: country heatmap colour ─────────────────────────────────
  const getMarketCapColor = useCallback(d => {
    if (!marketData || marketData.length === 0) return 'rgba(12,12,26,0.9)'
    const mid = COUNTRY_MARKET_MAP[String(d.id)]
    if (!mid) return 'rgba(10,10,22,0.88)'
    const m = marketData.find(x => x.id === mid)
    if (!m || m.pct == null) return 'rgba(12,12,26,0.9)'
    const i = Math.min(Math.abs(m.pct) / 3, 1) // full intensity at ±3 %
    if (m.up) return `rgba(8,${Math.round(90 + 110*i)},${Math.round(40 + 30*i)},${0.55 + 0.35*i})`
    return `rgba(${Math.round(120 + 110*i)},${Math.round(8 + 8*i)},${Math.round(8 + 12*i)},${0.55 + 0.35*i})`
  }, [marketData])

  const getMarketAltitude = useCallback(d => {
    if (!marketData || marketData.length === 0) return 0.002
    const mid = COUNTRY_MARKET_MAP[String(d.id)]
    if (!mid) return 0.002
    const m = marketData.find(x => x.id === mid)
    if (!m || m.pct == null) return 0.002
    return Math.min(Math.abs(m.pct) / 100 * 10, 0.28) + 0.006
  }, [marketData])

  // Floating HTML price labels (major indices only)
  const marketLabels = mode === 'markets' && marketData?.length > 0
    ? marketData.filter(m => m.importance >= 4)
    : []

  const makeMarketLabel = useCallback(d => {
    const el = document.createElement('div')
    const color = d.up === true ? '#22c55e' : d.up === false ? '#ef4444' : '#6b7280'
    el.style.cssText = [
      'background:rgba(4,4,16,0.88)',
      `border:1px solid ${color}44`,
      'border-radius:5px',
      'padding:3px 7px',
      'font-family:ui-monospace,monospace',
      'font-size:9px',
      'color:#fff',
      'pointer-events:none',
      'white-space:nowrap',
      'line-height:1.5',
      'box-shadow:0 0 8px ' + color + '33',
    ].join(';')
    el.innerHTML = `<div style="font-weight:700;letter-spacing:0.03em">${d.name}</div><div style="color:${color};font-weight:600">${d.pctStr} &nbsp;${d.priceStr}</div>`
    return el
  }, [])

  // Rings for open markets in markets mode
  const marketRings = mode === 'markets' && marketData?.length > 0
    ? marketData.filter(m => m.state === 'REGULAR' || m.state === 'PRE')
    : []

  // ── Conflict zone rings (faster, angrier than capital rings) ─────────────
  const getConflictRingColor = useCallback(zone => {
    const r = parseInt(zone.color.slice(1,3), 16)
    const g = parseInt(zone.color.slice(3,5), 16)
    const b = parseInt(zone.color.slice(5,7), 16)
    const base = zone.severity === 3 ? 1.0 : zone.severity === 2 ? 0.75 : 0.5
    return t => `rgba(${r},${g},${b},${(1 - t) * base})`
  }, [])

  const getConflictZoneLabel = useCallback(zone =>
    `<div style="
      background:rgba(5,5,15,0.95);border:1px solid ${zone.color}44;
      border-radius:6px;padding:4px 9px;
      font-family:'JetBrains Mono',monospace;font-size:11px;color:#fff;
      pointer-events:none;white-space:nowrap;">
      <div style="color:${zone.color};font-weight:700;font-size:10px">⚠ ${zone.label}</div>
      <div style="color:rgba(255,255,255,0.5);font-size:9px;margin-top:1px">${zone.detail}</div>
    </div>`, [])

  // Faint trajectory path so the flight route is readable (no moving dash)
  const getPathColor = useCallback(() =>
    ['rgba(255,80,0,0)', 'rgba(255,80,0,0.15)', 'rgba(255,80,0,0)']
  , [])

  // ── Unified rings dataset: conflict zones + capital cities ───────────────
  // react-globe.gl only supports one ringsData layer, so we merge both types
  const allRings = [
    ...activeZones.map(z => ({ ...z, _type: 'conflict' })),
    ...CITIES.filter(c => c.capital).map(c => ({ ...c, _type: 'capital' })),
  ]

  const getRingColor = useCallback(item => {
    if (item._type === 'conflict') {
      const r = parseInt(item.color.slice(1,3), 16)
      const g = parseInt(item.color.slice(3,5), 16)
      const b = parseInt(item.color.slice(5,7), 16)
      const alpha = item.severity === 3 ? 1.0 : item.severity === 2 ? 0.75 : 0.5
      return t => `rgba(${r},${g},${b},${(1 - t) * alpha})`
    }
    // capital city
    const region = REGIONS.find(r => r.id === item.region)
    const isActive = selectedRegion.id === 'all' || item.region === selectedRegion.id
    if (!isActive) return () => 'rgba(0,0,0,0)'
    const hex = region?.activeColor ?? '#ffffff'
    const r = parseInt(hex.slice(1,3), 16)
    const g = parseInt(hex.slice(3,5), 16)
    const b = parseInt(hex.slice(5,7), 16)
    return t => `rgba(${r},${g},${b},${(1 - t) * 0.85})`
  }, [selectedRegion])

  const getRingMaxRadius  = useCallback(item => item._type === 'conflict' ? 1.2 + item.severity * 0.4 : 2.0, [])
  const getRingSpeed      = useCallback(item => item._type === 'conflict' ? 1.2 + item.severity * 0.4 : 0.8, [])
  const getRingRepeat     = useCallback(item => item._type === 'conflict' ? 1800 - item.severity * 400 : 1400, [])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Missiles only in news mode */}
      {mode !== 'markets' && <MissilesLayer arcs={activeArcs} globeRef={globeRef} />}
      <Globe
        ref={initGlobe}
        width={size.w}
        height={size.h}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        atmosphereColor="#2a3f8f"
        atmosphereAltitude={0.22}
        polygonsData={countries.features}
        polygonCapColor={mode === 'markets' ? getMarketCapColor : getCapColor}
        polygonSideColor={() => 'rgba(0,0,40,0.6)'}
        polygonStrokeColor={() => '#05050f'}
        polygonAltitude={mode === 'markets' ? getMarketAltitude : getAltitude}
        polygonLabel={getLabel}
        onPolygonHover={setHoveredCountry}
        onPolygonClick={handleClick}
        // ── HTML floating labels (markets mode) ──────────────────────────
        htmlElementsData={marketLabels}
        htmlLat={d => d.lat}
        htmlLng={d => d.lng}
        htmlAltitude={0.18}
        htmlElement={makeMarketLabel}
        // ── Rings: conflict zones / capitals (news) or open markets ──────
        ringsData={mode === 'markets' ? marketRings : allRings}
        ringLat={item => item.lat}
        ringLng={item => item.lng}
        ringColor={mode === 'markets'
          ? d => t => `rgba(34,197,94,${(1-t) * (d.state === 'PRE' ? 0.4 : 0.7)})`
          : getRingColor}
        ringMaxRadius={mode === 'markets' ? 2.5 : getRingMaxRadius}
        ringPropagationSpeed={mode === 'markets' ? 1.0 : getRingSpeed}
        ringRepeatPeriod={mode === 'markets' ? 1600 : getRingRepeat}
        ringAltitude={0.001}
        arcsData={mode !== 'markets' ? activeArcs : []}
        arcStartLat={a => a.startLat}
        arcStartLng={a => a.startLng}
        arcEndLat={a => a.endLat}
        arcEndLng={a => a.endLng}
        arcColor={getPathColor}
        arcAltitude={0.45}
        arcStroke={0.25}
        arcDashLength={1}
        arcDashGap={0}
        arcDashAnimateTime={0}
        arcLabel={a => `<div style="background:rgba(5,5,15,0.92);border:1px solid rgba(255,140,0,0.3);border-radius:5px;padding:3px 8px;font-family:monospace;font-size:10px;color:#fff;pointer-events:none">🚀 ${a.label}</div>`}
        // ── Points: city dots (news) or market bars (markets) ─────────────
        pointsData={mode === 'markets' ? marketData : CITIES}
        pointLat={d => d.lat}
        pointLng={d => d.lng}
        pointColor={d => mode === 'markets'
          ? (d.up === true ? '#22c55e' : d.up === false ? '#ef4444' : '#6b7280')
          : getCityColor(d)}
        pointRadius={d => mode === 'markets'
          ? d.importance * 0.35
          : getCityRadius(d)}
        pointAltitude={d => mode === 'markets'
          ? (d.pct != null ? Math.min(Math.abs(d.pct) / 100 * 6, 0.5) + 0.04 : 0.04)
          : getCityAltitude(d)}
        pointLabel={d => mode === 'markets'
          ? `<div style="background:rgba(5,5,15,0.95);border:1px solid ${d.up ? '#22c55e44' : '#ef444444'};border-radius:7px;padding:6px 10px;font-family:'JetBrains Mono',monospace;font-size:11px;color:#fff;pointer-events:none;white-space:nowrap">
              <div style="font-weight:700">${d.flag} ${d.name}</div>
              <div style="font-size:13px;font-weight:600;color:${d.up ? '#22c55e' : '#ef4444'};margin-top:2px">${d.priceStr} <span style="font-size:10px">${d.currency}</span></div>
              <div style="font-size:10px;color:${d.up ? '#22c55e' : '#ef4444'}">${d.changeStr} (${d.pctStr})</div>
              <div style="font-size:9px;color:rgba(255,255,255,0.35);margin-top:2px">${d.country}</div>
            </div>`
          : getCityLabel(d)}
        pointResolution={8}
      />

      {/* Region legend */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1 bg-black/50 backdrop-blur-md rounded-xl p-3 pointer-events-none">
        <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-1">Regions</span>
        {REGIONS.filter(r => r.id !== 'all').map(r => {
          const active = selectedRegion.id === 'all' || r.id === selectedRegion.id
          return (
            <div key={r.id} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0 transition-all"
                style={{
                  background: active ? r.color : r.color,
                  opacity: active ? 1 : 0.25,
                  boxShadow: r.id === selectedRegion.id ? `0 0 6px ${r.color}` : 'none',
                }}
              />
              <span
                className="text-[9px] font-mono transition-colors"
                style={{ color: active ? (r.id === selectedRegion.id ? r.activeColor : 'rgba(255,255,255,0.5)') : 'rgba(255,255,255,0.2)' }}
              >
                {r.name}
              </span>
            </div>
          )
        })}
      </div>

      {/* Conflict event status + hint */}
      <div className="absolute bottom-4 right-4 text-right pointer-events-none space-y-1">
        <div className="flex items-center justify-end gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: conflictStatus === 'ready' ? '#22c55e' : conflictStatus === 'error' ? '#ef4444' : '#eab308',
              boxShadow: conflictStatus === 'ready' ? '0 0 4px #22c55e' : 'none',
            }}
          />
          <span className="text-[9px] font-mono text-white/25">
            {conflictStatus === 'ready'   ? `${activeZones.length} live conflict zones` :
             conflictStatus === 'loading' ? 'updating events…' :
             conflictStatus === 'error'   ? 'using cached events' : ''}
          </span>
        </div>
        <div className="text-[10px] font-mono text-white/20">
          drag to spin · scroll to zoom<br />click country to filter
        </div>
      </div>
    </div>
  )
})
