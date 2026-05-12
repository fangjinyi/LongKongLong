from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime
from typing import Optional
import logging

from models import (
    StockListResponse,
    KlineResponse,
    HealthResponse,
    Stock,
    KlineData,
    KlineItem
)
from stock_service import StockService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="涨停股票 API",
    description="提供涨停股票列表和 K 线数据查询",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

stock_service = StockService()


@app.get("/", response_model=HealthResponse)
async def health_check():
    """健康检查"""
    return HealthResponse(
        status="ok",
        timestamp=datetime.now().isoformat()
    )


@app.get("/api/health", response_model=HealthResponse)
async def api_health():
    """API 健康检查"""
    return HealthResponse(
        status="ok",
        timestamp=datetime.now().isoformat()
    )


@app.get("/api/stocks/limit-up", response_model=StockListResponse)
async def get_limit_up_stocks():
    """获取今日涨停股票列表"""
    try:
        logger.info("开始获取涨停股票列表...")
        stocks_data = stock_service.get_limit_up_stocks()

        stocks = [Stock(**stock) for stock in stocks_data]

        logger.info(f"成功获取 {len(stocks)} 只涨停股票")

        return StockListResponse(
            success=True,
            data=stocks,
            timestamp=datetime.now().isoformat(),
            total=len(stocks),
            message="获取成功" if stocks else "暂无涨停股票"
        )

    except Exception as e:
        logger.error(f"获取涨停股票列表失败: {e}")
        return StockListResponse(
            success=False,
            data=[],
            timestamp=datetime.now().isoformat(),
            total=0,
            message=f"获取失败: {str(e)}"
        )


@app.get("/api/stock/{code}/kline", response_model=KlineResponse)
async def get_stock_kline(
    code: str,
    period: str = Query("daily", description="K线周期: daily/weekly/monthly")
):
    """获取股票 K 线数据"""
    try:
        logger.info(f"获取股票 {code} 的 K 线数据, 周期: {period}")

        kline_data = stock_service.get_kline_data(code, period)

        if kline_data is None:
            return KlineResponse(
                success=False,
                data=None,
                message=f"未找到股票 {code} 的 K 线数据"
            )

        # 转换为 Pydantic 模型
        kline_items = [KlineItem(**item) for item in kline_data['data']]
        kline_model = KlineData(
            code=kline_data['code'],
            name=kline_data['name'],
            period=kline_data['period'],
            data=kline_items
        )

        return KlineResponse(
            success=True,
            data=kline_model,
            message="获取成功"
        )

    except Exception as e:
        logger.error(f"获取 K 线数据失败: {e}")
        return KlineResponse(
            success=False,
            data=None,
            message=f"获取失败: {str(e)}"
        )


@app.get("/api/stock/{code}/realtime")
async def get_stock_realtime(code: str):
    """获取股票实时行情"""
    try:
        quote = stock_service.get_realtime_quote(code)

        if quote is None:
            raise HTTPException(status_code=404, detail=f"未找到股票 {code} 的实时数据")

        return JSONResponse({
            "success": True,
            "data": quote,
            "timestamp": datetime.now().isoformat()
        })

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"获取实时行情失败: {e}")
        return JSONResponse({
            "success": False,
            "message": f"获取失败: {str(e)}"
        })


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
