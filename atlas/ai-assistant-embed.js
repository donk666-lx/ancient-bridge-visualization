(function () {
  // ===== 注入 CSS =====
  const style = document.createElement('style');
  style.textContent = `
    /* ===== AI 小助手内联样式 ===== */
    .ai-pet-wrapper {
        width: 67px;
        height: 67px;
        position: fixed;
        left: 20px;
        top: 80px;
        cursor: grab;
        will-change: transform;
        touch-action: none;
        -webkit-user-select: none;
        user-select: none;
        z-index: 9000;
    }
    .ai-pet-wrapper:hover { transform: scale(1.05); }
    .ai-pet-wrapper.ai-dragging { cursor: grabbing; }
    .ai-toolbar.ai-drag-hide,
    .ai-input-bar.ai-drag-hide { opacity: 0 !important; pointer-events: none !important; }

    .ai-inner-fluid {
        position: absolute;
        top: 3px; left: 3px; right: 3px; bottom: 3px;
        border-radius: 50%;
        overflow: hidden;
        z-index: 1;
        background: linear-gradient(135deg, #ffb3b3, #fed6e3);
        transition: filter 0.4s ease;
    }
    .ai-fluid-blob {
        position: absolute;
        width: 130%; height: 130%; top: -15%; left: -15%;
        background:
            radial-gradient(circle at 30% 30%, rgba(235,87,87,0.85), transparent 40%),
            radial-gradient(circle at 70% 65%, rgba(255,154,108,0.8), transparent 40%);
        animation: ai-fluid-spin 8s linear infinite;
    }
    .ai-fluid-blob-2 {
        position: absolute;
        width: 110%; height: 110%; top: -5%; left: -5%;
        background:
            radial-gradient(circle at 60% 30%, rgba(255,200,150,0.4), transparent 35%),
            radial-gradient(circle at 35% 70%, rgba(220,60,60,0.3), transparent 35%);
        animation: ai-fluid-spin-r 12s linear infinite;
    }
    .ai-glass-shell {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        border-radius: 50%; z-index: 2;
        background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.12), rgba(255,255,255,0.03));
        box-shadow:
            inset -2px -2px 8px rgba(255,255,255,0.08),
            inset 2px 2px 8px rgba(255,255,255,0.35),
            0px 2px 6px rgba(220,80,80,0.08);
        border: 1px solid rgba(255,255,255,0.25);
        transition: box-shadow 1.0s cubic-bezier(0.4, 0.0, 0.2, 1), border 1.0s cubic-bezier(0.4, 0.0, 0.2, 1);
    }
    .ai-glass-shell::before {
        content: '';
        position: absolute; top: 12%; left: 18%; width: 28%; height: 14%;
        border-radius: 50%;
        background: rgba(255,255,255,0.55);
        filter: blur(1px);
        transform: rotate(-40deg);
        transition: opacity 1.0s cubic-bezier(0.4, 0.0, 0.2, 1);
    }
    .ai-glass-shell::after {
        content: '';
        position: absolute; bottom: 22%; right: 20%; width: 16%; height: 10%;
        border-radius: 50%;
        background: rgba(255,255,255,0.2);
        filter: blur(1px);
        transform: rotate(25deg);
        transition: opacity 1.0s cubic-bezier(0.4, 0.0, 0.2, 1);
    }
    .ai-eyes-container {
        position: absolute; z-index: 3;
        top: 16%; left: 10%; width: 80%; height: 50%;
        display: flex; justify-content: center; align-items: center;
        gap: 12px;
        pointer-events: none;
        overflow: visible;
    }
    .ai-eye {
        width: 11px; height: 19px;
        background: white;
        border-radius: 6px;
        box-shadow: 0 0 8px rgba(255,255,255,0.9), 0 0 16px rgba(255,255,255,0.4);
        transition: width 0.18s, height 0.18s, border-radius 0.18s, transform 0.18s cubic-bezier(0.25, 1, 0.5, 1);
        transform-origin: center center;
    }
    .ai-blush {
        position: absolute; z-index: 3;
        width: 14px; height: 8px; border-radius: 50%;
        background: rgba(255,130,130,0.25); filter: blur(3px);
        pointer-events: none;
        transition: background 2.0s cubic-bezier(0.33, 0.0, 0.2, 1), opacity 0.6s ease;
        opacity: 0.8;
    }
    .ai-blush-l { top: 58%; left: 8%; }
    .ai-blush-r { top: 58%; right: 8%; }
    .ai-bub {
        position: absolute; border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), rgba(255,255,255,0.06));
        border: 1px solid rgba(255,255,255,0.12);
        z-index: 0; opacity: 0; pointer-events: none;
    }
    .ai-bub-1 { width: 5px; height: 5px; left: -5px; top: 60%; animation: ai-bub 5s ease-in infinite 0s; }
    .ai-bub-2 { width: 3px; height: 3px; right: -4px; top: 40%; animation: ai-bub 6.5s ease-in infinite 2s; }
    .ai-particles {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        pointer-events: none; z-index: 10;
    }

    /* 工具栏 */
    .ai-toolbar {
        position: fixed;
        top: 155px;
        left: 20px;
        display: flex;
        gap: 12px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease;
        z-index: 9000;
        padding: 8px 12px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .ai-toolbar.ai-visible {
        opacity: 1;
        pointer-events: auto;
    }
    .ai-tool-icon {
        width: 26px; height: 26px;
        border-radius: 50%;
        background: rgba(255,255,255,0.85);
        display: flex; align-items: center; justify-content: center;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .ai-tool-icon svg {
        width: 13px; height: 13px;
        stroke: #666; fill: none;
        stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
    }
    .ai-tool-icon:hover { transform: scale(1.2); box-shadow: 0 3px 12px rgba(0,0,0,0.2); }
    .ai-tool-icon:active { transform: scale(0.9); }
    .ai-tool-icon.active {
        background: rgba(255,255,255,1);
        box-shadow: 0 0 8px rgba(255,255,255,0.5), 0 2px 8px rgba(0,0,0,0.15);
    }

    /* 输入条 */
    .ai-input-bar {
        position: fixed;
        top: 155px;
        left: 20px;
        display: flex;
        gap: 4px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        z-index: 9001;
    }
    .ai-input-bar.show {
        opacity: 1;
        pointer-events: auto;
    }
    .ai-input-bar input {
        width: 160px;
        padding: 4px 10px;
        border: none;
        border-radius: 12px;
        background: rgba(255,255,255,0.85);
        font-size: 11px;
        outline: none;
        box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
    }
    .ai-input-bar button {
        padding: 4px 8px;
        border: none;
        border-radius: 12px;
        background: rgba(255,255,255,0.85);
        font-size: 11px;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    }

    /* 消息气泡 */
    .ai-message-bubble {
        position: fixed;
        top: 20px;
        left: 100px;
        max-width: 200px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        z-index: 9000;
    }
    .ai-message-bubble.show {
        opacity: 1;
        transform: translateY(-10px);
    }
    .ai-message-content {
        background: rgba(255,255,255,0.95);
        padding: 10px 12px;
        border-radius: 16px 16px 16px 4px;
        font-size: 12px;
        line-height: 1.4;
        color: #333;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        word-wrap: break-word;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
        user-select: text;
    }

    /* 返回首页按钮 */
    .ai-back-btn {
        position: fixed;
        top: 20px;
        left: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255,255,255,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        z-index: 9000;
        transition: all 0.2s ease;
    }
    .ai-back-btn:hover { transform: scale(1.1); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
    .ai-back-btn:active { transform: scale(0.95); }

    @keyframes ai-fluid-spin {
        0% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(180deg) scale(1.08); }
        100% { transform: rotate(360deg) scale(1); }
    }
    @keyframes ai-fluid-spin-r {
        0% { transform: rotate(360deg) scale(1.05); }
        50% { transform: rotate(180deg) scale(0.95); }
        100% { transform: rotate(0deg) scale(1.05); }
    }
    @keyframes ai-bub {
        0% { opacity: 0; transform: translateY(0) scale(0.3); }
        15% { opacity: 0.5; }
        100% { opacity: 0; transform: translateY(-30px) translateX(5px) scale(1); }
    }
    @keyframes ai-squish {
        0%   { transform: scale(1, 1); }
        25%  { transform: scale(1.15, 0.85); }
        50%  { transform: scale(0.9, 1.1); }
        75%  { transform: scale(1.05, 0.95); }
        100% { transform: scale(1, 1); }
    }
    .ai-pet-wrapper.squishing {
        animation: ai-squish 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
  `;
  document.head.appendChild(style);

  // ===== 注入 HTML =====
  const host = document.createElement('div');
  host.id = 'ai-pet-host';
  host.innerHTML = `
    <!-- 返回首页按钮 -->
    <div class="ai-back-btn" id="aiBtnBack" title="返回首页"
         onclick="window.location.href='http://localhost:8888/index.html'">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
    </div>

    <!-- 宠物球 -->
    <div class="ai-pet-wrapper" id="aiPet">
      <div class="ai-inner-fluid" id="aiFluid">
        <div class="ai-fluid-blob" id="aiBlob1"></div>
        <div class="ai-fluid-blob-2" id="aiBlob2"></div>
      </div>
      <div class="ai-glass-shell" id="aiGlassShell"></div>
      <div class="ai-eyes-container" id="aiEyes">
        <div class="ai-eye" id="aiEyeL"></div>
        <div class="ai-eye" id="aiEyeR"></div>
      </div>
      <div class="ai-blush ai-blush-l" id="aiBlushL"></div>
      <div class="ai-blush ai-blush-r" id="aiBlushR"></div>
      <div class="ai-bub ai-bub-1"></div>
      <div class="ai-bub ai-bub-2"></div>
      <div class="ai-particles" id="aiParticles"></div>
    </div>

    <!-- 工具栏 -->
    <div class="ai-toolbar" id="aiToolbar">
      <div class="ai-tool-icon" id="aiBtnChat" title="发消息">
        <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </div>
      <div class="ai-tool-icon" id="aiBtnVoice" title="语音">
        <svg viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
      </div>
      <div class="ai-tool-icon" id="aiBtnScreenshot" title="截图">
        <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="3"/></svg>
      </div>
    </div>

    <!-- 消息气泡 -->
    <div class="ai-message-bubble" id="aiMessageBubble">
      <div class="ai-message-content" id="aiMessageContent"></div>
    </div>

    <!-- 输入条 -->
    <div class="ai-input-bar" id="aiInputBar">
      <input type="text" id="aiInput" placeholder="说点什么...">
      <button id="aiBtnSend">↑</button>
    </div>
  `;
  document.body.appendChild(host);

  // ===== JS 逻辑 =====
  const API_CONFIG = {
    baseURL: 'http://localhost:3005',
    endpoints: { tts: '/api/v1/tts/edge', chat: '/api/v1/chat' }
  };
  function getApiUrl(endpoint) {
    return API_CONFIG.baseURL + API_CONFIG.endpoints[endpoint];
  }

  const pet        = document.getElementById('aiPet');
  const eyeL       = document.getElementById('aiEyeL');
  const eyeR       = document.getElementById('aiEyeR');
  const fluid      = document.getElementById('aiFluid');
  const blob1      = document.getElementById('aiBlob1');
  const blob2      = document.getElementById('aiBlob2');
  const blushL     = document.getElementById('aiBlushL');
  const blushR     = document.getElementById('aiBlushR');
  const glassShell = document.getElementById('aiGlassShell');
  const toolbar    = document.getElementById('aiToolbar');
  const inputBar   = document.getElementById('aiInputBar');
  const inputEl    = document.getElementById('aiInput');
  const btnVoice   = document.getElementById('aiBtnVoice');
  const messageBubble   = document.getElementById('aiMessageBubble');
  const messageContent  = document.getElementById('aiMessageContent');
  const btnChat         = document.getElementById('aiBtnChat');
  const btnScreenshot   = document.getElementById('aiBtnScreenshot');
  const btnSend         = document.getElementById('aiBtnSend');

  let voiceOn = true;
  let userInteracted = false;
  let _moodTimer = null;

  // ===== 工具栏悬停显示（JS 控制，无需 container）=====
  let _toolbarHideTimer;
  pet.addEventListener('mouseenter', () => {
    clearTimeout(_toolbarHideTimer);
    toolbar.classList.add('ai-visible');
  });
  pet.addEventListener('mouseleave', () => {
    _toolbarHideTimer = setTimeout(() => {
      if (!toolbar.matches(':hover')) toolbar.classList.remove('ai-visible');
    }, 150);
  });
  toolbar.addEventListener('mouseenter', () => clearTimeout(_toolbarHideTimer));
  toolbar.addEventListener('mouseleave', () => {
    if (!pet.matches(':hover')) {
      _toolbarHideTimer = setTimeout(() => toolbar.classList.remove('ai-visible'), 150);
    }
  });

  // ===== 拖拽功能 =====
  let petLeft = 150;
  let petTop  = 130;
  let _dragOffsetX = 0, _dragOffsetY = 0;
  let _dragging = false, _dragMoved = false;
  const PET_SIZE = 67;

  function _dragStart(e) {
    e.preventDefault();
    _dragging = true;
    _dragMoved = false;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    _dragOffsetX = clientX - petLeft;
    _dragOffsetY = clientY - petTop;
    pet.classList.add('ai-dragging');
    toolbar.classList.add('ai-drag-hide');
    inputBar.classList.add('ai-drag-hide');
    document.addEventListener('mousemove', _dragMove);
    document.addEventListener('mouseup',   _dragEnd);
    document.addEventListener('touchmove', _dragMove, { passive: false });
    document.addEventListener('touchend',  _dragEnd);
  }

  function _dragMove(e) {
    if (!_dragging) return;
    e.preventDefault();
    _dragMoved = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    petLeft = Math.max(0, Math.min(window.innerWidth  - PET_SIZE, clientX - _dragOffsetX));
    petTop  = Math.max(0, Math.min(window.innerHeight - PET_SIZE, clientY - _dragOffsetY));
    lastInteraction = Date.now();
  }

  function _dragEnd() {
    _dragging = false;
    pet.classList.remove('ai-dragging');
    toolbar.classList.remove('ai-drag-hide');
    inputBar.classList.remove('ai-drag-hide');
    document.removeEventListener('mousemove', _dragMove);
    document.removeEventListener('mouseup',   _dragEnd);
    document.removeEventListener('touchmove', _dragMove);
    document.removeEventListener('touchend',  _dragEnd);
    // 只有没有移动的情况下才触发点击动画
    if (!_dragMoved) {
      pet.classList.add('squishing');
      setTimeout(() => pet.classList.remove('squishing'), 350);
    }
  }

  pet.addEventListener('mousedown', _dragStart);
  pet.addEventListener('touchstart', _dragStart, { passive: false });

  // ===== 动画循环 =====
  let t = 0, squishing = false, targetScale = 1, curScale = 1, breathExtra = 0;
  let deepBreathPhase = 0;
  let fidgetSeed = Math.random() * 100;
  let lastInteraction = Date.now();

  function loop() {
    t += 0.016;
    curScale += (targetScale - curScale) * 0.08;

    const floatY = Math.sin(t * 1.3) * 3.5 + Math.sin(t * 0.67) * 2 + Math.sin(t * 2.3) * 0.6;
    const floatR = Math.sin(t * 0.9) * 0.3 + Math.sin(t * 0.37) * 0.2;

    let breathScale = 1 + Math.sin(t * 2) * 0.01 + Math.sin(t * 0.8) * 0.005;
    if (deepBreathPhase > 0) {
      breathScale += Math.sin(deepBreathPhase) * 0.025;
      deepBreathPhase += 0.04;
      if (deepBreathPhase > Math.PI) deepBreathPhase = 0;
    }

    const fidgetX = Math.sin(t * 0.23 + fidgetSeed) * 0.6;
    const fidgetR = Math.sin(t * 0.17 + fidgetSeed * 2) * 0.12;
    const bounce  = breathExtra > 0 ? Math.sin(t * 12) * breathExtra : 0;

    // 更新宠物位置（CSS left/top 驱动位置，transform 只做微动画）
    pet.style.left = petLeft + 'px';
    pet.style.top  = petTop  + 'px';

    if (!squishing) {
      pet.style.transform = `translateX(${fidgetX}px) translateY(${floatY + bounce}px) rotate(${floatR + fidgetR}deg) scale(${curScale * breathScale})`;
    }

    // 工具栏、输入条居中在宠物球下方，防止越出屏幕边界
    const petCenterX  = petLeft + 33;
    const tbW = toolbar.offsetWidth   || 126;
    const ibW = inputBar.offsetWidth  || 191;
    const tbLeft = Math.max(0, Math.min(window.innerWidth - tbW, petCenterX - tbW / 2));
    const ibLeft = Math.max(0, Math.min(window.innerWidth - ibW, petCenterX - ibW / 2));
    toolbar.style.left       = tbLeft + 'px';
    toolbar.style.top        = (petTop + 75) + 'px';
    inputBar.style.left      = ibLeft + 'px';
    inputBar.style.top       = (petTop + 115) + 'px';
    // 消息气泡显示在宠物右侧，越界时翻到左侧
    const mbW = 210;
    const mbLeft = (petLeft + 80 + mbW < window.innerWidth)
      ? petLeft + 80
      : petLeft - mbW - 5;
    messageBubble.style.left = mbLeft + 'px';
    messageBubble.style.top  = (petTop - 10) + 'px';

    requestAnimationFrame(loop);
  }
  loop();

  // 深呼吸触发
  setInterval(() => {
    if (currentMood === 'talking' || currentMood === 'thinking') return;
    if (deepBreathPhase === 0 && Math.random() < 0.5) deepBreathPhase = 0.01;
  }, 20000 + Math.random() * 20000);

  document.addEventListener('click', enableAudio);

  // ===== 眼睛 =====
  let mouseOffset = { x: 0, y: 0 };
  const EYE_SPEED = {
    snap: '0s', fast: '0.08s', normal: '0.18s',
    smooth: '0.3s', slow: '0.45s', drift: '0.6s'
  };
  function _setEyeTransition(speed) {
    const dur  = EYE_SPEED[speed] || speed || EYE_SPEED.normal;
    const ease = (speed === 'snap' || speed === 'fast') ? 'linear'
      : (speed === 'slow' || speed === 'drift') ? 'cubic-bezier(0.4, 0, 0.2, 1)'
      : 'cubic-bezier(0.25, 1, 0.5, 1)';
    const tr = `width ${dur} ${ease}, height ${dur} ${ease}, border-radius ${dur} ${ease}, transform ${dur} ${ease}`;
    eyeL.style.transition = tr;
    eyeR.style.transition = tr;
  }
  function setEyes(L, R, speed) {
    if (speed) _setEyeTransition(speed);
    const d = { w:11, h:19, br:'6px', tx:0, ty:0, sx:1, sy:1, rot:0 };
    const l = { ...d, ...L };
    const r = R ? { ...d, ...R } : { ...l };
    eyeL.style.width = l.w+'px'; eyeL.style.height = l.h+'px'; eyeL.style.borderRadius = l.br;
    eyeL.style.transform = `translate(${l.tx + mouseOffset.x}px,${l.ty + mouseOffset.y}px) scale(${l.sx},${l.sy}) rotate(${l.rot}deg)`;
    eyeR.style.width = r.w+'px'; eyeR.style.height = r.h+'px'; eyeR.style.borderRadius = r.br;
    eyeR.style.transform = `translate(${r.tx + mouseOffset.x}px,${r.ty + mouseOffset.y}px) scale(${r.sx},${r.sy}) rotate(${r.rot}deg)`;
    if (speed) setTimeout(() => _setEyeTransition('normal'), 20);
  }
  const EXPR = {
    normal:    () => setEyes({ w:11, h:19, br:'6px' }),
    lookLeft:  () => setEyes({ w:11, h:19, br:'6px', tx:-4 }),
    lookRight: () => setEyes({ w:11, h:19, br:'6px', tx:4 }),
    lookUp:    () => setEyes({ w:11, h:19, br:'6px', ty:-5 }),
    lookDown:  () => setEyes({ w:11, h:15, br:'6px', ty:4 }),
    squint:    () => setEyes({ w:12, h:6, br:'4px', ty:1 }),
    talking:   () => setEyes({ w:10, h:17, br:'5px' }),
    talkBig:   () => setEyes({ w:12, h:20, br:'6px' }),
    blink:     () => setEyes({ w:12, h:3, br:'3px' }, null, 'snap'),
    halfBlink: () => setEyes({ w:11, h:10, br:'5px' }, null, 'fast'),
    surprised: () => setEyes({ w:13, h:21, br:'7px' }, null, 'fast'),
    wow:       () => setEyes({ w:16, h:16, br:'8px' }, null, 'fast'),
    sparkle:   () => setEyes({ w:12, h:12, br:'3px', rot:45 }, null, 'fast'),
    wink:      () => setEyes({ w:13, h:7, br:'7px 7px 3px 3px', ty:1 }, { w:11, h:19, br:'6px' }, 'fast'),
    winkR:     () => setEyes({ w:11, h:19, br:'6px' }, { w:13, h:7, br:'7px 7px 3px 3px', ty:1 }, 'fast'),
    dizzy:     () => setEyes({ w:10, h:10, br:'5px', rot:25, tx:-2 }, { w:10, h:10, br:'5px', rot:-25, tx:2 }, 'fast'),
    cross:     () => setEyes({ w:10, h:3, br:'2px', rot:30 }, { w:10, h:3, br:'2px', rot:-30 }, 'fast'),
    flattered: () => setEyes({ w:14, h:20, br:'7px', sy:1.05 }, null, 'fast'),
    nervous:   () => setEyes({ w:9, h:14, br:'5px', ty:1, sx:0.9 }, null, 'fast'),
    happy:      () => setEyes({ w:13, h:7, br:'7px 7px 3px 3px', ty:1 }, null, 'smooth'),
    superHappy: () => setEyes({ w:15, h:5, br:'8px 8px 3px 3px', ty:1, sx:1.1 }, null, 'smooth'),
    giggle:     () => setEyes({ w:13, h:7, br:'7px 7px 3px 3px', ty:1, rot:-8 }, { w:13, h:7, br:'7px 7px 3px 3px', ty:1, rot:8 }, 'smooth'),
    curious:    () => setEyes({ w:9, h:16, br:'5px', ty:-1 }, { w:13, h:21, br:'7px', ty:-1 }, 'smooth'),
    thinking:   () => setEyes({ w:10, h:17, br:'5px', ty:-3 }, null, 'smooth'),
    hmm:        () => setEyes({ w:11, h:16, br:'5px', ty:-1, rot:8 }, { w:9, h:13, br:'5px', ty:0, rot:-8 }, 'smooth'),
    sad:        () => setEyes({ w:10, h:16, br:'5px', ty:3, sy:0.9 }, null, 'smooth'),
    angry:      () => setEyes({ w:12, h:14, br:'3px 6px 6px 3px', ty:-2, rot:-12 }, { w:12, h:14, br:'6px 3px 3px 6px', ty:-2, rot:12 }, 'smooth'),
    love:       () => setEyes({ w:14, h:13, br:'7px 1px 7px 1px', rot:45, sx:1.1 }, null, 'smooth'),
    smug:       () => setEyes({ w:11, h:7, br:'6px 6px 3px 3px', ty:1 }, { w:9, h:15, br:'5px', tx:3 }, 'smooth'),
    confused:   () => setEyes({ w:11, h:19, br:'6px', ty:-2 }, { w:9, h:12, br:'5px', ty:2, rot:15 }, 'smooth'),
    softSmile:  () => setEyes({ w:12, h:9, br:'6px 6px 3px 3px', ty:1 }, null, 'smooth'),
    focus:      () => setEyes({ w:9, h:18, br:'4px', ty:-1 }, null, 'smooth'),
    pout:       () => setEyes({ w:10, h:11, br:'5px', ty:2, sy:0.85 }, null, 'smooth'),
    peekL:      () => setEyes({ w:11, h:6, br:'4px', ty:1 }, { w:10, h:17, br:'5px', tx:-3 }, 'smooth'),
    peekR:      () => setEyes({ w:10, h:17, br:'5px', tx:3 }, { w:11, h:6, br:'4px', ty:1 }, 'smooth'),
    mischief:   () => setEyes({ w:13, h:14, br:'7px', rot:-5, ty:-1 }, { w:9, h:10, br:'5px', rot:10, ty:1 }, 'smooth'),
    worried:    () => setEyes({ w:11, h:16, br:'5px', ty:1, rot:5 }, { w:11, h:16, br:'5px', ty:1, rot:-5 }, 'smooth'),
    sly:        () => setEyes({ w:10, h:14, br:'5px', tx:3, rot:-6 }, { w:12, h:8, br:'6px 6px 3px 3px', tx:3, ty:1 }, 'smooth'),
    sleepy:     () => setEyes({ w:12, h:4, br:'4px', ty:2 }, null, 'slow'),
    drowsy:     () => setEyes({ w:11, h:10, br:'5px', ty:1 }, null, 'slow'),
    dead:       () => setEyes({ w:10, h:3, br:'2px', ty:3 }, null, 'slow'),
    content:    () => setEyes({ w:13, h:8, br:'7px 7px 4px 4px', ty:0, sx:1.05 }, null, 'slow'),
    bliss:      () => setEyes({ w:14, h:5, br:'7px 7px 2px 2px', ty:1, sx:1.1 }, null, 'slow'),
    daydream:   () => setEyes({ w:13, h:20, br:'7px', ty:-3, sx:0.95 }, null, 'drift'),
    blank:      () => setEyes({ w:8, h:15, br:'4px' }, null, 'drift'),
  };

  // 鼠标跟随
  let mouseTracking = true;
  document.addEventListener('mousemove', (e) => {
    if (!mouseTracking) return;
    const rect = pet.getBoundingClientRect();
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    mouseOffset.x = Math.max(-2, Math.min(2, (e.clientX - cx) / window.innerWidth * 6));
    mouseOffset.y = Math.max(-2, Math.min(2, (e.clientY - cy) / window.innerHeight * 6));
    if (EXPR[currentExpr]) EXPR[currentExpr]();
  });

  // ===== 音频 =====
  let currentAudio = null;
  function enableAudio() {
    if (!userInteracted) {
      userInteracted = true;
      const s = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQQAAAAAAA==');
      s.play().catch(() => {});
    }
  }

  async function speakMessage(text) {
    const cleanText = text
      .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]/gu, '')
      .replace(/[，。？！；：""''（）【】《》「」『』、·~@#$%^&*()_+=\[\]{}|;':",.<>/?！，。：；？]/g, '')
      .trim();
    if (!cleanText || !voiceOn || !userInteracted) return;
    if (currentAudio) { currentAudio.pause(); currentAudio = null; }
    try {
      const response = await fetch(getApiUrl('tts'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, voice: 'xiaoxiao' })
      });
      const data = await response.json();
      if (data.error) { speakWithWebSpeech(text); return; }
      if (data.audio) {
        const blob = new Blob([Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))], { type: 'audio/mp3' });
        const url = URL.createObjectURL(blob);
        currentAudio = new Audio(url);
        currentAudio.onended = () => URL.revokeObjectURL(url);
        currentAudio.play().catch(() => speakWithWebSpeech(text));
      } else { speakWithWebSpeech(text); }
    } catch { speakWithWebSpeech(text); }
  }

  function speakWithWebSpeech(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN'; u.rate = 1.1; u.pitch = 1;
    const v = window.speechSynthesis.getVoices().find(v => v.lang && v.lang.includes('zh'));
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  }

  const API_URL = getApiUrl('chat');
  async function send() {
    const message = inputEl.value.trim();
    if (!message) return;
    userInteracted = true;
    inputEl.value = '';
    inputBar.classList.remove('show');
    lastInteraction = Date.now();
    setMood('thinking');
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await response.json();
      showMessage(data.content);
      lastTone = detectTone(data.content);
      setMood(data.emotion || 'happy');
    } catch {
      showMessage('抱歉，发送消息失败了 😅');
      setMood('sad');
    }
  }

  let messageTimeout = null;
  function showMessage(content, duration = 30000, skipSpeech = false) {
    if (messageTimeout) clearTimeout(messageTimeout);
    messageContent.textContent = content;
    messageBubble.classList.add('show');
    if (voiceOn && userInteracted && !skipSpeech) {
      const noEmoji = content.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}-\u{2454}]|[\u{20D0}-\u{20EF}]/gu, '');
      speakMessage(noEmoji);
    }
    messageTimeout = setTimeout(() => { messageBubble.classList.remove('show'); messageTimeout = null; }, duration);
  }

  function toggleInput() {
    inputBar.classList.toggle('show');
    if (inputBar.classList.contains('show')) inputEl.focus();
  }

  function toggleVoice() {
    voiceOn = !voiceOn;
    btnVoice.classList.toggle('active', voiceOn);
    showMessage(voiceOn ? '语音已开启 🎤' : '语音已关闭 🔇');
    setMood(voiceOn ? 'happy' : 'sad');
    if (!voiceOn && currentAudio) { currentAudio.pause(); currentAudio = null; }
  }

  function screenshot() { alert('截图功能开发中...'); }

  // ===== 情绪 =====
  let currentMood = 'normal';
  let currentExpr = 'normal';
  let talkInterval = null;

  const moodMap = {
    'happy':    { expr:'happy',     blush:'rgba(255,130,130,0.4)', fluid:'linear-gradient(135deg,#ffe0b2,#fff3e0)', blob1:'radial-gradient(circle at 30% 30%,rgba(255,193,7,0.85),transparent 40%),radial-gradient(circle at 70% 65%,rgba(255,152,0,0.8),transparent 40%)', blob2:'radial-gradient(circle at 60% 30%,rgba(255,235,59,0.4),transparent 35%),radial-gradient(circle at 35% 70%,rgba(255,183,77,0.3),transparent 35%)', glow:'0 0 40px rgba(255,193,7,0.3), 0 0 80px rgba(255,152,0,0.15)', scale:1.05, bounce:0.02, speed:'5s' },
    'joy':      { expr:'superHappy',blush:'rgba(255,130,130,0.45)',fluid:'linear-gradient(135deg,#ffe0b2,#fff3e0)', blob1:'radial-gradient(circle at 30% 30%,rgba(255,193,7,0.85),transparent 40%),radial-gradient(circle at 70% 65%,rgba(255,152,0,0.8),transparent 40%)', blob2:'radial-gradient(circle at 60% 30%,rgba(255,235,59,0.4),transparent 35%),radial-gradient(circle at 35% 70%,rgba(255,183,77,0.3),transparent 35%)', glow:'0 0 40px rgba(255,193,7,0.3), 0 0 80px rgba(255,152,0,0.15)', scale:1.08, bounce:0.025,speed:'4s' },
    'sad':      { expr:'sad',       blush:'rgba(100,150,255,0.2)', fluid:'linear-gradient(135deg,#90caf9,#bbdefb)', blob1:'radial-gradient(circle at 30% 30%,rgba(30,136,229,0.85),transparent 40%),radial-gradient(circle at 70% 65%,rgba(66,165,245,0.8),transparent 40%)', blob2:'radial-gradient(circle at 60% 30%,rgba(144,202,249,0.4),transparent 35%),radial-gradient(circle at 35% 70%,rgba(21,101,192,0.3),transparent 35%)', glow:'0 0 40px rgba(66,165,245,0.3), 0 0 80px rgba(30,136,229,0.15)', scale:0.96, bounce:0, speed:'14s' },
    'thinking': { expr:'thinking',  blush:'rgba(180,130,255,0.25)',fluid:'linear-gradient(135deg,#d1c4e9,#ede7f6)', blob1:'radial-gradient(circle at 30% 30%,rgba(103,58,183,0.85),transparent 40%),radial-gradient(circle at 70% 65%,rgba(123,104,238,0.8),transparent 40%)', blob2:'radial-gradient(circle at 60% 30%,rgba(179,157,219,0.4),transparent 35%),radial-gradient(circle at 35% 70%,rgba(94,53,177,0.3),transparent 35%)', glow:'0 0 40px rgba(123,104,238,0.3), 0 0 80px rgba(103,58,183,0.15)', scale:1, bounce:0, speed:'12s' },
    'curious':  { expr:'curious',   blush:'rgba(255,130,130,0.3)', fluid:'linear-gradient(135deg,#ffe0b2,#fff3e0)', blob1:'radial-gradient(circle at 30% 30%,rgba(255,193,7,0.85),transparent 40%),radial-gradient(circle at 70% 65%,rgba(255,152,0,0.8),transparent 40%)', blob2:'radial-gradient(circle at 60% 30%,rgba(255,235,59,0.4),transparent 35%),radial-gradient(circle at 35% 70%,rgba(255,183,77,0.3),transparent 35%)', glow:'0 0 40px rgba(255,193,7,0.3), 0 0 80px rgba(255,152,0,0.15)', scale:1.02,bounce:0, speed:'6s' },
    'surprised':{ expr:'surprised', blush:'rgba(255,200,100,0.35)',fluid:'linear-gradient(135deg,#fff9c4,#fff3e0)', blob1:'radial-gradient(circle at 30% 30%,rgba(255,215,0,0.85),transparent 40%),radial-gradient(circle at 70% 65%,rgba(255,165,0,0.8),transparent 40%)', blob2:'radial-gradient(circle at 60% 30%,rgba(255,235,59,0.4),transparent 35%),radial-gradient(circle at 35% 70%,rgba(255,87,34,0.3),transparent 35%)', glow:'0 0 50px rgba(255,215,0,0.35), 0 0 100px rgba(255,165,0,0.15)', scale:1.06,bounce:0, speed:'6s' },
    'angry':    { expr:'angry',     blush:'rgba(255,80,80,0.3)',   fluid:'linear-gradient(135deg,#ef5350,#e53935)', blob1:'radial-gradient(circle at 30% 30%,rgba(211,47,47,0.9),transparent 40%),radial-gradient(circle at 70% 65%,rgba(244,67,54,0.85),transparent 40%)', blob2:'radial-gradient(circle at 50% 50%,rgba(255,82,82,0.45),transparent 35%),radial-gradient(circle at 35% 70%,rgba(183,28,28,0.35),transparent 35%)', glow:'0 0 50px rgba(244,67,54,0.4), 0 0 100px rgba(211,47,47,0.2)', scale:1.04,bounce:0.01,speed:'3s' },
    'love':     { expr:'love',      blush:'rgba(255,150,150,0.5)', fluid:'linear-gradient(135deg,#ff8a80,#ffcdd2)', blob1:'radial-gradient(circle at 30% 30%,rgba(229,57,53,0.85),transparent 40%),radial-gradient(circle at 70% 65%,rgba(255,82,82,0.8),transparent 40%)', blob2:'radial-gradient(circle at 50% 50%,rgba(255,138,128,0.45),transparent 35%),radial-gradient(circle at 35% 70%,rgba(198,40,40,0.3),transparent 35%)', glow:'0 0 45px rgba(229,57,53,0.35), 0 0 90px rgba(255,82,82,0.15)', scale:1.05,bounce:0.015,speed:'6s' },
    'sleepy':   { expr:'sleepy',    blush:'rgba(200,150,180,0.2)', fluid:'linear-gradient(135deg,#e8d5e0,#f0e6ef)', blob1:'radial-gradient(circle at 30% 30%,rgba(186,147,170,0.85),transparent 40%),radial-gradient(circle at 70% 65%,rgba(200,170,190,0.8),transparent 40%)', blob2:'radial-gradient(circle at 60% 30%,rgba(220,200,215,0.4),transparent 35%),radial-gradient(circle at 35% 70%,rgba(170,130,160,0.3),transparent 35%)', glow:'0 0 30px rgba(186,147,170,0.2), 0 0 60px rgba(186,147,170,0.08)', scale:0.97,bounce:0, speed:'16s' },
    'worried':  { expr:'worried',   blush:'rgba(255,130,130,0.2)', fluid:'linear-gradient(135deg,#90caf9,#bbdefb)', blob1:'radial-gradient(circle at 30% 30%,rgba(30,136,229,0.85),transparent 40%),radial-gradient(circle at 70% 65%,rgba(66,165,245,0.8),transparent 40%)', blob2:'radial-gradient(circle at 60% 30%,rgba(144,202,249,0.4),transparent 35%),radial-gradient(circle at 35% 70%,rgba(21,101,192,0.3),transparent 35%)', glow:'0 0 40px rgba(66,165,245,0.3), 0 0 80px rgba(30,136,229,0.15)', scale:0.98,bounce:0, speed:'10s' },
    'excited':  { expr:'superHappy',blush:'rgba(255,100,150,0.4)', fluid:'linear-gradient(135deg,#f48fb1,#f8bbd0)', blob1:'radial-gradient(circle at 30% 30%,rgba(233,30,99,0.9),transparent 40%),radial-gradient(circle at 70% 65%,rgba(255,64,129,0.85),transparent 40%)', blob2:'radial-gradient(circle at 50% 50%,rgba(248,187,208,0.45),transparent 35%),radial-gradient(circle at 35% 70%,rgba(194,24,91,0.35),transparent 35%)', glow:'0 0 55px rgba(233,30,99,0.4), 0 0 110px rgba(255,64,129,0.2)', scale:1.08,bounce:0.025,speed:'3s' },
    'confused': { expr:'confused',  blush:'rgba(255,130,130,0.25)',fluid:'linear-gradient(135deg,#d1c4e9,#ede7f6)', blob1:'radial-gradient(circle at 30% 30%,rgba(103,58,183,0.85),transparent 40%),radial-gradient(circle at 70% 65%,rgba(123,104,238,0.8),transparent 40%)', blob2:'radial-gradient(circle at 60% 30%,rgba(179,157,219,0.4),transparent 35%),radial-gradient(circle at 35% 70%,rgba(94,53,177,0.3),transparent 35%)', glow:'0 0 40px rgba(123,104,238,0.3), 0 0 80px rgba(103,58,183,0.15)', scale:1, bounce:0, speed:'8s' },
    'talking':  { expr:'talking',   blush:'rgba(255,130,180,0.3)', fluid:'linear-gradient(135deg,#f8bbd0,#fce4ec)', blob1:'radial-gradient(circle at 30% 30%,rgba(233,30,99,0.85),transparent 40%),radial-gradient(circle at 70% 65%,rgba(255,105,180,0.8),transparent 40%)', blob2:'radial-gradient(circle at 60% 30%,rgba(255,182,193,0.4),transparent 35%),radial-gradient(circle at 35% 70%,rgba(219,68,85,0.3),transparent 35%)', glow:'0 0 40px rgba(255,105,180,0.3), 0 0 80px rgba(233,30,99,0.15)', scale:1, bounce:0.015,speed:'4s' },
    'normal':   { expr:'normal',    blush:'rgba(255,130,130,0.25)',fluid:'linear-gradient(135deg,#ffb3b3,#fed6e3)', blob1:'radial-gradient(circle at 30% 30%,rgba(235,87,87,0.85),transparent 40%),radial-gradient(circle at 70% 65%,rgba(255,154,108,0.8),transparent 40%)', blob2:'radial-gradient(circle at 60% 30%,rgba(255,200,150,0.4),transparent 35%),radial-gradient(circle at 35% 70%,rgba(220,60,60,0.3),transparent 35%)', glow:'0 0 40px rgba(255,107,74,0.25), 0 0 80px rgba(255,107,74,0.1)', scale:1, bounce:0, speed:'8s' },
  };

  function setMood(mood) {
    currentMood = mood;
    const m = moodMap[mood] || moodMap['normal'];
    currentExpr = m.expr;
    if (_moodTimer) { clearTimeout(_moodTimer); _moodTimer = null; }
    fluid.style.transition = 'filter 0.35s ease-in';
    fluid.style.filter = 'brightness(1.6) blur(2px)';
    setTimeout(() => {
      if (m.fluid) fluid.style.background = m.fluid;
      if (m.blob1) blob1.style.background = m.blob1;
      if (m.blob2) blob2.style.background = m.blob2;
      if (m.glow && glassShell) {
        glassShell.style.boxShadow = 'inset -2px -2px 8px rgba(255,255,255,0.08), inset 2px 2px 8px rgba(255,255,255,0.35), ' + m.glow;
      }
      blob1.style.animation = 'ai-fluid-spin ' + m.speed + ' linear infinite';
      fluid.style.transition = 'filter 0.5s ease-out';
      fluid.style.filter = 'brightness(1) blur(0px)';
      _moodTimer = setTimeout(() => { fluid.style.transition = ''; fluid.style.filter = ''; _moodTimer = null; }, 550);
    }, 350);
    blob1.style.animationDuration = m.speed;
    if (mood === 'sleepy' || mood === 'sad') { blob1.style.transition = 'opacity 1.5s ease'; blob1.style.opacity = '0.6'; }
    else { blob1.style.transition = 'opacity 1.0s ease'; blob1.style.opacity = '1'; }
    targetScale = m.scale;
    breathExtra = m.bounce;
    mouseTracking = (mood !== 'sleepy' && mood !== 'sad');
    if (talkInterval) { clearInterval(talkInterval); talkInterval = null; }
    if (mood === 'talking') {
      let tog = false;
      talkInterval = setInterval(() => { tog = !tog; tog ? EXPR.talkBig() : EXPR.talking(); }, 250);
    } else {
      if (EXPR[m.expr]) EXPR[m.expr](); else { EXPR.normal(); currentExpr = 'normal'; }
    }
    if (mood === 'happy' || mood === 'excited' || mood === 'love') {
      blushL.style.background = mood === 'love' ? 'rgba(255,90,120,0.5)' : 'rgba(255,120,120,0.4)';
      blushR.style.background = mood === 'love' ? 'rgba(255,90,120,0.5)' : 'rgba(255,120,120,0.4)';
    } else {
      blushL.style.background = m.blush;
      blushR.style.background = m.blush;
    }
  }

  // 自动眨眼
  function blink() {
    EXPR.blink();
    setTimeout(() => { if (EXPR[currentExpr]) EXPR[currentExpr](); else EXPR.normal(); }, 100);
  }
  setInterval(() => { if (currentMood !== 'talking' && currentMood !== 'thinking') blink(); }, 3000 + Math.random() * 2000);

  // 待机微表情
  function getTimeScene() {
    const h = new Date().getHours();
    if (h >= 6 && h < 11) return 'morning';
    if (h >= 11 && h < 14) return 'noon';
    if (h >= 14 && h < 18) return 'afternoon';
    if (h >= 18 && h < 22) return 'evening';
    return 'latenight';
  }
  let lastTone = 'neutral';
  function detectTone(text) {
    if (!text) return 'neutral';
    if (/哈哈|嘻嘻|😄|😆|笑|开心|太好了|棒|厉害|不错|好耶/.test(text)) return 'cheerful';
    if (/害羞|脸红|嘿嘿|😳|😊|人家/.test(text)) return 'shy';
    if (/生气|可恶|气死|哼|😠|😤|讨厌/.test(text)) return 'annoyed';
    if (/难过|伤心|唉|😢|😭|呜呜|抱歉|对不起/.test(text)) return 'sad';
    if (/好奇|为什么|怎么|吗？|呢？|🤔|想想/.test(text)) return 'curious';
    if (/加油|冲|💪|努力|一定可以|相信/.test(text)) return 'encourage';
    if (/困|累|😴|哈欠|想睡|好困/.test(text)) return 'tired';
    if (/惊|天哪|什么|😱|😮|不会吧|哇/.test(text)) return 'surprised';
    if (/嗯|好的|了解|明白|知道了|收到/.test(text)) return 'calm';
    return 'neutral';
  }

  const ACT = {
    daily: [
      () => { EXPR.lookLeft(); setTimeout(() => { EXPR.lookRight(); setTimeout(() => EXPR.normal(), 500); }, 500); },
      () => { EXPR.curious(); setTimeout(() => EXPR.normal(), 800); },
      () => { EXPR.wink(); setTimeout(() => EXPR.normal(), 700); },
      () => { EXPR.winkR(); setTimeout(() => EXPR.normal(), 700); },
      () => { EXPR.hmm(); setTimeout(() => EXPR.normal(), 800); },
      () => { EXPR.sparkle(); setTimeout(() => EXPR.normal(), 500); },
      () => { EXPR.blink(); setTimeout(() => EXPR.normal(), 80); setTimeout(() => EXPR.blink(), 250); setTimeout(() => EXPR.normal(), 330); },
      () => { EXPR.lookLeft(); setTimeout(() => EXPR.lookRight(), 200); setTimeout(() => EXPR.lookLeft(), 400); setTimeout(() => EXPR.lookRight(), 600); setTimeout(() => EXPR.normal(), 800); },
      () => { EXPR.softSmile(); setTimeout(() => EXPR.normal(), 1000); },
      () => { EXPR.focus(); setTimeout(() => { EXPR.curious(); setTimeout(() => EXPR.normal(), 500); }, 800); },
    ],
    happy: [
      () => { EXPR.happy(); setTimeout(() => EXPR.normal(), 1000); },
      () => { EXPR.superHappy(); const s = targetScale; targetScale = 1.1; setTimeout(() => { targetScale = 0.93; }, 200); setTimeout(() => { targetScale = 1.08; EXPR.giggle(); }, 400); setTimeout(() => { targetScale = 0.95; }, 600); setTimeout(() => { targetScale = s; EXPR.happy(); }, 800); setTimeout(() => EXPR.normal(), 1200); },
      () => { EXPR.giggle(); setTimeout(() => EXPR.normal(), 800); },
      () => { const s = targetScale; EXPR.happy(); targetScale = 0.9; setTimeout(() => { targetScale = 1.12; }, 150); setTimeout(() => { targetScale = 0.93; }, 350); setTimeout(() => { targetScale = 1.05; EXPR.giggle(); }, 500); setTimeout(() => { targetScale = s; EXPR.normal(); }, 700); },
      () => { EXPR.smug(); setTimeout(() => { EXPR.giggle(); setTimeout(() => EXPR.normal(), 600); }, 700); },
      () => { EXPR.love(); blushL.style.transition = 'background 0.3s'; blushR.style.transition = 'background 0.3s'; blushL.style.background = 'rgba(255,80,120,0.5)'; blushR.style.background = 'rgba(255,80,120,0.5)'; setTimeout(() => { EXPR.superHappy(); blushL.style.transition = 'background 0.8s'; blushR.style.transition = 'background 0.8s'; blushL.style.background = ''; blushR.style.background = ''; }, 1000); setTimeout(() => EXPR.normal(), 1500); },
      () => { EXPR.content(); setTimeout(() => { EXPR.softSmile(); setTimeout(() => EXPR.normal(), 800); }, 600); },
    ],
    shy: [
      () => { EXPR.happy(); blushL.style.transition = 'background 0.3s'; blushR.style.transition = 'background 0.3s'; blushL.style.background = 'rgba(255,100,100,0.5)'; blushR.style.background = 'rgba(255,100,100,0.5)'; setTimeout(() => { EXPR.normal(); blushL.style.transition = 'background 0.8s'; blushR.style.transition = 'background 0.8s'; blushL.style.background = ''; blushR.style.background = ''; }, 1200); },
      () => { EXPR.squint(); blushL.style.background = 'rgba(255,100,100,0.4)'; blushR.style.background = 'rgba(255,100,100,0.4)'; setTimeout(() => EXPR.lookDown(), 400); setTimeout(() => { EXPR.normal(); blushL.style.background = ''; blushR.style.background = ''; }, 1000); },
      () => { EXPR.nervous(); setTimeout(() => { EXPR.peekR(); blushL.style.background = 'rgba(255,110,100,0.4)'; blushR.style.background = 'rgba(255,110,100,0.4)'; }, 400); setTimeout(() => EXPR.blink(), 900); setTimeout(() => { EXPR.softSmile(); blushL.style.background = ''; blushR.style.background = ''; }, 1100); setTimeout(() => EXPR.normal(), 1600); },
    ],
    thinking: [
      () => { EXPR.thinking(); setTimeout(() => EXPR.normal(), 800); },
      () => { EXPR.hmm(); setTimeout(() => { EXPR.thinking(); setTimeout(() => EXPR.normal(), 600); }, 500); },
      () => { EXPR.curious(); setTimeout(() => { EXPR.hmm(); setTimeout(() => EXPR.normal(), 600); }, 500); },
      () => { EXPR.lookUp(); setTimeout(() => { EXPR.thinking(); setTimeout(() => EXPR.normal(), 700); }, 500); },
      () => { EXPR.confused(); setTimeout(() => { EXPR.thinking(); setTimeout(() => { EXPR.sparkle(); setTimeout(() => EXPR.normal(), 400); }, 500); }, 600); },
      () => { EXPR.thinking(); setTimeout(() => { EXPR.sparkle(); setTimeout(() => { EXPR.giggle(); setTimeout(() => EXPR.normal(), 500); }, 400); }, 800); },
    ],
    surprised: [
      () => { EXPR.surprised(); setTimeout(() => EXPR.normal(), 600); },
      () => { EXPR.wow(); setTimeout(() => { EXPR.curious(); setTimeout(() => EXPR.normal(), 600); }, 500); },
      () => { EXPR.wow(); setTimeout(() => EXPR.love(), 400); setTimeout(() => { EXPR.superHappy(); blushL.style.background = 'rgba(255,100,100,0.4)'; blushR.style.background = 'rgba(255,100,100,0.4)'; }, 800); setTimeout(() => { EXPR.normal(); blushL.style.background = ''; blushR.style.background = ''; }, 1400); },
      () => { EXPR.flattered(); const s = targetScale; targetScale = 1.05; setTimeout(() => { EXPR.bliss(); targetScale = s; }, 600); setTimeout(() => EXPR.happy(), 1200); setTimeout(() => EXPR.normal(), 1700); },
    ],
    sleepy: [
      () => { EXPR.drowsy(); setTimeout(() => { EXPR.sleepy(); setTimeout(() => { EXPR.surprised(); setTimeout(() => EXPR.normal(), 300); }, 600); }, 400); },
      () => { EXPR.halfBlink(); setTimeout(() => EXPR.sleepy(), 500); setTimeout(() => EXPR.halfBlink(), 1200); setTimeout(() => EXPR.drowsy(), 1700); setTimeout(() => EXPR.normal(), 2200); },
      () => { const s = targetScale; targetScale = 1.08; EXPR.sleepy(); setTimeout(() => { targetScale = s; EXPR.drowsy(); setTimeout(() => { EXPR.surprised(); setTimeout(() => EXPR.normal(), 300); }, 400); }, 1000); },
      () => { EXPR.sleepy(); setTimeout(() => { EXPR.blink(); setTimeout(() => EXPR.sleepy(), 400); setTimeout(() => EXPR.normal(), 1200); }, 800); },
      () => { EXPR.drowsy(); setTimeout(() => { EXPR.daydream(); setTimeout(() => { EXPR.sleepy(); setTimeout(() => { EXPR.blink(); setTimeout(() => EXPR.normal(), 100); }, 800); }, 1000); }, 600); },
    ],
    sad: [
      () => { EXPR.sad(); setTimeout(() => EXPR.normal(), 1000); },
      () => { EXPR.sad(); setTimeout(() => { EXPR.lookDown(); setTimeout(() => EXPR.normal(), 600); }, 500); },
      () => { EXPR.pout(); setTimeout(() => { EXPR.sad(); setTimeout(() => EXPR.normal(), 800); }, 600); },
    ],
    default: [ () => EXPR.normal() ],
  };

  setInterval(() => {
    if (Date.now() - lastInteraction > 10000) {
      const scene = getTimeScene();
      let pool = [...ACT.daily];
      if (scene === 'latenight' || scene === 'morning') pool = [...pool, ...ACT.sleepy];
      if (lastTone === 'cheerful') pool = [...pool, ...ACT.happy];
      else if (lastTone === 'shy') pool = [...pool, ...ACT.shy];
      else if (lastTone === 'curious') pool = [...pool, ...ACT.thinking];
      else if (lastTone === 'surprised') pool = [...pool, ...ACT.surprised];
      else if (lastTone === 'sad' || lastTone === 'tired') pool = [...pool, ...ACT.sad];
      pool[Math.floor(Math.random() * pool.length)]();
    }
  }, 3000 + Math.random() * 2000);

  // 深呼吸
  setInterval(() => {
    if (currentMood === 'talking' || currentMood === 'thinking') return;
    if (deepBreathPhase === 0 && Math.random() < 0.5) deepBreathPhase = 0.01;
  }, 20000 + Math.random() * 20000);

  // ===== 事件绑定 =====
  btnChat.addEventListener('click', toggleInput);
  btnVoice.addEventListener('click', toggleVoice);
  btnScreenshot.addEventListener('click', screenshot);
  btnSend.addEventListener('click', send);
  inputEl.addEventListener('keypress', (e) => { if (e.key === 'Enter') send(); });

  // 点击空白关闭输入条
  document.addEventListener('click', (e) => {
    if (!inputBar.contains(e.target) && !btnChat.contains(e.target)) {
      inputBar.classList.remove('show');
    }
  });

  // ===== 初始化 =====
  setMood('happy');
  setTimeout(() => {
    showMessage('你好！我是你的私人小导游 🌉\n\n悬停在我身上查看工具栏，点击可以和我聊天哦！');
  }, 1000);

})();
