<template>
  <view class="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 顶部导航栏 -->
    <view class="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" :style="{ paddingTop: statusBarHeight + 'px' }">
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
      class="flex-1"
      :scroll-top="scrollTop"
      scroll-with-animation
      :scroll-into-view="scrollIntoView"
    >
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
      <view v-for="(message, index) in messages" :key="index" :id="'msg-' + index" class="mb-4">
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
              <text class="text-sm text-gray-800 whitespace-pre-wrap">{{ message.content }}</text>
              <text class="text-xs text-gray-400 mt-2 block">{{ formatTime(message.timestamp) }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载中 -->
      <view v-if="isLoading" class="flex justify-start mb-4">
        <view class="flex items-start">
          <view class="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-2">
            <text class="text-white text-sm">AI</text>
          </view>
          <view class="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-md">
            <text class="text-sm text-gray-500">正在思考...</text>
          </view>
        </view>
      </view>
      </view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="bg-white border-t border-gray-200 safe-area-bottom">
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
import { ref, computed, onMounted, nextTick } from 'vue'
import { chatWithAI } from '@/utils/aiService.js'

const statusBarHeight = ref(0)
const messages = ref([])
const inputMessage = ref('')
const isLoading = ref(false)
const scrollTop = ref(0)
const scrollIntoView = ref('')

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

  try {
    const response = await chatWithAI(userMessage, messages.value)
    
    // 添加AI回复
    messages.value.push({
      role: 'assistant',
      content: response.content,
      timestamp: response.timestamp || Date.now()
    })

    // 保存消息
    saveMessages()

    // 滚动到底部
    await scrollToBottom()
  } catch (error) {
    console.error('获取AI回复失败:', error)
    uni.showToast({
      title: '发送失败，请重试',
      icon: 'none',
      duration: 2000
    })
  } finally {
    isLoading.value = false
  }
}

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  scrollIntoView.value = 'msg-' + (messages.value.length - 1)
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
})
</script>

<style scoped>
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>

