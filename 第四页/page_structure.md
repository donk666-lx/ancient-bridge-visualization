# 中国古代桥梁数据报告
## 项目规划书 · 协作开发规范
> 适配 Claude Code 多 Agent 并行协作开发

---

## 一、设计系统（Design Tokens）

### 1.1 色彩体系
```css
/* 主色 */
--cream:       #f5f0e8    /* 宣纸米白·主背景 */
--dark-ink:    #1a1008    /* 浓墨深褐·主文字 */
--ochre:       #c47c2b    /* 赭石橙·高亮强调 */
--red-dark:    #8b1520    /* 朱砂红·重点标注 */

/* 辅助色 */
--grey-blue:   #5c7a8a    /* 青灰·次级文字/边框 */
--ochre-light: #e8c080    /* 淡赭·渐变终止色 */
--grey-light:  #d8cfc0    /* 浅灰·分割线 */
--white-smoke: #faf7f2    /* 烟白·卡片背景 */

/* 朝代专属色 */
--sui:   #8B6914    /* 隋·古金 */
--tang:  #DAA520    /* 唐·金黄 */
--song:  #4169E1    /* 宋·宝蓝 */
--yuan:  #2E8B57    /* 元·墨绿 */
--ming:  #DC143C    /* 明·明红 */
--qing:  #9932CC    /* 清·紫罗兰 */
--roc:   #FF6347    /* 民国·橘红 */
```

### 1.2 字体体系
```
标题字体:  Noto Serif SC 700 (书法感宋体)
正文字体:  Noto Serif SC 400
辅助字体:  system-ui, sans-serif (数字/英文)
字号阶梯:  0.65 / 0.7 / 0.78 / 0.82 / 0.9 / 1.0 / 1.2 / 1.6 / 2.2 / clamp(2.8, 7vw, 5.5)rem
```

### 1.3 间距 & 圆角
```
间距: 0.3 / 0.5 / 0.8 / 1.0 / 1.2 / 1.5 / 1.8 / 2.0 / 2.5 / 3.0 rem
圆角: 2px (小元素) / 4px (卡片) / 6px (面板) / 8px (模态) / 50% (圆形)
```

### 1.4 阴影 & 边框
```
卡片边框:  1px solid #e0d8cc
高亮边框:  1px solid rgba(196,124,43,0.4)
卡片阴影:  0 2px 8px rgba(0,0,0,0.05)
悬浮阴影:  0 10px 30px rgba(0,0,0,0.1)
```

---

## 二、全局架构

### 2.1 页面结构
```html
<body>
  <!-- Loading Screen -->
  <div id="loading">...</div>

  <!-- 进度条 -->
  <div id="nav-progress"></div>

  <!-- 导航点 -->
  <div id="nav-dots">
    6个 .nav-dot[data-idx][data-label]
  </div>

  <!-- 主滚动容器 -->
  <div id="scroll-wrap">  <!-- scroll-snap-type: y mandatory -->
    <section id="cover">    <!-- Section 1 -->
    <section id="regional"> <!-- Section 2 -->
    <section id="timeline"> <!-- Section 3 -->
    <section id="types">    <!-- Section 4 -->
    <section id="culture">  <!-- Section 5 -->
    <section id="summary">  <!-- Section 6 -->
  </div>

  <!-- 全局弹层 (独立于scroll-wrap) -->
  <div id="type-detail-overlay">...</div>
</body>
```

### 2.2 JS 全局约定
```javascript
// 每个section的初始化函数命名规范
initCover()      // Section 1
initRegional()   // Section 2
initTimeline()   // Section 3
initTypes()      // Section 4
initCulture()    // Section 5
initSummary()    // Section 6

// 全局工具函数 (在主模板中定义)
scrollToSection(idx)          // 滚动到指定section
countUp(el, target, duration) // 数字计数动画

// ECharts 初始化约定
const chart = echarts.getInstanceByDom(el) || echarts.init(el);
chart.setOption({ backgroundColor:'transparent', ... });
```

### 2.3 CDN 依赖
```html
<script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&display=swap">
```

---

## 三、各模块规范

### Section 1 — 封面页 (cover)
**背景**: 深色渐变 `#0d0a04 → #1a1008 → #2e200c`
**元素**:
- 水墨浮动光晕 (3个 ink-drop div，GSAP inkFloat动画)
- 桥梁轮廓SVG (position:absolute, bottom:0, opacity:0.12)
- 徽标文字 `cover-badge`
- 主标题 `cover-main-title`（"中国古代桥梁"+"高亮桥梁"+"数据报告"）
- 副标题 `cover-tagline`（因地制宜·文用合一·千年匠心）
- 分割线装饰 `cover-dividers`
- 4个统计数字（25+座/7朝代/15省份/1400+年），计数动画
- 「开启报告」按钮（透明边框，hover填充动画）
- 向下滚动提示（scroll-hint动画）

**动画**: GSAP timeline，stagger 0.2s依次显示

---

### Section 2 — 地域分布篇 (regional)
**背景**: `#faf7f2`
**布局**: grid 1.1fr 0.9fr，间距 1.5rem
**左侧**:
- ECharts 中国地图热力图（加载 `geo.datav.aliyun.com` GeoJSON，失败显示fallback条形图）
- 3个统计小卡片（华东/福建/15省）

**右侧**:
- 双层环形饼图（内环=分区，外环=带标签）
- 省份Top10条形图

**交互**:
- 地图点击省份显示详情
- 饼图高亮联动

**数据**:
```javascript
const provinceData = [{name:'福建',value:5}, ...] // 13条
const regionData = [{name:'华东',value:9,color:'#4169E1'}, ...] // 7条
```

---

### Section 3 — 历史时间篇 (timeline)
**背景**: `linear-gradient(180deg, #f5f0e8, #ede5d8)`
**布局**: 单列，全宽1380px

**朝代选择条** `dynasty-strip`:
- 7个按钮，flex均分，active状态底部3px色条
- 渐变色背景条（隋→民国七色）

**图表区** grid 1.6fr 1fr:
- 柱状+折线组合图（左）：各朝代数量(bar) + 累计趋势(line)
- 朝代详情卡片（右）：标题/技术标签/描述文字/世界对比蓝框

**交互**:
- 点击按钮/点击柱子 → 更新右侧详情卡（GSAP opacity+x淡入）

**数据**: 7个朝代信息对象（含世界对比字段）

---

### Section 4 — 结构类型篇 (types)
**背景**: `#faf7f2`
**布局**: grid 1fr 1.4fr

**左侧**: ECharts 雷达图（5轴：耐久/承载/地形/文化/工艺）
**右侧**: 5张桥型卡片（2+2+1宽布局）
  - 图标/名称/数量/进度条/技术关键词/代表案例

**交互**:
- 点击卡片 → 打开全屏详情模态框（含结构原理说明）
- 模态框包含：描述/技术标签/案例列表/工作原理段落

**数据**: typeDetailData 数组（5个桥型完整信息）

---

### Section 5 — 文化价值篇 (culture)
**背景**: `linear-gradient(160deg, #f5f0e8, #ede5d8)`
**布局**: grid 1fr 1.1fr

**左侧**:
- CSS词云（30个关键词，不同fontSize/color/rotate）
- Sankey流向图（材料→桥型，ECharts sankey类型）

**右侧**:
- 8张故事卡片（可滚动）
  - 标题/时代标签/引用诗词/故事正文

**交互**: 词云单词点击跳转至对应故事卡

---

### Section 6 — 彩蛋总结篇 (summary)
**背景**: 深色渐变（同封面）
**元素**:
- 粒子动画 Canvas（80个金色粒子向上漂浮）
- 6张荣誉卡片（最古老/最长/首座海港/最重梁/无钉铆/最美）
- 统计汇总行（25座/7朝代/5类型/15省/1400+年）—— 计数动画
- 「生成分享海报」按钮（Canvas API生成PNG）
- 「回到封面」按钮
- 闭幕引语

---

## 四、文件结构
```
桥梁总结报告/
├── index.html          ← 最终交付文件（由assembler生成）
├── page_structure.md   ← 本规划书
├── design_system.css   ← 共享样式（由Agent生成）
├── data/
│   └── bridges_data.json
└── sections/           ← 各模块片段（由各Agent生成）
    ├── s1_cover.html
    ├── s2_regional.html
    ├── s3_timeline.html
    ├── s4_types.html
    ├── s5_culture.html
    └── s6_summary.html
```

---

## 五、组装规范

组装器读取所有section文件，提取：
1. `<style>` 标签内容 → 合并到 `<head>`
2. `<section ...>` 标签 → 按顺序插入 `#scroll-wrap`
3. `<!-- OVERLAY -->` 注释块 → 插入到 `#scroll-wrap` 之后
4. `<script>` 标签内容 → 合并到 `</body>` 前

**每个section文件格式**:
```html
<style>
/* Section N 的样式，命名加前缀避免冲突 */
</style>

<section id="xxx">
  <!-- HTML内容 -->
</section>

<!-- OVERLAY (可选) -->
<div id="overlay-xxx">...</div>

<script>
function initXxx() {
  // 初始化代码
}
</script>
```

---

## 六、质量标准
- [ ] 6个section均能正常渲染
- [ ] 所有ECharts图表正常显示
- [ ] GSAP动画入场效果正常
- [ ] 导航点跳转正确
- [ ] 类型详情弹窗开关正常
- [ ] 词云词语可点击
- [ ] 海报生成并下载PNG
- [ ] 无JS报错（console无红色）
- [ ] 全程国潮水墨风格一致
- [ ] 响应式基本适配（1200px+）
