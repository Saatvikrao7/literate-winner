import { useState, useEffect, useCallback } from 'react'

// Maps Guardian location tag IDs → globe coordinates + visual config
// Tag IDs confirmed from Guardian's open platform
const LOCATION_TAG_MAP = {
  'world/ukraine':                        { lat: 48.5,  lng: 31.0,  label: 'Ukraine',     color: '#ef4444', baseSeverity: 3 },
  'world/russia':                         { lat: 55.75, lng: 37.62, label: 'Russia',      color: '#dc2626', baseSeverity: 3 },
  'world/israel':                         { lat: 31.77, lng: 35.22, label: 'Israel',      color: '#ef4444', baseSeverity: 3 },
  'world/iran':                           { lat: 32.00, lng: 53.00, label: 'Iran',        color: '#f97316', baseSeverity: 2 },
  'world/gaza':                           { lat: 31.35, lng: 34.30, label: 'Gaza Strip',  color: '#ef4444', baseSeverity: 3 },
  'world/lebanon':                        { lat: 33.89, lng: 35.50, label: 'Lebanon',     color: '#f97316', baseSeverity: 2 },
  'world/syria':                          { lat: 34.80, lng: 38.99, label: 'Syria',       color: '#eab308', baseSeverity: 1 },
  'world/yemen':                          { lat: 15.55, lng: 48.52, label: 'Yemen',       color: '#f97316', baseSeverity: 2 },
  'world/iraq':                           { lat: 33.34, lng: 44.40, label: 'Iraq',        color: '#eab308', baseSeverity: 1 },
  'world/sudan':                          { lat: 15.55, lng: 32.53, label: 'Sudan',       color: '#f97316', baseSeverity: 2 },
  'world/myanmar':                        { lat: 19.75, lng: 96.10, label: 'Myanmar',     color: '#f97316', baseSeverity: 2 },
  'world/somalia':                        { lat:  2.04, lng: 45.34, label: 'Somalia',     color: '#eab308', baseSeverity: 1 },
  'world/ethiopia':                       { lat:  9.03, lng: 38.74, label: 'Ethiopia',    color: '#eab308', baseSeverity: 1 },
  'world/mali':                           { lat: 17.57, lng: -3.99, label: 'Mali',        color: '#eab308', baseSeverity: 1 },
  'world/haiti':                          { lat: 18.97, lng:-72.28, label: 'Haiti',       color: '#eab308', baseSeverity: 1 },
  'world/afghanistan':                    { lat: 34.50, lng: 65.00, label: 'Afghanistan', color: '#f97316', baseSeverity: 2 },
  'world/democratic-republic-of-congo':   { lat: -4.32, lng: 15.32, label: 'DR Congo',   color: '#f97316', baseSeverity: 2 },
  'world/pakistan':                       { lat: 30.00, lng: 70.00, label: 'Pakistan',    color: '#eab308', baseSeverity: 1 },
  'world/north-korea':                    { lat: 40.00, lng:127.00, label: 'North Korea', color: '#7c3aed', baseSeverity: 1 },
  'world/burkina-faso':                   { lat: 12.36, lng: -1.53, label: 'Burkina Faso',color: '#eab308', baseSeverity: 1 },
  'world/niger':                          { lat: 17.61, lng:  8.08, label: 'Niger',       color: '#eab308', baseSeverity: 1 },
  'world/libya':                          { lat: 26.34, lng: 17.23, label: 'Libya',       color: '#eab308', baseSeverity: 1 },
  'world/venezuela':                      { lat: 6.42,  lng:-66.59, label: 'Venezuela',   color: '#eab308', baseSeverity: 1 },
}

const CONFLICT_QUERY = 'attack OR airstrike OR bombing OR missile OR killed OR war OR offensive OR ceasefire OR clash OR troops'
const API_KEY = 'test'
const REFRESH_MS = 5 * 60 * 1000 // re-fetch every 5 min

export function useConflictEvents() {
  const [zones,  setZones]  = useState([])
  const [arcs,   setArcs]   = useState([])
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'ready' | 'error'

  const fetch_ = useCallback(async () => {
    setStatus('loading')
    try {
      const url = `https://content.guardianapis.com/search?api-key=${API_KEY}`
        + `&q=${encodeURIComponent(CONFLICT_QUERY)}`
        + `&show-tags=keyword&page-size=50&order-by=newest`

      const res = await fetch(url)
      const data = await res.json()
      if (data.response?.status !== 'ok') throw new Error('bad response')

      // 1. Count how many articles mention each conflict location tag
      const tagCounts = {}
      for (const article of data.response.results) {
        for (const tag of article.tags ?? []) {
          if (LOCATION_TAG_MAP[tag.id]) {
            tagCounts[tag.id] = (tagCounts[tag.id] ?? 0) + 1
          }
        }
      }

      // 2. Build conflict zones — severity driven by article frequency
      const newZones = Object.entries(tagCounts).map(([tagId, count]) => ({
        id: tagId,
        ...LOCATION_TAG_MAP[tagId],
        severity: count >= 6 ? 3 : count >= 3 ? 2 : 1,
        detail: `${count} recent article${count !== 1 ? 's' : ''}`,
      }))

      // 3. Build conflict arcs — any article pairing two known conflict locations
      //    gets an arc drawn between them
      const arcCounts = {}
      for (const article of data.response.results) {
        const conflictTags = (article.tags ?? [])
          .map(t => t.id)
          .filter(id => LOCATION_TAG_MAP[id])

        for (let i = 0; i < conflictTags.length; i++) {
          for (let j = i + 1; j < conflictTags.length; j++) {
            const key = [conflictTags[i], conflictTags[j]].sort().join('||')
            arcCounts[key] = (arcCounts[key] ?? 0) + 1
          }
        }
      }

      const newArcs = []
      for (const [pair, count] of Object.entries(arcCounts)) {
        if (count < 2) continue // require at least 2 articles to show an arc
        const [id1, id2] = pair.split('||')
        const loc1 = LOCATION_TAG_MAP[id1]
        const loc2 = LOCATION_TAG_MAP[id2]
        if (!loc1 || !loc2) continue
        newArcs.push({
          id: pair,
          startLat: loc1.lat, startLng: loc1.lng,
          endLat:   loc2.lat, endLng:   loc2.lng,
          color: loc1.color,
          speed: Math.max(800, 2400 - count * 200), // more articles → faster arc
          label: `${loc1.label} ↔ ${loc2.label} (${count} articles)`,
        })
      }

      setZones(newZones)
      setArcs(newArcs)
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    fetch_()
    const id = setInterval(fetch_, REFRESH_MS)
    return () => clearInterval(id)
  }, [fetch_])

  return { zones, arcs, status }
}
