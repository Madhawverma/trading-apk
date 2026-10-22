import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, {
  Path,
  Circle,
  Rect,
  Line,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { THEME } from '../constants/theme';
import { useTrading } from '../context/TradingContext';

interface PerformanceScreenProps {
  onTradePress: () => void;
}

const { width } = Dimensions.get('window');

export const PerformanceScreen: React.FC<PerformanceScreenProps> = ({ onTradePress }) => {
  const { account, closedOrders, positions } = useTrading();
  const [selectedPeriod, setSelectedPeriod] = useState('Last 7 days');
  const [selectedAccountFilter, setSelectedAccountFilter] = useState('All real accounts');

  // Total realized P&L from closed orders
  const totalRealizedPnl = closedOrders.reduce((sum, o) => sum + o.pnl, 0);
  const totalFloatingPnl = positions.reduce((sum, p) => sum + p.pnl, 0);
  const hasActivity = closedOrders.length > 0 || positions.length > 0;

  // Win rate calculation
  const winningTrades = closedOrders.filter(o => o.pnl > 0).length;
  const winRate = closedOrders.length > 0
    ? ((winningTrades / closedOrders.length) * 100).toFixed(1)
    : '75.0';

  const chartWidth = width - 40;
  const chartHeight = 130;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Title */}
      <Text style={styles.mainTitle}>Performance</Text>

      {/* UTC Disclaimer Row */}
      <View style={styles.disclaimerRow}>
        <Ionicons name="information-circle-outline" size={20} color="#6E7787" />
        <Text style={styles.disclaimerText}>
          All times on this page use UTC (GMT+0) and may differ from your local time
        </Text>
      </View>

      <View style={styles.titleDivider} />

      {/* Filter Pills Row */}
      <View style={styles.filterPillsRow}>
        <TouchableOpacity style={styles.filterPill}>
          <Text style={styles.filterPillText}>{selectedAccountFilter}</Text>
          <Ionicons name="chevron-down" size={14} color="#111624" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterPill}>
          <Ionicons name="calendar-outline" size={14} color="#111624" />
          <Text style={styles.filterPillText}>{selectedPeriod}</Text>
        </TouchableOpacity>
      </View>

      {/* CONDITIONAL DISPLAY: NO ACTIVITY (EXACT SCREENSHOT) vs ACTIVE ANALYTICS */}
      {!hasActivity ? (
        // EXACT SCREENSHOT EMPTY STATE
        <View style={styles.emptyStateContainer}>
          {/* Warning Triangle Icon */}
          <View style={styles.warningIconWrapper}>
            <Svg width={44} height={44} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 3.5L21.5 20H2.5L12 3.5Z"
                stroke="#111624"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Line x1="12" y1="9.5" x2="12" y2="14" stroke="#111624" strokeWidth="1.8" strokeLinecap="round" />
              <Circle cx="12" cy="17" r="1" fill="#111624" />
            </Svg>
          </View>

          <Text style={styles.noActivityTitle}>No trading activity found</Text>
          <Text style={styles.noActivitySub}>Select different account or period.</Text>

          {/* Yellow Trade Button */}
          <TouchableOpacity
            style={styles.yellowTradeButton}
            onPress={onTradePress}
            activeOpacity={0.85}
          >
            <Text style={styles.yellowTradeButtonText}>Trade</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // FULL ACTIVE EXNESS PERFORMANCE ANALYTICS
        <View style={styles.analyticsContainer}>
          {/* Net Profit Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryTopRow}>
              <View>
                <Text style={styles.summaryLabel}>Total Net Profit</Text>
                <Text
                  style={[
                    styles.summaryProfitValue,
                    { color: totalRealizedPnl >= 0 ? '#00A868' : '#D9383A' },
                  ]}
                >
                  {totalRealizedPnl >= 0 ? '+' : ''}${totalRealizedPnl.toFixed(2)} USD
                </Text>
              </View>
              <View
                style={[
                  styles.winRateBadge,
                  { backgroundColor: totalRealizedPnl >= 0 ? '#E8F7F0' : '#FDF0F0' },
                ]}
              >
                <Text
                  style={[
                    styles.winRateText,
                    { color: totalRealizedPnl >= 0 ? '#00A868' : '#D9383A' },
                  ]}
                >
                  {winRate}% Win Rate
                </Text>
              </View>
            </View>

            {/* Performance Curve SVG */}
            <View style={styles.curveBox}>
              <Svg width={chartWidth} height={chartHeight}>
                <Defs>
                  <LinearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#00A868" stopOpacity="0.25" />
                    <Stop offset="100%" stopColor="#00A868" stopOpacity="0.0" />
                  </LinearGradient>
                </Defs>

                {/* Grid line */}
                <Line
                  x1="0"
                  y1={chartHeight * 0.5}
                  x2={chartWidth}
                  y2={chartHeight * 0.5}
                  stroke="#E8EBEF"
                  strokeWidth="1"
                  strokeDasharray="4, 4"
                />

                {/* Fill Area */}
                <Path
                  d={`M 0 ${chartHeight * 0.8} Q ${chartWidth * 0.25} ${chartHeight * 0.65} ${chartWidth * 0.5} ${chartHeight * 0.4} T ${chartWidth} ${chartHeight * 0.2} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`}
                  fill="url(#perfGrad)"
                />

                {/* Line Path */}
                <Path
                  d={`M 0 ${chartHeight * 0.8} Q ${chartWidth * 0.25} ${chartHeight * 0.65} ${chartWidth * 0.5} ${chartHeight * 0.4} T ${chartWidth} ${chartHeight * 0.2}`}
                  fill="none"
                  stroke="#00A868"
                  strokeWidth="2.2"
                />

                {/* End Point Dot */}
                <Circle
                  cx={chartWidth - 2}
                  cy={chartHeight * 0.2}
                  r="4"
                  fill="#00A868"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              </Svg>
            </View>
          </View>

          {/* Key Metrics 2x2 Grid */}
          <Text style={styles.gridSectionTitle}>Key Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statGridCard}>
              <Text style={styles.statGridLabel}>Total Trades</Text>
              <Text style={styles.statGridVal}>{closedOrders.length + positions.length}</Text>
            </View>
            <View style={styles.statGridCard}>
              <Text style={styles.statGridLabel}>Profitable Trades</Text>
              <Text style={[styles.statGridVal, { color: '#00A868' }]}>{winRate}%</Text>
            </View>
            <View style={styles.statGridCard}>
              <Text style={styles.statGridLabel}>Profit Factor</Text>
              <Text style={styles.statGridVal}>2.45</Text>
            </View>
            <View style={styles.statGridCard}>
              <Text style={styles.statGridLabel}>Floating P&L</Text>
              <Text
                style={[
                  styles.statGridVal,
                  { color: totalFloatingPnl >= 0 ? '#00A868' : '#D9383A' },
                ]}
              >
                {totalFloatingPnl >= 0 ? '+' : ''}${totalFloatingPnl.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Trade Button at bottom */}
          <TouchableOpacity
            style={styles.continueTradeBtn}
            onPress={onTradePress}
            activeOpacity={0.85}
          >
            <Text style={styles.continueTradeText}>Open New Trade</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 110 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainTitle: {
    color: '#111624',
    fontSize: 26,
    fontWeight: '800',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  disclaimerText: {
    color: '#6E7787',
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
  titleDivider: {
    height: 1,
    backgroundColor: '#F0F2F5',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
  },
  filterPillText: {
    color: '#111624',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 30,
  },
  warningIconWrapper: {
    marginBottom: 20,
  },
  noActivityTitle: {
    color: '#111624',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  noActivitySub: {
    color: '#6E7787',
    fontSize: 13,
    marginBottom: 24,
  },
  yellowTradeButton: {
    backgroundColor: '#FFDE00',
    paddingHorizontal: 36,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yellowTradeButtonText: {
    color: '#111624',
    fontSize: 14,
    fontWeight: '700',
  },
  analyticsContainer: {
    paddingHorizontal: 20,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8EBEF',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  summaryLabel: {
    color: '#7E8B9B',
    fontSize: 11,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  summaryProfitValue: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 2,
  },
  winRateBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  winRateText: {
    fontSize: 11,
    fontWeight: '700',
  },
  curveBox: {
    alignItems: 'center',
    marginTop: 6,
  },
  gridSectionTitle: {
    color: '#111624',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statGridCard: {
    backgroundColor: '#F7F8FA',
    width: (width - 50) / 2,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8EBEF',
  },
  statGridLabel: {
    color: '#6E7787',
    fontSize: 11,
  },
  statGridVal: {
    color: '#111624',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  continueTradeBtn: {
    backgroundColor: '#FFDE00',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  continueTradeText: {
    color: '#111624',
    fontSize: 14,
    fontWeight: '700',
  },
});
