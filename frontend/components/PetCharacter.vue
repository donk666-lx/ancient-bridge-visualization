<template>
  <div
    class="pet-wrapper"
    :class="{ dragging: isDragging }"
    :style="wrapperStyle"
    @mousedown="startDrag"
    @touchstart="startDrag"
  >
    <div class="inner-fluid" :style="fluidStyle">
      <div class="fluid-blob"></div>
      <div class="fluid-blob-2"></div>
    </div>
    <div class="glass-shell"></div>
    <div class="eyes-container">
      <div class="eye eye-left" :style="leftEyeStyle"></div>
      <div class="eye eye-right" :style="rightEyeStyle"></div>
    </div>
    <div class="blush blush-l" :style="blushStyle"></div>
    <div class="blush blush-r" :style="blushStyle"></div>
    <div class="bub bub-1"></div>
    <div class="bub bub-2"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  mood: {
    type: String,
    default: 'happy'
  }
})

const isDragging = ref(false)
const position = ref({ x: 0, y: 0 })
const dragStart = ref({ x: 0, y: 0 })
const mouseOffset = ref({ x: 0, y: 0 })
const floatOffset = ref({ x: 0, y: 0, rotate: 0, scale: 1 })

// 浮动动画参数
let animationFrame = null
let t = 0

const fluidStyle = computed(() => {
  const colors = {
    happy: 'linear-gradient(135deg, #ffb3b3, #fed6e3)',
    thinking: 'linear-gradient(135deg, #b3d9ff, #d6e9ff)',
    sad: 'linear-gradient(135deg, #d9d9d9, #f0f0f0)',
    excited: 'linear-gradient(135deg, #ffcc80, #ffe0b2)'
  }
  return {
    background: colors[props.mood] || colors.happy
  }
})

const blushStyle = computed(() => {
  const colors = {
    happy: 'rgba(255,130,130,0.25)',
    thinking: 'rgba(179,217,255,0.2)',
    sad: 'rgba(200,200,200,0.15)',
    excited: 'rgba(255,204,128,0.3)'
  }
  return {
    background: colors[props.mood] || colors.happy
  }
})

const wrapperStyle = computed(() => {
  const baseX = position.value.x
  const baseY = position.value.y
  const floatX = floatOffset.value.x
  const floatY = floatOffset.value.y
  const rotate = floatOffset.value.rotate
  const scale = floatOffset.value.scale

  return {
    transform: `translate(calc(-50% + ${baseX + floatX}px), calc(-50% + ${baseY + floatY}px)) rotate(${rotate}deg) scale(${scale})`
  }
})

const eyeExpressions = {
  happy: {
    width: '13px',
    height: '7px',
    borderRadius: '7px 7px 3px 3px',
    translateY: '1px'
  },
  thinking: {
    width: '10px',
    height: '17px',
    borderRadius: '5px',
    translateY: '-3px'
  },
  sad: {
    width: '10px',
    height: '16px',
    borderRadius: '5px',
    translateY: '3px'
  },
  excited: {
    width: '15px',
    height: '5px',
    borderRadius: '8px 8px 3px 3px',
    translateY: '1px'
  }
}

const leftEyeStyle = computed(() => {
  const base = eyeExpressions[props.mood] || eyeExpressions.happy
  const mx = mouseOffset.value.x
  const my = mouseOffset.value.y

  return {
    width: base.width,
    height: base.height,
    borderRadius: base.borderRadius,
    transform: `translate(${mx}px, calc(${base.translateY} + ${my}px))`
  }
})

const rightEyeStyle = computed(() => {
  const base = eyeExpressions[props.mood] || eyeExpressions.happy
  const mx = mouseOffset.value.x
  const my = mouseOffset.value.y

  return {
    width: base.width,
    height: base.height,
    borderRadius: base.borderRadius,
    transform: `translate(${mx}px, calc(${base.translateY} + ${my}px))`
  }
})

// 浮动动画循环
function animate() {
  t += 0.016

  // 多频叠加有机浮动
  const floatY = Math.sin(t * 1.3) * 3.5 + Math.sin(t * 0.67) * 2 + Math.sin(t * 2.3) * 0.6
  const floatX = Math.sin(t * 0.8) * 1.5
  const rotate = Math.sin(t * 0.9) * 0.3 + Math.sin(t * 0.37) * 0.2

  // 呼吸效果
  const breathScale = 1 + Math.sin(t * 2) * 0.01 + Math.sin(t * 0.8) * 0.005

  floatOffset.value = {
    x: floatX,
    y: floatY,
    rotate: rotate,
    scale: breathScale
  }

  animationFrame = requestAnimationFrame(animate)
}

// 拖拽功能
function startDrag(e) {
  isDragging.value = true
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY

  dragStart.value = {
    x: clientX - position.value.x,
    y: clientY - position.value.y
  }

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchmove', onDrag)
  document.addEventListener('touchend', stopDrag)
}

function onDrag(e) {
  if (!isDragging.value) return
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY

  position.value = {
    x: clientX - dragStart.value.x,
    y: clientY - dragStart.value.y
  }
}

function stopDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDrag)
}

// 鼠标跟随
function onMouseMove(e) {
  const petElement = document.querySelector('.pet-wrapper')
  if (!petElement) return

  const rect = petElement.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2

  const dx = Math.max(-3, Math.min(3, (e.clientX - cx) / window.innerWidth * 12))
  const dy = Math.max(-2, Math.min(2, (e.clientY - cy) / window.innerHeight * 8))

  mouseOffset.value = { x: dx, y: dy }
}

onMounted(() => {
  animate()
  document.addEventListener('mousemove', onMouseMove)
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  document.removeEventListener('mousemove', onMouseMove)
})
</script>

<style scoped>
.pet-wrapper {
  width: 67px;
  height: 67px;
  position: absolute;
  left: 50%;
  top: 50%;
  cursor: grab;
  will-change: transform;
  z-index: 10;
}

.pet-wrapper:active,
.pet-wrapper.dragging {
  cursor: grabbing;
  z-index: 100;
}

.inner-fluid {
  position: absolute;
  top: 3px;
  left: 3px;
  right: 3px;
  bottom: 3px;
  border-radius: 50%;
  overflow: hidden;
  z-index: 1;
  background: linear-gradient(135deg, #ffb3b3, #fed6e3);
  transition: filter 0.4s ease;
}

.fluid-blob {
  position: absolute;
  width: 130%;
  height: 130%;
  top: -15%;
  left: -15%;
  background: radial-gradient(circle at 30% 30%, rgba(235, 87, 87, 0.85), transparent 40%),
              radial-gradient(circle at 70% 65%, rgba(255, 154, 108, 0.8), transparent 40%);
  animation: fluid-spin 8s linear infinite;
}

.fluid-blob-2 {
  position: absolute;
  width: 110%;
  height: 110%;
  top: -5%;
  left: -5%;
  background: radial-gradient(circle at 60% 30%, rgba(255, 200, 150, 0.4), transparent 35%),
              radial-gradient(circle at 35% 70%, rgba(220, 60, 60, 0.3), transparent 35%);
  animation: fluid-spin-r 12s linear infinite;
}

.glass-shell {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  z-index: 2;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.03));
  box-shadow: inset -2px -2px 8px rgba(255, 255, 255, 0.08),
              inset 2px 2px 8px rgba(255, 255, 255, 0.35),
              0px 2px 6px rgba(220, 80, 80, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.25);
  transition: box-shadow 1.0s cubic-bezier(0.4, 0.0, 0.2, 1), border 1.0s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.glass-shell::before {
  content: '';
  position: absolute;
  top: 12%;
  left: 18%;
  width: 28%;
  height: 14%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.55);
  filter: blur(1px);
  transform: rotate(-40deg);
  transition: opacity 1.0s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.glass-shell::after {
  content: '';
  position: absolute;
  bottom: 22%;
  right: 20%;
  width: 16%;
  height: 10%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  filter: blur(1px);
  transform: rotate(25deg);
  transition: opacity 1.0s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.eyes-container {
  position: absolute;
  z-index: 3;
  top: 16%;
  left: 10%;
  width: 80%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  pointer-events: none;
  overflow: visible;
}

.eye {
  width: 11px;
  height: 19px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.9), 0 0 16px rgba(255, 255, 255, 0.4);
  transition: all 0.18s cubic-bezier(0.25, 1, 0.5, 1);
  transform-origin: center center;
}

.blush {
  position: absolute;
  z-index: 3;
  width: 14px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 130, 130, 0.25);
  filter: blur(3px);
  pointer-events: none;
  transition: background 2.0s cubic-bezier(0.33, 0.0, 0.2, 1), opacity 0.6s ease;
  opacity: 0.8;
}

.blush-l {
  top: 58%;
  left: 8%;
}

.blush-r {
  top: 58%;
  right: 8%;
}

.bub {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.06));
  border: 1px solid rgba(255, 255, 255, 0.12);
  z-index: 0;
  opacity: 0;
  pointer-events: none;
}

.bub-1 {
  width: 5px;
  height: 5px;
  left: -5px;
  top: 60%;
  animation: bub 5s ease-in infinite 0s;
}

.bub-2 {
  width: 3px;
  height: 3px;
  right: -4px;
  top: 40%;
  animation: bub 6.5s ease-in infinite 2s;
}

@keyframes fluid-spin {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.08);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

@keyframes fluid-spin-r {
  0% {
    transform: rotate(360deg) scale(1.05);
  }
  50% {
    transform: rotate(180deg) scale(0.95);
  }
  100% {
    transform: rotate(0deg) scale(1.05);
  }
}

@keyframes bub {
  0% {
    opacity: 0;
    transform: translateY(0) scale(0.3);
  }
  15% {
    opacity: 0.5;
  }
  100% {
    opacity: 0;
    transform: translateY(-30px) translateX(5px) scale(1);
  }
}
</style>