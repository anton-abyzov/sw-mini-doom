/**
 * AI System
 * Controls enemy behavior with state machine (idle, chase, attack, dead)
 */

import * as THREE from 'three';
import { System } from '../ecs/System';
import { AIComponent } from '../components/AIComponent';
import { PositionComponent } from '../components/PositionComponent';
import { VelocityComponent } from '../components/VelocityComponent';
import { HealthComponent } from '../components/HealthComponent';
import { MeshComponent } from '../components/MeshComponent';

export class AISystem extends System {
  private playerPosition: THREE.Vector3 | null = null;

  setPlayerPosition(position: THREE.Vector3): void {
    this.playerPosition = position;
  }

  update(_deltaTime: number): void {
    if (!this.playerPosition) return;

    const entities = this.getEntities();
    const enemies = entities.filter(e =>
      e.hasComponent(AIComponent) &&
      e.hasComponent(PositionComponent) &&
      e.hasComponent(VelocityComponent) &&
      e.hasComponent(HealthComponent)
    );

    for (const enemy of enemies) {
      const ai = enemy.getComponent(AIComponent)!;
      const position = enemy.getComponent(PositionComponent)!;
      const velocity = enemy.getComponent(VelocityComponent)!;
      const health = enemy.getComponent(HealthComponent)!;
      const mesh = enemy.getComponent(MeshComponent);

      // Check if dead
      if (health.isDead() && ai.state !== 'dead') {
        ai.state = 'dead';
        velocity.velocity.set(0, 0, 0);

        // Visual feedback - change color to gray
        if (mesh?.mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.mesh.material.color.setHex(0x555555);
        }

        // Remove enemy after a delay
        setTimeout(() => {
          if (mesh) {
            mesh.mesh.parent?.remove(mesh.mesh);
          }
          this.world.removeEntity(enemy);
        }, 500);

        continue;
      }

      if (ai.state === 'dead') continue;

      // Calculate distance to player
      const toPlayer = this.playerPosition.clone().sub(position.position);
      const distance = toPlayer.length();

      // State machine
      switch (ai.state) {
        case 'idle':
          velocity.velocity.set(0, 0, 0);

          // Transition to chase if player in detection radius
          if (distance < ai.detectionRadius) {
            ai.state = 'chase';
          }
          break;

        case 'chase':
          // Transition to attack if in attack range
          if (distance < ai.attackRange) {
            ai.state = 'attack';
            velocity.velocity.set(0, 0, 0);
          } else if (distance > ai.detectionRadius * 1.5) {
            // Lost player
            ai.state = 'idle';
          } else {
            // Move towards player
            const direction = toPlayer.normalize();
            velocity.velocity.copy(direction.multiplyScalar(velocity.speed));

            // Face player
            const angle = Math.atan2(direction.x, direction.z);
            position.rotation.y = angle;
          }
          break;

        case 'attack':
          velocity.velocity.set(0, 0, 0);

          // Face player
          const direction = toPlayer.clone().normalize();
          const angle = Math.atan2(direction.x, direction.z);
          position.rotation.y = angle;

          // Transition to chase if player moves away
          if (distance > ai.attackRange * 1.2) {
            ai.state = 'chase';
          }

          // Try to shoot (handled by ShooterSystem in game logic)
          break;
      }
    }
  }
}
