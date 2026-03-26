# 桥韵·智汇

> 以数字之光，重现古桥之韵；以交互之道，传递人文之智。

一个融合**数据可视化**、**三维沉浸体验**与**AI 智能导览**的中国古代桥梁文化交互信息设计作品。

---

## 快速开始

### 环境要求

| 依赖 | 版本要求 |
|------|----------|
| Node.js | ≥ 18 |
| npm | ≥ 9 |
| Python | ≥ 3.8 |
| edge-tts | `pip install edge-tts` |

### 安装与启动

```bash
# 1. 安装依赖
cd exhibition && npm install
cd ../atlas && npm install

# 2. 构建前端项目
cd exhibition && npm run build
cd ../atlas && npm run build

# 3. 启动统一服务
cd .. && npm start
```

### 服务地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 统一入口 | http://localhost:8080 | 统一端口访问所有页面 |
| 首页 | http://localhost:8080/ | 水墨入场动画，总导航 |
| 桥韵·展览 | http://localhost:8080/exhibition | 三维滚动叙事 |
| 桥韵·图鉴 | http://localhost:8080/atlas | 数据可视化 + AI 对话 |
| AI 后端 | http://localhost:8080/api/health | 后端健康检查 |
| 数据报告 | http://localhost:8080/report | 100座古桥宏观可视化 |

---

## 项目简介

**桥韵·智汇**是一件以中国古代桥梁为核心主题的**交互式信息可视化设计**作品。作品以**100座中国古代桥梁**为数据基础，构建了一个从微观叙事到宏观洞察的完整数据可视化体系。

### 核心创新点

1. **六维数据模型**：地域分布、历史时间、结构类型、文化价值、荣誉纪录、世界纪录
2. **渐进式数据探索**：从单桥6维数据到100座古桥全景概览
3. **AI智能交互**：基于GLM-4.5的自然语言数据查询与语音导览
4. **沉浸式数据叙事**：数据可视化与文化叙事的深度融合

### 应用场景

- 文化展览现场的数字化延伸
- 博物馆/遗址公园的线上展厅
- 中小学历史文化课程辅助教材
- 旅游导览与非遗传播

---

## 作品结构

```
统一入口（http://localhost:8080）
    │
    ├── 首页（/）
    │   ├── 水墨山水动态背景（Canvas 2D程序化生成）
    │   ├── 幕布揭开动效
    │   └── 导航至子应用
    │
    ├─→ 第一幕：桥韵·展览（/exhibition）
    │       ├── 视差滚动 × 三座古桥故事序列
    │       ├── Three.js 3D 赵州桥模型
    │       └── GSAP ScrollTrigger 驱动动画
    │
    └─→ 第二幕：桥韵·图鉴（/atlas）
    │       ├── React 18 + TypeScript SPA
    │       ├── 多维度桥梁数据可视化
    │       ├── AI 小导游（可拖拽，支持语音/文字）
    │       └── Node.js 后端（GLM-4.5 + Edge TTS）
    │
    └─→ 第三幕：中国古代桥梁数据报告（/report）
            ├── 100座古桥六维数据可视化
            ├── ECharts 地图/桑基图/雷达图
            └── GSAP 沉浸式滚动 + 水墨美学
```

---

## 技术栈

### 前端

| 技术 | 用途 |
|------|------|
| React 18 + TypeScript | 图鉴页面 UI 框架 |
| Vite | 构建工具 & 开发服务器 |
| Tailwind CSS + shadcn/ui | 样式与组件库 |
| Three.js | 3D 模型渲染（赵州桥 GLB）|
| GSAP + ScrollTrigger | 滚动驱动动画 |
| Lenis | 平滑惯性滚动 |
| ECharts | 数据可视化（地图、桑基图、雷达图）|
| Recharts | React 图表组件 |

### 后端

| 技术 | 用途 |
|------|------|
| Node.js + Express | HTTP 服务器框架 |
| Python 3.8+ | Edge TTS 语音合成服务 |
| ZhipuAI GLM-4.5-air | 大语言模型对话 |
| Edge TTS | 语音合成 |

---

## 核心功能详解

### 1. AI 小导游

**UI 设计参考**：AI 小助手（小团子）的 UI 设计参考了 [kk43994/kkclaw](https://github.com/kk43994/kkclaw) 项目的桌面宠物交互模式。

**架构**：
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   前端嵌入脚本   │────→│  Express 后端   │────→│  GLM-4.5 API   │
│ ai-assistant-   │←────│  (:3005)        │←────│  + Edge TTS    │
│ embed.js        │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

**特性**：
- 流体球体形象 + 35+ 种眼部表情状态
- 全页面自由拖拽定位
- 自然语言问答 + 语音播报
- 知识库增强（bridge_knowledge.md）

### 2. 程序化水墨生成

首页背景不依赖图片，全部由 Canvas 2D API 实时绘制：
- 山体轮廓：多层叠加的随机游走折线
- 颗粒噪声：模拟宣纸纹理
- 墨分五色：焦、浓、重、淡、清

### 3. 滚动驱动叙事

```javascript
// GSAP ScrollTrigger 与 Lenis 协作
gsap.timeline({
  scrollTrigger: {
    trigger: ".section",
    start: "top center",
    end: "bottom center",
    scrub: 1.5  // 平滑追随滚动
  }
}).fromTo('.element',
  { opacity: 0, y: 60 },
  { opacity: 1, y: 0 }
);
```

---

## 项目目录

```
统一端口测试/
├── index.html                 # 首页：水墨开场动画
├── server.js                  # 统一端口服务配置
├── package.json               # 统一服务依赖
├── README.md
│
├── exhibition/                # 桥韵·展览（Vite + Three.js）
│   ├── index.html
│   ├── script.js              # GSAP + Lenis + Three.js
│   ├── modelZhaozhou.glb      # 赵州桥 3D 模型
│   ├── dist/                  # 构建输出目录
│   └── ...
│
├── atlas/                     # 桥韵·图鉴（React + TS）
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   └── components/        # 各 Section 组件
│   ├── backend/
│   │   └── server.js          # Express API (:3005)
│   ├── knowledge/
│   │   └── bridge_knowledge.md # AI 知识库
│   ├── ai-assistant-embed.js  # AI 小导游嵌入脚本
│   ├── dist/                  # 构建输出目录
│   └── ...
│
└── 第四页/                    # 数据报告（原生 JS + ECharts）
    ├── index.html
    └── data/
        └── bridges_data_100.json  # 100座桥梁数据
```

---

## 数据可视化设计

### 六维数据模型

| 维度 | 可视化形式 | 技术实现 |
|------|-----------|----------|
| 地域分布 | 中国地图热力图 + 双环饼图 | ECharts Map |
| 历史时间 | 朝代时间轴 + 世界对比 | GSAP ScrollTrigger |
| 结构类型 | 雷达图对比5种桥型 | ECharts Radar |
| 文化价值 | 词云 + 桑基图 + 历史故事 | ECharts WordCloud/Sankey |
| 荣誉纪录 | 6张纪录卡 | CSS 3D Card |
| 交互生成 | Canvas海报生成器 | Canvas API |

### 设计原则

1. **渐进式披露**：从概览到细节，用户自主控制信息深度
2. **多视图联动**：地图、图表、时间轴之间的数据联动筛选
3. **水墨美学**：墨色色谱、留白艺术、宣纸纹理
4. **直接操作**：所见即所得，即时反馈

---

## 开源协议

本项目采用 **MIT License** 开源协议。

第三方依赖协议：

| 依赖 | 协议 |
|------|------|
| React | MIT |
| Three.js | MIT |
| GSAP | Standard License + Club GreenSock |
| ECharts | Apache-2.0 |
| Tailwind CSS | MIT |

---

## 设计理念

> *桥是人类跨越障碍的意志具象化，也是人类在自然面前谦逊与智慧的平衡。*

本作品献给每一座仍在风雨中伫立的古桥，以及守护它们的人们。
