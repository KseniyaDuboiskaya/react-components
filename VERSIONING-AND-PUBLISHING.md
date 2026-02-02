# Versioning and Publishing with Changesets

This guide covers the complete workflow for versioning and publishing packages using **Changesets**, which provides:

✅ **Interactive semantic versioning** - Choose patch/minor/major for each change
✅ **Automatic dependency propagation** - When Button updates, Card auto-bumps
✅ **Changelog generation** - Automatic changelog creation
✅ **Safe publishing workflow** - Build, version, and publish in one command

## Table of Contents

1. [Quick Start](#quick-start)
2. [Understanding Changesets](#understanding-changesets)
3. [Complete Publishing Workflow](#complete-publishing-workflow)
4. [Automatic Dependency Propagation](#automatic-dependency-propagation)
5. [Advanced Scenarios](#advanced-scenarios)
6. [Installing in Consumer Apps](#installing-in-consumer-apps)
7. [Troubleshooting](#troubleshooting)

## Quick Start

### TL;DR - Publishing Workflow

```bash
# 1. Make your changes to code
# ... edit files ...

# 2. Create a changeset (interactive prompt)
pnpm changeset

# 3. Version packages (updates versions + changelogs)
pnpm version

# 4. Build and publish to npm
pnpm release
```

That's it! Changesets handles version bumps, dependency updates, and changelogs automatically.

## Understanding Changesets

### What is a Changeset?

A **changeset** is a declaration of intent to release changes. When you modify code:

1. **Create a changeset** - Describe what changed and the version bump type
2. **Version packages** - Changesets updates version numbers and changelogs
3. **Publish** - Publish updated packages to npm

### Why Changesets?

- **Interactive prompts** - Choose patch/minor/major when creating changesets
- **Dependency tracking** - Automatically bumps dependent packages
- **Changelog generation** - Creates CHANGELOG.md files automatically
- **Batching releases** - Multiple changesets can be combined into one release
- **Safety** - Prevents accidental breaking changes

## Complete Publishing Workflow

### Prerequisites (One Time)

```bash
# 1. Ensure you have an npm account
# Sign up at: https://www.npmjs.com/signup

# 2. Login to npm
npm login

# 3. Verify authentication
npm whoami
```

### Step 1: Make Code Changes

Edit your component code as needed:

```bash
# Example: Update the Button component
vim packages/button/src/Button.tsx
```

### Step 2: Create a Changeset

After making changes, create a changeset:

```bash
pnpm changeset
```

**This will prompt you with:**

```
🦋  Which packages would you like to include?
❯ ◉ @kseniya333/button
  ◯ @kseniya333/card
```

**Select the package(s) you modified**, then:

```
🦋  What kind of change is this for @kseniya333/button?
❯ patch   (0.0.X) - Bug fixes
  minor   (0.X.0) - New features (backwards compatible)
  major   (X.0.0) - Breaking changes
```

**Choose the appropriate version bump:**

- **patch** (1.0.0 → 1.0.1) - Bug fixes, minor tweaks
- **minor** (1.0.0 → 1.1.0) - New features, no breaking changes
- **major** (1.0.0 → 2.0.0) - Breaking changes

Then enter a summary:

```
🦋  Please enter a summary for this change:
› Fixed button hover animation issue
```

**This creates a file** in `.changeset/` directory like `.changeset/orange-cats-smile.md`:

```markdown
---
"@kseniya333/button": patch
---

Fixed button hover animation issue
```

### Step 3: Commit the Changeset

```bash
git add .changeset/orange-cats-smile.md
git add packages/button/src/Button.tsx
git commit -m "fix: button hover animation"
```

**Important:** Commit the changeset file along with your code changes.

### Step 4: Version Packages

When ready to release, consume all changesets:

```bash
pnpm version
```

**This command does:**

1. ✅ Reads all changeset files in `.changeset/`
2. ✅ Updates `version` in package.json files
3. ✅ Updates dependency versions (if Button changed, Card's dependency updates)
4. ✅ Generates/updates CHANGELOG.md files
5. ✅ Deletes consumed changeset files
6. ✅ Updates pnpm-lock.yaml

**Example output:**

```
🦋  All files have been updated. Review them and commit at your leisure
🦋
🦋  @kseniya333/button@1.0.1
🦋  @kseniya333/card@1.0.1 (dependency update)
```

**Review the changes:**

```bash
git diff
```

You'll see:
- Updated versions in `package.json`
- New CHANGELOG.md entries
- Updated dependency versions in Card's package.json

### Step 5: Commit Version Changes

```bash
git add .
git commit -m "chore: version packages"
```

### Step 6: Build and Publish

```bash
pnpm release
```

**This command:**

1. ✅ Builds all packages (`pnpm build`)
2. ✅ Publishes to npm (`changeset publish`)
3. ✅ Creates git tags for each version

**Example output:**

```
🦋  info npm info @kseniya333/button
🦋  info npm info @kseniya333/card
🦋  success packages published successfully:
🦋  @kseniya333/button@1.0.1
🦋  @kseniya333/card@1.0.1
🦋  Creating git tag...
```

### Step 7: Push to Git

```bash
git push
git push --tags
```

**Done!** Your packages are now published to npm and tagged in git.

## Automatic Dependency Propagation

### How It Works

The `.changeset/config.json` file contains:

```json
{
  "updateInternalDependencies": "patch"
}
```

This means: **When a package is updated, all packages that depend on it automatically get a patch version bump.**

### Example Scenario

**Scenario:** You update the Button component with a bug fix.

#### Step 1: Create Changeset

```bash
pnpm changeset
```

Select **only** Button with a **patch** bump:

```
🦋  Which packages would you like to include?
❯ ◉ @kseniya333/button
  ◯ @kseniya333/card

🦋  What kind of change is this for @kseniya333/button?
❯ patch
```

#### Step 2: Version

```bash
pnpm version
```

**Changesets automatically:**

1. **Button**: 1.0.0 → 1.0.1 (patch bump as specified)
2. **Card**: 1.0.0 → 1.0.1 (automatic patch bump because it depends on Button)
3. **Card's dependency**: Updates `@kseniya333/button` from `^1.0.0` to `^1.0.1`

**packages/button/package.json:**
```json
{
  "version": "1.0.1"
}
```

**packages/card/package.json:**
```json
{
  "version": "1.0.1",
  "dependencies": {
    "@kseniya333/button": "^1.0.1"
  }
}
```

**packages/card/CHANGELOG.md:**
```markdown
## 1.0.1

### Patch Changes

- Updated dependencies:
  - @kseniya333/button@1.0.1
```

#### Step 3: Publish

```bash
pnpm release
```

**Both Button and Card are published** with updated versions and correct dependencies.

### Multiple Changes Example

**Scenario:** Update Button (minor) and Card (patch) in one release.

```bash
# Change Button component
vim packages/button/src/Button.tsx

# Create changeset for Button
pnpm changeset
# Select: Button → minor → "Added new size prop"

# Change Card component
vim packages/card/src/Card.tsx

# Create changeset for Card
pnpm changeset
# Select: Card → patch → "Fixed footer styling"

# Version everything
pnpm version
```

**Result:**
- Button: 1.0.0 → 1.1.0 (minor bump)
- Card: 1.0.0 → 1.0.1 (patch bump) + dependency update to Button 1.1.0

## Advanced Scenarios

### Publishing Individual Packages

If you only want to publish one package:

```bash
# Create changeset for Button only
pnpm changeset
# Select only Button

# Version
pnpm version

# Publish only Button
cd packages/button
npm publish

# Later, publish Card if it was also bumped
cd packages/card
npm publish
```

### Beta/Preview Releases

For pre-release versions:

```bash
# Enter pre-release mode
pnpm changeset pre enter beta

# Create changesets as normal
pnpm changeset

# Version (creates beta versions like 1.1.0-beta.0)
pnpm version

# Publish with beta tag
pnpm release

# Exit pre-release mode when done
pnpm changeset pre exit
```

### Checking Package Status

See what packages will be published:

```bash
pnpm changeset status
```

Output shows:
- Which packages have changesets
- What version they'll become
- Which dependents will be updated

### Force Bump Without Publishing

To bump versions without publishing:

```bash
pnpm version
git add .
git commit -m "chore: version packages"
# Don't run pnpm release yet
```

Later, publish manually:

```bash
pnpm build
cd packages/button
npm publish
cd ../card
npm publish
```

### Overriding Dependency Bump Type

By default, dependents get `patch` bumps. To change:

**.changeset/config.json:**
```json
{
  "updateInternalDependencies": "minor"
}
```

Options: `"patch"`, `"minor"`, or `false` (no auto-bump).

### Linked Packages

To always release packages together at the same version:

**.changeset/config.json:**
```json
{
  "linked": [
    ["@kseniya333/button", "@kseniya333/card"]
  ]
}
```

Now Button and Card will always have the same version number.

## Installing in Consumer Apps

### After Publishing

Once published, any React app can install your packages:

```bash
# Using npm
npm install @kseniya333/button @kseniya333/card

# Using yarn
yarn add @kseniya333/button @kseniya333/card

# Using pnpm
pnpm add @kseniya333/button @kseniya333/card
```

### Verify Published Versions

Check what's available on npm:

```bash
npm view @kseniya333/button versions
npm view @kseniya333/card versions
```

### Install Specific Versions

```bash
npm install @kseniya333/button@1.0.1
npm install @kseniya333/card@1.1.0
```

### Using in Code

```tsx
import React from 'react';
import { Button } from '@kseniya333/button';
import { Card } from '@kseniya333/card';
import '@kseniya333/button/style.css';
import '@kseniya333/card/style.css';

function App() {
  return (
    <Card
      header="Hello World"
      content="This card uses the Button component from the library"
      actions={[
        {
          label: 'Click Me',
          variant: 'primary',
          onClick: () => alert('Clicked!'),
        },
      ]}
    />
  );
}

export default App;
```

### Consumer App Package.json

Your consumer app's `package.json` will look like:

```json
{
  "dependencies": {
    "@kseniya333/button": "^1.0.1",
    "@ai-components/card": "^1.0.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

**Important:** Card has Button as a dependency, so Button will be automatically installed when you install Card. However, it's still good practice to explicitly list both in your dependencies.

### Updating Packages

Update to latest versions:

```bash
npm update @kseniya333/button @kseniya333/card
```

Or update to specific version:

```bash
npm install @kseniya333/button@latest @kseniya333/card@latest
```

## Troubleshooting

### Changeset Command Not Found

```bash
# Install changesets
pnpm add -D -w @changesets/cli
```

### No Packages Selected Error

When running `pnpm changeset`, you must select at least one package. Use space bar to select, then enter to continue.

### Dependency Not Updating

Make sure `.changeset/config.json` has:

```json
{
  "updateInternalDependencies": "patch"
}
```

And ensure packages use `workspace:*` protocol in package.json during development:

```json
{
  "dependencies": {
    "@kseniya333/button": "workspace:*"
  }
}
```

Changesets automatically converts `workspace:*` to actual versions during publishing.

### Published Package Has Wrong Dependency Version

If Card is published with an old Button version:

1. Delete node_modules and lockfile
2. Run `pnpm install`
3. Run `pnpm version` again
4. Check generated versions before publishing

### Can't Publish - Not Logged In

```bash
npm login
npm whoami
```

### Can't Publish - 404 Error

This means the package name is taken or doesn't exist. For scoped packages:

```bash
npm publish --access public
```

Or add to package.json:

```json
{
  "publishConfig": {
    "access": "public"
  }
}
```

### Git Tags Not Pushing

```bash
git push --tags
```

### Want to Undo a Version Bump

If you ran `pnpm version` but didn't publish yet:

```bash
git reset --hard HEAD~1
```

**Warning:** This removes the version commit. Only use before publishing.

## Summary of Commands

| Command | Description |
|---------|-------------|
| `pnpm changeset` | Create a new changeset (interactive) |
| `pnpm changeset status` | See which packages will be released |
| `pnpm version` | Consume changesets and bump versions |
| `pnpm release` | Build and publish all packages |
| `pnpm changeset pre enter beta` | Enter pre-release mode |
| `pnpm changeset pre exit` | Exit pre-release mode |

## Best Practices

1. **Create changesets frequently** - One per logical change
2. **Commit changesets with code** - Keep them together
3. **Review version changes** - Check git diff after `pnpm version`
4. **Use semantic versioning correctly**:
   - patch: Bug fixes only
   - minor: New features, backwards compatible
   - major: Breaking changes
5. **Test before publishing** - Run `pnpm build` and `pnpm typecheck`
6. **Tag releases in git** - Use `git push --tags`
7. **Document breaking changes** - Add migration guides for major versions

## CI/CD Integration

### GitHub Actions Example

**.github/workflows/release.yml:**

```yaml
name: Release

on:
  push:
    branches:
      - main

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Create Release Pull Request or Publish
        uses: changesets/action@v1
        with:
          publish: pnpm release
          version: pnpm version
          commit: 'chore: version packages'
          title: 'chore: version packages'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

This workflow:
1. Detects changesets on main branch
2. Creates a PR to bump versions
3. When PR is merged, automatically publishes to npm

---

**Ready to publish?** Start with `pnpm changeset` and follow the interactive prompts!
