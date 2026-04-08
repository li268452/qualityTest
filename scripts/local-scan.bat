@echo off
REM ==========================================
REM 本地 SonarQube 扫描脚本
REM ==========================================

echo ========================================
echo 本地 SonarQube 代码扫描
echo ========================================
echo.

REM 检查环境变量
if not defined SONAR_TOKEN (
    echo [错误] 未设置 SONAR_TOKEN 环境变量
    echo.
    echo 请设置环境变量:
    echo set SONAR_TOKEN=你的Token
    echo.
    pause
    exit /b 1
)

if not defined SONAR_HOST_URL (
    echo [错误] 未设置 SONAR_HOST_URL 环境变量
    echo.
    echo 请设置环境变量:
    echo set SONAR_HOST_URL=http://localhost:9000
    echo.
    pause
    exit /b 1
)

echo [信息] SonarQube 地址: %SONAR_HOST_URL%
echo [信息] 项目 Key: code-quality-test
echo.

REM 检查是否安装了 sonar-scanner
where sonar-scanner >nul 2>&1
if errorlevel 1 (
    echo [信息] 未找到 sonar-scanner
    echo.
    echo 请安装 sonar-scanner:
    echo 方法1 - 使用 npm (推荐):
    echo   npm install -g sonar-scanner
    echo.
    echo 方法2 - 下载安装包:
    echo   https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/
    echo.
    pause
    exit /b 1
)

echo [1/3] 运行 ESLint 检查...
call npm run lint
if errorlevel 1 (
    echo [错误] ESLint 检查失败，请先修复代码规范问题
    pause
    exit /b 1
)

echo [OK] ESLint 检查通过
echo.

echo [2/3] 运行 SonarQube 扫描...
echo 这可能需要 1-2 分钟...
echo.

sonar-scanner ^
  -Dsonar.projectKey=code-quality-test ^
  -Dsonar.projectName=代码质量测试项目 ^
  -Dsonar.sources=src ^
  -Dsonar.host.url=%SONAR_HOST_URL% ^
  -Dsonar.login=%SONAR_TOKEN%

if errorlevel 1 (
    echo [错误] SonarQube 扫描失败
    pause
    exit /b 1
)

echo.
echo [OK] SonarQube 扫描完成
echo.

echo [3/3] 查看扫描报告...
echo.
echo 在浏览器中打开以下地址查看报告:
echo %SONAR_HOST_URL%/dashboard?id=code-quality-test
echo.
echo 按任意键打开浏览器...
pause >nul

start "" "%SONAR_HOST_URL%/dashboard?id=code-quality-test"

echo.
echo ========================================
echo 扫描完成
echo ========================================
pause
