const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 20000)
renderer.setSize(window.innerWidth, window.innerHeight)

const spotlight = new THREE.SpotLight(0xEECCAA, 1)
spotlight.position.set(0, 3000, 2000)
scene.add(spotlight)

const mmo = (g, m) => {
  const group = new THREE.Group()
  for (let i = 0, l = m.length; i < l; i ++) {
    group.add(new THREE.Mesh(g, m[i]))
  }
  return group
}

const gui = new dat.GUI()
const config = {
  useMeshStandard: true,
  useMeshBasic: false,
  useMeshLambert: false,
  useMeshPhong: false,
  standardColor: 0xCC0000,
  standardEmissive: 0x000000,
  roughness: 0.2,
  metalness: 0.6,
  flatShading: false,
  basicColor: 0x00FF00,
  wireframe: false,
  wireframeLinewidth: 1,
  lambertColor: 0xCC0000,
  lambertEmissive: 0x000000,
  lambertAlpha: 1,
  lambertWireframe: false,
  lambertWireframeLinewidth: 1,
  phongColor: 0xCC0000,
  phongEmissive: 0x000000,
  phongAlpha: 1,
  phongWireframe: false,
  phongWireframeLinewidth: 1,
}

gui.add(config, 'useMeshStandard').name('Standard')
const f0 = gui.addFolder('MeshStandardMaterial')
f0.addColor(config, 'standardColor').name('color')
f0.addColor(config, 'standardEmissive').name('emissive')
f0.add(config, 'roughness', 0, 1, 0.01)
f0.add(config, 'metalness', 0, 1, 0.01)
f0.add(config, 'flatShading')

gui.add(config, 'useMeshLambert').name('Lambert')
const f2 = gui.addFolder('MeshLambertMaterial')
f2.addColor(config, 'lambertColor').name('color')
f2.addColor(config, 'lambertEmissive').name('emissive')
f2.add(config, 'lambertAlpha', 0, 1, 0.01).name('opacity')
f2.add(config, 'lambertWireframe')
f2.add(config, 'lambertWireframeLinewidth', 0, 10, 0.1).name('wireframeLinewidth')

gui.add(config, 'useMeshPhong').name('Phong')
const f3 = gui.addFolder('MeshPhongMaterial')
f3.addColor(config, 'phongColor').name('color')
f3.addColor(config, 'phongEmissive').name('emissive')
f3.add(config, 'phongAlpha', 0, 1, 0.01).name('opacity')
f3.add(config, 'phongWireframe')
f3.add(config, 'phongWireframeLinewidth', 0, 10, 0.1).name('wireframeLinewidth')

gui.add(config, 'useMeshBasic').name('Basic')
const f1 = gui.addFolder('MeshBasicMaterial')
f1.addColor(config, 'basicColor').name('color')
f1.add(config, 'wireframe')
f1.add(config, 'wireframeLinewidth', 0, 10, 0.1)


const createMesh = () => {
  const materials = []
  if (config.useMeshStandard) {
    materials.push(new THREE.MeshStandardMaterial({
      color: config.standardColor,
      emissive: config.standardEmissive,
      roughness: config.roughness,
      metalness: config.metalness,
      flatShading: config.flatShading
    }))
  }
  if (config.useMeshLambert) {
    materials.push(new THREE.MeshLambertMaterial({
      color: config.lambertColor,
      emissive: config.lambertEmissive,
      opacity: config.lambertAlpha,
      wireframe: config.lambertWireframe,
      wireframeLinewidth: config.lambertWireframeLinewidth,
      transparent: true
    }))
  }
  if (config.useMeshPhong) {
    materials.push(new THREE.MeshPhongMaterial({
      color: config.phongColor,
      emissive: config.phongEmissive,
      opacity: config.phongAlpha,
      wireframe: config.phongWireframe,
      wireframeLinewidth: config.phongWireframeLinewidth,
      transparent: true
    }))
  }
  if (config.useMeshBasic) {
    materials.push(new THREE.MeshBasicMaterial({
      color: config.basicColor,
      wireframe: config.wireframe,
      wireframeLinewidth: config.wireframeLinewidth
    }))
  }
  return mmo(
    new THREE.TorusKnotGeometry(20, 5, 200, 16, 3, 2),
    materials
  )
}

let mesh = createMesh()
scene.add(mesh)

let lastConfig = Object.assign({}, config)
function animate (t) {
  requestAnimationFrame(animate)
  const speed = 0.0005
  camera.position.set(Math.sin(t * speed) * 100, 100, Math.cos(t * speed) * 100)
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
