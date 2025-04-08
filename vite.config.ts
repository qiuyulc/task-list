import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
import vitePluginImagePreload from "./plugins/vite-plugin-image-preload";
// import { visualizer } from "rollup-plugin-visualizer";
import path from "path";
// https://vite.dev/config/
export default defineConfig({
  base: "/task-list/",
  build: {
    rollupOptions: {
      output: {
        // 控制输出文件的命名
        entryFileNames: "js/[name].[hash].js",
        chunkFileNames: "js/[name].[hash].js",
        // assetFileNames: "asstes/[name].[hash][extname]",
        assetFileNames: (assetInfo) => {
          // 通过文件后缀分类
          const extType = assetInfo.names[0].split(".").pop() as string;
          // 图片类
          if (/png|jpe?g|svg|gif|webp|avif|bmp|ico/i.test(extType)) {
            return "assets/images/[name]-[hash][extname]";
          }
          // 字体类
          if (/woff2?|eot|ttf|otf/i.test(extType)) {
            return "assets/fonts/[name]-[hash][extname]";
          }
          // CSS 文件
          if (extType === "css") {
            return "assets/css/[name]-[hash][extname]";
          }
          // 其他资源（如音视频、文档）
          return "assets/other/[name]-[hash][extname]";
        },
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor"; // 将所有 node_modules 中的依赖打包到一个 vendor chunk
          }
        },
      },
      // 其他 Rollup 配置
    },
    sourcemap: true, // 生成 source map
    chunkSizeWarningLimit: 600, // 设置 chunk 大小警告限制
    cssCodeSplit: true, // 开启 CSS 代码分割
  },
  plugins: [
    react(),
    vitePluginImagePreload({
      baseUrl:'assets/images',
      data: [
        "one.svg",
        "two.svg",
        "three.svg",
        "four.svg",
        "five.svg",
        "six.svg",
        'seven.svg'
      ],
    }),
    // visualizer({
    //   open: true, // 在浏览器中自动打开报告
    //   gzipSize: true, // 显示gzip压缩后的尺寸
    //   brotliSize: true, // 显示brotli压缩后的尺寸
    // }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
