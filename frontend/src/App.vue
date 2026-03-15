<!--
 * 古桥可视化应用主组件
 * @description 古桥可视化项目的主入口组件，整合所有功能模块
 * @author mqr-work
 * @version 1.0.0
-->
<script setup>
import BridgeVisualization from './components/BridgeVisualization.vue';
</script>

<template>
  <BridgeVisualization />
</template>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 根元素样式 */
html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* 应用容器样式 */
#app {
  width: 100%;
  height: 100%;
  font-family:
    'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑',
    Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
