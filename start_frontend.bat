@echo off
chcp 65001 >nul
echo 正在启动前端服务...
cd /d "%~dp0stock-app\frontend"
echo 前端服务将在 http://localhost:5173 启动
echo 按 Ctrl+C 停止服务
echo.
npm run dev
pause
