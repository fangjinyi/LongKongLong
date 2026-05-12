import React from 'react';
import type { Stock } from '../types/stock';
import { StockCard } from './StockCard';

interface StockListProps {
  stocks: Stock[];
  loading: boolean;
  onStockClick: (stock: Stock) => void;
  onRefresh: () => void;
}

export const StockList: React.FC<StockListProps> = ({
  stocks,
  loading,
  onStockClick,
  onRefresh,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glass-card rounded-xl p-5 h-48">
            <div className="loading-skeleton h-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-white mb-2">暂无涨停股票</h3>
        <p className="text-zinc-400 mb-6">当前时段没有涨停股票，请稍后再试</p>
        <button
          onClick={onRefresh}
          className="btn-primary"
        >
          刷新数据
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-white glow-text">今日涨停</h2>
          <span className="px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-sm font-semibold">
            {stocks.length} 只
          </span>
        </div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-primary-800/50 border border-primary-700 rounded-lg text-white hover:bg-primary-700/50 transition-all flex items-center gap-2"
        >
          <svg
            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          刷新
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stocks.map((stock, index) => (
          <div
            key={stock.code}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <StockCard
              stock={stock}
              onClick={() => onStockClick(stock)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
