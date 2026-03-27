import { useEffect } from 'react'
import * as THREE from 'three'

const GLOBE_R = 100          // react-globe.gl default globe radius (scene units)
const MISSILES_PER_ARC = 2  // simultaneous missiles per conflict pair
const ARC_ALTITUDE = 0.45   // peak altitude fraction of globe radius

// Pre-allocate vectors to avoid GC churn in the animation loop
const _v1  = new THREE.Vector3()
const _v2  = new THREE.Vector3()
const _up  = new THREE.Vector3(0, 1, 0)
const _dir = new THREE.Vector3()

// Matches three-globe's internal GLSL: phi = 90-lat, theta = 90-lng
function latLngToVec3(lat, lng, r) {
  const phi   = (90 - lat) * (Math.PI / 180)
  const theta = (90 - lng) * (Math.PI / 180)
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  )
}

function arcPositionAt(arc, t) {
  // Surface positions at start / end
  _v1.copy(latLngToVec3(arc.startLat, arc.startLng, 1))
  _v2.copy(latLngToVec3(arc.endLat,   arc.endLng,   1))

  // Great-circle interpolation (lerp then normalise ≈ slerp for small arcs)
  const surface = new THREE.Vector3().lerpVectors(_v1, _v2, t).normalize()

  // Parabolic altitude — peaks at t = 0.5
  const alt = GLOBE_R * (1 + ARC_ALTITUDE * Math.sin(t * Math.PI))
  return surface.multiplyScalar(alt)
}

function makeMissile() {
  const g = new THREE.Group()

  // Nose cone — bright yellow-white
  const noseMat  = new THREE.MeshBasicMaterial({ color: 0xffffc0 })
  const nose     = new THREE.Mesh(new THREE.ConeGeometry(0.10, 0.38, 7), noseMat)
  nose.position.y = 0.32
  g.add(nose)

  // Body — orange-red
  const bodyMat  = new THREE.MeshBasicMaterial({ color: 0xff5500 })
  const body     = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.10, 0.42, 7), bodyMat)
  g.add(body)

  // Exhaust glow — orange sphere, slightly transparent
  const exMat    = new THREE.MeshBasicMaterial({ color: 0xff2200, transparent: true, opacity: 0.85 })
  const exhaust  = new THREE.Mesh(new THREE.SphereGeometry(0.14, 6, 5), exMat)
  exhaust.position.y = -0.34
  g.add(exhaust)

  // Small fin stubs (two flat boxes on either side)
  const finMat = new THREE.MeshBasicMaterial({ color: 0xdd4400 })
  const finGeo = new THREE.BoxGeometry(0.28, 0.14, 0.04)
  const fin    = new THREE.Mesh(finGeo, finMat)
  fin.position.y = -0.18
  g.add(fin)

  g.scale.setScalar(4.8)
  return g
}

export function MissilesLayer({ arcs, globeRef }) {
  useEffect(() => {
    if (!globeRef.current || !arcs.length) return

    const scene = globeRef.current.scene()

    const missiles = arcs.flatMap(arc =>
      Array.from({ length: MISSILES_PER_ARC }, (_, i) => ({
        arc,
        t:     i / MISSILES_PER_ARC,             // stagger start positions
        speed: 0.00075 + Math.random() * 0.0004, // slight speed variance
        mesh:  makeMissile(),
      }))
    )

    missiles.forEach(m => scene.add(m.mesh))

    const q = new THREE.Quaternion()
    let rafId

    const animate = () => {
      missiles.forEach(m => {
        m.t = (m.t + m.speed) % 1

        const pos   = arcPositionAt(m.arc, m.t)
        // Slightly ahead for direction — wrap to keep inside [0,1]
        const ahead = arcPositionAt(m.arc, Math.min(m.t + 0.012, 0.999))

        m.mesh.position.copy(pos)

        _dir.subVectors(ahead, pos).normalize()
        if (_dir.lengthSq() > 0.0001) {
          q.setFromUnitVectors(_up, _dir)
          m.mesh.quaternion.copy(q)
        }
      })

      rafId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(rafId)
      missiles.forEach(m => scene.remove(m.mesh))
    }
  }, [arcs])

  return null
}
