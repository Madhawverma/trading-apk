export type MarketCategory = 'All' | 'Forex' | 'Crypto' | 'Metals' | 'Indices';

export interface SymbolData {
  id: string;
  name: string;
  fullName: string;
  category: 'Forex' | 'Crypto' | 'Metals' | 'Indices';
  bid: number;
  ask: number;
  spread: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  digits: number;
  sparkline: number[];
  contractSize: number;
}

export type OrderType = 'BUY' | 'SELL';

export interface Position {
  id: string;
  symbolId: string;
  symbolName: string;
  type: OrderType;
  lots: number;
  openPrice: number;
  currentPrice: number;
  sl?: number;
  tp?: number;
  pnl: number;
  openTime: string;
}

export interface ClosedOrder extends Position {
  closePrice: number;
  closeTime: string;
}

export interface TradingAccount {
  accountNumber: string;
  server: string;
  type: 'Demo' | 'Real';
  currency: string;
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  leverage: string;
}
