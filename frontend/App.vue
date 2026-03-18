<template>
  <div id="app" @mouseenter="showToolbar" @mouseleave="hideToolbar" @click="enableAudio">
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
import { ref, onMounted, watch } from 'vue'
import PetCharacter from './components/PetCharacter.vue'
import ChatInterface from './components/ChatInterface.vue'
import Toolbar from './components/Toolbar.vue'

const currentMood = ref('happy')
const responseMessage = ref('')
const showChatInput = ref(false)
const voiceEnabled = ref(true)
const toolbarRef = ref(null)
let currentAudio = null
let userInteracted = false

// 监听用户交互
function enableAudio() {
  if (!userInteracted) {
    userInteracted = true
    console.log('✅ 用户已交互，音频已启用')
  }
}

// 监听消息变化
watch(() => responseMessage.value, (newMessage) => {
  if (newMessage && voiceEnabled.value && userInteracted) {
    speakMessage(newMessage)
  }
})

// 🎙️ Edge TTS 语音朗读
async function speakMessage(text) {
  if (!voiceEnabled.value) {
    console.log('🔇 语音功能已禁用')
    return
  }
  
  // 停止之前的朗读
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }
  
  try {
    console.log('🎙️ 调用 Edge TTS:', text.substring(0, 50) + '...')
    
    // 调用后端 Edge TTS API
    const response = await fetch('http://localhost:3002/api/v1/tts/edge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        text: text,
        voice: 'xiaoxiao'  // 微软晓晓 - 活泼女声
      })
    })
    
    console.log('📡 Edge TTS 响应状态:', response.status)
    
    const data = await response.json()
    
    if (data.error) {
      console.error('❌ Edge TTS 错误:', data.error)
      return
    }
    
    if (data.audio) {
      // 播放返回的音频
      const audioBlob = new Blob([Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))], { type: 'audio/mp3' })
      const audioUrl = URL.createObjectURL(audioBlob)
      
      currentAudio = new Audio(audioUrl)
      currentAudio.onended = () => {
        URL.revokeObjectURL(audioUrl)
      }
      
      // 播放并捕获错误
      currentAudio.play().then(() => {
        console.log('▶️ Edge TTS 播放中...')
      }).catch(err => {
        console.error('❌ 音频播放失败:', err.message)
        console.log('💡 提示：点击页面任意位置启用音频播放')
      })
    }
  } catch (error) {
    console.error('❌ Edge TTS 调用失败:', error)
  }
}

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
  console.log(voiceEnabled.value ? '🔊 语音已启用' : '🔇 语音已禁用')
  
  // 停止当前播放
  if (!voiceEnabled.value && currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }
}

function handleScreenshot() {
  console.log('📸 截图功能')
}

async function handleSendMessage(message) {
  console.log('💬 发送消息:', message)
  
  // 用户交互，启用音频
  userInteracted = true
  
  currentMood.value = 'thinking'
  responseMessage.value = ''

  try {
    // 调用后端聊天API
    const chatResponse = await fetch('http://localhost:3002/api/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    })

    const chatData = await chatResponse.json()
    console.log('✅ 收到回复:', chatData.content?.substring(0, 50))

    if (chatData.content) {
      currentMood.value = 'excited'
      responseMessage.value = chatData.content
      showChatInput.value = false

      // 朗读回复
      if (voiceEnabled.value) {
        speakMessage(chatData.content)
      }

      // 3秒后恢复
      setTimeout(() => {
        currentMood.value = 'happy'
      }, 3000)
    }
  } catch (error) {
    console.error('❌ API调用失败:', error)
    currentMood.value = 'sad'
    const errorMsg = '抱歉，我暂时无法回答你的问题，请稍后再试。'
    responseMessage.value = errorMsg
    showChatInput.value = false

    if (voiceEnabled.value) {
      speakMessage(errorMsg)
    }

    setTimeout(() => {
      currentMood.value = 'happy'
    }, 3000)
  }
}

onMounted(() => {
  console.log('🌉 私人小导游已启动')
  console.log('💡 提示：点击页面任意位置启用语音播放')
  
  // 欢迎消息
  setTimeout(() => {
    const welcomeMessage = '你好！我是你的私人小导游 🌉\n\n鼠标悬停查看工具栏，点击气泡可以和我聊天哦！'
    responseMessage.value = welcomeMessage
  }, 1000)
})
</script>

<style>
@import './style.css';
</style>
