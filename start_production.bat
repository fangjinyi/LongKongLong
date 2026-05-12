@echo off
chcp 65001 >nul
echo 正在启动生产环境...
cd /d "%~dp0stock-app\frontend\dist"
echo 访问地址：http://localhost:8080
echo 按 Ctrl+C 停止服务
echo.
python -m http.server 8080
pause
