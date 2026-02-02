# Storybook Build Errors - Fixed

This document explains the Storybook build errors and how they were fixed.

## 🐛 Errors Encountered

1. ❌ Cannot resolve `@storybook/addon-docs/dist/shims/mdx-react-shim`
2. ❌ react-dom-shim path resolution error
3. ❌ Cannot resolve `scheduler` dependency
4. ❌ Vite alias conflicts with Storybook internals
5. ❌ pnpm workspace hoisting issues

## ✅ Fixes Applied

### 1. Added Missing Dependencies

**File:** `apps/storybook/package.json`

```json
{
  "dependencies": {
    "scheduler": "^0.23.0"  // ← Added for React 18 compatibility
  }
}
```

**Why:** React 18 requires `scheduler` as a peer dependency, but it wasn't explicitly installed.

### 2. Fixed Vite Alias Configuration

**File:** `apps/storybook/.storybook/main.ts`

**Before:**
```typescript
resolve: {
  alias: {
    '@kseniya333/button': resolve(__dirname, '...'),
    '@kseniya333/card': resolve(__dirname, '...'),
  },
  preserveSymlinks: true,  // ← Conflicted with Storybook
}
```

**After:**
```typescript
resolve: {
  alias: [
    // Use array syntax with regex to avoid overriding Storybook internals
    {
      find: /^@ai-components\/button$/,
      replacement: resolve(__dirname, '../../../packages/button/src/index.ts'),
    },
    {
      find: /^@ai-components\/card$/,
      replacement: resolve(__dirname, '../../../packages/card/src/index.ts'),
    },
  ],
  // Removed preserveSymlinks - let Storybook handle it
}
```

**Why:**
- Object syntax was overriding Storybook's internal aliases
- Array syntax prepends to existing aliases without replacing them
- Regex ensures exact matches (doesn't affect subpaths)
- Removed `preserveSymlinks` to avoid conflicts with Storybook's resolution

### 3. Improved Dependency Optimization

**File:** `apps/storybook/.storybook/main.ts`

```typescript
optimizeDeps: {
  include: [
    'react',
    'react-dom',
    'react-dom/client',
    'scheduler',              // ← Explicitly include scheduler
    '@kseniya333/button',
    '@kseniya333/card',
  ],
  exclude: ['@storybook/blocks'], // ← Exclude Storybook internals
}
```

**Why:**
- Explicitly including React deps ensures they're pre-bundled correctly
- Including `scheduler` prevents resolution errors
- Excluding `@storybook/blocks` prevents Vite from trying to optimize Storybook internals

### 4. Configured pnpm Hoisting

**File:** `.npmrc` (created)

```ini
# Auto-install peer dependencies
auto-install-peers=true

# Hoist Storybook and React dependencies to workspace root
public-hoist-pattern[]=*storybook*
public-hoist-pattern[]=*react*
public-hoist-pattern[]=*react-dom*
public-hoist-pattern[]=scheduler
public-hoist-pattern[]=@mdx-js/*

# Shamefully hoist for Storybook compatibility
shamefully-hoist=true
```

**Why:**
- pnpm's isolated node_modules can break Storybook's internal module resolution
- `shamefully-hoist=true` hoists all dependencies to root (fixes most issues)
- `public-hoist-pattern` ensures critical deps are accessible
- `auto-install-peers=true` automatically installs missing peer deps

### 5. Specified Node.js Version

**File:** `.nvmrc` (created)

```
18.20.3
```

**Why:**
- Node.js v22 is not officially supported by Storybook 7.6.x yet
- Node.js 18 LTS (18.20.x) is the recommended version
- Node.js 20 LTS also works well

## 🚀 How to Apply Fixes

### Step 1: Clean Installation

```bash
# Remove existing node_modules and lockfile
rm -rf node_modules apps/storybook/node_modules packages/*/node_modules pnpm-lock.yaml

# Reinstall with new configuration
pnpm install
```

### Step 2: Verify Node.js Version

```bash
# Check current version
node --version

# Should output: v18.20.3 or similar v18.x
```

If using nvm:
```bash
nvm use 18
# or
nvm install 18.20.3
nvm use 18.20.3
```

### Step 3: Build and Test

```bash
# Build packages
pnpm build

# Start Storybook (should work now!)
pnpm storybook
```

### Step 4: Verify Hot Reload

```bash
# With Storybook running, edit a component
vim packages/button/src/Button.tsx

# Changes should appear instantly in Storybook
```

## 🔍 Understanding the Root Causes

### Issue 1: Storybook Shim Resolution

**Error:**
```
Cannot resolve @storybook/addon-docs/dist/shims/mdx-react-shim
```

**Cause:**
- Storybook uses internal shims to bridge MDX with React
- pnpm's strict module isolation prevented Storybook from finding these shims
- Our Vite aliases were too broad and overrode Storybook's internal resolution

**Fix:**
- Use `shamefully-hoist=true` in .npmrc to hoist all dependencies
- Use array syntax for aliases to prepend instead of replace
- Let Storybook handle its own module resolution

### Issue 2: Missing scheduler

**Error:**
```
Cannot resolve scheduler
```

**Cause:**
- React 18 requires `scheduler` as a peer dependency
- It's usually installed transitively, but pnpm's isolation can break this
- Storybook's internal React usage needs direct access to scheduler

**Fix:**
- Add `scheduler` as explicit dependency in Storybook package.json
- Include in `optimizeDeps.include` for proper Vite bundling
- Hoist via .npmrc to ensure availability

### Issue 3: Vite Alias Conflicts

**Error:**
```
react-dom-shim path resolution error
```

**Cause:**
- Our Vite config used object syntax for aliases, which replaced Storybook's aliases
- `preserveSymlinks: true` conflicted with Storybook's internal symlink handling
- Storybook has its own aliases for React shims that we were overriding

**Fix:**
- Use array syntax with regex for exact matching
- Remove `preserveSymlinks` config
- Exclude Storybook internals from optimization

### Issue 4: pnpm Workspace Isolation

**Cause:**
- pnpm isolates node_modules per package for strict dependency resolution
- Storybook expects a more traditional flat node_modules structure
- Internal Storybook modules couldn't find peer dependencies

**Fix:**
- Use `shamefully-hoist=true` to flatten node_modules
- Use `public-hoist-pattern` for critical dependencies
- Enable `auto-install-peers` for automatic peer dependency installation

## 📊 Configuration Summary

### Files Modified

| File | Change | Purpose |
|------|--------|---------|
| `apps/storybook/package.json` | Added `scheduler` | Fix missing React 18 peer dep |
| `apps/storybook/.storybook/main.ts` | Updated Vite config | Fix alias conflicts, optimize deps |
| `.npmrc` | Created with hoisting config | Fix pnpm module resolution |
| `.nvmrc` | Created with Node 18.20.3 | Specify supported Node version |

### Key Configuration Values

**Vite Aliases:**
```typescript
// Use array + regex for exact matching
alias: [
  { find: /^@ai-components\/button$/, replacement: '...' },
  { find: /^@ai-components\/card$/, replacement: '...' },
]
```

**Dependency Optimization:**
```typescript
optimizeDeps: {
  include: ['react', 'react-dom', 'scheduler', ...packages],
  exclude: ['@storybook/blocks'],
}
```

**pnpm Hoisting:**
```ini
shamefully-hoist=true
auto-install-peers=true
public-hoist-pattern[]=*storybook*
```

## 🎯 Recommended Node.js Versions

| Version | Status | Notes |
|---------|--------|-------|
| **Node 18 LTS** | ✅ Recommended | Best compatibility with Storybook 7.6.x |
| **Node 20 LTS** | ✅ Supported | Also works well |
| Node 16 | ⚠️ EOL | End of life, not recommended |
| Node 22 | ❌ Not supported | Too new, Storybook not fully compatible yet |

## 🧪 Testing the Fixes

### Test 1: Storybook Starts

```bash
pnpm storybook
```

**Expected:** Storybook starts at http://localhost:6006 without errors

### Test 2: Components Load

Open browser to http://localhost:6006

**Expected:** Button and Card stories load without errors

### Test 3: Hot Reload Works

```bash
# Edit Button component
vim packages/button/src/Button.tsx
# Make a visible change
```

**Expected:** Changes appear in Storybook within ~100ms

### Test 4: Build Succeeds

```bash
pnpm build:storybook
```

**Expected:** Static build completes in `apps/storybook/storybook-static/`

## 🐛 Troubleshooting

### If Storybook Still Won't Start

**1. Completely clean and reinstall:**
```bash
# Remove EVERYTHING
rm -rf node_modules
rm -rf apps/storybook/node_modules
rm -rf packages/*/node_modules
rm -rf pnpm-lock.yaml

# Reinstall
pnpm install

# Try again
pnpm storybook
```

**2. Check Node.js version:**
```bash
node --version
# Should be v18.x.x or v20.x.x
```

**3. Verify .npmrc is in root:**
```bash
cat .npmrc
# Should show shamefully-hoist=true
```

**4. Check for port conflicts:**
```bash
lsof -i :6006
# If port is in use, kill the process or use different port
pnpm storybook -- --port 6007
```

### If Hot Reload Doesn't Work

**1. Check Vite config:**
```bash
cat apps/storybook/.storybook/main.ts
# Verify alias array syntax is correct
```

**2. Hard refresh browser:**
- Cmd+Shift+R (Mac)
- Ctrl+Shift+R (Windows)

**3. Restart Storybook:**
```bash
# Kill with Ctrl+C
pnpm storybook
```

### If Build Fails

**1. Check for TypeScript errors:**
```bash
pnpm typecheck
```

**2. Ensure packages are built:**
```bash
pnpm build
```

**3. Check for missing dependencies:**
```bash
pnpm install
```

## 📚 Additional Resources

### Storybook + Vite

- [Storybook Vite Builder](https://storybook.js.org/docs/react/builders/vite)
- [Vite Config Reference](https://vitejs.dev/config/)

### pnpm Workspaces

- [pnpm Workspace Documentation](https://pnpm.io/workspaces)
- [pnpm .npmrc Configuration](https://pnpm.io/npmrc)

### React 18

- [React 18 Release Notes](https://react.dev/blog/2022/03/29/react-v18)
- [Scheduler Package](https://www.npmjs.com/package/scheduler)

## 🎉 Summary

All Storybook build errors have been fixed:

✅ Added `scheduler` dependency
✅ Fixed Vite alias configuration (array syntax + regex)
✅ Configured pnpm hoisting (shamefully-hoist)
✅ Optimized dependency bundling
✅ Specified Node.js 18 LTS
✅ Preserved hot reload functionality

**To apply fixes:**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm storybook
```

Storybook should now start successfully with hot reload working!
