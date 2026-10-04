import * as THREE from 'three'
export { default as modelUrl } from '../assets/models/iphone-15-pro-max.glb?url'

export function createWallpaper() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 1024
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#001446'
  ctx.fillRect(0, 0, 512, 1024)
  for (const [x, y, radius, color] of [[200, 260, 400, '#285dd9'], [360, 580, 420, '#012b9b'], [180, 900, 360, '#82adff']]) {
    const gradient = ctx.createRadialGradient(x, y, 10, x, y, radius)
    gradient.addColorStop(0, color)
    gradient.addColorStop(1, 'rgba(1,20,60,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 512, 1024)
  }
  ctx.strokeStyle = '#a9c7ff'
  ctx.lineWidth = 2
  for (let i = 0; i < 3; i++) {
    ctx.beginPath()
    ctx.ellipse(256, 590, 245 + i * 25, 300 + i * 30, -.35, 0, Math.PI * 2)
    ctx.stroke()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.flipY = false
  return texture
}

export function preparePhoneModel(gltf, wallpaper, { screenOff = false } = {}) {
      const model = gltf.scene
      const box = new THREE.Box3().setFromObject(model)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      const factor = 3.9 / size.y
      model.position.copy(center).multiplyScalar(-factor)
      model.scale.setScalar(factor)
      model.updateMatrixWorld(true)
      const moveToFront = (node, distance) => {
        const inverse = node.parent.matrixWorld.clone().invert()
        const origin = new THREE.Vector3().applyMatrix4(inverse)
        const offset = new THREE.Vector3(0, 0, distance).applyMatrix4(inverse).sub(origin)
        node.position.add(offset)
      }
      let screenBounds = null
      model.traverse((node) => {
        if (!node.isMesh) return
        if (node.material.name === 'Material.001') {
          screenBounds = new THREE.Box3().setFromObject(node)
          node.visible = false
        }
        if (node.name === 'Object_43') {
          moveToFront(node, .025)
          if (screenOff) {
            node.material = node.material.clone()
            node.material.color.set('#030509')
            node.material.roughness = .35
            node.material.envMapIntensity = .2
          }
        }
        if (node.material.name === 'metalframe') {
          node.material.color.set('#61718b')
          node.material.metalness = .95
          node.material.roughness = .28
        }
        if (node.material.name === 'backpanel') {
          node.material.color.set('#263958')
          node.material.metalness = .15
          node.material.roughness = .43
        }
      })
  const handset = new THREE.Group()
  handset.add(model)
  if (screenBounds) {
    // A separate rounded display avoids the source atlas and coplanar surfaces.
    const size = screenBounds.getSize(new THREE.Vector3())
    const center = screenBounds.getCenter(new THREE.Vector3())
    const x = -size.x / 2, y = -size.y / 2, r = .13
    const shape = new THREE.Shape()
    shape.moveTo(x + r, y)
    shape.lineTo(x + size.x - r, y)
    shape.quadraticCurveTo(x + size.x, y, x + size.x, y + r)
    shape.lineTo(x + size.x, y + size.y - r)
    shape.quadraticCurveTo(x + size.x, y + size.y, x + size.x - r, y + size.y)
    shape.lineTo(x + r, y + size.y)
    shape.quadraticCurveTo(x, y + size.y, x, y + size.y - r)
    shape.lineTo(x, y + r)
    shape.quadraticCurveTo(x, y, x + r, y)
    const geometry = new THREE.ShapeGeometry(shape, 16)
    const position = geometry.getAttribute('position'), uv = geometry.getAttribute('uv')
    for (let i = 0; i < position.count; i++) uv.setXY(i, (position.getX(i) - x) / size.x, (position.getY(i) - y) / size.y)
    const material = screenOff
      ? new THREE.MeshPhysicalMaterial({ color: '#03060c', roughness: .23, metalness: .05, clearcoat: .35, clearcoatRoughness: .28, envMapIntensity: .4, specularIntensity: .3 })
      : new THREE.MeshBasicMaterial({ map: wallpaper, toneMapped: false })
    const display = new THREE.Mesh(geometry, material)
    display.position.copy(center)
    display.position.z = screenBounds.max.z + .012
    handset.add(display)
  }
  return handset
}
