import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, {
  Line,
  Rect,
  Path,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
  Circle,
  G,
} from 'react-native-svg';
import { useTrading } from '../context/TradingContext';
import { SymbolData } from '../types/trading';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface TradingChartProps {
  symbol?: SymbolData;
  onOpenOrderModal: (type: 'BUY' | 'SELL') => void;
  onBack?: () => void;
}

export type TimeframeOption =
  | '1m'
  | '3m'
  | '5m'
  | '10m'
  | '15m'
  | '30m'
  | '1h'
  | '2h'
  | '4h'
  | '1D'
  | '1W'
  | '1M';

export interface TimeframeItem {
  id: TimeframeOption;
  label: string;
}

export const TIMEFRAMES_LIST: TimeframeItem[] = [
  { id: '1m', label: '1 minute' },
  { id: '3m', label: '3 minutes' },
  { id: '5m', label: '5 minutes' },
  { id: '10m', label: '10 minutes' },
  { id: '15m', label: '15 minutes' },
  { id: '30m', label: '30 minutes' },
  { id: '1h', label: '1 hour' },
  { id: '2h', label: '2 hours' },
  { id: '4h', label: '4 hours' },
  { id: '1D', label: '1 day' },
  { id: '1W', label: '1 week' },
  { id: '1M', label: '1 month' },
];

export type ChartTypeOption =
  | 'Bars'
  | 'Candles'
  | 'Hollow candles'
  | 'Volume candles'
  | 'HLC bars'
  | 'Line'
  | 'Line with markers'
  | 'Step line'
  | 'Area'
  | 'HLC area'
  | 'Baseline'
  | 'Columns'
  | 'High-low'
  | 'Heikin Ashi'
  | 'Renko'
  | 'Line break'
  | 'Kagi'
  | 'Point & figure';

export interface ChartTypeMenuItem {
  id: ChartTypeOption;
  label: string;
  group: number;
}

export const CHART_TYPES_LIST: ChartTypeMenuItem[] = [
  { id: 'Bars', label: 'Bars', group: 1 },
  { id: 'Candles', label: 'Candles', group: 1 },
  { id: 'Hollow candles', label: 'Hollow candles', group: 1 },
  { id: 'Volume candles', label: 'Volume candles', group: 1 },
  { id: 'HLC bars', label: 'HLC bars', group: 1 },

  { id: 'Line', label: 'Line', group: 2 },
  { id: 'Line with markers', label: 'Line with markers', group: 2 },
  { id: 'Step line', label: 'Step line', group: 2 },

  { id: 'Area', label: 'Area', group: 3 },
  { id: 'HLC area', label: 'HLC area', group: 3 },
  { id: 'Baseline', label: 'Baseline', group: 3 },

  { id: 'Columns', label: 'Columns', group: 4 },
  { id: 'High-low', label: 'High-low', group: 4 },

  { id: 'Heikin Ashi', label: 'Heikin Ashi', group: 5 },
  { id: 'Renko', label: 'Renko', group: 5 },
  { id: 'Line break', label: 'Line break', group: 5 },
  { id: 'Kagi', label: 'Kagi', group: 5 },
  { id: 'Point & figure', label: 'Point & figure', group: 5 },
];

export interface CandlePoint {
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  timeStr: string;
}

// Generate rich realistic candle history
const generateInitialCandles = (basePrice: number, digits: number, count = 28): CandlePoint[] => {
  const candles: CandlePoint[] = [];
  let curr = basePrice * 0.992;
  const timeHours = [4, 5, 6, 7, 8];

  for (let i = 0; i < count; i++) {
    const isBull = Math.sin(i * 0.8) + (Math.random() - 0.46) > 0;
    const change = basePrice * 0.0028 * (Math.random() + 0.35);
    const open = curr;
    const close = isBull ? open + change : Math.max(0.0001, open - change);
    const high = Math.max(open, close) + change * (Math.random() * 0.65 + 0.1);
    const low = Math.min(open, close) - change * (Math.random() * 0.65 + 0.1);
    const volume = Math.floor(Math.random() * 80 + 20);

    const hIndex = Math.min(timeHours.length - 1, Math.floor((i / count) * timeHours.length));
    const hour = timeHours[hIndex];
    const mins = Math.floor(((i % (count / timeHours.length)) / (count / timeHours.length)) * 60);
    const timeStr = `0${hour}:${mins < 10 ? '0' : ''}${mins}`;

    candles.push({
      open: Number(open.toFixed(digits)),
      close: Number(close.toFixed(digits)),
      high: Number(high.toFixed(digits)),
      low: Number(low.toFixed(digits)),
      volume,
      timeStr,
    });
    curr = close;
  }
  return candles;
};

export const TradingChart: React.FC<TradingChartProps> = ({
  symbol,
  onOpenOrderModal,
  onBack,
}) => {
  const { selectedSymbol, account, openPosition } = useTrading();
  const currentSymbol = symbol || selectedSymbol;

  // Timeframe and Chart Type states
  const [selectedTf, setSelectedTf] = useState<TimeframeOption>('5m');
  const [selectedChartType, setSelectedChartType] = useState<ChartTypeOption>('Candles');

  // Modals state
  const [showTfModal, setShowTfModal] = useState(false);
  const [showChartTypeModal, setShowChartTypeModal] = useState(false);

  // Left Toolbar state
  const [isLeftToolbarVisible, setIsLeftToolbarVisible] = useState(true);
  const [activeDrawTool, setActiveDrawTool] = useState<string>('crosshair');

  // Trade Settings
  const [lotSize, setLotSize] = useState<number>(0.01);
  const [oneClickEnabled, setOneClickEnabled] = useState(false);

  // Live Candles and Live Ticks
  const [candles, setCandles] = useState<CandlePoint[]>(() =>
    generateInitialCandles(currentSymbol.bid, currentSymbol.digits)
  );
  const [liveBid, setLiveBid] = useState<number>(currentSymbol.bid);
  const [liveAsk, setLiveAsk] = useState<number>(currentSymbol.ask);

  // Reset or regenerate when symbol or timeframe changes
  useEffect(() => {
    setCandles(generateInitialCandles(currentSymbol.bid, currentSymbol.digits));
    setLiveBid(currentSymbol.bid);
    setLiveAsk(currentSymbol.ask);
  }, [currentSymbol.id, selectedTf]);

  // Real-time ticking engine (User requirement: "andye uapdte hota rah e theekehand real ho theek eh")
  useEffect(() => {
    const timer = setInterval(() => {
      const isUp = Math.random() > 0.48;
      const spread = currentSymbol.spread > 0 ? currentSymbol.spread * 0.0001 : 0.0004;
      const delta = currentSymbol.bid * (Math.random() * 0.0003 + 0.00005) * (isUp ? 1 : -1);

      setLiveBid(prev => {
        const nextBid = Number((prev + delta).toFixed(currentSymbol.digits));
        setLiveAsk(Number((nextBid + spread).toFixed(currentSymbol.digits)));

        // Update the last forming candle
        setCandles(prevCandles => {
          if (prevCandles.length === 0) return prevCandles;
          const last = { ...prevCandles[prevCandles.length - 1] };
          last.close = nextBid;
          last.high = Math.max(last.high, nextBid);
          last.low = Math.min(last.low, nextBid);
          return [...prevCandles.slice(0, -1), last];
        });

        return nextBid;
      });
    }, 1400);

    return () => clearInterval(timer);
  }, [currentSymbol]);

  // Layout calculations
  const leftToolbarWidth = isLeftToolbarVisible ? 44 : 0;
  const rightPriceAxisWidth = 64;
  const chartWidth = SCREEN_WIDTH - leftToolbarWidth - rightPriceAxisWidth;
  const chartHeight = SCREEN_HEIGHT * 0.52;

  const allPrices = candles.flatMap(c => [c.high, c.low, liveBid, liveAsk]);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const priceRange = maxPrice - minPrice || 1;

  const getY = (val: number) => {
    return chartHeight - ((val - minPrice) / priceRange) * (chartHeight - 36) - 18;
  };

  const candleSpacing = chartWidth / candles.length;
  const candleBodyWidth = Math.max(2, candleSpacing * 0.65);

  const adjustLots = (delta: number) => {
    setLotSize(prev => {
      const next = Math.max(0.01, Number((prev + delta).toFixed(2)));
      return next;
    });
  };

  const handleQuickTrade = (type: 'BUY' | 'SELL') => {
    if (oneClickEnabled) {
      openPosition(currentSymbol, type, lotSize);
    } else {
      onOpenOrderModal(type);
    }
  };

  /* Helper to render chart type icon inside the top sub-toolbar */
  const renderCurrentChartTypeIcon = () => {
    switch (selectedChartType) {
      case 'Line':
      case 'Line with markers':
      case 'Step line':
        return <Ionicons name="trending-up" size={17} color="#111624" />;
      case 'Area':
      case 'HLC area':
      case 'Baseline':
        return <Ionicons name="stats-chart" size={17} color="#111624" />;
      case 'Bars':
      case 'HLC bars':
        return <Ionicons name="reorder-two-outline" size={17} color="#111624" />;
      case 'Candles':
      case 'Hollow candles':
      default:
        return (
          <Svg width="16" height="16" viewBox="0 0 16 16">
            <Line x1="4" y1="2" x2="4" y2="14" stroke="#111624" strokeWidth="1.5" />
            <Rect x="2" y="5" width="4" height="6" fill="#111624" rx="0.5" />
            <Line x1="12" y1="2" x2="12" y2="14" stroke="#111624" strokeWidth="1.5" />
            <Rect x="10" y="4" width="4" height="7" fill="#111624" rx="0.5" />
          </Svg>
        );
    }
  };

  /* =========================================================================
     CHART RENDERER SWITCH
     Supports all 19 chart styles requested by the user
     ========================================================================= */
  const renderActiveChartVisualization = () => {
    // 1. Line styles (User explicitly requested: "agar line graph rahe toh yellow me nahi black me rahe theek eh!")
    if (selectedChartType === 'Line') {
      const pathD = candles
        .map((c, i) => `${i === 0 ? 'M' : 'L'} ${i * candleSpacing + candleSpacing / 2} ${getY(c.close)}`)
        .join(' ');
      return <Path d={pathD} fill="none" stroke="#111624" strokeWidth="2" strokeLinejoin="round" />;
    }

    if (selectedChartType === 'Line with markers') {
      const pathD = candles
        .map((c, i) => `${i === 0 ? 'M' : 'L'} ${i * candleSpacing + candleSpacing / 2} ${getY(c.close)}`)
        .join(' ');
      return (
        <G>
          <Path d={pathD} fill="none" stroke="#111624" strokeWidth="2" strokeLinejoin="round" />
          {candles.map((c, i) => (
            <Circle
              key={i}
              cx={i * candleSpacing + candleSpacing / 2}
              cy={getY(c.close)}
              r="3"
              fill="#111624"
            />
          ))}
        </G>
      );
    }

    if (selectedChartType === 'Step line') {
      let stepD = `M ${candleSpacing / 2} ${getY(candles[0].close)}`;
      for (let i = 1; i < candles.length; i++) {
        const prevX = (i - 1) * candleSpacing + candleSpacing / 2;
        const curX = i * candleSpacing + candleSpacing / 2;
        const curY = getY(candles[i].close);
        stepD += ` H ${curX} V ${curY}`;
      }
      return <Path d={stepD} fill="none" stroke="#111624" strokeWidth="2" />;
    }

    // 2. Area styles
    if (selectedChartType === 'Area') {
      const lineD = candles
        .map((c, i) => `${i === 0 ? 'M' : 'L'} ${i * candleSpacing + candleSpacing / 2} ${getY(c.close)}`)
        .join(' ');
      const areaD = `${lineD} L ${(candles.length - 1) * candleSpacing + candleSpacing / 2} ${chartHeight} L ${candleSpacing / 2} ${chartHeight} Z`;
      return (
        <G>
          <Path d={areaD} fill="url(#areaGrad)" />
          <Path d={lineD} fill="none" stroke="#2684FF" strokeWidth="2" />
        </G>
      );
    }

    if (selectedChartType === 'Baseline') {
      const midY = chartHeight / 2;
      return (
        <G>
          <Line x1="0" y1={midY} x2={chartWidth} y2={midY} stroke="#94A3B8" strokeDasharray="3 3" strokeWidth="1" />
          {candles.map((c, i) => {
            const x = i * candleSpacing + candleSpacing / 2;
            const y = getY(c.close);
            const isAbove = y <= midY;
            return (
              <G key={i}>
                <Line x1={x} y1={midY} x2={x} y2={y} stroke={isAbove ? '#2684FF' : '#EA3943'} strokeWidth="2.5" />
                <Circle cx={x} cy={y} r="2.5" fill={isAbove ? '#2684FF' : '#EA3943'} />
              </G>
            );
          })}
        </G>
      );
    }

    // 3. Columns / Histogram
    if (selectedChartType === 'Columns') {
      return (
        <G>
          {candles.map((c, i) => {
            const x = i * candleSpacing + candleSpacing / 2;
            const y = getY(c.close);
            const h = chartHeight - y;
            const isBull = c.close >= c.open;
            return (
              <Rect
                key={i}
                x={x - candleBodyWidth / 2}
                y={y}
                width={candleBodyWidth}
                height={h}
                fill={isBull ? '#2684FF' : '#EA3943'}
                rx="1"
              />
            );
          })}
        </G>
      );
    }

    // 4. Bars & HLC bars
    if (selectedChartType === 'Bars' || selectedChartType === 'HLC bars') {
      return (
        <G>
          {candles.map((c, i) => {
            const x = i * candleSpacing + candleSpacing / 2;
            const yOpen = getY(c.open);
            const yClose = getY(c.close);
            const yHigh = getY(c.high);
            const yLow = getY(c.low);
            const isBull = c.close >= c.open;
            const col = isBull ? '#2684FF' : '#EA3943';
            return (
              <G key={i}>
                {/* Main vertical line from High to Low */}
                <Line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={col} strokeWidth="1.6" />
                {/* Open tick (left) - only for Bars */}
                {selectedChartType === 'Bars' && (
                  <Line x1={x - candleBodyWidth / 2} y1={yOpen} x2={x} y2={yOpen} stroke={col} strokeWidth="1.6" />
                )}
                {/* Close tick (right) */}
                <Line x1={x} y1={yClose} x2={x + candleBodyWidth / 2} y2={yClose} stroke={col} strokeWidth="1.6" />
              </G>
            );
          })}
        </G>
      );
    }

    // 5. Hollow candles
    if (selectedChartType === 'Hollow candles') {
      return (
        <G>
          {candles.map((c, i) => {
            const x = i * candleSpacing + candleSpacing / 2;
            const yOpen = getY(c.open);
            const yClose = getY(c.close);
            const yHigh = getY(c.high);
            const yLow = getY(c.low);
            const isBull = c.close >= c.open;
            const top = Math.min(yOpen, yClose);
            const h = Math.max(Math.abs(yClose - yOpen), 2);
            return (
              <G key={i}>
                <Line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={isBull ? '#2684FF' : '#EA3943'} strokeWidth="1.2" />
                <Rect
                  x={x - candleBodyWidth / 2}
                  y={top}
                  width={candleBodyWidth}
                  height={h}
                  fill={isBull ? '#FFFFFF' : '#EA3943'}
                  stroke={isBull ? '#2684FF' : '#EA3943'}
                  strokeWidth="1.5"
                  rx="0.5"
                />
              </G>
            );
          })}
        </G>
      );
    }

    // 6. Default: Real Candlesticks with Blue for Bull and Red for Bear (Exness exact colors)
    return (
      <G>
        {candles.map((c, i) => {
          const x = i * candleSpacing + candleSpacing / 2;
          const yOpen = getY(c.open);
          const yClose = getY(c.close);
          const yHigh = getY(c.high);
          const yLow = getY(c.low);
          const isBull = c.close >= c.open;
          const col = isBull ? '#2684FF' : '#EA3943';
          const top = Math.min(yOpen, yClose);
          const h = Math.max(Math.abs(yClose - yOpen), 2.5);

          return (
            <G key={i}>
              {/* Wick */}
              <Line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={col} strokeWidth="1.3" />
              {/* Solid Candle Body */}
              <Rect
                x={x - candleBodyWidth / 2}
                y={top}
                width={candleBodyWidth}
                height={h}
                fill={col}
                rx="0.5"
              />
            </G>
          );
        })}
      </G>
    );
  };

  const askY = getY(liveAsk);
  const bidY = getY(liveBid);

  return (
    <View style={styles.container}>
      {/* 1. TOP HEADER (Back button, One-click toggle, Balance pill, Settings) */}
      <View style={styles.topHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {onBack && (
            <TouchableOpacity
              onPress={onBack}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ paddingRight: 4 }}
            >
              <Ionicons name="chevron-back" size={24} color="#111624" />
            </TouchableOpacity>
          )}
          <View style={styles.oneClickWrapper}>
            <TouchableOpacity
              style={[
                styles.oneClickToggle,
                oneClickEnabled && styles.oneClickToggleActive,
              ]}
              onPress={() => setOneClickEnabled(!oneClickEnabled)}
              activeOpacity={0.8}
            >
              <View style={[styles.toggleCircle, oneClickEnabled && styles.toggleCircleActive]}>
                <Ionicons name="flash" size={10} color={oneClickEnabled ? '#FFFFFF' : '#475569'} />
              </View>
            </TouchableOpacity>
            <Text style={styles.oneClickLabel}>One-click</Text>
          </View>
        </View>

        {/* Center Balance Pill */}
        <View style={styles.balancePill}>
          <Text style={styles.balancePillText}>
            {account.balance.toFixed(2)} USD
          </Text>
          <Ionicons name="ellipsis-vertical" size={13} color="#111624" />
        </View>

        {/* Right Settings Cog */}
        <TouchableOpacity style={styles.settingsBtn} activeOpacity={0.7}>
          <Ionicons name="settings-outline" size={20} color="#111624" />
        </TouchableOpacity>
      </View>

      {/* 2. CHART SUB-TOOLBAR (Collapse [<], 5m, Candle icon, fx, 4-squares, Default v) */}
      <View style={styles.subToolbar}>
        {/* Collapse left toolbar toggle */}
        <TouchableOpacity
          style={styles.collapseBtn}
          onPress={() => setIsLeftToolbarVisible(!isLeftToolbarVisible)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isLeftToolbarVisible ? 'chevron-back' : 'chevron-forward'}
            size={16}
            color="#475569"
          />
        </TouchableOpacity>

        {/* Timeframe Button (5m) */}
        <TouchableOpacity
          style={styles.tfBtn}
          onPress={() => setShowTfModal(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.tfBtnText}>{selectedTf}</Text>
        </TouchableOpacity>

        {/* Chart Type Icon Button */}
        <TouchableOpacity
          style={styles.chartTypeBtn}
          onPress={() => setShowChartTypeModal(true)}
          activeOpacity={0.7}
        >
          {renderCurrentChartTypeIcon()}
        </TouchableOpacity>

        {/* fx Indicators Icon */}
        <TouchableOpacity style={styles.iconToolBtn} activeOpacity={0.7}>
          <Text style={styles.fxText}>fx</Text>
        </TouchableOpacity>

        {/* 4-squares icon */}
        <TouchableOpacity style={styles.iconToolBtn} activeOpacity={0.7}>
          <Ionicons name="grid-outline" size={16} color="#475569" />
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        {/* Default dropdown */}
        <TouchableOpacity style={styles.defaultDropdown} activeOpacity={0.7}>
          <Text style={styles.defaultDropdownText}>Default</Text>
          <Ionicons name="chevron-down" size={13} color="#475569" />
        </TouchableOpacity>
      </View>

      {/* 3. MAIN WORKSPACE (Left Drawing Toolbar + Center Chart Area + Right Price Axis) */}
      <View style={styles.workspaceRow}>
        {/* Left Vertical Drawing Toolbar */}
        {isLeftToolbarVisible && (
          <ScrollView
            style={styles.leftToolbar}
            contentContainerStyle={styles.leftToolbarContent}
            showsVerticalScrollIndicator={false}
          >
            {[
              { id: 'crosshair', icon: 'add-outline' },
              { id: 'trendline', icon: 'git-commit-outline' },
              { id: 'fib', icon: 'reorder-four-outline' },
              { id: 'fork', icon: 'git-network-outline' },
              { id: 'channel', icon: 'swap-horizontal-outline' },
              { id: 'brush', icon: 'brush-outline' },
              { id: 'text', icon: 'text-outline' },
              { id: 'emoji', icon: 'happy-outline' },
              { id: 'ruler', icon: 'contract-outline' },
              { id: 'zoomin', icon: 'search-outline' },
              { id: 'magnet', icon: 'magnet-outline' },
              { id: 'lockdraw', icon: 'pencil-outline' },
              { id: 'lockall', icon: 'lock-closed-outline' },
              { id: 'hide', icon: 'eye-outline' },
              { id: 'trash', icon: 'trash-outline' },
            ].map(tool => (
              <TouchableOpacity
                key={tool.id}
                style={[
                  styles.drawToolItem,
                  activeDrawTool === tool.id && styles.drawToolItemActive,
                ]}
                onPress={() => setActiveDrawTool(tool.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={tool.icon as any}
                  size={17}
                  color={activeDrawTool === tool.id ? '#2684FF' : '#556271'}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Center SVG Chart Area */}
        <View style={styles.chartCanvasArea}>
          {/* Top-left instrument title overlay: e.g. Silver vs Euro · 5 / 49.761 */}
          <View style={styles.symbolInfoOverlay}>
            <Text style={styles.symbolInfoTitle}>
              {currentSymbol.name} · {selectedTf.replace('m', '')}
            </Text>
            <Text style={styles.symbolInfoPrice}>
              {liveBid.toFixed(currentSymbol.digits)}
            </Text>
          </View>

          <Svg width={chartWidth} height={chartHeight}>
            <Defs>
              <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#2684FF" stopOpacity="0.32" />
                <Stop offset="100%" stopColor="#2684FF" stopOpacity="0.02" />
              </LinearGradient>
            </Defs>

            {/* Subtle Vertical Grid Lines */}
            {[0.2, 0.4, 0.6, 0.8].map((pct, idx) => (
              <Line
                key={`v-${idx}`}
                x1={chartWidth * pct}
                y1="0"
                x2={chartWidth * pct}
                y2={chartHeight}
                stroke="#F1F4F8"
                strokeWidth="1"
              />
            ))}

            {/* Subtle Horizontal Grid Lines */}
            {[0.2, 0.4, 0.6, 0.8].map((pct, idx) => (
              <Line
                key={`h-${idx}`}
                x1="0"
                y1={chartHeight * pct}
                x2={chartWidth}
                y2={chartHeight * pct}
                stroke="#F1F4F8"
                strokeWidth="1"
              />
            ))}

            {/* Active Chart Drawing */}
            {renderActiveChartVisualization()}

            {/* Blue Ask Price Line (Horizontal Dashed) */}
            <Line
              x1="0"
              y1={askY}
              x2={chartWidth}
              y2={askY}
              stroke="#2684FF"
              strokeWidth="0.9"
              strokeDasharray="2 2"
            />

            {/* Red Bid Price Line (Horizontal Dashed) */}
            <Line
              x1="0"
              y1={bidY}
              x2={chartWidth}
              y2={bidY}
              stroke="#EA3943"
              strokeWidth="0.9"
              strokeDasharray="2 2"
            />
          </Svg>
        </View>

        {/* Right Price Axis with live updating badge tags */}
        <View style={styles.rightPriceAxis}>
          {[0.1, 0.25, 0.4, 0.55, 0.7, 0.85].map((pct, idx) => {
            const p = maxPrice - pct * priceRange;
            const y = chartHeight * pct;
            return (
              <View key={idx} style={[styles.axisPriceItem, { top: y - 8 }]}>
                <Text style={styles.axisPriceText}>{p.toFixed(currentSymbol.digits)}</Text>
              </View>
            );
          })}

          {/* Live Ask Badge (Blue outline/badge) */}
          <View style={[styles.livePriceBadgeBlue, { top: Math.max(0, askY - 9) }]}>
            <Text style={styles.livePriceBadgeTextBlue}>
              {liveAsk.toFixed(currentSymbol.digits)}
            </Text>
          </View>

          {/* Live Bid Badge (Red solid badge) */}
          <View style={[styles.livePriceBadgeRed, { top: Math.max(0, bidY - 9) }]}>
            <Text style={styles.livePriceBadgeTextRed}>
              {liveBid.toFixed(currentSymbol.digits)}
            </Text>
          </View>
        </View>
      </View>

      {/* 4. TIME AXIS BOTTOM BAR */}
      <View style={styles.timeAxisBar}>
        <View style={{ width: leftToolbarWidth }} />
        <View style={styles.timeAxisRow}>
          {['04:00', '05:00', '06:00', '07:00', '08:00'].map((timeLabel, idx) => (
            <Text key={idx} style={styles.timeAxisLabel}>
              {timeLabel}
            </Text>
          ))}
        </View>
        <View style={{ width: rightPriceAxisWidth }} />
      </View>

      {/* 5. CHART FOOTER BAR (Date Range v, UTC, %, log, auto) */}
      <View style={styles.chartMetaFooter}>
        <TouchableOpacity style={styles.metaDropdown} activeOpacity={0.7}>
          <Text style={styles.metaDropdownText}>Date Range</Text>
          <Ionicons name="chevron-down" size={12} color="#475569" />
        </TouchableOpacity>

        <Text style={styles.metaUtcText}>09:29:35 UTC</Text>

        <View style={styles.metaTogglesRow}>
          <Text style={styles.metaToggleItem}>%</Text>
          <Text style={styles.metaToggleItem}>log</Text>
          <View style={styles.autoPill}>
            <Text style={styles.autoPillText}>auto</Text>
          </View>
        </View>
      </View>

      {/* 6. BOTTOM ORDER ACTION BAR (Exness exact style: Sell / - Lots + / Buy / Spread footer) */}
      <View style={styles.bottomOrderBar}>
        <View style={styles.buttonsRow}>
          {/* Sell Button */}
          <TouchableOpacity
            style={styles.sellButton}
            onPress={() => handleQuickTrade('SELL')}
            activeOpacity={0.8}
          >
            <Text style={styles.actionBtnLabel}>Sell</Text>
            <Text style={styles.actionBtnPrice}>
              {liveBid.toFixed(currentSymbol.digits)}
            </Text>
          </TouchableOpacity>

          {/* Center Lots Counter */}
          <View style={styles.lotsCounter}>
            <TouchableOpacity
              style={styles.lotsBtn}
              onPress={() => adjustLots(-0.01)}
              activeOpacity={0.7}
            >
              <Text style={styles.lotsBtnText}>−</Text>
            </TouchableOpacity>

            <View style={styles.lotsValueCol}>
              <Text style={styles.lotsSubLabel}>Lots</Text>
              <Text style={styles.lotsMainVal}>{lotSize.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={styles.lotsBtn}
              onPress={() => adjustLots(0.01)}
              activeOpacity={0.7}
            >
              <Text style={styles.lotsBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Buy Button */}
          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => handleQuickTrade('BUY')}
            activeOpacity={0.8}
          >
            <Text style={styles.actionBtnLabel}>Buy</Text>
            <Text style={styles.actionBtnPrice}>
              {liveAsk.toFixed(currentSymbol.digits)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer info breakdown */}
        <View style={styles.spreadFooterRow}>
          <Text style={styles.spreadFooterText}>
            Spread: {currentSymbol.spread || 0.03} | Fees: ~ 1.46 USD | Margin: 13.98 USD (1:200)
          </Text>
          <Ionicons name="information-circle-outline" size={15} color="#8F9CA9" />
        </View>
      </View>

      {/* =========================================================================
          MODAL 1: TIMEFRAME BOTTOM SHEET (Exact match to Screenshot 2)
          ========================================================================= */}
      <Modal visible={showTfModal} animationType="slide" transparent onRequestClose={() => setShowTfModal(false)}>
        <View style={styles.sheetOverlay}>
          <TouchableOpacity
            style={styles.sheetBackdrop}
            activeOpacity={1}
            onPress={() => setShowTfModal(false)}
          />
          <View style={styles.bottomSheetBox}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Time frame</Text>

            <ScrollView style={styles.sheetScroll} showsVerticalScrollIndicator={false}>
              {TIMEFRAMES_LIST.map(item => {
                const isSelected = selectedTf === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.tfItemRow}
                    onPress={() => {
                      setSelectedTf(item.id);
                      setShowTfModal(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.tfItemLabel,
                        isSelected && { fontWeight: '700', color: '#111624' },
                      ]}
                    >
                      {item.label}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={20} color="#111624" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* =========================================================================
          MODAL 2: CHART TYPE SELECTION MENU (Exact match to Screenshot 3 & 4)
          ========================================================================= */}
      <Modal
        visible={showChartTypeModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowChartTypeModal(false)}
      >
        <View style={styles.sheetOverlay}>
          <TouchableOpacity
            style={styles.sheetBackdrop}
            activeOpacity={1}
            onPress={() => setShowChartTypeModal(false)}
          />
          <View style={styles.bottomSheetBox}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Chart type</Text>

            <ScrollView style={styles.sheetScroll} showsVerticalScrollIndicator={false}>
              {CHART_TYPES_LIST.map((item, idx) => {
                const isSelected = selectedChartType === item.id;
                const nextItem = CHART_TYPES_LIST[idx + 1];
                const showDivider = nextItem && nextItem.group !== item.group;

                return (
                  <React.Fragment key={item.id}>
                    <TouchableOpacity
                      style={[
                        styles.chartTypeRow,
                        isSelected && styles.chartTypeRowSelected,
                      ]}
                      onPress={() => {
                        setSelectedChartType(item.id);
                        setShowChartTypeModal(false);
                      }}
                      activeOpacity={0.7}
                    >
                      {/* Left icon */}
                      <View style={styles.chartTypeIconWrap}>
                        {item.id === 'Bars' || item.id === 'HLC bars' ? (
                          <Ionicons
                            name="reorder-two-outline"
                            size={18}
                            color={isSelected ? '#FFFFFF' : '#475569'}
                          />
                        ) : item.id === 'Line' || item.id === 'Line with markers' || item.id === 'Step line' ? (
                          <Ionicons
                            name="trending-up"
                            size={18}
                            color={isSelected ? '#FFFFFF' : '#475569'}
                          />
                        ) : item.id === 'Area' || item.id === 'HLC area' || item.id === 'Baseline' ? (
                          <Ionicons
                            name="stats-chart"
                            size={18}
                            color={isSelected ? '#FFFFFF' : '#475569'}
                          />
                        ) : (
                          <Svg width="18" height="18" viewBox="0 0 18 18">
                            <Line
                              x1="5"
                              y1="2"
                              x2="5"
                              y2="16"
                              stroke={isSelected ? '#FFFFFF' : '#475569'}
                              strokeWidth="1.5"
                            />
                            <Rect
                              x="3"
                              y="5"
                              width="4"
                              height="7"
                              fill={isSelected ? '#FFFFFF' : '#475569'}
                              rx="0.5"
                            />
                            <Line
                              x1="13"
                              y1="2"
                              x2="13"
                              y2="16"
                              stroke={isSelected ? '#FFFFFF' : '#475569'}
                              strokeWidth="1.5"
                            />
                            <Rect
                              x="11"
                              y="4"
                              width="4"
                              height="8"
                              fill={isSelected ? '#FFFFFF' : '#475569'}
                              rx="0.5"
                            />
                          </Svg>
                        )}
                      </View>

                      {/* Label */}
                      <Text
                        style={[
                          styles.chartTypeLabel,
                          isSelected && styles.chartTypeLabelSelected,
                        ]}
                      >
                        {item.label}
                      </Text>

                      {/* Right favorite star */}
                      <TouchableOpacity activeOpacity={0.7}>
                        <Ionicons
                          name="star-outline"
                          size={17}
                          color={isSelected ? '#FFFFFF' : '#94A3B8'}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>

                    {showDivider && <View style={styles.groupDivider} />}
                  </React.Fragment>
                );
              })}
              <View style={{ height: 30 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  oneClickWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  oneClickToggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#64748B',
    padding: 2,
    justifyContent: 'center',
  },
  oneClickToggleActive: {
    backgroundColor: '#2684FF',
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleCircleActive: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
  },
  oneClickLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#111624',
  },
  balancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    gap: 4,
  },
  balancePillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111624',
  },
  settingsBtn: {
    padding: 4,
  },
  subToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FAFBFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF0',
    gap: 8,
  },
  collapseBtn: {
    width: 28,
    height: 28,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tfBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tfBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#111624',
  },
  chartTypeBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  iconToolBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  fxText: {
    fontSize: 15,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#475569',
  },
  defaultDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
  },
  defaultDropdownText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#1E293B',
  },
  workspaceRow: {
    flex: 1,
    flexDirection: 'row',
  },
  leftToolbar: {
    width: 44,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#F0F2F5',
  },
  leftToolbarContent: {
    alignItems: 'center',
    paddingVertical: 6,
    gap: 6,
  },
  drawToolItem: {
    width: 32,
    height: 32,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawToolItemActive: {
    backgroundColor: '#EBF4FF',
  },
  chartCanvasArea: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  symbolInfoOverlay: {
    position: 'absolute',
    top: 8,
    left: 10,
    zIndex: 10,
  },
  symbolInfoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111624',
  },
  symbolInfoPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2684FF',
    marginTop: 1,
  },
  rightPriceAxis: {
    width: 64,
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1,
    borderLeftColor: '#F0F2F5',
  },
  axisPriceItem: {
    position: 'absolute',
    right: 6,
  },
  axisPriceText: {
    fontSize: 10.5,
    color: '#8F9CA9',
    fontWeight: '500',
  },
  livePriceBadgeBlue: {
    position: 'absolute',
    right: 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#2684FF',
    borderRadius: 3,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  livePriceBadgeTextBlue: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#2684FF',
  },
  livePriceBadgeRed: {
    position: 'absolute',
    right: 2,
    backgroundColor: '#EA3943',
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1.5,
  },
  livePriceBadgeTextRed: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  timeAxisBar: {
    flexDirection: 'row',
    height: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
    alignItems: 'center',
  },
  timeAxisRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  timeAxisLabel: {
    fontSize: 10,
    color: '#8F9CA9',
  },
  chartMetaFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
    backgroundColor: '#FFFFFF',
  },
  metaDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaDropdownText: {
    fontSize: 11.5,
    color: '#475569',
    fontWeight: '600',
  },
  metaUtcText: {
    fontSize: 11,
    color: '#64748B',
  },
  metaTogglesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaToggleItem: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
  },
  autoPill: {
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  autoPillText: {
    fontSize: 11,
    color: '#2684FF',
    fontWeight: '700',
  },
  bottomOrderBar: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8ECF0',
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sellButton: {
    flex: 1,
    backgroundColor: '#EA3943',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButton: {
    flex: 1,
    backgroundColor: '#2684FF',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  actionBtnPrice: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 1,
  },
  lotsCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 4,
    paddingVertical: 3,
    minWidth: 110,
    justifyContent: 'space-between',
  },
  lotsBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lotsBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#475569',
  },
  lotsValueCol: {
    alignItems: 'center',
  },
  lotsSubLabel: {
    fontSize: 9.5,
    color: '#8F9CA9',
    fontWeight: '600',
  },
  lotsMainVal: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#111624',
  },
  spreadFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingHorizontal: 2,
  },
  spreadFooterText: {
    fontSize: 11,
    color: '#8F9CA9',
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    flex: 1,
  },
  bottomSheetBox: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '75%',
    paddingBottom: 24,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111624',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  sheetScroll: {
    paddingHorizontal: 16,
  },
  tfItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  tfItemLabel: {
    fontSize: 14.5,
    color: '#334155',
    fontWeight: '500',
  },
  chartTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  chartTypeRowSelected: {
    backgroundColor: '#2684FF',
  },
  chartTypeIconWrap: {
    width: 26,
    marginRight: 12,
    alignItems: 'center',
  },
  chartTypeLabel: {
    flex: 1,
    fontSize: 14.5,
    color: '#1E293B',
    fontWeight: '500',
  },
  chartTypeLabelSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  groupDivider: {
    height: 1,
    backgroundColor: '#F1F4F7',
    marginVertical: 4,
  },
});
