const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 20000)
camera.position.set(0, 30, 60)
camera.lookAt(0, 30, 0)
renderer.setSize(window.innerWidth, window.innerHeight)

const spotlight = new THREE.SpotLight(0xEECCAA, 1)
spotlight.position.set(0, 3000, -2000)
scene.add(spotlight)

scene.add(new THREE.AmbientLight(0x333333))

const gui = new dat.GUI()
const config = {
  rotate: false,
  distance: 60,
  x: 0,
  y: 25,
  z: 55
}

const f0 = gui.addFolder('Refractor position')
f0.add(config, 'x', -13, 13, 0.1)
f0.add(config, 'y', -500, 500)
f0.add(config, 'z', -500, 500)
const f1 = gui.addFolder('Camera')
f1.add(config, 'rotate')
f1.add(config, 'distance', 0, 500)

let mesh
const material = new THREE.MeshStandardMaterial({ color: 0x0099CC, roughness: 0.4, metalness: 0.6 })
const loader = new THREE.OBJLoader()
loader.load(
  '../04-postprocessing/head.obj',
  (obj) => {
    mesh = obj
    scene.add(obj)
    obj.scale.set(4,4,4)
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = material
      }
    })
  }
)

const torus = new THREE.Mesh(
  new THREE.TorusKnotGeometry(15, 6, 32, 16, 4, 5),
  new THREE.MeshStandardMaterial({ color: 0x0099CC, wireframe: true, wireframeLinewidth: 5 })
)
torus.position.set(0, 20, -50)
scene.add(torus)

const rotate = (t) => {
  requestAnimationFrame(rotate)
  torus.rotation.x += 0.02
  torus.rotation.y += 0.01
}
requestAnimationFrame(rotate)

const planeTex = new THREE.TextureLoader().load('watertile.jpg')
const waterPlane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1000, 1000),
  new THREE.MeshBasicMaterial({
    map: planeTex
  })
)
planeTex.wrapS = planeTex.wrapT = THREE.RepeatWrapping
planeTex.repeat.set(32, 32)
waterPlane.position.set(0, 0, -100)
scene.add(waterPlane)

const refractor = new THREE.Refractor(
  new THREE.PlaneBufferGeometry(20, 20),
  {
    color: 0XAAAAAA,
    textureWidth: 1024,
    textureHeight: 1024,
    shader: THREE.WaterRefractionShader
  }
)
const waterTexture = new THREE.TextureLoader().load('waterdudv.jpg')
waterTexture.wrapS = waterTexture.wrapT = THREE.RepeatWrapping
refractor.material.uniforms.tDudv.value = waterTexture
scene.add(refractor)

function animate (t) {
  requestAnimationFrame(animate)
  const speed = 0.0005
  if (mesh) {
    mesh.rotation.y = t * -speed
  }
  refractor.position.set(config.x, config.y, config.z)
  if (config.rotate) {
    camera.position.set(Math.sin(t * speed) * config.distance, 30, Math.cos(t * speed) * config.distance)
    camera.lookAt(0, 30, 0)
  } else {
    camera.position.set(0, 30, 60)
    camera.lookAt(0, 30, 0)
  }
  renderer.render(scene, camera)
}

document.body.appendChild(renderer.domElement)
requestAnimationFrame(animate)
