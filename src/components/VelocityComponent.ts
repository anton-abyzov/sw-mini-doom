/**
 * Velocity Component
 * Stores movement velocity and speed
 */

import * as THREE from 'three';
import { Component } from '../ecs/Component';

export class VelocityComponent extends Component {
  public velocity: THREE.Vector3;
  public speed: number;

  constructor(speed: number = 5.0) {
    super();
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.speed = speed;
  }
}
