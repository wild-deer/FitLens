# Coze AI 接入说明

## 📋 概述

本项目已集成 Coze AI 工作流，用于实现智能健身教练的对话功能。

## 🔧 配置步骤

### 1. 获取 Coze API 凭证

1. 访问 [Coze 开放平台](https://www.coze.cn/)
2. 登录并进入控制台
3. 创建或选择一个应用
4. 在应用设置中获取以下信息：
   - **API Key**：用于身份验证
   - **Workflow ID**：工作流的唯一标识（如果使用工作流模式）
   - **Bot ID**：机器人ID（如果使用Bot模式）

### 2. 配置环境变量

1. 复制 `env.example` 文件为 `.env` 或 `.env.local`
   ```bash
   cp env.example .env
   ```

2. 编辑 `.env` 文件，填入你的 Coze 配置：
   ```env
   # Coze AI 配置
   VITE_COZE_API_KEY=你的API密钥
   VITE_COZE_WORKFLOW_ID=你的工作流ID（可选）
   VITE_COZE_BOT_ID=你的机器人ID（可选）
   ```

   **注意**：
   - `WORKFLOW_ID` 和 `BOT_ID` 至少需要配置一个
   - 优先使用工作流模式（WORKFLOW_ID）
   - 如果两者都配置，将优先使用工作流模式

### 3. 创建 Coze 工作流（推荐）

#### 工作流设计建议：

1. **输入参数**：
   - `query`：用户的提问（字符串）
   - `history`：对话历史（可选，JSON字符串）

2. **输出**：
   - `output` 或 `content`：AI的回复内容

3. **节点配置**：
   - 可以添加知识库节点，导入健身相关知识
   - 可以添加提示词节点，定义AI助手的角色和能力
   - 可以添加判断节点，根据不同问题类型给出不同回复

#### 示例提示词：

```
你是一个专业的健身教练AI助手，名字是FitLens AI教练。你的任务是为用户提供科学、专业、个性化的健身建议。

你的能力包括：
1. 制定个性化训练计划
2. 提供营养饮食建议
3. 解答健身相关问题
4. 分析训练数据
5. 设定和追踪健身目标

回答要求：
- 专业且易懂
- 考虑用户的健身水平
- 给出具体可执行的建议
- 注意安全提示
- 语气友好鼓励

用户问题：{{query}}
```

### 4. 测试接入

1. 启动开发服务器：
   ```bash
   npm run dev:mp-weixin
   ```

2. 在微信开发者工具中打开项目

3. 进入"AI智能教练"页面

4. 发送消息测试AI回复

## 📡 API 接口说明

### 工作流模式（推荐）

使用 Coze 工作流API，适合需要复杂逻辑和多步骤处理的场景。

**端点**：`/v1/workflow/stream_run`

**请求参数**：
```json
{
  "workflow_id": "your_workflow_id",
  "parameters": {
    "query": "用户消息",
    "history": "[...]"  // 可选
  }
}
```

**响应格式**：
- 支持流式响应（SSE格式）
- 实时返回AI生成的内容

### Bot 模式

使用 Coze Bot API，适合简单对话场景。

**端点**：`/v1/chat`

**请求参数**：
```json
{
  "bot_id": "your_bot_id",
  "user_id": "user_123",
  "stream": false,
  "auto_save_history": true,
  "additional_messages": [
    {
      "role": "user",
      "content": "用户消息",
      "content_type": "text"
    }
  ]
}
```

## 🔄 降级策略

代码中已内置降级处理：

1. **未配置 API Key**：返回提示信息，告知用户服务未配置
2. **API 调用失败**：捕获错误并返回友好的错误提示
3. **网络超时**：uni.request 会自动处理超时

## 🧪 开发调试

### 使用模拟模式

如果暂时不想接入 Coze，可以使用内置的模拟函数 `chatWithAIMock`：

```javascript
// 在 src/pages/ai-chat/index.vue 中
import { chatWithAIMock } from '@/utils/aiService.js'

// 替换为模拟函数
const response = await chatWithAIMock(userMessage, messages.value)
```

### 查看日志

在浏览器控制台或微信开发者工具控制台中查看：
- API 请求日志
- 响应数据
- 错误信息

## ⚠️ 注意事项

1. **API Key 安全**：
   - 不要将 API Key 提交到 Git 仓库
   - 使用环境变量管理敏感信息
   - `.env` 文件应添加到 `.gitignore`

2. **请求限流**：
   - 注意 Coze API 的调用频率限制
   - 建议添加请求防抖或节流

3. **错误处理**：
   - 代码已包含基本错误处理
   - 生产环境建议添加更详细的日志记录

4. **跨域问题**：
   - 小程序环境需要在微信公众平台配置合法域名
   - H5环境可能需要配置代理

## 📚 相关文档

- [Coze 开放平台文档](https://www.coze.cn/open/docs)
- [工作流聊天接口](https://www.coze.cn/open/docs/developer_guides/workflow_chat)
- [Bot 对话接口](https://www.coze.cn/open/docs/chat)

## 🎯 后续优化建议

1. **流式响应优化**：
   - 实现真正的流式输出，逐字显示AI回复
   - 提升用户体验

2. **对话历史管理**：
   - 限制历史消息数量，避免token超限
   - 实现对话上下文摘要

3. **多轮对话增强**：
   - 根据用户画像调整回复策略
   - 记住用户的健身目标和偏好

4. **错误重试机制**：
   - 添加自动重试逻辑
   - 实现请求队列

5. **性能监控**：
   - 统计API调用成功率
   - 监控响应时间

## 💡 示例对话

配置完成后，用户可以这样使用：

- "帮我制定一个减脂训练计划"
- "如何增肌最有效？"
- "健身期间应该怎么吃？"
- "深蹲的标准动作是什么？"

AI 会根据 Coze 工作流的配置，返回专业的健身建议。

---

如有问题，请参考 Coze 官方文档或提交 Issue。

