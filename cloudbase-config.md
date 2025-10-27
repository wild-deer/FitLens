# CloudBase 配置说明

## 获取 ClientId

在使用该登录功能之前，你需要在 CloudBase 控制台获取你的 `clientId`。

### 步骤：

1. 登录 [CloudBase 控制台](https://console.cloud.tencent.com/tcb)
2. 进入你的环境（env: `test-1g19jum707b00d3f`）
3. 在左侧菜单中找到「登录鉴权」
4. 在「Web 端 SDK 配置」中找到 `ClientId`
5. 复制 `ClientId`

### 配置

#### 方法 1：使用环境变量（推荐）

1. 复制 `env.example` 文件为 `.env`：
```bash
cp env.example .env
```

2. 编辑 `.env` 文件，填写你的配置：
```env
VITE_CLOUDBASE_ENV=test-1g19jum707b00d3f
VITE_CLOUDBASE_CLIENT_ID=your-actual-client-id
```

#### 方法 2：直接修改代码

将获取到的 `ClientId` 直接替换到 `src/utils/cloudBase.js` 文件中的默认值：

```javascript
export const app = cloudbase.init({
  env: "test-1g19jum707b00d3f", // 你的环境ID
  clientId: "your-client-id"     // 替换为你的 ClientId
});
```

> ⚠️ **注意**：方法 2 会将敏感信息提交到代码仓库，不推荐在生产环境使用。

## 功能说明

### 已实现功能

1. ✅ **手机号验证码登录**
   - 支持手机号注册和登录
   - 自动判断用户是否已注册
   - 未注册用户自动完成注册并登录

2. ✅ **验证码功能**
   - 发送验证码
   - 60秒倒计时
   - 验证码验证

3. ✅ **UI界面**
   - 使用 Tailwind CSS v4 美化
   - 响应式设计
   - 渐变背景和卡片式布局
   - 友好的错误提示

### 使用流程

1. 用户输入11位手机号
2. 点击「发送验证码」按钮
3. 系统发送验证码到用户手机
4. 用户输入收到的验证码
5. 点击「登录」按钮
6. 系统自动判断：
   - 如果用户已存在 → 直接登录
   - 如果用户不存在 → 注册并登录

## 注意事项

1. **环境配置**：确保在 CloudBase 控制台正确配置了安全域名
2. **短信服务**：需要在 CloudBase 控制台开通短信服务
3. **clientId**：必须配置正确的 clientId 才能使用
4. **小程序兼容**：代码已优化，兼容 uni-app 小程序环境

## Tailwind CSS v4 说明

项目已配置 Tailwind CSS v4 和 weapp-tailwindcss，可以直接使用 Tailwind 类名。

主要使用的样式包括：
- 渐变背景：`bg-gradient-to-br from-blue-50 to-indigo-100`
- 卡片样式：`bg-white rounded-2xl shadow-xl`
- Flex 布局：`flex items-center justify-center`
- 响应式：`w-full max-w-sm`

## 参考文档

- [CloudBase Web SDK 文档](https://docs.cloudbase.net/api-reference/webv3/authentication)
- [Tailwind CSS v4 文档](https://tailwindcss.com/docs)
- [uni-app 文档](https://uniapp.dcloud.net.cn/)

