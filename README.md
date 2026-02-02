# AI Component Library

A production-ready React component library built with TypeScript, Vite, and pnpm workspaces.

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

Install pnpm if you haven't already:
```bash
npm install -g pnpm
```

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Build All Packages

Build all component packages:
```bash
pnpm build
```

### 3. Run Storybook

Start the Storybook development server:
```bash
pnpm storybook
```

Storybook will be available at `http://localhost:6006`

## Available Scripts

### Root Level

- `pnpm install` - Install all dependencies
- `pnpm build` - Build all component packages
- `pnpm dev` - Run all packages in watch mode (parallel)
- `pnpm storybook` - Start Storybook with hot reload (no build needed!)
- `pnpm build:storybook` - Build Storybook for production
- `pnpm typecheck` - Run TypeScript type checking across all packages
- `pnpm clean` - Remove all dist folders and node_modules

### Individual Packages

Navigate to a specific package and run:

```bash
cd packages/button  # or packages/card
pnpm build         # Build the package
pnpm dev           # Build in watch mode
pnpm typecheck     # Type check
```

## Building for Production

### Build Component Packages

```bash
pnpm build
```

This creates optimized builds in each package's `dist/` folder with:
- ESM bundle (`*.es.js`)
- UMD bundle (`*.umd.js`)
- TypeScript declarations (`*.d.ts`)
- Source maps
- CSS files

### Build Storybook

```bash
pnpm build:storybook
```

This creates a static Storybook build in `apps/storybook/storybook-static/` that can be deployed to any static hosting service.

## Using Components in Your Project

After publishing to npm (or using locally), install the components:

```bash
npm install @kseniya333/button @kseniya333/card
```

Or for local development, you can use pnpm workspace linking:

```json
{
  "dependencies": {
    "@kseniya333/button": "workspace:*",
    "@kseniya333/card": "workspace:*"
  }
}
```

### For Publishing

When ready to publish:

1. **Build packages** - `pnpm build`
2. **Type check** - `pnpm typecheck`
3. **Version** - `pnpm changeset` and `pnpm version`
4. **Publish** - `pnpm release`

## Package Independence

Each component package (`@kseniya333/button` and `@kseniya333/card`) is:
- Independently installable
- Has its own version
- Can be published separately to npm
- Contains its own build configuration
- Includes TypeScript types
- Exports both ESM and UMD formats

## Versioning and Publishing

This monorepo uses **Changesets** for automated versioning and publishing with:

✅ **Interactive version selection** (patch/minor/major)
✅ **Automatic dependency propagation** (when Button updates, Card auto-bumps)
✅ **Changelog generation**
✅ **Safe publishing workflow**


### Recommended Workflow (with Changesets)

```bash
# 1. Make changes to your code
vim packages/button/src/Button.tsx

# 2. Create a changeset (interactive prompt)
pnpm changeset

# 3. Commit your changes
git add .
git commit -m "fix: button hover animation"

# 4. Version packages (auto-bumps dependencies)
pnpm version

# 5. Commit version changes
git add .
git commit -m "chore: version packages"

# 6. Build and publish to npm
pnpm release

# 7. Push to git
git push && git push --tags
```

**Key Feature:** When Button is updated, Card automatically gets a version bump and its Button dependency is updated!

### Manual Workflow (Alternative)

```bash
# 1. Login to npm
npm login

# 2. Build packages
pnpm build

# 3. Publish Button (do this first as Card depends on it)
cd packages/button
npm publish --access public

# 4. Publish Card
cd ../card
npm publish --access public
```

### Installing in Consumer Apps

After publishing, anyone can install:
```bash
npm install @kseniya333/button @kseniya333/card
```

## License

MIT
