import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import { resolve } from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  async viteFinal(config) {
    const workspaceRoot = resolve(__dirname, '../../../');

    return mergeConfig(config, {
      resolve: {
        alias: [
          // Map package imports to source files for hot reload
          {
            find: /^@kseniya333\/button$/,
            replacement: resolve(workspaceRoot, 'packages/button/src/index.ts'),
          },
          {
            find: /^@kseniya333\/card$/,
            replacement: resolve(workspaceRoot, 'packages/card/src/index.ts'),
          },
          // Deduplicate React to prevent multiple instances
          {
            find: 'react',
            replacement: resolve(workspaceRoot, 'node_modules/react'),
          },
          {
            find: 'react-dom',
            replacement: resolve(workspaceRoot, 'node_modules/react-dom'),
          },
        ],
        // Explicitly set to false to follow symlinks to actual source files
        preserveSymlinks: false,
        // Ensure all extensions are resolved
        extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
      },
      server: {
        fs: {
          // Allow Vite to serve files from workspace root and follow symlinks
          allow: [
            workspaceRoot,
            resolve(workspaceRoot, 'node_modules'),
          ],
          // Enable strict mode for better error messages
          strict: false,
        },
        watch: {
          // Watch workspace packages for changes
          ignored: [
            '!**/node_modules/@kseniya333/**',
            '**/node_modules/**',
            '**/.git/**',
            '**/dist/**',
            '**/coverage/**',
          ],
          // Follow symlinks to watch actual source files
          followSymlinks: true,
          // Use polling for more reliable watching through symlinks (optional, slower)
          // usePolling: true,
          // interval: 100,
        },
      },
      optimizeDeps: {
        // Include only external dependencies that should be pre-bundled
        include: [
          'react',
          'react-dom',
          'react-dom/client',
          'react/jsx-runtime',
          'scheduler',
        ],
        // IMPORTANT: Exclude workspace packages from pre-bundling for HMR to work
        exclude: [
          '@storybook/blocks',
          '@kseniya333/button',
          '@kseniya333/card',
        ],
        // Force Vite to discover dependencies in workspace packages
        entries: [
          '../src/**/*.stories.tsx',
          '../src/**/*.stories.ts',
        ],
      },
      // Clear the cache on restart to ensure fresh builds
      cacheDir: resolve(workspaceRoot, 'node_modules/.vite-storybook'),
    });
  },
};

export default config;
