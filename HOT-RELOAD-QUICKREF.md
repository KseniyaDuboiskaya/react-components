# Hot Reload Quick Reference

## 🚀 Start Development

```bash
# Start Storybook with hot reload
pnpm storybook
```

That's it! No build step needed.

## ✏️ Edit Components

**Edit any file and see instant updates:**

```bash
# Edit Button component
vim packages/button/src/Button.tsx

# Edit Button styles
vim packages/button/src/Button.css

# Edit Card component
vim packages/card/src/Card.tsx

# Edit Card styles
vim packages/card/src/Card.css
```

**Changes appear in ~100ms!**

## ✅ What's Hot Reloaded

| File Type | Hot Reload | Speed |
|-----------|-----------|-------|
| `.tsx` files | ✅ Yes | ~100ms |
| `.css` files | ✅ Yes | ~50ms |
| `.ts` files | ✅ Yes | ~100ms |
| Types/interfaces | ✅ Yes | ~100ms |
| New exports | ⚠️ Restart | - |
| Config files | ⚠️ Restart | - |

## 🔧 How It Works

```
Edit source file → Vite HMR → Browser update (state preserved!)
```

Storybook imports directly from:
- `packages/button/src/` ← Source files
- `packages/card/src/` ← Source files

Not from:
- ~~`packages/button/dist/`~~ ← Not used
- ~~`packages/card/dist/`~~ ← Not used

## 📁 Key Config Files

**Vite Aliases:** `apps/storybook/.storybook/main.ts`
```typescript
alias: {
  '@kseniya333/button': 'packages/button/src/index.ts',
  '@kseniya333/card': 'packages/card/src/index.ts',
}
```

**TypeScript Paths:** `apps/storybook/tsconfig.json`
```json
{
  "paths": {
    "@kseniya333/button": ["../../packages/button/src/index.ts"],
    "@kseniya333/card": ["../../packages/card/src/index.ts"]
  }
}
```

**CSS Imports:** `apps/storybook/.storybook/preview.ts`
```typescript
import '../../../packages/button/src/Button.css';
import '../../../packages/card/src/Card.css';
```

## 🐛 Troubleshooting

**Changes not appearing?**
```bash
# Hard refresh
Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

# Or restart Storybook
Ctrl+C
pnpm storybook
```

**TypeScript errors?**
```bash
# Restart TS server in VS Code
Cmd+Shift+P → "TypeScript: Restart TS Server"
```

**Port conflict?**
```bash
lsof -i :6006
kill -9 <PID>
pnpm storybook
```

## 📊 Performance

- **Initial load:** ~2-3 seconds
- **Component edit:** ~100ms (instant)
- **CSS edit:** ~50ms (instant)
- **State:** Preserved during updates

## 🎯 Development Flow

```bash
# 1. Start Storybook
pnpm storybook

# 2. Open browser to http://localhost:6006

# 3. Edit components
vim packages/button/src/Button.tsx

# 4. See instant updates!
# (No refresh, no rebuild, state preserved)

# 5. When ready to publish
pnpm build
pnpm release
```

## 💡 Tips

- **No build needed** - Start Storybook without building
- **State preserved** - Component state survives updates
- **Fast feedback** - See changes in ~100ms
- **Cross-package** - Button changes appear in Card stories
- **Build for publish** - Only build when ready to publish

---

See [HOT-RELOAD-SETUP.md](./HOT-RELOAD-SETUP.md) for complete documentation.
