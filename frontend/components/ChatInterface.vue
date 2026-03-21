<template>
  <div class="chat-container">
    <div
      v-if="displayMessage"
      class="message-bubble"
      :class="{ show: isVisible }"
      @click="handleBubbleClick"
    >
      <div class="message-content">{{ displayMessage }}</div>
    </div>
    <div class="input-bar" :class="{ show: showInput }">
      <input
        ref="inputRef"
        v-model="inputMessage"
        type="text"
        placeholder="说点什么..."
        @keypress="handleKeyPress"
      />
      <button @click="sendMessage">↑</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onUnmounted } from 'vue'

const props = defineProps({
  message: {
    type: String,
    default: ''
  },
  showInput: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 0 // 0 表示自动根据文字长度计算
  }
})

const emit = defineEmits(['send'])

const inputMessage = ref('')
const isVisible = ref(false)
const displayMessage = ref('')
const inputRef = ref(null)
const hideTimer = ref(null)

// 计算显示时长（毫秒）
function calculateDisplayDuration(text) {
  // 如果指定了duration，使用指定值
  if (props.duration > 0) {
    return props.duration
  }
  
  // 否则根据文字长度计算
  // 假设平均阅读速度：每秒4-5个中文字符
  // 加上2秒的基础时间，确保用户有足够时间阅读
  const charCount = text.length
  const readingTime = (charCount / 4) * 1000 // 转换为毫秒
  const baseTime = 2000 // 基础显示时间2秒
  const minTime = 3000 // 最少显示3秒
  
  return Math.max(minTime, readingTime + baseTime)
}

// 监听消息变化
watch(() => props.message, (newVal) => {
  if (newVal) {
    displayMessage.value = newVal
    isVisible.value = true

    // 清除之前的定时器（如果存在）
    if (hideTimer.value) {
      clearTimeout(hideTimer.value)
      hideTimer.value = null
    }

    // 根据文字长度计算显示时长
    const displayTime = calculateDisplayDuration(newVal)
    console.log('消息显示时长:', displayTime, 'ms, 文字长度:', newVal.length)
    
    hideTimer.value = setTimeout(() => {
      isVisible.value = false
      hideTimer.value = null
    }, displayTime)
  }
})

// 监听输入框显示状态
watch(() => props.showInput, (newVal) => {
  if (newVal) {
    // 隐藏消息气泡
    isVisible.value = false
    // 聚焦输入框
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.focus()
      }
    })
  }
})

function handleKeyPress(e) {
  if (e.key === 'Enter') {
    sendMessage()
  }
}

function sendMessage() {
  if (inputMessage.value.trim()) {
    emit('send', inputMessage.value)
    inputMessage.value = ''
  }
}

function handleBubbleClick() {
  // 点击气泡也可以打开聊天
  if (!props.showInput) {
    emit('send', '')
  }
}

// 组件卸载时清理定时器
onUnmounted(() => {
  if (hideTimer.value) {
    clearTimeout(hideTimer.value)
    hideTimer.value = null
  }
})
</script>

<style scoped>
.chat-container {
  position: relative;
  pointer-events: none;
}

.message-bubble {
  position: absolute;
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 220px;
  min-width: 150px;
  opacity: 0;
  pointer-events: auto;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 20;
  cursor: pointer;
}

.message-bubble.show {
  opacity: 1;
  transform: translateX(-50%) translateY(-10px);
}

.message-content {
  background: rgba(255, 255, 255, 0.95);
  padding: 12px 16px;
  border-radius: 16px 16px 16px 4px;
  font-size: 13px;
  line-height: 1.5;
  color: #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  word-wrap: break-word;
  white-space: pre-wrap;
}

.input-bar {
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  opacity: 0;
  pointer-events: none;
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 20;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 12px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.input-bar.show {
  opacity: 1;
  pointer-events: auto;
}

.input-bar input {
  width: 180px;
  padding: 8px 12px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  outline: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  font-family: inherit;
}

.input-bar input::placeholder {
  color: #999;
}

.input-bar button {
  padding: 8px 14px;
  border: none;
  border-radius: 12px;
  background: #10A37F;
  color: white;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  transition: all 0.2s ease;
}

.input-bar button:hover {
  background: #0E8C6F;
  transform: scale(1.05);
}

.input-bar button:active {
  transform: scale(0.95);
}
</style>