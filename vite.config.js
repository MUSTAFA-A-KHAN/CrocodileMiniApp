import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Replace with the desired IP address
    port: 3001,      // Replace with the desired port
  },
  base: "/CrocodileMiniApp",
  plugins: [react()],
})
