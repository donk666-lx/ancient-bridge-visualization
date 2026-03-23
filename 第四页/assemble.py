#!/usr/bin/env python3
"""
组装脚本：将 part1.html + part2.html 合并进主框架，生成最终 index.html
"""
import os, re

BASE = os.path.dirname(os.path.abspath(__file__))

def read(name):
    path = os.path.join(BASE, name)
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write(name, content):
    path = os.path.join(BASE, name)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✓ Written {name}: {len(content):,} chars ({len(content)//1024}KB)")

part1 = read('part1.html')
part2 = read('part2.html')

SHELL = r"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>中国古代桥梁数据报告 · 沉浸式可视化</title>
<meta name="description" content="以数据为笔，以文化为墨——中国古代桥梁千年历史的沉浸式数据可视化报告">
<script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&display=swap" rel="stylesheet">
<style>
/* ===== RESET & ROOT ===== */
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
:root {
  --cream: #f5f0e8;
  --dark-ink: #1a1008;
  --grey-blue: #5c7a8a;
  --ochre: #c47c2b;
  --red-dark: #8b1520;
  --grey-light: #d8cfc0;
  --ink-wash: rgba(26,16,8,0.05);
  --white-smoke: #faf7f2;
}
html { scroll-behavior: smooth; }
body {
  font-family: 'Noto Serif SC', 'Songti SC', '宋体', serif;
  background: var(--cream);
  color: var(--dark-ink);
  overflow: hidden;
  height: 100vh;
  -webkit-font-smoothing: antialiased;
}

/* ===== SCROLL CONTAINER ===== */
#scroll-wrap {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}
#scroll-wrap::-webkit-scrollbar { width: 4px; }
#scroll-wrap::-webkit-scrollbar-track { background: transparent; }
#scroll-wrap::-webkit-scrollbar-thumb { background: rgba(196,124,43,0.3); border-radius: 2px; }

section {
  height: 100vh;
  scroll-snap-align: start;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
}

/* ===== NAVIGATION DOTS ===== */
#nav-dots {
  position: fixed;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  pointer-events: all;
}
.nav-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: transparent;
  border: 1.5px solid rgba(196,124,43,0.4);
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}
.nav-dot::after {
  content: attr(data-label);
  position: absolute;
  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.65rem;
  color: var(--ochre);
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s;
  font-family: 'Noto Serif SC', serif;
  letter-spacing: 0.05em;
}
.nav-dot:hover::after { opacity: 1; }
.nav-dot.active {
  background: var(--ochre);
  border-color: var(--ochre);
  transform: scale(1.4);
  box-shadow: 0 0 8px rgba(196,124,43,0.5);
}
#nav-progress {
  position: fixed;
  left: 0; top: 0;
  width: 3px;
  height: 0%;
  background: linear-gradient(to bottom, transparent, var(--ochre));
  z-index: 998;
  transition: height 0.3s;
}

/* ===== SHARED SECTION STYLES ===== */
.sec-title {
  font-size: clamp(1.6rem, 3.5vw, 2.2rem);
  font-weight: 700;
  color: var(--dark-ink);
  text-align: center;
  margin-bottom: 0.4rem;
  position: relative;
  display: inline-block;
}
.sec-title::before {
  content: '';
  position: absolute;
  left: -1.5rem; top: 50%;
  width: 1rem; height: 1px;
  background: var(--ochre);
  transform: translateY(-50%);
}
.sec-title::after {
  content: '';
  position: absolute;
  right: -1.5rem; top: 50%;
  width: 1rem; height: 1px;
  background: var(--ochre);
  transform: translateY(-50%);
}
.sec-sub {
  font-size: 0.82rem;
  color: var(--grey-blue);
  text-align: center;
  letter-spacing: 0.15em;
  margin-bottom: 0;
}

/* ===== CHART PANEL BASE ===== */
.chart-panel {
  background: rgba(255,255,255,0.75);
  border: 1px solid #e0d8cc;
  border-radius: 6px;
  padding: 0.8rem;
  backdrop-filter: blur(4px);
}
.chart-panel h3 {
  font-size: 0.78rem;
  color: var(--grey-blue);
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
  font-weight: 400;
}

/* ===== COVER INITIAL STATES ===== */
.cover-badge { transform: translateY(20px); }
.cover-main-title { transform: translateY(30px); }
.cover-stats-row { transform: translateY(20px); }
.cover-cta { transform: translateY(20px); }

/* ===== LOADING SCREEN ===== */
#loading {
  position: fixed; inset: 0;
  background: #1a1008;
  z-index: 9999;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  transition: opacity 0.8s, visibility 0.8s;
}
#loading.hidden { opacity: 0; visibility: hidden; }
.loading-title {
  font-size: 1.2rem; color: rgba(245,240,232,0.6);
  letter-spacing: 0.4em; margin-bottom: 2rem;
}
.loading-bar-wrap {
  width: 200px; height: 2px;
  background: rgba(255,255,255,0.1); border-radius: 1px; overflow: hidden;
}
.loading-bar {
  height: 100%; width: 0%;
  background: linear-gradient(90deg, #8b6914, #c47c2b, #daa520);
  border-radius: 1px; transition: width 0.05s linear;
}
.loading-pct { font-size: 0.75rem; color: rgba(196,124,43,0.6); margin-top: 0.6rem; letter-spacing: 0.2em; }
</style>

{{PART1_STYLES}}
{{PART2_STYLES}}

</head>
<body>

<!-- Loading Screen -->
<div id="loading">
  <div class="loading-title">中国古代桥梁数据报告</div>
  <div class="loading-bar-wrap"><div class="loading-bar" id="loading-bar"></div></div>
  <div class="loading-pct" id="loading-pct">0%</div>
</div>

<!-- Progress bar -->
<div id="nav-progress"></div>

<!-- Navigation Dots -->
<div id="nav-dots">
  <div class="nav-dot active" data-idx="0" data-label="封面" onclick="scrollToSection(0)"></div>
  <div class="nav-dot" data-idx="1" data-label="地域分布" onclick="scrollToSection(1)"></div>
  <div class="nav-dot" data-idx="2" data-label="历史时间" onclick="scrollToSection(2)"></div>
  <div class="nav-dot" data-idx="3" data-label="结构类型" onclick="scrollToSection(3)"></div>
  <div class="nav-dot" data-idx="4" data-label="文化价值" onclick="scrollToSection(4)"></div>
  <div class="nav-dot" data-idx="5" data-label="彩蛋总结" onclick="scrollToSection(5)"></div>
</div>

<!-- Main Scroll Wrapper -->
<div id="scroll-wrap">

{{PART1_SECTIONS}}

{{PART2_SECTIONS}}

</div><!-- /scroll-wrap -->

<script>
// ============================================================
// CORE: Scroll, Navigation, Section Lifecycle
// ============================================================
gsap.registerPlugin(ScrollTrigger);

const wrap = document.getElementById('scroll-wrap');
const sections = document.querySelectorAll('section');
const navDots = document.querySelectorAll('.nav-dot');
const progressBar = document.getElementById('nav-progress');
let currentIdx = 0;
const inited = new Set();

// Scroll-to helper
function scrollToSection(idx) {
  sections[idx]?.scrollIntoView({ behavior: 'smooth' });
}

// Intersection observer — fires section init & updates nav
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = [...sections].indexOf(entry.target);
      currentIdx = idx;
      navDots.forEach((d, i) => d.classList.toggle('active', i === idx));
      progressBar.style.height = `${((idx) / (sections.length - 1)) * 100}%`;
      if (!inited.has(idx)) {
        inited.add(idx);
        initSection(idx);
      }
    }
  });
}, { root: wrap, threshold: 0.55 });
sections.forEach(s => sectionObserver.observe(s));

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown' && currentIdx < sections.length - 1) scrollToSection(currentIdx + 1);
  if (e.key === 'ArrowUp' && currentIdx > 0) scrollToSection(currentIdx - 1);
});

// Section dispatcher
function initSection(idx) {
  switch (idx) {
    case 0: initCover(); break;
    case 1: initRegional(); break;
    case 2: initTimeline(); break;
    case 3: initTypes(); break;
    case 4: initCulture(); break;
    case 5: initSummary(); break;
  }
}

// ============================================================
// SHARED UTILITIES
// ============================================================
function countUp(id, target, duration) {
  const el = document.getElementById(id);
  if (!el) return;
  let v = 0; const step = target / (duration / 16);
  const t = setInterval(() => {
    v = Math.min(v + step, target);
    el.textContent = Math.floor(v);
    if (v >= target) clearInterval(t);
  }, 16);
}

// ============================================================
// LOADING ANIMATION
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
  const bar = document.getElementById('loading-bar');
  const pct = document.getElementById('loading-pct');
  let p = 0;
  const t = setInterval(() => {
    p = Math.min(p + Math.random() * 8 + 2, 95);
    bar.style.width = p + '%';
    pct.textContent = Math.floor(p) + '%';
  }, 60);

  window.addEventListener('load', () => {
    clearInterval(t);
    bar.style.width = '100%';
    pct.textContent = '100%';
    setTimeout(() => {
      document.getElementById('loading').classList.add('hidden');
      initSection(0);
    }, 400);
  });
});

// Resize handler — re-init all echarts instances
window.addEventListener('resize', () => {
  document.querySelectorAll('[id^="chart-"]').forEach(el => {
    const inst = echarts.getInstanceByDom(el);
    if (inst) inst.resize();
  });
});
</script>

{{PART1_JS}}
{{PART2_JS}}

</body>
</html>
"""

def extract_between(html, start_tag, end_tag):
    """Extract content between two comment tags."""
    pattern = re.compile(
        re.escape(start_tag) + r'(.*?)' + re.escape(end_tag),
        re.DOTALL
    )
    m = pattern.search(html)
    return m.group(1).strip() if m else ''

def extract_style(html):
    """Extract content of first <style id=...> tag."""
    m = re.search(r'<style id="[^"]*">(.*?)</style>', html, re.DOTALL)
    return m.group(1).strip() if m else ''

def extract_sections(html):
    """Extract all <section> elements."""
    sections = re.findall(r'<section[^>]*>.*?</section>', html, re.DOTALL)
    return '\n\n'.join(sections)

def extract_script(html):
    """Extract content of first <script id=...> tag."""
    m = re.search(r'<script id="[^"]*">(.*?)</script>', html, re.DOTALL)
    return m.group(1).strip() if m else ''

def extract_overlays(html):
    """Extract any non-section, non-style, non-script top-level elements."""
    # Get divs that are direct children outside sections
    m = re.findall(r'(<!-- Type Detail Modal -->.*?</div>\s*\n)', html, re.DOTALL)
    return '\n'.join(m)

p1_style = extract_style(part1)
p1_sections = extract_sections(part1)
p1_js = extract_script(part1)

p2_style = extract_style(part2)
p2_sections = extract_sections(part2)
p2_overlays = extract_overlays(part2)
p2_js = extract_script(part2)

final = SHELL
final = final.replace('{{PART1_STYLES}}', f'<style>\n{p1_style}\n</style>')
final = final.replace('{{PART2_STYLES}}', f'<style>\n{p2_style}\n</style>')
final = final.replace('{{PART1_SECTIONS}}', p1_sections)
final = final.replace('{{PART2_SECTIONS}}', p2_sections + '\n' + p2_overlays)
final = final.replace('{{PART1_JS}}', f'<script>\n{p1_js}\n</script>')
final = final.replace('{{PART2_JS}}', f'<script>\n{p2_js}\n</script>')

write('index.html', final)

# Cleanup temp files
for f in ['part1.html', 'part2.html']:
    fp = os.path.join(BASE, f)
    if os.path.exists(fp):
        os.remove(fp)
        print(f"✓ Removed {f}")

print("\n=== Assembly complete ===")
print(f"Output: {os.path.join(BASE, 'index.html')}")
