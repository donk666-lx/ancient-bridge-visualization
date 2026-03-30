import gsap from "gsap";
import { ScrollTrigger } from "https://cdn.skypack.dev/gsap/ScrollTrigger";
import Lenis from "lenis"; // 现在它会指向上面定义的 jsdelivr 地址
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { vertexShader, fragmentShader } from "./shaders.js";
import { initZhaozhou3DScene } from "./shared/zhaozhou-3d-scene.js";

gsap.registerPlugin(ScrollTrigger);

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
    vertexShader,
    fragmentShader,
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

  // 仅在 hero 可见时才运行渲染循环
  let firstProjectActive = false;
  function animate() {
    if (!firstProjectActive) return;
    requestAnimationFrame(animate);
    material.uniforms.uProgress.value = scrollProgress;
    renderer.render(scene, camera);
  }

  const heroVisObserver = new IntersectionObserver((entries) => {
    const isVisible = entries[0].isIntersecting;
    if (isVisible && !firstProjectActive) {
      firstProjectActive = true;
      animate();
    } else if (!isVisible) {
      firstProjectActive = false;
    }
  }, { threshold: 0 });
  heroVisObserver.observe(hero);

  lenis.on("scroll", ({ scroll }) => {
    const heroHeight = hero.offsetHeight;
    const windowHeight = window.innerHeight;
    // 减去 hero 在页面中的起始位置，确保进度从 hero 进入视口时才从 0 开始
    const heroOffsetTop = hero.offsetTop;
    const heroScroll = scroll - heroOffsetTop;
    const maxScroll = heroHeight - windowHeight;
    scrollProgress = Math.max(0, Math.min((heroScroll / maxScroll) * CONFIG.speed, 1.1));
  });

  window.addEventListener("resize", () => {
    material.uniforms.uResolution.value.set(hero.offsetWidth, hero.offsetHeight);
  });

  // 文字动画
  const heroH2 = document.querySelector(".hero-content h2");
  if (heroH2) {
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

// 初始化开头部分
function initIntroSection() {
  const spotlightSection = document.querySelector(".spotlight-section");
  const projectIndex = document.querySelector(".spotlight-section .project-index h1");
  const projectImgs = document.querySelectorAll(".spotlight-section .project-img");
  const projectImagesContainer = document.querySelector(".spotlight-section .project-images");
  const projectNames = document.querySelectorAll(".spotlight-section .project-names p");
  const projectNamesContainer = document.querySelector(".spotlight-section .project-names");
  const totalProjectCount = 10;

  if (!spotlightSection || !projectImagesContainer) return;

  // 预计算每张图片在条带坐标系内的中心 Y 和半高
  // section 被 pin 到视口顶部，.project-images 以 position:absolute top:0 排布
  // 所以 img.offsetTop（相对 .project-images）即屏幕 Y（translateY=0 时）
  let imgCenterOffsets = [];
  let imgHalfHeights = [];

  const updateDimensions = () => {
    const spotlightSectionHeight = spotlightSection.offsetHeight;
    const spotlightSectionPadding = parseFloat(
      getComputedStyle(spotlightSection).padding
    ) || 0;

    const projectIndexHeight = projectIndex ? projectIndex.offsetHeight : 0;
    const containerHeight = projectNamesContainer ? projectNamesContainer.offsetHeight : 0;
    const imagesHeight = projectImagesContainer.offsetHeight;

    const moveDistanceIndex =
      spotlightSectionHeight - spotlightSectionPadding * 2 - projectIndexHeight;

    const moveDistanceNames =
      spotlightSectionHeight - spotlightSectionPadding * 2 - containerHeight;

    const moveDistanceImages = window.innerHeight - imagesHeight;

    const imgActivationThreshold = window.innerHeight / 2;

    // resize 时重新读取一次布局（静态读取，不在滚动帧内）
    imgCenterOffsets = Array.from(projectImgs).map(
      (img) => img.offsetTop + img.offsetHeight / 2
    );
    imgHalfHeights = Array.from(projectImgs).map(
      (img) => img.offsetHeight / 2
    );

    return { moveDistanceIndex, moveDistanceNames, moveDistanceImages, imgActivationThreshold };
  };

  let dimensions = updateDimensions();

  window.addEventListener('resize', () => {
    dimensions = updateDimensions();
  }, { passive: true });

  ScrollTrigger.create({
    trigger: ".spotlight-section",
    start: "top top",
    end: `+=${window.innerHeight * 5}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;
      const currentIndex = Math.min(
        Math.floor(progress * totalProjectCount) + 1,
        totalProjectCount
      );

      if (projectIndex) {
        projectIndex.textContent = `${String(currentIndex).padStart(
          2,
          "0"
        )}/${String(totalProjectCount).padStart(2, "0")}`;

        gsap.set(projectIndex, {
          y: progress * dimensions.moveDistanceIndex,
        });
      }

      const translateY = progress * dimensions.moveDistanceImages;
      gsap.set(projectImagesContainer, { y: translateY });

      // 使用预计算偏移量判断激活图片，完全避免 getBoundingClientRect()
      projectImgs.forEach((img, i) => {
        const screenCenterY = imgCenterOffsets[i] + translateY;
        if (
          screenCenterY - imgHalfHeights[i] <= dimensions.imgActivationThreshold &&
          screenCenterY + imgHalfHeights[i] >= dimensions.imgActivationThreshold
        ) {
          gsap.set(img, { opacity: 1 });
        } else {
          gsap.set(img, { opacity: 0.5 });
        }
      });

      projectNames.forEach((p, index) => {
        const startProgress = index / totalProjectCount;
        const endProgress = (index + 1) / totalProjectCount;
        const projectProgress = Math.max(
          0,
          Math.min(1, (progress - startProgress) / (endProgress - startProgress))
        );

        gsap.set(p, {
          y: -projectProgress * dimensions.moveDistanceNames,
        });

        if (projectProgress > 0 && projectProgress < 1) {
          p.classList.add('active-name');
        } else {
          p.classList.remove('active-name');
        }
      });
    },
  });
}

// 全屏黑暗过渡：在 jeskojets 滚动末尾变黑，进入 footer 后慢慢恢复
function initDarkMaskTransition() {
  const mask = document.querySelector(".sky-dark-mask");
  if (!mask) return;

  // 变黑：绑定在 jeskojets-hero 滚动的末段（progress 0.8→0.95 迅速变黑，之后保持全黑）
  ScrollTrigger.create({
    trigger: ".jeskojets-hero",
    start: "top top",
    end: `+=${window.innerHeight * 3}px`,
    scrub: 1,
    onUpdate: (self) => {
      const p = self.progress;
      if (p <= 0.6) {
        gsap.set(mask, { opacity: 0 });
      } else {
        // 0.6→0.97 缓慢变黑，0.97→1 保持全黑
        const t = Math.min((p - 0.6) / 0.37, 1);
        gsap.set(mask, { opacity: t });
      }
    },
  });

  // 恢复：进入 footer 后缓慢恢复透明，跨越整个 footer 滚动范围
  ScrollTrigger.create({
    trigger: "footer",
    start: "top bottom",
    end: "top top",
    scrub: 1,
    onUpdate: (self) => {
      const p = self.progress;
      // 前 5% 保持全黑，之后用平方缓出慢慢恢复
      if (p <= 0.05) {
        gsap.set(mask, { opacity: 1 });
      } else {
        const t = (p - 0.05) / 0.95;
        gsap.set(mask, { opacity: 1 - t * t });
      }
    },
  });
}

// 初始化页脚
function initFooter() {
  const sceneControl = initZhaozhou3DScene({
    containerId: "tttise-footer-canvas",
    footerSelector: "footer",
    footerContainerSelector: ".tttise-footer-container",
    modelPath: "./modelZhaozhou.glb",
    onReady: () => {}
  });

  // 保存 sceneControl 引用，以便在需要时可以销毁场景
  window.zhaozhouSceneControl = sceneControl;
}

// 初始化所有项目
document.addEventListener("DOMContentLoaded", () => {
  // 初始化 Lenis
  initLenis();
  
  // 初始化开头部分
  initIntroSection();
  
  // 初始化第一个项目
  initFirstProject();
  
  // 初始化第二个项目
  initSecondProject();

  // 全屏黑暗过渡（sky section → footer）
  initDarkMaskTransition();

  // 初始化页脚
  initFooter();
});
