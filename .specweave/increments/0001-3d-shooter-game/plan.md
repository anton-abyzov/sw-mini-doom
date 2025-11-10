---
increment: 0001-3d-shooter-game
title: "3D WebGL Shooter Game - Implementation Plan"
architecture_docs:
  - ../../docs/internal/architecture/system-design.md
  - ../../docs/internal/architecture/adr/0001-threejs-rendering-approach.md
  - ../../docs/internal/architecture/adr/0002-collision-detection-strategy.md
  - ../../docs/internal/architecture/adr/0003-entity-component-system.md
  - ../../docs/internal/architecture/adr/0004-ai-state-machine.md
  - ../../docs/internal/architecture/adr/0005-asset-loading-strategy.md
---

# Implementation Plan: 3D WebGL Shooter Game

**Increment**: 0001
**Status**: Planned
**Estimated Duration**: 2-3 weeks
**Complexity**: Medium

---

## Architecture Overview

**Complete System Design**: [System Design Document](../../docs/internal/architecture/system-design.md)

This implementation follows an **Entity Component System (ECS)** architecture with **7 core systems** executing in a defined order each frame. The game uses **Three.js** for rendering, **AABB + ray-sphere** collision detection, and a **finite state machine** for enemy AI.

---

## Key Architecture Decisions

All technical decisions are documented in Architecture Decision Records (ADRs):

### Rendering Architecture
- [ADR-0001: Three.js Rendering Approach](../../docs/internal/architecture/adr/0001-threejs-rendering-approach.md)
  - **Decision**: Use Three.js r150+ with WebGLRenderer, PerspectiveCamera, and MeshStandardMaterial
  - **Why**: Proven performance, excellent documentation, achieves 60 FPS target with <500KB bundle
  - **Trade-off**: Must manually implement game-specific features (no built-in entity system)

### Collision Detection
- [ADR-0002: Collision Detection Strategy](../../docs/internal/architecture/adr/0002-collision-detection-strategy.md)
  - **Decision**: Hybrid approach - AABB for entity-wall, ray-sphere for projectiles
  - **Why**: Simple, fast enough for our scale (20 entities, 9 walls), no physics engine needed
  - **Trade-off**: No realistic physics, possible tunneling at very high speeds (mitigated)

### Entity Management
- [ADR-0003: Entity Component System Architecture](../../docs/internal/architecture/adr/0003-entity-component-system.md)
  - **Decision**: Lightweight ECS with components as data, systems as logic
  - **Why**: Modular, testable, flexible (add behaviors without inheritance)
  - **Trade-off**: More boilerplate than OOP, component lookup overhead (acceptable)

### Enemy AI
- [ADR-0004: AI State Machine Design](../../docs/internal/architecture/adr/0004-ai-state-machine.md)
  - **Decision**: Finite State Machine with 4 states (idle, chase, attack, dead)
  - **Why**: Simple to implement (~150 LOC), predictable, debuggable
  - **Trade-off**: No advanced tactics (cover, flanking) - deferred to future increments

### Configuration
- [ADR-0005: Asset Loading Strategy](../../docs/internal/architecture/adr/0005-asset-loading-strategy.md)
  - **Decision**: JSON-based configuration for game balance and map layout
  - **Why**: Data-driven design, easy tuning without recompilation, version control friendly
  - **Trade-off**: No schema validation (could add Zod), runtime errors only

---

## Technology Stack Summary

| Category | Technology | Version | Justification (See ADRs) |
|----------|-----------|---------|--------------------------|
| **Language** | TypeScript | 5.0+ | Type safety, tooling, industry standard |
| **3D Engine** | Three.js | r150+ | [ADR-0001](../../docs/internal/architecture/adr/0001-threejs-rendering-approach.md) |
| **Build Tool** | Vite | 4.0+ | Fast HMR, Rollup bundling, simple config |
| **Testing** | Vitest | Latest | Vite-native, fast, Jest-compatible API |
| **E2E** | Playwright | Latest | Cross-browser automation, reliable |
| **Linting** | ESLint | Latest | TypeScript rules, code quality enforcement |

**Browser Requirements**:
- WebGL 2.0 support
- Pointer Lock API
- ES2020+ JavaScript features
- Target: Chrome, Firefox, Safari, Edge (latest 2 versions)

---

## Component Architecture Breakdown

### Entity Components (8 Types)

All component definitions in `src/components/`:

1. **PositionComponent**: `position: Vector3, rotation: Euler`
2. **VelocityComponent**: `velocity: Vector3, speed: number`
3. **HealthComponent**: `current: number, max: number`
4. **MeshComponent**: `mesh: THREE.Mesh` (reference to 3D object)
5. **AIComponent**: `state, detectionRadius, attackRange, target, accuracy`
6. **ShooterComponent**: `damage, cooldown, lastShotTime`
7. **ProjectileComponent**: `owner, lifetime, age`
8. **ColliderComponent**: `shape ('aabb' | 'sphere'), radius, size`

**Design Pattern**: Pure data structures (no methods, minimal logic)

### Systems (7 Core Systems)

Execution order (critical for correct game logic):

```
1. InputSystem       → Process keyboard/mouse
2. AISystem          → Update enemy state machines
3. MovementSystem    → Apply velocities to positions
4. CollisionSystem   → Detect/resolve collisions
5. ProjectileSystem  → Manage projectile lifecycle
6. HealthSystem      → Apply damage, check deaths
7. RenderSystem      → Sync Three.js scene with entity state
```

**Why this order?** See [System Design - System Execution Order](../../docs/internal/architecture/system-design.md#system-execution-order)

---

## File Structure and Organization

```
src/
├── main.ts                        # Entry point, game initialization
├── game/
│   ├── Game.ts                    # Main game controller
│   ├── GameLoop.ts                # requestAnimationFrame loop
│   └── GameState.ts               # State machine (menu, playing, gameover)
│
├── ecs/                           # Entity Component System core
│   ├── Entity.ts                  # Entity interface, ID generation
│   ├── Component.ts               # Component base types
│   ├── EntityManager.ts           # Create, destroy, query entities
│   └── SystemManager.ts           # Register and update systems
│
├── systems/                       # Game logic systems
│   ├── InputSystem.ts             # Keyboard/mouse → velocity
│   ├── AISystem.ts                # Enemy state machine updates
│   ├── MovementSystem.ts          # position += velocity * dt
│   ├── CollisionSystem.ts         # AABB + ray-sphere detection
│   ├── ProjectileSystem.ts        # Spawn, update, destroy projectiles
│   ├── HealthSystem.ts            # Damage application, death handling
│   └── RenderSystem.ts            # Sync Three.js meshes
│
├── components/                    # Component definitions
│   ├── PositionComponent.ts
│   ├── VelocityComponent.ts
│   ├── HealthComponent.ts
│   ├── MeshComponent.ts
│   ├── AIComponent.ts
│   ├── ShooterComponent.ts
│   ├── ProjectileComponent.ts
│   └── ColliderComponent.ts
│
├── rendering/                     # Three.js abstraction
│   ├── SceneManager.ts            # Setup scene, lights, camera
│   ├── MeshFactory.ts             # Create player/enemy/projectile meshes
│   └── MaterialLibrary.ts         # Shared materials (reduce draw calls)
│
├── collision/                     # Collision algorithms
│   ├── AABB.ts                    # Axis-aligned bounding box checks
│   ├── RaySphere.ts               # Ray-sphere intersection math
│   └── CollisionResolver.ts       # Move entity back, stop velocity
│
├── ai/                            # Enemy AI logic
│   ├── StateMachine.ts            # FSM base class
│   └── EnemyAI.ts                 # Idle, chase, attack, dead states
│
├── data/                          # JSON configuration files
│   ├── game-config.json           # Player/enemy/projectile properties
│   ├── map-arena-01.json          # Map walls, obstacles, spawn points
│   └── balance.json               # AI parameters, combat tuning
│
├── loaders/                       # Asset loading utilities
│   ├── ConfigLoader.ts            # Fetch and parse JSON files
│   └── types.ts                   # TypeScript interfaces for configs
│
└── ui/                            # HTML/CSS UI layer
    ├── HUD.ts                     # Health, kills, timer display
    └── MenuScreen.ts              # Start screen, game over, victory
```

**Total Estimated Files**: ~35 TypeScript files + 3 JSON files + 1 HTML + 1 CSS

---

## Implementation Phases

### Phase 1: Foundation (Days 1-3)

**Goal**: Render a basic scene with player movement

**Tasks**:
1. Project setup (Vite + TypeScript + Three.js)
2. Implement ECS core (Entity, Component, EntityManager, SystemManager)
3. Create SceneManager (Three.js scene, camera, renderer, lights)
4. Implement InputSystem (keyboard/mouse handling, Pointer Lock)
5. Implement MovementSystem (basic WASD movement)
6. Create player entity with Position, Velocity, Mesh components
7. Load map-arena-01.json and render floor + walls

**Validation**:
- Player can move with WASD keys
- Camera rotates with mouse (first-person view)
- Floor and walls visible in scene
- FPS counter shows 60 FPS

**Test Coverage**:
- EntityManager create/destroy/query (unit test)
- SystemManager system registration (unit test)
- InputSystem key mapping (unit test)

---

### Phase 2: Collision and Physics (Days 4-5)

**Goal**: Prevent player from walking through walls

**Tasks**:
1. Implement AABB collision detection (AABB.ts)
2. Implement CollisionSystem (check player vs walls)
3. Implement CollisionResolver (move player back to valid position)
4. Add ColliderComponent to player and walls
5. Test collision edge cases (corners, multiple walls)

**Validation**:
- Player stops at walls (cannot pass through)
- Player can walk along walls smoothly (no jitter)
- Collision system uses <0.5ms per frame

**Test Coverage**:
- AABB intersection algorithm (unit test with known cases)
- Collision resolution correctness (unit test)
- Edge case: player stuck in corner (manual test)

---

### Phase 3: Shooting and Projectiles (Days 6-7)

**Goal**: Player can shoot projectiles

**Tasks**:
1. Implement ProjectileSystem (spawn, update, destroy)
2. Add ShooterComponent to player
3. Implement object pooling for projectiles
4. Create projectile mesh (small sphere/cylinder)
5. Implement ray-sphere collision (RaySphere.ts)
6. ProjectileSystem checks hits against walls (destroy on impact)

**Validation**:
- Left-click spawns projectile in aim direction
- Projectiles travel in straight line at constant speed
- Projectiles destroyed after 5 seconds or wall hit
- Object pool reuses projectiles (no memory leaks)

**Test Coverage**:
- ProjectileSystem spawn logic (unit test)
- Object pooling create/reuse/destroy (unit test)
- Ray-sphere intersection math (unit test)

---

### Phase 4: Enemy AI (Days 8-10)

**Goal**: Enemies spawn, detect player, and chase

**Tasks**:
1. Implement StateMachine base class (ai/StateMachine.ts)
2. Implement EnemyAI with 4 states (idle, chase, attack, dead)
3. Create AISystem (update enemy state machines each frame)
4. Add AIComponent to enemies
5. Load enemy spawn points from map-arena-01.json
6. Create enemy entities (5 total)
7. Implement obstacle avoidance (raycast ahead, turn if blocked)

**Validation**:
- Enemies spawn at map locations
- Enemies detect player when within 20 units
- Enemies chase player (move toward player position)
- Enemies avoid obstacles (basic raycasting)
- Enemies transition to attack state at 8 units

**Test Coverage**:
- FSM state transitions (unit test with mock entities)
- Detection radius logic (unit test)
- Obstacle avoidance raycast (integration test)

---

### Phase 5: Combat System (Days 11-12)

**Goal**: Player and enemies can damage each other

**Tasks**:
1. Implement HealthSystem (apply damage, check death)
2. Add HealthComponent to player and enemies
3. Extend ProjectileSystem to apply damage on hit
4. Implement enemy shooting (spawn projectiles in attack state)
5. Implement death handling (remove entity, update game state)
6. Add visual feedback (enemy color changes when hit)

**Validation**:
- Player projectiles damage enemies (health reduces)
- Enemy projectiles damage player (health reduces)
- Enemies die when health reaches 0 (removed from scene)
- Player dies when health reaches 0 (game over state)
- Damage values match game-config.json

**Test Coverage**:
- HealthSystem damage application (unit test)
- Death condition logic (unit test)
- Projectile hit detection (integration test)

---

### Phase 6: Game Loop and UI (Days 13-14)

**Goal**: Complete game flow from start to end

**Tasks**:
1. Implement GameState state machine (menu, playing, gameover, victory)
2. Create HUD (health bar, kill count, timer)
3. Create MenuScreen (start button, instructions)
4. Create GameOver screen (retry button, final stats)
5. Create Victory screen (congratulations, stats)
6. Implement game initialization (load configs, create entities)
7. Implement victory condition (all enemies dead)
8. Implement game over condition (player health 0)
9. Implement restart functionality

**Validation**:
- Game starts with menu screen
- Clicking "Start" begins gameplay
- HUD displays current health, kills, time
- Killing all enemies shows victory screen
- Player death shows game over screen
- Restart button resets game state correctly

**Test Coverage**:
- GameState transitions (unit test)
- Victory condition logic (unit test)
- UI component rendering (Playwright E2E test)

---

### Phase 7: Polish and Optimization (Days 15-16)

**Goal**: 60 FPS performance and code quality

**Tasks**:
1. Profile with Chrome DevTools (identify bottlenecks)
2. Optimize hottest code paths (if FPS < 60)
3. Implement performance monitoring (stats.js)
4. Add error handling (config loading, WebGL context loss)
5. Cross-browser testing (Chrome, Firefox, Safari, Edge)
6. Code review (clean up, add JSDoc comments)
7. Achieve >80% test coverage
8. Fix all ESLint errors/warnings

**Validation**:
- 60 FPS sustained with 5 enemies, 10 projectiles (Chrome profiler)
- Bundle size < 500KB gzipped (Vite build output)
- Zero TypeScript errors (strict mode)
- Zero critical ESLint errors
- All 44 acceptance criteria pass (manual checklist)

**Test Coverage**:
- Full integration test (spawn, play, win scenario)
- Performance test (measure FPS under load)
- Cross-browser compatibility (manual testing on 4 browsers)

---

## Technical Challenges and Solutions

### Challenge 1: Pointer Lock API Reliability

**Problem**: Pointer Lock sometimes fails to activate (browser security, user gesture required)

**Solution**:
- Only request pointer lock on user click (not on page load)
- Show "Click to start" instruction before locking
- Handle `pointerlockerror` event (show error message)
- Provide fallback: ESC key exits pointer lock gracefully

**Reference**: MDN Pointer Lock API - https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API

---

### Challenge 2: Object Pooling Implementation

**Problem**: Creating/destroying projectiles every frame causes garbage collection spikes

**Solution**:
- Pre-allocate pool of 20 projectile entities at startup
- Mark projectiles as `isActive: false` instead of destroying
- Reuse inactive projectiles when spawning new ones
- Only iterate over active projectiles in systems

**Implementation**:
```typescript
class ProjectilePool {
  private pool: Entity[] = [];
  private poolSize = 20;

  constructor() {
    for (let i = 0; i < this.poolSize; i++) {
      this.pool.push(this.createProjectile());
    }
  }

  spawn(position: Vector3, direction: Vector3): Entity {
    const projectile = this.pool.find(p => !p.isActive);
    if (!projectile) return null; // Pool exhausted

    projectile.isActive = true;
    projectile.position.copy(position);
    projectile.velocity.copy(direction.multiplyScalar(20));
    projectile.age = 0;
    return projectile;
  }

  destroy(projectile: Entity) {
    projectile.isActive = false; // Reuse later
  }
}
```

---

### Challenge 3: AI Obstacle Avoidance

**Problem**: Enemies get stuck on obstacles when chasing player

**Solution**:
- Raycast ahead in movement direction (2 units distance)
- If obstacle detected, turn 90 degrees and try again
- Limit avoidance attempts to 2 per frame (prevent infinite loop)
- Accept that AI might get stuck occasionally (arcade game tolerance)

**Future Enhancement** (P2): Implement simple A* pathfinding or navmesh

---

### Challenge 4: Collision Jitter at Walls

**Problem**: Player vibrates/jitters when standing still against wall

**Solution**:
- Add small epsilon (0.01 units) when resolving collision
- Zero velocity on collision (no residual movement)
- Clamp position updates to avoid floating-point drift

**Implementation**:
```typescript
function resolveCollision(entity: Entity, wall: Wall) {
  // ... calculate overlap ...

  entity.position.x += overlapX + 0.01 * Math.sign(overlapX); // Epsilon
  entity.velocity.set(0, 0, 0); // Stop completely
}
```

---

## Test Strategy

### Unit Tests (Vitest)

**Target Coverage**: >80% of game logic (excluding rendering)

**Critical Modules to Test**:
1. **EntityManager**: Create, destroy, query operations
2. **Collision Algorithms**: AABB and ray-sphere math
3. **AI State Machine**: State transitions, detection logic
4. **ProjectileSystem**: Spawn, pool reuse, lifetime
5. **HealthSystem**: Damage application, death conditions

**Example Test**:
```typescript
describe('AABB Collision', () => {
  it('should detect intersection when boxes overlap', () => {
    const box1 = { min: new Vector3(0, 0, 0), max: new Vector3(2, 2, 2) };
    const box2 = { min: new Vector3(1, 1, 1), max: new Vector3(3, 3, 3) };
    expect(checkAABBCollision(box1, box2)).toBe(true);
  });

  it('should not detect intersection when boxes separated', () => {
    const box1 = { min: new Vector3(0, 0, 0), max: new Vector3(1, 1, 1) };
    const box2 = { min: new Vector3(2, 2, 2), max: new Vector3(3, 3, 3) };
    expect(checkAABBCollision(box1, box2)).toBe(false);
  });
});
```

---

### Integration Tests (Vitest)

**Scenarios to Test**:
1. **Player shoots enemy**: Spawns projectile → Hits enemy → Enemy health reduces → Enemy dies
2. **Enemy chases player**: Player enters range → Enemy state = chase → Enemy moves toward player
3. **Collision resolution**: Player walks into wall → Position corrected → Velocity zeroed
4. **Game state flow**: Start menu → Playing → Victory → Restart

---

### End-to-End Tests (Playwright)

**Critical User Flows**:
1. **Full gameplay loop**:
   - Load game → Click start → Move player → Shoot enemies → All enemies dead → Victory screen → Restart
2. **Game over scenario**:
   - Load game → Start → Take damage from enemy → Health reaches 0 → Game over screen
3. **Performance test**:
   - Play for 60 seconds → Measure FPS → Assert FPS > 55

**Example E2E Test**:
```typescript
test('should complete full game loop', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Start game
  await page.click('button:has-text("Start")');

  // Wait for game to load
  await page.waitForSelector('#hud');

  // Simulate shooting (click multiple times)
  for (let i = 0; i < 10; i++) {
    await page.click('canvas');
    await page.waitForTimeout(200);
  }

  // Check for victory screen (might need longer timeout in real test)
  await page.waitForSelector('text=Victory', { timeout: 30000 });

  // Click restart
  await page.click('button:has-text("Restart")');
  await page.waitForSelector('#hud'); // Back to game
});
```

---

### Performance Tests

**Benchmarks to Run**:
1. **Frame rate stability**: Play for 60 seconds, measure min/avg/max FPS
2. **Memory usage**: Check for memory leaks (heap should stabilize)
3. **Load time**: Measure time from page load to first render
4. **Bundle size**: Verify gzipped output < 500KB

**Tools**:
- `stats.js` for real-time FPS monitoring
- Chrome DevTools Performance tab for profiling
- Lighthouse audit for load performance

---

## Performance Optimization Checklist

Before marking increment complete, validate performance:

- [ ] **FPS**: Sustained 60 FPS with 5 enemies, 10 projectiles (Chrome Performance tab)
- [ ] **Frame Time**: <16.67ms per frame (stats.js)
- [ ] **Load Time**: <3 seconds on 50 Mbps connection (Lighthouse)
- [ ] **Bundle Size**: <500KB gzipped (`npm run build` output)
- [ ] **Memory**: No leaks, heap stable after 5 minutes (Chrome Memory profiler)
- [ ] **Draw Calls**: <50 per frame (Three.js renderer info)
- [ ] **Triangles**: <10,000 total in scene (Three.js renderer info)

---

## Acceptance Criteria Validation

All **44 acceptance criteria** from [SPEC-0001](../../docs/internal/specs/spec-0001-3d-shooter-game.md) must pass before increment completion.

**Validation Method**:
- AC-US1-01 through AC-US1-05: Manual testing (player movement)
- AC-US2-01 through AC-US2-06: Manual testing (shooting mechanics)
- AC-US3-01 through AC-US3-08: Manual testing + unit tests (enemy AI)
- AC-US4-01 through AC-US4-08: Manual testing + unit tests (health system)
- AC-US5-01 through AC-US5-06: Manual testing (map rendering)
- AC-US6-01 through AC-US6-08: E2E test (full game loop)
- AC-US7-01 through AC-US7-05: Manual testing (HUD display)

**Checklist Template**: Will be created in [tests.md](./tests.md)

---

## Risks and Mitigation

### Risk 1: Performance on Low-End Hardware
**Probability**: Medium
**Impact**: High (game unplayable if <30 FPS)

**Mitigation**:
- Profile early and often (day 5, 10, 15)
- Implement object pooling (day 7)
- Keep polygon count low (<10K triangles)
- Add quality settings if needed (P2 feature: low/medium/high)

---

### Risk 2: Browser Compatibility Issues
**Probability**: Medium
**Impact**: Medium (some users can't play)

**Mitigation**:
- Test on all 4 target browsers weekly
- Use WebGL feature detection (fallback to error message)
- Avoid browser-specific APIs (use standard Web APIs only)
- Check caniuse.com before using new browser features

---

### Risk 3: Scope Creep (Adding P2/P3 Features Early)
**Probability**: High (common in game development)
**Impact**: Medium (delays MVP launch)

**Mitigation**:
- Strict adherence to P1 features only
- Defer all "nice-to-have" ideas to future increments
- Use feature flags for experimental features (disabled by default)
- Regular scope review (day 7, 14)

---

## Next Steps After Increment Completion

1. **Deploy to GitHub Pages**: Test live deployment
2. **Gather Feedback**: Share with 5-10 testers, collect feedback
3. **Plan Increment 0002**: Based on feedback, prioritize P2/P3 features
4. **Write Postmortem**: Document what went well, what to improve

**Potential Increment 0002 Features**:
- Audio system (P3: sound effects, music)
- HUD improvements (P2: minimap, enemy health bars)
- Advanced AI (P2: cover system, flanking)
- Multiple enemy types (P2: melee, tank, sniper)

---

## References

**Architecture Documentation**:
- [System Design Document](../../docs/internal/architecture/system-design.md)
- [All ADRs](../../docs/internal/architecture/adr/)

**Specifications**:
- [SPEC-0001: 3D Shooter Game](../../docs/internal/specs/spec-0001-3d-shooter-game.md)
- [Strategy Overview](../../docs/internal/strategy/3d-shooter/overview.md)

**External Resources**:
- Three.js Documentation: https://threejs.org/docs/
- Game Programming Patterns: http://gameprogrammingpatterns.com/
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- Vite Documentation: https://vitejs.dev/

---

**Plan Approval**:
- Tech Lead: _____________ Date: _______
- QA Lead: _____________ Date: _______

**Version History**:
- v1.0 (2025-11-09): Initial implementation plan created
