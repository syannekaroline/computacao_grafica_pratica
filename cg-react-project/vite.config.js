import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ADICIONE A LINHA ABAIXO
  base: 'computacao_grafica_pratica', 
})