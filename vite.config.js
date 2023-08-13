import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [mkcert(), vue()],
    server: {
        strictPort: true,
        port: 5173,
      },
    define: {
        'process.env': {}
    }
})
