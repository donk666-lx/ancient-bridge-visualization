const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

// 特定路由的静态文件（放在前面，优先匹配）
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
app.use('/woodstone', express.static(path.join(__dirname, '桥梁可视化木石')));

// 后端 API 代理
const { createProxyMiddleware } = require('http-proxy-middleware');
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3005',
  changeOrigin: true
}));

// 首页路由（放在最后）
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`统一服务运行在 http://localhost:${port}`);
  console.log('路由映射:');
  console.log('- 首页: http://localhost:8080/');
  console.log('- 展览: http://localhost:8080/exhibition');
  console.log('- 图鉴: http://localhost:8080/atlas');
  console.log('- 数据报告: http://localhost:8080/report');
  console.log('- 木石之韵: http://localhost:8080/woodstone');
  console.log('- 后端 API: http://localhost:8080/api');
});
