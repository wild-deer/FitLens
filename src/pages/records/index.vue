<template>
  <view class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 顶部标题栏 -->
    <view class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="flex items-center px-6 py-4">
        <text class="text-2xl font-bold">训练记录</text>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="flex items-center justify-center mt-20">
      <view class="text-center">
        <text class="text-6xl block mb-4">📊</text>
        <text class="text-gray-500 text-lg">暂无训练记录</text>
        <text class="text-gray-400 text-sm mt-2 block">开始你的第一次训练吧</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const statusBarHeight = ref(0)

onMounted(() => {
  // 获取系统信息
  try {
    const systemInfo = uni.getSystemInfoSync()
    statusBarHeight.value = systemInfo.statusBarHeight || 0
  } catch (error) {
    console.error('获取系统信息失败:', error)
  }
})
</script>

