import * as THREE from "three";

export function setupScene(renderDiv, cameraHeight) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222233); // Dark blue background
  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(renderDiv.clientWidth, renderDiv.clientHeight);
  renderDiv.appendChild(renderer.domElement);
  // Camera (Orthographic)
  const aspect = renderDiv.clientWidth / renderDiv.clientHeight;
  const frustumSize = cameraHeight;
  const camera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    1, // Near plane
    1000 // Far plane
  );

  // Position the camera at an angle to create an isometric-like view
  const distance = cameraHeight * 0.8; // Slightly closer for better view
  camera.position.set(distance * 0.8, distance, distance * 0.8); // 45-degree angle from positive X and Z
  camera.lookAt(scene.position);
  scene.add(camera);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Soft white light
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
  directionalLight.position.set(5, 10, 7.5);
  directionalLight.castShadow = false; // Shadows can be expensive, disable for now
  scene.add(directionalLight);

  // Floor
  const floorGeometry = new THREE.PlaneGeometry(20, 20, 10, 10); // Grid segments added
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x444455,
    wireframe: true, // Grid effect
    side: THREE.DoubleSide,
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2; // Rotate to be horizontal
  floor.position.y = 0; // Position at the base
  scene.add(floor);

  // Optional: Add Axes Helper for debugging
  // const axesHelper = new THREE.AxesHelper( 5 );
  // scene.add( axesHelper );

  return { scene, camera, renderer };
}
