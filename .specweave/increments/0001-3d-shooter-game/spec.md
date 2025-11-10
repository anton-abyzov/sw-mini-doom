---
increment: 0001-3d-shooter-game
title: "3D WebGL Shooter Game"
priority: P1
status: planned
created: 2025-11-09
dependencies: []
structure: user-stories

# Tech stack (detected from user requirements)
tech_stack:
  detected_from: "user specification"
  language: "typescript"
  framework: "threejs"
  build_tool: "vite"
  bundler: "rollup"
  runtime: "browser"

# Platform
platform: "web"
estimated_cost: "$0/month (static hosting)"

# Jira Integration
jira:
  project_key: "MINIDOOM"
  epic_key: "MINIDOOM-1"
  epic_url: "https://antonabyzov.atlassian.net/browse/MINIDOOM-1"
  stories:
    - key: "MINIDOOM-2"
      title: "US-001: Player Movement"
    - key: "MINIDOOM-3"
      title: "US-002: Shooting Mechanics"
    - key: "MINIDOOM-4"
      title: "US-003: Enemy AI Behavior"
    - key: "MINIDOOM-5"
      title: "US-004: Damage and Health System"
    - key: "MINIDOOM-6"
      title: "US-005: Arena Map"
    - key: "MINIDOOM-7"
      title: "US-006: Game Loop and Win Conditions"
    - key: "MINIDOOM-8"
      title: "US-007: HUD and UI Elements"
  last_sync: "2025-11-09T22:40:00Z"
  sync_direction: "bidirectional"
  sync_status: "fully_synced"
---

# Increment 0001: 3D WebGL Shooter Game

## Overview

This increment implements a complete browser-based 3D first-person shooter game using Three.js and TypeScript. The game features a single arena map where the player battles AI-controlled enemies using shooting mechanics with real-time damage calculations.

**Living Specification**: See [SPEC-0001-3d-shooter-game](../../docs/internal/specs/spec-0001-3d-shooter-game.md) for complete requirements.

**Strategy Documentation**: See [3D Shooter Strategy Overview](../../docs/internal/strategy/3d-shooter/overview.md) for product vision and business context.

## Scope Summary

This increment includes all **P1 (Must-have)** features from the living specification:

### Included in This Increment

✅ **US-001**: Player Movement (keyboard + mouse controls, first-person camera)
✅ **US-002**: Shooting Mechanics (projectile-based combat, hit detection)
✅ **US-003**: Enemy AI Behavior (detection, pursuit, attack, shooting back)
✅ **US-004**: Damage and Health System (player/enemy health, death conditions)
✅ **US-005**: Arena Map (bounded playable area, obstacles, lighting)
✅ **US-006**: Game Loop and Win Conditions (start, play, victory/game over, restart)
✅ **US-007**: HUD and UI Elements (health display, crosshair, kill count, timer)

### Deferred to Future Increments

⏸️ **US-008**: Audio Feedback (P3 - sound effects, music) → Increment 0002

## Acceptance Criteria Summary

This increment must satisfy **44 acceptance criteria** from the living specification:

- **AC-US1-01 through AC-US1-05**: Player movement and camera controls
- **AC-US2-01 through AC-US2-06**: Shooting mechanics and hit detection
- **AC-US3-01 through AC-US3-08**: Enemy AI behavior and shooting
- **AC-US4-01 through AC-US4-08**: Damage, health, and death systems
- **AC-US5-01 through AC-US5-06**: Arena map and environment
- **AC-US6-01 through AC-US6-08**: Game loop and win/lose conditions
- **AC-US7-01 through AC-US7-05**: HUD and UI elements

**Coverage Target**: 100% of P1 acceptance criteria must pass validation before increment completion.

## Technical Stack

- **Language**: TypeScript 5.0+ (strict mode)
- **3D Engine**: Three.js r150+
- **Build Tool**: Vite 4.0+
- **Bundler**: Rollup (via Vite)
- **Testing**: Vitest (unit tests), Playwright (E2E tests)
- **Linting**: ESLint with TypeScript rules
- **Assets**: Local JSON configuration files

## Success Criteria

### Functional Success
- ✅ All 44 P1 acceptance criteria pass validation
- ✅ Player can complete full game loop without crashes
- ✅ Enemy AI behaves correctly (detect, chase, attack)
- ✅ Damage and health systems function accurately

### Performance Success
- ✅ Maintain 60 FPS with 5 enemies and 10 active projectiles
- ✅ Initial load time < 3 seconds
- ✅ Bundle size < 500KB gzipped

### Quality Success
- ✅ Code coverage > 80% for game logic
- ✅ Zero TypeScript errors (strict mode)
- ✅ Zero critical ESLint errors
- ✅ Browser compatibility: Chrome, Firefox, Safari, Edge (latest 2 versions)

## Out of Scope

The following are explicitly **NOT** included in this increment:

❌ Audio and sound effects (deferred to 0002)
❌ Multiple maps or level progression
❌ Multiple enemy types or weapon variety
❌ Multiplayer or networking
❌ Mobile/touch controls
❌ Advanced physics (gravity, ragdolls)
❌ Save/load functionality
❌ Leaderboards or persistent data

## Dependencies

### External Dependencies
- Three.js (r150+)
- Vite (4.0+)
- TypeScript (5.0+)
- Vitest
- ESLint

### Internal Dependencies
None - this is the first increment.

## Risks

### Risk 1: Performance on Low-End Hardware
**Mitigation**: Implement object pooling, frustum culling, and performance profiling early.

### Risk 2: Complex AI Pathfinding
**Mitigation**: Use simple pursuit algorithm initially, defer advanced pathfinding to future increments.

### Risk 3: Browser Compatibility Issues
**Mitigation**: Test on all target browsers weekly, use standardized Web APIs.

## Estimated Effort

**Timeline**: 2-3 weeks

**Complexity**: Medium
- Three.js rendering: Standard
- Collision detection: Simple (AABB, ray-sphere)
- AI implementation: Moderate (state machine, simple pathfinding)
- Game loop: Standard

## Next Steps

1. **Review this specification** and approve scope
2. **Read the implementation plan** (plan.md) for technical architecture
3. **Execute tasks** (tasks.md) following test-driven development
4. **Run validation** before marking increment complete

---

**For complete requirements, see**:
- [SPEC-0001: 3D WebGL Shooter Game](../../docs/internal/specs/spec-0001-3d-shooter-game.md) (Living Specification)
- [3D Shooter Strategy Overview](../../docs/internal/strategy/3d-shooter/overview.md) (Product Vision)
