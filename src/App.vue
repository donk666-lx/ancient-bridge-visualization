<template>
  <div id="app" @mouseenter="showToolbar" @mouseleave="hideToolbar">
    <div class="container">
      <PetCharacter :mood="currentMood" />
      <ChatInterface
        :message="responseMessage"
        :show-input="showChatInput"
        @send="handleSendMessage"
      />
      <Toolbar
        ref="toolbarRef"
        :voice-enabled="voiceEnabled"
        @chat="toggleChat"
        @voice="toggleVoice"
        @screenshot="handleScreenshot"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PetCharacter from './components/PetCharacter.vue'
import ChatInterface from './components/ChatInterface.vue'
import Toolbar from './components/Toolbar.vue'

const currentMood = ref('happy')
const responseMessage = ref('')
const showChatInput = ref(false)
const voiceEnabled = ref(true)
const toolbarRef = ref(null)

function showToolbar() {
  if (toolbarRef.value) {
    toolbarRef.value.showToolbar()
  }
}

function hideToolbar() {
  if (toolbarRef.value) {
    toolbarRef.value.hideToolbar()
  }
}

function toggleChat() {
  showChatInput.value = !showChatInput.value
  if (showChatInput.value) {
    currentMood.value = 'thinking'
  } else {
    currentMood.value = 'happy'
  }
}

function toggleVoice() {
  voiceEnabled.value = !voiceEnabled.value
}

function handleScreenshot() {
  console.log('截图功能')
}

async function handleSendMessage(message) {
  console.log('发送消息:', message)
  currentMood.value = 'thinking'
  responseMessage.value = ''

  // 模拟思考时间
  setTimeout(() => {
    currentMood.value = 'excited'
    responseMessage.value = `你好！我是你的私人小导游 🌉\n\n你刚才说："${message}"\n\n有什么我可以帮你的吗？`
    showChatInput.value = false

    // 3秒后恢复 happy 状态
    setTimeout(() => {
      currentMood.value = 'happy'
    }, 3000)
  }, 1500)
}

onMounted(() => {
  console.log('私人小导游已启动')
  // 欢迎消息
  setTimeout(() => {
    responseMessage.value = '你好！我是你的私人小导游 🌉\n\n鼠标悬停查看工具栏，点击气泡可以和我聊天哦！'
  }, 1000)
})
</script>

<style>
@import './style.css';
</style>