import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ScrollTrigger } from "https://cdn.skypack.dev/gsap/ScrollTrigger";
import gsap from "gsap";

/**
 * 初始化赵州桥3D场景
 * @param {Object} options - 配置选项
 * @param {string} options.containerId - Canvas 容器ID
 * @param {string} options.footerSelector - Footer 选择器
 * @param {string} options.footerContainerSelector - Footer 容器选择器
 * @param {string} options.modelPath - 模型文件路径
 * @param {Function} options.onReady - 场景初始化完成回调
 * @returns {Object} 场景控制对象，包含销毁方法
 */
export function initZhaozhou3DScene(options = {}) {
    const {
        containerId = "tttise-footer-canvas",
        footerSelector = "footer",
        footerContainerSelector = ".tttise-footer-container",
        modelPath = "./modelZhaozhou.glb",
        onReady = null
    } = options;

    const container = document.getElementById(containerId);
    const footerEl = document.querySelector(footerSelector);
    const footerContainer = document.querySelector(footerContainerSelector);

    if (!container) {
        console.warn(`Container with id "${containerId}" not found`);
        return null;
    }

    // 颜色生成逻辑
    const getAdaptiveWetStoneBaseColor = () => {
        const fallbackBg = new THREE.Color(0x0b0f16);
        let bg0 = "";
        
        if (footerEl) {
            const styles = getComputedStyle(footerEl);
            bg0 = (styles.getPropertyValue("--footer-bg-0") || "").trim();
        }

        const footerBg = bg0 ? new THREE.Color(bg0) : fallbackBg;
        const wetLight = new THREE.Color(0xD2B05A);
        const wetDark = new THREE.Color(0x120C08);

        const lightTinted = wetLight.lerp(footerBg, 0.22);
        const darkTinted = wetDark.lerp(footerBg, 0.48);

        return lightTinted.lerp(darkTinted, 0.18);
    };

    const adaptiveWetStoneBaseColor = getAdaptiveWetStoneBaseColor();
    const pointer = { x: 0, y: 0, active: false };

    // 指针事件监听
    const pointerMoveHandler = (e) => {
        pointer.active = true;
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", pointerMoveHandler, { passive: true });

    // 场景初始化
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, container.offsetWidth / container.offsetHeight, 0.1, 40);
    camera.position.set(0, 0.3, 1.8);
    camera.lookAt(0, -0.3, 0);

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
    });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.physicallyCorrectLights = true;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 光照设置
    const hemi = new THREE.HemisphereLight(0xFFFFFF, 0x222222, 2.5);
    scene.add(hemi);
    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 8.0);
    keyLight.position.set(2.0, 2.0, 1.5);
    scene.add(keyLight);
    const rim = new THREE.DirectionalLight(0xF0D080, 4.5);
    rim.position.set(-2.5, 0.5, -1.5);
    scene.add(rim);
    const innerGlow = new THREE.PointLight(0xF0E0C0, 3.0, 8, 2);
    innerGlow.position.set(0, 0.35, 0.45);
    scene.add(innerGlow);

    // 环境贴图生成
    const createGradientEnvTexture = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext("2d");

        const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
        g.addColorStop(0, "#1B140D");
        g.addColorStop(0.55, "#120C08");
        g.addColorStop(1, "#070403");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const s = ctx.createRadialGradient(canvas.width * 0.72, canvas.height * 0.34, 0, canvas.width * 0.72, canvas.height * 0.34, canvas.height * 0.9);
        s.addColorStop(0, "rgba(214, 173, 72, 0.62)");
        s.addColorStop(0.35, "rgba(214, 173, 72, 0.14)");
        s.addColorStop(1, "rgba(214, 173, 72, 0)");
        ctx.fillStyle = s;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const tex = new THREE.CanvasTexture(canvas);
        tex.encoding = THREE.sRGBEncoding;
        tex.mapping = THREE.EquirectangularReflectionMapping;
        tex.needsUpdate = true;
        return tex;
    };

    // 可选：保留环境贴图但降低整体影响，或完全注释掉以去掉环境色
    // const pmrem = new THREE.PMREMGenerator(renderer);
    // pmrem.compileEquirectangularShader();
    // const envSource = createGradientEnvTexture();
    // const envMap = pmrem.fromEquirectangular(envSource).texture;
    // scene.environment = envMap;
    // envSource.dispose();
    // pmrem.dispose();

    const aquarium = new THREE.Group();
    aquarium.position.set(0, -0.5, 0);
    scene.add(aquarium);

    const transmissionCapable = renderer.capabilities.isWebGL2;

    const loader = new GLTFLoader();
    let modelRoot = null;
    let modelBaseRotationX = 0.42;
    let modelBaseZ = -0.65;

    // 材质转换函数 - 保留模型本来的颜色，去掉环境光/emissive
    const toWetStone = (srcMaterial) => {
        // 克隆原始材质以保留所有贴图和颜色
        const mat = srcMaterial.clone();

        // 去掉环境发光效果
        mat.emissive = new THREE.Color(0x000000);
        mat.emissiveIntensity = 0;
        mat.emissiveMap = null;

        // 增加环境贴图强度以增强质感
        mat.envMapIntensity = 0.6;

        // 调整材质参数使其更亮更有石头质感
        mat.roughness = Math.max(mat.roughness - 0.2, 0.3);
        mat.metalness = Math.min(mat.metalness + 0.1, 0.2);
        mat.clearcoat = 0.2;
        mat.clearcoatRoughness = 0.4;

        return mat;
    };

    // 模型加载
    loader.load(modelPath, (gltf) => {
        modelRoot = gltf.scene;

        const box = new THREE.Box3().setFromObject(modelRoot);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        modelRoot.position.sub(center);
        modelRoot.scale.setScalar(3.2 / maxDim);
        modelRoot.position.y = -0.2;
        modelRoot.rotation.x = modelBaseRotationX;

        modelRoot.traverse((obj) => {
            if (!obj.isMesh) return;
            obj.frustumCulled = true;
            if (Array.isArray(obj.material)) {
                obj.material = obj.material.map((m) => toWetStone(m));
            } else {
                obj.material = toWetStone(obj.material);
            }
        });

        aquarium.add(modelRoot);

        if (onReady) {
            onReady();
        }
    });

    // 滚动触发逻辑
    const scrollTrigger = ScrollTrigger.create({
        trigger: footerSelector,
        start: "top 80%",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
            const progress = self.progress;
            const yValue = -35 * (1 - progress);
            if (footerContainer) {
                gsap.set(footerContainer, { y: `${yValue}%` });
            }

            modelBaseZ = -0.65 * (1 - progress);
            modelBaseRotationX = 0.42 * (1 - progress);
        },
        onEnter: () => {
            const modules = document.querySelectorAll('.tttise-zhaozhou-module');
            modules.forEach(module => {
                module.classList.add('tttise-scroll-animation');
            });
        },
        onLeaveBack: () => {
            const modules = document.querySelectorAll('.tttise-zhaozhou-module');
            modules.forEach(module => {
                module.classList.remove('tttise-scroll-animation');
            });
        }
    });

    // Intersection Observer：同时控制 CSS 动画类 & 3D 渲染循环
    let isFooterVisible = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isFooterVisible = entry.isIntersecting;
            const modules = document.querySelectorAll('.tttise-zhaozhou-module');
            if (entry.isIntersecting) {
                modules.forEach(module => {
                    module.classList.add('tttise-scroll-animation');
                });
            } else {
                modules.forEach(module => {
                    module.classList.remove('tttise-scroll-animation');
                });
            }
        });
    }, { threshold: 0.1 });

    if (footerEl) {
        observer.observe(footerEl);
    }

    // 窗口大小调整
    const resize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", resize, { passive: true });
    resize();

    // 动画循环
    let pixelRatio = Math.min(window.devicePixelRatio, 2);
    let frameCount = 0;
    let lastFpsSampleAt = performance.now();
    let consecutiveLowFps = 0;
    let animationId = null;

    function animate() {
        animationId = requestAnimationFrame(animate);

        // footer 不在视口内时跳过渲染，节省 GPU
        if (!isFooterVisible) return;

        const time = performance.now() * 0.001;
        frameCount += 1;

        const idleY = Math.sin(time * 0.22) * 0.06;
        const idleX = Math.cos(time * 0.18) * 0.04;
        const targetAquariumY = pointer.active ? pointer.x * 0.08 : idleY;
        const targetAquariumX = pointer.active ? -pointer.y * 0.06 : idleX;
        aquarium.rotation.y += (targetAquariumY - aquarium.rotation.y) * 0.03;
        aquarium.rotation.x += (targetAquariumX - aquarium.rotation.x) * 0.03;
        aquarium.position.z += (modelBaseZ - aquarium.position.z) * 0.06;

        aquarium.position.x += (0 - aquarium.position.x) * 0.06;

        if (modelRoot) {
            const targetRotationY = pointer.active ? pointer.x * 0.45 : Math.sin(time * 0.26) * 0.06;
            const targetRotationX = (pointer.active ? -pointer.y * 0.22 : Math.cos(time * 0.22) * 0.04) + modelBaseRotationX;
            modelRoot.rotation.y += (targetRotationY - modelRoot.rotation.y) * 0.06;
            modelRoot.rotation.x += (targetRotationX - modelRoot.rotation.x) * 0.06;
        }

        const now = performance.now();
        const dt = now - lastFpsSampleAt;
        if (dt >= 1000) {
            const fps = (frameCount * 1000) / dt;
            frameCount = 0;
            lastFpsSampleAt = now;

            if (fps < 55) {
                consecutiveLowFps += 1;
            } else {
                consecutiveLowFps = 0;
            }

            if (consecutiveLowFps >= 2 && pixelRatio > 1) {
                pixelRatio = Math.max(1, pixelRatio - 0.5);
                renderer.setPixelRatio(pixelRatio);
                consecutiveLowFps = 0;
            }
        }

        renderer.render(scene, camera);
    }
    animate();

    // 返回控制对象，包含销毁方法
    return {
        destroy: () => {
            // 停止动画循环
            if (animationId) {
                cancelAnimationFrame(animationId);
            }

            // 移除事件监听
            window.removeEventListener("pointermove", pointerMoveHandler);
            window.removeEventListener("resize", resize);

            // 销毁 ScrollTrigger
            if (scrollTrigger) {
                scrollTrigger.kill();
            }

            // 销毁 Observer
            if (observer) {
                observer.disconnect();
            }

            // 清理 Three.js 资源
            if (renderer) {
                renderer.dispose();
            }

        }
    };
}
