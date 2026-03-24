# 桥韵·智汇 启动脚本
# PowerShell 版本

Write-Host "`n启动桥韵·智汇项目...`n"

# 检查必要的命令
Write-Host "检查环境..."

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "错误: 未找到 Node.js，请先安装 Node.js"
    Read-Host "按 Enter 键退出..."
    exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "错误: 未找到 npm"
    Read-Host "按 Enter 键退出..."
    exit 1
}

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "错误: 未找到 Python，请先安装 Python"
    Read-Host "按 Enter 键退出..."
    exit 1
}

if (-not (Get-Command http-server -ErrorAction SilentlyContinue)) {
    Write-Host "安装 http-server..."
    npm install -g http-server
    if ($LASTEXITCODE -ne 0) {
        Write-Host "错误: http-server 安装失败"
        Read-Host "按 Enter 键退出..."
        exit 1
    }
    Write-Host "http-server 安装完成`n"
} else {
    Write-Host "http-server 已安装`n"
}

Write-Host "所有依赖已就绪`n"

# 关闭已存在的相关进程（避免端口占用）
Write-Host "清理旧进程..."
try {
    Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
    Write-Host "清理完成`n"
} catch {
    Write-Host "进程清理失败: $($_.Exception.Message)`n"
}

# 启动首页服务 (端口 8888)
Write-Host "启动首页服务 (端口 8888)..."
Start-Process cmd -ArgumentList "/c", "http-server -p 8888 -c-1"
Start-Sleep -Seconds 2

# 启动展览服务 (端口 3003)
Write-Host "启动桥韵·展览 (端口 3003)..."
Start-Process cmd -ArgumentList "/c", "cd exhibition && npm run dev"
Start-Sleep -Seconds 3

# 启动图鉴+AI服务 (端口 3004 / 3005)
Write-Host "启动桥韵·图鉴 + AI 后端 (端口 3004 / 3005)..."
Start-Process cmd -ArgumentList "/c", "cd atlas && npm run start"
Start-Sleep -Seconds 3

# 启动第四页 (端口 3006)
Write-Host "启动中国古代桥梁数据报告 (端口 3006)..."
Start-Process cmd -ArgumentList "/c", "cd 第四页 && http-server -p 3006 -c-1"
Start-Sleep -Seconds 2

# 自动打开浏览器
Write-Host "正在打开首页..."
Start-Process "http://localhost:8888"

Write-Host "`n所有服务已启动！`n"
Write-Host "服务地址：`n"
Write-Host "首页: http://localhost:8888`n"
Write-Host "桥韵·展览: http://localhost:3003`n"
Write-Host "桥韵·图鉴: http://localhost:3004`n"
Write-Host "AI 后端: http://localhost:3005/health`n"
Write-Host "桥梁数据报告: http://localhost:3006`n"

Write-Host "提示：关闭此窗口不会停止服务，服务在后台窗口中运行`n"
Write-Host "如需停止服务，请手动关闭对应的命令行窗口`n"
Write-Host "按任意键退出此控制台（服务继续在后台运行）"
Read-Host