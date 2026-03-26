const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

// 设置 MIME 类型
app.use(express.static(path.join(__dirname), {
  setHeaders: (res, filepath) => {
    if (filepath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    }
  }
}));

app.use('/exhibition', express.static(path.join(__dirname, 'frontend', 'exhibition'), {
  setHeaders: (res, filepath) => {
    if (filepath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    }
  }
}));

app.use('/atlas', express.static(path.join(__dirname, 'frontend', 'atlas', 'dist'), {
  setHeaders: (res, filepath) => {
    if (filepath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    }
  }
}));
app.use('/report', express.static(path.join(__dirname, '第四页')));

// 后端 API 代理
const { createProxyMiddleware } = require('http-proxy-middleware');
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3005',
  changeOrigin: true
}));

app.listen(port, () => {
  console.log(`统一服务运行在 http://localhost:${port}`);
  console.log('路由映射:');
  console.log('- 首页: http://localhost:8080/');
  console.log('- 展览: http://localhost:8080/exhibition');
  console.log('- 图鉴: http://localhost:8080/atlas');
  console.log('- 数据报告: http://localhost:8080/report');
  console.log('- 后端 API: http://localhost:8080/api');
});
