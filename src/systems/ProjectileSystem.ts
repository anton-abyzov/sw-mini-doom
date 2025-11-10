/**
 * Projectile System
 * Handles projectile lifetime and hit detection
 */

import * as THREE from 'three';
import { System } from '../ecs/System';
import { PositionComponent } from '../components/PositionComponent';
import { ProjectileComponent } from '../components/ProjectileComponent';
import { ColliderComponent } from '../components/ColliderComponent';
import { HealthComponent } from '../components/HealthComponent';
import { CollisionUtils } from '../collision/CollisionUtils';
import { MeshComponent } from '../components/MeshComponent';

export class ProjectileSystem extends System {
  private scene: THREE.Scene;

  constructor(world: any, scene: THREE.Scene) {
    super(world);
    this.scene = scene;
  }

  update(_deltaTime: number): void {
    const entities = this.getEntities();

    // Get all projectiles
    const projectiles = entities.filter(e =>
      e.hasComponent(ProjectileComponent) &&
      e.hasComponent(PositionComponent)
    );

    // Get all damageable entities
    const targets = entities.filter(e =>
      e.hasComponent(HealthComponent) &&
      e.hasComponent(PositionComponent) &&
      e.hasComponent(ColliderComponent)
    );

    for (const projectile of projectiles) {
      const projectileComp = projectile.getComponent(ProjectileComponent)!;
      const position = projectile.getComponent(PositionComponent)!;
      const mesh = projectile.getComponent(MeshComponent);

      // Check if projectile expired
      if (projectileComp.isExpired()) {
        if (mesh) {
          this.scene.remove(mesh.mesh);
        }
        this.world.removeEntity(projectile);
        continue;
      }

      // Check for hits using sphere-sphere collision (more reliable for fast projectiles)
      for (const target of targets) {
        const targetPos = target.getComponent(PositionComponent)!;
        const targetCollider = target.getComponent(ColliderComponent)!;

        // Skip if projectile owner matches target type
        // (player projectiles don't hit player, enemy projectiles don't hit enemies)
        const isPlayerTarget = target.id === 'player';
        const isEnemyTarget = target.id.startsWith('enemy');

        if ((projectileComp.owner === 'player' && isPlayerTarget) ||
            (projectileComp.owner === 'enemy' && isEnemyTarget)) {
          continue;
        }

        // Calculate target radius (make it generous for better hit detection)
        const targetRadius = targetCollider.type === 'sphere'
          ? targetCollider.getRadius()
          : Math.max(targetCollider.size.x, targetCollider.size.z) * 0.6; // Increased from /2 to *0.6

        // Projectile radius (small sphere)
        const projectileRadius = 0.3;

        // Check sphere-sphere collision
        const hit = CollisionUtils.checkSphereSphere(
          position.position,
          projectileRadius,
          targetPos.position,
          targetRadius
        );

        if (hit) {
          // Apply damage
          const health = target.getComponent(HealthComponent)!;
          health.takeDamage(projectileComp.damage);
          console.log(`HIT! ${projectileComp.owner} projectile hit ${target.id}, damage: ${projectileComp.damage}, health: ${health.health}`);

          // Remove projectile
          if (mesh) {
            this.scene.remove(mesh.mesh);
          }
          this.world.removeEntity(projectile);
          break;
        }
      }
    }
  }
}
