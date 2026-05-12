from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class Stock(BaseModel):
    code: str
    name: str
    close: float
    change_pct: float
    turnover_rate: float
    volume: float
    amount: float
    limit_up_time: Optional[str] = None
    seal_amount: Optional[float] = None
    market_cap: Optional[float] = None
    prev_close: Optional[float] = None


class StockListResponse(BaseModel):
    success: bool
    data: List[Stock]
    timestamp: str
    total: int
    message: Optional[str] = None


class KlineItem(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: float


class KlineData(BaseModel):
    code: str
    name: str
    period: str
    data: List[KlineItem]


class KlineResponse(BaseModel):
    success: bool
    data: Optional[KlineData] = None
    message: Optional[str] = None


class HealthResponse(BaseModel):
    status: str
    timestamp: str
