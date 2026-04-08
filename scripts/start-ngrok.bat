@echo off
REM ==========================================
REM ngrok 内网穿透启动脚本 (Windows)
REM ==========================================

echo ========================================
echo ngrok 内网穿透启动
echo ========================================
echo.

REM 检查 ngrok 是否已安装
where ngrok >nul 2>&1
if errorlevel 1 (
    echo [信息] ngrok 未安装
    echo.
    echo 请按以下步骤安装 ngrok:
    echo 1. 访问 https://ngrok.com/download
    echo 2. 下载 Windows 版本
    echo 3. 解压到任意目录
    echo 4. 将 ngrok.exe 所在目录添加到系统 PATH
    echo    或将 ngrok.exe 复制到此 scripts 目录
    echo.
    pause
    exit /b 1
)

echo [1/2] 检查 SonarQube 是否运行...
docker ps | findstr sonarqube >nul 2>&1
if errorlevel 1 (
    echo [错误] SonarQube 未运行
    echo 请先运行 scripts\start-sonarqube.bat
    pause
    exit /b 1
)

echo [OK] SonarQube 正在运行
echo.

echo [2/2] 启动 ngrok 内网穿透...
echo.
echo ngrok 将为 SonarQube (localhost:9000) 创建公网访问地址
echo.
echo ========================================
echo 重要提示:
echo ========================================
echo 1. 启动后会显示一个公网地址，如: https://abc123.ngrok.io
echo 2. 将此地址添加到 GitHub Secrets: SONAR_HOST_URL
echo 3. 不要关闭此窗口，关闭后 ngrok 会停止运行
echo 4. 免费版 ngrok 每次重启地址会变化
echo.
echo 按任意键启动 ngrok...
pause >nul

echo.
echo 启动 ngrok...
echo.

ngrok http 9000
