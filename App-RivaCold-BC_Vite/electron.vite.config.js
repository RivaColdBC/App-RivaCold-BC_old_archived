import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: { outDir: 'out/main' }
  },
  renderer: {
    resolve: {
      alias: { '@renderer': resolve('src/renderer/src') },
      build: { outDir: 'out/renderer' }
    },
    plugins: [vue()]
  },
  resolve: {
    alias: {
      path: 'path-browserify'
    }
  },
  build: {
    commonjsOptions: {
      esmExternals: true
    }
  }
})
