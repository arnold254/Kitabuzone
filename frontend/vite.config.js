// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    open: true, // <-- this line makes the browser open automatically
    port: 5173, // optional, default is 5173
  },
})
