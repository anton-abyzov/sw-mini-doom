# API Reference

**Complete API documentation for sw-mini-doom**

This document provides detailed API reference for all components, systems, and core classes in the game.

---

## Table of Contents

1. [Core ECS Classes](#core-ecs-classes)
2. [Components](#components)
3. [Systems](#systems)
4. [Entity Factory](#entity-factory)
5. [Collision Utilities](#collision-utilities)
6. [Game Class](#game-class)

---

## Core ECS Classes

### Entity

**Location**: `src/ecs/Entity.ts`

**Description**: Container for components. Entities are just an ID + component collection.

#### Constructor

```typescript
constructor(name?: string)
```

**Parameters**:
- `name` (optional): Human-readable name for debugging

**Example**:
```typescript
const entity = new Entity('player');
```

#### Properties

```typescript
readonly id: string              // Unique identifier (UUID)
readonly name: string            // Human-readable name
isActive: boolean                // Whether entity is active
private components: Map<string, Component>
```

#### Methods

##### addComponent()
```typescript
addComponent<T extends Component>(component: T): void
```

Adds a component to this entity.

**Parameters**:
- `component`: Component instance to add

**Example**:
```typescript
entity.addComponent(new PositionComponent(0, 0, 0));
entity.addComponent(new HealthComponent(100));
```

##### getComponent()
```typescript
getComponent<T extends Component>(ComponentClass: new (...args: any[]) => T): T | undefined
```

Gets a component from this entity.

**Returns**: Component instance or `undefined` if not found

**Example**:
```typescript
const pos = entity.getComponent(PositionComponent);
if (pos) {
  console.log(pos.position);
}
```

##### hasComponent()
```typescript
hasComponent<T extends Component>(ComponentClass: new (...args: any[]) => T): boolean
```

Checks if entity has a specific component.

**Returns**: `true` if component exists

**Example**:
```typescript
if (entity.hasComponent(HealthComponent)) {
  // Entity can take damage
}
```

##### removeComponent()
```typescript
removeComponent<T extends Component>(ComponentClass: new (...args: any[]) => T): void
```

Removes a component from this entity.

**Example**:
```typescript
entity.removeComponent(HealthComponent);
```

##### destroy()
```typescript
destroy(): void
```

Marks entity as inactive and clears all components.

---

### Component

**Location**: `src/ecs/Component.ts`

**Description**: Base class for all components. Components are pure data (no logic).

#### Constructor

```typescript
constructor()
```

#### Properties

```typescript
// Subclasses define their own properties
```

**Example Component**:
```typescript
export class PositionComponent extends Component {
  public position: THREE.Vector3;
  public rotation: THREE.Euler;

  constructor(x = 0, y = 0, z = 0) {
    super();
    this.position = new THREE.Vector3(x, y, z);
    this.rotation = new THREE.Euler(0, 0, 0);
  }
}
```

---

### System

**Location**: `src/ecs/System.ts`

**Description**: Base class for all systems. Systems contain logic that operates on entities.

#### Constructor

```typescript
constructor(world: World)
```

**Parameters**:
- `world`: Reference to the ECS world

#### Properties

```typescript
protected world: World
```

#### Methods

##### update()
```typescript
abstract update(deltaTime: number): void
```

Called every frame. Subclasses must implement this.

**Parameters**:
- `deltaTime`: Time since last frame in seconds

**Example System**:
```typescript
export class MovementSystem extends System {
  update(deltaTime: number): void {
    const entities = this.getEntities().filter(e =>
      e.hasComponent(PositionComponent) &&
      e.hasComponent(VelocityComponent)
    );

    for (const entity of entities) {
      const pos = entity.getComponent(PositionComponent)!;
      const vel = entity.getComponent(VelocityComponent)!;
      pos.position.add(vel.velocity.clone().multiplyScalar(deltaTime));
    }
  }
}
```

##### getEntities()
```typescript
protected getEntities(): Entity[]
```

Gets all active entities from the world.

**Returns**: Array of active entities

---

### World

**Location**: `src/ecs/World.ts`

**Description**: Manages all entities and systems. Central orchestrator of ECS architecture.

#### Constructor

```typescript
constructor()
```

#### Methods

##### createEntity()
```typescript
createEntity(name?: string): Entity
```

Creates and registers a new entity.

**Parameters**:
- `name` (optional): Human-readable name

**Returns**: Newly created entity

**Example**:
```typescript
const player = world.createEntity('player');
player.addComponent(new PositionComponent(0, 1, 0));
```

##### addEntity()
```typescript
addEntity(entity: Entity): void
```

Adds an existing entity to the world.

**Parameters**:
- `entity`: Entity to add

##### removeEntity()
```typescript
removeEntity(entity: Entity): void
```

Removes an entity from the world and destroys it.

**Parameters**:
- `entity`: Entity to remove

##### getAllEntities()
```typescript
getAllEntities(): Entity[]
```

Gets all active entities.

**Returns**: Array of active entities

##### getEntityById()
```typescript
getEntityById(id: string): Entity | undefined
```

Finds an entity by its unique ID.

**Parameters**:
- `id`: Entity UUID

**Returns**: Entity or `undefined`

##### addSystem()
```typescript
addSystem(system: System): void
```

Registers a system to be updated each frame.

**Parameters**:
- `system`: System instance

**Example**:
```typescript
world.addSystem(new MovementSystem(world));
world.addSystem(new CollisionSystem(world));
```

##### update()
```typescript
update(deltaTime: number): void
```

Updates all systems and removes inactive entities.

**Parameters**:
- `deltaTime`: Time since last frame in seconds

**Called by**: Game loop (`Game.update()`)

##### clear()
```typescript
clear(): void
```

Removes all entities and systems. Used when restarting game.

---

## Components

See [Component Catalog](./component-catalog.md) for detailed reference of all components.

### Quick Reference

| Component | Purpose | Key Properties |
|-----------|---------|----------------|
| `PositionComponent` | 3D position and rotation | `position: Vector3`, `rotation: Euler` |
| `VelocityComponent` | Movement velocity | `velocity: Vector3`, `speed: number` |
| `HealthComponent` | Health and damage | `health: number`, `maxHealth: number` |
| `AIComponent` | AI state machine | `state: AIState`, `detectionRadius`, `attackRange` |
| `ShooterComponent` | Shooting behavior | `damage`, `cooldown`, `lastShotTime` |
| `ProjectileComponent` | Projectile lifecycle | `owner`, `lifetime`, `age` |
| `ColliderComponent` | Collision shape | `shape: 'aabb' \| 'sphere'`, `size`, `radius` |
| `MeshComponent` | Three.js mesh | `mesh: THREE.Mesh` |

---

## Systems

See [System Catalog](./system-catalog.md) for detailed reference of all systems.

### Quick Reference

| System | Purpose | Components Used |
|--------|---------|-----------------|
| `InputSystem` | Process keyboard/mouse | `VelocityComponent` |
| `AISystem` | Enemy AI behavior | `AIComponent`, `PositionComponent`, `VelocityComponent` |
| `MovementSystem` | Apply velocities | `PositionComponent`, `VelocityComponent` |
| `CollisionSystem` | Detect collisions | `PositionComponent`, `ColliderComponent` |
| `ProjectileSystem` | Projectile lifecycle | `ProjectileComponent`, `PositionComponent` |

---

## Entity Factory

**Location**: `src/entities/EntityFactory.ts`

**Description**: Factory class for creating common entity types (player, enemies, projectiles, etc.).

### Constructor

```typescript
constructor(scene: THREE.Scene)
```

**Parameters**:
- `scene`: Three.js scene to add meshes to

### Methods

#### createPlayer()

```typescript
createPlayer(config: any): Entity
```

Creates the player entity with all necessary components.

**Parameters**:
- `config`: Player configuration object from JSON

**Returns**: Player entity

**Components Added**:
- `PositionComponent`
- `VelocityComponent`
- `HealthComponent`
- `ShooterComponent`
- `ColliderComponent`

**Example**:
```typescript
const player = entityFactory.createPlayer({
  position: [0, 1, 0],
  health: 100,
  speed: 5,
  shootingCooldown: 0.5
});
```

#### createEnemy()

```typescript
createEnemy(config: any, spawnPosition: number[]): Entity
```

Creates an enemy entity.

**Parameters**:
- `config`: Enemy configuration object
- `spawnPosition`: `[x, y, z]` spawn coordinates

**Returns**: Enemy entity

**Components Added**:
- `PositionComponent`
- `VelocityComponent`
- `HealthComponent`
- `AIComponent`
- `ShooterComponent`
- `ColliderComponent`
- `MeshComponent` (red cube)

**Example**:
```typescript
const enemy = entityFactory.createEnemy(config, [10, 0, 10]);
```

#### createProjectile()

```typescript
createProjectile(
  position: THREE.Vector3,
  direction: THREE.Vector3,
  speed: number,
  damage: number,
  owner: 'player' | 'enemy'
): Entity
```

Creates a projectile entity.

**Parameters**:
- `position`: Starting position
- `direction`: Normalized direction vector
- `speed`: Speed in units/second
- `damage`: Damage dealt on hit
- `owner`: Who fired this projectile

**Returns**: Projectile entity

**Components Added**:
- `PositionComponent`
- `VelocityComponent`
- `ProjectileComponent`
- `ColliderComponent` (sphere)
- `MeshComponent` (small sphere, blue for player, red for enemy)

**Example**:
```typescript
const projectile = entityFactory.createProjectile(
  new THREE.Vector3(0, 1.6, 0),
  new THREE.Vector3(0, 0, -1).normalize(),
  20,
  10,
  'player'
);
```

#### createArena()

```typescript
createArena(mapConfig: any): Entity[]
```

Creates arena geometry (floor, walls, obstacles).

**Parameters**:
- `mapConfig`: Map configuration from JSON

**Returns**: Array of static entities (walls, floor, obstacles)

**Components Added** (per entity):
- `PositionComponent`
- `ColliderComponent` (AABB)
- `MeshComponent`

---

## Collision Utilities

**Location**: `src/collision/CollisionUtils.ts`

### Functions

#### checkAABB()

```typescript
export function checkAABB(
  posA: THREE.Vector3,
  sizeA: THREE.Vector3,
  posB: THREE.Vector3,
  sizeB: THREE.Vector3
): boolean
```

Checks Axis-Aligned Bounding Box collision.

**Parameters**:
- `posA`: Center position of box A
- `sizeA`: Half-extents of box A (width/2, height/2, depth/2)
- `posB`: Center position of box B
- `sizeB`: Half-extents of box B

**Returns**: `true` if boxes overlap

**Example**:
```typescript
const isColliding = checkAABB(
  playerPos,
  new THREE.Vector3(0.5, 1, 0.5),
  wallPos,
  new THREE.Vector3(5, 2, 0.5)
);
```

#### checkRaySphere()

```typescript
export function checkRaySphere(
  rayOrigin: THREE.Vector3,
  rayDirection: THREE.Vector3,
  sphereCenter: THREE.Vector3,
  sphereRadius: number
): boolean
```

Checks ray-sphere intersection.

**Parameters**:
- `rayOrigin`: Starting point of ray
- `rayDirection`: Normalized direction of ray
- `sphereCenter`: Center of sphere
- `sphereRadius`: Radius of sphere

**Returns**: `true` if ray intersects sphere

**Example**:
```typescript
const hit = checkRaySphere(
  projectilePos,
  projectileDir,
  enemyPos,
  enemyRadius
);
```

---

## Game Class

**Location**: `src/Game.ts`

**Description**: Main game orchestrator. Manages game loop, state, UI, and high-level logic.

### Constructor

```typescript
constructor(canvas: HTMLCanvasElement)
```

**Parameters**:
- `canvas`: Canvas element to render to

### Properties

```typescript
// Three.js
private renderer: THREE.WebGLRenderer
private scene: THREE.Scene
private camera: THREE.PerspectiveCamera

// ECS
private world: World
private inputSystem: InputSystem
private movementSystem: MovementSystem
// ... other systems

// Game state
private state: GameState  // 'menu' | 'playing' | 'victory' | 'gameover'
private playerEntity: Entity
private kills: number
private startTime: number
private elapsedTime: number
```

### Methods

#### init()

```typescript
async init(): Promise<void>
```

Initializes the game (loads config, sets up scene, registers systems).

**Must be called** before `start()`.

**Example**:
```typescript
const game = new Game(canvas);
await game.init();
game.start();
```

#### start()

```typescript
start(): void
```

Starts the game loop.

**Called after** `init()`.

#### startGame()

```typescript
startGame(): void
```

Starts a new game session (creates entities, resets state).

**Called when**: User clicks "Start" or "Restart" button.

#### update()

```typescript
private update(): void
```

Main game loop (called by `requestAnimationFrame`).

**Flow**:
1. Calculate delta time
2. Process player input
3. Update AI systems
4. Update all ECS systems
5. Check win/lose conditions
6. Update HUD
7. Render scene
8. Schedule next frame

---

## Type Definitions

### GameState

```typescript
export type GameState = 'menu' | 'playing' | 'victory' | 'gameover';
```

### AIState

```typescript
export type AIState = 'idle' | 'chase' | 'attack' | 'dead';
```

### ColliderShape

```typescript
export type ColliderShape = 'aabb' | 'sphere';
```

### ProjectileOwner

```typescript
export type ProjectileOwner = 'player' | 'enemy';
```

---

## Configuration Schema

### Game Config (`public/data/game-config.json`)

```typescript
interface GameConfig {
  player: {
    position: [number, number, number];
    health: number;
    speed: number;
    shootingCooldown: number;
    projectileSpeed: number;
    damage: number;
  };
  enemy: {
    count: number;
    health: number;
    speed: number;
    detectionRadius: number;
    attackRange: number;
    fireRate: number;
    projectileSpeed: number;
    damage: number;
  };
  map: {
    size: [number, number];
    enemySpawns: Array<[number, number, number]>;
    obstacles: Array<{
      position: [number, number, number];
      size: [number, number, number];
    }>;
  };
}
```

---

## Usage Examples

### Creating a New Entity Type

```typescript
// In EntityFactory.ts
createPowerUp(position: THREE.Vector3): Entity {
  const entity = new Entity('powerup');

  // Add components
  entity.addComponent(new PositionComponent(position.x, position.y, position.z));
  entity.addComponent(new ColliderComponent('sphere', 0.5));

  // Create mesh
  const geometry = new THREE.SphereGeometry(0.5);
  const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(position);
  this.scene.add(mesh);
  entity.addComponent(new MeshComponent(mesh));

  return entity;
}
```

### Creating a New System

```typescript
// In src/systems/PowerUpSystem.ts
export class PowerUpSystem extends System {
  update(deltaTime: number): void {
    const powerUps = this.getEntities().filter(e =>
      e.hasComponent(PowerUpComponent) &&
      e.hasComponent(PositionComponent)
    );

    const players = this.getEntities().filter(e =>
      e.hasComponent(PlayerComponent) &&
      e.hasComponent(PositionComponent)
    );

    // Check collisions between player and power-ups
    for (const powerUp of powerUps) {
      const powerUpPos = powerUp.getComponent(PositionComponent)!;

      for (const player of players) {
        const playerPos = player.getComponent(PositionComponent)!;
        const distance = powerUpPos.position.distanceTo(playerPos.position);

        if (distance < 1.0) {
          // Apply power-up effect
          this.world.removeEntity(powerUp);
        }
      }
    }
  }
}
```

---

## Performance Considerations

### Entity Queries
Queries filter all entities every frame. For hot paths, consider caching:

```typescript
// ❌ Slow (filters every frame)
update(deltaTime: number) {
  const enemies = this.getEntities().filter(e => e.hasComponent(AIComponent));
  // ...
}

// ✅ Better (cache if entity set is stable)
private enemies: Entity[] = [];

init() {
  this.enemies = this.getEntities().filter(e => e.hasComponent(AIComponent));
}

update(deltaTime: number) {
  // Use cached array
  // Re-query only when entities are added/removed
}
```

### Component Access
Repeated `getComponent()` calls can add up:

```typescript
// ❌ Slow (3 lookups per entity)
for (const entity of entities) {
  entity.getComponent(PositionComponent)!.position.x += 1;
  entity.getComponent(PositionComponent)!.position.y += 1;
  entity.getComponent(PositionComponent)!.position.z += 1;
}

// ✅ Better (1 lookup per entity)
for (const entity of entities) {
  const pos = entity.getComponent(PositionComponent)!;
  pos.position.x += 1;
  pos.position.y += 1;
  pos.position.z += 1;
}
```

---

## Error Handling

### Missing Components

Always check if component exists before use:

```typescript
const health = entity.getComponent(HealthComponent);
if (health) {
  health.health -= 10;
} else {
  console.warn('Entity has no HealthComponent:', entity.name);
}
```

Or use non-null assertion if you're certain:

```typescript
// Only if you KNOW the component exists
const health = entity.getComponent(HealthComponent)!;
health.health -= 10;
```

### Null Checks

```typescript
// World may return undefined
const entity = world.getEntityById(id);
if (!entity) {
  console.error('Entity not found:', id);
  return;
}
```

---

## Related Documentation

- [Component Catalog](./component-catalog.md) - Detailed component reference
- [System Catalog](./system-catalog.md) - Detailed system reference
- [System Design](../architecture/system-design.md) - Architecture overview
- [Developer Onboarding](./developer-onboarding.md) - Getting started guide

---

**Last Updated**: 2025-11-09
**Maintained By**: Development Team
