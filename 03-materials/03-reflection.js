const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setClearColor(0xFFFFFF)
renderer.setSize(window.innerWidth, window.innerHeight)

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 20000)
camera.position.set(100, 100, 200)
camera.lookAt(0, 30, 0)

const spotlight = new THREE.SpotLight(0xFFFFFF)
spotlight.position.set(0, 200, 400)
scene.add(spotlight)
scene.add(new THREE.AmbientLight(0x111111))

const torus = new THREE.Mesh(
  new THREE.TorusKnotGeometry(15, 6, 32, 16, 4, 5),
  new THREE.MeshStandardMaterial({ color: 0xCC0000, wireframe: true, wireframeLinewidth: 5 })
)
torus.position.set(-30, 50, 0)
scene.add(torus)

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(20, 3, 3),
  new THREE.MeshStandardMaterial({ color: 0x00CC00 })
)
sphere.position.set(30, 50, 0)
scene.add(sphere)

const rotate = (t) => {
  requestAnimationFrame(rotate)
  torus.rotation.x += 0.02
  torus.rotation.y += 0.01
  sphere.rotation.y -= 0.02
  sphere.position.y = Math.sin(t * 0.001) * 30 + 50
}
requestAnimationFrame(rotate)

const reflectionCamera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 20000)
reflectionCamera.position.set(0, -100, 0)
reflectionCamera.lookAt(0, 30, 0)

const renderTarget = new THREE.WebGLRenderTarget(1024, 1024, { format: THREE.RGBFormat } )

const floorMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(4000, 4000),
  new THREE.MeshPhongMaterial({ color: 0xFFFFFF })
)
floorMesh.rotation.x = -Math.PI / 2
scene.add(floorMesh)

const reflectionMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshPhongMaterial({ map: renderTarget.texture, side: THREE.BackSide })
)
reflectionMesh.position.y = 0.01
reflectionMesh.rotation.x = Math.PI / 2
scene.add(reflectionMesh)

function animate (t) {
  requestAnimationFrame(animate)
  renderer.render(scene, reflectionCamera, renderTarget)
  renderer.render(scene, camera)
}

document.body.appendChild(renderer.domElement)
requestAnimationFrame(animate)
