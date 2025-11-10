/**
 * Collider Component
 * Stores collision bounds and type
 */

import * as THREE from 'three';
import { Component } from '../ecs/Component';

export type ColliderType = 'box' | 'sphere';

export class ColliderComponent extends Component {
  public type: ColliderType;
  public size: THREE.Vector3; // for box: width, height, depth; for sphere: radius in x
  public isStatic: boolean; // static colliders don't move (walls)

  constructor(
    type: ColliderType = 'box',
    size: THREE.Vector3 = new THREE.Vector3(1, 1, 1),
    isStatic: boolean = false
  ) {
    super();
    this.type = type;
    this.size = size.clone();
    this.isStatic = isStatic;
  }

  public getRadius(): number {
    return this.size.x; // for sphere colliders
  }

  public getBounds(position: THREE.Vector3): THREE.Box3 {
    const halfSize = this.size.clone().multiplyScalar(0.5);
    return new THREE.Box3(
      position.clone().sub(halfSize),
      position.clone().add(halfSize)
    );
  }
}
