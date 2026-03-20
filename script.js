// 全局变量
let lenis;

// 初始化 Lenis 平滑滚动
function initLenis() {
  lenis = new Lenis();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

// 第一个项目：Three.js 效果
function initFirstProject() {
  const CONFIG = {
    color: "#ebf5df",
    spread: 0.5,
    speed: 2,
  };

  const canvas = document.querySelector(".hero-canvas");
  const hero = document.querySelector(".hero");

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
  });

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255,
        }
      : { r: 0.89, g: 0.89, b: 0.89 };
  }

  function resize() {
    const width = hero.offsetWidth;
    const height = hero.offsetHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  resize();
  window.addEventListener("resize", resize);

  const rgb = hexToRgb(CONFIG.color);
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uProgress;
      uniform vec2 uResolution;
      uniform vec3 uColor;
      uniform float uSpread;
      varying vec2 vUv;

      float Hash(vec2 p) {
        vec3 p2 = vec3(p.xy, 1.0);
        return fract(sin(dot(p2, vec3(37.1, 61.7, 12.4))) * 3758.5453123);
      }

      float noise(in vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f *= f * (3.0 - 2.0 * f);
        return mix(
          mix(Hash(i + vec2(0.0, 0.0)), Hash(i + vec2(1.0, 0.0)), f.x),
          mix(Hash(i + vec2(0.0, 1.0)), Hash(i + vec2(1.0, 1.0)), f.x),
          f.y
        );
      }

      float fbm(vec2 p) {
        float v = 0.0;
        v += noise(p * 1.0) * 0.5;
        v += noise(p * 2.0) * 0.25;
        v += noise(p * 4.0) * 0.125;
        v += noise(p * 8.0) * 0.0625;
        return v;
      }

      float inkSplash(vec2 p) {
        float distance = length(p);
        float splash = 1.0 - smoothstep(0.0, 1.0, distance);
        splash *= 1.0 + sin(distance * 10.0) * 0.1;
        return splash;
      }

      void main() {
        vec2 uv = vUv;
        float aspect = uResolution.x / uResolution.y;
        vec2 centeredUv = (uv - 0.5) * vec2(aspect, 1.0);

        // 水墨风格的颜色 - 深灰色/黑色
        vec3 inkColor = vec3(0.1, 0.1, 0.1);
        
        // 多层次噪声创建水墨效果
        float noiseValue = fbm(centeredUv * 10.0);
        float noiseValue2 = fbm(centeredUv * 20.0) * 0.5;
        float noiseValue3 = fbm(centeredUv * 30.0) * 0.25;
        float totalNoise = noiseValue + noiseValue2 + noiseValue3;
        
        // 水墨扩散效果
        float inkSpread = inkSplash(centeredUv * 2.0) * 0.3;
        
        // 溶解边缘
        float dissolveEdge = uv.y - uProgress * 1.2;
        float d = dissolveEdge + (totalNoise + inkSpread) * uSpread;

        float pixelSize = 1.0 / uResolution.y;
        float alpha = 1.0 - smoothstep(-pixelSize, pixelSize, d);
        
        // 添加随机墨点效果
        float dotNoise = noise(centeredUv * 50.0);
        if (dotNoise > 0.8) {
          alpha *= 0.8 + dotNoise * 0.2;
        }

        gl_FragColor = vec4(inkColor, alpha);
      }
    `,
    uniforms: {
      uProgress: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(hero.offsetWidth, hero.offsetHeight),
      },
      uColor: { value: new THREE.Vector3(rgb.r, rgb.g, rgb.b) },
      uSpread: { value: CONFIG.spread },
    },
    transparent: true,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  let scrollProgress = 0;

  function animate() {
    material.uniforms.uProgress.value = scrollProgress;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  lenis.on("scroll", ({ scroll }) => {
    const heroHeight = hero.offsetHeight;
    const windowHeight = window.innerHeight;
    const maxScroll = heroHeight - windowHeight;
    scrollProgress = Math.min((scroll / maxScroll) * CONFIG.speed, 1.1);
  });

  window.addEventListener("resize", () => {
    material.uniforms.uResolution.value.set(hero.offsetWidth, hero.offsetHeight);
  });

  // 文字动画
  const heroH2 = document.querySelector(".hero-content h2");
  if (heroH2) {
    // 简单的文字淡入效果，替代 SplitText
    gsap.set(heroH2, { opacity: 0 });

    ScrollTrigger.create({
      trigger: ".hero-content",
      start: "top 25%",
      end: "bottom 100%",
      onUpdate: (self) => {
        gsap.to(heroH2, {
          opacity: self.progress,
          duration: 0.5,
          overwrite: true,
        });
      },
    });
  }
}

// 第二个项目：滚动动画效果
function initSecondProject() {
  const windowContainer = document.querySelector(".window-container");
  const skyContainer = document.querySelector(".sky-container");
  const heroCopy = document.querySelector(".hero-copy");
  const heroHeader = document.querySelector(".jeskojets-hero .hero-header");

  if (skyContainer) {
    const skyContainerHeight = skyContainer.offsetHeight;
    const viewportHeight = window.innerHeight;
    const skyMoveDistance = skyContainerHeight - viewportHeight;

    gsap.set(heroCopy, { yPercent: 100 });

    ScrollTrigger.create({
      trigger: ".jeskojets-hero",
      start: "top top",
      end: `+=${window.innerHeight * 3}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        let windowScale;
        if (progress <= 0.5) {
          windowScale = 1 + (progress / 0.5) * 3;
        } else {
          windowScale = 4;
        }

        gsap.set(windowContainer, { scale: windowScale });
        gsap.set(heroHeader, { scale: windowScale, z: progress * 500 });

        gsap.set(skyContainer, {
          y: -progress * skyMoveDistance,
        });

        let heroCopyY;
        if (progress <= 0.66) {
          heroCopyY = 100;
        } else if (progress >= 1) {
          heroCopyY = 0;
        } else {
          heroCopyY = 100 * (1 - (progress - 0.66) / 0.34);
        }

        gsap.set(heroCopy, { yPercent: heroCopyY });
      },
    });
  }
}

// 初始化遮罩层
function initOverlay() {
  // 创建遮罩层元素
  const overlay = document.createElement('div');
  overlay.className = 'transition-overlay';
  document.body.appendChild(overlay);

  // 监听滚动事件，实现遮罩效果
  lenis.on('scroll', ({ scroll }) => {
    // 获取第二个项目的位置
    const jeskojetsHero = document.querySelector('.jeskojets-hero');
    if (!jeskojetsHero) return;
    
    const jeskojetsHeroTop = jeskojetsHero.offsetTop;
    const windowHeight = window.innerHeight;
    
    // 计算第二个项目动画完全结束的位置
    // 第二个项目的 ScrollTrigger end 是 +=${window.innerHeight * 3}px
    // 所以动画完全结束的位置是 jeskojetsHeroTop + windowHeight * 3
    const jeskojetsAnimationEnd = jeskojetsHeroTop + windowHeight * 3;
    
    // 计算遮罩开始的位置（动画完全结束后，再往后更多）
    const transitionStart = jeskojetsAnimationEnd + windowHeight * 1.5;
    // 计算全黑开始的位置（快速变黑）
    const blackStart = transitionStart + windowHeight * 0.25;
    // 计算全黑结束的位置（延长全黑时间）
    const blackEnd = blackStart + windowHeight * 3;
    // 计算遮罩结束的位置
    const transitionEnd = blackEnd + windowHeight * 3;
    
    // 计算当前滚动位置相对于过渡区域的进度
    let overlayOpacity = 0;
    
    if (scroll >= transitionStart && scroll <= blackStart) {
      // 从0到1的不透明度，快速变暗到全黑
      overlayOpacity = (scroll - transitionStart) / (windowHeight * 0.5) * 1;
    } else if (scroll > blackStart && scroll <= blackEnd) {
      // 保持全黑状态
      overlayOpacity = 1;
    } else if (scroll > blackEnd && scroll <= transitionEnd) {
      // 从1到0的不透明度，慢慢恢复
      overlayOpacity = 1 - (scroll - blackEnd) / (windowHeight * 3) * 1;
    }
    
    // 更新遮罩层的不透明度
    overlay.style.backgroundColor = `rgba(0, 0, 0, ${overlayOpacity})`;
  });
}

// 初始化所有项目
document.addEventListener("DOMContentLoaded", () => {
  // 初始化 Lenis
  initLenis();
  
  // 初始化第一个项目
  initFirstProject();
  
  // 初始化第二个项目
  initSecondProject();
  
  // 初始化遮罩层
  initOverlay();
});
