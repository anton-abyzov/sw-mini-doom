# System Catalog

**Complete reference for all ECS Systems**

This document provides detailed reference for every system in the game.

---

## Table of Contents

1. [System Execution Order](#system-execution-order)
2. [InputSystem](#inputsystem)
3. [AISystem](#aisystem)
4. [MovementSystem](#movementsystem)
5. [CollisionSystem](#collisionsystem)
6. [ProjectileSystem](#projectilesystem)
7. [Creating New Systems](#creating-new-systems)

---

## System Execution Order

Systems execute in this **fixed order** every frame:

```
1. InputSystem       → Process keyboard/mouse input
2. AISystem          → Update enemy AI state machines
3. MovementSystem    → Apply velocities to positions
4. CollisionSystem   → Detect and resolve collisions
5. ProjectileSystem  → Update projectile lifecycle and hits
```

**Why this order?**
- Input first → Immediate response to player
- AI before movement → Calculate desired velocity
- Collision after movement → Resolve penetrations
- Projectiles last → Check hits after collision resolution

**Registered in**: `Game.init()` → `world.addSystem()`

---

## InputSystem

**Location**: `src/systems/InputSystem.ts`

**Purpose**: Processes keyboard and mouse input, converts to player movement.

### Components Used

- **Reads**: None (processes raw input events)
- **Writes**: Player velocity (via Game.handlePlayerInput())

### Key Methods

#### constructor()
```typescript
constructor(world: World)
```

Sets up keyboard and mouse event listeners.

#### requestPointerLock()
```typescript
requestPointerLock(element: HTMLElement): void
```

Requests pointer lock on the given element (canvas).

**Parameters**:
- `element`: Canvas element to lock pointer to

#### exitPointerLock()
```typescript
exitPointerLock(): void
```

Releases pointer lock (called on game over/victory).

#### getMovementInput()
```typescript
getMovementInput(): { forward: number; right: number }
```

Returns normalized movement input.

**Returns**:
```typescript
{
  forward: -1 | 0 | 1,  // W/S or Arrow Up/Down
  right: -1 | 0 | 1     // A/D or Arrow Left/Right
}
```

#### getMouseMovement()
```typescript
getMouseMovement(): { x: number; y: number }
```

Returns mouse delta since last frame.

**Returns**:
```typescript
{
  x: number,  // Horizontal mouse movement
  y: number   // Vertical mouse movement
}
```

**Note**: Mouse movement is reset to `(0, 0)` after reading.

#### isKeyPressed()
```typescript
isKeyPressed(key: string): boolean
```

Checks if a key is currently pressed.

**Parameters**:
- `key`: Key code (e.g., 'KeyW', 'Space', 'ShiftLeft')

**Returns**: `true` if key is pressed

#### isMouseButtonPressed()
```typescript
isMouseButtonPressed(button: number): boolean
```

Checks if a mouse button is currently pressed.

**Parameters**:
- `button`: Button number (0 = left, 1 = middle, 2 = right)

**Returns**: `true` if button is pressed

### Keyboard Bindings

| Action | Keys |
|--------|------|
| Move Forward | W, Arrow Up |
| Move Backward | S, Arrow Down |
| Strafe Left | A, Arrow Left |
| Strafe Right | D, Arrow Right |
| Shoot | Left Mouse Button, Space |

### Mouse Controls

- **Mouse Movement**: Look around (first-person camera)
- **Left Click**: Shoot (when pointer is locked)

### Usage Example

```typescript
// In Game.handlePlayerInput()
const input = this.inputSystem.getMovementInput();
const mouseMovement = this.inputSystem.getMouseMovement();

// Calculate forward/right vectors based on camera rotation
const forward = new THREE.Vector3(0, 0, -1)
  .applyAxisAngle(new THREE.Vector3(0, 1, 0), this.camera.rotation.y);
const right = new THREE.Vector3(1, 0, 0)
  .applyAxisAngle(new THREE.Vector3(0, 1, 0), this.camera.rotation.y);

// Set player velocity
playerVelocity.velocity.set(0, 0, 0);
playerVelocity.velocity.addScaledVector(forward, input.forward * playerVelocity.speed);
playerVelocity.velocity.addScaledVector(right, input.right * playerVelocity.speed);

// Apply mouse look
this.camera.rotation.y -= mouseMovement.x * sensitivity;
this.camera.rotation.x -= mouseMovement.y * sensitivity;
```

### Performance

- **<0.1ms per frame** (event-driven, minimal computation)

---

## AISystem

**Location**: `src/systems/AISystem.ts`

**Purpose**: Controls enemy AI behavior using finite state machine.

### Components Used

- **Reads**:
  - `AIComponent` - Current state and parameters
  - `PositionComponent` - Enemy position
  - `HealthComponent` - Check if dead
- **Writes**:
  - `AIComponent.state` - Update state
  - `VelocityComponent` - Set movement velocity
  - `PositionComponent.rotation` - Face player

### Key Methods

#### setPlayerPosition()
```typescript
setPlayerPosition(position: THREE.Vector3): void
```

Sets the player's position for AI calculations.

**Parameters**:
- `position`: Player position vector

**Called by**: `Game.update()` every frame

#### update()
```typescript
update(deltaTime: number): void
```

Updates all enemy AI state machines.

**Parameters**:
- `deltaTime`: Time since last frame (currently unused, but available)

### State Machine

Each enemy has a finite state machine with 4 states:

#### 1. IDLE
**Behavior**:
- Velocity set to zero (no movement)
- Slow rotation animation (optional)

**Transitions**:
- → **CHASE** when player detected (distance < detectionRadius)

#### 2. CHASE
**Behavior**:
- Move toward player
- Face player (rotate to look at target)
- Avoid obstacles (future feature)

**Transitions**:
- → **ATTACK** when in range (distance < attackRange)
- → **IDLE** when player too far (distance > detectionRadius * 1.5)

#### 3. ATTACK
**Behavior**:
- Stop moving (velocity = 0)
- Face player
- Shoot if cooldown ready (handled by Game.handleEnemyShooting())

**Transitions**:
- → **CHASE** when player moves away (distance > attackRange * 1.2)

#### 4. DEAD
**Behavior**:
- Stop all movement
- Change mesh color to gray
- Remove entity after 500ms delay

**Transitions**:
- None (terminal state)

### State Transition Diagram

```
     Player detected
┌────────┐ (distance < 20) ┌───────┐
│  IDLE  │─────────────────▶│ CHASE │
└────────┘                  └───────┘
    ▲                           │
    │ Player too far            │ In range
    │ (distance > 30)           │ (distance < 8)
    │                           ▼
┌──────┐                    ┌────────┐
│ DEAD │◀───────────────────│ ATTACK │
└──────┘     Health ≤ 0     └────────┘
                                │
                                │ Player moves away
                                │ (distance > 9.6)
                                ▼
                            (back to CHASE)
```

### Usage Example

```typescript
// System is registered and updated automatically
this.aiSystem = new AISystem(this.world);
this.world.addSystem(this.aiSystem);

// Set player position every frame
const playerPos = this.playerEntity.getComponent(PositionComponent);
this.aiSystem.setPlayerPosition(playerPos.position);

// System handles the rest automatically
```

### Configuration

Enemy AI parameters (from `game-config.json`):

```json
{
  "enemy": {
    "detectionRadius": 20,    // When to start chasing
    "attackRange": 8,          // When to start attacking
    "speed": 2.0,              // Movement speed
    "fireRate": 1.0            // Shots per second (in attack state)
  }
}
```

### Performance

- **<0.5ms per frame** (5 enemies * ~0.1ms each)
- State checks are simple distance comparisons
- No expensive pathfinding (direct chase)

### Future Enhancements

- ⏸️ Obstacle avoidance with raycasts
- ⏸️ Advanced pathfinding (A*, navmesh)
- ⏸️ Group tactics (flanking, cover)
- ⏸️ Different enemy types with unique behaviors

---

## MovementSystem

**Location**: `src/systems/MovementSystem.ts`

**Purpose**: Applies velocity to position (basic physics).

### Components Used

- **Reads**:
  - `VelocityComponent` - Velocity vector
- **Writes**:
  - `PositionComponent` - Update position

### Algorithm

```typescript
position += velocity * deltaTime
```

**Why deltaTime?** Makes movement framerate-independent.

### update()

```typescript
update(deltaTime: number): void
```

**Parameters**:
- `deltaTime`: Time since last frame in seconds

### Implementation

```typescript
update(deltaTime: number): void {
  const entities = this.getEntities().filter(e =>
    e.hasComponent(PositionComponent) &&
    e.hasComponent(VelocityComponent)
  );

  for (const entity of entities) {
    const pos = entity.getComponent(PositionComponent)!;
    const vel = entity.getComponent(VelocityComponent)!;

    // Apply velocity
    pos.position.add(vel.velocity.clone().multiplyScalar(deltaTime));
  }
}
```

### Affected Entities

- Player (when moving with WASD)
- Enemies (when chasing or attacking)
- Projectiles (constant velocity)

### Performance

- **<0.1ms per frame** (simple vector math for ~20 entities)

### Notes

- Movement is continuous (no grid-based)
- No gravity (flat arena, no jumping)
- Collisions resolved by `CollisionSystem` (runs after movement)

---

## CollisionSystem

**Location**: `src/systems/CollisionSystem.ts`

**Purpose**: Detects and resolves collisions between entities.

### Components Used

- **Reads**:
  - `PositionComponent` - Entity position
  - `ColliderComponent` - Collision shape
- **Writes**:
  - `PositionComponent` - Adjust position to resolve collision
  - `VelocityComponent` - Stop movement in collision direction

### Collision Types

#### 1. AABB vs AABB (Box vs Box)
**Used For**:
- Player vs Walls
- Player vs Obstacles
- Enemies vs Walls

**Algorithm**: Axis-Aligned Bounding Box overlap test

```typescript
checkAABB(posA, sizeA, posB, sizeB)
```

**See**: `src/collision/CollisionUtils.ts`

#### 2. Ray vs Sphere
**Used For**:
- Projectiles vs Entities

**Algorithm**: Ray-sphere intersection test

```typescript
checkRaySphere(rayOrigin, rayDir, sphereCenter, sphereRadius)
```

**See**: `src/collision/CollisionUtils.ts`

### update()

```typescript
update(deltaTime: number): void
```

**Steps**:
1. Get all entities with colliders
2. For each dynamic entity (player, enemies):
   - Check against all static entities (walls, obstacles)
   - If collision detected:
     - Calculate penetration depth
     - Push entity out of obstacle
     - Zero velocity in collision direction
3. Handle projectile collisions separately (ray-sphere)

### Collision Resolution

**Simple push-out approach**:

```typescript
// If collision detected
const overlap = calculateOverlap(entityA, entityB);

// Push entity A out
entityA.position.add(overlap);

// Stop velocity in collision direction
entityA.velocity.setComponent(axis, 0);
```

### Performance

- **<0.5ms per frame**
- Typical checks:
  - 6 dynamic entities (1 player + 5 enemies)
  - 10 static obstacles
  - = 60 AABB checks
  - + 60 ray-sphere checks (10 projectiles * 6 targets)
- **Total: ~120 checks per frame**

### Optimization Opportunities

Current system is brute-force (check all pairs). For larger games, consider:

- **Spatial partitioning** (grid, quadtree) - only check nearby entities
- **Broad phase / narrow phase** - quick rejection before expensive tests
- **Collision layers** - skip checks between certain entity types

### Notes

- Collision detection is **discrete** (per-frame checks)
- Fast-moving projectiles may tunnel through thin walls
- Mitigation: High projectile speed (20 units/sec) + small timestep (60 FPS)

---

## ProjectileSystem

**Location**: `src/systems/ProjectileSystem.ts`

**Purpose**: Manages projectile lifecycle (aging, hits, destruction).

### Components Used

- **Reads**:
  - `ProjectileComponent` - Age, lifetime, owner
  - `PositionComponent` - Position for hit detection
  - `VelocityComponent` - Direction for ray-sphere tests
  - `ColliderComponent` - Collision shape
- **Writes**:
  - `ProjectileComponent.age` - Increment age
  - `HealthComponent` (of hit targets) - Apply damage
  - Removes projectile entities on hit/expiration

### Key Responsibilities

1. **Age Tracking**: Increment projectile age each frame
2. **Expiration**: Destroy projectiles that exceed lifetime
3. **Hit Detection**: Check collisions with targets
4. **Damage Application**: Apply damage to hit entities
5. **Cleanup**: Remove hit/expired projectiles from world

### update()

```typescript
update(deltaTime: number): void
```

**Flow**:
```
For each projectile:
  1. Increment age
  2. If age >= lifetime:
     → Remove projectile
     → Continue to next
  3. Check hits:
     - Player projectiles → hit enemies
     - Enemy projectiles → hit player
  4. If hit:
     → Apply damage to target
     → Remove projectile
     → Visual feedback (future: particle effect)
```

### Hit Detection Logic

```typescript
// Get potential targets based on owner
const targets = (projectile.owner === 'player')
  ? getEntitiesWithComponent(AIComponent)      // Enemies
  : getEntitiesWithComponent(PlayerComponent); // Player

for (const target of targets) {
  const hit = checkRaySphere(
    projectile.position,
    projectile.velocity.normalize(),
    target.position,
    target.collider.radius
  );

  if (hit) {
    target.getComponent(HealthComponent).takeDamage(projectile.damage);
    world.removeEntity(projectile);
    break;
  }
}
```

### Object Pooling (Future)

Currently projectiles are created/destroyed. For better performance:

```typescript
// ⏸️ Future enhancement
class ProjectilePool {
  private pool: Entity[] = [];

  spawn(): Entity {
    return this.pool.pop() || createNewProjectile();
  }

  despawn(projectile: Entity): void {
    projectile.reset();
    this.pool.push(projectile);
  }
}
```

### Performance

- **<0.2ms per frame** (10 active projectiles)
- Each projectile:
  - Age increment: trivial
  - Ray-sphere test: ~0.01ms
  - Total: ~0.1ms for 10 projectiles

### Configuration

From `game-config.json`:

```json
{
  "player": {
    "projectileSpeed": 20,
    "damage": 10
  },
  "enemy": {
    "projectileSpeed": 15,
    "damage": 5
  }
}
```

Projectile lifetime: **3 seconds** (hardcoded in `ProjectileComponent`)

### Notes

- Projectiles use **ray-sphere** collision (fast, accurate for small bullets)
- No projectile gravity (straight line trajectory)
- No friendly fire (player projectiles don't hit player)

---

## Creating New Systems

### System Template

```typescript
// src/systems/NewSystem.ts
import { System } from '../ecs/System';
import { World } from '../ecs/World';
import { NewComponent } from '../components/NewComponent';

export class NewSystem extends System {
  constructor(world: World) {
    super(world);
  }

  update(deltaTime: number): void {
    // 1. Get relevant entities
    const entities = this.getEntities().filter(e =>
      e.hasComponent(NewComponent)
    );

    // 2. Process each entity
    for (const entity of entities) {
      const comp = entity.getComponent(NewComponent)!;

      // 3. Your logic here
      comp.someValue += deltaTime;
    }
  }
}
```

### Registration

```typescript
// In Game.init()
this.newSystem = new NewSystem(this.world);
this.world.addSystem(this.newSystem);

// Add in correct execution order!
this.world.addSystem(this.inputSystem);
this.world.addSystem(this.aiSystem);
this.world.addSystem(this.newSystem);      // ← Add here
this.world.addSystem(this.movementSystem);
```

### Best Practices

#### 1. Single Responsibility
Each system should do **one thing well**:

```typescript
// ✅ Good: Focused responsibility
class MovementSystem extends System {
  update(deltaTime) {
    // Only handles position updates
  }
}

class CollisionSystem extends System {
  update(deltaTime) {
    // Only handles collision detection/resolution
  }
}

// ❌ Bad: Too many responsibilities
class PhysicsSystem extends System {
  update(deltaTime) {
    this.applyGravity();
    this.updatePositions();
    this.checkCollisions();
    this.resolveCollisions();
    this.applyDamage();
    // Too much!
  }
}
```

#### 2. Avoid System Coupling

```typescript
// ❌ Bad: Systems reference each other
class AISystem extends System {
  constructor(world: World, private collisionSystem: CollisionSystem) {
    super(world);
  }

  update() {
    if (this.collisionSystem.hasCollision(entity)) {
      // ...
    }
  }
}

// ✅ Good: Systems communicate through components
class AISystem extends System {
  update() {
    const collision = entity.getComponent(CollisionComponent);
    if (collision?.hasCollision) {
      // ...
    }
  }
}
```

#### 3. Performance-Conscious Queries

```typescript
// ❌ Slow: Filters every frame
update(deltaTime: number) {
  const entities = this.getEntities().filter(e =>
    e.hasComponent(ComplexComponent)
  );
  // ...
}

// ✅ Better: Cache stable queries
private cachedEntities: Entity[] = [];
private needsRefresh = true;

update(deltaTime: number) {
  if (this.needsRefresh) {
    this.cachedEntities = this.getEntities().filter(e =>
      e.hasComponent(ComplexComponent)
    );
    this.needsRefresh = false;
  }

  // Use cached array
  for (const entity of this.cachedEntities) {
    // ...
  }
}

// Refresh when entities added/removed
onEntityAdded() {
  this.needsRefresh = true;
}
```

#### 4. Frame Budget Awareness

Target: **<2ms per system** (leaves 10ms for rendering at 60 FPS)

```typescript
update(deltaTime: number) {
  const start = performance.now();

  // Your logic here

  const elapsed = performance.now() - start;
  if (elapsed > 2.0) {
    console.warn(`${this.constructor.name} took ${elapsed.toFixed(2)}ms`);
  }
}
```

---

## System Performance Budget

| System | Budget | Typical | Max Entities |
|--------|--------|---------|--------------|
| InputSystem | 0.2ms | 0.05ms | 1 (player) |
| AISystem | 1.0ms | 0.5ms | 5 enemies |
| MovementSystem | 0.2ms | 0.1ms | 20 entities |
| CollisionSystem | 1.5ms | 0.7ms | 60 checks |
| ProjectileSystem | 0.5ms | 0.2ms | 10 projectiles |
| **TOTAL** | **3.4ms** | **1.55ms** | **60 FPS** ✅ |

**Headroom**: ~10ms available for Three.js rendering

---

## Related Documentation

- [API Reference](./api-reference.md) - Complete API docs
- [Component Catalog](./component-catalog.md) - All components
- [System Design](../architecture/system-design.md) - Architecture overview
- [ADR-0003: Entity Component System](../architecture/adr/0003-entity-component-system.md) - Why ECS?

---

**Last Updated**: 2025-11-09
**Maintained By**: Development Team
