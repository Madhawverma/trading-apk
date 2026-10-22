import React, { useState } from 'react';
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

export interface TradingSignalItem {
  id: string;
  instrument: string;
  isUp: boolean;
  time: string;
  headline: string;
  description: string;
  isFavorite: boolean;
  timeframe?: string;
  pivot?: number;
  tp1?: number;
  tp2?: number;
  sl?: number;
  preference?: string;
  alternative?: string;
  commentary?: string;
}

export const ALL_SIGNALS_DATA: TradingSignalItem[] = [
  {
    id: 'sig-eth-1',
    instrument: 'ETH',
    isUp: false,
    time: '14:23',
    headline: 'Ether / Dollar intraday: the RSI is oversold',
    description: 'The configuration is negative.',
    isFavorite: true,
    timeframe: '30 MIN',
    pivot: 2467,
    tp1: 2394,
    tp2: 2375,
    sl: 2515,
    preference: 'Short positions below 2,467 with targets at 2,394 & 2,375 in extension.',
    alternative: 'Above 2,467 look for further upside with 2,520 & 2,560 as targets.',
    commentary: 'The RSI is breaking below its neutrality area at 50. The MACD is negative and below its signal line. The configuration is negative. Further downside expected.',
  },
  {
    id: 'sig-btc-1',
    instrument: 'BTC',
    isUp: false,
    time: '14:22',
    headline: 'Bitcoin / Dollar intraday: the RSI is oversold',
    description: 'Our preference: the downside prevails as long as 82820 is resistance.',
    isFavorite: true,
    timeframe: '30 MIN',
    pivot: 82820,
    tp1: 81155,
    tp2: 80777,
    sl: 83500,
    preference: 'Short positions below 82,820 with targets at 81,155 & 80,777 in extension.',
    alternative: 'Above 82,820 look for further upside with 83,900 & 84,600 as targets.',
    commentary: 'The downside prevails as long as 82,820 is resistance. Prices stay capped below falling moving averages.',
  },
  {
    id: 'sig-eth-2',
    instrument: 'ETH',
    isUp: false,
    time: '14:18',
    headline: 'Intraday : Watching for a Trigger Below Support',
    description: 'The downside prevails as long as 2,467 is resistance, with 2,394 and 2,375 as targets',
    isFavorite: true,
    timeframe: '30 MIN',
    pivot: 2467,
    tp1: 2394,
    tp2: 2375,
    sl: 2505,
    preference: 'Short positions below 2,467 with targets at 2,394 & 2,375 in extension.',
    alternative: 'Above 2,467 look for further upside with 2,510 as target.',
    commentary: 'Momentum oscillators confirm the intraday bearish posture. Waiting for sustained volume breakdown below primary support.',
  },
  {
    id: 'sig-btc-2',
    instrument: 'BTC',
    isUp: false,
    time: '14:18',
    headline: 'Intraday : the RSI is oversold',
    description: 'The downside prevails as long as 82,662 is resistance, with 81,155 and 80,777 as targets',
    isFavorite: true,
    timeframe: '30 MIN',
    pivot: 82662,
    tp1: 81155,
    tp2: 80777,
    sl: 83200,
    preference: 'Short positions below 82,662 with targets at 81,155 & 80,777 in extension.',
    alternative: 'Above 82,662 look for further upside with 83,500 as target.',
    commentary: 'RSI indicators reflect oversold conditions with continuous downward drift capping intraday relief bounces.',
  },
  {
    id: 'sig-xag-1',
    instrument: 'XAG/USD',
    isUp: false,
    time: '13:10',
    headline: 'Intraday : Target 55.22',
    description: 'The downside prevails as long as 57.11 is resistance, with 55.22 and 54.68 as targets',
    isFavorite: true,
    timeframe: '30 MIN',
    pivot: 57.11,
    tp1: 55.22,
    tp2: 54.68,
    sl: 57.85,
    preference: 'Short positions below 57.11 with targets at 55.22 & 54.68 in extension.',
    alternative: 'Above 57.11 look for further upside with 58.20 as target.',
    commentary: 'Precious metals are tracking weaker industrial demand signals, maintaining bearish pressure below 57.11 pivot.',
  },
  {
    id: 'sig-usdjpy-1',
    instrument: 'USD/JPY',
    isUp: false,
    time: '13:10',
    headline: 'Intraday : the RSI is oversold',
    description: 'The downside prevails as long as 157.44 is resistance, with 156.44 and 156.24 as targets',
    isFavorite: true,
    timeframe: '30 MIN',
    pivot: 157.44,
    tp1: 156.44,
    tp2: 156.24,
    sl: 158.0,
    preference: 'Short positions below 157.44 with targets at 156.44 & 156.24 in extension.',
    alternative: 'Above 157.44 look for upside with 158.20 as target.',
    commentary: 'USD/JPY faces firm technical selling pressure as Bank of Japan rate commentary strengthens the Yen across the board.',
  },
  {
    id: 'sig-eurusd-1',
    instrument: 'EUR/USD',
    isUp: true,
    time: '13:10',
    headline: 'Intraday : Target 1.1280',
    description: 'The upside prevails as long as 1.1227 is support, with 1.1280 and 1.1292 as targets',
    isFavorite: true,
    timeframe: '30 MIN',
    pivot: 1.1227,
    tp1: 1.128,
    tp2: 1.1292,
    sl: 1.119,
    preference: 'Long positions above 1.1227 with targets at 1.1280 & 1.1292 in extension.',
    alternative: 'Below 1.1227 look for further downside with 1.1180 as target.',
    commentary: 'Bullish divergence spotted on lower timeframe candles. 1.1227 support baseline remains robust.',
  },
  {
    id: 'sig-xauusd-1',
    instrument: 'XAU/USD',
    isUp: false,
    time: '13:10',
    headline: 'Intraday : 4 064 expected',
    description: 'The downside prevails as long as 4,142 is resistance, with 4,064 and 4,020 as targets',
    isFavorite: true,
    timeframe: '30 MIN',
    pivot: 4142,
    tp1: 4064,
    tp2: 4020,
    sl: 4175,
    preference: 'Short positions below 4,142 with targets at 4,064 & 4,020 in extension.',
    alternative: 'Above 4,142 look for recovery with 4,180 & 4,210 as alternative targets.',
    commentary: 'Gold contracts are cooling off from cycle highs, probing immediate key test levels at 4,064.',
  },
  {
    id: 'sig-de30-1',
    instrument: 'DE30',
    isUp: false,
    time: '11:55',
    headline: 'DE30: key resistance at 25740',
    description: 'Short positions below 25,740 with targets at 25,420 & 25,220 in extension.',
    isFavorite: false,
    timeframe: '30 MIN',
    pivot: 25740,
    tp1: 25420,
    tp2: 25220,
    sl: 25850,
    preference: 'Short positions below 25,740 with targets at 25,420 & 25,220 in extension.',
    alternative: 'Above 25,740 look for upside with 25,940 as target.',
    commentary: 'European equities slide lower under industrial output stagnation.',
  },
  {
    id: 'sig-ustec-1',
    instrument: 'USTEC',
    isUp: true,
    time: '11:30',
    headline: 'USTEC: Bullish breakout above 29150',
    description: 'The upside prevails as long as 29,150 is support, with 29,480 and 29,650 as targets.',
    isFavorite: false,
    timeframe: '30 MIN',
    pivot: 29150,
    tp1: 29480,
    tp2: 29650,
    sl: 28950,
    preference: 'Long positions above 29,150 with targets at 29,480 & 29,650.',
    alternative: 'Below 29,150 look for downside with 28,800 as target.',
    commentary: 'Tech earnings drive strong momentum across semiconductor leaders.',
  },
  {
    id: 'sig-gbpusd-1',
    instrument: 'GBP/USD',
    isUp: false,
    time: '10:45',
    headline: 'GBP/USD: intraday downside pressure',
    description: 'The downside prevails as long as 1.2960 is resistance, with 1.2880 as target.',
    isFavorite: false,
    timeframe: '30 MIN',
    pivot: 1.296,
    tp1: 1.288,
    tp2: 1.284,
    sl: 1.301,
    preference: 'Short positions below 1.2960 with target at 1.2880.',
    alternative: 'Above 1.2960 look for upside toward 1.3020.',
    commentary: 'Sterling trades defensive amid sticky UK inflation data.',
  },
  {
    id: 'sig-us30-1',
    instrument: 'US30',
    isUp: true,
    time: '10:15',
    headline: 'US30: Consolidation near 43800 support',
    description: 'Looking for bullish trigger above 43,800 toward 44,150.',
    isFavorite: false,
    timeframe: '30 MIN',
    pivot: 43800,
    tp1: 44150,
    tp2: 44400,
    sl: 43550,
    preference: 'Long positions above 43,800 with targets at 44,150 & 44,400.',
    alternative: 'Below 43,800 look for drop to 43,500.',
    commentary: 'Dow Jones industrial average testing support with strong institutional bids.',
  },
];

interface TradingSignalsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectSignal: (signal: TradingSignalItem) => void;
}

export const TradingSignalsModal: React.FC<TradingSignalsModalProps> = ({
  visible,
  onClose,
  onSelectSignal,
}) => {
  const [activeTab, setActiveTab] = useState<'Favorites' | 'All'>('Favorites');

  const displayedSignals =
    activeTab === 'Favorites'
      ? ALL_SIGNALS_DATA.filter(s => s.isFavorite)
      : ALL_SIGNALS_DATA;

  const handleSignalClick = (signal: TradingSignalItem) => {
    onClose();
    onSelectSignal(signal);
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
          <Text style={styles.headerTitle}>Trading Signals</Text>
        </View>

        {/* Tabs: Favorites | All */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'Favorites' && styles.activeTabButton]}
            onPress={() => setActiveTab('Favorites')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'Favorites' ? styles.activeTabText : styles.inactiveTabText,
              ]}
            >
              Favorites
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'All' && styles.activeTabButton]}
            onPress={() => setActiveTab('All')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'All' ? styles.activeTabText : styles.inactiveTabText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tabBorderBottom} />

        {/* Signals List */}
        <ScrollView
          style={styles.listContainer}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {displayedSignals.map((signal, index) => (
            <TouchableOpacity
              key={signal.id}
              style={styles.signalRow}
              onPress={() => handleSignalClick(signal)}
              activeOpacity={0.7}
            >
              {/* Top Sub-row: Direction Badge + Symbol + Time */}
              <View style={styles.signalTopRow}>
                <View style={styles.leftMetaRow}>
                  {/* Square Arrow Badge: Red for Down, Blue for Up */}
                  <View
                    style={[
                      styles.directionBadge,
                      { backgroundColor: signal.isUp ? '#1665D8' : '#EA3943' },
                    ]}
                  >
                    <Ionicons
                      name={signal.isUp ? 'arrow-up' : 'arrow-down'}
                      size={12}
                      color="#FFFFFF"
                    />
                  </View>
                  <Text style={styles.instrumentText}>{signal.instrument}</Text>
                </View>
                <Text style={styles.timeText}>{signal.time}</Text>
              </View>

              {/* Headline */}
              <Text style={styles.headlineText} numberOfLines={2}>
                {signal.headline}
              </Text>

              {/* Description */}
              <Text style={styles.descriptionText} numberOfLines={2}>
                {signal.description}
              </Text>

              {/* Item separator line */}
              {index < displayedSignals.length - 1 && <View style={styles.rowDivider} />}
            </TouchableOpacity>
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
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    paddingRight: 10,
    paddingVertical: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111624',
    letterSpacing: -0.3,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#111624',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#111624',
  },
  inactiveTabText: {
    color: '#8F9CA9',
  },
  tabBorderBottom: {
    height: 1,
    backgroundColor: '#EBEFF2',
    marginTop: -1,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 20,
  },
  signalRow: {
    paddingVertical: 14,
  },
  signalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  leftMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  directionBadge: {
    width: 20,
    height: 20,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instrumentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6E7787',
  },
  timeText: {
    fontSize: 13,
    color: '#8F9CA9',
  },
  headlineText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111624',
    lineHeight: 20,
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 13.5,
    color: '#717D8A',
    lineHeight: 18,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#F1F4F7',
    marginTop: 14,
  },
});
