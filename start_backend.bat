@echo off
chcp 65001 >nul
echo 正在启动后端服务...
cd /d "%~dp0stock-app\backend"
echo 后端服务将在 http://localhost:8000 启动
echo 按 Ctrl+C 停止服务
echo.
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
pause
