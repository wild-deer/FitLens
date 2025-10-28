<template>
  <view class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 顶部导航栏 -->
    <view class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="flex items-center px-6 py-4">
        <view @click="goBack" class="mr-4 cursor-pointer">
          <text class="text-2xl">←</text>
        </view>
        <text class="text-xl font-bold">添加训练记录</text>
      </view>
    </view>

    <!-- 表单内容 -->
    <view class="p-4 space-y-4">
      <!-- 日期选择 -->
      <view class="bg-white rounded-2xl shadow-lg p-6">
        <text class="text-base font-semibold text-gray-800 block mb-3">训练日期</text>
        <picker mode="date" :value="formData.date" @change="onDateChange">
          <view class="border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between">
            <text class="text-gray-800">{{ formData.date || '选择日期' }}</text>
            <text class="text-gray-400">📅</text>
          </view>
        </picker>
      </view>

      <!-- 运动类型 -->
      <view class="bg-white rounded-2xl shadow-lg p-6">
        <text class="text-base font-semibold text-gray-800 block mb-3">运动类型</text>
        <picker :range="exerciseTypes" range-key="name" @change="onExerciseTypeChange">
          <view class="border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between">
            <text class="text-gray-800">{{ selectedExerciseType || '选择运动类型' }}</text>
            <text class="text-gray-400">▼</text>
          </view>
        </picker>
      </view>

      <!-- 动作名称 -->
      <view class="bg-white rounded-2xl shadow-lg p-6">
        <text class="text-base font-semibold text-gray-800 block mb-3">动作名称</text>
        <input
          v-model="formData.exerciseName"
          type="text"
          placeholder="例如：深蹲、卧推等"
          class="border border-gray-300 rounded-lg px-4 py-3 w-full"
        />
      </view>

      <!-- 组数和次数 -->
      <view class="bg-white rounded-2xl shadow-lg p-6">
        <text class="text-base font-semibold text-gray-800 block mb-3">组数和次数</text>
        <view class="grid grid-cols-2 gap-4">
          <view>
            <text class="text-sm text-gray-600 mb-2 block">组数</text>
            <input
              v-model.number="formData.sets"
              type="number"
              placeholder="组数"
              class="border border-gray-300 rounded-lg px-4 py-3 w-full"
            />
          </view>
          <view>
            <text class="text-sm text-gray-600 mb-2 block">每组次数</text>
            <input
              v-model.number="formData.reps"
              type="number"
              placeholder="次数"
              class="border border-gray-300 rounded-lg px-4 py-3 w-full"
            />
          </view>
        </view>
      </view>

      <!-- 重量（可选） -->
      <view class="bg-white rounded-2xl shadow-lg p-6">
        <text class="text-base font-semibold text-gray-800 block mb-3">重量（可选）</text>
        <view class="flex items-center">
          <input
            v-model.number="formData.weight"
            type="digit"
            placeholder="0"
            class="flex-1 border border-gray-300 rounded-lg px-4 py-3"
          />
          <text class="ml-3 text-gray-600">kg</text>
        </view>
      </view>

      <!-- 训练时长 -->
      <view class="bg-white rounded-2xl shadow-lg p-6">
        <text class="text-base font-semibold text-gray-800 block mb-3">训练时长</text>
        <view class="flex items-center">
          <input
            v-model.number="formData.duration"
            type="number"
            placeholder="0"
            class="flex-1 border border-gray-300 rounded-lg px-4 py-3"
          />
          <text class="ml-3 text-gray-600">分钟</text>
        </view>
      </view>

      <!-- 强度 -->
      <view class="bg-white rounded-2xl shadow-lg p-6">
        <view class="flex items-center justify-between mb-3">
          <text class="text-base font-semibold text-gray-800">训练强度</text>
          <text class="text-blue-600 font-semibold">{{ formData.intensity }} / 10</text>
        </view>
        <slider
          :value="formData.intensity"
          @change="onIntensityChange"
          min="1"
          max="10"
          step="1"
          activeColor="#3b82f6"
          backgroundColor="#e5e7eb"
          block-size="20"
          show-value
        />
        <view class="flex justify-between mt-2">
          <text class="text-xs text-gray-500">轻松</text>
          <text class="text-xs text-gray-500">适中</text>
          <text class="text-xs text-gray-500">极限</text>
        </view>
      </view>

      <!-- 预计消耗热量 -->
      <view v-if="estimatedCalories > 0" class="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl shadow-lg p-6">
        <view class="flex items-center justify-between">
          <view>
            <text class="text-sm text-gray-600 block mb-1">预计消耗热量</text>
            <view class="flex items-baseline">
              <text class="text-3xl font-bold text-orange-600">{{ estimatedCalories }}</text>
              <text class="text-gray-600 ml-2">大卡</text>
            </view>
          </view>
          <text class="text-4xl">🔥</text>
        </view>
      </view>

      <!-- 备注 -->
      <view class="bg-white rounded-2xl shadow-lg p-6">
        <text class="text-base font-semibold text-gray-800 block mb-3">备注（可选）</text>
        <textarea
          v-model="formData.notes"
          placeholder="记录训练感受、身体状态等..."
          class="border border-gray-300 rounded-lg px-4 py-3 w-full"
          :maxlength="200"
          :auto-height="true"
        />
      </view>

      <!-- 提交按钮 -->
      <view class="flex space-x-3 pb-4">
        <view 
          @click="goBack"
          class="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl text-center cursor-pointer"
        >
          <text class="font-semibold">取消</text>
        </view>
        <view 
          @click="saveRecord"
          class="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl text-center cursor-pointer"
        >
          <text class="font-semibold">保存记录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { calculateCalories } from '@/utils/aiService.js'

const statusBarHeight = ref(0)

// 运动类型选项
const exerciseTypes = [
  { id: 'strength_training', name: '力量训练' },
  { id: 'running', name: '跑步' },
  { id: 'cycling', name: '骑行' },
  { id: 'swimming', name: '游泳' },
  { id: 'yoga', name: '瑜伽' },
  { id: 'hiit', name: 'HIIT' },
  { id: 'walking', name: '快走' },
  { id: 'basketball', name: '篮球' },
  { id: 'football', name: '足球' },
  { id: 'rope_jumping', name: '跳绳' }
]

// 表单数据
const formData = ref({
  date: new Date().toISOString().split('T')[0],
  exerciseType: '',
  exerciseName: '',
  sets: null,
  reps: null,
  weight: null,
  duration: null,
  intensity: 5,
  notes: ''
})

const selectedExerciseType = ref('')

// 预计消耗热量
const estimatedCalories = computed(() => {
  if (!formData.value.exerciseType || !formData.value.duration) {
    return 0
  }

  // 获取用户体重（从本地存储）
  let userWeight = 70 // 默认70kg
  try {
    const userProfile = uni.getStorageSync('userProfile')
    if (userProfile && userProfile.weight) {
      userWeight = userProfile.weight
    }
  } catch (error) {
    console.error('获取用户体重失败:', error)
  }

  return calculateCalories({
    exerciseType: formData.value.exerciseType,
    duration: formData.value.duration,
    weight: userWeight,
    intensity: formData.value.intensity
  })
})

// 返回
const goBack = () => {
  uni.navigateBack()
}

// 日期变化
const onDateChange = (e) => {
  formData.value.date = e.detail.value
}

// 运动类型变化
const onExerciseTypeChange = (e) => {
  const index = e.detail.value
  formData.value.exerciseType = exerciseTypes[index].id
  selectedExerciseType.value = exerciseTypes[index].name
}

// 强度变化
const onIntensityChange = (e) => {
  formData.value.intensity = e.detail.value
}

// 保存记录
const saveRecord = () => {
  // 验证必填项
  if (!formData.value.exerciseType) {
    uni.showToast({
      title: '请选择运动类型',
      icon: 'none',
      duration: 2000
    })
    return
  }

  if (!formData.value.exerciseName) {
    uni.showToast({
      title: '请输入动作名称',
      icon: 'none',
      duration: 2000
    })
    return
  }

  if (!formData.value.duration) {
    uni.showToast({
      title: '请输入训练时长',
      icon: 'none',
      duration: 2000
    })
    return
  }

  try {
    // 获取现有记录
    const records = uni.getStorageSync('trainingRecords') || []

    // 创建新记录
    const newRecord = {
      id: Date.now().toString(),
      ...formData.value,
      exerciseTypeName: selectedExerciseType.value,
      calories: estimatedCalories.value,
      createdAt: Date.now()
    }

    // 添加到记录列表
    records.unshift(newRecord)

    // 保存
    uni.setStorageSync('trainingRecords', records)

    uni.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 2000
    })

    // 延迟返回
    setTimeout(() => {
      uni.navigateBack()
    }, 2000)
  } catch (error) {
    console.error('保存记录失败:', error)
    uni.showToast({
      title: '保存失败',
      icon: 'none',
      duration: 2000
    })
  }
}

onMounted(() => {
  try {
    const systemInfo = uni.getSystemInfoSync()
    statusBarHeight.value = systemInfo.statusBarHeight || 0
  } catch (error) {
    console.error('获取系统信息失败:', error)
  }
})
</script>

