// vite.config.ts
import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite";
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig({
  base: "./",
  build: {
    outDir: "build"
  },
  resolve: {
    alias: {
      '@public': path.resolve(__dirname, 'public'),
      '@images': path.resolve(__dirname, 'src/images'),
    },
  },
  server: {
    port: 4040,
  },
  plugins: [tailwindcss(), react(), svgr()]
});
