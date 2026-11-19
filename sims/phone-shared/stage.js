// Studio stage for smartphone teardown: clean seamless white studio with soft ground shadow.
import * as THREE from 'three';

export function createStage({canvas, floorY = 0.0}) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    preserveDrawingBuffer: true,
    powerPreference: 'high-performance',
  });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#fbfbfc');

  // Camera looking down at teardown array
  const camera = new THREE.PerspectiveCamera(35, 16 / 9, 0.1, 100);
  camera.position.set(0, 14.8, 11.8);
  camera.lookAt(0, 0, 0.1);

  // Studio lighting: clean high-key photography studio
  const ambientLight = new THREE.AmbientLight('#ffffff', 1.9);
  scene.add(ambientLight);

  // Key directional light with soft shadows from top-right
  const keyLight = new THREE.DirectionalLight('#ffffff', 2.4);
  keyLight.position.set(5, 20, 9);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.near = 1;
  keyLight.shadow.camera.far = 40;
  keyLight.shadow.camera.left = -11;
  keyLight.shadow.camera.right = 11;
  keyLight.shadow.camera.top = 11;
  keyLight.shadow.camera.bottom = -11;
  keyLight.shadow.bias = -0.0004;
  keyLight.shadow.radius = 2.5;
  scene.add(keyLight);

  // Soft fill light from front-left
  const fillLight = new THREE.DirectionalLight('#f0f4fa', 1.3);
  fillLight.position.set(-9, 14, 7);
  scene.add(fillLight);

  // Rim back-light for metallic definition
  const rimLight = new THREE.DirectionalLight('#ffffff', 0.8);
  rimLight.position.set(0, 10, -12);
  scene.add(rimLight);

  // White studio tabletop / floor with shadow reception
  const floorGeo = new THREE.PlaneGeometry(60, 60);
  const floorMat = new THREE.ShadowMaterial({opacity: 0.24});
  const shadowPlane = new THREE.Mesh(floorGeo, floorMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = floorY;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  // Seamless white floor plane underneath shadow
  const whiteFloorMat = new THREE.MeshBasicMaterial({color: '#fbfbfc'});
  const whiteFloor = new THREE.Mesh(floorGeo, whiteFloorMat);
  whiteFloor.rotation.x = -Math.PI / 2;
  whiteFloor.position.y = floorY - 0.005;
  scene.add(whiteFloor);

  const addPhone = (phone) => {
    // Enable shadows on all phone meshes
    phone.root.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(phone.root);
  };

  let currentW = 1600;
  let currentH = 900;
  const size = {w: 1600, h: 900};

  const resize = (width, height, dpr = 1) => {
    currentW = width;
    currentH = height;
    size.w = width;
    size.h = height;
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const pv = new THREE.Vector3();
  const project = (p) => {
    pv.copy(p).project(camera);
    if (pv.z > 1) return null;
    return [(pv.x * 0.5 + 0.5) * currentW, (-pv.y * 0.5 + 0.5) * currentH];
  };

  const frame = ({cam = null} = {}) => {
    if (cam) {
      if (cam.pos) camera.position.copy(cam.pos);
      if (cam.target) camera.lookAt(cam.target);
      if (cam.sx != null || cam.sy != null) {
        camera.setViewOffset(size.w, size.h, -(cam.sx || 0), -(cam.sy || 0), size.w, size.h);
      } else {
        camera.clearViewOffset();
      }
      camera.updateMatrixWorld();
    }
    renderer.render(scene, camera);
  };

  return {renderer, scene, camera, addPhone, resize, frame, project, size};
}
