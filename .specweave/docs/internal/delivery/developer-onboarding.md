# Developer Onboarding Guide

**Welcome to sw-mini-doom!**

This guide will get you from zero to productive contribution in ~30 minutes.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Project Structure](#project-structure)
5. [Development Workflow](#development-workflow)
6. [Architecture at a Glance](#architecture-at-a-glance)
7. [Testing](#testing)
8. [Common Tasks](#common-tasks)
9. [Debugging](#debugging)
10. [Next Steps](#next-steps)

---

## Project Overview

**What is this?**
A browser-based 3D first-person shooter game built with Three.js and TypeScript.

**Key Features**:
- First-person movement with mouse look
- Shooting mechanics with projectiles
- AI-controlled enemies with state machine behavior
- Health system with damage calculations
- Arena-based gameplay with obstacles
- Victory/game over conditions

**Tech Stack**:
- **Language**: TypeScript 5.0+ (strict mode)
- **3D Engine**: Three.js r150+
- **Architecture**: Entity Component System (ECS)
- **Build Tool**: Vite 4.0+
- **Testing**: Vitest (unit), Playwright (E2E)
- **Deployment**: GitHub Pages (static hosting)

**Performance Targets**:
- 60 FPS sustained with 5 enemies, 10 projectiles
- Initial load time < 3 seconds
- Bundle size < 500 KB gzipped

**Project Philosophy**:
- Specification-first (SpecWeave framework)
- Test-driven development
- Clean, modular code
- Performance-conscious

---

## Prerequisites

### Required
- **Node.js**: v18.0+ (LTS recommended)
- **npm**: v9.0+ (comes with Node.js)
- **Git**: Any recent version
- **Modern Browser**: Chrome, Firefox, Safari, or Edge (latest 2 versions)

### Optional (Recommended)
- **VS Code**: With TypeScript, ESLint extensions
- **GitHub CLI**: `gh` for PR management
- **Chrome DevTools**: For debugging and profiling

### Check Your Setup
```bash
node --version   # Should be v18.0+
npm --version    # Should be v9.0+
git --version    # Any recent version
```

---

## Quick Start

### 1. Clone and Install
```bash
# Clone the repository
git clone https://github.com/your-org/sw-mini-doom.git
cd sw-mini-doom

# Install dependencies
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### 3. Run Tests
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Linting
npm run lint
```

### 4. Build for Production
```bash
npm run build
```

**That's it!** You're ready to develop.

---

## Project Structure

```
sw-mini-doom/
│
├── src/                        # Source code
│   ├── main.ts                 # Entry point
│   ├── Game.ts                 # Main game orchestrator
│   │
│   ├── ecs/                    # Entity Component System
│   │   ├── Entity.ts           # Entity class (ID + components)
│   │   ├── Component.ts        # Component base types
│   │   ├── System.ts           # System base class
│   │   ├── World.ts            # Entity/system manager
│   │   └── index.ts
│   │
│   ├── components/             # ECS Components (data)
│   │   ├── PositionComponent.ts
│   │   ├── VelocityComponent.ts
│   │   ├── HealthComponent.ts
│   │   ├── AIComponent.ts
│   │   ├── ShooterComponent.ts
│   │   ├── ProjectileComponent.ts
│   │   ├── ColliderComponent.ts
│   │   ├── MeshComponent.ts
│   │   └── index.ts
│   │
│   ├── systems/                # ECS Systems (logic)
│   │   ├── InputSystem.ts      # Keyboard/mouse input
│   │   ├── AISystem.ts         # Enemy AI behavior
│   │   ├── MovementSystem.ts   # Apply velocities to positions
│   │   ├── CollisionSystem.ts  # Detect and resolve collisions
│   │   ├── ProjectileSystem.ts # Projectile lifecycle
│   │   └── index.ts
│   │
│   ├── entities/               # Entity creation
│   │   └── EntityFactory.ts    # Factory for player, enemies, etc.
│   │
│   ├── collision/              # Collision detection
│   │   └── CollisionUtils.ts   # AABB, ray-sphere algorithms
│   │
│   └── (future: rendering/, ui/, ai/, loaders/, data/)
│
├── public/                     # Static assets
│   ├── index.html
│   └── data/
│       └── game-config.json    # Game configuration
│
├── tests/                      # Tests
│   ├── unit/                   # Vitest unit tests
│   └── e2e/                    # Playwright E2E tests
│
├── .specweave/                 # SpecWeave documentation
│   ├── docs/                   # Permanent docs (strategy, architecture, specs)
│   └── increments/             # Temporary increment work (spec, plan, tasks)
│
├── dist/                       # Build output (gitignored)
│
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite build configuration
└── README.md                   # Project README
```

---

## Development Workflow

### Standard Workflow

1. **Pull latest changes**
   ```bash
   git pull origin develop
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes**
   - Edit code in `src/`
   - Add tests in `tests/`
   - Update docs if needed

4. **Test your changes**
   ```bash
   npm test              # Unit tests
   npm run lint          # Linting
   npm run build         # Ensure it builds
   ```

5. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   # Then create PR on GitHub
   ```

### SpecWeave Workflow (Recommended)

For larger features, use SpecWeave:

1. **Plan increment**
   ```bash
   /specweave:increment "feature description"
   ```
   This creates spec, plan, and tasks in `.specweave/increments/####/`

2. **Execute tasks**
   ```bash
   /specweave:do
   ```

3. **Check progress**
   ```bash
   /specweave:progress
   ```

4. **Close increment**
   ```bash
   /specweave:done ####
   ```

See [SpecWeave workflow in CLAUDE.md](../../../CLAUDE.md) for details.

---

## Architecture at a Glance

### Entity Component System (ECS)

**Why ECS?**
- Modularity: New behaviors = new systems
- Testability: Systems can be unit tested in isolation
- Performance: Cache-friendly iteration
- Flexibility: Composition over inheritance

**Key Concepts**:

**Entity**: Container for components (just an ID)
```typescript
const player = world.createEntity('player');
```

**Component**: Pure data (no logic)
```typescript
player.addComponent(new PositionComponent(x, y, z));
player.addComponent(new HealthComponent(100));
```

**System**: Logic that operates on entities with specific components
```typescript
class MovementSystem extends System {
  update(deltaTime: number) {
    const entities = this.world.getAllEntities().filter(e =>
      e.hasComponent(PositionComponent) &&
      e.hasComponent(VelocityComponent)
    );

    for (const entity of entities) {
      const pos = entity.getComponent(PositionComponent);
      const vel = entity.getComponent(VelocityComponent);
      pos.position.add(vel.velocity.clone().multiplyScalar(deltaTime));
    }
  }
}
```

### System Execution Order

Systems execute in this order every frame:

```
1. InputSystem       → Process keyboard/mouse
2. AISystem          → Update enemy state machines
3. MovementSystem    → Apply velocities to positions
4. CollisionSystem   → Detect and resolve collisions
5. ProjectileSystem  → Update projectile lifecycle
6. RenderSystem      → Sync Three.js meshes with positions
```

**Why this order?** See [System Design](../architecture/system-design.md#system-execution-order)

### Game Loop

```
requestAnimationFrame (60 FPS)
  → Calculate deltaTime
  → Update all systems
  → Render scene
  → Repeat
```

---

## Testing

### Unit Tests (Vitest)

**Run tests**:
```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm test -- --ui      # UI mode (browser)
```

**Write a test**:
```typescript
// tests/unit/collision.test.ts
import { describe, it, expect } from 'vitest';
import { checkAABB } from '../../src/collision/CollisionUtils';

describe('AABB Collision', () => {
  it('should detect collision between two AABBs', () => {
    const box1 = { min: { x: 0, y: 0, z: 0 }, max: { x: 1, y: 1, z: 1 } };
    const box2 = { min: { x: 0.5, y: 0.5, z: 0.5 }, max: { x: 1.5, y: 1.5, z: 1.5 } };

    expect(checkAABB(box1, box2)).toBe(true);
  });
});
```

**Coverage target**: > 80% for game logic

### E2E Tests (Playwright)

**Run E2E tests**:
```bash
npm run test:e2e
```

**Write an E2E test**:
```typescript
// tests/e2e/gameplay.spec.ts
import { test, expect } from '@playwright/test';

test('player can move and shoot', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Start game
  await page.click('#start-button');

  // Wait for game to load
  await page.waitForSelector('#hud');

  // Press W to move forward
  await page.keyboard.press('KeyW');

  // Click to shoot
  await page.mouse.click(400, 300);

  // Check HUD updates
  const killsText = await page.textContent('#kills-text');
  expect(killsText).toContain('Kills:');
});
```

### Linting

```bash
npm run lint          # Check for issues
npm run lint:fix      # Auto-fix issues
```

---

## Common Tasks

### Add a New Component

1. Create component file in `src/components/`
   ```typescript
   // src/components/NewComponent.ts
   import { Component } from '../ecs/Component';

   export class NewComponent implements Component {
     readonly type = 'new';

     constructor(public someValue: number) {}
   }
   ```

2. Export from `src/components/index.ts`
   ```typescript
   export { NewComponent } from './NewComponent';
   ```

3. Use in entity creation
   ```typescript
   entity.addComponent(new NewComponent(42));
   ```

### Add a New System

1. Create system file in `src/systems/`
   ```typescript
   // src/systems/NewSystem.ts
   import { System } from '../ecs/System';
   import { World } from '../ecs/World';

   export class NewSystem extends System {
     constructor(world: World) {
       super(world);
     }

     update(deltaTime: number): void {
       const entities = this.world.getAllEntities().filter(e =>
         e.hasComponent(NewComponent)
       );

       for (const entity of entities) {
         // Your logic here
       }
     }
   }
   ```

2. Export from `src/systems/index.ts`
   ```typescript
   export { NewSystem } from './NewSystem';
   ```

3. Register in `Game.ts`
   ```typescript
   this.newSystem = new NewSystem(this.world);
   this.world.addSystem(this.newSystem);
   ```

### Add a New Enemy Type

1. Update `EntityFactory.createEnemy()`
   ```typescript
   createEnemy(config: any, position: Vector3, type: 'basic' | 'fast') {
     // Add type-specific logic
   }
   ```

2. Update `game-config.json`
   ```json
   {
     "enemy": {
       "types": {
         "basic": { "speed": 2, "health": 50 },
         "fast": { "speed": 5, "health": 30 }
       }
     }
   }
   ```

### Debug Performance Issues

1. **Enable stats.js** (already enabled in dev)
   - Check FPS in top-left corner
   - Target: 60 FPS

2. **Chrome DevTools Performance**
   - Open DevTools → Performance tab
   - Record 3 seconds of gameplay
   - Find slow functions in flame graph

3. **Three.js Stats**
   ```typescript
   console.log(this.renderer.info);
   // Shows: draw calls, triangles, geometries, textures
   ```

4. **Check system performance**
   ```typescript
   const start = performance.now();
   this.collisionSystem.update(deltaTime);
   console.log(`Collision: ${performance.now() - start}ms`);
   ```

---

## Debugging

### Common Issues

**Issue: Game doesn't start**
- Check browser console for errors
- Ensure `game-config.json` exists in `public/data/`
- Check network tab for failed asset loads

**Issue: Player can't move**
- Check if pointer lock is active (click canvas)
- Verify `InputSystem` is registered
- Check velocity is being set (console.log in `handlePlayerInput`)

**Issue: Enemies don't spawn**
- Check `game-config.json` → `enemy.count`
- Verify enemy spawn positions in config
- Check console for creation logs

**Issue: Collisions not working**
- Verify entities have `ColliderComponent`
- Check collision system is registered
- Log AABB bounds to verify they're correct

### Useful Console Commands

```javascript
// In browser console (when game is running)

// List all entities
game.world.getAllEntities()

// Find entity by component
game.world.getAllEntities().filter(e => e.hasComponent(AIComponent))

// Get player position
game.playerEntity.getComponent(PositionComponent).position

// Get camera rotation
game.camera.rotation

// Force game state
game.setState('victory')  // or 'gameover', 'menu'
```

### VS Code Debugging

1. Install "Debugger for Chrome" extension
2. Add launch configuration (`.vscode/launch.json`):
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "type": "chrome",
         "request": "launch",
         "name": "Launch Chrome",
         "url": "http://localhost:5173",
         "webRoot": "${workspaceFolder}/src"
       }
     ]
   }
   ```
3. Press F5 to start debugging

---

## Next Steps

### 1. Read Key Documentation
- [System Design](../architecture/system-design.md) - Complete technical architecture
- [SPEC-0001](../specs/spec-0001-3d-shooter-game.md) - Feature requirements
- [API Reference](./api-reference.md) - Component and System APIs

### 2. Explore the Codebase
- Start with `src/main.ts` → `Game.ts`
- Look at `EntityFactory.ts` to see how entities are created
- Browse systems in `src/systems/`
- Check out AI behavior in `AISystem.ts`

### 3. Make Your First Contribution
- Find a small task in [Increment 0001](../../increments/0001-3d-shooter-game/)
- Or fix a bug from GitHub issues
- Or improve documentation

### 4. Join the Team
- Ask questions in team chat
- Review PRs from other developers
- Share what you learned

---

## Resources

**Internal Docs**:
- [Documentation Hub](./README.md) - Central navigation
- [Component Catalog](./component-catalog.md) - All components
- [System Catalog](./system-catalog.md) - All systems
- [Build & Deploy](./build-deploy.md) - CI/CD guide

**External Resources**:
- [Three.js Docs](https://threejs.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Entity Component System Guide](https://www.gamedev.net/tutorials/programming/general-and-gameplay-programming/understanding-component-entity-systems-r3013/)
- [Game Programming Patterns](http://gameprogrammingpatterns.com/)

---

**Questions?** Ask the team or check [Documentation Hub](./README.md)

**Welcome aboard! Happy coding! 🎮**
