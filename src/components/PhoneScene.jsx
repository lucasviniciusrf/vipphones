import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { modelUrl, createWallpaper, preparePhoneModel } from '../three/phoneModel'
import fallback from '../assets/products/iphone-16-pro-hero.jpg'

export default function PhoneScene({ motion, reducedMotion, onStatusChange }) {
  const hostRef = useRef(null)
  const [status, setStatus] = useState('loading')
  useEffect(() => { onStatusChange(status) }, [status, onStatusChange])

  useEffect(() => {
    const host = hostRef.current
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
    } catch {
      setStatus('fallback')
      return undefined
    }
    let disposed = false, failed = false, frame = 0, visible = false, model = null
    let yaw = -.4, pitch = .1, dragStart = null, dragOffset = 0, lastManual = null, lastProgress = 0
    const pointer = { x: 0, y: 0 }
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, .1, 50)
    camera.position.set(0, .05, 8.9)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.setClearColor(0xffffff, 0)
    host.appendChild(renderer.domElement)
    const useFallback = () => { failed = true; visible = false; cancelAnimationFrame(frame); if (!disposed) setStatus('fallback') }
    const contextLost = (event) => { event.preventDefault(); useFallback() }
    renderer.domElement.addEventListener('webglcontextlost', contextLost)
    const pmrem = new THREE.PMREMGenerator(renderer)
    const room = new RoomEnvironment()
    const environment = pmrem.fromScene(room, .04)
    scene.environment = environment.texture
    room.dispose()
    pmrem.dispose()
    scene.add(new THREE.HemisphereLight(0xf4f7ff, 0x32405e, 1.2))
    const key = new THREE.DirectionalLight(0xffffff, 2.5)
    key.position.set(-3, 5, 4)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0x83a6ff, 2)
    rim.position.set(3, 2, -3)
    scene.add(rim)
    const rig = new THREE.Group()
    scene.add(rig)
    const wallpaper = createWallpaper()
    const resize = () => {
      if (!host.clientWidth || !host.clientHeight) return
      renderer.setSize(host.clientWidth, host.clientHeight, false)
      camera.aspect = host.clientWidth / host.clientHeight
      camera.updateProjectionMatrix()
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)
    resize()
    const render = (time = 0) => {
      if (disposed || !visible) return
      if (model) {
        const p = motion.current.progress
        if (motion.current.manual !== lastManual || Math.abs(p - lastProgress) > .002) dragOffset = 0
        lastManual = motion.current.manual
        lastProgress = p
        const turn = p < .34 ? THREE.MathUtils.lerp(-.4, .55, p / .34) : p < .72 ? THREE.MathUtils.lerp(.55, Math.PI + .3, (p - .34) / .38) : THREE.MathUtils.lerp(Math.PI + .3, Math.PI - .55, (p - .72) / .28)
        const targetYaw = (motion.current.manual ?? turn) + (reducedMotion ? 0 : pointer.x * .1) + dragOffset
        yaw = THREE.MathUtils.lerp(yaw, targetYaw, .095)
        pitch = THREE.MathUtils.lerp(pitch, .08 + (reducedMotion ? 0 : pointer.y * .06) - p * .13, .09)
        rig.rotation.set(pitch, yaw, -.10 + p * .18)
        rig.position.y = reducedMotion ? 0 : Math.sin(time * .0007) * .045
        const scale = 1 + Math.max(0, p - .65) * .32
        rig.scale.setScalar(scale)
        renderer.render(scene, camera)
      }
      frame = requestAnimationFrame(render)
    }
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !failed
      cancelAnimationFrame(frame)
      if (visible) frame = requestAnimationFrame(render)
    }, { rootMargin: '150px' })
    visibilityObserver.observe(host)
    new GLTFLoader().load(modelUrl, (gltf) => {
      if (disposed) {
        gltf.scene.traverse((node) => { if (node.isMesh) { node.geometry.dispose(); const materials = Array.isArray(node.material) ? node.material : [node.material]; materials.forEach(m => m.dispose()) } })
        return
      }
      model = preparePhoneModel(gltf, wallpaper)
      rig.add(model)
      setStatus('ready')
    }, undefined, useFallback)
    const down = (event) => {
      dragStart = event.clientX
      host.setPointerCapture(event.pointerId)
      host.classList.add('is-dragging')
    }
    const move = (event) => {
      const bounds = host.getBoundingClientRect()
      pointer.x = (event.clientX - bounds.left) / bounds.width * 2 - 1
      pointer.y = (event.clientY - bounds.top) / bounds.height * 2 - 1
      if (dragStart !== null) {
        dragOffset += (event.clientX - dragStart) * .009
        dragStart = event.clientX
      }
    }
    const up = () => { dragStart = null; host.classList.remove('is-dragging') }
    const leave = () => { pointer.x = 0; pointer.y = 0; up() }
    host.addEventListener('pointerdown', down)
    host.addEventListener('pointermove', move)
    host.addEventListener('pointerup', up)
    host.addEventListener('pointercancel', up)
    host.addEventListener('pointerleave', leave)
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      host.removeEventListener('pointerdown', down)
      host.removeEventListener('pointermove', move)
      host.removeEventListener('pointerup', up)
      host.removeEventListener('pointercancel', up)
      host.removeEventListener('pointerleave', leave)
      scene.traverse((node) => {
        if (!node.isMesh) return
        node.geometry.dispose()
        const materials = Array.isArray(node.material) ? node.material : [node.material]
        materials.forEach((material) => { for (const value of Object.values(material)) if (value?.isTexture && value !== wallpaper) value.dispose(); material.dispose() })
      })
      wallpaper.dispose()
      environment.dispose()
      renderer.domElement.removeEventListener('webglcontextlost', contextLost)
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [motion, reducedMotion])

  return <div className={'phone-scene scene-' + status} ref={hostRef} role="img" aria-label={status === 'fallback' ? 'Imagem de referência da linha iPhone Pro' : 'Visualização 3D de um iPhone 15 Pro Max. Use os botões abaixo para escolher frente, lateral ou traseira.'}>
    {status === 'loading' && <span className="scene-loading">Preparando os detalhes<span /></span>}
    {status === 'fallback' && <img className="scene-fallback" src={fallback} alt="Fotografia de um iPhone da linha Pro" />}
  </div>
}
