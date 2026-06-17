import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// Porta dedicada 5181 (a build paralela usa 5180; mantemos separados).
export default defineConfig({
  plugins: [react()],
  server: { port: 5181, strictPort: true, host: true },
  preview: { port: 5181, strictPort: true },
})
