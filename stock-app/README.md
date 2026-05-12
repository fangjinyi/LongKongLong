# 涨停股票监控应用

一个使用 mootdx 库获取东方财富数据的 A 股涨停股票展示应用。

## 功能特性

- 📊 **涨停股票列表**: 实时展示今日所有涨停股票
- 📈 **股票信息**: 显示代码、名称、涨停时间、换手率、成交量、成交额、封单金额等
- 🔍 **走势图**: 点击股票弹出近期 K 线走势图
- 🎨 **专业界面**: 深色金融风格设计

## 技术栈

### 后端
- Python 3.8+
- FastAPI
- mootdx (东方财富数据源)
- uvicorn

### 前端
- React 18
- TypeScript
- TailwindCSS
- ECharts (K 线图)
- Vite

## 项目结构

```
stock-app/
├── backend/              # 后端 API
│   ├── main.py           # FastAPI 主入口
│   ├── models.py         # 数据模型
│   ├── stock_service.py  # 股票数据服务
│   └── requirements.txt  # Python 依赖
├── frontend/             # 前端应用
│   ├── src/
│   │   ├── components/   # React 组件
│   │   ├── api/         # API 调用
│   │   ├── types/       # TypeScript 类型
│   │   └── styles/      # 样式文件
│   └── package.json
└── documents/           # 项目文档
```

## 安装和运行

### 1. 安装后端依赖

```bash
cd stock-app/backend
pip install -r requirements.txt
```

### 2. 启动后端服务

```bash
cd stock-app/backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

后端服务将在 http://localhost:8000 启动

### 3. 安装前端依赖

```bash
cd stock-app/frontend
npm install
```

### 4. 启动前端服务

```bash
npm run dev
```

前端应用将在 http://localhost:5173 启动

## API 接口

### 获取涨停股票列表
```
GET /api/stocks/limit-up
```

响应示例:
```json
{
  "success": true,
  "data": [
    {
      "code": "600519",
      "name": "贵州茅台",
      "close": 1850.00,
      "change_pct": 10.00,
      "turnover_rate": 0.35,
      "volume": 125.6,
      "amount": 2300000,
      "limit_up_time": "09:30:15",
      "seal_amount": 8500,
      "market_cap": 2320.5
    }
  ],
  "total": 50,
  "timestamp": "2024-01-15T10:30:00"
}
```

### 获取股票 K 线数据
```
GET /api/stock/{code}/kline?period=daily
```

响应示例:
```json
{
  "success": true,
  "data": {
    "code": "600519",
    "name": "贵州茅台",
    "period": "daily",
    "data": [
      {
        "date": "2024-01-15",
        "open": 1800.00,
        "high": 1860.00,
        "low": 1795.00,
        "close": 1850.00,
        "volume": 125600
      }
    ]
  }
}
```

## 使用说明

1. 启动后端服务后，打开前端应用
2. 页面会自动加载今日涨停股票列表
3. 点击任意股票卡片查看详细信息
4. 在弹窗中查看股票 K 线走势图
5. 支持缩放和拖动查看历史数据

## 注意事项

- 数据来源为东方财富，通过 mootdx 库获取
- 仅在交易时间内数据较为准确
- 本应用仅供学习参考，不构成投资建议
