/**
 * AI服务工具类
 * 用于管理AI识别和对话接口
 * 
 * 注意：这是一个模拟实现，实际使用时需要接入真实的AI服务
 * 可以接入：
 * - 腾讯云AI（图像识别、自然语言处理）
 * - 百度AI开放平台
 * - 阿里云视觉智能开放平台
 * - OpenAI API
 */

// 模拟API延迟
const delay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 动作识别 - 识别健身动作是否正确
 * @param {string} imagePath - 图片路径
 * @returns {Promise<Object>} 识别结果
 */
export const recognizeAction = async (imagePath) => {
  await delay(1500)
  
  // 模拟识别结果
  const actions = [
    {
      name: '深蹲',
      correct: false,
      score: 75,
      errors: [
        '膝盖超过脚尖',
        '背部未保持挺直'
      ],
      suggestions: [
        '保持膝盖不超过脚尖',
        '收紧核心，保持背部挺直',
        '蹲至大腿与地面平行'
      ],
      standardImage: 'https://via.placeholder.com/300x400?text=Standard+Squat'
    },
    {
      name: '俯卧撑',
      correct: true,
      score: 92,
      errors: [],
      suggestions: [
        '动作标准，继续保持！',
        '可以尝试增加次数或难度'
      ],
      standardImage: 'https://via.placeholder.com/300x400?text=Standard+Push-up'
    },
    {
      name: '硬拉',
      correct: false,
      score: 68,
      errors: [
        '背部拱起',
        '杠铃位置偏前'
      ],
      suggestions: [
        '保持脊椎中立位',
        '杠铃贴近身体',
        '臀部下沉，胸部挺起'
      ],
      standardImage: 'https://via.placeholder.com/300x400?text=Standard+Deadlift'
    }
  ]
  
  // 随机返回一个识别结果
  return actions[Math.floor(Math.random() * actions.length)]
}

/**
 * 食物热量识别
 * @param {string} imagePath - 图片路径
 * @returns {Promise<Object>} 识别结果
 */
export const recognizeFood = async (imagePath) => {
  await delay(1500)
  
  // 模拟识别结果
  const foods = [
    {
      name: '鸡胸肉沙拉',
      totalCalories: 285,
      weight: 250,
      unit: 'g',
      nutrition: {
        protein: 32,
        carbs: 15,
        fat: 8,
        fiber: 5
      },
      ingredients: [
        { name: '鸡胸肉', calories: 165, weight: 100, unit: 'g' },
        { name: '生菜', calories: 15, weight: 50, unit: 'g' },
        { name: '番茄', calories: 18, weight: 100, unit: 'g' },
        { name: '橄榄油', calories: 87, weight: 10, unit: 'ml' }
      ],
      healthScore: 85,
      tips: [
        '优质蛋白质来源',
        '低碳水化合物',
        '适合减脂期食用'
      ]
    },
    {
      name: '牛排套餐',
      totalCalories: 680,
      weight: 350,
      unit: 'g',
      nutrition: {
        protein: 45,
        carbs: 42,
        fat: 32,
        fiber: 3
      },
      ingredients: [
        { name: '牛排', calories: 420, weight: 200, unit: 'g' },
        { name: '薯条', calories: 180, weight: 100, unit: 'g' },
        { name: '西兰花', calories: 35, weight: 50, unit: 'g' },
        { name: '黄油', calories: 45, weight: 5, unit: 'g' }
      ],
      healthScore: 62,
      tips: [
        '蛋白质丰富',
        '脂肪含量较高',
        '建议减少薯条摄入'
      ]
    },
    {
      name: '燕麦粥配水果',
      totalCalories: 245,
      weight: 200,
      unit: 'g',
      nutrition: {
        protein: 8,
        carbs: 48,
        fat: 5,
        fiber: 8
      },
      ingredients: [
        { name: '燕麦', calories: 150, weight: 50, unit: 'g' },
        { name: '香蕉', calories: 60, weight: 80, unit: 'g' },
        { name: '蓝莓', calories: 25, weight: 50, unit: 'g' },
        { name: '蜂蜜', calories: 10, weight: 5, unit: 'ml' }
      ],
      healthScore: 92,
      tips: [
        '早餐最佳选择',
        '膳食纤维丰富',
        '提供持久能量'
      ]
    }
  ]
  
  return foods[Math.floor(Math.random() * foods.length)]
}

/**
 * 器械使用识别
 * @param {string} imagePath - 图片路径
 * @returns {Promise<Object>} 识别结果
 */
export const recognizeEquipment = async (imagePath) => {
  await delay(1500)
  

  

}

/**
 * Coze配置
 */
const COZE_CONFIG = {
  apiKey: import.meta.env.VITE_COZE_API_KEY || '',
  workflowId: import.meta.env.VITE_COZE_WORKFLOW_ID || '',
  appId: import.meta.env.VITE_COZE_APP_ID || '',
  botId: import.meta.env.VITE_COZE_BOT_ID || '',
  baseUrl: 'https://api.coze.cn/v1'
}

/**
 * 调用Coze工作流API
 * @param {string} message - 用户消息
 * @param {Array} history - 对话历史
 * @returns {Promise<Object>} AI回复
 */
const callCozeWorkflow = async (message, history = []) => {
  try {
    // 构建对话历史格式
    const messages = history.slice(-10).map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
      content_type: 'text'
    }))
    
    // 添加当前消息
    messages.push({
      role: 'user',
      content: message,
      content_type: 'text'
    })

    // 调用Coze工作流API - 使用流式响应
    const response = await new Promise((resolve, reject) => {
      uni.request({
        url: `${COZE_CONFIG.baseUrl}/workflow/stream_run`,
        method: 'POST',
        header: {
          'Authorization': `Bearer ${COZE_CONFIG.apiKey}`,
          'Content-Type': 'application/json'
        },
        data: {
          workflow_id: COZE_CONFIG.workflowId,
          parameters: {
            query: message,
            // 可以传递额外的参数给工作流
            history: JSON.stringify(messages)
          }
        },
        enableChunked: true, // 启用分块传输
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data)
          } else {
            reject(new Error(`API请求失败: ${res.statusCode}`))
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })

    // 解析响应
    let responseText = ''
    
    // 处理流式响应（如果返回的是流式数据）
    if (typeof response === 'string') {
      // 处理SSE格式的响应
      const lines = response.split('\n')
      for (const line of lines) {
        if (line.startsWith('data:')) {
          try {
            const data = JSON.parse(line.substring(5).trim())
            if (data.event === 'message' && data.message) {
              responseText += data.message.content || ''
            } else if (data.output) {
              responseText = data.output
            }
          } catch (e) {
            console.warn('解析SSE数据失败:', e)
          }
        }
      }
    } else if (response.data) {
      // 直接返回结果
      responseText = response.data.output || response.data.content || ''
    } else {
      responseText = response.output || response.content || ''
    }

    if (!responseText) {
      throw new Error('未获取到有效响应')
    }

    return {
      content: responseText,
      type: 'text',
      timestamp: Date.now()
    }
  } catch (error) {
    console.error('Coze API调用失败:', error)
    throw error
  }
}

/**
 * 调用Coze工作流聊天API（支持流式响应）
 * @param {string} message - 用户消息
 * @param {Array} history - 对话历史
 * @param {Function} onProgress - 流式进度回调
 * @returns {Promise<Object>} AI回复
 */
const callCozeBot = async (message, history = [], onProgress = null) => {
  try {
    // 生成对话名称（使用时间戳）
    const conversationName = "Default"
    
    // 构建additional_messages数组
    const additionalMessages = [{
      content: message,
      content_type: 'text',
      role: 'user',
      type: 'answer'
    }]
    
    const requestData = {
      workflow_id: COZE_CONFIG.workflowId,
      app_id: COZE_CONFIG.appId,
      parameters: {
        CONVERSATION_NAME: conversationName,
        USER_INPUT: message
      },
      additional_messages: additionalMessages
    }
    
    console.log('发送请求:', JSON.stringify({
      url: `${COZE_CONFIG.baseUrl}/workflows/chat`,
      method: 'POST',
      data: requestData
    }, null, 2))
    
    // 检测是否在微信小程序环境
    const isWechat = typeof wx !== 'undefined' && wx.request
    
    const response = await new Promise((resolve, reject) => {
      if (isWechat && onProgress) {
        // 使用微信原生API支持流式响应
        console.log('使用wx.request进行流式请求...')
        
        let buffer = '' // 缓冲区，用于存储不完整的数据
        let responseText = ''
        let currentEvent = ''
        const decoder = new TextDecoder('utf-8')
        
        const requestTask = wx.request({
          url: `${COZE_CONFIG.baseUrl}/workflows/chat`,
          method: 'POST',
          header: {
            'Authorization': `Bearer ${COZE_CONFIG.apiKey}`,
            'Content-Type': 'application/json'
          },
          data: requestData,
          enableChunked: true, // 启用分块传输
          success: (res) => {
            console.log('请求完成，状态码:', res.statusCode)
            if (res.statusCode === 200) {
              resolve(responseText)
            } else {
              reject(new Error(`API请求失败: ${res.statusCode}`))
            }
          },
          fail: (err) => {
            console.error('请求失败:', err)
            reject(err)
          }
        })
        
        // 监听分块数据接收
        requestTask.onChunkReceived((res) => {
          try {
            // 将ArrayBuffer转换为字符串
            const chunk = decoder.decode(new Uint8Array(res.data), { stream: true })
            console.log('收到数据块:', chunk)
            
            // 将新数据添加到缓冲区
            buffer += chunk
            
            // 按行分割处理
            const lines = buffer.split('\n')
            // 保留最后一行（可能不完整）
            buffer = lines.pop() || ''
            
            for (const line of lines) {
              const trimmedLine = line.trim()
              
              if (!trimmedLine) continue
              
              // 解析事件类型
              if (trimmedLine.startsWith('event:')) {
                currentEvent = trimmedLine.substring(6).trim()
                console.log('事件类型:', currentEvent)
              }
              // 解析数据
              else if (trimmedLine.startsWith('data:')) {
                const dataStr = trimmedLine.substring(5).trim()
                
                try {
                  const data = JSON.parse(dataStr)
                  console.log('解析数据:', { event: currentEvent, data })
                  
                  // 提取 conversation.message.delta 事件中的内容
                  if (currentEvent === 'conversation.message.delta' && data.content) {
                    responseText += data.content
                    // 调用进度回调，实时更新UI
                    if (onProgress) {
                      onProgress(data.content)
                    }
                    console.log('累积响应:', responseText)
                  }
                  // 或者从 conversation.message.completed 获取完整内容
                  else if (currentEvent === 'conversation.message.completed' && data.content && data.type === 'answer') {
                    // 如果没有通过delta累积到内容，使用completed的完整内容
                    if (!responseText) {
                      responseText = data.content
                      if (onProgress) {
                        onProgress(data.content)
                      }
                      console.log('完整响应:', responseText)
                    }
                  }
                } catch (e) {
                  console.warn('解析SSE数据失败:', dataStr, e)
                }
              }
            }
          } catch (err) {
            console.error('处理数据块失败:', err)
          }
        })
      } else {
        // 降级使用uni.request（非流式）
        console.log('使用uni.request进行非流式请求...')
        uni.request({
          url: `${COZE_CONFIG.baseUrl}/workflows/chat`,
          method: 'POST',
          header: {
            'Authorization': `Bearer ${COZE_CONFIG.apiKey}`,
            'Content-Type': 'application/json'
          },
          data: requestData,
          success: (res) => {
            console.log('响应状态码:', res.statusCode)
            console.log('响应数据:', res.data)
            
            if (res.statusCode === 200) {
              resolve(res.data)
            } else {
              reject(new Error(`API请求失败: ${res.statusCode}`))
            }
          },
          fail: (err) => {
            reject(err)
          }
        })
      }
    })

    // 解析响应
    let responseText = ''
    
    if (typeof response === 'string') {
      // 流式请求已经累积了响应文本
      responseText = response
    } else if (typeof response === 'object') {
      // 处理非流式的JSON格式响应
      console.log('解析JSON格式响应...')
      
      if (response.code !== undefined && response.code !== 0) {
        throw new Error(`API调用失败: ${response.msg || '未知错误'}`)
      }
      
      if (response.data) {
        responseText = response.data
      } else if (response.messages && response.messages.length > 0) {
        const lastMessage = response.messages
          .filter(msg => msg.role === 'assistant')
          .pop()
        responseText = lastMessage?.content || ''
      } else if (response.output) {
        responseText = response.output
      }
      
      // 如果有进度回调，一次性返回全部内容
      if (onProgress && responseText) {
        onProgress(responseText)
      }
    }

    if (!responseText) {
      console.error('未能提取响应内容，原始响应:', response)
      throw new Error('未获取到有效响应')
    }
    
    console.log('最终提取的响应文本:', responseText)

    return {
      content: responseText,
      type: 'text',
      timestamp: Date.now()
    }
  } catch (error) {
    console.error('Coze工作流聊天API调用失败:', error)
    throw error
  }
}

/**
 * AI聊天对话 - 智能教练（接入Coze）
 * @param {string} message - 用户消息
 * @param {Array} history - 对话历史
 * @param {Function} onProgress - 流式进度回调（可选）
 * @returns {Promise<Object>} AI回复
 */
export const chatWithAI = async (message, history = [], onProgress = null) => {
  // 检查配置
  if (!COZE_CONFIG.apiKey) {
    console.error('未配置Coze API Key')
    return {
      content: '抱歉，AI服务未配置。请检查环境变量配置。',
      type: 'text',
      timestamp: Date.now()
    }
  }

  try {
    // 优先使用工作流聊天API，如果配置了workflow_id和app_id
    if (COZE_CONFIG.workflowId && COZE_CONFIG.appId) {
      return await callCozeBot(message, history, onProgress)
    } 
    // 其次使用工作流API，如果只配置了workflow_id
    else if (COZE_CONFIG.workflowId) {
      return await callCozeWorkflow(message, history)
    } 
    else {
      throw new Error('未配置workflow_id或app_id')
    }
  } catch (error) {
    console.error('Coze调用失败，使用降级响应:', error)
    
    // 降级处理：返回友好的错误提示
    return {
      content: `抱歉，AI服务暂时无法响应。错误信息：${error.message}\n\n请稍后再试或联系管理员。`,
      type: 'text',
      timestamp: Date.now()
    }
  }
}

/**
 * 模拟AI对话（仅用于开发测试）
 * @param {string} message - 用户消息
 * @param {Array} history - 对话历史
 * @returns {Promise<Object>} AI回复
 */
export const chatWithAIMock = async (message, history = []) => {
  await delay(1200)
  
  // 根据关键词返回不同的回复
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('训练计划') || lowerMessage.includes('计划')) {
    return {
      content: `好的！我来为您制定一个训练计划。首先，我需要了解一些信息：

1. **您的健身目标是什么？**
   - 增肌
   - 减脂
   - 塑形
   - 提高体能

2. **您每周可以训练几次？**
   - 3次
   - 4次
   - 5次及以上

3. **您的健身经验如何？**
   - 新手（0-6个月）
   - 初级（6个月-1年）
   - 中级（1-3年）
   - 高级（3年以上）

请告诉我这些信息，我会为您量身定制训练计划！💪`,
      type: 'text',
      timestamp: Date.now()
    }
  }
  
  if (lowerMessage.includes('减脂') || lowerMessage.includes('减肥')) {
    return {
      content: `关于减脂，我给您以下建议：

**饮食方面：**
1. 控制热量摄入，创造热量缺口（每天减少300-500大卡）
2. 保证蛋白质摄入（每公斤体重1.6-2.0克）
3. 多吃蔬菜和全谷物
4. 减少精制碳水和加工食品
5. 多喝水（每天2-3升）

**训练方面：**
1. 力量训练（每周3-4次）- 保持肌肉量
2. 有氧运动（每周3-5次，每次30-45分钟）
3. HIIT高强度间歇训练（每周2-3次）
4. 保证充足休息和睡眠（每天7-8小时）

**注意事项：**
- 循序渐进，不要过度节食
- 记录饮食和体重变化
- 每周减重0.5-1kg为宜
- 坚持是关键！

需要具体的训练计划吗？😊`,
      type: 'text',
      timestamp: Date.now()
    }
  }
  
  if (lowerMessage.includes('增肌')) {
    return {
      content: `增肌训练建议：

**训练原则：**
1. 渐进超负荷 - 逐步增加重量
2. 大重量、中低次数（8-12次/组）
3. 复合动作为主（深蹲、硬拉、卧推等）
4. 充分的肌肉刺激和休息

**推荐训练分化：**
- 周一：胸+三头
- 周二：背+二头
- 周三：休息
- 周四：肩+腹
- 周五：腿
- 周六：休息
- 周日：休息或有氧

**营养建议：**
1. 热量盈余（每天增加300-500大卡）
2. 蛋白质：每公斤体重2.0-2.5克
3. 碳水化合物：充足，训练前后补充
4. 脂肪：占总热量20-30%
5. 多餐（5-6餐/天）

**补剂推荐：**
- 乳清蛋白
- 肌酸
- 支链氨基酸（BCAA）

加油！💪`,
      type: 'text',
      timestamp: Date.now()
    }
  }
  
  if (lowerMessage.includes('饮食') || lowerMessage.includes('吃')) {
    return {
      content: `健身期间的饮食建议：

**优质蛋白质来源：**
🥩 鸡胸肉、牛肉、鱼肉
🥚 鸡蛋、蛋白粉
🥛 牛奶、酸奶、奶酪

**优质碳水化合物：**
🍚 糙米、燕麦、全麦面包
🥔 红薯、土豆
🍝 全麦意大利面

**健康脂肪：**
🥑 牛油果
🌰 坚果（杏仁、核桃）
🐟 深海鱼（三文鱼）
🫒 橄榄油

**蔬菜水果：**
🥦 西兰花、菠菜、生菜
🍎 苹果、香蕉、蓝莓

**饮食时机：**
- 训练前1-2小时：碳水+少量蛋白
- 训练后30分钟内：蛋白+快速碳水
- 睡前：缓释蛋白（酪蛋白）

需要具体的饮食计划吗？🍽️`,
      type: 'text',
      timestamp: Date.now()
    }
  }
  
  // 默认回复
  const defaultReplies = [
    `我是您的AI健身教练！我可以帮您：

1. 📋 制定个性化训练计划
2. 🍎 提供营养饮食建议
3. 💪 解答健身相关问题
4. 📊 分析训练数据
5. 🎯 设定和追踪健身目标

请告诉我您需要什么帮助？`,
    `您好！作为您的私人健身教练，我很乐意帮助您。您可以问我：
- 如何制定训练计划？
- 减脂/增肌应该怎么做？
- 饮食应该注意什么？
- 某个动作怎么做？

有什么我可以帮您的吗？😊`,
    `收到您的消息！请问您想了解关于健身的哪方面内容呢？

💪 训练计划
🍽️ 饮食营养
🏋️ 动作指导
📈 进度追踪

我随时为您服务！`
  ]
  
  return {
    content: defaultReplies[Math.floor(Math.random() * defaultReplies.length)],
    type: 'text',
    timestamp: Date.now()
  }
}

/**
 * 计算训练消耗的热量
 * @param {Object} params - 参数
 * @param {string} params.exerciseType - 运动类型
 * @param {number} params.duration - 持续时间（分钟）
 * @param {number} params.weight - 体重（kg）
 * @param {number} params.intensity - 强度（1-10）
 * @returns {number} 消耗的热量（kcal）
 */
export const calculateCalories = ({ exerciseType, duration, weight = 70, intensity = 5 }) => {
  // MET值（代谢当量）参考
  const metValues = {
    'running': 8.0,
    'cycling': 6.0,
    'swimming': 7.0,
    'walking': 3.5,
    'strength_training': 5.0,
    'yoga': 3.0,
    'hiit': 10.0,
    'basketball': 6.5,
    'football': 7.0,
    'rope_jumping': 11.0,
    'default': 5.0
  }
  
  const met = metValues[exerciseType] || metValues.default
  const intensityFactor = intensity / 5 // 标准化到1.0
  
  // 公式：消耗热量 = MET × 体重(kg) × 时间(小时) × 强度系数
  const calories = met * weight * (duration / 60) * intensityFactor
  
  return Math.round(calories)
}

