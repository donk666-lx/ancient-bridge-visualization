/**
 * 古桥小助手 - 网页嵌入组件
 * 使用Shadow DOM实现完全隔离，避免与宿主页面冲突
 * 
 * 使用方法:
 * 1. 引入脚本: <script src="https://your-domain.com/widget/BridgeAssistant.js"></script>
 * 2. 初始化: BridgeAssistant.init({ position: 'bottom-right', apiUrl: 'http://localhost:3002' })
 */

(function (global) {
  'use strict';

  // 默认配置
  const defaultConfig = {
    position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
    apiUrl: 'http://localhost:3002',
    voice: 'xiaoxiao',
    voiceEnabled: true,
    theme: 'default', // default, dark
    width: 320,
    height: 400,
    autoOpen: false,
    welcomeMessage: '你好！我是古桥小助手，可以为你介绍中国古代桥梁的历史文化。'
  };

  // 组件样式 - 完全隔离在Shadow DOM中
  const styles = `
    :host {
      --ba-primary: #10A37F;
      --ba-primary-hover: #0E8C6F;
      --ba-bg: #ffffff;
      --ba-bg-secondary: #f7f7f8;
      --ba-text: #333333;
      --ba-text-secondary: #666666;
      --ba-border: #e5e5e5;
      --ba-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      --ba-radius: 16px;
      --ba-transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      
      display: block;
      position: fixed;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    :host(.dark) {
      --ba-bg: #1a1a1a;
      --ba-bg-secondary: #2d2d2d;
      --ba-text: #ffffff;
      --ba-text-secondary: #b0b0b0;
      --ba-border: #404040;
    }

    /* 位置样式 */
    :host([position="bottom-right"]) { bottom: 20px; right: 20px; }
    :host([position="bottom-left"]) { bottom: 20px; left: 20px; }
    :host([position="top-right"]) { top: 20px; right: 20px; }
    :host([position="top-left"]) { top: 20px; left: 20px; }

    /* 主容器 */
    .ba-container {
      position: relative;
      width: var(--ba-width, 320px);
    }

    /* 聊天窗口 */
    .ba-chat-window {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 100%;
      height: var(--ba-height, 400px);
      background: var(--ba-bg);
      border-radius: var(--ba-radius);
      box-shadow: var(--ba-shadow);
      border: 1px solid var(--ba-border);
      overflow: hidden;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      pointer-events: none;
      transition: var(--ba-transition);
    }

    :host([position="bottom-left"]) .ba-chat-window,
    :host([position="top-left"]) .ba-chat-window {
      right: auto;
      left: 0;
    }

    :host([position="top-right"]) .ba-chat-window,
    :host([position="top-left"]) .ba-chat-window {
      bottom: auto;
      top: 80px;
    }

    .ba-chat-window.open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    /* 头部 */
    .ba-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      background: var(--ba-primary);
      color: white;
    }

    .ba-title {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
    }

    .ba-close-btn {
      width: 28px;
      height: 28px;
      border: none;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      transition: var(--ba-transition);
    }

    .ba-close-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    /* 消息区域 */
    .ba-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      height: calc(100% - 140px);
      background: var(--ba-bg-secondary);
    }

    .ba-message {
      display: flex;
      margin-bottom: 12px;
      animation: ba-fadeIn 0.3s ease;
    }

    @keyframes ba-fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .ba-message.user {
      justify-content: flex-end;
    }

    .ba-message-content {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.5;
      word-wrap: break-word;
    }

    .ba-message.assistant .ba-message-content {
      background: var(--ba-bg);
      color: var(--ba-text);
      border: 1px solid var(--ba-border);
      border-bottom-left-radius: 4px;
    }

    .ba-message.user .ba-message-content {
      background: var(--ba-primary);
      color: white;
      border-bottom-right-radius: 4px;
    }

    /* 输入区域 */
    .ba-input-area {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 12px 16px;
      background: var(--ba-bg);
      border-top: 1px solid var(--ba-border);
      display: flex;
      gap: 8px;
    }

    .ba-input {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid var(--ba-border);
      border-radius: 20px;
      background: var(--ba-bg-secondary);
      color: var(--ba-text);
      font-size: 14px;
      outline: none;
      transition: var(--ba-transition);
    }

    .ba-input:focus {
      border-color: var(--ba-primary);
    }

    .ba-input::placeholder {
      color: var(--ba-text-secondary);
    }

    .ba-send-btn {
      width: 40px;
      height: 40px;
      border: none;
      background: var(--ba-primary);
      color: white;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: var(--ba-transition);
      flex-shrink: 0;
    }

    .ba-send-btn:hover {
      background: var(--ba-primary-hover);
      transform: scale(1.05);
    }

    .ba-send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* 悬浮按钮 */
    .ba-toggle-btn {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 60px;
      height: 60px;
      border: none;
      background: var(--ba-primary);
      color: white;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      box-shadow: 0 4px 12px rgba(16, 163, 127, 0.4);
      transition: var(--ba-transition);
      z-index: 1;
    }

    :host([position="bottom-left"]) .ba-toggle-btn,
    :host([position="top-left"]) .ba-toggle-btn {
      right: auto;
      left: 0;
    }

    :host([position="top-right"]) .ba-toggle-btn,
    :host([position="top-left"]) .ba-toggle-btn {
      bottom: auto;
      top: 0;
    }

    .ba-toggle-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(16, 163, 127, 0.5);
    }

    .ba-toggle-btn.hidden {
      opacity: 0;
      pointer-events: none;
      transform: scale(0.8);
    }

    /* 角色头像 */
    .ba-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      margin-right: 8px;
      flex-shrink: 0;
    }

    .ba-message.user .ba-avatar {
      display: none;
    }

    /* 加载动画 */
    .ba-typing {
      display: flex;
      gap: 4px;
      padding: 12px 14px;
      background: var(--ba-bg);
      border-radius: 12px;
      border: 1px solid var(--ba-border);
      width: fit-content;
    }

    .ba-typing-dot {
      width: 8px;
      height: 8px;
      background: var(--ba-text-secondary);
      border-radius: 50%;
      animation: ba-typing 1.4s infinite ease-in-out both;
    }

    .ba-typing-dot:nth-child(1) { animation-delay: -0.32s; }
    .ba-typing-dot:nth-child(2) { animation-delay: -0.16s; }

    @keyframes ba-typing {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }

    /* 语音按钮 */
    .ba-voice-btn {
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      color: var(--ba-text-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      border-radius: 50%;
      transition: var(--ba-transition);
    }

    .ba-voice-btn:hover {
      background: var(--ba-bg-secondary);
      color: var(--ba-primary);
    }

    .ba-voice-btn.active {
      color: var(--ba-primary);
    }

    /* 滚动条样式 */
    .ba-messages::-webkit-scrollbar {
      width: 6px;
    }

    .ba-messages::-webkit-scrollbar-track {
      background: transparent;
    }

    .ba-messages::-webkit-scrollbar-thumb {
      background: var(--ba-border);
      border-radius: 3px;
    }

    .ba-messages::-webkit-scrollbar-thumb:hover {
      background: var(--ba-text-secondary);
    }

    /* 响应式 */
    @media (max-width: 480px) {
      .ba-container {
        width: calc(100vw - 40px) !important;
      }
      
      .ba-chat-window {
        height: 60vh;
      }
    }
  `;

  // HTML模板
  const template = document.createElement('template');
  template.innerHTML = `
    <style>${styles}</style>
    <div class="ba-container">
      <div class="ba-chat-window" id="chatWindow">
        <div class="ba-header">
          <h3 class="ba-title">🏛️ 古桥小助手</h3>
          <button class="ba-close-btn" id="closeBtn">×</button>
        </div>
        <div class="ba-messages" id="messages"></div>
        <div class="ba-input-area">
          <input type="text" class="ba-input" id="input" placeholder="输入问题..." maxlength="200">
          <button class="ba-voice-btn" id="voiceBtn" title="开启/关闭语音">🔊</button>
          <button class="ba-send-btn" id="sendBtn">↑</button>
        </div>
      </div>
      <button class="ba-toggle-btn" id="toggleBtn">🏛️</button>
    </div>
  `;

  class BridgeAssistant extends HTMLElement {
    constructor() {
      super();
      this.config = { ...defaultConfig };
      this.messages = [];
      this.isOpen = false;
      this.isTyping = false;
      this.voiceEnabled = true;
      this.currentAudio = null;
      
      // 创建Shadow DOM
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      
      // 获取元素引用
      this.chatWindow = this.shadowRoot.getElementById('chatWindow');
      this.toggleBtn = this.shadowRoot.getElementById('toggleBtn');
      this.closeBtn = this.shadowRoot.getElementById('closeBtn');
      this.messagesContainer = this.shadowRoot.getElementById('messages');
      this.input = this.shadowRoot.getElementById('input');
      this.sendBtn = this.shadowRoot.getElementById('sendBtn');
      this.voiceBtn = this.shadowRoot.getElementById('voiceBtn');
    }

    connectedCallback() {
      this.setupEventListeners();
      this.applyConfig();
      
      // 添加欢迎消息
      if (this.config.welcomeMessage) {
        this.addMessage('assistant', this.config.welcomeMessage);
      }
      
      // 自动打开
      if (this.config.autoOpen) {
        this.open();
      }
    }

    disconnectedCallback() {
      this.cleanup();
    }

    setupEventListeners() {
      // 打开/关闭
      this.toggleBtn.addEventListener('click', () => this.toggle());
      this.closeBtn.addEventListener('click', () => this.close());
      
      // 发送消息
      this.sendBtn.addEventListener('click', () => this.sendMessage());
      this.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.sendMessage();
      });
      
      // 语音开关
      this.voiceBtn.addEventListener('click', () => this.toggleVoice());
    }

    applyConfig() {
      // 应用位置
      this.setAttribute('position', this.config.position);
      
      // 应用主题
      if (this.config.theme === 'dark') {
        this.classList.add('dark');
      }
      
      // 应用尺寸
      this.style.setProperty('--ba-width', this.config.width + 'px');
      this.style.setProperty('--ba-height', this.config.height + 'px');
      
      // 语音设置
      this.voiceEnabled = this.config.voiceEnabled;
      this.updateVoiceButton();
    }

    toggle() {
      this.isOpen ? this.close() : this.open();
    }

    open() {
      this.isOpen = true;
      this.chatWindow.classList.add('open');
      this.toggleBtn.classList.add('hidden');
      this.input.focus();
      this.scrollToBottom();
    }

    close() {
      this.isOpen = false;
      this.chatWindow.classList.remove('open');
      this.toggleBtn.classList.remove('hidden');
    }

    addMessage(role, content) {
      const message = { role, content, timestamp: Date.now() };
      this.messages.push(message);
      
      const messageEl = document.createElement('div');
      messageEl.className = `ba-message ${role}`;
      messageEl.innerHTML = `
        ${role === 'assistant' ? '<div class="ba-avatar">🏛️</div>' : ''}
        <div class="ba-message-content">${this.escapeHtml(content)}</div>
      `;
      
      this.messagesContainer.appendChild(messageEl);
      this.scrollToBottom();
      
      // 语音朗读
      if (role === 'assistant' && this.voiceEnabled) {
        this.speak(content);
      }
      
      return messageEl;
    }

    showTyping() {
      this.isTyping = true;
      const typingEl = document.createElement('div');
      typingEl.className = 'ba-message assistant';
      typingEl.id = 'typing-indicator';
      typingEl.innerHTML = `
        <div class="ba-avatar">🏛️</div>
        <div class="ba-typing">
          <div class="ba-typing-dot"></div>
          <div class="ba-typing-dot"></div>
          <div class="ba-typing-dot"></div>
        </div>
      `;
      this.messagesContainer.appendChild(typingEl);
      this.scrollToBottom();
    }

    hideTyping() {
      this.isTyping = false;
      const typingEl = this.shadowRoot.getElementById('typing-indicator');
      if (typingEl) {
        typingEl.remove();
      }
    }

    async sendMessage() {
      const content = this.input.value.trim();
      if (!content || this.isTyping) return;
      
      // 添加用户消息
      this.addMessage('user', content);
      this.input.value = '';
      
      // 显示输入中
      this.showTyping();
      this.sendBtn.disabled = true;
      
      try {
        // 调用API
        const response = await fetch(`${this.config.apiUrl}/api/v1/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: content })
        });
        
        const data = await response.json();
        
        this.hideTyping();
        
        if (data.content) {
          this.addMessage('assistant', data.content);
        } else {
          this.addMessage('assistant', '抱歉，我暂时无法回答这个问题。');
        }
      } catch (error) {
        console.error('发送消息失败:', error);
        this.hideTyping();
        this.addMessage('assistant', '网络连接失败，请稍后重试。');
      } finally {
        this.sendBtn.disabled = false;
      }
    }

    async speak(text) {
      if (!this.voiceEnabled) return;
      
      // 停止之前的朗读
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }
      
      try {
        const response = await fetch(`${this.config.apiUrl}/api/v1/tts/edge`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: text,
            voice: this.config.voice
          })
        });
        
        const data = await response.json();
        
        if (data.audio) {
          const audioBlob = new Blob(
            [Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))],
            { type: 'audio/mp3' }
          );
          const audioUrl = URL.createObjectURL(audioBlob);
          
          this.currentAudio = new Audio(audioUrl);
          this.currentAudio.onended = () => {
            URL.revokeObjectURL(audioUrl);
          };
          
          await this.currentAudio.play();
        }
      } catch (error) {
        console.error('语音播放失败:', error);
      }
    }

    toggleVoice() {
      this.voiceEnabled = !this.voiceEnabled;
      this.updateVoiceButton();
      
      if (!this.voiceEnabled && this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }
    }

    updateVoiceButton() {
      this.voiceBtn.classList.toggle('active', this.voiceEnabled);
      this.voiceBtn.textContent = this.voiceEnabled ? '🔊' : '🔇';
      this.voiceBtn.title = this.voiceEnabled ? '点击关闭语音' : '点击开启语音';
    }

    scrollToBottom() {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    cleanup() {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }
    }
  }

  // 注册自定义元素
  customElements.define('bridge-assistant', BridgeAssistant);

  // 全局API
  const BridgeAssistantAPI = {
    instance: null,
    
    init(config = {}) {
      // 移除已存在的实例
      if (this.instance) {
        this.instance.remove();
      }
      
      // 创建新实例
      const el = document.createElement('bridge-assistant');
      el.config = { ...defaultConfig, ...config };
      document.body.appendChild(el);
      this.instance = el;
      
      console.log('🏛️ 古桥小助手已初始化');
      return el;
    },
    
    open() {
      this.instance?.open();
    },
    
    close() {
      this.instance?.close();
    },
    
    toggle() {
      this.instance?.toggle();
    },
    
    destroy() {
      if (this.instance) {
        this.instance.remove();
        this.instance = null;
      }
    },
    
    // 发送消息（程序化调用）
    async send(message) {
      if (this.instance) {
        this.instance.addMessage('user', message);
        // 触发回复...
      }
    }
  };

  // 导出到全局
  global.BridgeAssistant = BridgeAssistantAPI;

  // 支持模块导出
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = BridgeAssistantAPI;
  }

})(typeof window !== 'undefined' ? window : this);
