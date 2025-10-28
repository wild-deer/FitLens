<template>
  <view class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 顶部导航栏 -->
    <view class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="flex items-center px-6 py-4">
        <view @click="goBack" class="mr-4 cursor-pointer">
          <text class="text-2xl">←</text>
        </view>
        <text class="text-xl font-bold">{{ pageTitle }}</text>
      </view>
    </view>

    <!-- 主内容区 -->
    <view class="p-4">
      <!-- 拍照/选择图片区域 -->
      <view v-if="!imageUrl" class="bg-white rounded-2xl shadow-lg p-8 text-center">
        <view class="mb-6">
          <text class="text-6xl block mb-4">{{ typeIcon }}</text>
          <text class="text-gray-600 text-lg block">{{ typeDescription }}</text>
        </view>
        
        <view class="space-y-3">
          <view 
            @click="takePhoto"
            class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl cursor-pointer"
          >
            <text class="font-semibold">📷 拍照识别</text>
          </view>
          
          <view 
            @click="chooseImage"
            class="border-2 border-blue-500 text-blue-600 py-4 rounded-xl cursor-pointer"
          >
            <text class="font-semibold">🖼️ 从相册选择</text>
          </view>
        </view>
      </view>

      <!-- 图片预览和识别结果 -->
      <view v-else class="space-y-4">
        <!-- 图片预览 -->
        <view class="bg-white rounded-2xl shadow-lg p-4">
          <image 
            :src="imageUrl" 
            mode="aspectFit"
            class="w-full rounded-xl"
            style="height: 300px;"
          />
          <view class="flex justify-center mt-4 space-x-3">
            <view 
              @click="resetImage"
              class="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg text-center cursor-pointer"
            >
              <text>重新选择</text>
            </view>
            <view 
              v-if="!isRecognizing && !recognitionResult"
              @click="startRecognition"
              class="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg text-center cursor-pointer"
            >
              <text>开始识别</text>
            </view>
          </view>
        </view>

        <!-- 识别中 -->
        <view v-if="isRecognizing" class="bg-white rounded-2xl shadow-lg p-8 text-center">
          <text class="text-4xl block mb-4">🔍</text>
          <text class="text-gray-600 text-lg block mb-2">AI正在识别中...</text>
          <text class="text-gray-500 text-sm">请稍候</text>
        </view>

        <!-- 识别结果 - 动作识别 -->
        <view v-if="recognitionResult && recognitionType === 'action'" class="bg-white rounded-2xl shadow-lg p-6">
          <view class="flex items-center justify-between mb-4">
            <text class="text-xl font-bold text-gray-800">识别结果</text>
            <view :class="recognitionResult.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" 
                  class="px-3 py-1 rounded-full text-sm">
              {{ recognitionResult.correct ? '✓ 动作正确' : '✗ 需要改进' }}
            </view>
          </view>
          
          <view class="mb-4">
            <text class="text-lg font-semibold text-gray-800 block mb-2">动作名称：{{ recognitionResult.name }}</text>
            <view class="flex items-center">
              <text class="text-gray-600 mr-2">评分：</text>
              <text :class="recognitionResult.score >= 80 ? 'text-green-600' : recognitionResult.score >= 60 ? 'text-orange-600' : 'text-red-600'" 
                    class="text-2xl font-bold">{{ recognitionResult.score }}</text>
              <text class="text-gray-500 ml-1">/ 100</text>
            </view>
          </view>

          <view v-if="recognitionResult.errors && recognitionResult.errors.length > 0" class="mb-4">
            <text class="text-base font-semibold text-red-600 block mb-2">⚠️ 发现的问题：</text>
            <view v-for="(error, index) in recognitionResult.errors" :key="index" class="bg-red-50 px-3 py-2 rounded-lg mb-2">
              <text class="text-red-700 text-sm">{{ index + 1 }}. {{ error }}</text>
            </view>
          </view>

          <view v-if="recognitionResult.suggestions && recognitionResult.suggestions.length > 0">
            <text class="text-base font-semibold text-blue-600 block mb-2">💡 改进建议：</text>
            <view v-for="(suggestion, index) in recognitionResult.suggestions" :key="index" class="bg-blue-50 px-3 py-2 rounded-lg mb-2">
              <text class="text-blue-700 text-sm">{{ index + 1 }}. {{ suggestion }}</text>
            </view>
          </view>
        </view>

        <!-- 识别结果 - 食物热量 -->
        <view v-if="recognitionResult && recognitionType === 'food'" class="bg-white rounded-2xl shadow-lg p-6">
          <text class="text-xl font-bold text-gray-800 block mb-4">识别结果</text>
          
          <view class="mb-4">
            <text class="text-lg font-semibold text-gray-800 block mb-2">{{ recognitionResult.name }}</text>
            <view class="flex items-baseline">
              <text class="text-4xl font-bold text-orange-600">{{ recognitionResult.totalCalories }}</text>
              <text class="text-gray-500 ml-2">大卡</text>
            </view>
            <text class="text-sm text-gray-500 mt-1">约 {{ recognitionResult.weight }}{{ recognitionResult.unit }}</text>
          </view>

          <view class="bg-gray-50 rounded-lg p-4 mb-4">
            <text class="text-base font-semibold text-gray-800 block mb-3">营养成分</text>
            <view class="grid grid-cols-2 gap-3">
              <view class="text-center">
                <text class="text-2xl font-bold text-blue-600 block">{{ recognitionResult.nutrition.protein }}g</text>
                <text class="text-sm text-gray-600">蛋白质</text>
              </view>
              <view class="text-center">
                <text class="text-2xl font-bold text-green-600 block">{{ recognitionResult.nutrition.carbs }}g</text>
                <text class="text-sm text-gray-600">碳水</text>
              </view>
              <view class="text-center">
                <text class="text-2xl font-bold text-orange-600 block">{{ recognitionResult.nutrition.fat }}g</text>
                <text class="text-sm text-gray-600">脂肪</text>
              </view>
              <view class="text-center">
                <text class="text-2xl font-bold text-purple-600 block">{{ recognitionResult.nutrition.fiber }}g</text>
                <text class="text-sm text-gray-600">纤维</text>
              </view>
            </view>
          </view>

          <view v-if="recognitionResult.ingredients && recognitionResult.ingredients.length > 0" class="mb-4">
            <text class="text-base font-semibold text-gray-800 block mb-2">食材构成</text>
            <view v-for="(ingredient, index) in recognitionResult.ingredients" :key="index" class="flex justify-between py-2 border-b border-gray-100">
              <text class="text-gray-700">{{ ingredient.name }} ({{ ingredient.weight }}{{ ingredient.unit }})</text>
              <text class="text-gray-600">{{ ingredient.calories }} kcal</text>
            </view>
          </view>

          <view v-if="recognitionResult.tips && recognitionResult.tips.length > 0">
            <text class="text-base font-semibold text-green-600 block mb-2">🌟 健康建议</text>
            <view v-for="(tip, index) in recognitionResult.tips" :key="index" class="bg-green-50 px-3 py-2 rounded-lg mb-2">
              <text class="text-green-700 text-sm">{{ tip }}</text>
            </view>
          </view>
        </view>

        <!-- 识别结果 - 器械识别 -->
        <view v-if="recognitionResult && recognitionType === 'equipment'" class="space-y-4">
          <view class="bg-white rounded-2xl shadow-lg p-6">
            <text class="text-xl font-bold text-gray-800 block mb-2">{{ recognitionResult.name }}</text>
            <text class="text-gray-600 block mb-4">{{ recognitionResult.description }}</text>
          </view>

          <view v-for="(exercise, index) in recognitionResult.exercises" :key="index" class="bg-white rounded-2xl shadow-lg p-6">
            <text class="text-lg font-bold text-gray-800 block mb-3">{{ exercise.name }}</text>
            
            <view class="flex flex-wrap gap-2 mb-3">
              <view class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                难度：{{ exercise.difficulty }}
              </view>
              <view class="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs">
                {{ exercise.caloriesPerHour }} kcal/小时
              </view>
            </view>

            <view class="mb-3">
              <text class="text-base font-semibold text-gray-800 block mb-2">目标肌群</text>
              <view class="flex flex-wrap gap-2">
                <text v-for="(muscle, idx) in exercise.targetMuscles" :key="idx" 
                      class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                  {{ muscle }}
                </text>
              </view>
            </view>

            <view class="mb-3">
              <text class="text-base font-semibold text-gray-800 block mb-2">动作步骤</text>
              <view v-for="(step, idx) in exercise.steps" :key="idx" class="text-gray-700 text-sm mb-1 pl-2">
                {{ step }}
              </view>
            </view>

            <view>
              <text class="text-base font-semibold text-red-600 block mb-2">⚠️ 安全提示</text>
              <view v-for="(tip, idx) in exercise.safetyTips" :key="idx" class="bg-red-50 px-3 py-2 rounded-lg mb-2">
                <text class="text-red-700 text-sm">• {{ tip }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { recognizeAction, recognizeFood, recognizeEquipment } from '@/utils/aiService.js'

// 获取页面参数
const pageParams = ref({})
if (typeof uni !== 'undefined') {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  pageParams.value = currentPage.$page?.options || currentPage.options || {}
}

const statusBarHeight = ref(0)
const recognitionType = ref('action') // action, food, equipment
const imageUrl = ref('')
const isRecognizing = ref(false)
const recognitionResult = ref(null)

// 页面标题
const pageTitle = computed(() => {
  const titles = {
    action: '动作识别',
    food: '食物热量识别',
    equipment: '器械识别'
  }
  return titles[recognitionType.value] || 'AI识别'
})

// 类型图标
const typeIcon = computed(() => {
  const icons = {
    action: '🤸',
    food: '🍎',
    equipment: '🏋️'
  }
  return icons[recognitionType.value] || '📷'
})

// 类型描述
const typeDescription = computed(() => {
  const descriptions = {
    action: '拍照识别您的健身动作是否标准',
    food: '拍照识别食物并计算热量',
    equipment: '拍照识别器械并获取使用指导'
  }
  return descriptions[recognitionType.value] || ''
})

// 返回
const goBack = () => {
  uni.navigateBack()
}

// 拍照
const takePhoto = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['camera'],
    success: (res) => {
      imageUrl.value = res.tempFilePaths[0]
    },
    fail: (err) => {
      console.error('拍照失败:', err)
      uni.showToast({
        title: '拍照失败',
        icon: 'none',
        duration: 2000
      })
    }
  })
}

// 选择图片
const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['album'],
    success: (res) => {
      imageUrl.value = res.tempFilePaths[0]
    },
    fail: (err) => {
      console.error('选择图片失败:', err)
      uni.showToast({
        title: '选择图片失败',
        icon: 'none',
        duration: 2000
      })
    }
  })
}

// 重新选择
const resetImage = () => {
  imageUrl.value = ''
  recognitionResult.value = null
}

// 开始识别
const startRecognition = async () => {
  if (!imageUrl.value) {
    uni.showToast({
      title: '请先选择图片',
      icon: 'none',
      duration: 2000
    })
    return
  }

  isRecognizing.value = true
  recognitionResult.value = null

  try {
    let result
    switch (recognitionType.value) {
      case 'action':
        result = await recognizeAction(imageUrl.value)
        break
      case 'food':
        result = await recognizeFood(imageUrl.value)
        break
      case 'equipment':
        result = await recognizeEquipment(imageUrl.value)
        break
      default:
        throw new Error('未知的识别类型')
    }

    recognitionResult.value = result
    
    uni.showToast({
      title: '识别成功',
      icon: 'success',
      duration: 2000
    })
  } catch (error) {
    console.error('识别失败:', error)
    uni.showToast({
      title: '识别失败，请重试',
      icon: 'none',
      duration: 2000
    })
  } finally {
    isRecognizing.value = false
  }
}

// 页面加载
onMounted(() => {
  // 从页面参数获取识别类型
  if (pageParams.value.type) {
    recognitionType.value = pageParams.value.type
  }
  
  try {
    const systemInfo = uni.getSystemInfoSync()
    statusBarHeight.value = systemInfo.statusBarHeight || 0
  } catch (error) {
    console.error('获取系统信息失败:', error)
  }
})
</script>

