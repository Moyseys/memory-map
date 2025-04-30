import * as THREE from "three";
import { setupScene } from "./sceneSetup";
import { Player } from "./player";
import { MemoryBlock } from "./memoryBlock";
import { InputHandler } from "./inputHandler";
import { Modal } from "./modal";

const CAMERA_HEIGHT = 15; // Reduced for closer view
const BLOCK_COUNT = 50; // More memory blocks
const MAP_SIZE = 40; // Larger map size

export class Game {
  constructor(renderDiv) {
    this.renderDiv = renderDiv;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.player = null;
    this.memoryBlocks = [];
    this.inputHandler = new InputHandler();
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster(); // Not used for collision here, but good to have
    this.modal = null;

    this._init();
  }

  _init() {
    const { scene, camera, renderer } = setupScene(
      this.renderDiv,
      CAMERA_HEIGHT
    );
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    // Create Player
    this.player = new Player(this.scene);
    this.player.mesh.position.set(0, 0.5, 0); // Start at center

    // Create Memory Blocks
    this._createMemoryBlocks();
    // Create modal for memory details
    this.modal = new Modal();

    // Handle window resize
    window.addEventListener("resize", this._onWindowResize.bind(this), false);
  }

  _createMemoryBlocks() {
    const blockGeometry = new THREE.BoxGeometry(1, 1, 1);
    const colors = [
      0xffadad, 0xffd6a5, 0xfdffb6, 0xcaffbf, 0x9bf6ff, 0xa0c4ff, 0xbdb2ff,
      0xffc6ff,
    ];
    for (let i = 0; i < BLOCK_COUNT; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      // Pass the scene to the MemoryBlock constructor
      const block = new MemoryBlock(blockGeometry, color, this.scene);
      // Position blocks randomly, avoiding center where player starts
      let positionFound = false;
      while (!positionFound) {
        const x = THREE.MathUtils.randFloat(
          -MAP_SIZE / 2 + 1,
          MAP_SIZE / 2 - 1
        );
        const z = THREE.MathUtils.randFloat(
          -MAP_SIZE / 2 + 1,
          MAP_SIZE / 2 - 1
        );
        // Simple check to avoid placing too close to the start
        if (Math.abs(x) > 1.5 || Math.abs(z) > 1.5) {
          block.mesh.position.set(x, 0.5, z);
          positionFound = true;
        }
      }
      this.scene.add(block.mesh);
      this.memoryBlocks.push(block);
    }

    // Setup listener for memory activation events
    document.addEventListener(
      "memoryActivated",
      this._onMemoryActivated.bind(this)
    );
  }

  _onMemoryActivated(event) {
    const memoryDetails = event.detail;
    this._showMemoryModal(memoryDetails);
  }

  _showMemoryModal(memoryDetails) {
    // Display the modal with memory details
    this.modal.show(memoryDetails);

    // Optionally pause game or reduce movement speed while modal is open
    // this.paused = true;
  }

  _onWindowResize() {
    const bounds = this.renderDiv.getBoundingClientRect();
    const aspect = bounds.width / bounds.height;
    const frustumSize = CAMERA_HEIGHT; // Keep consistent view regardless of aspect

    this.camera.left = (frustumSize * aspect) / -2;
    this.camera.right = (frustumSize * aspect) / 2;
    this.camera.top = frustumSize / 2;
    this.camera.bottom = frustumSize / -2;

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(bounds.width, bounds.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  _update(deltaTime) {
    // Update Player
    this.player.update(
      deltaTime,
      this.inputHandler.getMovementDirection(),
      MAP_SIZE
    );

    this._checkCollisions();

    // Make camera follow player
    const playerPos = this.player.mesh.position;
    this.camera.position.x = playerPos.x + CAMERA_HEIGHT * 0.8;
    this.camera.position.z = playerPos.z + CAMERA_HEIGHT * 0.8;
    this.camera.lookAt(playerPos);

    // Update memory blocks
    const playerPosition = this.player.mesh.position.clone();
    for (const block of this.memoryBlocks) {
      block.update(deltaTime, playerPosition);
    }
  }

  _checkCollisions() {
    const playerBox = new THREE.Box3().setFromObject(this.player.mesh);

    for (const block of this.memoryBlocks) {
      if (!block.interacted) {
        const blockBox = new THREE.Box3().setFromObject(block.mesh);
        if (playerBox.intersectsBox(blockBox)) {
          block.interact();
        }
      }
    }
  }

  _render() {
    this.renderer.render(this.scene, this.camera);
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      const deltaTime = this.clock.getDelta();
      this._update(deltaTime);
      this._render();
    });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }
}
