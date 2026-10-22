import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { THEME } from '../constants/theme';
import { useTrading } from '../context/TradingContext';
import { MarketCategory, SymbolData } from '../types/trading';
import { CurrencyIcon } from './CurrencyIcon';

interface WatchlistProps {
  onSelectSymbolForTrade: (symbol: SymbolData, type: 'BUY' | 'SELL') => void;
  onOpenChart: (symbol: SymbolData) => void;
}

const CATEGORIES: MarketCategory[] = ['All', 'Metals', 'Forex', 'Crypto', 'Indices'];

export const Watchlist: React.FC<WatchlistProps> = ({
  onSelectSymbolForTrade,
  onOpenChart,
}) => {
  const { symbols, recentPriceUpdate, setSelectedSymbol } = useTrading();
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSymbols = symbols.filter(sym => {
    const matchesCategory =
      selectedCategory === 'All' || sym.category === selectedCategory;
    const matchesSearch =
      sym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sym.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderSparkline = (points: number[], isPositive: boolean) => {
    if (!points || points.length < 2) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 60;
    const height = 24;

    const path = points
      .map((val, idx) => {
        const x = (idx / (points.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');

    return (
      <Svg width={width} height={height}>
        <Path
          d={path}
          fill="none"
          stroke={isPositive ? THEME.colors.buyGreen : THEME.colors.sellRed}
          strokeWidth="1.6"
        />
      </Svg>
    );
  };

  const renderSymbolItem = ({ item }: { item: SymbolData }) => {
    const isUp = item.changePercent >= 0;
    const tickState = recentPriceUpdate[item.id];

    return (
      <TouchableOpacity
        style={styles.symbolCard}
        activeOpacity={0.8}
        onPress={() => {
          setSelectedSymbol(item);
          onOpenChart(item);
        }}
      >
        {/* Left Symbol Info */}
        <View style={styles.symbolLeft}>
          <CurrencyIcon symbol={item.id} size={28} />
          <View style={{ marginLeft: 10 }}>
            <View style={styles.symbolNameRow}>
              <Text style={styles.symbolName}>{item.name}</Text>
              <View style={styles.spreadBadge}>
                <Text style={styles.spreadText}>{item.spread}</Text>
              </View>
            </View>
            <Text style={styles.symbolFullName} numberOfLines={1}>
              {item.fullName}
            </Text>
          </View>
        </View>

        {/* Center Sparkline */}
        <View style={styles.sparklineContainer}>
          {renderSparkline(item.sparkline, isUp)}
          <Text
            style={[
              styles.changePercent,
              { color: isUp ? THEME.colors.buyGreen : THEME.colors.sellRed },
            ]}
          >
            {isUp ? '+' : ''}{item.changePercent.toFixed(2)}%
          </Text>
        </View>

        {/* Right Trading Action Buttons (Bid / Ask) */}
        <View style={styles.tradeButtonsCol}>
          {/* Sell / Bid */}
          <TouchableOpacity
            style={[
              styles.quoteBox,
              tickState === 'down' && styles.flashDown,
            ]}
            onPress={() => {
              setSelectedSymbol(item);
              onSelectSymbolForTrade(item, 'SELL');
            }}
          >
            <Text style={styles.quoteLabel}>Sell</Text>
            <Text style={styles.quotePrice}>
              {item.bid.toFixed(item.digits > 3 ? 4 : item.digits)}
            </Text>
          </TouchableOpacity>

          {/* Buy / Ask */}
          <TouchableOpacity
            style={[
              styles.quoteBox,
              tickState === 'up' && styles.flashUp,
            ]}
            onPress={() => {
              setSelectedSymbol(item);
              onSelectSymbolForTrade(item, 'BUY');
            }}
          >
            <Text style={styles.quoteLabel}>Buy</Text>
            <Text style={styles.quotePrice}>
              {item.ask.toFixed(item.digits > 3 ? 4 : item.digits)}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={THEME.colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search instruments (Gold, BTC, EUR...)"
          placeholderTextColor={THEME.colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={THEME.colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
      >
        {CATEGORIES.map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryPill, isActive && styles.categoryPillActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  isActive && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Instrument List */}
      <FlatList
        data={filteredSymbols}
        keyExtractor={item => item.id}
        renderItem={renderSymbolItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingHorizontal: THEME.spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    color: THEME.colors.textPrimary,
    fontSize: 13,
    paddingVertical: 2,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 10,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.full,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  categoryPillActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  categoryText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: THEME.colors.textDark,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 80,
  },
  symbolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  symbolLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '38%',
  },
  symbolIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.borderLight,
  },
  symbolInitial: {
    color: THEME.colors.primary,
    fontSize: 10,
    fontWeight: '800',
  },
  symbolNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  symbolName: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  spreadBadge: {
    backgroundColor: THEME.colors.surfaceLight,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  spreadText: {
    color: THEME.colors.textMuted,
    fontSize: 9,
    fontWeight: '600',
  },
  symbolFullName: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  sparklineContainer: {
    alignItems: 'center',
    width: '24%',
  },
  changePercent: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  tradeButtonsCol: {
    flexDirection: 'row',
    gap: 6,
    width: '36%',
    justifyContent: 'flex-end',
  },
  quoteBox: {
    backgroundColor: THEME.colors.surfaceLight,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: THEME.borderRadius.sm,
    alignItems: 'center',
    minWidth: 54,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  quoteLabel: {
    color: THEME.colors.textMuted,
    fontSize: 9,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  quotePrice: {
    color: THEME.colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  flashUp: {
    backgroundColor: 'rgba(0, 192, 118, 0.25)',
    borderColor: THEME.colors.buyGreen,
  },
  flashDown: {
    backgroundColor: 'rgba(255, 75, 85, 0.25)',
    borderColor: THEME.colors.sellRed,
  },
});
