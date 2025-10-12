import * as THREE from 'three';
import { OrbitControls, FBXLoader } from 'three/examples/jsm/Addons.js';

export function animation(canvas: HTMLCanvasElement) {
    const width = Math.max(300, canvas.clientWidth);
    const height = Math.max(300, canvas.clientHeight);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(width, height);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 500);
  camera.position.set(10, 10, 10);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 4, 0);

  // Single cheap light
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);

  let mixer: THREE.AnimationMixer | null = null;
  const fbxLoader = new FBXLoader();
  fbxLoader.load('/public/assets/animations/Running.fbx', (fbx) => {
    fbx.scale.set(0.05, 0.05, 0.05);
    fbx.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        obj.frustumCulled = true;
      }
    });
    scene.add(fbx);
    mixer = new THREE.AnimationMixer(fbx);
    if (fbx.animations[0]) mixer.clipAction(fbx.animations[0]).play();
  });

  const clock = new THREE.Clock();

  function resizeRenderer() {
    const w = Math.max(300, canvas.clientWidth);
    const h = Math.max(300, canvas.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resizeRenderer);
  resizeRenderer();

  renderer.setAnimationLoop(() => {
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    controls.update();
    renderer.render(scene, camera);
  });
}
