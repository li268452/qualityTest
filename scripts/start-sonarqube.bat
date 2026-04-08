@echo off
REM ==========================================
REM SonarQube 本地启动脚本
REM 使用本地安装的 SonarQube
REM ==========================================

set SONAR_HOME=D:\代码质量测试功能\sonarqube-26.3.0.120487
set SONAR_SCRIPT=%SONAR_HOME%\bin\windows-x86-64\StartSonar.bat

echo ========================================
echo SonarQube 本地启动
echo ========================================
echo.
echo SonarQube 路径: %SONAR_HOME%
echo.

REM 检查 SonarQube 是否存在
if not exist "%SONAR_SCRIPT%" (
    echo [错误] 找不到 SonarQube 启动脚本
    echo 路径: %SONAR_SCRIPT%
    echo.
    echo 请确认 SonarQube 安装路径是否正确
    pause
    exit /b 1
)

REM 检查是否已经在运行
tasklist /FI "IMAGENAME eq java.exe" /FI "WINDOWTITLE eq SonarQube*" | findstr java.exe >nul 2>&1
if not errorlevel 1 (
    echo [信息] SonarQube 可能正在运行
    echo.
    echo 访问: http://localhost:9000
    echo.
    choice /C YN /M "是否重新启动"
    if errorlevel 2 goto :check_running
    call :stop_sonar
)

echo.
echo [1/2] 启动 SonarQube...
echo 这可能需要 1-2 分钟，请耐心等待...
echo.

start "" "%SONAR_SCRIPT%"

REM 等待启动
echo 等待 SonarQube 服务启动...
timeout /t 30 /nobreak

:check_running
echo.
echo [2/2] 检查 SonarQube 状态...

REM 检查端口 9000 是否被监听
netstat -ano | findstr :9000 | findstr LISTENING >nul 2>&1
if errorlevel 1 (
    echo [警告] 端口 9000 未被监听，SonarQube 可能还在启动中
    echo.
    echo 请等待 1-2 分钟后访问: http://localhost:9000
    echo.
    echo 如果无法访问，请检查日志:
    echo type "%SONAR_HOME%\logs\sonar.log"
) else (
    echo [OK] SonarQube 正在运行
)

echo.
echo ========================================
echo SonarQube 启动完成
echo ========================================
echo.
echo 访问地址: http://localhost:9000
echo 默认账号: admin
echo 默认密码: admin
echo.
echo 日志位置: %SONAR_HOME%\logs\sonar.log
echo.
echo 按任意键打开浏览器...
pause >nul

start http://localhost:9000

echo.
echo 下一步:
echo 1. 在浏览器中登录 SonarQube
echo 2. 创建项目: code-quality-test
echo 3. 生成 Token
echo 4. 运行: scripts\start-ngrok.bat
echo.
goto :eof

:stop_sonar
echo.
echo [信息] 停止 SonarQube...
taskkill /F /FI "WINDOWTITLE eq SonarQube*" >nul 2>&1
timeout /t 5 /nobreak
exit /b
