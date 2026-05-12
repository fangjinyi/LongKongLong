# 涨停股票展示应用 - 技术架构文档

## 1. 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                      前端 (React + Vite)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  股票列表组件 │  │  走势图弹窗  │  │   数据可视化     │  │
│  │ StockList    │  │ StockChart   │  │   (ECharts)      │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕ HTTP API
┌─────────────────────────────────────────────────────────────┐
│                     后端 (Python FastAPI)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   API 路由   │  │  mootdx 数据 │  │   数据处理服务   │  │
│  │  /api/stocks │  │   获取层     │  │                  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                      东方财富数据源                          │
│  (通过 mootdx 库实时获取)                                    │
└─────────────────────────────────────────────────────────────┘
```

## 2. 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **图表**: ECharts (echarts-for-react)
- **HTTP 客户端**: axios
- **状态管理**: React Hooks (useState, useEffect)

### 后端
- **框架**: FastAPI (Python 3.8+)
- **数据源**: mootdx 库
- **ASGI 服务器**: uvicorn
- **数据格式**: JSON

## 3. 路由定义

### 前端路由
| 路径 | 组件 | 说明 |
|------|------|------|
| / | StockDashboard | 主页面，包含股票列表 |

### 后端 API
| 方法 | 路径 | 说明 | 响应 |
|------|------|------|------|
| GET | /api/stocks/limit-up | 获取今日涨停股票列表 | Stock[] |
| GET | /api/stock/{code}/kline | 获取股票 K 线数据 | KlineData |
| GET | /api/health | 健康检查 | {status: ok} |

## 4. API 定义

### 4.1 获取涨停股票列表
```typescript
// GET /api/stocks/limit-up

interface Stock {
  code: string;        // 股票代码
  name: string;        // 股票名称
  close: number;       // 收盘价（涨停价）
  change_pct: number;   // 涨幅百分比
  turnover_rate: number; // 换手率
  volume: number;       // 成交量（万手）
  amount: number;       // 成交额（万元）
  limit_up_time: string; // 涨停时间
  seal_amount: number;  // 封单金额（万元）
  market_cap: number;   // 流通市值（亿元）
}

interface Response {
  success: boolean;
  data: Stock[];
  timestamp: string;
  total: number;
}
```

### 4.2 获取股票 K 线数据
```typescript
// GET /api/stock/{code}/kline?period=daily

interface KlineData {
  code: string;
  name: string;
  period: string;
  data: Array<{
    date: string;      // 日期
    open: number;      // 开盘价
    high: number;      // 最高价
    low: number;       // 最低价
    close: number;     // 收盘价
    volume: number;     // 成交量
  }>;
}

interface KlineResponse {
  success: boolean;
  data: KlineData;
}
```

## 5. 数据模型

### 5.1 涨停股票数据结构
```typescript
// 来自 mootdx 的涨停数据
{
  "代码": "600519",
  "名称": "贵州茅台",
  "涨停价": 1850.00,
  "涨幅": 10.00,
  "换手率": 0.35,
  "成交量": 125.6,
  "成交额": 2300000,
  "涨停时间": "09:30:15",
  "封单额": 8500,
  "流通市值": 2320.5
}
```

### 5.2 K 线数据结构
```typescript
// 来自 mootdx 的历史 K 线
{
  "date": "2024-01-15",
  "open": 1800.00,
  "high": 1860.00,
  "low": 1795.00,
  "close": 1850.00,
  "volume": 125600
}
```

## 6. 项目结构

```
/workspace/stock-app/
├── backend/
│   ├── main.py              # FastAPI 主入口
│   ├── requirements.txt     # Python 依赖
│   └── services/
│       └── stock_service.py # 股票数据服务
├── frontend/
│   ├── src/
│   │   ├── App.tsx          # 主应用
│   │   ├── main.tsx        # 入口文件
│   │   ├── components/
│   │   │   ├── StockList.tsx      # 股票列表组件
│   │   │   ├── StockCard.tsx      # 股票卡片组件
│   │   │   └── StockChart.tsx      # 走势图组件
│   │   ├── api/
│   │   │   └── stockApi.ts        # API 调用
│   │   ├── types/
│   │   │   └── stock.ts           # 类型定义
│   │   └── styles/
│   │       └── index.css          # 全局样式
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
└── README.md
```

## 7. 关键实现说明

### 7.1 mootdx 数据获取
- 使用 `mootdx.Stock().limit_list()` 获取涨停股票
- 使用 `mootdx.Stock().daily()` 获取历史 K 线
- 数据清洗和格式化

### 7.2 前端 ECharts 配置
- K 线图使用 Candlestick 类型
- 均线使用 Line 类型叠加
- 成交量使用 Bar 类型
- 自适应窗口大小

### 7.3 CORS 配置
- 后端配置 CORS 允许前端访问
- 开发环境：localhost:5173
- 生产环境：配置实际域名
