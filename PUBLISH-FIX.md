# Publishing Fix - Workspace Protocol Resolution Error

## 🐛 The Error

```
ERR_PNPM_CANNOT_RESOLVE_WORKSPACE_PROTOCOL
Cannot resolve workspace protocol of dependency "@kseniya333/button" because this dependency is not installed.
```

**What happened:**
1. Button published successfully ✅
2. Card failed to publish ❌
3. Card couldn't resolve `workspace:*` dependency on Button

## 🔍 Root Cause

The `version` script was using `pnpm install --lockfile-only`:

```json
"version": "changeset version && pnpm install --lockfile-only"
```

**The problem:**
- `--lockfile-only` updates only `pnpm-lock.yaml`
- It does NOT update `node_modules/`
- Card's dependency on Button stayed as `workspace:*`
- When publishing, changesets couldn't resolve the workspace protocol

## ✅ The Fix

### Fix 1: Updated Version Script

**Changed:**
```json
"version": "changeset version && pnpm install"
```

**Why this fixes it:**
- Full install updates both lockfile AND node_modules
- pnpm resolves `workspace:*` to actual package symlinks
- Changesets can now convert workspace protocol during publish

### Fix 2: Updated Package Names

Updated all references from `@ai-components/*` to `@kseniya333/*`:

**Files updated:**
- `apps/storybook/.storybook/main.ts` - Vite aliases
- `apps/storybook/tsconfig.json` - TypeScript paths
- `apps/storybook/src/stories/Button.stories.tsx` - Import
- `apps/storybook/src/stories/Card.stories.tsx` - Import

## 🚀 How to Fix Current State

Since Button was published but Card wasn't, you need to:

### Option 1: Retry Publishing Card Only (Recommended)

```bash
# 1. Clean up the failed state
git reset --hard HEAD~1  # Remove the version commit if you made one

# 2. Run full install
pnpm install

# 3. Try publishing again
pnpm release
```

### Option 2: Start Fresh with New Changeset

```bash
# 1. If Button is already on npm at 1.0.0, that's fine
# Button is published: @kseniya333/button@1.0.0 ✅

# 2. Remove any existing changesets
rm -rf .changeset/*.md

# 3. Create new changeset for Card only
pnpm changeset
# Select: Only Card
# Choose: patch (or whatever you want)
# Summary: "Initial release"

# 4. Version packages
pnpm version
# This will bump Card and run full install

# 5. Commit
git add .
git commit -m "chore: version card"

# 6. Publish
pnpm release
```

### Option 3: Manual Fix (If Options 1-2 Don't Work)

```bash
# 1. Manually update Card's dependency
# Edit packages/card/package.json
# Change:
#   "@kseniya333/button": "workspace:*"
# To:
#   "@kseniya333/button": "^1.0.0"

# 2. Reinstall
pnpm install

# 3. Publish Card only
cd packages/card
npm publish --access public

# 4. Then update Card's package.json back to workspace:*
# Change back to:
#   "@kseniya333/button": "workspace:*"

# 5. Reinstall and commit
pnpm install
git add .
git commit -m "chore: published card"
```

## 📋 Complete Publishing Workflow (Going Forward)

### Step 1: Make Changes

```bash
vim packages/button/src/Button.tsx
```

### Step 2: Create Changeset

```bash
pnpm changeset
# Follow interactive prompts
```

### Step 3: Commit Changeset

```bash
git add .changeset/*.md
git add <your-changed-files>
git commit -m "feat: your feature"
```

### Step 4: Version Packages

```bash
pnpm version
```

**This now does:**
1. `changeset version` - Updates versions, dependencies, changelogs
2. `pnpm install` - **Full install** (not --lockfile-only)
3. Resolves workspace protocols properly

### Step 5: Review and Commit

```bash
git diff
git add .
git commit -m "chore: version packages"
```

### Step 6: Build and Publish

```bash
pnpm release
```

**This does:**
1. `pnpm build` - Builds all packages
2. `changeset publish` - Publishes to npm

### Step 7: Push with Tags

```bash
git push
git push --tags
```

## 🧪 Verify the Fix

### Test Version Script

```bash
# Create a test changeset
pnpm changeset
# Select Button, patch, "test change"

# Run version
pnpm version

# Check that node_modules updated
ls -la node_modules/@kseniya333/
# Should show:
# button -> ../../packages/button
# card -> ../../packages/card

# Check Card's dependency is still workspace:*
cat packages/card/package.json | grep "@kseniya333/button"
# Should show: "@kseniya333/button": "workspace:*"

# Clean up test
git reset --hard HEAD
rm -rf .changeset/*.md
```

## 🔧 Why Each Fix Was Needed

### 1. Version Script Fix

**Before:**
```bash
changeset version && pnpm install --lockfile-only
                     ↓
                Updates lockfile only
                     ↓
                node_modules not updated
                     ↓
                workspace:* not resolved
                     ↓
                Publish fails ❌
```

**After:**
```bash
changeset version && pnpm install
                     ↓
                Full install
                     ↓
                node_modules updated
                     ↓
                workspace:* resolved to symlinks
                     ↓
                Changesets can convert during publish
                     ↓
                Publish succeeds ✅
```

### 2. Package Name Updates

Updated all references to use `@kseniya333/*` for consistency with your npm scope.

## 📊 What Gets Updated During Version

When you run `pnpm version`:

1. **Changesets updates package.json versions:**
   - `packages/button/package.json`: `"version": "1.0.1"`
   - `packages/card/package.json`: `"version": "1.0.1"`

2. **Changesets updates dependencies:**
   - Card still has: `"@kseniya333/button": "workspace:*"`
   - This is CORRECT for development

3. **Full install resolves workspace:**
   - Creates symlink: `node_modules/@kseniya333/button → packages/button`
   - pnpm knows where to find Button

4. **During publish, changesets converts:**
   - Temporary: `"@kseniya333/button": "^1.0.1"` (for npm)
   - After publish: Reverts to `"workspace:*"` (in your code)

## 🎯 Key Takeaway

**Never use `--lockfile-only` in the version script when using changesets with workspace dependencies.**

The version script must do a full install so pnpm can resolve workspace protocols before changesets publishes.

## 📚 References

- [Changesets with pnpm](https://pnpm.io/using-changesets)
- [Workspace Protocol](https://pnpm.io/workspaces#workspace-protocol-workspace)
- [Changesets Publishing](https://github.com/changesets/changesets/blob/main/docs/common-questions.md)

---

**Your fix is applied! Follow Option 1 or 2 above to complete the Card publish.**
