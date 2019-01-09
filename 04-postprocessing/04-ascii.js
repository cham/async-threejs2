const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 20000)
renderer.setSize(window.innerWidth, window.innerHeight)

const spotlight = new THREE.SpotLight(0xEECCAA, 1)
spotlight.position.set(0, 3000, -2000)
scene.add(spotlight)

const gui = new dat.GUI()
const config = {
  cameraDistance: 60
}

gui.add(config, 'cameraDistance', 0, 500)

let effect
const material = new THREE.MeshStandardMaterial({ color: 0xCC0000, roughness: 0.4, metalness: 0.6 })
const loader = new THREE.OBJLoader()
loader.load(
  'head.obj',
  (obj) => {
    scene.add(obj)
    obj.scale.set(4,4,4)
    effect = new THREE.AsciiEffect(renderer, ' .:-+*=%@#', { invert: true })
    effect.setSize(window.innerWidth, window.innerHeight)
    effect.domElement.style.color = 'white'
    effect.domElement.style.backgroundColor = 'black'
    document.body.appendChild(effect.domElement)
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = material
      }
    })
  }
)



function animate (t) {
  requestAnimationFrame(animate)
  const speed = 0.0005
  camera.position.set(Math.sin(t * speed) * config.cameraDistance, 30, Math.cos(t * speed) * config.cameraDistance)
  camera.lookAt(0, 30, 0)
  if (effect) {
    effect.render(scene, camera)
  }
}

requestAnimationFrame(animate)
