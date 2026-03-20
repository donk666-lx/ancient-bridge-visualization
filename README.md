# IronHill Scroll Animation

一个基于Three.js、GSAP和Lenis的滚动动画效果项目，展示了平滑的页面滚动和视觉效果。

## 技术栈

- **前端框架**：原生JavaScript
- **动画库**：GSAP + ScrollTrigger
- **滚动库**：Lenis
- **3D渲染**：Three.js
- **构建工具**：Vite
- **样式**：CSS3

## 项目结构

```
ti-ironhill-scroll-animation/
├── index.html          # 主页面结构
├── script.js           # 主要脚本逻辑
├── styles.css          # 样式文件
├── shaders.js          # GLSL着色器代码
├── package.json        # 项目配置和依赖
├── package-lock.json   # 依赖锁定文件
├── .gitignore          # Git忽略文件
├── porsche-911-gt3-rs-7680x4320-25139.jpg  # 英雄区域背景图
└── 桥1.png             # 桥区域图片
```

## 核心功能

### 1. 平滑滚动效果

使用Lenis库实现平滑的页面滚动效果，提供更自然的滚动体验。

### 2. Three.js 着色器动画

- 创建了一个全屏的WebGL画布，使用自定义的GLSL着色器实现滚动时的视觉效果
- 着色器参数随滚动进度动态变化，产生渐变和过渡效果

### 3. 文字动画

- 使用GSAP的SplitText插件将标题文字分割为单词
- 实现滚动时的文字渐入效果，按顺序显示每个单词

### 4. 响应式设计

- 监听窗口大小变化，自动调整Canvas尺寸和渲染参数
- 确保在不同设备上都能正常显示

## 实现逻辑

### 1. 初始化设置

- 导入所需库：Three.js、GSAP、ScrollTrigger、SplitText、Lenis
- 注册GSAP插件
- 创建Lenis实例，设置滚动回调

### 2. Three.js 场景设置

- 创建场景、相机和渲染器
- 加载自定义着色器材质
- 监听滚动事件，更新着色器的进度参数

### 3. 滚动动画

- 使用Lenis处理滚动事件，计算滚动进度
- 同步更新Three.js着色器的uProgress参数
- 实现平滑的视觉过渡效果

### 4. 文字动画

- 使用SplitText分割标题文字为单词
- 创建ScrollTrigger，监听滚动位置
- 根据滚动进度，按顺序显示单词，实现渐入效果

## 如何运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npx vite
```

### 3. 访问项目

在浏览器中打开 `http://localhost:5173/` 查看效果。

## 依赖说明

- **gsap**: ^3.14.2 - 用于动画效果
- **lenis**: ^1.3.17 - 用于平滑滚动
- **three**: ^0.182.0 - 用于WebGL渲染
- **vite**: ^7.3.1 - 开发构建工具

## 核心代码解析

### 着色器动画

在 `shaders.js` 中定义了顶点着色器和片段着色器，通过 `uProgress` 参数控制动画效果。

### 滚动监听

在 `script.js` 中，使用Lenis监听滚动事件，计算滚动进度并更新着色器参数：

```javascript
lenis.on("scroll", ({ scroll }) => {
  const heroHeight = hero.offsetHeight;
  const windowHeight = window.innerHeight;
  const maxScroll = heroHeight - windowHeight;
  scrollProgress = Math.min((scroll / maxScroll) * CONFIG.speed, 1.1);
});
```

### 文字动画

使用GSAP的ScrollTrigger实现文字的渐入效果：

```javascript
ScrollTrigger.create({
  trigger: ".hero-content",
  start: "top 25%",
  end: "bottom 100%",
  onUpdate: (self) => {
    const progress = self.progress;
    const totalWords = words.length;

    words.forEach((word, index) => {
      const wordProgress = index / totalWords;
      const nextWordProgress = (index + 1) / totalWords;

      let opacity = 0;

      if (progress >= nextWordProgress) {
        opacity = 1;
      } else if (progress >= wordProgress) {
        const fadeProgress = (progress - wordProgress) / (nextWordProgress - wordProgress);
        opacity = fadeProgress;
      }

      gsap.to(word, {
        opacity: opacity,
        duration: 0.1,
        overwrite: true,
      });
    });
  },
});
```

## 效果展示

- 滚动时，英雄区域的图片会通过着色器产生渐变效果
- 标题文字会按顺序渐入显示
- 整个页面滚动过程平滑自然

## 注意事项

- 确保图片资源路径正确
- 调整 `CONFIG` 对象中的参数可以改变动画效果
- 在生产环境中，建议构建项目以获得更好的性能

```bash
npm run build
```