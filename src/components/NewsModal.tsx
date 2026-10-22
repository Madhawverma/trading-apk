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
import Svg, { Rect, Circle, Path, G, Line } from 'react-native-svg';

export interface FullNewsItem {
  id: string;
  headline: string;
  instrument: string;
  change: string;
  isUp: boolean;
  time: string;
  source: string;
  thumbType:
    | 'gold'
    | 'ink_landscape'
    | 'oil_rig'
    | 'bauhaus'
    | 'yen_coins'
    | 'silver_ingot'
    | 'liberty_yen'
    | 'war_vessels'
    | 'maple_leaf';
  isFavorite: boolean;
  paragraphs: string[];
  takeaways: string[];
}

export const ALL_NEWS_ITEMS: FullNewsItem[] = [
  {
    id: 'news-gold-socgen',
    headline: 'Gold: Range cap signals pullback risk – Societe Generale',
    instrument: 'XAU/USD',
    change: '↓ 1.05%',
    isUp: false,
    time: '3 minutes ago',
    source: 'Societe Generale Cross Asset Research',
    thumbType: 'gold',
    isFavorite: true,
    paragraphs: [
      'Gold prices encountered firm resistance near recent all-time highs as bond yields stabilized following firmer macroeconomic releases.',
      'Societe Generale cross-asset analysts pointed out that technical momentum oscillators are pointing to a potential corrective phase toward the $2,680 - $2,700 consolidation band.',
      'While broader central bank purchases remain long-term supportive, tactical positioning indicators suggest institutional profit-taking in the immediate horizon.',
    ],
    takeaways: [
      'XAU/USD slips 1.05% as technical resistance caps upward push',
      'Immediate support watch zone between $2,680 and $2,700',
      'Societe Generale warns of tactical corrective pullback risk',
    ],
  },
  {
    id: 'news-eurcad-oil',
    headline: 'Euro weakens against Canadian Dollar amid higher crude oil prices weigh on EUR/CAD',
    instrument: 'USOIL',
    change: '↑ 1.89%',
    isUp: true,
    time: '34 minutes ago',
    source: 'FX Macro Intelligence · Energy Desk',
    thumbType: 'ink_landscape',
    isFavorite: true,
    paragraphs: [
      'EUR/CAD slipped sharply during London afternoon trade as surging global benchmark crude prices bolstered the terms of trade for energy-exporting Canada.',
      'European industrial indicators continue to face headwinds from persistent energy price volatility, widening monetary divergence expectations between the ECB and the Bank of Canada.',
      'Currency strategists project further downside pressure on the Euro cross if crude oil sustains trading above key resistance at $98.50.',
    ],
    takeaways: [
      'Surging crude oil gives Canadian Dollar strong fundamental boost',
      'EUR/CAD drops to fresh weekly lows on widening divergence',
      'ECB economic outlook burdened by elevated import costs',
    ],
  },
  {
    id: 'news-oil-mideast',
    headline: 'WTI Oil rallies above $99 as the Middle East war threatens to complicate further',
    instrument: 'USOIL',
    change: '↑ 1.89%',
    isUp: true,
    time: '45 minutes ago',
    source: 'Global Energy Alert · Commodity Desk',
    thumbType: 'oil_rig',
    isFavorite: true,
    paragraphs: [
      'West Texas Intermediate (WTI) crude surged beyond $99 per barrel on Thursday morning following heightened regional hostilities threatening crucial maritime transit lanes.',
      'Energy logistics operators report rerouting of maritime carriers around southern capes, compounding global voyage times and injecting substantial delivery premia.',
      'Market participants are bracing for potential psychological test of the $100 benchmark should supply disruption signals broaden across commercial terminals.',
    ],
    takeaways: [
      'WTI rallies to $99.20 with eyes on $100 psychological threshold',
      'Geopolitical risk premium jumps sharply across energy markets',
      'Tanker freight rates jump on shipping corridor diversions',
    ],
  },
  {
    id: 'news-eurusd-fiscal',
    headline: 'Euro gives up early gains amid higher oil prices, French fiscal risks',
    instrument: 'EUR/USD',
    change: '↑ 0.01%',
    isUp: true,
    time: '47 minutes ago',
    source: 'European Economic Wire · Frankfurt',
    thumbType: 'bauhaus',
    isFavorite: true,
    paragraphs: [
      'The single currency erased early morning advances as bond investors focused on upcoming parliamentary budget votes and expanding sovereign spread differentials.',
      'Rising energy import bills add to inflationary dilemmas for ECB policymakers, reducing expectations of aggressive policy divergence relative to the Federal Reserve.',
      'EUR/USD drifted back toward the 1.0820 support zone with options market skews reflecting persistent downside protection demand.',
    ],
    takeaways: [
      'EUR/USD gives up session advances to hover near 1.0820 baseline',
      'Fiscal uncertainty in core European economies dampens sentiment',
      'Higher energy prices restrict monetary maneuvering room for the ECB',
    ],
  },
  {
    id: 'news-jpy-pullback',
    headline: 'Japanese Yen pulls back slightly after hitting fresh monthly high vs broadly weaker USD',
    instrument: 'USD/JPY',
    change: '↓ 0.73%',
    isUp: false,
    time: '54 minutes ago',
    source: 'Tokyo Financial Review · FX Desk',
    thumbType: 'yen_coins',
    isFavorite: true,
    paragraphs: [
      'The Japanese Yen experienced mild profit-taking during European trading after touching a fresh multi-week peak against the greenback at 156.40.',
      'Speculation regarding potential Bank of Japan interest rate adjustments continues to draw institutional real-money bids on currency dips.',
      'Treasury yield fluctuations remain the dominant driver for the pair, with technical traders monitoring the 156.20 pivot for continued downside continuation.',
    ],
    takeaways: [
      'USD/JPY drops 0.73% to test major 156.40 technical support',
      'Bank of Japan rate normalization speculation underpins the Yen',
      'Bears eye potential break below 156.00 round number',
    ],
  },
  {
    id: 'news-silver-forecast',
    headline: 'Silver Price Forecast: XAG/USD breaks lower and nears YTD lows at $54.77',
    instrument: 'XAG/USD',
    change: '↓ 2.76%',
    isUp: false,
    time: '1 hour ago',
    source: 'Metals & Commodities Weekly',
    thumbType: 'silver_ingot',
    isFavorite: true,
    paragraphs: [
      'Spot silver experienced accelerated selling pressure on Thursday, shedding over 2.76% as industrial metals tracked soft manufacturing signals.',
      'XAG/USD broke below key technical support at $55.80, with bears probing order books down to the critical $54.77 annual foundation level.',
      'Precious metals analysts note that while long-term solar and electrification demand fundamentals stay intact, short-term liquidation is dominating spot flows.',
    ],
    takeaways: [
      'Silver falls 2.76% to trade near $54.77 key support pivot',
      'Industrial metal complex weakness drags precious white metal lower',
      'Key technical resistance now lowered to $56.20',
    ],
  },
  {
    id: 'news-jpy-uob',
    headline: 'Japanese Yen: Range trading with upside medium term risk against US Dollar – UOB',
    instrument: 'USD/JPY',
    change: '↓ 0.73%',
    isUp: false,
    time: '2 hours ago',
    source: 'United Overseas Bank (UOB) Research',
    thumbType: 'liberty_yen',
    isFavorite: true,
    paragraphs: [
      'Economists at United Overseas Bank noted that USD/JPY is expected to consolidate within a defined 155.50 - 158.00 range over the coming sessions.',
      'Medium-term risks continue to tilt toward a stronger Yen as US monetary easing expectations align with BOJ policy tightening.',
      'Exporters are reportedly taking advantage of dollar spikes to repatriate overseas earnings ahead of quarterly book-closings.',
    ],
    takeaways: [
      'UOB sees 155.50 – 158.00 trading corridor for USD/JPY',
      'Medium-term trend favors structural Yen recovery',
      'Corporate hedging activity observed on USD rallies',
    ],
  },
  {
    id: 'news-irgc-vessels',
    headline: "Iran's IRGC warns US of wider response, says seven vessels hit",
    instrument: 'USOIL',
    change: '↑ 1.89%',
    isUp: true,
    time: '2 hours ago',
    source: 'Middle East Energy Bureau · Global News',
    thumbType: 'war_vessels',
    isFavorite: true,
    paragraphs: [
      "Military leadership of Iran's Islamic Revolutionary Guard Corps issued a direct warning on Thursday indicating potential escalation across regional shipping corridors.",
      'Crude oil markets reacted promptly with USOIL climbing over 1.89% within early session trading, surpassing critical technical thresholds near $98.50 per barrel.',
      'Maritime intelligence agencies advise merchant carriers to implement heightened vessel self-protection protocols.',
    ],
    takeaways: [
      'USOIL rallies on heightened geopolitical supply fears',
      'Key resistance watch at $99.50 – $100.00 level',
      'Shipping route risk premia returning to global commodity pricing',
    ],
  },
  {
    id: 'news-cad-strength',
    headline: 'Canadian Dollar gathers strength on elevated oil prices',
    instrument: 'USOIL',
    change: '↑ 1.89%',
    isUp: true,
    time: '2 hours ago',
    source: 'Commodity Currency Insights',
    thumbType: 'maple_leaf',
    isFavorite: true,
    paragraphs: [
      'The Canadian Dollar showed resilience against the greenback on Thursday, buoyed by the sharp resurgence in global crude benchmark prices.',
      'USD/CAD drifted lower toward the 1.3820 handle as energy trade balances improved.',
      'Bank of Canada officials have indicated policy decisions will remain strictly meeting-by-meeting.',
    ],
    takeaways: [
      'Oil price resurgence provides immediate tailwind for Canadian Dollar',
      'USD/CAD testing support at 1.3820',
      'Energy export gains counteracting domestic consumer softness',
    ],
  },
  {
    id: 'news-aud-commerzbank',
    headline: 'Australian Dollar: RBA expectations support Aussie against US Dollar – Commerzbank',
    instrument: 'AUD/USD',
    change: '↓ 0.16%',
    isUp: false,
    time: '3 hours ago',
    source: 'Commerzbank Research · FX Daily',
    thumbType: 'bauhaus',
    isFavorite: false,
    paragraphs: [
      'The Reserve Bank of Australia continues to signal reluctance toward early monetary easing, citing resilient service sector inflation.',
      'Commerzbank analysts highlighted that the Aussie dollar maintains comparatively stronger relative carry advantage against European cross pairs.',
    ],
    takeaways: [
      'RBA hawkish bias limits Australian Dollar downside',
      'AUD/USD key support established around 0.6550 handle',
    ],
  },
  {
    id: 'news-fed-pause',
    headline: 'Federal Reserve signals potential rate pause as labour market metrics stabilize',
    instrument: 'USD/JPY',
    change: '↓ 0.45%',
    isUp: false,
    time: '4 hours ago',
    source: 'Federal Reserve Watch',
    thumbType: 'liberty_yen',
    isFavorite: false,
    paragraphs: [
      'FOMC voting members expressed satisfaction with the gradual cooling in wage pressure and core inflation trajectory.',
      'Fixed income futures are pricing in an extended plateau before any further monetary policy recalibrations.',
    ],
    takeaways: [
      'Fed rate pause likelihood increases on balanced labor data',
      'US Dollar index consolidates near key technical baselines',
    ],
  },
];

/* Helper to render 1:1 artistic SVG thumbnail illustrations */
const renderArtisticNewsThumb = (type: FullNewsItem['thumbType']) => {
  const size = 62;

  switch (type) {
    case 'gold':
      // Gold bars with warm orange circle
      return (
        <Svg width={size} height={size} viewBox="0 0 62 62">
          <Rect width={size} height={size} fill="#F6EFE6" rx="6" />
          <Circle cx="48" cy="14" r="8" fill="#F39C12" />
          {/* Stack of gold bars */}
          <Path d="M12 40 L28 28 L46 32 L30 46 Z" fill="#D4AF37" stroke="#9A7B1C" strokeWidth="1" />
          <Path d="M8 48 L22 36 L36 40 L22 52 Z" fill="#E6C85C" stroke="#9A7B1C" strokeWidth="1" />
          <Path d="M22 52 L36 40 L44 48 L30 58 Z" fill="#B8860B" stroke="#7A5B0B" strokeWidth="1" />
          {/* Shading rocks */}
          <Path d="M6 56 Q 16 50 26 56 L 24 60 L 6 60 Z" fill="#4A453F" />
        </Svg>
      );

    case 'ink_landscape':
      // Abstract mountains with orange circle and ink splashes
      return (
        <Svg width={size} height={size} viewBox="0 0 62 62">
          <Rect width={size} height={size} fill="#F4EDE2" rx="6" />
          <Circle cx="46" cy="18" r="8" fill="#E67E22" />
          {/* Black mountain silhouette */}
          <Path d="M4 48 L18 26 L28 38 L38 20 L58 48 Z" fill="#2C2B29" />
          <Path d="M8 20 L16 32 M12 18 L20 30 M16 16 L24 28" stroke="#2C2B29" strokeWidth="2.5" />
          <Path d="M0 52 Q 31 46 62 52 L 62 62 L 0 62 Z" fill="#2C2B29" />
        </Svg>
      );

    case 'oil_rig':
      // Oil pumpjack derrick with orange explosion/splash
      return (
        <Svg width={size} height={size} viewBox="0 0 62 62">
          <Rect width={size} height={size} fill="#F6F1E6" rx="6" />
          {/* Orange ink explosion on right */}
          <Circle cx="48" cy="30" r="11" fill="#E67E22" opacity={0.85} />
          {/* Oil pump derrick silhouette */}
          <Path d="M8 46 L18 20 L28 46 Z" fill="none" stroke="#2B2724" strokeWidth="2" />
          <Line x1="12" y1="36" x2="24" y2="36" stroke="#2B2724" strokeWidth="1.5" />
          <Line x1="8" y1="24" x2="32" y2="18" stroke="#2B2724" strokeWidth="3" />
          <Circle cx="20" cy="20" r="2.5" fill="#2B2724" />
          {/* Counterweight and base */}
          <Rect x="26" y="24" width="8" height="6" fill="#2B2724" />
          <Path d="M4 48 H58 V62 H4 Z" fill="#D3C9BC" />
        </Svg>
      );

    case 'bauhaus':
      // Minimal geometric squares with orange circle
      return (
        <Svg width={size} height={size} viewBox="0 0 62 62">
          <Rect width={size} height={size} fill="#F7F1E8" rx="6" />
          <Circle cx="46" cy="28" r="10" fill="#E67E22" />
          <Rect x="8" y="22" width="22" height="2" fill="#2E2C29" />
          <Rect x="16" y="32" width="12" height="12" fill="#D35400" rx="1" />
          <Line x1="36" y1="12" x2="36" y2="48" stroke="#2E2C29" strokeWidth="1.5" />
        </Svg>
      );

    case 'yen_coins':
      // Yen coin, dollar banknote and building with red sun
      return (
        <Svg width={size} height={size} viewBox="0 0 62 62">
          <Rect width={size} height={size} fill="#F4ECE1" rx="6" />
          <Circle cx="16" cy="20" r="10" fill="#D32F2F" />
          {/* Classical building columns */}
          <Rect x="26" y="16" width="30" height="22" fill="#95A5A6" stroke="#2C3E50" strokeWidth="1" />
          <Line x1="30" y1="20" x2="30" y2="34" stroke="#FFFFFF" strokeWidth="2" />
          <Line x1="36" y1="20" x2="36" y2="34" stroke="#FFFFFF" strokeWidth="2" />
          <Line x1="42" y1="20" x2="42" y2="34" stroke="#FFFFFF" strokeWidth="2" />
          <Line x1="48" y1="20" x2="48" y2="34" stroke="#FFFFFF" strokeWidth="2" />
          {/* Coin */}
          <Circle cx="18" cy="40" r="10" fill="#BDC3C7" stroke="#7F8C8D" strokeWidth="1.5" />
          {/* Banknote */}
          <Rect x="18" y="44" width="36" height="16" rx="1" fill="#D7CCC8" stroke="#5D4037" strokeWidth="1" />
        </Svg>
      );

    case 'silver_ingot':
      // Silver ingot bar with chart line background and orange circle
      return (
        <Svg width={size} height={size} viewBox="0 0 62 62">
          <Rect width={size} height={size} fill="#F5EFE6" rx="6" />
          <Circle cx="48" cy="18" r="8" fill="#E67E22" />
          <Path d="M28 20 L36 16 L44 24 L52 14" stroke="#BDC3C7" strokeWidth="1.5" fill="none" />
          {/* Silver Bar */}
          <Path d="M8 40 L26 26 L48 30 L28 48 Z" fill="#CFD8DC" stroke="#78909C" strokeWidth="1" />
          <Path d="M8 40 L28 48 L26 56 L6 48 Z" fill="#90A4AE" stroke="#546E7A" strokeWidth="1" />
          <Path d="M28 48 L48 30 L52 38 L32 56 Z" fill="#B0BEC5" stroke="#78909C" strokeWidth="1" />
        </Svg>
      );

    case 'liberty_yen':
      // Statue sketch with Yen coins and orange sun
      return (
        <Svg width={size} height={size} viewBox="0 0 62 62">
          <Rect width={size} height={size} fill="#F6F0E7" rx="6" />
          <Circle cx="48" cy="20" r="9" fill="#E67E22" />
          {/* Statue silhouette */}
          <Path d="M12 48 L14 26 L18 20 L20 26 L22 48 Z" fill="#455A64" />
          <Line x1="20" y1="20" x2="24" y2="10" stroke="#455A64" strokeWidth="2" />
          {/* Coins */}
          <Circle cx="30" cy="42" r="7" fill="#E0E0E0" stroke="#9E9E9E" strokeWidth="1.2" />
          <Circle cx="42" cy="44" r="8" fill="#EEEEEE" stroke="#BDBDBD" strokeWidth="1.2" />
        </Svg>
      );

    case 'war_vessels':
      // Dark war landscape and smoke
      return (
        <Svg width={size} height={size} viewBox="0 0 62 62">
          <Rect width={size} height={size} fill="#F4ECE1" rx="6" />
          <Circle cx="16" cy="18" r="8" fill="#F39C12" />
          <Path d="M6 34 Q 18 24 30 36 T 54 32 L 58 48 L 4 48 Z" fill="#2C2A29" />
          <Path d="M20 26 L24 16 L28 26 Z" fill="#2C2A29" />
          <Path d="M0 46 Q 31 42 62 46 L 62 62 L 0 62 Z" fill="#1C1B1A" />
        </Svg>
      );

    case 'maple_leaf':
    default:
      // Canadian maple leaf with orange circle
      return (
        <Svg width={size} height={size} viewBox="0 0 62 62">
          <Rect width={size} height={size} fill="#F7F1E8" rx="6" />
          <Circle cx="16" cy="20" r="9" fill="#E67E22" />
          {/* Maple Leaf */}
          <Path
            d="M 44 18 L 42 26 L 50 28 L 40 34 L 42 44 L 34 38 L 32 46 L 30 38 L 24 42 L 26 34 L 20 30 L 28 28 Z"
            fill="#2C2A29"
          />
        </Svg>
      );
  }
};

interface NewsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectNews: (news: FullNewsItem) => void;
}

export const NewsModal: React.FC<NewsModalProps> = ({
  visible,
  onClose,
  onSelectNews,
}) => {
  const [activeTab, setActiveTab] = useState<'Favorites' | 'All'>('Favorites');

  const displayedNews =
    activeTab === 'Favorites'
      ? ALL_NEWS_ITEMS.filter(item => item.isFavorite)
      : ALL_NEWS_ITEMS;

  const handleNewsClick = (item: FullNewsItem) => {
    onClose();
    onSelectNews(item);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={26} color="#111624" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>News</Text>
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

        {/* News List */}
        <ScrollView
          style={styles.listContainer}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {displayedNews.map((news, idx) => (
            <TouchableOpacity
              key={news.id}
              style={styles.newsRow}
              onPress={() => handleNewsClick(news)}
              activeOpacity={0.7}
            >
              <View style={styles.thumbWrapper}>{renderArtisticNewsThumb(news.thumbType)}</View>

              <View style={styles.textCol}>
                <Text style={styles.headline} numberOfLines={2}>
                  {news.headline}
                </Text>

                <View style={styles.metaRow}>
                  <Text style={styles.instrumentText}>{news.instrument}</Text>
                  <Text
                    style={[
                      styles.changeText,
                      { color: news.isUp ? '#1665D8' : '#EA3943' },
                    ]}
                  >
                    {news.change}
                  </Text>
                  <Text style={styles.timeText}>{news.time}</Text>
                </View>
              </View>

              {idx < displayedNews.length - 1 && <View style={styles.rowDivider} />}
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
  newsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    position: 'relative',
  },
  thumbWrapper: {
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  textCol: {
    flex: 1,
    justifyContent: 'center',
  },
  headline: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#111624',
    lineHeight: 19.5,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  instrumentText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#6E7787',
  },
  changeText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 12.5,
    color: '#8F9CA9',
  },
  rowDivider: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#F1F4F7',
  },
});
