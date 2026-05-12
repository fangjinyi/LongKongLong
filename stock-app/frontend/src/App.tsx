import { useState, useEffect } from 'react';
import { StockList } from './components/StockList';
import { StockChart } from './components/StockChart';
import { stockApi } from './api/stockApi';
import type { Stock, KlineData } from './types/stock';

function App() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartVisible, setChartVisible] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [klineData, setKlineData] = useState<KlineData | null>(null);
  const [selectedStock, setSelectedStock] = useState<{ code: string; name: string } | null>(null);

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const response = await stockApi.getLimitUpStocks();
      if (response.success) {
        setStocks(response.data);
      } else {
        console.error('获取失败:', response.message);
      }
    } catch (error) {
      console.error('获取涨停股票失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleStockClick = async (stock: Stock) => {
    setSelectedStock({ code: stock.code, name: stock.name });
    setChartVisible(true);
    setChartLoading(true);
    setKlineData(null);

    try {
      const response = await stockApi.getKlineData(stock.code);
      if (response.success && response.data) {
        setKlineData(response.data);
      }
    } catch (error) {
      console.error('获取K线数据失败:', error);
    } finally {
      setChartLoading(false);
    }
  };

  const handleCloseChart = () => {
    setChartVisible(false);
    setSelectedStock(null);
    setKlineData(null);
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 glass-card rounded-none border-b border-primary-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl">📈</div>
              <div>
                <h1 className="text-2xl font-bold text-white glow-text">涨停监控</h1>
                <p className="text-sm text-zinc-400">实时追踪 A 股涨停股票</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
                <span className="text-zinc-400">数据来源: 东方财富</span>
              </div>
              <div className="text-zinc-500 font-mono">
                {new Date().toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <StockList
          stocks={stocks}
          loading={loading}
          onStockClick={handleStockClick}
          onRefresh={fetchStocks}
        />
      </main>

      <footer className="border-t border-primary-800 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
            <p>数据仅供参考，不构成投资建议</p>
            <p>使用 mootdx 库获取东方财富数据</p>
          </div>
        </div>
      </footer>

      <StockChart
        visible={chartVisible}
        onClose={handleCloseChart}
        klineData={klineData}
        loading={chartLoading}
        stockInfo={selectedStock}
      />
    </div>
  );
}

export default App;
