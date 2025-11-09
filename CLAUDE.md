# sw-mini-doom - SpecWeave Quick Reference

This project uses **SpecWeave** - a specification-first AI development framework where specs and docs are the SOURCE OF TRUTH.

---

## 🚨 CRITICAL: NEVER POLLUTE PROJECT ROOT!

**⛔ THIS IS THE #1 RULE - ALL AI-GENERATED FILES GO IN INCREMENT FOLDERS ⛔**

### ❌ NEVER Create in Root

```
❌ WRONG - ROOT FILES (NOT ALLOWED!):
/SESSION-SUMMARY.md                    # NO! Goes to increment reports/
/ANALYSIS-REPORT.md                    # NO! Goes to increment reports/
/migration-script.py                   # NO! Goes to increment scripts/
/execution.log                         # NO! Goes to increment logs/
/temp-data.json                        # NO! Goes to increment logs/

✅ CORRECT - INCREMENT FOLDERS:
.specweave/increments/0001-user-auth/
├── spec.md                            # Core spec files
├── plan.md
├── tasks.md
├── tests.md
├── reports/                           # ✅ PUT REPORTS HERE!
│   ├── SESSION-SUMMARY.md
│   └── ANALYSIS-REPORT.md
├── scripts/                           # ✅ PUT SCRIPTS HERE!
│   └── migration-script.py
└── logs/                              # ✅ PUT LOGS HERE!
    ├── execution.log
    └── temp-data.json
```

### What IS Allowed in Root?

**ONLY these files**:
- ✅ `CLAUDE.md` (this file)
- ✅ Your project files (`src/`, `package.json`, etc.)
- ✅ Standard config (`.env`, `.gitignore`, `tsconfig.json`)

**Everything else → increment folders!**

**Before asking me to commit, check**: `git status` - If you see unexpected `.md` files in root, STOP and move them!

---

## SpecWeave Workflow (Use These Commands!)

**How SpecWeave works**:

```
/specweave:increment "feature" → /specweave:do → /specweave:progress → /specweave:done → repeat
```

**1. Plan Feature** → `/specweave:increment "user authentication"`
   - Creates spec.md (WHAT/WHY), plan.md (HOW), tasks.md, tests.md
   - PM-led process with architect/security/QA review
   - **Use when**: Starting any new feature or increment

**2. Execute Tasks** → `/specweave:do` or `/specweave:do 0001`
   - Smart resume (picks up where you left off)
   - Runs hooks after EVERY task completion
   - **Use when**: Ready to implement planned work

**3. Check Progress** → `/specweave:progress`
   - Shows task completion %, next action
   - **Use when**: Want to see status

**4. Validate Quality** → `/specweave:validate 0001` or `/specweave:validate 0001 --quality`
   - Rule-based validation (120 checks)
   - Optional AI quality assessment
   - **Use when**: Verify increment quality before completion

**5. Close Increment** → `/specweave:done 0001`
   - Validates all tasks complete
   - **Use when**: Feature is finished

**6. Sync to External** (Plugin Commands):
   - `/specweave:github:sync` - Export to GitHub issues (github plugin)
   - `/specweave:jira:sync` - Export to Jira (jira plugin)
   - **Use when**: Need to sync with project management tools

**All other functionality (agents, skills) activates automatically based on context.**

---

## 🧠 Automatic Intent Detection (NEW in v0.3.8+)

**SpecWeave now detects when you're describing a product/project and automatically helps you plan it!**

### How It Works

When working in a SpecWeave-initialized project (`.specweave/` exists), SpecWeave recognizes product descriptions by detecting these patterns:

**Signals that trigger auto-detection:**
1. ✅ **Project Name/Description** - "Project: RosterSync", "I want to build X"
2. ✅ **Features List** - Bullet points or numbered list of features (3+ items)
3. ✅ **Tech Stack** - Languages, frameworks, databases mentioned
4. ✅ **Timeline/Scope** - "MVP", "2 weeks", "Phase 1", "Quick build"
5. ✅ **Problem Statement** - "For teams...", "Helps users...", "Solves..."
6. ✅ **Business Model** - "Freemium", "$X/mo", "B2B", "Consumer"

**Confidence Levels:**
- **High (5-6 signals + SpecWeave folder)**: Auto-route to `/specweave:increment` immediately
- **Medium (3-4 signals + SpecWeave folder)**: Ask 1-2 clarifying questions, then route
- **Low (<3 signals)**: Regular conversation (no auto-routing)

### Example: Automatic Detection

```
You: Project: RosterSync - Team scheduling SaaS
Core features:
- Team roster management
- Availability calendar
- Event scheduling with notifications
- Lineup builder
Tech stack: .NET 8, Next.js 14+, PostgreSQL
MVP: 2-3 weeks
Monetization: Freemium ($10/mo)

SpecWeave detects: ✅ Name ✅ Features ✅ Tech ✅ Timeline ✅ Problem ✅ Business
→ Automatically recognizes this as a product description
→ Guides you through increment planning
→ Invokes /specweave:increment automatically

No need to remember the full command!
```

### Opt-Out Options

You can override automatic routing with explicit instructions:
- **"Just brainstorm first"** → Uses spec-driven-brainstorming instead
- **"Don't plan yet"** → Regular conversation
- **"Quick discussion"** → No automatic routing
- **"Let's explore ideas first"** → Exploratory mode

### Two Ways to Use SpecWeave

1. ✅ **Automatic** (NEW): Describe your product → SpecWeave detects it → Plans automatically
2. ✅ **Explicit** (Classic): Type `/specweave:increment "feature"` → Works as before

Both approaches work perfectly - use whichever feels more natural!

---

## 🚨 CRITICAL: File Organization Rules

**Keep project root CLEAN!** All AI-generated files MUST go into increment folders.

### What Goes Where

**✅ ALLOWED in Root**:
- `CLAUDE.md` (this file)
- Your existing project files (package.json, src/, etc.)
- Standard config files (.env, .gitignore, tsconfig.json)

**❌ NEVER Create in Root** (use increment folders):
- Reports → `.specweave/increments/0001-feature-name/reports/`
- Scripts → `.specweave/increments/0001-feature-name/scripts/`
- Logs → `.specweave/increments/0001-feature-name/logs/`
- Analysis files → `.specweave/increments/0001-feature-name/reports/`
- Temp files → `.specweave/increments/0001-feature-name/logs/`

### Increment Structure

```
.specweave/increments/0001-user-auth/
├── spec.md                      # WHAT & WHY
├── plan.md                      # HOW
├── tasks.md                     # Implementation steps
├── tests.md                     # Test strategy
├── context-manifest.yaml        # Selective context loading
├── logs/                        # ✅ Execution logs, errors, AI sessions
├── scripts/                     # ✅ Helper scripts, migrations, setup
└── reports/                     # ✅ Analysis, completion, performance
```

**Why?**
- ✅ Complete traceability (know which increment created which files)
- ✅ Easy cleanup (delete increment folder = delete all related files)
- ✅ Clear context (all files for a feature in one place)
- ✅ No root clutter

**Example**:
```
❌ WRONG:
project-root/
├── analysis-report.md          # NO! Pollutes root
├── migration-script.py         # NO! Pollutes root
└── execution.log               # NO! Pollutes root

✅ CORRECT:
.specweave/increments/0001-user-auth/
├── reports/analysis-report.md
├── scripts/migration-script.py
└── logs/execution.log
```

---

## Tech Stack

**Project Type**: {MONOREPO_OR_SINGLE}

{#IF_SINGLE_STACK}
**Stack**:
- Language: {DETECTED_LANGUAGE}
- Framework: {DETECTED_FRAMEWORK}
- Database: {SPECIFIED_DATABASE}
- Platform: {SPECIFIED_PLATFORM}
{#ENDIF}

{#IF_MONOREPO}
**Services**:
- {SERVICE_1_NAME}: {SERVICE_1_LANGUAGE} + {SERVICE_1_FRAMEWORK} ({SERVICE_1_PATH}/)
- {SERVICE_2_NAME}: {SERVICE_2_LANGUAGE} + {SERVICE_2_FRAMEWORK} ({SERVICE_2_PATH}/)
{#ENDIF}

Config: Auto-detected from project files

---

## Project Structure

```
sw-mini-doom/
├── .specweave/
│   ├── docs/                    # Strategic documentation
│   │   ├── internal/
│   │   │   ├── strategy/        # Business specs (WHAT, WHY)
│   │   │   ├── specs/           # Feature specifications (detailed requirements)
│   │   │   ├── architecture/    # Technical design (HOW)
│   │   │   ├── delivery/        # Guides, roadmap, CI/CD
│   │   │   ├── operations/      # Runbooks, monitoring
│   │   │   └── governance/      # Security, compliance
│   │   └── public/              # Published docs
│   ├── increments/              # Features (auto-numbered)
│   │   └── 0001-feature-name/
│   │       ├── spec.md
│   │       ├── plan.md
│   │       ├── tasks.md
│   │       ├── tests.md
│   │       ├── logs/            # ✅ Put logs here
│   │       ├── scripts/         # ✅ Put scripts here
│   │       └── reports/         # ✅ Put reports here
│   └── tests/                   # Centralized test repository
│
├── .claude/                     # Pre-installed components
│   ├── agents/                  # Core + plugin agents (auto-activate)
│   ├── skills/                  # Core + plugin skills (auto-activate)
│   └── commands/                # Core + plugin slash commands
│
├── CLAUDE.md                    # This file
└── src/                         # Your source code
```

---

## Plugin Architecture

**SpecWeave uses Claude Code's native plugin system** for optional capabilities.

### Core vs. Plugins

**Core Framework** (always loaded):
- 9 core skills (increment-planner, tdd-workflow, context-loader, etc.)
- 3 core agents (PM, Architect, Tech Lead)
- 7 core commands (`/specweave:increment`, `/specweave:do`, etc.)
- ~12K tokens (lightweight!)

**Plugins** (opt-in based on your stack):
- Tech stacks: `specweave-frontend`, `specweave-backend`, `specweave-kubernetes`
- Integrations: `specweave-github`, `specweave-jira`
- Domains: `specweave-ml`, `specweave-payments`, `specweave-testing`

### Using Plugin Commands

**Core commands** (always available):
```bash
/specweave:increment "feature"
/specweave:do
/specweave:progress
```

**Plugin commands** (when plugin installed):
```bash
# GitHub plugin:
/specweave:github:sync          # Sync increments to GitHub issues
/specweave:github:create-issue  # Create new issue
/specweave:github:status        # Check sync status

# Jira plugin:
/specweave:jira:sync           # Sync to Jira
/specweave:jira:create-ticket  # Create Jira ticket
```

**Plugin agents and skills activate automatically** based on your tech stack and context.

### Installing Plugins

Plugins are detected and suggested during `specweave init` based on:
- Git remote (GitHub detected → suggest github plugin)
- Tech stack (React detected → suggest frontend plugin)
- Project files (K8s yamls → suggest kubernetes plugin)

**Enabled plugins**: {ENABLED_PLUGINS}

---

## Documentation Philosophy

**You chose**: {DOCUMENTATION_APPROACH}

{#IF_COMPREHENSIVE}
### Comprehensive Upfront Approach
- Create complete specifications before coding (scope-appropriate detail)
- All ADRs documented in advance
- Best for: Enterprise, regulated industries, large teams, complex systems
- Spec size scales with project complexity (10-500+ pages depending on scope)
{#ENDIF}

{#IF_INCREMENTAL}
### Incremental/Evolutionary Approach
- Start with overview (10-20 pages)
- Build documentation as you go
- Best for: Startups, MVPs, small teams
{#ENDIF}

---

## Frequently Asked Questions

**New to SpecWeave?** Check out the [FAQ](https://spec-weave.com/docs/faq) for answers to common questions:

### Quick Answers
- **Why specs in two locations?** Living Docs (permanent, complete feature) vs Increment Specs (temporary, current work)
- **When do I need living docs spec?** Major features (3+ increments), brownfield integration, or external PM tools
- **Can I delete increment specs?** YES, after completion. Living docs specs are NEVER deleted (permanent)
- **Which spec is source of truth?** Living docs spec (when it exists), otherwise increment spec

### Key Topics Covered
- ✅ Two-spec architecture explained
- ✅ When to create living docs specs
- ✅ Increment spec lifecycle
- ✅ Brownfield documentation linking
- ✅ External PM tool integration (Jira, ADO, GitHub)
- ✅ Small vs large feature decisions
- ✅ Project structure and organization

**[View Complete FAQ →](https://spec-weave.com/docs/faq)**

---

## Testing

**Four Levels**:
1. **Specification** (`.specweave/docs/internal/strategy/`) - Acceptance criteria
2. **Feature** (`.specweave/increments/####/tests.md`) - Test coverage per increment
3. **Integration** (`tests/integration/` or `tests/specs/`) - Component/module tests
4. **Code** (`tests/`) - Automated tests (Unit, Integration, E2E)

**Requirements**:
- E2E tests when UI exists
- >80% coverage for critical paths
- Tests MUST tell the truth

---

## Quick Reference Card

### When to Use Each Command

| User Says | Use Command | What It Does |
|-----------|-------------|--------------|
| "Let's build [feature]" | `/specweave:increment "[feature]"` | Plan new increment |
| "Start implementing" | `/specweave:do` | Execute tasks (smart resume) |
| "What's the status?" | `/specweave:progress` | Show task completion % |
| "Is this ready?" | `/specweave:validate 0001` | Validate increment quality |
| "We're done" | `/specweave:done 0001` | Close increment |

**Plugin Commands** (when installed):
| "Sync to GitHub" | `/specweave:github:sync` | Export to GitHub issues |
| "Sync to Jira" | `/specweave:jira:sync` | Export to Jira |

---

## Key SpecWeave Principles

1. **Specification-First**: Always start with `/specweave:increment` to create specs before coding
2. **Documentation = Source of Truth**: Specs guide implementation, not the reverse
3. **Incremental**: Work in small, measurable increments
4. **Validated**: Every increment validated before closure
5. **Traceable**: All work traces back to specs and requirements
6. **Clean Organization**: All supporting files in increment folders, never root

---

## Project-Specific Notes

{#CUSTOM_NOTES}
<!-- Add project-specific conventions, team workflows, deployment notes here -->
{#ENDCUSTOM}

---

## Getting Started

**Create your first feature**:
```bash
/specweave:increment "your feature description"
```

**Typical Workflow**:
1. `/specweave:increment "feature"` → SpecWeave creates specs
2. Review specs (spec.md, plan.md, tasks.md)
3. `/specweave:do` → Claude implements the code
4. `/specweave:progress` → Check status anytime
5. `/specweave:validate 0001` → Validate quality (optional)
6. `/specweave:done 0001` → Close when complete

**Remember**:
- Type `/specweave:increment` first, THEN implement
- Keep root clean (use increment folders)
- All agents/skills activate automatically

**SpecWeave Documentation**: https://spec-weave.com

---

**Last Updated**: Auto-updated via SpecWeave hooks
