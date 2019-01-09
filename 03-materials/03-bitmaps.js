const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 20000)
renderer.setSize(window.innerWidth, window.innerHeight)

const spotlight = new THREE.SpotLight(0xFFFFFF, 1)
spotlight.position.set(0, 200, 100)
scene.add(spotlight)

scene.add(new THREE.AmbientLight(0x555555))

const mmo = (g, m) => {
  const group = new THREE.Group()
  for (let i = 0, l = m.length; i < l; i ++) {
    group.add(new THREE.Mesh(g, m[i]))
  }
  return group
}

const gui = new dat.GUI()
const config = {
  map: false,
  alphaMap: false,
  bumpMap: false,
  specularMap: false
}

gui.add(config, 'map')
gui.add(config, 'alphaMap')
gui.add(config, 'bumpMap')
gui.add(config, 'specularMap')


const createMesh = () => {
  let material
  if (config.map) {
    const mapTex = new THREE.TextureLoader().load('./bitmap.jpg')
    material = new THREE.MeshPhongMaterial({
      map: mapTex,
      shininess: 80
    })
  }
  if (config.alphaMap) {
    const mapTex = new THREE.TextureLoader().load('./bitmap.jpg')
    const alphaTex = new THREE.TextureLoader().load('./alphamap.jpg')
    material = new THREE.MeshPhongMaterial({
      map: mapTex,
      alphaMap: alphaTex,
      transparent: true,
      side: THREE.DoubleSide,
      shininess: 80
    })
  }
  if (config.bumpMap) {
    const mapTex = new THREE.TextureLoader().load('./bitmap.jpg')
    const bumpTex = new THREE.TextureLoader().load('./bumpmap.jpg')
    material = new THREE.MeshPhongMaterial({
      map: mapTex,
      bumpMap: bumpTex,
      bumpScale: 5,
      shininess: 80
    })
  }
  if (config.specularMap) {
    const mapTex = new THREE.TextureLoader().load('./bitmap.jpg')
    const specularTex = new THREE.TextureLoader().load('./alphamap.jpg')
    material = new THREE.MeshPhongMaterial({
      map: mapTex,
      specularMap: specularTex,
      shininess: 80
    })
  }
  return new THREE.Mesh(
    new THREE.SphereGeometry(20, 60, 60),
    material
  )
}

let mesh = createMesh()
scene.add(mesh)

let lastConfig = Object.assign({}, config)
function animate (t) {
  requestAnimationFrame(animate)
  const speed = 0.0005
  camera.position.set(Math.sin(t * speed) * 100, 20, Math.cos(t * speed) * 100)
  camera.lookAt(0, 0, 0)

  if (Object.keys(config).find(k => config[k] !== lastConfig[k])) {
    scene.remove(mesh)
    mesh = createMesh()
    scene.add(mesh)
  }

  renderer.render(scene, camera)
  lastConfig = Object.assign({}, config)
}

document.body.appendChild(renderer.domElement)
requestAnimationFrame(animate)
