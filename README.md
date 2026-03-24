# 桥韵·智汇

> 以数字之光，重现古桥之韵；以交互之道，传递人文之智。

一个融合**数据可视化**、**三维沉浸体验**与**AI 智能导览**的中国古代桥梁文化交互信息设计作品。

## 快速启动（更新版）

### 环境要求

| 依赖 | 版本要求 | 说明 |
|------|----------|------|
| Node.js | ≥ 18 | 前后端运行环境 |
| npm | ≥ 9 | 包管理器 |
| Python | ≥ 3.8 | Edge TTS 服务 |
| Python edge-tts | 任意 | `pip install edge-tts` |
| http-server | 任意 | `npm install -g http-server`（静态文件服务） |

### 首次安装依赖

```bash
# 安装展览页依赖
cd exhibition
npm install

# 安装图鉴页依赖（含后端依赖）
cd ../atlas
npm install

# 全局安装 http-server
npm install -g http-server
```

### 启动服务

#### 1. 首页服务（8888端口）
```bash
cd 总/
http-server -p 8888
```

#### 2. 桥韵·展览（3003端口）
```bash
cd 总/exhibition
npm run dev
```

#### 3. 桥韵·图鉴 + AI 后端（3004/3005端口）
```bash
cd 总/atlas
npm run start
```

#### 4. 中国古代桥梁数据报告（3006端口）
```bash
cd 总/第四页
http-server -p 3006
```

### 服务地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 首页 | http://localhost:8888 | 水墨入场动画，总导航 |
| 桥韵·展览 | http://localhost:3003 | 三维滚动叙事 |
| 桥韵·图鉴 | http://localhost:3004 | 数据可视化 + AI 对话 |
| AI 后端 | http://localhost:3005/health | 后端健康检查 |
| 数据报告 | http://localhost:3006 | 100座古桥宏观可视化 |

## 技术栈更新

### 开发工具

| 工具 | 用途 |
|------|------|
| concurrently | 并发启动前后端服务 |
| http-server | 静态文件服务（替代 Python http.server） |
| Playwright | 开发截图与自动化测试 |

---

---

## 目录

1. [作品概述](#作品概述)
2. [设计理念与现实意义](#设计理念与现实意义)
3. [应用场景](#应用场景)
4. [作品结构与四幕设计](#作品结构与四幕设计)
5. [技术栈](#技术栈)
6. [方案设计与技术实现](#方案设计与技术实现)
7. [快速启动（开箱即用）](#快速启动开箱即用)
8. [目录结构说明](#目录结构说明)

---

## 作品概述

**桥韵·智汇**（Bridge Resonance · Intelligence Hub）是一件以中国古代桥梁为核心主题的**交互信息设计**作品。作品选取**通津桥**、**双龙桥**、**赵州桥**三座具有代表性的中国古桥，通过四个独立但相互衔接的体验场景，引导观者从沉浸式的视觉入场，到深度的文化信息探索，再到与 AI 智能助手的自然对话，最后以宏观数据视角俯瞰中国古代桥梁全貌，完成一次跨越时空的古桥文化之旅。

作品的核心命题是：**如何用现代交互技术，让沉睡在教科书与遗址中的古桥文化，重新走进当代人的视野与心灵？**

---

## 设计理念与现实意义

### 设计思想

#### 1. 四幕叙事结构——由情入境，由境入知，由知达智，由智观全

作品采用**戏剧化的四幕式叙事结构**，每一幕对应用户与信息的不同关系层次：

| 幕次 | 场景 | 信息层次 | 体验目标 |
|------|------|----------|----------|
| 第一幕 | 开场·水墨入场 | 情感层 | 营造文化氛围，激发兴趣 |
| 第二幕 | 展览·滚动叙事 | 叙事层 | 沉浸式讲述，建立认知 |
| 第三幕 | 图鉴·数据探索 | 知识层 | 深度信息可视化，知识内化 |
| 第四幕 | 报告·宏观洞察 | 智慧层 | 数据全景可视化，洞察规律 |

这一结构借鉴了电影叙事中的"Act Structure"，但将其映射到**信息逐步深化**的认知路径上——用户不是被动接受信息，而是随着体验的推进，主动深入。从个体故事到群体数据，从微观细节到宏观规律，形成完整的认知闭环。

#### 2. 水墨美学的数字化转译

作品拒绝将"中国风"简化为表面的纹样堆砌，而是深入提炼水墨美学的**核心视觉语法**：
- **留白**：大量空白不是空洞，而是信息呼吸的空间，引导视线流动
- **晕染**：元素的出现与消失以渐隐渐显的方式完成，模拟墨迹入纸的扩散感
- **意境**：背景以 Canvas 2D API 实时绘制山水，用噪声函数与随机游走模拟水墨肌理，非图片资源，而是程序生成的"活画"

#### 3. 信息密度的动态控制

交互设计的核心挑战之一是**避免信息过载**。本作品采用**渐进式信息披露**策略：
- 用户初进入时看到的是氛围、标题、简短诗句
- 滚动推进时，图片、数据、故事按节奏依次出现
- 主动交互（点击、悬停、提问）才触达最深层的细节数据
- AI 对话打破边界，允许用户以自然语言探索任意感兴趣的细节

#### 4. AI 作为文化传播的新界面

传统文化展览的信息传递是单向的——展品说什么，观众看什么。本作品引入 **AI 小导游**（基于大语言模型 GLM-4.5），将文化传播变为**双向对话**：
- 观者可以用自然语言提问："赵州桥为什么叫天下第一桥？"
- AI 结合预置的桥梁知识库（`bridge_knowledge.md`）给出情感化、人格化的回答
- TTS 语音合成让回答有声有色，符合展览现场的沉浸场景
- 情绪感知让 AI 助手的表情（眼神、颜色、动作）随对话情绪动态变化，增加亲近感

### 现实意义

#### 文化遗产数字化传承

中国拥有数以千计的古代桥梁，其中许多是独特的土木工程遗产，蕴含了中国古代匠人对力学、美学、自然的深刻理解。然而，随着时代变迁，这些文化记忆正在加速淡出公众视野。本作品提供了一种**低门槛、高沉浸**的文化接触方式，尤其适合年轻一代——他们不需要去现场，不需要读厚重的文献，通过一个网页就能与千年古桥产生真实的情感连接。

#### 信息设计的本土化探索

目前国际主流的数据可视化与交互叙事设计，其视觉语言大多以西方现代设计为基础（扁平化、几何化、极简主义）。本作品尝试探索**本土化的信息设计语言**：如何在保持信息准确性和交互流畅性的前提下，让视觉语言也能承载文化意涵？这是一个值得持续研究的课题。

#### 人机协作在人文领域的应用示范

AI 在艺术、文化领域的应用常常停留在"生成图像"或"写诗"的层面。本作品展示了 AI 更具价值的应用形态：**作为文化知识的智能接口**，它不替代人类去解读文化，而是降低普通人接触深层文化知识的门槛，成为文化与大众之间的桥梁——正如古桥连接两岸一样。

#### 从微观到宏观的认知升维

前三幕聚焦于三座古桥的深度解读，而第四页**"中国古代桥梁数据报告"**则将视野扩展至100座代表性古桥的全貌。通过六维数据可视化（地域分布、历史时间、结构类型、文化价值、荣誉纪录、生成海报），作品实现了从**个体故事**到**群体规律**的认知跃迁。这种"微观-宏观"双重视角的设计，不仅让观众感受单座桥梁的匠心独运，更能洞察中国古代桥梁发展的整体脉络——从隋代赵州桥的敞肩拱创举，到宋代桥梁的繁复精美，再到明清时期的集大成，最终呈现出一部可视化的"中国古代桥梁史"。

---

## 应用场景

| 场景 | 说明 |
|------|------|
| **文化展览现场** | 作为实体展览的数字化延伸，观众扫码即可在手机端或展览大屏上体验，AI 导游可替代部分人工讲解 |
| **博物馆数字化** | 作为博物馆/遗址公园的线上展厅，提供 7×24 小时的文化讲解服务 |
| **文化教育** | 中小学历史、地理、文化课程的辅助教材，以可视化方式呈现桥梁的结构、历史、诗词 |
| **旅游导览** | 游客出发前的预习工具，或现场的交互式导览 |
| **学术研究展示** | 古桥保护、传统建筑研究成果的可视化呈现平台 |
| **非遗传播** | 为传统工艺、历史建筑的非遗申报与宣传提供数字化支撑 |
| **数据新闻/科普传播** | 第四页数据报告可作为独立的数据新闻作品，在社交媒体、科普平台传播中国古代桥梁的宏观图景 |

---

## 作品结构与四幕设计

```
首页（开场）
    │  水墨山水动态背景 + 幕布揭开动效
    │  导航至两个子应用
    ↓
第一幕：桥韵·展览（滚动叙事）
    │  视差滚动 × 三座古桥的故事序列
    │  Three.js 3D 赵州桥模型
    │  GSAP 驱动的帧级动画
    ↓
第二幕：桥韵·图鉴（数据图鉴）
    │  React 信息可视化应用
    │  桥梁多维数据对比（结构/年代/工艺）
    │  Recharts 数据图表
    │  AI 小导游（悬浮式，可拖拽）
    └── AI 后端（GLM-4.5 对话 + Edge TTS 语音）
    ↓
第三幕：中国古代桥梁数据报告（宏观可视化）
    │  25座代表性古桥的六维数据可视化
    │  地域分布、历史时间、结构类型、文化价值
    │  ECharts 地图/桑基图/雷达图
    │  沉浸式滚动 + 水墨美学
```

### 页面一：开场 · 水墨入场（`index.html`）

- 纯 Canvas 2D 绘制的水墨山水背景（程序生成，非图片）
- 幕布揭开的 CSS 动画作为仪式感入场
- 墨滴落字动效，逐字显示标题
- 点击按钮时，墨点扩散的退场过渡

### 页面二：桥韵·展览（`exhibition/`）

- 基于 **Vite + Three.js + GSAP + Lenis** 的沉浸式滚动体验
- Lenis 提供超丝滑的惯性滚动
- GSAP ScrollTrigger 驱动所有元素的进出场动画
- 赵州桥 3D GLB 模型实时渲染（约 32MB），配合 GSAP 滚动驱动相机运动
- 图片轮播、文字诗词交替出现，形成视觉叙事节奏

### 页面三：桥韵·图鉴（`atlas/`）

- **React 18 + TypeScript + Tailwind CSS** 构建的 SPA
- 多维度桥梁信息可视化（年代线、结构特征、地理分布、工程数据）
- **Recharts** 绘制响应式数据图表
- 嵌入式 AI 小导游（`ai-assistant-embed.js`）：可拖拽定位，支持语音/文字双模式交互
- **Node.js Express 后端**：ZhipuAI GLM-4.5 对话 API + Edge TTS / 讯飞语音合成

### 页面四：中国古代桥梁数据报告（`第四页/`）

- 基于 **原生 HTML/CSS/JS + ECharts** 的单文件可视化应用
- 收录 **100座代表性古桥**（隋代至民国）
- **六维数据可视化**：
  - 封面：水墨动效 + 四大统计数字
  - 地域分布：中国地图热力图 + 双环饼图
  - 历史时间：7朝代时间轴 + 世界对比
  - 结构类型：雷达图对比5种桥型
  - 文化价值：30词云 + 桑基图 + 8则历史故事
  - 彩蛋总结：6张纪录卡 + Canvas海报生成器
- **GSAP** 驱动全屏滚动与入场动画
- **水墨美学**：宣纸纹理、墨迹晕染、书法字体

---

## 技术栈

### 前端

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.3 | 图鉴页面 UI 框架 |
| TypeScript | 5.8 | 类型安全 |
| Vite | 5.4 / 7.3 | 构建工具 & 开发服务器 |
| Tailwind CSS | 3.4 | 原子化样式 |
| shadcn/ui (Radix UI) | latest | 无障碍 UI 组件库 |
| Recharts | 2.15 | 数据图表可视化 |
| React Router | 6.30 | 客户端路由 |
| TanStack Query | 5.83 | 服务端状态管理 |
| Three.js | 0.182 | 3D 模型渲染（赵州桥 GLB） |
| GSAP + ScrollTrigger | 3.14 | 滚动驱动动画 |
| Lenis | 1.3 | 平滑惯性滚动 |
| Canvas 2D API | 原生 | 水墨山水程序化生成 |

### 后端

| 技术 | 版本 | 用途 |
|------|------|------|
| Node.js | ESM | 运行时 |
| Express | 5.2 | HTTP 服务器框架 |
| ZhipuAI GLM-4.5-air | API | 大语言模型对话（中文优化） |
| Edge TTS | Python CLI | 微软 Azure 神经网络语音合成 |
| 讯飞 TTS | WebSocket API | 备用中文语音合成 |
| ws | 8.19 | WebSocket 客户端（对接讯飞） |
| cors | 2.8 | 跨域资源共享 |

### 开发工具

| 工具 | 用途 |
|------|------|
| concurrently | 并发启动前后端服务 |
| http-server | 首页静态文件服务 |
| Playwright | 开发截图与自动化测试 |

---

## 方案设计与技术实现

### 1. 整体架构：多应用协同的微前端思路

本项目没有采用单一巨型应用，而是将三个叙事场景拆分为**独立部署单元**，通过 URL 跳转串联：

```
┌─────────────────────────────────────────────────────────┐
│                    用户浏览器                             │
├──────────┬──────────────────────┬───────────────────────┤
│ :8888    │       :3003          │        :3004           │
│ 开场入口 │   桥韵·展览（Vite）   │  桥韵·图鉴（React）   │
│ (http-server) │   Three.js + GSAP    │  数据可视化 SPA        │
│ 静态服务 │   滚动叙事            │            ↑          │
└──────────┴──────────────────────┤  ai-assistant-embed.js│
                                  ├───────────────────────┤
                                  │        :3005           │
                                  │   AI 后端（Express）   │
                                  │   GLM-4.5 + TTS        │
                                  └───────────────────────┘
```

**设计优势：**
- 每个场景可独立开发、独立迭代，无耦合
- 展览页（Three.js 重型 3D）与图鉴页（React SPA）运行在不同进程，互不干扰
- AI 后端作为独立微服务，未来可复用于其他文化项目

### 2. 程序化水墨生成（`index.html`）

首页背景不依赖任何图片资源，全部由 Canvas 2D API 实时绘制：

```javascript
// 山体轮廓：多层叠加的随机游走折线
function drawMountain(y, amplitude, color, opacity) {
    ctx.beginPath();
    for (let x = 0; x <= W; x += 4) {
        const height = y + noise(x * 0.003 + seed) * amplitude;
        ctx.lineTo(x, height);
    }
    // 填充渐变，模拟远近层次的墨色深浅
}

// 颗粒噪声：模拟宣纸纹理
for (let i = 0; i < 8000; i++) {
    ctx.fillRect(random() * W, random() * H, 1, 1);
}
```

这一设计保证了**每次刷新画面略有不同**，如同真实水墨的不可复制性。

### 3. 滚动驱动叙事（`exhibition/`）

GSAP ScrollTrigger 与 Lenis 的协作模式：

```javascript
// Lenis 捕获滚动速度，传递给 GSAP ticker
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));

// 每个叙事单元绑定滚动进度
gsap.timeline({
    scrollTrigger: {
        trigger: ".bridge-section",
        start: "top center",
        end: "bottom center",
        scrub: 1.5  // 1.5秒平滑追随
    }
}).fromTo('.bridge-title', { opacity: 0, y: 60 }, { opacity: 1, y: 0 });
```

Three.js 相机运动也由 ScrollTrigger 控制，实现滚动触发的 3D 漫游效果。

### 4. AI 小导游架构（`ai-assistant-embed.js` + `backend/server.js`）

AI 助手采用**自执行脚本嵌入**方案，而非 iframe——这是本项目的关键工程决策之一：

**为什么不用 iframe？**
> iframe 方案下，浮层覆盖全页面，导致下方页面的点击、滚动、拖拽全部失效。改为直接注入 DOM 后，AI 助手元素与页面其他元素平等共存，pointer-events 自然透传，彻底消除交互冲突。

**嵌入方案：**
```javascript
// ai-assistant-embed.js 采用 IIFE 模式
(function() {
    // 1. 注入 CSS（带命名空间前缀 .ai- 防止样式污染）
    const style = document.createElement('style');
    style.textContent = `...`;
    document.head.appendChild(style);

    // 2. 注入 HTML（直接添加到 body，在 React #root 之外）
    const host = document.createElement('div');
    host.innerHTML = `...`;
    document.body.appendChild(host);

    // 3. 初始化 JS 逻辑（60fps 动画循环、事件绑定、API 调用）
    ...
})();
```

**AI 对话流程：**
```
用户输入
    ↓
POST /api/v1/chat (Express)
    ↓
加载 bridge_knowledge.md → 构建系统提示词
    ↓
ZhipuAI GLM-4.5-air API（流式/非流式）
    ↓
返回 { content, emotion }
    ↓
前端：显示文字气泡 + 更新表情 + 触发 TTS
    ↓
POST /api/v1/tts/edge（Edge TTS Python 脚本）
    ↓
返回 Base64 MP3 → Audio 对象播放
```

**AI 表情系统：**
助手共有 35+ 种眼部表情状态（happy, curious, thinking, sleepy, love...），每种情绪对应独特的眼睛形态参数（宽、高、圆角、旋转角），通过 CSS transition 平滑过渡，配合流体球颜色、发光效果、缩放弹跳，形成有"生命感"的 AI 形象。

### 5. 拖拽交互的工程实现

AI 助手支持全页面自由拖拽，实现原理：

```javascript
// position: fixed 元素，通过修改 left/top 实现移动
let petLeft = 150, petTop = 130;

pet.addEventListener('mousedown', (e) => {
    const offsetX = e.clientX - petLeft;
    const offsetY = e.clientY - petTop;

    document.addEventListener('mousemove', (e) => {
        petLeft = Math.max(0, Math.min(innerWidth - 67, e.clientX - offsetX));
        petTop  = Math.max(0, Math.min(innerHeight - 67, e.clientY - offsetY));
    });
});

// 动画循环同步更新所有跟随元素
function loop() {
    pet.style.left = petLeft + 'px';
    pet.style.top  = petTop  + 'px';
    // 工具栏、输入框、消息气泡均跟随 petLeft/petTop 计算定位
    requestAnimationFrame(loop);
}
```

---

## 快速启动（开箱即用）

### 环境要求

| 依赖 | 版本要求 | 说明 |
|------|----------|------|
| Node.js | ≥ 18 | 前后端运行环境 |
| npm | ≥ 9 | 包管理器 |
| Python | ≥ 3.8 | 首页静态服务 + Edge TTS |
| Python edge-tts | 任意 | `pip install edge-tts` |

### 首次安装依赖

```bash
# 安装展览页依赖
cd exhibition
npm install

# 安装图鉴页依赖（含后端依赖）
cd ../atlas
npm install
```

### 一键启动（Windows）

双击根目录的 **`start.bat`** 或 **`start.ps1`**，所有服务自动启动，浏览器自动打开首页。

```
总/
├── start.bat   ← 双击运行（批处理脚本）
└── start.ps1   ← 双击运行（PowerShell脚本）
```

启动后各服务端口：

| 服务 | 地址 | 说明 |
|------|------|------|
| 首页 | http://localhost:8888 | 水墨入场动画，总导航 |
| 桥韵·展览 | http://localhost:3003 | 三维滚动叙事 |
| 桥韵·图鉴 | http://localhost:3004 | 数据可视化 + AI 对话 |
| AI 后端 | http://localhost:3005/health | 后端健康检查 |
| 数据报告 | http://localhost:3006 | 100座古桥宏观可视化 |

### 手动启动（各终端分别运行）

```bash
# 终端 1：首页
cd 总/
http-server -p 8888

# 终端 2：桥韵·展览
cd 总/exhibition
npm run dev          # → http://localhost:3003

# 终端 3：桥韵·图鉴 + AI 后端（同时启动）
cd 总/atlas
npm run start        # → http://localhost:3004 (前端) + :3005 (后端)

# 终端 4：中国古代桥梁数据报告
cd 总/第四页
http-server -p 3006   # → http://localhost:3006
```

---

## 目录结构说明

```
总/
├── index.html              # 首页：水墨开场动画
├── start.bat               # Windows 一键启动脚本
├── start.ps1               # Windows PowerShell 启动脚本
├── README.md               # 本文档
│
├── exhibition/             # 桥韵·展览（滚动叙事）
│   ├── index.html          # 主页面
│   ├── script.js           # 主逻辑：GSAP + Lenis + Three.js 编排
│   ├── shaders.js          # WebGL 着色器
│   ├── styles.css          # 全部样式
│   ├── shared/
│   │   └── zhaozhou-3d-scene.js  # 赵州桥 3D 场景模块（可复用）
│   ├── lib/                # 本地 vendored 库（GSAP, Lenis）
│   ├── modelZhaozhou.glb   # 赵州桥 3D 模型
│   ├── img1~img10.jpg      # 古桥高清照片
│   ├── vite.config.js      # Vite 配置（端口 3003）
│   └── package.json
│
├── atlas/                  # 桥韵·图鉴（React 数据可视化）
│   ├── src/
│   │   ├── main.tsx        # React 入口
│   │   ├── App.tsx         # 路由根组件
│   │   ├── pages/
│   │   │   └── Index.tsx   # 主页面（组合所有 Section）
│   │   └── components/
│   │       ├── HeroSection.tsx       # 英雄区
│   │       ├── BridgeSection.tsx     # 桥梁详情卡片
│   │       ├── ComparisonSection.tsx # 桥梁横向对比
│   │       ├── CalligraphySection.tsx# 书法文化区
│   │       └── Navigation.tsx        # 顶部导航
│   ├── backend/
│   │   └── server.js       # Express API 服务（端口 3005）
│   ├── knowledge/
│   │   └── bridge_knowledge.md  # AI 知识库（注入为系统提示词）
│   ├── ai-assistant-embed.js    # AI 小导游嵌入脚本
│   ├── ai-assistant.html        # AI 助手独立页面（备用）
│   ├── index.html          # React 应用入口
│   ├── vite.config.ts      # Vite 配置（端口 3004）
│   └── package.json
│
├── 第四页/                 # 中国古代桥梁数据报告（宏观可视化）
│   ├── index.html          # 主文件：25座古桥六维数据可视化
│   ├── data/
│   │   └── bridges_data.json   # 25座桥梁原始数据
│   ├── sections/           # 6个篇章源文件
│   │   ├── s1_cover.html       # 封面
│   │   ├── s2_regional.html    # 地域分布
│   │   ├── s3_timeline.html    # 历史时间
│   │   ├── s4_types.html       # 结构类型
│   │   ├── s5_culture.html     # 文化价值
│   │   └── s6_summary.html     # 彩蛋总结
│   ├── gen_s4.py              # 生成脚本
│   └── page_structure.md       # 设计规范
```

---

## 数据可视化设计说明

### 可视化目标

桥梁数据的可视化面临一个核心挑战：**古代建筑数据的不确定性**。不同于现代工程项目有精确的 CAD 数据，古桥的尺寸、年代、工艺多来自历史文献，存在一定的模糊性。本作品的可视化设计选择**以数据展现为辅、以叙事传达为主**，避免制造虚假精确感。

### 视觉编码策略

| 数据维度 | 视觉变量 | 设计理由 |
|----------|----------|----------|
| 桥梁年代 | 时间轴位置 + 颜色深浅 | 时间感知最直觉化 |
| 结构类型 | 图形形状 | 拱桥/平桥/斜拉视觉差异显著 |
| 工程规模 | 面积/长度编码 | 直观感受体量差异 |
| 历史地位 | 高亮/勋章图标 | 文化价值难以量化，用荣誉标识替代 |
| 地理位置 | 省份标注 | 强化地域文化差异感知 |

### 交互信息设计原则

1. **直接操作（Direct Manipulation）**：所有数据点可悬停查看详情，避免跳转离开当前语境
2. **情境保留（Context Preservation）**：图表缩放时保持数据对比关系可见
3. **渐进式细节（Progressive Detail）**：从概览到细节的信息层次，用户主动控制信息深度
4. **语义一致性（Semantic Consistency）**：相同的颜色、图标在所有页面中含义不变

---

*"桥是人类跨越障碍的意志具象化，也是人类在自然面前谦逊与智慧的平衡。"*

*本作品献给每一座仍在风雨中伫立的古桥，以及守护它们的人们。*
