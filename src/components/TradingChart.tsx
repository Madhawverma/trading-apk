import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
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
} from 'react-native-svg';
import { THEME } from '../constants/theme';
import { useTrading } from '../context/TradingContext';
import { SymbolData } from '../types/trading';
import { CurrencyIcon } from './CurrencyIcon';

interface TradingChartProps {
  symbol?: SymbolData;
  onOpenOrderModal: (type: 'BUY' | 'SELL') => void;
}

const TIMEFRAMES = ['M1', 'M5', 'M15', 'H1', 'H4', 'D1'];
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Generate realistic candlestick data around the symbol price
const generateCandles = (basePrice: number, digits: number) => {
  const candles = [];
  let curr = basePrice * 0.994;
  const count = 18;

  for (let i = 0; i < count; i++) {
    const isBull = Math.sin(i * 1.5) + (Math.random() - 0.48) > 0;
    const change = basePrice * 0.0025 * (Math.random() + 0.2);
    const open = curr;
    const close = isBull ? open + change : open - change;
    const high = Math.max(open, close) + change * Math.random() * 0.6;
    const low = Math.min(open, close) - change * Math.random() * 0.6;

    candles.push({
      open: Number(open.toFixed(digits)),
      close: Number(close.toFixed(digits)),
      high: Number(high.toFixed(digits)),
      low: Number(low.toFixed(digits)),
      isBull,
    });
    curr = close;
  }
  return candles;
};

export const TradingChart: React.FC<TradingChartProps> = ({
  onOpenOrderModal,
}) => {
  const { selectedSymbol, openPosition } = useTrading();
  const [selectedTf, setSelectedTf] = useState('M15');
  const [lotSize, setLotSize] = useState(0.10);
  const [chartType, setChartType] = useState<'candles' | 'line'>('candles');

  const candles = generateCandles(selectedSymbol.bid, selectedSymbol.digits);
  const chartWidth = SCREEN_WIDTH - 32;
  const chartHeight = 260;

  const allPrices = candles.flatMap(c => [c.high, c.low]);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const priceRange = maxPrice - minPrice || 1;

  const getY = (val: number) => {
    return chartHeight - ((val - minPrice) / priceRange) * (chartHeight - 30) - 15;
  };

  const candleWidth = (chartWidth - 60) / candles.length;

  const adjustLots = (delta: number) => {
    setLotSize(prev => {
      const next = Math.max(0.01, Number((prev + delta).toFixed(2)));
      return next;
    });
  };

  return (
    <View style={styles.container}>
      {/* Symbol Detail Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <CurrencyIcon symbol={selectedSymbol.id} size={32} />
          <View style={{ marginLeft: 10 }}>
            <View style={styles.titleRow}>
              <Text style={styles.symbolName}>{selectedSymbol.name}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{selectedSymbol.category}</Text>
              </View>
            </View>
            <Text style={styles.fullName}>{selectedSymbol.fullName}</Text>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>
            {selectedSymbol.bid.toFixed(selectedSymbol.digits)}
          </Text>
          <Text
            style={[
              styles.changeRate,
              { color: selectedSymbol.changePercent >= 0 ? THEME.colors.buyGreen : THEME.colors.sellRed },
            ]}
          >
            {selectedSymbol.changePercent >= 0 ? '+' : ''}{selectedSymbol.changePercent.toFixed(2)}%
          </Text>
        </View>
      </View>

      {/* Stats Bar (24h High, Low, Spread) */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>24h High</Text>
          <Text style={styles.statVal}>{selectedSymbol.high24h.toFixed(selectedSymbol.digits)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>24h Low</Text>
          <Text style={styles.statVal}>{selectedSymbol.low24h.toFixed(selectedSymbol.digits)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Spread</Text>
          <Text style={[styles.statVal, { color: THEME.colors.primary }]}>{selectedSymbol.spread} pts</Text>
        </View>
        <View style={styles.chartToggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, chartType === 'candles' && styles.toggleBtnActive]}
            onPress={() => setChartType('candles')}
          >
            <Ionicons name="bar-chart-outline" size={14} color={chartType === 'candles' ? THEME.colors.textDark : THEME.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, chartType === 'line' && styles.toggleBtnActive]}
            onPress={() => setChartType('line')}
          >
            <Ionicons name="trending-up" size={14} color={chartType === 'line' ? THEME.colors.textDark : THEME.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Timeframe Bar */}
      <View style={styles.timeframeRow}>
        {TIMEFRAMES.map(tf => (
          <TouchableOpacity
            key={tf}
            style={[styles.tfButton, selectedTf === tf && styles.tfButtonActive]}
            onPress={() => setSelectedTf(tf)}
          >
            <Text style={[styles.tfText, selectedTf === tf && styles.tfTextActive]}>{tf}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart Canvas */}
      <View style={styles.chartCanvas}>
        <Svg width={chartWidth} height={chartHeight}>
          <Defs>
            <LinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={THEME.colors.primary} stopOpacity="0.3" />
              <Stop offset="100%" stopColor={THEME.colors.primary} stopOpacity="0.0" />
            </LinearGradient>
          </Defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((pct, idx) => {
            const y = chartHeight * pct;
            const price = maxPrice - pct * priceRange;
            return (
              <React.Fragment key={idx}>
                <Line
                  x1="0"
                  y1={y}
                  x2={chartWidth - 55}
                  y2={y}
                  stroke={THEME.colors.border}
                  strokeWidth="0.8"
                  strokeDasharray="4, 4"
                />
                <SvgText
                  x={chartWidth - 50}
                  y={y + 3}
                  fill={THEME.colors.textMuted}
                  fontSize="9"
                  fontFamily="System"
                >
                  {price.toFixed(selectedSymbol.digits > 3 ? 4 : selectedSymbol.digits)}
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* Render Candlesticks */}
          {chartType === 'candles' &&
            candles.map((candle, idx) => {
              const x = idx * candleWidth + candleWidth / 2;
              const yOpen = getY(candle.open);
              const yClose = getY(candle.close);
              const yHigh = getY(candle.high);
              const yLow = getY(candle.low);
              const isGreen = candle.close >= candle.open;
              const color = isGreen ? THEME.colors.buyGreen : THEME.colors.sellRed;
              const bodyTop = Math.min(yOpen, yClose);
              const bodyHeight = Math.max(Math.abs(yClose - yOpen), 2);

              return (
                <React.Fragment key={idx}>
                  {/* Wick */}
                  <Line
                    x1={x}
                    y1={yHigh}
                    x2={x}
                    y2={yLow}
                    stroke={color}
                    strokeWidth="1.2"
                  />
                  {/* Candle Body */}
                  <Rect
                    x={x - candleWidth * 0.35}
                    y={bodyTop}
                    width={candleWidth * 0.7}
                    height={bodyHeight}
                    fill={color}
                    rx="1"
                  />
                </React.Fragment>
              );
            })}

          {/* Render Line Chart */}
          {chartType === 'line' && (
            <>
              <Path
                d={`M 0 ${getY(candles[0].close)} ` + candles.map((c, i) => `L ${i * candleWidth + candleWidth / 2} ${getY(c.close)}`).join(' ') + ` L ${(candles.length - 1) * candleWidth + candleWidth / 2} ${chartHeight} L 0 ${chartHeight} Z`}
                fill="url(#chartGradient)"
              />
              <Path
                d={`M 0 ${getY(candles[0].close)} ` + candles.map((c, i) => `L ${i * candleWidth + candleWidth / 2} ${getY(c.close)}`).join(' ')}
                fill="none"
                stroke={THEME.colors.primary}
                strokeWidth="2"
              />
            </>
          )}

          {/* Current Live Price Horizontal Tracker Line */}
          <Line
            x1="0"
            y1={getY(selectedSymbol.bid)}
            x2={chartWidth - 55}
            y2={getY(selectedSymbol.bid)}
            stroke={THEME.colors.primary}
            strokeWidth="1.2"
          />
          <Rect
            x={chartWidth - 54}
            y={getY(selectedSymbol.bid) - 8}
            width={52}
            height={16}
            fill={THEME.colors.primary}
            rx="3"
          />
          <SvgText
            x={chartWidth - 28}
            y={getY(selectedSymbol.bid) + 4}
            fill={THEME.colors.textDark}
            fontSize="8.5"
            fontWeight="bold"
            textAnchor="middle"
          >
            {selectedSymbol.bid.toFixed(selectedSymbol.digits > 3 ? 4 : selectedSymbol.digits)}
          </SvgText>
        </Svg>
      </View>

      {/* Lot Size Selector & Order Bar */}
      <View style={styles.lotContainer}>
        <Text style={styles.lotLabel}>Lot Volume</Text>
        <View style={styles.lotControlRow}>
          <TouchableOpacity style={styles.lotStepBtn} onPress={() => adjustLots(-0.1)}>
            <Text style={styles.lotStepText}>-0.1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.lotStepBtn} onPress={() => adjustLots(-0.01)}>
            <Text style={styles.lotStepText}>-0.01</Text>
          </TouchableOpacity>

          <View style={styles.lotInputBox}>
            <Text style={styles.lotInputValue}>{lotSize.toFixed(2)}</Text>
            <Text style={styles.lotUnit}>Lots</Text>
          </View>

          <TouchableOpacity style={styles.lotStepBtn} onPress={() => adjustLots(0.01)}>
            <Text style={styles.lotStepText}>+0.01</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.lotStepBtn} onPress={() => adjustLots(0.1)}>
            <Text style={styles.lotStepText}>+0.1</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Direct Buy / Sell Action Buttons */}
      <View style={styles.actionButtonsRow}>
        {/* Sell Button */}
        <TouchableOpacity
          style={styles.sellButton}
          activeOpacity={0.85}
          onPress={() => {
            openPosition(selectedSymbol, 'SELL', lotSize);
          }}
        >
          <View style={styles.btnContent}>
            <View>
              <Text style={styles.orderActionType}>SELL</Text>
              <Text style={styles.orderSubtext}>Instant Bid</Text>
            </View>
            <Text style={styles.orderPrice}>
              {selectedSymbol.bid.toFixed(selectedSymbol.digits > 3 ? 4 : selectedSymbol.digits)}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Modal Opener for Advanced SL/TP */}
        <TouchableOpacity
          style={styles.advancedOrderBtn}
          onPress={() => onOpenOrderModal('BUY')}
        >
          <Ionicons name="options-outline" size={20} color={THEME.colors.textPrimary} />
        </TouchableOpacity>

        {/* Buy Button */}
        <TouchableOpacity
          style={styles.buyButton}
          activeOpacity={0.85}
          onPress={() => {
            openPosition(selectedSymbol, 'BUY', lotSize);
          }}
        >
          <View style={styles.btnContent}>
            <View>
              <Text style={styles.orderActionType}>BUY</Text>
              <Text style={styles.orderSubtext}>Instant Ask</Text>
            </View>
            <Text style={styles.orderPrice}>
              {selectedSymbol.ask.toFixed(selectedSymbol.digits > 3 ? 4 : selectedSymbol.digits)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingHorizontal: THEME.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  symbolName: {
    color: THEME.colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  categoryBadge: {
    backgroundColor: THEME.colors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryBadgeText: {
    color: THEME.colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  fullName: {
    color: THEME.colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  currentPrice: {
    color: THEME.colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  changeRate: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: THEME.colors.textMuted,
    fontSize: 9,
    textTransform: 'uppercase',
  },
  statVal: {
    color: THEME.colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 1,
  },
  chartToggle: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: THEME.colors.surfaceLight,
    padding: 2,
    borderRadius: 6,
  },
  toggleBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
  },
  toggleBtnActive: {
    backgroundColor: THEME.colors.primary,
  },
  timeframeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tfButton: {
    flex: 1,
    paddingVertical: 5,
    alignItems: 'center',
    borderRadius: 6,
    marginHorizontal: 2,
    backgroundColor: THEME.colors.surface,
  },
  tfButtonActive: {
    backgroundColor: THEME.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  tfText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  tfTextActive: {
    color: THEME.colors.primary,
    fontWeight: '700',
  },
  chartCanvas: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  lotContainer: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  lotLabel: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  lotControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lotStepBtn: {
    backgroundColor: THEME.colors.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  lotStepText: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  lotInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lotInputValue: {
    color: THEME.colors.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  lotUnit: {
    color: THEME.colors.textMuted,
    fontSize: 12,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  sellButton: {
    flex: 1,
    backgroundColor: THEME.colors.sellRed,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: THEME.borderRadius.md,
  },
  buyButton: {
    flex: 1,
    backgroundColor: THEME.colors.buyGreen,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: THEME.borderRadius.md,
  },
  btnContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderActionType: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  orderSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 9,
    fontWeight: '600',
  },
  orderPrice: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  advancedOrderBtn: {
    backgroundColor: THEME.colors.surfaceLight,
    width: 44,
    height: 44,
    borderRadius: THEME.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
});
