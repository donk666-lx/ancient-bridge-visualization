<template>
  <div class="toolbar" :class="{ show: isVisible }">
    <div class="tool-icon" @click="$emit('chat')" title="发消息">
      <svg viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </div>
    <div class="tool-icon" :class="{ active: voiceEnabled }" @click="$emit('voice')" :title="voiceEnabled ? '点击禁音' : '点击开启声音'">
      <svg v-if="voiceEnabled" viewBox="0 0 24 24">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
      <svg v-else viewBox="0 0 24 24">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    </div>
    <div class="tool-icon" @click="$emit('screenshot')" title="截图">
      <svg viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  voiceEnabled: {
    type: Boolean,
    default: true
  }
})

defineEmits(['chat', 'voice', 'screenshot'])

const isVisible = ref(false)

function showToolbar() {
  isVisible.value = true
}

function hideToolbar() {
  isVisible.value = false
}

defineExpose({
  showToolbar,
  hideToolbar
})
</script>

<style scoped>
.toolbar {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease, transform 0.1s linear;
  z-index: 20;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.toolbar.show {
  opacity: 1;
  pointer-events: auto;
}

.tool-icon {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.tool-icon svg {
  width: 13px;
  height: 13px;
  stroke: #666;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.tool-icon:hover {
  transform: scale(1.2);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);
}

.tool-icon:active {
  transform: scale(0.9);
}

.tool-icon.active {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.5), 0 2px 8px rgba(0, 0, 0, 0.15);
}

.tool-icon:not(.active) {
  opacity: 0.6;
}

.tool-icon:not(.active) svg {
  stroke: #999;
}
</style>