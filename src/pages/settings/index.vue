<template>
  <view class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 顶部导航栏 -->
    <view class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="flex items-center px-6 py-4">
        <view @click="goBack" class="mr-4 cursor-pointer">
          <text class="text-2xl">←</text>
        </view>
        <text class="text-xl font-bold">个人设置</text>
      </view>
    </view>

    <!-- 用户头像 -->
    <view class="m-4">
      <view class="bg-white rounded-2xl shadow-lg p-6 text-center">
        <view class="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
          <text class="text-3xl text-white font-bold">{{ userInitial }}</text>
        </view>
        <text class="text-lg font-semibold text-gray-800">{{ profileData.username || '用户' }}</text>
      </view>
    </view>

    <!-- 基本信息 -->
    <view class="m-4">
      <view class="bg-white rounded-2xl shadow-lg p-6">
        <text class="text-lg font-semibold text-gray-800 block mb-4">基本信息</text>
        
        <!-- 昵称 -->
        <view class="mb-4">
          <text class="text-sm text-gray-600 mb-2 block">昵称</text>
          <input
            v-model="profileData.username"
            type="text"
            placeholder="请输入昵称"
            class="border border-gray-300 rounded-lg px-4 py-3 w-full"
          />
        </view>

        <!-- 性别 -->
        <view class="mb-4">
          <text class="text-sm text-gray-600 mb-2 block">性别</text>
          <picker :range="genderOptions" range-key="label" @change="onGenderChange">
            <view class="border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between">
              <text :class="profileData.gender ? 'text-gray-800' : 'text-gray-400'">
                {{ selectedGenderLabel || '请选择性别' }}
              </text>
              <text class="text-gray-400">▼</text>
            </view>
          </picker>
        </view>

        <!-- 生日 -->
        <view class="mb-4">
          <text class="text-sm text-gray-600 mb-2 block">生日</text>
          <picker mode="date" :value="profileData.birthday" @change="onBirthdayChange" :end="today">
            <view class="border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between">
              <text :class="profileData.birthday ? 'text-gray-800' : 'text-gray-400'">
                {{ profileData.birthday || '请选择生日' }}
              </text>
              <text class="text-gray-400">📅</text>
            </view>
          </picker>
        </view>

        <!-- 年龄显示 -->
        <view v-if="age" class="mb-4">
          <text class="text-sm text-gray-600">年龄：</text>
          <text class="text-base font-semibold text-blue-600">{{ age }} 岁</text>
        </view>
      </view>
    </view>

    <!-- 身体数据 -->
    <view class="m-4">
      <view class="bg-white rounded-2xl shadow-lg p-6">
        <text class="text-lg font-semibold text-gray-800 block mb-4">身体数据</text>
        
        <!-- 身高 -->
        <view class="mb-4">
          <text class="text-sm text-gray-600 mb-2 block">身高</text>
          <view class="flex items-center">
            <input
              v-model.number="profileData.height"
              type="digit"
              placeholder="0"
              class="flex-1 border border-gray-300 rounded-lg px-4 py-3"
            />
            <text class="ml-3 text-gray-600">cm</text>
          </view>
        </view>

        <!-- 体重 -->
        <view class="mb-4">
          <text class="text-sm text-gray-600 mb-2 block">体重</text>
          <view class="flex items-center">
            <input
              v-model.number="profileData.weight"
              type="digit"
              placeholder="0"
              class="flex-1 border border-gray-300 rounded-lg px-4 py-3"
            />
            <text class="ml-3 text-gray-600">kg</text>
          </view>
        </view>

        <!-- BMI显示 -->
        <view v-if="bmi" class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <view class="flex items-center justify-between mb-2">
            <text class="text-sm text-gray-600">BMI指数</text>
            <text class="text-2xl font-bold" :class="bmiColorClass">{{ bmi }}</text>
          </view>
          <view class="w-full bg-gray-200 rounded-full h-2 mb-2">
            <view 
              :style="{ width: bmiPercentage + '%' }"
              :class="bmiColorClass.replace('text-', 'bg-')"
              class="h-2 rounded-full transition-all"
            />
          </view>
          <text class="text-xs" :class="bmiColorClass">{{ bmiStatus }}</text>
        </view>
      </view>
    </view>

    <!-- 健身目标 -->
    <view class="m-4">
      <view class="bg-white rounded-2xl shadow-lg p-6">
        <text class="text-lg font-semibold text-gray-800 block mb-4">健身目标</text>
        
        <picker :range="fitnessGoals" range-key="label" @change="onGoalChange">
          <view class="border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between">
            <text :class="profileData.fitnessGoal ? 'text-gray-800' : 'text-gray-400'">
              {{ selectedGoalLabel || '请选择健身目标' }}
            </text>
            <text class="text-gray-400">▼</text>
          </view>
        </picker>
      </view>
    </view>

    <!-- 目标体重 -->
    <view class="m-4">
      <view class="bg-white rounded-2xl shadow-lg p-6">
        <text class="text-lg font-semibold text-gray-800 block mb-4">目标体重</text>
        
        <view class="flex items-center">
          <input
            v-model.number="profileData.targetWeight"
            type="digit"
            placeholder="0"
            class="flex-1 border border-gray-300 rounded-lg px-4 py-3"
          />
          <text class="ml-3 text-gray-600">kg</text>
        </view>

        <view v-if="weightDifference" class="mt-3 text-center">
          <text class="text-sm text-gray-600">距离目标：</text>
          <text :class="weightDifference > 0 ? 'text-orange-600' : 'text-green-600'" class="font-semibold">
            {{ Math.abs(weightDifference).toFixed(1) }} kg
          </text>
          <text class="text-sm text-gray-600">
            {{ weightDifference > 0 ? ' (还需减重)' : ' (已达成)' }}
          </text>
        </view>
      </view>
    </view>

    <!-- 保存按钮 -->
    <view class="m-4 pb-4">
      <view 
        @click="saveProfile"
        class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl text-center cursor-pointer shadow-lg"
      >
        <text class="font-semibold text-lg">💾 保存设置</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const statusBarHeight = ref(0)

// 今天的日期
const today = new Date().toISOString().split('T')[0]

// 性别选项
const genderOptions = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' }
]

// 健身目标选项
const fitnessGoals = [
  { value: 'lose_weight', label: '减脂瘦身' },
  { value: 'gain_muscle', label: '增肌增重' },
  { value: 'body_shaping', label: '塑形' },
  { value: 'improve_fitness', label: '提高体能' },
  { value: 'keep_healthy', label: '保持健康' }
]

// 个人资料数据
const profileData = ref({
  username: '',
  gender: '',
  birthday: '',
  height: null,
  weight: null,
  fitnessGoal: '',
  targetWeight: null
})

// 用户首字母
const userInitial = computed(() => {
  if (profileData.value.username) {
    return profileData.value.username.charAt(0).toUpperCase()
  }
  return '👤'
})

// 选中的性别标签
const selectedGenderLabel = computed(() => {
  const option = genderOptions.find(o => o.value === profileData.value.gender)
  return option ? option.label : ''
})

// 选中的目标标签
const selectedGoalLabel = computed(() => {
  const option = fitnessGoals.find(o => o.value === profileData.value.fitnessGoal)
  return option ? option.label : ''
})

// 计算年龄
const age = computed(() => {
  if (!profileData.value.birthday) return null
  
  const birthday = new Date(profileData.value.birthday)
  const today = new Date()
  let age = today.getFullYear() - birthday.getFullYear()
  const monthDiff = today.getMonth() - birthday.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
    age--
  }
  
  return age
})

// 计算BMI
const bmi = computed(() => {
  if (!profileData.value.height || !profileData.value.weight) return null
  
  const heightInMeters = profileData.value.height / 100
  const bmiValue = profileData.value.weight / (heightInMeters * heightInMeters)
  
  return bmiValue.toFixed(1)
})

// BMI状态
const bmiStatus = computed(() => {
  if (!bmi.value) return ''
  
  const bmiNum = parseFloat(bmi.value)
  if (bmiNum < 18.5) return '偏瘦'
  if (bmiNum < 24) return '正常'
  if (bmiNum < 28) return '偏胖'
  return '肥胖'
})

// BMI颜色类
const bmiColorClass = computed(() => {
  if (!bmi.value) return 'text-gray-600'
  
  const bmiNum = parseFloat(bmi.value)
  if (bmiNum < 18.5) return 'text-blue-600'
  if (bmiNum < 24) return 'text-green-600'
  if (bmiNum < 28) return 'text-orange-600'
  return 'text-red-600'
})

// BMI百分比（用于进度条）
const bmiPercentage = computed(() => {
  if (!bmi.value) return 0
  
  const bmiNum = parseFloat(bmi.value)
  // 将BMI值映射到0-100的范围（15-35 -> 0-100）
  return Math.min(Math.max((bmiNum - 15) / 20 * 100, 0), 100)
})

// 体重差距
const weightDifference = computed(() => {
  if (!profileData.value.weight || !profileData.value.targetWeight) return null
  return profileData.value.weight - profileData.value.targetWeight
})

// 返回
const goBack = () => {
  uni.navigateBack()
}

// 性别变化
const onGenderChange = (e) => {
  const index = e.detail.value
  profileData.value.gender = genderOptions[index].value
}

// 生日变化
const onBirthdayChange = (e) => {
  profileData.value.birthday = e.detail.value
}

// 目标变化
const onGoalChange = (e) => {
  const index = e.detail.value
  profileData.value.fitnessGoal = fitnessGoals[index].value
}

// 加载个人资料
const loadProfile = () => {
  try {
    // 从本地存储加载
    const savedProfile = uni.getStorageSync('userProfile')
    if (savedProfile) {
      profileData.value = { ...profileData.value, ...savedProfile }
    }
    
    // 也尝试从userInfo加载用户名
    const userInfo = uni.getStorageSync('userInfo')
    if (userInfo && userInfo.username && !profileData.value.username) {
      profileData.value.username = userInfo.username
    }
  } catch (error) {
    console.error('加载个人资料失败:', error)
  }
}

// 保存个人资料
const saveProfile = () => {
  // 验证必填项
  if (!profileData.value.username) {
    uni.showToast({
      title: '请输入昵称',
      icon: 'none',
      duration: 2000
    })
    return
  }

  try {
    // 保存到本地存储
    uni.setStorageSync('userProfile', profileData.value)
    
    // 同时更新userInfo中的用户名
    const userInfo = uni.getStorageSync('userInfo') || {}
    userInfo.username = profileData.value.username
    uni.setStorageSync('userInfo', userInfo)

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
    console.error('保存个人资料失败:', error)
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
  
  loadProfile()
})
</script>

