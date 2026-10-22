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
import Svg, { Circle, Rect, Path, Defs, ClipPath, G, Text as SvgText } from 'react-native-svg';

export interface CalendarEventItem {
  id: string;
  title: string;
  country: string;
  countryName: string;
  flagType: string;
  impactBars: number; // 1 = Low, 2 = Medium, 3 = High
  timing: string;
  day: 'TODAY' | 'TOMORROW' | 'THIS_WEEK';
  actual?: string;
  forecast?: string;
  previous?: string;
  description?: string;
  relatedMarkets?: string[];
}

export const CALENDAR_EVENTS_DATA: CalendarEventItem[] = [
  {
    id: 'cal-hu-12m',
    title: '12-Month DTB Auction',
    country: 'HU',
    countryName: 'Hungary',
    flagType: 'HU',
    impactBars: 1,
    timing: '15:00 – In 26 minutes',
    day: 'TODAY',
    actual: 'Pending',
    forecast: '5.85%',
    previous: '5.92%',
    description: 'Government debt auction for 12-month discounted treasury bills issued by the Hungarian Debt Management Agency.',
    relatedMarkets: ['EUR/HUF', 'USD/HUF'],
  },
  {
    id: 'cal-hu-15y',
    title: '15-Year Bond Auction',
    country: 'HU',
    countryName: 'Hungary',
    flagType: 'HU',
    impactBars: 1,
    timing: '15:00 – In 26 minutes',
    day: 'TODAY',
    actual: 'Pending',
    forecast: '6.45%',
    previous: '6.50%',
    description: 'Long-term sovereign bond auction providing liquidity benchmarks for institutional fixed-income participants.',
    relatedMarkets: ['EUR/HUF'],
  },
  {
    id: 'cal-es-cc',
    title: 'Consumer Confidence',
    country: 'ES',
    countryName: 'Spain',
    flagType: 'ES',
    impactBars: 2,
    timing: '15:30 – In 56 minutes',
    day: 'TODAY',
    actual: 'Pending',
    forecast: '86.4',
    previous: '85.2',
    description: 'Survey gauging financial security, employment sentiment, and future spending propensity among Spanish consumers.',
    relatedMarkets: ['EUR/USD', 'EUR/GBP', 'DE30'],
  },
  {
    id: 'cal-uk-opt',
    title: 'CBI Business Optimism Index',
    country: 'UK',
    countryName: 'United Kingdom',
    flagType: 'UK',
    impactBars: 2,
    timing: '15:30 – In 56 minutes',
    day: 'TODAY',
    actual: 'Pending',
    forecast: '-8',
    previous: '-12',
    description: 'Confederation of British Industry quarterly sentiment survey reflecting managerial business expectations across UK manufacturers.',
    relatedMarkets: ['GBP/USD', 'EUR/GBP', 'UK100'],
  },
  {
    id: 'cal-uk-trends',
    title: 'CBI Industrial Trends Orders',
    country: 'UK',
    countryName: 'United Kingdom',
    flagType: 'UK',
    impactBars: 2,
    timing: '15:30 – In 56 minutes',
    day: 'TODAY',
    actual: 'Pending',
    forecast: '-18',
    previous: '-21',
    description: 'Tracks order book volume health relative to seasonal normals, serving as a leading gauge for UK factory output.',
    relatedMarkets: ['GBP/USD', 'GBP/JPY'],
  },
  {
    id: 'cal-uk-bailey',
    title: 'BoE Gov Bailey Speech',
    country: 'UK',
    countryName: 'United Kingdom',
    flagType: 'UK',
    impactBars: 2,
    timing: '16:20 – In 1 hour',
    day: 'TODAY',
    actual: 'Live',
    forecast: 'Neutral',
    previous: 'Hawkish',
    description: 'Bank of England Governor Andrew Bailey delivers keynote address outlining domestic inflation trajectory and policy rate considerations.',
    relatedMarkets: ['GBP/USD', 'EUR/GBP', 'GBP/JPY'],
  },
  {
    id: 'cal-tr-tcmb',
    title: 'TCMB Interest Rate Decision',
    country: 'TR',
    countryName: 'Turkey',
    flagType: 'TR',
    impactBars: 2,
    timing: '16:30 – In 1 hour',
    day: 'TODAY',
    actual: '50.00%',
    forecast: '50.00%',
    previous: '50.00%',
    description: 'Central Bank of the Republic of Turkey policy rate announcement setting standard one-week repo benchmark rates.',
    relatedMarkets: ['USD/TRY', 'EUR/TRY'],
  },
  {
    id: 'cal-ca-cfib',
    title: 'CFIB Business Barometer',
    country: 'CA',
    countryName: 'Canada',
    flagType: 'CA',
    impactBars: 1,
    timing: '16:30 – In 1 hour',
    day: 'TODAY',
    actual: 'Pending',
    forecast: '54.5',
    previous: '53.8',
    description: 'Canadian Federation of Independent Business survey monitoring small and medium enterprise expectations for hiring and capex.',
    relatedMarkets: ['USD/CAD', 'CAD/JPY'],
  },
  {
    id: 'cal-tr-lending',
    title: 'Overnight Lending Rate',
    country: 'TR',
    countryName: 'Turkey',
    flagType: 'TR',
    impactBars: 1,
    timing: '16:30 – In 1 hour',
    day: 'TODAY',
    actual: '53.00%',
    forecast: '53.00%',
    previous: '53.00%',
    description: 'Upper boundary of the Turkish Central Bank interest rate corridor for overnight emergency institutional credit.',
    relatedMarkets: ['USD/TRY'],
  },
  {
    id: 'cal-tr-borrowing',
    title: 'Overnight Borrowing Rate',
    country: 'TR',
    countryName: 'Turkey',
    flagType: 'TR',
    impactBars: 1,
    timing: '16:30 – In 1 hour',
    day: 'TODAY',
    actual: '47.00%',
    forecast: '47.00%',
    previous: '47.00%',
    description: 'Lower boundary of the interest rate corridor setting the overnight deposit facility return rate.',
    relatedMarkets: ['USD/TRY'],
  },
  {
    id: 'cal-tr-fxres',
    title: 'Foreign Exchange Reserves',
    country: 'TR',
    countryName: 'Turkey',
    flagType: 'TR',
    impactBars: 1,
    timing: '17:00 – In 2 hours',
    day: 'TODAY',
    actual: 'Pending',
    forecast: '$154.2B',
    previous: '$152.8B',
    description: 'Weekly gross foreign currency holdings and bullion held by the central bank to maintain lira external liquidity.',
    relatedMarkets: ['USD/TRY'],
  },
];

/* Helper to render accurate circular country flag SVG */
const renderCalendarFlag = (flagType: string, size = 26) => {
  switch (flagType.toUpperCase()) {
    case 'HU':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Defs>
            <ClipPath id={`clip-hu-${size}`}>
              <Circle cx="12" cy="12" r="11" />
            </ClipPath>
          </Defs>
          <G clipPath={`url(#clip-hu-${size})`}>
            <Rect x="0" y="0" width="24" height="8" fill="#CE2939" />
            <Rect x="0" y="8" width="24" height="8" fill="#FFFFFF" />
            <Rect x="0" y="16" width="24" height="8" fill="#477050" />
          </G>
          <Circle cx="12" cy="12" r="11.5" stroke="#E5E7EB" strokeWidth="0.8" fill="none" />
        </Svg>
      );

    case 'ES':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Defs>
            <ClipPath id={`clip-es-${size}`}>
              <Circle cx="12" cy="12" r="11" />
            </ClipPath>
          </Defs>
          <G clipPath={`url(#clip-es-${size})`}>
            <Rect x="0" y="0" width="24" height="6" fill="#AA151B" />
            <Rect x="0" y="6" width="24" height="12" fill="#F1BF00" />
            <Rect x="0" y="18" width="24" height="6" fill="#AA151B" />
            <Circle cx="7.5" cy="12" r="2.2" fill="#AA151B" opacity={0.7} />
          </G>
          <Circle cx="12" cy="12" r="11.5" stroke="#E5E7EB" strokeWidth="0.8" fill="none" />
        </Svg>
      );

    case 'UK':
    case 'GB':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Defs>
            <ClipPath id={`clip-uk-${size}`}>
              <Circle cx="12" cy="12" r="11" />
            </ClipPath>
          </Defs>
          <G clipPath={`url(#clip-uk-${size})`}>
            <Rect x="0" y="0" width="24" height="24" fill="#012169" />
            <Path d="M0 0 L24 24 M24 0 L0 24" stroke="#FFFFFF" strokeWidth="4" />
            <Path d="M0 0 L24 24 M24 0 L0 24" stroke="#C8102E" strokeWidth="2.2" />
            <Path d="M12 0 V24 M0 12 H24" stroke="#FFFFFF" strokeWidth="6" />
            <Path d="M12 0 V24 M0 12 H24" stroke="#C8102E" strokeWidth="3.6" />
          </G>
          <Circle cx="12" cy="12" r="11.5" stroke="#E5E7EB" strokeWidth="0.8" fill="none" />
        </Svg>
      );

    case 'TR':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="11.5" fill="#E30A17" stroke="#E5E7EB" strokeWidth="0.8" />
          <Circle cx="10.5" cy="12" r="4.8" fill="#FFFFFF" />
          <Circle cx="11.8" cy="12" r="4" fill="#E30A17" />
          <Path d="M15 12 L15.8 13.5 L14.4 12.6 L15.8 12.6 L14.4 13.5 Z" fill="#FFFFFF" />
        </Svg>
      );

    case 'CA':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Defs>
            <ClipPath id={`clip-ca-${size}`}>
              <Circle cx="12" cy="12" r="11" />
            </ClipPath>
          </Defs>
          <G clipPath={`url(#clip-ca-${size})`}>
            <Rect x="0" y="0" width="24" height="24" fill="#D80027" />
            <Rect x="6" y="0" width="12" height="24" fill="#FFFFFF" />
            <Path
              d="M12 6.5 L13.5 10 L15.5 9.5 L14.5 12 L16.5 13 L14 14 L14 16 L12 14.5 L10 16 L10 14 L7.5 13 L9.5 12 L8.5 9.5 L10.5 10 Z"
              fill="#D80027"
            />
          </G>
          <Circle cx="12" cy="12" r="11.5" stroke="#E5E7EB" strokeWidth="0.8" fill="none" />
        </Svg>
      );

    case 'US':
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Defs>
            <ClipPath id={`clip-us-${size}`}>
              <Circle cx="12" cy="12" r="11" />
            </ClipPath>
          </Defs>
          <G clipPath={`url(#clip-us-${size})`}>
            <Rect x="0" y="0" width="24" height="24" fill="#B22234" />
            <Rect x="0" y="3.7" width="24" height="3.7" fill="#FFFFFF" />
            <Rect x="0" y="11.1" width="24" height="3.7" fill="#FFFFFF" />
            <Rect x="0" y="18.5" width="24" height="3.7" fill="#FFFFFF" />
            <Rect x="0" y="0" width="11" height="13" fill="#3C3B6E" />
            <Circle cx="3.5" cy="4" r="1" fill="#FFFFFF" />
            <Circle cx="7.5" cy="4" r="1" fill="#FFFFFF" />
            <Circle cx="5.5" cy="7" r="1" fill="#FFFFFF" />
            <Circle cx="3.5" cy="10" r="1" fill="#FFFFFF" />
            <Circle cx="7.5" cy="10" r="1" fill="#FFFFFF" />
          </G>
          <Circle cx="12" cy="12" r="11.5" stroke="#E5E7EB" strokeWidth="0.8" fill="none" />
        </Svg>
      );
  }
};

interface EconomicCalendarModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectEvent?: (event: CalendarEventItem) => void;
}

export const EconomicCalendarModal: React.FC<EconomicCalendarModalProps> = ({
  visible,
  onClose,
  onSelectEvent,
}) => {
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('ALL');
  const [selectedImpactFilter, setSelectedImpactFilter] = useState<number | 'ALL'>('ALL');

  const filteredList = CALENDAR_EVENTS_DATA.filter(item => {
    if (selectedCountryFilter !== 'ALL' && item.country !== selectedCountryFilter) {
      return false;
    }
    if (selectedImpactFilter !== 'ALL' && item.impactBars !== selectedImpactFilter) {
      return false;
    }
    return true;
  });

  const handleItemClick = (item: CalendarEventItem) => {
    onClose();
    if (onSelectEvent) {
      onSelectEvent(item);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />

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
          <Text style={styles.headerTitle}>Economic Calendar</Text>
        </View>

        {/* Filter Pills (All countries | Impact) */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.filterPill,
              selectedCountryFilter !== 'ALL' && styles.filterPillActive,
            ]}
            onPress={() => {
              // Cycle through countries: ALL -> HU -> ES -> UK -> TR -> CA -> ALL
              const sequence = ['ALL', 'HU', 'ES', 'UK', 'TR', 'CA'];
              const nextIdx = (sequence.indexOf(selectedCountryFilter) + 1) % sequence.length;
              setSelectedCountryFilter(sequence[nextIdx]);
            }}
            activeOpacity={0.75}
          >
            <Ionicons name="globe-outline" size={14} color="#475569" style={{ marginRight: 6 }} />
            <Text style={styles.filterPillText}>
              {selectedCountryFilter === 'ALL' ? 'All countries' : selectedCountryFilter}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              selectedImpactFilter !== 'ALL' && styles.filterPillActive,
            ]}
            onPress={() => {
              // Toggle: ALL -> 2 (Medium/High) -> 1 (Low) -> ALL
              if (selectedImpactFilter === 'ALL') setSelectedImpactFilter(2);
              else if (selectedImpactFilter === 2) setSelectedImpactFilter(1);
              else setSelectedImpactFilter('ALL');
            }}
            activeOpacity={0.75}
          >
            {/* 3 mini vertical bars icon */}
            <View style={styles.miniBarsIcon}>
              <View style={[styles.miniBar, { height: 6 }]} />
              <View style={[styles.miniBar, { height: 9 }]} />
              <View style={[styles.miniBar, { height: 12 }]} />
            </View>
            <Text style={styles.filterPillText}>
              {selectedImpactFilter === 'ALL'
                ? 'Impact'
                : selectedImpactFilter === 2
                ? 'Medium'
                : 'Low'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Scroll Content */}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Section Heading: TODAY */}
          <Text style={styles.groupHeading}>TODAY</Text>

          {/* Events Card Container */}
          <View style={styles.eventsCard}>
            {filteredList.map((evt, idx) => (
              <React.Fragment key={evt.id}>
                <TouchableOpacity
                  style={styles.eventRow}
                  onPress={() => handleItemClick(evt)}
                  activeOpacity={0.7}
                >
                  {/* Circular Country Flag */}
                  <View style={styles.flagWrap}>{renderCalendarFlag(evt.flagType, 26)}</View>

                  {/* Event Info */}
                  <View style={styles.infoCol}>
                    <Text style={styles.eventTitle} numberOfLines={1}>
                      {evt.title}
                    </Text>

                    <View style={styles.metaRow}>
                      <Text style={styles.countryCodeText}>{evt.country}</Text>

                      {/* 3 Vertical Impact Bars */}
                      <View style={styles.impactBarsContainer}>
                        <View
                          style={[
                            styles.impactBar,
                            evt.impactBars >= 1 ? styles.barActiveYellow : styles.barInactiveGrey,
                          ]}
                        />
                        <View
                          style={[
                            styles.impactBar,
                            evt.impactBars >= 2 ? styles.barActiveYellow : styles.barInactiveGrey,
                          ]}
                        />
                        <View
                          style={[
                            styles.impactBar,
                            evt.impactBars >= 3 ? styles.barActiveYellow : styles.barInactiveGrey,
                          ]}
                        />
                      </View>

                      {/* Timing text */}
                      <Text style={styles.timingText}>{evt.timing}</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Divider */}
                {idx < filteredList.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
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
    letterSpacing: -0.3,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF2F5',
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterPillActive: {
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  miniBarsIcon: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    marginRight: 6,
    height: 12,
  },
  miniBar: {
    width: 2.2,
    backgroundColor: '#475569',
    borderRadius: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  groupHeading: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8F9CA9',
    letterSpacing: 1.1,
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
  },
  eventsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8ECF0',
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  flagWrap: {
    marginRight: 12,
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  eventTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#111624',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countryCodeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111624',
  },
  impactBarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2.5,
  },
  impactBar: {
    width: 3.5,
    height: 11,
    borderRadius: 1.5,
  },
  barActiveYellow: {
    backgroundColor: '#FFB800',
  },
  barInactiveGrey: {
    backgroundColor: '#E2E8F0',
  },
  timingText: {
    fontSize: 12.5,
    color: '#8F9CA9',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F4F7',
    marginLeft: 52,
  },
});
