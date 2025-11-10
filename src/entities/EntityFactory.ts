/**
 * Entity Factory
 * Creates game entities (player, enemies, projectiles, map)
 */

import * as THREE from 'three';
import { Entity } from '../ecs/Entity';
import {
  PositionComponent,
  VelocityComponent,
  HealthComponent,
  MeshComponent,
  AIComponent,
  ShooterComponent,
  ProjectileComponent,
  ColliderComponent,
  type ProjectileOwner,
} from '../components';

export class EntityFactory {
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  createPlayer(config: any): Entity {
    const player = new Entity('player');

    // Position
    const position = new PositionComponent(0, 1, -20);
    player.addComponent(position);

    // Velocity
    const velocity = new VelocityComponent(config.speed);
    player.addComponent(velocity);

    // Health
    const health = new HealthComponent(config.health);
    player.addComponent(health);

    // Shooter
    const shooter = new ShooterComponent(
      config.damage,
      config.fireRate,
      config.projectileSpeed
    );
    player.addComponent(shooter);

    // Collider - Made larger for better hit detection (was 1,2,1)
    const collider = new ColliderComponent('box', new THREE.Vector3(1.5, 2, 1.5), false);
    player.addComponent(collider);

    // Note: Camera is handled separately in the game

    return player;
  }

  createEnemy(config: any, spawnPosition: [number, number, number]): Entity {
    const enemy = new Entity(`enemy_${Date.now()}_${Math.random()}`);

    // Position
    const position = new PositionComponent(...spawnPosition);
    enemy.addComponent(position);

    // Velocity
    const velocity = new VelocityComponent(config.speed);
    enemy.addComponent(velocity);

    // Health
    const health = new HealthComponent(config.health);
    enemy.addComponent(health);

    // AI
    const ai = new AIComponent(
      config.detectionRadius,
      config.attackRange,
      config.fireRate
    );
    enemy.addComponent(ai);

    // Shooter
    const shooter = new ShooterComponent(
      config.damage,
      config.fireRate,
      config.projectileSpeed
    );
    enemy.addComponent(shooter);

    // Collider - BIGGER for easier hits
    const collider = new ColliderComponent('sphere', new THREE.Vector3(1.5, 0, 0), false);
    enemy.addComponent(collider);

    // Mesh (visual representation) - BIGGER and BRIGHTER
    const geometry = new THREE.SphereGeometry(1.5, 16, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff0000,           // Bright red
      emissive: 0xff0000,        // Bright emissive red (glows)
      emissiveIntensity: 0.5,    // Strong glow
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position.position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    this.scene.add(mesh);
    const meshComp = new MeshComponent(mesh);
    enemy.addComponent(meshComp);

    return enemy;
  }

  createProjectile(
    startPos: THREE.Vector3,
    direction: THREE.Vector3,
    speed: number,
    damage: number,
    owner: ProjectileOwner
  ): Entity {
    const projectile = new Entity(`projectile_${Date.now()}_${Math.random()}`);

    // Position
    const position = new PositionComponent(startPos.x, startPos.y, startPos.z);
    // Calculate rotation from direction
    const angle = Math.atan2(direction.x, direction.z);
    position.rotation.y = angle;
    projectile.addComponent(position);

    // Velocity
    const velocity = new VelocityComponent(speed);
    velocity.velocity.copy(direction.normalize().multiplyScalar(speed));
    projectile.addComponent(velocity);

    // Projectile
    const projectileComp = new ProjectileComponent(damage, owner, 5000);
    projectile.addComponent(projectileComp);

    // Mesh - BIGGER and BRIGHTER projectiles
    const geometry = new THREE.SphereGeometry(0.3, 8, 8);
    const material = new THREE.MeshStandardMaterial({
      color: owner === 'player' ? 0xffff00 : 0xff6600,
      emissive: owner === 'player' ? 0xffff00 : 0xff6600,
      emissiveIntensity: 1.0,  // Full glow
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position.position);

    console.log(`Projectile created: owner=${owner}, position=${startPos.x},${startPos.y},${startPos.z}, direction=${direction.x},${direction.y},${direction.z}`);

    this.scene.add(mesh);
    const meshComp = new MeshComponent(mesh);
    projectile.addComponent(meshComp);

    return projectile;
  }

  createArena(config: any): Entity[] {
    const entities: Entity[] = [];
    const halfWidth = config.width / 2;
    const halfHeight = config.height / 2;
    const wallHeight = config.wallHeight;

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(config.width, config.height);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Walls
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x666666,
      roughness: 0.7,
    });

    // Create 4 walls
    const walls = [
      { pos: [0, wallHeight / 2, halfHeight], size: [config.width, wallHeight, 0.5] }, // North
      { pos: [0, wallHeight / 2, -halfHeight], size: [config.width, wallHeight, 0.5] }, // South
      { pos: [halfWidth, wallHeight / 2, 0], size: [0.5, wallHeight, config.height] }, // East
      { pos: [-halfWidth, wallHeight / 2, 0], size: [0.5, wallHeight, config.height] }, // West
    ];

    walls.forEach((wallData, index) => {
      const wall = new Entity(`wall_${index}`);
      const position = new PositionComponent(...wallData.pos as [number, number, number]);
      wall.addComponent(position);

      const collider = new ColliderComponent(
        'box',
        new THREE.Vector3(...wallData.size as [number, number, number]),
        true
      );
      wall.addComponent(collider);

      const geometry = new THREE.BoxGeometry(...wallData.size as [number, number, number]);
      const mesh = new THREE.Mesh(geometry, wallMaterial);
      mesh.position.copy(position.position);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);

      const meshComp = new MeshComponent(mesh);
      wall.addComponent(meshComp);

      entities.push(wall);
    });

    // Obstacles
    config.obstacles.forEach((obstacle: any, index: number) => {
      const obstacleEntity = new Entity(`obstacle_${index}`);
      const position = new PositionComponent(...obstacle.position);
      obstacleEntity.addComponent(position);

      const size = new THREE.Vector3(...obstacle.size);
      const collider = new ColliderComponent('box', size, true);
      obstacleEntity.addComponent(collider);

      const geometry = new THREE.BoxGeometry(...obstacle.size);
      const obstacleMaterial = new THREE.MeshStandardMaterial({
        color: 0x884444,
        roughness: 0.6,
      });
      const mesh = new THREE.Mesh(geometry, obstacleMaterial);
      mesh.position.copy(position.position);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);

      const meshComp = new MeshComponent(mesh);
      obstacleEntity.addComponent(meshComp);

      entities.push(obstacleEntity);
    });

    return entities;
  }
}
