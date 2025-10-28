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
  
  const equipments = [
    {
      name: '杠铃',
      type: 'barbell',
      description: '自由重量训练器械，适合多种复合动作',
      exercises: [
        {
          name: '杠铃深蹲',
          targetMuscles: ['股四头肌', '臀大肌', '腘绳肌'],
          difficulty: '中高级',
          caloriesPerHour: 400,
          steps: [
            '1. 杠铃放在肩后上方斜方肌上',
            '2. 双脚与肩同宽，脚尖略微外展',
            '3. 保持背部挺直，核心收紧',
            '4. 臀部向后坐，膝盖弯曲下蹲',
            '5. 蹲至大腿与地面平行',
            '6. 用力站起，回到起始位置'
          ],
          safetyTips: [
            '始终保持背部挺直',
            '膝盖不要内扣',
            '重量循序渐进',
            '使用护腰带保护下背'
          ]
        },
        {
          name: '杠铃卧推',
          targetMuscles: ['胸大肌', '三角肌前束', '肱三头肌'],
          difficulty: '中级',
          caloriesPerHour: 350,
          steps: [
            '1. 平躺在卧推凳上',
            '2. 双手握杠，略宽于肩',
            '3. 将杠铃从架上推起',
            '4. 缓慢下放至胸部',
            '5. 用力将杠铃推起',
            '6. 重复动作'
          ],
          safetyTips: [
            '使用保护杠或找人保护',
            '不要弹震',
            '保持肩胛骨收紧',
            '控制动作速度'
          ]
        }
      ],
      videoUrl: 'https://example.com/barbell-guide.mp4'
    },
    {
      name: '哑铃',
      type: 'dumbbell',
      description: '灵活的自由重量器械，适合单侧训练和孤立动作',
      exercises: [
        {
          name: '哑铃卧推',
          targetMuscles: ['胸大肌', '三角肌', '肱三头肌'],
          difficulty: '初中级',
          caloriesPerHour: 320,
          steps: [
            '1. 平躺在卧推凳上，双手各持一只哑铃',
            '2. 哑铃位于胸部两侧',
            '3. 用力将哑铃向上推起',
            '4. 在顶端短暂停留',
            '5. 缓慢放下哑铃至起始位置',
            '6. 重复动作'
          ],
          safetyTips: [
            '选择合适的重量',
            '保持动作控制',
            '避免哑铃相撞',
            '保持核心稳定'
          ]
        },
        {
          name: '哑铃弯举',
          targetMuscles: ['肱二头肌', '肱肌'],
          difficulty: '初级',
          caloriesPerHour: 250,
          steps: [
            '1. 站立，双手各持一只哑铃',
            '2. 手臂自然下垂，掌心向前',
            '3. 保持上臂不动，弯曲肘部',
            '4. 将哑铃举至肩部高度',
            '5. 短暂停留后缓慢放下',
            '6. 重复动作'
          ],
          safetyTips: [
            '不要借助身体摆动',
            '保持肘部固定',
            '控制下放速度',
            '避免锁死关节'
          ]
        }
      ],
      videoUrl: 'https://example.com/dumbbell-guide.mp4'
    },
    {
      name: '史密斯机',
      type: 'smith_machine',
      description: '固定轨迹器械，安全性高，适合初学者',
      exercises: [
        {
          name: '史密斯深蹲',
          targetMuscles: ['股四头肌', '臀大肌'],
          difficulty: '初中级',
          caloriesPerHour: 380,
          steps: [
            '1. 将杠铃调至合适高度',
            '2. 杠铃放在肩后斜方肌上',
            '3. 双脚略微前移',
            '4. 解锁杠铃，下蹲',
            '5. 蹲至大腿与地面平行',
            '6. 用力站起'
          ],
          safetyTips: [
            '可以随时锁定杠铃',
            '脚的位置可以靠前',
            '适合独自训练',
            '重量要适中'
          ]
        }
      ],
      videoUrl: 'https://example.com/smith-machine-guide.mp4'
    }
  ]
  
  return equipments[Math.floor(Math.random() * equipments.length)]
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
 * 调用Coze工作流聊天API（备用方案）
 * @param {string} message - 用户消息
 * @param {Array} history - 对话历史
 * @returns {Promise<Object>} AI回复
 */
const callCozeBot = async (message, history = []) => {
  try {
    // 生成对话名称（使用时间戳）
    const conversationName = 's' + new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)
    
    // 构建additional_messages数组
    const additionalMessages = [{
      content: message,
      content_type: 'text',
      role: 'user',
      type: 'question'
    }]
    
    const response = await new Promise((resolve, reject) => {
      console.log(JSON.stringify({ url: `${COZE_CONFIG.baseUrl}/workflows/chat`,
        method: 'POST',
        header: {
          'Authorization': `Bearer ${COZE_CONFIG.apiKey}`,
          'Content-Type': 'application/json'
        },
        data: {
          workflow_id: COZE_CONFIG.workflowId,
          app_id: COZE_CONFIG.appId,
          parameters: {
            CONVERSATION_NAME: conversationName,
            USER_INPUT: message
          },
          additional_messages: additionalMessages
        },}, null, 2))
      uni.request({
        url: `${COZE_CONFIG.baseUrl}/workflows/chat`,
        method: 'POST',
        header: {
          'Authorization': `Bearer ${COZE_CONFIG.apiKey}`,
          'Content-Type': 'application/json'
        },
        data: {
          workflow_id: COZE_CONFIG.workflowId,
          app_id: COZE_CONFIG.appId,
          parameters: {
            CONVERSATION_NAME: conversationName,
            USER_INPUT: message
          },
          additional_messages: additionalMessages
        },
        success: (res) => {
          // TODO流式输出响应解析
          console.log(res)
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

    // 检查响应状态码
    if (response.code !== 0) {
      throw new Error(`API调用失败: ${response.msg || '未知错误'}`)
    }

    // 提取响应内容
    let responseText = ''
    
    // 根据Coze工作流聊天API的响应格式解析
    if (response.data) {
      responseText = response.data
    } else if (response.messages && response.messages.length > 0) {
      // 获取最后一条助手消息
      const lastMessage = response.messages
        .filter(msg => msg.role === 'assistant')
        .pop()
      responseText = lastMessage?.content || ''
    } else if (response.output) {
      responseText = response.output
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
    console.error('Coze工作流聊天API调用失败:', error)
    throw error
  }
}

/**
 * AI聊天对话 - 智能教练（接入Coze）
 * @param {string} message - 用户消息
 * @param {Array} history - 对话历史
 * @returns {Promise<Object>} AI回复
 */
export const chatWithAI = async (message, history = []) => {
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
      return await callCozeBot(message, history)
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

