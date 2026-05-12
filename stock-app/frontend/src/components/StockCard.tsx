import React from 'react';
import type { Stock } from '../types/stock';

interface StockCardProps {
  stock: Stock;
  onClick: () => void;
}

export const StockCard: React.FC<StockCardProps> = ({ stock, onClick }) => {
  const formatNumber = (num: number | null | undefined, decimals: number = 2) => {
    if (num === null || num === undefined) return '-';
    return num.toFixed(decimals);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 10000) {
      return `${(volume / 10000).toFixed(2)} 亿`;
    }
    return `${volume.toFixed(2)} 万`;
  };

  const formatAmount = (amount: number) => {
    if (amount >= 10000) {
      return `${(amount / 10000).toFixed(2)} 亿`;
    }
    return `${amount.toFixed(2)} 万`;
  };

  return (
    <div
      onClick={onClick}
      className="glass-card rounded-xl p-5 cursor-pointer animate-fade-in"
      style={{ animationDelay: `${Math.random() * 0.5}s` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{stock.name}</h3>
          <span className="text-sm text-zinc-400 font-mono">{stock.code}</span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-accent-500 data-value">
            {formatNumber(stock.close)}
          </div>
          <div className="text-sm text-accent-400 data-value">
            +{formatNumber(stock.change_pct)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-primary-800/50 rounded-lg p-3">
          <div className="text-xs text-zinc-400 mb-1">换手率</div>
          <div className="text-lg font-semibold text-white data-value">
            {formatNumber(stock.turnover_rate)}%
          </div>
        </div>
        <div className="bg-primary-800/50 rounded-lg p-3">
          <div className="text-xs text-zinc-400 mb-1">成交量</div>
          <div className="text-lg font-semibold text-white data-value">
            {formatVolume(stock.volume)}
          </div>
        </div>
        <div className="bg-primary-800/50 rounded-lg p-3">
          <div className="text-xs text-zinc-400 mb-1">成交额</div>
          <div className="text-lg font-semibold text-white data-value">
            {formatAmount(stock.amount)}
          </div>
        </div>
        <div className="bg-primary-800/50 rounded-lg p-3">
          <div className="text-xs text-zinc-400 mb-1">封单额</div>
          <div className="text-lg font-semibold text-success-500 data-value">
            {stock.seal_amount ? formatAmount(stock.seal_amount) : '-'}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-primary-700/50">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-1 rounded bg-accent-500/20 text-accent-400 text-xs font-semibold">
            涨停
          </span>
          {stock.limit_up_time && (
            <span className="text-sm text-zinc-400 data-value">
              {stock.limit_up_time}
            </span>
          )}
        </div>
        <div className="text-xs text-zinc-500">
          流通市值: {stock.market_cap ? `${stock.market_cap}亿` : '-'}
        </div>
      </div>
    </div>
  );
};
