const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 20000)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const spotlight = new THREE.SpotLight(0xFFFFFF)
spotlight.position.set(0, 200, 400)
spotlight.castShadow = true
spotlight.shadow.mapSize.width = 1024
spotlight.shadow.mapSize.height = 1024
scene.add(spotlight)
scene.add(new THREE.AmbientLight(0x111111))

const video = document.createElement('video')
video.src = 'video.mp4'
video.load()
const texture = new THREE.VideoTexture(video)
texture.minFilter = THREE.LinearFilter
texture.magFilter = THREE.LinearFilter
texture.format = THREE.RGBFormat

const gui = new dat.GUI()
const config = {
  play: () => video.play()
}

gui.add(config, 'play')

const createBox = (row, col, totalCols) => {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(32, 21, 21),
    new THREE.MeshPhongMaterial({ map: texture })
  )
  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.position.set((col * 32) - (totalCols * 16), row * 21, 0)
  const velocity = new THREE.Vector3(
    (Math.random() * 0.02) - 0.01,
    (Math.random() * 0.02) - 0.01,
    (Math.random() * 0.02) - 0.01
  )
  const movement = new THREE.Vector3(
    (Math.random() * 0.1) - 0.05,
    (Math.random() * 0.1) - 0.05,
    (Math.random() * 0.1) - 0.05
  )
  const impulse = (Math.random() * 0.001) + 0.999
  const startAt = Math.random() * 10000
  const tick = (t) => {
    requestAnimationFrame(tick)
    if (t < startAt) return
    mesh.rotation.x += velocity.x
    mesh.rotation.y += velocity.y
    mesh.rotation.z += velocity.z
    mesh.position.x += movement.x
    mesh.position.y += movement.y
    mesh.position.z += movement.z
    velocity.multiplyScalar(impulse)
    movement.multiplyScalar(impulse)
  }
  requestAnimationFrame(tick)
  return mesh
}

const gridDims = [4, 4]
for (let i = 0; i < gridDims[1]; i++) {
  for (let j = 0; j < gridDims[0]; j++) {
    scene.add(createBox(i, j, gridDims[0]))
  }
}

function animate (t) {
  requestAnimationFrame(animate)
  const speed = 0.00005
  t = 8000
  camera.position.set(Math.sin(t * speed) * 200, 20, Math.cos(t * speed) * 200)
  camera.lookAt(0, 30, 0)
  renderer.render(scene, camera)
}

document.body.appendChild(renderer.domElement)
requestAnimationFrame(animate)
