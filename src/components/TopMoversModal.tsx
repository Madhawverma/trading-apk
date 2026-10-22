import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Line } from 'react-native-svg';
import { CurrencyIcon } from './CurrencyIcon';

interface TopMoverInstrument {
  id: string;
  symbol: string;
  cleanSymbol: string;
  basePrice: number;
  decimals: number;
  changePercent: number;
  sparklineVariant: number;
}

interface CategorySection {
  title: string;
  items: TopMoverInstrument[];
}

const CATEGORIES_DATA: CategorySection[] = [
  {
    title: 'ALL',
    items: [
      { id: 'all-btcjpy', symbol: 'BTC/JPY', cleanSymbol: 'BTCJPY', basePrice: 12834343.0, decimals: 2, changePercent: -3.42, sparklineVariant: 1 },
      { id: 'all-xaggbp', symbol: 'XAG/GBP', cleanSymbol: 'XAGGBP', basePrice: 41.67, decimals: 3, changePercent: -2.84, sparklineVariant: 2 },
      { id: 'all-xageur', symbol: 'XAG/EUR', cleanSymbol: 'XAGEUR', basePrice: 49.728, decimals: 3, changePercent: -2.77, sparklineVariant: 3 },
      { id: 'all-xagusd', symbol: 'XAG/USD', cleanSymbol: 'XAGUSD', basePrice: 55.886, decimals: 3, changePercent: -2.75, sparklineVariant: 4 },
      { id: 'all-hk50', symbol: 'HK50', cleanSymbol: 'HK50', basePrice: 22908.5, decimals: 2, changePercent: -2.65, sparklineVariant: 1 },
      { id: 'all-jp225', symbol: 'JP225', cleanSymbol: 'JP225', basePrice: 62802.4, decimals: 2, changePercent: -2.45, sparklineVariant: 2 },
    ],
  },
  {
    title: 'MAJORS',
    items: [
      { id: 'maj-usdjpy', symbol: 'USD/JPY', cleanSymbol: 'USDJPY', basePrice: 156.991, decimals: 3, changePercent: -0.73, sparklineVariant: 3 },
      { id: 'maj-usdchf', symbol: 'USD/CHF', cleanSymbol: 'USDCHF', basePrice: 0.81954, decimals: 5, changePercent: -0.56, sparklineVariant: 1 },
      { id: 'maj-audusd', symbol: 'AUD/USD', cleanSymbol: 'AUDUSD', basePrice: 0.70139, decimals: 5, changePercent: -0.2, sparklineVariant: 4 },
      { id: 'maj-nzdusd', symbol: 'NZD/USD', cleanSymbol: 'NZDUSD', basePrice: 0.56842, decimals: 5, changePercent: -0.24, sparklineVariant: 2 },
      { id: 'maj-eurusd', symbol: 'EUR/USD', cleanSymbol: 'EURUSD', basePrice: 1.0842, decimals: 5, changePercent: -0.18, sparklineVariant: 3 },
      { id: 'maj-gbpusd', symbol: 'GBP/USD', cleanSymbol: 'GBPUSD', basePrice: 1.2915, decimals: 5, changePercent: -0.15, sparklineVariant: 1 },
    ],
  },
  {
    title: 'METALS',
    items: [
      { id: 'met-xaggbp', symbol: 'XAG/GBP', cleanSymbol: 'XAGGBP', basePrice: 41.67, decimals: 3, changePercent: -2.84, sparklineVariant: 2 },
      { id: 'met-xageur', symbol: 'XAG/EUR', cleanSymbol: 'XAGEUR', basePrice: 49.728, decimals: 3, changePercent: -2.77, sparklineVariant: 3 },
      { id: 'met-xagusd', symbol: 'XAG/USD', cleanSymbol: 'XAGUSD', basePrice: 55.886, decimals: 3, changePercent: -2.75, sparklineVariant: 4 },
      { id: 'met-xptusd', symbol: 'XPT/USD', cleanSymbol: 'XPTUSD', basePrice: 1053.4, decimals: 2, changePercent: -2.15, sparklineVariant: 1 },
      { id: 'met-xauusd', symbol: 'XAU/USD', cleanSymbol: 'XAUUSD', basePrice: 2734.8, decimals: 2, changePercent: -1.82, sparklineVariant: 2 },
    ],
  },
  {
    title: 'CRYPTO',
    items: [
      { id: 'cry-btcjpy', symbol: 'BTC/JPY', cleanSymbol: 'BTCJPY', basePrice: 12834343.0, decimals: 2, changePercent: -3.42, sparklineVariant: 1 },
      { id: 'cry-btccnh', symbol: 'BTC/CNH', cleanSymbol: 'BTCCNH', basePrice: 545339.2, decimals: 2, changePercent: -2.72, sparklineVariant: 2 },
      { id: 'cry-btc', symbol: 'BTC', cleanSymbol: 'BTC', basePrice: 81749.26, decimals: 2, changePercent: -2.72, sparklineVariant: 3 },
      { id: 'cry-btcusd', symbol: 'BTC/USD', cleanSymbol: 'BTCUSD', basePrice: 81752.4, decimals: 2, changePercent: -2.7, sparklineVariant: 4 },
      { id: 'cry-ethusd', symbol: 'ETH/USD', cleanSymbol: 'ETHUSD', basePrice: 3142.5, decimals: 2, changePercent: -2.48, sparklineVariant: 1 },
      { id: 'cry-solusd', symbol: 'SOL/USD', cleanSymbol: 'SOLUSD', basePrice: 184.2, decimals: 2, changePercent: -2.3, sparklineVariant: 2 },
    ],
  },
  {
    title: 'INDICES',
    items: [
      { id: 'ind-hk50', symbol: 'HK50', cleanSymbol: 'HK50', basePrice: 22908.5, decimals: 2, changePercent: -2.65, sparklineVariant: 1 },
      { id: 'ind-jp225', symbol: 'JP225', cleanSymbol: 'JP225', basePrice: 62802.4, decimals: 2, changePercent: -2.45, sparklineVariant: 2 },
      { id: 'ind-stoxx50', symbol: 'STOXX50', cleanSymbol: 'STOXX50', basePrice: 6105.11, decimals: 2, changePercent: -2.1, sparklineVariant: 3 },
      { id: 'ind-ustec', symbol: 'USTEC', cleanSymbol: 'USTEC', basePrice: 29268.4, decimals: 2, changePercent: -1.95, sparklineVariant: 4 },
      { id: 'ind-us30', symbol: 'US30', cleanSymbol: 'US30', basePrice: 43810.2, decimals: 2, changePercent: -1.6, sparklineVariant: 1 },
    ],
  },
];

const renderMoverSparkline = (variant: number) => {
  let path = '';
  switch (variant) {
    case 1:
      path = 'M 0 10 L 8 9 L 18 13 L 28 11 L 38 15 L 48 14 L 58 19 L 68 18 L 78 24 L 88 27';
      break;
    case 2:
      path = 'M 0 8 L 10 11 L 20 9 L 32 15 L 42 13 L 52 18 L 62 17 L 72 23 L 80 22 L 88 26';
      break;
    case 3:
      path = 'M 0 11 L 12 10 L 22 14 L 34 12 L 44 17 L 54 16 L 66 22 L 76 21 L 88 28';
      break;
    case 4:
    default:
      path = 'M 0 9 L 10 7 L 22 13 L 32 12 L 42 16 L 54 15 L 64 20 L 74 19 L 88 27';
      break;
  }

  return (
    <Svg width="90" height="32" viewBox="0 0 90 32">
      {/* Horizontal dashed reference midline */}
      <Line
        x1="0"
        y1="14"
        x2="90"
        y2="14"
        stroke="#C4CDD5"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      {/* Red trend curve */}
      <Path
        d={path}
        fill="none"
        stroke="#E53935"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

interface TopMoversModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectInstrument?: (symbol: string) => void;
}

export const TopMoversModal: React.FC<TopMoversModalProps> = ({
  visible,
  onClose,
  onSelectInstrument,
}) => {
  // Live fluctuating prices state
  const [prices, setPrices] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    CATEGORIES_DATA.forEach(cat => {
      cat.items.forEach(item => {
        initial[item.id] = item.basePrice;
      });
    });
    return initial;
  });

  const [flashingItem, setFlashingItem] = useState<{ id: string; isUp: boolean } | null>(null);

  // Periodic price live update tick simulation (1600ms)
  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      // Pick 1-2 random items across all categories to tick
      const allItems: TopMoverInstrument[] = [];
      CATEGORIES_DATA.forEach(c => allItems.push(...c.items));

      const randomIndex = Math.floor(Math.random() * allItems.length);
      const target = allItems[randomIndex];
      if (!target) return;

      const isUp = Math.random() > 0.55;
      const variationFactor = (Math.random() * 0.0004 + 0.0001) * (isUp ? 1 : -1);

      setPrices(prev => {
        const currentPrice = prev[target.id] || target.basePrice;
        const newPrice = Math.max(0.00001, currentPrice * (1 + variationFactor));
        return {
          ...prev,
          [target.id]: newPrice,
        };
      });

      setFlashingItem({ id: target.id, isUp });
      const timer = setTimeout(() => {
        setFlashingItem(null);
      }, 700);

      return () => clearTimeout(timer);
    }, 1600);

    return () => clearInterval(interval);
  }, [visible]);

  const handleCardPress = (item: TopMoverInstrument) => {
    onClose();
    if (onSelectInstrument) {
      onSelectInstrument(item.cleanSymbol);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Top Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={26} color="#111624" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Top Movers</Text>
        </View>

        {/* Date Filter Pill */}
        <View style={styles.filterPillContainer}>
          <View style={styles.datePill}>
            <Ionicons name="calendar-outline" size={14} color="#475569" style={{ marginRight: 6 }} />
            <Text style={styles.datePillText}>Today</Text>
          </View>
        </View>

        {/* Content Scroll */}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {CATEGORIES_DATA.map(section => (
            <View key={section.title} style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
              >
                {section.items.map(item => {
                  const currentPrice = prices[item.id] !== undefined ? prices[item.id] : item.basePrice;
                  const isCurrentFlashing = flashingItem?.id === item.id;
                  const formattedPrice = currentPrice.toFixed(item.decimals);

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.card,
                        isCurrentFlashing && {
                          borderColor: flashingItem?.isUp ? '#10B981' : '#EF4444',
                        },
                      ]}
                      onPress={() => handleCardPress(item)}
                      activeOpacity={0.8}
                    >
                      {/* Card Top: Currency Icon + Symbol */}
                      <View style={styles.cardHeader}>
                        <CurrencyIcon symbol={item.cleanSymbol} size={22} />
                        <Text style={styles.symbolText} numberOfLines={1}>
                          {item.symbol}
                        </Text>
                      </View>

                      {/* Sparkline */}
                      <View style={styles.sparklineContainer}>
                        {renderMoverSparkline(item.sparklineVariant)}
                      </View>

                      {/* Live Price */}
                      <Text
                        style={[
                          styles.priceText,
                          isCurrentFlashing && {
                            color: flashingItem?.isUp ? '#10B981' : '#E53935',
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {formattedPrice}
                      </Text>

                      {/* Percentage Change */}
                      <View style={styles.changeRow}>
                        <Ionicons name="arrow-down" size={11} color="#E53935" style={{ marginRight: 2 }} />
                        <Text style={styles.changeText}>
                          {Math.abs(item.changePercent).toFixed(2)}%
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
    backgroundColor: '#FAFBFC',
  },
  backButton: {
    paddingRight: 8,
    paddingVertical: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111624',
    letterSpacing: -0.2,
  },
  filterPillContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF2F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  datePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionContainer: {
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8F9CA9',
    letterSpacing: 1.1,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  card: {
    width: 114,
    minHeight: 134,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8ECF0',
    paddingHorizontal: 8,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    width: '100%',
    paddingHorizontal: 2,
  },
  symbolText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111624',
    flexShrink: 1,
  },
  sparklineContainer: {
    width: 90,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  priceText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111624',
    textAlign: 'center',
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#E53935',
  },
});
