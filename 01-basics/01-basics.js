const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 20000)

const spotlight = new THREE.SpotLight(0xEECCAA, 1)
const mesh = new THREE.Mesh(
  new THREE.TorusKnotGeometry(20, 5, 200, 16, 3, 2),
  new THREE.MeshPhongMaterial({ color: 0xCC0000 })
)
const floorMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(2000, 2000),
  new THREE.MeshPhongMaterial({ color: 0xFFFFFF })
)

const gui = new dat.GUI()
const config = {
  cameraDistance: 200,
  spotlightColor: 0xEECCAA
}

gui.add(config, 'cameraDistance', 0, 1000)
gui.addColor(config, 'spotlightColor')

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
spotlight.position.set(0, 100, 100)
spotlight.castShadow = true
spotlight.shadow.mapSize.width = 1024
spotlight.shadow.mapSize.height = 1024
mesh.position.set(0, 30, 0)
mesh.castShadow = true
mesh.receiveShadow = true
floorMesh.rotation.x = -Math.PI / 2
floorMesh.receiveShadow = true

scene.add(camera)
scene.add(spotlight)
scene.add(mesh)
scene.add(floorMesh)

function animate (t) {
  requestAnimationFrame(animate)
  const speed = 0.0005
  camera.position.set(Math.sin(t * speed) * config.cameraDistance, 100, Math.cos(t * speed) * config.cameraDistance)
  camera.lookAt(0, 0, 0)
  spotlight.color = new THREE.Color(config.spotlightColor)
  renderer.render(scene, camera)
}

document.body.appendChild(renderer.domElement)
requestAnimationFrame(animate)
