/**
 * Collision System
 * Handles AABB collision detection and resolution
 */

import { System } from '../ecs/System';
import { PositionComponent } from '../components/PositionComponent';
import { ColliderComponent } from '../components/ColliderComponent';
import { VelocityComponent } from '../components/VelocityComponent';
import { CollisionUtils } from '../collision/CollisionUtils';

export class CollisionSystem extends System {
  update(_deltaTime: number): void {
    const entities = this.getEntities();

    // Get all entities with colliders
    const collidables = entities.filter(e =>
      e.hasComponent(PositionComponent) &&
      e.hasComponent(ColliderComponent)
    );

    // Check collisions between dynamic and static objects
    for (const entity of collidables) {
      const collider = entity.getComponent(ColliderComponent)!;

      // Skip static objects (walls don't move)
      if (collider.isStatic) continue;

      const position = entity.getComponent(PositionComponent)!;
      const velocity = entity.getComponent(VelocityComponent);

      const entityBox = collider.getBounds(position.position);

      // Check against all other colliders
      for (const other of collidables) {
        if (entity === other) continue;

        const otherCollider = other.getComponent(ColliderComponent)!;
        const otherPosition = other.getComponent(PositionComponent)!;
        const otherBox = otherCollider.getBounds(otherPosition.position);

        // Check collision
        if (CollisionUtils.checkAABB(entityBox, otherBox)) {
          // Resolve collision if the entity has velocity
          if (velocity) {
            const correction = CollisionUtils.resolveAABB(
              entityBox,
              otherBox,
              velocity.velocity
            );
            position.position.add(correction);
          }
        }
      }
    }
  }
}
