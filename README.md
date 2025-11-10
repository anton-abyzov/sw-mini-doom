# Mini Doom - 3D WebGL Shooter

**A browser-based 3D first-person shooter built with Three.js and TypeScript**

Built using **SpecWeave** - where specifications drive development.

## 🎮 About This Game

Mini Doom is a complete 3D first-person shooter that runs in your browser. Battle AI-controlled enemies in an arena map using real-time shooting mechanics and tactical cover.

### Features

- ✅ First-person controls (WASD + mouse look)
- ✅ Projectile-based combat with hit detection
- ✅ Enemy AI with state machines (idle → chase → attack)
- ✅ Health and damage systems
- ✅ Arena map with obstacles for cover
- ✅ Complete game loop (menu → play → victory/game over)
- ✅ HUD with health bar, kill count, and timer

### Tech Stack

- **TypeScript 5.0+** (strict mode)
- **Three.js r160** (3D rendering)
- **Vite 5.0** (build tool)
- **Entity Component System** architecture
- **Custom collision detection** (AABB + ray-sphere)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server (opens http://localhost:3000)
npm run dev

# Build for production
npm run build
```

### Controls

| Input | Action |
|-------|--------|
| W/↑ | Move forward |
| S/↓ | Move backward |
| A/← | Strafe left |
| D/→ | Strafe right |
| Mouse | Look around |
| Left Click | Shoot |

**Objective**: Eliminate all 5 enemies to win!

### Next Steps

1. **Open your AI assistant** (Claude Code, Cursor, Windsurf, or any AI-powered IDE)

2. **Use SpecWeave slash commands** to start building:

```bash
# Plan a new feature
/specweave:increment "user authentication with JWT"

# Execute the implementation
/specweave:do

# Check progress
/specweave:progress

# Close when done
/specweave:done 0001
```

3. **Or describe your project** in natural language (works with slash command workflows):

```
"Build a real estate listing platform with search, images, and admin dashboard"
"Create a task management API with authentication"
"Build an e-commerce platform with Stripe payments"
```

4. **SpecWeave will automatically**:
   - Detect your tech stack (or ask you to choose)
   - Use the right agents & skills (all pre-installed!)
   - Create strategic documentation
   - Generate specifications (spec.md, plan.md, tasks.md)
   - Guide implementation
   - Generate tests

That's it! All components ready - just use `/specweave:increment` to start!

---

## 📁 Project Structure

```
sw-mini-doom/
├── .specweave/             # SpecWeave framework
│   ├── config.json         # Project configuration
│   ├── increments/         # Features (created via /specweave:increment)
│   │   └── 0001-feature/
│   │       ├── spec.md     # WHAT & WHY
│   │       ├── plan.md     # HOW
│   │       ├── tasks.md    # Implementation steps
│   │       ├── tests.md    # Test strategy
│   │       ├── logs/       # Execution logs
│   │       ├── scripts/    # Helper scripts
│   │       └── reports/    # Analysis reports
│   ├── docs/               # Strategic documentation
│   │   ├── internal/       # Internal docs (strategy, architecture)
│   │   └── public/         # Published docs
│   └── tests/              # Centralized test repository
├── .claude/                # Claude Code integration (optional)
│   ├── commands/           # Slash commands (10 installed)
│   ├── agents/             # AI agents (10 installed)
│   └── skills/             # AI skills (35+ installed)
├── CLAUDE.md               # Instructions for AI assistant
└── README.md               # This file
```

---

## 🎯 What is SpecWeave?

SpecWeave is a specification-first development framework where:
- **Specifications are the source of truth** (code follows specs, not reverse)
- **Slash commands drive workflow** (`/specweave:increment` → `/specweave:do` → `/specweave:done`)
- **AI agents work autonomously** (PM, Architect, Security, QA, DevOps)
- **All components pre-installed** (10 agents + 35+ skills ready!)
- **Works with ANY tech stack** (TypeScript, Python, Go, Rust, Java, .NET, etc.)
- **Works with multiple AI assistants** (Claude Code, Cursor, Windsurf, etc.)

---

## 🔧 Core Workflow

```
/specweave:increment "feature" → /specweave:do → /specweave:progress → /specweave:done → repeat
```

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/specweave:increment "feature"` | Plan new increment | Starting new feature |
| `/specweave:do` | Execute tasks | Ready to implement |
| `/specweave:progress` | Check status | Want to see progress |
| `/specweave:validate 0001` | Validate quality | Before completion |
| `/specweave:done 0001` | Close increment | Feature finished |
| `/specweave:sync-github` | Sync to GitHub | Export to issues |
| `/specweave:sync-jira` | Sync to Jira | Export to Jira |

See `CLAUDE.md` for complete workflow guide.

---

## 🚨 File Organization

**Keep project root clean!** All AI-generated files go into increment folders:

```
✅ CORRECT:
.specweave/increments/0001-auth/
├── logs/execution.log
├── scripts/migration.sql
└── reports/analysis.md

❌ WRONG:
project-root/
├── execution.log        # NO!
├── migration.sql        # NO!
└── analysis.md          # NO!
```

---

## 🤖 AI Assistant Compatibility

SpecWeave works with:
- ✅ **Claude Code** (recommended) - Full slash command support
- ✅ **Cursor** - Slash commands via composer
- ✅ **Windsurf** - Cascade mode compatible
- ✅ **ChatGPT** - Via custom instructions
- ✅ **Any AI IDE** - As long as it supports slash commands or custom prompts

**Setup**: See `CLAUDE.md` for AI assistant instructions.

---

## 📚 Learn More

- **Documentation**: https://spec-weave.com
- **GitHub**: https://github.com/anton-abyzov/specweave
- **Quick Reference**: See `CLAUDE.md` in your project
- **Examples**: Check `.specweave/docs/` after creating your first increment

---

## 🏁 Ready to Build?

**Start with your first feature**:
```bash
/specweave:increment "describe your feature here"
```

Or just describe what you want to build, and SpecWeave will guide you through the process! 🚀

---

**Documentation Philosophy**: {{DOCUMENTATION_APPROACH}}

**Tech Stack**: Auto-detected from project files (package.json, requirements.txt, etc.)
