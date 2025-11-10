# ADR-0002: Collision Detection Strategy

**Date**: 2025-11-09
**Status**: Accepted

## Context

We need collision detection for three scenarios in our 3D shooter:
1. **Player-Wall Collisions**: Prevent player from walking through walls and map boundaries
2. **Enemy-Wall Collisions**: Prevent enemies from walking through obstacles
3. **Projectile-Entity Collisions**: Detect when bullets hit player or enemies

Key constraints:
- Must maintain 60 FPS with 5 enemies and 10 active projectiles
- Budget: 2-3 weeks development time (can't implement complex physics)
- Accuracy requirements: "Good enough" for arcade-style gameplay (not physics simulation)
- Educational goal: Understandable collision algorithms (not black-box physics engine)

Current scene complexity:
- 1 player + 5 enemies = 6 entities with collision
- Map: 4 perimeter walls + 3-5 obstacle boxes = ~9 collidable surfaces
- 10 projectiles checking collisions each frame

## Decision

Implement a **hybrid collision detection approach**:

### 1. AABB (Axis-Aligned Bounding Box) for Entity-Wall Collisions
- Used for: Player vs walls, Enemy vs walls
- Algorithm: Check if entity's bounding box overlaps with wall bounding boxes
- Implementation: Simple min/max coordinate comparison
- Complexity: O(n*m) where n = entities, m = walls (~6*9 = 54 checks/frame)

### 2. Ray-Sphere Intersection for Projectile-Entity Collisions
- Used for: Projectile vs player/enemies
- Algorithm: Cast ray from projectile's previous position to current position, check sphere intersection
- Sphere radius: Entity radius (e.g., 0.5 units for player, 0.4 for enemies)
- Complexity: O(p*e) where p = projectiles, e = entities (~10*6 = 60 checks/frame)

### 3. No Physics Engine
- No continuous collision detection (tunneling possible but unlikely at our speeds)
- No rigid body dynamics (no bouncing, friction, etc.)
- No collision response beyond simple "stop movement" or "destroy projectile"

**Collision Resolution**:
- **Entity-Wall**: Set velocity to 0 in collision direction, snap entity back to valid position
- **Projectile-Entity**: Apply damage, destroy projectile, trigger hit visual/sound

**Spatial Optimization** (Phase 2, deferred if not needed):
- If FPS drops below 60, implement simple spatial grid (divide map into 10x10 cells)
- Only check collisions within same or adjacent cells
- Reduces AABB checks from O(n*m) to ~O(n)

## Alternatives Considered

### 1. **Full Physics Engine (Cannon.js, Ammo.js, Rapier)**
**Pros**:
- Accurate collision detection and response
- Handles complex scenarios (bouncing, friction, stacking)
- Continuous collision detection (no tunneling)

**Cons**:
- Significant bundle size increase (Cannon.js ~100KB, Ammo.js ~500KB)
- Overkill for simple arcade shooter (we don't need realistic physics)
- Performance overhead for features we don't use
- Adds complexity: must sync physics world with Three.js scene
- Learning curve steeper (physics engine APIs)

**Why not chosen**: Bundle size cost, complexity not justified for simple arcade mechanics.

### 2. **Mesh-Mesh Collision (Three.js Raycasting Against Triangles)**
**Pros**:
- Pixel-perfect collision accuracy
- Works with complex geometry (curved surfaces, etc.)

**Cons**:
- Very slow: Must test against every triangle in mesh
- Our geometry is simple (boxes, spheres) - AABB is sufficient
- 10-100x slower than AABB for our use case

**Why not chosen**: Unnecessary accuracy at massive performance cost.

### 3. **Sphere-Sphere Collision for Everything**
**Pros**:
- Simplest algorithm (distance check: `if (distance < r1 + r2)`)
- Very fast: O(1) per pair check
- No spatial partitioning needed

**Cons**:
- Poor fit for walls (sphere doesn't represent thin rectangle well)
- Inaccurate for box obstacles (sphere leaves gaps at corners)
- Player could "clip" through wall corners

**Why not chosen**: AABB is only slightly more expensive but far more accurate for rectangular geometry.

### 4. **Octree or BVH (Bounding Volume Hierarchy)**
**Pros**:
- O(log n) collision queries with spatial partitioning
- Scales to thousands of entities

**Cons**:
- Complex implementation (tree building, traversal, updates)
- Overkill for 6 entities and 9 walls (linear search is fast enough)
- Higher constant overhead (tree management)

**Why not chosen**: Premature optimization - our scene is too small to benefit.

## Consequences

### Positive
- ✅ Simple implementation: ~200 lines of collision code total
- ✅ Educational: Easy to understand and debug (no black-box physics)
- ✅ Performance: O(n*m) is fast enough for our scene size (<100 checks/frame)
- ✅ No bundle size cost: Pure math, no library dependencies
- ✅ Predictable: Deterministic collision response (no physics engine quirks)
- ✅ Flexible: Easy to tune collision radii and response behavior

### Negative
- ❌ Tunneling possible: Fast projectiles might pass through thin walls (mitigated by low projectile speed)
- ❌ No realistic physics: Projectiles don't bounce, entities don't push each other
- ❌ AABB-only for walls: Can't have diagonal walls (all axis-aligned)
- ❌ Manual optimization: Must implement spatial partitioning ourselves if needed
- ❌ No third-party debugging tools: Can't use physics engine visualizers

### Risks and Mitigations

**Risk 1: Tunneling (Projectile passes through entity)**
- **Likelihood**: Low (projectile speed << entity size)
- **Mitigation**: Keep projectile speed low (10 units/sec), entities are 0.5 units radius
- **Fallback**: Implement swept sphere test if tunneling observed

**Risk 2: Performance degradation with more entities**
- **Likelihood**: Low (our scene is small)
- **Mitigation**: Profile early, implement spatial grid if FPS drops below 60
- **Target**: Stay below 100 collision checks per frame

**Risk 3: Collision jitter (entity vibrates at wall contact)**
- **Likelihood**: Medium (common with simple collision response)
- **Mitigation**: Add small epsilon offset (0.01 units) when resolving collision
- **Validation**: Manual testing, observe player movement at walls

## Implementation Notes

### AABB Collision Check (Pseudocode)
```typescript
function checkAABBCollision(box1: AABB, box2: AABB): boolean {
  return (
    box1.min.x <= box2.max.x && box1.max.x >= box2.min.x &&
    box1.min.y <= box2.max.y && box1.max.y >= box2.min.y &&
    box1.min.z <= box2.max.z && box1.max.z >= box2.min.z
  );
}

// Resolve by moving entity back
function resolveAABBCollision(entity: Entity, wall: Wall) {
  const overlapX = Math.min(entity.max.x - wall.min.x, wall.max.x - entity.min.x);
  const overlapZ = Math.min(entity.max.z - wall.min.z, wall.max.z - entity.min.z);

  if (overlapX < overlapZ) {
    entity.position.x += entity.velocity.x > 0 ? -overlapX : overlapX;
  } else {
    entity.position.z += entity.velocity.z > 0 ? -overlapZ : overlapZ;
  }

  entity.velocity.set(0, 0, 0); // Stop movement
}
```

### Ray-Sphere Collision Check (Pseudocode)
```typescript
function raySphereIntersection(
  rayOrigin: Vector3,
  rayDirection: Vector3,
  sphereCenter: Vector3,
  sphereRadius: number
): boolean {
  const oc = rayOrigin.clone().sub(sphereCenter);
  const a = rayDirection.dot(rayDirection);
  const b = 2.0 * oc.dot(rayDirection);
  const c = oc.dot(oc) - sphereRadius * sphereRadius;
  const discriminant = b * b - 4 * a * c;

  return discriminant >= 0; // True if intersection occurs
}

// Called each frame for each projectile
function checkProjectileCollisions(projectile: Projectile, entities: Entity[]): Entity | null {
  const rayOrigin = projectile.previousPosition;
  const rayDirection = projectile.position.clone().sub(rayOrigin).normalize();
  const rayLength = projectile.position.distanceTo(rayOrigin);

  for (const entity of entities) {
    if (raySphereIntersection(rayOrigin, rayDirection, entity.position, entity.radius)) {
      return entity; // Hit detected
    }
  }

  return null; // No hit
}
```

### Performance Budget
- **AABB checks**: 6 entities * 9 walls = 54 checks/frame @ ~0.001ms each = 0.054ms
- **Ray-sphere checks**: 10 projectiles * 6 entities = 60 checks/frame @ ~0.002ms each = 0.12ms
- **Total collision budget**: ~0.2ms per frame (1.2% of 16.67ms frame budget)
- **Target**: Keep collision system under 1ms/frame (6% of budget)

## Validation Criteria

This ADR is considered successful if:
- [ ] Player cannot walk through walls (100% of manual tests)
- [ ] Projectile hits register correctly (>95% visual accuracy)
- [ ] No tunneling observed at normal projectile speeds (<500 units/sec)
- [ ] Collision system uses <1ms per frame (Chrome DevTools profiler)
- [ ] No collision jitter or vibration (manual testing)

## Related Decisions
- [ADR-0001: Three.js Rendering Approach](./0001-threejs-rendering-approach.md) - Uses Three.js Raycaster for projectiles
- [ADR-0003: Entity Component System](./0003-entity-component-system.md) - Entities have position/radius for collision
- [ADR-0004: AI State Machine Design](./0004-ai-state-machine.md) - AI uses collision info for obstacle avoidance

## References
- Real-Time Collision Detection (Christer Ericson)
- Three.js Raycaster Documentation: https://threejs.org/docs/#api/en/core/Raycaster
- Game Physics (David Eberly)
- AABB Collision Tutorial: https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection
