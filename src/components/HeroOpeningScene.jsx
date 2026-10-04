import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { modelUrl, createWallpaper, preparePhoneModel } from '../three/phoneModel'
import fallback from '../assets/products/iphone-16-hero.jpg'

const clamp = THREE.MathUtils.clamp
const lerp = THREE.MathUtils.lerp
const ease = (value) => { const t = clamp(value, 0, 1); return t * t * (3 - 2 * t) }

function roundedPanel(width, height, radius, depth) {
  const x = -width / 2, y = -height / 2
  const shape = new THREE.Shape()
  shape.moveTo(x + radius, y)
  shape.lineTo(x + width - radius, y)
  shape.quadraticCurveTo(x + width, y, x + width, y + radius)
  shape.lineTo(x + width, y + height - radius)
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  shape.lineTo(x + radius, y + height)
  shape.quadraticCurveTo(x, y + height, x, y + height - radius)
  shape.lineTo(x, y + radius)
  shape.quadraticCurveTo(x, y, x + radius, y)
  return new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 12 })
}

function createLidArtwork(wallpaper) {
  const canvas = document.createElement('canvas')
  canvas.width = 512; canvas.height = 1024
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#fafafa'; ctx.fillRect(0, 0, 512, 1024)
  ctx.fillStyle = '#27354b'
  ctx.beginPath(); ctx.roundRect(57, 82, 398, 858, 60); ctx.fill()
  ctx.save()
  ctx.beginPath(); ctx.roundRect(65, 90, 382, 842, 52); ctx.clip()
  ctx.drawImage(wallpaper.image, 65, 90, 382, 842)
  ctx.restore()
  ctx.fillStyle = '#080e1d'
  ctx.beginPath(); ctx.roundRect(189, 111, 134, 28, 14); ctx.fill()
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function createLayerTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256; canvas.height = 512
  const ctx = canvas.getContext('2d')
  ctx.strokeStyle = 'rgba(1,43,155,.20)'; ctx.lineWidth = 1
  for (let x = 0; x <= 256; x += 22) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke() }
  for (let y = 0; y <= 512; y += 22) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke() }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export default function HeroOpeningScene() {
  const hostRef = useRef(null)
  const [status, setStatus] = useState('loading')
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const host = hostRef.current
    let renderer
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }) }
    catch { setStatus('fallback'); return undefined }
    let disposed = false, visible = false, failed = false, frame = 0, phone = null
    let startedAt = null, previousTime = null, elapsed = 0
    let pointerX = 0, pointerY = 0, smoothX = 0, smoothY = 0
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.65))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.setClearColor(0xffffff, 0)
    host.appendChild(renderer.domElement)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, .1, 50)
    camera.position.set(0, .3, 10.3); camera.lookAt(0, .3, 0)
    const pmrem = new THREE.PMREMGenerator(renderer)
    const room = new RoomEnvironment()
    const environment = pmrem.fromScene(room, .04)
    scene.environment = environment.texture
    room.dispose(); pmrem.dispose()
    scene.add(new THREE.HemisphereLight(0xf5f8ff, 0x314a73, 1.3))
    const key = new THREE.DirectionalLight(0xffffff, 2.8)
    key.position.set(-4, 6, 5); scene.add(key)
    const rim = new THREE.DirectionalLight(0x7ea4ff, 2)
    rim.position.set(4, 1, -4); scene.add(rim)
    const rig = new THREE.Group(); scene.add(rig)
    const box = new THREE.Group(), lid = new THREE.Group(), handset = new THREE.Group()
    rig.add(box, lid, handset)
    const paper = new THREE.MeshStandardMaterial({ color: '#f8f9fc', roughness: .6, metalness: .02 })
    const tray = new THREE.MeshStandardMaterial({ color: '#dce4f1', roughness: .74 })
    const addBoxPart = (width, height, depth, x, y, z, material = paper) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material)
      mesh.position.set(x, y, z); box.add(mesh)
    }
    addBoxPart(2.22, 4.42, .10, 0, 0, -.3)
    addBoxPart(2.05, 4.25, .05, 0, 0, -.22, tray)
    addBoxPart(.10, 4.42, .48, -1.06, 0, -.05)
    addBoxPart(.10, 4.42, .48, 1.06, 0, -.05)
    addBoxPart(2.22, .10, .48, 0, -2.16, -.05)
    addBoxPart(2.22, .10, .48, 0, 2.16, -.05)
    const wallpaper = createWallpaper()
    const lidTexture = createLidArtwork(wallpaper)
    const lidMaterials = [paper, paper, paper, paper, new THREE.MeshBasicMaterial({ map: lidTexture, toneMapped: false }), paper]
    lid.add(new THREE.Mesh(new THREE.BoxGeometry(2.26, 4.46, .19), lidMaterials))
    const packagingMaterials = [...new Set([...lidMaterials, tray])]
    packagingMaterials.forEach(material => { material.transparent = true })
    const edgeMaterial = new THREE.LineBasicMaterial({ color: '#91a9d2', transparent: true, opacity: .6 })
    const grid = createLayerTexture()
    const layers = []
    for (let i = 0; i < 3; i++) {
      const layer = new THREE.Group()
      const geometry = roundedPanel(1.73, 3.76, .17, .018)
      const glass = new THREE.MeshBasicMaterial({ color: '#d9e8ff', transparent: true, opacity: .065, depthWrite: false })
      layer.add(new THREE.Mesh(geometry, glass))
      layer.add(new THREE.LineSegments(new THREE.EdgesGeometry(geometry, 20), edgeMaterial))
      if (i === 1) {
        const gridFace = new THREE.Mesh(new THREE.PlaneGeometry(1.55, 3.52), new THREE.MeshBasicMaterial({ map: grid, transparent: true, opacity: .30, depthWrite: false, side: THREE.DoubleSide }))
        gridFace.position.z = .023; layer.add(gridFace)
      }
      handset.add(layer); layers.push(layer)
    }
    const resize = () => {
      if (!host.clientWidth || !host.clientHeight) return
      renderer.setSize(host.clientWidth, host.clientHeight, false)
      camera.aspect = host.clientWidth / host.clientHeight
      // Reserve horizontal room for the raised lid, including narrow desktop columns.
      camera.position.z = Math.max(10.6, 8.7 / camera.aspect)
      camera.updateProjectionMatrix()
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host); resize()
    const useFallback = () => { failed = true; visible = false; cancelAnimationFrame(frame); if (!disposed) setStatus('fallback') }
    const lost = (event) => { event.preventDefault(); useFallback() }
    renderer.domElement.addEventListener('webglcontextlost', lost)
    const render = (time) => {
      if (disposed || !visible) { previousTime = null; return }
      if (phone) {
        if (startedAt === null) { startedAt = time; previousTime = time }
        elapsed += previousTime === null ? 0 : Math.min((time - previousTime) / 1000, .12)
        previousTime = time
        const still = media.matches
        // Each movement finishes before the next begins. All objects share the
        // same local axes, so the lid lifts along the box normal, not world Z.
        const lidRaise = still ? 1 : ease((elapsed - .50) / .85)
        const lidSlide = still ? 1 : ease((elapsed - 1.35) / .85)
        const lift = still ? 1 : ease((elapsed - 2.25) / 1.00)
        const exit = still ? 1 : ease((elapsed - 3.30) / .70)
        const exploded = still ? 1 : ease((elapsed - 4.10) / 1.30)
        const scroll = still ? 0 : clamp(-host.getBoundingClientRect().top / innerHeight, 0, 1)
        smoothX = lerp(smoothX, still ? 0 : pointerX, .06)
        smoothY = lerp(smoothY, still ? 0 : pointerY, .06)
        rig.rotation.set(-.62 - exploded * .34 + smoothY * .035, -.27 + smoothX * .08 - scroll * .12, -.29 - scroll * .025)
        rig.scale.setScalar(1 + exploded * .15)
        rig.position.y = still ? 0 : Math.sin(time * .00065) * .035
        box.visible = lid.visible = exit < .999
        box.position.set(-.30 * exit, -.80 * exit, -.55 * exit)
        lid.position.set(-1.4 * lidSlide - exit * .15, 0, .315 + lidRaise * .90)
        packagingMaterials.forEach(material => { material.opacity = 1 - exit; material.depthWrite = exit < .01 })
        handset.position.set(.22 * lift, 0, .90 * lift)
        camera.position.y = .3 + exploded * .6
        camera.position.x = -.45 * (1 - exploded)
        camera.lookAt(camera.position.x, camera.position.y, 0)
        for (let i = 0; i < layers.length; i++) {
          const layer = layers[i]
          layer.visible = exploded > .015
          layer.position.set(0, 0, .18 + (i + 1) * .55 * exploded)
        }
        renderer.render(scene, camera)
      }
      frame = requestAnimationFrame(render)
    }
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !failed
      cancelAnimationFrame(frame); previousTime = null
      if (visible) frame = requestAnimationFrame(render)
    })
    visibilityObserver.observe(host)
    new GLTFLoader().load(modelUrl, (gltf) => {
      if (disposed) { gltf.scene.traverse(n => { if (n.isMesh) { n.geometry.dispose(); n.material.dispose() } }); return }
      phone = preparePhoneModel(gltf, wallpaper, { screenOff: true })
      handset.add(phone); setStatus('ready')
    }, undefined, useFallback)
    const move = (event) => {
      if (event.pointerType !== 'mouse') return
      const bounds = host.getBoundingClientRect()
      pointerX = (event.clientX - bounds.left) / bounds.width * 2 - 1
      pointerY = (event.clientY - bounds.top) / bounds.height * 2 - 1
    }
    const leave = () => { pointerX = 0; pointerY = 0 }
    host.addEventListener('pointermove', move); host.addEventListener('pointerleave', leave)
    return () => {
      disposed = true; cancelAnimationFrame(frame)
      resizeObserver.disconnect(); visibilityObserver.disconnect()
      host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave)
      renderer.domElement.removeEventListener('webglcontextlost', lost)
      const geometries = new Set(), materials = new Set(), textures = new Set([wallpaper, lidTexture, grid])
      scene.traverse(node => {
        if (node.geometry) geometries.add(node.geometry)
        if (node.material) for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
          materials.add(material)
          for (const value of Object.values(material)) if (value?.isTexture) textures.add(value)
        }
      })
      geometries.forEach(v => v.dispose()); materials.forEach(v => v.dispose()); textures.forEach(v => v.dispose())
      environment.dispose(); renderer.dispose(); renderer.domElement.remove()
    }
  }, [])
  return <div className={'hero-opening opening-' + status}>
    <div className="hero-opening-canvas" ref={hostRef} role="img" aria-hidden={status !== 'ready'} aria-label="Cena 3D ilustrativa: uma caixa abre, revela um iPhone e três camadas transparentes se separam sobre a tela." />
    <img className="hero-opening-placeholder" src={fallback} aria-hidden={status === 'ready'} alt="iPhone em azul ultramarino, de frente e de costas" fetchPriority="high" />
    {status === 'ready' && <span className="hero-scene-tag">UMA NOVA PERSPECTIVA</span>}
  </div>
}
