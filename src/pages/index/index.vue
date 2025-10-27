<template>
  <view class="flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 h-screen">
    <view class="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
      <!-- Logo 或标题 -->
      <view class="text-center mb-8">
        <text class="text-3xl font-bold text-gray-800">FitLens</text>
        <text class="block text-gray-500 mt-2">健身记录管理</text>
      </view>

      <!-- 登录方式切换 -->
      <view class="flex mb-6 bg-gray-100 rounded-lg p-1">
        <view
          @click="switchLoginType('phone')"
          :class="loginType === 'phone' ? 'bg-white shadow-sm' : ''"
          class="flex-1 text-center py-2 rounded-md cursor-pointer transition-all"
        >
          <text :class="loginType === 'phone' ? 'font-semibold text-blue-600' : 'text-gray-600'">手机号</text>
        </view>
        <view
          @click="switchLoginType('email')"
          :class="loginType === 'email' ? 'bg-white shadow-sm' : ''"
          class="flex-1 text-center py-2 rounded-md cursor-pointer transition-all"
        >
          <text :class="loginType === 'email' ? 'font-semibold text-blue-600' : 'text-gray-600'">邮箱</text>
        </view>
      </view>

      <!-- 手机号输入 -->
      <view v-if="loginType === 'phone'" class="mb-4">
        <text class="text-sm text-gray-600 mb-2 block">手机号</text>
        <input
          v-model="phoneNumber"
          type="number"
          placeholder="请输入手机号"
          class="border border-gray-300 rounded-lg px-4 py-3"
        />
      </view>

      <!-- 邮箱输入 -->
      <view v-if="loginType === 'email'" class="mb-4">
        <text class="text-sm text-gray-600 mb-2 block">邮箱</text>
        <input
          v-model="email"
          type="email"
          placeholder="请输入邮箱地址"
          class="border border-gray-300 rounded-lg px-4 py-3"
        />
      </view>

      <!-- 验证码输入 -->
      <view class="mb-4">
        <text class="text-sm text-gray-600 mb-3 block ">验证码</text>
        <view class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <input
            v-model="verificationCode"
            type="number"
            placeholder="请输入验证码"
            class="flex-1 px-3 py-3 min-w-0"
          />
          <view
            @click="sendVerificationCode"
            :class="canSendCode && countdown === 0 
              ? 'cursor-pointer bg-blue-500 text-white' 
              : 'opacity-50 bg-gray-300 text-gray-600'"
            class="text-xs px-3 py-3 whitespace-nowrap flex-shrink-0"
          >
            {{ countdown > 0 ? `${countdown}秒` : '发送验证码' }}
          </view>
        </view>
      </view>

      <!-- 提示信息 -->
      <view v-if="message" class="mb-4 px-4 py-2 rounded-lg text-sm"
        :class="messageType === 'success' 
          ? 'bg-green-100 text-green-700' 
          : 'bg-red-100 text-red-700'"
      >
        {{ message }}
      </view>

      <!-- 登录/注册按钮 -->
      <view
        @click="handleLogin"
        :class="isLoading ? 'opacity-50' : 'opacity-100'"
        class="h-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-medium text-center cursor-pointer"
      >
    
        {{ isLoading ? '处理中...' : '登录' }}
      </view>

      <!-- 底部提示 -->
      <view class="mt-6 text-center text-sm text-gray-500">
        <text>{{ loginType === 'phone' ? '未注册的手机号将自动注册并登录' : '未注册的邮箱将自动注册并登录' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { app, isLogin } from '@/utils/cloudBase.js'
const auth = app.auth()
const loginType = ref('email') // 'phone' 或 'email'
const phoneNumber = ref('')
const email = ref('')
const verificationCode = ref('')
const countdown = ref(0)
const message = ref('')
const messageType = ref('')
const isLoading = ref(false)
let verificationInfo = null // 存储验证码信息

// 检查是否已登录
onMounted(() => {
  checkLoginStatus()
})

// 检查登录状态
const checkLoginStatus = () => {
  try {
    // 检查 cloudbase 是否已登录
    if (isLogin()) {
      console.log('用户已登录，直接跳转到主页')
      uni.reLaunch({
        url: '/pages/home/index'
      })
    }
  } catch (error) {
    console.error('检查登录状态失败:', error)
  }
}

// 切换登录方式
const switchLoginType = (type) => {
  loginType.value = type
  // 清空表单
  phoneNumber.value = ''
  email.value = ''
  verificationCode.value = ''
  verificationInfo = null
  countdown.value = 0
  message.value = ''
}

// 邮箱格式验证
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 计算是否可以发送验证码
const canSendCode = computed(() => {
  if (loginType.value === 'phone') {
    return phoneNumber.value.length === 11
  } else {
    return isValidEmail(email.value)
  }
})

// 发送验证码
const sendVerificationCode = async () => {
  if (!canSendCode.value) {
    if (loginType.value === 'phone') {
      showMessage('请输入正确的手机号', 'error')
    } else {
      showMessage('请输入正确的邮箱地址', 'error')
    }
    return
  }

  try {
    isLoading.value = true
    showMessage('正在发送验证码...', 'success')
    
    // 根据登录类型发送验证码
    if (loginType.value === 'phone') {
      verificationInfo = await auth.getVerification({
        phone_number: `+86 ${phoneNumber.value}`
      })
    } else {
      verificationInfo = await auth.getVerification({
        email: email.value
      })
    }

    showMessage('验证码已发送，请查收', 'success')
    
    // 开始倒计时
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)

  } catch (error) {
    console.error('发送验证码失败:', error)
    showMessage(error.message || '发送验证码失败，请稍后重试', 'error')
  } finally {
    isLoading.value = false
  }
}

// 处理登录/注册
const handleLogin = async () => {
  // 验证输入
  if (loginType.value === 'phone' && !phoneNumber.value) {
    showMessage('请输入手机号', 'error')
    return
  }
  
  if (loginType.value === 'email' && !email.value) {
    showMessage('请输入邮箱', 'error')
    return
  }

  if (!verificationCode.value) {
    showMessage('请输入验证码', 'error')
    return
  }

  if (!verificationInfo) {
    showMessage('请先发送验证码', 'error')
    return
  }

  try {
    isLoading.value = true
    showMessage('正在验证...', 'success')

    // 先验证验证码
    const verificationTokenRes = await auth.verify({
      verification_id: verificationInfo.verification_id,
      verification_code: verificationCode.value
    })

    // 判断用户是否存在
    if (verificationInfo.is_user) {
      // 用户已存在，直接登录
      let username = ''
      if (loginType.value === 'phone') {
        username = `+86 ${phoneNumber.value}`
      } else {
        username = email.value
      }
      
      await auth.signIn({
        username: username,
        verification_token: verificationTokenRes.verification_token
      })
      showMessage('登录成功！', 'success')
      
      // 显示成功提示
      uni.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1500
      })
      
    } else {
      // 新用户，注册并登录
      let signUpParams = {}
      
      if (loginType.value === 'phone') {
        signUpParams = {
          phone_number: `+86 ${phoneNumber.value}`,
          verification_code: verificationCode.value,
          verification_token: verificationTokenRes.verification_token
        }
      } else {
        signUpParams = {
          email: email.value,
          verification_code: verificationCode.value,
          verification_token: verificationTokenRes.verification_token
        }
      }
      
      await auth.signUp(signUpParams)
      showMessage('注册成功，已自动登录！', 'success')
      
      uni.showToast({
        title: '注册成功',
        icon: 'success',
        duration: 1500
      })
    }

    // 获取用户信息（可选）
    try {
      const user = auth.currentUser
      if (user) {
        console.log('用户信息:', user)
        // 可以在这里保存用户信息到本地存储
        const userInfo = {
          uid: user.uid,
          loginTime: Date.now(),
          username: loginType.value === 'phone' ? phoneNumber.value : email.value
        }
        
        if (loginType.value === 'phone') {
          userInfo.phone = phoneNumber.value
        } else {
          userInfo.email = email.value
        }
        
        uni.setStorageSync('userInfo', userInfo)
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }

    // 登录成功后跳转到主页
    setTimeout(() => {
      uni.reLaunch({
        url: '/pages/home/index'
      })
    }, 1500)

  } catch (error) {
    console.error('登录失败:', error)
    
    let errorMsg = '登录失败，请稍后重试'
    
    // 处理常见错误
    if (error.message?.includes('验证码')) {
      errorMsg = '验证码不正确或已过期'
    } else if (error.message?.includes('用户不存在')) {
      errorMsg = '用户不存在，请先注册'
    }
    
    showMessage(errorMsg, 'error')
  } finally {
    isLoading.value = false
  }
}

// 显示消息
const showMessage = (msg, type) => {
  message.value = msg
  messageType.value = type
  
  // 3秒后清除消息
  setTimeout(() => {
    message.value = ''
  }, 3000)
}
</script>

