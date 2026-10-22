import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
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
import { SymbolData } from '../types/trading';
import { CurrencyIcon } from './CurrencyIcon';

interface TradeScreenProps {
  onSelectInstrument: (symbol: SymbolData) => void;
}

interface InstrumentItem {
  id: string;
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  digits: number;
  category: 'Crypto' | 'Metals' | 'Majors' | 'Indices' | 'Stocks' | 'Energies' | 'Exotic' | 'Minors';
  isFavorite?: boolean;
  isMostTraded?: boolean;
  isTopMover?: boolean;
  isUp: boolean;
  trend: number[];
}

const TRADE_INSTRUMENTS: InstrumentItem[] = [
  // CRYPTO & METALS (Favorites)
  {
    id: 'BTC',
    symbol: 'BTC',
    name: 'Bitcoin vs US Dollar',
    price: 82448.95,
    changePercent: -1.88,
    digits: 2,
    category: 'Crypto',
    isFavorite: true,
    isMostTraded: true,
    isTopMover: true,
    isUp: false,
    trend: [0.8, 0.45, 0.42, 0.35, 0.38, 0.3, 0.25],
  },
  {
    id: 'XAUUSD',
    symbol: 'XAU/USD',
    name: 'Gold vs US Dollar',
    price: 4092.808,
    changePercent: -0.79,
    digits: 3,
    category: 'Metals',
    isFavorite: true,
    isMostTraded: true,
    isUp: false,
    trend: [0.85, 0.5, 0.45, 0.38, 0.48, 0.22, 0.3],
  },
  {
    id: 'XAGUSD',
    symbol: 'XAG/USD',
    name: 'Silver vs US Dollar',
    price: 56.147,
    changePercent: -2.30,
    digits: 3,
    category: 'Metals',
    isFavorite: true,
    isTopMover: true,
    isUp: false,
    trend: [0.8, 0.55, 0.45, 0.4, 0.32, 0.25, 0.2],
  },
  {
    id: 'ETH',
    symbol: 'ETH',
    name: 'Ethereum vs US Dollar',
    price: 2431.05,
    changePercent: -1.64,
    digits: 2,
    category: 'Crypto',
    isFavorite: true,
    isMostTraded: true,
    isUp: false,
    trend: [0.82, 0.52, 0.44, 0.38, 0.32, 0.28, 0.25],
  },
  {
    id: 'SOL',
    symbol: 'SOL',
    name: 'Solana vs US Dollar',
    price: 182.40,
    changePercent: 3.45,
    digits: 2,
    category: 'Crypto',
    isFavorite: false,
    isTopMover: true,
    isUp: true,
    trend: [0.3, 0.4, 0.55, 0.62, 0.78, 0.85, 0.9],
  },

  // ENERGIES
  {
    id: 'USOIL',
    symbol: 'USOIL',
    name: 'Crude Oil',
    price: 98.850,
    changePercent: 1.28,
    digits: 3,
    category: 'Energies',
    isFavorite: true,
    isMostTraded: true,
    isUp: true,
    trend: [0.2, 0.35, 0.4, 0.55, 0.62, 0.75, 0.88],
  },
  {
    id: 'UKOIL',
    symbol: 'UKOIL',
    name: 'Brent Crude Oil',
    price: 102.420,
    changePercent: 1.15,
    digits: 3,
    category: 'Energies',
    isFavorite: false,
    isUp: true,
    trend: [0.25, 0.38, 0.42, 0.58, 0.65, 0.78, 0.85],
  },
  {
    id: 'XNGUSD',
    symbol: 'XNG/USD',
    name: 'Natural Gas',
    price: 2.784,
    changePercent: -3.12,
    digits: 3,
    category: 'Energies',
    isFavorite: false,
    isTopMover: true,
    isUp: false,
    trend: [0.85, 0.65, 0.5, 0.4, 0.32, 0.25, 0.18],
  },

  // MAJORS
  {
    id: 'USDJPY',
    symbol: 'USD/JPY',
    name: 'US Dollar vs Japanese Yen',
    price: 157.112,
    changePercent: -0.66,
    digits: 3,
    category: 'Majors',
    isFavorite: true,
    isMostTraded: true,
    isUp: false,
    trend: [0.75, 0.6, 0.5, 0.45, 0.38, 0.32, 0.28],
  },
  {
    id: 'EURUSD',
    symbol: 'EUR/USD',
    name: 'Euro vs US Dollar',
    price: 1.12432,
    changePercent: 0.09,
    digits: 5,
    category: 'Majors',
    isFavorite: true,
    isMostTraded: true,
    isUp: true,
    trend: [0.45, 0.42, 0.48, 0.85, 0.78, 0.82, 0.8],
  },
  {
    id: 'GBPUSD',
    symbol: 'GBP/USD',
    name: 'Great Britain Pound vs USD',
    price: 1.29840,
    changePercent: 0.15,
    digits: 5,
    category: 'Majors',
    isFavorite: false,
    isMostTraded: true,
    isUp: true,
    trend: [0.4, 0.45, 0.5, 0.65, 0.6, 0.72, 0.75],
  },
  {
    id: 'AUDUSD',
    symbol: 'AUD/USD',
    name: 'Australian Dollar vs USD',
    price: 0.65820,
    changePercent: -0.35,
    digits: 5,
    category: 'Majors',
    isFavorite: false,
    isUp: false,
    trend: [0.7, 0.65, 0.55, 0.48, 0.42, 0.38, 0.35],
  },

  // INDICES
  {
    id: 'USTEC',
    symbol: 'USTEC',
    name: 'US Tech 100 Index',
    price: 29382.54,
    changePercent: -0.77,
    digits: 2,
    category: 'Indices',
    isFavorite: true,
    isMostTraded: true,
    isUp: false,
    trend: [0.78, 0.6, 0.52, 0.48, 0.42, 0.35, 0.3],
  },
  {
    id: 'US30',
    symbol: 'US30',
    name: 'Wall Street 30 Index',
    price: 43210.80,
    changePercent: 0.42,
    digits: 2,
    category: 'Indices',
    isFavorite: false,
    isMostTraded: true,
    isUp: true,
    trend: [0.35, 0.45, 0.5, 0.62, 0.7, 0.75, 0.8],
  },
  {
    id: 'HK50',
    symbol: 'HK50',
    name: 'Hong Kong 50 Index',
    price: 22908.40,
    changePercent: -2.67,
    digits: 2,
    category: 'Indices',
    isFavorite: false,
    isTopMover: true,
    isUp: false,
    trend: [0.82, 0.55, 0.4, 0.35, 0.28, 0.22, 0.18],
  },

  // STOCKS
  {
    id: 'NVDA',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 138.25,
    changePercent: 3.82,
    digits: 2,
    category: 'Stocks',
    isFavorite: false,
    isTopMover: true,
    isMostTraded: true,
    isUp: true,
    trend: [0.2, 0.35, 0.5, 0.65, 0.72, 0.85, 0.95],
  },
  {
    id: 'TSLA',
    symbol: 'TSLA',
    name: 'Tesla Motors Inc',
    price: 218.40,
    changePercent: -2.85,
    digits: 2,
    category: 'Stocks',
    isFavorite: false,
    isTopMover: true,
    isMostTraded: true,
    isUp: false,
    trend: [0.85, 0.6, 0.45, 0.38, 0.32, 0.25, 0.2],
  },
  {
    id: 'AAPL',
    symbol: 'AAPL',
    name: 'Apple Inc',
    price: 232.10,
    changePercent: 0.64,
    digits: 2,
    category: 'Stocks',
    isFavorite: false,
    isUp: true,
    trend: [0.4, 0.48, 0.55, 0.6, 0.68, 0.72, 0.75],
  },

  // MINORS
  {
    id: 'EURGBP',
    symbol: 'EUR/GBP',
    name: 'Euro vs Great Britain Pound',
    price: 0.86590,
    changePercent: -0.12,
    digits: 5,
    category: 'Minors',
    isFavorite: false,
    isUp: false,
    trend: [0.65, 0.6, 0.52, 0.48, 0.44, 0.42, 0.4],
  },
  {
    id: 'GBPJPY',
    symbol: 'GBP/JPY',
    name: 'GB Pound vs Japanese Yen',
    price: 203.950,
    changePercent: 0.82,
    digits: 3,
    category: 'Minors',
    isFavorite: false,
    isMostTraded: true,
    isUp: true,
    trend: [0.3, 0.42, 0.5, 0.65, 0.75, 0.82, 0.88],
  },

  // EXOTIC
  {
    id: 'USDZAR',
    symbol: 'USD/ZAR',
    name: 'US Dollar vs South African Rand',
    price: 17.6540,
    changePercent: 1.84,
    digits: 4,
    category: 'Exotic',
    isFavorite: false,
    isTopMover: true,
    isUp: true,
    trend: [0.25, 0.4, 0.52, 0.68, 0.75, 0.85, 0.92],
  },
  {
    id: 'USDTRY',
    symbol: 'USD/TRY',
    name: 'US Dollar vs Turkish Lira',
    price: 34.2810,
    changePercent: 0.22,
    digits: 4,
    category: 'Exotic',
    isFavorite: false,
    isUp: true,
    trend: [0.45, 0.5, 0.52, 0.55, 0.6, 0.62, 0.65],
  },
];

// Tabs requested by user:
const CATEGORIES = [
  'Favorites',
  'Most traded',
  'Top Movers',
  'Majors',
  'Metals',
  'Crypto',
  'Indices',
  'Stocks',
  'Energies',
  'Exotic',
  'Minors',
  'All',
];

export const TradeScreen: React.FC<TradeScreenProps> = ({ onSelectInstrument }) => {
  const { account } = useTrading();
  const [activeCategory, setActiveCategory] = useState('Favorites');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Flag helpers
  const renderUsFlag = (size = 18) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="11" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1" />
      <Path d="M1 8.5H23M1 12H23M1 15.5H23" stroke="#D9383A" strokeWidth="2.2" />
      <Rect x="1" y="1" width="11" height="11" rx="2" fill="#1665D8" />
      <Circle cx="6.5" cy="6.5" r="2" fill="#FFFFFF" />
    </Svg>
  );

  const renderJapanFlag = (size = 18) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="11" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1" />
      <Circle cx="12" cy="12" r="5" fill="#D9383A" />
    </Svg>
  );

  const renderUkFlag = (size = 18) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="11" fill="#012169" />
      <Path d="M0 0 L24 24 M24 0 L0 24" stroke="#FFFFFF" strokeWidth="3" />
      <Path d="M0 0 L24 24 M24 0 L0 24" stroke="#C8102E" strokeWidth="1.5" />
      <Path d="M12 0 V24 M0 12 H24" stroke="#FFFFFF" strokeWidth="5" />
      <Path d="M12 0 V24 M0 12 H24" stroke="#C8102E" strokeWidth="3" />
    </Svg>
  );

  const renderEuFlag = (size = 18) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="11" fill="#1665D8" stroke="#0E4494" strokeWidth="1" />
      <Circle cx="12" cy="7" r="1.2" fill="#FFDE00" />
      <Circle cx="12" cy="17" r="1.2" fill="#FFDE00" />
      <Circle cx="7" cy="12" r="1.2" fill="#FFDE00" />
      <Circle cx="17" cy="12" r="1.2" fill="#FFDE00" />
    </Svg>
  );

  const renderAustraliaFlag = (size = 18) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="11" fill="#012169" />
      <Rect x="1" y="1" width="10" height="9" fill="#012169" />
      <Path d="M1 1 L11 10 M11 1 L1 10" stroke="#FFFFFF" strokeWidth="1.5" />
      <Circle cx="17" cy="16" r="2" fill="#FFFFFF" />
      <Circle cx="15" cy="8" r="1" fill="#FFFFFF" />
    </Svg>
  );

  const renderSouthAfricaFlag = (size = 18) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="11" fill="#007749" />
      <Path d="M1 1 L12 12 L1 23" fill="#000000" stroke="#FFB612" strokeWidth="1.5" />
      <Path d="M12 12 L23 1 L23 6 L14 12 L23 18 L23 23 Z" fill="#001489" />
    </Svg>
  );

  const renderTurkeyFlag = (size = 18) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="11" fill="#E30A17" />
      <Circle cx="11" cy="12" r="4.5" fill="#FFFFFF" />
      <Circle cx="12" cy="12" r="3.8" fill="#E30A17" />
    </Svg>
  );

  // Dynamic icon selector based on symbol ID
  const renderInstrumentIcon = (item: InstrumentItem) => {
    return <CurrencyIcon symbol={item.id || item.symbol} size={28} />;
  };

  // Sparkline generator
  const renderSparkline = (item: InstrumentItem) => {
    const width = 80;
    const height = 26;
    const strokeColor = item.isUp ? '#2684FF' : '#E03D40';

    const points = item.trend;
    const pathD = points
      .map((val, idx) => {
        const x = (idx / (points.length - 1)) * width;
        const y = height - val * height;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');

    const fillD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

    return (
      <View style={styles.sparklineBox}>
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id={`grad-${item.id}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
              <Stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
            </LinearGradient>
          </Defs>

          <Line
            x1="0"
            y1={height * 0.3}
            x2={width}
            y2={height * 0.3}
            stroke="#9CA5B3"
            strokeWidth="1"
            strokeDasharray="2.5, 2.5"
          />

          <Path d={fillD} fill={`url(#grad-${item.id})`} />
          <Path d={pathD} fill="none" stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round" />
        </Svg>
      </View>
    );
  };

  // Filter instruments based on active category
  const filtered = TRADE_INSTRUMENTS.filter(inst => {
    const matchesSearch =
      inst.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    switch (activeCategory) {
      case 'Favorites':
        return Boolean(inst.isFavorite);
      case 'Most traded':
        return Boolean(inst.isMostTraded);
      case 'Top Movers':
        return Boolean(inst.isTopMover);
      case 'Majors':
        return inst.category === 'Majors';
      case 'Metals':
        return inst.category === 'Metals';
      case 'Crypto':
        return inst.category === 'Crypto';
      case 'Indices':
        return inst.category === 'Indices';
      case 'Stocks':
        return inst.category === 'Stocks';
      case 'Energies':
        return inst.category === 'Energies';
      case 'Exotic':
        return inst.category === 'Exotic';
      case 'Minors':
        return inst.category === 'Minors';
      case 'All':
      default:
        return true;
    }
  });

  const renderItem = ({ item }: { item: InstrumentItem }) => {
    const arrow = item.isUp ? '↑ ' : '↓ ';
    const changeColor = item.isUp ? '#2684FF' : '#D9383A';

    return (
      <TouchableOpacity
        style={styles.instrumentRow}
        activeOpacity={0.7}
        onPress={() => {
          onSelectInstrument({
            id: item.id,
            name: item.symbol,
            fullName: item.name,
            category: item.category as any,
            bid: item.price,
            ask: item.price * 1.0001,
            spread: 1.2,
            changePercent: item.changePercent,
            high24h: item.price * 1.02,
            low24h: item.price * 0.98,
            digits: item.digits,
            sparkline: item.trend.map(v => item.price * (1 + (v - 0.5) * 0.01)),
            contractSize: item.category === 'Crypto' ? 1 : 100,
          });
        }}
      >
        {/* Left: Icon and Name */}
        <View style={styles.leftCol}>
          <View style={styles.iconContainer}>{renderInstrumentIcon(item)}</View>
          <View style={styles.nameContainer}>
            <Text style={styles.symbolText}>{item.symbol}</Text>
            <Text style={styles.fullNameText}>{item.name}</Text>
          </View>
        </View>

        {/* Center: Sparkline with dotted baseline */}
        <View style={styles.centerCol}>{renderSparkline(item)}</View>

        {/* Right: Price and % Change */}
        <View style={styles.rightCol}>
          <Text style={styles.priceText}>
            {item.price.toFixed(item.digits)}
          </Text>
          <Text style={[styles.changeText, { color: changeColor }]}>
            {arrow}{Math.abs(item.changePercent).toFixed(2)}%
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Floating Pill: 0.00 USD : */}
      <View style={styles.topCenterPillRow}>
        <View style={styles.balancePill}>
          <Text style={styles.balancePillText}>
            {account.balance.toFixed(2)} USD
          </Text>
          <Ionicons name="ellipsis-vertical" size={13} color="#111624" />
        </View>
      </View>

      {/* Main Title Row: Trade + Clock */}
      <View style={styles.titleHeader}>
        <Text style={styles.mainTitle}>Trade</Text>
        <TouchableOpacity activeOpacity={0.7} style={styles.clockBtn}>
          <Ionicons name="alarm-outline" size={24} color="#111624" />
        </TouchableOpacity>
      </View>

      {/* Categories Horizontal Tabs (User exact list) */}
      <View style={styles.categoryBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={styles.categoryTab}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[styles.categoryTabText, isActive && styles.categoryTabTextActive]}>
                  {cat}
                </Text>
                {isActive && <View style={styles.activeTabUnderline} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Search Icon on the right */}
        <TouchableOpacity
          style={styles.searchIconButton}
          onPress={() => setSearchOpen(!searchOpen)}
        >
          <Ionicons name="search" size={20} color="#111624" />
        </TouchableOpacity>
      </View>

      {/* Search Input Box */}
      {searchOpen && (
        <View style={styles.searchBarBox}>
          <Ionicons name="search" size={16} color="#9CA5B3" />
          <TextInput
            style={styles.searchInputField}
            placeholder="Search all instruments..."
            placeholderTextColor="#9CA5B3"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>
      )}

      {/* Filter / Edit Sub-bar */}
      <View style={styles.filterSubBar}>
        <View style={styles.subPill}>
          <Text style={styles.subPillText}>Sorted manually</Text>
        </View>
        <TouchableOpacity style={styles.subPill}>
          <Text style={styles.subPillText}>Edit </Text>
          <Ionicons name="create-outline" size={13} color="#111624" />
        </TouchableOpacity>
      </View>

      {/* Instruments List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topCenterPillRow: {
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 2,
  },
  balancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8EBEF',
  },
  balancePillText: {
    color: '#111624',
    fontSize: 13,
    fontWeight: '700',
  },
  titleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 10,
  },
  mainTitle: {
    color: '#111624',
    fontSize: 24,
    fontWeight: '800',
  },
  clockBtn: {
    padding: 2,
  },
  categoryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EBEF',
    paddingRight: 16,
  },
  categoryScroll: {
    paddingHorizontal: 18,
    gap: 20,
  },
  categoryTab: {
    paddingBottom: 10,
    position: 'relative',
  },
  categoryTabText: {
    color: '#9CA5B3',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTabTextActive: {
    color: '#111624',
    fontWeight: '700',
  },
  activeTabUnderline: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 2.2,
    backgroundColor: '#111624',
  },
  searchIconButton: {
    paddingBottom: 10,
    paddingLeft: 10,
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0F2F5',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  searchInputField: {
    flex: 1,
    color: '#111624',
    fontSize: 13,
  },
  filterSubBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
  },
  subPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  subPillText: {
    color: '#111624',
    fontSize: 12,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 80,
  },
  instrumentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F6F8',
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '38%',
  },
  iconContainer: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  singleIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btcSymbolText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  dualIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goldBadge: {
    zIndex: 1,
  },
  silverBadge: {
    zIndex: 1,
  },
  overlapFlag: {
    marginLeft: -8,
    zIndex: 2,
  },
  nameContainer: {
    flex: 1,
  },
  symbolText: {
    color: '#111624',
    fontSize: 14,
    fontWeight: '800',
  },
  fullNameText: {
    color: '#9CA5B3',
    fontSize: 11,
    marginTop: 2,
  },
  centerCol: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparklineBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightCol: {
    width: '32%',
    alignItems: 'flex-end',
  },
  priceText: {
    color: '#111624',
    fontSize: 14,
    fontWeight: '700',
  },
  changeText: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
  },
});
