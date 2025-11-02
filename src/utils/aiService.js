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
 * 上传文件到Coze，返回文件对象（包含id）
 * @param {string} filePath - 本地文件路径（uni.chooseImage返回的tempFilePath）
 * @param {string} [fileName] - 可选的文件名
 * @returns {Promise<{ id: string, file_name: string, bytes: number, created_at: number }>} 上传结果
 */
export const uploadFileToCoze = async (filePath, fileName = 'upload.jpg') => {
  if (!COZE_CONFIG.apiKey) {
    throw new Error('未配置Coze API Key')
  }

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${COZE_CONFIG.baseUrl}/files/upload`,
      filePath,
      name: 'file',
      header: {
        'Authorization': `Bearer ${COZE_CONFIG.apiKey}`
      },
      formData: {
        // 有些平台需要明确传文件名
        file: fileName
      },
      success: (res) => {
        try {
          // 部分平台res.data为字符串
          const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
          if (data && data.code === 0 && data.data && data.data.id) {
            resolve(data.data)
          } else {
            reject(new Error(data?.msg || '文件上传失败'))
          }
        } catch (e) {
          reject(new Error('解析上传响应失败'))
        }
      },
      fail: (err) => reject(err)
    })
  })
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
const callCozeBot = async (message, history = [], onProgress = null, options = {}) => {
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

    // 如果有文件ID，传入img参数为字符串化的JSON：{"file_id":"..."}
    if (options && options.fileId) {
      requestData.parameters.img = JSON.stringify({ file_id: String(options.fileId) })
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
        // 兼容性解码函数，避免在小程序中直接使用TextDecoder
        const decodeUtf8 = (arrayBuffer) => {
          try {
            if (typeof TextDecoder !== 'undefined') {
              return new TextDecoder('utf-8').decode(new Uint8Array(arrayBuffer))
            }
          } catch (_) {}
          try {
            const bytes = new Uint8Array(arrayBuffer)
            let binary = ''
            const chunkSize = 0x8000
            for (let i = 0; i < bytes.length; i += chunkSize) {
              binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize))
            }
            return decodeURIComponent(escape(binary))
          } catch (_) {
            // 最后兜底：直接返回二进制转字符串，可能会有编码问题
            try {
              const bytes = new Uint8Array(arrayBuffer)
              let binary = ''
              for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
              return binary
            } catch (e) {
              return ''
            }
          }
        }
        
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
            const chunk = decodeUtf8(res.data)
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
export const chatWithAI = async (message, history = [], onProgress = null, options = {}) => {
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
      return await callCozeBot(message, history, onProgress, options)
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

