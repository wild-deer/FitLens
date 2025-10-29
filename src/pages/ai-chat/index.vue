<template>
  <view class="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
    <!-- 顶部导航栏 -->
    <view class="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg " :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="flex items-center justify-between px-6 py-4">
        <view class="flex items-center">
          <view @click="goBack" class="mr-4 cursor-pointer">
            <text class="text-2xl">←</text>
          </view>
          <view>
            <text class="text-xl font-bold block">AI智能教练</text>
            <text class="text-xs opacity-90">为您提供专业的健身指导</text>
          </view>
        </view>
        <view @click="clearHistory" class="cursor-pointer self-end mb-1">
          <text class="text-sm">🗑️</text>
        </view>
      </view>
    </view>

    <!-- 聊天消息区域 -->
    <scroll-view 
      scroll-y 
      class="flex-1 chat-scroll-view"
      style="flex: 1; height: 0;"
      :scroll-top="scrollTop"
      scroll-with-animation
    >
      <view class="scroll-view-content">
      <view class="max-w-3xl mx-auto px-4 py-4">
      <!-- 欢迎消息 -->
      <view v-if="messages.length === 0" class="text-center py-10">
        <text class="text-6xl block mb-4">💪</text>
        <text class="text-gray-600 text-lg block mb-2">您好！我是您的AI健身教练</text>
        <text class="text-gray-500 text-sm block mb-6">有任何健身问题都可以问我</text>
        
        <view class="space-y-2 px-4">
          <text class="text-sm text-gray-600 block mb-2">快速问题：</text>
          <view 
            v-for="(question, index) in quickQuestions" 
            :key="index"
            @click="sendQuickQuestion(question)"
            class="bg-white rounded-lg px-4 py-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
          >
            <text class="text-blue-600 text-sm">{{ question }}</text>
          </view>
        </view>
      </view>

      <!-- 消息列表 -->
      <view v-for="(message, index) in messages" :key="index" class="mb-4">
        <!-- 用户消息 -->
        <view v-if="message.role === 'user'" class="flex justify-end">
          <view class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-xs shadow-md">
            <text class="text-sm">{{ message.content }}</text>
          </view>
        </view>

        <!-- AI消息 -->
        <view v-else class="flex justify-start">
          <view class="flex items-start max-w-sm">
            <view class="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
              <text class="text-white text-sm">AI</text>
            </view>
            <view class="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-md flex-1">
              <!-- 如果内容为空且正在加载，显示"正在思考..." -->
              <text v-if="!message.content && isLoading" class="text-sm text-gray-500">正在思考...</text>
              <!-- 否则显示实际内容 -->
              <text v-else class="text-sm text-gray-800 whitespace-pre-wrap">{{ message.content }}</text>
              <text v-if="message.content" class="text-xs text-gray-400 mt-2 block">{{ formatTime(message.timestamp) }}</text>
            </view>
          </view>
        </view>
      </view>
      </view>
      </view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="bg-white border-t border-gray-200 safe-area-bottom ">
      <view class="max-w-3xl mx-auto px-4 pt-3 pb-2">
      <view class="flex items-end space-x-2">
        <textarea
          v-model="inputMessage"
          placeholder="输入您的问题..."
          class="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm min-h-0"
          :auto-height="true"
          :maxlength="500"
          @confirm="sendMessage"
        />
        <view 
          @click="sendMessage"
          :class="canSend ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-300'"
          class="w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer flex-shrink-0 ml-3"
        >
          <text class="text-white text-xl">📤</text>
        </view>
      </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { chatWithAI } from '@/utils/aiService.js'

const statusBarHeight = ref(0)
const messages = ref([{
    role: 'user',
    content: " # 时光之隙的重逢\n在那座古老小镇的尽头，有一家弥漫着旧时光味道的咖啡馆。木质的招牌在微风中轻轻摇晃，上面的字迹虽已有些斑驳，但“时光角落”四个字依然清晰可辨。\n\n林羽推开咖啡馆的门，清脆的铃铛声打破了午后的宁静。他的眼神在店内扫过，最终落在了靠窗的那个位置，那里曾是他和苏瑶无数次相对而坐的地方。\n\n林羽和苏瑶是高中同学，青春的懵懂与纯真在两人之间悄然滋生。他们一起在校园的林荫道上漫步，分享着彼此的梦想与忧愁。高考结束后，他们约定要一起去同一座城市上大学，然后相伴一生。\n\n然而，命运却在他们最美好的时刻开了一个残酷的玩笑。苏瑶的家庭突然遭遇变故，她不得不跟随家人搬到遥远的城市。分别的那天，两人在火车站相拥而泣，承诺一定会保持联系。\n\n随着时间的推移，生活的压力和距离的隔阂让他们的联系越来越少。那些曾经的誓言，在岁月的长河中渐渐模糊。\n\n林羽在这座小镇上开了一家小书店，日子过得平淡而安稳。但他的内心深处，始终有一个角落留给了苏瑶。\n\n那是一个寻常的午后，林羽像往常一样来到“时光角落”咖啡馆。当他坐下，准备点一杯拿铁时，一个熟悉的身影出现在门口。他的呼吸瞬间停滞，是苏瑶！\n\n苏瑶穿着一条淡蓝色的连衣裙，岁月似乎在她身上留下了温柔的痕迹。她的眼神在店内搜索着，最终与林羽的目光交汇。两人都愣住了，仿佛时间在这一刻凝固。\n\n“林羽……”苏瑶轻声唤道，声音带着一丝颤抖。\n\n林羽站起身，朝她走去。“苏瑶，真的是你。”他的声音也有些哽咽。\n\n他们在曾经的老位置坐下，开始诉说这些年的经历。苏瑶说，她在新的城市里努力打拼，经历了许多挫折和困难，但始终没有忘记林羽。而林羽也讲述了自己在小镇上的生活，开书店的点点滴滴。\n\n“这么多年，我一直在想，我们还会不会有重逢的那一天。”苏瑶的眼中闪烁着泪光。\n\n林羽伸出手，轻轻握住她的手。“现在，我们不就重逢了吗？也许这就是命运的安排。”\n\n窗外，阳光透过树叶的缝隙洒在地面上，形成一片片光斑。他们坐在那里，仿佛又回到了高中时代，那些美好的回忆如潮水般涌来。\n\n从那以后，苏瑶经常来小镇看望林羽。他们一起在书店里整理书籍，一起在小镇的街道上散步。曾经的爱情，在时光的缝隙中重新绽放。\n\n多年后，小镇上举行了一场温馨的婚礼。林羽和苏瑶在亲朋好友的祝福下，步入了婚姻的殿堂。他们知道，这份跨越时光的爱情来之不易，他们会珍惜彼此，在未来的日子里，一起走过每一个春夏秋冬。\n\n时光或许会改变很多东西，但有些情感，就像深埋在心底的种子，一旦遇到合适的时机，就会生根发芽，绽放出最美丽的花朵。而林羽和苏瑶的爱情，就是那朵在时光之隙中盛开的花，永远散发着迷人的芬芳。 ",
    timestamp: Date.now()
  }])
const inputMessage = ref('')
const isLoading = ref(false)
const scrollTop = ref(0)
let autoScrollTimer = null

// 快速问题
const quickQuestions = [
  '帮我制定一个减脂训练计划',
  '如何增肌最有效？',
  '健身期间应该怎么吃？',
  '新手应该从哪些动作开始？'
]

// 是否可以发送
const canSend = computed(() => {
  return inputMessage.value.trim().length > 0 && !isLoading.value
})

// 格式化时间
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

// 返回
const goBack = () => {
  uni.navigateBack()
}

// 清空历史
const clearHistory = () => {
  uni.showModal({
    title: '确认清空',
    content: '确定要清空聊天记录吗？',
    success: (res) => {
      if (res.confirm) {
        messages.value = []
        saveMessages()
        uni.showToast({
          title: '已清空',
          icon: 'success',
          duration: 2000
        })
      }
    }
  })
}

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  return new Promise((resolve) => {
    const query = uni.createSelectorQuery()
    query.select('.chat-scroll-view').boundingClientRect()
    query.select('.scroll-view-content').boundingClientRect()
    query.exec((res) => {
      if (res && res[0] && res[1]) {
        const scrollViewHeight = res[0].height
        const scrollContentHeight = res[1].height
        if (scrollContentHeight > scrollViewHeight) {
          scrollTop.value = scrollContentHeight - scrollViewHeight
        }
      }
      resolve()
    })
  })
}

// 启动自动滚动（每秒滚动一次）
const startAutoScroll = () => {
  stopAutoScroll() // 先清除可能存在的定时器
  autoScrollTimer = setInterval(() => {
    scrollToBottom()
  }, 1000) // 每秒滚动一次
}

// 停止自动滚动
const stopAutoScroll = () => {
  if (autoScrollTimer) {
    clearInterval(autoScrollTimer)
    autoScrollTimer = null
  }
}

// 发送快速问题
const sendQuickQuestion = (question) => {
  inputMessage.value = question
  sendMessage()
}

// 发送消息
const sendMessage = async () => {
  if (!canSend.value) return

  const userMessage = inputMessage.value.trim()
  inputMessage.value = ''

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: userMessage,
    timestamp: Date.now()
  })

  // 滚动到底部
  await scrollToBottom()

  // 获取AI回复
  isLoading.value = true
  
  // 先创建一个空的AI消息用于接收流式数据
  const aiMessageIndex = messages.value.length
  messages.value.push({
    role: 'assistant',
    content: '',
    timestamp: Date.now()
  })

  // 启动自动滚动（每秒滚动一次）
  startAutoScroll()

  try {
    // 定义流式回调函数
    const onProgress = (chunk) => {
      // 实时更新AI消息内容
      messages.value[aiMessageIndex].content += chunk
      // 不在这里调用滚动，由定时器自动处理
    }
    
    const response = await chatWithAI(userMessage, messages.value.slice(0, aiMessageIndex), onProgress)
    
    // 确保最终内容完整（防止流式传输中有遗漏）
    if (response.content && messages.value[aiMessageIndex].content !== response.content) {
      messages.value[aiMessageIndex].content = response.content
    }
    
    // 更新时间戳
    messages.value[aiMessageIndex].timestamp = response.timestamp || Date.now()

    // 保存消息
    saveMessages()

    // 停止自动滚动
    stopAutoScroll()
    
    // 等待 DOM 更新后再滚动到底部
    await nextTick()
    await scrollToBottom()
  } catch (error) {
    console.error('获取AI回复失败:', error)
    
    // 停止自动滚动
    stopAutoScroll()
    
    // 如果失败，移除空的AI消息
    if (messages.value[aiMessageIndex] && !messages.value[aiMessageIndex].content) {
      messages.value.splice(aiMessageIndex, 1)
    }
    
    uni.showToast({
      title: '发送失败，请重试',
      icon: 'none',
      duration: 2000
    })
  } finally {
    isLoading.value = false
  }
}



// 保存消息
const saveMessages = () => {
  try {
    uni.setStorageSync('chatMessages', messages.value)
  } catch (error) {
    console.error('保存消息失败:', error)
  }
}

// 加载历史消息
const loadMessages = () => {
  try {
    const savedMessages = uni.getStorageSync('chatMessages')
    if (savedMessages && Array.isArray(savedMessages)) {
      messages.value = savedMessages
    }
  } catch (error) {
    console.error('加载消息失败:', error)
  }
}

onMounted(() => {
  try {
    const systemInfo = uni.getSystemInfoSync()
    statusBarHeight.value = systemInfo.statusBarHeight || 0
  } catch (error) {
    console.error('获取系统信息失败:', error)
  }
  
  loadMessages()
  // 加载消息后滚动到底部
  scrollToBottom()
})

onUnmounted(() => {
  // 清除自动滚动定时器
  stopAutoScroll()
})
</script>

<style scoped>
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>

