import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import { UnifiedViteWeappTailwindcssPlugin } from 'weapp-tailwindcss/vite'
import tailwindcss from '@tailwindcss/postcss'


export default defineConfig({
  plugins: [
    uni(),
    UnifiedViteWeappTailwindcssPlugin(
      {
        rem2rpx: true,
      }
    ),
  ],
  server:{ host: '127.0.0.1', port: 3000 },
  css: {
    postcss: {
      plugins: [
        tailwindcss()
      ]
    }
  }
});