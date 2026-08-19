import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig(async () => {
  const plugins: any[] = [react(), babel({ presets: [reactCompilerPreset()] })]

  // Only include the Cloudflare plugin when NOT building for Vercel.
  // On Vercel we need standard static-file output, not Workers format.
  if (!process.env.VERCEL) {
    const { cloudflare } = await import("@cloudflare/vite-plugin")
    plugins.push(cloudflare())
  }

  return {
    plugins,
    server: {
      port: 5173,
      proxy: {
        // Forward API calls to the Nitro backend during development.
        "/api": "http://localhost:3001"
      },
      watch: {
        // Don't reload the page when Nitro regenerates its build/types.
        ignored: ["**/.nitro/**", "**/.output/**"]
      }
    }
  }
})