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

---

### 方式一：统一端口快速启动（推荐）

所有页面通过 **8080 端口**统一访问，无需分别启动多个服务。

```bash
# 1. 安装统一服务依赖
cd "统一端口测试"
npm install

# 2. 启动统一端口服务
npm start
```

服务启动后访问：
- 首页：http://localhost:8080/
- 展览：http://localhost:8080/exhibition
- 图鉴：http://localhost:8080/atlas
- 数据报告：http://localhost:8080/report
- 木石之韵：http://localhost:8080/woodstone

**如需使用 AI 智能对话功能，需额外启动后端服务：**

```bash
# 3. 启动 AI 后端服务（端口 3005）
cd atlas/backend
npm install  # 首次运行需安装依赖
npm start
```

> **验证后端是否启动成功**：访问 http://localhost:3005/health，如返回 `{"status":"ok"}` 则表示 AI 功能可用。

---

### 方式二：完整功能启动（含 AI 对话）

如果需要使用 **AI 小导游** 的语音对话功能，需同时启动 AI 后端服务。

```bash
# 1. 安装所有依赖
cd exhibition && npm install
cd ../atlas && npm install
cd ../ && npm install

# 2. 构建前端项目
cd exhibition && npm run build
cd ../atlas && npm run build

# 3. 启动 AI 后端服务（端口 3005）
cd ../atlas/backend && npm start

# 4. 启动统一服务（端口 8080）
cd ../../ && npm start
```

### 服务地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 统一入口 | http://localhost:8080 | 统一端口访问所有页面 |
| 首页 | http://localhost:8080/ | 水墨入场动画，总导航 |
| 桥韵·展览 | http://localhost:8080/exhibition | 三维滚动叙事 |
| 桥韵·图鉴 | http://localhost:8080/atlas | 数据可视化 + AI 对话 |
| 木石之韵 | http://localhost:8080/woodstone | 传统营造技艺可视化 |
| ├─ 石质桥梁 | http://localhost:8080/woodstone/shilong/ | 石桥营造流程 |
| └─ 木质桥梁 | http://localhost:8080/woodstone/wooden/ | 木桥营造流程 |
| 数据报告 | http://localhost:8080/report | 100座古桥宏观可视化 |
| AI 后端 | http://localhost:3005/health | 后端健康检查（直接访问）|

---

## 项目简介

**桥韵·智汇**是一件以中国古代桥梁为核心主题的**交互式信息可视化设计**作品。作品以**100座中国古代桥梁**为数据基础，构建了一个从微观叙事到宏观洞察的完整数据可视化体系。

### 核心亮点

| 特性 | 说明 |
|------|------|
| **六维数据模型** | 地域、历史、结构、文化、荣誉、世界纪录 |
| **渐进式探索** | 从单桥细节到百桥全景的层层递进 |
| **AI 智能导览** | GLM-4.5 大模型 + 语音合成，可对话的小导游 |
| **统一入口** | 单一端口（8080）访问所有子应用 |
| **水墨美学** | 程序化生成的水墨风格视觉 |

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
    ├─→ 第二幕：桥韵·图鉴（/atlas）
    │       ├── React 18 + TypeScript SPA
    │       ├── 多维度桥梁数据可视化
    │       ├── AI 小导游（可拖拽，支持语音/文字）
    │       └── Node.js 后端（GLM-4.5 + Edge TTS）
    │
    ├─→ 第三幕：木石之韵（/woodstone）
    │       ├── 中国传统桥梁营造技艺可视化
    │       ├── 石质桥梁营造流程（/woodstone/shilong/）
    │       ├── 木质桥梁营造流程（/woodstone/wooden/）
    │       └── AI 小导游（共用后端服务）
    │
    └─→ 第四幕：数据报告（/report）
            ├── 100座古桥六维数据可视化
            ├── 六大篇章模块化架构
            │   ├── S1 封面：水墨动效 + 四大统计数字
            │   ├── S2 地域分布：中国地图热力图 + 双环饼图
            │   ├── S3 历史时间：7朝代选择条 + 世界对比
            │   ├── S4 结构类型：雷达图对比5种桥型
            │   ├── S5 文化价值：词云 + 桑基图 + 8则历史故事
            │   └── S6 彩蛋总结：6张纪录卡 + Canvas海报生成器
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
| http-proxy-middleware | API 代理 |

---

## 统一端口架构

```
┌─────────────────────────────────────────────────────────────┐
│                    统一入口 (Port 8080)                      │
│                     server.js                               │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────────┐    ┌──────────────┐
│ 静态页面服务  │    │   API 代理        │    │  React SPA   │
│              │    │  (health 检查)    │    │              │
│ /exhibition  │    │  /api/health     │    │  /atlas      │
│ /report      │    │  ──────────────► │    │              │
│ /woodstone   │    │  localhost:3005  │    │  (Fallback)  │
│ /            │    │                  │    │              │
└──────────────┘    └──────────────────┘    └──────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   AI 后端服务     │
                    │   (Port 3005)    │◄──┐
                    │                  │   │  /atlas 页面
                    │  GLM-4.5 对话    │   │  直接访问
                    │  Edge TTS 语音   │◄──┘  localhost:3005
                    │  桥梁知识库      │   │
                    └──────────────────┘   │
                                           │
                    ┌──────────────────┐   │
                    │   木石之韵页面     │◄──┘
                    │   /woodstone     │    通过 /api 代理访问
                    └──────────────────┘    (api/v1/*)
```

### 架构优势

- **单一入口**：所有页面通过 `http://localhost:8080` 访问
- **共享后端**：多个前端页面共用同一个 AI 后端服务
- **路径隔离**：各子应用通过独立路由访问，互不干扰
- **开发友好**：支持独立开发和统一部署两种模式

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
         │
         └──── 应用于 /atlas 和 /woodstone 页面
```

**特性**：
- 流体球体形象 + 35+ 种眼部表情状态
- 全页面自由拖拽定位
- 自然语言问答 + 语音播报
- 知识库增强（bridge_knowledge.md）
- 多页面共享（图鉴页 + 木石之韵页）

**注意**：图鉴页(/atlas)的AI助手默认直接访问后端服务(`localhost:3005`)，木石之韵页(/woodstone)通过统一服务的`/api`代理访问。如需使用统一端口代理，请修改 `atlas/ai-assistant-embed.js` 中的 `baseURL` 为空字符串。

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

### 4. 六维数据可视化（数据报告）

第四幕数据报告采用模块化架构，六大篇章通过滚动吸附方式呈现：

| 篇章 | 核心可视化 | 交互特性 |
|------|-----------|----------|
| **S1 封面** | 四大统计数字（25座/7朝代/15省/1400+年）| 数字计数动画、幕布揭开 |
| **S2 地域** | 中国地图热力图 + 双环饼图 | 省份点击高亮、图表联动 |
| **S3 朝代** | 7朝代柱状图 + 世界对比 | 朝代切换、详情面板 |
| **S4 类型** | 雷达图对比5种桥型 | 卡片点击模态框 |
| **S5 文化** | 词云 + 桑基图 + 8则故事 | 关键词跳转对应故事 |
| **S6 总结** | 6张纪录卡 + 粒子动画 | Canvas海报生成器 |

**技术实现**：
- 单文件架构（76KB）零构建部署
- 6个section模块并行开发，通过组装脚本合并
- 侧边导航点 + 进度条 + 滚动吸附
- ECharts 5.4.3 实现地图/雷达/桑基图
- Canvas API 实现粒子效果和海报生成

---

## 项目目录

```
统一端口测试/
├── index.html                 # 首页：水墨开场动画
├── server.js                  # 统一端口服务器（Port 8080）
├── package.json               # 统一服务依赖
├── README.md                  # 项目说明文档
│
├── exhibition/                # 第一幕：桥韵·展览（Vite + Three.js）
│   ├── index.html
│   ├── script.js              # GSAP + Lenis + Three.js 动画逻辑
│   ├── styles.css             # 展览页面样式
│   ├── shaders.js             # Three.js 着色器
│   ├── modelZhaozhou.glb      # 赵州桥 3D 模型（32MB）
│   ├── vite.config.js         # Vite 配置
│   ├── package.json           # 展览模块依赖
│   ├── shared/                # 共享组件
│   │   └── zhaozhou-3d-scene.js  # 赵州桥 3D 场景初始化
│   └── dist/                  # 构建输出
│
├── atlas/                     # 第二幕：桥韵·图鉴（React + TS）
│   ├── src/                   # React 源码
│   │   ├── App.tsx            # 应用主组件
│   │   ├── main.tsx           # 入口文件
│   │   ├── pages/             # 页面组件
│   │   ├── components/        # 可复用组件
│   │   ├── assets/            # 图片资源
│   │   └── hooks/             # 自定义 Hooks
│   ├── backend/               # AI 后端服务（Port 3005）
│   │   ├── server.js          # Express API 服务器
│   │   ├── edge_tts_service.py # Edge TTS 语音服务
│   │   └── package.json       # 后端依赖
│   ├── knowledge/
│   │   └── bridge_knowledge.md # AI 知识库文档
│   ├── ai-assistant-embed.js  # AI 小导游嵌入脚本
│   ├── ai-assistant.html      # AI 助手独立页面
│   └── dist/                  # 构建输出
│
├── 桥梁可视化木石/             # 第三幕：木石之韵页面
│   ├── index.html
│   ├── ai-assistant-embed.js  # AI 小导游（共用后端）
│   ├── shilong/               # 石质桥梁子页面
│   │   ├── index.html
│   │   └── images/            # 石质桥梁图片
│   └── wooden/                # 木质桥梁子页面
│       ├── index.html
│       └── images/            # 木质桥梁图片
│
├── 第四页/                     # 第四幕：数据报告页面
│   ├── index.html
│   ├── README.md              # 页面说明
│   ├── DATA_SOURCES.md        # 数据来源说明
│   ├── page_structure.md      # 页面结构文档
│   ├── data/
│   │   ├── bridges_data.json      # 桥梁数据集
│   │   └── bridges_data_100.json  # 100座古桥完整数据
│   ├── lib/                   # 库文件
│   └── sections/              # 页面区块
│
└── frontend/                   # 构建输出目录（由统一服务托管）
    ├── exhibition/             # exhibition 构建产物
    ├── atlas/dist/             # atlas 构建产物
    └── report/                 # 报告页面
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

## 开发指南

### 独立开发模式

如果只需要开发某个子页面，可以单独启动开发服务器：

```bash
# 开发展览页面
cd exhibition
npm install
npm run dev       # 启动在 http://localhost:3003

# 开发图鉴页面
cd atlas
npm install
npm run dev       # 启动在 http://localhost:3004
```

### 统一部署模式

开发完成后，需要构建并放到统一端口下：

```bash
# 构建 exhibition
cd exhibition
npm run build     # 输出到 frontend/exhibition

# 构建 atlas
cd atlas
npm run build     # 输出到 frontend/atlas/dist
```

构建完成后，统一服务会自动加载新的构建文件。

---

## API 接口

统一端口服务提供以下 API 代理：

| 接口 | 方法 | 说明 |
|------|------|------|
| `/health` | GET | 后端健康检查 |
| `/api/v1/chat` | POST | AI 对话接口（需要 backend 服务） |
| `/api/v1/chat/stream` | POST | 流式 AI 对话接口 |
| `/api/v1/tts/edge` | POST | Edge TTS 语音合成接口 |
| `/api/v1/tts/edge/stream` | POST | 流式语音合成接口 |

**AI 对话示例（直接访问后端）：**
```bash
curl -X POST http://localhost:3005/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"介绍一下赵州桥"}'
```

**注意**：当前代理配置下，API 端点需要通过 `localhost:3005` 直接访问。统一服务的 `/api` 代理仅用于健康检查接口。

---

## 常见问题

### Q: 8080 端口被占用？
```bash
# Windows: 查找并终止占用进程
netstat -ano | findstr :8080
taskkill //F //PID <PID>
```

### Q: AI 功能无法使用？
确保已：
1. 安装 Python 和 edge-tts：`pip install edge-tts`
2. 设置智谱 AI API Key（在 atlas/backend/server.js 中配置）
3. 启动后端服务：`cd atlas/backend && npm start`

### Q: 页面样式加载异常？
检查浏览器控制台是否有 CORS 错误，或尝试清除浏览器缓存后刷新。

---

## 更新日志

### v1.1.0 (2025-03)
- 木石之韵页面新增石质/木质桥梁子页面（/woodstone/shilong/、/woodstone/wooden/）
- 数据报告页面模块化重构，新增6大篇章（S1-S6）
- 完善项目文档和目录结构说明

### v1.0.0 (2025-03)
- 统一端口架构实现
- 支持 5 个子应用统一访问
- AI 小导游多页面共享
- 水墨风格首页动画

---

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
