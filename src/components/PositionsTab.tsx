import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useTrading } from '../context/TradingContext';
import { Position, ClosedOrder } from '../types/trading';

export const PositionsTab: React.FC = () => {
  const { positions, closedOrders, closePosition, account } = useTrading();
  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open');

  const totalFloatingPnl = positions.reduce((acc, curr) => acc + curr.pnl, 0);

  const handleClose = (pos: Position) => {
    Alert.alert(
      'Close Position',
      `Close ${pos.lots} lot ${pos.type} on ${pos.symbolName} at current price?\nP&L: ${pos.pnl >= 0 ? '+' : ''}$${pos.pnl.toFixed(2)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Close',
          style: 'destructive',
          onPress: () => closePosition(pos.id),
        },
      ]
    );
  };

  const renderOpenPosition = ({ item }: { item: Position }) => {
    const isProfit = item.pnl >= 0;

    return (
      <View style={styles.positionCard}>
        {/* Top Info */}
        <View style={styles.cardHeader}>
          <View style={styles.posTitleRow}>
            <Text style={styles.symbolName}>{item.symbolName}</Text>
            <View
              style={[
                styles.typeBadge,
                item.type === 'BUY' ? styles.buyBadge : styles.sellBadge,
              ]}
            >
              <Text
                style={[
                  styles.typeBadgeText,
                  { color: item.type === 'BUY' ? THEME.colors.buyGreen : THEME.colors.sellRed },
                ]}
              >
                {item.type} {item.lots}
              </Text>
            </View>
          </View>

          {/* Floating P&L */}
          <View style={styles.pnlContainer}>
            <Text
              style={[
                styles.pnlValue,
                { color: isProfit ? THEME.colors.buyGreen : THEME.colors.sellRed },
              ]}
            >
              {isProfit ? '+' : ''}${item.pnl.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Price Details */}
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.priceLabel}>Open Price</Text>
            <Text style={styles.priceValue}>{item.openPrice}</Text>
          </View>
          <Ionicons name="arrow-forward" size={14} color={THEME.colors.textMuted} />
          <View>
            <Text style={styles.priceLabel}>Current Price</Text>
            <Text style={styles.priceValue}>{item.currentPrice}</Text>
          </View>
          <View style={styles.timeCol}>
            <Text style={styles.priceLabel}>Time</Text>
            <Text style={styles.timeValue}>{item.openTime}</Text>
          </View>
        </View>

        {/* Action Row */}
        <View style={styles.actionRow}>
          <View style={styles.sltpRow}>
            <Text style={styles.sltpText}>
              SL: <Text style={{ color: THEME.colors.textPrimary }}>{item.sl ?? 'None'}</Text>
            </Text>
            <Text style={styles.sltpText}>
              TP: <Text style={{ color: THEME.colors.textPrimary }}>{item.tp ?? 'None'}</Text>
            </Text>
          </View>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => handleClose(item)}
            activeOpacity={0.8}
          >
            <Ionicons name="close-circle-outline" size={14} color={THEME.colors.textPrimary} />
            <Text style={styles.closeBtnText}>Close Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderClosedOrder = ({ item }: { item: ClosedOrder }) => {
    const isProfit = item.pnl >= 0;

    return (
      <View style={styles.closedCard}>
        <View style={styles.cardHeader}>
          <View style={styles.posTitleRow}>
            <Text style={styles.symbolName}>{item.symbolName}</Text>
            <View
              style={[
                styles.typeBadge,
                item.type === 'BUY' ? styles.buyBadge : styles.sellBadge,
              ]}
            >
              <Text
                style={[
                  styles.typeBadgeText,
                  { color: item.type === 'BUY' ? THEME.colors.buyGreen : THEME.colors.sellRed },
                ]}
              >
                {item.type} {item.lots}
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.pnlValue,
              { color: isProfit ? THEME.colors.buyGreen : THEME.colors.sellRed },
            ]}
          >
            {isProfit ? '+' : ''}${item.pnl.toFixed(2)}
          </Text>
        </View>

        <View style={styles.closedDetails}>
          <Text style={styles.closedSub}>
            Open: {item.openPrice} → Close: {item.closePrice}
          </Text>
          <Text style={styles.closedSub}>{item.closeTime}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Floating Summary Banner */}
      <View style={styles.summaryBanner}>
        <View>
          <Text style={styles.summaryLabel}>Total Floating P&L</Text>
          <Text
            style={[
              styles.summaryPnl,
              { color: totalFloatingPnl >= 0 ? THEME.colors.buyGreen : THEME.colors.sellRed },
            ]}
          >
            {totalFloatingPnl >= 0 ? '+' : ''}${totalFloatingPnl.toFixed(2)} USD
          </Text>
        </View>
        <View style={styles.summaryStats}>
          <Text style={styles.statLine}>
            Margin Level: <Text style={{ color: THEME.colors.primary }}>{account.marginLevel}%</Text>
          </Text>
          <Text style={styles.statLine}>
            Free Margin: <Text style={{ color: THEME.colors.textPrimary }}>${account.freeMargin.toFixed(2)}</Text>
          </Text>
        </View>
      </View>

      {/* Segment Tab Controls */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'open' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('open')}
        >
          <Text style={[styles.segmentText, activeTab === 'open' && styles.segmentTextActive]}>
            Open Positions ({positions.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'closed' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('closed')}
        >
          <Text style={[styles.segmentText, activeTab === 'closed' && styles.segmentTextActive]}>
            Trade History ({closedOrders.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Positions / History List */}
      {activeTab === 'open' ? (
        positions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="trending-up-outline" size={48} color={THEME.colors.textMuted} />
            <Text style={styles.emptyTitle}>No Open Positions</Text>
            <Text style={styles.emptyDesc}>
              Use the Trade or Chart tab to execute instant market orders.
            </Text>
          </View>
        ) : (
          <FlatList
            data={positions}
            keyExtractor={item => item.id}
            renderItem={renderOpenPosition}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : closedOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={48} color={THEME.colors.textMuted} />
          <Text style={styles.emptyTitle}>No Closed Trades Yet</Text>
          <Text style={styles.emptyDesc}>Closed orders and realized profits will appear here.</Text>
        </View>
      ) : (
        <FlatList
          data={closedOrders}
          keyExtractor={item => item.id}
          renderItem={renderClosedOrder}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingHorizontal: THEME.spacing.lg,
  },
  summaryBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: 14,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 10,
  },
  summaryLabel: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    textTransform: 'uppercase',
  },
  summaryPnl: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  summaryStats: {
    alignItems: 'flex-end',
    gap: 3,
  },
  statLine: {
    color: THEME.colors.textMuted,
    fontSize: 11,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 3,
    marginBottom: 12,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: THEME.borderRadius.sm,
  },
  segmentBtnActive: {
    backgroundColor: THEME.colors.surfaceElevated,
  },
  segmentText: {
    color: THEME.colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: THEME.colors.textPrimary,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 80,
  },
  positionCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  posTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  symbolName: {
    color: THEME.colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  buyBadge: {
    backgroundColor: THEME.colors.buyGreenBg,
  },
  sellBadge: {
    backgroundColor: THEME.colors.sellRedBg,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  pnlContainer: {},
  pnlValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceLight,
    padding: 10,
    borderRadius: THEME.borderRadius.sm,
    marginBottom: 10,
  },
  priceLabel: {
    color: THEME.colors.textMuted,
    fontSize: 10,
  },
  priceValue: {
    color: THEME.colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  timeCol: {
    alignItems: 'flex-end',
  },
  timeValue: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sltpRow: {
    flexDirection: 'row',
    gap: 12,
  },
  sltpText: {
    color: THEME.colors.textMuted,
    fontSize: 11,
  },
  closeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: THEME.colors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: THEME.colors.borderLight,
  },
  closeBtnText: {
    color: THEME.colors.textPrimary,
    fontSize: 11,
    fontWeight: '600',
  },
  closedCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  closedDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  closedSub: {
    color: THEME.colors.textMuted,
    fontSize: 11,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  emptyDesc: {
    color: THEME.colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});
