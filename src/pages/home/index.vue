<template>
  <view class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
    <!-- 顶部标题栏 -->
    <view class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="flex items-center justify-between px-6 py-4">
        <view>
          <text class="text-2xl font-bold">FitLens</text>
          <text class="block text-sm opacity-90 mt-1">{{ greeting }}，{{ userName }}</text>
        </view>
      </view>
    </view>

    <!-- 快速统计 -->
    <view class="m-4">
      <view class="bg-white rounded-2xl shadow-lg p-6">
        <text class="text-lg font-semibold text-gray-800 mb-4 block">今日数据</text>
        <view class="flex justify-around">
          <view class="text-center">
            <text class="text-3xl font-bold text-blue-600 block">{{ todayStats.workouts }}</text>
            <text class="text-sm text-gray-500 mt-1 block">训练次数</text>
          </view>
          <view class="text-center">
            <text class="text-3xl font-bold text-green-600 block">{{ todayStats.calories }}</text>
            <text class="text-sm text-gray-500 mt-1 block">消耗(kcal)</text>
          </view>
          <view class="text-center">
            <text class="text-3xl font-bold text-orange-600 block">{{ todayStats.duration }}</text>
            <text class="text-sm text-gray-500 mt-1 block">时长(分钟)</text>
          </view>
        </view>
      </view>
    </view>

    <!-- AI识别功能 -->
    <view class="m-4">
      <text class="text-lg font-semibold text-gray-800 mb-3 block px-2">AI智能识别</text>
      <view class="grid grid-cols-3 gap-3">
        <view 
          v-for="item in recognitionItems" 
          :key="item.id"
          @click="handleRecognitionClick(item)"
          class="bg-white rounded-xl shadow-md p-4 text-center cursor-pointer hover:shadow-lg transition-shadow"
        >
          <view :class="item.bgColor" class="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2">
            <text class="text-2xl">{{ item.icon }}</text>
          </view>
          <text class="text-sm font-medium text-gray-800 block">{{ item.title }}</text>
        </view>
      </view>
    </view>

    <!-- AI助手 -->
    <view class="m-4">
      <text class="text-lg font-semibold text-gray-800 mb-3 block px-2">AI助手</text>
      <view 
        @click="navigateTo('/pages/ai-chat/index')"
        class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 cursor-pointer"
      >
        <view class="flex items-center justify-between">
          <view>
            <text class="text-white text-xl font-bold block mb-2">💬 智能教练</text>
            <text class="text-white text-sm opacity-90 block">制定训练计划、营养建议</text>
          </view>
          <text class="text-white text-3xl">›</text>
        </view>
      </view>
    </view>

    <!-- 快速操作 -->
    <view class="m-4">
      <text class="text-lg font-semibold text-gray-800 mb-3 block px-2">快速操作</text>
      <view class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <view 
          v-for="(item, index) in quickActions" 
          :key="item.id"
          @click="handleQuickAction(item)"
          class="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50"
          :class="index < quickActions.length - 1 ? 'border-b border-gray-100' : ''"
        >
          <view class="flex items-center">
            <view :class="item.bgColor" class="w-10 h-10 rounded-lg flex items-center justify-center">
              <text class="text-xl">{{ item.icon }}</text>
            </view>
            <text class="ml-3 text-gray-800 font-medium">{{ item.title }}</text>
          </view>
          <text class="text-gray-400 text-xl">›</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { app } from '@/utils/cloudBase.js'

const auth = app.auth()

// 状态栏高度
const statusBarHeight = ref(0)

// 用户信息
const userInfo = ref({
  username: '用户',
  email: '',
  phone: '',
  uid: ''
})

// 今日统计数据
const todayStats = ref({
  workouts: 0,
  calories: 0,
  duration: 0
})

// AI识别功能项
const recognitionItems = [
  {
    id: 'action',
    title: '动作识别',
    icon: '🤸',
    bgColor: 'bg-blue-100',
    type: 'action'
  },
  {
    id: 'food',
    title: '食物热量',
    icon: '🍎',
    bgColor: 'bg-green-100',
    type: 'food'
  },
  {
    id: 'equipment',
    title: '器械识别',
    icon: '🏋️',
    bgColor: 'bg-orange-100',
    type: 'equipment'
  }
]

// 快速操作
const quickActions = [
  {
    id: 1,
    title: '添加训练记录',
    icon: '➕',
    bgColor: 'bg-blue-100',
    action: 'addRecord'
  },
  {
    id: 2,
    title: '查看历史记录',
    icon: '📊',
    bgColor: 'bg-green-100',
    action: 'viewRecords'
  },
  {
    id: 3,
    title: '个人设置',
    icon: '⚙️',
    bgColor: 'bg-gray-100',
    action: 'settings'
  }
]

// 计算问候语
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '凌晨好'
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 17) return '下午好'
  if (hour < 19) return '傍晚好'
  return '晚上好'
})

// 用户名称
const userName = computed(() => {
  return userInfo.value.username || '用户'
})

// 加载用户信息
const loadUserInfo = () => {
  try {
    const savedInfo = uni.getStorageSync('userInfo')
    if (savedInfo) {
      userInfo.value = savedInfo
    }
    
    const currentUser = auth.currentUser
    if (currentUser) {
      console.log('当前用户:', currentUser)
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

// 加载今日统计
const loadTodayStats = () => {
  try {
    const today = new Date().toDateString()
    const records = uni.getStorageSync('trainingRecords') || []
    
    const todayRecords = records.filter(r => {
      const recordDate = new Date(r.date).toDateString()
      return recordDate === today
    })
    
    todayStats.value = {
      workouts: todayRecords.length,
      calories: todayRecords.reduce((sum, r) => sum + (r.calories || 0), 0),
      duration: todayRecords.reduce((sum, r) => sum + (r.duration || 0), 0)
    }
  } catch (error) {
    console.error('加载今日统计失败:', error)
  }
}

// 处理识别功能点击
const handleRecognitionClick = (item) => {
  uni.navigateTo({
    url: `/pages/recognition/index?type=${item.type}`
  })
}

// 导航到页面
const navigateTo = (url) => {
  uni.navigateTo({ url })
}

// 处理快速操作
const handleQuickAction = (item) => {
  switch (item.action) {
    case 'addRecord':
      uni.navigateTo({ url: '/pages/add-record/index' })
      break
    case 'viewRecords':
      uni.switchTab({ url: '/pages/records/index' })
      break
    case 'settings':
      uni.navigateTo({ url: '/pages/settings/index' })
      break
    default:
      uni.showToast({
        title: '功能开发中',
        icon: 'none',
        duration: 2000
      })
  }
}

onMounted(() => {
  loadUserInfo()
  loadTodayStats()
  
  try {
    const systemInfo = uni.getSystemInfoSync()
    statusBarHeight.value = systemInfo.statusBarHeight || 0
  } catch (error) {
    console.error('获取系统信息失败:', error)
  }
})
</script>

