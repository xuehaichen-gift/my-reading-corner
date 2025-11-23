import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Fix for TS2580: Cannot find name 'process'.
// This file runs in Node.js, so process is available, but TS doesn't know that without @types/node.
declare const process: any;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // This ensures process.env.API_KEY is replaced by the actual value during build
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Prevent crash if code accesses process.env elsewhere in the browser
      'process.env': {} 
    }
  }
})
