<template>
  <view class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
    <!-- 顶部标题栏 -->
    <view class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="flex items-center justify-between px-6 py-4">
        <text class="text-2xl font-bold">训练记录</text>
        <view @click="toggleView" class="cursor-pointer">
          <text class="text-sm">{{ viewMode === 'list' ? '📅 日历' : '📝 列表' }}</text>
        </view>
      </view>
    </view>

    <!-- 统计卡片 -->
    <view class="m-4">
      <view class="bg-white rounded-2xl shadow-lg p-6">
        <text class="text-base font-semibold text-gray-800 mb-4 block">本月统计</text>
        <view class="grid grid-cols-3 gap-4">
          <view class="text-center">
            <text class="text-2xl font-bold text-blue-600 block">{{ monthStats.totalWorkouts }}</text>
            <text class="text-xs text-gray-500 mt-1 block">训练次数</text>
          </view>
          <view class="text-center">
            <text class="text-2xl font-bold text-orange-600 block">{{ monthStats.totalCalories }}</text>
            <text class="text-xs text-gray-500 mt-1 block">消耗(kcal)</text>
          </view>
          <view class="text-center">
            <text class="text-2xl font-bold text-green-600 block">{{ monthStats.totalDuration }}</text>
            <text class="text-xs text-gray-500 mt-1 block">时长(分钟)</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 日历视图 -->
    <view v-if="viewMode === 'calendar'" class="m-4">
      <view class="bg-white rounded-2xl shadow-lg p-4">
        <!-- 月份选择 -->
        <view class="flex items-center justify-between mb-4">
          <view @click="previousMonth" class="cursor-pointer px-3 py-1">
            <text class="text-gray-600">◀</text>
          </view>
          <text class="text-lg font-semibold text-gray-800">{{ currentYearMonth }}</text>
          <view @click="nextMonth" class="cursor-pointer px-3 py-1">
            <text class="text-gray-600">▶</text>
          </view>
        </view>

        <!-- 星期标题 -->
        <view class="grid grid-cols-7 gap-1 mb-2">
          <view v-for="day in weekDays" :key="day" class="text-center py-2">
            <text class="text-xs text-gray-500">{{ day }}</text>
          </view>
        </view>

        <!-- 日期网格 -->
        <view class="grid grid-cols-7 gap-1">
          <view 
            v-for="(date, index) in calendarDates" 
            :key="index"
            @click="selectDate(date)"
            :class="[
              'text-center py-3 rounded-lg cursor-pointer',
              !date.isCurrentMonth ? 'text-gray-300' : '',
              date.isToday ? 'bg-blue-100' : '',
              date.hasRecord ? 'bg-green-100' : '',
              selectedDate === date.fullDate ? 'ring-2 ring-blue-500' : ''
            ]"
          >
            <text :class="[
              'text-sm',
              !date.isCurrentMonth ? 'text-gray-300' : 'text-gray-800',
              date.isToday ? 'font-bold text-blue-600' : ''
            ]">{{ date.day }}</text>
            <text v-if="date.hasRecord" class="text-xs block">•</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 记录列表 -->
    <view class="m-4 space-y-3">
      <view v-if="displayRecords.length === 0" class="text-center py-10">
        <text class="text-6xl block mb-4">📊</text>
        <text class="text-gray-500 text-lg block">暂无训练记录</text>
        <text class="text-gray-400 text-sm mt-2 block">点击首页"添加训练记录"开始</text>
      </view>

      <view 
        v-for="record in displayRecords" 
        :key="record.id"
        class="bg-white rounded-2xl shadow-lg p-5"
      >
        <view class="flex items-start justify-between mb-3">
          <view class="flex-1">
            <text class="text-lg font-bold text-gray-800 block">{{ record.exerciseName }}</text>
            <text class="text-sm text-gray-500 mt-1 block">{{ record.exerciseTypeName }}</text>
          </view>
          <view @click="deleteRecord(record.id)" class="cursor-pointer p-2">
            <text class="text-red-500">🗑️</text>
          </view>
        </view>

        <view class="grid grid-cols-2 gap-3 mb-3">
          <view v-if="record.sets && record.reps" class="bg-blue-50 rounded-lg px-3 py-2">
            <text class="text-xs text-gray-600 block">组数 × 次数</text>
            <text class="text-sm font-semibold text-blue-600 mt-1 block">{{ record.sets }} × {{ record.reps }}</text>
          </view>
          <view v-if="record.weight" class="bg-purple-50 rounded-lg px-3 py-2">
            <text class="text-xs text-gray-600 block">重量</text>
            <text class="text-sm font-semibold text-purple-600 mt-1 block">{{ record.weight }} kg</text>
          </view>
          <view v-if="record.duration" class="bg-green-50 rounded-lg px-3 py-2">
            <text class="text-xs text-gray-600 block">时长</text>
            <text class="text-sm font-semibold text-green-600 mt-1 block">{{ record.duration }} 分钟</text>
          </view>
          <view v-if="record.calories" class="bg-orange-50 rounded-lg px-3 py-2">
            <text class="text-xs text-gray-600 block">消耗</text>
            <text class="text-sm font-semibold text-orange-600 mt-1 block">{{ record.calories }} kcal</text>
          </view>
        </view>

        <view v-if="record.intensity" class="mb-3">
          <view class="flex items-center">
            <text class="text-xs text-gray-600 mr-2">强度：</text>
            <view class="flex-1 bg-gray-200 rounded-full h-2">
              <view 
                :style="{ width: (record.intensity * 10) + '%' }"
                :class="[
                  'h-2 rounded-full',
                  record.intensity >= 7 ? 'bg-red-500' : record.intensity >= 4 ? 'bg-orange-500' : 'bg-green-500'
                ]"
              />
            </view>
            <text class="text-xs text-gray-600 ml-2">{{ record.intensity }}/10</text>
          </view>
        </view>

        <view v-if="record.notes" class="bg-gray-50 rounded-lg px-3 py-2 mb-3">
          <text class="text-xs text-gray-600 block mb-1">备注</text>
          <text class="text-sm text-gray-700">{{ record.notes }}</text>
        </view>

        <view class="flex items-center justify-between pt-2 border-t border-gray-100">
          <text class="text-xs text-gray-400">{{ formatDate(record.date) }}</text>
          <text class="text-xs text-gray-400">{{ formatTime(record.createdAt) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const statusBarHeight = ref(0)
const viewMode = ref('list') // 'list' 或 'calendar'
const records = ref([])
const currentDate = ref(new Date())
const selectedDate = ref('')

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

// 当前年月
const currentYearMonth = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth() + 1
  return `${year}年${month}月`
})

// 本月统计
const monthStats = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  const monthRecords = records.value.filter(r => {
    const recordDate = new Date(r.date)
    return recordDate.getFullYear() === year && recordDate.getMonth() === month
  })

  return {
    totalWorkouts: monthRecords.length,
    totalCalories: monthRecords.reduce((sum, r) => sum + (r.calories || 0), 0),
    totalDuration: monthRecords.reduce((sum, r) => sum + (r.duration || 0), 0)
  }
})

// 日历日期数组
const calendarDates = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  // 当月第一天
  const firstDay = new Date(year, month, 1)
  const firstDayOfWeek = firstDay.getDay()
  
  // 当月最后一天
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  
  // 上月最后几天
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  
  const dates = []
  
  // 填充上月日期
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i
    const date = new Date(year, month - 1, day)
    dates.push({
      day,
      fullDate: formatDateString(date),
      isCurrentMonth: false,
      isToday: false,
      hasRecord: hasRecordOnDate(date)
    })
  }
  
  // 填充当月日期
  const today = new Date()
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const isToday = date.toDateString() === today.toDateString()
    dates.push({
      day,
      fullDate: formatDateString(date),
      isCurrentMonth: true,
      isToday,
      hasRecord: hasRecordOnDate(date)
    })
  }
  
  // 填充下月日期
  const remainingDays = 42 - dates.length // 6行 x 7列
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day)
    dates.push({
      day,
      fullDate: formatDateString(date),
      isCurrentMonth: false,
      isToday: false,
      hasRecord: hasRecordOnDate(date)
    })
  }
  
  return dates
})

// 显示的记录（根据视图模式和选中日期）
const displayRecords = computed(() => {
  if (viewMode.value === 'calendar' && selectedDate.value) {
    return records.value.filter(r => r.date === selectedDate.value)
  }
  return records.value
})

// 格式化日期字符串
const formatDateString = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 检查日期是否有记录
const hasRecordOnDate = (date) => {
  const dateStr = formatDateString(date)
  return records.value.some(r => r.date === dateStr)
}

// 切换视图
const toggleView = () => {
  viewMode.value = viewMode.value === 'list' ? 'calendar' : 'list'
  if (viewMode.value === 'list') {
    selectedDate.value = ''
  }
}

// 上一月
const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

// 下一月
const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

// 选择日期
const selectDate = (date) => {
  selectedDate.value = date.fullDate
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}月${day}日`
}

// 格式化时间
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

// 删除记录
const deleteRecord = (id) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这条训练记录吗？',
    success: (res) => {
      if (res.confirm) {
        try {
          records.value = records.value.filter(r => r.id !== id)
          uni.setStorageSync('trainingRecords', records.value)
          uni.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          })
        } catch (error) {
          console.error('删除记录失败:', error)
          uni.showToast({
            title: '删除失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    }
  })
}

// 加载记录
const loadRecords = () => {
  try {
    const savedRecords = uni.getStorageSync('trainingRecords')
    if (savedRecords && Array.isArray(savedRecords)) {
      records.value = savedRecords
    }
  } catch (error) {
    console.error('加载记录失败:', error)
  }
}

onMounted(() => {
  try {
    const systemInfo = uni.getSystemInfoSync()
    statusBarHeight.value = systemInfo.statusBarHeight || 0
  } catch (error) {
    console.error('获取系统信息失败:', error)
  }
  
  loadRecords()
})

// 页面显示时重新加载记录
onShow(() => {
  loadRecords()
})
</script>

