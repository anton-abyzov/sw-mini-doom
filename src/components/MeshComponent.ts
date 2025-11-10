/**
 * Mesh Component
 * Stores Three.js mesh for rendering
 */

import * as THREE from 'three';
import { Component } from '../ecs/Component';

export class MeshComponent extends Component {
  public mesh: THREE.Mesh;

  constructor(mesh: THREE.Mesh) {
    super();
    this.mesh = mesh;
  }
}
