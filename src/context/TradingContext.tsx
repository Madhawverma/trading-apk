import React, { createContext, useContext, useState, useEffect } from 'react';
import { SymbolData, Position, ClosedOrder, TradingAccount, OrderType } from '../types/trading';

const INITIAL_SYMBOLS: SymbolData[] = [
  {
    id: 'XAUUSD',
    name: 'XAU/USD',
    fullName: 'Gold vs US Dollar',
    category: 'Metals',
    bid: 2735.45,
    ask: 2735.62,
    spread: 1.7,
    changePercent: 1.24,
    high24h: 2748.20,
    low24h: 2718.50,
    digits: 2,
    sparkline: [2720, 2724, 2719, 2730, 2728, 2735.45],
    contractSize: 100,
  },
  {
    id: 'EURUSD',
    name: 'EUR/USD',
    fullName: 'Euro vs US Dollar',
    category: 'Forex',
    bid: 1.08452,
    ask: 1.08460,
    spread: 0.8,
    changePercent: -0.32,
    high24h: 1.08910,
    low24h: 1.08310,
    digits: 5,
    sparkline: [1.088, 1.087, 1.085, 1.086, 1.0845],
    contractSize: 100000,
  },
  {
    id: 'BTCUSD',
    name: 'BTC/USD',
    fullName: 'Bitcoin vs US Dollar',
    category: 'Crypto',
    bid: 67840.50,
    ask: 67855.00,
    spread: 14.5,
    changePercent: 3.48,
    high24h: 68400.00,
    low24h: 65920.00,
    digits: 2,
    sparkline: [66000, 66400, 67100, 66900, 67840.5],
    contractSize: 1,
  },
  {
    id: 'GBPUSD',
    name: 'GBP/USD',
    fullName: 'Great Britain Pound vs USD',
    category: 'Forex',
    bid: 1.29840,
    ask: 1.29851,
    spread: 1.1,
    changePercent: 0.15,
    high24h: 1.30210,
    low24h: 1.29650,
    digits: 5,
    sparkline: [1.297, 1.298, 1.300, 1.2975, 1.2984],
    contractSize: 100000,
  },
  {
    id: 'USOIL',
    name: 'USOIL',
    fullName: 'Crude Oil WTI',
    category: 'Metals',
    bid: 71.85,
    ask: 71.89,
    spread: 4.0,
    changePercent: -1.05,
    high24h: 73.10,
    low24h: 71.20,
    digits: 2,
    sparkline: [73.0, 72.5, 72.8, 72.1, 71.85],
    contractSize: 1000,
  },
  {
    id: 'USTEC',
    name: 'USTEC (NAS100)',
    fullName: 'US Tech 100 Index',
    category: 'Indices',
    bid: 20385.20,
    ask: 20387.00,
    spread: 1.8,
    changePercent: 0.88,
    high24h: 20450.00,
    low24h: 20210.00,
    digits: 2,
    sparkline: [20250, 20300, 20280, 20360, 20385],
    contractSize: 1,
  },
  {
    id: 'USDJPY',
    name: 'USD/JPY',
    fullName: 'US Dollar vs Japanese Yen',
    category: 'Forex',
    bid: 152.420,
    ask: 152.432,
    spread: 1.2,
    changePercent: 0.42,
    high24h: 153.100,
    low24h: 151.800,
    digits: 3,
    sparkline: [151.9, 152.1, 152.0, 152.5, 152.42],
    contractSize: 100000,
  },
];

interface TradingContextType {
  account: TradingAccount;
  symbols: SymbolData[];
  selectedSymbol: SymbolData;
  setSelectedSymbol: (symbol: SymbolData) => void;
  positions: Position[];
  closedOrders: ClosedOrder[];
  openPosition: (symbol: SymbolData, type: OrderType, lots: number, sl?: number, tp?: number) => void;
  closePosition: (id: string) => void;
  toggleAccountType: () => void;
  depositFunds: (amount: number) => void;
  recentPriceUpdate: { [symbolId: string]: 'up' | 'down' | null };
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<TradingAccount>({
    accountNumber: '92841042',
    server: 'Exness-Standard',
    type: 'Demo',
    currency: 'USD',
    balance: 10000.00,
    equity: 10000.00,
    margin: 0,
    freeMargin: 10000.00,
    marginLevel: 0,
    leverage: '1:2000',
  });

  const [symbols, setSymbols] = useState<SymbolData[]>(INITIAL_SYMBOLS);
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolData>(INITIAL_SYMBOLS[0]);
  const [positions, setPositions] = useState<Position[]>([]);

  const [closedOrders, setClosedOrders] = useState<ClosedOrder[]>([
    {
      id: 'pos-099',
      symbolId: 'EURUSD',
      symbolName: 'EUR/USD',
      type: 'BUY',
      lots: 0.50,
      openPrice: 1.08210,
      currentPrice: 1.08410,
      closePrice: 1.08410,
      pnl: 100.00,
      openTime: '09:12:00',
      closeTime: '10:45:12',
    }
  ]);

  const [recentPriceUpdate, setRecentPriceUpdate] = useState<{ [symbolId: string]: 'up' | 'down' | null }>({});

  // Market Price Simulation (Live Ticks like Real MT5/Exness Feed)
  useEffect(() => {
    const interval = setInterval(() => {
      setSymbols(prevSymbols =>
        prevSymbols.map(sym => {
          // Random tiny price fluctuation
          const varianceMultiplier = (Math.random() - 0.49) * 0.0008;
          const delta = sym.bid * varianceMultiplier;
          const newBid = Number((sym.bid + delta).toFixed(sym.digits));
          const spreadDiff = sym.spread * (10 ** -sym.digits);
          const newAsk = Number((newBid + spreadDiff).toFixed(sym.digits));
          
          const isUp = newBid >= sym.bid;
          
          setRecentPriceUpdate(prev => ({
            ...prev,
            [sym.id]: isUp ? 'up' : 'down'
          }));

          const updatedSparkline = [...sym.sparkline.slice(1), newBid];

          return {
            ...sym,
            bid: newBid,
            ask: newAsk,
            sparkline: updatedSparkline,
            high24h: Math.max(sym.high24h, newAsk),
            low24h: Math.min(sym.low24h, newBid),
          };
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Update selectedSymbol when symbols list changes
  useEffect(() => {
    const fresh = symbols.find(s => s.id === selectedSymbol.id);
    if (fresh) {
      setSelectedSymbol(fresh);
    }
  }, [symbols]);

  // Recalculate floating PnL and Account Equity/Margin
  useEffect(() => {
    let totalPnl = 0;
    let totalMarginUsed = 0;

    const updatedPositions = positions.map(pos => {
      const liveSym = symbols.find(s => s.id === pos.symbolId);
      if (!liveSym) return pos;

      const currentPrice = pos.type === 'BUY' ? liveSym.bid : liveSym.ask;
      const priceDiff = pos.type === 'BUY' 
        ? currentPrice - pos.openPrice 
        : pos.openPrice - currentPrice;

      const pnl = Number((priceDiff * pos.lots * liveSym.contractSize).toFixed(2));
      totalPnl += pnl;

      // Margin estimate (1:2000 leverage)
      const margin = (pos.openPrice * pos.lots * liveSym.contractSize) / 2000;
      totalMarginUsed += margin;

      return {
        ...pos,
        currentPrice,
        pnl,
      };
    });

    const newEquity = Number((account.balance + totalPnl).toFixed(2));
    const newMargin = Number(totalMarginUsed.toFixed(2));
    const freeMargin = Number((newEquity - newMargin).toFixed(2));
    const marginLevel = newMargin > 0 ? Number(((newEquity / newMargin) * 100).toFixed(1)) : 0;

    setAccount(prev => ({
      ...prev,
      equity: newEquity,
      margin: newMargin,
      freeMargin: freeMargin,
      marginLevel: marginLevel,
    }));
  }, [symbols]);

  const openPosition = (symbol: SymbolData, type: OrderType, lots: number, sl?: number, tp?: number) => {
    const execPrice = type === 'BUY' ? symbol.ask : symbol.bid;
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    const newPos: Position = {
      id: `pos-${Date.now().toString().slice(-5)}`,
      symbolId: symbol.id,
      symbolName: symbol.name,
      type,
      lots,
      openPrice: execPrice,
      currentPrice: execPrice,
      sl,
      tp,
      pnl: 0,
      openTime: timeStr,
    };

    setPositions(prev => [newPos, ...prev]);
  };

  const closePosition = (id: string) => {
    const pos = positions.find(p => p.id === id);
    if (!pos) return;

    const now = new Date();
    const closed: ClosedOrder = {
      ...pos,
      closePrice: pos.currentPrice,
      closeTime: now.toTimeString().split(' ')[0],
    };

    // Realize P&L to balance
    setAccount(prev => ({
      ...prev,
      balance: Number((prev.balance + pos.pnl).toFixed(2)),
    }));

    setClosedOrders(prev => [closed, ...prev]);
    setPositions(prev => prev.filter(p => p.id !== id));
  };

  const toggleAccountType = () => {
    setAccount(prev => ({
      ...prev,
      type: prev.type === 'Demo' ? 'Real' : 'Demo',
      balance: prev.type === 'Demo' ? 520.40 : 10000.00,
    }));
  };

  const depositFunds = (amount: number) => {
    setAccount(prev => ({
      ...prev,
      balance: Number((prev.balance + amount).toFixed(2)),
      equity: Number((prev.equity + amount).toFixed(2)),
    }));
  };

  return (
    <TradingContext.Provider
      value={{
        account,
        symbols,
        selectedSymbol,
        setSelectedSymbol,
        positions,
        closedOrders,
        openPosition,
        closePosition,
        toggleAccountType,
        depositFunds,
        recentPriceUpdate,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) throw new Error('useTrading must be used within a TradingProvider');
  return context;
};
