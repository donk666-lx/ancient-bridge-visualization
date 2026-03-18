# AI古代桥梁导游系统

2026 4C大赛-信息可视化设计赛道-古代桥梁主题

## 项目简介

基于Vue.js + Express的智能导游系统，集成智谱AI和语音合成功能，为用户提供古代桥梁和人物的智能讲解服务。

## 技术栈

### 前端
- Vue.js 3
- Vite
- TailwindCSS
- Vue Router

### 后端
- Node.js
- Express
- WebSocket

### AI服务
- 智谱AI GLM-4.5
- 讯飞TTS
- Edge TTS

## 项目结构

```
ancient-bridge-visualization/
├── frontend/                    # 前端项目
│   ├── src/
│   │   ├── components/          # Vue组件
│   │   ├── App.vue             # 主应用组件
│   │   └── main.js             # 入口文件
│   ├── index.html              # HTML模板
│   ├── package.json            # 前端依赖
│   └── vite.config.js          # Vite配置
│
├── backend/                     # 后端项目
│   ├── server.js               # 主服务器
│   ├── server-final.js         # 最终版本服务器
│   ├── server-search.js        # 搜索功能服务器
│   ├── server-stable.js        # 稳定版本服务器
│   ├── edge_tts_service.py     # Edge TTS服务
│   ├── test-api.js             # API测试文件
│   ├── test-search.js          # 搜索测试文件
│   └── test-tts.js             # TTS测试文件
│
└── README.md                    # 项目说明
```

## 快速开始

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

前端服务将运行在 `http://localhost:3000`

### 后端启动

```bash
cd backend
npm install
npm run server
```

后端服务将运行在 `http://localhost:3002`

## 功能特性

- 智能对话：基于智谱GLM-4.5的自然语言对话
- 语音合成：支持讯飞TTS和Edge TTS多种语音合成方式
- 实时通信：WebSocket支持实时消息推送
- 响应式设计：适配各种设备屏幕

## API接口

### 聊天接口
- POST `/api/v1/chat` - 发送消息并获取AI回复

### 语音合成接口
- POST `/api/v1/tts` - 文本转语音

## 开发说明

### 环境要求
- Node.js >= 16
- npm >= 8
- Python >= 3.8 (用于Edge TTS)

### 配置说明
后端服务需要配置以下环境变量或直接在代码中修改：
- 智谱AI API Key
- 讯飞TTS API Key和Secret

## 许可证

MIT License
