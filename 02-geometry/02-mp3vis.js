const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(window.innerWidth, window.innerHeight)
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 20000)
camera.position.set(100, 70, 100)
camera.lookAt(0, 0, 0)

const spotlight = new THREE.SpotLight(0xFFFFFF, 1)
spotlight.position.set(75, 100, 100)
spotlight.castShadow = true
spotlight.shadow.mapSize.width = 1024
spotlight.shadow.mapSize.height = 1024
scene.add(spotlight)

const ambient = new THREE.AmbientLight(0x333333)
scene.add(ambient)

const planeSize = 64
const mesh = new THREE.Mesh(
  new THREE.Geometry(),
  new THREE.MeshLambertMaterial({ color: 0xCC0000, side: THREE.DoubleSide })
)

function addFace(geometry, bottomLeftVertex, topRightVertex){
  geometry.faces.push(new THREE.Face3(bottomLeftVertex, bottomLeftVertex+1, topRightVertex))
  geometry.faces.push(new THREE.Face3(topRightVertex, topRightVertex-1, bottomLeftVertex))
}

for (let i = 0; i < planeSize; i++) {
  for (let j = 0; j < planeSize; j++) {
    mesh.geometry.vertices.push(new THREE.Vector3(j, 0, i));
  }
}
for (let i = 0; i < planeSize - 1; i++) {
  for (let j = 0; j < planeSize - 1; j++) {
  let rowOffset = i * planeSize
    addFace(mesh.geometry, rowOffset + j, rowOffset + planeSize + j + 1)
  }
}
mesh.castShadow = true
mesh.receiveShadow = true
mesh.geometry.computeFaceNormals()
scene.add(mesh)

const audioContext = new AudioContext()
const analyser = audioContext.createAnalyser()
analyser.connect(audioContext.destination)
analyser.fftSize = planeSize * 2
const source = audioContext.createBufferSource()
source.connect(analyser)

const xhr = new XMLHttpRequest()
xhr.open('GET', './audio.mp3')
xhr.responseType = 'arraybuffer'
xhr.onload = () => {
  audioContext.decodeAudioData(xhr.response, (buffer) => {
    source.buffer = buffer
    const frame = new Uint8Array(planeSize * 2)
    const scale = 0.2
    const audioTick = () => {
      requestAnimationFrame(audioTick)
      analyser.getByteFrequencyData(frame)
      const vertices = mesh.geometry.vertices
      for (let i = 0; i < planeSize; i++) {
        vertices[i].y = frame[i] * scale
      }
      for (let i = planeSize - 1; i > 0; i--){
          for (let j = 0; j < planeSize; j++){
              let offset = i * planeSize
              let prevRow = (i - 1) * planeSize
              vertices[offset + j].y = vertices[prevRow + j].y
          }
      }
      mesh.geometry.verticesNeedUpdate = true
    }
    requestAnimationFrame(audioTick)
    source.start()
  })
}
xhr.send()

function animate (t) {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

document.body.appendChild(renderer.domElement)
requestAnimationFrame(animate)
