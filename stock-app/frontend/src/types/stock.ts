export interface Stock {
  code: string;
  name: string;
  close: number;
  prev_close: number;
  change_pct: number;
  turnover_rate: number;
  volume: number;
  amount: number;
  limit_up_time: string | null;
  seal_amount: number | null;
  market_cap: number | null;
}

export interface StockListResponse {
  success: boolean;
  data: Stock[];
  timestamp: string;
  total: number;
  message?: string;
}

export interface KlineItem {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface KlineData {
  code: string;
  name: string;
  period: string;
  data: KlineItem[];
}

export interface KlineResponse {
  success: boolean;
  data: KlineData | null;
  message?: string;
}
