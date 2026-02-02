# Changesets Quick Reference

Fast reference for the most common versioning and publishing workflow.

## One-Time Setup

```bash
# Login to npm (do this once)
npm login
npm whoami
```

## Standard Publishing Workflow

### 1. Make Changes

```bash
# Edit your components
vim packages/button/src/Button.tsx
```

### 2. Create Changeset (Interactive)

```bash
pnpm changeset
```

**Interactive Prompts:**

```
🦋  Which packages would you like to include?
❯ ◉ @kseniya333/button    [Space to select]
  ◯ @kseniya333/card      [Enter when done]

🦋  What kind of change is this for @kseniya333/button?
❯ patch   - Bug fixes (1.0.0 → 1.0.1)
  minor   - New features (1.0.0 → 1.1.0)
  major   - Breaking changes (1.0.0 → 2.0.0)

🦋  Please enter a summary for this change:
› Fixed button hover animation
```

Creates: `.changeset/some-random-name.md`

### 3. Commit Changes

```bash
git add .
git commit -m "fix: button hover animation"
```

### 4. Version Packages

```bash
pnpm version
```

**What happens:**
- ✅ Updates version in package.json
- ✅ Auto-bumps dependent packages (Card gets bumped when Button changes)
- ✅ Updates dependency versions
- ✅ Generates CHANGELOG.md
- ✅ Deletes consumed changeset files

### 5. Review & Commit

```bash
git diff  # Review version changes
git add .
git commit -m "chore: version packages"
```

### 6. Build & Publish

```bash
pnpm release
```

**What happens:**
- ✅ Builds all packages
- ✅ Publishes to npm
- ✅ Creates git tags

### 7. Push

```bash
git push
git push --tags
```

## Automatic Dependency Propagation

When **Button** is updated, **Card** automatically bumps too!

### Example

```bash
# 1. Change Button
vim packages/button/src/Button.tsx

# 2. Create changeset for Button ONLY
pnpm changeset
# Select: Button → patch → "Fixed bug"

# 3. Version
pnpm version
```

**Result:**
```
🦋  @kseniya333/button@1.0.1
🦋  @kseniya333/card@1.0.1    ← Auto-bumped!
```

**Card's package.json automatically updates:**
```json
{
  "version": "1.0.1",
  "dependencies": {
    "@kseniya333/button": "^1.0.1"  // Updated!
  }
}
```

## Version Bump Types

| Type | When to Use | Example |
|------|-------------|---------|
| **patch** | Bug fixes, small tweaks | Fixed hover animation |
| **minor** | New features (backwards compatible) | Added size prop |
| **major** | Breaking changes | Changed API, removed props |

## Common Scenarios

### Scenario 1: Bug Fix in Button

```bash
pnpm changeset  # Select Button → patch
pnpm version
pnpm release
```

Result:
- Button: 1.0.0 → 1.0.1
- Card: 1.0.0 → 1.0.1 (auto)

### Scenario 2: New Feature in Card

```bash
pnpm changeset  # Select Card → minor
pnpm version
pnpm release
```

Result:
- Button: No change
- Card: 1.0.0 → 1.1.0

### Scenario 3: Update Both

```bash
# Change Button
pnpm changeset  # Button → minor

# Change Card
pnpm changeset  # Card → patch

pnpm version
pnpm release
```

Result:
- Button: 1.0.0 → 1.1.0
- Card: 1.0.0 → 1.0.1 + dependency to Button 1.1.0

### Scenario 4: Breaking Change in Button

```bash
pnpm changeset  # Button → major
pnpm version
pnpm release
```

Result:
- Button: 1.0.0 → 2.0.0
- Card: 1.0.0 → 1.0.1 (auto) + dependency to Button 2.0.0

## Useful Commands

```bash
# Check what will be released
pnpm changeset status

# Create changeset
pnpm changeset

# Apply versions
pnpm version

# Build and publish
pnpm release

# Check npm packages
npm view @kseniya333/button versions
npm view @kseniya333/card versions

# Check who you're logged in as
npm whoami
```

## Consumer Installation

After publishing, anyone can install:

```bash
npm install @kseniya333/button @ai-components/card
```

Usage:
```tsx
import { Button } from '@kseniya333/button';
import { Card } from '@kseniya333/card';
import '@kseniya333/button/style.css';
import '@kseniya333/card/style.css';

<Card
  header="Title"
  content="Content"
  actions={[
    { label: 'Action', variant: 'primary', onClick: () => {} }
  ]}
/>
```

## Troubleshooting

**Changesets not installed?**
```bash
pnpm add -D -w @changesets/cli
```

**Not logged in to npm?**
```bash
npm login
```

**Want to see what changed?**
```bash
git diff
```

**Want to undo a version bump?** (before publishing)
```bash
git reset --hard HEAD~1
```

**Dependency not auto-updating?**

Check `.changeset/config.json`:
```json
{
  "updateInternalDependencies": "patch"
}
```

## Files Created by Changesets

```
.changeset/
├── config.json              # Configuration
├── README.md               # Auto-generated help
└── random-name.md          # Your changeset (deleted after versioning)

packages/button/
├── CHANGELOG.md            # Auto-generated
└── package.json            # Version updated

packages/card/
├── CHANGELOG.md            # Auto-generated
└── package.json            # Version + dependency updated
```

## Complete Example Session

```bash
# 1. Make changes
vim packages/button/src/Button.tsx

# 2. Create changeset
pnpm changeset
# → Select Button
# → Choose patch
# → Enter "Fixed hover bug"

# 3. Commit
git add .
git commit -m "fix: button hover"

# 4. Version
pnpm version

# 5. Review
git diff
git log -1

# 6. Commit versions
git add .
git commit -m "chore: version packages"

# 7. Publish
pnpm release

# 8. Push
git push && git push --tags

# Done! 🎉
```

---

See [VERSIONING-AND-PUBLISHING.md](./VERSIONING-AND-PUBLISHING.md) for detailed documentation.
