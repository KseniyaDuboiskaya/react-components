import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Card',
      formats: ['es', 'umd'],
      fileName: (format) => `card.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@kseniya333/button'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@kseniya333/button': 'Button',
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
