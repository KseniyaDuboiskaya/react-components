# Changesets

This directory contains changeset files that declare intent to release packages.

## Quick Start

### Creating a Changeset

When you make changes to a package, create a changeset:

```bash
pnpm changeset
```

This will prompt you to:
1. Select which packages changed
2. Choose version bump type (patch/minor/major)
3. Write a summary of changes

### What Happens Next

1. **Changeset created** - A markdown file is created in `.changeset/`
2. **Commit it** - Commit the changeset file with your code changes
3. **Version packages** - Run `pnpm version` to consume changesets
4. **Publish** - Run `pnpm release` to publish to npm

## Automatic Dependency Updates

This project is configured with `"updateInternalDependencies": "patch"` in `.changeset/config.json`.

**This means:** When `@kseniya333/button` is updated, `@kseniya333/button` (which depends on Button) will automatically:
- Get a patch version bump
- Have its Button dependency version updated

### Example

You update Button with a minor change:

```bash
pnpm changeset
# Select: @kseniya333/button → minor
```

When you run `pnpm version`:
- Button: 1.0.0 → 1.1.0 (your choice)
- Card: 1.0.0 → 1.0.1 (automatic patch bump)
- Card's dependency: `"@kseniya333/button": "^1.1.0"` (automatically updated)

## Commands

```bash
# Create a new changeset (interactive)
pnpm changeset

# See what packages will be released
pnpm changeset status

# Consume changesets and update versions
pnpm version

# Build and publish packages
pnpm release
```

## Workflow

```
┌─────────────────────────────────────────────────────────┐
│ 1. MAKE CHANGES                                         │
│    Edit your component code                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 2. CREATE CHANGESET                                     │
│    $ pnpm changeset                                     │
│    → Select packages                                    │
│    → Choose patch/minor/major                           │
│    → Write summary                                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 3. COMMIT CHANGESET                                     │
│    $ git add .                                          │
│    $ git commit -m "fix: your change"                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 4. VERSION PACKAGES                                     │
│    $ pnpm version                                       │
│    ✅ Updates package.json versions                    │
│    ✅ Auto-bumps dependent packages                    │
│    ✅ Updates dependency versions                      │
│    ✅ Generates CHANGELOGs                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 5. COMMIT VERSIONS                                      │
│    $ git add .                                          │
│    $ git commit -m "chore: version packages"            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 6. BUILD & PUBLISH                                      │
│    $ pnpm release                                       │
│    ✅ Builds all packages                              │
│    ✅ Publishes to npm                                 │
│    ✅ Creates git tags                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 7. PUSH TO GIT                                          │
│    $ git push && git push --tags                        │
└─────────────────────────────────────────────────────────┘
```

## Version Bump Guidelines

| Type | Semver | When to Use |
|------|--------|-------------|
| **patch** | 1.0.0 → 1.0.1 | Bug fixes, documentation, internal changes |
| **minor** | 1.0.0 → 1.1.0 | New features, backwards compatible |
| **major** | 1.0.0 → 2.0.0 | Breaking changes, API changes |

## Configuration

See `.changeset/config.json` for configuration options:

```json
{
  "access": "public",                    // Publish as public packages
  "updateInternalDependencies": "patch", // Auto-bump dependents with patch
  "baseBranch": "main"                   // Base branch for changes
}
```

## Learn More

- [VERSIONING-AND-PUBLISHING.md](../VERSIONING-AND-PUBLISHING.md) - Complete guide
- [CHANGESET-QUICKREF.md](../CHANGESET-QUICKREF.md) - Quick reference
- [Changesets Documentation](https://github.com/changesets/changesets)
