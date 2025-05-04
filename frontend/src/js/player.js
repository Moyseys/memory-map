import * as THREE from "three";

const PLAYER_SPEED = 5.0;
const PLAYER_RADIUS = 0.4;

export class Player {
  constructor(scene) {
    this.scene = scene;
    this.speed = PLAYER_SPEED;
    this.velocity = new THREE.Vector3();

    // Use a capsule or sphere for the player representation
    const geometry = new THREE.CapsuleGeometry(PLAYER_RADIUS, 0.2, 4, 8); // Radius, height
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ff00, // Bright green player
      metalness: 0.3,
      roughness: 0.6,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.y = PLAYER_RADIUS + 0.1; // Adjust based on geometry height
    this.mesh.rotation.x = Math.PI / 2; // Orient capsule correctly if needed
    this.scene.add(this.mesh);

    // Bounding box helper (optional, for visualization)
    // this.bboxHelper = new THREE.BoxHelper(this.mesh, 0xffff00);
    // this.scene.add(this.bboxHelper);
  }

  update(deltaTime, direction, mapSize) {
    // Calculate velocity based on direction input
    this.velocity
      .copy(direction)
      .normalize()
      .multiplyScalar(this.speed * deltaTime);

    // Apply velocity to position
    this.mesh.position.add(this.velocity);

    // Keep player within map bounds
    const halfMap = mapSize / 2 - PLAYER_RADIUS;
    this.mesh.position.x = THREE.MathUtils.clamp(
      this.mesh.position.x,
      -halfMap,
      halfMap
    );
    this.mesh.position.z = THREE.MathUtils.clamp(
      this.mesh.position.z,
      -halfMap,
      halfMap
    );

    // Update bounding box helper if used
    // if (this.bboxHelper) {
    //     this.bboxHelper.update();
    // }
  }
}
