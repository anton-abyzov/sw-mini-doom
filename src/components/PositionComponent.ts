/**
 * Position Component
 * Stores 3D position and rotation
 */

import * as THREE from 'three';
import { Component } from '../ecs/Component';

export class PositionComponent extends Component {
  public position: THREE.Vector3;
  public rotation: THREE.Euler;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    super();
    this.position = new THREE.Vector3(x, y, z);
    this.rotation = new THREE.Euler(0, 0, 0);
  }
}
