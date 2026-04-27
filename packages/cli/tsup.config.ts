import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./bin/client.ts'],
  format: ['esm'],
  minify: true,
  dts: true,
})
