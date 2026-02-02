# Hot Reload Setup for Storybook

This monorepo is configured for **instant hot reload** in Storybook. When you edit component source files, Storybook updates automatically without rebuilding.

## ✅ What's Configured

### 1. Source Linking (Not Dist Imports)

Storybook imports directly from **source files** (`src/`), not built files (`dist/`).

```
Before: @kseniya333/button → packages/button/dist/button.es.js (requires rebuild)
After:  @kseniya333/button → packages/button/src/index.ts (instant HMR)
```

### 2. Vite Aliases

**File:** `apps/storybook/.storybook/main.ts`

```typescript
resolve: {
  alias: {
    '@kseniya333/button': resolve(__dirname, '../../../packages/button/src/index.ts'),
    '@kseniya333/card': resolve(__dirname, '../../../packages/card/src/index.ts'),
  },
  preserveSymlinks: true,
}
```

**What this does:**
- Maps package imports to source files
- Preserves workspace symlinks for proper resolution
- Enables Vite's HMR (Hot Module Replacement)

### 3. Filesystem Access

```typescript
server: {
  fs: {
    allow: [
      resolve(__dirname, '../../../'),
    ],
  },
}
```

**What this does:**
- Allows Vite to serve files from workspace root
- Enables access to all packages in the monorepo
- Required for reading source files outside Storybook's directory

### 4. Dependency Optimization

```typescript
optimizeDeps: {
  include: ['@kseniya333/button', '@kseniya333/card'],
}
```

**What this does:**
- Pre-bundles workspace packages correctly
- Ensures proper HMR behavior
- Optimizes initial load time

### 5. TypeScript Path Mapping

**File:** `apps/storybook/tsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@kseniya333/button": ["../../packages/button/src/index.ts"],
      "@kseniya333/card": ["../../packages/card/src/index.ts"]
    }
  }
}
```

**What this does:**
- TypeScript understands the source aliases
- Provides intellisense and type checking
- Matches Vite's runtime resolution

### 6. Direct CSS Imports

**File:** `apps/storybook/.storybook/preview.ts`

```typescript
import '../../../packages/button/src/Button.css';
import '../../../packages/card/src/Card.css';
```

**What this does:**
- Imports CSS directly from source
- Enables CSS hot reload
- No need to rebuild for style changes

## 🚀 How to Use

### Start Storybook with Hot Reload

```bash
# From root directory
pnpm storybook
```

Storybook starts at `http://localhost:6006` with hot reload enabled.

### Edit Components

```bash
# Edit Button component
vim packages/button/src/Button.tsx
```

**Result:** Storybook updates instantly - no rebuild needed!

### Edit Styles

```bash
# Edit Button styles
vim packages/button/src/Button.css
```

**Result:** Styles update instantly in Storybook!

### What Gets Hot Reloaded

✅ **Component logic** (`.tsx` files)
✅ **Component styles** (`.css` files)
✅ **TypeScript types** (`.ts` files)
✅ **Imports between packages** (Button changes reflect in Card)

## 🔥 How Hot Reload Works

### The Flow

```
1. You edit: packages/button/src/Button.tsx
                    ↓
2. Vite detects file change
                    ↓
3. Vite's HMR sends update to browser
                    ↓
4. React Fast Refresh updates component
                    ↓
5. Storybook re-renders - state preserved!
```

### Traditional vs Hot Reload

**Without Hot Reload (Old Way):**
```
Edit component → Run build → Wait 10-30s → Refresh browser → Lost state
```

**With Hot Reload (New Way):**
```
Edit component → Instant update (~100ms) → State preserved
```

## 🎯 Development Workflow

### Option 1: Storybook Only (Recommended)

```bash
# Start Storybook with hot reload
pnpm storybook

# Edit components - instant updates!
vim packages/button/src/Button.tsx
vim packages/card/src/Card.css
```

**No build step needed!** Changes appear instantly.

### Option 2: Storybook + Watch Build

If you need built packages for other reasons:

```bash
# Terminal 1: Watch build packages
pnpm dev

# Terminal 2: Run Storybook
pnpm storybook
```

Storybook still uses source files, but packages are built in parallel.

### Option 3: Production Build Test

To test the built packages:

```bash
# Build packages
pnpm build

# Temporarily disable aliases to test dist files
# (Edit .storybook/main.ts and comment out aliases)

# Run Storybook
pnpm storybook
```

## 📁 File Structure

```
ai-component-library/
├── packages/
│   ├── button/
│   │   ├── src/
│   │   │   ├── Button.tsx      ← Storybook imports from here
│   │   │   ├── Button.css      ← Direct CSS import
│   │   │   └── index.ts
│   │   └── dist/               ← Not used by Storybook
│   │       └── button.es.js
│   └── card/
│       ├── src/
│       │   ├── Card.tsx        ← Storybook imports from here
│       │   ├── Card.css        ← Direct CSS import
│       │   └── index.ts
│       └── dist/               ← Not used by Storybook
│           └── card.es.js
└── apps/
    └── storybook/
        ├── .storybook/
        │   ├── main.ts         ← Vite config with aliases
        │   └── preview.ts      ← CSS imports
        └── src/stories/
            ├── Button.stories.tsx
            └── Card.stories.tsx
```

## 🔧 Configuration Files

### 1. Storybook Main Config

**Location:** `apps/storybook/.storybook/main.ts`

```typescript
import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import { resolve } from 'path';

const config: StorybookConfig = {
  // ... other config
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@kseniya333/button': resolve(__dirname, '../../../packages/button/src/index.ts'),
          '@kseniya333/card': resolve(__dirname, '../../../packages/card/src/index.ts'),
        },
        preserveSymlinks: true,
      },
      server: {
        fs: {
          allow: [resolve(__dirname, '../../../')],
        },
      },
      optimizeDeps: {
        include: ['@kseniya333/button', '@kseniya333/card'],
      },
    });
  },
};

export default config;
```

### 2. Storybook Preview Config

**Location:** `apps/storybook/.storybook/preview.ts`

```typescript
import type { Preview } from '@storybook/react';
// Import CSS directly from source for hot reload
import '../../../packages/button/src/Button.css';
import '../../../packages/card/src/Card.css';

const preview: Preview = {
  // ... parameters
};

export default preview;
```

### 3. TypeScript Config

**Location:** `apps/storybook/tsconfig.json`

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@kseniya333/button": ["../../packages/button/src/index.ts"],
      "@kseniya333/card": ["../../packages/card/src/index.ts"]
    }
  }
}
```

## 🧪 Testing Hot Reload

### Test 1: Component Logic

```bash
# Start Storybook
pnpm storybook

# Edit Button component
# Change line 38 from {children} to {children}!!!
vim packages/button/src/Button.tsx

# Check Storybook - should update instantly
```

### Test 2: Styles

```bash
# Edit Button CSS
# Change background-color in .ai-button--primary
vim packages/button/src/Button.css

# Check Storybook - colors update instantly
```

### Test 3: Cross-Package

```bash
# Edit Button component
vim packages/button/src/Button.tsx

# Check Card stories - Card uses Button, should update too!
```

## 📊 Performance

**Initial Storybook Load:**
- ~2-3 seconds (same as before)

**Component Edit → Update:**
- **~100-200ms** (instant)
- State preserved
- No full reload

**CSS Edit → Update:**
- **~50-100ms** (instant)
- No component remount

**Traditional Build → Refresh:**
- **10-30 seconds** (slow)
- State lost
- Full page reload

## 🎨 What Changes Trigger Hot Reload

| Change Type | Hot Reload | Notes |
|-------------|-----------|-------|
| Component logic (.tsx) | ✅ Yes | Instant update, state preserved |
| Component styles (.css) | ✅ Yes | Instant style update |
| TypeScript types (.ts) | ✅ Yes | Types update, intellisense refreshes |
| Props/interface changes | ✅ Yes | Component re-renders with new props |
| New exports | ⚠️ Manual | Restart Storybook for new exports |
| Package.json changes | ⚠️ Manual | Restart Storybook |
| Storybook config | ⚠️ Manual | Restart Storybook |

## 🐛 Troubleshooting

### Hot Reload Not Working

**Check 1: Verify Storybook is running**
```bash
pnpm storybook
```

**Check 2: Check browser console for errors**
- Look for HMR connection errors
- Check for Vite errors

**Check 3: Verify file paths**
```bash
ls packages/button/src/Button.tsx
ls packages/card/src/Card.tsx
```

**Check 4: Restart Storybook**
```bash
# Kill Storybook (Ctrl+C)
pnpm storybook
```

### Changes Not Appearing

**Solution 1: Hard refresh**
- Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

**Solution 2: Clear browser cache**
- Open DevTools → Network → Disable cache

**Solution 3: Check if you edited the right file**
```bash
# Make sure you're editing src/, not dist/
vim packages/button/src/Button.tsx  # ✅ Correct
vim packages/button/dist/button.es.js  # ❌ Wrong
```

### TypeScript Errors

If you see import errors:

```bash
# Restart TypeScript server in your editor
# VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### Storybook Won't Start

**Check for port conflicts:**
```bash
lsof -i :6006
kill -9 <PID>
```

**Check for dependency issues:**
```bash
pnpm install
```

## 🔄 Comparing to Other Setups

### Setup Comparison

| Approach | Hot Reload | Build Speed | State Preserved |
|----------|-----------|-------------|----------------|
| **Source imports (this)** | ✅ Instant | N/A | ✅ Yes |
| Watch build + dist imports | ⚠️ Slow | 10-30s | ❌ No |
| Manual build + refresh | ❌ No | 10-30s | ❌ No |

## 📚 Additional Resources

### Adding New Packages

When you add a new package, update:

**1. Storybook main.ts:**
```typescript
alias: {
  '@ai-components/new-package': resolve(__dirname, '../../../packages/new-package/src/index.ts'),
}
```

**2. Storybook tsconfig.json:**
```json
"paths": {
  "@ai-components/new-package": ["../../packages/new-package/src/index.ts"]
}
```

**3. Storybook preview.ts (if has CSS):**
```typescript
import '../../../packages/new-package/src/NewPackage.css';
```

### Vite HMR API

Storybook uses Vite's HMR under the hood:
- [Vite HMR API](https://vitejs.dev/guide/api-hmr.html)
- [React Fast Refresh](https://github.com/facebook/react/tree/main/packages/react-refresh)

### Storybook Vite

- [Storybook Vite Documentation](https://storybook.js.org/docs/react/builders/vite)
- [Storybook viteFinal](https://storybook.js.org/docs/react/builders/vite#configuration)

## 🎉 Summary

Your Storybook now has **instant hot reload**:

✅ Edit `.tsx` files → Instant update
✅ Edit `.css` files → Instant update
✅ Edit TypeScript types → Instant update
✅ Component state preserved
✅ No rebuild required
✅ No manual refresh needed

**Just run `pnpm storybook` and start editing!**
