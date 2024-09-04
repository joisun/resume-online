import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  base: "./",
  plugins: [
    vue(),
    vueJsx(),
    createHtmlPlugin({
      inject: {
        data: {
          logo: process.env.VITE_APP_LOGO,
          title: process.env.VITE_APP_TITLE,
        },
      },
    }),
  ],
  define:
    command === "build"
      ? {
          "import.meta.env.VITE_ROOT_PASSWD": process.env.VITE_ROOT_PASSWD,
          "import.meta.env.VITE_APP_LOGO": process.env.VITE_APP_LOGO,
          "import.meta.env.VITE_APP_TITLE": process.env.VITE_APP_TITLE,
        }
      : {},
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000", // 所要代理的目标地址
        rewrite: (path) => path.replace(/^\/api/, ""), // 重写传过来的path路径，比如 `/api/index/1?id=10&name=zs`（注意:path路径最前面有斜杠（/），因此，正则匹配的时候不要忘了是斜杠（/）开头的；选项的 key 也是斜杠（/）开头的）
        changeOrigin: true, // true/false, Default: false - changes the origin of the host header to the target URL
      },
    },
  },
}));
