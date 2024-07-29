import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { SSAARenderPass } from 'three/addons/postprocessing/SSAARenderPass.js';

// Cursor
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = - (event.clientY / sizes.height - 0.5)
} )


// Canvas
const canvas = document.querySelector('canvas.webgl')



// GLTF Loader
const gltfLoader = new GLTFLoader()

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( '/draco/' );
gltfLoader.setDRACOLoader( dracoLoader );

gltfLoader.load(
    '/models/Clock/Clock_Splash.gltf',
	function ( gltf ) {
		scene.add( gltf.scene );
        console.log(gltf)
    }
)



// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    //Update canvas sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //Update canmera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)

    //Update effect composer
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    effectComposer.setSize(sizes.width, sizes.height)

})



// Scene
const scene = new THREE.Scene()



// Camera
const camera = new THREE.PerspectiveCamera(3, sizes.width / sizes.height)
camera.position.x = 5
camera.position.y = 44
camera.position.z = 22

const lookatPos = new THREE.Vector3(0,4,-4)
camera.lookAt(lookatPos)
scene.add(camera)

const camX = camera.position.x
const camY = camera.position.y


// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 3.5)
scene.add(ambientLight)


// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.outputEncoding = THREE.LinearEncoding;


// Post-Processing
const effectComposer = new EffectComposer(renderer)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
effectComposer.setSize(sizes.width, sizes.height)

const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

const bokehPass = new BokehPass( scene, camera, {
    focus: 47.2,
    aperture: .0014,
    maxblur: 0.01
} )



const ssaaRenderPassP = new SSAARenderPass( scene, camera );
effectComposer.addPass( ssaaRenderPassP );



const outputPass = new OutputPass()
effectComposer.addPass( outputPass );

// Animate
const clock = new THREE.Clock()

const tick = () =>
{

    //set cam orbit
    camera.position.x = camX + cursor.x * 0.77
    camera.position.y = camY + cursor.y * 0.77
    camera.lookAt(lookatPos)

    // Render
    //renderer.render(scene, camera)
    effectComposer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()