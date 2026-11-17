import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  ssr: {
    // bundle these into the prerender build so Node does not trip over their ESM exports
    noExternal: ['gsap', '@gsap/react', 'lucide-react'],
  },
})
