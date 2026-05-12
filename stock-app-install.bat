@echo off
chcp 65001 >nul
echo ========================================
echo   涨停股票监控系统 - 安装脚本
echo ========================================
echo.

echo [1/4] 正在安装后端依赖...
cd /d "%~dp0stock-app\backend"
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo 后端依赖安装失败！
    pause
    exit /b 1
)
echo 后端依赖安装完成！
echo.

echo [2/4] 正在安装前端依赖...
cd /d "%~dp0stock-app\frontend"
call npm install
if %errorlevel% neq 0 (
    echo 前端依赖安装失败！
    pause
    exit /b 1
)
echo 前端依赖安装完成！
echo.

echo [3/4] 正在构建前端...
call npm run build
if %errorlevel% neq 0 (
    echo 前端构建失败！
    pause
    exit /b 1
)
echo 前端构建完成！
echo.

echo [4/4] 安装完成！
echo.
echo ========================================
echo   安装成功！
echo ========================================
echo.
echo 启动方式：
echo   - 后端服务：运行 start_backend.bat
echo   - 前端服务：运行 start_frontend.bat
echo.
echo 访问地址：
echo   - 前端：http://localhost:5173
echo   - 后端API：http://localhost:8000
echo.
pause
