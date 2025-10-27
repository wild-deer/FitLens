```bash
npx degit dcloudio/uni-preset-vue#vite my-vue3-project
```

```bash
npm i -verbose
```

```bash
npm install -D tailwindcss @tailwindcss/postcss weapp-tailwindcss
```

package.json
```json
 "scripts": {
   "postinstall": "weapp-tw patch"
 }
```

vite.config.ts
```ts
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
    )
  ],
  css: {
    postcss: {
      plugins: [
        tailwindcss()
      ]
    }
  }
});

```

main.css
```css
@import "weapp-tailwindcss/css";
@source not "dist";
```

App.vue
```vue
<style src="./main.css"></style>
```


.npmrc
```npmrc
@minisheep:registry=https://npm.minisheep.cn
```

```bash
npm i @minisheep/mini-program-polyfill-core @minisheep/three-platform-adapter
```

vite.config.js
```js
import threePlatformAdapter from '@minisheep/three-platform-adapter/plugin';

export default {
  plugins: [
    // ...
    threePlatformAdapter() // 可选配置项见文档说明
    // ...
  ]
}
```