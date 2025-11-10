# Internal Documentation - Quick Navigation

**sw-mini-doom Documentation Hub**

This directory contains all internal documentation for the 3D WebGL Shooter Game project. Use this as your central navigation point for all technical documentation.

---

## 📋 Quick Links

### 🎯 Strategy & Planning
- [Product Overview](../strategy/3d-shooter/overview.md) - Product vision, goals, and business context

### 📐 Architecture
- [System Design](../architecture/system-design.md) - Complete technical architecture
- **Architecture Decision Records (ADRs)**:
  - [ADR-0001: Three.js Rendering Approach](../architecture/adr/0001-threejs-rendering-approach.md)
  - [ADR-0002: Collision Detection Strategy](../architecture/adr/0002-collision-detection-strategy.md)
  - [ADR-0003: Entity Component System](../architecture/adr/0003-entity-component-system.md)
  - [ADR-0004: AI State Machine](../architecture/adr/0004-ai-state-machine.md)
  - [ADR-0005: Asset Loading Strategy](../architecture/adr/0005-asset-loading-strategy.md)

### 📝 Specifications
- [SPEC-0001: 3D Shooter Game](../specs/spec-0001-3d-shooter-game.md) - Complete feature requirements

### 🚀 Delivery & Operations
- [Developer Onboarding Guide](./developer-onboarding.md) - Get started developing
- [API Reference](./api-reference.md) - Component and System APIs
- [Component Catalog](./component-catalog.md) - All ECS components
- [System Catalog](./system-catalog.md) - All game systems
- [Build & Deploy Guide](./build-deploy.md) - CI/CD and deployment

### 🎮 Implementation
- [Current Increment: 0001](../../increments/0001-3d-shooter-game/) - Active development work

---

## 📚 Documentation Structure

```
.specweave/docs/internal/
├── strategy/               # Product vision and business context
│   └── 3d-shooter/
│       └── overview.md
│
├── architecture/           # Technical design and decisions
│   ├── system-design.md
│   └── adr/
│       ├── 0001-threejs-rendering-approach.md
│       ├── 0002-collision-detection-strategy.md
│       ├── 0003-entity-component-system.md
│       ├── 0004-ai-state-machine.md
│       └── 0005-asset-loading-strategy.md
│
├── specs/                  # Feature specifications
│   └── spec-0001-3d-shooter-game.md
│
├── delivery/               # Developer guides and references (YOU ARE HERE)
│   ├── README.md          # This file - navigation hub
│   ├── developer-onboarding.md
│   ├── api-reference.md
│   ├── component-catalog.md
│   ├── system-catalog.md
│   └── build-deploy.md
│
├── operations/             # Runbooks and monitoring (future)
│   └── (empty - for production operations)
│
└── governance/             # Security and compliance (future)
    └── (empty - for security policies)
```

---

## 🎯 Common Tasks - Where to Look

| I want to... | Go to... |
|--------------|----------|
| **Understand the project vision** | [Product Overview](../strategy/3d-shooter/overview.md) |
| **Understand technical architecture** | [System Design](../architecture/system-design.md) |
| **See all features and requirements** | [SPEC-0001](../specs/spec-0001-3d-shooter-game.md) |
| **Learn why we made technical decisions** | [ADRs](../architecture/adr/) |
| **Start developing/onboarding** | [Developer Onboarding](./developer-onboarding.md) |
| **Look up component/system APIs** | [API Reference](./api-reference.md) |
| **Find all components** | [Component Catalog](./component-catalog.md) |
| **Find all systems** | [System Catalog](./system-catalog.md) |
| **Deploy or build the project** | [Build & Deploy](./build-deploy.md) |
| **See current work in progress** | [Increment 0001](../../increments/0001-3d-shooter-game/) |

---

## 🔄 Documentation Lifecycle

### Living Documents (Permanent)
These docs are **SOURCE OF TRUTH** and updated as the project evolves:
- Product Overview
- System Design
- SPEC-0001 (living specification)
- All ADRs (immutable once created, new ADRs for changes)
- All developer guides

### Increment Documents (Temporary)
These docs are created per increment and archived after completion:
- Increment specs (`.specweave/increments/####/spec.md`)
- Increment plans (`.specweave/increments/####/plan.md`)
- Increment tasks (`.specweave/increments/####/tasks.md`)

---

## 🆕 For New Developers

**Start here in order**:

1. Read [Product Overview](../strategy/3d-shooter/overview.md) (5 min)
2. Read [System Design](../architecture/system-design.md) (15 min)
3. Read [Developer Onboarding Guide](./developer-onboarding.md) (10 min)
4. Browse [API Reference](./api-reference.md) as needed
5. Check [Current Increment](../../increments/0001-3d-shooter-game/) for active tasks

**Total time: ~30 minutes to productive contribution**

---

## 📖 Document Standards

All documentation follows these standards:

### Markdown Format
- GitHub Flavored Markdown
- Mermaid diagrams for architecture
- Code blocks with syntax highlighting

### Structure
- **Front matter**: Version, date, status
- **Table of contents**: For docs > 500 lines
- **Cross-references**: Link to related docs
- **Examples**: Include code examples where applicable

### Maintenance
- Update dates when making changes
- Increment version on major changes
- Keep related docs in sync
- Archive outdated docs (don't delete)

---

## 🤝 Contributing to Docs

**When to update docs**:
- ✅ After implementing a feature (update living spec, system design)
- ✅ When making architectural decisions (create new ADR)
- ✅ When changing APIs (update API reference)
- ✅ When adding components/systems (update catalogs)

**Where to put new docs**:
- **New ADRs**: `architecture/adr/####-title.md`
- **New specs**: `specs/spec-####-title.md`
- **Guides**: `delivery/guide-name.md`
- **Runbooks**: `operations/runbook-name.md`

---

## 🔍 Search Tips

**Find by keyword**:
```bash
# Search all internal docs
grep -r "keyword" .specweave/docs/internal/

# Search only specs
grep -r "keyword" .specweave/docs/internal/specs/

# Search only ADRs
grep -r "keyword" .specweave/docs/internal/architecture/adr/
```

**Find by topic**:
- **Rendering**: System Design, ADR-0001
- **Collision**: System Design, ADR-0002
- **ECS**: System Design, ADR-0003, Component/System Catalogs
- **AI**: System Design, ADR-0004
- **Performance**: System Design (Performance Architecture section)

---

## 📚 External Resources

**Related Documentation**:
- [Three.js Docs](https://threejs.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Vitest Docs](https://vitest.dev/)
- [Playwright Docs](https://playwright.dev/)

**Learning Resources**:
- [Game Programming Patterns](http://gameprogrammingpatterns.com/)
- [Entity Component System Introduction](https://www.gamedev.net/tutorials/programming/general-and-gameplay-programming/understanding-component-entity-systems-r3013/)
- [Three.js Fundamentals](https://threejs.org/manual/)

---

**Last Updated**: 2025-11-09
**Maintained By**: Development Team
**Questions?**: Check [Developer Onboarding](./developer-onboarding.md) or ask the team
