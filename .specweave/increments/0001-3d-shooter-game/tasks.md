---
increment: 0001-3d-shooter-game
total_tasks: 47
completed_tasks: 0
test_mode: TDD
coverage_target: 85%
---

# Implementation Tasks

## Phase 1: Foundation (Days 1-3)

### T-001: Project Setup and Build Configuration

**Description**: Initialize Vite project with TypeScript, Three.js, and testing infrastructure

**References**: NFR-003 (code quality), NFR-001 (performance)

**Implementation Details**:
- Create Vite project with TypeScript template
- Install dependencies: Three.js r150+, Vitest, Playwright, ESLint
- Configure TypeScript strict mode
- Setup ESLint with TypeScript rules
- Create basic file structure (src/, tests/)

**Test Plan**: N/A (configuration task)

**Validation**:
- TypeScript strict mode compiles without errors
- ESLint runs without critical errors
- Vite dev server starts successfully
- Build produces bundle <500KB gzipped

**Dependencies**: None
**Estimated Effort**: 2 hours
**Status**: [ ] Not Started

---

### T-002: Implement Entity Component System Core

**Description**: Create foundational ECS architecture with Entity, Component, EntityManager, and SystemManager

**References**: FR-003 (Entity System), AC-US1-01 (movement foundation)

**Implementation Details**:
- File: `src/ecs/Entity.ts` - Entity interface and ID generation
- File: `src/ecs/Component.ts` - Component base types
- File: `src/ecs/EntityManager.ts` - Create, destroy, query entities
- File: `src/ecs/SystemManager.ts` - Register and update systems

**Test Plan**:
- **File**: `tests/unit/ecs/EntityManager.test.ts`
- **Coverage Target**: 90%
- **Tests**:
  - **TC-001**: testCreateEntity()
    - Given an empty entity manager
    - When createEntity() is called
    - Then a new entity with unique ID is returned
  - **TC-002**: testDestroyEntity()
    - Given an entity manager with 3 entities
    - When destroyEntity(id) is called
    - Then entity is removed and subsequent queries return null
  - **TC-003**: testQueryEntitiesByComponents()
    - Given entities with different component combinations
    - When query(['Position', 'Velocity']) is called
    - Then only entities with both components are returned
  - **TC-004**: testSystemRegistrationAndUpdate()
    - Given a system manager with 2 registered systems
    - When update(deltaTime) is called
    - Then all systems execute in registration order

**Dependencies**: None
**Estimated Effort**: 4 hours
**Status**: [ ] Not Started

---

### T-003: Create Component Definitions

**Description**: Define all 8 component types as TypeScript interfaces

**References**: FR-003 (Entity System)

**Implementation Details**:
- File: `src/components/PositionComponent.ts` - position: Vector3, rotation: Euler
- File: `src/components/VelocityComponent.ts` - velocity: Vector3, speed: number
- File: `src/components/HealthComponent.ts` - current: number, max: number
- File: `src/components/MeshComponent.ts` - mesh: THREE.Mesh
- File: `src/components/AIComponent.ts` - state, detectionRadius, attackRange, target
- File: `src/components/ShooterComponent.ts` - damage, cooldown, lastShotTime
- File: `src/components/ProjectileComponent.ts` - owner, lifetime, age
- File: `src/components/ColliderComponent.ts` - shape, radius, size

**Test Plan**:
- **File**: `tests/unit/components/Components.test.ts`
- **Coverage Target**: 85%
- **Tests**:
  - **TC-001**: testComponentDefaultValues()
    - Given a new PositionComponent
    - When created with default values
    - Then position is (0,0,0) and rotation is (0,0,0)
  - **TC-002**: testHealthComponentValidation()
    - Given a HealthComponent with max=100
    - When current health is set to 120
    - Then current is clamped to max value 100
  - **TC-003**: testColliderComponentShapeTypes()
    - Given a ColliderComponent with shape='sphere'
    - When radius is defined
    - Then component is valid for sphere collision checks

**Dependencies**: T-002
**Estimated Effort**: 3 hours
**Status**: [ ] Not Started

---

### T-004: Implement Three.js Scene Manager

**Description**: Setup Three.js scene, camera, renderer, and lighting

**References**: FR-001 (Three.js Rendering), AC-US5-05 (lighting), AC-US1-03 (camera)

**Implementation Details**:
- File: `src/rendering/SceneManager.ts`
- Initialize WebGLRenderer with antialiasing
- Create PerspectiveCamera (FOV 75, aspect ratio, near/far planes)
- Setup Scene with ambient + directional lighting
- Handle window resize events
- Implement render loop with requestAnimationFrame

**Test Plan**:
- **File**: `tests/integration/rendering/SceneManager.test.ts`
- **Coverage Target**: 80%
- **Tests**:
  - **TC-001**: testSceneInitialization()
    - Given a new SceneManager instance
    - When initialize() is called
    - Then scene, camera, and renderer are created successfully
  - **TC-002**: testCameraSetup()
    - Given an initialized SceneManager
    - When camera is accessed
    - Then FOV is 75 degrees and position is (0, 1.6, 0)
  - **TC-003**: testLightingConfiguration()
    - Given an initialized scene
    - When lights are queried
    - Then scene contains ambient light and directional light
  - **TC-004**: testWindowResize()
    - Given a scene with 800x600 resolution
    - When window resize event fires (1920x1080)
    - Then camera aspect ratio and renderer size update

**Dependencies**: None
**Estimated Effort**: 3 hours
**Status**: [ ] Not Started

---

### T-005: Create Mesh Factory for Entities

**Description**: Factory to create Three.js meshes for player, enemies, projectiles, walls

**References**: FR-001 (Three.js Rendering), AC-US2-03 (projectile mesh)

**Implementation Details**:
- File: `src/rendering/MeshFactory.ts`
- createPlayerMesh(): Capsule geometry (player body)
- createEnemyMesh(): Box geometry with red material
- createProjectileMesh(): Small sphere geometry
- createWallMesh(width, height): Box geometry with texture
- createFloorMesh(width, height): Plane geometry with grid texture
- File: `src/rendering/MaterialLibrary.ts` - Shared materials to reduce draw calls

**Test Plan**:
- **File**: `tests/unit/rendering/MeshFactory.test.ts`
- **Coverage Target**: 85%
- **Tests**:
  - **TC-001**: testCreatePlayerMesh()
    - Given MeshFactory instance
    - When createPlayerMesh() is called
    - Then returns THREE.Mesh with capsule geometry and correct scale
  - **TC-002**: testCreateProjectileMesh()
    - Given MeshFactory instance
    - When createProjectileMesh() is called
    - Then returns small sphere mesh (radius 0.1 units)
  - **TC-003**: testMaterialSharing()
    - Given multiple enemy meshes created
    - When materials are inspected
    - Then all enemies share same material instance (memory optimization)

**Dependencies**: T-004
**Estimated Effort**: 3 hours
**Status**: [ ] Not Started

---

### T-006: Implement Input System

**Description**: Handle keyboard and mouse input for player movement and aiming

**References**: FR-006 (Input Handling), AC-US1-01, AC-US1-02, AC-US1-03, AC-US2-01

**Implementation Details**:
- File: `src/systems/InputSystem.ts`
- Listen for keydown/keyup events (WASD, Arrow keys)
- Track key states in boolean map
- Request Pointer Lock on canvas click
- Handle mousemove events for camera rotation
- Update player velocity based on input
- Handle left mouse click for shooting trigger

**Test Plan**:
- **File**: `tests/unit/systems/InputSystem.test.ts`
- **Coverage Target**: 88%
- **Tests**:
  - **TC-001**: testKeyboardMovementMapping()
    - Given InputSystem with no keys pressed
    - When 'W' key is pressed
    - Then forward velocity is set to player speed
  - **TC-002**: testStrafeInputMapping()
    - Given InputSystem with no keys pressed
    - When 'A' key is pressed
    - Then left strafe velocity is set to player speed
  - **TC-003**: testMouseRotation()
    - Given Pointer Lock is active
    - When mouse moves 100px to the right
    - Then camera yaw rotates by calculated delta
  - **TC-004**: testPointerLockRequest()
    - Given InputSystem initialized
    - When canvas is clicked
    - Then Pointer Lock API is requested
  - **TC-005**: testShootingInput()
    - Given player with ShooterComponent
    - When left mouse button is clicked
    - Then shooting flag is set to true

**Dependencies**: T-002, T-003
**Estimated Effort**: 4 hours
**Status**: [ ] Not Started

---

### T-007: Implement Movement System

**Description**: Apply velocity to entity positions each frame

**References**: AC-US1-01, AC-US1-02, AC-US1-04 (smooth movement at 60 FPS)

**Implementation Details**:
- File: `src/systems/MovementSystem.ts`
- Query entities with Position + Velocity components
- Update position: `position += velocity * deltaTime`
- Apply friction/damping (optional)
- Clamp velocity to max speed

**Test Plan**:
- **File**: `tests/unit/systems/MovementSystem.test.ts`
- **Coverage Target**: 90%
- **Tests**:
  - **TC-001**: testBasicMovement()
    - Given entity at position (0,0,0) with velocity (1,0,0)
    - When MovementSystem updates with deltaTime=1
    - Then entity position is (1,0,0)
  - **TC-002**: testDeltaTimeScaling()
    - Given entity with velocity (10,0,0)
    - When update called with deltaTime=0.016 (60 FPS)
    - Then position changes by (0.16,0,0)
  - **TC-003**: testMultipleEntities()
    - Given 5 entities with different velocities
    - When MovementSystem updates
    - Then all entities move independently
  - **TC-004**: testVelocityClamping()
    - Given entity with velocity (100,0,0) and maxSpeed=5
    - When MovementSystem updates
    - Then velocity is clamped to (5,0,0)

**Dependencies**: T-002, T-003
**Estimated Effort**: 3 hours
**Status**: [ ] Not Started

---

### T-008: Load and Render Arena Map

**Description**: Load map-arena-01.json and create floor, walls, and obstacles in scene

**References**: AC-US5-01, AC-US5-02, AC-US5-03, AC-US5-04, AC-US5-06

**Implementation Details**:
- File: `src/data/map-arena-01.json` - Define arena geometry (50x50 units, walls, obstacles)
- File: `src/loaders/ConfigLoader.ts` - Fetch and parse JSON
- File: `src/loaders/types.ts` - TypeScript interfaces for map config
- Create floor mesh (50x50 plane with texture)
- Create 4 perimeter wall meshes
- Create 3-5 obstacle boxes for cover
- Add collider components to walls and obstacles

**Test Plan**:
- **File**: `tests/integration/loaders/MapLoader.test.ts`
- **Coverage Target**: 82%
- **Tests**:
  - **TC-001**: testMapConfigLoading()
    - Given a valid map-arena-01.json file
    - When ConfigLoader.loadMap() is called
    - Then map config object is returned with expected structure
  - **TC-002**: testFloorCreation()
    - Given map config with floor dimensions 50x50
    - When floor mesh is created
    - Then mesh has correct size and position (y=0)
  - **TC-003**: testWallGeneration()
    - Given map config with 4 walls
    - When walls are created
    - Then 4 wall entities with ColliderComponent exist in scene
  - **TC-004**: testObstaclePositioning()
    - Given map config with 3 obstacles at specific positions
    - When obstacles are created
    - Then obstacle entities match specified positions from JSON

**Dependencies**: T-004, T-005
**Estimated Effort**: 4 hours
**Status**: [ ] Not Started

---

### T-009: Create Player Entity and First-Person Camera

**Description**: Initialize player entity with all required components and attach camera

**References**: AC-US1-01, AC-US1-03, AC-US4-01 (100 health)

**Implementation Details**:
- File: `src/game/PlayerFactory.ts`
- Create player entity with components: Position, Velocity, Health, Mesh, Shooter, Collider
- Set initial position (center of arena)
- Set initial health (100 HP)
- Attach PerspectiveCamera to player position (height 1.6 units - eye level)
- Camera follows player rotation from InputSystem

**Test Plan**:
- **File**: `tests/unit/game/PlayerFactory.test.ts`
- **Coverage Target**: 87%
- **Tests**:
  - **TC-001**: testPlayerCreation()
    - Given PlayerFactory
    - When createPlayer() is called
    - Then player entity has all required components (Position, Velocity, Health, Shooter, Collider)
  - **TC-002**: testInitialHealthValue()
    - Given newly created player
    - When health component is checked
    - Then current health is 100 and max health is 100
  - **TC-003**: testCameraAttachment()
    - Given player entity
    - When camera position is updated
    - Then camera position matches player position + eye height (1.6 units)
  - **TC-004**: testInitialPosition()
    - Given 50x50 arena
    - When player is created
    - Then player position is at arena center (25, 0, 25)

**Dependencies**: T-002, T-003, T-004
**Estimated Effort**: 3 hours
**Status**: [ ] Not Started

---

### T-010: Integration Test - Basic Player Movement

**Description**: End-to-end test of player movement with input, rendering, and collision

**References**: AC-US1-04 (smooth at 60 FPS), AC-US1-05 (cannot move through walls)

**Implementation Details**:
- File: `tests/integration/player/PlayerMovement.test.ts`
- Setup complete game environment
- Simulate keyboard input
- Verify player position changes
- Verify camera follows player
- Test boundary detection (walls)

**Test Plan**:
- **File**: `tests/integration/player/PlayerMovement.test.ts`
- **Coverage Target**: 85%
- **Tests**:
  - **TC-001**: testPlayerMovementIntegration()
    - Given initialized game with player at (25, 0, 25)
    - When 'W' key pressed for 1 second (simulated)
    - Then player position.z decreases (moves forward)
  - **TC-002**: testCameraFollowsPlayer()
    - Given player entity with attached camera
    - When player moves to (30, 0, 30)
    - Then camera position is (30, 1.6, 30)
  - **TC-003**: testSmoothMovement60FPS()
    - Given game loop running at 60 FPS
    - When movement system updates over 60 frames
    - Then player movement is smooth (no stuttering or frame drops)

**Dependencies**: T-006, T-007, T-009
**Estimated Effort**: 3 hours
**Status**: [ ] Not Started

---

## Phase 2: Collision and Physics (Days 4-5)

### T-011: Implement AABB Collision Detection Algorithm

**Description**: Axis-Aligned Bounding Box collision detection for entity-wall collisions

**References**: FR-002 (Collision Detection), AC-US1-05 (cannot move through walls)

**Implementation Details**:
- File: `src/collision/AABB.ts`
- Function: checkAABBCollision(box1, box2): boolean
- Function: getAABBOverlap(box1, box2): Vector3
- Use Three.js Box3 helper for bounding boxes
- Return overlap vector for collision resolution

**Test Plan**:
- **File**: `tests/unit/collision/AABB.test.ts`
- **Coverage Target**: 95%
- **Tests**:
  - **TC-001**: testAABBIntersection()
    - Given two boxes with overlapping bounds
    - When checkAABBCollision() is called
    - Then returns true
  - **TC-002**: testAABBSeparation()
    - Given two boxes separated by 1 unit
    - When checkAABBCollision() is called
    - Then returns false
  - **TC-003**: testAABBEdgeCase()
    - Given two boxes touching at edge (no overlap)
    - When checkAABBCollision() is called
    - Then returns false (epsilon tolerance)
  - **TC-004**: testOverlapCalculation()
    - Given boxes overlapping by (0.5, 0, 0)
    - When getAABBOverlap() is called
    - Then returns Vector3(0.5, 0, 0)
  - **TC-005**: testCornerCollision()
    - Given player colliding with wall corner
    - When collision check runs
    - Then correct overlap vector is calculated

**Dependencies**: None
**Estimated Effort**: 4 hours
**Status**: [ ] Not Started

---

### T-012: Implement Collision System

**Description**: System to detect and resolve collisions between entities and walls

**References**: FR-002 (Collision Detection), AC-US1-05, AC-US3-06 (enemy obstacle avoidance)

**Implementation Details**:
- File: `src/systems/CollisionSystem.ts`
- Query entities with Position + Collider components
- Check each entity against all walls using AABB
- If collision detected, call CollisionResolver
- Handle multiple simultaneous collisions (corners)
- File: `src/collision/CollisionResolver.ts` - Move entity back, zero velocity

**Test Plan**:
- **File**: `tests/unit/systems/CollisionSystem.test.ts`
- **Coverage Target**: 88%
- **Tests**:
  - **TC-001**: testPlayerWallCollision()
    - Given player moving toward wall
    - When CollisionSystem updates
    - Then player position is corrected to not overlap wall
  - **TC-002**: testVelocityZeroing()
    - Given player colliding with wall at velocity (5,0,0)
    - When collision is resolved
    - Then velocity is set to (0,0,0)
  - **TC-003**: testMultipleCollisions()
    - Given player in corner (colliding with 2 walls)
    - When CollisionSystem updates
    - Then both collisions are resolved correctly
  - **TC-004**: testNoJitterAtWall()
    - Given player standing still against wall
    - When CollisionSystem updates for 60 frames
    - Then player position remains stable (no vibration)
  - **TC-005**: testEnemyObstacleAvoidance()
    - Given enemy moving toward obstacle
    - When collision detected
    - Then enemy stops or redirects movement

**Dependencies**: T-011
**Estimated Effort**: 5 hours
**Status**: [ ] Not Started

---

### T-013: Add Colliders to All Static Geometry

**Description**: Add ColliderComponent to all walls, obstacles, and floor boundaries

**References**: AC-US5-03 (walls block movement), AC-US5-04 (obstacles for cover)

**Implementation Details**:
- Update map loading (T-008) to add ColliderComponent to walls
- Add ColliderComponent to obstacle entities
- Define AABB size for each geometry type
- Add boundary colliders (invisible walls at arena edges)

**Test Plan**:
- **File**: `tests/integration/collision/StaticColliders.test.ts`
- **Coverage Target**: 80%
- **Tests**:
  - **TC-001**: testWallColliders()
    - Given loaded map with 4 perimeter walls
    - When entities are queried for ColliderComponent
    - Then 4 wall entities have AABB colliders with correct sizes
  - **TC-002**: testObstacleColliders()
    - Given map with 3 obstacles
    - When colliders are checked
    - Then each obstacle has AABB collider matching mesh dimensions
  - **TC-003**: testBoundaryColliders()
    - Given 50x50 arena
    - When player walks to edge
    - Then invisible boundary collider prevents exit

**Dependencies**: T-008, T-011, T-012
**Estimated Effort**: 2 hours
**Status**: [ ] Not Started

---

### T-014: Integration Test - Player-Wall Collision

**Description**: Full integration test of player movement with collision detection

**References**: AC-US1-05 (cannot move through walls)

**Implementation Details**:
- File: `tests/integration/collision/PlayerWallCollision.test.ts`
- Simulate player walking into wall
- Verify collision detection triggers
- Verify position correction works
- Verify no jitter or tunneling

**Test Plan**:
- **File**: `tests/integration/collision/PlayerWallCollision.test.ts`
- **Coverage Target**: 85%
- **Tests**:
  - **TC-001**: testPlayerStopsAtWall()
    - Given player at (5, 0, 5) moving forward
    - When wall is at z=0
    - Then player position.z does not go below 0.5 (player radius)
  - **TC-002**: testPlayerSlidesAlongWall()
    - Given player moving diagonally toward wall
    - When collision occurs
    - Then player slides along wall (parallel component preserved)
  - **TC-003**: testNoTunneling()
    - Given player moving at high speed toward wall
    - When collision check runs
    - Then player never passes through wall (tested at various speeds)

**Dependencies**: T-006, T-007, T-011, T-012
**Estimated Effort**: 3 hours
**Status**: [ ] Not Started

---

## Phase 3: Shooting and Projectiles (Days 6-7)

### T-015: Implement Projectile Component and Entity

**Description**: Create projectile entity structure and projectile-specific component

**References**: AC-US2-01, AC-US2-02, AC-US2-03

**Implementation Details**:
- ProjectileComponent already defined in T-003
- File: `src/game/ProjectileFactory.ts`
- createProjectile(position, direction, owner): Entity
- Projectile has: Position, Velocity, Mesh, ProjectileComponent, Collider (sphere)
- Set velocity based on direction and projectile speed
- Assign owner ('player' or 'enemy')

**Test Plan**:
- **File**: `tests/unit/game/ProjectileFactory.test.ts`
- **Coverage Target**: 88%
- **Tests**:
  - **TC-001**: testProjectileCreation()
    - Given ProjectileFactory
    - When createProjectile(pos, dir, 'player') is called
    - Then projectile entity has all required components
  - **TC-002**: testProjectileVelocity()
    - Given direction vector (0,0,-1) and speed 20
    - When projectile is created
    - Then velocity is (0,0,-20)
  - **TC-003**: testProjectileOwnership()
    - Given projectile created by player
    - When owner is checked
    - Then ProjectileComponent.owner is 'player'

**Dependencies**: T-003, T-005
**Estimated Effort**: 2 hours
**Status**: [ ] Not Started

---

### T-016: Implement Object Pooling for Projectiles

**Description**: Pre-allocate projectile pool to avoid garbage collection during gameplay

**References**: FR-009 (Performance Optimization), NFR-001 (60 FPS)

**Implementation Details**:
- File: `src/systems/ProjectilePool.ts`
- Pre-create 20 projectile entities at game start
- Function: spawn(position, direction, owner): Entity | null
- Function: destroy(projectile): void (mark inactive, don't delete)
- Track active/inactive projectiles
- Reuse inactive projectiles when spawning

**Test Plan**:
- **File**: `tests/unit/systems/ProjectilePool.test.ts`
- **Coverage Target**: 92%
- **Tests**:
  - **TC-001**: testPoolInitialization()
    - Given ProjectilePool with size 20
    - When initialized
    - Then 20 inactive projectile entities exist
  - **TC-002**: testSpawnFromPool()
    - Given pool with 5 inactive projectiles
    - When spawn() is called
    - Then inactive projectile is reused and marked active
  - **TC-003**: testPoolExhaustion()
    - Given pool with all 20 projectiles active
    - When spawn() is called
    - Then returns null (pool exhausted)
  - **TC-004**: testDestroyReturnsToPool()
    - Given active projectile
    - When destroy() is called
    - Then projectile marked inactive and available for reuse
  - **TC-005**: testNoMemoryLeaks()
    - Given 1000 spawn/destroy cycles
    - When memory is measured
    - Then no heap growth (objects reused, not created)

**Dependencies**: T-015
**Estimated Effort**: 4 hours
**Status**: [ ] Not Started

---

### T-017: Implement Projectile System

**Description**: System to spawn, update, and destroy projectiles

**References**: FR-008 (Projectile System), AC-US2-02 (travel in straight line), AC-US2-06 (fire rate)

**Implementation Details**:
- File: `src/systems/ProjectileSystem.ts`
- Handle shooting input (check cooldown timer)
- Spawn projectile from player position in aim direction
- Update projectile age each frame
- Destroy projectiles after 5 seconds (lifetime)
- Check for collisions with walls (destroy on impact)
- Integrate with ProjectilePool (T-016)

**Test Plan**:
- **File**: `tests/unit/systems/ProjectileSystem.test.ts`
- **Coverage Target**: 90%
- **Tests**:
  - **TC-001**: testProjectileSpawning()
    - Given player with ShooterComponent and cooldown expired
    - When ProjectileSystem update is called with shooting flag
    - Then projectile is spawned from player position
  - **TC-002**: testFireRateCooldown()
    - Given player shoots at time=0
    - When ProjectileSystem update called at time=0.1 (cooldown=0.2s)
    - Then second shot is blocked (cooldown not expired)
  - **TC-003**: testProjectileLifetime()
    - Given projectile spawned at time=0
    - When time reaches 5 seconds
    - Then projectile is destroyed automatically
  - **TC-004**: testWallCollisionDestruction()
    - Given projectile traveling toward wall
    - When projectile hits wall
    - Then projectile is destroyed immediately
  - **TC-005**: testProjectileMovement()
    - Given projectile with velocity (0,0,-20)
    - When ProjectileSystem updates over 0.5 seconds
    - Then projectile position.z decreases by 10 units

**Dependencies**: T-015, T-016, T-011, T-012
**Estimated Effort**: 5 hours
**Status**: [ ] Not Started

---

### T-018: Implement Ray-Sphere Collision Detection

**Description**: Ray-sphere intersection algorithm for projectile hit detection

**References**: FR-002 (Collision Detection), AC-US2-04 (hit detection)

**Implementation Details**:
- File: `src/collision/RaySphere.ts`
- Function: raySphereIntersection(rayOrigin, rayDir, sphereCenter, sphereRadius): boolean
- Calculate discriminant to determine intersection
- Return true if ray passes through sphere
- Optimized for projectile-entity hit checks

**Test Plan**:
- **File**: `tests/unit/collision/RaySphere.test.ts`
- **Coverage Target**: 93%
- **Tests**:
  - **TC-001**: testRayHitsSphere()
    - Given ray from (0,0,0) direction (1,0,0)
    - When sphere at (5,0,0) with radius 1
    - Then intersection returns true
  - **TC-002**: testRayMissesSphere()
    - Given ray from (0,0,0) direction (1,0,0)
    - When sphere at (0,5,0) with radius 1
    - Then intersection returns false
  - **TC-003**: testRayOriginInsideSphere()
    - Given ray origin (0,0,0) inside sphere at (0,0,0) radius 2
    - When intersection check runs
    - Then returns true (origin inside counts as hit)
  - **TC-004**: testGrazingHit()
    - Given ray tangent to sphere (just touching edge)
    - When intersection check runs
    - Then returns true (edge case handled)

**Dependencies**: None
**Estimated Effort**: 3 hours
**Status**: [ ] Not Started

---

### T-019: Add Projectile-Entity Collision Checks

**Description**: Extend CollisionSystem to detect projectile hits on entities

**References**: AC-US2-04 (hit detection), AC-US2-05 (reduce enemy health)

**Implementation Details**:
- Update `src/systems/CollisionSystem.ts`
- For each active projectile, check collision with:
  - Enemy entities (if projectile owner is 'player')
  - Player entity (if projectile owner is 'enemy')
- Use ray-sphere intersection (T-018)
- On hit: destroy projectile, apply damage (handled by HealthSystem in Phase 5)
- Emit hit event for damage application

**Test Plan**:
- **File**: `tests/unit/systems/ProjectileCollision.test.ts`
- **Coverage Target**: 88%
- **Tests**:
  - **TC-001**: testProjectileHitsEnemy()
    - Given player projectile traveling toward enemy
    - When projectile enters enemy collision sphere
    - Then hit is detected and projectile is destroyed
  - **TC-002**: testProjectileIgnoresOwner()
    - Given player projectile traveling backward
    - When projectile overlaps player position
    - Then no collision (player can't shoot self)
  - **TC-003**: testEnemyProjectileHitsPlayer()
    - Given enemy projectile traveling toward player
    - When projectile hits player collision sphere
    - Then hit is detected and collision event emitted
  - **TC-004**: testProjectileMissesTarget()
    - Given projectile traveling past enemy (no overlap)
    - When collision check runs
    - Then no hit detected

**Dependencies**: T-017, T-018, T-012
**Estimated Effort**: 4 hours
**Status**: [ ] Not Started

---

### T-020: Integration Test - Player Shooting

**Description**: End-to-end test of shooting mechanics

**References**: AC-US2-01, AC-US2-02, AC-US2-03, AC-US2-06

**Implementation Details**:
- File: `tests/integration/shooting/PlayerShooting.test.ts`
- Simulate player click (shoot)
- Verify projectile spawns
- Verify projectile travels correctly
- Verify fire rate cooldown
- Test projectile-wall collision

**Test Plan**:
- **File**: `tests/integration/shooting/PlayerShooting.test.ts`
- **Coverage Target**: 85%
- **Tests**:
  - **TC-001**: testFullShootingFlow()
    - Given player ready to shoot
    - When left mouse button clicked
    - Then projectile spawns and travels in aim direction
  - **TC-002**: testFireRateLimiting()
    - Given player shoots twice in quick succession (0.1s apart)
    - When second shot occurs before cooldown (0.2s)
    - Then second projectile does not spawn
  - **TC-003**: testProjectileVisibility()
    - Given projectile spawned
    - When scene is rendered
    - Then projectile mesh is visible in scene

**Dependencies**: T-017, T-019
**Estimated Effort**: 3 hours
**Status**: [ ] Not Started

---

## Phase 4: Enemy AI (Days 8-10)

### T-021: Implement State Machine Base Class

**Description**: Generic finite state machine for AI behavior

**References**: FR-004 (AI State Machine)

**Implementation Details**:
- File: `src/ai/StateMachine.ts`
- Class: StateMachine with states map
- Function: setState(newState): void
- Function: update(deltaTime): void
- Trigger onEnter, onUpdate, onExit callbacks
- Generic implementation (reusable beyond enemy AI)

**Test Plan**:
- **File**: `tests/unit/ai/StateMachine.test.ts`
- **Coverage Target**: 90%
- **Tests**:
  - **TC-001**: testStateTransition()
    - Given state machine in 'idle' state
    - When setState('chase') is called
    - Then 'idle' onExit fires, then 'chase' onEnter fires
  - **TC-002**: testStateUpdate()
    - Given state machine in 'attack' state
    - When update(deltaTime) is called
    - Then 'attack' state's onUpdate callback executes
  - **TC-003**: testInvalidStateTransition()
    - Given state machine with defined states
    - When setState('invalidState') is called
    - Then error is thrown or logged
  - **TC-004**: testRepeatedStateChange()
    - Given state machine
    - When setState called 100 times in loop
    - Then all transitions execute correctly (no memory leak)

**Dependencies**: None
**Estimated Effort**: 3 hours
**Status**: [ ] Not Started

---

### T-022: Implement Enemy AI State Machine

**Description**: Four-state AI for enemy behavior (idle, chase, attack, dead)

**References**: FR-004 (AI State Machine), AC-US3-01 through AC-US3-08

**Implementation Details**:
- File: `src/ai/EnemyAI.ts`
- States: idle, chase, attack, dead
- **Idle**: No player detected, patrol or stand still
- **Chase**: Player in detection radius, move toward player
- **Attack**: In attack range, shoot projectiles at player
- **Dead**: Health depleted, remove entity
- Transition logic based on distance to player
- Integration with AIComponent (T-003)

**Test Plan**:
- **File**: `tests/unit/ai/EnemyAI.test.ts`
- **Coverage Target**: 88%
- **Tests**:
  - **TC-001**: testIdleToChaseTransition()
    - Given enemy in idle state and player at distance 15 (detectionRadius=20)
    - When AI updates
    - Then state transitions to 'chase'
  - **TC-002**: testChaseToAttackTransition()
    - Given enemy in chase state and player at distance 7 (attackRange=8)
    - When AI updates
    - Then state transitions to 'attack'
  - **TC-003**: testAttackToChaseTransition()
    - Given enemy in attack state and player moves to distance 12
    - When AI updates
    - Then state transitions back to 'chase'
  - **TC-004**: testDeadState()
    - Given enemy with health=0
    - When AI updates
    - Then state is 'dead' and no further updates occur
  - **TC-005**: testTargetTracking()
    - Given enemy in chase state
    - When player position changes
    - Then enemy target updates to current player position

**Dependencies**: T-021
**Estimated Effort**: 5 hours
**Status**: [ ] Not Started

---

### T-023: Implement AI System

**Description**: System to update all enemy AI state machines each frame

**References**: AC-US3-02 (detection), AC-US3-03 (pursuit), AC-US3-04 (maintain distance)

**Implementation Details**:
- File: `src/systems/AISystem.ts`
- Query entities with AIComponent
- For each enemy:
  - Calculate distance to player
  - Update state machine (T-022)
  - Apply movement velocity based on state
  - Handle shooting in attack state
- Integration with EnemyAI (T-022)

**Test Plan**:
- **File**: `tests/unit/systems/AISystem.test.ts`
- **Coverage Target**: 85%
- **Tests**:
  - **TC-001**: testEnemyDetection()
    - Given enemy at (0,0,0) and player at (15,0,0)
    - When AISystem updates
    - Then enemy detects player (distance < detectionRadius)
  - **TC-002**: testPursuitBehavior()
    - Given enemy in chase state
    - When AISystem updates
    - Then enemy velocity points toward player position
  - **TC-003**: testDistanceMaintenance()
    - Given enemy at attackRange from player
    - When AISystem updates
    - Then enemy stops moving (velocity near zero)
  - **TC-004**: testMultipleEnemies()
    - Given 5 enemies with different states
    - When AISystem updates
    - Then all enemies update independently

**Dependencies**: T-022
**Estimated Effort**: 4 hours
**Status**: [ ] Not Started

---

### T-024: Implement Enemy Shooting

**Description**: Enemies spawn projectiles when in attack state

**References**: AC-US3-05 (shoot at player), AC-US3-07 (fire rate)

**Implementation Details**:
- Update AISystem (T-023) to handle shooting in attack state
- Add ShooterComponent to enemies
- Check cooldown before shooting
- Spawn projectile aimed at player position
- Add accuracy variance (random offset to aim direction)
- Use ProjectilePool (T-016)

**Test Plan**:
- **File**: `tests/unit/ai/EnemyShooting.test.ts`
- **Coverage Target**: 87%
- **Tests**:
  - **TC-001**: testEnemyShootsInAttackState()
    - Given enemy in attack state with cooldown expired
    - When AISystem updates
    - Then enemy spawns projectile toward player
  - **TC-002**: testEnemyFireRate()
    - Given enemy with fireRate=1.0 (1 shot/second)
    - When AISystem updates at 0.5s intervals
    - Then enemy shoots every 1.0 seconds
  - **TC-003**: testAimAccuracyVariance()
    - Given enemy shooting at player
    - When 10 projectiles are spawned
    - Then projectile directions have slight variance (not all identical)
  - **TC-004**: testNoShootingInChaseState()
    - Given enemy in chase state
    - When AISystem updates
    - Then no projectiles are spawned

**Dependencies**: T-023, T-016, T-017
**Estimated Effort**: 4 hours
**Status**: [ ] Not Started

---

### T-025: Implement Obstacle Avoidance

**Description**: Enemies raycast ahead to avoid obstacles when chasing

**References**: AC-US3-06 (avoid obstacles)

**Implementation Details**:
- Update AISystem to perform raycast in movement direction
- Raycast distance: 2 units ahead
- If obstacle detected, turn 90 degrees and try again
- Limit avoidance attempts to 2 per frame
- Accept occasional stuck enemies (simple approach)

**Test Plan**:
- **File**: `tests/unit/ai/ObstacleAvoidance.test.ts`
- **Coverage Target**: 82%
- **Tests**:
  - **TC-001**: testObstacleDetection()
    - Given enemy moving toward obstacle 1.5 units ahead
    - When raycast check runs
    - Then obstacle is detected
  - **TC-002**: testAvoidanceTurn()
    - Given enemy facing obstacle
    - When avoidance logic executes
    - Then enemy turns 90 degrees and rechecks path
  - **TC-003**: testClearPathNoTurn()
    - Given enemy with clear path to player
    - When raycast check runs
    - Then no obstacle detected, no turn occurs
  - **TC-004**: testAvoidanceAttemptLimit()
    - Given enemy stuck between two obstacles
    - When avoidance runs
    - Then maximum 2 turn attempts per frame (prevent infinite loop)

**Dependencies**: T-023
**Estimated Effort**: 4 hours
**Status**: [ ] Not Started

---

### T-026: Create Enemy Entities and Spawn Points

**Description**: Load enemy spawn points from map config and create enemy entities

**References**: AC-US3-01 (spawn at predefined locations), AC-US6-02 (3-5 enemies)

**Implementation Details**:
- Update `src/data/map-arena-01.json` to include enemy spawn points (3-5 locations)
- File: `src/game/EnemyFactory.ts`
- createEnemy(position): Entity
- Add components: Position, Velocity, Health, Mesh, AI, Shooter, Collider
- Load enemy properties from game-config.json
- Spawn all enemies at game start

**Test Plan**:
- **File**: `tests/unit/game/EnemyFactory.test.ts`
- **Coverage Target**: 85%
- **Tests**:
  - **TC-001**: testEnemyCreation()
    - Given EnemyFactory
    - When createEnemy(position) is called
    - Then enemy entity has all required components
  - **TC-002**: testEnemyInitialHealth()
    - Given enemy created with config health=50
    - When health component is checked
    - Then current health is 50 and max health is 50
  - **TC-003**: testSpawnPointLoading()
    - Given map config with 4 spawn points
    - When enemies are spawned
    - Then 4 enemy entities exist at specified positions
  - **TC-004**: testEnemyAIInitialization()
    - Given newly created enemy
    - When AI component is checked
    - Then state is 'idle' and target is null

**Dependencies**: T-003, T-005, T-022
**Estimated Effort**: 3 hours
**Status**: [ ] Not Started

---

### T-027: Integration Test - Enemy AI Behavior

**Description**: Full integration test of enemy detection, chase, and attack

**References**: AC-US3-02, AC-US3-03, AC-US3-04, AC-US3-05

**Implementation Details**:
- File: `tests/integration/ai/EnemyBehavior.test.ts`
- Spawn enemy and player
- Move player into detection range
- Verify enemy chases
- Verify enemy stops at attack range
- Verify enemy shoots

**Test Plan**:
- **File**: `tests/integration/ai/EnemyBehavior.test.ts`
- **Coverage Target**: 85%
- **Tests**:
  - **TC-001**: testFullAIBehaviorLoop()
    - Given enemy at (0,0,0) in idle state and player at (30,0,0)
    - When player moves to (15,0,0) (in detection range)
    - Then enemy transitions to chase and moves toward player
  - **TC-002**: testAttackStateTriggering()
    - Given enemy chasing player
    - When player distance reaches 7 units (attackRange=8)
    - Then enemy transitions to attack state and shoots
  - **TC-003**: testObstacleAvoidanceDuringChase()
    - Given enemy chasing player with obstacle in path
    - When enemy approaches obstacle
    - Then enemy avoids obstacle and continues pursuit

**Dependencies**: T-023, T-024, T-025, T-026
**Estimated Effort**: 4 hours
**Status**: [ ] Not Started

---

## Phase 5: Combat System (Days 11-12)

### T-028: Implement Health System

**Description**: System to apply damage, update health, and handle death

**References**: AC-US4-01, AC-US4-02, AC-US4-04, AC-US4-05, AC-US4-07

**Implementation Details**:
- File: `src/systems/HealthSystem.ts`
- Listen for damage events (from projectile collisions)
- Apply damage to HealthComponent
- Check for death (health <= 0)
- Trigger death handling (remove entity, update game state)
- Emit death events for stats tracking

**Test Plan**:
- **File**: `tests/unit/systems/HealthSystem.test.ts`
- **Coverage Target**: 92%
- **Tests**:
  - **TC-001**: testDamageApplication()
    - Given entity with health=100
    - When damage(25) is applied
    - Then health reduces to 75
  - **TC-002**: testDeathDetection()
    - Given entity with health=10
    - When damage(15) is applied
    - Then entity health is 0 and death event emitted
  - **TC-003**: testHealthClamping()
    - Given entity with health=50
    - When damage(100) is applied
    - Then health is clamped to 0 (not negative)
  - **TC-004**: testMultipleDamageEvents()
    - Given entity with health=100
    - When damage(30), damage(20), damage(60) applied in sequence
    - Then entity dies after third damage event (total=110)
  - **TC-005**: testNoDamageToDeadEntity()
    - Given entity with health=0 (dead)
    - When damage(10) is applied
    - Then damage is ignored (no negative health)

**Dependencies**: T-003
**Estimated Effort**: 4 hours
**Status**: [ ] Not Started

---

### T-029: Connect Projectile Hits to Damage System

**Description**: Emit damage events when projectiles hit entities

**References**: AC-US2-05 (reduce enemy health), AC-US4-02 (player takes damage)

**Implementation Details**:
- Update CollisionSystem (T-019) to emit damage events on hit
- Damage amount from ProjectileComponent.damage (from config)
- HealthSystem listens for damage events
- Apply damage to hit entity
- Destroy projectile on hit

**Test Plan**:
- **File**: `tests/integration/combat/ProjectileDamage.test.ts`
- **Coverage Target**: 88%
- **Tests**:
  - **TC-001**: testPlayerProjectileDamagesEnemy()
    - Given player projectile (damage=10) hits enemy (health=50)
    - When collision occurs
    - Then enemy health reduces to 40
  - **TC-002**: testEnemyProjectileDamagesPlayer()
    - Given enemy projectile (damage=10) hits player (health=100)
    - When collision occurs
    - Then player health reduces to 90
  - **TC-003**: testProjectileDestroyedOnHit()
    - Given projectile hits enemy
    - When damage is applied
    - Then projectile is destroyed immediately
  - **TC-004**: testKillWithSingleShot()
    - Given enemy with health=10
    - When player projectile (damage=15) hits
    - Then enemy health is 0 and enemy entity is removed

**Dependencies**: T-019, T-028
**Estimated Effort**: 3 hours
**Status**: [ ] Not Started

---

### T-030: Implement Enemy Death Handling

**Description**: Remove enemy from scene when health reaches 0

**References**: AC-US4-07 (enemy removed when health=0)

**Implementation Details**:
- Update HealthSystem to handle entity removal
- On death event:
  - Remove entity from EntityManager
  - Remove mesh from Three.js scene
  - Update kill count (game stats)
  - Check victory condition (all enemies dead)

**Test Plan**:
- **File**: `tests/unit/systems/EnemyDeath.test.ts`
- **Coverage Target**: 87%
- **Tests**:
  - **TC-001**: testEnemyRemovalOnDeath()
    - Given enemy with health=1
    - When enemy takes damage(10)
    - Then enemy entity is removed from EntityManager
  - **TC-002**: testMeshRemovedFromScene()
    - Given enemy mesh in Three.js scene
    - When enemy dies
    - Then enemy mesh is removed from scene
  - **TC-003**: testKillCountIncrement()
    - Given game with killCount=2
    - When enemy dies
    - Then killCount increments to 3
  - **TC-004**: testMultipleEnemyDeaths()
    - Given 3 enemies with low health
    - When all 3 die in quick succession
    - Then all 3 are removed correctly (no race conditions)

**Dependencies**: T-028
**Estimated Effort**: 3 hours
**Status**: [ ] Not Started

---

### T-031: Implement Player Death Handling

**Description**: Trigger game over when player health reaches 0

**References**: AC-US4-04 (player dies at health=0), AC-US6-04 (game over condition)

**Implementation Details**:
- Update HealthSystem to detect player death
- On player death:
  - Set game state to 'gameover'
  - Stop game loop updates
  - Show game over screen
  - Display final stats

**Test Plan**:
- **File**: `tests/unit/systems/PlayerDeath.test.ts`
- **Coverage Target**: 88%
- **Tests**:
  - **TC-001**: testPlayerDeathTriggersGameOver()
    - Given player with health=10
    - When player takes damage(15)
    - Then game state transitions to 'gameover'
  - **TC-002**: testGameLoopStopsOnPlayerDeath()
    - Given player dies
    - When game loop attempts to update
    - Then updates are blocked (game paused)
  - **TC-003**: testFinalStatsCapture()
    - Given player with killCount=5, time=120s
    - When player dies
    - Then final stats (5 kills, 120s) are saved for display

**Dependencies**: T-028
**Estimated Effort**: 3 hours
**Status**: [ ] Not Started

---

### T-032: Implement Enemy Visual Damage Feedback

**Description**: Change enemy color/material when damaged

**References**: AC-US4-06 (visual changes when damaged)

**Implementation Details**:
- Listen for damage events on enemy entities
- On damage:
  - Flash enemy mesh red briefly (0.1 seconds)
  - Return to original color
  - Use material color change (emissive property)
- Alternative: Particle effect on hit (P2 enhancement)

**Test Plan**:
- **File**: `tests/unit/rendering/DamageVisuals.test.ts`
- **Coverage Target**: 80%
- **Tests**:
  - **TC-001**: testEnemyFlashOnDamage()
    - Given enemy mesh with default material
    - When damage event occurs
    - Then mesh emissive color changes to red
  - **TC-002**: testColorResetAfterFlash()
    - Given enemy that took damage
    - When 0.2 seconds pass
    - Then mesh color returns to original
  - **TC-003**: testMultipleDamageFlashes()
    - Given enemy takes 3 hits in quick succession
    - When damage events fire
    - Then flash effect triggers for each hit

**Dependencies**: T-028, T-029
**Estimated Effort**: 2 hours
**Status**: [ ] Not Started

---

### T-033: Load Game Configuration from JSON

**Description**: Load damage values, health, and balance data from config files

**References**: AC-US4-08 (damage values configurable), FR-005 (asset loading)

**Implementation Details**:
- File: `src/data/game-config.json`
  - Player properties: health=100, speed=5, damage=10, fireRate=0.2
  - Enemy properties: health=50, speed=2, damage=10, fireRate=1.0
  - Projectile properties: speed=20, lifetime=5
- File: `src/data/balance.json`
  - AI parameters: detectionRadius=20, attackRange=8, aimVariance=0.1
- Load configs at game initialization
- Apply values to entities on creation

**Test Plan**:
- **File**: `tests/unit/loaders/ConfigLoader.test.ts`
- **Coverage Target**: 85%
- **Tests**:
  - **TC-001**: testGameConfigLoading()
    - Given valid game-config.json file
    - When ConfigLoader.loadGameConfig() is called
    - Then config object matches expected structure
  - **TC-002**: testConfigValuesApplied()
    - Given loaded config with player.health=100
    - When player entity is created
    - Then player HealthComponent.max is 100
  - **TC-003**: testMissingConfigFile()
    - Given config file does not exist
    - When ConfigLoader attempts to load
    - Then error is thrown with helpful message
  - **TC-004**: testInvalidConfigJSON()
    - Given config file with syntax error
    - When ConfigLoader attempts to parse
    - Then error is thrown with line number

**Dependencies**: T-008 (ConfigLoader already created)
**Estimated Effort**: 3 hours
**Status**: [ ] Not Started

---

### T-034: Integration Test - Full Combat System

**Description**: End-to-end test of combat from shooting to death

**References**: AC-US2-05, AC-US4-02, AC-US4-04, AC-US4-07

**Implementation Details**:
- File: `tests/integration/combat/FullCombat.test.ts`
- Simulate player shooting enemy multiple times
- Verify damage application
- Verify enemy death and removal
- Simulate enemy shooting player
- Verify player damage
- Verify player death and game over

**Test Plan**:
- **File**: `tests/integration/combat/FullCombat.test.ts`
- **Coverage Target**: 85%
- **Tests**:
  - **TC-001**: testPlayerKillsEnemy()
    - Given player and enemy with health=50
    - When player shoots 5 times (10 damage each)
    - Then enemy health reaches 0 and enemy is removed
  - **TC-002**: testEnemyKillsPlayer()
    - Given player with health=100 and attacking enemy
    - When enemy shoots 10 times (10 damage each)
    - Then player health reaches 0 and game over occurs
  - **TC-003**: testMutualCombat()
    - Given player and enemy both shooting
    - When both take damage over time
    - Then first to reach 0 health dies (simulate realistic combat)

**Dependencies**: T-028, T-029, T-030, T-031
**Estimated Effort**: 4 hours
**Status**: [ ] Not Started

---

## Phase 6: Game Loop and UI (Days 13-14)

### T-035: Implement Game State Machine

**Description**: State machine for menu, playing, victory, gameover states

**References**: FR-007 (Game State Management), AC-US6-01, AC-US6-04, AC-US6-06

**Implementation Details**:
- File: `src/game/GameState.ts`
- States: menu, playing, victory, gameover
- Transitions:
  - menu → playing (on start button click)
  - playing → victory (all enemies dead)
  - playing → gameover (player health 0)
  - victory/gameover → menu (on restart button)
- Reuse StateMachine base class (T-021)

**Test Plan**:
- **File**: `tests/unit/game/GameState.test.ts`
- **Coverage Target**: 90%
- **Tests**:
  - **TC-001**: testMenuToPlayingTransition()
    - Given game in menu state
    - When start() is called
    - Then state transitions to playing
  - **TC-002**: testVictoryCondition()
    - Given game in playing state with 0 enemies remaining
    - When victory check runs
    - Then state transitions to victory
  - **TC-003**: testGameOverCondition()
    - Given game in playing state with player health=0
    - When game over check runs
    - Then state transitions to gameover
  - **TC-004**: testRestartFromVictory()
    - Given game in victory state
    - When restart() is called
    - Then state transitions to menu and game resets
  - **TC-005**: testNoUpdatesDuringMenu()
    - Given game in menu state
    - When game loop update is called
    - Then gameplay systems do not execute

**Dependencies**: T-021
**Estimated Effort**: 3 hours
**Status**: [ ] Not Started

---

### T-036: Implement HUD (Health, Kills, Timer)

**Description**: HTML overlay displaying player health, kill count, and elapsed time

**References**: AC-US7-01, AC-US7-02, AC-US7-03, AC-US7-04, AC-US7-05

**Implementation Details**:
- File: `src/ui/HUD.ts`
- HTML elements:
  - Health bar (visual bar + text "100/100")
  - Crosshair (CSS fixed center)
  - Kill count ("Kills: 3")
  - Timer ("Time: 02:45")
- Update health on damage event
- Update kills on enemy death event
- Update timer each frame
- CSS styling in `index.html` or separate stylesheet

**Test Plan**:
- **File**: `tests/unit/ui/HUD.test.ts`
- **Coverage Target**: 83%
- **Tests**:
  - **TC-001**: testHealthDisplay()
    - Given player with health=75/100
    - When HUD updates
    - Then health text displays "75/100" and bar is 75% filled
  - **TC-002**: testKillCountUpdate()
    - Given killCount=3
    - When enemy dies (killCount increments)
    - Then HUD displays "Kills: 4"
  - **TC-003**: testTimerFormatting()
    - Given elapsed time 125 seconds
    - When timer updates
    - Then displays "02:05" (mm:ss format)
  - **TC-004**: testCrosshairCentering()
    - Given HUD initialized
    - When window is resized
    - Then crosshair remains centered

**Dependencies**: None
**Estimated Effort**: 3 hours
**Status**: [ ] Not Started

---

### T-037: Implement Menu Screen

**Description**: Start screen with instructions and start button

**References**: AC-US6-01 (start screen with instructions)

**Implementation Details**:
- File: `src/ui/MenuScreen.ts`
- HTML overlay with:
  - Game title
  - Instructions (WASD to move, mouse to aim, click to shoot)
  - "Start Game" button
- Show on game load (state=menu)
- Hide when game starts (state=playing)
- CSS styling for centered layout

**Test Plan**:
- **File**: `tests/unit/ui/MenuScreen.test.ts`
- **Coverage Target**: 80%
- **Tests**:
  - **TC-001**: testMenuVisibility()
    - Given game in menu state
    - When MenuScreen renders
    - Then menu overlay is visible
  - **TC-002**: testStartButtonClick()
    - Given menu screen displayed
    - When "Start Game" button is clicked
    - Then game state transitions to playing
  - **TC-003**: testMenuHideOnStart()
    - Given menu screen visible
    - When game starts
    - Then menu overlay is hidden (display: none)

**Dependencies**: T-035
**Estimated Effort**: 2 hours
**Status**: [ ] Not Started

---

### T-038: Implement Victory Screen

**Description**: Victory screen with stats and restart button

**References**: AC-US6-03 (win when all enemies dead), AC-US6-05 (victory screen with stats)

**Implementation Details**:
- File: `src/ui/VictoryScreen.ts`
- HTML overlay with:
  - "Victory!" message
  - Final stats (kills, time)
  - "Restart" button
- Show when game state = victory
- Restart button triggers game reset

**Test Plan**:
- **File**: `tests/unit/ui/VictoryScreen.test.ts`
- **Coverage Target**: 82%
- **Tests**:
  - **TC-001**: testVictoryScreenDisplay()
    - Given game state transitions to victory
    - When VictoryScreen renders
    - Then victory overlay is visible
  - **TC-002**: testFinalStatsDisplay()
    - Given game ends with killCount=5, time=120s
    - When victory screen shows
    - Then displays "5 Kills" and "02:00"
  - **TC-003**: testRestartButton()
    - Given victory screen displayed
    - When "Restart" button is clicked
    - Then game resets and returns to menu

**Dependencies**: T-035
**Estimated Effort**: 2 hours
**Status**: [ ] Not Started

---

### T-039: Implement Game Over Screen

**Description**: Game over screen with stats and retry button

**References**: AC-US6-04 (lose when health=0), AC-US6-06 (game over screen with retry)

**Implementation Details**:
- File: `src/ui/GameOverScreen.ts`
- HTML overlay with:
  - "Game Over" message
  - Final stats (kills, time survived)
  - "Retry" button
- Show when game state = gameover
- Retry button triggers game reset

**Test Plan**:
- **File**: `tests/unit/ui/GameOverScreen.test.ts`
- **Coverage Target**: 82%
- **Tests**:
  - **TC-001**: testGameOverScreenDisplay()
    - Given player dies (health=0)
    - When GameOverScreen renders
    - Then game over overlay is visible
  - **TC-002**: testRetryButton()
    - Given game over screen displayed
    - When "Retry" button is clicked
    - Then game resets and returns to menu
  - **TC-003**: testStatsDisplayOnGameOver()
    - Given player dies with killCount=2, time=60s
    - When game over screen shows
    - Then displays "2 Kills" and "01:00"

**Dependencies**: T-035
**Estimated Effort**: 2 hours
**Status**: [ ] Not Started

---

### T-040: Implement Game Initialization and Reset

**Description**: Initialize game entities and reset game state on restart

**References**: AC-US6-02 (spawn enemies at start), AC-US6-07 (restart game), AC-US6-08 (kill count and time)

**Implementation Details**:
- File: `src/game/Game.ts`
- Function: initialize()
  - Load all configs (map, game settings, balance)
  - Create scene and renderer
  - Spawn player at center
  - Spawn 3-5 enemies at spawn points
  - Initialize HUD
  - Set game state to menu
- Function: reset()
  - Clear all entities
  - Reset kill count and timer to 0
  - Re-initialize (reuse initialize logic)
  - Return to menu state

**Test Plan**:
- **File**: `tests/unit/game/Game.test.ts`
- **Coverage Target**: 88%
- **Tests**:
  - **TC-001**: testGameInitialization()
    - Given new Game instance
    - When initialize() is called
    - Then player, enemies, and map entities exist
  - **TC-002**: testEnemySpawning()
    - Given map config with 4 spawn points
    - When game initializes
    - Then 4 enemy entities are created
  - **TC-003**: testGameReset()
    - Given completed game (state=victory)
    - When reset() is called
    - Then all entities cleared, killCount=0, time=0
  - **TC-004**: testResetPreservesConfig()
    - Given game with custom config loaded
    - When reset() is called
    - Then config values are preserved (not reloaded)

**Dependencies**: T-008, T-009, T-026, T-033, T-035
**Estimated Effort**: 4 hours
**Status**: [ ] Not Started

---

### T-041: Implement Victory Condition Check

**Description**: Detect when all enemies are dead and trigger victory

**References**: AC-US6-03 (win when all enemies eliminated)

**Implementation Details**:
- Update Game.ts or create VictorySystem
- Each frame, check enemy count
- If enemy count = 0 and game state = playing:
  - Transition to victory state
  - Show victory screen
  - Stop game loop updates

**Test Plan**:
- **File**: `tests/unit/game/VictoryCondition.test.ts`
- **Coverage Target**: 85%
- **Tests**:
  - **TC-001**: testVictoryTrigger()
    - Given game with 1 enemy remaining
    - When last enemy dies
    - Then game state transitions to victory
  - **TC-002**: testNoVictoryWithEnemiesRemaining()
    - Given game with 2 enemies, 1 dies
    - When enemy count checked
    - Then game state remains playing
  - **TC-003**: testVictoryScreenShown()
    - Given victory condition met
    - When state changes to victory
    - Then victory screen becomes visible

**Dependencies**: T-030, T-035, T-038
**Estimated Effort**: 2 hours
**Status**: [ ] Not Started

---

### T-042: Implement Game Loop with requestAnimationFrame

**Description**: Main game loop coordinating system updates and rendering

**References**: NFR-001 (60 FPS), AC-US1-04 (smooth movement)

**Implementation Details**:
- File: `src/game/GameLoop.ts`
- Use requestAnimationFrame for loop
- Calculate deltaTime between frames
- Update systems in correct order (T-001 plan):
  1. InputSystem
  2. AISystem
  3. MovementSystem
  4. CollisionSystem
  5. ProjectileSystem
  6. HealthSystem
  7. RenderSystem
- Track FPS for performance monitoring
- Pause loop when game state is menu, victory, or gameover

**Test Plan**:
- **File**: `tests/unit/game/GameLoop.test.ts`
- **Coverage Target**: 85%
- **Tests**:
  - **TC-001**: testSystemExecutionOrder()
    - Given game loop with all systems registered
    - When update() is called
    - Then systems execute in correct order
  - **TC-002**: testDeltaTimeCalculation()
    - Given two update calls 16ms apart
    - When deltaTime is calculated
    - Then deltaTime is approximately 0.016 seconds
  - **TC-003**: testGameLoopPauseOnMenu()
    - Given game state = menu
    - When game loop update runs
    - Then gameplay systems do not execute
  - **TC-004**: testFPSTracking()
    - Given game loop running for 1 second
    - When FPS is calculated
    - Then FPS is approximately 60

**Dependencies**: T-006, T-007, T-012, T-017, T-023, T-028, T-035
**Estimated Effort**: 4 hours
**Status**: [ ] Not Started

---

### T-043: E2E Test - Full Gameplay Loop

**Description**: Automated end-to-end test of complete game flow

**References**: AC-US6-01 through AC-US6-08

**Implementation Details**:
- File: `tests/e2e/FullGameLoop.spec.ts`
- Use Playwright for browser automation
- Test flow:
  1. Load game (menu screen)
  2. Click start button
  3. Verify game starts (HUD visible)
  4. Simulate player movement (inject keyboard events)
  5. Simulate shooting (inject mouse clicks)
  6. Wait for enemies to die (or player death)
  7. Verify victory or game over screen
  8. Click restart
  9. Verify return to menu

**Test Plan**:
- **File**: `tests/e2e/FullGameLoop.spec.ts`
- **Coverage Target**: 100% (critical path)
- **Tests**:
  - **TC-001**: testCompleteVictoryFlow()
    - Given game loaded in browser
    - When player starts, moves, shoots all enemies
    - Then victory screen appears with correct stats
  - **TC-002**: testGameOverFlow()
    - Given game loaded
    - When player takes damage until health=0
    - Then game over screen appears
  - **TC-003**: testRestartFunctionality()
    - Given game over or victory screen
    - When restart button clicked
    - Then game resets and menu appears

**Dependencies**: T-035, T-036, T-037, T-038, T-039, T-040, T-042
**Estimated Effort**: 5 hours
**Status**: [ ] Not Started

---

## Phase 7: Polish and Optimization (Days 15-16)

### T-044: Performance Profiling and Optimization

**Description**: Profile game performance and optimize bottlenecks to achieve 60 FPS

**References**: NFR-001 (60 FPS), NFR-009 (performance optimization)

**Implementation Details**:
- Add stats.js for real-time FPS monitoring
- Profile with Chrome DevTools Performance tab
- Identify bottlenecks (likely candidates):
  - Collision checks (optimize with spatial partitioning if needed)
  - Draw calls (batch geometry, reuse materials)
  - JavaScript execution (hot path optimization)
- Implement fixes:
  - Object pooling (already done for projectiles)
  - Frustum culling (Three.js automatic)
  - Reduce polygon count if needed
- Target: Sustained 60 FPS with 5 enemies, 10 projectiles

**Test Plan**:
- **File**: `tests/performance/FPSBenchmark.test.ts`
- **Coverage Target**: N/A (performance test)
- **Tests**:
  - **TC-001**: testFPSUnderLoad()
    - Given game with 5 enemies and 10 active projectiles
    - When game runs for 60 seconds
    - Then average FPS >= 58 (allows 2 FPS margin)
  - **TC-002**: testFrameTimeConsistency()
    - Given game loop running
    - When frame times are measured over 1000 frames
    - Then 95th percentile frame time < 20ms
  - **TC-003**: testMemoryStability()
    - Given game running for 5 minutes
    - When heap memory is measured
    - Then no memory leaks (heap stabilizes after initial load)

**Validation**:
- Manual profiling session with Chrome DevTools
- Verify no console warnings/errors
- Test on mid-tier hardware (2019 MacBook Pro equivalent)

**Dependencies**: T-042
**Estimated Effort**: 6 hours
**Status**: [ ] Not Started

---

### T-045: Cross-Browser Testing and Compatibility

**Description**: Test game on all target browsers and fix compatibility issues

**References**: NFR-002 (browser compatibility)

**Implementation Details**:
- Test browsers: Chrome, Firefox, Safari, Edge (latest 2 versions)
- Test scenarios:
  - Game loads without errors
  - Pointer Lock works correctly
  - WebGL rendering matches expected
  - Input handling works (keyboard + mouse)
  - Performance acceptable (FPS >= 55)
- Fix any browser-specific issues:
  - Vendor prefixes (if needed)
  - Pointer Lock API differences
  - Audio context (if P3 audio added)
- Add WebGL feature detection and fallback message

**Test Plan**: N/A (manual testing task)

**Validation**:
- [ ] Chrome 118+ passes all tests
- [ ] Firefox 118+ passes all tests
- [ ] Safari 16+ passes all tests
- [ ] Edge 118+ passes all tests
- [ ] Fallback message shown on WebGL unsupported browsers

**Dependencies**: T-042, T-043
**Estimated Effort**: 4 hours
**Status**: [ ] Not Started

---

### T-046: Code Quality and Documentation

**Description**: Clean up code, add JSDoc comments, fix linting errors

**References**: NFR-003 (code quality), NFR-004 (maintainability)

**Implementation Details**:
- Run ESLint and fix all errors/warnings
- Add JSDoc comments to all public functions
- Add TypeScript type annotations where missing
- Remove console.log statements (use logger if needed)
- Organize imports (consistent ordering)
- Add README.md with:
  - Installation instructions
  - Development setup
  - Build commands
  - Game controls
  - Architecture overview
- Verify TypeScript strict mode compiles with 0 errors

**Test Plan**: N/A (code quality task)

**Validation**:
- [ ] ESLint reports 0 errors, 0 warnings
- [ ] TypeScript compiles with 0 errors (strict mode)
- [ ] All public APIs have JSDoc comments
- [ ] README.md covers installation, usage, architecture
- [ ] No console errors in production build

**Dependencies**: All previous tasks
**Estimated Effort**: 4 hours
**Status**: [ ] Not Started

---

### T-047: Final Acceptance Criteria Validation

**Description**: Manual checklist validation of all 44 acceptance criteria

**References**: All AC-US1-01 through AC-US7-05

**Implementation Details**:
- Create validation checklist (tests.md)
- Manually test each acceptance criterion
- Record pass/fail status
- Fix any failing criteria
- Document any known issues or limitations

**Test Plan**: N/A (validation task)

**Validation Checklist**:

**Player Movement (AC-US1-01 to AC-US1-05)**:
- [ ] AC-US1-01: Player moves forward/backward with W/S or Arrow keys
- [ ] AC-US1-02: Player strafes left/right with A/D or Arrow keys
- [ ] AC-US1-03: Camera rotates with mouse (first-person view)
- [ ] AC-US1-04: Movement smooth at 60 FPS (no stuttering)
- [ ] AC-US1-05: Player cannot move through walls or boundaries

**Shooting Mechanics (AC-US2-01 to AC-US2-06)**:
- [ ] AC-US2-01: Player shoots by clicking left mouse button
- [ ] AC-US2-02: Projectiles travel in straight line from aim direction
- [ ] AC-US2-03: Projectiles have visible geometry
- [ ] AC-US2-04: Hit detection uses ray-sphere collision
- [ ] AC-US2-05: Successful hits reduce enemy health
- [ ] AC-US2-06: Shooting has cooldown (0.2s between shots)

**Enemy AI Behavior (AC-US3-01 to AC-US3-08)**:
- [ ] AC-US3-01: Enemies spawn at predefined locations
- [ ] AC-US3-02: Enemies detect player within detection radius (20 units)
- [ ] AC-US3-03: Enemies pursue player (move toward player)
- [ ] AC-US3-04: Enemies maintain minimum distance (8 units) before shooting
- [ ] AC-US3-05: Enemies shoot projectiles at player with accuracy variance
- [ ] AC-US3-06: Enemies avoid obstacles (basic collision avoidance)
- [ ] AC-US3-07: Enemy fire rate balanced (1 shot per second)
- [ ] AC-US3-08: Enemies have idle, chase, attack, dead states

**Damage and Health System (AC-US4-01 to AC-US4-08)**:
- [ ] AC-US4-01: Player starts with 100 health points
- [ ] AC-US4-02: Enemy hits reduce player health by defined amount (10 HP)
- [ ] AC-US4-03: Player health displayed in HUD
- [ ] AC-US4-04: Player dies when health reaches 0 (game over)
- [ ] AC-US4-05: Enemies have 50 health points
- [ ] AC-US4-06: Enemy visual changes when damaged (color flash)
- [ ] AC-US4-07: Enemies removed when health reaches 0
- [ ] AC-US4-08: Damage values configurable via JSON

**Arena Map (AC-US5-01 to AC-US5-06)**:
- [ ] AC-US5-01: Arena is 50x50 units bounded area
- [ ] AC-US5-02: Arena has visible floor with texture
- [ ] AC-US5-03: Arena has perimeter walls that block movement
- [ ] AC-US5-04: Arena includes 3-5 obstacle objects for cover
- [ ] AC-US5-05: Lighting illuminates scene adequately
- [ ] AC-US5-06: Map geometry defined in local JSON file

**Game Loop and Win Conditions (AC-US6-01 to AC-US6-08)**:
- [ ] AC-US6-01: Game starts with start screen showing instructions
- [ ] AC-US6-02: Game spawns 3-5 enemies at start
- [ ] AC-US6-03: Player wins when all enemies eliminated
- [ ] AC-US6-04: Player loses when health reaches 0
- [ ] AC-US6-05: Victory screen displays win message and stats
- [ ] AC-US6-06: Game over screen displays loss message and retry option
- [ ] AC-US6-07: Player can restart game from victory/game over screen
- [ ] AC-US6-08: Game maintains kill count and elapsed time

**HUD and UI Elements (AC-US7-01 to AC-US7-05)**:
- [ ] AC-US7-01: HUD displays current health (numerical or bar)
- [ ] AC-US7-02: HUD displays crosshair at screen center
- [ ] AC-US7-03: HUD shows kill count (enemies eliminated)
- [ ] AC-US7-04: HUD shows elapsed game time
- [ ] AC-US7-05: UI elements rendered as HTML overlay (not 3D text)

**Dependencies**: All previous tasks
**Estimated Effort**: 3 hours
**Status**: [ ] Not Started

---

## Summary

**Total Tasks**: 47
**Estimated Total Effort**: ~160 hours (2-3 weeks for single developer)

**Phase Breakdown**:
- Phase 1 (Foundation): 10 tasks, ~30 hours
- Phase 2 (Collision): 4 tasks, ~14 hours
- Phase 3 (Shooting): 6 tasks, ~21 hours
- Phase 4 (Enemy AI): 7 tasks, ~27 hours
- Phase 5 (Combat): 7 tasks, ~25 hours
- Phase 6 (Game Loop): 9 tasks, ~29 hours
- Phase 7 (Polish): 4 tasks, ~17 hours

**Coverage Target**: 85% overall
- Unit tests: 85-95% per module
- Integration tests: 80-88% per system
- E2E tests: 100% critical path

**Test Distribution**:
- Unit tests: ~30 test files
- Integration tests: ~10 test files
- E2E tests: 1 comprehensive test file

**Next Steps**:
1. Review and approve tasks.md
2. Begin implementation with Phase 1 (Foundation)
3. Follow TDD workflow: Write tests → Implement → Refactor
4. Run `/specweave:progress` to track completion
5. Run `/specweave:validate` before marking increment complete
