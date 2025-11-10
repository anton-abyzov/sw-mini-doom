# Component Catalog

**Complete reference for all ECS Components**

This document provides detailed reference for every component in the game.

---

## Table of Contents

1. [PositionComponent](#positioncomponent)
2. [VelocityComponent](#velocitycomponent)
3. [HealthComponent](#healthcomponent)
4. [MeshComponent](#meshcomponent)
5. [AIComponent](#aicomponent)
6. [ShooterComponent](#shootercomponent)
7. [ProjectileComponent](#projectilecomponent)
8. [ColliderComponent](#collidercomponent)

---

## PositionComponent

**Location**: `src/components/PositionComponent.ts`

**Purpose**: Stores an entity's 3D position and rotation in world space.

### Properties

```typescript
public position: THREE.Vector3
public rotation: THREE.Euler
```

### Constructor

```typescript
constructor(x: number = 0, y: number = 0, z: number = 0)
```

**Parameters**:
- `x`: X coordinate (default: 0)
- `y`: Y coordinate (default: 0)
- `z`: Z coordinate (default: 0)

### Usage

```typescript
// Create component
const pos = new PositionComponent(5, 1, 10);

// Add to entity
entity.addComponent(pos);

// Access position
pos.position.x += 1;
pos.rotation.y = Math.PI / 2; // Rotate 90 degrees
```

### Used By Systems

- `MovementSystem` - Applies velocity to position
- `CollisionSystem` - Uses position for collision detection
- `AISystem` - Reads position to calculate distances
- `RenderSystem` - Syncs Three.js mesh with position

### Example Entities

- Player
- Enemies
- Projectiles
- Static objects (walls, obstacles)

---

## VelocityComponent

**Location**: `src/components/VelocityComponent.ts`

**Purpose**: Stores an entity's velocity vector and maximum speed.

### Properties

```typescript
public velocity: THREE.Vector3
public speed: number
```

### Constructor

```typescript
constructor(speed: number = 1.0)
```

**Parameters**:
- `speed`: Maximum speed multiplier (default: 1.0)

### Usage

```typescript
// Create component
const vel = new VelocityComponent(5.0); // 5 units/second

// Add to entity
entity.addComponent(vel);

// Set velocity
vel.velocity.set(1, 0, 0); // Move in +X direction
```

### Notes

- Velocity is in **units per second**
- `speed` is a multiplier (not magnitude)
- Actual movement speed = `velocity.length() * speed`
- Systems should multiply by `deltaTime`

### Used By Systems

- `InputSystem` - Sets player velocity based on keyboard input
- `AISystem` - Sets enemy velocity based on AI state
- `MovementSystem` - Applies velocity to position

### Example Entities

- Player (speed: 5.0)
- Enemies (speed: 2.0)
- Projectiles (speed: 20.0)

---

## HealthComponent

**Location**: `src/components/HealthComponent.ts`

**Purpose**: Stores health points and damage state for entities that can take damage.

### Properties

```typescript
public health: number
public maxHealth: number
```

### Constructor

```typescript
constructor(maxHealth: number)
```

**Parameters**:
- `maxHealth`: Starting and maximum health

### Methods

#### isDead()
```typescript
isDead(): boolean
```

**Returns**: `true` if health ≤ 0

#### takeDamage()
```typescript
takeDamage(amount: number): void
```

Reduces health by the specified amount.

**Parameters**:
- `amount`: Damage to apply

#### heal()
```typescript
heal(amount: number): void
```

Increases health (capped at `maxHealth`).

**Parameters**:
- `amount`: Healing amount

#### getHealthPercent()
```typescript
getHealthPercent(): number
```

**Returns**: Health as percentage (0-100)

### Usage

```typescript
// Create component
const health = new HealthComponent(100);

// Add to entity
entity.addComponent(health);

// Take damage
health.takeDamage(25);

// Check death
if (health.isDead()) {
  console.log('Entity died!');
}

// Heal
health.heal(10);

// Get percentage (for UI)
const percent = health.getHealthPercent(); // 85%
```

### Used By Systems

- `ProjectileSystem` - Applies damage on hit
- `AISystem` - Checks enemy death
- `Game.checkGameConditions()` - Checks player death

### Example Entities

- Player (100 HP)
- Enemies (50 HP)

---

## MeshComponent

**Location**: `src/components/MeshComponent.ts`

**Purpose**: Stores reference to a Three.js mesh for rendering.

### Properties

```typescript
public mesh: THREE.Mesh
```

### Constructor

```typescript
constructor(mesh: THREE.Mesh)
```

**Parameters**:
- `mesh`: Three.js mesh object

### Usage

```typescript
// Create mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);

// Add to scene
scene.add(mesh);

// Create component
const meshComp = new MeshComponent(mesh);

// Add to entity
entity.addComponent(meshComp);

// Access mesh
meshComp.mesh.material.color.setHex(0x00ff00); // Change color
```

### Notes

- The mesh is **not** automatically removed from scene when entity is destroyed
- Systems must manually call `scene.remove(mesh)` when needed

### Used By Systems

- `RenderSystem` - Syncs mesh transform with entity position
- `AISystem` - Changes mesh color on death

### Example Entities

- Player (invisible camera, no mesh)
- Enemies (red cubes)
- Projectiles (small spheres)
- Arena objects (floor, walls)

---

## AIComponent

**Location**: `src/components/AIComponent.ts`

**Purpose**: Stores AI state machine and behavior parameters for enemy entities.

### Type Definitions

```typescript
export type AIState = 'idle' | 'chase' | 'attack' | 'dead';
```

### Properties

```typescript
public state: AIState
public detectionRadius: number
public attackRange: number
public target: THREE.Vector3 | null
public lastShotTime: number
public fireRate: number  // shots per second
```

### Constructor

```typescript
constructor(
  detectionRadius: number = 20,
  attackRange: number = 8,
  fireRate: number = 1.0
)
```

**Parameters**:
- `detectionRadius`: Range to detect player (default: 20)
- `attackRange`: Range to start attacking (default: 8)
- `fireRate`: Shots per second (default: 1.0)

### Methods

#### canShoot()
```typescript
canShoot(currentTime: number): boolean
```

Checks if enough time has passed since last shot.

**Parameters**:
- `currentTime`: Current timestamp in milliseconds

**Returns**: `true` if cooldown is ready

### State Machine

```
     Player detected (distance < detectionRadius)
┌────────┐                                      ┌───────┐
│  IDLE  │─────────────────────────────────────▶│ CHASE │
└────────┘                                      └───────┘
                                                    │
                Player too far                      │ In range (distance < attackRange)
                (distance > detectionRadius * 1.5)  │
                                                    ▼
┌──────┐                                        ┌────────┐
│ DEAD │                                        │ ATTACK │
└──────┘                                        └────────┘
   ▲                                                │
   │                                                │
   └────────────────────────────────────────────────┘
              Health ≤ 0
```

### Usage

```typescript
// Create component
const ai = new AIComponent(20, 8, 1.5); // 20 detection, 8 attack range, 1.5 shots/sec

// Add to entity
entity.addComponent(ai);

// Check state
if (ai.state === 'attack' && ai.canShoot(Date.now())) {
  // Shoot at player
  ai.lastShotTime = Date.now();
}
```

### Used By Systems

- `AISystem` - Updates state machine and behavior
- `Game.handleEnemyShooting()` - Triggers shooting in attack state

### Example Entities

- Enemies only

---

## ShooterComponent

**Location**: `src/components/ShooterComponent.ts`

**Purpose**: Stores shooting parameters for entities that can fire projectiles.

### Properties

```typescript
public damage: number
public cooldown: number       // seconds between shots
public lastShotTime: number   // timestamp in milliseconds
public projectileSpeed: number
```

### Constructor

```typescript
constructor(
  damage: number,
  cooldown: number,
  projectileSpeed: number
)
```

**Parameters**:
- `damage`: Damage dealt per projectile
- `cooldown`: Time between shots in seconds
- `projectileSpeed`: Projectile velocity in units/second

### Methods

#### canShoot()
```typescript
canShoot(currentTime: number): boolean
```

Checks if cooldown has elapsed.

**Parameters**:
- `currentTime`: Current timestamp in milliseconds

**Returns**: `true` if ready to shoot

### Usage

```typescript
// Create component
const shooter = new ShooterComponent(10, 0.5, 20);
// 10 damage, 0.5s cooldown, 20 units/sec speed

// Add to entity
entity.addComponent(shooter);

// Check if can shoot
if (shooter.canShoot(Date.now())) {
  // Create projectile
  shooter.lastShotTime = Date.now();
}
```

### Used By Systems

- `Game.handlePlayerInput()` - Checks player shooting
- `Game.handleEnemyShooting()` - Checks enemy shooting

### Example Entities

- Player (damage: 10, cooldown: 0.5s, speed: 20)
- Enemies (damage: 5, cooldown: 1.0s, speed: 15)

---

## ProjectileComponent

**Location**: `src/components/ProjectileComponent.ts`

**Purpose**: Marks entity as a projectile with lifecycle tracking.

### Type Definitions

```typescript
export type ProjectileOwner = 'player' | 'enemy';
```

### Properties

```typescript
public owner: ProjectileOwner
public lifetime: number  // max lifetime in seconds
public age: number       // current age in seconds
```

### Constructor

```typescript
constructor(
  owner: ProjectileOwner,
  lifetime: number = 3.0
)
```

**Parameters**:
- `owner`: Who fired this projectile ('player' or 'enemy')
- `lifetime`: Maximum lifetime in seconds (default: 3.0)

### Notes

- Projectiles are automatically destroyed when `age >= lifetime`
- Projectiles are destroyed on hit
- Owner determines collision logic (player projectiles hit enemies, enemy projectiles hit player)

### Usage

```typescript
// Create component
const projectile = new ProjectileComponent('player', 3.0);

// Add to entity
entity.addComponent(projectile);

// Update age (in system)
projectile.age += deltaTime;

// Check expiration
if (projectile.age >= projectile.lifetime) {
  world.removeEntity(entity);
}
```

### Used By Systems

- `ProjectileSystem` - Updates age, checks expiration, handles hits
- `CollisionSystem` - Filters projectiles for ray-sphere checks

### Example Entities

- Player projectiles (blue spheres, owner: 'player')
- Enemy projectiles (red spheres, owner: 'enemy')

---

## ColliderComponent

**Location**: `src/components/ColliderComponent.ts`

**Purpose**: Defines collision shape for physics detection.

### Type Definitions

```typescript
export type ColliderShape = 'aabb' | 'sphere';
```

### Properties

```typescript
public shape: ColliderShape
public size?: THREE.Vector3   // Half-extents for AABB
public radius?: number        // Radius for sphere
```

### Constructor

```typescript
constructor(
  shape: ColliderShape,
  sizeOrRadius: number | THREE.Vector3
)
```

**Parameters**:
- `shape`: 'aabb' or 'sphere'
- `sizeOrRadius`:
  - For AABB: `THREE.Vector3` half-extents
  - For sphere: `number` radius

### Usage

#### AABB Collider
```typescript
// Create AABB (box) collider
const collider = new ColliderComponent(
  'aabb',
  new THREE.Vector3(0.5, 1.0, 0.5) // half-extents (1x2x1 box)
);

entity.addComponent(collider);
```

#### Sphere Collider
```typescript
// Create sphere collider
const collider = new ColliderComponent('sphere', 0.5); // radius 0.5

entity.addComponent(collider);
```

### Collision Detection

**AABB vs AABB**: Used for player/enemy vs walls
```typescript
checkAABB(posA, sizeA, posB, sizeB)
```

**Ray vs Sphere**: Used for projectiles vs entities
```typescript
checkRaySphere(rayOrigin, rayDir, sphereCenter, sphereRadius)
```

### Used By Systems

- `CollisionSystem` - Detects and resolves collisions
- `ProjectileSystem` - Checks projectile hits

### Example Entities

- Player: AABB (0.5, 1.0, 0.5) - cylinder approximation
- Enemies: AABB (0.5, 1.0, 0.5)
- Projectiles: Sphere (0.1)
- Walls: AABB (variable sizes)

---

## Component Relationships

### Common Component Combinations

#### Player Entity
```typescript
- PositionComponent
- VelocityComponent
- HealthComponent
- ShooterComponent
- ColliderComponent (AABB)
```

#### Enemy Entity
```typescript
- PositionComponent
- VelocityComponent
- HealthComponent
- AIComponent
- ShooterComponent
- ColliderComponent (AABB)
- MeshComponent
```

#### Projectile Entity
```typescript
- PositionComponent
- VelocityComponent
- ProjectileComponent
- ColliderComponent (Sphere)
- MeshComponent
```

#### Static Object (Wall)
```typescript
- PositionComponent
- ColliderComponent (AABB)
- MeshComponent
```

---

## Best Practices

### 1. Component Independence

Components should be **pure data** with minimal logic:

```typescript
// ❌ Bad: Logic in component
class HealthComponent extends Component {
  takeDamage(amount: number) {
    this.health -= amount;
    if (this.health <= 0) {
      // Don't put game logic here!
      this.triggerDeathAnimation();
      this.removeFromWorld();
    }
  }
}

// ✅ Good: Pure data
class HealthComponent extends Component {
  takeDamage(amount: number) {
    this.health -= amount;
  }

  isDead(): boolean {
    return this.health <= 0;
  }
}

// Logic goes in systems:
class HealthSystem extends System {
  update() {
    const entities = this.getEntitiesWithHealth();
    for (const entity of entities) {
      const health = entity.getComponent(HealthComponent)!;
      if (health.isDead()) {
        // Handle death here
        this.world.removeEntity(entity);
      }
    }
  }
}
```

### 2. Avoid Component Cross-References

```typescript
// ❌ Bad: Component references another component
class AIComponent extends Component {
  private healthComponent: HealthComponent;

  checkDeath() {
    return this.healthComponent.isDead();
  }
}

// ✅ Good: Systems coordinate components
class AISystem extends System {
  update() {
    for (const entity of enemies) {
      const ai = entity.getComponent(AIComponent)!;
      const health = entity.getComponent(HealthComponent)!;

      if (health.isDead()) {
        ai.state = 'dead';
      }
    }
  }
}
```

### 3. Component Granularity

Keep components **focused and reusable**:

```typescript
// ❌ Bad: Too many responsibilities
class PlayerComponent extends Component {
  position: Vector3;
  velocity: Vector3;
  health: number;
  ammo: number;
  score: number;
  inventory: Item[];
  // Too much!
}

// ✅ Good: Single responsibility
class PositionComponent extends Component {
  position: Vector3;
  rotation: Euler;
}

class VelocityComponent extends Component {
  velocity: Vector3;
  speed: number;
}

class HealthComponent extends Component {
  health: number;
  maxHealth: number;
}

// Now entities can mix and match!
```

---

## Related Documentation

- [API Reference](./api-reference.md) - Complete API docs
- [System Catalog](./system-catalog.md) - All game systems
- [System Design](../architecture/system-design.md) - Architecture overview
- [ADR-0003: Entity Component System](../architecture/adr/0003-entity-component-system.md) - Why ECS?

---

**Last Updated**: 2025-11-09
**Maintained By**: Development Team
