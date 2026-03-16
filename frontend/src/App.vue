<template>
  <div class="app-container">
    <!-- 顶部导航 -->
    <header class="header">
      <h1>中国古代经典桥梁可视化平台</h1>
    </header>

    <!-- 核心桥梁滑动展示区 -->
    <section class="bridge-slider">
      <div class="slider-wrapper" ref="sliderRef" @mousedown="startDrag" @mousemove="onDrag" @mouseup="endDrag"
        @mouseleave="endDrag" @touchstart="startDrag" @touchmove="onDrag" @touchend="endDrag">
        <!-- 3座桥梁层叠卡片，实现渐变层叠效果 -->
        <div class="bridge-card" :style="getCardStyle(0)">
          <img src="https://picsum.photos/id/1018/800/500" alt="赵州桥" class="bridge-img" />
          <div class="bridge-mask">
            <h2 class="bridge-name">赵州桥</h2>
            <p class="bridge-brief">隋代 · 李春 · 世界现存最古老的石拱桥</p>
          </div>
        </div>

        <div class="bridge-card" :style="getCardStyle(1)">
          <img src="https://picsum.photos/id/1019/800/500" alt="洛阳桥" class="bridge-img" />
          <div class="bridge-mask">
            <h2 class="bridge-name">洛阳桥</h2>
            <p class="bridge-brief">宋代 · 蔡襄 · 中国四大古桥之一</p>
          </div>
        </div>

        <div class="bridge-card" :style="getCardStyle(2)">
          <img src="https://picsum.photos/id/1020/800/500" alt="广济桥" class="bridge-img" />
          <div class="bridge-mask">
            <h2 class="bridge-name">广济桥</h2>
            <p class="bridge-brief">宋代 · 曾宗旦 · 世界最早的启闭式桥梁</p>
          </div>
        </div>
      </div>

      <!-- 滑动控制按钮 -->
      <button class="slider-btn prev-btn" @click="slidePrev">←</button>
      <button class="slider-btn next-btn" @click="slideNext">→</button>
    </section>

    <!-- 桥梁详情展示区 -->
    <section class="bridge-detail">
      <div class="detail-left">
        <h3>{{ currentBridge.name }}</h3>
        <p><strong>建造年代：</strong>{{ currentBridge.era }}</p>
        <p><strong>结构类型：</strong>{{ currentBridge.structure }}</p>
      </div>
      <div class="detail-right">
        <h3>建造者：{{ currentBridge.builder.name }}</h3>
        <p>{{ currentBridge.builder.intro }}</p>
      </div>
    </section>

    <!-- 可拖动的智能体图标 -->
    <div class="agent-icon" ref="agentRef" @mousedown="startAgentDrag" @touchstart="startAgentDrag">
      <!-- 替换为你的智能体图标地址 -->
      <img src="https://picsum.photos/id/1005/60/60" alt="智能体" class="agent-img" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// 桥梁数据（后续可从后端接口获取）
const bridges = reactive([
  {
    name: '赵州桥',
    era: '隋代（公元595-605年）',
    structure: '空腹式石拱桥',
    builder: {
      name: '李春',
      intro: '隋代著名工匠，赵州桥的总设计师，其设计的空腹式拱桥结构，比欧洲早了1200多年，是中国古代桥梁工程的典范。'
    }
  },
  {
    name: '洛阳桥',
    era: '宋代（公元1053-1059年）',
    structure: '筏型基础梁式桥',
    builder: {
      name: '蔡襄',
      intro: '北宋名臣、书法家，时任泉州太守，主持修建洛阳桥，首创“筏型基础”和“种蛎固基”法，解决了软土地基建桥的难题。'
    }
  },
  {
    name: '广济桥',
    era: '宋代（公元1171年）',
    structure: '梁桥与浮桥结合的启闭式桥梁',
    builder: {
      name: '曾宗旦',
      intro: '南宋潮州知州，主持修建广济桥，该桥集梁桥、浮桥、拱桥于一体，是中国桥梁史上的孤例，至今仍发挥着交通作用。'
    }
  }
])

// 当前选中的桥梁
const currentBridge = ref(bridges[0])

// 滑动相关变量
const sliderRef = ref(null)
const startX = ref(0)
const endX = ref(0)
const currentIndex = ref(0)
const cardWidth = ref(800) // 卡片宽度
const cardGap = ref(50)    // 卡片间距

// 智能体拖动相关变量
const agentRef = ref(null)
const agentPos = reactive({
  x: window.innerWidth - 80,
  y: window.innerHeight - 100
})
const dragState = reactive({
  isDragging: false,
  startX: 0,
  startY: 0
})

// 获取桥梁卡片样式（层叠+渐变）
const getCardStyle = (index) => {
  const offset = (index - currentIndex.value) * (cardWidth.value + cardGap.value)
  const scale = 1 - Math.abs(index - currentIndex.value) * 0.15 // 层叠缩放
  const opacity = 1 - Math.abs(index - currentIndex.value) * 0.4 // 渐变透明度
  const zIndex = 10 - Math.abs(index - currentIndex.value) // 层叠层级

  return {
    transform: `translateX(${offset}px) scale(${scale})`,
    opacity,
    zIndex,
    transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out'
  }
}

// 滑动控制：上一张
const slidePrev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    currentBridge.value = bridges[currentIndex.value]
  }
}

// 滑动控制：下一张
const slideNext = () => {
  if (currentIndex.value < bridges.length - 1) {
    currentIndex.value++
    currentBridge.value = bridges[currentIndex.value]
  }
}

// 鼠标拖动滑动（PC端）
const startDrag = (e) => {
  startX.value = e.clientX || e.touches[0].clientX
}

const onDrag = (e) => {
  if (!startX.value) return
  endX.value = e.clientX || e.touches[0].clientX
}

const endDrag = () => {
  const diffX = startX.value - endX.value
  if (diffX > 50) {
    slideNext() // 向左滑，下一张
  } else if (diffX < -50) {
    slidePrev() // 向右滑，上一张
  }
  startX.value = 0
  endX.value = 0
}

// 智能体拖动
const startAgentDrag = (e) => {
  dragState.isDragging = true
  dragState.startX = e.clientX || e.touches[0].clientX
  dragState.startY = e.clientY || e.touches[0].clientY

  // 监听鼠标/触摸移动和松开
  document.addEventListener('mousemove', handleAgentDrag)
  document.addEventListener('mouseup', stopAgentDrag)
  document.addEventListener('touchmove', handleAgentDrag)
  document.addEventListener('touchend', stopAgentDrag)
}

const handleAgentDrag = (e) => {
  if (!dragState.isDragging) return
  const dx = (e.clientX || e.touches[0].clientX) - dragState.startX
  const dy = (e.clientY || e.touches[0].clientY) - dragState.startY

  // 更新智能体位置
  agentPos.x += dx
  agentPos.y += dy

  // 限制在可视区域内
  agentPos.x = Math.max(0, Math.min(agentPos.x, window.innerWidth - 60))
  agentPos.y = Math.max(0, Math.min(agentPos.y, window.innerHeight - 60))

  // 更新起始位置
  dragState.startX = e.clientX || e.touches[0].clientX
  dragState.startY = e.clientY || e.touches[0].clientY

  // 应用位置样式
  agentRef.value.style.left = `${agentPos.x}px`
  agentRef.value.style.top = `${agentPos.y}px`
}

const stopAgentDrag = () => {
  dragState.isDragging = false
  document.removeEventListener('mousemove', handleAgentDrag)
  document.removeEventListener('mouseup', stopAgentDrag)
  document.removeEventListener('touchmove', handleAgentDrag)
  document.removeEventListener('touchend', stopAgentDrag)
}

// 初始化
onMounted(() => {
  // 设置智能体初始位置
  agentRef.value.style.left = `${agentPos.x}px`
  agentRef.value.style.top = `${agentPos.y}px`

  // 适配窗口大小
  window.addEventListener('resize', () => {
    agentPos.x = Math.min(agentPos.x, window.innerWidth - 60)
    agentPos.y = Math.min(agentPos.y, window.innerHeight - 60)
    agentRef.value.style.left = `${agentPos.x}px`
    agentRef.value.style.top = `${agentPos.y}px`
  })
})
</script>

<style scoped>
/* 全局容器 */
.app-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom, #e8f4f8, #f0f8fb);
  padding: 20px;
  box-sizing: border-box;
  overflow-x: hidden;
}

/* 顶部导航 */
.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  font-family: '思源宋体', serif;
  letter-spacing: 2px;
}

/* 桥梁滑动展示区 */
.bridge-slider {
  position: relative;
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 60px;
  overflow: hidden;
}

.slider-wrapper {
  position: relative;
  width: 800px;
  height: 100%;
}

.bridge-card {
  position: absolute;
  top: 0;
  left: 0;
  width: 800px;
  height: 450px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.bridge-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.bridge-card:hover .bridge-img {
  transform: scale(1.05);
}

.bridge-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0));
  color: white;
}

.bridge-name {
  font-size: 2rem;
  margin: 0 0 10px 0;
  font-family: '思源宋体', serif;
}

.bridge-brief {
  font-size: 1rem;
  margin: 0;
  opacity: 0.9;
}

/* 滑动按钮 */
.slider-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  color: #2c3e50;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 20;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.slider-btn:hover {
  background: white;
  transform: translateY(-50%) scale(1.1);
}

.prev-btn {
  left: 50px;
}

.next-btn {
  right: 50px;
}

/* 桥梁详情区 */
.bridge-detail {
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin: 0 auto 80px;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.detail-left {
  width: 40%;
  border-right: 1px solid #eee;
  padding-right: 30px;
}

.detail-right {
  width: 55%;
  padding-left: 30px;
}

.bridge-detail h3 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-top: 0;
  font-family: '思源宋体', serif;
}

.bridge-detail p {
  font-size: 1rem;
  line-height: 1.8;
  color: #555;
}

/* 智能体图标 */
.agent-icon {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: move;
  z-index: 999;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease;
}

.agent-icon:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.agent-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

/* 响应式适配 */
@media (max-width: 900px) {
  .bridge-slider {
    height: 400px;
  }

  .slider-wrapper {
    width: 600px;
  }

  .bridge-card {
    width: 600px;
    height: 350px;
  }

  .bridge-detail {
    flex-direction: column;
    width: 90%;
  }

  .detail-left {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #eee;
    padding-right: 0;
    padding-bottom: 20px;
    margin-bottom: 20px;
  }

  .detail-right {
    width: 100%;
    padding-left: 0;
  }
}

@media (max-width: 600px) {
  .bridge-slider {
    height: 300px;
  }

  .slider-wrapper {
    width: 90%;
  }

  .bridge-card {
    width: 100%;
    height: 280px;
  }

  .slider-btn {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .prev-btn {
    left: 20px;
  }

  .next-btn {
    right: 20px;
  }
}
</style>
