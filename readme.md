# FitLens - AI健身助手

FitLens 是一款基于 uni-app 开发的智能健身应用，集成了 AI 识别、智能教练、训练记录等功能。

## 📱 功能特性

### 1. ✅ 用户登录
- 手机号验证码登录
- 邮箱验证码登录
- 基于腾讯云 CloudBase 的身份认证

### 2. 🤸 AI 动作识别
- 拍照识别健身动作是否标准
- 实时评分和错误检测
- 提供专业的改进建议
- 标准动作对比

### 3. 🍎 食物热量识别
- 拍照识别食物种类
- 自动计算热量和营养成分
- 详细的营养成分分析（蛋白质、碳水、脂肪、纤维）
- 食材构成详解
- 健康饮食建议

### 4. 🏋️ 器械使用指导
- 识别健身器械类型
- 提供详细的使用教程
- 目标肌群说明
- 动作步骤指导
- 安全注意事项

### 5. 💬 AI 智能教练
- 智能对话系统
- 个性化训练计划制定
- 营养饮食建议
- 健身问题解答
- 目标追踪和建议

### 6. 📊 训练记录管理
- 列表和日历双视图
- 详细的训练数据记录
- 自动计算热量消耗
- 训练强度可视化
- 月度统计分析

### 7. ⚙️ 个人设置
- 基本信息管理（昵称、性别、生日）
- 身体数据录入（身高、体重）
- BMI 自动计算和健康评估
- 健身目标设定
- 目标体重追踪

## 🛠️ 技术栈

- **框架**: uni-app (Vue 3)
- **UI**: Tailwind CSS v4
- **后端**: 腾讯云 CloudBase
- **编译工具**: Vite
- **平台支持**: 
  - H5
  - 微信小程序
  - 其他小程序平台

## 📦 项目结构

```
FitLens/
├── src/
│   ├── pages/
│   │   ├── index/              # 登录页
│   │   ├── home/               # 首页
│   │   ├── recognition/        # AI识别页
│   │   ├── ai-chat/           # AI聊天教练
│   │   ├── add-record/        # 添加训练记录
│   │   ├── records/           # 训练记录列表
│   │   ├── settings/          # 个人设置
│   │   └── me/                # 我的页面
│   ├── utils/
│   │   ├── cloudBase.js       # CloudBase 配置
│   │   └── aiService.js       # AI 服务接口
│   ├── static/                # 静态资源
│   ├── App.vue               # 应用主组件
│   ├── main.js               # 入口文件
│   ├── pages.json            # 页面配置
│   └── manifest.json         # 应用配置
├── dist/                      # 编译输出目录
├── package.json
├── vite.config.js
└── readme.md
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `env.example` 文件为 `.env`：

```bash
cp env.example .env
```

编辑 `.env` 文件，填写你的 CloudBase 配置：

```env
VITE_CLOUDBASE_ENV=your-env-id
VITE_CLOUDBASE_CLIENT_ID=your-client-id
```

### 3. 运行开发环境

**H5 开发:**
```bash
npm run dev:h5
```

**微信小程序开发:**
```bash
npm run dev:mp-weixin
```

### 4. 构建生产版本

**H5 构建:**
```bash
npm run build:h5
```

**微信小程序构建:**
```bash
npm run build:mp-weixin
```

## 🔧 CloudBase 配置

### 获取配置信息

1. 登录 [CloudBase 控制台](https://console.cloud.tencent.com/tcb)
2. 进入你的环境
3. 在「登录鉴权」中找到配置信息
4. 复制环境 ID 和 Client ID

详细配置说明请查看 [cloudbase-config.md](./cloudbase-config.md)

## 📝 AI 服务说明

### 当前实现

目前 AI 识别和对话功能使用的是**模拟数据**，用于演示和开发。

### 生产环境接入

实际部署时，需要接入真实的 AI 服务，推荐以下平台：

1. **图像识别**
   - 腾讯云 AI（图像分析、OCR）
   - 百度 AI 开放平台
   - 阿里云视觉智能开放平台

2. **自然语言处理**
   - 腾讯云 AI（智能对话）
   - 百度文心一言
   - OpenAI GPT API
   - 阿里云通义千问

### 接入步骤

修改 `src/utils/aiService.js` 文件中的相关函数，替换为真实 API 调用。

示例：

```javascript
// 替换 recognizeAction 函数
export const recognizeAction = async (imagePath) => {
  // 调用真实的 AI 识别 API
  const response = await fetch('YOUR_API_ENDPOINT', {
    method: 'POST',
    body: JSON.stringify({ image: imagePath })
  })
  return await response.json()
}
```

## 📊 数据存储

### 本地存储

应用使用 uni-app 的本地存储功能保存数据：

- `userInfo`: 用户基本信息
- `userProfile`: 用户详细资料
- `trainingRecords`: 训练记录
- `chatMessages`: 聊天历史

### 云端存储

可以结合 CloudBase 的数据库功能实现云端存储和同步。

## 🎨 界面展示

- 现代化的渐变设计
- 卡片式布局
- 友好的交互体验
- 响应式设计
- 支持深色模式（可扩展）

## 🔐 安全说明

1. 敏感信息请使用环境变量，不要提交到代码仓库
2. 生产环境务必配置安全域名
3. 定期更新依赖包
4. 遵循最小权限原则

## 📄 开源协议

MIT License

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题，欢迎通过 Issue 联系。

---

**注意**: 
- 本项目仅供学习和参考使用
- AI 功能当前为模拟实现，生产环境需接入真实服务
- 请遵守相关法律法规，合理使用 AI 服务
