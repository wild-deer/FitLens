<template>
  <view class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 顶部标题栏 -->
    <view class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="flex items-center px-6 py-4">
        <text class="text-2xl font-bold">我的</text>
      </view>
    </view>

    <!-- 用户信息卡片 -->
    <view class="m-4 bg-white rounded-2xl shadow-lg p-6">
      <view class="flex items-center">
        <view class="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
          <text class="text-2xl text-white font-bold">{{ userInitial }}</text>
        </view>
        <view class="ml-4 flex-1">
          <text class="text-lg font-semibold text-gray-800 block">{{ userInfo.username || '用户' }}</text>
          <text class="text-sm text-gray-500 block mt-1">{{ userInfo.email || userInfo.phone || '未设置联系方式' }}</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="m-4">
      <view class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <view 
          v-for="item in menuItems" 
          :key="item.id"
          @click="handleMenuClick(item)"
          class="flex items-center justify-between px-6 py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
          :class="item.id === menuItems.length ? '' : 'border-b border-gray-100'"
        >
          <view class="flex items-center">
            <view :class="item.iconBg" class="w-10 h-10 rounded-lg flex items-center justify-center">
              <text :class="item.iconColor" class="text-xl">{{ item.icon }}</text>
            </view>
            <view class="ml-3">
              <text class="text-gray-800 font-medium block">{{ item.title }}</text>
              <text class="text-xs text-gray-500">{{ item.desc }}</text>
            </view>
          </view>
          <text class="text-gray-400 text-xl">›</text>
        </view>
      </view>
    </view>

    <!-- 退出登录按钮 -->
    <view class="m-4 mt-6">
      <view 
        @click="handleLogout"
        class="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
      >
        <view class="flex items-center justify-center px-6 py-4">
          <text class="text-red-500 font-semibold text-lg">退出登录</text>
        </view>
      </view>
    </view>

    <!-- 统计数据 -->
    <view class="m-4 grid grid-cols-2 gap-4">
      <view class="bg-white rounded-2xl shadow-lg p-6">
        <view class="flex items-center justify-between mb-3">
          <text class="text-3xl text-blue-500 font-bold">{{ stats.workouts }}</text>
          <view class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <text class="text-2xl">💪</text>
          </view>
        </view>
        <text class="text-sm text-gray-600">健身记录</text>
      </view>
      
      <view class="bg-white rounded-2xl shadow-lg p-6">
        <view class="flex items-center justify-between mb-3">
          <text class="text-3xl text-green-500 font-bold">{{ stats.days }}</text>
          <view class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <text class="text-2xl">📅</text>
          </view>
        </view>
        <text class="text-sm text-gray-600">持续天数</text>
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

const userInfo = ref({
  username: '用户',
  email: '',
  phone: '',
  uid: ''
})

const stats = ref({
  workouts: 0,
  days: 0
})

const menuItems = [
  {
    id: 1,
    title: '个人设置',
    desc: '管理个人信息',
    icon: '⚙️',
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600'
  },
  {
    id: 2,
    title: '数据统计',
    desc: '查看详细分析',
    icon: '📈',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    id: 3,
    title: '关于我们',
    desc: '了解FitLens',
    icon: 'ℹ️',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  }
]

// 计算用户首字母
const userInitial = computed(() => {
  if (userInfo.value.username && userInfo.value.username !== '用户') {
    return userInfo.value.username.charAt(0).toUpperCase()
  }
  return '👤'
})

// 加载用户信息
const loadUserInfo = () => {
  try {
    // 从本地存储读取
    const savedInfo = uni.getStorageSync('userInfo')
    if (savedInfo) {
      userInfo.value = savedInfo
    }
    
    // 获取当前登录用户
    const currentUser = auth.currentUser
    if (currentUser) {
      console.log('当前用户:', currentUser)
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

// 处理菜单点击
const handleMenuClick = (item) => {
  console.log('点击菜单:', item.title)
  // 这里可以添加具体的功能跳转逻辑
  uni.showToast({
    title: `${item.title}功能开发中`,
    icon: 'none',
    duration: 2000
  })
}

// 退出登录
const handleLogout = () => {
  uni.showModal({
    title: '确认退出',
    content: '确定要退出登录吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await auth.signOut()
          // 清除本地存储
          uni.removeStorageSync('userInfo')
          
          uni.showToast({
            title: '已退出登录',
            icon: 'success',
            duration: 2000
          })
          
          // 跳转回登录页
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/index/index'
            })
          }, 2000)
        } catch (error) {
          console.error('退出登录失败:', error)
          uni.showToast({
            title: '退出失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    }
  })
}

onMounted(() => {
  loadUserInfo()
  
  // 获取系统信息
  try {
    const systemInfo = uni.getSystemInfoSync()
    statusBarHeight.value = systemInfo.statusBarHeight || 0
  } catch (error) {
    console.error('获取系统信息失败:', error)
  }
})
</script>

