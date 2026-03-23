@echo off
chcp 65001 >nul
title 桥韵·智汇 — 启动控制台
color 0A

:: 获取项目根目录
set "ROOT=%~dp0"
set "ROOT=%ROOT:~0,-1%"

echo.
echo  ╔══════════════════════════════════════════════════════════╗
echo  ║                                                          ║
echo  ║              桥 韵 · 智 汇  启 动 程 序                   ║
echo  ║                                                          ║
echo  ╚══════════════════════════════════════════════════════════╝
echo.

:: 检查必要的命令
echo  [检查环境] 检查 Node.js 和 Python...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [错误] 未找到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo  [错误] 未找到 npm
    pause
    exit /b 1
)

where python >nul 2>&1
if %errorlevel% neq 0 (
    echo  [错误] 未找到 Python，请先安装 Python
    pause
    exit /b 1
)

echo  [检查通过] Node.js 和 Python 已安装
echo.

:: 检查并安装 exhibition 依赖
if not exist "%ROOT%\exhibition\node_modules" (
    echo  [安装依赖] 正在安装 exhibition 依赖...
    cd /d "%ROOT%\exhibition"
    call npm install
    if %errorlevel% neq 0 (
        echo  [错误] exhibition 依赖安装失败
        pause
        exit /b 1
    )
    echo  [安装完成] exhibition 依赖
echo.
) else (
    echo  [跳过安装] exhibition 依赖已存在
echo.
)

:: 检查并安装 atlas 依赖
if not exist "%ROOT%\atlas\node_modules" (
    echo  [安装依赖] 正在安装 atlas 依赖...
    cd /d "%ROOT%\atlas"
    call npm install
    if %errorlevel% neq 0 (
        echo  [错误] atlas 依赖安装失败
        pause
        exit /b 1
    )
    echo  [安装完成] atlas 依赖
echo.
) else (
    echo  [跳过安装] atlas 依赖已存在
echo.
)

:: 关闭已存在的相关进程（避免端口占用）
echo  [清理] 关闭可能占用端口的旧进程...
taskkill /F /IM "node.exe" /FI "WINDOWTITLE eq *exhibition*" >nul 2>&1
taskkill /F /IM "node.exe" /FI "WINDOWTITLE eq *atlas*" >nul 2>&1
taskkill /F /IM "python.exe" /FI "WINDOWTITLE eq *首页*" >nul 2>&1
timeout /t 1 /nobreak >nul
echo  [清理完成]
echo.

:: 启动首页服务 (端口 8888)
echo  [1/5] 启动首页服务 (端口 8888)...
start "首页 :8888" /min cmd /c "cd /d %ROOT% && python -m http.server 8888 && pause"
timeout /t 1 /nobreak >nul

:: 启动展览服务 (端口 3003)
echo  [2/5] 启动桥韵·展览 (端口 3003)...
start "展览 :3003" /min cmd /c "cd /d %ROOT%\exhibition && npm run dev && pause"
timeout /t 2 /nobreak >nul

:: 启动图鉴+AI服务 (端口 3004 / 3005)
echo  [3/5] 启动桥韵·图鉴 + AI 后端 (端口 3004 / 3005)...
start "图鉴 :3004+3005" /min cmd /c "cd /d %ROOT%\atlas && npm run start && pause"
timeout /t 2 /nobreak >nul

:: 启动第四页 (端口 3006)
echo  [4/5] 启动中国古代桥梁数据报告 (端口 3006)...
start "第四页 :3006" /min cmd /c "cd /d %ROOT%\第四页 && python -m http.server 3006 && pause"
timeout /t 2 /nobreak >nul

:: 等待服务启动
echo  [5/5] 等待服务就绪...
echo.
set /a count=0
:wait_loop
set /a count+=1
if %count% gtr 20 goto service_ready

:: 检查服务是否启动
curl -s http://localhost:8888 >nul 2>&1
if %errorlevel% equ 0 (
    curl -s http://localhost:3003 >nul 2>&1
    if %errorlevel% equ 0 (
        curl -s http://localhost:3004 >nul 2>&1
        if %errorlevel% equ 0 (
            curl -s http://localhost:3006 >nul 2>&1
            if %errorlevel% equ 0 goto service_ready
        )
    )
)

:: 显示进度动画
setlocal EnableDelayedExpansion
set "spin=/ - \ |"
for %%a in (!spin!) do (
    <nul set /p "=  启动中 %%a  (%count%/20秒)..."
    timeout /t 1 /nobreak >nul
    echo.
)
endlocal
goto wait_loop

:service_ready
echo.
echo  ╔══════════════════════════════════════════════════════════════════╗
echo  ║                     所有服务已启动完成！                          ║
echo  ╠══════════════════════════════════════════════════════════════════╣
echo  ║                                                                  ║
echo  ║   🏠  首页              http://localhost:8888                    ║
echo  ║   🌉  桥韵·展览         http://localhost:3003                    ║
echo  ║   📖  桥韵·图鉴         http://localhost:3004                    ║
echo  ║   🤖  AI 后端           http://localhost:3005/health             ║
echo  ║   📊  桥梁数据报告      http://localhost:3006                    ║
echo  ║                                                                  ║
echo  ╚══════════════════════════════════════════════════════════════════╝
echo.

:: 自动打开浏览器
echo  正在打开首页...
start "" "http://localhost:8888"

echo.
echo  提示：关闭此窗口不会停止服务，服务在后台窗口中运行
echo  如需停止服务，请手动关闭对应的命令行窗口
echo.
echo  按任意键退出此控制台（服务继续在后台运行）
pause >nul
exit
