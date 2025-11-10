# How to Browse Documentation Locally

## Quick Start

### Option 1: Simple Python Server (Recommended)

```bash
# Navigate to the docs directory
cd .specweave/docs

# Start a simple HTTP server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

Then navigate to `http://localhost:8000` in your browser!

### Option 2: Node.js Server

```bash
# Install http-server globally (one time)
npm install -g http-server

# Navigate to docs directory
cd .specweave/docs

# Start server
http-server -p 8000

# Open in browser
open http://localhost:8000
```

### Option 3: VS Code Live Server

1. Install "Live Server" extension in VS Code
2. Right-click on `.specweave/docs/index.html`
3. Select "Open with Live Server"

### Option 4: Direct File Access (Limited)

You can open the HTML file directly in your browser, but **some browsers may block loading markdown files due to CORS restrictions**:

```bash
# macOS
open .specweave/docs/index.html

# Linux
xdg-open .specweave/docs/index.html

# Windows
start .specweave/docs/index.html
```

**Note**: If markdown files don't load, use Option 1 or 2 instead.

---

## Features

### 🔍 Search
Use the search box in the sidebar to quickly find documents.

### 📱 Responsive Design
Works on desktop and mobile browsers.

### 🎨 Syntax Highlighting
Code blocks are nicely formatted and highlighted.

### 🔗 Deep Linking
Share URLs like `http://localhost:8000#internal/delivery/api-reference.md`

### ⌨️ Keyboard Navigation
Use browser back/forward buttons to navigate through viewed docs.

---

## Troubleshooting

### Markdown files not loading?

**Problem**: You see "Failed to load" errors.

**Solution**: Use a local server (Option 1 or 2) instead of opening the file directly. Browsers block cross-origin requests when opening HTML files from `file://` URLs.

### Port 8000 already in use?

**Solution**: Use a different port:

```bash
python3 -m http.server 8001
# Then open http://localhost:8001
```

### Python not found?

**Try**: `python` instead of `python3`:

```bash
python -m http.server 8000
```

---

## What's Included

The documentation browser includes:

### 📐 Architecture
- Complete system design with diagrams
- All Architecture Decision Records (ADRs)

### 📝 Specifications
- Living specification for the game
- User stories and acceptance criteria

### 🎯 Strategy
- Product overview and vision

### 🔧 Developer Guides
- **Developer Onboarding** - Get started in 30 minutes
- **API Reference** - Complete API documentation
- **Component Catalog** - All ECS components
- **System Catalog** - All game systems

---

## Adding New Documentation

To add a new document to the browser:

1. **Create the markdown file** in the appropriate directory:
   - Strategy: `.specweave/docs/internal/strategy/`
   - Architecture: `.specweave/docs/internal/architecture/`
   - Specs: `.specweave/docs/internal/specs/`
   - Delivery: `.specweave/docs/internal/delivery/`

2. **Add a link to the sidebar** in `index.html`:
   ```html
   <li><a href="#" data-file="internal/your-folder/your-file.md">Your Title</a></li>
   ```

3. **Refresh the browser** and click the new link!

---

## Recommended Reading Order

### For New Developers:

1. [Documentation Hub](http://localhost:8000#internal/delivery/README.md) (5 min)
2. [Developer Onboarding](http://localhost:8000#internal/delivery/developer-onboarding.md) (10 min)
3. [System Design](http://localhost:8000#internal/architecture/system-design.md) (15 min)
4. [API Reference](http://localhost:8000#internal/delivery/api-reference.md) (as needed)

**Total: ~30 minutes to productive contribution**

### For Understanding Architecture:

1. [System Design](http://localhost:8000#internal/architecture/system-design.md)
2. [ADR-0003: ECS Pattern](http://localhost:8000#internal/architecture/adr/0003-entity-component-system.md)
3. [Component Catalog](http://localhost:8000#internal/delivery/component-catalog.md)
4. [System Catalog](http://localhost:8000#internal/delivery/system-catalog.md)

### For Understanding Requirements:

1. [Product Overview](http://localhost:8000#internal/strategy/3d-shooter/overview.md)
2. [SPEC-0001: 3D Shooter Game](http://localhost:8000#internal/specs/spec-0001-3d-shooter-game.md)

---

## Happy Browsing! 📚

If you have any issues, check the [Developer Onboarding Guide](http://localhost:8000#internal/delivery/developer-onboarding.md) or ask the team.
