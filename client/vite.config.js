import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// En desarrollo Vite (5174) hace de proxy hacia el Express del portafolio, que es el dueño de los
// datos (/api/site), de las imágenes subidas (/uploads) y del panel (/admin). En producción no se
// usa Vite: Express sirve client/dist.
const target = process.env.PORTFOLIO_API || 'http://127.0.0.1:4100'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5174,
    proxy: { '/api': target, '/uploads': target, '/admin': target },
  },
})
