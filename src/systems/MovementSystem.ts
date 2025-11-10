/**
 * Movement System
 * Updates entity positions based on velocity
 */

import { System } from '../ecs/System';
import { PositionComponent } from '../components/PositionComponent';
import { VelocityComponent } from '../components/VelocityComponent';
import { MeshComponent } from '../components/MeshComponent';

export class MovementSystem extends System {
  update(deltaTime: number): void {
    const entities = this.getEntities();

    for (const entity of entities) {
      const position = entity.getComponent(PositionComponent);
      const velocity = entity.getComponent(VelocityComponent);
      const mesh = entity.getComponent(MeshComponent);

      if (position && velocity) {
        // Update position based on velocity
        position.position.addScaledVector(velocity.velocity, deltaTime);

        // Sync mesh position if it exists
        if (mesh) {
          mesh.mesh.position.copy(position.position);
          mesh.mesh.rotation.copy(position.rotation);
        }
      }
    }
  }
}
