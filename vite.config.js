import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import { UnifiedViteWeappTailwindcssPlugin } from 'weapp-tailwindcss/vite'
import tailwindcss from '@tailwindcss/postcss'
import threePlatformAdapter from '@minisheep/three-platform-adapter/plugin';

export default defineConfig({
  plugins: [
    uni(),
    UnifiedViteWeappTailwindcssPlugin(
      {
        rem2rpx: true,
      }
    ),
     threePlatformAdapter()
  ],
  css: {
    postcss: {
      plugins: [
        tailwindcss()
      ]
    }
  }
});