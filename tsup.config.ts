import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  sourcemap: false,
  minify: true,
  dts: true,
  clean: true,
  external: ['child_process', 'util', 'semver'],
})
