/**
 * Collision Detection Utilities
 * AABB (Axis-Aligned Bounding Box) and Ray-Sphere collision
 */

import * as THREE from 'three';

export class CollisionUtils {
  /**
   * Check AABB collision between two boxes
   */
  static checkAABB(box1: THREE.Box3, box2: THREE.Box3): boolean {
    return box1.intersectsBox(box2);
  }

  /**
   * Check ray-sphere collision
   * Returns distance to hit point, or null if no hit
   */
  static checkRaySphere(
    rayOrigin: THREE.Vector3,
    rayDirection: THREE.Vector3,
    sphereCenter: THREE.Vector3,
    sphereRadius: number
  ): number | null {
    const oc = rayOrigin.clone().sub(sphereCenter);
    const a = rayDirection.dot(rayDirection);
    const b = 2.0 * oc.dot(rayDirection);
    const c = oc.dot(oc) - sphereRadius * sphereRadius;
    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
      return null; // No intersection
    }

    const t = (-b - Math.sqrt(discriminant)) / (2.0 * a);
    return t > 0 ? t : null; // Return distance if hit is in front of ray
  }

  /**
   * Resolve AABB collision by pushing entity out
   */
  static resolveAABB(
    movingBox: THREE.Box3,
    staticBox: THREE.Box3,
    velocity: THREE.Vector3
  ): THREE.Vector3 {
    const correction = new THREE.Vector3();

    // Calculate overlap on each axis
    const overlapX = Math.min(
      movingBox.max.x - staticBox.min.x,
      staticBox.max.x - movingBox.min.x
    );
    const overlapZ = Math.min(
      movingBox.max.z - staticBox.min.z,
      staticBox.max.z - movingBox.min.z
    );

    // Push on axis with smallest overlap
    if (overlapX < overlapZ) {
      correction.x = velocity.x > 0 ? -overlapX : overlapX;
    } else {
      correction.z = velocity.z > 0 ? -overlapZ : overlapZ;
    }

    return correction;
  }

  /**
   * Check if point is inside AABB
   */
  static pointInAABB(point: THREE.Vector3, box: THREE.Box3): boolean {
    return box.containsPoint(point);
  }

  /**
   * Check sphere-sphere collision
   * Returns true if two spheres intersect
   */
  static checkSphereSphere(
    center1: THREE.Vector3,
    radius1: number,
    center2: THREE.Vector3,
    radius2: number
  ): boolean {
    const distance = center1.distanceTo(center2);
    return distance < (radius1 + radius2);
  }
}
