<!--
 * 古桥可视化组件
 * @description 提供古桥的3D模型展示、地理坐标映射和数据可视化交互功能
 * @author mqr-work
 * @version 1.0.0
-->
<template>
  <div class="bridge-visualization">
    <!-- 3D模型容器 -->
    <div ref="modelContainer" class="model-container">
      <canvas ref="modelCanvas" class="model-canvas"></canvas>
    </div>

    <!-- 地图容器 -->
    <div ref="mapContainer" class="map-container">
      <div id="bridgeMap" class="bridge-map"></div>
    </div>

    <!-- 数据图表容器 -->
    <div ref="chartContainer" class="chart-container">
      <div id="bridgeChart" class="bridge-chart"></div>
    </div>

    <!-- 控制面板 -->
    <div class="control-panel">
      <h3>古桥信息</h3>
      <div v-if="selectedBridge" class="bridge-info">
        <p><strong>名称：</strong>{{ selectedBridge.name }}</p>
        <p><strong>年代：</strong>{{ selectedBridge.year }}</p>
        <p><strong>位置：</strong>{{ selectedBridge.location }}</p>
        <p><strong>类型：</strong>{{ selectedBridge.type }}</p>
      </div>
      <div v-else class="no-selection">
        <p>请点击地图上的古桥标记查看详情</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import * as THREE from 'three';

/**
 * 古桥数据配置
 * @type {Array<Object>}
 */
const BRIDGE_DATA = [
  {
    id: 1,
    name: '赵州桥',
    year: '隋代（605年）',
    location: '河北省石家庄市',
    type: '石拱桥',
    coordinates: [114.48, 37.06],
    length: 50.82,
    width: 9.6,
  },
  {
    id: 2,
    name: '卢沟桥',
    year: '金代（1189年）',
    location: '北京市丰台区',
    type: '联拱石桥',
    coordinates: [116.22, 39.85],
    length: 266.5,
    width: 7.5,
  },
  {
    id: 3,
    name: '广济桥',
    year: '宋代（1171年）',
    location: '广东省潮州市',
    type: '浮梁结合桥',
    coordinates: [116.65, 23.67],
    length: 518,
    width: 5,
  },
  {
    id: 4,
    name: '洛阳桥',
    year: '宋代（1053年）',
    location: '福建省泉州市',
    type: '梁式石桥',
    coordinates: [118.68, 24.87],
    length: 834,
    width: 7,
  },
  {
    id: 5,
    name: '安平桥',
    year: '宋代（1138年）',
    location: '福建省晋江市',
    type: '梁式石桥',
    coordinates: [118.43, 24.72],
    length: 2070,
    width: 3.6,
  },
];

export default {
  name: 'BridgeVisualization',

  setup() {
    // Refs
    const modelContainer = ref(null);
    const modelCanvas = ref(null);
    const mapContainer = ref(null);
    const chartContainer = ref(null);
    const selectedBridge = ref(null);

    // 实例存储
    let mapChart = null;
    let dataChart = null;
    let scene = null;
    let camera = null;
    let renderer = null;
    let animationId = null;

    /**
     * 初始化3D场景
     * @description 创建Three.js场景、相机、渲染器和灯光
     */
    const init3DScene = () => {
      if (!modelCanvas.value) return;

      // 创建场景
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);

      // 创建相机
      const width = modelContainer.value?.clientWidth || 400;
      const height = modelContainer.value?.clientHeight || 300;
      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.z = 5;

      // 创建渲染器
      renderer = new THREE.WebGLRenderer({
        canvas: modelCanvas.value,
        antialias: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);

      // 添加灯光
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 10, 5);
      scene.add(directionalLight);

      // 创建示例桥梁模型（简化的拱桥）
      createBridgeModel();

      // 开始动画循环
      animate();
    };

    /**
     * 创建桥梁3D模型
     * @description 使用Three.js几何体创建简化的拱桥模型
     */
    const createBridgeModel = () => {
      // 桥身
      const bridgeGeometry = new THREE.BoxGeometry(4, 0.3, 1.5);
      const bridgeMaterial = new THREE.MeshLambertMaterial({ color: 0x8b7355 });
      const bridge = new THREE.Mesh(bridgeGeometry, bridgeMaterial);
      bridge.position.y = 0.5;
      scene.add(bridge);

      // 桥拱（使用圆环的一部分）
      const archGeometry = new THREE.TorusGeometry(1.5, 0.2, 8, 20, Math.PI);
      const archMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
      const arch = new THREE.Mesh(archGeometry, archMaterial);
      arch.position.y = -0.5;
      scene.add(arch);

      // 桥墩
      const pierGeometry = new THREE.BoxGeometry(0.5, 1.5, 1.5);
      const pierMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });

      const leftPier = new THREE.Mesh(pierGeometry, pierMaterial);
      leftPier.position.set(-2, -0.5, 0);
      scene.add(leftPier);

      const rightPier = new THREE.Mesh(pierGeometry, pierMaterial);
      rightPier.position.set(2, -0.5, 0);
      scene.add(rightPier);
    };

    /**
     * 动画循环
     * @description 持续渲染3D场景，实现模型旋转效果
     */
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (scene && camera && renderer) {
        // 缓慢旋转场景
        scene.rotation.y += 0.005;
        renderer.render(scene, camera);
      }
    };

    /**
     * 初始化地图
     * @description 使用ECharts创建中国地图，标注古桥位置
     */
    const initMap = () => {
      const chartDom = document.getElementById('bridgeMap');
      if (!chartDom) return;

      mapChart = echarts.init(chartDom);

      const option = {
        title: {
          text: '中国古桥分布图',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            const bridge = BRIDGE_DATA.find((b) => b.id === params.data.id);
            if (bridge) {
              return `${bridge.name}<br/>年代：${bridge.year}<br/>类型：${bridge.type}`;
            }
            return params.name;
          },
        },
        geo: {
          map: 'china',
          roam: true,
          zoom: 1.2,
          label: {
            show: true,
            fontSize: 10,
          },
          itemStyle: {
            areaColor: '#e0e0e0',
            borderColor: '#999',
          },
          emphasis: {
            itemStyle: {
              areaColor: '#d0d0d0',
            },
          },
        },
        series: [
          {
            name: '古桥',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: BRIDGE_DATA.map((bridge) => ({
              id: bridge.id,
              name: bridge.name,
              value: [...bridge.coordinates, bridge.length],
            })),
            symbolSize: (val) => Math.min(val[2] / 50, 20),
            label: {
              show: true,
              formatter: '{b}',
              position: 'right',
              fontSize: 10,
            },
            itemStyle: {
              color: '#ff6b6b',
              shadowBlur: 10,
              shadowColor: 'rgba(255, 107, 107, 0.5)',
            },
            emphasis: {
              scale: 1.5,
              itemStyle: {
                color: '#ff4757',
              },
            },
          },
        ],
      };

      mapChart.setOption(option);

      // 点击事件
      mapChart.on('click', (params) => {
        if (params.data && params.data.id) {
          const bridge = BRIDGE_DATA.find((b) => b.id === params.data.id);
          selectedBridge.value = bridge || null;
        }
      });
    };

    /**
     * 初始化数据图表
     * @description 使用ECharts创建古桥数据可视化图表
     */
    const initChart = () => {
      const chartDom = document.getElementById('bridgeChart');
      if (!chartDom) return;

      dataChart = echarts.init(chartDom);

      const option = {
        title: {
          text: '古桥长度对比',
          left: 'center',
          textStyle: {
            fontSize: 14,
            fontWeight: 'bold',
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: BRIDGE_DATA.map((b) => b.name),
          axisLabel: {
            rotate: 30,
            fontSize: 10,
          },
        },
        yAxis: {
          type: 'value',
          name: '长度（米）',
          nameTextStyle: {
            fontSize: 10,
          },
        },
        series: [
          {
            name: '桥长',
            type: 'bar',
            data: BRIDGE_DATA.map((b) => b.length),
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' },
              ]),
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#2378f7' },
                  { offset: 0.7, color: '#2378f7' },
                  { offset: 1, color: '#83bff6' },
                ]),
              },
            },
          },
        ],
      };

      dataChart.setOption(option);
    };

    /**
     * 处理窗口大小变化
     * @description 响应式适配，重新调整图表和3D场景大小
     */
    const handleResize = () => {
      if (mapChart) {
        mapChart.resize();
      }
      if (dataChart) {
        dataChart.resize();
      }
      if (renderer && camera && modelContainer.value) {
        const width = modelContainer.value.clientWidth;
        const height = modelContainer.value.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };

    // 生命周期钩子
    onMounted(() => {
      init3DScene();
      initMap();
      initChart();
      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (mapChart) {
        mapChart.dispose();
      }
      if (dataChart) {
        dataChart.dispose();
      }
      if (renderer) {
        renderer.dispose();
      }
    });

    return {
      modelContainer,
      modelCanvas,
      mapContainer,
      chartContainer,
      selectedBridge,
    };
  },
};
</script>

<style scoped>
.bridge-visualization {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 20px;
  padding: 20px;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.model-container {
  grid-column: 1;
  grid-row: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.model-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.map-container {
  grid-column: 2;
  grid-row: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.bridge-map {
  width: 100%;
  height: 100%;
}

.chart-container {
  grid-column: 1;
  grid-row: 2;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.bridge-chart {
  width: 100%;
  height: 100%;
}

.control-panel {
  grid-column: 2;
  grid-row: 2;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow-y: auto;
}

.control-panel h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 18px;
  border-bottom: 2px solid #ff6b6b;
  padding-bottom: 10px;
}

.bridge-info p {
  margin: 10px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

.bridge-info strong {
  color: #333;
}

.no-selection {
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 40px 20px;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .bridge-visualization {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 300px);
    height: auto;
  }

  .model-container {
    grid-column: 1;
    grid-row: 1;
  }

  .map-container {
    grid-column: 1;
    grid-row: 2;
  }

  .chart-container {
    grid-column: 1;
    grid-row: 3;
  }

  .control-panel {
    grid-column: 1;
    grid-row: 4;
  }
}
</style>
