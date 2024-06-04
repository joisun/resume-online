import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'


// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  base: './',
  plugins: [vue(), vueJsx()],
  define: command === 'build' ? {
    'import.meta.env.VITE_ADMIN_PASSWD': process.env.VITE_ADMIN_PASSWD,
    'import.meta.env.VITE_PASSWD': process.env.VITE_PASSWD,
    'import.meta.env.VITE_PASSINPUTPAGE_BG': process.env.VITE_PASSINPUTPAGE_BG,
    'import.meta.env.VITE_PASSWD_INPUT_LABEL': process.env.VITE_PASSWD_INPUT_LABEL,
    'import.meta.env.VITE_SUCCESS_TITLE': process.env.VITE_SUCCESS_TITLE,
    'import.meta.env.VITE_SUCCESS_CONTENT': process.env.VITE_SUCCESS_CONTENT,
    'import.meta.env.VITE_ERROR_TITLE': process.env.VITE_ERROR_TITLE,
    'import.meta.env.VITE_ERROR_CONTENT': process.env.VITE_ERROR_CONTENT,
  } : {},
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // 所要代理的目标地址
        rewrite: path => path.replace(/^\/api/, ''), // 重写传过来的path路径，比如 `/api/index/1?id=10&name=zs`（注意:path路径最前面有斜杠（/），因此，正则匹配的时候不要忘了是斜杠（/）开头的；选项的 key 也是斜杠（/）开头的）
        changeOrigin: true,  // true/false, Default: false - changes the origin of the host header to the target URL
      }
    }
  }

}))
