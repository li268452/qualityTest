@echo off
REM ==========================================
REM SonarQube 停止脚本
REM ==========================================

set SONAR_HOME=D:\代码质量测试功能\sonarqube-26.3.0.120487

echo ========================================
echo 停止 SonarQube
echo ========================================
echo.

REM 方法1：尝试用 SonarQube 的停止脚本
if exist "%SONAR_HOME%\bin\windows-x86-64\StopSonar.bat" (
    echo [信息] 使用 SonarQube 停止脚本...
    call "%SONAR_HOME%\bin\windows-x86-64\StopSonar.bat"
    goto :end
)

REM 方法2：使用任务管理器命令
echo [信息] 正在停止 SonarQube 进程...

REM 查找并停止 SonarQube 相关的 Java 进程
wmic process where "commandline like '%%sonarqube%%'" delete >nul 2>&1

REM 等待进程结束
timeout /t 3 /nobreak

REM 检查是否还在运行
tasklist | findstr /I "java.exe" | findstr /I "sonar" >nul 2>&1
if errorlevel 1 (
    echo [OK] SonarQube 已停止
) else (
    echo [警告] SonarQube 可能仍在运行
    echo.
    echo 请手动检查任务管理器中的 java.exe 进程
)

:end
echo.
pause
