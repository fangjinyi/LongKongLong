import React, { useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { KlineData, KlineItem } from '../types/stock';

interface StockChartProps {
  visible: boolean;
  onClose: () => void;
  klineData: KlineData | null;
  loading: boolean;
  stockInfo: {
    code: string;
    name: string;
  } | null;
}

export const StockChart: React.FC<StockChartProps> = ({
  visible,
  onClose,
  klineData,
  loading,
  stockInfo,
}) => {
  const chartRef = useRef<ReactECharts>(null);

  useEffect(() => {
    if (visible && chartRef.current) {
      setTimeout(() => {
        chartRef.current?.getEchartsInstance().resize();
      }, 100);
    }
  }, [visible]);

  if (!visible) return null;

  const calculateMA = (data: KlineItem[], period: number): (number | null)[] => {
    const result: (number | null)[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        result.push(null);
      } else {
        let sum = 0;
        for (let j = 0; j < period; j++) {
          sum += data[i - j].close;
        }
        result.push(+(sum / period).toFixed(2));
      }
    }
    return result;
  };

  const getOption = (): EChartsOption => {
    if (!klineData || !klineData.data || klineData.data.length === 0) {
      return {};
    }

    const data = klineData.data;
    const dates = data.map((item) => item.date);
    const candleData = data.map((item) => [item.open, item.close, item.low, item.high]);
    const volumes = data.map((item) => item.volume);
    const colors = data.map((item) =>
      item.close >= item.open ? '#e94560' : '#00d9a5'
    );

    const ma5 = calculateMA(data, 5);
    const ma10 = calculateMA(data, 10);
    const ma20 = calculateMA(data, 20);

    return {
      backgroundColor: 'transparent',
      animation: true,
      animationDuration: 800,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          lineStyle: {
            color: 'rgba(233, 69, 96, 0.5)',
          },
        },
        backgroundColor: 'rgba(22, 33, 62, 0.95)',
        borderColor: 'rgba(233, 69, 96, 0.3)',
        textStyle: {
          color: '#e4e4e7',
        },
      },
      legend: {
        data: ['K线', 'MA5', 'MA10', 'MA20'],
        top: 10,
        textStyle: {
          color: '#a1a1aa',
        },
      },
      grid: [
        {
          left: '10%',
          right: '8%',
          top: '15%',
          height: '50%',
        },
        {
          left: '10%',
          right: '8%',
          top: '70%',
          height: '20%',
        },
      ],
      xAxis: [
        {
          type: 'category',
          data: dates,
          gridIndex: 0,
          axisLine: {
            lineStyle: {
              color: '#3f3f46',
            },
          },
          axisLabel: {
            color: '#a1a1aa',
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        {
          type: 'category',
          data: dates,
          gridIndex: 1,
          axisLine: {
            lineStyle: {
              color: '#3f3f46',
            },
          },
          axisLabel: {
            color: '#a1a1aa',
            fontSize: 10,
          },
          axisTick: {
            show: false,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          gridIndex: 0,
          scale: true,
          splitNumber: 4,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#a1a1aa',
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(63, 63, 70, 0.3)',
            },
          },
        },
        {
          type: 'value',
          gridIndex: 1,
          scale: true,
          splitNumber: 2,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#a1a1aa',
            fontSize: 10,
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(63, 63, 70, 0.3)',
            },
          },
        },
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: 60,
          end: 100,
        },
        {
          type: 'slider',
          xAxisIndex: [0, 1],
          bottom: '2%',
          height: 20,
          start: 60,
          end: 100,
          textStyle: {
            color: '#a1a1aa',
          },
          borderColor: 'rgba(63, 63, 70, 0.5)',
          fillerColor: 'rgba(233, 69, 96, 0.2)',
          handleStyle: {
            color: '#e94560',
          },
          dataBackground: {
            lineStyle: {
              color: 'rgba(63, 63, 70, 0.5)',
            },
            areaStyle: {
              color: 'rgba(63, 63, 70, 0.2)',
            },
          },
        },
      ],
      series: [
        {
          name: 'K线',
          type: 'candlestick',
          data: candleData,
          xAxisIndex: 0,
          yAxisIndex: 0,
          itemStyle: {
            color: '#e94560',
            color0: '#00d9a5',
            borderColor: '#e94560',
            borderColor0: '#00d9a5',
          },
        },
        {
          name: 'MA5',
          type: 'line',
          data: ma5,
          xAxisIndex: 0,
          yAxisIndex: 0,
          smooth: true,
          lineStyle: {
            width: 1,
            color: '#ffc107',
          },
          symbol: 'none',
        },
        {
          name: 'MA10',
          type: 'line',
          data: ma10,
          xAxisIndex: 0,
          yAxisIndex: 0,
          smooth: true,
          lineStyle: {
            width: 1,
            color: '#00d9ff',
          },
          symbol: 'none',
        },
        {
          name: 'MA20',
          type: 'line',
          data: ma20,
          xAxisIndex: 0,
          yAxisIndex: 0,
          smooth: true,
          lineStyle: {
            width: 1,
            color: '#9c27b0',
          },
          symbol: 'none',
        },
        {
          name: '成交量',
          type: 'bar',
          data: volumes,
          xAxisIndex: 1,
          yAxisIndex: 1,
          itemStyle: {
            color: (params: any) => colors[params.dataIndex],
          },
        },
      ],
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-primary-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-primary-700">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {stockInfo?.name || '加载中...'}
            </h2>
            <span className="text-zinc-400 font-mono">{stockInfo?.code}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-800 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-auto" style={{ maxHeight: 'calc(90vh - 100px)' }}>
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-zinc-400">加载走势图...</p>
              </div>
            </div>
          ) : klineData && klineData.data && klineData.data.length > 0 ? (
            <ReactECharts
              ref={chartRef}
              option={getOption()}
              style={{ height: '600px', width: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          ) : (
            <div className="flex items-center justify-center h-96">
              <p className="text-zinc-400">暂无 K 线数据</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
