import * as THREE from "three";

export class InputHandler {
  constructor() {
    this.keys = {
      w: false,
      arrowup: false,
      s: false,
      arrowdown: false,
      a: false,
      arrowleft: false,
      d: false,
      arrowright: false,
    };

    this.movementDirection = new THREE.Vector3(0, 0, 0);

    window.addEventListener("keydown", this._onKeyDown.bind(this), false);
    window.addEventListener("keyup", this._onKeyUp.bind(this), false);
  }

  _onKeyDown(event) {
    const key = event.key.toLowerCase();
    if (this.keys.hasOwnProperty(key)) {
      this.keys[key] = true;
      this._updateMovementDirection();
    }
  }

  _onKeyUp(event) {
    const key = event.key.toLowerCase();
    if (this.keys.hasOwnProperty(key)) {
      this.keys[key] = false;
      this._updateMovementDirection();
    }
  }

  _updateMovementDirection() {
    this.movementDirection.set(0, 0, 0);

    if (this.keys["w"] || this.keys["arrowup"]) {
      this.movementDirection.z -= 1;
    }
    if (this.keys["s"] || this.keys["arrowdown"]) {
      this.movementDirection.z += 1;
    }
    if (this.keys["a"] || this.keys["arrowleft"]) {
      this.movementDirection.x -= 1;
    }
    if (this.keys["d"] || this.keys["arrowright"]) {
      this.movementDirection.x += 1;
    }

    // Normalize ensures consistent speed regardless of diagonal movement
    // Note: Normalization happens in Player.update based on this direction vector
  }

  getMovementDirection() {
    // Return a copy to prevent external modification
    return this.movementDirection.clone();
  }
}
