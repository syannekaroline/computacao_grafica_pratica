import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/computacao-grafica-pratica/', // Garanta que este é o nome do seu repositório
})