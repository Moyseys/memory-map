import * as THREE from "three";
const INTERACTED_COLOR = 0x888888; // Grey color when interacted
const INTERACTION_RADIUS = 1.5; // Radius of interaction area
export class MemoryBlock {
  constructor(geometry, color, scene) {
    this.scene = scene;
    this.originalColor = new THREE.Color(color);
    this.material = new THREE.MeshStandardMaterial({
      color: this.originalColor,
      metalness: 0.2,
      roughness: 0.8,
    });

    // The main memory block
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.interacted = false;

    // Create the pulsing interaction area indicator
    this.createInteractionIndicator();

    // Memory details (example - would be populated with actual data)
    this.memoryDetails = {
      title: "Memory " + Math.floor(Math.random() * 100),
      description: "This is a memory of something interesting that happened.",
    };
  }

  createInteractionIndicator() {
    // Create a circle geometry for the interaction area
    const circleGeometry = new THREE.CircleGeometry(INTERACTION_RADIUS, 32);
    const circleMaterial = new THREE.MeshBasicMaterial({
      color: this.originalColor,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });

    this.interactionIndicator = new THREE.Mesh(circleGeometry, circleMaterial);

    // Position it just above the ground plane to avoid z-fighting
    this.interactionIndicator.rotation.x = -Math.PI / 2; // Make it horizontal
    this.interactionIndicator.position.y = 0.01; // Just above the ground

    // Add it as child of the main mesh so it moves with the block
    this.mesh.add(this.interactionIndicator);

    // Initially hide the interaction indicator
    this.interactionIndicator.visible = false;

    // Start the pulsing animation
    this.startPulse();
  }

  // Animate the pulse effect
  startPulse() {
    // Initial scale and opacity
    this.interactionIndicator.scale.set(0.7, 0.7, 0.7);
    this.interactionIndicator.material.opacity = 0.5;

    // Store animation state
    this.pulseData = {
      direction: 1, // 1 = growing, -1 = shrinking
      minScale: 0.7,
      maxScale: 1.0,
      minOpacity: 0.2,
      maxOpacity: 0.5,
      speed: 1.0,
    };
  }

  // Update the pulse animation - to be called in game loop
  updatePulse(deltaTime) {
    if (!this.interactionIndicator || this.interacted) return;

    const pulse = this.pulseData;
    const scaleChange = deltaTime * pulse.speed;

    // Current scale
    let currentScale = this.interactionIndicator.scale.x;

    // Update scale based on direction
    currentScale += scaleChange * pulse.direction;

    // Change direction if exceeding limits
    if (currentScale >= pulse.maxScale) {
      pulse.direction = -1;
      currentScale = pulse.maxScale;
    } else if (currentScale <= pulse.minScale) {
      pulse.direction = 1;
      currentScale = pulse.minScale;
    }

    // Apply new scale
    this.interactionIndicator.scale.set(
      currentScale,
      currentScale,
      currentScale
    );

    // Update opacity based on scale
    const opacityRange = pulse.maxOpacity - pulse.minOpacity;
    const scaleRange = pulse.maxScale - pulse.minScale;
    const scaleRatio = (currentScale - pulse.minScale) / scaleRange;

    const newOpacity = pulse.minOpacity + scaleRatio * opacityRange;
    this.interactionIndicator.material.opacity = newOpacity;
  }
  interact() {
    if (!this.interacted) {
      this.interacted = true;

      // Change color smoothly using GSAP or tween.js could be added later
      // For now, instant change
      this.material.color.set(INTERACTED_COLOR);
      this.material.emissive.set(INTERACTED_COLOR); // Add slight glow
      this.material.emissiveIntensity = 0.3;
      // Simple pop animation (can be improved with tweens)
      const initialScale = this.mesh.scale.clone();
      this.mesh.scale.multiplyScalar(1.2);
      setTimeout(() => {
        this.mesh.scale.copy(initialScale);
      }, 100); // Duration of the pop

      // Hide the interaction indicator
      if (this.interactionIndicator) {
        this.interactionIndicator.visible = false;
      }

      // Show modal with memory details
      this.showMemoryModal();
    }
  }

  reset() {
    this.interacted = false;
    this.material.color.copy(this.originalColor);
    this.material.emissive.setHex(0x000000);
    this.material.emissiveIntensity = 0;

    // Restore interaction indicator
    if (this.interactionIndicator) {
      this.interactionIndicator.visible = true;
    }
  }

  showMemoryModal() {
    // For now, just trigger a custom event that the Game class will listen for
    const memoryEvent = new CustomEvent("memoryActivated", {
      detail: {
        title: this.memoryDetails.title,
        description: this.memoryDetails.description,
        position: this.mesh.position.clone(),
      },
    });

    document.dispatchEvent(memoryEvent);
  }

  // Update method to be called from game loop
  update(deltaTime, playerPosition) {
    // Check distance to player for showing/hiding interaction indicator
    if (playerPosition) {
      const distanceToPlayer = this.mesh.position.distanceTo(playerPosition);
      const proximityThreshold = INTERACTION_RADIUS * 2; // Show indicator when player is within 2x the interaction radius

      // Show/hide indicator based on proximity
      if (this.interactionIndicator && !this.interacted) {
        this.interactionIndicator.visible =
          distanceToPlayer <= proximityThreshold;
      }
    }

    // Update pulse animation
    this.updatePulse(deltaTime);
  }
}
