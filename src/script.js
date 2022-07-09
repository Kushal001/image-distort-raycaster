import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "dat.gui"
import particleVertexShader from "./shaders/particle/vertex.glsl"
import particleFragmentShader from "./shaders/particle/fragment.glsl"
/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

// Mouse
const mouse = new THREE.Vector2()

/**
 * Geometry
 */
const geometry = new THREE.PlaneBufferGeometry(17, 17, 128, 128)

/**
 * Materials
 */
const materials = new THREE.ShaderMaterial({
  vertexShader: particleVertexShader,
  fragmentShader: particleFragmentShader,

  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: mouse },
    uPoints: { value: new THREE.Vector2() },
  },

  // wireframe: true,
})

const mesh = new THREE.Points(geometry, materials)
// scene.add(mesh)

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Mouse
 */
window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1
  mouse.y = -(event.clientY / sizes.height) * 2 + 1
})

/**
 * Camera
 */
// Base camera
// const camera = new THREE.PerspectiveCamera(
//   75,
//   sizes.width / sizes.height,
//   0.1,
//   100
// )
const aspectRatio = sizes.width / sizes.height
const camera = new THREE.OrthographicCamera(
  -4 * aspectRatio,
  4 * aspectRatio,
  4,
  -4,
  0.1,
  100
)

camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Red dot
 */
const dotGeometry = new THREE.CircleBufferGeometry(1, 128)

/**
 * Materials
 */
const dotMaterials = new THREE.MeshBasicMaterial({
  color: "#ff0",
})

const dotMesh = new THREE.Points(dotGeometry, materials)
scene.add(dotMesh)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Cast ray
  raycaster.setFromCamera(mouse, camera)

  const objectsToTest = [mesh]
  const intersects = raycaster.intersectObjects(objectsToTest)

  if (intersects.length > 0) {
    dotMesh.position.set(intersects[0].point.x, intersects[0].point.y, 2)

    materials.uniforms.uPoints.value = new THREE.Vector2(
      intersects[0].point.x,
      intersects[0].point.y
    )
  }

  // Update materials
  materials.uniforms.uTime.value = elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
