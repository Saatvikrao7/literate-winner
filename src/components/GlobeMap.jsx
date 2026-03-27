import { useEffect, useRef, useState, useCallback, memo } from 'react'
import Globe from 'react-globe.gl'
import * as topojson from 'topojson-client'
import { COUNTRY_REGION_MAP, REGIONS } from '../data/regions'
import { CITIES } from '../data/cities'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

export default memo(function GlobeMap({ selectedRegion, onRegionSelect }) {
  const globeRef = useRef()
  const containerRef = useRef()
  const [countries, setCountries] = useState({ features: [] })
  const [hoveredCountry, setHoveredCountry] = useState(null)
  const [size, setSize] = useState({ w: 800, h: 600 })
  const autoRotateRef = useRef(true)
  const rotateTimerRef = useRef(null)

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

  // Pulsing rings for capital cities
  const capitals = CITIES.filter(c => c.capital)

  const getRingColor = useCallback(city => {
    const region = REGIONS.find(r => r.id === city.region)
    const isActive = selectedRegion.id === 'all' || city.region === selectedRegion.id
    if (!isActive) return () => 'rgba(0,0,0,0)'
    const hex = region?.activeColor ?? '#ffffff'
    // Convert hex to rgb for rgba fade
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return t => `rgba(${r},${g},${b},${(1 - t) * 0.9})`
  }, [selectedRegion])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <Globe
        ref={initGlobe}
        width={size.w}
        height={size.h}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        atmosphereColor="#2a3f8f"
        atmosphereAltitude={0.22}
        polygonsData={countries.features}
        polygonCapColor={getCapColor}
        polygonSideColor={() => 'rgba(0,0,40,0.6)'}
        polygonStrokeColor={() => '#05050f'}
        polygonAltitude={getAltitude}
        polygonLabel={getLabel}
        onPolygonHover={setHoveredCountry}
        onPolygonClick={handleClick}
        // City dots
        pointsData={CITIES}
        pointLat={c => c.lat}
        pointLng={c => c.lng}
        pointColor={getCityColor}
        pointRadius={getCityRadius}
        pointAltitude={getCityAltitude}
        pointLabel={getCityLabel}
        pointResolution={8}
        // Pulsing rings on capital cities
        ringsData={capitals}
        ringLat={c => c.lat}
        ringLng={c => c.lng}
        ringColor={getRingColor}
        ringMaxRadius={2.2}
        ringPropagationSpeed={0.8}
        ringRepeatPeriod={1400}
        ringAltitude={0.002}
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

      {/* Hint */}
      <div className="absolute bottom-4 right-4 text-[10px] font-mono text-white/20 pointer-events-none text-right">
        drag to spin · scroll to zoom<br />click country to filter
      </div>
    </div>
  )
})
