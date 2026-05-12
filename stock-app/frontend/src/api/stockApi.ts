import axios from 'axios';
import type { StockListResponse, KlineResponse } from '../types/stock';

const API_BASE_URL = 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const stockApi = {
  async getLimitUpStocks(): Promise<StockListResponse> {
    try {
      const response = await apiClient.get<StockListResponse>('/api/stocks/limit-up');
      return response.data;
    } catch (error) {
      console.error('获取涨停股票失败:', error);
      return {
        success: false,
        data: [],
        timestamp: new Date().toISOString(),
        total: 0,
        message: error instanceof Error ? error.message : '获取数据失败',
      };
    }
  },

  async getKlineData(code: string, period: string = 'daily'): Promise<KlineResponse> {
    try {
      const response = await apiClient.get<KlineResponse>(`/api/stock/${code}/kline`, {
        params: { period },
      });
      return response.data;
    } catch (error) {
      console.error('获取K线数据失败:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : '获取数据失败',
      };
    }
  },

  async checkHealth(): Promise<boolean> {
    try {
      const response = await apiClient.get('/api/health');
      return response.data.status === 'ok';
    } catch {
      return false;
    }
  },
};
