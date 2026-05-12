import pandas as pd
from mootdx import Stock
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)


class StockService:
    def __init__(self):
        self.client = Stock()

    def get_limit_up_stocks(self) -> List[dict]:
        """获取今日涨停股票列表"""
        try:
            df = self.client.limit_list()
            if df is None or df.empty:
                logger.warning("未获取到涨停股票数据")
                return []

            # 数据清洗和格式化
            stocks = []
            for _, row in df.iterrows():
                try:
                    stock = self._format_stock_data(row)
                    if stock:
                        stocks.append(stock)
                except Exception as e:
                    logger.error(f"处理股票数据时出错: {e}")
                    continue

            # 按涨停时间排序（早涨停的在前）
            stocks.sort(key=lambda x: x.get('limit_up_time', '99:99:99'))
            return stocks

        except Exception as e:
            logger.error(f"获取涨停股票列表失败: {e}")
            return []

    def _format_stock_data(self, row: pd.Series) -> Optional[dict]:
        """格式化股票数据"""
        try:
            code = str(row.get('代码', '')).zfill(6)
            if not code or len(code) != 6:
                return None

            # 获取前收盘价计算涨幅
            close = float(row.get('涨停价', 0))
            prev_close = float(row.get('昨收', row.get('收盘', close * 0.9)))

            if prev_close > 0:
                change_pct = ((close - prev_close) / prev_close) * 100
            else:
                change_pct = 0

            # 格式化时间
            limit_time = row.get('涨停时间', '')
            if pd.notna(limit_time):
                limit_time = str(limit_time)
            else:
                limit_time = None

            # 转换成交量单位（手）
            volume = float(row.get('成交量', 0)) / 10000  # 转为万手

            # 转换成交额单位（万元）
            amount = float(row.get('成交额', 0)) / 10000  # 转为万元

            # 封单金额（万元）
            seal_amount = float(row.get('封单额', 0)) / 10000 if pd.notna(row.get('封单额')) else None

            # 流通市值（亿元）
            market_cap = float(row.get('流通市值', 0)) / 100000000 if pd.notna(row.get('流通市值')) else None

            return {
                'code': code,
                'name': str(row.get('名称', '')),
                'close': round(close, 2),
                'prev_close': round(prev_close, 2),
                'change_pct': round(change_pct, 2),
                'turnover_rate': round(float(row.get('换手率', 0)), 2),
                'volume': round(volume, 2),
                'amount': round(amount, 2),
                'limit_up_time': limit_time,
                'seal_amount': round(seal_amount, 2) if seal_amount else None,
                'market_cap': round(market_cap, 2) if market_cap else None,
            }

        except Exception as e:
            logger.error(f"格式化股票数据出错: {e}")
            return None

    def get_kline_data(self, code: str, period: str = 'daily') -> Optional[dict]:
        """获取股票 K 线数据"""
        try:
            # 标准化股票代码
            code = code.zfill(6)

            # 获取日 K 线数据
            df = self.client.daily(symbol=code)

            if df is None or df.empty:
                logger.warning(f"未获取到股票 {code} 的 K 线数据")
                return None

            # 获取股票名称
            name = self._get_stock_name(code)

            # 转换数据格式
            kline_data = []
            for date, row in df.iterrows():
                kline_data.append({
                    'date': date.strftime('%Y-%m-%d') if hasattr(date, 'strftime') else str(date),
                    'open': round(float(row.get('open', 0)), 2),
                    'high': round(float(row.get('high', 0)), 2),
                    'low': round(float(row.get('low', 0)), 2),
                    'close': round(float(row.get('close', 0)), 2),
                    'volume': float(row.get('volume', 0)),
                })

            # 只返回最近 120 个交易日的数据
            kline_data = kline_data[-120:]

            return {
                'code': code,
                'name': name,
                'period': period,
                'data': kline_data
            }

        except Exception as e:
            logger.error(f"获取股票 K 线数据失败: {e}")
            return None

    def _get_stock_name(self, code: str) -> str:
        """获取股票名称"""
        try:
            info = self.client.info(symbol=code)
            if info is not None and not info.empty:
                return str(info.iloc[0].get('name', code))
        except:
            pass
        return code

    def get_realtime_quote(self, code: str) -> Optional[dict]:
        """获取股票实时行情"""
        try:
            code = code.zfill(6)
            df = self.client.realtime(symbols=code)

            if df is None or df.empty:
                return None

            return {
                'code': code,
                'name': str(df.iloc[0].get('name', code)),
                'price': float(df.iloc[0].get('price', 0)),
                'change_pct': float(df.iloc[0].get('change_pct', 0)),
                'volume': float(df.iloc[0].get('volume', 0)),
                'amount': float(df.iloc[0].get('amount', 0)),
            }

        except Exception as e:
            logger.error(f"获取实时行情失败: {e}")
            return None
