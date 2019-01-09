const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 20000)
renderer.setSize(window.innerWidth, window.innerHeight)
camera.position.set(-100, 0, 0)
camera.lookAt(0, 0, 0)

const makeLine = () => {
  const geometry = new THREE.Geometry()
  geometry.vertices.push(new THREE.Vector3(0, 0, 0))
  geometry.vertices.push(new THREE.Vector3(0, 0, 0))
  return new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({ color: 0x0000CC, linewidth: 10 })
  )
}

const vertexOne = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xCC0000 })
)

const vertexTwo = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xCC0000 })
)

const vertexThree = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xCC0000 })
)

const lineOne = makeLine()
const lineTwo = makeLine()
const lineThree = makeLine()

scene.add(vertexOne)
scene.add(vertexTwo)
scene.add(vertexThree)
scene.add(lineOne)
scene.add(lineTwo)
scene.add(lineThree)

function animate (t) {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

document.body.appendChild(renderer.domElement)
requestAnimationFrame(animate)

let step = 0
const stepOne = () => {
  let time = 0
  const totalTime = 100
  vertexTwo.position.set(0, 10, 5)
  const anim = () => {
    if (time <= 100) {
      requestAnimationFrame(anim)
    }
    time++
    lineOne.geometry.vertices[1].set(0, 10 * (time / totalTime), 5 * (time / totalTime))
    lineOne.geometry.verticesNeedUpdate = true
  }
  requestAnimationFrame(anim)
}

const stepTwo = () => {
  vertexThree.position.set(0, 0, 10)
  lineTwo.geometry.vertices[0].set(0, 10, 5)
  lineTwo.geometry.vertices[1].set(0, 0, 10)
  lineTwo.geometry.verticesNeedUpdate = true
  lineThree.geometry.vertices[0].set(0, 0, 10)
  lineThree.geometry.verticesNeedUpdate = true
}

window.addEventListener('keypress', (e) => {
  if (e.keyCode !== 32) {
    return
  }
  step++
  if (step === 1) {
    stepOne()
  }
  if (step === 2) {
    stepTwo()
  }
})
